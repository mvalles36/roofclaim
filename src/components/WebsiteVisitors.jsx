import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const setContactCookie = (contactData) => {
  const encodedData = btoa(JSON.stringify(contactData));
  document.cookie = `contactData=${encodedData}; path=/; max-age=86400`; // Expires in 1 day
};

export const getContactCookie = () => {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('contactData='));

  if (cookieValue) {
    const encodedData = cookieValue.split('=')[1];
    return JSON.parse(atob(encodedData));
  }
  return null;
};

const WebsiteVisitors = () => {
  const trackingScript = `
    <script>
      function initTracking() {
        var visitorId = "${crypto.randomUUID()}"; // Generate a new UUID for each visit
        var script = document.createElement("script");
        script.src = "https://your-netlify-function-url/.netlify/functions/website-visitors";
        script.async = true;
        script.onload = function() {
          // Logic to send tracking data
          fetch(script.src, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              visitor_id: visitorId,
              page: window.location.pathname,
              time_on_page: 0, // You can update this based on actual time spent
              visited_at: new Date().toISOString(),
            }),
          });
        };
        document.body.appendChild(script);
      }
      initTracking();
    </script>
  `;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(trackingScript);
    alert('Tracking script copied to clipboard!');
  };

  useEffect(() => {
    // Logic to get contact data from cookie and personalize the page if needed
    const contactData = getContactCookie();
    if (contactData) {
      console.log('Personalized Data:', contactData);
      // Use contactData to personalize the page
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Website Visitors</h1>
      <Card>
        <CardHeader>
          <CardTitle>Copy the Tracking Script</CardTitle>
        </CardHeader>
        <CardContent>
          <pre>{trackingScript}</pre>
          <button onClick={handleCopyScript} className="button">
            Copy Script
          </button>
          <p>Insert this script before the <code>&lt;/body&gt;</code> tag of your HTML.</p>
        </CardContent>
      </Card>
      {/* Here you can add your data visualization components for visitor tracking */}
    </div>
  );
};

export default WebsiteVisitors;
