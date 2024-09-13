import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager, Autocomplete } from '@react-google-maps/api';
import { motion } from 'framer-motion';

const libraries = ['places', 'drawing'];

const FindLeads = () => {
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [listName, setListName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 32.7555, lng: -97.3308 });
  const [mapZoom, setMapZoom] = useState(12);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
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

  const onRectangleComplete = useCallback((rectangle) => {
    if (selectedArea) {
      selectedArea.setMap(null);
    }
    setSelectedArea(rectangle);
    drawingManagerRef.current.setDrawingMode(null);
  }, [selectedArea]);

  const onAutocompleteLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handlePlaceSelect = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const newCenter = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setMapCenter(newCenter);
        mapRef.current?.panTo(newCenter);
        setMapZoom(18);
        setAddress(place.formatted_address);
      }
    }
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

  const instructionSteps = [
    { title: "Welcome to Find Leads!", content: "This tool helps you find leads in a specific area. Let's walk through how to use it." },
    { title: "Step 1: Choose an Area", content: "First, navigate to the area you're interested in. You can use the search bar to find a specific address." },
    { title: "Step 2: Draw a Rectangle", content: "Click and drag on the map to draw a rectangle around the area you want to search." },
    { title: "Step 3: Find Leads", content: "Click the 'Find Leads in Selected Area' button to search for leads within your selected area." },
    { title: "You're All Set!", content: "You now know how to use the Find Leads tool. Click 'Get Started' to begin your search." }
  ];

  const handleNextStep = () => {
    if (currentStep < instructionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowInstructions(false);
    }
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
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
            <Autocomplete onLoad={onAutocompleteLoad} onPlaceChanged={handlePlaceSelect}>
              <Input type="text" placeholder="Enter an address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </Autocomplete>
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
          <Button className="mt-4" onClick={handleFindLeads}>Find Leads in Selected Area</Button>
        </CardContent>
      </Card>

      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{instructionSteps[currentStep].title}</DialogTitle>
          </DialogHeader>
          <p>{instructionSteps[currentStep].content}</p>
          <DialogFooter>
            <Button onClick={handleCloseInstructions}>Skip</Button>
            <Button onClick={handleNextStep}>
              {currentStep === instructionSteps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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