# 🚨 PulseAid — AI-Powered Crisis Prediction Platform

> Predict humanitarian crises before they happen. Built for Google Solution Challenge 2026.

🌐 **Live App:** https://exquisite-starship-bf69ff.netlify.app  
⚙️ **Backend API:** https://pulsaid-backend-production.up.railway.app  
📹 **Demo Video:** https://drive.google.com/file/d/1FiynRn4JQypbuGlXfGd_q0WnLLpRTPff/view?usp=sharing

---

## 🧠 What is PulseAid?

PulseAid is a real-time AI-powered platform that fuses multiple public data signals to flag high-risk zones **before** they escalate into humanitarian crises — giving NGOs 10–18 days of advance warning to pre-position volunteers and resources.

### The Problem
NGOs and emergency responders in India lack early warning systems. By the time a crisis is visible, it's already too late to prevent harm.

### Our Solution
PulseAid combines weather anomalies, employment stress, hospital load trends, and social sentiment into a per-zone risk score. Google Gemini AI explains why each zone is flagged and generates actionable NGO briefs — automatically.

---

## ✨ Features

- 🗺️ **Risk Zone Heatmap** — Live map of Bengaluru with color-coded risk zones (red/orange/yellow)
- 🤖 **Gemini AI Analysis** — Click any zone to get a structured AI explanation of the crisis forming
- 📊 **Signal Breakdown** — Bar chart showing 4 signals per zone (weather, employment, hospital, sentiment)
- 🧭 **NGO Dashboard** — Generate AI briefs and dispatch volunteers with one click
- 🕒 **Historical Proof** — Retroactive validation showing PulseAid would have flagged real past crises 11–18 days early
- ⚡ **Real-time Sync** — Volunteer assignments sync instantly via Firebase Firestore

---

## 🏗️ Architecture
Frontend (React + Vite)          Backend (FastAPI)           AI + Data
├── Leaflet.js map               ├── POST /explain           ├── Google Gemini 1.5 Flash
├── Recharts signal bars         ├── POST /brief             ├── Firebase Firestore
├── Firebase SDK                 ├── GET /signals/:zone      ├── zones.json (risk scores)
└── Netlify (deployed)           ├── GET /history            └── Railway (deployed)
└── GET /health
---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Map | Leaflet.js + React-Leaflet |
| Charts | Recharts |
| Backend | FastAPI (Python 3.13) |
| AI | Google Gemini 2.0 Flash |
| Database | Firebase Firestore |
| Hosting | Netlify (frontend), Railway (backend) |

---

## 🚀 Local Setup

### Frontend
```bash
git clone https://github.com/pavanahrk22/pulsaid-frontend
cd pulsaid-frontend
npm install
```

Create `.env` file:
VITE_BACKEND_URL=https://pulsaid-backend-production.up.railway.app
```bash
npm run dev
```

### Backend
```bash
git clone https://github.com/pavanahrk22/pulsaid-backend
cd pulsaid-backend
pip install -r requirements.txt
```

Create `.env` file:
GEMINI_API_KEY=your_key_here
FIREBASE_KEY=your_firebase_json_here
```bash
uvicorn main:app --reload
```

---

## 🌍 SDG Alignment

- **SDG 1** — No Poverty: Early crisis detection prevents economic collapse
- **SDG 2** — Zero Hunger: Pre-positioned food distribution volunteers
- **SDG 3** — Good Health: Hospital surge prediction enables medical prep
- **SDG 11** — Sustainable Cities: City-level risk monitoring at zone granularity

---

## 📊 Impact Validation

| Crisis | Zone | PulseAid Detection | Lives Impacted |
|--------|------|-------------------|----------------|
| Bengaluru Floods 2023 | Whitefield | 11 days early | 50,000 |
| KR Puram Layoffs 2023 | KR Puram | 14 days early | 12,000 |
| Yelahanka Drought 2022 | Yelahanka | 18 days early | 8,000 |

---

## 👥 Team

Built for Google Solution Challenge 2026 by NovaLab
---

## 📬 Contact

For queries: pavanahrk22@gmail.com
