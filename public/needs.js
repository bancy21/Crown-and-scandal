(function () {
  'use strict';

  const KEYS = ['hunger', 'energy', 'hygiene', 'fun', 'composure'];

  function clampNeed(v) {
    return Math.max(0, Math.min(100, Number(v) || 0));
  }

  function ensureNeeds(game) {
    const g = game || window.CrownGame;
    if (!g) return null;
    if (!g.needs) {
      g.needs = {
        hunger: 100,
        energy: 100,
        hygiene: 100,
        fun: 100,
        composure: 100,
        mood: 'Poised',
      };
    }
    KEYS.forEach(function (k) {
      if (typeof g.needs[k] !== 'number' || Number.isNaN(g.needs[k])) {
        g.needs[k] = 90;
      }
      g.needs[k] = clampNeed(g.needs[k]);
    });
    g.needs.mood = computeMood(g.needs);
    return g.needs;
  }

  function computeMood(n) {
    if (!n) return 'Poised';
    const lowest = Math.min(n.hunger, n.energy, n.hygiene, n.fun, n.composure);
    const avg = (n.hunger + n.energy + n.hygiene + n.fun + n.composure) / 5;

    if (n.energy < 20) return 'Exhausted';
    if (n.hunger < 22) return 'Famished';
    if (n.hygiene < 22) return 'Tousled';
    if (n.energy < 40) return 'Drowsy';
    if (n.hunger < 42) return 'Peckish';
    if (n.fun < 35) return 'Bored';
    if (avg >= 88 && lowest >= 75) return 'Radiant';
    if (n.composure >= 85 && avg >= 72) return 'Poised';
    return 'Serene';
  }

  function tick(deltaSec, activeActivity, game) {
    const g = game || window.CrownGame;
    const n = ensureNeeds(g);
    if (!n) return null;

    const dt = Math.min(Math.max(deltaSec || 0.016, 0), 0.25);
    const scale = (g.world && g.world.timeScale) || 1;

    // Gentle passive life-sim drain when walking or idling
    n.hunger = clampNeed(n.hunger - dt * 0.22 * scale);
    n.energy = clampNeed(n.energy - dt * 0.18 * scale);
    n.hygiene = clampNeed(n.hygiene - dt * 0.12 * scale);
    n.fun = clampNeed(n.fun - dt * 0.14 * scale);
    n.composure = clampNeed(n.composure - dt * 0.08 * scale);

    // Active continuous restoration while performing a physical animation (sleep, soak, eat, dance...)
    if (activeActivity && activeActivity.rates) {
      const rates = activeActivity.rates;
      KEYS.forEach(function (k) {
        if (typeof rates[k] === 'number' && rates[k] !== 0) {
          n[k] = clampNeed(n[k] + dt * rates[k]);
        }
      });
    }

    n.mood = computeMood(n);
    return n;
  }

  function applyBoost(deltas, game) {
    const g = game || window.CrownGame;
    const n = ensureNeeds(g);
    if (!n || !deltas) return n;
    KEYS.forEach(function (k) {
      if (typeof deltas[k] === 'number') {
        n[k] = clampNeed(n[k] + deltas[k]);
      }
    });
    n.mood = computeMood(n);
    return n;
  }

  window.CrownNeeds = {
    ensureNeeds: ensureNeeds,
    computeMood: computeMood,
    tick: tick,
    applyBoost: applyBoost,
  };
})();
