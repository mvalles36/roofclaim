import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';

const DamageDetectionUploader = ({ onUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setProcessing(true);
    const totalFiles = acceptedFiles.length;
    let processedFiles = 0;

    for (const file of acceptedFiles) {
      try {
        // Upload to Supabase
        const { data, error } = await supabase.storage
          .from('damage-detection-images')
          .upload(`${Date.now()}-${file.name}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('damage-detection-images')
          .getPublicUrl(data.path);

        // Process with Roboflow
        const imageBase64 = await convertToBase64(file);
        const roboflowResponse = await processWithRoboflow(imageBase64);

        // Save image data to Supabase
        await supabase.from('damage_detection_images').insert({
          url: publicUrl,
          annotations: roboflowResponse.predictions,
        });

        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    setProcessing(false);
    onUpload();
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*', multiple: true });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const processWithRoboflow = async (imageBase64) => {
    try {
      const response = await axios({
        method: "POST",
        url: "https://detect.roboflow.com/roof-damage-b3lgl/3",
        params: {
          api_key: "FIkWeTUAWe90ISDBoSyI"
        },
        data: imageBase64,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error processing with Roboflow:', error);
      throw error;
    }
  };

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {processing && <Progress value={uploadProgress} className="mt-4" />}
    </div>
  );
};

export default DamageDetectionUploader;
