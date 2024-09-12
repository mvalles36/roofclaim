import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager, Autocomplete } from '@react-google-maps/api';
import { Modal } from '@/components/ui/modal';  // Assuming you have a Modal component
import { motion } from 'framer-motion';  // For animations
import '../styles/index.css';

const libraries = ['places', 'drawing'];

const FindLeads = () => {
  const [address, setAddress] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [listName, setListName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 32.7555, lng: -97.3308 }); // Fort Worth, Texas
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
        setMapZoom(18); // Zoom in closer to see individual houses
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
          recs: "20", // Increase the number of records to fetch
          opt: "IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off",
          bbox: `${sw.lat()},${sw.lng()},${ne.lat()},${ne.lng()}` // Use bounding box
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
    // ... (unchanged)
  }, [listName, leads, selectedArea]);
  
 const instructionSteps = [
    {
      title: "Welcome to Find Leads!",
      content: "This tool helps you find leads in a specific area. Let's walk through how to use it.",
      animation: null
    },
    {
      title: "Step 1: Choose an Area",
      content: "First, navigate to the area you're interested in. You can use the search bar to find a specific address.",
      animation: (
        <motion.div
          animate={{ x: [0, 200, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-8 w-32 bg-blue-500 rounded"
        />
      )
    },
    {
      title: "Step 2: Draw a Rectangle",
      content: "Click and drag on the map to draw a rectangle around the area you want to search.",
      animation: (
        <motion.div
          initial={{ width: 0, height: 0 }}
          animate={{ width: 200, height: 100 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="border-2 border-red-500"
        />
      )
    },
    {
      title: "Step 3: Find Leads",
      content: "Click the 'Find Leads in Selected Area' button to search for leads within your selected area.",
      animation: (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="p-2 bg-green-500 rounded text-white"
        >
          Find Leads
        </motion.div>
      )
    },
    {
      title: "You're All Set!",
      content: "You now know how to use the Find Leads tool. Click 'Get Started' to begin your search.",
      animation: null
    }
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

      <Modal isOpen={showInstructions} onClose={handleCloseInstructions}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{instructionSteps[currentStep].title}</h2>
          <p className="mb-4">{instructionSteps[currentStep].content}</p>
          <div className="flex justify-center mb-4">
            {instructionSteps[currentStep].animation}
          </div>
          <div className="flex justify-between">
            <Button onClick={handleCloseInstructions}>Skip</Button>
            <Button onClick={handleNextStep}>
              {currentStep === instructionSteps.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>
        </div>
      </Modal>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* ... (Dialog content remains unchanged) ... */}
      </Dialog>
    </div>
  );
};

export default FindLeads;
