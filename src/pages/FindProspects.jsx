import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MapComponent from '../components/MapComponent';
import ProspectsList from '../components/ProspectsList';
import { fetchProspectsFromMelissaData } from '../services/melissaDataService';

const FindProspects = () => {
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [radius, setRadius] = useState(1);
  const [prospects, setProspects] = useState([]);

  const handleSearch = async () => {
    try {
      const fetchedProspects = await fetchProspectsFromMelissaData(center, radius);
      setProspects(fetchedProspects);
    } catch (error) {
      console.error('Error fetching prospects:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Prospects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Map</CardTitle>
        </CardHeader>
        <CardContent>
          <MapComponent
            center={center}
            setCenter={setCenter}
            radius={radius}
            setRadius={setRadius}
          />
          <Button onClick={handleSearch} className="mt-4">Search for Prospects</Button>
        </CardContent>
      </Card>
      {prospects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prospects</CardTitle>
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