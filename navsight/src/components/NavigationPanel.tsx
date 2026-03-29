import { motion } from 'motion/react';
import { MapPin, Navigation, StopCircle, Volume2, VolumeX } from 'lucide-react';
import { NavZone } from '../lib/navigationEngine';

interface NavigationPanelProps {
  isNavigating: boolean;
  currentZone: NavZone | null;
  onStart: () => void;
  onStop: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function NavigationPanel({ isNavigating, currentZone, onStart, onStop, isMuted, onToggleMute }: NavigationPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8 p-4 text-center">
      <div className="relative w-full max-w-[280px] aspect-square">
        {/* Radar Animation */}
        <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
        <div className="absolute inset-8 border-4 border-blue-500/15 rounded-full"></div>
        <div className="absolute inset-16 border-4 border-blue-500/20 rounded-full"></div>
        
        <motion.div
          className="absolute inset-0 border-t-4 border-blue-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Active Navigation Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isNavigating ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <Navigation className="w-16 h-16 text-blue-600 animate-pulse" />
              <div className="text-2xl font-black tracking-tighter text-blue-600 uppercase">
                Active
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <MapPin className="w-16 h-16 text-slate-400" />
              <div className="text-2xl font-black tracking-tighter text-slate-400 uppercase">
                Idle
              </div>
            </motion.div>
          )}
        </div>
        
        {/* Simulated Obstacles */}
        {isNavigating && currentZone && currentZone.proximity > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                {currentZone.name}
              </span>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="flex flex-col w-full gap-4">
        {isNavigating ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStop}
            className="flex items-center justify-center w-full gap-3 p-6 text-white transition-all bg-slate-800 border-b-4 border-slate-950 rounded-2xl shadow-lg hover:bg-slate-900"
            aria-label="Stop Navigation"
          >
            <StopCircle className="w-8 h-8" />
            <span className="text-xl font-black tracking-widest uppercase">Stop Navigation</span>
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="flex items-center justify-center w-full gap-3 p-6 text-white transition-all bg-blue-600 border-b-4 border-blue-800 rounded-2xl shadow-lg hover:bg-blue-700"
            aria-label="Start Navigation"
          >
            <Navigation className="w-8 h-8" />
            <span className="text-xl font-black tracking-widest uppercase">Start Navigation</span>
          </motion.button>
        )}
        
        <button
          onClick={onToggleMute}
          className="flex items-center justify-center gap-2 p-2 text-slate-500 transition-all hover:text-slate-900"
          aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span className="text-[10px] font-bold uppercase tracking-widest">
            {isMuted ? "Audio Muted" : "Audio Active"}
          </span>
        </button>
      </div>
    </div>
  );
}
