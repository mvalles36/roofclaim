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
    // Basic validation for required fields
    if (!newInvoice.customer_id || !newInvoice.job_id || !newInvoice.amount_due) {
      toast.error('Please fill in all required fields');
      return;
    }

    const { data, error } = await supabase
      .from('invoices')
      .insert([newInvoice]);

    if (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
    } else {
      toast.success('Invoice created successfully');
