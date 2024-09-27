import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../integrations/supabase/supabase';
import { useQuery } from '@tanstack/react-query';

const WebsiteVisitors = () => {
  const [trackingScript, setTrackingScript] = useState('');

  const { data: visitors, isLoading, error } = useQuery({
    queryKey: ['website-visitors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('website_visitors')
        .select('*')
        .order('visited_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const script = `
      <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${import.meta.env.VITE_GTM_ID}');
      </script>
    `;
    setTrackingScript(script);
  }, []);

  const copyTrackingScript = () => {
    navigator.clipboard.writeText(trackingScript);
    alert('Tracking script copied to clipboard!');
  };

  if (isLoading) return <div>Loading visitor data...</div>;
  if (error) return <div>Error loading visitor data: {error.message}</div>;

  const visitorData = visitors.map(visitor => ({
    date: new Date(visitor.visited_at).toLocaleDateString(),
    visitors: 1,
  }));

  const aggregatedData = visitorData.reduce((acc, curr) => {
    const existingDate = acc.find(item => item.date === curr.date);
    if (existingDate) {
      existingDate.visitors += curr.visitors;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Website Visitors</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tracking Script</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{trackingScript}</code>
          </pre>
          <Button onClick={copyTrackingScript} className="mt-4">Copy Tracking Script</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Visitor Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aggregatedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Referrer</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.slice(0, 10).map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell>{new Date(visitor.visited_at).toLocaleString()}</TableCell>
                  <TableCell>{visitor.page}</TableCell>
                  <TableCell>{visitor.referrer || 'Direct'}</TableCell>
                  <TableCell>{visitor.device}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteVisitors;