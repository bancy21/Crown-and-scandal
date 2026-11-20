(function () {
  'use strict';

  if (!window.CrownGame || !window.CrownScreens) {
    return;
  }

  // Clean HUD styles (no backdrop-filter over WebGL canvas, no pulsating dots)
  if (!document.getElementById('crown-world-styles')) {
    const style = document.createElement('style');
    style.id = 'crown-world-styles';
    style.textContent = `
      .world-shell {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #cce0f0;
        z-index: 25;
        user-select: none;
        -webkit-user-select: none;
      }

      .world-canvas-mount {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        touch-action: none;
      }

      .world-canvas-mount canvas {
        display: block;
        width: 100%;
        height: 100%;
      }

      .world-topbar {
        position: absolute;
        top: max(10px, env(safe-area-inset-top));
        left: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        pointer-events: none;
        z-index: 5;
      }

      .world-pill {
        pointer-events: auto;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 12px;
        border-radius: 14px;
        background: rgba(28, 19, 24, 0.9);
        border: 1px solid rgba(212, 175, 85, 0.45);
        color: #fff8ee;
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        font-variant-numeric: tabular-nums;
        box-shadow: 0 4px 14px rgba(15, 10, 14, 0.25);
        max-width: 66vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .world-pill-gold {
        color: #f3cd69;
      }

      .world-top-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        pointer-events: auto;
      }

      .world-btn-sm {
        min-height: 36px;
        padding: 6px 11px;
        border-radius: 12px;
        border: 1px solid rgba(212, 175, 85, 0.48);
        background: rgba(255, 250, 246, 0.96);
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(15, 10, 14, 0.2);
      }

      .world-btn-sm:active {
        transform: scale(0.96);
      }

      .world-joy-zone {
        position: absolute;
        left: max(14px, env(safe-area-inset-left));
        bottom: calc(136px + env(safe-area-inset-bottom));
        width: 98px;
        height: 98px;
        border-radius: 50%;
        background: rgba(28, 19, 24, 0.34);
        border: 2px solid rgba(243, 205, 105, 0.65);
        touch-action: none;
        z-index: 6;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .world-joy-knob {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: rgba(255, 248, 236, 0.95);
        border: 2px solid #b88938;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.28);
        pointer-events: none;
        transform: translate3d(0, 0, 0);
      }

      .world-dock-wrap {
        position: absolute;
        bottom: calc(12px + env(safe-area-inset-bottom));
        left: 50%;
        transform: translateX(-50%);
        width: min(780px, 95vw);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        z-index: 7;
        pointer-events: none;
        transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      }

      .world-dock-wrap.collapsed {
        transform: translateX(-50%) translateY(calc(100% - 34px));
      }

      .world-dock-toggle {
        pointer-events: auto;
        min-height: 30px;
        padding: 4px 14px;
        border-radius: 10px;
        border: 1px solid rgba(212, 175, 85, 0.5);
        background: rgba(28, 19, 24, 0.92);
        color: #f3cd69;
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .world-dock {
        pointer-events: auto;
        width: 100%;
        padding: 10px 12px;
        border-radius: 18px;
        background: rgba(255, 250, 246, 0.97);
        border: 1px solid rgba(184, 137, 56, 0.45);
        box-shadow: 0 10px 30px rgba(24, 15, 20, 0.24);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .world-dock-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }

      .world-interact-btn {
        flex: 1;
        min-width: 190px;
        min-height: 40px;
        padding: 6px 12px;
        border-radius: 11px;
        border: 1px solid #9f7328;
        background: linear-gradient(135deg, #c69742, #9e7326);
        color: #fffdf9;
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .world-interact-btn:disabled {
        background: rgba(236, 224, 212, 0.96);
        border-color: rgba(184, 137, 56, 0.28);
        color: var(--ink-muted);
        cursor: default;
      }

      .world-needs {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .world-need-chip {
        padding: 4px 8px;
        border-radius: 8px;
        background: rgba(242, 229, 226, 0.95);
        border: 1px solid rgba(184, 137, 56, 0.24);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        color: var(--ink-primary);
        font-variant-numeric: tabular-nums;
      }

      .world-dock-actions {
        display: flex;
        align-items: center;
        gap: 6px;
        overflow-x: auto;
        width: 100%;
      }

      .world-dock-btn {
        min-height: 34px;
        padding: 5px 10px;
        border-radius: 9px;
        border: 1px solid var(--border-hairline);
        background: #ffffff;
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
        cursor: pointer;
      }

      .world-dock-btn.active {
        background: #fff4dd;
        border-color: var(--gold);
        color: #845916;
      }

      .world-activity-banner {
        position: absolute;
        top: calc(56px + env(safe-area-inset-top));
        left: 50%;
        transform: translateX(-50%);
        padding: 7px 14px;
        border-radius: 12px;
        background: rgba(28, 19, 24, 0.9);
        border: 1px solid rgba(212, 175, 85, 0.5);
        color: #fff6e6;
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 600;
        display: none;
        align-items: center;
        gap: 10px;
        z-index: 6;
        max-width: 90vw;
        box-shadow: 0 6px 20px rgba(15, 10, 14, 0.28);
      }

      .world-activity-banner.visible {
        display: inline-flex;
      }

      .world-stop-btn {
        padding: 4px 10px;
        border-radius: 8px;
        border: 1px solid rgba(243, 205, 105, 0.65);
        background: linear-gradient(135deg, #c69742, #9e7326);
        color: #fffdf9;
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .world-action-overlay {
        position: fixed;
        inset: 0;
        z-index: 40;
        background: rgba(22, 14, 18, 0.54);
        display: none;
        align-items: flex-end;
        justify-content: center;
        padding: 14px;
      }

      .world-action-overlay.open {
        display: flex;
      }

      @media (min-width: 640px) {
        .world-action-overlay {
          align-items: center;
        }
      }

      .world-action-sheet {
        width: 100%;
        max-width: 410px;
        max-height: 74vh;
        overflow-y: auto;
        background: #fffaf5;
        border: 1px solid rgba(184, 137, 56, 0.45);
        border-radius: 20px;
        padding: 16px;
        box-shadow: 0 22px 54px rgba(18, 10, 15, 0.36);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .world-action-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(184, 137, 56, 0.22);
      }

      .world-action-title {
        margin: 0;
        font-family: var(--font-display);
        font-size: 22px;
        font-weight: 700;
        color: var(--ink-primary);
      }

      .world-action-item {
        width: 100%;
        min-height: 46px;
        padding: 9px 12px;
        border-radius: 12px;
        border: 1px solid rgba(184, 137, 56, 0.34);
        background: #ffffff;
        color: var(--ink-primary);
        font-family: var(--font-sans);
        text-align: left;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .world-action-item:active {
        background: #fff4df;
        transform: scale(0.99);
      }

      .world-action-item strong {
        font-size: 13px;
        font-weight: 700;
      }

      .world-action-item span {
        font-size: 11px;
        color: var(--ink-muted);
      }

      .world-dir-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding-bottom: 4px;
      }

      .world-dir-tab {
        min-height: 32px;
        padding: 4px 10px;
        border-radius: 9px;
        border: 1px solid rgba(184, 137, 56, 0.34);
        background: #ffffff;
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .world-dir-tab.active {
        background: linear-gradient(135deg, #c69742, #9e7326);
        border-color: #9f7328;
        color: #fffdf9;
      }
    `;
    document.head.appendChild(style);
  }

  function detectSoftwareWebGL() {
    try {
      const probe = document.createElement('canvas');
      const gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param) || '');
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch (_) {
      return true;
    }
  }

  function formatClock(hourVal) {
    const h24 = ((Math.floor(hourVal) % 24) + 24) % 24;
    const mins = Math.floor((hourVal - Math.floor(hourVal)) * 60);
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return h12 + ':' + String(mins).padStart(2, '0') + ' ' + ampm;
  }

  window.CrownScreens.game = {
    render: function () {
      const g = window.CrownGame;
      if (window.CrownSave) {
        window.CrownSave.ensureStateDefaults();
      }

      const shell = document.createElement('div');
      shell.className = 'world-shell';
      shell.id = 'screen-game';

      const canvasMount = document.createElement('div');
      canvasMount.className = 'world-canvas-mount';
      shell.appendChild(canvasMount);

      if (!window.THREE || !window.CrownCastle || !window.CrownPlayer || !window.CrownCamera) {
        const loadingNote = document.createElement('div');
        loadingNote.className = 'world-pill';
        loadingNote.style.position = 'absolute';
        loadingNote.style.top = '50%';
        loadingNote.style.left = '50%';
        loadingNote.style.transform = 'translate(-50%, -50%)';
        loadingNote.textContent = 'Preparing Versailles 3D Palace...';
        shell.appendChild(loadingNote);

        window.addEventListener(
          'crown:three-ready',
          function () {
            if (document.body.contains(shell)) {
              window.CrownMenu.go('game', { isBack: true });
            }
          },
          { once: true }
        );
        return shell;
      }

      const THREE = window.THREE;
      const isSoftwareGl = detectSoftwareWebGL();

      let renderer = null;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
        });
      } catch (err) {
        const errPill = document.createElement('div');
        errPill.className = 'world-pill';
        errPill.style.position = 'absolute';
        errPill.style.top = '50%';
        errPill.style.left = '50%';
        errPill.style.transform = 'translate(-50%, -50%)';
        errPill.textContent = 'WebGL unavailable: ' + (err && err.message ? err.message : 'context failed');
        shell.appendChild(errPill);
        return shell;
      }

      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      const qualityCap = g.settings.quality === 'low' ? 1 : g.settings.quality === 'medium' ? 1.5 : 2;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, qualityCap));
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(window.innerWidth || 390, window.innerHeight || 844);
      canvasMount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const skyHex = 0xc9e2f6;
      scene.background = new THREE.Color(skyHex);
      scene.fog = new THREE.FogExp2(skyHex, 0.0022);

      let envRT = null;
      if (window.CrownRoomEnvironment) {
        const pmrem = new THREE.PMREMGenerator(renderer);
        envRT = pmrem.fromScene(new window.CrownRoomEnvironment(), 0.04);
        scene.environment = envRT.texture;
        pmrem.dispose();
      }

      const aspect = (window.innerWidth || 390) / Math.max(1, window.innerHeight || 844);
      const camera = new THREE.PerspectiveCamera(aspect < 0.8 ? 58 : 54, aspect, 0.25, 420);

      // Warm Golden Sunlight & Cool Riviera Sky Fill
      const hemiLight = new THREE.HemisphereLight(0xd2ebff, 0x9b8669, 0.9);
      hemiLight.position.set(0, 65, 0);
      scene.add(hemiLight);

      const sunLight = new THREE.DirectionalLight(0xfff4dd, 1.95);
      sunLight.position.set(36, 52, 34);
      sunLight.castShadow = !isSoftwareGl;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 5;
      sunLight.shadow.camera.far = 150;
      const d = 56;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
      scene.add(sunLight);

      const rimLight = new THREE.DirectionalLight(0xd9ecff, 0.5);
      rimLight.position.set(-32, 24, -44);
      scene.add(rimLight);

      // Build French Baroque Château + Parterre Fountains + Distant Royals' Castles + Commoners' Village
      const crestHex = (g.household && g.household.crestColor) || '#b8324f';
      const castle = window.CrownCastle.buildVersaillesEstate(scene, renderer, {
        isSoftwareGl: isSoftwareGl,
        crestHex: crestHex,
      });

      const worldApi = {
        groundHeightAt: castle.groundHeightAt,
        resolveCollision: castle.resolveCollision,
      };

      // Reset unsafe old spawn or spawn cleanly along the Parterre Promenade
      if (!g.world) g.world = {};
      if (!g.world.playerPos || Math.abs(g.world.playerPos.z) > 53 || Math.abs(g.world.playerPos.x) > 92) {
        g.world.playerPos = { x: 2.8, y: 0, z: 18 };
        g.world.playerYaw = Math.PI;
      }

      // Active Customized Princess (sculpted mesh + planar face UV + flowing hair cards)
      const P = window.CrownPlayer;
      const playerCtrl = P.createController(scene, worldApi, g.princess, g.world);

      // Include any extra Household Royals created by player in CAS + 2 Ceremonial Portico Sentinels
      const actors = [];
      if (Array.isArray(g.roster) && g.roster.length > 1) {
        let extraIdx = 0;
        g.roster.forEach(function (member) {
          if (!member || (g.princess && member.firstName === g.princess.firstName)) return;
          extraIdx += 1;
          const mesh = P.buildRoyalCharacterMesh(member, {
            name: 'household-' + extraIdx,
            role: 'royal',
            showPlumbob: false,
          });
          const hx = extraIdx === 1 ? -4.2 : 4.2;
          const hz = extraIdx === 1 ? -23.0 : 12.0;
          mesh.root.position.set(hx, castle.groundHeightAt(hx, hz, 0), hz);
          mesh.root.rotation.y = extraIdx === 1 ? 0.35 : Math.PI;
          scene.add(mesh.root);
          actors.push({
            id: 'household-' + extraIdx,
            homeX: hx,
            homeZ: hz,
            patrolR: 1.6,
            phase: extraIdx * 1.4,
            mesh: mesh,
            prompt: 'Chat with ' + (member.title || 'Princess') + ' ' + (member.firstName || 'Kin'),
            onInteract: function () {
              g.needs.fun = Math.min(100, (g.needs.fun || 85) + 12);
              g.needs.composure = Math.min(100, (g.needs.composure || 85) + 8);
              g.toast('Warm royal conversation with ' + (member.firstName || 'your household') + ' (+12 Fun)');
            },
          });
        });
      }

      // 2 Palace Entrance Sentinels flanking the Open Arched Doors
      [
        { id: 'sentinel-left', x: -5.6, z: -15.5, yaw: 0 },
        { id: 'sentinel-right', x: 5.6, z: -15.5, yaw: 0 },
      ].forEach(function (sDef) {
        const mesh = P.buildRoyalCharacterMesh(
          {
            body: { sliders: { height: 1.04, shoulders: 1.12, hips: 0.92, waist: 0.94 } },
            look: { hairStyle: 'slick-gala' },
            wardrobe: { outfitId: 'equestrian-tailored', themeId: 'signature' },
          },
          { name: sDef.id, role: 'guard', dressHex: '#911d2c', trimHex: '#d9b04e', showPlumbob: false }
        );
        mesh.root.position.set(sDef.x, castle.groundHeightAt(sDef.x, sDef.z, 0), sDef.z);
        mesh.root.rotation.y = sDef.yaw;
        scene.add(mesh.root);
        actors.push({
          id: sDef.id,
          homeX: sDef.x,
          homeZ: sDef.z,
          patrolR: 0,
          phase: 0,
          mesh: mesh,
          prompt: 'Pass Royal Palace Guard',
          onInteract: function () {
            g.toast('Palace Guard bows: "Welcome inside Your Highness. Stairs to 2F await at the rear hall."');
          },
        });
      });

      // Camera Controller with Double-Tap Focus + Top-Down Mode
      let floorMode = 'auto';
      const camCtrl = window.CrownCamera.createController(camera, renderer.domElement, g.world, function () {
        camCtrl.resetCamera(playerCtrl.actor.root.rotation.y);
        g.toast('Focused on Princess');
      });
      camCtrl.update(0.016, playerCtrl.actor.root.position, castle.groundHeightAt, true);
      castle.updateCutaway(playerCtrl.actor.root.position, floorMode);

      if (window.CrownNeeds) {
        window.CrownNeeds.ensureNeeds(g);
      }

      // -----------------------------------------------------------
      // HUD OVERLAYS (Step 5: Zone Pill + Floor Switcher + Collapsible Dock)
      // -----------------------------------------------------------
      const topBar = document.createElement('div');
      topBar.className = 'world-topbar';

      const infoPill = document.createElement('div');
      infoPill.className = 'world-pill';
      const zoneSpan = document.createElement('span');
      const timeSpan = document.createElement('span');
      const moneySpan = document.createElement('span');
      moneySpan.className = 'world-pill-gold';
      infoPill.appendChild(zoneSpan);
      infoPill.appendChild(document.createTextNode(' · '));
      infoPill.appendChild(timeSpan);
      infoPill.appendChild(document.createTextNode(' · '));
      infoPill.appendChild(moneySpan);

      const topActions = document.createElement('div');
      topActions.className = 'world-top-actions';
      const btnSave = document.createElement('button');
      btnSave.type = 'button';
      btnSave.className = 'world-btn-sm';
      btnSave.textContent = 'Save';
      btnSave.addEventListener('click', function () {
        if (window.CrownSave) window.CrownSave.save(false);
      });

      const btnMenu = document.createElement('button');
      btnMenu.type = 'button';
      btnMenu.className = 'world-btn-sm';
      btnMenu.textContent = 'Menu';
      btnMenu.addEventListener('click', function () {
        if (window.CrownSave) window.CrownSave.save(true);
        window.CrownMenu.go('menu');
      });

      topActions.appendChild(btnSave);
      topActions.appendChild(btnMenu);
      topBar.appendChild(infoPill);
      topBar.appendChild(topActions);
      shell.appendChild(topBar);

      // Touch Thumbstick
      const joyZone = document.createElement('div');
      joyZone.className = 'world-joy-zone';
      const joyKnob = document.createElement('div');
      joyKnob.className = 'world-joy-knob';
      joyZone.appendChild(joyKnob);
      shell.appendChild(joyZone);

      let joyPointerId = null;
      const joyMaxR = 32;

      function updateJoyFromPoint(clientX, clientY) {
        const rect = joyZone.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + rect.height * 0.5;
        let dx = clientX - cx;
        let dy = clientY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist > joyMaxR && dist > 0) {
          dx = (dx / dist) * joyMaxR;
          dy = (dy / dist) * joyMaxR;
        }
        joyKnob.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
        playerCtrl.setJoystick(dx / joyMaxR, dy / joyMaxR, true);
      }

      joyZone.addEventListener('pointerdown', function (ev) {
        ev.stopPropagation();
        joyPointerId = ev.pointerId;
        if (joyZone.setPointerCapture) joyZone.setPointerCapture(ev.pointerId);
        updateJoyFromPoint(ev.clientX, ev.clientY);
      });

      joyZone.addEventListener('pointermove', function (ev) {
        if (ev.pointerId !== joyPointerId) return;
        updateJoyFromPoint(ev.clientX, ev.clientY);
      });

      function resetJoy(ev) {
        if (ev.pointerId !== joyPointerId) return;
        joyPointerId = null;
        joyKnob.style.transform = 'translate3d(0,0,0)';
        playerCtrl.setJoystick(0, 0, false);
      }
      joyZone.addEventListener('pointerup', resetJoy);
      joyZone.addEventListener('pointercancel', resetJoy);

      // Single Collapsible Bottom Dock
      const dockWrap = document.createElement('div');
      dockWrap.className = 'world-dock-wrap';

      const dockToggle = document.createElement('button');
      dockToggle.type = 'button';
      dockToggle.className = 'world-dock-toggle';
      dockToggle.textContent = '▾ Hide Controls (H)';
      dockToggle.addEventListener('click', function () {
        const collapsed = dockWrap.classList.toggle('collapsed');
        dockToggle.textContent = collapsed ? '▴ Show Controls (H)' : '▾ Hide Controls (H)';
        joyZone.style.display = collapsed ? 'none' : 'flex';
      });

      const dock = document.createElement('div');
      dock.className = 'world-dock';

      const rowTop = document.createElement('div');
      rowTop.className = 'world-dock-row';

      const interactBtn = document.createElement('button');
      interactBtn.type = 'button';
      interactBtn.className = 'world-interact-btn';
      interactBtn.disabled = true;

      const needsRow = document.createElement('div');
      needsRow.className = 'world-needs';
      const chipEnergy = document.createElement('span');
      chipEnergy.className = 'world-need-chip';
      const chipHunger = document.createElement('span');
      chipHunger.className = 'world-need-chip';
      const chipHygiene = document.createElement('span');
      chipHygiene.className = 'world-need-chip';
      const chipFun = document.createElement('span');
      chipFun.className = 'world-need-chip';
      const chipPoise = document.createElement('span');
      chipPoise.className = 'world-need-chip';
      const chipMood = document.createElement('span');
      chipMood.className = 'world-need-chip';
      needsRow.appendChild(chipEnergy);
      needsRow.appendChild(chipHunger);
      needsRow.appendChild(chipHygiene);
      needsRow.appendChild(chipFun);
      needsRow.appendChild(chipPoise);
      needsRow.appendChild(chipMood);

      rowTop.appendChild(interactBtn);
      rowTop.appendChild(needsRow);

      // Active Activity Floating Banner ("Sleeping deeply... [Stand Up]")
      const activityBanner = document.createElement('div');
      activityBanner.className = 'world-activity-banner';
      const activityText = document.createElement('span');
      const activityStopBtn = document.createElement('button');
      activityStopBtn.type = 'button';
      activityStopBtn.className = 'world-stop-btn';
      activityStopBtn.textContent = 'Stand Up';
      activityBanner.appendChild(activityText);
      activityBanner.appendChild(activityStopBtn);
      shell.appendChild(activityBanner);

      // Sims-4 Multi-Option Action Picker Sheet (shown when tapping bed/tub/table or Palace Actions)
      const actionOverlay = document.createElement('div');
      actionOverlay.className = 'world-action-overlay';
      const actionSheet = document.createElement('div');
      actionSheet.className = 'world-action-sheet';
      const actionHead = document.createElement('div');
      actionHead.className = 'world-action-head';
      const actionTitle = document.createElement('h3');
      actionTitle.className = 'world-action-title';
      const actionCloseBtn = document.createElement('button');
      actionCloseBtn.type = 'button';
      actionCloseBtn.className = 'world-btn-sm';
      actionCloseBtn.textContent = 'Close';
      actionHead.appendChild(actionTitle);
      actionHead.appendChild(actionCloseBtn);
      const actionList = document.createElement('div');
      actionList.style.display = 'flex';
      actionList.style.flexDirection = 'column';
      actionList.style.gap = '8px';
      actionSheet.appendChild(actionHead);
      actionSheet.appendChild(actionList);
      actionOverlay.appendChild(actionSheet);
      shell.appendChild(actionOverlay);

      function closeActionSheet() {
        actionOverlay.classList.remove('open');
      }
      actionCloseBtn.addEventListener('click', closeActionSheet);
      actionOverlay.addEventListener('click', function (ev) {
        if (ev.target === actionOverlay) closeActionSheet();
      });

      const interactMgr = window.CrownInteract
        ? window.CrownInteract.createManager({
            game: g,
            playerCtrl: playerCtrl,
            castle: castle,
            actors: actors,
            toast: g.toast,
            onStateChange: function (actState) {
              if (actState) {
                activityText.textContent = actState.statusText || actState.label;
                activityStopBtn.textContent =
                  actState.pose === 'sleep' || actState.pose === 'nap' ? 'Wake Up' : 'Stand Up';
                activityBanner.classList.add('visible');
              } else {
                activityBanner.classList.remove('visible');
              }
              syncHud(playerCtrl.actor.root.position);
            },
          })
        : null;

      activityStopBtn.addEventListener('click', function () {
        if (interactMgr) interactMgr.stopActivity(false);
      });

      function openObjectSheet(target, backCategory) {
        if (!target || !interactMgr) return;
        actionTitle.textContent = target.title || 'Royal Action';
        actionList.innerHTML = '';

        if (backCategory) {
          const backBtn = document.createElement('button');
          backBtn.type = 'button';
          backBtn.className = 'world-dir-tab';
          backBtn.style.alignSelf = 'flex-start';
          backBtn.textContent = '← Back to Directory';
          backBtn.addEventListener('click', function () {
            openPalaceDirectory(backCategory);
          });
          actionList.appendChild(backBtn);
        }

        const primaryAct = target.actions && target.actions[0];
        if (target.object && primaryAct && primaryAct.anchor) {
          const anc = primaryAct.anchor;
          const walkBtn = document.createElement('button');
          walkBtn.type = 'button';
          walkBtn.className = 'world-action-item';
          const wTitle = document.createElement('strong');
          wTitle.textContent = 'Go To Room / Inspect Area';
          const wHint = document.createElement('span');
          wHint.textContent = 'Walk directly up to ' + (target.title || 'location');
          walkBtn.appendChild(wTitle);
          walkBtn.appendChild(wHint);
          walkBtn.addEventListener('click', function () {
            closeActionSheet();
            floorMode = 'auto';
            btnFloorCutaway.textContent = 'Cutaway: Auto';
            btnFloorCutaway.classList.remove('active');
            const tx = typeof anc.exitX === 'number' ? anc.exitX : target.object.x;
            const tz = typeof anc.exitZ === 'number' ? anc.exitZ : target.object.z + 1.2;
            const ty = typeof anc.floorY === 'number' ? anc.floorY : (target.object.y || 0);
            const tyaw = typeof anc.exitYaw === 'number' ? anc.exitYaw : 0;
            playerCtrl.teleport(tx, tz, tyaw, ty);
            camCtrl.resetCamera(tyaw);
            syncHud(playerCtrl.actor.root.position);
          });
          actionList.appendChild(walkBtn);
        }

        (target.actions || []).forEach(function (act) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item';
          const titleEl = document.createElement('strong');
          titleEl.textContent = act.label;
          const hintEl = document.createElement('span');
          hintEl.textContent = act.hint || '';
          btn.appendChild(titleEl);
          btn.appendChild(hintEl);
          btn.addEventListener('click', function () {
            closeActionSheet();
            floorMode = 'auto';
            btnFloorCutaway.textContent = 'Cutaway: Auto';
            btnFloorCutaway.classList.remove('active');
            interactMgr.runAction(act);
            camCtrl.resetCamera(playerCtrl.actor.root.rotation.y);
          });
          actionList.appendChild(btn);
        });
        actionOverlay.classList.add('open');
      }

      let activeDirTab = 'living';
      function openPalaceDirectory(initialTab) {
        if (!interactMgr) return;
        if (typeof initialTab === 'string') activeDirTab = initialTab;
        actionTitle.textContent = 'Palace & Village Directory';
        actionList.innerHTML = '';

        const tabsRow = document.createElement('div');
        tabsRow.className = 'world-dir-tabs';
        const tabs = [
          { id: 'living', label: 'Living & Dining' },
          { id: 'bedrooms', label: '15 Bedrooms' },
          { id: 'toilets', label: '7 Toilets & Bath' },
          { id: 'cottages', label: '10 Cottages' },
          { id: 'gardens', label: 'Gardens' },
        ];

        const itemsBox = document.createElement('div');
        itemsBox.style.display = 'flex';
        itemsBox.style.flexDirection = 'column';
        itemsBox.style.gap = '7px';

        function renderTab(cat) {
          activeDirTab = cat;
          Array.prototype.forEach.call(tabsRow.children, function (el) {
            el.classList.toggle('active', el.dataset.cat === cat);
          });
          itemsBox.innerHTML = '';
          const list = interactMgr.listByCategory(cat);
          list.forEach(function (item) {
            const primary = item.actions && item.actions[0];
            if (!primary) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'world-action-item';
            const titleEl = document.createElement('strong');
            titleEl.textContent = item.title;
            const floorLabel =
              item.floor === 3
                ? '3F Mansard'
                : item.floor === 2
                ? '2F Suite'
                : item.floor === 1
                ? '1F Palace'
                : cat === 'cottages'
                ? 'Village Cottage'
                : 'Gardens';
            const hintEl = document.createElement('span');
            hintEl.textContent = floorLabel + ' · ' + primary.label;
            btn.appendChild(titleEl);
            btn.appendChild(hintEl);
            btn.addEventListener('click', function () {
              openObjectSheet({ title: item.title, actions: item.actions, object: item }, cat);
            });
            itemsBox.appendChild(btn);
          });
        }

        tabs.forEach(function (t) {
          const tb = document.createElement('button');
          tb.type = 'button';
          tb.className = 'world-dir-tab' + (t.id === activeDirTab ? ' active' : '');
          tb.dataset.cat = t.id;
          tb.textContent = t.label;
          tb.addEventListener('click', function () {
            renderTab(t.id);
          });
          tabsRow.appendChild(tb);
        });

        actionList.appendChild(tabsRow);
        actionList.appendChild(itemsBox);
        renderTab(activeDirTab);
        actionOverlay.classList.add('open');
      }

      const rowActions = document.createElement('div');
      rowActions.className = 'world-dock-actions';

      const btnPalaceMenu = document.createElement('button');
      btnPalaceMenu.type = 'button';
      btnPalaceMenu.className = 'world-dock-btn active';
      btnPalaceMenu.textContent = 'Directory (All Rooms)';
      btnPalaceMenu.addEventListener('click', function () {
        openPalaceDirectory();
      });

      const btnCas = document.createElement('button');
      btnCas.type = 'button';
      btnCas.className = 'world-dock-btn';
      btnCas.textContent = 'Atelier (CAS)';
      btnCas.addEventListener('click', function () {
        if (window.CrownSave) window.CrownSave.save(true);
        window.CrownMenu.go('creator');
      });

      const btnGardens = document.createElement('button');
      btnGardens.type = 'button';
      btnGardens.className = 'world-dock-btn';
      btnGardens.textContent = 'Gardens';
      btnGardens.addEventListener('click', function () {
        playerCtrl.teleport(2.8, 18, Math.PI, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnEnterHall = document.createElement('button');
      btnEnterHall.type = 'button';
      btnEnterHall.className = 'world-dock-btn';
      btnEnterHall.textContent = '1F Palace';
      btnEnterHall.addEventListener('click', function () {
        playerCtrl.teleport(0, -20.5, Math.PI, 0.65);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnGo2F = document.createElement('button');
      btnGo2F.type = 'button';
      btnGo2F.className = 'world-dock-btn';
      btnGo2F.textContent = '2F Suite';
      btnGo2F.addEventListener('click', function () {
        playerCtrl.teleport(-14.5, -23.0, Math.PI, 5.65);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnGo3F = document.createElement('button');
      btnGo3F.type = 'button';
      btnGo3F.className = 'world-dock-btn';
      btnGo3F.textContent = '3F Mansard';
      btnGo3F.addEventListener('click', function () {
        playerCtrl.teleport(5.4, -22.5, Math.PI, 10.65);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnGoCottages = document.createElement('button');
      btnGoCottages.type = 'button';
      btnGoCottages.className = 'world-dock-btn';
      btnGoCottages.textContent = 'Cottages';
      btnGoCottages.addEventListener('click', function () {
        playerCtrl.teleport(-45.5, 10.0, -Math.PI * 0.5, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(-Math.PI * 0.5);
      });

      const btnFloorCutaway = document.createElement('button');
      btnFloorCutaway.type = 'button';
      btnFloorCutaway.className = 'world-dock-btn';
      btnFloorCutaway.textContent = 'Cutaway: Auto';
      const modes = ['auto', '1f', '2f', '3f', 'exterior'];
      const modeLabels = {
        auto: 'Cutaway: Auto',
        '1f': 'Floor View: 1F',
        '2f': 'Floor View: 2F',
        '3f': 'Floor View: 3F',
        exterior: 'Exterior Roof',
      };
      btnFloorCutaway.addEventListener('click', function () {
        const nextIdx = (modes.indexOf(floorMode) + 1) % modes.length;
        floorMode = modes[nextIdx];
        btnFloorCutaway.textContent = modeLabels[floorMode];
        btnFloorCutaway.classList.toggle('active', floorMode !== 'auto');
        castle.updateCutaway(playerCtrl.actor.root.position, floorMode);
      });

      const btnCamMode = document.createElement('button');
      btnCamMode.type = 'button';
      btnCamMode.className = 'world-dock-btn';
      btnCamMode.textContent = 'Cam: Follow';
      const camModes = ['follow', 'topdown', 'scenic'];
      const camLabels = { follow: 'Cam: Follow', topdown: 'Cam: Top-Down', scenic: 'Cam: Scenic' };
      btnCamMode.addEventListener('click', function () {
        const nextCam = camModes[(camModes.indexOf(camCtrl.state.mode) + 1) % camModes.length];
        camCtrl.setMode(nextCam);
        btnCamMode.textContent = camLabels[nextCam];
        btnCamMode.classList.toggle('active', nextCam !== 'follow');
      });

      const btnSpeed = document.createElement('button');
      btnSpeed.type = 'button';
      btnSpeed.className = 'world-dock-btn';
      btnSpeed.textContent = 'Time: 1×';
      btnSpeed.addEventListener('click', function () {
        g.world.timeScale = g.world.timeScale === 1 ? 4 : 1;
        btnSpeed.textContent = 'Time: ' + g.world.timeScale + '×';
        btnSpeed.classList.toggle('active', g.world.timeScale > 1);
      });

      rowActions.appendChild(btnPalaceMenu);
      rowActions.appendChild(btnCas);
      rowActions.appendChild(btnGardens);
      rowActions.appendChild(btnEnterHall);
      rowActions.appendChild(btnGo2F);
      rowActions.appendChild(btnGo3F);
      rowActions.appendChild(btnGoCottages);
      rowActions.appendChild(btnFloorCutaway);
      rowActions.appendChild(btnCamMode);
      rowActions.appendChild(btnSpeed);

      dock.appendChild(rowTop);
      dock.appendChild(rowActions);
      dockWrap.appendChild(dockToggle);
      dockWrap.appendChild(dock);
      shell.appendChild(dockWrap);

      // Direct 3D Tap Raycasting on Furniture (tap bed, tub, shower, chairs, thrones, mirror, benches, fountains!)
      const raycaster = new THREE.Raycaster();
      const tapNdc = new THREE.Vector2();
      let tapDownX = 0;
      let tapDownY = 0;
      let tapDownTime = 0;

      function onCanvasPointerDown(ev) {
        if (ev.target !== renderer.domElement) return;
        tapDownX = ev.clientX;
        tapDownY = ev.clientY;
        tapDownTime = performance.now();
      }

      function onCanvasPointerUp(ev) {
        if (ev.target !== renderer.domElement) return;
        const dist = Math.hypot(ev.clientX - tapDownX, ev.clientY - tapDownY);
        const dtMs = performance.now() - tapDownTime;
        if (dist > 10 || dtMs > 300 || !interactMgr || !castle.interactiveMeshes) return;

        const rect = renderer.domElement.getBoundingClientRect();
        tapNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        tapNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(tapNdc, camera);
        const hits = raycaster.intersectObjects(castle.interactiveMeshes, true);
        for (let i = 0; i < hits.length; i++) {
          const hitObj = hits[i].object;
          if (!hitObj.visible) continue;
          let cur = hitObj;
          let foundId = null;
          while (cur) {
            if (cur.userData && cur.userData.interactId) {
              foundId = cur.userData.interactId;
              break;
            }
            cur = cur.parent;
          }
          if (foundId) {
            const resolvedTarget = interactMgr.getById(foundId);
            if (resolvedTarget) {
              openObjectSheet(resolvedTarget);
              break;
            }
          }
        }
      }
      renderer.domElement.addEventListener('pointerdown', onCanvasPointerDown);
      renderer.domElement.addEventListener('pointerup', onCanvasPointerUp);

      let currentTarget = null;
      function triggerPrimaryInteract() {
        if (interactMgr && interactMgr.getActiveActivity()) {
          interactMgr.stopActivity(false);
          return;
        }
        if (currentTarget) {
          if (window.CrownAudio) window.CrownAudio.playSelect();
          if (currentTarget.actions && currentTarget.actions.length === 1) {
            interactMgr.runAction(currentTarget.actions[0]);
          } else {
            openObjectSheet(currentTarget);
          }
        } else {
          openPalaceDirectory();
        }
      }

      interactBtn.addEventListener('click', triggerPrimaryInteract);

      function onWorldKeyDown(ev) {
        if (ev.code === 'KeyE') {
          triggerPrimaryInteract();
        } else if (ev.code === 'KeyH') {
          dockToggle.click();
        } else if (ev.code === 'Escape') {
          closeActionSheet();
          if (interactMgr) interactMgr.stopActivity(false);
        }
      }
      window.addEventListener('keydown', onWorldKeyDown);

      function syncHud(pos) {
        g.world.zone = castle.detectZone(pos);
        zoneSpan.textContent = g.world.zone;
        timeSpan.textContent = 'Day ' + (g.world.day || 1) + ' · ' + formatClock(g.world.hour || 10.5);
        moneySpan.textContent = window.CrownSave ? window.CrownSave.formatCrowns(g.money) : '₡' + g.money;

        chipEnergy.textContent = 'Energy ' + Math.round(g.needs.energy) + '%';
        chipHunger.textContent = 'Food ' + Math.round(g.needs.hunger) + '%';
        chipHygiene.textContent = 'Bath ' + Math.round(g.needs.hygiene) + '%';
        chipFun.textContent = 'Fun ' + Math.round(g.needs.fun || 100) + '%';
        chipPoise.textContent = 'Poise ' + Math.round(g.needs.composure) + '%';
        chipMood.textContent = 'Mood: ' + (g.needs.mood || 'Poised');

        const activeAct = interactMgr ? interactMgr.getActiveActivity() : null;
        if (activeAct) {
          interactBtn.disabled = false;
          interactBtn.innerHTML =
            '<span>' +
            (activeAct.pose === 'sleep' || activeAct.pose === 'nap' ? 'Wake Up From Bed' : 'Stand Up (' + activeAct.label + ')') +
            '</span><span>Tap / E</span>';
          currentTarget = null;
          return;
        }

        const nearest = interactMgr ? interactMgr.getNearest(pos) : null;
        currentTarget = nearest;
        interactBtn.disabled = false;
        if (nearest) {
          interactBtn.innerHTML = '<span>' + nearest.title + '</span><span>Use / E</span>';
        } else {
          interactBtn.innerHTML = '<span>Tap Bed, Tub, Chair or Open Palace Actions</span><span>Actions</span>';
        }
      }

      syncHud(playerCtrl.actor.root.position);

      const _daySky = new THREE.Color(0xc9e2f6);
      const _sunsetSky = new THREE.Color(0xf2cfb8);
      const _nightSky = new THREE.Color(0x1f2840);
      const _curSky = new THREE.Color();

      let lastTimeMs = performance.now();
      let hudTickAccum = 0;
      let frameHandle = 0;
      let active = true;
      let hasMounted = false;

      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      function afterDraw(cb) {
        const gl = renderer.getContext();
        const sync = gl && gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
        if (!sync || !gl.getSyncParameter) {
          frameHandle = window.setTimeout(cb, 80);
          return;
        }
        gl.flush();
        function poll() {
          if (!active) {
            gl.deleteSync(sync);
            return;
          }
          const state = gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            frameHandle = window.setTimeout(poll, 5);
          } else {
            gl.deleteSync(sync);
            frameHandle = window.setTimeout(cb, 80);
          }
        }
        frameHandle = window.setTimeout(poll, 5);
      }

      function onResize() {
        const w = Math.max(1, window.innerWidth || shell.clientWidth || 390);
        const h = Math.max(1, window.innerHeight || shell.clientHeight || 844);
        const asp = w / h;
        camera.aspect = asp;
        camera.fov = asp < 0.8 ? 58 : 54;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, qualityCap));
      }
      window.addEventListener('resize', onResize);

      function cleanup() {
        if (!active && !envRT) return;
        active = false;
        cancelAnimationFrame(frameHandle);
        clearTimeout(frameHandle);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', onWorldKeyDown);
        renderer.domElement.removeEventListener('pointerdown', onCanvasPointerDown);
        renderer.domElement.removeEventListener('pointerup', onCanvasPointerUp);
        if (interactMgr) interactMgr.stopActivity(true);
        camCtrl.dispose();
        playerCtrl.dispose();
        castle.dispose();
        actors.forEach(function (a) {
          a.mesh.dispose();
        });
        scene.traverse(function (obj) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(function (m) {
                m.dispose();
              });
            } else {
              obj.material.dispose();
            }
          }
        });
        if (envRT) {
          envRT.dispose();
          envRT = null;
        }
        renderer.dispose();
      }

      window.addEventListener('crowngame:screenchange', function onLeave(ev) {
        if (ev.detail && ev.detail.screen !== 'game') {
          window.removeEventListener('crowngame:screenchange', onLeave);
          cleanup();
        }
      });

      function tick() {
        if (!active) return;

        if (document.body.contains(shell)) {
          if (!hasMounted) {
            hasMounted = true;
            onResize();
          }
        } else if (hasMounted) {
          cleanup();
          return;
        } else {
          frameHandle = requestAnimationFrame(tick);
          return;
        }

        const nowMs = performance.now();
        const delta = Math.min((nowMs - lastTimeMs) / 1000, 0.1);
        lastTimeMs = nowMs;
        const elapsed = nowMs * 0.001;

        const pInfo = playerCtrl.update(delta, camCtrl.state.yaw, elapsed);
        camCtrl.update(delta, pInfo.position, castle.groundHeightAt, false);
        castle.updateCutaway(pInfo.position, floorMode);
        castle.update(elapsed);

        if (window.CrownNeeds) {
          window.CrownNeeds.tick(delta, interactMgr ? interactMgr.getActiveActivity() : null, g);
        }

        // Day / Sunset / Night Cycle
        const prevDay = g.world.day || 1;
        g.world.hour = (g.world.hour || 10.5) + delta * 0.07 * (g.world.timeScale || 1);
        if (g.world.hour >= 24) {
          g.world.hour -= 24;
          g.world.day = prevDay + 1;
          if (window.CrownSave) window.CrownSave.grantAllowanceIfNewWeek(prevDay, g.world.day);
        }

        const hr = g.world.hour;
        if (hr >= 6 && hr < 17) {
          _curSky.copy(_daySky);
          sunLight.intensity = 1.95;
          hemiLight.intensity = 0.9;
        } else if (hr >= 17 && hr < 20) {
          const t = (hr - 17) / 3;
          _curSky.copy(_daySky).lerp(_sunsetSky, Math.sin(t * Math.PI));
          sunLight.intensity = 1.95 - t * 0.85;
          hemiLight.intensity = 0.85 - t * 0.25;
        } else {
          _curSky.copy(_nightSky);
          sunLight.intensity = 0.68;
          hemiLight.intensity = 0.48;
        }
        scene.background.copy(_curSky);
        scene.fog.color.copy(_curSky);

        // Gentle Household Member Strolls
        actors.forEach(function (act) {
          if (act.patrolR <= 0) {
            act.mesh.headGroup.rotation.y = Math.sin(elapsed * 0.85 + act.phase) * 0.12;
            return;
          }
          act.phase += delta * 0.36;
          const nx = act.homeX + Math.sin(act.phase) * act.patrolR;
          const nz = act.homeZ + Math.cos(act.phase * 0.7) * (act.patrolR * 0.45);
          const dx = nx - act.mesh.root.position.x;
          const dz = nz - act.mesh.root.position.z;
          act.mesh.root.position.set(nx, castle.groundHeightAt(nx, nz, 0), nz);
          if (Math.abs(dx) + Math.abs(dz) > 0.001) {
            act.mesh.root.rotation.y = Math.atan2(dx, dz);
          }
          const step = Math.sin(elapsed * 4.0 + act.phase) * 0.25;
          act.mesh.leftLeg.rotation.x = step;
          act.mesh.rightLeg.rotation.x = -step;
          if (act.mesh.leftKnee) act.mesh.leftKnee.rotation.x = Math.max(0, Math.sin(elapsed * 4.0 + act.phase + 0.4) * 0.22);
          if (act.mesh.rightKnee) act.mesh.rightKnee.rotation.x = Math.max(0, Math.sin(-(elapsed * 4.0 + act.phase) + 0.4) * 0.22);
          act.mesh.leftArm.rotation.x = -step * 0.55;
          act.mesh.rightArm.rotation.x = step * 0.55;
        });

        hudTickAccum += delta;
        if (hudTickAccum >= 0.18) {
          hudTickAccum = 0;
          syncHud(pInfo.position);
        }

        renderer.render(scene, camera);

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameHandle = requestAnimationFrame(tick);
        }
      }

      frameHandle = requestAnimationFrame(tick);
      return shell;
    },
  };
})();
