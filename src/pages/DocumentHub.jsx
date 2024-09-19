import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DocumentEditor from './components/DocumentEditor';

// Placeholder TemplateLibrary component
const TemplateLibrary = ({ selectedTemplate, setSelectedTemplate, handleGenerateDocument }) => (
  <div>
    <h3>Template Library</h3>
    <Button onClick={handleGenerateDocument}>Generate Document</Button>
  </div>
);

const DocumentHub = ({ contacts, jobs }) => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isGeneratingDocument, setIsGeneratingDocument] = useState(false);

  const handleContactSelection = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    setSelectedContact(contact);
    const associatedJob = jobs.find((job) => job.customer_id === contactId);
    setSelectedJob(associatedJob);
  };

  const handleGenerateDocument = () => {
    if (selectedTemplate) {
      setIsGeneratingDocument(true);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>DocumentHub</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search Contacts..."
            onChange={(e) => handleContactSelection(e.target.value)}
          />
        </div>
        {selectedContact && (
          <>
            <TemplateLibrary
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              handleGenerateDocument={handleGenerateDocument}
            />
            {isGeneratingDocument && (
              <DocumentEditor
                selectedTemplate={selectedTemplate}
                selectedContact={selectedContact}
                selectedJob={selectedJob}
                contacts={contacts}
                jobs={jobs}
                setIsGeneratingDocument={setIsGeneratingDocument}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentHub;
