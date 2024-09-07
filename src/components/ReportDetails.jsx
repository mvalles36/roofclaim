import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ReportDetails = ({ report }) => {
  const handleDownload = () => {
    if (report && report.report_url) {
      window.open(report.report_url, '_blank');
    } else {
      alert('No report available for download');
    }
  };

  const handleShare = () => {
    if (report && report.report_url) {
      navigator.clipboard.writeText(report.report_url)
        .then(() => alert('Report URL copied to clipboard'))
        .catch(err => console.error('Error copying report URL:', err));
    } else {
      alert('No report available to share');
    }
  };

  return (
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
        {report.roof_measurements_url && (
          <p><a href={report.roof_measurements_url} target="_blank" rel="noopener noreferrer">View Roof Measurements</a></p>
        )}
        {report.insurance_policy_url && (
          <p><a href={report.insurance_policy_url} target="_blank" rel="noopener noreferrer">View Insurance Policy</a></p>
        )}
        <div className="flex space-x-4">
          <Button onClick={handleDownload}>Download Report</Button>
          <Button onClick={handleShare} variant="outline">Share Report</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDetails;