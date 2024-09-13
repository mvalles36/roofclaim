import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';
import { FileUploader } from '../components/FileUploader';
import { SupplementAnalyzer } from '../components/SupplementAnalyzer';
import { SupplementList } from '../components/SupplementList';
import { SupplementInbox } from '../components/SupplementInbox';

const SupplementTracking = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [documents, setDocuments] = useState({
    insurancePolicy: null,
    insuranceEstimate: null,
    roofInspectionReport: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [supplementResult, setSupplementResult] = useState(null);

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
        roofInspectionReport: data.find(doc => doc.type === 'roofInspectionReport')
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
          file_path: data.path
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
    // This is where you'd integrate with your AI service to analyze the documents
    // For now, we'll use dummy data
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
        cost: 5000
      },
      supplementalCosts: [
        { item: "Additional Shingles", cost: 2000 },
        { item: "Labor for Extra Repairs", cost: 1000 },
        { item: "Additional Underlayment", cost: 800 },
        { item: "Flashing Replacement", cost: 500 }
      ],
      totalSupplementAmount: 4300,
      justification: "Increased damage discovered during secondary inspection; additional materials and labor required to complete the repair.",
      submittedBy: {
        name: "Jane Smith",
        company: "XYZ Roofing",
        contactInfo: "(555) 123-4567"
      }
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Automated Supplements</h1>
      <Card>
        <CardHeader>
          <CardTitle>Customer Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedCustomer}>
            <SelectTrigger>
              <SelectValue placeholder="Select a customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      {selectedCustomer && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FileUploader
                  label="Insurance Policy"
                  onUpload={(file) => handleFileUpload(file, 'insurancePolicy')}
                  file={documents.insurancePolicy}
                />
                <FileUploader
                  label="Insurance Company's Estimate"
                  onUpload={(file) => handleFileUpload(file, 'insuranceEstimate')}
                  file={documents.insuranceEstimate}
                />
                <FileUploader
                  label="Drone Roof Inspection Report"
                  onUpload={(file) => handleFileUpload(file, 'roofInspectionReport')}
                  file={documents.roofInspectionReport}
                />
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
          <Button 
            onClick={handleAnalyze} 
            disabled={uploadProgress < 100}
          >
            Analyze and Generate Supplement
          </Button>
        </>
      )}
      {supplementResult && <SupplementAnalyzer result={supplementResult} />}
      <SupplementList />
      <SupplementInbox />
    </div>
  );
};

export default SupplementTracking;