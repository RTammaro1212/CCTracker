# CardCompare (Home MVP)

CardCompare is a lightweight client-side prototype for tracking whether premium credit cards are worth their annual fee.

The current MVP focuses on two workflows:

1. **Benefit recovery tracking**
   - Mark monthly / quarterly / yearly credits as used.
   - See how much value you have recovered vs annual fee.
2. **Points-on-spend tracking**
   - Enter annual spend by earning category.
   - Estimate tracked points/miles based on each card's multiplier rules.

---

## Current Card Presets

The app currently includes starter presets for:

- Amex Platinum
- Amex Gold
- Chase Sapphire Reserve
- Chase Sapphire Preferred
- Capital One Venture X

Each preset includes:

- `annualFee`
- `benefits[]` (cadence + per-period value + annual cap)
- `earnRates[]` (label + multiplier)

---

## Card Data Architecture (Best Practice for 50+ Cards)

Yes — there is a better long-term architecture than keeping all card definitions embedded in UI logic.

### What this repo now does

- Card definitions live in `js/card-catalog.js` as a dedicated catalog payload.
- UI and interaction logic live in `js/app.js`.
- `index.html` loads the catalog first, then app logic.

This separation improves maintainability and avoids repeatedly touching rendering code when adding cards.

### Recommended next step (production-oriented)

When you move beyond MVP:

1. **Store card data in versioned JSON** (e.g., `data/cards.v1.json`) and fetch it at runtime.
2. **Validate schema** before render (required fields like `id`, `annualFee`, `benefits`, `earnRates`).
3. **Add a normalized cadence model** (`monthly`, `quarterly`, `yearly`, `cooldownYears`) so calculations stay consistent.
4. **Split static issuer metadata** (logos, colors, display names) from benefit/rules data.
5. **Use lightweight caching** (`Cache-Control` + ETag/CDN) to keep load times fast as catalog grows.
6. **Keep user state separate** from catalog (`localStorage` now, backend later) so catalog updates don't overwrite usage history.

### Why this scales better

- Faster card additions (data-only change).
- Lower regression risk (UI code changes less often).
- Better load performance (cacheable static catalog).
- Cleaner path to API-backed updates later.

---

## Special Modeling Included

To improve realism in benefit calculations, the app includes:

- **Variable-value benefits**
  - Example: Venture X hotel credit can be set per stay within a range.
- **Cooldown-gated benefits**
  - Example: Global Entry / TSA PreCheck can be tied to a last-claim year and cooldown window.

These values are managed in in-memory state for the current browser session.

---

## Run Locally

Because this is a static prototype, no build step is required.

```bash
python3 -m http.server 4173
```

Then open:

- `http://localhost:4173`

---

## File Structure

- `index.html` — page layout and containers
- `styles.css` — small custom styles on top of Tailwind utility classes
- `js/card-catalog.js` — card catalog payload (presets, benefits, earn rates)
- `js/app.js` — rendering, state, and interaction logic

---

## Next Recommended Steps

- Persist state to `localStorage`.
- Add statement upload parsing and category mapping.
- Add confidence/accuracy labels for assumptions (e.g., estimated point valuation).
- Add per-card settings (open date, renewal date, authorized users, effective fee adjustments).
- Add export/import of user profile data.

---

## Notes

This is an MVP and should not be treated as financial advice. Benefit terms and eligibility can change; always verify with issuer terms.
