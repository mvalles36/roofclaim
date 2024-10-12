import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DamageDetectionUploader from '../components/DamageDetectionUploader';
import ImageAnnotatorComponent from '../components/ImageAnnotatorComponent';
import { processImageWithRoboflow } from '../services/roboflowService';

const DamageDetection = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [annotations, setAnnotations] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const handleUpload = async (files) => {
    const newImages = await Promise.all(files.map(async (file) => {
      const imageUrl = URL.createObjectURL(file);
      const processedData = await processImageWithRoboflow(imageUrl);
      return { url: imageUrl, annotations: processedData.predictions };
    }));
    setImages([...images, ...newImages]);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  useEffect(() => {
    if (images[currentImageIndex]) {
      setAnnotations(images[currentImageIndex].annotations);
    }
  }, [currentImageIndex, images]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Damage Detection</h1>
      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent>
          <DamageDetectionUploader onUpload={handleUpload} />
        </CardContent>
      </Card>
      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Image Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button onClick={handlePreviousImage}>Previous</Button>
              <span>{currentImageIndex + 1} / {images.length}</span>
              <Button onClick={handleNextImage}>Next</Button>
            </div>
            <ImageAnnotatorComponent
              imageUrl={images[currentImageIndex].url}
              annotations={annotations}
            />
            <div className="mt-4">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter new tag"
                />
                <Button onClick={handleAddTag}>Add Tag</Button>
              </div>
              <div className="flex flex-wrap mt-2">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2">
                    {`{{${tag}}}`}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DamageDetection;