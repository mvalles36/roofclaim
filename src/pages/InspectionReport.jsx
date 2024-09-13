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
    email: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    const totalFiles = files.length;
    let processedFiles = 0;

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from('inspection-images')
        .upload(`${Date.now()}-${file.name}`, file);

      if (error) {
        console.error('Error uploading image:', error);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('inspection-images')
          .getPublicUrl(data.path);

        setUploadedImages(prev => [...prev, publicUrl]);
        await processImageWithRoboflow(publicUrl);
      }

      processedFiles++;
      setUploadProgress((processedFiles / totalFiles) * 100);
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
            'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`
          }
        }
      );
      setAnnotatedImages(prev => [...prev, { url: imageUrl, annotations: response.data }]);
    } catch (error) {
      console.error('Error processing image with Roboflow:', error);
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
    doc.text(`Address: ${customerInfo.address}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Phone: ${customerInfo.phone}`, 20, yOffset);
    yOffset += 10;
    doc.text(`Email: ${customerInfo.email}`, 20, yOffset);
    yOffset += 20;

    // Add annotated images
    annotatedImages.forEach((image, index) => {
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      doc.addImage(image.url, 'JPEG', 20, yOffset, 170, 100);
      yOffset += 110;
      doc.setFontSize(10);
      doc.text(`Image ${index + 1} Annotations:`, 20, yOffset);
      yOffset += 10;
      const annotationsText = JSON.stringify(image.annotations, null, 2);
      const splitText = doc.splitTextToSize(annotationsText, 170);
      doc.text(splitText, 20, yOffset);
      yOffset += splitText.length * 5 + 10;
    });

    doc.save('inspection_report.pdf');
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800">Roof Inspection Report</h2>
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(customerInfo).map(([key, value]) => (
            <div key={key}>
              <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
              <Input
                id={key}
                value={value}
                onChange={(e) => setCustomerInfo({...customerInfo, [key]: e.target.value})}
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input type="file" multiple onChange={handleImageUpload} accept="image/*" id="image-upload" className="hidden" />
            <Label htmlFor="image-upload" className="cursor-pointer flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              <Upload className="h-5 w-5" />
              <span>Choose Files</span>
            </Label>
            <span className="text-sm text-gray-500">{uploadedImages.length} file(s) selected</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Annotated Images</CardTitle>
        </CardHeader>
        <CardContent>
          {annotatedImages.map((image, index) => (
            <div key={index} className="mb-4">
              <img src={image.url} alt={`Annotated drone image ${index + 1}`} className="w-full max-w-md mx-auto rounded-lg shadow-md" />
              <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-x-auto">{JSON.stringify(image.annotations, null, 2)}</pre>
            </div>
          ))}
        </CardContent>
      </Card>
      <Button onClick={generatePDFReport} disabled={annotatedImages.length === 0} className="flex items-center space-x-2">
        <Download className="h-5 w-5" />
        <span>Generate PDF Report</span>
      </Button>
    </div>
  );
};

export default InspectionReport;