import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import { config } from '../config/config';

class SalesGPTService {
  constructor() {
    this.model = new LlamaModel({
      modelPath: config.llamaModelPath,
    });
    this.context = new LlamaContext({ model: this.model });
    this.session = new LlamaChatSession({ context: this.context });
  }

  async initializeKnowledgeBase(companyInfo, productInfo, salesScripts) {
    const prompt = `You are an AI sales assistant for ${companyInfo.name}. 
    Our main products are: ${productInfo.join(', ')}. 
    Use the following sales scripts as guidelines: ${salesScripts.join(' ')}
    Always be polite, professional, and respect the customer's time and preferences.`;

    await this.session.prompt(prompt);
  }

  async generateResponse(userInput) {
    const response = await this.session.prompt(userInput);
    return response;
  }

  async initiateCall(contactInfo, callReason) {
    // This is a placeholder for the actual call initiation logic
    // In a real implementation, you would integrate with a service like Twilio
    console.log(`Initiating call to ${contactInfo.name} at ${contactInfo.phone}`);
    console.log(`Reason for call: ${callReason}`);

    const initialPrompt = `You're calling ${contactInfo.name} regarding ${callReason}. Start the conversation politely and professionally.`;
    const response = await this.generateResponse(initialPrompt);

    return response;
  }
}

export const salesGPTService = new SalesGPTService();