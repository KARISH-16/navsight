/**
 * Voice Engine for NavSight
 * Provides Speech Recognition and Text-to-Speech
 */

class VoiceEngine {
  private recognition: any | null = null;
  private isListening: boolean = false;
  private onCommandCallback: ((command: string) => void) | null = null;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        if (this.onCommandCallback) {
          this.onCommandCallback(command);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          this.speak("Microphone access was denied. Please enable microphone permissions in your browser settings to use voice commands.");
        }
        this.isListening = false;
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          this.recognition.start();
        }
      };
    }
  }

  public startListening(callback: (command: string) => void) {
    if (!this.recognition) return false;
    this.onCommandCallback = callback;
    this.isListening = true;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Failed to start recognition:', e);
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public speak(text: string, onEnd?: () => void) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for accessibility
    utterance.pitch = 1.0;
    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(utterance);
  }

  public cancelSpeech() {
    window.speechSynthesis.cancel();
  }
}

export const voiceEngine = new VoiceEngine();
