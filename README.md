# SocialHub.Support

> A gamified social engagement platform where users earn coins by completing social media tasks — built with Next.js, TypeScript, MongoDB, and NextAuth.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## What It Does

SocialHub is a task-based reward platform. Users sign in with Google, browse available social campaigns (follow, like, subscribe, share), complete tasks, submit proof, and earn coins. Admins review proofs, manage campaigns, and publish LMS articles. Monetized via Google AdSense.

---

## Table of Contents

- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [About](#about)
- [License](#license)

---

## Features

**For Users**
- Google OAuth sign-in via NextAuth.js
- Browse and complete social media tasks (follow, like, share, subscribe)
- Submit task proof for admin review
- Coin balance tracked per user — earned on approved tasks
- Social coins synced with session

**For Admins**
- Admin dashboard to manage tasks and campaigns
- Review and approve/reject submitted task proofs
- Create and manage LMS articles
- Full campaign lifecycle management

**Platform**
- Google AdSense integration
- Edge-compatible middleware via `proxy.ts`
- Fully server-side rendered with Next.js App Router

---

## How It Works

```
User signs in (Google OAuth)
        ↓
Browse social campaigns
        ↓
Complete task (follow/like/share/subscribe)
        ↓
Submit proof (screenshot / URL)
        ↓
Admin reviews proof
     ↙       ↘
Approved     Rejected
   ↓
Coins credited to user balance
```

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 15 (App Router)             |
| Language    | TypeScript                          |
| Database    | MongoDB via Mongoose                |
| Auth        | NextAuth.js (Google Provider)       |
| Styling     | Tailwind CSS                        |
| Middleware  | Edge-compatible `proxy.ts`          |
| Monetization| Google AdSense                      |

---

## Project Structure

```
socialhub.support/
├── src/
│   ├── app/              # Next.js App Router pages & API routes
│   ├── components/       # Reusable UI components
│   ├── models/           # Mongoose schemas (User, Task, Campaign, Article)
│   ├── lib/              # DB connection, utilities, coin logic
│   └── providers/        # NextAuth session provider
├── public/               # Static assets + ads.txt
├── proxy.ts              # Edge middleware (auth guards, routing)
├── next-auth.d.ts        # NextAuth session type extensions
└── next.config.ts        # Next.js config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local instance)
- Google OAuth credentials

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Wcoder547/socialhub.support.git
cd socialhub.support

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the values (see below)

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/socialhub

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

To get Google OAuth credentials: [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)

---

## About

SocialHub.Support was built to explore the intersection of social media growth tools and gamified user engagement. The platform models a real-world use case: creators and brands need social proof (followers, likes, engagement), while users want a reward for their attention. The coin system bridges the two.

From an engineering perspective, the project covers a full SaaS feature set in a single Next.js codebase — OAuth, role-based access (user vs admin), a proof-review workflow, session-synced coin state, and content management for LMS articles. It was an exercise in building something that looks and behaves like a real product, not just a tutorial clone.

Built by [Waseem Akram](https://www.linkedin.com/in/wasim-akram-dev/) — full-stack developer based in Pakistan, specializing in Next.js, TypeScript, and MERN.

---

## License

MIT © [Waseem Akram](https://github.com/Wcoder547)
