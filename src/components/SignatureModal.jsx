import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const signatureFonts = [
  { name: 'Brush Script MT', value: 'Brush Script MT, cursive' },
  { name: 'Lucida Handwriting', value: 'Lucida Handwriting, cursive' },
  { name: 'Freestyle Script', value: 'Freestyle Script, cursive' },
  { name: 'Edwardian Script ITC', value: 'Edwardian Script ITC, cursive' },
  { name: 'Segoe Script', value: 'Segoe Script, cursive' },
];

const SignatureModal = ({ isOpen, onClose, onSignatureChange }) => {
  const [name, setName] = useState('');
  const [font, setFont] = useState(signatureFonts[0].value);

  const handleSubmit = () => {
    onSignatureChange(name, font);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Signature</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Type your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2"
        />
        <Select onValueChange={setFont} value={font}>
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
        <DialogFooter>
          <Button onClick={handleSubmit}>Add Signature</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
