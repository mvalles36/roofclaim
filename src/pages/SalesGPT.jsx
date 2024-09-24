import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { salesGPTService } from '../services/SalesGPTService';
import { supabase } from '../integrations/supabase/supabase';
import { Phone, MessageSquare, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesGPT = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [callReason, setCallReason] = useState('');
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [metrics, setMetrics] = useState({
    callsInitiated: 0,
    conversionsRate: 0,
    averageCallDuration: 0,
    customerSatisfaction: 0,
  });

  useEffect(() => {
    fetchContacts();
    fetchMetrics();
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

  const fetchMetrics = async () => {
    try {
      const metricsData = await salesGPTService.getMetrics();
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Failed to fetch metrics');
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

  const handleEndCall = async () => {
    try {
      await salesGPTService.endCall(selectedContact.id);
      setIsCallActive(false);
      toast.success('Call ended successfully');
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Failed to end call');
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setConversation([...conversation, { role: 'user', content: userInput }]);
    setUserInput('');

    try {
      const response = await salesGPTService.generateResponse(userInput, selectedContact.id);
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    }
  };

  const performanceData = [
    { name: 'Mon', calls: 20, conversions: 5 },
    { name: 'Tue', calls: 25, conversions: 8 },
    { name: 'Wed', calls: 30, conversions: 10 },
    { name: 'Thu', calls: 28, conversions: 7 },
    { name: 'Fri', calls: 35, conversions: 12 },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">SalesGPT</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Calls Initiated" value={metrics.callsInitiated} icon={<Phone className="h-8 w-8 text-blue-500" />} />
        <MetricCard title="Conversion Rate" value={`${metrics.conversionsRate}%`} icon={<MessageSquare className="h-8 w-8 text-green-500" />} />
        <MetricCard title="Avg. Call Duration" value={`${metrics.averageCallDuration} min`} icon={<User className="h-8 w-8 text-yellow-500" />} />
        <MetricCard title="Customer Satisfaction" value={`${metrics.customerSatisfaction}/5`} icon={<Mail className="h-8 w-8 text-purple-500" />} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#8884d8" />
                <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
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
            {!isCallActive ? (
              <Button onClick={handleInitiateCall}>
                <Phone className="mr-2 h-4 w-4" /> Initiate Call
              </Button>
            ) : (
              <Button onClick={handleEndCall} variant="destructive">
                <Phone className="mr-2 h-4 w-4" /> End Call
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
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
  );
};

const MetricCard = ({ title, value, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default SalesGPT;
