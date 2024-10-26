import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            <AccordionItem value="exclusive-leads">
              <AccordionTrigger>Exclusive Leads with Intent Verification</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4">
                  <li>
                    <strong>High-Intent Screening:</strong> Our AI SDR actively qualifies leads in real-time, 
                    ensuring genuine interest in roof replacement through personalized conversations.
                  </li>
                  <li>
                    <strong>Exclusive, Live Conversations:</strong> Each lead is the result of real, 
                    personalized outreach—not simply form fills, creating higher quality opportunities.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="predictive-scoring">
              <AccordionTrigger>Enhanced Predictive Scoring and Lead Quality Insights</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4">
                  <li>
                    <strong>Predictive Lead Scoring:</strong> AI analysis of engagement patterns helps 
                    prioritize leads based on likelihood to convert.
                  </li>
                  <li>
                    <strong>Detailed Interest Profiles:</strong> Rich, actionable insights from each 
                    interaction improve close rates.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="real-time-signals">
              <AccordionTrigger>Real-Time Intent Signals and Heat Mapping</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4">
                  <li>
                    <strong>Behavioral Heat Mapping:</strong> Track engagement patterns to identify 
                    your warmest prospects.
                  </li>
                  <li>
                    <strong>Immediate Engagement Alerts:</strong> Get notified instantly when leads 
                    express strong interest.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pricing">
              <AccordionTrigger>Transparent, Outcome-Based Pricing</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4">
                  <li>
                    <strong>Pay for Results:</strong> Only pay for leads that meet minimum 
                    engagement thresholds.
                  </li>
                  <li>
                    <strong>ROI Guarantee:</strong> "No result, no charge" offer for qualified 
                    companies during the trial period.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;