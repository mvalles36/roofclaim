import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Target, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AiSdrHero = () => {
  return (
    <div className="relative bg-gradient-to-b from-violet-50 to-indigo-50 py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8">
            <Bot className="w-16 h-16 mx-auto text-violet-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Meet Your New AI Sales Development Representative
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A force multiplier for your roofing business. Our AI SDR works 24/7, handling cold calls, 
            emails, and lead qualification so you can focus on closing deals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
            >
              Start Pipeline Kickstart Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
            >
              Watch Demo
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Target className="w-8 h-8 text-violet-600 mb-2" />
              <h3 className="text-lg font-semibold">Smart Targeting</h3>
              <p className="text-gray-600">AI-powered lead scoring and qualification</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 text-violet-600 mb-2" />
              <h3 className="text-lg font-semibold">Results Guarantee</h3>
              <p className="text-gray-600">No results, no questions asked refund</p>
            </div>
            <div className="flex flex-col items-center">
              <Bot className="w-8 h-8 text-violet-600 mb-2" />
              <h3 className="text-lg font-semibold">24/7 Operation</h3>
              <p className="text-gray-600">Never miss a potential lead</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AiSdrHero;