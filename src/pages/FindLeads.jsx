import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager, Marker } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];

const FindLeads = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 32.7555, lng: -97.3308 });
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const searchBoxRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    initSearchBox();
  }, []);

  const initSearchBox = () => {
    if (!searchBoxRef.current) return;
    const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
    mapRef.current.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      mapRef.current.fitBounds(bounds);
    });
  };

  const onDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);

  const onRectangleComplete = useCallback((rectangle) => {
    if (selectedArea) {
      selectedArea.setMap(null);
    }
    setSelectedArea(rectangle);
    drawingManagerRef.current.setDrawingMode(null);
  }, [selectedArea]);

  const calculateCenterAndRadius = (sw, ne) => {
    const centerLat = (sw.lat() + ne.lat()) / 2;
    const centerLng = (sw.lng() + ne.lng()) / 2;

    const swLatLng = new window.google.maps.LatLng(sw.lat(), sw.lng());
    const centerLatLng = new window.google.maps.LatLng(centerLat, centerLng);

    const radius = window.google.maps.geometry.spherical.computeDistanceBetween(centerLatLng, swLatLng) / 1609.34;

    return {
      center: { lat: centerLat, lng: centerLng },
      radius,
    };
  };

  const handleFindLeads = useCallback(async () => {
    if (!selectedArea) {
      alert('Please draw a rectangle on the map first.');
      return;
    }

    const bounds = selectedArea.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const { center, radius } = calculateCenterAndRadius(sw, ne);

    try {
      const response = await axios.get('https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup', {
        params: {
          id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
          format: "json",
          recs: "20",
          opt: "IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off",
          lat: center.lat,
          lon: center.lng,
          MaxDistance: radius,
        },
      });

      const processedLeads = response.data.Records
        .filter((record) => {
          const latLng = new window.google.maps.LatLng(record.Latitude, record.Longitude);
          return bounds.contains(latLng);
        })
        .map((record) => ({
          name: record.AddressLine1,
          address: `${record.AddressLine1}, ${record.City}, ${record.State} ${record.PostalCode}`,
          telephone: record.TelephoneNumber,
          email: record.EmailAddress,
          income: record.Income,
          coordinates: JSON.stringify({ lat: record.Latitude, lng: record.Longitude }),
          mak: record.MAK,
          user_id: supabase.auth.user().id,
        }));

      setLeads(processedLeads);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching leads:', error);
      alert('An error occurred while fetching leads. Please try again.');
    }
  }, [selectedArea]);

  const handleSaveLeads = async () => {
    try {
      const { data, error } = await supabase.from('leads').insert(leads);
      if (error) throw error;
      alert('Leads saved successfully!');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving leads:', error);
      alert('An error occurred while saving leads. Please try again.');
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Leads</h1>
      <Card>
        <CardHeader>
          <CardTitle>Draw Area on Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              ref={searchBoxRef}
              type="text"
              placeholder="Search for an address"
              className="w-full"
            />
          </div>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={mapCenter}
            zoom={mapZoom}
            onLoad={onMapLoad}
          >
            <DrawingManager
              onLoad={onDrawingManagerLoad}
              onRectangleComplete={onRectangleComplete}
              options={{
                drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
                drawingControl: true,
                drawingControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [window.google.maps.drawing.OverlayType.RECTANGLE],
                },
              }}
            />
          </GoogleMap>
          <Button onClick={handleFindLeads} className="mt-4">Find Leads</Button>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Found Leads</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {leads.map((lead, index) => (
              <div key={index} className="mb-2">
                <p><strong>Name:</strong> {lead.name}</p>
                <p><strong>Address:</strong> {lead.address}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveLeads}>Save Leads</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindLeads;
