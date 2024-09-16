import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { useLoadScript, GoogleMap, DrawingManager, Marker } from '@react-google-maps/api';
import { visuallyHidden } from '@mui/material'; // Assuming Material-UI for accessibility

const libraries = ['places', 'drawing'];

const FindLeads = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [leads, setLeads] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 32.7555, lng: -97.3308 }); // Fort Worth, Texas
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

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

  const calculateCenterAndRadius = (sw, ne) => {
    const centerLat = (sw.lat() + ne.lat()) / 2;
    const centerLng = (sw.lng() + ne.lng()) / 2;

    const swLatLng = new window.google.maps.LatLng(sw.lat(), sw.lng());
    const centerLatLng = new window.google.maps.LatLng(centerLat, centerLng);

    const radius = window.google.maps.geometry.spherical.computeDistanceBetween(centerLatLng, swLatLng) / 1609.34;

    return {
      center: { lat: centerLat, lng: centerLng },
      radius,
    };
  };

  const handleFindLeads = useCallback(async () => {
    if (!selectedArea) {
      alert('Please draw a rectangle on the map first.');
      return;
    }

    const bounds = selectedArea.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const { center, radius } = calculateCenterAndRadius(sw, ne);

    try {
      const response = await axios.get('https://reversegeo.melissadata.net/v3/web/ReverseGeoCode/doLookup', {
        params: {
          id: import.meta.env.VITE_MELISSA_DATA_API_KEY,
          format: "json",
          recs: "20",
          opt: "IncludeApartments:off;IncludeUndeliverable:off;IncludeEmptyLots:off",
          lat: center.lat,
          lon: center.lng,
          MaxDistance: radius,
        },
      });

      const processedLeads = response.data.Records
        .filter((record) => {
          const latLng = new window.google.maps.LatLng(record.Latitude, record.Longitude);
          return bounds.contains(latLng);
        })
        .map((record) => ({
          name: record.AddressLine1,
          address: `${record.AddressLine1}, ${record.City}, ${record.State} ${record.PostalCode}`,
          telephone: record.TelephoneNumber,
          email: record.EmailAddress,
          income: record.Income,
          coordinates: JSON.stringify({ lat: record.Latitude, lng: record.Longitude }),
          mak: record.MAK,
          user
