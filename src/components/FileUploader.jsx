import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const FileUploader = ({ label, onUpload, file }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        type="file"
        onChange={handleFileChange}
      />
      {file && <p>File uploaded: {file.name}</p>}
    </div>
  );
};