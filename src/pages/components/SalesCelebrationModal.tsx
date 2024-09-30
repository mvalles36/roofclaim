import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GongComponent from './GongComponent';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SalesCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesperson: string;
}

const SalesCelebrationModal: React.FC<SalesCelebrationModalProps> = ({ isOpen, onClose, salesperson }) => {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleGongHit = () => {
    setIsCelebrating(true);
    setTimeout(() => setIsCelebrating(false), 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white p-8 rounded-lg w-full h-full flex flex-col items-center justify-center relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <h2 className="text-3xl font-bold mb-4">New Sale Celebration!</h2>
            <p className="text-xl mb-8">{salesperson} just made a sale!</p>
            <GongComponent onHit={handleGongHit} />
            {isCelebrating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-6xl">👏👏👏</div>
              </motion.div>
            )}
            <Button
              className="mt-8"
              onClick={() => setIsCelebrating(true)}
            >
              Applaud
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesCelebrationModal;
