import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseAuth } from '../integrations/supabase/auth';
import { supabase } from '../integrations/supabase/supabase';
import { FileUploader } from '../components/FileUploader';
import axios from 'axios';

const InspectionReports = () => {
  const [reports, setReports] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newReport, setNewReport] = useState({
    contact_id: '',
    status: 'In Progress',
    notes: '',
    images: []
  });
  const [kpis, setKpis] = useState({
    completionRate: 0,
    avgCycleDuration: 0,
    customerSatisfaction: 0
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
    // This would be replaced with an actual API call to calculate KPIs
    setKpis({
      completionRate: 85,
      avgCycleDuration: 3.5,
      customerSatisfaction: 4.2
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
        images: []
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
      if (newStatus === 'Completed') {
        triggerNPSSurvey(reportId);
      }
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
          'Authorization': `Bearer ${import.meta.env.VITE_ROBOFLOW_API_KEY}`
        }
      });

      const newImage = {
        url: URL.createObjectURL(file),
        annotations: response.data.predictions
      };

      setNewReport(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
    } catch (error) {
      console.error('Error processing image with Roboflow:', error);
    }
  };

  const triggerNPSSurvey = async (reportId) => {
    // This would be replaced with an actual API call to trigger the NPS survey
    console.log(`Triggering NPS survey for report ${reportId}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inspection Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.completionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg. Cycle Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.avgCycleDuration} days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.customerSatisfaction}/5</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create New Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select onValueChange={(value) => setNewReport({ ...newReport, contact_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>{contact.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={newReport.notes}
              onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
            />
            <FileUploader
              label="Upload Images"
              onUpload={handleFileUpload}
              multiple={true}
            />
            <div className="flex flex-wrap gap-2">
              {newReport.images.map((image, index) => (
                <img key={index} src={image.url} alt={`Uploaded ${index}`} className="w-24 h-24 object-cover" />
              ))}
            </div>
            <Button onClick={handleCreateReport}>Create Report</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Inspection Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {renderReportList(reports)}
            </TabsContent>
            <TabsContent value="in-progress">
              {renderReportList(reports.filter(report => report.status === 'In Progress'))}
            </TabsContent>
            <TabsContent value="completed">
              {renderReportList(reports.filter(report => report.status === 'Completed'))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const renderReportList = (reports) => (
  <ul className="space-y-2">
    {reports.map((report) => (
      <li key={report.id} className="flex justify-between items-center">
        <div>
          <p className="font-semibold">{report.contacts.name}</p>
          <p>Status: {report.status}</p>
          <p>Created: {new Date(report.created_at).toLocaleDateString()}</p>
        </div>
        <Select
          value={report.status}
          onValueChange={(value) => handleUpdateReportStatus(report.id, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </li>
    ))}
  </ul>
);

export default InspectionReports;