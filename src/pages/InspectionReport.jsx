import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '../integrations/supabase/supabase';

const InspectionReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    const { data, error } = await supabase
      .from('inspection_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
    } else {
      setReport(data);
    }
  };

  const handleDownload = () => {
    // Implement download functionality
    alert('Download functionality to be implemented');
  };

  const handleShare = () => {
    // Implement share functionality
    alert('Share functionality to be implemented');
  };

  if (!report) {
    return <div>Loading report...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Roof Inspection Report</h2>
      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p><strong>Date:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
          <p><strong>Overall Condition:</strong> {report.overall_condition}</p>
          <div>
            <h3 className="font-semibold">Damage Annotations:</h3>
            <ul className="list-disc list-inside">
              {report.damage_annotations.map((annotation, index) => (
                <li key={index}>{annotation}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Images:</h3>
            {report.images.map((image, index) => (
              <img key={index} src={image} alt={`Roof inspection ${index + 1}`} className="w-full max-w-md mx-auto rounded-lg shadow-md" />
            ))}
          </div>
          <div className="flex space-x-4">
            <Button onClick={handleDownload}>Download Report</Button>
            <Button onClick={handleShare} variant="outline">Share Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspectionReport;