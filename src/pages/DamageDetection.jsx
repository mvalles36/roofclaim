import React from 'react';
import DamageDetectionUploader from '../components/DamageDetectionUploader';

const DamageDetection = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AI Damage Detection</h1>
      <DamageDetectionUploader />
    </div>
  );
};

export default DamageDetection;