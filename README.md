<div align="center">

# ⬡ AgriDash

### Real-Time Agricultural Intelligence & Situational Awareness Command Center
*Powered by the Ceres Protocol & OSIRIS Engine*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![MapLibre](https://img.shields.io/badge/MapLibre_GL-GPU_Rendered-396CB2?style=for-the-badge)](https://maplibre.org)
[![License](https://img.shields.io/badge/License-MIT-D4AF37?style=for-the-badge)](LICENSE)

**A high-performance situational awareness dashboard designed for farmers, agricultural cooperatives, and crop logistics managers. AgriDash aggregates crop futures pricing, transport blockades, pesticide windows, local co-op meetings, agricultural fairs, and severe weather hazards into a unified, GPU-accelerated 3D terminal.**

[Report Bug](https://github.com/MSN-2007/AgriDash/issues) · [Request Feature](https://github.com/MSN-2007/AgriDash/issues)

</div>

---

## 🌾 Overview

AgriDash is a production-grade dashboard that equips agricultural coordinators and farmers with the intelligence required to minimize risk, coordinate local mobilization, and optimize crop yields. Built on top of the OSIRIS WebGL engine, every coordinate is rendered on a hardware-accelerated 3D globe supporting 60fps performance even with thousands of concurrent events and active tracking nodes.

AgriDash features a dual-operational mode toggled directly from the header:
*   **AGRO INTEL (Ceres Protocol)**: Activates a warm forest green/amber theme geared towards agricultural operations. This mode correlates crop market indices, supply chain protests, coop meetings, weather hazards, and extension courses.
*   **GLOBAL INTEL (OSIRIS Core)**: Toggles the classic defense-intelligence blue/cyan command center for tracking flights, naval vessels, satellites, space weather, and global incidents.

---

### Key Capabilities

| Domain | Data Points | Sources / FALLBACKS |
|--------|------------|---------------------|
| **Crops & Live Markets** | Real-time Wheat, Corn, Soybeans, Rice, Livestock, Sugar, Cocoa futures | Yahoo Finance / Google Finance |
| **Coop Meetings** | Local dairy co-op assemblies, pesticide workshops, and farming seminars | Local extension feeds & mock geoJSON database |
| **Agro Fairs & Expos** | State agricultural expos, tractor pulls, seed swap fairs, organic markets | Public listings API & geoJSON |
| **Logistics & Supply Chain** | Tractor blockades, transport strikes, port delays affecting fertilizers/grains | GDELT Incident Feed, custom parsers |
| **Weather & Hazards** | Severe events, active fires, earthquakes | NOAA, USGS, NASA FIRMS |
| **CCTV Surveillance** | 2,000+ CCTV camera streams for local route assessment | DOT Traffic Cameras (TfL, WSDOT, Caltrans, NYC DOT, etc.) |
| **AI Analyst (Gemini)** | Live crop risk briefings, harvesting windows, pesticide spraying wind checks | Gemini 2.0 Flash / Custom context serializer |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      AGRIDASH CLIENT                    │
│   ┌──────────────┐   ┌────────────────┐   ┌─────────┐   │
│   │ MapLibre GL  │   │  HUD Panels    │   │   AI    │   │
│   │ 3D Globe     │   │  - Ceres theme │   │ Analyst │   │
│   │ WebGL Render │   │  - OSIRIS core │   │ Drawer  │   │
│   └──────────────┘   └────────────────┘   └─────────┘   │
├─────────────────────────────────────────────────────────┤
│                   NEXT.JS API ROUTES                    │
│   /api/agro-events            /api/markets              │
│   /api/ai/analyze             /api/ai/briefing          │
│   /api/weather                /api/fires                │
│   /api/earthquakes            /api/cctv                 │
│   /api/flights                /api/satellites           │
├─────────────────────────────────────────────────────────┤
│                  EXTERNAL DATA FEEDS                    │
│   Yahoo Finance · USGS · NASA FIRMS · GDELT · OpenSky   │
│   TfL/Caltrans Cameras · Gemini 2.0 Flash               │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Features

### Ceres Agro Protocol
*   **Interactive Event Layers**: Toggle meetings, seed-expos, and logistics blockades on the map. Custom popup windows display registration details, schedule highlights, and contact information.
*   **Dynamic Market Feeds**: Tracks global crop futures (Wheat, Corn, Hogs, Cattle, Sugar, Cocoa) with dynamic up/down indicators and supply chain delay notifications.
*   **Weather Risk Mitigation**: Displays heat maps of active wildfires and severe weather overlays to help coordinate irrigation and harvesting.

### Embedded AI Analyst
*   **Dynamic System Instructs**: When the sector is switched to Agro, the integrated Gemini analyst swaps into the **Ceres Specialist** persona.
*   **Agro Briefings**: Provides automated agricultural briefings summarizing crop risks, weather corridors, pesticide wind windows, and recommended hedging courses of action (COAs).

### High Performance Rendering
*   **WebGL Layer Acceleration**: Map circles, grids, and terminator rings are drawn directly in WebGL, leaving DOM operations at a minimum for fluid zooming and panning.

---

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/MSN-2007/AgriDash.git
cd AgriDash

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your browser.

---

## 🔑 Environment Setup

AgriDash works **without any API keys out of the box** for public telemetry and market data. If you want to enable the AI Analyst, copy `.env.example` to `.env` and configure your API keys:

```env
# Optional: Set to configure port (Default: 3000)
OSIRIS_PORT=3000

# Gemini API Key (Required for AI Analyst only)
# Register for a free key at Google AI Studio
GEMINI_API_KEY_1=your_gemini_api_key_here
```

---

## 💻 Tech Stack

*   **Framework**: Next.js 16 (App Router, Turbopack)
*   **Language**: TypeScript 5
*   **Map Engine**: MapLibre GL JS (WebGL 3D Globe)
*   **Animations**: Framer Motion
*   **Styling**: Custom CSS variables with Forest Green (`theme-ceres`) & Violet (`theme-ghost`) support
*   **AI Integration**: `@google/generative-ai` (Gemini 2.0 Flash)

---

## 📝 License

MIT — see [LICENSE](LICENSE) for details.
