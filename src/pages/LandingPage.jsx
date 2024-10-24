import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { FileText, Users, Search } from 'lucide-react';

const LandingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  
  const [personalization, setPersonalization] = useState({
    companyName: searchParams.get('company') || 'Your Company',
    location: searchParams.get('location') || 'your area',
    roofType: searchParams.get('roofType') || 'residential'
  });

  const heroImage = personalization.roofType === 'commercial' 
    ? '/commercial-roof.jpg' 
    : '/residential-roof.jpg';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative h-screen flex items-center justify-center text-white"
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Roof" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Professional Roofing Solutions for {personalization.companyName}
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            Trusted Insurance Restoration Roofing in {personalization.location}
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-x-4"
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/app')}
              className="bg-primary hover:bg-primary/90"
            >
              Get Started
            </Button>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20">
                Sign In
              </Button>
            </SignInButton>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
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
                className="p-6 rounded-lg shadow-lg bg-white"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 bg-primary text-white"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Roofing Business?</h2>
          <p className="text-xl mb-8">Join thousands of successful contractors using RoofClaim</p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/sign-up')}
            className="bg-white text-primary hover:bg-white/90"
          >
            Start Free Trial
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

const features = [
  {
    title: 'Insurance Claim Processing',
    description: 'Streamline your insurance claims with our automated system',
    icon: FileText
  },
  {
    title: 'Lead Generation',
    description: 'Find and convert more prospects in your area',
    icon: Users
  },
  {
    title: 'Damage Detection',
    description: 'AI-powered roof damage detection and assessment',
    icon: Search
  }
];

export default LandingPage;