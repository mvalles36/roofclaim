import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HTMLEditor from '../components/HTMLEditor';
import VariableManager from '../components/VariableManager';
import ImageUploader from '../components/ImageUploadComponent';
import EmailSender from '../components/ComposeEmail';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

const SmartDocs = () => {
  const { action, templateId } = useParams();
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variables, setVariables] = useState({});
  const [images, setImages] = useState({});

  useEffect(() => {
    if (templateId && documentTypes[templateId]) {
      setSelectedTemplate({
        id: templateId,
        title: documentTypes[templateId].title,
        type: documentTypes[templateId].type,
        content: '<p>This is a sample template content.</p>'
      });
    }
  }, [templateId]);

  const handleSaveTemplate = (updatedTemplate) => {
    setSelectedTemplate(updatedTemplate);
    console.log('Saving template:', updatedTemplate);
  };

  const handleVariableChange = (key, value) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (newImage) => {
    setImages(prev => ({ ...prev, [newImage.variableName]: newImage.src }));
  };

  const generateDocument = () => {
    const doc = new jsPDF();
    const content = applyVariablesAndImages(selectedTemplate.content, variables, images);
    
    doc.html(content, {
      callback: function (doc) {
        doc.save(`${selectedTemplate.title}.pdf`);
      },
      x: 10,
      y: 10,
    });
  };

  const sendEmail = () => {
    console.log('Sending email with template:', selectedTemplate.title);
    alert('Email sent successfully!');
  };

  const applyVariablesAndImages = (content, variables, images) => {
    let appliedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      appliedContent = appliedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    Object.entries(images).forEach(([key, value]) => {
      appliedContent = appliedContent.replace(new RegExp(`{{${key}}}`, 'g'), `<img src="${value}" alt="${key}" />`);
    });
    return appliedContent;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/smart-docs">Smart Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>{action === 'edit' ? 'Edit' : 'New'} {selectedTemplate?.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      <h1 className="text-2xl font-bold mb-4">{action === 'edit' ? 'Edit' : 'Create New'} {selectedTemplate?.title}</h1>
      
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="border p-4 rounded-lg">
          <HTMLEditor
            initialContent={selectedTemplate?.content || ''}
            onSave={handleSaveTemplate}
            variables={variables}
            images={images}
          />
        </TabsContent>
        <TabsContent value="variables" className="border p-4 rounded-lg">
          <VariableManager
            variables={variables}
            onVariableChange={handleVariableChange}
          />
        </TabsContent>
        <TabsContent value="images" className="border p-4 rounded-lg">
          <ImageUploader onImageUpload={handleImageUpload} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 flex justify-between">
        <Button onClick={() => navigate('/smart-docs')} variant="outline">
          Back to Library
        </Button>
        <div>
          <Button onClick={generateDocument} className="mr-2">
            Generate PDF
          </Button>
          <EmailSender onSend={sendEmail} />
        </div>
      </div>
    </div>
  );
};

export default SmartDocs;
