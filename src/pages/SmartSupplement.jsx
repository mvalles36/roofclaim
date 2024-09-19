import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';

// Make sure to have proper initialization and API setup for DocumentAI
// import { DocumentAI } from "@google-cloud/documentai";

const SmartSupplement = () => {
  const [policyDetails, setPolicyDetails] = useState('');
  const [damageReport, setDamageReport] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policyFile, setPolicyFile] = useState(null);
  const [damageReportFile, setDamageReportFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (event, setFileFunction) => {
    const file = event.target.files[0];
    setFileFunction(file);
  };

  const extractTextFromDocument = async (file) => {
    // DocumentAI setup (for Google Cloud Document AI)
    // const projectId = 'your-project-id';
    // const location = 'your-location';
    // const documentAI = new DocumentAI({ projectId, location });

    try {
      // Convert file to ArrayBuffer
      const fileContent = await file.arrayBuffer();
      // Uncomment the following lines once DocumentAI setup is complete
      // const [response] = await documentAI.processDocument({
      //   rawDocument: { content: fileContent }
      // });
      // return { extractedText: response.document.text, extractedEntities: [] };
      
      // For now, mock implementation
      return { extractedText: 'Mocked extracted text from document', extractedEntities: [] };
    } catch (error) {
      console.error('Error extracting text:', error);
      throw new Error('Failed to extract text from document.');
    }
  };

  const handleComparison = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      let policyData, damageData;

      if (policyFile) {
        const { extractedText, extractedEntities } = await extractTextFromDocument(policyFile);
        policyData = { text: extractedText, entities: extractedEntities };
      } else {
        policyData = { text: policyDetails };
      }

      if (damageReportFile) {
        const { extractedText } = await extractTextFromDocument(damageReportFile);
        damageData = { text: extractedText };
      } else {
        damageData = { text: damageReport };
      }

      const identifiedCoverageGaps = []; // Define how to extract these if needed
      const supplementRecommendations = []; // Define how to extract these if needed

      const response = await axios.post('/api/smart-supplement', {
        policyData,
        damageData,
        identifiedCoverageGaps,
        supplementRecommendations
      });

      setComparisonResult(response.data);
    } catch (error) {
      console.error('Error comparing policy:', error);
      setErrorMessage('An error occurred while comparing the policy.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">SmartSupplement</h1>
      <Card>
        <CardHeader>
          <CardTitle>Input Details</CardTitle>
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
            <Label htmlFor="damageReportFile">Upload Roof Damage Assessment Report</Label>
            <Input
              id="damageReportFile"
              type="file"
              onChange={(e) => handleFileUpload(e, setDamageReportFile)}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>
          <div>
            <Label htmlFor="damageReport">Roof Damage Assessment Report</Label>
            <Textarea
              id="damageReport"
              value={damageReport}
              onChange={(e) => setDamageReport(e.target.value)}
              placeholder="Enter details from the roof damage report..."
            />
          </div>
          <Button onClick={handleComparison} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Analyze Documents'}
          </Button>
          {comparisonResult && (
            <Alert>
              <AlertTitle>Analysis Results</AlertTitle>
              <AlertDescription>
                <p>Identified Gaps: {comparisonResult.gaps?.join(', ') || 'N/A'}</p>
                <p>Recommendations: {comparisonResult.recommendations?.join(', ') || 'N/A'}</p>
                <p>Suggested Supplement Items: {comparisonResult.supplementItems?.join(', ') || 'N/A'}</p>
              </AlertDescription>
            </Alert>
          )}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartSupplement;
