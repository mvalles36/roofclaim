import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { salesGPTService } from '../services/SalesGPTService';
import { supabase } from '../integrations/supabase/supabase';
import { Phone, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';

const SalesGPT = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [callReason, setCallReason] = useState('');
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, full_name, phone_number')
      .order('full_name', { ascending: true });
    
    if (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Failed to fetch contacts');
    } else {
      setContacts(data);
    }
  };

  const handleInitiateCall = async () => {
    if (!selectedContact || !callReason) {
      toast.error('Please select a contact and provide a call reason');
      return;
    }

    try {
      const response = await salesGPTService.initiateCall(selectedContact, callReason);
      setConversation([{ role: 'assistant', content: response }]);
      setIsCallActive(true);
      toast.success('Call initiated successfully');
    } catch (error) {
      console.error('Error initiating call:', error);
      toast.error('Failed to initiate call');
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setConversation([...conversation, { role: 'user', content: userInput }]);
    setUserInput('');

    try {
      const response = await salesGPTService.generateResponse(userInput);
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">SalesGPT</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Initiate Call</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={(value) => setSelectedContact(contacts.find(c => c.id === value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>{contact.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Reason for call"
              value={callReason}
              onChange={(e) => setCallReason(e.target.value)}
            />
            <Button onClick={handleInitiateCall} disabled={isCallActive}>
              <Phone className="mr-2 h-4 w-4" /> Initiate Call
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 overflow-y-auto mb-4 space-y-2">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3/4 p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {message.role === 'user' ? <User className="inline-block mr-2 h-4 w-4" /> : <MessageSquare className="inline-block mr-2 h-4 w-4" />}
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesGPT;