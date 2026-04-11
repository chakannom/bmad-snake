---
title: "Product Brief Distillate: bmad-snake"
type: llm-distillate
source: "product-brief-bmad-snake.md"
created: "2026-04-11T17:33:38Z"
purpose: "Token-efficient context for downstream PRD creation"
---

# Distillate: BMAD Snake

## Product Intent
- Project purpose is **learning demo** to practice BMAD methodology end-to-end (planning -> implementation -> review).
- Product form is a browser-based Snake game for quick stress relief sessions.
- Core value proposition: instant play + short intense focus loop + clear stage progression.

## Target Users and Context
- Primary users: PC web players taking short breaks.
- Secondary users: mobile web players in transit/waiting contexts.
- Shared user need: no onboarding friction, immediate understanding, fast retry after failure.

## Problem Framing
- Existing casual games often add friction (ads, account flow, excessive progression complexity).
- User job-to-be-done: get a short, satisfying, low-cognitive-load play session for stress release.

## Solution Shape (MVP)
- Single-player only.
- Stage mode with **time limit** as core mechanic (not endless survival loop).
- Total 20 maps with progression and unlock flow.
- Stage clear condition: reach target food count within time.
- Failure conditions: collision (wall/body) or time expiration.

## Difficulty and Session Assumptions
- Average run target: 2-5 minutes for practical break-time fit.
- Stage timer guideline: 45-90 seconds.
- Difficulty curve confirmed: 4 tiers x 5 maps (intro/basic/challenge/advanced).
- Tuning levers: obstacle density, route complexity, target food count.

## Platform and Interaction Hints
- Must support both PC and mobile in MVP.
- Mobile interaction preference: swipe direction input.
- UX hint: keep HUD highly legible on small screens (remaining time, objective, snake length).

## Metrics and Measurement
- Primary KPI fixed: **Average Play Time >= 3 minutes per session** at initial release.
- Session start definition: first keyboard/touch input.
- Session end definition: game over, stage exit after clear, or 30s inactivity timeout.
- Analyze KPI by platform split (PC/mobile) and combined average.
- Supporting signals: stage 1 clear rate, stage 5 reach rate, immediate retry rate.

## Scope Signals
- In scope (MVP):
  - Web play on PC/mobile
  - Single-player
  - Time-limited stage mode
  - 20 maps
  - Basic progression/retry loop
- Explicitly out of scope (MVP):
  - Ranking/leaderboard
  - Multiplayer
  - Monetization (ads/payments/shop)

## Roadmap Signals
- V2 priority explicitly selected: **Ghost Replay** (compare with personal best route).
- Other V2 candidates (lower priority): daily challenge mode, themed map packs.

## Delivery and Validation Approach
- Since this is a learning demo, optimization target is validated gameplay loop rather than commercial launch scale.
- Iterate with short BMAD cycles and lightweight internal/friend playtests to tune timer and map balance.
- Avoid over-expanding feature scope before stress-relief core loop feels consistent across PC/mobile.

## Rejected/Deferred Directions
- Ranking features are deliberately excluded from MVP to reduce complexity and preserve focus on core loop quality.
- Monetization and social competition are deferred until retention and loop quality are proven.

## Open Questions for PRD Phase
- Exact per-tier difficulty targets (clear-rate bands) are not yet defined.
- Minimal technical stack decision (engine/framework) is still open.
- Whether progress persistence is session-only or browser-local-save in MVP remains undecided.
- Accessibility baseline (color contrast, input alternatives) needs explicit acceptance criteria.
