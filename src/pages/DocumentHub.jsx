import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HTMLEditor from '../components/HTMLEditor';
import VariableManager from '../components/VariableManager';
import ImageUploadComponent from '../components/ImageUploadComponent';
import ComposeEmail from '../components/ComposeEmail';
import DocumentViewer from '../components/DocumentViewer';
import DocumentUploader from '../components/DocumentUploader';

const documentTypes = {
  1: { title: 'Inspection Report', type: 'report' },
  2: { title: 'Invoice', type: 'invoice' },
  3: { title: 'Scope of Work', type: 'scope' },
  4: { title: 'Contingency Agreement', type: 'agreement' },
  5: { title: 'Material Order Form', type: 'order' },
  6: { title: 'Job Completion Certificate', type: 'certificate' },
  7: { title: 'Warranty Document', type: 'warranty' },
  8: { title: 'Safety Inspection Checklist', type: 'checklist' },
};

const DocumentHub = () => {
  const navigate = useNavigate();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documents, setDocuments] = useState([]);

  const handleDocumentSelect = (docId) => {
    setSelectedDocument(documentTypes[docId]);
  };

  const handleDocumentUpload = (newDocument) => {
    setDocuments([...documents, newDocument]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Document Hub</h1>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create New Document</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={handleDocumentSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(documentTypes).map(([id, doc]) => (
                <SelectItem key={id} value={id}>{doc.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedDocument && (
            <Button onClick={() => navigate(`/document-editor/${selectedDocument.type}`)} className="mt-2">
              Create {selectedDocument.title}
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentUploader onUpload={handleDocumentUpload} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>View Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentViewer documents={documents} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentHub;