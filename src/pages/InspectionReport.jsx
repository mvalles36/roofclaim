import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';

const InspectionReport = () => {
  const [report, setReport] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [annotatedImages, setAnnotatedImages] = useState([]);
  const [roofMeasurements, setRoofMeasurements] = useState(null);
  const [insurancePolicy, setInsurancePolicy] = useState(null);

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

  const processImageWithRoboflow = async (imageUrl) => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/roof-damage-b3lgl/3",
        params: {
          api_key: "FIkWeTUAWe90ISDBoSyI"
        },
        data: imageUrl,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      setAnnotatedImages(prev => [...prev, { url: imageUrl, annotations: response.data }]);
    } catch (error) {
      console.error('Error processing image with Roboflow:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `drone-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('drone_images')
        .insert({ url: publicUrl });

      if (dbError) {
        console.error('Error saving image URL to database:', dbError);
      } else {
        fetchUploadedImages();
      }
    }
  };

  const handleFileUpload = async (event, fileType) => {
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileType}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error(`Error uploading ${fileType}:`, uploadError);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      if (fileType === 'roof-measurements') {
        setRoofMeasurements(publicUrl);
      } else if (fileType === 'insurance-policy') {
        setInsurancePolicy(publicUrl);
      }
    }
  };

  const handleDownload = () => {
    // Implement download functionality
    if (report && report.report_url) {
      window.open(report.report_url, '_blank');
    } else {
      alert('No report available for download');
    }
  };

  const handleShare = () => {
    // Implement share functionality
    if (report && report.report_url) {
      navigator.clipboard.writeText(report.report_url)
        .then(() => alert('Report URL copied to clipboard'))
        .catch(err => console.error('Error copying report URL:', err));
    } else {
      alert('No report available to share');
    }
  };

  if (!report) {
    return <div>Loading report...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Roof Inspection Report</h2>
      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
          <p><strong>Overall Condition:</strong> {report.overall_condition}</p>
          <div>
            <h3 className="font-semibold">Damage Annotations:</h3>
            <ul className="list-disc list-inside">
              {report.damage_annotations.map((annotation, index) => (
                <li key={index}>{annotation}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Uploaded Images:</h3>
            <Input type="file" onChange={handleImageUpload} accept="image/*" />
            {uploadedImages.map((image, index) => (
              <img key={index} src={image.url} alt={`Uploaded drone image ${index + 1}`} className="w-full max-w-md mx-auto rounded-lg shadow-md" />
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Annotated Images:</h3>
            {annotatedImages.map((image, index) => (
              <div key={index}>
                <img src={image.url} alt={`Annotated drone image ${index + 1}`} className="w-full max-w-md mx-auto rounded-lg shadow-md" />
                <pre>{JSON.stringify(image.annotations, null, 2)}</pre>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Roof Measurements:</h3>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'roof-measurements')} accept=".pdf,.doc,.docx" />
            {roofMeasurements && <a href={roofMeasurements} target="_blank" rel="noopener noreferrer">View Roof Measurements</a>}
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Insurance Policy:</h3>
            <Input type="file" onChange={(e) => handleFileUpload(e, 'insurance-policy')} accept=".pdf,.doc,.docx" />
            {insurancePolicy && <a href={insurancePolicy} target="_blank" rel="noopener noreferrer">View Insurance Policy</a>}
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleDownload}>Download Report</Button>
            <Button onClick={handleShare} variant="outline">Share Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionReport;