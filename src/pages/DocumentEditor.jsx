import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HTMLEditor from '../components/HTMLEditor';
import { Button } from "@/components/ui/button";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Contacts from './Contacts'; // Import the Contacts component

const documentTypes = {
  1: { title: 'Inspection Report', template: '<h1>Inspection Report</h1><p>Client: {{first_name}} {{last_name}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Inspection details go here...</p>' },
  2: { title: 'Invoice', template: '<h1>Invoice</h1><p>Bill To: {{first_name}} {{last_name}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Invoice details go here...</p>' },
  3: { title: 'Scope of Work', template: '<h1>Scope of Work</h1><p>Client: {{first_name}} {{last_name}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Scope details go here...</p>' },
  4: { title: 'Material Order Form', template: '<h1>Material Order Form</h1><p>Customer: {{first_name}} {{last_name}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Order details go here...</p>' },
  5: { title: 'Job Completion Certificate', template: '<h1>Job Completion Certificate</h1><p>Client: {{first_name}} {{last_name}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>This is to certify that the job has been completed...</p>' },
};

const DocumentEditor = () => {
  const { templateId, contactId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Dummy state for selected contact from the Contacts component
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    if (selectedContact) {
      const template = documentTypes[templateId];
      if (template) {
        let mergedContent = template.template;
        Object.entries(selectedContact).forEach(([key, value]) => {
          mergedContent = mergedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
        });
        setContent(mergedContent);
      }
    }
  }, [templateId, selectedContact]);

  const handleSave = (updatedContent) => {
    setContent(updatedContent);
    setIsEditing(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.html(content, {
      callback: function (doc) {
        doc.save(`${documentTypes[templateId].title}.pdf`);
      },
      x: 10,
      y: 10,
    });
  };

  const sendEmail = () => {
    console.log('Sending email with content:', content);
    alert('Email sent successfully!');
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">{documentTypes[templateId].title}</h1>

      {/* Insert the Contacts component to dynamically fetch contacts */}
      <Contacts onSelectContact={(contact) => setSelectedContact(contact)} />

      {isEditing ? (
        <HTMLEditor initialContent={content} onSave={handleSave} />
      ) : (
        <div className="border p-4 rounded-lg mb-4" dangerouslySetInnerHTML={{ __html: content }} />
      )}
      <div className="flex justify-between mt-4">
        <Button onClick={() => navigate('/')} variant="outline">
          Back to Library
        </Button>
        <div>
          <Button onClick={() => setIsEditing(!isEditing)} className="mr-2">
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          <Button onClick={generatePDF} className="mr-2">
            Download PDF
          </Button>
          <Button onClick={sendEmail}>
            Send Email
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
