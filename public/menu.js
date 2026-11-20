(function () {
  'use strict';

  const host = document.getElementById('screen-host');
  const menuEl = document.getElementById('screen-menu');
  const ageModal = document.getElementById('age-modal');

  if (!host || !menuEl || !window.CrownGame) {
    return;
  }

  // Inject shared sub-screen layout styles once for upcoming modules
  if (!document.getElementById('crown-menu-styles')) {
    const style = document.createElement('style');
    style.id = 'crown-menu-styles';
    style.textContent = `
      .screen-panel {
        width: 100%;
        max-width: 540px;
        max-height: calc(100vh - 108px);
        background: var(--surface-glass);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid var(--border-hairline);
        border-radius: 24px;
        box-shadow: var(--shadow-soft);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: crownScreenIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes crownScreenIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @media (prefers-reduced-motion: reduce) {
        .screen-panel { animation: none; }
      }

      .screen-panel-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 14px 16px;
        border-bottom: 1px solid rgba(184, 137, 56, 0.22);
        background: rgba(255, 251, 247, 0.65);
      }

      .screen-panel-title-wrap {
        min-width: 0;
        flex: 1;
      }

      .screen-panel-kicker {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.08em;
        color: var(--gold);
        margin: 0 0 2px;
      }

      .screen-panel-title {
        font-family: var(--font-display);
        font-size: 26px;
        font-weight: 700;
        line-height: 1.08;
        margin: 0;
        color: var(--ink-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .screen-panel-body {
        padding: 16px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .screen-panel-foot {
        padding: 12px 16px calc(14px + env(safe-area-inset-bottom));
        border-top: 1px solid rgba(184, 137, 56, 0.2);
        background: rgba(255, 251, 247, 0.72);
        display: flex;
        gap: 10px;
      }

      .crown-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .crown-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--ink-primary);
      }

      .crown-input,
      .crown-select {
        width: 100%;
        min-height: 46px;
        padding: 10px 14px;
        border-radius: 12px;
        border: 1px solid var(--border-hairline);
        background: #fffdf9;
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 15px;
      }

      .crown-input:focus,
      .crown-select:focus {
        outline: 2px solid var(--gold);
        outline-offset: 1px;
      }

      .crown-note {
        font-size: 14px;
        line-height: 1.55;
        color: var(--ink-muted);
        margin: 0;
      }

      .crown-divider {
        height: 1px;
        background: rgba(184, 137, 56, 0.18);
        border: none;
        margin: 2px 0;
      }
    `;
    document.head.appendChild(style);
  }

  // Registry where later files (household.js, cas.js, etc.) plug in
  window.CrownScreens = window.CrownScreens || {};

  const SCREEN_META = {
    menu: { kicker: 'Royal Court', title: 'Crown & Scandal' },
    household: { kicker: 'Step 2 · Royal Dynasty', title: 'New Household' },
    creator: { kicker: 'Step 3 · Create-A-Princess', title: 'Royal Atelier' },
    game: { kicker: 'Versailles Riviera', title: 'Palace & Town' },
    dynasty: { kicker: 'Lineage & Alliances', title: 'Dynasty Family Tree' },
    building: { kicker: 'Architect & Routes', title: 'Building & Routes' },
  };

  let activeDynamicEl = null;
  const historyStack = ['menu'];

  function clearDynamicScreen() {
    if (activeDynamicEl && activeDynamicEl.parentNode) {
      activeDynamicEl.parentNode.removeChild(activeDynamicEl);
    }
    activeDynamicEl = null;
  }

  function buildScreenFrame(target, subtitleText) {
    const meta = SCREEN_META[target] || { kicker: 'Royal Court', title: target };
    const panel = document.createElement('section');
    panel.className = 'screen-panel';
    panel.id = 'screen-' + target;
    panel.setAttribute('aria-label', meta.title);

    const head = document.createElement('div');
    head.className = 'screen-panel-head';

    const titleWrap = document.createElement('div');
    titleWrap.className = 'screen-panel-title-wrap';
    titleWrap.innerHTML =
      '<p class="screen-panel-kicker">' +
      meta.kicker +
      '</p>' +
      '<h2 class="screen-panel-title">' +
      meta.title +
      '</h2>';

    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'icon-btn';
    backBtn.textContent = 'Back';
    backBtn.addEventListener('click', function () {
      window.CrownMenu.back();
    });

    head.appendChild(titleWrap);
    head.appendChild(backBtn);

    const body = document.createElement('div');
    body.className = 'screen-panel-body';
    if (subtitleText) {
      const p = document.createElement('p');
      p.className = 'crown-note';
      p.textContent = subtitleText;
      body.appendChild(p);
    }

    const foot = document.createElement('div');
    foot.className = 'screen-panel-foot';

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(foot);

    return { panel: panel, body: body, foot: foot, backBtn: backBtn };
  }

  function renderFallbackScreen(target) {
    const descriptions = {
      household:
        'Choose your Royal House name, homeland, and starting allowance before entering the Versailles Atelier.',
      creator:
        'Customize skin undertone, hair blends, facial features, body sliders, gowns, crowns, and royal traits.',
      game:
        'Start in the Grand Versailles Palace, walk the halls, drive coastal Riviera roads, and watch Crown Dispatch.',
      dynasty:
        'View your royal family tree: the Queen Mother, parents, siblings, cousins, marriages, alliances, and heirs.',
      building:
        'Open architect mode to place palace structures, customize lots, and connect roads and routes across town.',
    };

    const frame = buildScreenFrame(
      target,
      descriptions[target] || 'This screen module is ready to be connected.'
    );

    const statusLine = document.createElement('p');
    statusLine.className = 'crown-note';
    statusLine.textContent =
      target === 'household'
        ? 'Waiting for household.js (next build step).'
        : 'Waiting for the ' + target + ' module in the build order.';
    frame.body.appendChild(statusLine);

    const returnBtn = document.createElement('button');
    returnBtn.type = 'button';
    returnBtn.className = 'btn-secondary';
    returnBtn.textContent = 'Return to Opening Menu';
    returnBtn.addEventListener('click', function () {
      window.CrownMenu.go('menu');
    });
    frame.foot.appendChild(returnBtn);

    return frame.panel;
  }

  function refreshMenuSummary() {
    const g = window.CrownGame;
    const btnContinue = document.getElementById('btn-continue');
    const topSaveLabel = document.getElementById('top-save-label');
    const saveHouseText = document.getElementById('save-house-text');

    if (g.saveExists && g.household && g.household.houseName) {
      if (btnContinue) btnContinue.disabled = false;
      if (topSaveLabel) topSaveLabel.textContent = 'House ' + g.household.houseName;
      if (saveHouseText) {
        saveHouseText.textContent = 'House ' + g.household.houseName + ' · ' + g.reputation.rank;
      }
    } else {
      if (btnContinue) btnContinue.disabled = true;
      if (topSaveLabel) topSaveLabel.textContent = 'No active dynasty';
      if (saveHouseText) saveHouseText.textContent = 'House: Unclaimed';
    }
  }

  window.CrownMenu = {
    screens: Object.keys(SCREEN_META),

    go: function (target, options) {
      const opts = options || {};

      // Enforce 18+ age confirmation before entering any screen
      if (!window.CrownGame.settings.ageVerified && target !== 'menu') {
        if (ageModal) ageModal.classList.remove('hidden');
        window.CrownGame.toast('Please confirm you are 18+ first.');
        return false;
      }

      if (!SCREEN_META[target]) {
        window.CrownGame.toast('Unknown screen: ' + target);
        return false;
      }

      clearDynamicScreen();

      if (target === 'menu') {
        menuEl.classList.remove('hidden');
        refreshMenuSummary();
        historyStack.length = 0;
        historyStack.push('menu');
      } else {
        menuEl.classList.add('hidden');
        if (!opts.isBack && historyStack[historyStack.length - 1] !== target) {
          historyStack.push(target);
        }

        const handler = window.CrownScreens[target];
        let nextNode = null;
        if (handler && typeof handler.render === 'function') {
          try {
            nextNode = handler.render(opts, buildScreenFrame);
          } catch (err) {
            console.error('[CrownMenu] Screen render error for', target, err);
            window.CrownGame.toast('Could not open ' + target + ': ' + (err && err.message ? err.message : 'render error'));
            nextNode = renderFallbackScreen(target);
          }
        } else {
          nextNode = renderFallbackScreen(target);
        }

        if (nextNode) {
          activeDynamicEl = nextNode;
          host.appendChild(nextNode);
        }
      }

      window.CrownGame.screen = target;
      try {
        window.dispatchEvent(
          new CustomEvent('crowngame:screenchange', { detail: { screen: target, options: opts } })
        );
      } catch (_) {}

      return true;
    },

    back: function () {
      if (historyStack.length > 1) {
        historyStack.pop();
        const prev = historyStack[historyStack.length - 1] || 'menu';
        return this.go(prev, { isBack: true });
      }
      return this.go('menu', { isBack: true });
    },

    createFrame: buildScreenFrame,
    refreshSummary: refreshMenuSummary,
  };
})();
