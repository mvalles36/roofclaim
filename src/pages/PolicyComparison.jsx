import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '../integrations/supabase/supabase';
import axios from 'axios';
import { DocumentAI } from '@google-cloud/documentai'; // Import DocumentAI library

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

  const extractTextFromDocument = async (file) => {
    const projectId = 'your-project-id'; // Replace with your GCP project ID
    const location = 'your-location'; // Replace with your Document AI location
    const documentAI = new DocumentAI({ projectId, location });

    // Use Document AI to process the uploaded file
    const [response] = await documentAI.processDocument({
      rawDocument: {
        content: file.arrayBuffer,
      },
    });

    // Extract relevant text and entities based on your needs
    const extractedText = response.document.text;
    const extractedEntities = []; // Placeholder for extracted entities

    return { extractedText, extractedEntities };
  };

  const handleComparison = async () => {
    setIsLoading(true);
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

      // Use AutoML Entity Extraction and Dialogflow for advanced analysis (placeholder)
      const identifiedCoverageGaps = []; // Placeholder for identified gaps
      const supplementRecommendations = []; // Placeholder for supplement recommendations

      const response = await axios.post('/api/compare-policy', {
        policyData,
        damageData,
        identifiedCoverageGaps,
        supplementRecommendations,
      });
      setComparisonResult(response.data);
    } catch (error) {
      console.error('Error comparing policy:', error);
      alert('An error occurred while comparing the policy.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Policy Comparison</h1>
      <Card>
        <CardHeader>
          <CardTitle>Input Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="policyFile">
