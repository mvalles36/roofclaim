import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';
import { FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';
import PolicyComparison from '../components/PolicyComparison';

const SupplementTracking = () => {
  const [supplements, setSupplements] = useState([]);
  const [newSupplement, setNewSupplement] = useState({
    policyNumber: '',
    estimateAmount: '',
    status: 'Drafting',
    documents: []
  });
  const [showPolicyComparison, setShowPolicyComparison] = useState(false);

  useEffect(() => {
    fetchSupplements();
  }, []);

  const fetchSupplements = async () => {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching supplements:', error);
    } else {
      setSupplements(data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplement(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value) => {
    setNewSupplement(prev => ({ ...prev, status: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const { data, error } = await supabase.storage
      .from('supplement-documents')
      .upload(`${Date.now()}-${file.name}`, file);

    if (error) {
      console.error('Error uploading file:', error);
    } else {
      setNewSupplement(prev => ({
        ...prev,
        documents: [...prev.documents, data.path]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('supplements')
      .insert([newSupplement]);

    if (error) {
      console.error('Error submitting supplement:', error);
    } else {
      fetchSupplements();
      setNewSupplement({
        policyNumber: '',
        estimateAmount: '',
        status: 'Drafting',
        documents: []
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Drafting': return <FileText className="h-5 w-5 text-yellow-500" />;
      case 'Review': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Submitted': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Approved': return <DollarSign className="h-5 w-5 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Supplement Tracking</h1>
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowPolicyComparison(!showPolicyComparison)}>
          {showPolicyComparison ? 'Hide Policy Comparison' : 'Show Policy Comparison'}
        </Button>
      </div>
      {showPolicyComparison && <PolicyComparison />}
      <Card>
        <CardHeader>
          <CardTitle>New Supplement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="policyNumber">Policy Number</Label>
              <Input
                id="policyNumber"
                name="policyNumber"
                value={newSupplement.policyNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="estimateAmount">Estimate Amount</Label>
              <Input
                id="estimateAmount"
                name="estimateAmount"
                type="number"
                value={newSupplement.estimateAmount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={handleStatusChange} value={newSupplement.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drafting">Drafting</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="documents">Upload Documents</Label>
              <Input
                id="documents"
                type="file"
                onChange={handleFileUpload}
                multiple
              />
            </div>
            <Button type="submit">Submit Supplement</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Supplement List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {supplements.map((supplement) => (
              <li key={supplement.id} className="flex justify-between items-center p-4 bg-white rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(supplement.status)}
                  <div>
                    <p className="font-semibold">Policy: {supplement.policyNumber}</p>
                    <p>Amount: ${supplement.estimateAmount}</p>
                    <p>Status: {supplement.status}</p>
                  </div>
                </div>
                <Button variant="outline">View Details</Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementTracking;