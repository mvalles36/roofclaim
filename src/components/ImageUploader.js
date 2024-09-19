import React from 'react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';

const ImageUploader = ({ onUpload }) => {
  const onDrop = async (acceptedFiles) => {
    try {
      for (const file of acceptedFiles) {
        const { data, error } = await supabase.storage
          .from('inspection-images')
          .upload(`${Date.now()}-${file.name}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('inspection-images')
          .getPublicUrl(data.path);

        await processImageWithRoboflow(publicUrl);
      }
      onUpload();
    } catch (error) {
      console.error('Error uploading image:', error);
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
      // You should handle the response and update your state accordingly
      console.log(response.data);
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

export default ImageUploader;
