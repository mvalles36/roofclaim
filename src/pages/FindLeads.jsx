import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import { useLoadScript, GoogleMap, DrawingManager, Autocomplete } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 32.7555,
  lng: -97.3308
};

const FindLeads = () => {
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [listName, setListName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onAutocompleteLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        mapRef.current.panTo(place.geometry.location);
        mapRef.current.setZoom(18);
      }
    }
  }, []);

  const onRectangleComplete = useCallback((rectangle) => {
    if (selectedArea) {
      selectedArea.setMap(null);
    }
    setSelectedArea(rectangle);
  }, [selectedArea]);

  const handleFindLeads = useCallback(async () => {
    if (!selectedArea) {
      alert('Please draw a rectangle on the map first.');
      return;
    }

    const bounds = selectedArea.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    try {
      const { data, error } = await supabase.rpc('find_leads_in_area', {
        ne_lat: ne.lat(),
        ne_lng: ne.lng(),
        sw_lat: sw.lat(),
        sw_lng: sw.lng()
      });

      if (error) throw error;

      setLeads(data);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error finding leads:', error);
      alert('An error occurred while finding leads. Please try again.');
    }
  }, [selectedArea]);

  const handleSaveList = useCallback(async () => {
    if (!listName || leads.length === 0 || !selectedArea) {
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
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Find Leads</h1>
      <div className="flex items-center space-x-2">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <Input 
            type="text" 
            placeholder="Enter an address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            className="flex-grow"
          />
        </Autocomplete>
        <Button onClick={() => {
          if (mapRef.current) {
            mapRef.current.setZoom(18);
          }
        }}>
          Search
        </Button>
      </div>
      <div className="border rounded">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onMapLoad}
        >
          <DrawingManager
            onRectangleComplete={onRectangleComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [google.maps.drawing.OverlayType.RECTANGLE],
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
      <Button onClick={handleFindLeads}>Find Leads in Selected Area</Button>

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
