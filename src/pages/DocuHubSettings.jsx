import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  const [emailSettings, setEmailSettings] = useState({
    senderEmail: '',
    senderPassword: '',
    smtpServer: '',
    smtpPort: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailSettings(prev => ({ ...prev, [name]: value }));
  };

  const saveSettings = () => {
    // In a real application, you would save these settings securely,
    // possibly encrypting sensitive information before storing
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <Input
              type="email"
              name="senderEmail"
              placeholder="Sender Email"
              value={emailSettings.senderEmail}
              onChange={handleChange}
            />
            <Input
              type="password"
              name="senderPassword"
              placeholder="Sender Password"
              value={emailSettings.senderPassword}
              onChange={handleChange}
            />
            <Input
              type="text"
              name="smtpServer"
              placeholder="SMTP Server"
              value={emailSettings.smtpServer}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="smtpPort"
              placeholder="SMTP Port"
              value={emailSettings.smtpPort}
              onChange={handleChange}
            />
            <Button onClick={saveSettings}>Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
