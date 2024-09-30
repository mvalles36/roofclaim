import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const GongComponent: React.FC<{ onHit: () => void }> = ({ onHit }) => {
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
  const [showGongEffect, setShowGongEffect] = useState(false);
  const gongRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsGrabbed(true);
    setStickPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isGrabbed) {
      setStickPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsGrabbed(false);
    if (gongRef.current && isCollidingWithGong()) {
      hitGong();
    }
  };

  const isCollidingWithGong = () => {
    if (gongRef.current) {
      const gongRect = gongRef.current.getBoundingClientRect();
      return (
        stickPosition.x > gongRect.left &&
        stickPosition.x < gongRect.right &&
        stickPosition.y > gongRect.top &&
        stickPosition.y < gongRect.bottom
      );
    }
    return false;
  };

  const hitGong = () => {
    setShowGongEffect(true);
    onHit();
    toast({
      title: "Gong Hit!",
      description: "Congratulations on the sale!",
    });
    setTimeout(() => setShowGongEffect(false), 500);
  };

  return (
    <div className="relative w-full h-96 bg-gray-100 overflow-hidden" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <motion.div
        ref={gongRef}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-yellow-600 border-8 border-yellow-800"
        animate={showGongEffect ? { scale: [1, 1.2, 1] } : {}}
      />
      <motion.div
        className="absolute w-8 h-32 bg-brown-500 rounded-full cursor-grab"
        style={{ left: `${stickPosition.x}px`, top: `${stickPosition.y}px` }}
        animate={{ x: stickPosition.x, y: stickPosition.y }}
        onMouseDown={handleMouseDown}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
    </div>
  );
};

export default GongComponent;
