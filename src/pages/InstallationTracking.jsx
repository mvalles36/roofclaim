import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from '../integrations/supabase/supabase';

const InstallationTracking = () => {
  const [installation, setInstallation] = useState(null);

  useEffect(() => {
    fetchInstallationProgress();
  }, []);

  const fetchInstallationProgress = async () => {
    const { data, error } = await supabase
      .from('installations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching installation progress:', error);
    } else {
      setInstallation(data);
    }
  };

  if (!installation) {
    return <div>Loading installation progress...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Installation Progress Tracking</h2>
      <Card>
        <CardHeader>
          <CardTitle>Current Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={installation.progress} className="w-full" />
          <p className="mt-2 text-center">{installation.progress}% Complete</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {installation.milestones.map((milestone, index) => (
              <li key={index} className={`flex items-center ${milestone.completed ? 'text-green-600' : 'text-gray-600'}`}>
                <span className={`mr-2 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`}>
                  {milestone.completed ? '✓' : '○'}
                </span>
                {milestone.description}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallationTracking;