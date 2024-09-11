import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '../integrations/supabase/supabase';
import ImageUploader from '../components/ImageUploader';
import DocumentUploader from '../components/DocumentUploader';
import ReportDetails from '../components/ReportDetails';

const InspectionReport = () => {
  const [report, setReport] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [annotatedImages, setAnnotatedImages] = useState([]);

  useEffect(() => {
    fetchLatestReport();
    fetchUploadedImages();
  }, []);

  const fetchLatestReport = async () => {
    const { data, error } = await supabase
      .from('inspection_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
    } else {
      setReport(data);
    }
  };

  const fetchUploadedImages = async () => {
    const { data, error } = await supabase
      .from('drone_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching uploaded images:', error);
    } else {
      setUploadedImages(data);
      data.forEach(image => processImageWithRoboflow(image.url));
    }
  };

 import axios from 'axios';

const processImageWithRoboflow = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await axios({
      method: 'POST',
      url: 'https://detect.roboflow.com/roof-damage-b3lgl/3',
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${process.env.REACT_APP_ROBOFLOW_API_KEY}` // Use environment variable for API key
      },
      data: formData
    });

    // Assuming response contains the data in a suitable format
    setAnnotatedImages(prev => [...prev, { url: URL.createObjectURL(imageFile), annotations: response.data }]);
  } catch (error) {
    console.error('Error processing image with Roboflow:', error);
  }
};


  const handleImageUpload = async (file) => {
    const { data, error } = await ImageUploader.upload(file);
    if (error) {
      console.error('Error uploading image:', error);
    } else {
      fetchUploadedImages();
    }
  };

  const handleDocumentUpload = async (file, type) => {
    const { data, error } = await DocumentUploader.upload(file, type);
    if (error) {
      console.error(`Error uploading ${type}:`, error);
    } else {
      fetchLatestReport();
    }
  };

  if (!report) {
    return <div>Loading report...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Roof Inspection Report</h2>
      <ReportDetails report={report} />
      <Card>
        <CardHeader>
          <CardTitle>Upload Images and Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" onChange={(e) => handleImageUpload(e.target.files[0])} accept="image/*" />
          <Input type="file" onChange={(e) => handleDocumentUpload(e.target.files[0], 'roof-measurements')} accept=".pdf,.doc,.docx" />
          <Input type="file" onChange={(e) => handleDocumentUpload(e.target.files[0], 'insurance-policy')} accept=".pdf,.doc,.docx" />
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
    </div>
  );
};

export default InspectionReport;
