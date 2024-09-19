import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const DamageDetectionUploader = ({ onUpload, uploadProgress, uploadError }) => {
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the uploaded files
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: true });

  return (
    <Card>
      <CardContent>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the folder here ...</p>
          ) : (
            <p>Drag 'n' drop a folder here, or click to select files</p>
          )}
        </div>
        {uploadProgress > 0 && (
          <Progress value={uploadProgress} className="mt-4" />
        )}
        {uploadError && (
          <p className="text-red-500 mt-2">{uploadError}</p>
        )}
        <Button className="mt-4" onClick={() => document.querySelector('input').click()}>
          Select Files
        </Button>
      </CardContent>
    </Card>
  );
};

export default DamageDetectionUploader;
