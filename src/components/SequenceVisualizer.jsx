import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, CheckSquare, ArrowRight } from 'lucide-react';

const SequenceVisualizer = ({ sequence }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{sequence.name} Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center">
          {sequence.steps.map((step, index) => (
            <React.Fragment key={index}>
              <Card className="w-32 h-32 flex flex-col items-center justify-center">
                {step.type === 'email' && <Mail className="w-8 h-8 mb-2" />}
                {step.type === 'call' && <Phone className="w-8 h-8 mb-2" />}
                {step.type === 'task' && <CheckSquare className="w-8 h-8 mb-2" />}
                <div className="text-sm text-center">{step.type}</div>
                <div className="text-xs text-gray-500">Wait: {step.waitDays} days</div>
              </Card>
              {index < sequence.steps.length - 1 && (
                <ArrowRight className="w-6 h-6 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SequenceVisualizer;