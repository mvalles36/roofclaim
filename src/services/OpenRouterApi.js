import axios from 'axios';

const openRouterClient = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    'HTTP-Referer': import.meta.env.VITE_SITE_URL,
    'X-Title': import.meta.env.VITE_SITE_NAME
  }
});

export const generateContactScore = async (contactData, interactions) => {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: 'anthropic/claude-2',
      messages: [{
        role: 'user',
        content: `Analyze this prospect data and generate a score from 0-100:
          Contact: ${contactData.name}
          Address: ${contactData.address}
          Email opens: ${interactions.email.opens}
          Email clicks: ${interactions.email.clicks}
          Website visits: ${interactions.website.visits}
          Pages visited: ${interactions.website.pagesVisited}
          Documents opened: ${interactions.documents.opened}
          Last activity: ${interactions.lastActivity}`
      }]
    });
    
    return {
      score: parseInt(response.data.choices[0].message.content),
      analysis: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error generating contact score:', error);
    throw error;
  }
};

export const generateSalesInsights = async (contactHistory) => {
  try {
    const response = await openRouterClient.post('/chat/completions', {
      model: 'anthropic/claude-2',
      messages: [{
        role: 'user',
        content: `Analyze this contact history and provide sales insights:
          ${JSON.stringify(contactHistory)}`
      }]
    });
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating sales insights:', error);
    throw error;
  }
};