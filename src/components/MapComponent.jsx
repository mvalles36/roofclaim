import React, { useCallback, useRef } from 'react';
import { GoogleMap, DrawingManager } from "@react-google-maps/api";

const MapComponent = ({ onAreaSelected, center }) => { // Removed drawingOptions prop
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    map.setZoom(14);
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
      center={center || { lat: 32.7555, lng: -97.3308 }}
      zoom={14}
      onLoad={onMapLoad}
    >
      <DrawingManager
        onLoad={onDrawingManagerLoad}
        onRectangleComplete={onRectangleComplete}
        options={{
          drawingMode: window.google?.maps?.drawing?.OverlayType?.RECTANGLE,
          drawingControl: true,
          drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_CENTER,
            drawingModes: [window.google?.maps?.drawing?.OverlayType?.RECTANGLE]
          },
          rectangleOptions: {
            fillColor: "#4bd1a0",
            fillOpacity: 0.3,
            strokeWeight: 2,
            strokeColor: "#4bd1a0",
            clickable: false,
            editable: true,
            zIndex: 1
          }
        }}
      />
    </GoogleMap>
  );
};

export default MapComponent;
