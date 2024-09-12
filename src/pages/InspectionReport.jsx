import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '../integrations/supabase/supabase';
import { jsPDF } from "jspdf";

const InspectionReport = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [annotatedImages, setAnnotatedImages] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
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
        processImageWithRoboflow(publicUrl);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Roof Inspection Report</h2>
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Customer Name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
          />
          <Input
            placeholder="Address"
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
          />
          <Input
            placeholder="Phone"
            value={customerInfo.phone}
            onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
          />
          <Input
            placeholder="Email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" multiple onChange={handleImageUpload} accept="image/*" />
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
              <pre className="mt-2 bg-gray-100 p-2 rounded">{JSON.stringify(image.annotations, null, 2)}</pre>
            </div>
          ))}
        </CardContent>
      </Card>
      <Button onClick={generatePDFReport} disabled={annotatedImages.length === 0}>Generate PDF Report</Button>
    </div>
  );
};

export default InspectionReport;