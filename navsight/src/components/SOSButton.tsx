import { AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SOSButtonProps {
  onSOS: () => void;
}

export default function SOSButton({ onSOS }: SOSButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onSOS}
      className="flex flex-col items-center justify-center w-full gap-2 p-6 text-white transition-all bg-red-600 border-b-4 border-red-800 rounded-2xl shadow-lg hover:bg-red-700 active:bg-red-900"
      aria-label="Emergency SOS"
    >
      <AlertCircle className="w-12 h-12" />
      <span className="text-2xl font-black tracking-widest uppercase">SOS</span>
      <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Emergency Help</span>
    </motion.button>
  );
}
