import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { voiceEngine } from '../lib/voiceEngine';

interface CameraFeedProps {
  isActive: boolean;
}

export default function CameraFeed({ isActive }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      if (!isActive) return;
      
      try {
        setError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreamActive(true);
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError("Camera access was denied. Please enable camera permissions in your browser settings and refresh the page.");
          voiceEngine.speak("Camera access was denied. Please enable camera permissions to use navigation features.");
        } else {
          setError("Camera access denied or not available. Please ensure permissions are granted.");
        }
        setIsStreamActive(false);
      }
    }

    if (isActive) {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsStreamActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full bg-slate-200 rounded-2xl overflow-hidden shadow-inner border border-slate-300">
      {isStreamActive ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
          {error ? (
            <>
              <CameraOff className="w-12 h-12 text-red-500" />
              <p className="text-slate-600 font-medium text-sm">{error}</p>
            </>
          ) : (
            <>
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-slate-600 font-medium">Initializing camera feed...</p>
            </>
          )}
        </div>
      )}
      
      {/* Overlay for "AI Processing" look */}
      <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent border-t-blue-500/10 border-b-blue-500/10">
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Feed</span>
        </div>
        
        {/* Scanning line animation */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-400/30 shadow-[0_0_15px_rgba(96,165,250,0.5)] animate-scan" />
      </div>
    </div>
  );
}
