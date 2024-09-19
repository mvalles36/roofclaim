// src/services/DocumentApi.js
import axios from 'axios';

export const generateDocument = async (templateId, contactId) => {
  const response = await axios.post('/api/generate-document', {
    templateId,
    contactId
  });
  return response.data.content;
};

export const saveDocument = async (content, contactId, templateId) => {
  await axios.post('/api/save-document', {
    content,
    contactId,
    templateId
  });
};

export const emailDocument = async (content, contactId) => {
  await axios.post('/api/email-document', {
    content,
    contactId
  });
};
