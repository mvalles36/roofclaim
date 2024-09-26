export const setContactCookie = (contactData) => {
  const encodedData = btoa(JSON.stringify(contactData));
  document.cookie = `contactData=${encodedData}; path=/; max-age=86400`; // Expires in 1 day
};

export const getContactCookie = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('contactData='));
  
  if (cookieValue) {
    const encodedData = cookieValue.split('=')[1];
    return JSON.parse(atob(encodedData));
  }
  return null;
};