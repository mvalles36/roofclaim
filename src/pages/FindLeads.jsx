import React, { useState, useCallback } from 'react';
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
  const [mapCenter, setMapCenter] = useState({ lat: 32.7555, lng: -97.3308 });
  const [mapZoom, setMapZoom] = useState(12);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    // Map loaded callback
  }, []);

  const onDrawingManagerLoad = useCallback((drawingManager) => {
    // Drawing manager loaded callback
  }, []);

  const onRectangleComplete = useCallback((rectangle) => {
    if (selectedArea) {
      selectedArea.setMap(null);
    }
    setSelectedArea(rectangle);
  }, [selectedArea]);

  const handlePlaceSelect = useCallback(() => {
    // Handle place selection
  }, []);

  const handleFindLeads = useCallback(async () => {
    if (!selectedArea) {
      alert('Please draw a rectangle on the map first.');
      return;
    }

    const bounds = selectedArea.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    try {
      const response = await axios.get('https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup', {
        params: {
          id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
          format: "json",
          recs: "20",
          opt: "IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off",
          bbox: `${sw.lat()},${sw.lng()},${ne.lat()},${ne.lng()}`
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
        }));

      setLeads(processedLeads);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error finding leads:', error);
      alert('An error occurred while finding leads. Please try again.');
    }
  }, [selectedArea]);

  const handleSaveList = useCallback(async () => {
    if (!listName || leads.length === 0) {
      alert('Please provide a list name and ensure there are leads to save.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('lead_lists')
        .insert([
          { 
            name: listName, 
            leads: leads,
            area: JSON.stringify(selectedArea.getBounds().toJSON())
          }
        ]);

      if (error) throw error;

      alert('Lead list saved successfully!');
      setIsDialogOpen(false);
      setListName('');
    } catch (error) {
      console.error('Error saving lead list:', error);
      alert('An error occurred while saving the lead list. Please try again.');
    }
  }, [listName, leads, selectedArea]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <div className="h-screen flex flex-col">
      <h1 className="text-3xl font-bold p-4">Find Leads</h1>
      <div className="flex-grow relative">
        <div className="absolute inset-0">
          <Autocomplete onLoad={handlePlaceSelect} onPlaceChanged={handlePlaceSelect}>
            <Input 
              type="text" 
              placeholder="Enter an address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              className="absolute top-4 left-4 z-10 w-64"
            />
          </Autocomplete>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
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
          <Button 
            className="absolute bottom-4 right-4 z-10" 
            onClick={handleFindLeads}
          >
            Find Leads in Selected Area
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Lead List</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <p>Found {leads.length} leads</p>
          <DialogFooter>
            <Button onClick={handleSaveList}>Save List</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindLeads;