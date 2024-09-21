import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLoadScript } from "@react-google-maps/api";
import { supabase } from "../integrations/supabase/supabase";
import { toast } from 'sonner';
import MapComponent from '../components/MapComponent';
import LeadsList from '../components/LeadsList';
import { fetchLeadsFromMelissaData } from '../services/melissaDataService';

const libraries = ["places", "drawing", "geometry"];

const FindLeads = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const handleFindLeads = useCallback(async () => {
    if (!selectedArea) {
      toast.error("Please draw a rectangle on the map first.");
      return;
    }

    setIsLoading(true);
    try {
      const bounds = selectedArea.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      const center = { lat: (ne.lat() + sw.lat()) / 2, lng: (ne.lng() + sw.lng()) / 2 };
      const radius = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(center.lat, center.lng),
        new window.google.maps.LatLng(sw.lat(), sw.lng())
      ) / 1609.34;

      const leadsData = await fetchLeadsFromMelissaData(center, radius);
      const filteredLeads = leadsData.filter((lead) => {
        const latLng = new window.google.maps.LatLng(lead.Latitude, lead.Longitude);
        return bounds.contains(latLng);
      });

      setLeads(filteredLeads);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("An error occurred while fetching leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedArea]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return "Loading maps";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Leads</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Area</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Search for an address"
            className="w-full mb-4"
          />
          <MapComponent
            onAreaSelected={setSelectedArea}
            drawingOptions={{
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
          <Button onClick={handleFindLeads} className="mt-4" disabled={isLoading}>
            {isLoading ? "Finding Leads..." : "Find Leads"}
          </Button>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Found Leads</DialogTitle>
          </DialogHeader>
          <LeadsList leads={leads} />
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindLeads;
