import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HTMLEditor from '../components/HTMLEditor';
import { Button } from "@/components/ui/button";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const documentTypes = {
  1: { title: 'Inspection Report', template: '<h1>Inspection Report</h1><p>Client: {{name}}</p><p>Company: {{company}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Inspection details go here...</p>' },
  2: { title: 'Invoice', template: '<h1>Invoice</h1><p>Bill To: {{name}}</p><p>Company: {{company}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Invoice details go here...</p>' },
  3: { title: 'Scope of Work', template: '<h1>Scope of Work</h1><p>Client: {{name}}</p><p>Company: {{company}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Scope details go here...</p>' },
  4: { title: 'Material Order Form', template: '<h1>Material Order Form</h1><p>Customer: {{name}}</p><p>Company: {{company}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>Order details go here...</p>' },
  5: { title: 'Job Completion Certificate', template: '<h1>Job Completion Certificate</h1><p>Client: {{name}}</p><p>Company: {{company}}</p><p>Email: {{email}}</p><p>Phone: {{phone}}</p><p>This is to certify that the job has been completed...</p>' },
};

const contacts = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', company: 'ABC Corp' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', company: 'XYZ Inc' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '345-678-9012', company: '123 LLC' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '456-789-0123', company: 'DEF Co' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '567-890-1234', company: 'GHI Ltd' },
];

const DocumentEditor = () => {
  const { templateId, contactId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const template = documentTypes[templateId];
    const contact = contacts.find(c => c.id === parseInt(contactId));
    if (template && contact) {
      let mergedContent = template.template;
      Object.entries(contact).forEach(([key, value]) => {
        mergedContent = mergedContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
      setContent(mergedContent);
    }
  }, [templateId, contactId]);

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
    // Implement email sending logic here
    console.log('Sending email with content:', content);
    alert('Email sent successfully!');
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">{documentTypes[templateId].title}</h1>
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
