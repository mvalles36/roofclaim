import React, { useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ProspectMap = ({ onAreaSelected, address, setAddress }) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const drawingManagerRef = useRef(null);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initializeMap();
        initializeAutocomplete();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=drawing,places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeMap();
        initializeAutocomplete();
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

      setAddress(place.formatted_address);

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

    const map = new window.google.maps.Map(mapContainerRef.current, mapOptions);
    mapRef.current = map;

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

    window.google.maps.event.addListener(
      drawingManager, 
      'rectanglecomplete', 
      (rectangle) => {
        const bounds = rectangle.getBounds();
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        onAreaSelected({
          northEast: { lat: ne.lat(), lng: ne.lng() },
          southWest: { lat: sw.lat(), lng: sw.lng() }
        });
      }
    );
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
    <div className="w-full space-y-4">
      <div className="flex gap-2">
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
      <div 
        ref={mapContainerRef} 
        className="w-full h-[60vh] rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default ProspectMap;