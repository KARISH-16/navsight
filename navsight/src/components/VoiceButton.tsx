import { Mic, MicOff } from 'lucide-react';
import { motion } from 'motion/react';

interface VoiceButtonProps {
  isListening: boolean;
  onToggle: () => void;
}

export default function VoiceButton({ isListening, onToggle }: VoiceButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex flex-col items-center justify-center w-full gap-2 p-6 text-white transition-all rounded-2xl shadow-lg border-b-4 ${isListening ? 'bg-green-600 border-green-800 animate-pulse' : 'bg-blue-600 border-blue-800'}`}
      aria-label={isListening ? "Stop Voice Recognition" : "Start Voice Recognition"}
    >
      {isListening ? (
        <Mic className="w-10 h-10" />
      ) : (
        <MicOff className="w-10 h-10" />
      )}
      <span className="text-lg font-black tracking-widest uppercase">
        {isListening ? "Listening..." : "Voice Control"}
      </span>
      <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
        {isListening ? "Say 'Stop' or 'Help'" : "Tap to activate"}
      </span>
    </motion.button>
  );
}
