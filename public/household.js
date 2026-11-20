(function () {
  'use strict';

  if (!window.CrownGame || !window.CrownScreens) {
    return;
  }

  const STORAGE_SAVE_KEY = 'crown_scandal_save_v1';

  const HOMELANDS = [
    {
      id: 'riviera',
      name: "Côte d'Azur Riviera",
      note: 'Coastal cliffs, yacht harbours & red-carpet intrigue',
      bonusClout: 58,
      bonusFavour: 55,
    },
    {
      id: 'versailles',
      name: 'Val-de-Versailles',
      note: 'Gilded salons, strict etiquette & Queen Mother’s favour',
      bonusClout: 52,
      bonusFavour: 68,
    },
    {
      id: 'isles',
      name: 'Crown Isles',
      note: 'Private jet runways, old treaties & guarded secrets',
      bonusClout: 55,
      bonusFavour: 58,
    },
    {
      id: 'highlands',
      name: 'Highland Marches',
      note: 'Royal stables, estate hunting & fierce guard loyalty',
      bonusClout: 48,
      bonusFavour: 62,
    },
  ];

  const ALLOWANCE_TIERS = [
    {
      id: 'modest',
      label: 'Modest Heir',
      weekly: 15000,
      treasury: 30000,
      note: 'Prove yourself without unlimited gold',
    },
    {
      id: 'grand',
      label: 'Grand Princess',
      weekly: 50000,
      treasury: 120000,
      note: 'Balanced court luxury & boutique shopping',
    },
    {
      id: 'sovereign',
      label: 'Sovereign Fortune',
      weekly: 150000,
      treasury: 350000,
      note: 'Immediate jet charter & palace wing upgrades',
    },
  ];

  const HOUSE_SUGGESTIONS = ['Valois', 'Montclair', 'Aurelia', 'Beaumont', 'Castellano', 'Vermeil'];

  const CREST_SWATCHES = [
    { id: 'gold', label: 'Versailles Gold', hex: '#B88938' },
    { id: 'rose', label: 'Rose Velvet', hex: '#B85D74' },
    { id: 'azure', label: 'Riviera Sapphire', hex: '#3D6B99' },
    { id: 'emerald', label: 'Court Emerald', hex: '#3B7A62' },
  ];

  if (!document.getElementById('crown-household-styles')) {
    const style = document.createElement('style');
    style.id = 'crown-household-styles';
    style.textContent = `
      .hh-chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .hh-chip {
        min-height: 40px;
        padding: 6px 12px;
        border-radius: 12px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 255, 255, 0.72);
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.14s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.14s ease;
      }

      .hh-chip:active {
        transform: scale(0.97);
      }

      .hh-chip.active {
        background: var(--gold);
        border-color: #9f7328;
        color: #fffdf9;
      }

      .hh-option-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }

      @media (min-width: 520px) {
        .hh-option-grid.two-col {
          grid-template-columns: 1fr 1fr;
        }
      }

      .hh-card-btn {
        width: 100%;
        min-height: 56px;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 255, 255, 0.76);
        color: var(--ink-primary);
        text-align: left;
        font-family: var(--font-sans);
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 3px;
        transition: transform 0.14s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.14s ease, background-color 0.14s ease;
      }

      .hh-card-btn:active {
        transform: scale(0.985);
      }

      .hh-card-btn.active {
        background: #fff9ef;
        border-color: var(--gold);
        box-shadow: 0 4px 14px rgba(184, 137, 56, 0.18);
      }

      .hh-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        font-size: 14px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }

      .hh-card-sub {
        font-size: 12px;
        line-height: 1.4;
        color: var(--ink-muted);
      }

      .hh-swatch-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .hh-swatch-btn {
        min-height: 44px;
        padding: 6px 12px;
        border-radius: 12px;
        border: 1px solid var(--border-hairline);
        background: rgba(255, 255, 255, 0.76);
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 13px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .hh-swatch-btn.active {
        border-color: var(--gold);
        background: #fff9ef;
        box-shadow: 0 3px 10px rgba(184, 137, 56, 0.18);
      }

      .hh-swatch-dot {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 1px solid rgba(0, 0, 0, 0.15);
        flex-shrink: 0;
      }

      .hh-summary-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(242, 229, 226, 0.65);
        font-size: 13px;
        color: var(--ink-primary);
        font-variant-numeric: tabular-nums;
      }
    `;
    document.head.appendChild(style);
  }

  function formatCrowns(amount) {
    return '₡' + Number(amount || 0).toLocaleString('en-US');
  }

  function buildInitialDynasty(houseName, homelandName) {
    return {
      houseName: houseName,
      homeland: homelandName,
      members: [
        {
          id: 'queen-mother',
          name: 'Dowager Queen Celestine of ' + houseName,
          role: 'Queen Mother',
          generation: 1,
          relation: 'Grandmother · Matriarch',
          status: 'Living',
          favour: 65,
        },
        {
          id: 'sovereign-parent',
          name: 'King Henri of ' + houseName,
          role: 'Reigning Monarch',
          generation: 2,
          relation: 'Father · Sovereign',
          status: 'Living',
          favour: 70,
        },
        {
          id: 'player-heir',
          name: 'Crown Princess (You)',
          role: 'Heir Apparent',
          generation: 3,
          relation: 'Player · House ' + houseName,
          status: 'Active',
          favour: 100,
        },
        {
          id: 'scheming-cousin',
          name: 'Lady Vivienne of ' + houseName,
          role: 'Royal Cousin',
          generation: 3,
          relation: 'Cousin · Court Rival',
          status: 'Living',
          favour: 38,
        },
      ],
      alliances: [
        {
          house: homelandName,
          pact: 'Sovereign Charter',
          strength: 'Active',
        },
      ],
    };
  }

  function persistQuickSave() {
    try {
      const g = window.CrownGame;
      const payload = {
        version: g.version,
        household: g.household,
        princess: g.princess,
        needs: g.needs,
        money: g.money,
        reputation: g.reputation,
        dynasty: g.dynasty,
        structures: g.structures,
      };
      localStorage.setItem(STORAGE_SAVE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }

  window.CrownScreens.household = {
    render: function (_opts, createFrame) {
      const g = window.CrownGame;
      const existing = g.household || {};

      const draft = {
        houseName: existing.houseName || 'Valois',
        homelandId: existing.homelandId || 'riviera',
        allowanceId: existing.allowanceId || 'grand',
        crestId: existing.crestId || 'gold',
      };

      const frame = createFrame(
        'household',
        'Name your Royal House, choose your ancestral homeland, and set your starting court allowance.'
      );

      // 1. Royal House Name
      const nameField = document.createElement('div');
      nameField.className = 'crown-field';
      nameField.innerHTML = '<label class="crown-label" for="hh-name-input">Royal House Name</label>';

      const nameInput = document.createElement('input');
      nameInput.id = 'hh-name-input';
      nameInput.type = 'text';
      nameInput.maxLength = 24;
      nameInput.className = 'crown-input';
      nameInput.placeholder = 'e.g. Valois, Montclair, Aurelia';
      nameInput.value = draft.houseName;

      const chipRow = document.createElement('div');
      chipRow.className = 'hh-chip-row';
      HOUSE_SUGGESTIONS.forEach(function (suggestion) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'hh-chip' + (draft.houseName === suggestion ? ' active' : '');
        chip.textContent = suggestion;
        chip.addEventListener('click', function () {
          draft.houseName = suggestion;
          nameInput.value = suggestion;
          syncAll();
        });
        chipRow.appendChild(chip);
      });

      nameInput.addEventListener('input', function () {
        draft.houseName = nameInput.value.trim();
        syncSummaryOnly();
      });

      nameField.appendChild(nameInput);
      nameField.appendChild(chipRow);
      frame.body.appendChild(nameField);

      // 2. Homeland Selection
      const homelandField = document.createElement('div');
      homelandField.className = 'crown-field';
      homelandField.innerHTML = '<span class="crown-label">Ancestral Homeland</span>';

      const homelandGrid = document.createElement('div');
      homelandGrid.className = 'hh-option-grid two-col';

      HOMELANDS.forEach(function (item) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'hh-card-btn' + (draft.homelandId === item.id ? ' active' : '');
        card.dataset.homeland = item.id;
        card.innerHTML =
          '<span class="hh-card-top"><span>' +
          item.name +
          '</span></span>' +
          '<span class="hh-card-sub">' +
          item.note +
          '</span>';
        card.addEventListener('click', function () {
          draft.homelandId = item.id;
          syncAll();
        });
        homelandGrid.appendChild(card);
      });

      homelandField.appendChild(homelandGrid);
      frame.body.appendChild(homelandField);

      // 3. Starting Allowance
      const allowanceField = document.createElement('div');
      allowanceField.className = 'crown-field';
      allowanceField.innerHTML = '<span class="crown-label">Starting Allowance</span>';

      const allowanceGrid = document.createElement('div');
      allowanceGrid.className = 'hh-option-grid';

      ALLOWANCE_TIERS.forEach(function (tier) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'hh-card-btn' + (draft.allowanceId === tier.id ? ' active' : '');
        card.dataset.allowance = tier.id;
        card.innerHTML =
          '<span class="hh-card-top"><span>' +
          tier.label +
          '</span><span>' +
          formatCrowns(tier.weekly) +
          ' / wk</span></span>' +
          '<span class="hh-card-sub">Treasury: ' +
          formatCrowns(tier.treasury) +
          ' · ' +
          tier.note +
          '</span>';
        card.addEventListener('click', function () {
          draft.allowanceId = tier.id;
          syncAll();
        });
        allowanceGrid.appendChild(card);
      });

      allowanceField.appendChild(allowanceGrid);
      frame.body.appendChild(allowanceField);

      // 4. House Crest Accent
      const crestField = document.createElement('div');
      crestField.className = 'crown-field';
      crestField.innerHTML = '<span class="crown-label">Royal Crest Colour</span>';

      const swatchRow = document.createElement('div');
      swatchRow.className = 'hh-swatch-row';

      CREST_SWATCHES.forEach(function (sw) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hh-swatch-btn' + (draft.crestId === sw.id ? ' active' : '');
        btn.dataset.crest = sw.id;
        btn.innerHTML =
          '<span class="hh-swatch-dot" style="background:' +
          sw.hex +
          '"></span><span>' +
          sw.label +
          '</span>';
        btn.addEventListener('click', function () {
          draft.crestId = sw.id;
          syncAll();
        });
        swatchRow.appendChild(btn);
      });

      crestField.appendChild(swatchRow);
      frame.body.appendChild(crestField);

      // Live Summary Strip
      const summaryBar = document.createElement('div');
      summaryBar.className = 'hh-summary-bar';
      frame.body.appendChild(summaryBar);

      function getSelectedTier() {
        return ALLOWANCE_TIERS.find(function (t) {
          return t.id === draft.allowanceId;
        }) || ALLOWANCE_TIERS[1];
      }

      function getSelectedHomeland() {
        return HOMELANDS.find(function (h) {
          return h.id === draft.homelandId;
        }) || HOMELANDS[0];
      }

      function getSelectedCrest() {
        return CREST_SWATCHES.find(function (c) {
          return c.id === draft.crestId;
        }) || CREST_SWATCHES[0];
      }

      function syncSummaryOnly() {
        const tier = getSelectedTier();
        const home = getSelectedHomeland();
        const houseLabel = draft.houseName ? 'House ' + draft.houseName : 'House Unnamed';
        summaryBar.innerHTML =
          '<span>' +
          houseLabel +
          ' · ' +
          home.name +
          '</span><span>' +
          formatCrowns(tier.treasury) +
          '</span>';
      }

      function syncAll() {
        chipRow.querySelectorAll('.hh-chip').forEach(function (el) {
          el.classList.toggle('active', el.textContent === draft.houseName);
        });
        homelandGrid.querySelectorAll('.hh-card-btn').forEach(function (el) {
          el.classList.toggle('active', el.dataset.homeland === draft.homelandId);
        });
        allowanceGrid.querySelectorAll('.hh-card-btn').forEach(function (el) {
          el.classList.toggle('active', el.dataset.allowance === draft.allowanceId);
        });
        swatchRow.querySelectorAll('.hh-swatch-btn').forEach(function (el) {
          el.classList.toggle('active', el.dataset.crest === draft.crestId);
        });
        syncSummaryOnly();
      }

      syncAll();

      // Footer Actions
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'btn-primary';
      nextBtn.innerHTML = '<span>Continue to Create-A-Princess</span><span aria-hidden="true">&#8594;</span>';
      nextBtn.addEventListener('click', function () {
        const cleanName = nameInput.value.trim().replace(/\s+/g, ' ');
        if (cleanName.length < 2) {
          g.toast('Please enter a Royal House name (at least 2 letters).');
          nameInput.focus();
          return;
        }

        const homeland = getSelectedHomeland();
        const tier = getSelectedTier();
        const crest = getSelectedCrest();

        g.household = {
          houseName: cleanName,
          homeland: homeland.name,
          homelandId: homeland.id,
          allowance: tier.weekly,
          allowanceId: tier.id,
          crestColor: crest.hex,
          crestId: crest.id,
          foundedAt: Date.now(),
        };
        g.money = tier.treasury;
        g.reputation = {
          clout: homeland.bonusClout,
          scandal: 0,
          rank: 'Crown Heiress',
          queenMotherFavour: homeland.bonusFavour,
        };
        g.dynasty = buildInitialDynasty(cleanName, homeland.name);
        g.saveExists = true;

        persistQuickSave();
        if (window.CrownMenu && window.CrownMenu.refreshSummary) {
          window.CrownMenu.refreshSummary();
        }
        g.toast('House ' + cleanName + ' founded!');
        g.setScreen('creator');
      });

      frame.foot.appendChild(nextBtn);
      return frame.panel;
    },
  };
})();
