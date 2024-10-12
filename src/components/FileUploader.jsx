import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '../integrations/supabase'; // Updated import path
import axios from 'axios';

const FileUploader = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files) => {
    const totalFiles = files.length;
    let processedFiles = 0;

    setIsUploading(true);
    setUploadError(null);

    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `uploads/${fileName}`;
      
      try {
        // Upload to Supabase
        const { error: uploadError } = await supabase.storage
          .from('inspection-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('inspection-images')
          .getPublicUrl(filePath);

        // Optionally process the image with Roboflow
        await processImageWithRoboflow(publicUrl);

        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);

      } catch (error) {
        console.error('Error uploading file:', error);
        setUploadError('Failed to upload some files.');
      } finally {
        if (processedFiles === totalFiles) {
          setIsUploading(false);
        }
      }
    }
  };

  const processImageWithRoboflow = async (imageUrl) => {
    try {
      const formData = new FormData();
      formData.append('file', imageUrl);
      formData.append('model', 'roof-damage-b3lgl');

      const response = await axios.post('https://detect.roboflow.com/roof-damage-b3lgl/3', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`,
        },
      });

      // Handle Roboflow response (e.g., display annotations)
      console.log('Roboflow response:', response.data);
    } catch (error) {
      console.error('Error processing image with Roboflow:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    handleUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
  });

  return (
    <Card>
      <CardContent>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
          )}
        </div>
        {isUploading && (
          <Progress value={uploadProgress} className="mt-4" />
        )}
        {uploadError && (
          <p className="text-red-500 mt-2">{uploadError}</p>
        )}
        <Button className="mt-4" onClick={() => document.querySelector('input[type="file"]').click()}>
          Select Files
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUploader;