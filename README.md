#  InvestiZen — Unified Portfolio Analyzer

> **WCE Hackathon 2026 | Team Fintech Titans**

InvestiZen is a modern, AI-powered fintech dashboard that consolidates all your investments — Stocks, Mutual Funds, Crypto, and Gold — into a single, intelligent platform. Stop juggling multiple apps. Start making smarter financial decisions.

---

## 🎯 Problem Statement

Indian retail investors manage their wealth across 4–6 different apps — Zerodha for stocks, Groww for mutual funds, CoinDCX for crypto, and spreadsheets for gold. There is no single place to:
- See the **true total value** of your portfolio
- Understand **real asset allocation** across classes
- Get **AI-driven insights** on portfolio health
- Track **profit & loss** over time, holistically

**InvestiZen solves this.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Unified Dashboard** | Single view of all assets — Stocks, MF, Crypto, Gold |
| 🥧 **Asset Allocation Charts** | Interactive pie & bar charts powered by Recharts |
| 📈 **Portfolio Value Tracking** | Historical NAV & price tracking with trend lines |
| 💰 **P&L Analysis** | Realized and unrealized profit/loss per asset |
| 🤖 **AI-Powered Insights** | Smart suggestions based on your portfolio composition |
| 🔐 **Secure Auth** | Supabase authentication with Row Level Security |
| 🌙 **Dark / Light Mode** | Theme switcher for comfortable use at any time |
| 📱 **Responsive Design** | Works seamlessly on desktop and mobile |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.3 | Build Tool |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui + Radix UI | Latest | UI Components |
| Recharts | 2.15 | Charts & Graphs |
| Framer Motion | 12 | Animations |

### Backend & Services
| Technology | Purpose |
|---|---|
| Supabase | Database, Auth, Edge Functions |
| Supabase Edge Functions | Financial API proxy & AI insights |
| Financial APIs | Live price feeds for Stocks, Crypto, Gold |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- npm or pnpm
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone the Repository

```bash
git clone https://github.com/vishalambilkar-collab/WCEHackathon2026_Fintech-Titan.git
cd WCEHackathon2026_Fintech-Titan
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://wxmtntdivjqdcvvhoqdu.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TqlxTI9Cd6l8hjZZDjfpiQ_HByMKbwg

# Optional: Financial Data APIs
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key
VITE_COINGECKO_API_KEY=your_coingecko_key
```

> 💡 Copy `.env.example` to get started quickly.

### 4. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL migrations from `/supabase/migrations/`
3. Enable Row Level Security (RLS) on all tables
4. Copy your project URL and anon key into `.env.local`

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
investizen/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── charts/       # Recharts wrappers
│   │   ├── dashboard/    # Dashboard widgets
│   │   └── ui/           # shadcn/ui base components
│   ├── pages/            # Route-level page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions, Supabase client
│   ├── services/         # API call logic (stocks, crypto, gold)
│   ├── types/            # TypeScript type definitions
│   └── main.tsx          # App entry point
├── supabase/
│   ├── functions/        # Edge Functions (API proxy, AI)
│   └── migrations/       # Database schema
├── .env.example
├── package.json
└── vite.config.ts
```

---

## 🔌 API Integrations

| Data | API / Source |
|---|---|
| Stock Prices (India) | Alpha Vantage / NSE unofficial API |
| Mutual Fund NAV | AMFI India (free, no key needed) |
| Cryptocurrency | CoinGecko API |
| Gold Prices | GoldAPI.io / custom scraper |

All external API calls are proxied through **Supabase Edge Functions** to keep API keys server-side and secure.

---

## 🗄️ Database Schema (Supabase)

```
users           → Auth managed by Supabase
portfolios      → user_id, name, created_at
holdings        → portfolio_id, asset_type, symbol, quantity, avg_buy_price
transactions    → holding_id, type (BUY/SELL), quantity, price, date
```

---

## 🤖 Insights

InvestiZen uses an model (via Supabase Edge Functions) to analyze your portfolio and provide:
- **Diversification score** — are you over-concentrated in one asset?
- **Risk profile detection** — aggressive, moderate, or conservative
- **Rebalancing suggestions** — when your allocation drifts from your target
- **Market context** — brief summaries relevant to your holdings

---

## 🔒 Security

- All user data is isolated using **Supabase Row Level Security (RLS)**
- API keys are never exposed on the frontend — all calls go through Edge Functions
- Authentication uses Supabase's secure JWT-based auth
- `.env` files are gitignored — never committed to the repo

---

## 🗺️ Roadmap

- [x] Multi-asset portfolio dashboard
- [x] Asset allocation charts
- [x] P&L tracking
- [x] AI-powered insights
- [ ] SIP / recurring investment tracker
- [ ] Tax loss harvesting suggestions
- [ ] Portfolio sharing (read-only links)
- [ ] Mobile app (React Native)
- [ ] Import from Zerodha / Groww via CAMS

---

## 👥 Team — Fintech Titans

| Name | Role |
|---|---|
| Vishal Ambilkar |  Lead |
| Ayush Mirajkar | technical head|
| Aditya Patil | Research |
| Anushka Mali | Representative |


---

##  Contributing

This is a hackathon project. For any suggestions or bug reports during the event, please open an issue.

---

<div align="center">
  <strong>Built with ❤️ at WCE Hackathon 2026</strong><br/>
  <em>Team Fintech Titans</em>
</div>
