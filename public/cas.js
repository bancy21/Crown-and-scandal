(function () {
  'use strict';

  if (!window.CrownGame || !window.CrownScreens || !window.CrownBodies || !window.CrownLooks) {
    return;
  }

  const STORAGE_SAVE_KEY = 'crown_scandal_save_v1';

  const ROYAL_TRAITS = [
    { id: 'poised', label: 'Ice Poise', desc: 'Composure drops slower under paparazzi pressure' },
    { id: 'schemer', label: 'Velvet Schemer', desc: 'Rumor & frame plots gain higher intrigue success' },
    { id: 'charmer', label: 'Salon Charmer', desc: 'Faster friendships & higher Queen Mother favour' },
    { id: 'rebel', label: 'Riviera Rebel', desc: 'Thrives on scandal & bold coastal escapes' },
    { id: 'patron', label: 'Arts Patron', desc: 'Bonus clout at galas, opera & royal balls' },
    { id: 'vigilant', label: 'Sharp-Eyed', desc: 'Easier to spot palace spies & bribed guards' },
  ];

  const VOICE_TONES = [
    { id: 'velvet', label: 'Velvet Alto' },
    { id: 'aristocrat', label: 'Crisp Soprano' },
    { id: 'warm', label: 'Warm Riviera' },
  ];

  if (!document.getElementById('crown-cas-styles')) {
    const style = document.createElement('style');
    style.id = 'crown-cas-styles';
    style.textContent = `
      .cas-shell {
        width: 100%;
        max-width: 1060px;
        height: calc(100vh - 82px);
        max-height: none;
      }

      .cas-shell .screen-panel-head {
        padding: 8px 12px;
      }

      .cas-shell .screen-panel-title {
        font-size: 20px;
      }

      .cas-body {
        padding: 0;
        gap: 0;
        flex: 1;
        min-height: 0;
        display: grid;
        grid-template-columns: 45% 55%;
        overflow: hidden;
      }

      @media (min-width: 720px) {
        .cas-body {
          grid-template-columns: 48% 52%;
        }
      }

      /* LEFT SIDE: Full-Height Sims 4 CAS Character Studio */
      .cas-stage {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 0;
        background: #d8c2aa;
        border-right: 1px solid var(--border-hairline);
        overflow: hidden;
      }

      .cas-canvas {
        width: 100%;
        height: 100%;
        display: block;
      }

      .cas-top-pill {
        position: absolute;
        top: 8px;
        left: 8px;
        right: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 4px;
        pointer-events: none;
      }

      .cas-name-badge {
        pointer-events: auto;
        padding: 5px 9px;
        border-radius: 10px;
        background: rgba(36, 25, 32, 0.74);
        border: 1px solid rgba(212, 175, 85, 0.35);
        color: #fff8ee;
        font-size: 11px;
        font-weight: 600;
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }

      /* Floating vertical tool rail on right edge of character stage (Sims 4 style) */
      .cas-rail {
        position: absolute;
        top: 44px;
        right: 6px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .cas-mini-btn {
        min-height: 32px;
        padding: 4px 8px;
        border-radius: 10px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 250, 246, 0.9);
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(30, 18, 22, 0.14);
      }

      .cas-mini-btn.active {
        background: var(--gold);
        border-color: #9f7328;
        color: #fffdf9;
      }

      /* Bottom-Left Household Portrait Strip */
      .cas-hh-bar {
        position: absolute;
        left: 6px;
        right: 6px;
        bottom: 6px;
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 5px;
        border-radius: 14px;
        background: rgba(32, 22, 28, 0.72);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(212, 175, 85, 0.35);
      }

      .cas-hh-scroll {
        display: flex;
        align-items: center;
        gap: 5px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        flex: 1;
        min-width: 0;
      }

      .cas-hh-scroll::-webkit-scrollbar {
        display: none;
      }

      .cas-hh-slot {
        position: relative;
        width: 38px;
        height: 42px;
        border-radius: 9px;
        border: 2px solid rgba(255, 248, 236, 0.3);
        background: #efe1cf;
        padding: 0;
        overflow: hidden;
        cursor: pointer;
        flex-shrink: 0;
      }

      .cas-hh-slot.active {
        border-color: #f3cd69;
        box-shadow: 0 0 0 2px rgba(243, 205, 105, 0.35);
      }

      .cas-hh-slot canvas {
        width: 100%;
        height: 100%;
        display: block;
      }

      .cas-hh-add,
      .cas-hh-arrow {
        width: 28px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid rgba(212, 175, 85, 0.45);
        background: rgba(255, 250, 244, 0.9);
        color: var(--ink-primary);
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        flex-shrink: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      /* RIGHT SIDE: Category Drawer & Multi-Column Catalog */
      .cas-drawer {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
        background: rgba(255, 251, 247, 0.9);
      }

      .cas-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px 8px 6px;
        border-bottom: 1px solid rgba(184, 137, 56, 0.22);
        background: rgba(250, 242, 234, 0.85);
        flex-shrink: 0;
      }

      .cas-tab {
        min-height: 32px;
        padding: 4px 8px;
        border-radius: 9px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 255, 255, 0.85);
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
      }

      .cas-tab.active {
        background: var(--gold);
        border-color: #9f7328;
        color: #fffdf9;
      }

      .cas-pane {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        padding: 10px 8px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .cas-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
      }

      @media (min-width: 720px) {
        .cas-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      .cas-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
      }

      .cas-choice {
        min-height: 40px;
        padding: 6px 8px;
        border-radius: 10px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 255, 255, 0.85);
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        text-align: left;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 2px;
      }

      .cas-choice.active {
        background: #fff6e4;
        border-color: var(--gold);
        box-shadow: 0 2px 8px rgba(184, 137, 56, 0.18);
      }

      .cas-choice-sub {
        font-size: 10px;
        font-weight: 400;
        line-height: 1.25;
        color: var(--ink-muted);
      }

      .cas-swatch-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .cas-swatch {
        min-height: 34px;
        padding: 4px 8px;
        border-radius: 10px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 255, 255, 0.85);
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
      }

      .cas-swatch.active {
        border-color: var(--gold);
        background: #fff6e4;
      }

      .cas-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.18);
        flex-shrink: 0;
      }

      .cas-slider-row {
        display: flex;
        flex-direction: column;
        gap: 3px;
        padding: 6px 8px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.72);
        border: 1px solid rgba(184, 137, 56, 0.22);
      }

      .cas-slider-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
        font-weight: 600;
        color: var(--ink-primary);
        font-variant-numeric: tabular-nums;
      }

      .cas-range {
        width: 100%;
        height: 24px;
        accent-color: var(--gold);
        cursor: pointer;
      }

      .cas-color-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 6px;
      }

      .cas-color-box {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 6px;
        border-radius: 10px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 255, 255, 0.8);
        font-size: 10px;
        font-weight: 600;
        color: var(--ink-primary);
      }

      .cas-color-input {
        width: 100%;
        height: 28px;
        border: none;
        border-radius: 6px;
        background: transparent;
        padding: 0;
        cursor: pointer;
      }

      .cas-foot-row {
        display: flex;
        gap: 8px;
        width: 100%;
      }

      .cas-foot-back {
        width: auto;
        min-width: 80px;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  function createDefaultPrincess(existing) {
    const B = window.CrownBodies;
    const L = window.CrownLooks;
    const W = window.CrownWardrobe;
    const A = window.CrownAccessories;
    const base = existing || {};
    const houseName = (window.CrownGame.household && window.CrownGame.household.houseName) || 'Valois';

    return {
      firstName: base.firstName || 'Camille',
      title: base.title || 'Crown Princess',
      fullName: (base.firstName || 'Camille') + ' of ' + houseName,
      voice: base.voice || 'velvet',
      traits: Array.isArray(base.traits) && base.traits.length ? base.traits.slice(0, 3) : ['poised', 'charmer'],
      body: B.clampBody(base.body || B.createDefaultBody('hourglass')),
      look: L.clampLook(base.look || L.createDefaultLook()),
      wardrobe: W ? W.clampWardrobe(base.wardrobe || W.createDefaultWardrobe()) : base.wardrobe || null,
      accessories: A ? A.clampAccessories(base.accessories || A.createDefaultAccessories()) : base.accessories || null,
    };
  }

  function buildCharacterRoster(existingPrincess) {
    const B = window.CrownBodies;
    const L = window.CrownLooks;
    const W = window.CrownWardrobe;
    const A = window.CrownAccessories;

    const presets = [
      {
        firstName: 'Camille',
        title: 'Crown Princess',
        voice: 'velvet',
        traits: ['poised', 'charmer'],
        body: B.createDefaultBody('hourglass'),
        look: L.createDefaultLook(),
        wardrobe: W ? W.clampWardrobe({ outfitId: 'versailles-ivory-gown', themeId: 'signature' }) : null,
        accessories: A ? A.clampAccessories({ crown: 'sapphire-sovereign', earrings: 'sapphire-drops', necklace: 'sapphire-pendant', shoes: 'royal-pumps' }) : null,
      },
      {
        firstName: 'Celestine',
        title: 'Princess',
        voice: 'aristocrat',
        traits: ['patron', 'charmer'],
        body: B.createDefaultBody('pear'),
        look: L.clampLook({
          skinToneId: 'porcelain',
          eyeColorId: 'ice',
          eyeColorHex: '#71aad1',
          pupilShape: 'round',
          hairStyle: 'mermaid-curls',
          hairPresetId: 'honey-caramel',
          hairRootHex: '#7b5835',
          hairTipHex: '#e3c083',
          hairHighlightHex: '#fff0c9',
          eyeshadow: 'champagne',
          lipstick: 'petal-pink',
        }),
        wardrobe: W ? W.clampWardrobe({ outfitId: 'riviera-sky-gown', themeId: 'signature' }) : null,
        accessories: A ? A.clampAccessories({ crown: 'pearl-diadem', earrings: 'pearl-studs', necklace: 'layered-pearls', shoes: 'ivory-slippers' }) : null,
      },
      {
        firstName: 'Valentina',
        title: 'Grand Duchess',
        voice: 'velvet',
        traits: ['schemer', 'vigilant'],
        body: B.createDefaultBody('apple'),
        look: L.clampLook({
          skinToneId: 'warm-olive',
          eyeColorId: 'garnet',
          eyeColorHex: '#8f293b',
          pupilShape: 'feline-slit',
          eyeDepth: 0.78,
          hairStyle: 'braided-crown',
          hairPresetId: 'chestnut',
          hairRootHex: '#3a2016',
          hairTipHex: '#633b27',
          hairHighlightHex: '#9c6848',
          eyeshadow: 'bronze-smoke',
          lipstick: 'crimson-velvet',
        }),
        wardrobe: W ? W.clampWardrobe({ outfitId: 'imperial-gold-crimson', themeId: 'signature' }) : null,
        accessories: A ? A.clampAccessories({ crown: 'imperial-filigree', earrings: 'gold-chandelier', necklace: 'diamond-choker', shoes: 'strappy-heels' }) : null,
      },
      {
        firstName: 'Marguerite',
        title: 'Lady',
        voice: 'warm',
        traits: ['rebel', 'patron'],
        body: B.createDefaultBody('rectangle'),
        look: L.clampLook({
          skinToneId: 'caramel',
          eyeColorId: 'emerald',
          eyeColorHex: '#347a5e',
          pupilShape: 'almond-soft',
          hairStyle: 'riviera-bob',
          hairPresetId: 'raven-noir',
          hairRootHex: '#19151c',
          hairTipHex: '#2f2836',
          hairHighlightHex: '#5d536b',
          eyeshadow: 'plum-velvet',
          lipstick: 'mocha-satin',
        }),
        wardrobe: W ? W.clampWardrobe({ outfitId: 'parisian-trench-chic', themeId: 'signature' }) : null,
        accessories: A ? A.clampAccessories({ crown: 'none', earrings: 'diamond-hoops', necklace: 'gold-medallion', eyewear: 'cat-eye-sun', shoes: 'strappy-heels' }) : null,
      },
      {
        firstName: 'Genevieve',
        title: 'Archduchess',
        voice: 'warm',
        traits: ['poised', 'rebel'],
        body: B.createDefaultBody('spoon'),
        look: L.clampLook({
          skinToneId: 'chestnut',
          eyeColorId: 'amber',
          eyeColorHex: '#a86426',
          pupilShape: 'dilated',
          hairStyle: 'hollywood-blowout',
          hairPresetId: 'burgundy',
          hairRootHex: '#3c1622',
          hairTipHex: '#822741',
          hairHighlightHex: '#b84c6a',
          eyeshadow: 'rose-gold',
          lipstick: 'burgundy-wine',
        }),
        wardrobe: W ? W.clampWardrobe({ outfitId: 'silk-robe-pajamas', themeId: 'signature' }) : null,
        accessories: A ? A.clampAccessories({ crown: 'diamond-halo', earrings: 'pearl-studs', necklace: 'none', shoes: 'satin-mules' }) : null,
      },
    ];

    const roster = presets.map(function (p) {
      return createDefaultPrincess(p);
    });

    if (existingPrincess && existingPrincess.firstName) {
      const idx = roster.findIndex(function (r) {
        return r.firstName === existingPrincess.firstName;
      });
      if (idx !== -1) {
        roster[idx] = createDefaultPrincess(existingPrincess);
      } else {
        roster.unshift(createDefaultPrincess(existingPrincess));
      }
    }
    return roster;
  }

  function persistPrincess(princess, roster) {
    try {
      const g = window.CrownGame;
      const houseName = (g.household && g.household.houseName) || 'Valois';
      princess.fullName = princess.firstName + ' of ' + houseName;
      g.princess = princess;
      if (Array.isArray(roster)) {
        g.roster = roster;
      }
      g.saveExists = true;

      if (g.dynasty && Array.isArray(g.dynasty.members)) {
        const heir = g.dynasty.members.find(function (m) {
          return m.id === 'player-heir';
        });
        if (heir) {
          heir.name = princess.title + ' ' + princess.firstName + ' of ' + houseName;
        }
      }

      const payload = {
        version: g.version,
        household: g.household,
        princess: g.princess,
        roster: g.roster || [],
        needs: g.needs,
        money: g.money,
        reputation: g.reputation,
        dynasty: g.dynasty,
        structures: g.structures,
      };
      localStorage.setItem(STORAGE_SAVE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Renders a crisp miniature portrait thumbnail for the Sims 4–style bottom-left Household Bar.
   */
  function renderPortraitThumb(canvas, character) {
    const B = window.CrownBodies;
    const L = window.CrownLooks;
    if (!canvas || !character) return;
    const w = 76;
    const h = 84;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#efe1cf');
    bg.addColorStop(1, '#c9b198');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const unitScale = h * 1.95;
    const probeRig = B.computeRig(character.body, w * 0.5, 0, unitScale);
    const baseY = h * 0.44 - probeRig.joints.headCenter.y;
    const rig = B.computeRig(character.body, w * 0.5, baseY, unitScale);
    const skinPalette = L.getSkinPalette(character.look);

    L.drawHairBack(ctx, rig, character.look);
    B.drawBaseBody(ctx, rig, skinPalette);
    if (window.CrownWardrobe && typeof window.CrownWardrobe.drawOutfit === 'function') {
      window.CrownWardrobe.drawOutfit(ctx, rig, character.wardrobe, character.look);
    }
    L.drawHeadAndFace(ctx, rig, character.look, { blink: false });
    L.drawHairFront(ctx, rig, character.look);
    if (window.CrownAccessories && typeof window.CrownAccessories.drawAccessories === 'function') {
      window.CrownAccessories.drawAccessories(ctx, rig, character.accessories);
    }
  }

  window.CrownScreens.creator = {
    render: function (_opts, createFrame) {
      const g = window.CrownGame;
      const B = window.CrownBodies;
      const L = window.CrownLooks;

      const roster =
        Array.isArray(g.roster) && g.roster.length
          ? g.roster.map(function (item) {
              return createDefaultPrincess(item);
            })
          : buildCharacterRoster(g.princess);

      let charIndex = 0;
      if (g.princess && g.princess.firstName) {
        const found = roster.findIndex(function (r) {
          return r.firstName === g.princess.firstName;
        });
        if (found !== -1) charIndex = found;
      }

      let draft = roster[charIndex];
      let activeTab = 'body';
      let hairCategory = 'all';
      let zoomMode = 'full'; // Default to Full Body standing beside the drawer like Sims 4 CAS!
      let bodyEvalUndergarments = false;

      const frame = createFrame('creator', null);
      frame.panel.classList.add('cas-shell');
      frame.body.classList.add('cas-body');

      // -----------------------------------------------------------
      // LEFT COLUMN: Full-Height Sims 4 Character Studio
      // -----------------------------------------------------------
      const stage = document.createElement('div');
      stage.className = 'cas-stage';

      const canvas = document.createElement('canvas');
      canvas.className = 'cas-canvas';
      stage.appendChild(canvas);

      const topPill = document.createElement('div');
      topPill.className = 'cas-top-pill';

      const nameBadge = document.createElement('button');
      nameBadge.type = 'button';
      nameBadge.className = 'cas-name-badge';
      topPill.appendChild(nameBadge);
      stage.appendChild(topPill);

      // Floating vertical tool rail on right edge of stage
      const rail = document.createElement('div');
      rail.className = 'cas-rail';

      const btnZoomFull = document.createElement('button');
      btnZoomFull.type = 'button';
      btnZoomFull.className = 'cas-mini-btn active';
      btnZoomFull.textContent = 'Full';

      const btnZoomPortrait = document.createElement('button');
      btnZoomPortrait.type = 'button';
      btnZoomPortrait.className = 'cas-mini-btn';
      btnZoomPortrait.textContent = 'Bust';

      const btnZoomFace = document.createElement('button');
      btnZoomFace.type = 'button';
      btnZoomFace.className = 'cas-mini-btn';
      btnZoomFace.textContent = 'Face';

      const btnEvalBody = document.createElement('button');
      btnEvalBody.type = 'button';
      btnEvalBody.className = 'cas-mini-btn';
      btnEvalBody.textContent = 'Bra';
      btnEvalBody.title = 'Toggle Bra & Panties to inspect body shape';

      const btnRand = document.createElement('button');
      btnRand.type = 'button';
      btnRand.className = 'cas-mini-btn';
      btnRand.textContent = 'Rand';

      rail.appendChild(btnZoomFull);
      rail.appendChild(btnZoomPortrait);
      rail.appendChild(btnZoomFace);
      rail.appendChild(btnEvalBody);
      rail.appendChild(btnRand);
      stage.appendChild(rail);

      // Bottom-Left Household Portrait Strip (see every character in your household!)
      const hhBar = document.createElement('div');
      hhBar.className = 'cas-hh-bar';

      const btnPrevChar = document.createElement('button');
      btnPrevChar.type = 'button';
      btnPrevChar.className = 'cas-hh-arrow';
      btnPrevChar.innerHTML = '&#8249;';
      btnPrevChar.setAttribute('aria-label', 'Previous household character');

      const hhScroll = document.createElement('div');
      hhScroll.className = 'cas-hh-scroll';

      const btnNextChar = document.createElement('button');
      btnNextChar.type = 'button';
      btnNextChar.className = 'cas-hh-arrow';
      btnNextChar.innerHTML = '&#8250;';
      btnNextChar.setAttribute('aria-label', 'Next household character');

      const btnAddChar = document.createElement('button');
      btnAddChar.type = 'button';
      btnAddChar.className = 'cas-hh-add';
      btnAddChar.textContent = '+';
      btnAddChar.title = 'Add another royal character to household';

      hhBar.appendChild(btnPrevChar);
      hhBar.appendChild(hhScroll);
      hhBar.appendChild(btnNextChar);
      hhBar.appendChild(btnAddChar);
      stage.appendChild(hhBar);

      // -----------------------------------------------------------
      // RIGHT COLUMN: Single-Side Multi-Column Catalog & Sliders
      // -----------------------------------------------------------
      const drawer = document.createElement('div');
      drawer.className = 'cas-drawer';

      const tabs = [
        { id: 'body', label: 'Body' },
        { id: 'face', label: 'Face' },
        { id: 'eyes', label: 'Eyes' },
        { id: 'hair', label: 'Hair' },
        { id: 'skin', label: 'Skin' },
        { id: 'wardrobe', label: 'Clothes' },
        { id: 'accessories', label: 'Jewels' },
        { id: 'identity', label: 'Info' },
      ];

      const tabRow = document.createElement('div');
      tabRow.className = 'cas-tabs';
      const paneHost = document.createElement('div');
      paneHost.className = 'cas-pane';

      drawer.appendChild(tabRow);
      drawer.appendChild(paneHost);

      frame.body.appendChild(stage);
      frame.body.appendChild(drawer);

      function syncTopBadge() {
        const houseName = (g.household && g.household.houseName) || 'Valois';
        nameBadge.textContent = draft.firstName + ' ' + houseName + ' · ' + (charIndex + 1) + '/' + roster.length;
      }

      function renderHouseholdStrip() {
        hhScroll.innerHTML = '';
        roster.forEach(function (member, idx) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cas-hh-slot' + (idx === charIndex ? ' active' : '');
          btn.title = member.title + ' ' + member.firstName;
          const thumb = document.createElement('canvas');
          renderPortraitThumb(thumb, member);
          btn.appendChild(thumb);
          btn.addEventListener('click', function () {
            if (idx === charIndex) return;
            roster[charIndex] = draft;
            charIndex = idx;
            draft = roster[charIndex];
            syncTopBadge();
            renderHouseholdStrip();
            renderPane();
          });
          hhScroll.appendChild(btn);
        });
      }

      let thumbRefreshTimer = 0;
      function scheduleThumbRefresh() {
        if (thumbRefreshTimer) clearTimeout(thumbRefreshTimer);
        thumbRefreshTimer = setTimeout(function () {
          const activeSlot = hhScroll.children[charIndex];
          const thumbCanvas = activeSlot && activeSlot.querySelector('canvas');
          if (thumbCanvas) renderPortraitThumb(thumbCanvas, draft);
        }, 90);
      }

      function switchCharacter(delta) {
        roster[charIndex] = draft;
        charIndex = (charIndex + delta + roster.length) % roster.length;
        draft = roster[charIndex];
        syncTopBadge();
        renderHouseholdStrip();
        renderPane();
      }

      btnPrevChar.addEventListener('click', function () {
        switchCharacter(-1);
      });

      btnNextChar.addEventListener('click', function () {
        switchCharacter(1);
      });

      btnAddChar.addEventListener('click', function () {
        if (roster.length >= 8) {
          g.toast('Household supports up to 8 members.');
          return;
        }
        roster[charIndex] = draft;
        const royalNames = ['Clarisse', 'Seraphina', 'Beatrix', 'Isolde', 'Aurelia', 'Helena', 'Juliette'];
        const chosenName = royalNames[roster.length % royalNames.length];
        const randomBody = pickRandom(B.BODY_TYPES);
        const skin = pickRandom(L.SKIN_TONES);
        const hairCol = pickRandom(L.HAIR_COLOR_PRESETS);
        const eyeCol = pickRandom(L.EYE_COLORS);

        const newMember = createDefaultPrincess({
          firstName: chosenName,
          title: 'Princess',
          body: B.createDefaultBody(randomBody.id),
          look: L.clampLook({
            skinToneId: skin.id,
            undertone: skin.undertone,
            eyeColorId: eyeCol.id,
            eyeColorHex: eyeCol.hex,
            pupilShape: pickRandom(L.PUPIL_SHAPES).id,
            hairStyle: pickRandom(L.HAIR_STYLES).id,
            hairPresetId: hairCol.id,
            hairRootHex: hairCol.root,
            hairTipHex: hairCol.tip,
            hairHighlightHex: hairCol.highlight,
          }),
        });
        roster.push(newMember);
        charIndex = roster.length - 1;
        draft = roster[charIndex];
        syncTopBadge();
        renderHouseholdStrip();
        renderPane();
        g.toast(chosenName + ' added to household!');
      });

      nameBadge.addEventListener('click', function () {
        activeTab = 'identity';
        syncTabActive();
        renderPane();
      });

      function syncZoomButtons() {
        btnZoomFull.classList.toggle('active', zoomMode === 'full');
        btnZoomPortrait.classList.toggle('active', zoomMode === 'portrait');
        btnZoomFace.classList.toggle('active', zoomMode === 'face');
        btnEvalBody.classList.toggle('active', bodyEvalUndergarments);
      }

      btnZoomFull.addEventListener('click', function () {
        zoomMode = 'full';
        syncZoomButtons();
      });

      btnZoomPortrait.addEventListener('click', function () {
        zoomMode = 'portrait';
        syncZoomButtons();
      });

      btnZoomFace.addEventListener('click', function () {
        zoomMode = 'face';
        syncZoomButtons();
      });

      btnEvalBody.addEventListener('click', function () {
        bodyEvalUndergarments = !bodyEvalUndergarments;
        syncZoomButtons();
        if (activeTab === 'body') renderPane();
      });

      btnRand.addEventListener('click', function () {
        const presetBody = pickRandom(B.BODY_TYPES);
        draft.body = B.createDefaultBody(presetBody.id);
        draft.body.ageLook = pickRandom(B.AGE_LOOKS).id;

        const skin = pickRandom(L.SKIN_TONES);
        const hairCol = pickRandom(L.HAIR_COLOR_PRESETS);
        const eyeCol = pickRandom(L.EYE_COLORS);

        draft.look = L.clampLook({
          skinToneId: skin.id,
          undertone: skin.undertone,
          freckles: Math.random() < 0.25 ? pickRandom(L.FRECKLE_STYLES).id : 'none',
          mole: Math.random() < 0.2 ? pickRandom(L.MOLE_STYLES).id : 'none',
          blush: 'soft-rose',
          blushIntensity: 0.46,
          scar: 'none',
          eyeShape: pickRandom(L.EYE_SHAPES).id,
          eyeColorId: eyeCol.id,
          eyeColorHex: eyeCol.hex,
          pupilShape: pickRandom(L.PUPIL_SHAPES).id,
          eyeDepth: Number((0.2 + Math.random() * 0.72).toFixed(2)),
          browStyle: pickRandom(L.BROW_STYLES).id,
          noseShape: pickRandom(L.NOSE_SHAPES).id,
          lipShape: pickRandom(L.LIP_SHAPES).id,
          jawShape: pickRandom(L.JAW_SHAPES).id,
          eyeliner: pickRandom(L.EYELINER_STYLES).id,
          eyeshadow: pickRandom(L.EYESHADOW_PALETTES).id,
          lipstick: pickRandom(L.LIPSTICK_SHADES).id,
          highlighter: pickRandom(L.HIGHLIGHTERS).id,
          hairStyle: pickRandom(L.HAIR_STYLES).id,
          hairPresetId: hairCol.id,
          hairRootHex: hairCol.root,
          hairTipHex: hairCol.tip,
          hairHighlightHex: hairCol.highlight,
          hairBlend: 0.55,
          hairHighlightStrength: 0.55,
        });

        if (window.CrownWardrobe) {
          const outfits = window.CrownWardrobe.OUTFITS.filter(function (o) {
            return o.id !== 'foundation-slip';
          });
          draft.wardrobe = window.CrownWardrobe.clampWardrobe({
            outfitId: pickRandom(outfits).id,
            themeId: Math.random() < 0.5 ? 'signature' : pickRandom(window.CrownWardrobe.COLOR_THEMES).id,
          });
        }
        if (window.CrownAccessories) {
          draft.accessories = window.CrownAccessories.clampAccessories({
            crown: pickRandom(window.CrownAccessories.CROWNS).id,
            earrings: pickRandom(window.CrownAccessories.EARRINGS).id,
            necklace: pickRandom(window.CrownAccessories.NECKLACES).id,
            gloves: Math.random() < 0.35 ? pickRandom(window.CrownAccessories.GLOVES).id : 'none',
            eyewear: 'none',
            shoes: pickRandom(window.CrownAccessories.SHOES).id,
          });
        }

        scheduleThumbRefresh();
        renderPane();
        g.toast('New royal look styled');
      });

      function addLabel(text) {
        const el = document.createElement('span');
        el.className = 'crown-label';
        el.textContent = text;
        paneHost.appendChild(el);
      }

      function addChoiceGrid(items, currentId, colsClass, onPick) {
        const grid = document.createElement('div');
        grid.className = colsClass || 'cas-grid';
        items.forEach(function (item) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cas-choice' + (item.id === currentId ? ' active' : '');
          btn.innerHTML =
            '<span>' +
            item.label +
            '</span>' +
            (item.desc ? '<span class="cas-choice-sub">' + item.desc + '</span>' : '');
          btn.addEventListener('click', function () {
            onPick(item);
            scheduleThumbRefresh();
            renderPane();
          });
          grid.appendChild(btn);
        });
        paneHost.appendChild(grid);
      }

      function addSwatchRow(items, currentId, getHex, onPick) {
        const row = document.createElement('div');
        row.className = 'cas-swatch-grid';
        items.forEach(function (item) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'cas-swatch' + (item.id === currentId ? ' active' : '');
          btn.innerHTML =
            '<span class="cas-dot" style="background:' +
            getHex(item) +
            '"></span><span>' +
            item.label +
            '</span>';
          btn.addEventListener('click', function () {
            onPick(item);
            scheduleThumbRefresh();
            renderPane();
          });
          row.appendChild(btn);
        });
        paneHost.appendChild(row);
      }

      function addSlider(label, value, min, max, step, onInput, formatFn) {
        const box = document.createElement('div');
        box.className = 'cas-slider-row';

        const head = document.createElement('div');
        head.className = 'cas-slider-head';
        const valSpan = document.createElement('span');
        valSpan.textContent = formatFn ? formatFn(value) : String(Math.round(value * 100)) + '%';
        head.innerHTML = '<span>' + label + '</span>';
        head.appendChild(valSpan);

        const input = document.createElement('input');
        input.type = 'range';
        input.className = 'cas-range';
        input.min = String(min);
        input.max = String(max);
        input.step = String(step);
        input.value = String(value);
        input.addEventListener('input', function () {
          const num = Number(input.value);
          valSpan.textContent = formatFn ? formatFn(num) : String(Math.round(num * 100)) + '%';
          onInput(num);
        });

        box.appendChild(head);
        box.appendChild(input);
        paneHost.appendChild(box);
      }

      function renderPane() {
        paneHost.innerHTML = '';

        if (activeTab === 'body') {
          const evalBtn = document.createElement('button');
          evalBtn.type = 'button';
          evalBtn.className = 'cas-swatch' + (bodyEvalUndergarments ? ' active' : '');
          evalBtn.textContent = bodyEvalUndergarments
            ? 'Showing Bra & Panties (Tap to restore outfit)'
            : 'Evaluate in Bra & Panties';
          evalBtn.addEventListener('click', function () {
            bodyEvalUndergarments = !bodyEvalUndergarments;
            syncZoomButtons();
            renderPane();
          });
          paneHost.appendChild(evalBtn);

          addLabel('Body Shape Archetype');
          addChoiceGrid(B.BODY_TYPES, draft.body.bodyType, 'cas-grid', function (item) {
            draft.body.bodyType = item.id;
            draft.body.sliders = Object.assign({}, item.sliders);
          });

          addLabel('Age Stage');
          addChoiceGrid(B.AGE_LOOKS, draft.body.ageLook, 'cas-grid-3', function (item) {
            draft.body.ageLook = item.id;
          });

          addLabel('Anatomical Proportions');
          Object.keys(B.SLIDER_LIMITS).forEach(function (key) {
            const lim = B.SLIDER_LIMITS[key];
            addSlider(lim.label, draft.body.sliders[key], lim.min, lim.max, lim.step, function (val) {
              draft.body.sliders[key] = val;
            });
          });
        } else if (activeTab === 'face') {
          addLabel('Eyebrows');
          addChoiceGrid(L.BROW_STYLES, draft.look.browStyle, 'cas-grid', function (item) {
            draft.look.browStyle = item.id;
          });

          addLabel('Nose Shape');
          addChoiceGrid(L.NOSE_SHAPES, draft.look.noseShape, 'cas-grid', function (item) {
            draft.look.noseShape = item.id;
          });

          addLabel('Lip Shape');
          addChoiceGrid(L.LIP_SHAPES, draft.look.lipShape, 'cas-grid', function (item) {
            draft.look.lipShape = item.id;
          });

          addLabel('Jaw & Cheekbone');
          addChoiceGrid(L.JAW_SHAPES, draft.look.jawShape, 'cas-grid', function (item) {
            draft.look.jawShape = item.id;
          });

          addLabel('Eyeliner');
          addChoiceGrid(L.EYELINER_STYLES, draft.look.eyeliner, 'cas-grid', function (item) {
            draft.look.eyeliner = item.id;
          });

          addLabel('Eyeshadow');
          addSwatchRow(
            L.EYESHADOW_PALETTES,
            draft.look.eyeshadow,
            function (item) { return item.hex; },
            function (item) { draft.look.eyeshadow = item.id; }
          );

          addLabel('Lipstick');
          addSwatchRow(
            L.LIPSTICK_SHADES,
            draft.look.lipstick,
            function (item) { return item.hex; },
            function (item) { draft.look.lipstick = item.id; }
          );

          addLabel('Facial Sliders');
          ['noseLength', 'lipFullness', 'jawWidth', 'cheekbones'].forEach(function (key) {
            const lim = L.FACE_SLIDER_LIMITS[key];
            addSlider(lim.label, draft.look.faceSliders[key], lim.min, lim.max, lim.step, function (val) {
              draft.look.faceSliders[key] = val;
            });
          });
        } else if (activeTab === 'eyes') {
          addLabel('Pupil Shape');
          addChoiceGrid(L.PUPIL_SHAPES, draft.look.pupilShape, 'cas-grid', function (item) {
            draft.look.pupilShape = item.id;
          });

          addLabel('Iris Colour');
          addSwatchRow(
            L.EYE_COLORS,
            draft.look.eyeColorId,
            function (item) { return item.hex; },
            function (item) {
              draft.look.eyeColorId = item.id;
              draft.look.eyeColorHex = item.hex;
            }
          );

          const customEye = document.createElement('div');
          customEye.className = 'cas-color-box';
          customEye.innerHTML = '<span>Custom Iris Colour Wheel</span>';
          const eyePicker = document.createElement('input');
          eyePicker.type = 'color';
          eyePicker.className = 'cas-color-input';
          eyePicker.value = draft.look.eyeColorHex;
          eyePicker.addEventListener('input', function () {
            draft.look.eyeColorHex = eyePicker.value;
            scheduleThumbRefresh();
          });
          customEye.appendChild(eyePicker);
          paneHost.appendChild(customEye);

          addLabel('Eye Depth');
          const activeDepthPreset =
            draft.look.eyeDepth <= 0.35 ? 'shallow' : draft.look.eyeDepth >= 0.72 ? 'deep-set' : 'balanced';
          addChoiceGrid(L.EYE_DEPTH_PRESETS, activeDepthPreset, 'cas-grid-3', function (item) {
            draft.look.eyeDepth = item.value;
          });

          addSlider('Depth Intensity', draft.look.eyeDepth, 0, 1, 0.02, function (val) {
            draft.look.eyeDepth = val;
          });

          addLabel('Eye Shape');
          addChoiceGrid(L.EYE_SHAPES, draft.look.eyeShape, 'cas-grid', function (item) {
            draft.look.eyeShape = item.id;
          });

          ['eyeSize', 'eyeSpacing'].forEach(function (key) {
            const lim = L.FACE_SLIDER_LIMITS[key];
            addSlider(lim.label, draft.look.faceSliders[key], lim.min, lim.max, lim.step, function (val) {
              draft.look.faceSliders[key] = val;
            });
          });
        } else if (activeTab === 'hair') {
          addLabel('Hairstyle Category');
          const hairCats = [
            { id: 'all', label: 'All (' + L.HAIR_STYLES.length + ')' },
            { id: 'long', label: 'Long' },
            { id: 'updo', label: 'Updos' },
            { id: 'short', label: 'Short' },
          ];
          const filterRow = document.createElement('div');
          filterRow.className = 'cas-swatch-grid';
          hairCats.forEach(function (cat) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cas-swatch' + (cat.id === hairCategory ? ' active' : '');
            btn.textContent = cat.label;
            btn.addEventListener('click', function () {
              hairCategory = cat.id;
              renderPane();
            });
            filterRow.appendChild(btn);
          });
          paneHost.appendChild(filterRow);

          const filteredHair =
            hairCategory === 'all'
              ? L.HAIR_STYLES
              : L.HAIR_STYLES.filter(function (item) {
                  return item.category === hairCategory;
                });

          addLabel('Hairstyle');
          addChoiceGrid(filteredHair, draft.look.hairStyle, 'cas-grid', function (item) {
            draft.look.hairStyle = item.id;
          });

          addLabel('Colour Presets');
          addSwatchRow(
            L.HAIR_COLOR_PRESETS,
            draft.look.hairPresetId,
            function (item) { return item.tip; },
            function (item) {
              draft.look.hairPresetId = item.id;
              draft.look.hairRootHex = item.root;
              draft.look.hairTipHex = item.tip;
              draft.look.hairHighlightHex = item.highlight;
            }
          );

          addLabel('Root, Tip & Highlights');
          const cRow = document.createElement('div');
          cRow.className = 'cas-color-row';
          [
            { label: 'Root', key: 'hairRootHex' },
            { label: 'Tip', key: 'hairTipHex' },
            { label: 'Glow', key: 'hairHighlightHex' },
          ].forEach(function (cfg) {
            const box = document.createElement('label');
            box.className = 'cas-color-box';
            box.textContent = cfg.label;
            const inp = document.createElement('input');
            inp.type = 'color';
            inp.className = 'cas-color-input';
            inp.value = draft.look[cfg.key];
            inp.addEventListener('input', function () {
              draft.look[cfg.key] = inp.value;
              scheduleThumbRefresh();
            });
            box.appendChild(inp);
            cRow.appendChild(box);
          });
          paneHost.appendChild(cRow);

          addSlider('Root-to-Tip Blend', draft.look.hairBlend, 0.05, 0.95, 0.01, function (val) {
            draft.look.hairBlend = val;
          });

          addSlider('Highlight Shimmer', draft.look.hairHighlightStrength, 0, 1, 0.02, function (val) {
            draft.look.hairHighlightStrength = val;
          });
        } else if (activeTab === 'skin') {
          addLabel('Skin Tone');
          addSwatchRow(
            L.SKIN_TONES,
            draft.look.skinToneId,
            function (item) { return item.base; },
            function (item) {
              draft.look.skinToneId = item.id;
              draft.look.undertone = item.undertone;
            }
          );

          addLabel('Undertone');
          addSwatchRow(
            L.UNDERTONES,
            draft.look.undertone,
            function (item) { return item.shiftHex; },
            function (item) { draft.look.undertone = item.id; }
          );

          addLabel('Blush');
          addSwatchRow(
            L.BLUSH_STYLES,
            draft.look.blush,
            function (item) { return item.hex; },
            function (item) { draft.look.blush = item.id; }
          );

          addSlider('Blush Intensity', draft.look.blushIntensity, 0, 1, 0.02, function (val) {
            draft.look.blushIntensity = val;
          });

          addLabel('Highlighter');
          addChoiceGrid(L.HIGHLIGHTERS, draft.look.highlighter, 'cas-grid-3', function (item) {
            draft.look.highlighter = item.id;
          });

          addLabel('Freckles');
          addChoiceGrid(L.FRECKLE_STYLES, draft.look.freckles, 'cas-grid', function (item) {
            draft.look.freckles = item.id;
          });

          addLabel('Beauty Mark');
          addChoiceGrid(L.MOLE_STYLES, draft.look.mole, 'cas-grid', function (item) {
            draft.look.mole = item.id;
          });

          addLabel('Scars');
          addChoiceGrid(L.SCAR_STYLES, draft.look.scar, 'cas-grid', function (item) {
            draft.look.scar = item.id;
          });
        } else if (activeTab === 'wardrobe') {
          if (window.CrownWardrobe && typeof window.CrownWardrobe.renderSelector === 'function') {
            window.CrownWardrobe.renderSelector(paneHost, draft, function () {
              bodyEvalUndergarments = false;
              syncZoomButtons();
              scheduleThumbRefresh();
              renderPane();
            });
          }
        } else if (activeTab === 'accessories') {
          if (window.CrownAccessories && typeof window.CrownAccessories.renderSelector === 'function') {
            window.CrownAccessories.renderSelector(paneHost, draft, function () {
              scheduleThumbRefresh();
              renderPane();
            });
          }
        } else if (activeTab === 'identity') {
          const nameWrap = document.createElement('div');
          nameWrap.className = 'crown-field';
          nameWrap.innerHTML = '<label class="crown-label" for="cas-first-name">Princess Name</label>';
          const nameInput = document.createElement('input');
          nameInput.id = 'cas-first-name';
          nameInput.type = 'text';
          nameInput.maxLength = 22;
          nameInput.className = 'crown-input';
          nameInput.value = draft.firstName;
          nameInput.addEventListener('input', function () {
            draft.firstName = nameInput.value.trim() || 'Camille';
            syncTopBadge();
          });
          nameWrap.appendChild(nameInput);
          paneHost.appendChild(nameWrap);

          addLabel('Voice Tone');
          addChoiceGrid(VOICE_TONES, draft.voice, 'cas-grid-3', function (item) {
            draft.voice = item.id;
          });

          addLabel('Royal Traits (Up to 3)');
          const traitGrid = document.createElement('div');
          traitGrid.className = 'cas-grid';
          ROYAL_TRAITS.forEach(function (tr) {
            const active = draft.traits.indexOf(tr.id) !== -1;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'cas-choice' + (active ? ' active' : '');
            btn.innerHTML = '<span>' + tr.label + '</span><span class="cas-choice-sub">' + tr.desc + '</span>';
            btn.addEventListener('click', function () {
              const idx = draft.traits.indexOf(tr.id);
              if (idx !== -1) {
                if (draft.traits.length > 1) draft.traits.splice(idx, 1);
              } else if (draft.traits.length < 3) {
                draft.traits.push(tr.id);
              } else {
                g.toast('Choose up to 3 royal traits.');
              }
              renderPane();
            });
            traitGrid.appendChild(btn);
          });
          paneHost.appendChild(traitGrid);
        }
      }

      function syncTabActive() {
        tabRow.querySelectorAll('.cas-tab').forEach(function (el, idx) {
          el.classList.toggle('active', tabs[idx].id === activeTab);
        });
      }

      tabs.forEach(function (tab) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cas-tab' + (tab.id === activeTab ? ' active' : '');
        btn.textContent = tab.label;
        btn.addEventListener('click', function () {
          activeTab = tab.id;
          if ((tab.id === 'body' || tab.id === 'wardrobe') && zoomMode !== 'full') {
            zoomMode = 'full';
          } else if (tab.id === 'eyes' && zoomMode !== 'face') {
            zoomMode = 'face';
          } else if ((tab.id === 'face' || tab.id === 'hair' || tab.id === 'skin') && zoomMode === 'full') {
            zoomMode = 'portrait';
          }
          syncZoomButtons();
          syncTabActive();
          renderPane();
        });
        tabRow.appendChild(btn);
      });

      syncTopBadge();
      syncZoomButtons();
      renderHouseholdStrip();
      renderPane();

      function drawSalonBackdrop(ctx, w, h) {
        const wallGrad = ctx.createLinearGradient(0, 0, 0, h);
        wallGrad.addColorStop(0, '#efe1cf');
        wallGrad.addColorStop(0.55, '#d7c0a8');
        wallGrad.addColorStop(1, '#9e8470');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 0, w, h);

        [0.14, 0.86].forEach(function (rx) {
          const wx = w * rx;
          const ww = w * 0.24;
          const wy = h * 0.12;
          const wh = h * 0.62;

          const winGrad = ctx.createLinearGradient(0, wy, 0, wy + wh);
          winGrad.addColorStop(0, 'rgba(255, 250, 234, 0.92)');
          winGrad.addColorStop(0.65, 'rgba(255, 236, 198, 0.72)');
          winGrad.addColorStop(1, 'rgba(218, 190, 152, 0.35)');

          ctx.fillStyle = winGrad;
          ctx.beginPath();
          ctx.arc(wx, wy + ww * 0.5, ww * 0.5, Math.PI, 0);
          ctx.lineTo(wx + ww * 0.5, wy + wh);
          ctx.lineTo(wx - ww * 0.5, wy + wh);
          ctx.closePath();
          ctx.fill();
        });

        const halo = ctx.createRadialGradient(w * 0.5, h * 0.4, 8, w * 0.5, h * 0.4, w * 0.72);
        halo.addColorStop(0, 'rgba(255, 248, 232, 0.6)');
        halo.addColorStop(0.6, 'rgba(255, 236, 204, 0.22)');
        halo.addColorStop(1, 'rgba(42, 26, 24, 0.28)');
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, w, h);

        // Floor perspective band right above the household strip
        ctx.fillStyle = 'rgba(138, 110, 86, 0.26)';
        ctx.fillRect(0, h * 0.78, w, h * 0.22);
        ctx.strokeStyle = 'rgba(184, 137, 56, 0.36)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, h * 0.78);
        ctx.lineTo(w, h * 0.78);
        ctx.stroke();
      }

      let rafId = 0;
      let running = true;

      function drawPortrait(timeSec) {
        if (!running || !document.body.contains(canvas)) {
          running = false;
          return;
        }

        const rect = stage.getBoundingClientRect();
        const w = Math.max(150, Math.round(rect.width));
        const h = Math.max(240, Math.round(rect.height));
        const maxDpr = g.settings.quality === 'low' ? 1 : g.settings.quality === 'medium' ? 1.5 : 2;
        const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(h * dpr);
        }

        const ctx = canvas.getContext('2d');
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        drawSalonBackdrop(ctx, w, h);

        const swayY = Math.sin(timeSec * 1.8) * (zoomMode === 'face' ? 1.1 : 0.8);
        const cx = w < 240 ? w * 0.43 : w * 0.47; // Clear of floating right tool rail on narrow mobile
        let unitScale = Math.min(h * 0.78, w * 2.45);
        let baseY = h * 0.83 + swayY;

        if (zoomMode === 'portrait') {
          unitScale = Math.min(h * 1.25, w * 2.85);
          const probeRig = B.computeRig(draft.body, cx, 0, unitScale);
          baseY = h * 0.28 - probeRig.joints.headCenter.y + swayY;
        } else if (zoomMode === 'face') {
          unitScale = Math.min(h * 1.78, w * 3.6);
          const probeRig = B.computeRig(draft.body, cx, 0, unitScale);
          baseY = h * 0.42 - probeRig.joints.headCenter.y + swayY;
        } else {
          // Full standing body fitted cleanly between top pill and bottom household strip
          unitScale = Math.min(h * 0.74, w * 2.08);
          baseY = h * 0.83 + swayY;
        }

        const rig = B.computeRig(draft.body, cx, baseY, unitScale);
        const skinPalette = L.getSkinPalette(draft.look);

        const blinkCycle = timeSec % 4.4;
        const isBlink = blinkCycle > 4.22 && blinkCycle < 4.36;

        L.drawHairBack(ctx, rig, draft.look);
        B.drawBaseBody(ctx, rig, skinPalette);
        if (window.CrownWardrobe && typeof window.CrownWardrobe.drawOutfit === 'function') {
          const activeOutfit = bodyEvalUndergarments
            ? { outfitId: 'foundation-slip', themeId: 'signature' }
            : draft.wardrobe;
          window.CrownWardrobe.drawOutfit(ctx, rig, activeOutfit, draft.look);
        }
        L.drawHeadAndFace(ctx, rig, draft.look, { blink: isBlink });
        L.drawHairFront(ctx, rig, draft.look);
        if (window.CrownAccessories && typeof window.CrownAccessories.drawAccessories === 'function') {
          window.CrownAccessories.drawAccessories(ctx, rig, draft.accessories);
        }

        rafId = requestAnimationFrame(function (ts) {
          drawPortrait(ts * 0.001);
        });
      }

      rafId = requestAnimationFrame(function (ts) {
        drawPortrait(ts * 0.001);
      });

      window.addEventListener('crowngame:screenchange', function onLeave(ev) {
        if (ev.detail && ev.detail.screen !== 'creator') {
          running = false;
          if (rafId) cancelAnimationFrame(rafId);
          window.removeEventListener('crowngame:screenchange', onLeave);
        }
      });

      const footRow = document.createElement('div');
      footRow.className = 'cas-foot-row';

      const backStepBtn = document.createElement('button');
      backStepBtn.type = 'button';
      backStepBtn.className = 'btn-secondary cas-foot-back';
      backStepBtn.innerHTML = '&#8592; Back';
      backStepBtn.addEventListener('click', function () {
        if (window.CrownAudio) window.CrownAudio.playBack();
        window.CrownMenu.back();
      });

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'btn-primary';
      saveBtn.innerHTML = '<span>Save Household &amp; Play</span><span aria-hidden="true">&#8594;</span>';
      saveBtn.addEventListener('click', function () {
        roster[charIndex] = draft;
        persistPrincess(draft, roster);
        if (window.CrownMenu && window.CrownMenu.refreshSummary) {
          window.CrownMenu.refreshSummary();
        }
        if (window.CrownAudio) window.CrownAudio.playSuccess();
        g.toast(draft.title + ' ' + draft.firstName + ' & household saved!');
        if (window.CrownScreens && window.CrownScreens.game && typeof window.CrownScreens.game.render === 'function') {
          window.CrownMenu.go('game');
        }
      });

      footRow.appendChild(backStepBtn);
      footRow.appendChild(saveBtn);
      frame.foot.appendChild(footRow);
      return frame.panel;
    },
  };
})();
