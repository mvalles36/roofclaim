import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager } from '@react-google-maps/api';

const libraries = ['places', 'drawing'];

const FindLeads = () => {
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [listName, setListName] = useState('');
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

  const onPolygonComplete = useCallback((polygon) => {
    if (selectedArea) {
      selectedArea.setMap(null);
    }
    setSelectedArea(polygon);
    drawingManagerRef.current.setDrawingMode(null);
  }, [selectedArea]);

  const handleAddressSearch = () => {
    if (!address.trim() || !mapRef.current) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK') {
        mapRef.current.setCenter(results[0].geometry.location);
        mapRef.current.setZoom(15);
      } else {
        alert('Geocode was not successful: ' + status);
      }
    });
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

      setLeads(response.data.Records || []);
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
        .insert(leads.map(lead => ({
          name: lead.AddressLine1,
          address: `${lead.AddressLine1}, ${lead.City}, ${lead.State} ${lead.PostalCode}`,
          telephone: lead.TelephoneNumber,
          email: lead.EmailAddress,
          income: lead.Income,
          coordinates: JSON.stringify({ lat: lead.Latitude, lng: lead.Longitude }),
          list_name: listName
        })));

      if (error) throw error;

      alert('List saved successfully!');
      setLeads([]);
      setListName('');
      setAddress('');
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
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter an address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button onClick={handleAddressSearch}>Search</Button>
          </div>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={{ lat: 40.7128, lng: -74.0060 }}
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
                  drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
                },
              }}
            />
          </GoogleMap>
          <Button className="mt-4" onClick={handleFindLeads}>Find Leads in Selected Area</Button>
        </CardContent>
      </Card>
      {leads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Save Leads List</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              placeholder="Enter a name for the list"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleSaveList}>Save List</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FindLeads;