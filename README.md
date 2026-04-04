# GolfGives Platform ⛳

Welcome to the **GolfGives** codebase! This is a luxury, full-stack Next.js 16 application built to provide users with a high-end golf resort aesthetic while acting as a philanthropic prize draw platform. 

Users can subscribe to monthly plans, submit their golf scores, contribute a percentage of their subscription to their favorite charities, and enter into monthly tiered prize draws. 

## 🌟 Features

### 🏢 Public & Auth
- **Luxury Landing Page**: Cinematic hero sections, features overview, how it works flow, and tier-draw mechanics wrapped in a bespoke `olive`, `charcoal`, and `cream` design system.
- **Authentication**: Seamless Supabase Auth flows for Login and Sign Up with high-performance responsive UI.
- **Pricing & Subscriptions**: Interactive pricing tiers linked directly to Stripe Checkout.

### 🏌️‍♂️ User Dashboard
- **Score Tracking**: Secure API for uploading and validating 18-hole scorecards.
- **Charity Allocation**: Custom interactive slider interface for allocating 10%–30% of their subscription directly to partnered charities.
- **Winnings & Draws**: Live draw results, tier matching, and payout tracking.

### 🛡️ Admin Panel
- **Overview Analytics**: Real-time stats on active users, subscriptions, total payouts, and active draws.
- **Draw Management (`drawEngine.ts`)**: Run Monte Carlo prize draw simulations, verify winners, and officially publish results to the entire platform.
- **Directory Management**: Full CRUD capabilities for Partnered Charities and User Subscriptions.
- **Winner Payouts**: Secure payout tracking and verification workflows.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + GoTrue Auth)
- **Payments**: [Stripe](https://stripe.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Custom CSS Variables and Utility Classes)
- **Language**: TypeScript

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed. You will also need a Supabase project and a Stripe account.

### 1. Clone & Install
```bash
git clone https://github.com/divyanshu-114/golf-platform.git
cd golf-platform
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root of the project and provide your keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Admin Registration
NEXT_PUBLIC_ADMIN_EMAIL=your-admin-email@example.com
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

```text
src/
├── app/
│   ├── admin/       # Protected Admin dashboard and management views
│   ├── api/         # Next.js Serverless API Routes (Stripe Webhooks, Draw Engine, Core APIs)
│   ├── charities/   # Public Charity Directory and profiles
│   ├── dashboard/   # Protected User Dashboard
│   ├── login/       # Auth routes
│   └── pricing/     # Public Subscription Tiers
├── components/      # Reusable React UI Components
│   ├── dashboard/   # Dashboard specific components (ScoreEntry, CharityCard)
│   ├── home/        # Landing page sections
│   └── ...
├── hooks/           # Custom React Hooks
└── lib/
    ├── supabase/    # Supabase initialization client/server logic
    └── drawEngine.ts# Core Lottery & 3/4/5-Match Logic
```

## 🎨 Design System

This platform does not use generic default branding. It adheres to strict luxury guidelines:

- **Typography**: `Marcellus` (Serif Headings) & `Jost` (Sans-Serif Body) for a clean, editorial feel.
- **Palette**: 
  - **Charcoal** (`#1B1B1B`): Grounding, sophisticated.
  - **Olive** (`#8DA067`): Active states, buttons, links, success metrics.
  - **Cream** (`#F9F8F3`): Warm backgrounds ensuring contrast without harsh stark white edges.
- **UI Architecture**: Glassmorphism is minimal. Flat borders (`border-charcoal/10`) with zero-radius components (`rounded-none` and `rounded-sm`) are preferred to promote the high-end feel.

---

*This project is uniquely designed for the GolfGives platform ecosystem.*
