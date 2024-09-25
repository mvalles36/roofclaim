import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import SalesProcessKPIs from '../components/SalesProcessKPIs';

const SalesManagerDashboard = () => {
  const { data: teamPerformance, isLoading, error } = useQuery({
    queryKey: ['teamPerformance'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_team_performance');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Sales Manager Dashboard</h1>
      <SalesProcessKPIs />
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deals_closed" fill="#8884d8" name="Deals Closed" />
              <Bar dataKey="revenue_generated" fill="#82ca9d" name="Revenue Generated" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesManagerDashboard;
