import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, customers(full_name), jobs(job_type)')
      .order('invoice_date', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
    } else {
      setInvoices(data);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.customers.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_id.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Invoices</h1>
      <Input
        placeholder="Search invoices..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {filteredInvoices.map((invoice) => (
              <li key={invoice.invoice_id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Invoice #{invoice.invoice_id}</p>
                  <p>Customer: {invoice.customers.full_name}</p>
                  <p>Amount: ${invoice.amount_due}</p>
                  <p>Status: {invoice.payment_status}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invoice Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                      <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
                      <p><strong>Customer:</strong> {invoice.customers.full_name}</p>
                      <p><strong>Job Type:</strong> {invoice.jobs.job_type}</p>
                      <p><strong>Invoice Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                      <p><strong>Amount Due:</strong> ${invoice.amount_due}</p>
                      <p><strong>Payment Status:</strong> {invoice.payment_status}</p>
                      <p><strong>Payment Method:</strong> {invoice.payment_method}</p>
                      <p><strong>Due Date:</strong> {new Date(invoice.payment_due_date).toLocaleDateString()}</p>
                      {invoice.late_payment_fees > 0 && (
                        <p><strong>Late Fees:</strong> ${invoice.late_payment_fees}</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;