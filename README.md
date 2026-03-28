🚀 NavSight – Smart Navigation for the Visually Impaired
🌟 Overview

NavSight is an AI-inspired, offline-capable navigation web app designed to assist visually impaired individuals in moving safely and independently.

It uses audio-based guidance, device sensors, and a modern UI simulation to provide intuitive navigation without relying on constant internet connectivity.

🎯 Problem Statement

Visually impaired individuals face major challenges while navigating:

Heavy reliance on internet-based apps
Limited real-time obstacle awareness
Lack of intuitive, non-visual guidance systems
💡 Solution

NavSight introduces a sound-based navigation system combined with smart UI and device features:

🔊 360° Audio Navigation
📱 Device Sensor Integration
🎤 Voice Commands
🗺️ Map Simulation UI
📊 Navigation Analytics Dashboard
⚡ Offline Progressive Web App (PWA)
🧠 Key Features
🔊 1. Audio Navigation (Core Feature)
Left sound → Turn left
Right sound → Turn right
Fast beeps → Obstacle nearby
Voice alerts for directions
🎤 2. Voice Commands

Users can control the app hands-free:

“Start navigation”
“Stop navigation”
“Where am I?”
📱 3. Sensor-Based Detection

Uses device sensors like:

Accelerometer
Gyroscope

To simulate movement and direction tracking.

🗺️ 4. Smart UI Simulation
Google Maps–style interface
AI-like decision animations
Real-time route visualization
📊 5. Dashboard Analytics
Distance traveled
Obstacles detected
Navigation history
⚡ 6. Offline Support (PWA)
Works without internet
Installable like a mobile app
Uses:
manifest.json
Service Worker
🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript
Audio: Web Audio API (Stereo Panning)
Voice Recognition: Web Speech API
Sensors: Device Motion API
Offline Support: Service Workers (PWA)
📁 Project Structure
NavSight/
│
├── index.html
├── dashboard.html
├── styles/
│   └── style.css
├── scripts/
│   ├── app.js
│   ├── audio.js
│   ├── voice.js
│   └── sensors.js
├── manifest.json
├── service-worker.js
└── assets/
⚙️ Installation & Setup
Clone or download the project:
git clone https://github.com/your-username/navsight.git
Open the project folder:
cd navsight
Run locally:
Open index.html in browser
OR
Use Live Server (recommended)
📲 Install as App (PWA)
Open the app in Chrome
Click “Install App”
Use like a mobile application
🌐 Offline Usage

NavSight works offline using:

Cached assets
Service Worker

⚠️ First load requires internet

🧪 Future Enhancements
Real AI obstacle detection (Computer Vision)
GPS-based real navigation
Integration with wearable devices
Emergency SOS system
🏆 Hackathon Value

✔ Innovative (Audio-based navigation)
✔ Social impact (Accessibility solution)
✔ Offline capability
✔ Clean, modern UI

👩‍💻 Contributors
Karishma R
Keerthana A


❤️ Acknowledgment

Built with the vision of empowering visually impaired individuals through technology.
