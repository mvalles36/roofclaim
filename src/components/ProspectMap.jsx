import React, { useState } from 'react';
import { GoogleMap, DrawingManager } from '@react-google-maps/api';
import { useGoogleMap } from '../hooks/useGoogleMap';
import { useDrawingManager } from '../hooks/useDrawingManager';
import { Button } from './ui/button';
import { toast } from 'sonner';

const ProspectMap = ({ onAreaSelected }) => {
  const { map, isLoaded, center } = useGoogleMap();
  const { drawingManager, selectedArea, clearSelection } = useDrawingManager(map);
  
  const handleSearchArea = () => {
    if (selectedArea) {
      const bounds = selectedArea.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      
      onAreaSelected({
        north: ne.lat(),
        south: sw.lat(),
        east: ne.lng(),
        west: sw.lng()
      });
      toast.success('Area selected for prospect search');
    } else {
      toast.error('Please draw an area on the map first');
    }
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="h-[600px] w-full relative">
      <GoogleMap
        mapContainerClassName="w-full h-full"
        center={center}
        zoom={12}
      >
        <DrawingManager
          drawingMode={window.google.maps.drawing.OverlayType.RECTANGLE}
          drawingControl={true}
          drawingControlOptions={{
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [window.google.maps.drawing.OverlayType.RECTANGLE],
          }}
        />
      </GoogleMap>
      <div className="absolute bottom-4 right-4 space-x-2">
        <Button onClick={clearSelection}>Clear Selection</Button>
        <Button onClick={handleSearchArea}>Search This Area</Button>
      </div>
    </div>
  );
};

export default ProspectMap;