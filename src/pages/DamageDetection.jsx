import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DamageDetectionUploader from '../components/DamageDetectionUploader';
import ImageAnnotatorComponent from '../components/ImageAnnotatorComponent';

const DamageDetection = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async (files, progressCallback) => {
    // Simulating upload process
    for (let file of files) {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        progressCallback(file.name, i);
      }
      setUploadedImages(prev => [...prev, URL.createObjectURL(file)]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Damage Detection</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <DamageDetectionUploader onUpload={handleUpload} uploadError={uploadError} />
        </CardContent>
      </Card>
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {uploadedImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Uploaded image ${index + 1}`}
                  className="w-full h-40 object-cover cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      {selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Annotate Damage</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageAnnotatorComponent imageUrl={selectedImage} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DamageDetection;