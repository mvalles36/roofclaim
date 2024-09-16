import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];

const FindLeads = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 32.7555, lng: -97.3308 }); // Fort Worth, Texas
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

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
          MaxDistance: radius
        }
      });

      const processedLeads = response.data.Records
        .filter(record => {
          const latLng = new window.google.maps.LatLng(record.Latitude, record.Longitude);
          return bounds.contains(latLng);
        })
        .map(record => ({
          name: record.AddressLine1,
          address: `${record.AddressLine1}, ${record.City}, ${record.State} ${record.PostalCode}`,
          telephone: record.TelephoneNumber,
          email: record.EmailAddress,
          income: record.Income,
          coordinates: JSON.stringify({ lat: record.Latitude, lng: record.Longitude }),
          mak: record.MAK,
          user_id: supabase.auth.user().id,  // Capture the current user's ID
        }));

      // Save leads directly to Supabase with user ID
      const { error } = await supabase
        .from('leads')
        .insert(processedLeads);

      if (error) throw error;

      setLeads(processedLeads); // Set leads in state to show the count in the dialog
      setIsDialogOpen(true); // Open dialog to show the count of leads
    } catch (error) {
      console.error('Error finding leads:', error);
      alert('An error occurred while finding leads. Please try again.');
    }
  }, [selectedArea]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setLeads([]); // Reset leads after closing the dialog
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Leads</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: '400px', width: '100%' }}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={onMapLoad}
            >
              <DrawingManager
                onLoad={onDrawingManagerLoad}
                onRectangleComplete={onRectangleComplete}
                options={{
                  drawingControl: true,
                  drawingControlOptions: {
                    position: window.google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [window.google.maps.drawing.OverlayType.RECTANGLE],
                  },
                  rectangleOptions: {
                    fillColor: '#FF0000',
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                    clickable: false,
                    editable: true,
                    zIndex: 1,
                  },
                }}
              />
            </GoogleMap>
          </div>
          <Button className="mt-4" onClick={handleFindLeads}>Find Leads in Selected Area</Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leads Found</DialogTitle>
          </DialogHeader>
          <div>
            <p>{leads.length} leads were found and saved to your database.</p>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDialog}>Dismiss</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindLeads;
