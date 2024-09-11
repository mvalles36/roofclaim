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
  const [leads, setLeads] = useState([]);
  const [showSaveListPrompt, setShowSaveListPrompt] = useState(false);
  const [listName, setListName] = useState('');
  const mapRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initializeMap();
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VITE_APP_GOOGLE_MAPS_API_KEY}&libraries=drawing,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
        initializeAutocomplete();
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps script.');
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  const initializeMap = () => {
    if (map) return;

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

  const initializeAutocomplete = () => {
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setAddress(place.formatted_address);
        map.setCenter(place.geometry.location);
        map.setZoom(15);
      }
    });
  };

  const handleAddressSearch = () => {
    if (!address.trim()) {
      alert('Please enter an address.');
      return;
    }

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

    // Compute the centroid of the polygon
    const centroid = coordinates.reduce((acc, coord) => {
      acc.lat += coord.lat;
      acc.lng += coord.lng;
      return acc;
    }, { lat: 0, lng: 0 });

    centroid.lat /= coordinates.length;
    centroid.lng /= coordinates.length;

    try {
      const response = await axios.get('https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup', {
        params: {
          id: process.env.VITE_APP_MELISSA_DATA_API_KEY,
          lat: centroid.lat, // Use the centroid as a representative point
          long: centroid.lng,
          dist: "1",
          recs: "20",
          opt: "IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off",
          format: "json"
        }
      });

      const fetchedLeads = response.data.Records;
      setLeads(fetchedLeads);
      setShowSaveListPrompt(true);
    } catch (error) {
      console.error('Error finding leads:', error);
      alert('An error occurred while finding leads. Please try again.');
    }
  };

  const handleSaveList = async () => {
    if (!listName.trim()) {
      alert('Please enter a name for the list.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert(leads.map(lead => ({
          name: lead.AddressLine1,
          address: `${lead.AddressLine1}, ${lead.City}, ${lead.State} ${lead.PostalCode}`,
          telephone: lead.TelephoneNumber, // Assuming the API provides this field
          email: lead.EmailAddress, // Assuming the API provides this field
          income: lead.Income, // Assuming the API provides this field
          coordinates: JSON.stringify({ lat: lead.Latitude, lng: lead.Longitude }),
          list_name: listName // Store the list name for reference
        })));

      if (error) throw error;

      alert('List saved successfully!');
      setShowSaveListPrompt(false);
      setLeads([]);
      setListName('');
      setAddress('');
      setSelectedArea(null);
    } catch (error) {
      console.error('Error saving list:', error);
      alert('An error occurred while saving the list. Please try again.');
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
              ref={inputRef}
            />
            <Button onClick={handleAddressSearch}>Search</Button>
          </div>
          <div ref={mapRef} style={{ width: '100%', height: '400px' }}></div>
          <Button className="mt-4" onClick={handleFindLeads}>Find Leads in Selected Area</Button>
        </CardContent>
      </Card>
      {showSaveListPrompt && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h2 className="text-xl font-bold">Save Leads List</h2>
          <Input
            type="text"
            placeholder="Enter a name for the list"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
          <Button className="mt-2" onClick={handleSaveList}>Save List</Button>
          <Button className="mt-2 ml-2" onClick={() => setShowSaveListPrompt(false)}>Cancel</Button>
        </div>
      )}
    </div>
  );
};

export default FindLeads;
