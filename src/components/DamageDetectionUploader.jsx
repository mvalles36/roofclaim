import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const DamageDetectionUploader = ({ onUpload, uploadError }) => {
  const [progresses, setProgresses] = useState({});

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    if (typeof onUpload === 'function') {
      onUpload(acceptedFiles, handleFileProgress);
    }
  }, [onUpload]);

  // Update progress for a file
  const handleFileProgress = (fileName, progress) => {
    setProgresses((prev) => ({
      ...prev,
      [fileName]: progress,
    }));
  };

  // Configure the dropzone options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: 'image/*',
    multiple: true,
  });

  return (
    <Card>
      <CardContent>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          aria-label="Drag and drop files here, or click to select files"
          role="button"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag &apos;n&apos; drop files here, or click to select files</p>
          )}
        </div>
        <div className="mt-4">
          {Object.keys(progresses).length > 0 && (
            Object.entries(progresses).map(([fileName, progress]) => (
              <div key={fileName} className="mb-2">
                <p className="text-sm font-medium">{fileName}</p>
                <Progress value={progress} className="mt-1" />
              </div>
            ))
          )}
        </div>
        {uploadError && (
          <p className="text-red-500 mt-2">{uploadError}</p>
        )}
        <Button
          className="mt-4"
          onClick={() => document.querySelector('input[type="file"]').click()}
          aria-label="Select files"
        >
          Select Files
        </Button>
      </CardContent>
    </Card>
  );
};

export default DamageDetectionUploader;
