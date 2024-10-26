import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SaveListDialog = ({ 
  open, 
  onOpenChange, 
  listName, 
  setListName, 
  onSave, 
  propertiesCount,
  loading 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Property List</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="mb-4">Found {propertiesCount} properties in selected area</p>
          <Input
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={!listName || loading}>
            {loading ? 'Saving...' : 'Save List'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveListDialog;