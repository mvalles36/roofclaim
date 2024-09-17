import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { FileUploader } from '../components/FileUploader';
import axios from 'axios';
import { FileText, Settings } from 'lucide-react';

const DocumentHub = () => {
  const [templates, setTemplates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const templatesPerPage = 5;

  useEffect(() => {
    fetchTemplates();
    fetchDocuments();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('templates')
      .select('*');

    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data);
    }
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*');

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data);
    }
  };

  const handleDocumentSelection = (documentId) => {
    console.log('Selected document:', documentId);
  };

  const handleTemplateSelection = (templateId) => {
    console.log('Selected template:', templateId);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">DocumentHub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Document List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {documents.map((document) => (
                <li key={document.id} onClick={() => handleDocumentSelection(document.id)}>
                  {document.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Document Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Document editor placeholder</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Template Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.slice((currentPage - 1) * templatesPerPage, currentPage * templatesPerPage).map((template) => (
              <div key={template.id} className="flex flex-col items-center justify-center">
                <FileText className="h-16 w-16 text-gray-500" />
                <p className="text-center">{template.name}</p>
                <Button onClick={() => handleTemplateSelection(template.id)}>Select</Button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
            <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage * templatesPerPage >= templates.length}>Next</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentHub;
