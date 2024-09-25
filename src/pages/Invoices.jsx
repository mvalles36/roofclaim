import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';
import { fetchInvoices, fetchContacts, fetchJobs } from '../services/apiService';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInvoice, setNewInvoice] = useState({
    contact_id: '',
    job_id: '',
    amount_due: '',
    payment_status: 'Unpaid',
    invoice_date: new Date().toISOString().split('T')[0],
    payment_due_date: '',
    payment_method: '',
    late_payment_fees: 0
  });
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesData, contactsData, jobsData] = await Promise.all([
        fetchInvoices(),
        fetchContacts(),
        fetchJobs()
      ]);
      setInvoices(invoicesData);
      setContacts(contactsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    }
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice.contact_id || !newInvoice.job_id || !newInvoice.amount_due) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([newInvoice]);

      if (error) throw error;
      toast.success('Invoice created successfully');
      loadData();
      setNewInvoice({
        contact_id: '',
        job_id: '',
        amount_due: '',
        payment_status: 'Unpaid',
        invoice_date: new Date().toISOString().split('T')[0],
        payment_due_date: '',
        payment_method: '',
        late_payment_fees: 0
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    }
  };

  const handleUpdateInvoiceStatus = async (invoiceId, newStatus) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ payment_status: newStatus })
        .eq('id', invoiceId);

      if (error) throw error;
      loadData();
      toast.success('Invoice status updated successfully');
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.contacts.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.jobs.job_type.toLowerCase().includes(searchTerm.toLowerCase())
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Invoice</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={(value) => setNewInvoice({ ...newInvoice, contact_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>{contact.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setNewInvoice({ ...newInvoice, job_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>{job.job_type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Amount Due"
              type="number"
              value={newInvoice.amount_due}
              onChange={(e) => setNewInvoice({ ...newInvoice, amount_due: e.target.value })}
            />
            <Input
              placeholder="Payment Due Date"
              type="date"
              value={newInvoice.payment_due_date}
              onChange={(e) => setNewInvoice({ ...newInvoice, payment_due_date: e.target.value })}
            />
            <Button onClick={handleCreateInvoice}>Create Invoice</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {filteredInvoices.map((invoice) => (
              <li key={invoice.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{invoice.contacts.full_name}</p>
                  <p>Job: {invoice.jobs.job_type}</p>
                  <p>Amount: ${invoice.amount_due}</p>
                  <p>Status: {invoice.payment_status}</p>
                </div>
                <Select
                  value={invoice.payment_status}
                  onValueChange={(value) => handleUpdateInvoiceStatus(invoice.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partial Payment">Partial Payment</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Invoices;
