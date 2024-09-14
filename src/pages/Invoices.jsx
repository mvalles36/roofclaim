import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { toast } from 'sonner';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInvoice, setNewInvoice] = useState({
    customer_id: '',
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
    fetchInvoices();
    fetchCustomers();
    fetchJobs();
  }, []);

  const fetchInvoices = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .select('*, customers(full_name), jobs(job_type)')
      .order('invoice_date', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to fetch invoices');
    } else {
      setInvoices(data);
    }
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('id, full_name');

    if (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    } else {
      setCustomers(data);
    }
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, job_type, customer_id');

    if (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } else {
      setJobs(data);
    }
  };

  const handleCreateInvoice = async () => {
    const { data, error } = await supabase
      .from('invoices')
      .insert([newInvoice]);

    if (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } else {
      toast.success('Invoice created successfully');
      fetchInvoices();
      setNewInvoice({
        customer_id: '',
        job_id: '',
        amount_due: '',
        payment_status: 'Unpaid',
        invoice_date: new Date().toISOString().split('T')[0],
        payment_due_date: '',
        payment_method: '',
        late_payment_fees: 0
      });
    }
  };

  const handleUpdatePaymentStatus = async (invoiceId, newStatus) => {
    const { error } = await supabase
      .from('invoices')
      .update({ payment_status: newStatus })
      .eq('id', invoiceId);

    if (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    } else {
      fetchInvoices();
      toast.success('Payment status updated successfully');
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
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Invoice</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={(value) => setNewInvoice({ ...newInvoice, customer_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>{customer.full_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setNewInvoice({ ...newInvoice, job_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.filter(job => job.customer_id === newInvoice.customer_id).map((job) => (
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
            <Input
              placeholder="Payment Method"
              value={newInvoice.payment_method}
              onChange={(e) => setNewInvoice({ ...newInvoice, payment_method: e.target.value })}
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
                      <Select
                        value={invoice.payment_status}
                        onValueChange={(value) => handleUpdatePaymentStatus(invoice.invoice_id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                          <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
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
