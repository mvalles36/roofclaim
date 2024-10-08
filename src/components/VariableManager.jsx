import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, X } from 'lucide-react';

const VariableManager = ({ variables, onVariableChange, onAddVariable, onRemoveVariable }) => {
  const [newVarName, setNewVarName] = useState('');
  const [newVarValue, setNewVarValue] = useState('');

  const handleAddVariable = () => {
    if (newVarName && newVarValue) {
      onAddVariable(newVarName, newVarValue);
      setNewVarName('');
      setNewVarValue('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variables</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            placeholder="Variable name"
            value={newVarName}
            onChange={(e) => setNewVarName(e.target.value)}
            className="mr-2"
          />
          <Input
            placeholder="Variable value"
            value={newVarValue}
            onChange={(e) => setNewVarValue(e.target.value)}
            className="mr-2"
          />
          <Button onClick={handleAddVariable}><PlusCircle className="h-4 w-4" /></Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Variable</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(variables).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{"{{" + key + "}}"}</TableCell>
                  <TableCell className="max-w-xs truncate">{value}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onRemoveVariable(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VariableManager;
