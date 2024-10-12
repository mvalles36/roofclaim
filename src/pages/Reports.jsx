import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase'; // Updated import path
import FileUploader from '../components/FileUploader';
import axios from 'axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newReport, setNewReport] = useState({
    contact_id: '',
    status: 'In Progress',
    notes: '',
    images: [],
  });
  const [kpis, setKpis] = useState({
    completionRate: 0,
    avgCycleDuration: 0,
    customerSatisfaction: 0,
  });
  const { userRole } = useSupabaseAuth();

  useEffect(() => {
    fetchReports();
    fetchContacts();
    fetchKPIs();
  }, []);

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('inspection_reports')
      .select('*, contacts(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data);
    }
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('id, name');

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data);
    }
  };

  const fetchKPIs = async () => {
    // Replace with actual API call to calculate KPIs
    setKpis({
      completionRate: 85,
      avgCycleDuration: 3.5,
      customerSatisfaction: 4.2,
    });
  };

  const handleCreateReport = async () => {
    const { data, error } = await supabase
      .from('inspection_reports')
      .insert([newReport]);

    if (error) {
      console.error('Error creating report:', error);
    } else {
      fetchReports();
      setNewReport({
        contact_id: '',
        status: 'In Progress',
        notes: '',
        images: [],
      });
    }
  };

  const handleUpdateReportStatus = async (reportId, newStatus) => {
    const { error } = await supabase
      .from('inspection_reports')
      .update({ status: newStatus })
      .eq('id', reportId);

    if (error) {
      console.error('Error updating report status:', error);
    } else {
      fetchReports();
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', 'roof-damage-b3lgl');

      const response = await axios.post('https://detect.roboflow.com/roof-damage-b3lgl/3', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`,
        },
      });

      const newImage = {
        url: URL.createObjectURL(file),
        annotations: response.data.predictions,
      };

      setNewReport(prev => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
    } catch (error) {
      console.error('Error processing image:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inspection Reports</h1>
      <FileUploader onUpload={handleFileUpload} />
      {/* Add your UI components here */}
    </div>
  );
};

export default Reports;