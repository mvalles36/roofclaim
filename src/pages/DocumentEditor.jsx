import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentEditor = () => {
  const [content, setContent] = useState('');
  const [documentType, setDocumentType] = useState('');

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleDocumentTypeChange = (value) => {
    setDocumentType(value);
  };

  const handleSave = () => {
    console.log('Saving document:', { type: documentType, content });
    // Here you would typically send this data to your backend
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Document Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="document-type">Document Type</Label>
            <Select onValueChange={handleDocumentTypeChange} value={documentType}>
              <SelectTrigger id="document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="invoice">Invoice</SelectItem>
                <SelectItem value="report">Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Enter document content here..."
              value={content}
              onChange={handleContentChange}
              className="min-h-[200px]"
            />
          </div>
          <Button onClick={handleSave}>Save Document</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentEditor;