import React from 'react';
import Header from '../components/landing/Header';
import Footer from '../components/landing/Footer';
import AiSdrHero from '../components/landing/AiSdrHero';
import CadenceSection from '../components/landing/CadenceSection';
import DemoMap from '../components/landing/DemoMap';
import FAQ from '../components/landing/FAQ';
import MetricsSection from '../components/landing/MetricsSection';
import { motion } from 'framer-motion';
import { BarChart3, Users, Target, Shield } from 'lucide-react';
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <AiSdrHero />
      <MetricsSection />
      <CadenceSection />
      
      {/* Territory Selection */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Smart Territory Selection</h2>
            <p className="text-xl text-gray-600 mb-8">
              Draw on the map to select properties. Our AI analyzes roof age, type, and weather 
              patterns to prioritize your prospects.
            </p>
          </motion.div>
          <DemoMap />
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Real-Time Performance Dashboard</h2>
            <p className="text-xl text-gray-600">
              Track your AI SDR's performance and optimize your sales goals in real-time.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-violet-50 rounded-lg"
            >
              <BarChart3 className="w-8 h-8 text-violet-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Metrics</h3>
              <p className="text-gray-600">Monitor calls, response rates, and appointments set</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 bg-violet-50 rounded-lg"
            >
              <Users className="w-8 h-8 text-violet-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI SDR Leaderboard</h3>
              <p className="text-gray-600">Compare performance across multiple AI SDRs</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6 bg-violet-50 rounded-lg"
            >
              <Target className="w-8 h-8 text-violet-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Goal Tracking</h3>
              <p className="text-gray-600">Set and monitor revenue goals with AI optimization</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 bg-violet-50 rounded-lg"
            >
              <Shield className="w-8 h-8 text-violet-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Results Guarantee</h3>
              <p className="text-gray-600">No results, no questions asked refund policy</p>
            </motion.div>
          </div>
        </div>
      </section>

      <FAQ />
      <Footer />
    </div>
  );
};

export default LandingPage;