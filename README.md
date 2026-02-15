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
- `js/app.js` — card data model + rendering + interaction logic

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
