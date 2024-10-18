import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DamageDetectionUploader from '../components/DamageDetectionUploader';
import ImageAnnotatorComponent from '../components/ImageAnnotatorComponent';
import { processImageWithRoboflow } from '../services/roboflowService';
import { toast } from 'sonner';

const DamageDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  const handleImageUpload = async (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      try {
        const processedData = await processImageWithRoboflow(imageUrl);
        setAnnotations(processedData.predictions);
        toast.success('Image processed successfully');
      } catch (error) {
        console.error('Error processing image:', error);
        toast.error('Failed to process image');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Damage Detection</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Image for Damage Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <DamageDetectionUploader onUpload={handleImageUpload} />
          {selectedImage && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Detected Damage</h2>
              <ImageAnnotatorComponent
                image={selectedImage}
                annotations={annotations}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DamageDetection;