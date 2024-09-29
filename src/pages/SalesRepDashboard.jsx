import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import SalesProcessKPIs from '../components/SalesProcessKPIs';

const SalesRepDashboard = () => {
  const { data: pipelineData, isLoading, error } = useQuery({
    queryKey: ['salesRepPipeline'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_sales_rep_pipeline');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Sales Rep Dashboard</h1>
      <SalesProcessKPIs />
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="deal_count" fill="#8884d8" name="Number of Deals" />
              <Bar dataKey="total_value" fill="#82ca9d" name="Total Value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesRepDashboard;