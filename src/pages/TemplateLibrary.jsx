import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Edit, PlusCircle, Clipboard, Calculator, ShoppingCart, CheckSquare, Shield } from 'lucide-react';

const documentTypes = [
  { id: 1, title: 'Inspection Report', icon: Clipboard, description: 'Detailed assessment of property condition' },
  { id: 2, title: 'Invoice', icon: Calculator, description: 'Itemized bill for services rendered' },
  { id: 3, title: 'Scope of Work', icon: FileText, description: 'Detailed outline of project tasks and deliverables' },
  { id: 4, title: 'Material Order Form', icon: ShoppingCart, description: 'List of required materials for job' },
  { id: 5, title: 'Job Completion Certificate', icon: CheckSquare, description: 'Confirmation of completed work' },
];

const contacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', company: 'ABC Corp' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', company: 'XYZ Inc' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '345-678-9012', company: '123 LLC' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '456-789-0123', company: 'DEF Co' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '567-890-1234', company: 'GHI Ltd' },
];

const TemplateLibrary = () => {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState(null);

  const handleDocumentAction = (documentId) => {
    if (selectedContact) {
      navigate(`/editor/${documentId}/${selectedContact}`);
    } else {
      alert('Please select a contact first');
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Document Templates</h1>
      <div className="mb-6">
        <Select onValueChange={setSelectedContact}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a contact" />
          </SelectTrigger>
          <SelectContent>
            {contacts.map((contact) => (
              <SelectItem key={contact.id} value={contact.id.toString()}>
                {contact.name} - {contact.company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentTypes.map((doc) => {
          const IconComponent = doc.icon;
          return (
            <Card key={doc.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconComponent className="h-8 w-8 mr-2 text-primary" />
                  <span>{doc.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">{doc.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDocumentAction(doc.id)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateLibrary;
