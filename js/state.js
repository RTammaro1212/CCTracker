const APP_STATE_KEY = 'cardcompare.v1.state';

window.loadAppState = function loadAppState() {
  try {
    const raw = window.localStorage.getItem(APP_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch (error) {
    console.warn('Failed to load saved state:', error);
    return null;
  }
};

window.saveAppState = function saveAppState(nextState) {
  try {
    window.localStorage.setItem(APP_STATE_KEY, JSON.stringify(nextState));
  } catch (error) {
    console.warn('Failed to persist state:', error);
  }
};
