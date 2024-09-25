import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SalesProcessVisualization = ({ process }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{process.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {process.stages.map((stage, index) => (
            <AccordionItem key={stage.id} value={`stage-${index}`}>
              <AccordionTrigger>{stage.name}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-gray-500 mb-2">{stage.description}</p>
                <p className="text-sm mb-4">Duration: {stage.duration} days</p>
                <ul className="list-disc list-inside">
                  {stage.steps.map((step, stepIndex) => (
                    <li key={step.id} className="mb-2">
                      <span className="font-semibold">{step.name}</span>
                      <p className="text-sm ml-4">{step.description}</p>
                      <p className="text-sm ml-4">Probability: {step.probability}%</p>
                      <p className="text-sm ml-4">Wait Time: {step.wait_time} days</p>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default SalesProcessVisualization;
