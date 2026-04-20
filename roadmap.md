# Strategic Roadmap: Behavioral Change Platform

**Stack:** Nextra 4 (Next.js 16/React 19) + Better-Auth + Drizzle/Neon + Stripe + Resend (React-Email)

---

## I. Strategic Architecture

This site is designed as a high-performance conversion engine that transitions users from free content to paid transformation.

### 1. Attraction Layer (Public Content)

- **The Content:** High-authority "What" and "Why" material written in Nextra MDX.
- **The Hook:** Embedded `<LeadMagnet />` components (React 19) that offer tools (e.g., PDFs, worksheets) in exchange for email.
  **Resend**, and orchestrate a 5-day `react-email` drip sequence strictly in code

### 2. Conversion Layer (Payments & Identity)

- **Monetization:** \* **Flat-Price Modules:** Self-paced access to specific content folders.
    - **Cohort Coaching:** High-ticket access including group sessions and 1:1s.
- **Logic:** **Stripe** processes the payment and fires a webhook.

### 3. Delivery Layer (Protected Content)

- **Gated Access:** Next.js Middleware checks the **Better-Auth** session. If a user tries to access `/modules` without the required key, they are redirected to an upsell page.
- **Interactivity:** Using React 19 `useOptimistic` and Server Actions to build habit-trackers inside the MDX pages that save progress to Neon.

### 4. Retention Layer (Cohort Coaching)

- **Group Touchpoints:** A private folder in Nextra visible only to `cohort` role users, housing weekly 60-min meeting links.
- **Asynchronous Support:** Private discussion components or scheduling blocks for 1:1 sessions integrated into the module sidebar.
