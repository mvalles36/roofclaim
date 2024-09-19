import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from 'axios';
import DocumentEditor from "@/components/DocumentEditor"; // Import DocumentEditor component

const SmartSupplement = () => {
  const [policyDetails, setPolicyDetails] = useState('');
  const [damageReport, setDamageReport] = useState('');
  const [estimateReport, setEstimateReport] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [policyFile, setPolicyFile] = useState(null);
  const [damageReportFile, setDamageReportFile] = useState(null);
  const [estimateFile, setEstimateFile] = useState(null);
  const [openEditor, setOpenEditor] = useState(false);

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
      let estimateText = estimateReport;

      if (policyFile) {
        policyText = await extractTextFromFile(policyFile);
      }
      if (damageReportFile) {
        damageText = await extractTextFromFile(damageReportFile);
      }
      if (estimateFile) {
        estimateText = await extractTextFromFile(estimateFile);
      }

      const response = await axios.post('/api/smart-supplement', {
        policyDetails: policyText,
        damageReport: damageText,
        estimateReport: estimateText
      });

      setComparisonResult(response.data);
      setOpenEditor(true);

    } catch (error) {
      console.error('Error generating supplement report:', error);
      alert('An error occurred while generating the supplement report.');
    }
    setIsLoading(false);
  };

  const handleItemApproval = (itemId) => {
    setComparisonResult((prev) => ({
      ...prev,
      supplementItems: prev.supplementItems.map(item =>
        item.id === itemId ? { ...item, approved: true } : item
      )
    }));
  };

  const handleItemRemoval = (itemId) => {
    setComparisonResult((prev) => ({
      ...prev,
      supplementItems: prev.supplementItems.filter(item => item.id !== itemId)
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>SmartSupplement</CardTitle>
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
            placeholder="Enter any details from the insurance policy..."
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
            placeholder="Enter details from the roof damage assessment report..."
          />
        </div>
        <div>
          <Label htmlFor="estimateFile">Upload Adjuster Estimate</Label>
          <Input
            id="estimateFile"
            type="file"
            onChange={(e) => handleFileUpload(e, setEstimateFile)}
            accept=".pdf,.doc,.docx"
          />
        </div>
        <div>
          <Label htmlFor="estimateReport">Adjuster Estimate Details</Label>
          <Textarea
            id="estimateReport"
            value={estimateReport}
            onChange={(e) => setEstimateReport(e.target.value)}
            placeholder="Enter details from the adjuster estimate..."
          />
        </div>
        <Button onClick={handleComparison} disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Generate Supplement Report'}
        </Button>
        {comparisonResult && (
          <Alert>
            <AlertTitle>Supplement Report</AlertTitle>
            <AlertDescription>
              <p>Identified Gaps: {comparisonResult.gaps.join(', ')}</p>
              <p>Recommendations: {comparisonResult.recommendations.join(', ')}</p>
              <p>Suggested Supplement Items:</p>
              <ul>
                {comparisonResult.supplementItems.map(item => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>{item.name} - ${item.price} (Qty: {item.quantity})</span>
                    <div>
                      {!item.approved && <Button onClick={() => handleItemApproval(item.id)}>Approve</Button>}
                      <Button onClick={() => handleItemRemoval(item.id)} variant="danger">Remove</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {openEditor && (
        <DocumentEditor
          template="SupplementRequestTemplate" // Specify your template name
          data={comparisonResult.supplementItems}
          onSave={(document) => {
            // Logic to associate the document with the contact
            // Save document and associate it with the contact
            console.log('Document saved and associated:', document);
          }}
          onEmail={(document) => {
            // Logic to email the document
            console.log('Document emailed:', document);
          }}
        />
      )}
    </Card>
  );
};

export default SmartSupplement;
