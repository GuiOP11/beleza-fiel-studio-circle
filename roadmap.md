# BelezaFiel

- [x] Build business dashboard, retention radar, CRM and flash campaign workspace.
- [x] Build switchable client portal, rewards and appointment history.
- [x] Add personalized click-to-chat messages and home-screen support.
- [x] Test tenant filtering, reward calculations and interactive flows.

## Simplified separate access
- [x] Add real registered accounts and isolate owner/client data.
- [x] Remove role switches and all admin links from the client experience.
- [x] Replace owner dashboard with points, coupons and upcoming visits.
- [x] Combine coupon redemption and available-slot booking in one transaction.
- [x] Show owner each redemption, scheduled visit and coupon-use status.
- [x] Verify client-to-owner readback and access restrictions.
- [x] Remove Lovable sign-in and visible platform branding from app-owned login screens.

## Configurable loyalty engine
- [x] Apply the uploaded scaling SQL exactly as supplied and verify execution.
- [ ] Store editable services, reward tiers and company expiration/bonus settings.
- [ ] Award points only on completed appointments, with immutable reversal and expiration ledger entries.
- [ ] Implement atomic stock-aware redemption, six-character pickup codes and automatic expiry refunds.
- [ ] Add owner pending pickups, service/appointment controls and editable rules.
- [ ] Add client database-driven milestones, expiring points and pickup QR codes.
- [ ] Test concrete rules, scheduling, isolation and client-to-owner redemption flow.

Pending loyalty-engine tasks await resumption of the earlier schema change, which was cancelled before execution when the exact-SQL upload arrived.

## Client list performance
- [x] Test all 2,000 inserted clients through the authenticated owner list, including name/phone search and pagination.
- [x] Fix observed performance or pagination problems and run regression checks on desktop and mobile.
- [x] Preserve benefit creation and add individual WhatsApp promotion messages using the registered client's name and an explicitly confirmed phone number.
- [x] Add a return/maintenance message template and explain individual WhatsApp sending without claiming automatic overdue detection.
