import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { supabase } from '../integrations/supabase/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const DamageDetectionUploader = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
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
          .from('drone-images')
          .upload(`${Date.now()}-${file.name}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('drone-images')
          .getPublicUrl(data.path);

        // Process with Roboflow
        const imageBase64 = await convertToBase64(file);
        const roboflowResponse = await processWithRoboflow(imageBase64);

        setUploadedImages(prev => [...prev, { url: publicUrl, predictions: roboflowResponse.predictions }]);

        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }
    setProcessing(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
    <Card>
      <CardHeader>
        <CardTitle>Damage Detection Uploader</CardTitle>
      </CardHeader>
      <CardContent>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        {processing && <Progress value={uploadProgress} className="mt-4" />}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative">
              <img src={image.url} alt={`Uploaded ${index}`} className="w-full h-48 object-cover rounded" />
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {image.predictions.map((pred, predIndex) => (
                  <rect
                    key={predIndex}
                    x={pred.x - pred.width / 2 + '%'}
                    y={pred.y - pred.height / 2 + '%'}
                    width={pred.width + '%'}
                    height={pred.height + '%'}
                    fill="none"
                    stroke="red"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>
              {image.predictions.map((pred, predIndex) => (
                <div
                  key={predIndex}
                  className="absolute text-xs bg-red-500 text-white px-1 rounded"
                  style={{
                    left: `${pred.x - pred.width / 2}%`,
                    top: `${pred.y - pred.height / 2}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  {pred.class}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DamageDetectionUploader;