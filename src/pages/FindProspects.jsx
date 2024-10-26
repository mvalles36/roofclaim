import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search } from 'lucide-react';
import { fetchPropertiesInBounds } from '../services/melissaDataService';
import { saveList } from '../services/listService';
import { useToast } from "@/components/ui/use-toast";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const FindProspects = ({ companyId, onListCreated }) => {
  const [properties, setProperties] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [listName, setListName] = useState('');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const selectedRectangleRef = useRef(null);

  // Load Google Maps Script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=drawing,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setScriptLoaded(true);
      };
      document.head.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    loadGoogleMapsScript();
  }, []);
 const { toast } = useToast();
  
  // Initialize map and autocomplete after script loads
  useEffect(() => {
    if (!scriptLoaded) return;
    
    initializeMap();
    initializeAutocomplete();
  }, [scriptLoaded]);

  const initializeAutocomplete = () => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' }
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      
      if (!place.geometry) {
        console.log("No location found for this place.");
        return;
      }

      // Update the input value with the selected place
      setAddress(place.formatted_address);

      // Center the map on the selected place
      if (mapRef.current) {
        mapRef.current.setCenter(place.geometry.location);
        mapRef.current.setZoom(18);
      }
    });
  };

  const initializeMap = () => {
    if (!mapContainerRef.current || !window.google) return;

    const mapOptions = {
      center: { lat: 37.7749, lng: -122.4194 },
      zoom: 18,
      mapTypeId: 'satellite',
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    };

    // Initialize map
    const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
    mapRef.current = map;

    // Initialize drawing manager
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['rectangle']
      },
      rectangleOptions: {
        fillColor: '#FF0000',
        fillOpacity: 0.2,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        zIndex: 1
      }
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // Add rectangle complete listener
    window.google.maps.event.addListener(
      drawingManager, 
      'rectanglecomplete', 
      onRectangleComplete
    );
  };

    // Remove previous rectangle if it exists
    if (selectedRectangleRef.current) {
      selectedRectangleRef.current.setMap(null);
    }

   const onRectangleComplete = async (rectangle) => {
    if (selectedRectangleRef.current) {
      selectedRectangleRef.current.setMap(null);
    }

    selectedRectangleRef.current = rectangle;
    const bounds = rectangle.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const boundaryPoints = {
      northEast: { lat: ne.lat(), lng: ne.lng() },
      southWest: { lat: sw.lat(), lng: sw.lng() }
    };

    try {
      setLoading(true);
      const fetchedProperties = await fetchPropertiesInBounds(boundaryPoints);
      
      if (fetchedProperties.length === 0) {
        toast({
          title: "No properties found",
          description: "No properties were found in the selected area. Try selecting a different area.",
          variant: "warning",
        });
        return;
      }

      setProperties(fetchedProperties);
      setShowSaveDialog(true);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveList = async () => {
    if (!listName) return;

    try {
      setLoading(true);
      const listData = {
        companyId,
        name: listName,
        properties
      };

      await saveList(listData);
      
      toast({
        title: "Success",
        description: `List "${listName}" has been saved and sent to Suppose.`,
      });
      
      setShowSaveDialog(false);
      setListName('');
      
      if (onListCreated) {
        onListCreated(listData);
      }

      if (selectedRectangleRef.current) {
        selectedRectangleRef.current.setMap(null);
        selectedRectangleRef.current = null;
      }
    } catch (error) {
      console.error('Error saving list:', error);
      toast({
        title: "Error",
        description: "Failed to save list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertiesInBounds = async (bounds) => {
    // TODO: Implement actual Melissa Data API call
    // This is a placeholder for the actual implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, address: '123 Main St' },
          { id: 2, address: '456 Oak Ave' }
        ]);
      }, 1000);
    });
  };

  const handleSaveList = async () => {
    if (!listName) return;

    try {
      const listData = {
        companyId,
        name: listName,
        properties
      };

      // TODO: Implement API call to save list and send to Suppose
      await saveList(listData);
      
      setShowSaveDialog(false);
      setListName('');
      if (onListCreated) {
        onListCreated(listData);
      }

      // Clear the rectangle after saving
      if (selectedRectangleRef.current) {
        selectedRectangleRef.current.setMap(null);
        selectedRectangleRef.current = null;
      }
    } catch (error) {
      console.error('Error saving list:', error);
    }
  };

  const handleSearch = () => {
    if (!address || !window.google) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        mapRef.current.setCenter(location);
        mapRef.current.setZoom(18);
      }
    });
  };

  return (
    <div className="w-full h-full">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Property Selector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              ref={inputRef}
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div 
        ref={mapContainerRef} 
        className="w-full h-[80vh] rounded-lg overflow-hidden"
      />

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Property List</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4">Found {properties.length} properties in selected area</p>
            <Input
              placeholder="Enter list name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSaveList} disabled={!listName || loading}>
              {loading ? 'Saving...' : 'Save List'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindProspects;
