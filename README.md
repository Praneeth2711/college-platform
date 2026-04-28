# 🎓 CampusLens — College Discovery & Decision Platform

A **production-grade, full-stack** college discovery platform built with a **premium glassmorphism UI**. Discover colleges, compare options side-by-side, and predict admissions based on your exam rank.

## ✨ Features

- 🔍 **College Discovery** — Search, filter by location/fees, paginated grid
- 🏫 **College Details** — Animated tab UI with Overview, Courses, Placements
- ⚖️ **Compare Colleges** — Side-by-side comparison with best-value highlights
- 🧠 **Predictor Tool** — Rule-based college prediction from exam + rank
- 🎨 **Premium UI** — Glassmorphism, dark gradients, micro-animations
- 📱 **Fully Responsive** — Mobile-first design

## 🧠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Framer Motion (motion) |
| Database | PostgreSQL 18 + Prisma v7 ORM |
| Runtime | Node.js v22 |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running
- npm

### 1. Clone & Install
```bash
git clone <repo-url>
cd unstop
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/college_platform"
```

### 3. Create Database
```bash
psql -U postgres -c "CREATE DATABASE college_platform;"
```

### 4. Push Schema & Seed Data
```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

### 5. Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges` | List colleges (search, filter, pagination) |
| GET | `/api/colleges/:id` | Single college with courses |
| POST | `/api/compare` | Compare 2-3 colleges by IDs |
| POST | `/api/predict` | Predict colleges from exam + rank |

### Query Parameters (GET /api/colleges)
- `search` — Search by name, city, state
- `location` — Filter by state/city
- `minFees` / `maxFees` — Fee range filter
- `page` / `limit` — Pagination

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # 25 realistic colleges seed
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── college/[id]/  # Detail page
│   │   ├── compare/       # Compare page
│   │   ├── predict/       # Predictor page
│   │   ├── globals.css    # Design system
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Home page
│   ├── components/        # Reusable UI components
│   └── lib/
│       ├── prisma.ts      # DB client singleton
│       └── predictor.ts   # Prediction engine
├── .env.example
├── prisma.config.ts
└── package.json
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Set `DATABASE_URL` environment variable
4. Deploy

### Database (Railway/Render)
1. Create a PostgreSQL instance on [Railway](https://railway.app) or [Render](https://render.com)
2. Copy the connection string to your Vercel env vars
3. Run `npx prisma db push && npx prisma db seed` against the production DB

## 📜 License

MIT
