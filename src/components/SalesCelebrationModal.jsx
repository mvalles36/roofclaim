import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SalesCelebrationModal = ({ isOpen, onClose, salesperson }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Sale Celebration!</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-lg mb-4">{salesperson} just made a sale!</p>
          <div className="text-center text-4xl mb-4">🎉🎊🥳</div>
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesCelebrationModal;