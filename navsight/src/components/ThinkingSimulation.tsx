import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const MESSAGES = [
  "Analyzing safest route...",
  "Checking obstacles...",
  "Optimizing path...",
  "Scanning environment...",
  "Initializing audio engine...",
  "Ready for navigation."
];

interface ThinkingSimulationProps {
  onComplete: () => void;
}

export default function ThinkingSimulation({ onComplete }: ThinkingSimulationProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < MESSAGES.length) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [index, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-6 text-center">
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 border-4 border-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-4 border-4 border-blue-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-8 border-4 border-blue-300 rounded-full"
          animate={{ scale: [1.2, 1, 1.2], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-2xl font-bold text-blue-100"
      >
        {MESSAGES[index] || MESSAGES[MESSAGES.length - 1]}
      </motion.div>
      
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
