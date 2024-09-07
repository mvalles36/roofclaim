import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '../integrations/supabase/supabase';

const InstallationTracking = () => {
  const [installations, setInstallations] = useState([]);
  const [selectedInstallation, setSelectedInstallation] = useState(null);

  useEffect(() => {
    fetchInstallations();
  }, []);

  const fetchInstallations = async () => {
    const { data, error } = await supabase
      .from('installations')
      .select('*, customers(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching installations:', error);
    } else {
      setInstallations(data);
      if (data.length > 0) {
        setSelectedInstallation(data[0]);
      }
    }
  };

  const handleUpdateProgress = async (newProgress) => {
    const { error } = await supabase
      .from('installations')
      .update({ progress: newProgress })
      .eq('id', selectedInstallation.id);

    if (error) {
      alert('Error updating installation progress: ' + error.message);
    } else {
      fetchInstallations();
    }
  };

  const handleCompleteMilestone = async (milestoneIndex) => {
    const updatedMilestones = [...selectedInstallation.milestones];
    updatedMilestones[milestoneIndex].completed = true;

    const { error } = await supabase
      .from('installations')
      .update({ milestones: updatedMilestones })
      .eq('id', selectedInstallation.id);

    if (error) {
      alert('Error updating milestone: ' + error.message);
    } else {
      fetchInstallations();
    }
  };

  if (!selectedInstallation) {
    return <div>Loading installation progress...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Installation Progress Tracking</h2>
      <Select
        onValueChange={(value) => setSelectedInstallation(installations.find(i => i.id.toString() === value))}
        defaultValue={selectedInstallation.id.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an installation" />
        </SelectTrigger>
        <SelectContent>
          {installations.map((installation) => (
            <SelectItem key={installation.id} value={installation.id.toString()}>
              {installation.customers.name} - {installation.address}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Card>
        <CardHeader>
          <CardTitle>Current Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={selectedInstallation.progress} className="w-full" />
          <p className="mt-2 text-center">{selectedInstallation.progress}% Complete</p>
          <div className="mt-4 space-x-2">
            <Button onClick={() => handleUpdateProgress(Math.max(0, selectedInstallation.progress - 10))}>-10%</Button>
            <Button onClick={() => handleUpdateProgress(Math.min(100, selectedInstallation.progress + 10))}>+10%</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {selectedInstallation.milestones.map((milestone, index) => (
              <li key={index} className={`flex items-center justify-between ${milestone.completed ? 'text-green-600' : 'text-gray-600'}`}>
                <span>
                  <span className={`mr-2 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`}>
                    {milestone.completed ? '✓' : '○'}
                  </span>
                  {milestone.description}
                </span>
                {!milestone.completed && (
                  <Button onClick={() => handleCompleteMilestone(index)} size="sm">Complete</Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallationTracking;