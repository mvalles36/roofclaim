import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase'; // Updated import path
import { toast } from 'sonner';

const KnowledgeBase = () => {
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [newEntry, setNewEntry] = useState({ category: '', content: '' });
  const [loading, setLoading] = useState(true);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (session) {
      fetchKnowledgeBase();
    }
  }, [session]);

  const fetchKnowledgeBase = async () => {
    setLoading(true);
    try {
      const { data: entries, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setKnowledgeBase(entries);
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      toast.error('Failed to fetch knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .insert([newEntry]);

      if (error) throw error;
      fetchKnowledgeBase();
      setNewEntry({ category: '', content: '' });
      toast.success('Knowledge base entry added successfully');
    } catch (error) {
      console.error('Error adding knowledge base entry:', error);
      toast.error('Failed to add knowledge base entry');
    }
  };

  const handleUpdateEntry = async (id, updatedContent) => {
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .update({ content: updatedContent })
        .eq('id', id);

      if (error) throw error;
      fetchKnowledgeBase();
      toast.success('Knowledge base entry updated successfully');
    } catch (error) {
      console.error('Error updating knowledge base entry:', error);
      toast.error('Failed to update knowledge base entry');
    }
  };

  const handleDeleteEntry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }
    try {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchKnowledgeBase();
      toast.success('Knowledge base entry deleted successfully');
    } catch (error) {
      console.error('Error deleting knowledge base entry:', error);
      toast.error('Failed to delete knowledge base entry');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Admin Knowledge Base</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newEntry.category}
                onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company_info">Company Info</SelectItem>
                  <SelectItem value="product_info">Product Info</SelectItem>
                  <SelectItem value="pricing">Pricing</SelectItem>
                  <SelectItem value="sales_scripts">Sales Scripts</SelectItem>
                  <SelectItem value="prompts">Prompts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                required
                rows={5}
              />
            </div>
            <Button type="submit" disabled={loading}>Add Entry</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {knowledgeBase.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.category}</TableCell>
                    <TableCell>
                      <Textarea
                        value={entry.content}
                        onChange={(e) => handleUpdateEntry(entry.id, e.target.value)}
                        rows={3}
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => handleDeleteEntry(entry.id)} variant="destructive">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;