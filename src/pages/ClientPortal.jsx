import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../integrations/supabase/supabase';
import { SupplementList } from '../components/SupplementList';
import { ContactView } from '../components/ContactView';

const ClientPortal = () => {
  const { contactId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [projectProgress, setProjectProgress] = useState(0);
  const [financialOverview, setFinancialOverview] = useState(null);
  const [mortgageCheckStatus, setMortgageCheckStatus] = useState(null);

  useEffect(() => {
    fetchClientData();
  }, [contactId]);

  const fetchClientData = async () => {
    try {
      // Fetch job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('contact_id', contactId)
        .single();
      if (jobError) throw jobError;
      setJobDetails(jobData);

      // Fetch project progress
      const { data: progressData, error: progressError } = await supabase
        .rpc('get_project_progress', { job_id: jobData.id });
      if (progressError) throw progressError;
      setProjectProgress(progressData);

      // Fetch financial overview
      const { data: financialData, error: financialError } = await supabase
        .rpc('get_financial_overview', { job_id: jobData.id });
      if (financialError) throw financialError;
      setFinancialOverview(financialData);

      // Fetch mortgage check status
      const { data: mortgageData, error: mortgageError } = await supabase
        .from('mortgage_checks')
        .select('*')
        .eq('job_id', jobData.id)
        .single();
      if (mortgageError && mortgageError.code !== 'PGRST116') throw mortgageError;
      setMortgageCheckStatus(mortgageData);
    } catch (error) {
      console.error('Error fetching client data:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Client Portal</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={projectProgress} className="w-full" />
                <p className="mt-2 text-center">{projectProgress}% Complete</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {financialOverview && (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={[financialOverview]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="totalCost" fill="#8884d8" name="Total Cost" />
                      <Bar dataKey="amountPaid" fill="#82ca9d" name="Amount Paid" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent>
                {jobDetails && (
                  <div>
                    <p><strong>Job Type:</strong> {jobDetails.job_type}</p>
                    <p><strong>Start Date:</strong> {new Date(jobDetails.start_date).toLocaleDateString()}</p>
                    <p><strong>Estimated Completion:</strong> {new Date(jobDetails.estimated_completion_date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {jobDetails.status}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mortgage Check Status</CardTitle>
              </CardHeader>
              <CardContent>
                {mortgageCheckStatus ? (
                  <div>
                    <p><strong>Status:</strong> {mortgageCheckStatus.status}</p>
                    <p><strong>Amount:</strong> ${mortgageCheckStatus.amount}</p>
                    <p><strong>Last Updated:</strong> {new Date(mortgageCheckStatus.updated_at).toLocaleString()}</p>
                  </div>
                ) : (
                  <p>No mortgage check information available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="supplements">
          <SupplementList contactId={contactId} />
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Implement document list and upload functionality here */}
              <p>Document management functionality coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contact">
          <ContactView contactId={contactId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientPortal;