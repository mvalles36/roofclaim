import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const DemoMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=drawing`;
      script.async = true;
      document.body.appendChild(script);
      script.onload = initMap;
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.0060 },
      zoom: 16,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
    });

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['rectangle']
      }
    });

    drawingManager.setMap(map);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative rounded-xl overflow-hidden shadow-xl"
    >
      <div ref={mapRef} className="w-full h-[400px]" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <MapPin className="text-violet-600" />
          <span className="font-medium">Draw to select properties</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DemoMap;