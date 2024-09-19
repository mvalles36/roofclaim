import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';

const DocumentEditor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);

  useEffect(() => {
    // Fetch contacts from API or other sources
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/contacts');
        setContacts(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  const handleContactSelection = (value) => {
    setSelectedContact(value);
  };

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/documents/generate-document', {
        templateId: selectedTemplate,
        contactDetails: { name: selectedContact }
      });
      setDocumentFile(response.data.filePath);
    } catch (error) {
      console.error('Error generating document:', error);
    }
    setIsGenerating(false);
  };

  const handleSaveTemplate = async () => {
    try {
      await axios.post('/api/documents/save-document', {
        filePath: documentFile,
        content: editorContent
      });
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleEmailDocument = async () => {
    try {
      await axios.post('/api/documents/email-document', {
        filePath: documentFile,
        contactEmail: selectedContact.email // Ensure email is included in contact details
      });
    } catch (error) {
      console.error('Error emailing document:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>DocuEditor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <div className="w-1/3">
            <Label htmlFor="contact">Select Contact</Label>
            <Select onValueChange={handleContactSelection}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>{contact.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerateDocument} disabled={!selectedTemplate || !selectedContact || isGenerating}>
            {isGenerating ? 'Generating Document...' : 'Generate Document'}
          </Button>
        </div>
        {selectedTemplate && (
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">{selectedTemplate.name}</h3>
            {isEditing ? (
              <>
                <textarea
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="w-full h-64 p-2 border rounded"
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSaveTemplate}>Save Template</Button>
                </div>
              </>
            ) : (
              <div className="border p-4 rounded bg-white h-64 overflow-auto">
                <pre>{editorContent}</pre>
              </div>
            )}
            <Button onClick={handleEmailDocument} disabled={!documentFile}>
              Email Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentEditor;
