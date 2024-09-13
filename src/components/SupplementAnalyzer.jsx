import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SupplementAnalyzer = ({ result }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplement Analysis Result</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-2">Policyholder Information</h2>
        <p>Name: {result.policyholderName}</p>
        <p>Policy Number: {result.policyNumber}</p>
        <p>Claim Number: {result.claimNumber}</p>
        <p>Property Address: {result.propertyAddress}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Inspection Details</h2>
        <p>Date of Inspection: {result.inspectionDate}</p>
        <p>Type of Damage: {result.damageType}</p>
        <p>Scope of Work: {result.scopeOfWork}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Supplement Details</h2>
        <p>Initial Estimate: {result.initialEstimate.item} - ${result.initialEstimate.cost}</p>
        
        <h3 className="text-lg font-semibold mt-2 mb-1">Supplemental Costs:</h3>
        <ul>
          {result.supplementalCosts.map((cost, index) => (
            <li key={index}>{cost.item}: ${cost.cost}</li>
          ))}
        </ul>

        <p className="font-semibold mt-2">Total Supplemental Amount: ${result.totalSupplementAmount}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Justification</h2>
        <p>{result.justification}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Submitted By</h2>
        <p>Name: {result.submittedBy.name}</p>
        <p>Company: {result.submittedBy.company}</p>
        <p>Contact: {result.submittedBy.contactInfo}</p>
      </CardContent>
    </Card>
  );
};