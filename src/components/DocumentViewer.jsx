import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentViewer = ({ documents, selectedDocument, onSelectDocument }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={(value) => onSelectDocument(documents.find(doc => doc.id === parseInt(value)))}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select a document to view" />
          </SelectTrigger>
          <SelectContent>
            {documents.map((doc) => (
              <SelectItem key={doc.id} value={doc.id.toString()}>{doc.type} - {new Date(doc.id).toLocaleString()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedDocument && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">{selectedDocument.type} - {new Date(selectedDocument.id).toLocaleString()}</h3>
            <div dangerouslySetInnerHTML={{ __html: selectedDocument.content }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentViewer;
