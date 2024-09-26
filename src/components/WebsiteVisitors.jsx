import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '../integrations/supabase/supabase';

const WebsiteVisitors = () => {
  const [visitorData, setVisitorData] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [timeOnPage, setTimeOnPage] = useState([]);

  useEffect(() => {
    fetchVisitorData();
  }, []);

  const fetchVisitorData = async () => {
    const { data, error } = await supabase
      .from('website_visitors')
      .select('*')
      .order('visited_at', { ascending: false });

    if (error) {
      console.error('Error fetching visitor data:', error);
    } else {
      setVisitorData(data);
      processPageViews(data);
      processTimeOnPage(data);
    }
  };

  const processPageViews = (data) => {
    const pageViewCounts = data.reduce((acc, visit) => {
      acc[visit.page] = (acc[visit.page] || 0) + 1;
      return acc;
    }, {});
    setPageViews(Object.entries(pageViewCounts).map(([page, count]) => ({ page, count })));
  };

  const processTimeOnPage = (data) => {
    const timeOnPageData = data.reduce((acc, visit) => {
      acc[visit.page] = (acc[visit.page] || 0) + visit.time_on_page;
      return acc;
    }, {});
    setTimeOnPage(Object.entries(timeOnPageData).map(([page, time]) => ({ page, time })));
  };

  const trackingScript = `
    <script>
      function initVisitorTracking() {
        var n = Math.random().toString(36).substring(7);
        var o = document.createElement("script");
        o.src = "${window.location.origin}/visitor-tracker.js?nocache=" + n;
        o.async = true;
        o.defer = true;
        o.onload = function() {
          window.visitorTrackingFunctions.onLoad({
            appId: "${process.env.VITE_SUPABASE_PROJECT_URL}"
          });
        };
        document.head.appendChild(o);
      }
      initVisitorTracking();
    </script>
  `;

  const copyTrackingScript = () => {
    navigator.clipboard.writeText(trackingScript);
    alert('Tracking script copied to clipboard!');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time on Page</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeOnPage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitor Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pageViews}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {pageViews.map((entry, index) => (
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
          <CardTitle>Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th>Visitor ID</th>
                <th>Page</th>
                <th>Time on Page</th>
                <th>Visited At</th>
              </tr>
            </thead>
            <tbody>
              {visitorData.slice(0, 10).map((visit, index) => (
                <tr key={index}>
                  <td>{visit.visitor_id}</td>
                  <td>{visit.page}</td>
                  <td>{visit.time_on_page} seconds</td>
                  <td>{new Date(visit.visited_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteVisitors;
