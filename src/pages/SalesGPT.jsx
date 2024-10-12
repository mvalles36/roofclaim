import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SalesGPT = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to SalesGPT service
    setResponse('This is a placeholder response from SalesGPT. Implement the actual API call here.');
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
            <Button type="submit">Submit</Button>
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