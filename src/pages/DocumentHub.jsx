import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import HTMLEditor from '../components/HTMLEditor';
import TemplateLibrary from '../components/TemplateLibrary';
import EmailSequenceBuilder from '../components/EmailSequenceBuilder';
import { useContacts } from '../integrations/supabase/hooks/useContacts';
import { toast } from 'sonner';

const DocumentHub = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  const { data: contacts } = useContacts();

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (selectedContact) {
      mergeContactFields(template, selectedContact);
    } else {
      toast.error('Please select a contact first');
    }
  };

  const handleContactSelect = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    setSelectedContact(contact);
    if (selectedTemplate) {
      mergeContactFields(selectedTemplate, contact);
    }
  };

  const mergeContactFields = (template, contact) => {
    let content = '';
    switch (template.name) {
      case 'Inspection Report':
        content = `<h1>Inspection Report</h1><p>Client: ${contact.full_name}</p><p>Email: ${contact.email}</p><p>Phone: ${contact.phone}</p><p>Inspection details go here...</p>`;
        break;
      case 'Invoice':
        content = `<h1>Invoice</h1><p>Bill To: ${contact.full_name}</p><p>Email: ${contact.email}</p><p>Phone: ${contact.phone}</p><p>Invoice details go here...</p>`;
        break;
      // Add cases for other templates
      default:
        content = `<h1>${template.name}</h1><p>Document for: ${contact.full_name}</p>`;
    }
    setDocumentContent(content);
  };

  const handleSave = (updatedContent) => {
    setDocumentContent(updatedContent);
    toast.success('Document saved successfully');
  };

  const handleSaveSequence = (sequence) => {
    // Handle saving the sequence (e.g., update state, send to backend)
    console.log('Sequence saved:', sequence);
    toast.success('Sequence saved successfully');
  };

  const handleStartSequence = (sequenceId, contactIds) => {
    // Handle starting the sequence (e.g., trigger emails, update backend)
    console.log('Starting sequence:', sequenceId, 'for contacts:', contactIds);
    toast.success('Sequence started successfully');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DocuHub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <TemplateLibrary onSelectTemplate={handleTemplateSelect} />
          <EmailSequenceBuilder
            onSaveSequence={handleSaveSequence}
            onStartSequence={handleStartSequence}
          />
        </div>
        
        <div className="md:col-span-2">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Contact Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={handleContactSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts?.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>{contact.full_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedTemplate && selectedContact && (
            <Card>
              <CardHeader>
                <CardTitle>Document Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <HTMLEditor initialContent={documentContent} onSave={handleSave} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentHub;