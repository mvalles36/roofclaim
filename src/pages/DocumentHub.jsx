import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import { FileText, Search } from 'lucide-react';
import DocumentEditor from './components/DocumentEditor';
import TemplateLibrary from './components/TemplateLibrary';

const DocumentHub = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('templates').select('*');
      if (error) throw error;
      return data;
    },
  });

  const handleSearchContact = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .ilike('full_name', `%${searchTerm}%`)
      .limit(1);

    if (error) {
      console.error('Error searching contact:', error);
    } else if (data.length > 0) {
      setSelectedContact(data[0]);
    } else {
      alert('No contact found');
    }
  };

  const handleGenerateDocument = () => {
    // This function will be passed to TemplateLibrary
    console.log('Generating document with template:', selectedTemplate);
  };

  if (isLoading) return <div>Loading templates...</div>;
  if (error) return <div>Error loading templates: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Document Hub</h1>
      <TemplateLibrary 
        templates={templates} 
        setSelectedTemplate={setSelectedTemplate}
        handleGenerateDocument={handleGenerateDocument}
      />
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Select Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="Search contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button onClick={handleSearchContact}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
            {selectedContact && (
              <div className="mt-4">
                <h3 className="font-semibold">{selectedContact.full_name}</h3>
                <p>{selectedContact.email}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {selectedTemplate && selectedContact && (
        <DocumentEditor
          template={selectedTemplate}
          contact={selectedContact}
        />
      )}
    </div>
  );
};

export default DocumentHub;
