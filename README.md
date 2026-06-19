# LearnLumen

A blockchain-powered education platform built on [Stellar](https://stellar.org) that enables verifiable academic credentials, student rewards, and borderless scholarship payments.

---

## Project Structure

```
LearnLumen/
├── contracts/          # Soroban smart contracts (Rust)
│   ├── credential/     # Issues & verifies on-chain credentials
│   ├── rewards/        # Student reward token logic
│   └── scholarship/    # Scholarship disbursement logic
├── backend/            # Node.js/Express REST API (TypeScript)
│   ├── src/
│   │   ├── routes/     # API route handlers
│   │   ├── middleware/  # Auth middleware
│   │   └── db.ts       # Prisma DB client
│   └── prisma/         # Database schema
├── frontend/           # Next.js app (TypeScript + Tailwind)
│   └── src/
│       ├── app/        # Pages (dashboard, verify, scholarships, institution)
│       ├── components/ # Shared UI components
│       ├── contexts/   # Auth context
│       └── lib/        # API client & Freighter wallet
├── db/migrations/      # SQL migration files
├── docker-compose.yml  # Local dev environment
└── .github/workflows/  # CI pipeline
```

---

## Key Files

| File | Description |
|------|-------------|
| [`contracts/credential/src/lib.rs`](contracts/credential/src/lib.rs) | Soroban contract for issuing/verifying credentials |
| [`contracts/rewards/src/lib.rs`](contracts/rewards/src/lib.rs) | Soroban contract for student reward tokens |
| [`contracts/scholarship/src/lib.rs`](contracts/scholarship/src/lib.rs) | Soroban contract for scholarship payments |
| [`backend/src/index.ts`](backend/src/index.ts) | Express server entry point |
| [`backend/src/routes/credentials.ts`](backend/src/routes/credentials.ts) | Credentials API routes |
| [`backend/src/routes/rewards.ts`](backend/src/routes/rewards.ts) | Rewards API routes |
| [`backend/src/routes/scholarships.ts`](backend/src/routes/scholarships.ts) | Scholarships API routes |
| [`backend/src/routes/auth.ts`](backend/src/routes/auth.ts) | Auth API routes |
| [`backend/src/middleware/auth.ts`](backend/src/middleware/auth.ts) | JWT auth middleware |
| [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) | Database schema |
| [`frontend/src/app/page.tsx`](frontend/src/app/page.tsx) | Landing page |
| [`frontend/src/app/dashboard/page.tsx`](frontend/src/app/dashboard/page.tsx) | Student dashboard |
| [`frontend/src/app/verify/[id]/page.tsx`](frontend/src/app/verify/[id]/page.tsx) | Credential verification page |
| [`frontend/src/app/scholarships/page.tsx`](frontend/src/app/scholarships/page.tsx) | Scholarships listing page |
| [`frontend/src/app/institution/page.tsx`](frontend/src/app/institution/page.tsx) | Institution portal |
| [`frontend/src/lib/freighter.ts`](frontend/src/lib/freighter.ts) | Freighter wallet integration |
| [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts) | API client |
| [`db/migrations/0001_init.sql`](db/migrations/0001_init.sql) | Initial DB migration |
| [`docker-compose.yml`](docker-compose.yml) | Docker dev environment |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | CI workflow |

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) v18+
- [Rust](https://www.rust-lang.org/) + [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Freighter Wallet](https://www.freighter.app/) browser extension

### Local Development

```bash
# Start all services (Postgres, backend, frontend)
docker compose up

# Backend only
cd backend && npm install && npm run dev

# Frontend only
cd frontend && npm install && npm run dev
```

Copy environment files before running:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Smart Contracts

```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

---

## Features

- **Verifiable Credentials** — institutions issue tamper-proof diplomas and certificates on-chain
- **Student Rewards** — students earn tokens for academic milestones
- **Scholarship Payments** — borderless, trustless scholarship disbursement via Stellar
- **Wallet Integration** — connect with Freighter for Stellar account management
