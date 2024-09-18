import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/supabase";
import { FileText, Edit, Trash2, Upload } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TemplateLibrary from "./components/TemplateLibrary";
import DocumentEditor from "./components/DocumentEditor";

const DocumentHub = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [labeledImages, setLabeledImages] = useState([]);
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchTemplates();
    fetchContacts();
    fetchLabeledImages();
  }, []);

  const fetchTemplates = async () => {
    const { data, error } = await supabase.from("document_templates").select("*");
    if (error) {
      console.error("Error fetching templates:", error);
    } else {
      setTemplates(data);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase.from("contacts").select("id, full_name");
    if (error) {
      console.error("Error fetching contacts:", error);
    } else {
      setContacts(data);
    }
  };

  const fetchLabeledImages = async () => {
    const { data, error } = await supabase.from("damage_detection_images").select("*").not("label_id", "is", null);
    if (error) {
      console.error("Error fetching labeled images:", error);
    } else {
      setLabeledImages(data);
    }
  };

  const handleTemplateSelection = async (template) => {
    setSelectedTemplate(template);
    const { data, error } = await supabase.from("document_templates").select("content").eq("id", template.id).single();
    if (error) {
      console.error("Error fetching template content:", error);
    } else {
      setEditorContent(data.content);
    }
  };

  const handleContactSelection = (contactId) => {
    setSelectedContact(contactId);
    if (selectedTemplate && contactId) {
      const contact = contacts.find((c) => c.id === contactId);
      let updatedContent = editorContent;
      Object.keys(contact).forEach((key) => {
        updatedContent = updatedContent.replace(new RegExp(`{{${key}}}`, "g"), contact[key]);
      });
      setEditorContent(updatedContent);
    }
  };

  const handleGenerateDocument = () => {
    let updatedContent = editorContent;
    labeledImages.forEach((image) => {
      const placeholder = `{{image:${image.label_id}}}`;
      if (updatedContent.includes(placeholder)) {
        updatedContent = updatedContent.replace(placeholder, `<img src="${image.url}" alt="${image.label_id}" />`);
      }
    });
    setEditorContent(updatedContent);
  };

  const handleSaveTemplate = async () => {
    if (selectedTemplate) {
      const { error } = await supabase.from("document_templates").update({ content: editorContent }).eq("id", selectedTemplate.id);
      if (error) {
        console.error("Error saving template:", error);
      } else {
        setIsEditing(false);
        fetchTemplates();
      }
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    const { error } = await supabase.from("document_templates").delete().eq("id", templateId);
    if (error) {
      console.error("Error deleting template:", error);
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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Document Hub</h1>
      <Tabs defaultValue="library">
        <TabsList>
          <TabsTrigger value="library">Template Library</TabsTrigger>
          <TabsTrigger value="editor">Document Editor</TabsTrigger>
        </TabsList>
        <TabsContent value="library">
          <TemplateLibrary
            templates={templates}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleTemplateSelection={handleTemplateSelection}
            handleDeleteTemplate={handleDeleteTemplate}
            handleDragEnd={handleDragEnd}
          />
        </TabsContent>
        <TabsContent value="editor">
          <DocumentEditor
            selectedTemplate={selectedTemplate}
            contacts={contacts}
            selectedContact={selectedContact}
            handleContactSelection={handleContactSelection}
            handleGenerateDocument={handleGenerateDocument}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveTemplate={handleSaveTemplate}
            labeledImages={labeledImages}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentHub;
