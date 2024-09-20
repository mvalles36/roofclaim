import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '../integrations/supabase/supabase';
import { FileText, Search } from 'lucide-react';
import DocumentEditor from './components/DocumentEditor';

const DocumentHub = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from('templates').select('*');
    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data);
    }
  };

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

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Document Hub</h1>
      <Card>
        <CardHeader>
          <CardTitle>Template Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTemplate(template)}>
                <CardContent className="flex items-center p-4">
                  <FileText className="w-8 h-8 mr-4 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
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
