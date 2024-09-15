import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSupplementKPIs, getCurrentSupplementRequests, getSupplementPerformanceHistory } from '../integrations/supabase/supabase';

const SupplementSpecialistDashboard = () => {
  const [kpis, setKpis] = useState({});
  const [currentRequests, setCurrentRequests] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);

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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Supplement Specialist Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Supplements" value={kpis.totalSupplements} />
        <KPICard title="Approved Supplements" value={kpis.approvedSupplements} />
        <KPICard title="Approval Rate" value={`${kpis.approvalRate}%`} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Current Supplement Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentRequests.map((request, index) => (
              <li key={index}>{request.description}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
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

export default SupplementSpecialistDashboard;