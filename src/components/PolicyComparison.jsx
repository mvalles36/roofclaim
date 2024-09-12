import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';

const PolicyComparison = () => {
  const [policyDetails, setPolicyDetails] = useState('');
  const [damageReport, setDamageReport] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policyFile, setPolicyFile] = useState(null);
  const [damageReportFile, setDamageReportFile] = useState(null);

  const handleFileUpload = (event, setFileFunction) => {
    const file = event.target.files[0];
    setFileFunction(file);
  };

  const extractTextFromFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsText(file);
    });
  };

  const handleComparison = async () => {
    setIsLoading(true);
    try {
      let policyText = policyDetails;
      let damageText = damageReport;

      if (policyFile) {
        policyText = await extractTextFromFile(policyFile);
      }
      if (damageReportFile) {
        damageText = await extractTextFromFile(damageReportFile);
      }

      // Placeholder for API call
      const response = await axios.post('/api/compare-policy', {
        policyDetails: policyText,
        damageReport: damageText
      });
      setComparisonResult(response.data);
    } catch (error) {
      console.error('Error comparing policy:', error);
      alert('An error occurred while comparing the policy.');
    }
    setIsLoading(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Policy Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="policyFile">Upload Insurance Policy</Label>
          <Input
            id="policyFile"
            type="file"
            onChange={(e) => handleFileUpload(e, setPolicyFile)}
            accept=".pdf,.doc,.docx"
          />
        </div>
        <div>
          <Label htmlFor="policyDetails">Insurance Policy Details</Label>
          <Textarea
            id="policyDetails"
            value={policyDetails}
            onChange={(e) => setPolicyDetails(e.target.value)}
            placeholder="Enter key details from the insurance policy..."
          />
        </div>
        <div>
          <Label htmlFor="damageReportFile">Upload Damage Report</Label>
          <Input
            id="damageReportFile"
            type="file"
            onChange={(e) => handleFileUpload(e, setDamageReportFile)}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
        </div>
        <div>
          <Label htmlFor="damageReport">Roof Damage Report</Label>
          <Textarea
            id="damageReport"
            value={damageReport}
            onChange={(e) => setDamageReport(e.target.value)}
            placeholder="Enter details from the roof damage report..."
          />
        </div>
        <Button onClick={handleComparison} disabled={isLoading}>
          {isLoading ? 'Comparing...' : 'Compare Policy'}
        </Button>
        {comparisonResult && (
          <Alert>
            <AlertTitle>Comparison Results</AlertTitle>
            <AlertDescription>
              <p>Identified Gaps: {comparisonResult.gaps.join(', ')}</p>
              <p>Recommendations: {comparisonResult.recommendations.join(', ')}</p>
              <p>Suggested Supplement Items: {comparisonResult.supplementItems.join(', ')}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PolicyComparison;