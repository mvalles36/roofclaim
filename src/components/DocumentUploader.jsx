import React from 'react';
import { useDropzone } from 'react-dropzone';
import DocumentUploader from '../services/DocumentUploader'; // Import the backend logic

const DocumentUploaderComponent = ({ onUpload }) => {
  const onDrop = async (acceptedFiles) => {
    try {
      const file = acceptedFiles[0]; // Assuming single file upload for simplicity
      const { data, error } = await DocumentUploader.upload(file, 'report');

      if (error) {
        console.error('Error uploading document:', error);
      } else {
        console.log('Document uploaded successfully:', data);
        onUpload(); // Callback to refresh or update state
      }
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag 'n' drop a file here, or click to select a file</p>
      )}
    </div>
  );
};

export default DocumentUploaderComponent;
