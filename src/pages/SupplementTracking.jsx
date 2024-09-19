import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '../integrations/supabase/supabase';
import FileUploader from '../components/FileUploader';
import { SupplementAnalyzer } from '../components/SupplementAnalyzer';
import { SupplementList } from '../components/SupplementList';
import { SupplementInbox } from '../components/SupplementInbox';

const SupplementTracking = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [documents, setDocuments] = useState({
    insurancePolicy: null,
    insuranceEstimate: null,
    roofInspectionReport: null,
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [supplementResult, setSupplementResult] = useState(null);
  const [supplementStatus, setSupplementStatus] = useState('pending');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerDocuments(selectedCustomer);
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data);
    }
  };

  const fetchCustomerDocuments = async (customerId) => {
    const { data, error } = await supabase
      .from('customer_documents')
      .select('*')
      .eq('customer_id', customerId);
    if (error) {
      console.error('Error fetching customer documents:', error);
    } else {
      setDocuments({
        insurancePolicy: data.find(doc => doc.type === 'insurancePolicy'),
        insuranceEstimate: data.find(doc => doc.type === 'insuranceEstimate'),
        roofInspectionReport: data.find(doc => doc.type === 'roofInspectionReport'),
      });
      updateUploadProgress();
    }
  };

  const handleFileUpload = async (file, type) => {
    const { data, error } = await supabase.storage
      .from('customer-documents')
      .upload(`${selectedCustomer}/${type}/${file.name}`, file);

    if (error) {
      console.error('Error uploading file:', error);
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('customer_documents')
        .insert({
          customer_id: selectedCustomer,
          type: type,
          file_path: data.path,
        });

      if (insertError) {
        console.error('Error inserting document record:', insertError);
      } else {
        fetchCustomerDocuments(selectedCustomer);
      }
    }
  };

  const updateUploadProgress = () => {
    const progress = Object.values(documents).filter(Boolean).length * 33.33;
    setUploadProgress(progress);
  };

  const handleAnalyze = async () => {
    // Integrate with your AI service here
    // For now, use dummy data
    setSupplementResult({
      policyholderName: "John Doe",
      policyNumber: "123456789",
      claimNumber: "987654321",
      propertyAddress: "123 Maple Street, Springfield, IL 62704",
      inspectionDate: "March 15, 2024",
      damageType: "Hail damage",
      scopeOfWork: "Replacement of damaged shingles, underlayment, and flashing.",
      initialEstimate: {
        item: "20 sq. of asphalt shingles",
        cost: 500
      },
      supplementalCosts: [
        { item: "Additional underlayment", cost: 200 },
        { item: "Flashing replacement", cost: 150 }
      ],
      totalSupplementAmount: 350,
      justification: "Additional damage discovered during inspection requires extra materials and labor.",
      submittedBy: {
        name: "Jane Smith",
        company: "ABC Roofing",
        contactInfo: "jane.smith@abcroofing.com"
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Supplement Tracking</h1>
      <Select onValueChange={setSelectedCustomer}>
        <SelectTrigger>
          <SelectValue placeholder="Select a customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>{customer.full_name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileUploader onUpload={(file) => handleFileUpload(file, 'insurancePolicy')} />
            <FileUploader onUpload={(file) => handleFileUpload(file, 'insuranceEstimate')} />
            <FileUploader onUpload={(file) => handleFileUpload(file, 'roofInspectionReport')} />
          </div>
          <Progress value={uploadProgress} className="mt-4" />
        </CardContent>
      </Card>
      <Button onClick={handleAnalyze} disabled={uploadProgress < 100}>Analyze Documents</Button>
      {supplementResult && <SupplementAnalyzer result={supplementResult} />}
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Supplement List</TabsTrigger>
          <TabsTrigger value="inbox">Supplement Inbox</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <SupplementList />
        </TabsContent>
        <TabsContent value="inbox">
          <SupplementInbox />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupplementTracking;
