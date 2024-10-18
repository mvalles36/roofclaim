import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, FileSpreadsheet, FileCheck } from 'lucide-react';

const templates = [
  { id: 1, name: 'Inspection Report', icon: FileText },
  { id: 2, name: 'Invoice', icon: FileSpreadsheet },
  { id: 3, name: 'Scope of Work', icon: FileText },
  { id: 4, name: 'Material Order Form', icon: FileSpreadsheet },
  { id: 5, name: 'Job Completion Certificate', icon: FileCheck },
];

const TemplateLibrary = ({ onSelectTemplate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Library</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Button
                key={template.id}
                variant="ghost"
                className="w-full justify-start mb-2"
                onClick={() => onSelectTemplate(template)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {template.name}
              </Button>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TemplateLibrary;