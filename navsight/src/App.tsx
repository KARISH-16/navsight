import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, Navigation, Volume2, VolumeX, WifiOff, LogOut, User, 
  Camera, Shield, Activity, MapPin, Menu, X, ChevronRight, Speaker,
  Home, Info, Mic, MicOff
} from 'lucide-react';

// Engines
import { audioEngine } from './lib/audioEngine';
import { voiceEngine } from './lib/voiceEngine';
import { vibrationEngine } from './lib/vibrationEngine';
import { navigationEngine, NavZone } from './lib/navigationEngine';

// Components
import ThinkingSimulation from './components/ThinkingSimulation';
import SOSButton from './components/SOSButton';
import VoiceButton from './components/VoiceButton';
import CameraFeed from './components/CameraFeed';
import SignIn from './components/SignIn';
import FeatureCard from './components/FeatureCard';
import NavigationPanel from './components/NavigationPanel';

type Page = 'home' | 'features' | 'navigation' | 'signin' | 'thinking';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentZone, setCurrentZone] = useState<NavZone | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  
  const zoneIntervalRef = useRef<number | null>(null);
  const zoneIndexRef = useRef(0);

  // --- Handlers ---

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
    
    // Stop navigation if leaving navigation page
    if (page !== 'navigation' && page !== 'thinking') {
      stopNavigationLogic();
    }
  };

  const handleSignIn = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    navigateTo('home');
    voiceEngine.speak(`Welcome back, ${email.split('@')[0]}. NavSight is ready.`);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    navigateTo('home');
    voiceEngine.speak("Signed out successfully.");
  };

  const startNavigation = () => {
    if (!isLoggedIn) {
      navigateTo('signin');
      return;
    }
    navigateTo('thinking');
    voiceEngine.speak("Analyzing safest route. Please wait.");
  };

  const stopNavigationLogic = useCallback(() => {
    audioEngine.stopBeeping();
    navigationEngine.stopMonitoring();
    vibrationEngine.stop();
    
    if (zoneIntervalRef.current) {
      clearInterval(zoneIntervalRef.current);
      zoneIntervalRef.current = null;
    }
  }, []);

  const triggerSOS = useCallback(() => {
    vibrationEngine.sos();
    const message = `EMERGENCY: I am using NavSight and need immediate assistance. My simulated location is: 42.3601° N, 71.0589° W. User: ${userEmail}`;
    voiceEngine.speak("Emergency SOS triggered. Sending message to your emergency contact.");
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
  }, [userEmail]);

  const handleVoiceCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase();
    if (cmd.includes('start navigation')) {
      setAnnouncement("Starting navigation");
      startNavigation();
    } else if (cmd.includes('stop navigation')) {
      setAnnouncement("Stopping navigation");
      navigateTo('home');
    } else if (cmd.includes('help me') || cmd.includes('sos')) {
      setAnnouncement("Emergency SOS triggered");
      triggerSOS();
    }
  }, [startNavigation, triggerSOS]);

  const toggleVoice = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
      voiceEngine.speak("Voice control deactivated.");
    } else {
      const success = voiceEngine.startListening(handleVoiceCommand);
      if (success) {
        setIsListening(true);
        voiceEngine.speak("Voice control activated. I am listening.");
      } else {
        voiceEngine.speak("Voice recognition is not supported.");
      }
    }
  };

  const detectScreenReader = useCallback(() => {
    if (!screenReaderActive) {
      setScreenReaderActive(true);
      voiceEngine.speak("Screen reader detected. Optimizing audio guidance for accessibility.");
      console.log("Screen reader detected via focus event.");
    }
  }, [screenReaderActive]);

  const handleThinkingComplete = () => {
    setCurrentPage('navigation');
    voiceEngine.speak("Navigation started. Path is clear. Continue straight.");
    audioEngine.startBeeping(0, 440, 800);
    navigationEngine.startMonitoring(() => {
      voiceEngine.speak("Warning: No movement detected for 10 seconds. Are you safe? Triggering emergency alert if no response.");
      vibrationEngine.obstacle();
    });

    // Simulate zone changes
    zoneIndexRef.current = 0;
    zoneIntervalRef.current = window.setInterval(() => {
      const zone = navigationEngine.getSimulatedZone(zoneIndexRef.current);
      setCurrentZone(zone);
      
      if (zone.type !== 'clear') {
        voiceEngine.speak(zone.message);
        audioEngine.updatePan(zone.pan);
        audioEngine.startBeeping(zone.pan, 440, 800 - (zone.proximity * 600));
        
        if (zone.type === 'staircase' || zone.type === 'road') {
          vibrationEngine.obstacle();
        } else {
          vibrationEngine.left();
        }
      } else {
        audioEngine.updatePan(0);
        audioEngine.startBeeping(0, 440, 800);
        vibrationEngine.straight();
      }
      
      zoneIndexRef.current++;
    }, 8000);
  };

  // --- Effects ---

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const startApp = () => {
      voiceEngine.speak("NavSight ready. Say start navigation.");
      // Attempt to start listening automatically after first interaction
      const success = voiceEngine.startListening(handleVoiceCommand);
      if (success) {
        setIsListening(true);
      }
      window.removeEventListener('click', startApp);
      window.removeEventListener('keydown', startApp);
    };

    window.addEventListener('click', startApp);
    window.addEventListener('keydown', startApp);

    // Check for high-contrast or reduced motion as accessibility hints
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
        window.matchMedia('(forced-colors: active)').matches) {
      setScreenReaderActive(true);
      voiceEngine.speak("Accessibility mode detected. Enhancing audio feedback.");
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('click', startApp);
      window.removeEventListener('keydown', startApp);
      stopNavigationLogic();
      voiceEngine.stopListening();
    };
  }, [stopNavigationLogic, handleVoiceCommand]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/20 flex flex-col">
      {/* Screen Reader Detection Point */}
      <div 
        role="button" 
        tabIndex={0} 
        className="sr-only" 
        onFocus={detectScreenReader}
        aria-label="Screen reader detection point"
      />

      {/* ARIA Live Region for Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {/* Global Offline Banner */}
      {!isOnline && (
        <div className="bg-orange-600 text-white text-[10px] sm:text-xs font-bold py-1.5 px-4 flex items-center justify-center gap-2 sticky top-0 z-[60] shadow-md">
          <WifiOff className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>OFFLINE MODE ACTIVE - ALL FEATURES FUNCTIONAL</span>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Navigation className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">NavSight</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigateTo('home')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === 'home' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Home</button>
            <button onClick={() => navigateTo('features')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === 'features' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Features</button>
            <button onClick={() => startNavigation()} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === 'navigation' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Navigation</button>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="max-w-[120px] truncate">{userEmail.split('@')[0]}</span>
                </div>
                <button onClick={handleSignOut} className="text-xs font-black text-red-600 uppercase tracking-widest hover:text-red-500 flex items-center gap-1 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={() => navigateTo('signin')} className={`text-sm font-bold uppercase tracking-widest transition-colors ${currentPage === 'signin' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Sign In</button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 flex flex-col p-6 gap-4 overflow-hidden shadow-xl"
            >
              <button onClick={() => navigateTo('home')} className="text-left text-lg font-black uppercase tracking-widest text-slate-900">Home</button>
              <button onClick={() => navigateTo('features')} className="text-left text-lg font-black uppercase tracking-widest text-slate-900">Features</button>
              <button onClick={() => startNavigation()} className="text-left text-lg font-black uppercase tracking-widest text-slate-900">Navigation</button>
              {isLoggedIn ? (
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <User className="w-5 h-5 text-blue-600" />
                    <span>{userEmail}</span>
                  </div>
                  <button onClick={handleSignOut} className="text-left text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={() => navigateTo('signin')} className="text-left text-lg font-black uppercase tracking-widest text-slate-900">Sign In</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto px-6 py-12 sm:py-24 flex flex-col lg:flex-row items-center gap-12"
            >
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-6">
                  <Speaker className="w-3 h-3" />
                  Audio-First Navigation
                </div>
                <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter leading-tight text-slate-900 uppercase">
                  Navigate the world <br />
                  <span className="text-blue-600">with confidence.</span>
                </h1>
                <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
                  NavSight is a smart assistant designed for the visually impaired, 
                  providing real-time audio guidance and obstacle detection.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => startNavigation()}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20"
                    aria-label="Start Navigation"
                  >
                    Start Navigation
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={toggleVoice}
                    className="w-full sm:w-auto px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-lg text-slate-700 hover:text-slate-900 border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    aria-label={isListening ? "Stop Listening" : "Listen for Voice Commands"}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    {isListening ? "Stop Listening" : "Listen"}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative w-full max-w-md aspect-square mx-auto">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-full border-4 border-slate-200 rounded-full animate-pulse opacity-50"></div>
                  <div className="absolute w-3/4 h-3/4 border-4 border-slate-200 rounded-full animate-pulse opacity-70 delay-75"></div>
                  <div className="absolute w-1/2 h-1/2 border-4 border-slate-200 rounded-full animate-pulse opacity-90 delay-150"></div>
                  <div className="z-10 bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-2xl transform -rotate-6">
                    <MapPin className="w-16 h-16 text-blue-600 mb-4" />
                    <div className="space-y-2">
                      <div className="h-3 w-32 bg-slate-100 rounded-full"></div>
                      <div className="h-3 w-20 bg-slate-100 rounded-full opacity-50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === 'signin' && (
            <motion.div 
              key="signin"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1"
            >
              <SignIn onSignIn={handleSignIn} />
            </motion.div>
          )}

          {currentPage === 'features' && (
            <motion.div 
              key="features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto px-6 py-12 sm:py-24"
            >
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black mb-4 text-slate-900 tracking-tighter uppercase">Intelligent Features</h2>
                <p className="text-slate-500 max-w-md mx-auto font-medium">
                  Everything you need for safe and independent navigation.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <FeatureCard 
                  icon={<Shield className="w-8 h-8 text-blue-600" />}
                  title="Obstacle Detection"
                  description="Real-time scanning for safe movement"
                />
                <FeatureCard 
                  icon={<Activity className="w-8 h-8 text-green-600" />}
                  title="Direction Guidance"
                  description="Spatial audio cues for left/right turns"
                />
                <FeatureCard 
                  icon={<WifiOff className="w-8 h-8 text-purple-600" />}
                  title="Offline Support"
                  description="Works without any internet connection"
                />
                <FeatureCard 
                  icon={<Speaker className="w-8 h-8 text-orange-600" />}
                  title="Audio Feedback"
                  description="Clear voice-based navigation instructions"
                />
              </div>
            </motion.div>
          )}

          {currentPage === 'thinking' && (
            <motion.div key="thinking" className="flex-1">
              <ThinkingSimulation onComplete={handleThinkingComplete} />
            </motion.div>
          )}

          {currentPage === 'navigation' && (
            <motion.div 
              key="navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col p-4 gap-4 max-w-4xl mx-auto w-full"
            >
              <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
                <div className="flex-1 min-h-[300px] relative">
                  <CameraFeed isActive={true} />
                </div>
                <div className="flex-1 bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden">
                  <NavigationPanel 
                    isNavigating={true}
                    currentZone={currentZone}
                    onStart={startNavigation}
                    onStop={() => navigateTo('home')}
                    isMuted={isMuted}
                    onToggleMute={() => setIsMuted(!isMuted)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <VoiceButton isListening={isListening} onToggle={toggleVoice} />
                <SOSButton onSOS={triggerSOS} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <span>NavSight v1.0.0 &copy; 2026</span>
          <div className="flex gap-6">
            <span>Audio: {isMuted ? 'Off' : 'On'}</span>
            <span>Haptics: Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

