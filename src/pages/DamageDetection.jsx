import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploadComponent from '../components/ImageUploadComponent';
import ImageAnnotatorComponent from '../components/ImageAnnotatorComponent';
import { Button } from "@/components/ui/button";

const DamageDetection = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [annotations, setAnnotations] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [labels] = useState([
    { id: 1, name: 'Front View' },
    { id: 2, name: 'Side View' },
    { id: 3, name: 'Back View' },
    // Add more tags as needed
  ]);

  const handleUpload = (newImages) => {
    setUploadedImages(prevImages => [...prevImages, ...newImages]);
    setSelectedImage(newImages[0]); // Automatically select the first image
  };

  const handleAnnotationSave = (imageId, newAnnotations) => {
    setAnnotations(prevAnnotations => ({
      ...prevAnnotations,
      [imageId]: newAnnotations
    }));
  };

  const handleLabelAssign = (imageId, labelId) => {
    const updatedAnnotations = annotations[imageId] || [];
    updatedAnnotations.push({ labelId, class: labels.find(label => label.id === labelId).name });
    setAnnotations(prevAnnotations => ({
      ...prevAnnotations,
      [imageId]: updatedAnnotations
    }));
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Damage Detection</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Inspection Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadComponent onUpload={handleUpload} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {uploadedImages.map((image, index) => (
          <Card key={index} onClick={() => handleImageSelect(image)} className="cursor-pointer">
            <CardContent>
              <img src={image.url} alt={`Uploaded ${index}`} className="w-full h-auto" />
              <p className="text-center mt-2">Image {index + 1}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedImage && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Annotate and Tag Image</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageAnnotatorComponent
              image={selectedImage}
              annotations={annotations[selectedImage.id] || []}
              onSave={(newAnnotations) => handleAnnotationSave(selectedImage.id, newAnnotations)}
              labels={labels}
              onLabelAssign={handleLabelAssign}
            />
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end mt-4">
        <Button onClick={() => console.log('Generate Report')}>Generate Report</Button>
      </div>
    </div>
  );
};

export default DamageDetection;
