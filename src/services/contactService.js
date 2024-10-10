// In a real application, this would make API calls to your backend
// For now, we'll use localStorage to simulate data persistence

export const fetchContacts = async () => {
  const contacts = localStorage.getItem('contacts');
  return contacts ? JSON.parse(contacts) : [];
};

export const createContact = async (newContact) => {
  const contacts = await fetchContacts();
  const updatedContacts = [...contacts, { ...newContact, id: Date.now().toString() }];
  localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  return newContact;
};