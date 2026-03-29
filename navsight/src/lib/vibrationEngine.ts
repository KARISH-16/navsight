/**
 * Vibration Engine for NavSight
 * Provides haptic feedback language
 */

class VibrationEngine {
  public vibrate(pattern: number | number[]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  public straight() {
    this.vibrate([150]); // Short buzz
  }

  public left() {
    this.vibrate([150, 100, 150]); // Double buzz
  }

  public right() {
    this.vibrate([150, 100, 150, 100, 150]); // Triple buzz (for right, or use for obstacle as requested)
  }

  public obstacle() {
    this.vibrate([150, 100, 150, 100, 150]); // Triple buzz as requested
  }

  public sos() {
    this.vibrate([100, 100, 100, 300, 300, 300, 100, 100, 100]);
  }

  public stop() {
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }
}

export const vibrationEngine = new VibrationEngine();
