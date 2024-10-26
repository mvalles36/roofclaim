import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const CadenceSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12">Intelligent Outreach Cadence</h2>
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-8 h-8 text-violet-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Smart Cold Calling</h3>
                    <p className="text-gray-600">
                      Our AI SDR makes intelligent cold calls, adapting its approach based on 
                      prospect responses and optimal calling times. Each conversation is 
                      natural and focused on qualifying leads for your roofing business.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-8 h-8 text-violet-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Automated Email Sequences</h3>
                    <p className="text-gray-600">
                      Personalized email campaigns that nurture leads through your sales funnel. 
                      Each email is crafted based on prospect engagement and behavior.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-8 h-8 text-violet-600 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Optimal Timing</h3>
                    <p className="text-gray-600">
                      The AI learns the best times to reach out to prospects, maximizing 
                      response rates and engagement across all communication channels.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CadenceSection;