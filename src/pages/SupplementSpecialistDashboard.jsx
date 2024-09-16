import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSupplementKPIs, getCurrentSupplementRequests, getSupplementPerformanceHistory } from '../integrations/supabase/supabase';

const SupplementSpecialistDashboard = () => {
  const [kpis, setKpis] = useState({});
  const [currentRequests, setCurrentRequests] = useState([]);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // Track selected request

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

  const handleRequestSelection = (request) => {
    setSelectedRequest(request);
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
            {/* Display details of the selected request here (e.g., customer information, claim details) */}
            <p>Customer Name: {selectedRequest.customerName}</p>
            <p>Claim Number: {selectedRequest.claimNumber}</p>
            <p>Description: {selectedRequest.description}</p>
            {/* Add buttons or functionality to approve/reject the request */}
            <div className="flex justify-end space-x-2">
              <Button variant="primary">Approve Request</Button>
              <Button variant="secondary">Reject Request</Button>
            </div>
          </CardContent>
        </Card>
      )}
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

export default SupplementSpecialistDashboard
