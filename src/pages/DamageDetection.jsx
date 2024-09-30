import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGoogleMap, useDrawingManager, useGoogleAutocomplete } from '@/src/hooks/useGoogleMaps'; 
import { supabase } from '../integrations/supabase/supabase';
import { useOpenRouterAI } from '@/src/services/useOpenRouterApi'; // Custom hook to interact with OpenRouter AI
import { fetchProspectsFromMelissaData } from '@/src/services/melissaDataService'; // Melissa Data fetching service

const FindProspects = () => {
  const [address, setAddress] = useState('');
  const [map, setMap] = useState(null);
  const [contacts, setContacts] = useState([]);
  const supabase = useSupabase();
  const openRouterAI = useOpenRouterAI();

  const handlePlaceChanged = (place) => {
    setAddress(place.formatted_address);
    map.setCenter(place.geometry.location);
    map.setZoom(18); // Zoom in to show detailed house areas
  };

  const handleAreaSelected = async (polygon) => {
    const bounds = polygon.getBounds();
    const center = {
      lat: bounds.getCenter().lat(),
      lng: bounds.getCenter().lng(),
    };

    try {
      // Call Melissa Data API to fetch prospects within the drawn area
      const prospects = await fetchProspectsFromMelissaData(center, '1'); // 1-mile radius or adjust based on the drawn area
      setContacts(prospects);

      // Insert the fetched data into Supabase and assign to the user
      for (const contact of prospects) {
        const { data: insertedContact } = await supabase
          .from('contacts')
          .insert([{ ...contact, assigned_to: 'user_id' }])
          .single();

        // Send contact to OpenRouter AI for scoring
        const score = await openRouterAI.generateContactScore(insertedContact);
        await supabase
          .from('contacts')
          .update({ score })
          .eq('id', insertedContact.id);
      }
    } catch (error) {
      console.error('Error fetching and inserting prospects:', error);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-4xl font-bold text-center">Find Prospects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Enter an Address to Begin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full"
              autoComplete="off"
              data-testid="address-input"
            />
            <Button onClick={() => useGoogleAutocomplete(handlePlaceChanged)} className="w-full">
              Search Address
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Map Area Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-96">
            {map && <div ref={useGoogleMap(map, setMap)} className="w-full h-full" data-testid="map" />}
            <Button onClick={() => useDrawingManager(map, handleAreaSelected)} className="absolute top-2 left-2 z-10">
              Select Area
            </Button>
          </div>
        </CardContent>
      </Card>

      {contacts.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Selected Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.AddressLine1} className="border rounded p-4 shadow-md bg-gray-50">
                  <p><strong>Address:</strong> {contact.AddressLine1}, {contact.City}, {contact.State}, {contact.PostalCode}</p>
                  <p><strong>Latitude:</strong> {contact.Latitude}</p>
                  <p><strong>Longitude:</strong> {contact.Longitude}</p>
                  <p><strong>Score:</strong> {contact.score || 'Not yet scored'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FindProspects;
