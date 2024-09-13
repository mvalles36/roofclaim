import React, { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager, Autocomplete } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];

const mapContainerStyle = {
  width: '100%',
  height: '80vh'
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
  const mapRef = useRef();
  const autocompleteRef = useRef();

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
    <div className="h-full w-full relative p-4">
      <div className="mb-4">
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <Input 
            type="text" 
            placeholder="Enter an address" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            className="w-full"
          />
        </Autocomplete>
      </div>
      <div className="relative" style={{ height: '80vh' }}>
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
      <Button 
        className="mt-4" 
        onClick={handleFindLeads}
      >
        Find Leads in Selected Area
      </Button>

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