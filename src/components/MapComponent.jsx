import React, { useEffect, useRef } from 'react';
import { useGoogleMap } from '../hooks/useGoogleMap';

const MapComponent = ({ center, setCenter, radius, setRadius }) => {
  const mapRef = useRef(null);
  const { map, isLoaded, loadError } = useGoogleMap(mapRef, center);

  useEffect(() => {
    if (isLoaded && map) {
      const circle = new window.google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map,
        center: center,
        radius: radius * 1609.34, // Convert miles to meters
      });

      map.addListener('center_changed', () => {
        const newCenter = map.getCenter();
        setCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
      });

      circle.addListener('radius_changed', () => {
        setRadius(circle.getRadius() / 1609.34); // Convert meters to miles
      });

      return () => {
        window.google.maps.event.clearListeners(map, 'center_changed');
        window.google.maps.event.clearListeners(circle, 'radius_changed');
        circle.setMap(null);
      };
    }
  }, [isLoaded, map, center, setCenter, radius, setRadius]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default MapComponent;