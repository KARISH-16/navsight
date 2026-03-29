/**
 * Navigation Engine for NavSight
 * Manages simulated environment awareness and no-movement detection
 */

export interface NavZone {
  id: string;
  name: string;
  type: 'staircase' | 'crowded' | 'road' | 'clear';
  message: string;
  pan: number; // -1 to 1
  proximity: number; // 0 to 1 (1 is closest)
}

export const NAV_ZONES: NavZone[] = [
  { id: '1', name: 'Staircase ahead', type: 'staircase', message: 'There is a staircase ahead. Take 5 steps forward and prepare to descend.', pan: 0, proximity: 0.5 },
  { id: '2', name: 'Crowded area', type: 'crowded', message: 'You are entering a crowded area. Turn slightly left.', pan: -0.3, proximity: 0.8 },
  { id: '3', name: 'Road crossing', type: 'road', message: 'Road crossing ahead. Stop and wait for audio signal.', pan: 0, proximity: 0.2 },
  { id: '4', name: 'Clear path', type: 'clear', message: 'Path is clear. Take 10 steps forward.', pan: 0, proximity: 0 },
];

class NavigationEngine {
  private lastMovementTime: number = Date.now();
  private noMovementThreshold: number = 10000; // 10 seconds
  private onNoMovementCallback: (() => void) | null = null;
  private isMonitoring: boolean = false;

  constructor() {
    this.handleMotion = this.handleMotion.bind(this);
  }

  public startMonitoring(onNoMovement: () => void) {
    this.onNoMovementCallback = onNoMovement;
    this.lastMovementTime = Date.now();
    this.isMonitoring = true;
    window.addEventListener('devicemotion', this.handleMotion);
    
    // Fallback timer in case devicemotion isn't supported or doesn't fire
    this.checkNoMovementInterval();
  }

  public stopMonitoring() {
    this.isMonitoring = false;
    window.removeEventListener('devicemotion', this.handleMotion);
  }

  private handleMotion(event: DeviceMotionEvent) {
    const acc = event.accelerationIncludingGravity;
    if (acc) {
      const totalAcc = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
      if (totalAcc > 1.5) { // Threshold for "movement"
        this.lastMovementTime = Date.now();
      }
    }
  }

  private checkNoMovementInterval() {
    if (!this.isMonitoring) return;

    if (Date.now() - this.lastMovementTime > this.noMovementThreshold) {
      if (this.onNoMovementCallback) {
        this.onNoMovementCallback();
        // Reset timer to avoid repeated alerts too quickly
        this.lastMovementTime = Date.now();
      }
    }

    setTimeout(() => this.checkNoMovementInterval(), 1000);
  }

  public getSimulatedZone(index: number): NavZone {
    return NAV_ZONES[index % NAV_ZONES.length];
  }
}

export const navigationEngine = new NavigationEngine();
