import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import SalesProcessKPIs from '../components/SalesProcessKPIs';

const CustomerSuccessRepDashboard = () => {
  const { data: customerSatisfaction, isLoading, error } = useQuery({
    queryKey: ['customerSatisfaction'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_customer_satisfaction');
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error.message}</div>;

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Customer Success Rep Dashboard</h1>
      <SalesProcessKPIs />
      <Card>
        <CardHeader>
          <CardTitle>Customer Satisfaction by Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customerSatisfaction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="satisfaction_score" fill="#8884d8" name="Satisfaction Score" />
              <Bar dataKey="response_rate" fill="#82ca9d" name="Response Rate" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSuccessRepDashboard;