import { useEffect, useState } from 'react';

export const useGoogleMap = (mapContainerRef, center = { lat: 40.712776, lng: -74.005974 }, zoom = 14) => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const initMap = () => {
      if (mapContainerRef.current && !map) {
        const mapInstance = new window.google.maps.Map(mapContainerRef.current, {
          center,
          zoom,
        });
        setMap(mapInstance);
        setIsLoaded(true);
      }
    };

    if (window.google) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,drawing`;
      script.async = true;
      script.onload = () => initMap();
      script.onerror = (error) => setLoadError(error);
      document.body.appendChild(script);
    }
  }, [mapContainerRef, center, zoom, map]);

  return { map, isLoaded, loadError };
};