const CARD_PRESETS = Array.isArray(window.CARD_CATALOG) ? window.CARD_CATALOG : [];
if (!CARD_PRESETS.length) {
  console.error('Card catalog failed to load. Ensure js/card-catalog.js is included before js/app.js.');
}

const selectedCards = new Set();
const usageState = {};
const spendState = {};
const benefitMetaState = {};
let isCardPickerOpen = false;
let activeBrand = '';

const presetsEl = document.getElementById('card-presets');
const chartEl = document.getElementById('chart');
const emptyStateEl = document.getElementById('empty-state');
const benefitPanelsEl = document.getElementById('benefit-panels');
const statementCardSelectEl = document.getElementById('statement-card-select');
const statementUploadEl = document.getElementById('statement-upload');
const statementUploadStatusEl = document.getElementById('statement-upload-status');
const addCardsBtnEl = document.getElementById('add-cards-btn');
const cardPickerPanelEl = document.getElementById('card-picker-panel');
const brandOptionsEl = document.getElementById('brand-options');
const brandCardOptionsEl = document.getElementById('brand-card-options');
const closeCardPickerEl = document.getElementById('close-card-picker');

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

function getAvailableBrands() {
  return Array.from(new Set(CARD_PRESETS.map((card) => card.issuer)));
}

function renderBrandOptions() {
  if (!brandOptionsEl) return;

  const brands = getAvailableBrands();
  if (!activeBrand && brands.length) activeBrand = brands[0];

  brandOptionsEl.innerHTML = brands
    .map((brand) => {
      const active = brand === activeBrand;
      return `<button class="brand-filter inline-flex min-h-[38px] items-center justify-center rounded-xl border px-2.5 py-2 text-xs font-bold leading-none transition-colors ${active ? 'border-indigo-400 bg-indigo-100 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'}" data-brand="${brand}">${brand}</button>`;
    })
    .join('');

  document.querySelectorAll('.brand-filter').forEach((button) => {
    button.addEventListener('click', () => {
      activeBrand = button.dataset.brand;
      renderBrandOptions();
      renderBrandCardOptions();
    });
  });
}

function renderBrandCardOptions() {
  if (!brandCardOptionsEl) return;

  const cards = CARD_PRESETS.filter((card) => card.issuer === activeBrand);
  brandCardOptionsEl.innerHTML = cards
    .map((card) => {
      const selected = selectedCards.has(card.id);
      return `<button class="brand-card-option rounded-xl border p-3 text-left transition-all ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}" data-card-id="${card.id}">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-sm font-bold text-slate-800">${card.name}</div>
            <div class="text-xs text-slate-500">${formatCurrency(card.annualFee)} annual fee</div>
          </div>
          <div class="text-xs font-bold ${selected ? 'text-indigo-600' : 'text-slate-400'}">${selected ? 'Selected' : 'Add'}</div>
        </div>
      </button>`;
    })
    .join('');

  document.querySelectorAll('.brand-card-option').forEach((button) => {
    button.addEventListener('click', () => {
      const cardId = button.dataset.cardId;
      const card = CARD_PRESETS.find((item) => item.id === cardId);
      if (!card) return;

      if (selectedCards.has(card.id)) {
        selectedCards.delete(card.id);
      } else {
        selectedCards.add(card.id);
        ensureCardState(card);
      }

      renderPresets();
      renderAll();
      renderBrandCardOptions();
    });
  });
}

function openCardPicker() {
  isCardPickerOpen = true;
  if (cardPickerPanelEl) cardPickerPanelEl.classList.remove('hidden');
  renderBrandOptions();
  renderBrandCardOptions();
}

function closeCardPicker() {
  isCardPickerOpen = false;
  if (cardPickerPanelEl) cardPickerPanelEl.classList.add('hidden');
}

