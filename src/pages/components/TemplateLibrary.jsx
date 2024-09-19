import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Edit, Trash2, Upload } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TemplateLibrary = ({
  templates,
  searchTerm,
  setSearchTerm,
  handleTemplateSelection,
  handleDeleteTemplate,
  handleDragEnd,
  handleUploadTemplate
}) => {
  // Filtering templates based on the search term
  const filteredTemplates = templates.filter(
    (template) => template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Hub - Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          {/* Search Input */}
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3"
          />
          {/* Upload Template Button */}
          <Button onClick={handleUploadTemplate}>
            <Upload className="mr-2 h-4 w-4" /> Upload Template
          </Button>
        </div>
        
        {/* Drag and Drop Context for Reordering Templates */}
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
                        {/* Template Icon and Name */}
                        <FileText className="h-12 w-12 text-gray-500 mb-2" />
                        <p className="text-center text-sm">{template.name}</p>
                        
                        {/* Edit and Delete Buttons */}
                        <div className="flex mt-2">
                          <Button variant="ghost" size="sm" onClick={() => handleTemplateSelection(template)}>
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
  );
};

export default TemplateLibrary;
