import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Phone, Calendar, Map, BarChart3, Target, Award } from 'lucide-react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import DemoMap from '../components/landing/DemoMap';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-indigo-50">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Your AI Sales Development Representative
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Automate your roofing sales outreach with AI-powered cold calling and email campaigns that convert 4-8x better than traditional methods.
            </p>
            <div className="space-x-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/sign-up')}
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/demo')}
              >
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Map Demo */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Smart Territory Selection</h2>
            <p className="text-xl text-gray-600">
              Draw on the map to select properties. Our AI analyzes roof age, type, and weather patterns to prioritize your prospects.
            </p>
          </motion.div>
          <DemoMap />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-gradient-to-b from-violet-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-violet-200">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const features = [
  {
    title: 'Smart Territory Selection',
    description: 'Draw areas on Google Maps to target specific neighborhoods. Our AI analyzes roof age, type, and recent weather events to prioritize prospects.',
    icon: Map
  },
  {
    title: 'Automated Outreach',
    description: 'AI-powered cold calling and email sequences that adapt to prospect responses and optimize for the best times to reach out.',
    icon: Phone
  },
  {
    title: 'Intelligent Scheduling',
    description: 'Automatically schedule roof inspections when prospects are ready, syncing perfectly with your calendar.',
    icon: Calendar
  },
  {
    title: 'Performance Analytics',
    description: 'Track call metrics, conversion rates, and pipeline growth with our comprehensive dashboard.',
    icon: BarChart3
  },
  {
    title: 'Goal-Driven Campaigns',
    description: 'Set your income goals and let our AI determine the optimal outreach strategy to achieve them.',
    icon: Target
  },
  {
    title: 'AI Sales Team',
    description: 'Scale your outreach by adding multiple AI SDRs that compete through gamification and leaderboards.',
    icon: Award
  }
];

const metrics = [
  {
    value: '4-8x',
    label: 'Pipeline Growth'
  },
  {
    value: '24/7',
    label: 'Active Outreach'
  },
  {
    value: '1000s',
    label: 'Daily Prospects Analyzed'
  }
];

export default LandingPage;