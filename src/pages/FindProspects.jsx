import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProspectMap from '../components/ProspectMap';
import ProspectsList from '../components/ProspectsList';
import { useQuery } from '@tanstack/react-query';
import { fetchProspectsInArea } from '../services/prospectsService';
import { toast } from 'sonner';

const FindProspects = () => {
  const [selectedArea, setSelectedArea] = useState(null);

  const { data: prospects, isLoading } = useQuery({
    queryKey: ['prospects', selectedArea],
    queryFn: () => selectedArea ? fetchProspectsInArea(selectedArea) : null,
    enabled: !!selectedArea
  });

  const handleAreaSelected = (area) => {
    setSelectedArea(area);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Find Prospects</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Area</CardTitle>
        </CardHeader>
        <CardContent>
          <ProspectMap onAreaSelected={handleAreaSelected} />
        </CardContent>
      </Card>

      {isLoading && <div>Loading prospects...</div>}
      
      {prospects && (
        <Card>
          <CardHeader>
            <CardTitle>Prospects in Selected Area</CardTitle>
          </CardHeader>
          <CardContent>
            <ProspectsList prospects={prospects} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FindProspects;