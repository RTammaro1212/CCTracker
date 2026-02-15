const CARD_PRESETS = [
  {
    id: 'amex-platinum',
    name: 'Amex Platinum',
    issuer: 'Amex',
    annualFee: 895,
    color: 'bg-zinc-900',
    benefits: [
      { id: 'uber', name: 'Uber Cash', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 15, maxAnnualValue: 200, note: '$15/month in Uber Cash plus extra $20 in December (up to $200/year).' },
      { id: 'uberone', name: 'Uber One Membership Credit', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 9.99, maxAnnualValue: 120, note: 'Uber One monthly credit (up to $120/year statement credits).' },
      { id: 'subscription', name: 'Streaming / Subscription Credit', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 25, maxAnnualValue: 300, note: 'Eligible services include Disney+, Hulu, NYT, WSJ, YouTube Premium/TV and more.' },
      { id: 'hotel', name: 'Fine Hotels + Resorts / THC Credit', cadence: 'semi-annual', periodsPerYear: 2, valuePerPeriod: 150, maxAnnualValue: 300, note: 'Up to $300 total per year across two periods.' },
      { id: 'resy', name: 'Resy Credit', cadence: 'quarterly', periodsPerYear: 4, valuePerPeriod: 100, maxAnnualValue: 400, note: '$100 each quarter.' },
      { id: 'clear', name: 'CLEAR+ Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 209, maxAnnualValue: 209, note: 'Up to $209/yr statement credit for CLEAR+ membership.' },
      { id: 'airline', name: 'Airline Incidental Fee Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 200, maxAnnualValue: 200, note: 'Incidental airline fees up to $200/yr.' },
      { id: 'lululemon', name: 'Lululemon Credit', cadence: 'quarterly', periodsPerYear: 4, valuePerPeriod: 75, maxAnnualValue: 300, note: '$75 each quarter.' },
      { id: 'walmart', name: 'Walmart+ Membership Credit', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 12.95, maxAnnualValue: 155.4, note: 'Up to $12.95 + applicable tax each month.' },
    ],
    earnRates: [
      { id: 'amex-flights', label: 'Flights booked directly or through Amex Travel', multiplier: 5 },
      { id: 'amex-prepaid-hotels', label: 'Prepaid hotels booked on amextravel.com', multiplier: 5 },
      { id: 'amex-other', label: 'All other eligible purchases', multiplier: 1 },
    ],
  },
  {
    id: 'chase-sapphire-reserve',
    name: 'Chase Sapphire Reserve',
    issuer: 'Chase',
    annualFee: 795,
    color: 'bg-sky-700',
    benefits: [
      { id: 'lyft', name: 'Lyft Credit', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 10, maxAnnualValue: 120, note: '$10 monthly credit.' },
      { id: 'doordash', name: 'DoorDash Credits', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 25, maxAnnualValue: 300, note: 'Two $10 non-restaurant + one $5 restaurant credit each month.' },
      { id: 'csr-dashpass', name: 'DashPass Membership Value', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 96, maxAnnualValue: 96, note: 'Annual DashPass benefit value of $96.' },
      { id: 'tsa', name: 'TSA PreCheck / Global Entry', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 120, maxAnnualValue: 120, cooldownYears: 4, note: 'Up to $85/$120 credit; add last-claim year to enforce 4-year cooldown.' },
      { id: 'peloton', name: 'Peloton Credit', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 10, maxAnnualValue: 120, note: '$10 monthly credits.' },
      { id: 'apple-tv', name: 'Apple TV+ Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 119.88, maxAnnualValue: 119.88, note: 'Annual value target.' },
      { id: 'apple-music', name: 'Apple Music Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 131.88, maxAnnualValue: 131.88, note: 'Annual value target.' },
      { id: 'stubhub', name: 'StubHub / Viagogo Credit', cadence: 'semi-annual', periodsPerYear: 2, valuePerPeriod: 150, maxAnnualValue: 300, note: '$150 each half-year.' },
      { id: 'opentable', name: 'OpenTable Dining Credit', cadence: 'semi-annual', periodsPerYear: 2, valuePerPeriod: 150, maxAnnualValue: 300, note: '$150 each half-year.' },
      { id: 'travel', name: 'Travel Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 300, maxAnnualValue: 300, note: '$300 annual travel credit.' },
      { id: 'edit-hotel', name: 'The Edit Hotel Credit', cadence: 'semi-annual', periodsPerYear: 2, valuePerPeriod: 125, maxAnnualValue: 250, note: '$250 yearly split semi-annually.' },
    ],
    earnRates: [
      { id: 'csr-chase-travel', label: 'All purchases through Chase Travel', multiplier: 8 },
      { id: 'csr-flights-direct', label: 'Flights booked direct', multiplier: 4 },
      { id: 'csr-hotels-direct', label: 'Hotels booked direct', multiplier: 4 },
      { id: 'csr-dining', label: 'Dining worldwide', multiplier: 3 },
      { id: 'csr-other', label: 'All other purchases', multiplier: 1 },
    ],
  },
  {
    id: 'capital-one-venture-x',
    name: 'Capital One Venture X',
    issuer: 'Capital One',
    annualFee: 395,
    color: 'bg-emerald-700',
    benefits: [
      { id: 'vx-travel-credit', name: 'C1 Travel Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 300, maxAnnualValue: 300, note: '$300 annual travel credit through Capital One Travel.' },
      { id: 'vx-global-entry', name: 'Global Entry / TSA PreCheck Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 120, maxAnnualValue: 120, cooldownYears: 4, note: 'Up to $120 credit; add last-claim year to enforce 4-year cooldown.' },
      { id: 'vx-hotel-credit', name: 'Premier / Lifestyle Collection Hotel Credit', cadence: 'per-stay', periodsPerYear: 12, valuePerPeriod: 75, minValuePerPeriod: 50, maxValuePerPeriod: 100, variableValue: true, maxAnnualValue: 1200, note: '$50-$100 per eligible stay; set your per-stay value below.' },
    ],
    earnRates: [
      { id: 'vx-hotels-rental-cars-c1', label: 'Hotels & rental cars through Capital One Travel', multiplier: 10 },
      { id: 'vx-flights-vacation-rentals-c1', label: 'Flights & vacation rentals through Capital One Travel', multiplier: 5 },
      { id: 'vx-other', label: 'Everything else', multiplier: 2 },
    ],
  },
  {
    id: 'amex-gold',
    name: 'Amex Gold',
    issuer: 'Amex',
    annualFee: 325,
    color: 'bg-amber-500',
    benefits: [
      { id: 'gold-uber', name: 'Uber Cash', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 10, maxAnnualValue: 120, note: '$10 in Uber Cash each month.' },
      { id: 'gold-dunkin', name: "Dunkin' Credit", cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 7, maxAnnualValue: 84, note: "$7 monthly statement credit at U.S. Dunkin' locations." },
      { id: 'gold-resy', name: 'Resy Credit', cadence: 'semi-annual', periodsPerYear: 2, valuePerPeriod: 50, maxAnnualValue: 100, note: '$50 statement credits semi-annually.' },
      { id: 'gold-dining', name: 'Select Dining Credit', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 10, maxAnnualValue: 120, note: '$10 monthly at eligible partners (Grubhub, Cheesecake Factory, Goldbelly, Wine.com, Five Guys).' },
      { id: 'gold-hotel', name: 'Hotel Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 100, maxAnnualValue: 100, note: '$100 credit on eligible 2+ night AmexTravel.com bookings.' },
    ],
    earnRates: [
      { id: 'gold-restaurants', label: 'Restaurants purchases', multiplier: 4 },
      { id: 'gold-us-supermarkets', label: 'U.S. supermarkets purchases', multiplier: 4 },
      { id: 'gold-flights', label: 'Flights booked direct with airlines or AmexTravel.com', multiplier: 3 },
      { id: 'gold-prepaid-hotels-amex', label: 'Prepaid hotels booked on AmexTravel.com', multiplier: 2 },
      { id: 'gold-other-amextravel', label: 'Other eligible purchases booked on AmexTravel.com', multiplier: 2 },
      { id: 'gold-other', label: 'All other eligible purchases', multiplier: 1 },
    ],
  },
  {
    id: 'chase-sapphire-preferred',
    name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    annualFee: 95,
    color: 'bg-indigo-700',
    benefits: [
      { id: 'csp-hotel', name: 'Hotel Credit', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 50, maxAnnualValue: 50, note: '$50 annual hotel credit.' },
      { id: 'csp-doordash', name: 'DoorDash Non-Restaurant Credits', cadence: 'monthly', periodsPerYear: 12, valuePerPeriod: 10, maxAnnualValue: 120, note: '$10 monthly non-restaurant credits.' },
      { id: 'csp-dashpass', name: 'DashPass Membership Value', cadence: 'yearly', periodsPerYear: 1, valuePerPeriod: 96, maxAnnualValue: 96, note: 'Annual DashPass benefit value of $96.' },
    ],
    earnRates: [
      { id: 'csp-chase-travel', label: 'Travel purchased through Chase Travel', multiplier: 5 },
      { id: 'csp-dining', label: 'Dining + eligible delivery services', multiplier: 3 },
      { id: 'csp-online-grocery', label: 'Online grocery (excluding Target, Walmart, wholesale clubs)', multiplier: 3 },
      { id: 'csp-streaming', label: 'Select streaming services', multiplier: 3 },
      { id: 'csp-other-travel', label: 'Other travel purchases', multiplier: 2 },
      { id: 'csp-other', label: 'All other eligible purchases', multiplier: 1 },
    ],
  },
];

const selectedCards = new Set();
const usageState = {};
const spendState = {};
const benefitMetaState = {};

const presetsEl = document.getElementById('card-presets');
const chartEl = document.getElementById('chart');
const emptyStateEl = document.getElementById('empty-state');
const benefitPanelsEl = document.getElementById('benefit-panels');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value);
}

function formatPoints(value) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function ensureCardState(card) {
  if (!usageState[card.id]) usageState[card.id] = {};
  if (!spendState[card.id]) spendState[card.id] = {};
  if (!benefitMetaState[card.id]) benefitMetaState[card.id] = {};

  card.benefits.forEach((benefit) => {
    if (usageState[card.id][benefit.id] === undefined) usageState[card.id][benefit.id] = 0;
    if (!benefitMetaState[card.id][benefit.id]) {
      benefitMetaState[card.id][benefit.id] = {
        valuePerPeriod: benefit.valuePerPeriod,
        lastClaimYear: '',
      };
    }
  });

  card.earnRates.forEach((rate) => {
    if (spendState[card.id][rate.id] === undefined) spendState[card.id][rate.id] = 0;
  });
}

function getBenefitValue(benefit, cardId) {
  if (!benefit.variableValue) return benefit.valuePerPeriod;
  return Number(benefitMetaState[cardId][benefit.id]?.valuePerPeriod ?? benefit.valuePerPeriod) || 0;
}

function getBenefitEligibility(benefit, cardId) {
  if (!benefit.cooldownYears) return { eligible: true, yearsLeft: 0 };

  const currentYear = new Date().getFullYear();
  const lastClaimYear = Number(benefitMetaState[cardId][benefit.id]?.lastClaimYear || 0);
  if (!lastClaimYear) return { eligible: true, yearsLeft: 0 };

  const elapsed = currentYear - lastClaimYear;
  const yearsLeft = Math.max(benefit.cooldownYears - elapsed, 0);
  return { eligible: yearsLeft === 0, yearsLeft };
}

function getPointsSummary(card) {
  ensureCardState(card);
  let totalPoints = 0;

  card.earnRates.forEach((rate) => {
    const annualSpend = Number(spendState[card.id][rate.id] || 0);
    totalPoints += annualSpend * rate.multiplier;
  });

  return { totalPoints };
}

function getCardRecovery(card) {
  ensureCardState(card);
  let recovered = 0;

  card.benefits.forEach((benefit) => {
    const { eligible } = getBenefitEligibility(benefit, card.id);
    if (!eligible) return;

    const usedPeriods = usageState[card.id][benefit.id];
    const rawValue = usedPeriods * getBenefitValue(benefit, card.id);
    recovered += Math.min(rawValue, benefit.maxAnnualValue);
  });

  const { totalPoints } = getPointsSummary(card);
  const feeRecoveredPct = card.annualFee ? Math.min((recovered / card.annualFee) * 100, 200) : 0;
  return { recovered, feeRecoveredPct, net: recovered - card.annualFee, totalPoints };
}

function renderPresets() {
  presetsEl.innerHTML = '';
  CARD_PRESETS.forEach((card) => {
    const active = selectedCards.has(card.id);
    const button = document.createElement('button');
    button.className = `rounded-2xl border p-3 text-left transition-all ${active ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'}`;
    button.innerHTML = `
      <div class="mb-2 flex items-center gap-2">
        <div class="${card.color} flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold uppercase text-white">${card.issuer.slice(0, 2)}</div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${card.issuer}</div>
      </div>
      <div class="text-sm font-bold text-slate-900 leading-tight">${card.name}</div>
      <div class="mt-1 text-xs text-slate-500">Fee ${formatCurrency(card.annualFee)}</div>
    `;

    button.onclick = () => {
      if (selectedCards.has(card.id)) {
        selectedCards.delete(card.id);
      } else {
        selectedCards.add(card.id);
        ensureCardState(card);
      }
      renderPresets();
      renderAll();
    };

    presetsEl.appendChild(button);
  });
}

function renderChart(cards) {
  const rows = cards.map((card) => ({ card, ...getCardRecovery(card) })).sort((a, b) => b.feeRecoveredPct - a.feeRecoveredPct);
  document.getElementById('metric-count').textContent = rows.length;

  if (!rows.length) {
    emptyStateEl.classList.remove('hidden');
    chartEl.classList.add('hidden');
    benefitPanelsEl.classList.add('hidden');
    document.getElementById('metric-best').textContent = '—';
    document.getElementById('metric-recovered').textContent = '$0';
    return;
  }

  const totalRecovered = rows.reduce((sum, row) => sum + row.recovered, 0);
  const best = rows[0];
  document.getElementById('metric-best').textContent = `${best.card.name} (${best.feeRecoveredPct.toFixed(0)}%)`;
  document.getElementById('metric-recovered').textContent = formatCurrency(totalRecovered);

  emptyStateEl.classList.add('hidden');
  chartEl.classList.remove('hidden');

  chartEl.innerHTML = rows
    .map(({ card, recovered, feeRecoveredPct, net, totalPoints }) => {
      const safeWidth = Math.max(Math.min(feeRecoveredPct, 100), 2);
      const isPositive = net >= 0;
      return `
        <div class="rounded-xl border border-slate-100 p-3">
          <div class="mb-2 flex items-center justify-between text-xs">
            <span class="font-bold text-slate-700">${card.name}</span>
            <span class="font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}">${formatCurrency(net)} net</span>
          </div>
          <div class="h-3 rounded-full bg-slate-100">
            <div class="bar-fill h-3 rounded-full ${isPositive ? 'bg-indigo-500' : 'bg-amber-500'}" style="width:${safeWidth}%"></div>
          </div>
          <div class="mt-1 text-[11px] text-slate-400">${formatCurrency(recovered)} recovered of ${formatCurrency(card.annualFee)} fee (${feeRecoveredPct.toFixed(0)}%)</div>
          <div class="mt-1 text-[11px] font-semibold text-slate-500">${formatPoints(totalPoints)} points tracked</div>
        </div>
      `;
    })
    .join('');
}

function renderBenefitPanels(cards) {
  benefitPanelsEl.classList.remove('hidden');

  benefitPanelsEl.innerHTML = cards
    .map((card) => {
      const hasBenefits = card.benefits.length > 0;
      const hasRates = card.earnRates.length > 0;
      const pointsSummary = getPointsSummary(card);

      const benefitRows = hasBenefits
        ? card.benefits
            .map((benefit) => {
              const { eligible, yearsLeft } = getBenefitEligibility(benefit, card.id);
              const allowedPeriods = eligible ? benefit.periodsPerYear : 0;
              const usedPeriods = Math.min(usageState[card.id][benefit.id] || 0, allowedPeriods);
              const unitValue = getBenefitValue(benefit, card.id);
              const recoveredValue = Math.min(usedPeriods * unitValue, benefit.maxAnnualValue);
              const disabledClass = eligible ? '' : 'opacity-50';
              return `
              <div class="rounded-xl border border-slate-100 p-3 ${disabledClass}">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="text-sm font-bold text-slate-800">${benefit.name}</div>
                    <div class="mt-1 text-xs text-slate-500">${benefit.note}</div>
                    ${benefit.cooldownYears ? `<div class="mt-1 text-[11px] font-semibold ${eligible ? 'text-emerald-600' : 'text-amber-600'}">${eligible ? 'Eligible this year' : `Eligible in ${yearsLeft} year(s)`}</div>` : ''}
                  </div>
                  <span class="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">${benefit.cadence}</span>
                </div>
                ${benefit.variableValue ? `<div class="mt-2 grid grid-cols-2 gap-2"><label class="text-[11px] text-slate-500">Per-stay value</label><input type="number" min="${benefit.minValuePerPeriod}" max="${benefit.maxValuePerPeriod}" step="1" class="benefit-value-input rounded-lg border border-slate-200 px-2 py-1 text-sm font-semibold" data-card-id="${card.id}" data-benefit-id="${benefit.id}" value="${unitValue}" /></div>` : ''}
                ${benefit.cooldownYears ? `<div class="mt-2 grid grid-cols-2 gap-2"><label class="text-[11px] text-slate-500">Last claim year</label><input type="number" min="2000" max="2100" step="1" class="benefit-last-claim-input rounded-lg border border-slate-200 px-2 py-1 text-sm font-semibold" data-card-id="${card.id}" data-benefit-id="${benefit.id}" value="${benefitMetaState[card.id][benefit.id].lastClaimYear}" placeholder="e.g. 2023" /></div>` : ''}
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <button class="usage-btn rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold text-slate-600" data-card-id="${card.id}" data-benefit-id="${benefit.id}" data-delta="-1">−</button>
                    <div class="min-w-[92px] text-center text-sm font-semibold text-slate-700">${usedPeriods}/${allowedPeriods} used</div>
                    <button class="usage-btn rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold text-slate-600" data-card-id="${card.id}" data-benefit-id="${benefit.id}" data-delta="1">+</button>
                  </div>
                  <div class="text-sm font-bold text-indigo-600">${formatCurrency(recoveredValue)}</div>
                </div>
              </div>`;
            })
            .join('')
        : '<div class="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">Benefit template coming next for this card.</div>';

      const pointsRows = hasRates
        ? card.earnRates
            .map((rate) => {
              const spend = spendState[card.id][rate.id] || 0;
              const points = spend * rate.multiplier;
              return `
              <div class="rounded-xl border border-slate-100 p-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="text-sm font-bold text-slate-800">${rate.multiplier}x points</div>
                  <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Annual spend input</div>
                </div>
                <div class="mt-1 text-xs text-slate-500">${rate.label}</div>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <input type="number" min="0" step="50" class="spend-input rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold" data-card-id="${card.id}" data-rate-id="${rate.id}" value="${spend}" />
                  <div class="rate-points-value rounded-lg bg-slate-50 px-3 py-2 text-right text-sm font-bold text-indigo-600" data-card-id="${card.id}" data-rate-id="${rate.id}">${formatPoints(points)} pts</div>
                </div>
              </div>`;
            })
            .join('')
        : '<div class="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-400">Points earning template coming next for this card.</div>';

      return `
        <details class="rounded-2xl border border-slate-100 bg-white p-4" open>
          <summary class="cursor-pointer list-none">
            <div class="flex items-center justify-between">
              <div class="text-sm font-bold text-slate-800">${card.name}</div>
              <span class="text-xs font-semibold text-slate-400">Tap to collapse</span>
            </div>
          </summary>

          <details class="mt-4 rounded-xl border border-slate-100 p-3" open>
            <summary class="cursor-pointer list-none text-xs font-bold uppercase tracking-wider text-slate-400">Benefit usage tracking</summary>
            <div class="mt-3 space-y-2">${benefitRows}</div>
          </details>

          <details class="mt-4 rounded-xl border border-slate-100 p-3" open>
            <summary class="cursor-pointer list-none text-xs font-bold uppercase tracking-wider text-slate-400">Points on spend</summary>
            <div class="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
              Enter annual spend manually now. Statement upload mapping can auto-fill these categories in a future iteration.
            </div>
            <div class="mt-3 space-y-2">${pointsRows}</div>
            <div class="mt-2 text-right text-xs font-bold text-slate-500">Total tracked points: <span class="card-total-points text-indigo-600" data-card-id="${card.id}">${formatPoints(pointsSummary.totalPoints)}</span></div>
          </details>
        </details>
      `;
    })
    .join('');

  document.querySelectorAll('.usage-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const cardId = button.dataset.cardId;
      const benefitId = button.dataset.benefitId;
      const delta = Number(button.dataset.delta);

      const card = CARD_PRESETS.find((item) => item.id === cardId);
      const benefit = card.benefits.find((item) => item.id === benefitId);
      const { eligible } = getBenefitEligibility(benefit, cardId);
      const maxPeriods = eligible ? benefit.periodsPerYear : 0;
      const current = usageState[cardId][benefitId] || 0;
      usageState[cardId][benefitId] = Math.max(0, Math.min(maxPeriods, current + delta));
      renderAll();
    });
  });

  document.querySelectorAll('.benefit-value-input').forEach((input) => {
    input.addEventListener('input', () => {
      const cardId = input.dataset.cardId;
      const benefitId = input.dataset.benefitId;
      const card = CARD_PRESETS.find((item) => item.id === cardId);
      const benefit = card.benefits.find((item) => item.id === benefitId);
      const value = Math.max(benefit.minValuePerPeriod, Math.min(benefit.maxValuePerPeriod, Number(input.value) || benefit.valuePerPeriod));
      benefitMetaState[cardId][benefitId].valuePerPeriod = value;
      renderAll();
    });
  });

  document.querySelectorAll('.benefit-last-claim-input').forEach((input) => {
    input.addEventListener('input', () => {
      const cardId = input.dataset.cardId;
      const benefitId = input.dataset.benefitId;
      const year = Number(input.value) || '';
      benefitMetaState[cardId][benefitId].lastClaimYear = year;
      renderAll();
    });
  });

  document.querySelectorAll('.spend-input').forEach((input) => {
    input.addEventListener('input', () => {
      const cardId = input.dataset.cardId;
      const rateId = input.dataset.rateId;
      spendState[cardId][rateId] = Math.max(0, Number(input.value) || 0);

      const card = CARD_PRESETS.find((item) => item.id === cardId);
      const rate = card.earnRates.find((item) => item.id === rateId);
      const rowPoints = (spendState[cardId][rateId] || 0) * rate.multiplier;
      const rowPointsEl = document.querySelector(`.rate-points-value[data-card-id="${cardId}"][data-rate-id="${rateId}"]`);
      if (rowPointsEl) rowPointsEl.textContent = `${formatPoints(rowPoints)} pts`;

      const totalPoints = getPointsSummary(card).totalPoints;
      const totalPointsEl = document.querySelector(`.card-total-points[data-card-id="${cardId}"]`);
      if (totalPointsEl) totalPointsEl.textContent = formatPoints(totalPoints);

      const cards = CARD_PRESETS.filter((item) => selectedCards.has(item.id));
      renderChart(cards);
    });
  });
}

function renderAll() {
  const cards = CARD_PRESETS.filter((card) => selectedCards.has(card.id));
  renderChart(cards);
  if (cards.length) renderBenefitPanels(cards);
}

document.getElementById('clear-cards').addEventListener('click', () => {
  selectedCards.clear();
  renderPresets();
  renderAll();
});

renderPresets();
renderAll();
