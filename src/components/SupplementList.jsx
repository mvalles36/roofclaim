import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from '../integrations/supabase/supabase';

export const SupplementList = ({ contactId }) => {
  const [supplements, setSupplements] = useState([]);

  useEffect(() => {
    fetchSupplements();
  }, [contactId]);

  const fetchSupplements = async () => {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching supplements:', error);
    } else {
      setSupplements(data);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplement List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Claim Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplements.map((supplement) => (
              <TableRow key={supplement.id}>
                <TableCell>{supplement.claim_number}</TableCell>
                <TableCell>{supplement.status}</TableCell>
                <TableCell>${supplement.amount}</TableCell>
                <TableCell>{new Date(supplement.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
