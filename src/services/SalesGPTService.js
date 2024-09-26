import { generateAIResponse } from '../utils/openAIClient';
import { supabase } from '../integrations/supabase/supabase';

class SalesGPTService {
  constructor() {
    this.conversations = new Map();
    this.knowledgeBase = null;
  }

  async initializeKnowledgeBase() {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*');
      
      if (error) throw error;
      
      this.knowledgeBase = data.reduce((acc, entry) => {
        if (!acc[entry.category]) {
          acc[entry.category] = [];
        }
        acc[entry.category].push(entry.content);
        return acc;
      }, {});
      
      console.log('Knowledge base initialized:', this.knowledgeBase);
    } catch (error) {
      console.error('Error initializing knowledge base:', error);
    }
  }

  async generateResponse(userInput, conversationId, userEmail) {
    console.log('Generating response for:', userInput);
    try {
      if (!this.knowledgeBase) {
        await this.initializeKnowledgeBase();
      }

      const prompt = this.constructPrompt(userInput);
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

  constructPrompt(userInput) {
    let prompt = "You are an AI sales assistant. Use the following information to assist with sales inquiries:\n\n";
    
    for (const [category, entries] of Object.entries(this.knowledgeBase)) {
      prompt += `${category.toUpperCase()}:\n${entries.join('\n')}\n\n`;
    }
    
    prompt += `User Input: ${userInput}\n\nResponse:`;
    return prompt;
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
    if (!this.knowledgeBase) {
      await this.initializeKnowledgeBase();
    }

    const prompt = `Generate a professional ${emailType} email for a roofing company. The email is for ${contactInfo.full_name}. Include a subject line and body. Use the following information:\n\n${JSON.stringify(this.knowledgeBase)}`;
    const response = await generateAIResponse(prompt, userEmail);
    const [subject, ...bodyParts] = response.split('\n');
    const body = bodyParts.join('\n').trim();
    return { subject: subject.replace('Subject: ', ''), body };
  }
}

export const salesGPTService = new SalesGPTService();
