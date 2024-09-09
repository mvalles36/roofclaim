import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';

const FindLeads = () => {
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    const mapOptions = {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 12,
    };
    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    const drawingManagerOptions = {
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
      },
    };
    const newDrawingManager = new window.google.maps.drawing.DrawingManager(drawingManagerOptions);
    newDrawingManager.setMap(newMap);
    setDrawingManager(newDrawingManager);

    window.google.maps.event.addListener(newDrawingManager, 'overlaycomplete', (event) => {
      if (selectedArea) {
        selectedArea.setMap(null);
      }
      setSelectedArea(event.overlay);
      newDrawingManager.setDrawingMode(null);
    });
  };

  const handleAddressSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
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

    try {
      const response = await axios.post('https://property.melissadata.net/v4/WEB/LookupProperty/', {
        id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
        format: 'json',
        geometry: JSON.stringify(coordinates)
      });

      const leads = response.data.Records;

      // Save leads to Supabase
      const { data, error } = await supabase
        .from('leads')
        .insert(leads.map(lead => ({
          name: lead.AddressLine1,
          address: `${lead.AddressLine1}, ${lead.City}, ${lead.State} ${lead.PostalCode}`,
          coordinates: JSON.stringify({ lat: lead.Latitude, lng: lead.Longitude })
        })));

      if (error) throw error;
      console.log('Leads added to database:', data);

      alert(`${leads.length} leads have been found and added to the database!`);
    } catch (error) {
      console.error('Error finding leads:', error);
      alert('An error occurred while finding leads. Please try again.');
    }
  };

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
          <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
          <Button className="mt-4" onClick={handleFindLeads}>Find Leads in Selected Area</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FindLeads;