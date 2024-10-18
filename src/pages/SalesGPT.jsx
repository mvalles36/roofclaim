import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { fetchSalesGPTResponse } from '../services/SalesGPTService';

const SalesGPT = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const salesGPTMutation = useMutation({
    mutationFn: fetchSalesGPTResponse,
    onSuccess: (data) => {
      setResponse(data);
      toast.success('Response generated successfully');
    },
    onError: (error) => {
      console.error('Error generating response:', error);
      toast.error('Failed to generate response');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    salesGPTMutation.mutate(prompt);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">SalesGPT</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ask SalesGPT</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <Button type="submit" disabled={salesGPTMutation.isLoading}>
              {salesGPTMutation.isLoading ? 'Generating...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
      {response && (
        <Card>
          <CardHeader>
            <CardTitle>SalesGPT Response</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{response}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SalesGPT;