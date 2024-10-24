import React from 'react';
import { useGoogleMap } from '../hooks/useGoogleMap';
import { useDrawingManager } from '../hooks/useDrawingManager';
import { Button } from './ui/button';
import { toast } from 'sonner';

const ProspectMap = ({ onAreaSelected }) => {
  const { map, isLoaded, center } = useGoogleMap();
  const { selectedArea, clearSelection } = useDrawingManager(map);
  
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
      <div ref={map} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 space-x-2">
        <Button onClick={clearSelection}>Clear Selection</Button>
        <Button onClick={handleSearchArea}>Search This Area</Button>
      </div>
    </div>
  );
};

export default ProspectMap;