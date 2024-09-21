import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LeadChart = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Daily Leads</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="leads" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default LeadChart;