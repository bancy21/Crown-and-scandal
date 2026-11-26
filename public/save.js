(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  const STORAGE_KEY = 'crown_scandal_save_v1';
  let autoSaveTimer = 0;

  function defaultWorldState() {
    return {
      zone: 'Versailles Courtyard',
      day: 1,
      hour: 10.5,
      playerPos: { x: 0, y: 0, z: 15 },
      playerYaw: Math.PI * 0.88,
      cameraYaw: 0,
      cameraPitch: 0.4,
      cameraDist: 8.6,
      cameraMode: 'follow',
      timeScale: 1,
      season: 'spring',
      seasonOverride: null,
      securityMode: 'royal',
      hostedEventsCount: 0,
    };
  }

  function ensureStateDefaults() {
    const g = window.CrownGame;
    if (!g.household) g.household = { houseName: '', homeland: '', allowance: 0 };
    if (!Array.isArray(g.roster)) g.roster = [];
    if (!g.needs) {
      g.needs = {
        hunger: 92,
        energy: 95,
        hygiene: 96,
        fun: 88,
        composure: 94,
        mood: 'Poised',
      };
    }
    if (!g.reputation) {
      g.reputation = {
        clout: 50,
        scandal: 0,
        rank: 'Crown Heiress',
        queenMotherFavour: 60,
      };
    }
    if (!g.dynasty) g.dynasty = { members: [], alliances: [] };
    if (!g.structures) g.structures = { customBuildings: [], routes: [] };
    if (!g.world) {
      g.world = defaultWorldState();
    } else {
      const def = defaultWorldState();
      g.world = Object.assign({}, def, g.world);
      if (!g.world.playerPos || typeof g.world.playerPos.x !== 'number') {
        g.world.playerPos = Object.assign({}, def.playerPos);
      }
    }
    if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
    if (!Array.isArray(g.ownedProperties) || !g.ownedProperties.length) {
      g.ownedProperties = ['palace'];
    } else if (g.ownedProperties.indexOf('palace') === -1) {
      g.ownedProperties.unshift('palace');
    }
    if (!g.homePropertyId || g.ownedProperties.indexOf(g.homePropertyId) === -1) {
      g.homePropertyId = 'palace';
    }
    return g;
  }

  function buildPayload() {
    const g = ensureStateDefaults();
    return {
      version: g.version || '0.1.0',
      savedAt: Date.now(),
      household: g.household,
      princess: g.princess || null,
      roster: g.roster || [],
      needs: g.needs,
      money: Number(g.money || 0),
      reputation: g.reputation,
      dynasty: g.dynasty,
      structures: g.structures,
      ownedProperties: g.ownedProperties,
      homePropertyId: g.homePropertyId,
      world: g.world,
      gossipLog: (g.gossipLog || []).slice(0, 24),
    };
  }

  function save(silent) {
    try {
      const g = ensureStateDefaults();
      if (g.household && g.household.houseName) {
        g.saveExists = true;
      }
      const payload = buildPayload();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      if (window.CrownMenu && typeof window.CrownMenu.refreshSummary === 'function') {
        window.CrownMenu.refreshSummary();
      }
      if (!silent && typeof g.toast === 'function') {
        g.toast('Dynasty saved');
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        ensureStateDefaults();
        return false;
      }
      const data = JSON.parse(raw);
      const g = window.CrownGame;
      if (data.household) g.household = data.household;
      if (data.princess) g.princess = data.princess;
      if (Array.isArray(data.roster)) g.roster = data.roster;
      if (data.needs) g.needs = Object.assign({}, g.needs || {}, data.needs);
      if (typeof data.money === 'number') g.money = data.money;
      if (data.reputation) g.reputation = Object.assign({}, g.reputation || {}, data.reputation);
      if (data.dynasty) g.dynasty = Object.assign({}, g.dynasty || {}, data.dynasty);
      if (data.structures) g.structures = Object.assign({}, g.structures || {}, data.structures);
      if (Array.isArray(data.ownedProperties)) g.ownedProperties = data.ownedProperties;
      if (typeof data.homePropertyId === 'string') g.homePropertyId = data.homePropertyId;
      if (data.world) g.world = Object.assign(defaultWorldState(), data.world);
      if (Array.isArray(data.gossipLog)) g.gossipLog = data.gossipLog;
      g.saveExists = Boolean(g.household && g.household.houseName);
      ensureStateDefaults();
      return g.saveExists;
    } catch (_) {
      ensureStateDefaults();
      return false;
    }
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    const g = window.CrownGame;
    g.saveExists = false;
    g.household = { houseName: '', homeland: '', allowance: 0 };
    g.princess = null;
    g.roster = [];
    g.money = 0;
    g.ownedProperties = ['palace'];
    g.homePropertyId = 'palace';
    g.world = defaultWorldState();
    g.gossipLog = [];
    ensureStateDefaults();
    if (window.CrownMenu && typeof window.CrownMenu.refreshSummary === 'function') {
      window.CrownMenu.refreshSummary();
    }
  }

  function formatCrowns(amount) {
    return '₡' + Math.round(Number(amount || 0)).toLocaleString('en-US');
  }

  function grantAllowanceIfNewWeek(prevDay, nextDay) {
    const g = ensureStateDefaults();
    const prevWeek = Math.floor((prevDay - 1) / 7);
    const nextWeek = Math.floor((nextDay - 1) / 7);
    if (nextWeek > prevWeek && g.household && g.household.allowance > 0) {
      g.money = Number(g.money || 0) + Number(g.household.allowance);
      if (typeof g.toast === 'function') {
        g.toast('Weekly Royal Allowance: +' + formatCrowns(g.household.allowance));
      }
      save(true);
    }
  }

  function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(function () {
      if (window.CrownGame && window.CrownGame.saveExists) {
        save(true);
      }
    }, 20000);
  }

  ensureStateDefaults();
  load();
  startAutoSave();

  window.addEventListener('pagehide', function () {
    if (window.CrownGame && window.CrownGame.saveExists) {
      save(true);
    }
  });

  window.CrownSave = {
    STORAGE_KEY: STORAGE_KEY,
    defaultWorldState: defaultWorldState,
    ensureStateDefaults: ensureStateDefaults,
    save: save,
    load: load,
    reset: reset,
    formatCrowns: formatCrowns,
    grantAllowanceIfNewWeek: grantAllowanceIfNewWeek,
  };
})();
