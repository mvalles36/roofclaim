import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DocumentEditor = ({
  selectedTemplate,
  contacts,
  selectedContact,
  handleContactSelection,
  handleGenerateDocument,
  editorContent,
  setEditorContent,
  isEditing,
  setIsEditing,
  handleSaveTemplate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DocuEditor</CardTitle>
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
              <div className="border p-4 rounded bg-white h-64 overflow-auto">
                <pre>{editorContent}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentEditor;
