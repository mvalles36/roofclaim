import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "../integrations/supabase/supabase";
import { useLoadScript, GoogleMap, DrawingManager } from "@react-google-maps/api";
import { useDropzone } from 'react-dropzone';

const libraries = ["places", "drawing", "geometry"];

const FindLeads = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const mapRef = React.useRef(null);
  const drawingManagerRef = React.useRef(null);
  const searchBoxRef = React.useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    initSearchBox();
  }, []);

  const initSearchBox = () => {
    if (!searchBoxRef.current || !window.google) return;
    const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);
    mapRef.current.controls[window.google.maps.ControlPosition.TOP_LEFT].push(searchBoxRef.current);
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
      if (places.length === 0) return;
      const bounds = new window.google.maps.LatLngBounds();
      places.forEach((place) => {
        if (place.geometry && place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else if (place.geometry) {
          bounds.extend(place.geometry.location);
        }
      });
      mapRef.current.fitBounds(bounds);
    });
  };

  const onDrawingManagerLoad = useCallback((drawingManager) => {
    drawingManagerRef.current = drawingManager;
  }, []);

  const onRectangleComplete = useCallback((rectangle) => {
    if (selectedArea) {
      selectedArea.setMap(null);
    }
    setSelectedArea(rectangle);
    drawingManagerRef.current.setDrawingMode(null);
  }, [selectedArea]);

  const handleFindLeads = useCallback(async () => {
    const user = supabase.auth.user();
    if (!user) {
      alert("User is not authenticated");
      return;
    }

    if (!selectedArea) {
      alert("Please draw a rectangle on the map first.");
      return;
    }

    const bounds = selectedArea.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const center = { lat: (ne.lat() + sw.lat()) / 2, lng: (ne.lng() + sw.lng()) / 2 };
    const radius = window.google.maps.geometry.spherical.computeDistanceBetween(
      new window.google.maps.LatLng(center.lat, center.lng),
      new window.google.maps.LatLng(sw.lat(), sw.lng())
    ) / 1609.34;

    const apiUrl = `https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup?id=${import.meta.env.VITE_MELISSA_DATA_API_KEY}&format=json&recs=20&opt=IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off&lat=${center.lat}&lon=${center.lng}&MaxDistance=${radius}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedLeads = data.Records.filter((record) => {
        const latLng = new window.google.maps.LatLng(record.Latitude, record.Longitude);
        return bounds.contains(latLng);
      }).map((record) => ({
        name: record.AddressLine1,
        address: `${record.AddressLine1}, ${record.City}, ${record.State} ${record.PostalCode}`,
        telephone: record.TelephoneNumber,
        email: record.EmailAddress,
        income: record.Income,
        coordinates: JSON.stringify({ lat: record.Latitude, lng: record.Longitude }),
        mak: record.MAK,
        user_id: user.id
      }));
      setLeads(processedLeads);
      if (processedLeads.length > 0) {
        setIsDialogOpen(true);
      } else {
        alert("No leads found in the selected area.");
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      alert("An error occurred while fetching leads. Please try again.");
    }
  }, [selectedArea]);

  const handleSaveLeads = async () => {
    try {
      const { data, error } = await supabase.from("leads").insert(leads);
      if (error) {
        console.error("Error saving leads:", error.message);
        alert("An error occurred while saving leads. Please try again.");
        return;
      }
      alert("Leads saved successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving leads:", error);
      alert("An error occurred while saving leads. Please try again.");
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    // Handle file upload logic here
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  if (loadError) return <div>Error loading maps: {loadError.message}</div>;
  if (!isLoaded) return "Loading maps";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Find Leads</h1>
      <Card>
        <CardHeader>
          <CardTitle>Draw Area on Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            ref={searchBoxRef}
            type="text"
            placeholder="Search for an address"
            className="w-full mb-4"
          />
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: 32.7555, lng: -97.3308 }}
            zoom={12}
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
                }
              }}
            />
          </GoogleMap>
          <Button onClick={handleFindLeads} className="mt-4">Find Leads</Button>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Found Leads</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {leads.map((lead, index) => (
              <div key={index} className="mb-2">
                <p><strong>Name:</strong> {lead.name}</p>
                <p><strong>Address:</strong> {lead.address}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSaveLeads}>Save Leads</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

export default FindLeads;
