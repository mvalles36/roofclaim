// src/components/ImageUploadComponent.jsx
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';

const ImageUploadComponent = ({ onUpload }) => {
  const onDrop = async (acceptedFiles) => {
    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
          .from('inspection-images')
          .upload(`${Date.now()}-${file.name}`, file);

        if (error) throw error;

        // Get the public URL of the uploaded file
        const { publicUrl } = supabase.storage.from('inspection-images').getPublicUrl(data.path);

        // Process the image with Roboflow
        await processImageWithRoboflow(publicUrl);
      });

      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      onUpload(); // Callback to handle after upload
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const processImageWithRoboflow = async (imageUrl) => {
    try {
      const response = await axios.post(
        'https://detect.roboflow.com/roof-damage-b3lgl/3', // Update this with your actual model endpoint
        { image: imageUrl }, // Send the image URL in the request body
        {
          headers: {
            'Content-Type': 'application/json', // Change to application/json
            'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`,
          },
        }
      );

      // Handle the response from Roboflow
      console.log(response.data);
      // You should implement any state updates or UI changes based on the response
    } catch (error) {
      console.error('Error processing image with Roboflow:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default ImageUploadComponent;
