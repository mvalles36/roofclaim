import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager, Autocomplete } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];

const FindLeads = () => {
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [listName, setListName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const autocompleteRef = useRef(null);

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

  const onPolygonComplete = useCallback((polygon) => {
    if (selectedArea) {
      selectedArea.setMap(null);
    }
    setSelectedArea(polygon);
    drawingManagerRef.current.setDrawingMode(null);
  }, [selectedArea]);

  const onAutocompleteLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setMapCenter(newCenter);
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(15);
        setAddress(place.formatted_address);
      }
    }
  };

  const handleFindLeads = async () => {
    if (!selectedArea) {
      alert('Please draw an area on the map first.');
      return;
    }

    const path = selectedArea.getPath();
    const coordinates = path.getArray().map(coord => ({
      lat: coord.lat(),
      lng: coord.lng()
    }));

    const centroid = coordinates.reduce((acc, coord) => ({
      lat: acc.lat + coord.lat / coordinates.length,
      lng: acc.lng + coord.lng / coordinates.length
    }), { lat: 0, lng: 0 });

    try {
      const response = await axios.get('https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup', {
        params: {
          id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
          lat: centroid.lat,
          long: centroid.lng,
          dist: "1",
          recs: "20",
          opt: "IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off",
          format: "json"
        }
      });

      console.log('Melissa Data API response:', response.data); // Debugging: log the API response

      const processedLeads = response.data.Records.map(record => ({
        name: record.AddressLine1,
        address: `${record.AddressLine1}, ${record.City}, ${record.State} ${record.PostalCode}`,
        telephone: record.TelephoneNumber,
        email: record.EmailAddress,
        income: record.Income,
        coordinates: JSON.stringify({ lat: record.Latitude, lng: record.Longitude }),
      }));

      setLeads(processedLeads);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error finding leads:', error);
      alert('An error occurred while finding leads. Please try again.');
    }
  };

  const handleSaveList = async () => {
    if (!listName.trim() || leads.length === 0) {
      alert('Please enter a list name and ensure leads are found.');
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .insert(leads.map(lead => ({ ...lead, list_name: listName })));

      if (error) throw error;

      alert('List saved successfully!');
      setLeads([]);
      setListName('');
      setAddress('');
      setIsDialogOpen(false);
      if (selectedArea) {
        selectedArea.setMap(null);
        setSelectedArea(null);
      }
    } catch (error) {
      console.error('Error saving list:', error);
      alert('An error occurred while saving the list. Please try again.');
    }
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
          <div className="mb-4">
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={handlePlaceSelect}
            >
              <Input
                type="text"
                placeholder="Enter an address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Autocomplete>
          </div>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={mapCenter}
            zoom={12}
            onLoad={onMapLoad}
          >
            <DrawingManager
              onLoad={onDrawingManagerLoad}
              onPolygonComplete={onPolygonComplete}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: ['polygon'], // Ensure 'polygon' is used correctly
                },
                polygonOptions: {
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
          <Button className="mt-4" onClick={handleFindLeads}>Find Leads in Selected Area</Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Leads List</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Enter a name for the list"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            className="mb-4"
          />
          <p>Number of leads found: {leads.length}</p>
          <DialogFooter>
            <Button onClick={handleSaveList}>Save List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindLeads;
