import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../integrations/supabase/supabase';
import { Button } from "@/components/ui/button";

const CustomerSuccessDashboard = () => {
  const [kpis, setKpis] = useState({});
  const [currentRequests, setCurrentRequests] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [supplementTypeDistribution, setSupplementTypeDistribution] = useState([]);
  const [approvalRateOverTime, setApprovalRateOverTime] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const kpisData = await getSupplementKPIs();
      setKpis(kpisData);

      const requestsData = await getCurrentSupplementRequests();
      setCurrentRequests(requestsData);

      const historyData = await getSupplementPerformanceHistory();
      setPerformanceHistory(historyData);

      // New data fetching for additional charts
      const { data: typeDistribution } = await supabase.rpc('get_supplement_type_distribution');
      setSupplementTypeDistribution(typeDistribution);

      const { data: approvalRate } = await supabase.rpc('get_approval_rate_over_time');
      setApprovalRateOverTime(approvalRate);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleRequestSelection = (request) => {
    setSelectedRequest(request);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Success Rep Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Supplements" value={kpis.totalSupplements} />
        <KPICard title="Approved Supplements" value={kpis.approvedSupplements} />
        <KPICard title="Approval Rate" value={`${kpis.approvalRate}%`} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approvedSupplements" fill="#8884d8" />
                <Bar dataKey="totalSupplements" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Supplement Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={supplementTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {supplementTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Approval Rate Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={approvalRateOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="approvalRate" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current Supplement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentRequests.map((request, index) => (
              <li key={index}>
                <button onClick={() => handleRequestSelection(request)} className="text-left hover:underline">
                  {request.description}
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {selectedRequest && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Customer Name: {selectedRequest.customerName}</p>
            <p>Claim Number: {selectedRequest.claimNumber}</p>
            <p>Description: {selectedRequest.description}</p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="primary">Approve Request</Button>
              <Button variant="secondary">Reject Request</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const KPICard = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default CustomerSuccessDashboard;
