import { useEffect, useState } from 'react';

const useDrawingManager = (map) => {
  const [drawingManager, setDrawingManager] = useState(null);

  useEffect(() => {
    if (map && !drawingManager) {
      const drawingManagerInstance = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: ['rectangle'],
        },
      });
      drawingManagerInstance.setMap(map);
      setDrawingManager(drawingManagerInstance);
    }
  }, [map, drawingManager]);

  return drawingManager;
};

export default useDrawingManager;
