import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const signatureFonts = [
  { name: 'Brush Script MT', value: 'Brush Script MT, cursive' },
  { name: 'Lucida Handwriting', value: 'Lucida Handwriting, cursive' },
  { name: 'Freestyle Script', value: 'Freestyle Script, cursive' },
  { name: 'Edwardian Script ITC', value: 'Edwardian Script ITC, cursive' },
  { name: 'Segoe Script', value: 'Segoe Script, cursive' },
];

const SignatureInput = ({ onSignatureChange }) => {
  const [name, setName] = useState('');
  const [font, setFont] = useState(signatureFonts[0].value);

  const handleNameChange = (e) => {
    setName(e.target.value);
    onSignatureChange(e.target.value, font);
  };

  const handleFontChange = (value) => {
    setFont(value);
    onSignatureChange(name, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>E-Signature</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Type your name"
          value={name}
          onChange={handleNameChange}
          className="mb-2"
        />
        <Select onValueChange={handleFontChange} value={font}>
          <SelectTrigger className="w-full mb-2">
            <SelectValue placeholder="Select a signature font" />
          </SelectTrigger>
          <SelectContent>
            {signatureFonts.map((font) => (
              <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2 p-2 border rounded">
          Preview: <span style={{ fontFamily: font }}>{name}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureInput;
