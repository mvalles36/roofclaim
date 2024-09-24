import { generateAIResponse } from '../utils/openAIClient';

class SalesGPTService {
  constructor() {
    this.conversations = new Map();
    this.voipService = new VoIPService(); // Placeholder for VoIP service
  }

  async initializeKnowledgeBase(companyInfo, productInfo, salesScripts) {
    console.log('Initializing knowledge base with:', { companyInfo, productInfo, salesScripts });
    // In a real implementation, this would set up the AI model with the provided information
  }

  async generateResponse(userInput, conversationId) {
    console.log('Generating response for:', userInput);
    try {
      const response = await generateAIResponse(userInput);
      
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

  async initiateCall(contactInfo, callReason) {
    console.log(`Initiating call to ${contactInfo.full_name} at ${contactInfo.phone_number}`);
    console.log(`Reason for call: ${callReason}`);

    const initialPrompt = `You're calling ${contactInfo.full_name} regarding ${callReason}. Start the conversation politely and professionally.`;
    const response = await this.generateResponse(initialPrompt, contactInfo.id);

    // Simulate VoIP call initiation
    await this.voipService.initiateCall(contactInfo.phone_number);

    return response;
  }

  async endCall(conversationId) {
    // Simulate ending the VoIP call
    await this.voipService.endCall(conversationId);
    console.log(`Ended call for conversation ${conversationId}`);
  }

  getConversation(conversationId) {
    return this.conversations.get(conversationId) || [];
  }

  async getMetrics() {
    // Simulate fetching metrics from a backend
    return {
      callsInitiated: Math.floor(Math.random() * 100),
      conversionsRate: (Math.random() * 30).toFixed(2),
      averageCallDuration: (Math.random() * 10 + 5).toFixed(1),
      customerSatisfaction: (Math.random() * 1 + 4).toFixed(1),
    };
  }
}

// Placeholder VoIP service
class VoIPService {
  async initiateCall(phoneNumber) {
    console.log(`Simulating VoIP call initiation to ${phoneNumber}`);
    // In a real implementation, this would integrate with a VoIP API
  }

  async endCall(conversationId) {
    console.log(`Simulating VoIP call termination for conversation ${conversationId}`);
    // In a real implementation, this would end the call via a VoIP API
  }
}

export const salesGPTService = new SalesGPTService();
