import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { FileText, Settings } from 'lucide-react';
import { Editor } from '@syncfusion/ej2-react-documenteditor';

const DocumentHub = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    fetchTemplates();
    fetchContacts();
  }, []);

  const fetchTemplates = async () => {
    // In a real application, fetch templates from your backend
    const dummyTemplates = [
      { id: 1, name: 'Inspection Report', icon: 'clipboard-list' },
      { id: 2, name: 'Estimate', icon: 'calculator' },
      { id: 3, name: 'Contract', icon: 'file-text' },
      { id: 4, name: 'Invoice', icon: 'credit-card' },
      { id: 5, name: 'Thank You Letter', icon: 'mail' },
    ];
    setTemplates(dummyTemplates);
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase.from('contacts').select('id, full_name');
    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data);
    }
  };

  const handleTemplateSelection = (template) => {
    setSelectedTemplate(template);
    // In a real application, fetch the template content from your backend
    setEditorContent(`This is a sample content for the ${template.name} template.`);
  };

  const handleContactSelection = (contactId) => {
    setSelectedContact(contactId);
    // In a real application, fetch contact details and update the document content
    updateDocumentWithContactInfo(contactId);
  };

  const updateDocumentWithContactInfo = async (contactId) => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single();

    if (error) {
      console.error('Error fetching contact details:', error);
    } else {
      const updatedContent = editorContent
        .replace('{{full_name}}', data.full_name)
        .replace('{{email}}', data.email)
        .replace('{{phone_number}}', data.phone_number)
        .replace('{{address}}', data.address);
      setEditorContent(updatedContent);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Document Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Template Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="flex flex-col items-center justify-center p-4 border rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => handleTemplateSelection(template)}
                >
                  <FileText className="h-12 w-12 text-gray-500 mb-2" />
                  <p className="text-center text-sm">{template.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Document Editor</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <>
                <div className="mb-4">
                  <Select onValueChange={handleContactSelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Editor
                  height="500px"
                  isReadOnly={false}
                  enableEditor={true}
                  enableSelection={true}
                  enableContextMenu={true}
                  enableImageResizer={true}
                  enableEditorHistory={true}
                  enableHyperlinkDialog={true}
                  enableTableDialog={true}
                  enableTrackChanges={true}
                  enableSearch={true}
                  enableFootnoteAndEndnote={true}
                  enableEditor={true}
                  enableRtl={true}
                  enableWordExport={true}
                  enablePdfExport={true}
                  value={editorContent}
                  change={(args) => setEditorContent(args.value)}
                />
                <div className="mt-4 flex justify-end space-x-2">
                  <Button>Save Draft</Button>
                  <Button>Generate Document</Button>
                </div>
              </>
            ) : (
              <p>Select a template to start editing</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DocumentHub;
