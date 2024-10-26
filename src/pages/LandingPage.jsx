import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { 
  Phone, 
  Calendar, 
  Map, 
  BarChart3, 
  Target, 
  Award, 
  Bot, 
  Mail,
  ArrowRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-indigo-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Pipeline AI
          </h1>
          <div className="space-x-4">
            <Button variant="ghost" onClick={() => navigate('/features')}>Features</Button>
            <Button variant="ghost" onClick={() => navigate('/pricing')}>Pricing</Button>
            <SignInButton mode="modal">
              <Button variant="outline">Sign In</Button>
            </SignInButton>
          </div>
        </nav>
      </header>

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
                <ArrowRight className="ml-2 h-4 w-4" />
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

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-gradient-to-b from-white to-gray-50 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-violet-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Pipeline AI</h3>
              <p className="text-sm">Revolutionizing roofing sales with AI-powered outreach and automation.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            © {new Date().getFullYear()} Pipeline AI. All rights reserved.
          </div>
        </div>
      </footer>
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