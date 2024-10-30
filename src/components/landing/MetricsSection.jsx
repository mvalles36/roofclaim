import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const MetricsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-violet-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold mb-2">
              <CountUp end={8} suffix="x" duration={2} />
            </div>
            <div className="text-violet-200">Pipeline Growth</div>
          </motion.div>
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-violet-200">Active Outreach</div>
          </motion.div>
          <motion.div
            initial={{ y: 50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-4xl font-bold mb-2">
              <CountUp end={1000} suffix="+" duration={2} />
            </div>
            <div className="text-violet-200">Daily Prospects Analyzed</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsSection;