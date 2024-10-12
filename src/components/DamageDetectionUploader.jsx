import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DamageDetectionUploader = ({ onUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card>
      <CardContent>
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        <Button className="mt-4" onClick={() => document.querySelector('input[type="file"]').click()}>
          Select Files
        </Button>
      </CardContent>
    </Card>
  );
};

export default DamageDetectionUploader;