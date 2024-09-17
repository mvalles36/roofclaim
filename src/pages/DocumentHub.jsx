import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { FileText, Edit, Trash2, Search, Upload } from 'lucide-react';
import { PDFViewer } from '@react-pdf/renderer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const DocumentHub = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchTemplates();
    fetchContacts();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from('document_templates').select('*');
    if (error) {
      console.error('Error fetching templates:', error);
    } else {
      setTemplates(data);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase.from('contacts').select('id, full_name');
    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data);
    }
  };

  const handleTemplateSelection = async (template) => {
    setSelectedTemplate(template);
    const { data, error } = await supabase
      .from('document_templates')
      .select('content')
      .eq('id', template.id)
      .single();
    if (error) {
      console.error('Error fetching template content:', error);
    } else {
      setEditorContent(data.content);
    }
  };

  const handleContactSelection = (contactId) => {
    setSelectedContact(contactId);
    // Pre-fill document with contact information
    if (selectedTemplate && contactId) {
      const contact = contacts.find(c => c.id === contactId);
      let updatedContent = editorContent;
      Object.keys(contact).forEach(key => {
        updatedContent = updatedContent.replace(new RegExp(`{{${key}}}`, 'g'), contact[key]);
      });
      setEditorContent(updatedContent);
    }
  };

  const handleGenerateDocument = () => {
    // Logic to generate and save the document
    console.log('Generating document...');
  };

  const handleSaveTemplate = async () => {
    if (selectedTemplate) {
      const { error } = await supabase
        .from('document_templates')
        .update({ content: editorContent })
        .eq('id', selectedTemplate.id);
      if (error) {
        console.error('Error saving template:', error);
      } else {
        setIsEditing(false);
        fetchTemplates();
      }
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    const { error } = await supabase
      .from('document_templates')
      .delete()
      .eq('id', templateId);
    if (error) {
      console.error('Error deleting template:', error);
    } else {
      fetchTemplates();
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(templates);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTemplates(items);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Document Hub</h1>
      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Template Library</TabsTrigger>
          <TabsTrigger value="editor">Document Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-1/3"
                />
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload Template
                </Button>
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="templates">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-4 gap-4">
                      {filteredTemplates.map((template, index) => (
                        <Draggable key={template.id} draggableId={template.id.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex flex-col items-center justify-center p-4 border rounded cursor-pointer hover:bg-gray-100"
                              onClick={() => handleTemplateSelection(template)}
                            >
                              <FileText className="h-12 w-12 text-gray-500 mb-2" />
                              <p className="text-center text-sm">{template.name}</p>
                              <div className="flex mt-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Document Editor</CardTitle>
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
                <Button onClick={handleGenerateDocument} disabled={!selectedTemplate || !selectedContact}>
                  Generate Document
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
                    <PDFViewer width="100%" height="600px">
                      {/* Render PDF content here */}
                    </PDFViewer>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentHub;
