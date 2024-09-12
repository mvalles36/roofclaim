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
  const [zoom, setZoom] = useState(12);
  const [showInstructions, setShowInstructions] = useState(true);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Load Google Maps API asynchronously
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
        setZoom(15);  // Adjust zoom level
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

    // Calculate the bounding box
    const bounds = new google.maps.LatLngBounds();
    coordinates.forEach(coord => bounds.extend(coord));
    
    const center = bounds.getCenter();
    const radius = bounds.toJSON().northEast.lat - bounds.toJSON().southWest.lat; // Approximate radius

    try {
      const response = await axios.get('https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup', {
        params: {
          id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
          lat: center.lat(),
          long: center.lng(),
          dist: radius, // Adjust distance based on the bounding box
          recs: "20",
          opt: "IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off",
          format: "json"
        }
      });

      const processedLeads = response.data.Records.filter(record => {
        const recordLatLng = new google.maps.LatLng(record.Latitude, record.Longitude);
        return bounds.contains(recordLatLng); // Ensure record is within the polygon bounds
      }).map(record => ({
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

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    localStorage.setItem('hideInstructions', 'true');
  };

  useEffect(() => {
    if (localStorage.getItem('hideInstructions') === 'true') {
      setShowInstructions(false);
    }
  }, []);

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
            zoom={zoom}
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

      {showInstructions && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded shadow-lg">
          <h2 className="text-lg font-bold">Instructions</h2>
          <p>
            Draw a polygon on the map to select an area. 
            To do this, click on the map to create vertices of the polygon. 
            Once you have selected the area, click on "Find Leads in Selected Area".
          </p>
          <Button className="mt-2" onClick={handleCloseInstructions}>Got It! Don't Show Again</Button>
        </div>
      )}
    </div>
  );
};

export default FindLeads;
