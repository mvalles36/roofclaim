import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Claims = () => {
  const [claimNumber, setClaimNumber] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to submit the claim
    alert(`Claim submitted with number: ${claimNumber}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Insurance Claim Management</h2>
      <Card>
        <CardHeader>
          <CardTitle>Submit New Claim</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitClaim} className="space-y-4">
            <div>
              <Label htmlFor="claimNumber">Claim Number</Label>
              <Input
                id="claimNumber"
                value={claimNumber}
                onChange={(e) => setClaimNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Submit Claim</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Claims;