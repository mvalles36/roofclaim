import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Chart } from 'react-chartjs-2'; // Example for charting

const WebsiteVisitors = () => {
  const [showScript, setShowScript] = useState(false);
  const [visitorData, setVisitorData] = useState([]);
  
  // Example chart data (replace with real data)
  const chartData = {
    labels: visitorData.map(item => item.visited_at), 
    datasets: [{
      label: 'Time on Page',
      data: visitorData.map(item => item.time_on_page),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  // Function to toggle the script display
  const toggleScript = () => {
    setShowScript(!showScript);
  };

  // Example visitor fetching (replace with real logic)
  useEffect(() => {
    // Fetch visitor data from your serverless function here
    const fetchData = async () => {
      const response = await fetch('/.netlify/functions/website-visitors'); // Example API call
      const data = await response.json();
      setVisitorData(data);
    };

    fetchData();
  }, []);

  // Tracking script for users to copy
  const trackingScript = `
  <script>
    (function() {
      fetch("https://roofclaim.netlify.app/netlify/funtions/website-visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id: "YOUR_VISITOR_ID",
          page: window.location.pathname,
          time_on_page: performance.now(),
          visited_at: new Date().toISOString()
        })
      });
    })();
  </script>
  `;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Website Visitors</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Visitor Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Chart type="line" data={chartData} />
          </div>
          <Button onClick={toggleScript}>
            {showScript ? "Hide Script" : "Show Tracking Script"}
          </Button>
          {showScript && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Copy and Paste this Script</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Copy and paste this script into the <code>&lt;head&gt;</code> section of your website:</p>
                <Input
                  readOnly
                  value={trackingScript.trim()}
                  className="font-mono text-xs bg-gray-100 p-2 rounded"
                />
                <CopyToClipboard text={trackingScript.trim()} onCopy={() => toast.success('Script copied to clipboard!')}>
                  <Button className="mt-2">Copy Script</Button>
                </CopyToClipboard>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteVisitors;
