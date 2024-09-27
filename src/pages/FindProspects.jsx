import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapComponent } from '../components/MapComponent';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';

const FindProspects = () => {
  const [searchArea, setSearchArea] = useState('');
  const [selectedProspects, setSelectedProspects] = useState([]);

  const { data: prospects, isLoading, error } = useQuery({
    queryKey: ['prospects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('prospects').select('*');
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for prospects in:', searchArea);
  };

  const handleSelectProspect = (prospect) => {
    setSelectedProspects((prev) =>
      prev.includes(prospect)
        ? prev.filter((p) => p !== prospect)
        : [...prev, prospect]
    );
  };

  const handleAddToContacts = () => {
    // Implement adding selected prospects to contacts
    console.log('Adding to contacts:', selectedProspects);
  };

  if (isLoading) return <div>Loading prospects...</div>;
  if (error) return <div>Error loading prospects: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Find Prospects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter address or area"
              value={searchArea}
              onChange={(e) => setSearchArea(e.target.value)}
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
          </CardHeader>
          <CardContent>
            <MapComponent searchArea={searchArea} prospects={prospects} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prospect List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prospects.map((prospect) => (
                  <TableRow key={prospect.id}>
                    <TableCell>{prospect.name}</TableCell>
                    <TableCell>{prospect.address}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleSelectProspect(prospect)}
                        variant={selectedProspects.includes(prospect) ? "default" : "outline"}
                      >
                        {selectedProspects.includes(prospect) ? "Selected" : "Select"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Button onClick={handleAddToContacts} disabled={selectedProspects.length === 0}>
        Add Selected to Contacts
      </Button>
    </div>
  );
};

export default FindProspects;