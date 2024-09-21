import React, { useCallback, useRef } from 'react';
import { GoogleMap, DrawingManager } from "@react-google-maps/api";

const MapComponent = ({ onAreaSelected, drawingOptions }) => {
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.setZoom(20);
  }, []);

  const onDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);

  const onRectangleComplete = useCallback((rectangle) => {
    if (onAreaSelected) {
      onAreaSelected(rectangle);
    }
    drawingManagerRef.current.setDrawingMode(null);
  }, [onAreaSelected]);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={{ lat: 32.7555, lng: -97.3308 }}
      zoom={20}
      onLoad={onMapLoad}
    >
      <DrawingManager
        onLoad={onDrawingManagerLoad}
        onRectangleComplete={onRectangleComplete}
        options={drawingOptions}
      />
    </GoogleMap>
  );
};

export default MapComponent;