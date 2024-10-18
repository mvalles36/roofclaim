import { generateAIResponse } from '../utils/openAIClient';
import { supabase } from '../integrations/supabase/supabase';

class SalesGPTService {
  constructor() {
    this.conversations = new Map();
  }

  async generateResponse(userInput, conversationId, userEmail, knowledgeBase) {
    console.log('Generating response for:', userInput);
    try {
      const prompt = this.constructPrompt(userInput, knowledgeBase);
      const response = await generateAIResponse(prompt, userEmail);
      
      if (!this.conversations.has(conversationId)) {
        this.conversations.set(conversationId, []);
      }
      this.conversations.get(conversationId).push({ role: 'user', content: userInput });
      this.conversations.get(conversationId).push({ role: 'assistant', content: response });

      return response;
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I'm sorry, I couldn't generate a response at this time.";
    }
  }

  constructPrompt(userInput, knowledgeBase) {
    let prompt = "You are an AI sales assistant. Use the following information to assist with sales inquiries:\n\n";
    
    if (knowledgeBase) {
      for (const entry of knowledgeBase) {
        prompt += `${entry.category.toUpperCase()}:\n${entry.content}\n\n`;
      }
    }
    
    prompt += `User Input: ${userInput}\n\nResponse:`;
    return prompt;
  }

  async initiateCall(contactInfo, callReason, userEmail, knowledgeBase) {
    console.log(`Initiating call to ${contactInfo.full_name} at ${contactInfo.phone_number}`);
    console.log(`Reason for call: ${callReason}`);

    const initialPrompt = `You're calling ${contactInfo.full_name} regarding ${callReason}. Start the conversation politely and professionally.`;
    const response = await this.generateResponse(initialPrompt, contactInfo.id, userEmail, knowledgeBase);

    return response;
  }

  async endCall(conversationId) {
    console.log(`Ended call for conversation ${conversationId}`);
  }

  getConversation(conversationId) {
    return this.conversations.get(conversationId) || [];
  }

  async getMetrics() {
    const { data, error } = await supabase.rpc('get_sales_metrics');
    if (error) throw error;
    return data;
  }

  async generateEmailContent(emailType, contactInfo, userEmail, knowledgeBase) {
    const prompt = `Generate a professional ${emailType} email for a roofing company. The email is for ${contactInfo.full_name}. Include a subject line and body. Use the following information:\n\n${JSON.stringify(knowledgeBase)}`;
    const response = await generateAIResponse(prompt, userEmail);
    const [subject, ...bodyParts] = response.split('\n');
    const body = bodyParts.join('\n').trim();
    return { subject: subject.replace('Subject: ', ''), body };
  }
}

export const salesGPTService = new SalesGPTService();

// Add this new function to export fetchSalesGPTResponse
export const fetchSalesGPTResponse = async (prompt) => {
  try {
    const response = await salesGPTService.generateResponse(prompt, 'default', 'user@example.com', null);
    return response;
  } catch (error) {
    console.error('Error fetching SalesGPT response:', error);
    throw error;
  }
};
