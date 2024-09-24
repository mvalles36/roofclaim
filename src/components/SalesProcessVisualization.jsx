import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SalesProcessVisualization = ({ data }) => {
  return (
    <div className="space-y-4">
      {data.map((stage) => (
        <Card key={stage.id}>
          <CardHeader>
            <CardTitle>{stage.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-2">{stage.description}</p>
            <p className="text-sm mb-2">Duration: {stage.duration} days</p>
            <p className="text-sm mb-4">Probability: {stage.min_probability}% - {stage.max_probability}%</p>
            <Accordion type="single" collapsible>
              {stage.Steps.map((step) => (
                <AccordionItem key={step.id} value={`step-${step.id}`}>
                  <AccordionTrigger>{step.name}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-2">{step.description}</p>
                    <p className="text-sm mb-2">Probability: {step.probability}%</p>
                    <p className="text-sm mb-4">Wait Time: {step.wait_time} days</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Activities:</h4>
                      <ul className="list-disc list-inside">
                        {step.Activities.map((activity) => (
                          <li key={activity.id} className="text-sm">{activity.activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold">Tools:</h4>
                      <ul className="list-disc list-inside">
                        {step.Tools.map((tool) => (
                          <li key={tool.id} className="text-sm">{tool.tool}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold">Expected Outcomes:</h4>
                      <ul className="list-disc list-inside">
                        {step.ExpectedOutcomes.map((outcome) => (
                          <li key={outcome.id} className="text-sm">{outcome.outcome}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2 mt-4">
                      <h4 className="font-semibold">Challenges:</h4>
                      <ul className="list-disc list-inside">
                        {step.Challenges.map((challenge) => (
                          <li key={challenge.id} className="text-sm">{challenge.challenge}</li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SalesProcessVisualization;