function renderPresets() {
  presetsEl.innerHTML = '';

  const selected = CARD_PRESETS.filter((card) => selectedCards.has(card.id));
  const showCompactAdd = selected.length > 0;

  if (addCardsBtnEl) {
    addCardsBtnEl.classList.toggle('hidden', !showCompactAdd);
    addCardsBtnEl.classList.toggle('inline-flex', showCompactAdd);
  }

  if (!selected.length) {
    const addTile = document.createElement('button');
    addTile.className = 'col-span-2 flex min-h-[118px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-300 bg-indigo-50/70 p-3 text-center transition-colors hover:bg-indigo-100';
    addTile.innerHTML = `
      <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl font-bold text-indigo-600">+</div>
      <div class="text-sm font-bold text-indigo-700">Add your first card</div>
      <div class="text-xs text-indigo-500">Tap to browse card brands</div>
    `;
    addTile.addEventListener('click', openCardPicker);
    presetsEl.appendChild(addTile);
  } else {
    selected.forEach((card) => {
      const button = document.createElement('button');
      button.className = 'rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3 text-left transition-colors hover:border-red-300 hover:bg-red-50';
      button.innerHTML = `
        <div class="mb-2 flex items-center gap-2">
          <div class="${card.color} flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold uppercase text-white">${card.issuer.slice(0, 2)}</div>
          <div class="pt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">${card.issuer}</div>
        </div>
        <div class="text-sm font-bold leading-tight text-slate-900">${card.name}</div>
        <div class="mt-1 text-xs font-medium text-slate-500">Click to remove</div>
      `;

      button.addEventListener('click', () => {
        selectedCards.delete(card.id);
        renderPresets();
        renderAll();
      });
      presetsEl.appendChild(button);
    });
  }

  if (!isCardPickerOpen && cardPickerPanelEl) {
    cardPickerPanelEl.classList.add('hidden');
  }

  refreshStatementUploadCardOptions();
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

function renderSingleBenefitRow(card, benefit) {
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
}

function renderBenefitPanels(cards) {
  benefitPanelsEl.classList.remove('hidden');

  benefitPanelsEl.innerHTML = cards
    .map((card) => {
      const hasBenefits = card.benefits.length > 0;
      const hasRates = card.earnRates.length > 0;
      const pointsSummary = getPointsSummary(card);

      const benefitRows = hasBenefits
        ? (() => {
            const grouped = new Map();
            const ungrouped = [];

            card.benefits.forEach((benefit) => {
              if (benefit.group) {
                if (!grouped.has(benefit.group)) grouped.set(benefit.group, []);
                grouped.get(benefit.group).push(benefit);
              } else {
                ungrouped.push(benefit);
              }
            });

            const ungroupedHtml = ungrouped.map((benefit) => renderSingleBenefitRow(card, benefit)).join('');
            const groupedHtml = Array.from(grouped.entries()).map(([groupId, items]) => {
              const title = groupId === 'csr-doordash' ? 'DoorDash Credits (track each credit separately)' : 'Grouped Benefits';
              return `<details class="rounded-xl border border-slate-200 bg-slate-50 p-3" open>
                <summary class="cursor-pointer list-none text-sm font-bold text-slate-700">${title}</summary>
                <div class="mt-3 space-y-2">${items.map((benefit) => renderSingleBenefitRow(card, benefit)).join('')}</div>
              </details>`;
            }).join('');

            return ungroupedHtml + groupedHtml;
          })()
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
              Enter annual spend manually or use the Statement Upload tile to auto-fill categories from CSV exports.
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


function refreshStatementUploadCardOptions() {
  if (!statementCardSelectEl) return;

  const cards = CARD_PRESETS.filter((card) => selectedCards.has(card.id));
  const source = cards.length ? cards : CARD_PRESETS;
  statementCardSelectEl.innerHTML = source
    .map((card) => `<option value="${card.id}">${card.name}</option>`)
    .join('');
  statementCardSelectEl.disabled = source.length === 0;
}

function parseCSVLine(line) {
  const out = [];
  let token = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        token += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      out.push(token.trim());
      token = '';
    } else {
      token += char;
    }
  }

  out.push(token.trim());
  return out;
}

function normalizeText(textValue) {
  return String(textValue || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeMerchantName(rawMerchant) {
  let merchant = normalizeText(rawMerchant);
  merchant = merchant
    .replace(/^(sq\s*\*|sq\*|tst\s*\*|tst\*|paypal\s*\*|pp\*|pos\s+purchase\s+)/, '')
    .replace(/\s+#?\d+$/g, '')
    .replace(/\s+store\s+\d+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  return merchant;
}

function isGroceryLikeMerchant(merchant, categoryText) {
  const sampleText = `${merchant} ${normalizeText(categoryText)}`;
  const groceryKeywords = [
    'grocery', 'supermarket', 'whole foods', 'trader joe', 'aldi', 'kroger', 'safeway',
    'publix', 'sprouts', 'wegmans', 'costco', 'sam club', 'instacart', 'food lion',
  ];

  return groceryKeywords.some((word) => sampleText.includes(word));
}

function getBucketDefinitions(card) {
  return card.earnRates.map((rate) => ({
    id: rate.id,
    label: rate.label,
    normalizedLabel: normalizeText(rate.label),
  }));
}

function findBucketByKeywords(bucketDefs, keywordSets) {
  return bucketDefs.find((bucket) =>
    keywordSets.some((keywords) => keywords.every((keyword) => bucket.normalizedLabel.includes(keyword))),
  );
}

function findOtherRateId(card) {
  const bucketDefs = getBucketDefinitions(card);
  const catchall = findBucketByKeywords(bucketDefs, [
    ['all', 'other'],
    ['everything', 'else'],
    ['other', 'eligible'],
  ]);
  return catchall ? catchall.id : (bucketDefs[0]?.id || null);
}

function resolveRateForCategory(card, category, merchant) {
  const bucketDefs = getBucketDefinitions(card);
  const catchallRateId = findOtherRateId(card);
  const normalizedCategory = normalizeText(category);
  const normalizedMerchant = normalizeMerchantName(merchant);

  if (!bucketDefs.length) return null;

  const exactByCategory = bucketDefs.find((bucket) => {
    if (!normalizedCategory || normalizedCategory.length < 3) return false;
    return bucket.normalizedLabel.includes(normalizedCategory) || normalizedCategory.includes(bucket.normalizedLabel);
  });
  if (exactByCategory) return exactByCategory.id;

  if (normalizedCategory.includes('food') || normalizedCategory.includes('drink')) {
    const groceryBucket = findBucketByKeywords(bucketDefs, [[ 'grocery' ], [ 'supermarket' ]]);
    if (groceryBucket && isGroceryLikeMerchant(normalizedMerchant, normalizedCategory)) {
      return groceryBucket.id;
    }

    const diningBucket = findBucketByKeywords(bucketDefs, [[ 'dining' ], [ 'restaurant' ]]);
    if (diningBucket) return diningBucket.id;
  }

  let bestRate = null;
  let bestScore = 0;

  bucketDefs.forEach((bucket) => {
    const tokens = bucket.normalizedLabel.split(' ').filter((token) => token.length > 3 && !['through', 'eligible', 'purchases', 'purchase', 'booked', 'directly', 'direct', 'other'].includes(token));
    const score = tokens.reduce((sum, token) => {
      const matchText = `${normalizedCategory} ${normalizedMerchant}`;
      return matchText.includes(token) ? sum + 1 : sum;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestRate = bucket;
    }
  });

  if (bestRate && bestScore > 0) return bestRate.id;
  return catchallRateId;
}

function parseCsvRowWithHeaderMap(rawHeader, cols) {
  const header = rawHeader.map((h) => normalizeText(h));
  const findIndex = (candidates) => header.findIndex((h) => candidates.some((candidate) => h.includes(candidate)));

  const dateIndex = findIndex(['date', 'posted', 'transaction date']);
  const merchantIndex = findIndex(['merchant', 'description', 'payee']);
  const typeIndex = findIndex(['type', 'transaction type']);
  const categoryIndex = findIndex(['category', 'mcc', 'group']);
  const amountIndex = findIndex(['amount', 'total', 'charge', 'debit']);

  return {
    date: dateIndex >= 0 ? cols[dateIndex] : '',
    merchant: merchantIndex >= 0 ? cols[merchantIndex] : '',
    type: typeIndex >= 0 ? cols[typeIndex] : '',
    category: categoryIndex >= 0 ? cols[categoryIndex] : '',
    amount: amountIndex >= 0 ? cols[amountIndex] : '',
    amountIndex,
  };
}

function parseTransactionType(rawType) {
  const normalizedType = normalizeText(rawType);
  if (!normalizedType) return 'sale';
  if (normalizedType.includes('payment')) return 'payment';
  if (normalizedType.includes('return') || normalizedType.includes('refund') || normalizedType.includes('reversal')) return 'return';
  if (normalizedType.includes('sale') || normalizedType.includes('purchase') || normalizedType.includes('debit')) return 'sale';
  if (normalizedType.includes('adjustment') || normalizedType.includes('fee')) return 'skip';
  return 'skip';
}

function applyStatementCsvToCard(card, csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return { appliedRows: 0, totalRows: 0 };

  ensureCardState(card);

  card.earnRates.forEach((rate) => {
    spendState[card.id][rate.id] = 0;
  });

  const rawHeader = parseCSVLine(lines[0]);
  const header = rawHeader.map((h) => normalizeText(h));
  const hasAmountColumn = header.some((h) => ['amount', 'total', 'charge', 'debit'].some((word) => h.includes(word)));
  if (!hasAmountColumn) return { appliedRows: 0, totalRows: lines.length - 1 };

  let appliedRows = 0;

  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCSVLine(lines[i]);
    const row = parseCsvRowWithHeaderMap(rawHeader, cols);

    if (row.amountIndex === -1) continue;

    const magnitude = Math.abs(Number(String(row.amount || '').replace(/[$,]/g, '')));
    if (!Number.isFinite(magnitude) || magnitude === 0) continue;

    const txnType = parseTransactionType(row.type);
    if (txnType === 'payment') continue;
    if (txnType === 'skip') continue;

    const bucketId = resolveRateForCategory(card, row.category, row.merchant) || findOtherRateId(card);
    const signedAmount = txnType === 'return' ? -magnitude : magnitude;

    spendState[card.id][bucketId] = (Number(spendState[card.id][bucketId]) || 0) + signedAmount;
    appliedRows += 1;

    console.log(`[statement-import] ${txnType} | ${normalizeMerchantName(row.merchant) || 'unknown merchant'} | ${row.category || 'uncategorized'} | ${magnitude.toFixed(2)} | ${bucketId}`);
  }

  return { appliedRows, totalRows: lines.length - 1 };
}

async function handleStatementUpload(event) {
  const file = event.target.files?.[0];
  if (!file || !statementUploadStatusEl) return;

  const cardId = statementCardSelectEl?.value;
  const card = CARD_PRESETS.find((item) => item.id === cardId);
  if (!card) {
    statementUploadStatusEl.textContent = 'Select a target card before uploading.';
    return;
  }

  ensureCardState(card);

  if (file.type.includes('image') || file.type === 'application/pdf') {
    statementUploadStatusEl.textContent = `Uploaded ${file.name}. Screenshot/PDF OCR parsing is the next step; CSV is supported now.`;
    event.target.value = '';
    return;
  }

  const textValue = await file.text();
  const { appliedRows, totalRows } = applyStatementCsvToCard(card, textValue);

  if (!totalRows) {
    statementUploadStatusEl.textContent = `Uploaded ${file.name}, but no transaction rows were found.`;
  } else if (!appliedRows) {
    statementUploadStatusEl.textContent = `Uploaded ${file.name}, but columns were not recognized. Include Amount + Category/Description columns.`;
  } else {
    statementUploadStatusEl.textContent = `Applied ${appliedRows}/${totalRows} rows from ${file.name} to ${card.name} spend categories.`;
  }

  renderAll();
  event.target.value = '';
}

function renderAll() {
  const cards = CARD_PRESETS.filter((card) => selectedCards.has(card.id));
  renderChart(cards);
  if (cards.length) renderBenefitPanels(cards);
}

if (statementUploadEl) {
  statementUploadEl.addEventListener('change', handleStatementUpload);
}

if (addCardsBtnEl) addCardsBtnEl.addEventListener('click', openCardPicker);
if (closeCardPickerEl) closeCardPickerEl.addEventListener('click', closeCardPicker);

renderPresets();
renderAll();
