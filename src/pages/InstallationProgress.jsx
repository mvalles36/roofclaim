import { useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InstallationProgress = () => {
  const [progress, setProgress] = useState(30); // Example progress value

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Installation Progress</h2>
      <Card>
        <CardHeader>
          <CardTitle>Current Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-center">{progress}% Complete</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallationProgress;