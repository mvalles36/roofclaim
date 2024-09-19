import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit, Trash2 } from "lucide-react";

const TemplateLibrary = ({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  handleGenerateDocument,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-4 border rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedTemplate(template)}
            >
              <FileText className="h-12 w-12 mb-2" />
              <p className="text-center text-sm">{template.name}</p>
              <div className="flex justify-between mt-2">
                <Button onClick={() => handleGenerateDocument()}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={() => {/* Handle Delete */}}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateLibrary;
