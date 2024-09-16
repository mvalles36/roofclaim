import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from '../integrations/supabase/supabase';
import { jsPDF } from "jspdf";
import { Camera, Upload, FileText, Download } from 'lucide-react';

const InspectionReport = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [annotatedImages, setAnnotatedImages] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null); // Track upload errors

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const totalFiles = files.length;
    let processedFiles = 0;

    setUploadError(null); // Clear previous error messages

    for (const file of files) {
      try {
        const { data, error } = await supabase.storage
          .from('inspection-images')
          .upload(`<span class="math-inline">\{Date\.now\(\)\}\-</span>{file.name}`, file);

        if (error) {
          throw error; // Re-throw error to be caught in the catch block
        }

        const { data: { publicUrl } } = supabase.storage
          .from('inspection-images')
          .getPublicUrl(data.path);

        setUploadedImages(prev => [...prev, publicUrl]);
        await processImageWithRoboflow(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        setUploadError(error.message || 'An error occurred while uploading images.');
      } finally {
        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
      }
    }
  };

  const processImageWithRoboflow = async (imageUrl) => {
    try {
      const response = await axios.post(
        'https://detect.roboflow.com/roof-damage-b3lgl/3',
        imageUrl,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`,
          },
        }
      );
      setAnnotatedImages(prev => [...prev, { url: imageUrl, annotations: response.data }]);
    } catch (error) {
      console.error('Error processing image with Roboflow:', error);
      // Handle Roboflow API errors appropriately (e.g., display a user-friendly message)
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    let yOffset = 20;

    // Add customer information
    doc.setFontSize(16);
    doc.text('Inspection Report', 105, yOffset, { align: 'center' });
    yOffset += 20;
    doc.setFontSize(12);
    doc.text(`Customer: ${customerInfo.name}`, 20, yOffset);
    yOffset += 10;
    // ... rest of the report generation logic using customerInfo

    // Add annotated images with proper error handling
    if (annotatedImages.length === 0) {
      doc.text('No annotated images found. Please upload images for analysis.', 20, yOffset);
      yOffset += 10;
    } else {
      annotatedImages.forEach((image, index) => {
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 20;
        }
        // ... existing logic to add image and annotations
      });
    }

    doc.save('inspection_report.pdf');
  };

  return (
