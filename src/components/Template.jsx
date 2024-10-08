import React, { useState } from 'react';
import HTMLEditor from './HTMLEditor';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import html2pdf from 'html2pdf.js';

const Template = ({ template, onSave, variables }) => {
  const [content, setContent] = useState(template.content);

  const handleSave = (updatedContent) => {
    setContent(updatedContent);
    onSave({ ...template, content: updatedContent });
  };

  const generatePDF = () => {
    const element = document.createElement('div');
    element.innerHTML = applyVariables(content, variables);
    html2pdf().from(element).save(`${template.title}.pdf`);
  };

  const applyVariables = (content, variables) => {
    let appliedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      appliedContent = appliedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return appliedContent;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{template.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <HTMLEditor initialContent={content} onSave={handleSave} />
        <div className="mt-4 flex justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Preview</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Document Preview</DialogTitle>
              </DialogHeader>
              <div className="mt-4 p-4 border rounded" dangerouslySetInnerHTML={{ __html: applyVariables(content, variables) }} />
            </DialogContent>
          </Dialog>
          <Button onClick={generatePDF}>Generate PDF</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Template;
