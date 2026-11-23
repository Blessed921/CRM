# Altivio OS

Multi-tenant website revenue proof and client operations platform built by **Altivio Ltd.**

Every client website delivered by Altivio connects to a dedicated, brand-themed dashboard showing verified revenue attribution, Google Analytics (GA4) style traffic analytics, enquiries, Website Health & Core Web Vitals, content editing, monthly proof reports, and either the **Service Engine** (leads, quotes, invoices, follow-ups) or **Shop Engine** (orders, products, customers, abandoned carts, discounts).

## Architecture & Security

- **Server-Enforced Authentication & RBAC**:
  - Sessions are signed with HMAC-SHA256 tokens (`HttpOnly` cookies + `Authorization: Bearer` fallback for embedded frames) and `scryptSync` password verification in `server/auth.ts`.
  - Roles: `altivio_admin` (agency fleet console access) and `client_owner` (strictly locked to their assigned `tenantId`).
  - Cross-tenant API calls and unauthorized admin calls are rejected server-side with `401 Unauthorized` or `403 Forbidden`.
- **URL Routing & Feature-Scoped Contexts**:
  - Client portal routes live at `/app/:tenantSlug/*` (`overview`, `analytics`, `enquiries`, `insights`, `service/*`, `shop/*`, `content`, `health`, `reports`, `support`).
  - Agency fleet operations live at `/admin`.
  - State and mutations are split across `AuthContext`, `ThemeContext`, `TenantContext`, `AdminFleetContext`, `useBaseTenantActions`, `useServiceModule`, and `useShopModule`.
- **Per-Client Branding & Light/Dark Modes**:
  - Supports Light and Dark modes (`ThemeContext`) plus dynamic CSS `--brand-accent` theming, `<title>`, and dynamic SVG favicon per tenant.
- **Server-Side Gemini AI Insights**:
  - Weekly insights are generated via `POST /api/gemini/insights` using `process.env.GEMINI_API_KEY` strictly on the Express backend. Client bundles never receive API keys.

## Demo Credentials

- **Altivio Admin**: `admin@altivio.com` / `altivio-admin-2026`
- **Apex Dental Studio (Service)**: `dr.sterling@apexdentalstudio.com` / `apex-client-2026`
- **Kova Atelier (Shop)**: `mireille@kova-atelier.com` / `kova-client-2026`
- **Summit HVAC & Electrical (Service)**: `ron@summithvacservices.com` / `summit-client-2026`

## Environment Variables

Configure `.env` based on `.env.example`:

- `GEMINI_API_KEY`: Gemini API key for server-side weekly insights generation.
- `APP_URL`: Deployed application URL.
- `SESSION_SECRET`: Optional HMAC signing secret for session tokens in production.

## Scripts

- `npm run dev` — Start Express + Vite dev server on port `3000`
- `npm run build` — Build production client bundle to `dist/`
- `npm run start` — Serve production build and API routes on port `3000`
- `npm run lint` — TypeScript check (`tsc --noEmit`) + ESLint (`eslint .`)
- `npm run test` — Run Vitest RBAC & tenant isolation suite
- `npm run format` / `npm run format:check` — Prettier formatting
