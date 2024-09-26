import { generateAIResponse } from '../utils/openAIClient';
import { supabase } from '../integrations/supabase/supabase';

class SalesGPTService {
  constructor() {
    this.conversations = new Map();
  }

  async initializeKnowledgeBase(companyInfo, productInfo, salesScripts) {
    console.log('Initializing knowledge base with:', { companyInfo, productInfo, salesScripts });
    // In a real implementation, this would set up the AI model with the provided information
  }

  async generateResponse(userInput, conversationId, userEmail) {
    console.log('Generating response for:', userInput);
    try {
      const response = await generateAIResponse(userInput, userEmail);
      
      // Store the conversation
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

  async initiateCall(contactInfo, callReason, userEmail) {
    console.log(`Initiating call to ${contactInfo.full_name} at ${contactInfo.phone_number}`);
    console.log(`Reason for call: ${callReason}`);

    const initialPrompt = `You're calling ${contactInfo.full_name} regarding ${callReason}. Start the conversation politely and professionally.`;
    const response = await this.generateResponse(initialPrompt, contactInfo.id, userEmail);

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

  async generateEmailContent(emailType, contactInfo, userEmail) {
    const prompt = `Generate a professional ${emailType} email for a roofing company. The email is for ${contactInfo.full_name}. Include a subject line and body.`;
    const response = await generateAIResponse(prompt, userEmail);
    const [subject, ...bodyParts] = response.split('\n');
    const body = bodyParts.join('\n').trim();
    return { subject: subject.replace('Subject: ', ''), body };
  }
}

export const salesGPTService = new SalesGPTService();
