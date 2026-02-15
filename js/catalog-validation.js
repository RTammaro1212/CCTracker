window.validateCardCatalog = function validateCardCatalog(catalog) {
  const errors = [];

  if (!Array.isArray(catalog)) {
    return ['Card catalog is not an array.'];
  }

  catalog.forEach((card, index) => {
    if (!card || typeof card !== 'object') {
      errors.push(`Card at index ${index} is not an object.`);
      return;
    }

    if (!card.id) errors.push(`Card at index ${index} is missing id.`);
    if (typeof card.annualFee !== 'number') errors.push(`Card ${card.id || index} has invalid annualFee.`);
    if (!Array.isArray(card.benefits)) errors.push(`Card ${card.id || index} has invalid benefits array.`);
    if (!Array.isArray(card.earnRates)) errors.push(`Card ${card.id || index} has invalid earnRates array.`);

    if (Array.isArray(card.earnRates)) {
      card.earnRates.forEach((rate, rateIndex) => {
        if (!rate.id || typeof rate.multiplier !== 'number') {
          errors.push(`Card ${card.id || index} earnRate at index ${rateIndex} is invalid.`);
        }
      });
    }
  });

  return errors;
};
