import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import DamageDetectionUploader from '../components/DamageDetectionUploader';
import ImageAnnotator from '../components/ImageAnnotator';

const DamageDetection = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(12);
  const [selectedImage, setSelectedImage] = useState(null);
  const [labels, setLabels] = useState([]);
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchImages();
    fetchLabels();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('damage_detection_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
    } else {
      setImages(data);
    }
  };

  const fetchLabels = async () => {
    const { data, error } = await supabase
      .from('image_labels')
      .select('*');

    if (error) {
      console.error('Error fetching labels:', error);
    } else {
      setLabels(data);
    }
  };

  const handleImageUpload = async (newImages) => {
    // Implementation for image upload
    // This should be handled in DamageDetectionUploader component
    await fetchImages();
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleAnnotationSave = async (annotations) => {
    const { error } = await supabase
      .from('damage_detection_images')
      .update({ annotations })
      .eq('id', selectedImage.id);

    if (error) {
      console.error('Error saving annotations:', error);
    } else {
      fetchImages();
    }
  };

  const handleLabelAssign = async (imageId, labelId) => {
    const { error } = await supabase
      .from('damage_detection_images')
      .update({ label_id: labelId })
      .eq('id', imageId);

    if (error) {
      console.error('Error assigning label:', error);
    } else {
      fetchImages();
    }
  };

  // Pagination
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Damage Detection</h1>
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="view">View Images</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <DamageDetectionUploader onUpload={handleImageUpload} />
        </TabsContent>
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {currentImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative cursor-pointer"
                    onClick={() => handleImageSelect(image)}
                  >
                    <img src={image.url} alt="Damage" className="w-full h-48 object-cover" />
                    {image.label_id && (
                      <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded">
                        {labels.find(l => l.id === image.label_id)?.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <Pagination
                className="mt-4"
                currentPage={currentPage}
                totalCount={images.length}
                pageSize={imagesPerPage}
                onPageChange={paginate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {selectedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Image Annotation</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageAnnotator
              image={selectedImage}
              onSave={handleAnnotationSave}
              labels={labels}
              onLabelAssign={handleLabelAssign}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DamageDetection;
