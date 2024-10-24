import { useState, useEffect } from 'react';

export const useDrawingManager = (map) => {
  const [drawingManager, setDrawingManager] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    if (map && window.google && !drawingManager) {
      const manager = new window.google.maps.drawing.DrawingManager({
        drawingMode: window.google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.RECTANGLE],
        },
        rectangleOptions: {
          fillColor: '#FF0000',
          fillOpacity: 0.2,
          strokeWeight: 2,
          strokeColor: '#FF0000',
          editable: true,
          draggable: true,
        }
      });

      manager.setMap(map);
      setDrawingManager(manager);

      // Add listener for when a rectangle is completed
      window.google.maps.event.addListener(manager, 'rectanglecomplete', (rectangle) => {
        // Clear any existing selected area
        if (selectedArea) {
          selectedArea.setMap(null);
        }
        setSelectedArea(rectangle);
        // Switch back to non-drawing mode after rectangle is drawn
        manager.setDrawingMode(null);
      });
    }

    return () => {
      if (drawingManager) {
        drawingManager.setMap(null);
      }
      if (selectedArea) {
        selectedArea.setMap(null);
      }
    };
  }, [map]);

  const clearSelection = () => {
    if (selectedArea) {
      selectedArea.setMap(null);
      setSelectedArea(null);
    }
  };

  return {
    drawingManager,
    selectedArea,
    clearSelection
  };
};