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

      .world-converse-overlay {
        position: fixed;
        inset: 0;
        z-index: 44;
        display: none;
        align-items: flex-end;
        justify-content: center;
        padding: 14px 14px calc(18px + env(safe-area-inset-bottom));
        background: rgba(16, 10, 14, 0.28);
      }

      .world-converse-overlay.open {
        display: flex;
      }

      .world-converse-card {
        width: 100%;
        max-width: 520px;
        background: rgba(255, 250, 244, 0.98);
        border: 2px solid rgba(184, 137, 56, 0.65);
        border-radius: 20px;
        padding: 15px 16px;
        box-shadow: 0 22px 54px rgba(18, 10, 15, 0.38);
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .world-converse-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }

      .world-converse-name {
        margin: 0;
        font-family: var(--font-display);
        font-size: 20px;
        font-weight: 700;
        color: var(--ink-primary);
      }

      .world-converse-badge {
        display: inline-block;
        padding: 3px 9px;
        border-radius: 8px;
        background: #fff2d6;
        border: 1px solid rgba(184, 137, 56, 0.45);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        color: #7c5111;
      }

      .world-converse-bubble {
        padding: 10px 12px;
        border-radius: 12px;
        background: #ffffff;
        border: 1px solid rgba(184, 137, 56, 0.25);
        font-family: var(--font-sans);
        font-size: 13px;
        line-height: 1.45;
        color: var(--ink-primary);
      }

      .world-converse-choices {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 7px;
      }

      .world-converse-btn {
        min-height: 38px;
        padding: 7px 10px;
        border-radius: 11px;
        border: 1px solid rgba(184, 137, 56, 0.4);
        background: #ffffff;
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        text-align: center;
      }

      .world-converse-btn:active {
        background: #fff3da;
        transform: scale(0.98);
      }

      .world-converse-btn.bye {
        background: linear-gradient(135deg, #b8324f, #8f223a);
        border-color: #7a1c31;
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
      renderer.toneMappingExposure = 1.16;

      const qualityCap = g.settings.quality === 'low' ? 1 : g.settings.quality === 'medium' ? 1.25 : 1.5;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, qualityCap));
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(window.innerWidth || 390, window.innerHeight || 844);
      canvasMount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const skyHex = 0xcce4f8;
      scene.background = new THREE.Color(skyHex);
      scene.fog = new THREE.FogExp2(skyHex, 0.0017);

      let envRT = null;
      if (window.CrownRoomEnvironment) {
        const pmrem = new THREE.PMREMGenerator(renderer);
        envRT = pmrem.fromScene(new window.CrownRoomEnvironment(), 0.04);
        scene.environment = envRT.texture;
        pmrem.dispose();
      }

      const aspect = (window.innerWidth || 390) / Math.max(1, window.innerHeight || 844);
      const camera = new THREE.PerspectiveCamera(aspect < 0.8 ? 58 : 54, aspect, 0.25, 420);

      // Procedural Atmospheric SkyDome (Zenith gradient + Horizon glow + Sun disc + Twilight stars)
      const skyUniforms = {
        uTopColor: { value: new THREE.Color(0x7cb6ec) },
        uHorizonColor: { value: new THREE.Color(0xe6f0fa) },
        uSunDir: { value: new THREE.Vector3(0.55, 0.72, 0.42).normalize() },
        uSunColor: { value: new THREE.Color(0xfff4d6) },
        uNightMix: { value: 0.0 },
      };
      const skyGeo = new THREE.SphereGeometry(285, 24, 16);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: skyUniforms,
        vertexShader: [
          'varying vec3 vWorldDir;',
          'void main() {',
          '  vWorldDir = normalize(position);',
          '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
          '}',
        ].join('\n'),
        fragmentShader: [
          'uniform vec3 uTopColor;',
          'uniform vec3 uHorizonColor;',
          'uniform vec3 uSunDir;',
          'uniform vec3 uSunColor;',
          'uniform float uNightMix;',
          'varying vec3 vWorldDir;',
          'void main() {',
          '  vec3 dir = normalize(vWorldDir);',
          '  float h = clamp(dir.y, 0.0, 1.0);',
          '  vec3 col = mix(uHorizonColor, uTopColor, pow(h, 0.55));',
          '  float sunAmt = max(dot(dir, normalize(uSunDir)), 0.0);',
          '  col += uSunColor * pow(sunAmt, 14.0) * 0.35 * (1.0 - uNightMix);',
          '  col += uSunColor * smoothstep(0.996, 0.9992, sunAmt) * 0.9 * (1.0 - uNightMix);',
          '  if (uNightMix > 0.05 && dir.y > 0.06) {',
          '    float starSeed = fract(sin(dot(floor(dir * 260.0), vec3(12.9898, 78.233, 37.719))) * 43758.5453);',
          '    if (starSeed > 0.994) col += vec3(0.9, 0.94, 1.0) * uNightMix * (0.4 + 0.6 * h);',
          '  }',
          '  gl_FragColor = vec4(col, 1.0);',
          '}',
        ].join('\n'),
      });
      const skyDome = new THREE.Mesh(skyGeo, skyMat);
      skyDome.frustumCulled = false;
      scene.add(skyDome);

      // Warm Golden Sunlight & Cool Riviera Sky Fill (Player-tracking shadows cover all of Town!)
      const hemiLight = new THREE.HemisphereLight(0xdaf0ff, 0x76915a, 1.18);
      hemiLight.position.set(0, 65, 0);
      scene.add(hemiLight);

      const sunLight = new THREE.DirectionalLight(0xfff1d2, 2.15);
      sunLight.position.set(36, 52, 34);
      sunLight.castShadow = !isSoftwareGl;
      const sunShadowRes = isSoftwareGl ? 512 : g.settings.quality === 'low' ? 768 : g.settings.quality === 'medium' ? 1024 : 1536;
      sunLight.shadow.mapSize.width = sunShadowRes;
      sunLight.shadow.mapSize.height = sunShadowRes;
      sunLight.shadow.camera.near = 5;
      sunLight.shadow.camera.far = 165;
      const d = 38;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.025;
      scene.add(sunLight);
      scene.add(sunLight.target);

      const rimLight = new THREE.DirectionalLight(0xd9ecff, 0.52);
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
        isInPool: castle.isInPool,
      };

      // Reset unsafe old spawn or spawn cleanly along the Parterre Promenade
      if (!g.world) g.world = {};
      if (!g.world.playerPos || Math.abs(g.world.playerPos.z) > 68 || Math.abs(g.world.playerPos.x) > 162) {
        g.world.playerPos = { x: 2.8, y: 0, z: 18 };
        g.world.playerYaw = Math.PI;
      }

      // Active Customized Princess (sculpted mesh + planar face UV + flowing hair cards + blinking eyelids)
      const P = window.CrownPlayer;
      const playerCtrl = P.createController(scene, worldApi, g.princess, g.world);

      function tagActorMesh(rootObj, npcId) {
        rootObj.userData.interactId = 'npc_' + npcId;
        rootObj.traverse(function (ch) {
          ch.userData.interactId = 'npc_' + npcId;
        });
      }

      // -----------------------------------------------------------
      // TOWN SERVICES MODULE (Hospital & Civic Citizen Care)
      // -----------------------------------------------------------
      function initTownServices() {
        const spotsMap = (castle && castle.spots) || {};
        if (!Array.isArray(g.medicalCheckups)) g.medicalCheckups = [];
        if (!g.citizenHealthLog) g.citizenHealthLog = {};

        function tagServiceGroup(grp, spotId) {
          grp.userData.interactId = spotId;
          grp.traverse(function (ch) {
            ch.userData.interactId = spotId;
          });
          if (castle && Array.isArray(castle.interactiveMeshes)) {
            castle.interactiveMeshes.push(grp);
          }
        }

        function recordCitizenCheckup(citizenName, summaryNote) {
          const dayNum = (g.world && g.world.day) || 1;
          g.citizenHealthLog[citizenName] = { day: dayNum, status: 'Cleared (Healthy)' };
          g.medicalCheckups.unshift({
            day: dayNum,
            citizen: citizenName,
            note: summaryNote || 'Vitals normal · Clean bill of health',
          });
          if (g.medicalCheckups.length > 20) g.medicalCheckups.length = 20;
        }

        // Build Citizen Medical Check-Up Reception & Triage Kiosk inside Hôpital Royal (x: 82.1, z: -25.0, facing -X)
        const checkupDeskGrp = new THREE.Group();
        const deskWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf7fafc, roughness: 0.35 });
        const deskTealMat = new THREE.MeshStandardMaterial({ color: 0x1d7a8c, roughness: 0.4 });
        const deskRedMat = new THREE.MeshStandardMaterial({ color: 0xb8283c, roughness: 0.35 });
        const deskMetalMat = new THREE.MeshStandardMaterial({ color: 0xd0d8e0, metalness: 0.65, roughness: 0.25 });

        const counterBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 0.72), deskWhiteMat);
        counterBase.position.set(0, 0.5, 0);
        const counterTop = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.82), deskTealMat);
        counterTop.position.set(0, 1.02, 0);
        const emblemH = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.05), deskRedMat);
        emblemH.position.set(0, 0.58, 0.37);
        const emblemV = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.42, 0.05), deskRedMat);
        emblemV.position.set(0, 0.58, 0.37);
        const monitorStand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.25, 8), deskMetalMat);
        monitorStand.position.set(-0.52, 1.18, 0);
        const monitorScreen = new THREE.Mesh(
          new THREE.BoxGeometry(0.46, 0.3, 0.04),
          new THREE.MeshStandardMaterial({ color: 0x0e2a38, emissive: 0x176d84, emissiveIntensity: 0.45 })
        );
        monitorScreen.position.set(-0.52, 1.38, 0);
        const bloodPressureCuff = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.24), deskWhiteMat);
        bloodPressureCuff.position.set(0.42, 1.12, 0.06);
        const chartTray = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.05, 0.24), deskRedMat);
        chartTray.position.set(0.05, 1.08, 0.12);

        checkupDeskGrp.add(counterBase, counterTop, emblemH, emblemV, monitorStand, monitorScreen, bloodPressureCuff, chartTray);
        checkupDeskGrp.rotation.y = -Math.PI * 0.5;
        checkupDeskGrp.position.set(82.1, 0.12, -25.0);
        scene.add(checkupDeskGrp);
        tagServiceGroup(checkupDeskGrp, 'hospital_citizen_checkup');

        spotsMap.hospital_citizen_checkup = {
          id: 'hospital_citizen_checkup',
          title: 'Hospital — Citizen Medical Check-Up Desk',
          floor: 0,
          category: 'town',
          shortcut: true,
          x: 82.1,
          y: 0.12,
          z: -25.0,
          radius: 4.0,
          actions: [
            {
              id: 'citizen_general_checkup',
              label: 'Free Citizen Medical Check-Up & Vitals',
              hint: 'Blood pressure, heartbeat & wellness chart · +35 Energy, +25 Bath, +15 Poise',
              instant: true,
              onInstant: function (actCtx) {
                if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 35, hygiene: 25, composure: 15, hunger: 10 });
                recordCitizenCheckup((g.princess && g.princess.firstName) || 'Crown Heiress', 'BP 112/72 · Pulse 68 bpm · Full Clearance');
                if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 3);
                actCtx.toast('Medical Check-Up complete! Vitals 112/72 · +35 Energy, +25 Hygiene, +3 Clout.');
              },
            },
            {
              id: 'screen_citizen_patient',
              label: 'Perform Check-Up for Citizens (+₡95 Grant)',
              hint: 'Examine waiting citizens & earn +₡95 Civic Grant & +4 Clout',
              instant: true,
              onInstant: function (actCtx) {
                actCtx.game.money = (actCtx.game.money || 0) + 95;
                if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 14, fun: 8, energy: -4 });
                recordCitizenCheckup('Town Citizens (Clinic Screening)', '5 citizens examined & issued health certificates');
                if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
                g.gossipLog.unshift({
                  day: (g.world && g.world.day) || 1,
                  text: 'Crown Dispatch Health: Princess leads free citizen medical check-ups at Hôpital Royal de Versailles!',
                });
                if (g.gossipLog.length > 24) g.gossipLog.length = 24;
                if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 4);
                actCtx.toast('Examined citizens at Hôpital Royal! Earned +₡95 Crowns & +4 Clout.');
              },
            },
          ],
        };

        // Build North Lobby Citizen Immunization & Vital Screening Booth inside Hôpital Royal (x: 77.0, z: -26.8)
        const vitalBoothGrp = new THREE.Group();
        const stoolBase = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.5, 10), deskMetalMat);
        stoolBase.position.set(0, 0.25, 0);
        const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.72), deskWhiteMat);
        tableTop.position.set(0, 0.92, 0);
        const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), deskMetalMat);
        legL.position.set(-0.6, 0.45, 0);
        const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), deskMetalMat);
        legR.position.set(0.6, 0.45, 0);
        const vaccineCase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.22, 0.28), deskTealMat);
        vaccineCase.position.set(0.2, 1.07, 0);
        const chartStand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.16, 1.55, 10), deskMetalMat);
        chartStand.position.set(-0.95, 0.78, -0.1);
        vitalBoothGrp.add(stoolBase, tableTop, legL, legR, vaccineCase, chartStand);
        vitalBoothGrp.position.set(77.0, 0.12, -26.8);
        scene.add(vitalBoothGrp);
        tagServiceGroup(vitalBoothGrp, 'hospital_citizen_clinic');

        spotsMap.hospital_citizen_clinic = {
          id: 'hospital_citizen_clinic',
          title: 'Hospital — Citizen Wellness & Vaccine Booth',
          floor: 0,
          category: 'town',
          x: 77.0,
          y: 0.12,
          z: -26.8,
          radius: 3.6,
          actions: [
            {
              id: 'citizen_vaccine_shot',
              label: 'Royal Immunity Booster & Screening (₡15)',
              hint: '+60 Energy, +40 Hygiene & full Citizen Immunity Clearance',
              instant: true,
              onInstant: function (actCtx) {
                if ((actCtx.game.money || 0) < 15) return actCtx.toast('Need ₡15 Crowns.');
                actCtx.game.money -= 15;
                if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 60, hygiene: 40, composure: 12 });
                recordCitizenCheckup((g.princess && g.princess.firstName) || 'Crown Heiress', 'Annual Immunity Booster · Cleared');
                actCtx.toast('Immunity Booster administered! (+60 Energy, +40 Hygiene)');
              },
            },
            {
              id: 'check_citizen_heart',
              label: 'Check Citizen Heartbeat & Wellness',
              hint: 'Free preventative heart screening · +18 Poise & +14 Energy',
              instant: true,
              onInstant: function (actCtx) {
                if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 18, energy: 14, fun: 8 });
                recordCitizenCheckup('Willow Creek Citizens', 'Preventative Cardio & Wellness Screen');
                actCtx.toast('Heartbeat & Blood Pressure look strong! (+18 Poise, +14 Energy)');
              },
            },
          ],
        };

        const servicesCatalog = [
          {
            id: 'hospital',
            name: 'Hospital',
            title: 'Hôpital Royal de Versailles (Hospital)',
            subtitle: 'ER Trauma, Operating Theater, 5 Ward Bays, 2 Private VIP Suites, Green Healing Garden & Ambulance',
            x: 79.6,
            y: 0.12,
            z: -16.2,
            yaw: Math.PI,
            checkupSpotIds: [
              'hospital_citizen_checkup',
              'hospital_citizen_clinic',
              'hospital_nurses_station',
              'hospital_exam',
              'hospital_pharmacy',
              'hospital_garden',
              'hospital_bed_1',
              'hospital_bed_2',
              'hospital_bed_3',
              'hospital_bed_4',
              'hospital_bed_5',
              'hospital_bed_6',
              'hospital_bed_7',
              'hosp_waiting_sofa',
              'hosp_vip_chair_2',
            ],
          },
          { id: 'farm', name: 'Farm', title: 'Greenfields Royal Farm', spotId: 'farm_harvest_crops', x: -122.0, y: 0, z: -30.5, yaw: Math.PI },
          { id: 'bakery', name: 'Bakery', title: 'Maison Brioche Bakery', spotId: 'bakery_counter', x: -81.0, y: 0, z: 34.5, yaw: Math.PI },
          { id: 'supermarket', name: 'Supermarket', title: 'Marché Royale Supermarket', spotId: 'market_checkout', x: -111.0, y: 0, z: 34.5, yaw: Math.PI },
          { id: 'pizzeria', name: 'Pizza Place', title: 'Palazzo Napoli Pizza Place', spotId: 'pizza_cashier', x: -139.0, y: 0, z: 34.5, yaw: Math.PI },
          { id: 'seamstress', name: 'Seamstress', title: 'Maison de Couture Seamstress', spotId: 'seamstress_fitting', x: 79.6, y: 0, z: 34.5, yaw: Math.PI },
          { id: 'shopping', name: 'Shopping', title: 'Galerie Royale Shopping Place', spotId: 'shop_cashier', x: 106.5, y: 0, z: 34.5, yaw: Math.PI },
          { id: 'club', name: 'Nightclub', title: 'Club Couronne Privé', spotId: 'club_dj', x: 133.6, y: 0, z: 34.5, yaw: Math.PI },
          { id: 'stables', name: 'Horse Stables', title: 'Royal Equestrian Stables', spotId: 'horse_1', x: -131.0, y: 0, z: 9.5, yaw: -Math.PI * 0.5 },
          { id: 'pool', name: 'Swimming Pool', title: 'Villa Azure Resort Pool', spotId: 'azure_pool_swim', x: 79.6, y: 0.24, z: 22.0, yaw: Math.PI },
          { id: 'hotel', name: 'Hotel', title: 'Grand Hôtel Impérial', spotId: 'hotel_concierge', x: 133.6, y: 0, z: 10.5, yaw: Math.PI },
        ];

        return {
          locations: servicesCatalog,
          recordCitizenCheckup: recordCitizenCheckup,
          getCheckupSpots: function () {
            const out = [];
            servicesCatalog[0].checkupSpotIds.forEach(function (sid) {
              if (spotsMap[sid]) out.push(spotsMap[sid]);
            });
            return out;
          },
        };
      }

      const townServices = initTownServices();
      castle.townServices = townServices;
      g.townServices = townServices;

      // Include any extra Household Royals created by player in CAS + Guards + Staff + Townspeople
      const actors = [];
      if (Array.isArray(g.roster) && g.roster.length > 1) {
        let extraIdx = 0;
        g.roster.forEach(function (member) {
          if (!member || (g.princess && member.firstName === g.princess.firstName)) return;
          extraIdx += 1;
          const aid = 'household-' + extraIdx;
          const mesh = P.buildRoyalCharacterMesh(member, {
            name: aid,
            role: 'royal',
            showPlumbob: false,
          });
          const hx = extraIdx === 1 ? -4.2 : 4.2;
          const hz = extraIdx === 1 ? -23.0 : 12.0;
          mesh.root.position.set(hx, castle.groundHeightAt(hx, hz, 0), hz);
          mesh.root.rotation.y = extraIdx === 1 ? 0.35 : Math.PI;
          tagActorMesh(mesh.root, aid);
          scene.add(mesh.root);
          actors.push({
            id: aid,
            role: 'friend',
            actorCategory: 'friend',
            name: (member.title || 'Princess') + ' ' + (member.firstName || 'Kin'),
            roleLabel: 'Royal Household',
            homeX: hx,
            homeY: castle.groundHeightAt(hx, hz, 0),
            homeZ: hz,
            patrolR: 1.6,
            phase: extraIdx * 1.4,
            mesh: mesh,
            prompt: 'Talk with ' + (member.title || 'Princess') + ' ' + (member.firstName || 'Kin'),
            greetLine: 'Sister! Come walk with me — what gossip have you heard around the Château today?',
            dutyLine: 'Our dynasty spans all 7 Château floors, both car pavilions, Greenfields Farm, and Riviera Town.',
            gossipLine: 'Word in the Salon is the Crown Dispatch photographers are watching Club Couronne & Grand Hôtel tonight!',
            flirtLine: 'Only someone with royal blood could look that radiant under the Versailles chandeliers.',
            isTalking: false,
            onInteract: function () {
              g.needs.fun = Math.min(100, (g.needs.fun || 85) + 12);
              g.needs.composure = Math.min(100, (g.needs.composure || 85) + 8);
            },
          });
        });
      }

      // 8 Uniformed Royal Palace Guards (Portico, Courtyard Steps, 1F Hall & Ballroom, 2F Gallery, 4F Vault, 7F Penthouse)
      [
        { id: 'sentinel-left', name: 'Portico Sentinel Valmont', x: -5.6, y: 0, z: -15.5, yaw: 0, place: 'Grand Portico West' },
        { id: 'sentinel-right', name: 'Portico Sentinel DeVries', x: 5.6, y: 0, z: -15.5, yaw: 0, place: 'Grand Portico East' },
        { id: 'guard-steps-west', name: 'Courtyard Guard Moreau', x: -12.5, y: 0, z: -6.5, yaw: 0.2, place: 'Courtyard Steps West' },
        { id: 'guard-steps-east', name: 'Courtyard Guard Delacroix', x: 12.5, y: 0, z: -6.5, yaw: -0.2, place: 'Courtyard Steps East' },
        { id: 'guard-hall-1f', name: 'Captain of the Hall Laurent', x: -4.8, y: 0.65, z: -24.5, yaw: 0.4, place: '1F Hall of Mirrors' },
        { id: 'guard-ballroom-1f', name: 'Throne Guard Girard', x: 11.2, y: 0.65, z: -31.0, yaw: -0.35, place: '1F Grand Ballroom' },
        { id: 'guard-gallery-2f', name: 'Gallery Guard Chevalier', x: -6.2, y: 5.65, z: -20.5, yaw: 0.15, place: '2F State Gallery' },
        { id: 'guard-vault-4f', name: 'Treasury Vault Guard Renaud', x: -5.5, y: 15.65, z: -24.0, yaw: 0.25, place: '4F Crown Vault' },
      ].forEach(function (sDef, gi) {
        const mesh = P.buildRoyalCharacterMesh(
          {
            body: { sliders: { height: 1.05, shoulders: 1.12, hips: 0.92, waist: 0.94 } },
            look: { hairStyle: 'slick-gala' },
            wardrobe: { outfitId: 'equestrian-tailored', themeId: 'signature' },
          },
          { name: sDef.id, role: 'guard', dressHex: '#911d2c', trimHex: '#d9b04e', showPlumbob: false }
        );
        mesh.root.position.set(sDef.x, typeof sDef.y === 'number' ? sDef.y : castle.groundHeightAt(sDef.x, sDef.z, 0), sDef.z);
        mesh.root.rotation.y = sDef.yaw;
        tagActorMesh(mesh.root, sDef.id);
        scene.add(mesh.root);
        actors.push({
          id: sDef.id,
          role: 'guard',
          actorCategory: 'guard',
          name: sDef.name,
          roleLabel: 'Royal Guard (' + sDef.place + ')',
          homeX: sDef.x,
          homeY: sDef.y || 0,
          homeZ: sDef.z,
          patrolR: 0,
          phase: gi * 0.9,
          mesh: mesh,
          prompt: 'Talk to ' + sDef.name,
          greetLine: 'At your service, Your Highness! All security posts from 1F Portico up to 7F Penthouse & both Auto Pavilions are secure.',
          dutyLine: 'My post is the ' + sDef.place + '. Eight Royal Guards keep watch across every wing of the Château.',
          gossipLine: 'Rumour says a foreign diplomat was seen stepping out of the Obsidian Limousine near the West Pavilion!',
          flirtLine: 'Careful, Princess — flirting with a uniformed Guard of the Realm might headline tomorrow’s Crown Dispatch!',
          isTalking: false,
          onInteract: function () {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 4, fun: 4 });
          },
        });
      });

      // Palace Butlers, Maids, Chefs, Chauffeurs, Medical Doctors/Nurses, Close Friends & Citizens (each with proper uniform & NO spurious tiaras!)
      [
        {
          id: 'butler-henri', role: 'butler', name: 'Head Butler Henri', roleLabel: 'Palace Major-Domo (1F)',
          x: 2.2, z: -21.0, y: 0.65, patrolR: 1.1, dressHex: '#1b1d26', trimHex: '#d4af55', hairStyle: 'slick-gala',
          waypoints: [
            { x: 2.2, z: -21.0, pause: 3.2 },
            { x: 2.2, z: -26.5, pause: 2.4 },
            { x: -3.2, z: -26.5, pause: 2.8 },
            { x: -3.2, z: -21.0, pause: 2.5 },
          ],
          prompt: 'Speak to Head Butler Henri',
          msg: 'Good day, Your Highness! All seven Château floors, silver tea trays, and your Royal Motorcade are ready.',
          duty: 'I oversee our team of uniformed Palace Butlers, chambermaids, kitchen brigade, and evening galas.',
          gossip: 'Word reached the pantry that Lady Camille & Chloe have fresh gossip outside Maison Brioche!',
          flirt: 'You flatter an old major-domo, Your Highness — please save that dazzling smile for tonight’s waltz!',
          clout: 2, male: true,
        },
        {
          id: 'butler-sebastien', role: 'butler', name: 'Banquet Butler Sébastien', roleLabel: 'Dining & Cellar Butler (1F)',
          x: -11.4, z: -22.5, y: 0.65, patrolR: 1.0, dressHex: '#1a1e28', trimHex: '#d4af55', hairStyle: 'slick-gala',
          waypoints: [
            { x: -11.4, z: -22.5, pause: 3.0 },
            { x: -11.4, z: -27.2, pause: 2.6 },
            { x: -15.4, z: -27.2, pause: 2.4 },
            { x: -15.4, z: -22.5, pause: 2.8 },
          ],
          prompt: 'Speak to Banquet Butler Sébastien',
          msg: 'White gloves spotless and silverware aligned, Your Highness — shall I serve vintage champagne or rose macarons?',
          duty: 'I serve every banquet in the West Dining Hall, pour grand cru tastings, and supervise 1F salon guests.',
          gossip: 'A Duke tried tipping me ₡200 to ask who your mysterious guest at Club Couronne was!',
          flirt: 'At your service morning or midnight, Princess — just ring the golden bell.',
          clout: 2, male: true,
        },
        {
          id: 'butler-laurent', role: 'butler', name: 'Concierge Butler Laurent', roleLabel: 'Grand Hôtel Head Butler',
          x: 131.5, z: 7.4, y: 0.14, patrolR: 0.9, dressHex: '#1f1d29', trimHex: '#d9b04e', hairStyle: 'slick-gala',
          waypoints: [
            { x: 131.5, z: 7.4, pause: 3.2 },
            { x: 135.8, z: 7.4, pause: 2.6 },
            { x: 135.8, z: 11.4, pause: 2.5 },
            { x: 131.5, z: 11.4, pause: 2.8 },
          ],
          prompt: 'Speak to Concierge Butler Laurent (Hotel)',
          msg: 'Welcome to Grand Hôtel Impérial! Allow me to hold the velvet elevator doors or carry your shopping bags upstairs.',
          duty: 'I direct hotel bell service, champagne turn-down service in the 2F Suite, and VIP arrivals.',
          gossip: 'Your limousine parked out front had photographers lining both sides of Riviera Boulevard!',
          flirt: 'My tailcoat pockets always carry an extra chocolate truffle just for you, Your Highness.',
          clout: 2, male: true,
        },
        {
          id: 'maid-colette', role: 'maid', name: 'Head Maid Colette', roleLabel: 'Head Palace Maid (1F)',
          x: -12.8, z: -21.2, y: 0.65, patrolR: 1.0, dressHex: '#242129', trimHex: '#faf6f0', hairStyle: 'regency-bun',
          waypoints: [
            { x: -12.8, z: -21.2, pause: 2.6 },
            { x: -8.6, z: -21.2, pause: 2.4 },
            { x: -8.6, z: -25.4, pause: 3.0 },
            { x: -12.8, z: -25.4, pause: 2.4 },
          ],
          prompt: 'Talk to Head Maid Colette',
          msg: 'Curtsies warmly! Every Château bed has fresh hollow goose-down blankets tucked neatly and the rose baths are drawn.',
          duty: 'Six maids keep every palace bedroom, vanity mirror, parlor sofa, and marble tub spotless.',
          gossip: 'Someone dropped pearl earrings on the 5F Spa terrace last night — the maids are whispering!',
          flirt: 'Oh! My cheeks are burning, Princess — only in Versailles would royalty tease the head maid like this!',
          clout: 1,
        },
        {
          id: 'maid-sophie', role: 'maid', name: 'Scullery Maid Sophie', roleLabel: '1F Kitchen & Parlor Maid',
          x: -14.2, z: -31.8, y: 0.65, patrolR: 0.9, dressHex: '#2b2833', trimHex: '#faf6f0', hairStyle: 'romantic-bun',
          waypoints: [
            { x: -14.2, z: -31.8, pause: 2.8 },
            { x: -17.0, z: -31.8, pause: 2.5 },
            { x: -17.0, z: -29.2, pause: 2.4 },
            { x: -14.2, z: -29.2, pause: 2.8 },
          ],
          prompt: 'Talk to Maid Sophie (1F)',
          msg: 'Just dusted the kitchen cabinets and checkered tiles with Chef Auguste! Would you like warm brioche?',
          duty: 'I polish the copper cookware, replenish bathroom towels on Floor 1, and fetch herbs from Greenfields Farm.',
          gossip: 'Chauffeur Lucien polished the Obsidian Limo chrome twice hoping you would notice!',
          flirt: 'Always so radiant, Princess — wait till you see the new satin ribbons in your 2F wardrobe!',
          clout: 1,
        },
        {
          id: 'maid-elise', role: 'maid', name: 'Chambermaid Elise', roleLabel: 'Upper Suites Maid (2F)',
          x: 16.5, z: -30.5, y: 5.65, patrolR: 1.1, dressHex: '#2c303d', trimHex: '#faf6f0', hairStyle: 'romantic-bun',
          waypoints: [
            { x: 16.5, z: -30.5, pause: 2.6 },
            { x: 11.2, z: -30.5, pause: 2.8 },
            { x: 11.2, z: -25.8, pause: 2.5 },
            { x: 16.5, z: -25.8, pause: 3.0 },
          ],
          prompt: 'Talk to Chambermaid Elise (2F)',
          msg: 'Everything in the 2F Queen Mother & State Bedrooms is freshly turned down — slip right inside any duvet!',
          duty: 'I care for the 2F State Gallery, clawfoot tubs, and silk velvet draperies.',
          gossip: 'I overheard the Queen Mother praising your poise at breakfast — though beware late returns from Club Couronne!',
          flirt: 'Such playful eyes! Let us hope nobody from the Honours Gazette sees us grinning in the corridor!',
          clout: 1,
        },
        {
          id: 'maid-camille', role: 'maid', name: 'Treasury Maid Camille', roleLabel: '4F Vault & Gala Maid',
          x: -11.5, z: -25.8, y: 15.65, patrolR: 0.9, dressHex: '#252630', trimHex: '#faf6f0', hairStyle: 'regency-bun',
          waypoints: [
            { x: -11.5, z: -25.8, pause: 2.8 },
            { x: -7.5, z: -25.8, pause: 2.5 },
            { x: -7.5, z: -21.8, pause: 2.6 },
            { x: -11.5, z: -21.8, pause: 2.8 },
          ],
          prompt: 'Talk to Maid Camille (4F)',
          msg: 'Evening gowns pressed and gala chandeliers lit on Floor 4, Your Highness!',
          duty: 'I tend the 4F Gala Salon, velvet lounges, and royal jewelry cases.',
          gossip: 'Even the guards cannot stop gossiping about the turquoise diamond tiara in the vault!',
          flirt: 'May I adjust your corsage before tonight’s ballroom entrance, Princess?',
          clout: 1,
        },
        {
          id: 'maid-claudette', role: 'maid', name: 'Penthouse Maid Claudette', roleLabel: '7F Penthouse Maid',
          x: -10.5, z: -26.0, y: 30.65, patrolR: 0.9, dressHex: '#262430', trimHex: '#f4d5e0', hairStyle: 'marie-updo',
          waypoints: [
            { x: -10.5, z: -26.0, pause: 2.8 },
            { x: -5.8, z: -26.0, pause: 2.5 },
            { x: -5.8, z: -22.4, pause: 2.5 },
            { x: -10.5, z: -22.4, pause: 2.8 },
          ],
          prompt: 'Talk to Maid Claudette (7F Penthouse)',
          msg: 'Welcome up to the 7F Imperial Penthouse! The hot springs terrace and starlight bath are ready for you.',
          duty: 'I maintain the 7F Penthouse bedrooms, diamond mirrors, and private rosewater soaking tubs.',
          gossip: 'From this sky terrace, I could spot your convertible parked outside Palazzo Napoli Pizzeria!',
          flirt: 'Up here above the clouds, everything feels a little breathless — doesn’t it, Your Highness?',
          clout: 2,
        },
        {
          id: 'maid-juliette', role: 'maid', name: 'Hotel Maid Juliette', roleLabel: 'Grand Hôtel Housekeeping',
          x: 136.0, z: 12.6, y: 0.14, patrolR: 0.85, dressHex: '#242129', trimHex: '#faf6f0', hairStyle: 'romantic-bun',
          waypoints: [
            { x: 136.0, z: 12.6, pause: 2.8 },
            { x: 131.4, z: 12.6, pause: 2.5 },
            { x: 131.4, z: 8.6, pause: 2.4 },
            { x: 136.0, z: 8.6, pause: 2.6 },
          ],
          prompt: 'Talk to Hotel Maid Juliette',
          msg: 'Clean rose petals and crisp linens ready up in the Grand Hôtel 2F Honeymoon Suite!',
          duty: 'I keep the Hotel lobby chandelier glowing and prepare VIP rosewater jacuzzi suites upstairs.',
          gossip: 'Three noble couples already asked to reserve the Honeymoon Canopy Bed next weekend!',
          flirt: 'Your Highness brings magic to every suite you step inside!',
          clout: 1,
        },
        {
          id: 'chef-auguste', role: 'chef', name: 'Royal Chef Auguste', roleLabel: 'Palace Master Chef',
          x: -16.5, z: -34.2, y: 0.65, patrolR: 0.7, dressHex: '#faf7f2', trimHex: '#d4af55', hairStyle: 'slick-gala',
          waypoints: [
            { x: -16.5, z: -34.2, pause: 3.2 },
            { x: -13.4, z: -34.2, pause: 2.5 },
            { x: -13.4, z: -31.8, pause: 2.6 },
            { x: -16.5, z: -31.8, pause: 3.0 },
          ],
          prompt: 'Speak to Chef Auguste (1F Kitchen)',
          msg: 'Bonjour, Princess! The upper cabinets are stocked with truffles, lobsters, and pistachio macarons!',
          duty: 'I prepare six-course royal banquets on the 1F checkered kitchen floor and supply pastry deliveries across town.',
          gossip: 'Even the Hospital physicians sneak over for my warm brioche tarts during shift change!',
          flirt: 'Mon dieu! Your Highness prefers my cooking — or perhaps my tall white chef toque?',
          clout: 1, male: true,
        },
        {
          id: 'chauffeur-lucien', role: 'chauffeur', name: 'Royal Chauffeur Lucien', roleLabel: 'Motorcade Chauffeur',
          x: -34.2, z: -21.0, y: 0.0, patrolR: 0.9, dressHex: '#1e2738', trimHex: '#d4af55', hairStyle: 'slick-gala',
          waypoints: [
            { x: -34.2, z: -21.0, pause: 3.0 },
            { x: -29.2, z: -21.0, pause: 2.6 },
            { x: -29.2, z: -14.2, pause: 2.4 },
            { x: -34.2, z: -14.2, pause: 3.2 },
          ],
          prompt: 'Talk to Chauffeur Lucien (Cars)',
          msg: 'Your Highness! Inside both Auto Pavilions sit your Limousine, Sport Coupe, Touring Sedan, and State SUV — climb right inside and drive!',
          duty: 'I polish every chrome bumper, tune the convertible engines, and keep the Roadster parked out front.',
          gossip: 'Now that every avenue runs smooth right up to the Château gates, cruising across town is pure silk!',
          flirt: 'Say the word and I will chauffeur you down Riviera Boulevard past sunset — just us two.',
          clout: 2, male: true,
        },
        {
          id: 'gardener-bastien', role: 'staff', name: 'Gardener Bastien', roleLabel: 'Parterre Master Gardener',
          x: -24.0, z: 22.0, y: 0.0, patrolR: 1.5, dressHex: '#46613e', trimHex: '#d8c5a0', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: -24.0, z: 22.0, pause: 2.8 },
            { x: -16.5, z: 22.0, pause: 2.6 },
            { x: -16.5, z: 12.0, pause: 2.4 },
            { x: -24.0, z: 12.0, pause: 3.0 },
          ],
          prompt: 'Talk to Gardener Bastien',
          msg: 'The boxwood hedges and fountain roses are in full bloom, Princess — stroll anywhere across the grass!',
          duty: 'I prune the labyrinth parterres, Green Hospital Healing Garden herbs, and Botanic Glasshouse orchids.',
          gossip: 'Two lovers dropped a velvet ribbon behind the marble gazebo around dusk!',
          flirt: 'You outshine every rose in Versailles, my lady. Careful — dew might brush your hem!',
          clout: 1, male: true,
        },
        {
          id: 'stablehand-olivier', role: 'staff', name: 'Stablehand Olivier', roleLabel: 'Royal Equestrian Groom',
          x: -129.0, z: 12.0, y: 0.0, patrolR: 1.2, dressHex: '#63432c', trimHex: '#e6c373', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: -129.0, z: 12.0, pause: 2.8 },
            { x: -124.0, z: 12.0, pause: 2.5 },
            { x: -124.0, z: 6.5, pause: 2.6 },
            { x: -129.0, z: 6.5, pause: 3.0 },
          ],
          prompt: 'Talk to Stablehand Olivier (Horses)',
          msg: 'Look how lively Vesper, Celeste, Onyx, and Aurelia are trotting around the paddock today! Mount any horse anytime!',
          duty: 'I exercise the four purebred horses every morning, saddle them for you, and haul fresh oats from Greenfields Farm.',
          gossip: 'Your chestnut stallion kicked up dust racing Neighbor Claire’s sedan down the avenue yesterday!',
          flirt: 'You look breathtaking in equestrian boots, Your Highness — want to gallop out toward the hills?',
          clout: 2, male: true,
        },
        {
          id: 'doctor-moreau', role: 'doctor', name: 'Chief Physician Dr. Moreau', roleLabel: 'Hôpital Royal Chief Doctor',
          x: 80.8, z: -25.0, y: 0.12, patrolR: 1.0, dressHex: '#f4f8fc', trimHex: '#a62639', hairStyle: 'slick-gala',
          outfitId: 'equestrian-tailored', walkSpeed: 1.38,
          waypoints: [
            { x: 80.8, z: -25.0, pause: 4.2, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 80.8, z: -21.8, pause: 3.6, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 75.5, z: -21.2, pause: 3.8, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 79.4, z: -27.0, pause: 2.8, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
          ],
          prompt: 'Consult Dr. Moreau (Hospital)',
          msg: 'Welcome to Hôpital Royal de Versailles! Tour our separated Operating Room (OR), separated ER Wing, Recovery Ward 01-03, VIP Suites 06-07 & Healing Garden!',
          duty: 'I direct surgical teams, ER trauma physicians, anesthesiology, nurses, and citizen health check-ups.',
          gossip: 'Word came in that an heiress tested the ambulance siren outside Crown University — was that you, Princess?',
          flirt: 'My stethoscope catches a faster beat every time you visit my clinic, Your Highness.',
          clout: 2, male: true, isMedicalStaff: true,
        },
        {
          id: 'doctor-bellamy', role: 'doctor', name: 'Botanical Physician Dr. Bellamy', roleLabel: 'Green Hospital Garden Doctor',
          x: 79.6, z: -33.2, y: 0.08, patrolR: 1.0, dressHex: '#f2f7fa', trimHex: '#2f7a58', hairStyle: 'wavy-curtain-shag',
          outfitId: 'equestrian-tailored', walkSpeed: 1.24,
          waypoints: [
            { x: 79.6, z: -33.2, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI },
            { x: 76.2, z: -35.8, pause: 3.8, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 82.8, z: -35.8, pause: 3.2, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
            { x: 79.6, z: -30.6, pause: 2.5 },
          ],
          prompt: 'Talk to Dr. Bellamy (Green Hospital Garden)',
          msg: 'Fresh air and chamomile blooms in the Green Hospital Healing Courtyard cure exhaustion twice as fast!',
          duty: 'I lead outdoor botanical therapy at the Green Hospital Gazebo and formulate herbal recovery elixirs.',
          gossip: 'Several Palace Maids visit our quiet green hospital courtyard just to sip lavender tea in peace!',
          flirt: 'Sunlight suits you even better than candlelight, Princess.',
          clout: 2, male: true, isMedicalStaff: true,
        },
        {
          id: 'surgeon-valmont', role: 'surgeon', name: 'Chief Surgeon Dr. Valmont', roleLabel: 'Operating Theater Chief Surgeon',
          x: 72.85, z: -27.1, y: 0.12, patrolR: 0.9, dressHex: '#1e6e8c', trimHex: '#a9dfed', hairStyle: 'slick-gala',
          outfitId: 'equestrian-tailored', walkSpeed: 1.32,
          waypoints: [
            { x: 72.85, z: -27.1, pause: 8.5, workPose: 'work_operate', faceYaw: Math.PI * 0.5 },
            { x: 72.85, z: -25.8, pause: 3.2, workPose: 'work_examine', faceYaw: -Math.PI * 0.75 },
            { x: 72.85, z: -27.2, pause: 7.5, workPose: 'work_operate', faceYaw: Math.PI * 0.5 },
            { x: 76.2, z: -26.8, pause: 2.6, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
          ],
          prompt: 'Speak to Chief Surgeon Dr. Valmont',
          msg: 'Scrubbed in and actively operating inside our separated Skytron Operating Room! Every monitor is steady at 62 BPM and 99% oxygen.',
          duty: 'I lead cardiac and trauma operations inside the isolated Operating Room (OR) alongside Dr. Laurent and Scrub Nurse Sophie.',
          gossip: 'Our Walnut VIP Recovery Suites 06 & 07 are booked solidly by court dukes demanding privacy!',
          flirt: 'Even surgical precision cannot keep my hands calm when royalty walks into the OR.',
          clout: 3, male: true, isMedicalStaff: true,
        },
        {
          id: 'surgeon-celeste', role: 'surgeon', name: 'VIP Surgeon Dr. Celeste', roleLabel: 'Cardiothoracic & VIP Wing Surgeon',
          x: 84.8, z: -18.6, y: 0.12, patrolR: 1.0, dressHex: '#1e6e8c', trimHex: '#d4af55', hairStyle: 'regency-bun',
          outfitId: 'equestrian-tailored', walkSpeed: 1.36,
          waypoints: [
            { x: 84.8, z: -18.6, pause: 5.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 83.0, z: -18.5, pause: 1.0 },
            { x: 80.8, z: -21.2, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 83.0, z: -23.0, pause: 1.0 },
            { x: 84.8, z: -23.1, pause: 4.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 83.0, z: -23.0, pause: 1.0 },
          ],
          prompt: 'Consult VIP Surgeon Dr. Celeste',
          msg: 'Checking vitals on our recovering patient in Walnut VIP Suite 07 — both luxury suites have twin ICU towers!',
          duty: 'I oversee post-surgical VIP recovery rounds inside VIP Rooms 06 & 07 and consult with the Nurses\' Station.',
          gossip: 'Half of Riviera Town came by just to peek at those warm under-bed floor glows in VIP 06 and 07!',
          flirt: 'A clean surgical gown and royal poise — nobody wears confidence quite like you, Princess.',
          clout: 3, isMedicalStaff: true,
        },
        {
          id: 'anesth-laurent', role: 'anesthesiologist', name: 'Anesthesiologist Dr. Laurent', roleLabel: 'Senior Surgical Anesthesiologist',
          x: 75.85, z: -27.6, y: 0.12, patrolR: 0.9, dressHex: '#235a6e', trimHex: '#94d5e3', hairStyle: 'wavy-curtain-shag',
          outfitId: 'equestrian-tailored', walkSpeed: 1.30,
          waypoints: [
            { x: 75.85, z: -27.6, pause: 8.0, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
            { x: 75.75, z: -28.4, pause: 5.5, workPose: 'work_operate', faceYaw: -Math.PI * 0.75 },
            { x: 76.6, z: -26.8, pause: 2.4, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
          ],
          prompt: 'Talk to Anesthesiologist Dr. Laurent',
          msg: 'Anesthesia vaporizer calibrated, corrugated oxygen lines flowing, and telemetry locked at 89/54 right here in the separated OR.',
          duty: 'I keep our surgical patient comfortably sedated and monitor airway telemetry beside Chief Surgeon Valmont.',
          gossip: 'Dr. Valmont insists on Beethoven playing softly during morning prep — calming even for me!',
          flirt: 'Not a single sedative needed when one smile from Your Highness leaves the whole ward breathless.',
          clout: 2, male: true, isMedicalStaff: true,
        },
        {
          id: 'er-doctor-vance', role: 'er_doctor', name: 'ER Doctor Vance', roleLabel: 'ER Attending Physician',
          x: 75.4, z: -17.5, y: 0.12, patrolR: 1.0, dressHex: '#f4f8fc', trimHex: '#b8283c', hairStyle: 'slick-gala',
          outfitId: 'equestrian-tailored', walkSpeed: 1.44,
          waypoints: [
            { x: 75.4, z: -17.5, pause: 5.5, workPose: 'work_examine', faceYaw: -Math.PI * 0.75 },
            { x: 76.5, z: -18.9, pause: 4.5, workPose: 'work_station', faceYaw: Math.PI },
            { x: 72.9, z: -17.3, pause: 3.5, workPose: 'work_examine', faceYaw: -Math.PI * 0.75 },
            { x: 78.6, z: -18.5, pause: 1.0 },
            { x: 79.5, z: -17.2, pause: 2.2, workPose: 'work_station', faceYaw: 0 },
            { x: 78.6, z: -18.5, pause: 1.0 },
          ],
          prompt: 'Speak to ER Attending Dr. Vance',
          msg: 'Separated Emergency Room wing active! I am examining our patient in ER Bay 02 and keeping ER Bay 01 ready for emergencies.',
          duty: 'I lead rapid stabilization at the ER Triage Desk and treat trauma patients inside the separated South-West ER.',
          gossip: 'Someone sped past Villa Azure Pool in an Obsidian Limousine and nearly flipped trying to wave at you!',
          flirt: 'Careful around high heels on wet tile, Princess — unless you are trying to land in my ER on purpose.',
          clout: 2, male: true, isMedicalStaff: true,
        },
        {
          id: 'er-doctor-marchetti', role: 'er_doctor', name: 'ER Physician Dr. Marchetti', roleLabel: 'ER Trauma & Triage Doctor',
          x: 76.0, z: -17.3, y: 0.12, patrolR: 1.0, dressHex: '#f4f8fc', trimHex: '#b8283c', hairStyle: 'royal-waves',
          outfitId: 'equestrian-tailored', walkSpeed: 1.42,
          waypoints: [
            { x: 76.0, z: -17.3, pause: 4.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 76.1, z: -18.9, pause: 4.0, workPose: 'work_station', faceYaw: Math.PI },
            { x: 75.3, z: -17.6, pause: 4.2, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 78.6, z: -18.5, pause: 1.0 },
            { x: 76.7, z: -21.3, pause: 3.4, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 78.6, z: -18.5, pause: 1.0 },
          ],
          prompt: 'Consult ER Physician Dr. Marchetti',
          msg: 'Checking in our ER waiting bench patients and charting trauma bays — our separated Emergency Room keeps acute care moving fast!',
          duty: 'I cover ER triage, waiting room evaluations, and urgent referrals through the glass ER doors.',
          gossip: 'Baker Luc sprints in here once a week swearing he burned his thumb testing caramel — mostly just for Nurse Clara’s smile!',
          flirt: 'Pulse check says you are dangerously charming today, Your Highness.',
          clout: 2, isMedicalStaff: true,
        },
        {
          id: 'nurse-amelie', role: 'nurse', name: 'Head Nurse Amélie', roleLabel: 'Hospital Triage Nurse',
          x: 80.9, z: -25.0, y: 0.12, patrolR: 0.85, dressHex: '#e3eff6', trimHex: '#a62639', hairStyle: 'romantic-bun',
          outfitId: 'equestrian-tailored', walkSpeed: 1.32,
          waypoints: [
            { x: 80.9, z: -25.0, pause: 5.0, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 81.5, z: -27.8, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 80.8, z: -22.2, pause: 4.0, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
          ],
          prompt: 'Talk to Nurse Amélie (Hospital)',
          msg: 'Welcome to the Check-Up Desk! Our nurses are updating charts, dispensing tonics at the Apothecary, and tending patients in every wing.',
          duty: 'I coordinate our five Hospital Nurses, run the Citizen Check-Up Desk, and keep pharmacy stocks full.',
          gossip: 'A mysterious Duke checked in with "heart palpitations" right after watching you at the Swimming Pool!',
          flirt: 'You have the healthiest glow in the entire Riviera, Princess!',
          clout: 1, isMedicalStaff: true,
        },
        {
          id: 'nurse-clara', role: 'nurse', name: 'Ward Nurse Clara', roleLabel: 'Recovery Ward Bays Nurse',
          x: 72.9, z: -21.5, y: 0.12, patrolR: 0.9, dressHex: '#eaf3fa', trimHex: '#a62639', hairStyle: 'regency-bun',
          outfitId: 'equestrian-tailored', walkSpeed: 1.30,
          waypoints: [
            { x: 72.9, z: -21.5, pause: 5.5, workPose: 'work_examine', faceYaw: -Math.PI * 0.75 },
            { x: 74.3, z: -21.4, pause: 3.5, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 76.6, z: -21.4, pause: 3.5, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 80.8, z: -21.4, pause: 4.0, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
          ],
          prompt: 'Talk to Ward Nurse Clara (Hospital Beds)',
          msg: 'I am tending our recovering patient in Ward Bay 01 right now — Bays 02 and 03 are fresh and ready if you need rest!',
          duty: 'I check bedside IV drips, record heart telemetry, and update charts across Sage Ward Bays 01–03.',
          gossip: 'Even Baker Luc popped by for a check-up after carrying three wedding cakes to the Château!',
          flirt: 'Rest here as long as you need, Your Highness — nurse’s orders!',
          clout: 1, isMedicalStaff: true,
        },
        {
          id: 'nurse-nadia', role: 'nurse', name: 'VIP Wing Nurse Nadia', roleLabel: 'VIP Recovery Suites Nurse',
          x: 80.8, z: -22.2, y: 0.12, patrolR: 0.9, dressHex: '#dfeef7', trimHex: '#2f7a58', hairStyle: 'marie-updo',
          outfitId: 'equestrian-tailored', walkSpeed: 1.32,
          waypoints: [
            { x: 80.8, z: -22.2, pause: 4.5, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 83.0, z: -18.5, pause: 1.0 },
            { x: 84.8, z: -18.8, pause: 4.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 83.0, z: -18.5, pause: 1.0 },
            { x: 83.0, z: -23.0, pause: 1.0 },
            { x: 84.8, z: -23.1, pause: 3.8, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 83.0, z: -23.0, pause: 1.0 },
          ],
          prompt: 'Talk to VIP Wing Nurse Nadia',
          msg: 'Step inside Private Suites VIP 06 or VIP 07! VIP 07 currently has a royal patient recovering, while Suite 06 is ready for Your Highness.',
          duty: 'I manage the curved Nurses\' Station monitors and care exclusively for VIP Suites 06 and 07.',
          gossip: 'Concierge Butler Laurent keeps sending champagne truffles to VIP 07 for our recovering courtier!',
          flirt: 'Private VIP turn-down service is always open for Your Highness.',
          clout: 2, isMedicalStaff: true,
        },
        {
          id: 'nurse-sophie', role: 'nurse', name: 'Scrub Nurse Sophie', roleLabel: 'Surgical Operating Room Nurse',
          x: 75.85, z: -26.6, y: 0.12, patrolR: 0.9, dressHex: '#c8e4ef', trimHex: '#1e6e8c', hairStyle: 'romantic-bun',
          outfitId: 'equestrian-tailored', walkSpeed: 1.34,
          waypoints: [
            { x: 75.85, z: -26.6, pause: 6.5, workPose: 'work_operate', faceYaw: -Math.PI * 0.5 },
            { x: 72.75, z: -26.1, pause: 3.0, workPose: 'work_examine', faceYaw: Math.PI * 0.75 },
            { x: 78.8, z: -27.0, pause: 1.0 },
            { x: 81.5, z: -27.8, pause: 3.0, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 78.8, z: -27.0, pause: 1.0 },
          ],
          prompt: 'Talk to Scrub Nurse Sophie (OR)',
          msg: 'Passing sterile instruments to Dr. Valmont inside our separated Operating Room and restocking surgical trays from the Pharmacy!',
          duty: 'I assist live surgeries inside the separated Operating Room alongside Chief Surgeon Valmont and Dr. Laurent.',
          gossip: 'I saw Head Nurse Amélie secretly writing fan mail to a mysterious royal violinist!',
          flirt: 'Scrubbed up and still charmed — only royalty could brighten a surgical theater like this.',
          clout: 1, isMedicalStaff: true,
        },
        {
          id: 'nurse-elodie', role: 'nurse', name: 'Rehab Nurse Élodie', roleLabel: 'Garden Therapy & Ward Nurse',
          x: 79.6, z: -29.8, y: 0.12, patrolR: 1.0, dressHex: '#e3f1ea', trimHex: '#2f7a58', hairStyle: 'riviera-bob',
          outfitId: 'equestrian-tailored', walkSpeed: 1.28,
          waypoints: [
            { x: 79.6, z: -29.8, pause: 2.2 },
            { x: 79.6, z: -33.6, pause: 3.4, workPose: 'work_station', faceYaw: 0 },
            { x: 77.8, z: -35.8, pause: 3.2, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 77.2, z: -21.3, pause: 3.0, workPose: 'work_examine', faceYaw: Math.PI },
          ],
          prompt: 'Talk to Rehab Nurse Élodie',
          msg: 'Patients stroll straight out the North corridor into Dr. Bellamy’s Green Healing Garden for sunshine and lavender tea!',
          duty: 'I escort recovering patients between Ward Bays 01–03 and the outdoor Green Hospital Healing Gazebo.',
          gossip: 'Honors student Celeste sneaks through the garden pavilion between high school quizzes just to admire the roses!',
          flirt: 'Step outside into the courtyard breeze with me anytime, Princess.',
          clout: 1, isMedicalStaff: true,
        },
        // INPATIENT & WAITING HOSPITAL PATIENTS (Real Hospital Occupancy)
        {
          id: 'patient-or-table', role: 'patient', name: 'Patient Henri (In Surgery)', roleLabel: 'Operating Room Surgical Patient',
          x: 74.3, z: -26.18, y: 1.02, patrolR: 0, dressHex: '#6ea8c9', trimHex: '#ffffff', hairStyle: 'slick-gala',
          outfitId: 'silk-robe-pajamas',
          stationaryPose: 'sleep', stationaryYaw: 0, rigOffsetY: 0.09, occupiesSpotId: 'hospital_exam',
          prompt: 'Check Patient Henri (OR Table)',
          msg: 'Zzz... resting peacefully under anesthesia while Chief Surgeon Valmont and Dr. Laurent operate.',
          duty: 'Undergoing a smooth cardiac valve procedure under the Skytron boom lights.',
          gossip: 'Even while sedated, the telemetry screen reads a steady 62 BPM and 99% oxygen.',
          flirt: 'Mmm... everything feels warm and safe under these bright surgical lights.',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'patient-ward-1', role: 'patient', name: 'Patient Camille (Ward Bay 01)', roleLabel: 'Recovering Ward Inpatient',
          x: 71.95, z: -22.22, y: 0.70, patrolR: 0, dressHex: '#dce8f2', trimHex: '#7da183', hairStyle: 'romantic-bun',
          outfitId: 'lace-nightgown',
          stationaryPose: 'sleep', stationaryYaw: 0, rigOffsetY: 0.09,
          occupiesSpotId: 'hospital_bed_1', vacatePos: { x: 73.1, y: 0.12, z: -22.95, yaw: -Math.PI * 0.5 },
          prompt: 'Visit Patient Camille (Bay 01)',
          msg: 'Nurse Clara just adjusted my blankets and IV — these sage-green recovery bays are so calm!',
          duty: 'Recovering overnight after a minor sprain; feel free to use Bay 02 or Bay 03 right beside me.',
          gossip: 'Word around the ward is that the Crown Heiress is touring every room in person today!',
          flirt: 'A visit from the Princess already made my fever vanish!',
          clout: 2, isCitizen: true,
        },
        {
          id: 'patient-er-2', role: 'patient', name: 'Patient Lucas (ER Bay 02)', roleLabel: 'Emergency Room Trauma Patient',
          x: 74.35, z: -18.12, y: 0.70, patrolR: 0, dressHex: '#dce8f2', trimHex: '#a61f2e', hairStyle: 'wavy-curtain-shag',
          outfitId: 'silk-robe-pajamas',
          stationaryPose: 'sleep', stationaryYaw: 0, rigOffsetY: 0.09,
          occupiesSpotId: 'hospital_bed_5', vacatePos: { x: 75.5, y: 0.12, z: -18.85, yaw: -Math.PI * 0.5 },
          prompt: 'Check on Patient Lucas (ER Bay 02)',
          msg: 'Ow—thank goodness Dr. Vance brought me straight into this separated Emergency Room from the ambulance!',
          duty: 'Resting in ER Trauma Bay 02 after twisting an ankle racing scooters down Riviera Boulevard.',
          gossip: 'I saw someone driving a sleek Royal Convertible past the Pizza Place right before I tumbled!',
          flirt: 'Seeing Your Highness check on ER patients makes me feel lucky to be here!',
          clout: 2, male: true, isCitizen: true,
        },
        {
          id: 'patient-vip-7', role: 'patient', name: 'Duke Armand (VIP Suite 07)', roleLabel: 'Walnut VIP Suite Inpatient',
          x: 86.30, z: -17.67, y: 0.70, patrolR: 0, dressHex: '#f5efe2', trimHex: '#d4af55', hairStyle: 'slick-gala',
          outfitId: 'silk-robe-pajamas',
          stationaryPose: 'sleep', stationaryYaw: 0, rigOffsetY: 0.09,
          occupiesSpotId: 'hospital_bed_7', vacatePos: { x: 84.85, y: 0.12, z: -18.4, yaw: Math.PI * 0.5 },
          prompt: 'Visit Duke Armand (VIP Suite 07)',
          msg: 'Fluted walnut walls, twin ICU monitors, and Nurse Nadia’s chamomile tea — VIP Suite 07 beats half the villas in town!',
          duty: 'Recovering comfortably in private VIP Suite 07 under Dr. Celeste’s attentive care.',
          gossip: 'VIP Suite 06 right next door is spotless and reserved whenever Your Highness wants a private retreat.',
          flirt: 'Your Highness visiting my private suite is the finest remedy in Versailles.',
          clout: 3, male: true, isCitizen: true,
        },
        {
          id: 'patient-er-wait', role: 'patient', name: 'Citizen Claire (ER Waiting)', roleLabel: 'ER Triage Bench Patient',
          x: 76.95, z: -17.72, y: 0.62, patrolR: 0, dressHex: '#b27c88', trimHex: '#faf2e6', hairStyle: 'riviera-bob',
          outfitId: 'riviera-resort-midi',
          stationaryPose: 'sit', stationaryYaw: -Math.PI * 0.5, rigOffsetY: -0.45,
          prompt: 'Chat with Citizen Claire (ER Waiting)',
          msg: 'Dr. Marchetti is reviewing my chart right now at the ER Triage Desk — the new separated ER is so quick!',
          duty: 'Waiting briefly on the ER bench for a quick bandage check before heading to Wallflour Bakery.',
          gossip: 'Everyone is raving about the fresh honey cakes and croissants at the two new Bakeries!',
          flirt: 'You look dazzling even beneath bright ER clinic lights, Princess!',
          clout: 1, isCitizen: true,
        },
        {
          id: 'patient-marc', role: 'citizen', name: 'Citizen Marc (Check-Up)', roleLabel: 'Hospital Outpatient Citizen',
          x: 80.5, z: -25.0, y: 0.12, patrolR: 0.8, dressHex: '#506478', trimHex: '#f1d08a', hairStyle: 'wavy-curtain-shag',
          walkSpeed: 1.18,
          waypoints: [
            { x: 80.5, z: -25.0, pause: 3.4, faceYaw: Math.PI * 0.5 },
            { x: 79.5, z: -21.8, pause: 2.8, faceYaw: Math.PI * 0.5 },
            { x: 79.2, z: -18.5, pause: 3.0, faceYaw: -Math.PI * 0.5 },
            { x: 79.6, z: -16.8, pause: 2.6, faceYaw: 0 },
          ],
          prompt: 'Speak to Citizen Marc (Check-Up)',
          msg: 'Good morning, Your Highness! I came in from Elmwood Street for my free citizen medical check-up!',
          duty: 'Visiting the Check-Up Desk — having the OR and ER separated makes the hospital feel so organized!',
          gossip: 'Every citizen in the 3-Bedroom Houses and Stone Mansionettes loves the new Hospital Ambulance!',
          flirt: 'Seeing the Crown Heiress visit town patients in person lifted my spirits more than any medicine!',
          clout: 2, male: true, isCitizen: true,
        },
        {
          id: 'patient-elise', role: 'citizen', name: 'Citizen Élise (Triage)', roleLabel: 'Hospital Citizen Visitor',
          x: 79.6, z: -26.4, y: 0.12, patrolR: 0.9, dressHex: '#9d6b7c', trimHex: '#faf2e6', hairStyle: 'riviera-bob',
          walkSpeed: 1.2,
          waypoints: [
            { x: 79.6, z: -26.4, pause: 2.8 },
            { x: 79.6, z: -32.2, pause: 2.6 },
            { x: 81.8, z: -34.6, pause: 3.2 },
            { x: 77.6, z: -34.6, pause: 3.0 },
          ],
          prompt: 'Talk to Citizen Élise (Hospital)',
          msg: 'Head Nurse Amélie just checked my heartbeat — now I am strolling out to the Green Hospital Healing Garden!',
          duty: 'Collecting my annual citizen health clearance before meeting friends at Palazzo Napoli Pizza Place.',
          gossip: 'Wait until you see the new checkered tiles, glowing menu board, and booths inside Palazzo Napoli Pizzeria!',
          flirt: 'Only you could make a hospital visit look like a cover shoot, Princess!',
          clout: 1, isCitizen: true,
        },
        {
          id: 'farmer-gerard', role: 'staff', name: 'Master Farmer Gérard', roleLabel: 'Greenfields Royal Farm',
          x: -120.5, z: -31.5, y: 0.0, patrolR: 1.4, dressHex: '#5e733b', trimHex: '#d9a441', hairStyle: 'slick-gala',
          waypoints: [
            { x: -120.5, z: -31.5, pause: 3.0 },
            { x: -126.0, z: -31.5, pause: 2.8 },
            { x: -126.0, z: -24.5, pause: 2.8 },
            { x: -120.5, z: -24.5, pause: 3.0 },
          ],
          prompt: 'Talk to Farmer Gérard (Farm)',
          msg: 'Welcome to Greenfields Royal Farm! The windmill is turning, strawberries are ripe, and the cows & sheep are grazing in pasture!',
          duty: 'I run the farmhouse, barn, grain silo, tractor deliveries, and supply organic milk and berries to the Palace Kitchen.',
          gossip: 'People in the 2-Bedroom Stone Mansionettes swear they hear our rooster crowing over their morning espresso!',
          flirt: 'Country air suits royalty even better than silk salons, Your Highness!',
          clout: 2, male: true,
        },
        {
          id: 'mansionette-sophia', role: 'citizen', name: 'Lady Sophia (Mansionettes)', roleLabel: 'Stone Mansionette Resident',
          x: -95.5, z: -14.8, y: 0.0, patrolR: 1.3, dressHex: '#5c4b75', trimHex: '#f1d08a', hairStyle: 'royal-waves',
          waypoints: [
            { x: -95.5, z: -14.8, pause: 2.8 },
            { x: -86.5, z: -14.8, pause: 3.0 },
            { x: -86.5, z: -11.5, pause: 2.6 },
            { x: -95.5, z: -11.5, pause: 2.8 },
          ],
          prompt: 'Chat with Lady Sophia (Mansionettes)',
          msg: 'Come tour our four 2-Bedroom Stone Mansionettes! Each has two real bedrooms, an enclosed full bath, kitchen, and lounge!',
          duty: 'We mansionette neighbors trade recipes, stroll to Greenfields Farm, and host sunset courtyard teas.',
          gossip: 'Half of Willow Creek is buzzing about your Royal Motorcade driving down Riviera Boulevard!',
          flirt: 'Don’t stand out in the lane too long looking so glamorous — come inside Ashford or Bellevue Mansionette!',
          clout: 2,
        },
        {
          id: 'lady-camille', role: 'friend', name: 'Lady Camille (Best Friend)', roleLabel: 'Inner-Circle Bestie',
          x: -64.5, z: 14.0, y: 0, patrolR: 1.4, dressHex: '#b85d74', trimHex: '#e6c373', hairStyle: 'royal-waves',
          waypoints: [
            { x: -64.5, z: 14.0, pause: 2.8 },
            { x: -64.5, z: 24.0, pause: 3.0 },
            { x: -72.0, z: 24.0, pause: 2.8 },
            { x: -72.0, z: 14.0, pause: 2.6 },
          ],
          prompt: 'Chat & Gossip with Best Friend Camille',
          msg: 'Bestie!! Did you see the Green Hospital Garden, the Pizza booths, and the new Palais fashions? Come grab truffle pizza with me!',
          duty: 'Your ride-or-die court confidante — I know every secret before Crown Dispatch prints a single headline.',
          gossip: 'Spotted at midnight: Chloe saved us the red VIP booth inside Palazzo Napoli Pizzeria!',
          flirt: 'Oh stop grinning like that — you know I always hype you up before any royal scandal!',
          clout: 2,
        },
        {
          id: 'friend-chloe', role: 'friend', name: 'Bestie Lady Chloe', roleLabel: 'Childhood Best Friend',
          x: -135.2, z: 33.8, y: 0.0, patrolR: 1.1, dressHex: '#4f7a9e', trimHex: '#f8e6c8', hairStyle: 'riviera-bob',
          waypoints: [
            { x: -135.2, z: 33.8, pause: 3.0 },
            { x: -129.0, z: 33.8, pause: 2.6 },
            { x: -129.0, z: 31.2, pause: 2.6 },
            { x: -135.2, z: 31.2, pause: 2.8 },
          ],
          prompt: 'Hang Out with Bestie Chloe (Pizza & Park)',
          msg: 'Heyyy girl! Grab a hot pepperoni slice with me at Palazzo Napoli — the booths and drinks cooler are stocked!',
          duty: 'Always down for wood-fired pizza runs, shopping bags at Galerie Royale, and midnight swims at Villa Azure!',
          gossip: 'Marquis Julian keeps wandering past the Parterre Gardens hoping to run into you!',
          flirt: 'Seriously, your outfit today deserves its own double-page spread — let’s hit Shopping Place next!',
          clout: 2,
        },
        {
          id: 'friend-vivienne', role: 'friend', name: 'Duchess Vivienne (Friend)', roleLabel: 'Atelier & Club Confidante',
          x: 73.5, z: 34.0, y: 0.0, patrolR: 1.2, dressHex: '#7e3c6b', trimHex: '#f3d49b', hairStyle: 'marie-updo',
          waypoints: [
            { x: 73.5, z: 34.0, pause: 2.8 },
            { x: 84.0, z: 34.0, pause: 2.6 },
            { x: 84.0, z: 31.2, pause: 2.6 },
            { x: 73.5, z: 31.2, pause: 3.0 },
          ],
          prompt: 'Catch Up with Friend Vivienne',
          msg: 'Darling! Seamstress Céline just finished steaming velvet ribbons — shall we browse Galerie Royale or hit Villa Azure Pool?',
          duty: 'Front-row fashion insider, Villa Azure poolside regular, and VIP Club Couronne guest.',
          gossip: 'Someone whispered that Butler Sébastien hid vintage champagne for your next celebration!',
          flirt: 'Nobody carries cashmere and confidence quite like you, Princess!',
          clout: 2,
        },
        {
          id: 'friend-julian', role: 'friend', name: 'Marquis Julian (Friend)', roleLabel: 'Close Court Friend',
          x: 14.5, z: 14.0, y: 0.0, patrolR: 1.3, dressHex: '#2f3d58', trimHex: '#d4af55', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: 14.5, z: 14.0, pause: 2.8 },
            { x: 14.5, z: 24.5, pause: 3.0 },
            { x: 6.5, z: 24.5, pause: 2.8 },
            { x: 6.5, z: 14.0, pause: 2.6 },
          ],
          prompt: 'Walk & Chat with Marquis Julian',
          msg: 'Your Highness! I was hoping we might bump into each other among the Versailles roses before tonight’s Gala.',
          duty: 'Escort for garden walks, equestrian trails on Aurelia & Vesper, and fierce chess partner.',
          gossip: 'Head Butler Henri told me the whole court bets on which sports car you will drive next!',
          flirt: 'Tell me straight — would you escape this courtyard with me to Palazzo Napoli or Club Couronne tonight?',
          clout: 2, male: true,
        },
        {
          id: 'baker-luc', role: 'chef', name: 'Master Baker Luc', roleLabel: 'Wallflour & Maison Brioche Patissier',
          x: -83.4, z: 37.8, y: 0.12, patrolR: 0.8, dressHex: '#faf7f2', trimHex: '#91424c', hairStyle: 'slick-gala',
          waypoints: [
            { x: -83.4, z: 37.8, pause: 3.0 },
            { x: -80.4, z: 37.8, pause: 2.6 },
            { x: -80.4, z: 39.2, pause: 2.4 },
            { x: -83.4, z: 39.2, pause: 2.8 },
          ],
          prompt: 'Chat with Master Baker Luc (Patisserie)',
          msg: 'Warm croissants, fresh baguettes, and Louis XVI macaron boxes are ready in our Wallflour Patisserie vitrine, Your Highness!',
          duty: 'I bake artisan sourdough, croissants, and ribboned rose macarons across both floors of Wallflour & Maison Brioche.',
          gossip: 'Honors students from University North Hall always sprint here between debates!',
          flirt: 'Sweet as powdered rosewater, Princess — may I box a special treat just for you?',
          clout: 1, male: true,
        },
        {
          id: 'baker-maya', role: 'chef', name: 'Conservatory Baker Maya', roleLabel: 'Bumblebee Glasshouse Baker',
          x: -74.2, z: 38.6, y: 0.12, patrolR: 0.75, dressHex: '#f4ebdc', trimHex: '#d99a2b', hairStyle: 'romantic-bun',
          waypoints: [
            { x: -74.2, z: 38.6, pause: 3.0 },
            { x: -72.2, z: 38.6, pause: 2.6 },
            { x: -72.2, z: 40.8, pause: 2.6 },
            { x: -74.2, z: 40.8, pause: 2.8 },
          ],
          prompt: 'Talk to Baker Maya (Bumblebee Glasshouse)',
          msg: 'Step inside our sunny Bumblebee Conservatory! Wildflower Honey Cake, lemon cupcakes, and bee pollen scones just came out warm!',
          duty: 'I frost layered wildflower honey cakes, bake lemon curd cupcakes, and tend the climbing conservatory ivy.',
          gossip: 'Even the Palace Maids order our wildflower honey jars for the Princess’s Breakfast in Bed!',
          flirt: 'Golden honey sunlight suits you wonderfully, Your Highness!',
          clout: 2,
        },
        {
          id: 'waitress-gabrielle', role: 'staff', name: 'Tea Hostess Gabrielle', roleLabel: 'Gingham Salon & 2F Loft Server',
          x: -80.2, z: 41.4, y: 0.12, patrolR: 0.9, dressHex: '#92b6da', trimHex: '#fffaf5', hairStyle: 'riviera-bob',
          waypoints: [
            { x: -80.2, z: 41.4, pause: 2.8 },
            { x: -85.4, z: 41.6, pause: 2.6 },
            { x: -83.4, z: 42.4, pause: 2.6 },
            { x: -80.2, z: 39.6, pause: 2.5 },
          ],
          prompt: 'Order Tea with Hostess Gabrielle (Bakery)',
          msg: 'Take a seat at our powder-blue gingham tables, outside at the sidewalk rose bistro, or climb up to our 2F Piano Tasting Loft!',
          duty: 'I serve pot-steeped Earl Grey tea, raspberry mille-feuille, and sidewalk café crèmes to court guests.',
          gossip: 'Duchess Vivienne and Lady Camille booked the upstairs piano tasting table for this evening!',
          flirt: 'A quiet gingham table by the arched windows is always saved for you, Princess.',
          clout: 1,
        },
        {
          id: 'stylist-celine', role: 'staff', name: 'Couturier Céline', roleLabel: 'Maison de Couture Director',
          x: 79.6, z: 41.0, y: 0.12, patrolR: 0.9, dressHex: '#5e2b45', trimHex: '#f1d08a', hairStyle: 'marie-updo',
          waypoints: [
            { x: 79.6, z: 41.0, pause: 3.0 },
            { x: 82.6, z: 41.0, pause: 2.6 },
            { x: 82.6, z: 38.4, pause: 2.4 },
            { x: 79.6, z: 38.4, pause: 2.8 },
          ],
          prompt: 'Consult Couturier Céline (Seamstress)',
          msg: 'Step up to the atelier mirror anytime for custom silk embroidery or open the Atelier Wardrobe!',
          duty: 'I tailor bespoke ballgowns, gilded corsets, and equestrian jackets for court nobility.',
          gossip: 'Lady Vivienne adored the new emerald satin stitching we showcased this morning!',
          flirt: 'With a silhouette like yours, fabric practically drapes itself like liquid gold.',
          clout: 2,
        },
        {
          id: 'lifeguard-gabriel', role: 'staff', name: 'Lido Host Gabriel', roleLabel: 'Villa Azure Poolside Host',
          x: 86.2, z: 27.6, y: 0.24, patrolR: 1.1, dressHex: '#2f6f8e', trimHex: '#fff4dc', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: 86.2, z: 27.6, pause: 3.0 },
            { x: 86.2, z: 18.2, pause: 2.8 },
            { x: 83.2, z: 18.2, pause: 2.4 },
            { x: 83.2, z: 27.6, pause: 2.8 },
          ],
          prompt: 'Greet Lido Host Gabriel (Pool)',
          msg: 'The turquoise water is crystal warm today — dive right in or recline on our resort loungers!',
          duty: 'I watch over the swimmers, fluff pool towels, and keep the floating rings drifting in Villa Azure.',
          gossip: 'Last evening someone jumped in fully clothed after winning an outdoor chess match!',
          flirt: 'Sun-kissed waves or late-night swim for two after the pool closes, Princess?',
          clout: 1, male: true,
        },
        {
          id: 'dj-vivienne', role: 'staff', name: 'DJ Vivienne (Nightclub)', roleLabel: 'Club Couronne Resident DJ',
          x: 132.2, z: 37.8, y: 0.12, patrolR: 0.5, dressHex: '#281533', trimHex: '#ff7bd5', hairStyle: 'riviera-bob',
          waypoints: [
            { x: 132.2, z: 37.8, pause: 3.6 },
            { x: 134.8, z: 37.8, pause: 3.2 },
            { x: 134.8, z: 39.8, pause: 2.8 },
            { x: 132.2, z: 39.8, pause: 3.4 },
          ],
          prompt: 'Talk to DJ Vivienne (Club Privé)',
          msg: 'Hit the neon dancefloor or order bottle service, Princess — the VIP booth is always yours!',
          duty: 'I spin midnight synth-baroque sets while the VIP lounge and washrooms stay immaculate.',
          gossip: 'Crown Dispatch offered my bartender ₡500 for photos of whoever sneaks into the VIP booth tonight!',
          flirt: 'Careful — one slow dance under these magenta spotlights and the whole court will talk!',
          clout: 3,
        },
        {
          id: 'neighbor-claire', role: 'citizen', name: 'Elmwood St. Neighbor Claire', roleLabel: '3-Bedroom House Neighbor',
          x: -70.5, z: 28.5, y: 0.0, patrolR: 1.4, dressHex: '#6c8b78', trimHex: '#f4e6d2', hairStyle: 'romantic-bun',
          waypoints: [
            { x: -70.5, z: 28.5, pause: 2.8 },
            { x: -82.0, z: 28.5, pause: 3.0 },
            { x: -82.0, z: 24.5, pause: 2.6 },
            { x: -70.5, z: 24.5, pause: 2.8 },
          ],
          prompt: 'Chat with Neighbor Claire',
          msg: 'Come inside our 3-Bedroom Middle-Class Houses! All four have 3 full bedrooms, 2 bathrooms, a kitchen island, and cars outside!',
          duty: 'I organize Willow Creek block parties and wave to everyone driving down Cypress Street.',
          gossip: 'Everyone noticed the new 2-Bedroom Stone Mansionettes up the block — real estate is booming!',
          flirt: 'Always lovely seeing royalty drop by our cozy suburban picket-fence block!',
          clout: 1,
        },
        {
          id: 'headmistress-laurent', role: 'staff', name: 'Headmistress Laurent', roleLabel: 'High School Principal',
          x: 79.6, z: 17.0, y: 0.04, patrolR: 0.9, dressHex: '#23324b', trimHex: '#e6c373', hairStyle: 'regency-bun',
          waypoints: [
            { x: 79.6, z: 17.0, pause: 3.0 },
            { x: 79.6, z: 12.0, pause: 2.6 },
            { x: 75.8, z: 12.0, pause: 2.6 },
            { x: 75.8, z: 17.0, pause: 2.8 },
          ],
          prompt: 'Speak to Headmistress Laurent (High School)',
          msg: 'Step inside Académie Couronne High School for honors quizzes, art lab, lockers & washrooms!',
          duty: 'I uphold royal etiquette standards, academic honor rolls, and fine-arts scholarships.',
          gossip: 'A secret crimson love note was slipped inside Locker #7 before morning bell!',
          flirt: 'Such regal composure! You set the gold standard for every student on campus.',
          clout: 2,
        },
        {
          id: 'classmate-celeste', role: 'friend', name: 'Honors Rival Celeste', roleLabel: 'High School Senior Friend',
          x: 76.2, z: 12.2, y: 0.12, patrolR: 0.8, dressHex: '#a43753', trimHex: '#f8e6c8', hairStyle: 'riviera-bob',
          waypoints: [
            { x: 76.2, z: 12.2, pause: 2.8 },
            { x: 82.8, z: 12.2, pause: 2.6 },
            { x: 82.8, z: 15.8, pause: 2.4 },
            { x: 76.2, z: 15.8, pause: 2.8 },
          ],
          prompt: 'Swap Gossip with Celeste (High School)',
          msg: 'Bet you cannot beat my quiz score — or uncover who stashed that secret note in Locker #7!',
          duty: 'Top valedictorian contender, art studio regular, and chief high-school rumour collector.',
          gossip: 'Wait until you visit the University Clock Dorms across the avenue — huge party rumors tonight!',
          flirt: 'Don’t smile at me like that right before a pop quiz — that’s unfair distraction!',
          clout: 2,
        },
        {
          id: 'prof-beaumont', role: 'staff', name: 'Professor Beaumont', roleLabel: 'Crown University Dean',
          x: 106.5, z: 16.5, y: 0.04, patrolR: 0.9, dressHex: '#4b2839', trimHex: '#d4af55', hairStyle: 'slick-gala',
          waypoints: [
            { x: 106.5, z: 16.5, pause: 3.0 },
            { x: 112.0, z: 16.5, pause: 2.8 },
            { x: 112.0, z: 10.5, pause: 2.6 },
            { x: 106.5, z: 10.5, pause: 3.0 },
          ],
          prompt: 'Consult Professor Beaumont (University)',
          msg: 'Welcome to Crown University! Visit our Debate Hall, Concert Piano, North Dorms Clock Tower & Botanic Glasshouse!',
          duty: 'I chair the Diplomacy Faculty and supervise our North Dormitories and research library.',
          gossip: 'Our Botanic Glasshouse orchids bloomed early right as your limousine pulled up!',
          flirt: 'True brilliance and elegance rarely meet in one person — you honour our university halls.',
          clout: 2, male: true,
        },
      ].forEach(function (npc, idx) {
        const isMaleNpc = Boolean(npc.male);
        const mesh = P.buildRoyalCharacterMesh(
          {
            body: { sliders: { height: isMaleNpc ? 1.03 : 0.98 } },
            look: { hairStyle: npc.hairStyle },
            wardrobe: { outfitId: npc.outfitId || (isMaleNpc ? 'equestrian-tailored' : 'ballgown-silk'), themeId: 'signature' },
          },
          { name: npc.id, role: npc.role || 'staff', dressHex: npc.dressHex, trimHex: npc.trimHex, showPlumbob: false }
        );
        mesh.root.position.set(npc.x, npc.y, npc.z);
        if (typeof npc.stationaryYaw === 'number') {
          mesh.root.rotation.y = npc.stationaryYaw;
        } else if (Array.isArray(npc.waypoints) && npc.waypoints[0] && typeof npc.waypoints[0].faceYaw === 'number') {
          mesh.root.rotation.y = npc.waypoints[0].faceYaw;
        }
        tagActorMesh(mesh.root, npc.id);
        scene.add(mesh.root);
        const isMed = Boolean(
          npc.isMedicalStaff ||
            npc.role === 'doctor' ||
            npc.role === 'nurse' ||
            npc.role === 'surgeon' ||
            npc.role === 'anesthesiologist' ||
            npc.role === 'er_doctor'
        );
        const isCit = Boolean(npc.isCitizen || npc.role === 'citizen');
        const actCat = npc.role === 'friend' ? 'friend' : isMed ? 'medical' : isCit ? 'citizen' : 'staff';
        const firstWp = Array.isArray(npc.waypoints) && npc.waypoints.length >= 2 ? npc.waypoints[0] : null;
        actors.push({
          id: npc.id,
          role: npc.role || 'staff',
          actorCategory: actCat,
          name: npc.name,
          roleLabel: npc.roleLabel || 'Riviera Resident',
          homeX: npc.x,
          homeY: npc.y,
          homeZ: npc.z,
          patrolR: npc.patrolR,
          walkSpeed: npc.walkSpeed || 1.28,
          stationaryPose: npc.stationaryPose || null,
          stationaryYaw: typeof npc.stationaryYaw === 'number' ? npc.stationaryYaw : 0,
          rigOffsetY: npc.rigOffsetY,
          occupiesSpotId: npc.occupiesSpotId || null,
          vacatePos: npc.vacatePos || null,
          waypoints: Array.isArray(npc.waypoints) && npc.waypoints.length >= 2 ? npc.waypoints : null,
          wpIndex: firstWp ? 1 : 0,
          pauseTimer: firstWp && firstWp.workPose ? (firstWp.pause || 4.0) : (0.4 + (idx % 5) * 0.55),
          stuckTimer: 0,
          curSpeed: 0,
          phase: idx * 1.9,
          mesh: mesh,
          prompt: npc.prompt,
          greetLine: npc.msg,
          dutyLine: npc.duty,
          gossipLine: npc.gossip,
          flirtLine: npc.flirt,
          clout: npc.clout || 1,
          isMedicalStaff: isMed,
          isCitizen: isCit,
          isTalking: false,
          onInteract: function () {
            g.needs.fun = Math.min(100, (g.needs.fun || 85) + 10);
            g.needs.composure = Math.min(100, (g.needs.composure || 85) + 6);
            if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + (npc.clout || 1));
          },
        });
      });

      // Ensure every mobile NPC without explicit waypoints uses crisp straight corridor/plaza segments (never circular loops)
      actors.forEach(function (act, idx) {
        if (act.patrolR > 0 && (!Array.isArray(act.waypoints) || act.waypoints.length < 2)) {
          const span = Math.max(2.6, act.patrolR * 2.4);
          act.waypoints = [
            { x: act.homeX, z: act.homeZ, pause: 2.8 },
            { x: act.homeX + span, z: act.homeZ, pause: 2.4 },
            { x: act.homeX + span, z: act.homeZ + span * 0.75, pause: 2.6 },
            { x: act.homeX, z: act.homeZ + span * 0.75, pause: 2.4 },
          ];
          act.wpIndex = 1;
          act.walkSpeed = act.walkSpeed || 1.26;
          act.pauseTimer = 0.5 + (idx % 4) * 0.6;
          act.stuckTimer = 0;
          act.curSpeed = 0;
        }
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

      const btnCommands = document.createElement('button');
      btnCommands.type = 'button';
      btnCommands.className = 'world-btn-sm';
      btnCommands.textContent = 'Call & Cmds';

      const btnMenu = document.createElement('button');
      btnMenu.type = 'button';
      btnMenu.className = 'world-btn-sm';
      btnMenu.textContent = 'Menu';
      btnMenu.addEventListener('click', function () {
        if (window.CrownSave) window.CrownSave.save(true);
        window.CrownMenu.go('menu');
      });

      topActions.appendChild(btnCommands);
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

      // Active Activity / Transport Floating Banner ("Driving Roadster... [Doors] [Honk] [Exit Car]")
      const activityBanner = document.createElement('div');
      activityBanner.className = 'world-activity-banner';
      const activityText = document.createElement('span');
      const activityDoorBtn = document.createElement('button');
      activityDoorBtn.type = 'button';
      activityDoorBtn.className = 'world-stop-btn';
      activityDoorBtn.style.display = 'none';
      activityDoorBtn.textContent = 'Doors';
      const activityExtraBtn = document.createElement('button');
      activityExtraBtn.type = 'button';
      activityExtraBtn.className = 'world-stop-btn';
      activityExtraBtn.style.display = 'none';
      const activityStopBtn = document.createElement('button');
      activityStopBtn.type = 'button';
      activityStopBtn.className = 'world-stop-btn';
      activityStopBtn.textContent = 'Stand Up';
      activityBanner.appendChild(activityText);
      activityBanner.appendChild(activityDoorBtn);
      activityBanner.appendChild(activityExtraBtn);
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

      // Genuine Stop-and-Talk NPC Conversation UI Overlay
      const convOverlay = document.createElement('div');
      convOverlay.className = 'world-converse-overlay';
      const convCard = document.createElement('div');
      convCard.className = 'world-converse-card';
      const convHead = document.createElement('div');
      convHead.className = 'world-converse-head';
      const convTitle = document.createElement('h3');
      convTitle.className = 'world-converse-name';
      const convRelBadge = document.createElement('span');
      convRelBadge.className = 'world-converse-badge';
      convHead.appendChild(convTitle);
      convHead.appendChild(convRelBadge);
      const convRole = document.createElement('div');
      convRole.style.fontSize = '11px';
      convRole.style.fontWeight = '700';
      convRole.style.color = '#7c5111';
      const convBubble = document.createElement('div');
      convBubble.className = 'world-converse-bubble';
      const convChoices = document.createElement('div');
      convChoices.className = 'world-converse-choices';
      convCard.appendChild(convHead);
      convCard.appendChild(convRole);
      convCard.appendChild(convBubble);
      convCard.appendChild(convChoices);
      convOverlay.appendChild(convCard);
      shell.appendChild(convOverlay);

      let activeConversation = null;
      if (!g.relationships) g.relationships = {};

      function getRelScore(act) {
        return Math.max(0, Math.min(100, typeof g.relationships[act.id] === 'number' ? g.relationships[act.id] : 30));
      }

      function addRelScore(act, delta) {
        const next = Math.max(0, Math.min(100, getRelScore(act) + delta));
        g.relationships[act.id] = next;
        convRelBadge.textContent = (next >= 80 ? 'Confidant' : next >= 55 ? 'Warm Friend' : 'Acquaintance') + ' · ' + next + '%';
        return next;
      }

      function closeNpcConversation() {
        if (!activeConversation) {
          convOverlay.classList.remove('open');
          return;
        }
        const act = activeConversation.actor;
        if (act) act.isTalking = false;
        activeConversation = null;
        convOverlay.classList.remove('open');
        if (playerCtrl) {
          playerCtrl.setMovementLocked(false);
          playerCtrl.clearActivityPose(false);
        }
        syncHud(playerCtrl.actor.root.position);
      }

      function openNpcConversation(act) {
        if (!act) return;
        closeActionSheet();
        if (playerCtrl.getTransport()) {
          playerCtrl.exitTransport();
        }
        if (interactMgr && interactMgr.getActiveActivity()) {
          interactMgr.stopActivity(true);
        }
        if (activeConversation && activeConversation.actor && activeConversation.actor !== act) {
          activeConversation.actor.isTalking = false;
        }
        activeConversation = { actor: act };
        act.isTalking = true;
        if (typeof act.onInteract === 'function') act.onInteract();

        const pPos = playerCtrl.actor.root.position;
        const nPos = act.mesh.root.position;
        const faceYaw = Math.atan2(nPos.x - pPos.x, nPos.z - pPos.z);
        playerCtrl.actor.root.rotation.y = faceYaw;
        act.mesh.root.rotation.y = Math.atan2(pPos.x - nPos.x, pPos.z - nPos.z);
        playerCtrl.setMovementLocked(true);
        playerCtrl.setActivityPose({
          pose: 'converse',
          x: pPos.x,
          y: pPos.y,
          z: pPos.z,
          yaw: faceYaw,
          floorY: pPos.y,
          exitX: pPos.x,
          exitZ: pPos.z,
          exitYaw: faceYaw,
        });

        convTitle.textContent = act.name || act.prompt || 'Court Member';
        const healthEntry = g.citizenHealthLog && g.citizenHealthLog[act.name];
        convRole.textContent = (act.roleLabel || 'Versailles Court') + (healthEntry ? ' · Check-Up: ' + healthEntry.status : '');
        addRelScore(act, 2);
        convBubble.textContent = act.greetLine || 'Good day, Your Highness! It is an honour to stop and converse with you.';
        convChoices.innerHTML = '';

        const choicesList = [
          {
            label: 'Friendly Chat',
            onPick: function () {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 12, composure: 8 });
              addRelScore(act, 6);
              convBubble.textContent = (act.name || 'They') + ' smile warmly: "It is always refreshing when the Crown Princess stops to truly talk with us! How are you enjoying the Château & Town today?"';
            },
          },
          {
            label: 'Ask Court Gossip',
            onPick: function () {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 14 });
              addRelScore(act, 5);
              if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 2);
              convBubble.textContent = act.gossipLine || 'Whispers say Crown Dispatch has photographers near Club Couronne Privé and Grand Hôtel Impérial!';
            },
          },
          {
            label: 'Flirt / Charm (18+)',
            onPick: function () {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 18, composure: 4 });
              if (g.reputation) g.reputation.scandal = Math.min(100, (g.reputation.scandal || 0) + 2);
              addRelScore(act, 9);
              convBubble.textContent = act.flirtLine || 'You lean closer with a charming royal smile... their gaze lingers warmly (+9 Affinity, +2 Scandal).';
            },
          },
          {
            label: 'Ask About Duties',
            onPick: function () {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 10 });
              addRelScore(act, 4);
              convBubble.textContent = act.dutyLine || 'We work tirelessly to keep Versailles, Greenfields Farm, the Hospital, and Riviera Town running smoothly!';
            },
          },
        ];

        if (act.isMedicalStaff) {
          choicesList.push({
            label: 'Run Medical Check-Up (Free)',
            onPick: function () {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 65, hygiene: 50, composure: 18 });
              addRelScore(act, 10);
              if (townServices && typeof townServices.recordCitizenCheckup === 'function') {
                townServices.recordCitizenCheckup((g.princess && g.princess.firstName) || 'Crown Heiress', 'Cleared by ' + act.name);
              }
              convBubble.textContent = act.name + ' listens carefully with a stethoscope and checks your vitals: "Perfect royal heartbeat and immunity! (+65 Energy, +50 Hygiene, +10 Affinity)"';
            },
          });
        } else if (act.isCitizen) {
          choicesList.push({
            label: 'Citizen Medical Check-Up (+₡25)',
            onPick: function () {
              g.money = (g.money || 0) + 25;
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 12, fun: 8 });
              addRelScore(act, 10);
              if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 3);
              if (townServices && typeof townServices.recordCitizenCheckup === 'function') {
                townServices.recordCitizenCheckup(act.name, 'Hospital Check-Up Logged · Healthy');
              }
              convRole.textContent = (act.roleLabel || 'Riviera Citizen') + ' · Check-Up: Cleared (Healthy)';
              convBubble.textContent = act.name + ' beams with relief: "Thank you for sponsoring my Hôpital Royal medical check-up and immunity certificate, Princess! (+₡25 Grant, +3 Clout, +10 Affinity)"';
            },
          });
        }

        if (act.role === 'butler' || act.role === 'maid' || act.role === 'staff') {
          choicesList.push({
            label: 'Command: Serve Meal in Bed',
            onPick: function () {
              closeNpcConversation();
              royalCommands.serveMealInBed(null, null, act);
            },
          });
          choicesList.push({
            label: 'Command: Bring Champagne & Macarons',
            onPick: function () {
              closeNpcConversation();
              royalCommands.serveChampagne(act);
            },
          });
        } else if (act.role === 'chef') {
          choicesList.push({
            label: 'Command: Cook Gourmet Meal For Me',
            onPick: function () {
              closeNpcConversation();
              royalCommands.cookForMe(act);
            },
          });
        } else if (act.role === 'chauffeur') {
          choicesList.push({
            label: 'Command: Bring Royal Car Here',
            onPick: function () {
              closeNpcConversation();
              royalCommands.summonMyCar();
            },
          });
        }

        choicesList.push({
          label: act.summon && act.summon.follow ? 'Stop Following Me' : 'Follow / Escort Me Here',
          onPick: function () {
            if (act.summon && act.summon.follow) {
              act.summon = null;
              convBubble.textContent = act.name + ' bows politely: "Very well, Your Highness — I shall remain nearby."';
            } else {
              closeNpcConversation();
              royalCommands.summonActorToPlayer(act, { follow: true });
              g.toast(act.name + ' is escorting you!');
            }
          },
        });

        choicesList.push(
          {
            label: 'Give Gift (₡25)',
            onPick: function () {
              if ((g.money || 0) < 25) {
                convBubble.textContent = 'You check your royal purse — you need ₡25 Crowns to present a sovereign gift.';
                return;
              }
              g.money -= 25;
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 14, fun: 10 });
              if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 4);
              addRelScore(act, 14);
              convBubble.textContent = (act.name || 'They') + ' bow gratefully: "₡25 Gold Crowns! Your generosity shines across the entire Kingdom!" (+14 Affinity, +4 Clout)';
            },
          },
          {
            label: 'Say Goodbye',
            isBye: true,
            onPick: function () {
              closeNpcConversation();
            },
          }
        );

        choicesList.forEach(function (ch) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'world-converse-btn' + (ch.isBye ? ' bye' : '');
          b.textContent = ch.label;
          b.addEventListener('click', function () {
            if (window.CrownAudio) window.CrownAudio.playSelect();
            ch.onPick();
          });
          convChoices.appendChild(b);
        });

        convOverlay.classList.add('open');
        syncHud(playerCtrl.actor.root.position);
      }

      convOverlay.addEventListener('click', function (ev) {
        if (ev.target === convOverlay) closeNpcConversation();
      });

      const interactMgr = window.CrownInteract
        ? window.CrownInteract.createManager({
            game: g,
            playerCtrl: playerCtrl,
            castle: castle,
            actors: actors,
            toast: g.toast,
            onStateChange: function () {
              syncHud(playerCtrl.actor.root.position);
            },
          })
        : null;

      if (playerCtrl && typeof playerCtrl.setTransportListener === 'function') {
        playerCtrl.setTransportListener(function () {
          syncHud(playerCtrl.actor.root.position);
        });
      }

      function getActorById(id) {
        for (let i = 0; i < actors.length; i++) {
          if (actors[i].id === id) return actors[i];
        }
        return null;
      }

      function findNearestActorByRole(roles, pxNow, pyNow, pzNow) {
        let best = null;
        let bestScore = Infinity;
        for (let i = 0; i < actors.length; i++) {
          const a = actors[i];
          if (roles.indexOf(a.role) === -1) continue;
          const pos = a.mesh.root.position;
          const floorPenalty = Math.abs(pos.y - pyNow) > 1.5 ? 900 : 0;
          const d = Math.hypot(pos.x - pxNow, pos.z - pzNow) + floorPenalty;
          if (d < bestScore) {
            bestScore = d;
            best = a;
          }
        }
        return best;
      }

      function setActorPropVisible(act, propName) {
        if (!act || !act.mesh || !act.mesh.heldProps) return;
        const hp = act.mesh.heldProps;
        Object.keys(hp).forEach(function (k) {
          if (hp[k]) hp[k].visible = k === propName;
        });
      }

      function summonActorToPlayer(actorOrId, opts) {
        const act = typeof actorOrId === 'string' ? getActorById(actorOrId) : actorOrId;
        if (!act) return null;
        const cfg = opts || {};
        const pPos = playerCtrl.actor.root.position;
        const pYaw = playerCtrl.actor.root.rotation.y || 0;
        const pxNow = pPos.x;
        const pyNow = pPos.y;
        const pzNow = pPos.z;
        const offDist = typeof cfg.distance === 'number' ? cfg.distance : 1.35;
        const sideAngle = pYaw + (typeof cfg.sideAngle === 'number' ? cfg.sideAngle : 0.42);
        let tx = pxNow + Math.sin(sideAngle) * offDist;
        let tz = pzNow + Math.cos(sideAngle) * offDist;
        if (typeof castle.resolveCollision === 'function') {
          const r = castle.resolveCollision(tx, tz, 0.28, pyNow);
          tx = r.x;
          tz = r.z;
        }
        const nPos = act.mesh.root.position;
        const curDist = Math.hypot(nPos.x - tx, nPos.z - tz);
        const diffFloor = Math.abs(nPos.y - pyNow) > 1.4;
        if (diffFloor || curDist > 16) {
          // Bring via nearby approach vector so they smoothly walk up in view
          let spawnX = pxNow + Math.sin(sideAngle + 0.35) * 6.2;
          let spawnZ = pzNow + Math.cos(sideAngle + 0.35) * 6.2;
          if (typeof castle.resolveCollision === 'function') {
            const sr = castle.resolveCollision(spawnX, spawnZ, 0.28, pyNow);
            spawnX = sr.x;
            spawnZ = sr.z;
          }
          const sy = castle.groundHeightAt(spawnX, spawnZ, pyNow);
          nPos.set(spawnX, sy, spawnZ);
          act.homeY = pyNow;
        }
        act.isTalking = false;
        setActorPropVisible(act, cfg.holdProp || null);
        act.summon = {
          active: true,
          targetX: tx,
          targetY: pyNow,
          targetZ: tz,
          pose: cfg.pose || (cfg.holdProp === 'platter' ? 'serve' : 'converse'),
          holdProp: cfg.holdProp || null,
          follow: Boolean(cfg.follow),
          timer: typeof cfg.duration === 'number' ? cfg.duration : 24,
          arrived: false,
          onArrive: cfg.onArrive || null,
          firedArrive: false,
        };
        if (cfg.announce !== false) {
          g.toast(cfg.announceText || (act.name + ' is walking over to you!'));
        }
        return act;
      }

      function findNearestBed(pxNow, pyNow, pzNow) {
        const allSpots = castle.spots || {};
        let bestSpot = null;
        let bestAct = null;
        let bestDist = Infinity;
        Object.keys(allSpots).forEach(function (k) {
          const sp = allSpots[k];
          if (!sp || !Array.isArray(sp.actions)) return;
          const sleepAct = sp.actions.find(function (a) {
            return a.pose === 'sleep' || a.pose === 'nap';
          });
          if (!sleepAct || !sleepAct.anchor) return;
          if (Math.abs((sp.y || 0) - pyNow) > 2.2) return;
          const d = Math.hypot((sp.x || 0) - pxNow, (sp.z || 0) - pzNow);
          if (d < bestDist) {
            bestDist = d;
            bestSpot = sp;
            bestAct = sleepAct;
          }
        });
        return bestSpot ? { spot: bestSpot, sleepAct: bestAct, dist: bestDist } : null;
      }

      function serveMealInBed(optSpot, optSleepAct, preferredActor) {
        const pPos = playerCtrl.actor.root.position;
        const activeAct = interactMgr ? interactMgr.getActiveActivity() : null;
        let targetSleep = optSleepAct;
        let targetSpot = optSpot;

        if (!targetSleep && activeAct && (activeAct.pose === 'sleep' || activeAct.pose === 'nap' || activeAct.pose === 'eat_in_bed')) {
          targetSleep = activeAct;
        }
        if (!targetSleep) {
          const nearestBed = findNearestBed(pPos.x, pPos.y, pPos.z);
          if (nearestBed && nearestBed.dist < 18) {
            targetSpot = nearestBed.spot;
            targetSleep = nearestBed.sleepAct;
          }
        }

        if (targetSleep && targetSleep.anchor && interactMgr) {
          if (playerCtrl.getTransport()) playerCtrl.exitTransport();
          interactMgr.runAction({
            id: 'royal_meal_in_bed',
            label: 'Enjoy Royal Breakfast & Tea in Bed',
            pose: 'eat_in_bed',
            anchor: targetSleep.anchor,
            rates: { hunger: 28, energy: 22, composure: 16, fun: 12 },
            statusText: 'Enjoying silver platter breakfast & rose tea inside bed!',
          });
        }

        const server =
          preferredActor ||
          findNearestActorByRole(['butler', 'maid', 'staff'], pPos.x, pPos.y, pPos.z) ||
          getActorById('butler-henri');

        const bedX = targetSleep && targetSleep.anchor ? targetSleep.anchor.x : pPos.x;
        const bedZ = targetSleep && targetSleep.anchor ? targetSleep.anchor.z : pPos.z;
        const serveX = targetSpot && targetSpot.x ? targetSpot.x : bedX;
        const serveZ = targetSpot && targetSpot.z ? targetSpot.z : bedZ;

        if (server) {
          summonActorToPlayer(server, {
            holdProp: 'platter',
            pose: 'serve',
            distance: 1.55,
            duration: 28,
            announceText: server.name + ' is bringing a silver platter meal to your bedside!',
            onArrive: function () {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 55, energy: 35, composure: 20, fun: 16 });
              if (window.CrownAudio) window.CrownAudio.playSelect();
              g.toast(server.name + ' served warm croissants, berries & rose tea in bed! (+55 Food, +35 Energy)');
            },
          });
          if (server.summon) {
            server.summon.targetX = serveX + 1.25;
            server.summon.targetZ = serveZ + 1.1;
          }
        } else if (window.CrownNeeds) {
          window.CrownNeeds.applyBoost({ hunger: 55, energy: 35, composure: 20, fun: 16 });
          g.toast('Silver platter meal served in bed! (+55 Food)');
        }
      }

      function cookForMe(preferredChef) {
        const pPos = playerCtrl.actor.root.position;
        const chef =
          preferredChef ||
          findNearestActorByRole(['chef'], pPos.x, pPos.y, pPos.z) ||
          getActorById('chef-auguste');
        if (!chef) return;
        summonActorToPlayer(chef, {
          holdProp: 'platter',
          pose: 'serve',
          distance: 1.45,
          duration: 24,
          announceText: chef.name + ' is cooking & bringing a gourmet royal platter to you!',
          onArrive: function () {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 58, fun: 20, composure: 15 });
            if (window.CrownAudio) window.CrownAudio.playSelect();
            g.toast(chef.name + ' prepared truffle brioche & lobster medallions! (+58 Food)');
          },
        });
      }

      function serveChampagne(preferredServer) {
        const pPos = playerCtrl.actor.root.position;
        const srv =
          preferredServer ||
          findNearestActorByRole(['butler', 'maid', 'staff'], pPos.x, pPos.y, pPos.z) ||
          getActorById('butler-sebastien');
        if (!srv) return;
        summonActorToPlayer(srv, {
          holdProp: 'platter',
          pose: 'serve',
          distance: 1.4,
          duration: 24,
          announceText: srv.name + ' is pouring chilled champagne & boxed macarons!',
          onArrive: function () {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 36, fun: 24, composure: 18 });
            if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 3);
            g.toast(srv.name + ' served Grand Cru champagne & rose macarons! (+36 Food, +3 Clout)');
          },
        });
      }

      function summonMyCar() {
        const vehiclesList = castle.vehicles || [];
        if (!vehiclesList.length) return;
        const pPos = playerCtrl.actor.root.position;
        let car = vehiclesList.find(function (v) { return v.id === 'royal_palace_car'; }) || vehiclesList[0];
        if (!car) return;
        if (playerCtrl.getTransport()) playerCtrl.exitTransport();
        // Deliver cleanly 4.2m from Princess at street level if outdoors, or outside Château Portico if indoors
        const outdoors = pPos.y < 0.8 && !castle.isInsidePalace(pPos);
        let cx = outdoors ? pPos.x + 3.6 : 0;
        let cz = outdoors ? pPos.z + 2.2 : 6.0;
        if (typeof castle.resolveCollision === 'function') {
          const r = castle.resolveCollision(cx, cz, 1.5, 0, { ignoreEntityId: car.id });
          cx = r.x;
          cz = r.z;
        }
        car.x = cx;
        car.z = cz;
        car.yaw = Math.PI * 0.5;
        car.group.position.set(cx, 0.02, cz);
        car.group.rotation.y = car.yaw;
        if (car.spot) {
          car.spot.x = cx;
          car.spot.z = cz;
        }
        if (car.group.userData && car.group.userData.carDoors) {
          car.group.userData.carDoors.manualOpen = true;
          car.group.userData.carDoors.doorBurstTimer = 3.0;
        }
        const chauffeur = getActorById('chauffeur-lucien');
        if (chauffeur && outdoors) {
          summonActorToPlayer(chauffeur, {
            pose: 'converse',
            distance: 2.2,
            duration: 18,
            announce: false,
          });
        }
        g.toast((car.title || 'Royal Car') + ' delivered nearby with doors held open!');
      }

      function dismissAllSummons() {
        for (let i = 0; i < actors.length; i++) {
          const a = actors[i];
          if (a.summon) {
            a.summon = null;
            setActorPropVisible(a, null);
            a.homeY = typeof a.origHomeY === 'number' ? a.origHomeY : a.homeY;
            a.mesh.root.position.set(a.homeX, a.homeY || 0, a.homeZ);
          }
        }
        g.toast('Staff & guests returned politely to their posts.');
      }

      actors.forEach(function (a) {
        a.origHomeY = a.homeY;
      });

      const royalCommands = {
        summonActorToPlayer: summonActorToPlayer,
        serveMealInBed: serveMealInBed,
        cookForMe: cookForMe,
        serveChampagne: serveChampagne,
        summonMyCar: summonMyCar,
        dismissAllSummons: dismissAllSummons,
      };
      window.CrownCommands = royalCommands;

      activityDoorBtn.addEventListener('click', function () {
        const tr = playerCtrl.getTransport();
        if (tr && tr.kind === 'car' && typeof playerCtrl.toggleCarDoors === 'function') {
          const nowOpen = playerCtrl.toggleCarDoors(tr.entity);
          activityDoorBtn.textContent = nowOpen ? 'Close Doors' : 'Open Doors';
          g.toast(nowOpen ? 'Car doors swung open!' : 'Car doors closed!');
        }
      });

      activityExtraBtn.addEventListener('click', function () {
        const tr = playerCtrl.getTransport();
        if (tr && tr.kind === 'car') {
          if (window.CrownAudio) window.CrownAudio.playHorn ? window.CrownAudio.playHorn() : window.CrownAudio.playSelect();
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 4 });
          g.toast('Beep beep!');
        } else if (tr && tr.kind === 'horse') {
          tr.boost = !tr.boost;
          activityExtraBtn.textContent = tr.boost ? 'Canter: Fast' : 'Trot Pace';
          g.toast(tr.boost ? 'Galloping at full canter!' : 'Relaxed equestrian trot.');
        } else {
          const activeAct = interactMgr ? interactMgr.getActiveActivity() : null;
          if (activeAct && (activeAct.pose === 'sleep' || activeAct.pose === 'nap')) {
            serveMealInBed(null, activeAct);
          }
        }
      });

      activityStopBtn.addEventListener('click', function () {
        if (playerCtrl.getTransport()) {
          playerCtrl.exitTransport();
          syncHud(playerCtrl.actor.root.position);
          return;
        }
        if (playerCtrl.isSwimming() && (!interactMgr || !interactMgr.getActiveActivity())) {
          playerCtrl.exitPool();
          syncHud(playerCtrl.actor.root.position);
          return;
        }
        if (interactMgr) interactMgr.stopActivity(false);
      });

      function openObjectSheet(target, backCategory) {
        if (!target || !interactMgr) return;
        if (target.kind === 'actor' && target.actor) {
          openNpcConversation(target.actor);
          return;
        }
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

      let activeDirTab = 'town';
      function formatFloorLabel(item, cat) {
        if (item.floor === 7) return '7F Penthouse';
        if (item.floor === 6) return '6F Theatre';
        if (item.floor === 5) return '5F Spa & Wing';
        if (item.floor === 4) return '4F Treasury';
        if (item.floor === 3) return '3F Mansard';
        if (item.floor === 2) return '2F Suite';
        if (item.floor === 1) return '1F Palace';
        if (cat === 'town') return 'Riviera Town';
        if (cat === 'schools') return 'Schools & Uni';
        if (cat === 'cottages') {
          if (/^mid_house/.test(item.id)) return '3BR House + Car';
          if (/^mansionette/.test(item.id)) return '2BR Mansionette';
          return 'Village Cottage';
        }
        return 'Gardens';
      }

      function renderDispatchTab(itemsBox) {
        const rep = g.reputation || { clout: 50, scandal: 0, rank: 'Crown Heiress', queenMotherFavour: 60 };
        const summaryCard = document.createElement('div');
        summaryCard.className = 'world-action-item';
        summaryCard.style.cursor = 'default';
        summaryCard.innerHTML =
          '<strong>House ' +
          ((g.household && g.household.houseName) || 'Royal Dynasty') +
          ' · ' +
          (rep.rank || 'Crown Heiress') +
          '</strong><span>Clout: ' +
          Math.round(rep.clout || 50) +
          '% · Scandal: ' +
          Math.round(rep.scandal || 0) +
          '% · Queen Mother Favour: ' +
          Math.round(rep.queenMotherFavour || 60) +
          '%</span>';
        itemsBox.appendChild(summaryCard);

        const tipBtn = document.createElement('button');
        tipBtn.type = 'button';
        tipBtn.className = 'world-action-item';
        tipBtn.innerHTML =
          '<strong>Leak Juicy Court Rumour to Crown Dispatch</strong><span>+4 Scandal, +3 Clout & +12 Fun</span>';
        tipBtn.addEventListener('click', function () {
          if (!g.reputation) g.reputation = { clout: 50, scandal: 0, rank: 'Crown Heiress', queenMotherFavour: 60 };
          g.reputation.scandal = Math.min(100, (g.reputation.scandal || 0) + 4);
          g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 3);
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 12 });
          if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
          g.gossipLog.unshift({
            day: (g.world && g.world.day) || 1,
            text: 'Crown Dispatch: Anonymous palace whisper sparks fresh whispers across Club Couronne & the Château!',
          });
          if (g.gossipLog.length > 24) g.gossipLog.length = 24;
          itemsBox.innerHTML = '';
          renderDispatchTab(itemsBox);
          g.toast('Tip published in Crown Dispatch! (+4 Scandal, +3 Clout)');
        });
        itemsBox.appendChild(tipBtn);

        const logs = Array.isArray(g.gossipLog) && g.gossipLog.length
          ? g.gossipLog
          : [{ day: (g.world && g.world.day) || 1, text: 'Crown Dispatch: All eyes are on the Crown Heiress today. Visit Club Couronne Privé, the Stables, or Grand Hôtel to stir headlines!' }];
        logs.slice(0, 10).forEach(function (entry) {
          const row = document.createElement('div');
          row.className = 'world-action-item';
          row.style.cursor = 'default';
          const dEl = document.createElement('strong');
          dEl.textContent = 'Day ' + (entry.day || 1) + ' Bulletin';
          const tEl = document.createElement('span');
          tEl.textContent = entry.text || '';
          row.appendChild(dEl);
          row.appendChild(tEl);
          itemsBox.appendChild(row);
        });
      }

      function openPalaceDirectory(initialTab) {
        if (!interactMgr) return;
        if (typeof initialTab === 'string') activeDirTab = initialTab;
        actionTitle.textContent = 'Palace & Town Directory';
        actionList.innerHTML = '';

        const tabsRow = document.createElement('div');
        tabsRow.className = 'world-dir-tabs';
        const tabs = [
          { id: 'services', label: 'Town Services & Hospital' },
          { id: 'town', label: 'All Town, Farm & Cars' },
          { id: 'schools', label: 'Schools & University' },
          { id: 'floors', label: '1F–7F Lifts' },
          { id: 'living', label: 'Salons & Theatre' },
          { id: 'bedrooms', label: '22 Bedrooms + Hotel' },
          { id: 'toilets', label: 'Baths & Pool' },
          { id: 'cottages', label: '3BR Houses, Mansionettes & Cottages' },
          { id: 'gardens', label: 'Gardens' },
          { id: 'dispatch', label: 'Crown Dispatch' },
        ];

        const itemsBox = document.createElement('div');
        itemsBox.style.display = 'flex';
        itemsBox.style.flexDirection = 'column';
        itemsBox.style.gap = '7px';

        function renderTownServicesTab(targetBox) {
          const hospService = townServices.locations[0];
          const hospCard = document.createElement('div');
          hospCard.className = 'world-action-item';
          hospCard.style.cursor = 'default';
          hospCard.innerHTML =
            '<strong>Hospital · ' + hospService.title + '</strong>' +
            '<span>' + hospService.subtitle + '</span>';
          targetBox.appendChild(hospCard);

          const visitHospBtn = document.createElement('button');
          visitHospBtn.type = 'button';
          visitHospBtn.className = 'world-action-item';
          visitHospBtn.innerHTML =
            '<strong>Go Inside Hospital (Check-Up Triage Lobby)</strong>' +
            '<span>Step straight inside Hôpital Royal to the Citizen Check-Up Desk & Nurse Amélie</span>';
          visitHospBtn.addEventListener('click', function () {
            closeActionSheet();
            floorMode = 'auto';
            btnFloorCutaway.textContent = 'Cutaway: Auto';
            btnFloorCutaway.classList.remove('active');
            playerCtrl.teleport(hospService.x, hospService.z, hospService.yaw, hospService.y);
            camCtrl.resetCamera(hospService.yaw);
            syncHud(playerCtrl.actor.root.position);
          });
          targetBox.appendChild(visitHospBtn);

          townServices.getCheckupSpots().forEach(function (spot) {
            const primary = spot.actions && spot.actions[0];
            if (!primary) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'world-action-item';
            const titleEl = document.createElement('strong');
            titleEl.textContent = spot.title;
            const hintEl = document.createElement('span');
            hintEl.textContent = 'Hospital Check-Up Point · ' + primary.label;
            btn.appendChild(titleEl);
            btn.appendChild(hintEl);
            btn.addEventListener('click', function () {
              openObjectSheet({ title: spot.title, actions: spot.actions, object: spot }, 'services');
            });
            targetBox.appendChild(btn);
          });

          townServices.locations.slice(1).forEach(function (svc) {
            const spot = castle && castle.spots ? castle.spots[svc.spotId] : null;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'world-action-item';
            const titleEl = document.createElement('strong');
            titleEl.textContent = svc.name + ' · ' + svc.title;
            const hintEl = document.createElement('span');
            hintEl.textContent = spot && spot.actions && spot.actions[0]
              ? 'Town Service · ' + spot.actions[0].label
              : 'Visit ' + svc.title;
            btn.appendChild(titleEl);
            btn.appendChild(hintEl);
            btn.addEventListener('click', function () {
              if (spot && spot.actions && spot.actions.length) {
                openObjectSheet({ title: spot.title, actions: spot.actions, object: spot }, 'services');
              } else {
                closeActionSheet();
                playerCtrl.teleport(svc.x, svc.z, svc.yaw, svc.y || 0);
                camCtrl.resetCamera(svc.yaw || Math.PI);
                syncHud(playerCtrl.actor.root.position);
              }
            });
            targetBox.appendChild(btn);
          });
        }

        function renderTab(cat) {
          activeDirTab = cat;
          Array.prototype.forEach.call(tabsRow.children, function (el) {
            el.classList.toggle('active', el.dataset.cat === cat);
          });
          itemsBox.innerHTML = '';
          if (cat === 'services') {
            renderTownServicesTab(itemsBox);
            return;
          }
          if (cat === 'dispatch') {
            renderDispatchTab(itemsBox);
            return;
          }
          const list = interactMgr.listByCategory(cat);
          list.forEach(function (item) {
            const primary = item.actions && item.actions[0];
            if (!primary) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'world-action-item';
            const titleEl = document.createElement('strong');
            titleEl.textContent = item.title;
            const hintEl = document.createElement('span');
            hintEl.textContent = formatFloorLabel(item, cat) + ' · ' + primary.label;
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

      let activeCmdTab = 'commands';
      function openCallAndCommandsSheet(initialTab) {
        if (typeof initialTab === 'string') activeCmdTab = initialTab;
        actionTitle.textContent = 'Royal Commands & Call Anyone';
        actionList.innerHTML = '';

        const tabsRow = document.createElement('div');
        tabsRow.className = 'world-dir-tabs';
        const tabs = [
          { id: 'commands', label: 'Royal Commands' },
          { id: 'friends', label: 'Call Friends & Kin' },
          { id: 'staff', label: 'Butlers, Maids & Staff' },
        ];
        const itemsBox = document.createElement('div');
        itemsBox.style.display = 'flex';
        itemsBox.style.flexDirection = 'column';
        itemsBox.style.gap = '7px';

        function addCmdItem(title, hint, fn) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item';
          const tEl = document.createElement('strong');
          tEl.textContent = title;
          const hEl = document.createElement('span');
          hEl.textContent = hint;
          btn.appendChild(tEl);
          btn.appendChild(hEl);
          btn.addEventListener('click', function () {
            if (window.CrownAudio) window.CrownAudio.playSelect();
            closeActionSheet();
            fn();
          });
          itemsBox.appendChild(btn);
        }

        function renderCmdTab(tabId) {
          activeCmdTab = tabId;
          Array.prototype.forEach.call(tabsRow.children, function (el) {
            el.classList.toggle('active', el.dataset.tab === tabId);
          });
          itemsBox.innerHTML = '';
          if (tabId === 'commands') {
            addCmdItem('Serve Meal in Bed', 'Tuck into nearest bed & summon Butler/Maid with silver breakfast platter', function () {
              serveMealInBed();
            });
            addCmdItem('Cook Gourmet Meal For Me', 'Summon Chef Auguste or Master Baker to prepare & serve truffle brioche', function () {
              cookForMe();
            });
            addCmdItem('Serve Champagne & Macarons', 'Summon Butler/Waitress with Grand Cru champagne & rose macarons', function () {
              serveChampagne();
            });
            addCmdItem('Summon My Royal Car Here', 'Deliver Royal Roadster nearby with doors held open & Chauffeur Lucien', function () {
              summonMyCar();
            });
            addCmdItem('Summon Medical House Call', 'Call Chief Physician Dr. Moreau or Nurse Amélie for check-up (+65 Energy)', function () {
              const pPos = playerCtrl.actor.root.position;
              const doc = findNearestActorByRole(['doctor', 'nurse', 'er_doctor'], pPos.x, pPos.y, pPos.z) || getActorById('doctor-moreau');
              if (doc) {
                summonActorToPlayer(doc, {
                  distance: 1.5,
                  announceText: doc.name + ' is rushing over for a private royal check-up!',
                  onArrive: function () {
                    if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 60, hygiene: 40, composure: 18 });
                    g.toast(doc.name + ' completed your royal medical check-up! (+60 Energy)');
                  },
                });
              }
            });
            addCmdItem('Summon Royal Guard Escort', 'Have a uniformed Royal Guard follow & protect you wherever you go', function () {
              const gAct = getActorById('sentinel-left') || getActorById('guard-hall-1f');
              if (gAct) {
                summonActorToPlayer(gAct, { follow: true, distance: 1.75, announceText: gAct.name + ' is escorting you!' });
              }
            });
            addCmdItem('Dismiss Guests & Return Staff to Posts', 'Politely release summoned companions & staff back to normal duties', function () {
              dismissAllSummons();
            });
            return;
          }

          const wantFriend = tabId === 'friends';
          const matches = actors.filter(function (a) {
            return wantFriend ? a.actorCategory === 'friend' || a.actorCategory === 'citizen' : a.actorCategory === 'staff' || a.actorCategory === 'medical' || a.actorCategory === 'guard';
          });
          matches.forEach(function (act) {
            addCmdItem(
              'Call Over: ' + act.name,
              (act.roleLabel || 'Court Member') + ' · Walks directly to wherever you are',
              function () {
                summonActorToPlayer(act, { follow: wantFriend, distance: 1.45 });
              }
            );
          });
        }

        tabs.forEach(function (t) {
          const tb = document.createElement('button');
          tb.type = 'button';
          tb.className = 'world-dir-tab' + (t.id === activeCmdTab ? ' active' : '');
          tb.dataset.tab = t.id;
          tb.textContent = t.label;
          tb.addEventListener('click', function () {
            renderCmdTab(t.id);
          });
          tabsRow.appendChild(tb);
        });

        actionList.appendChild(tabsRow);
        actionList.appendChild(itemsBox);
        renderCmdTab(activeCmdTab);
        actionOverlay.classList.add('open');
      }

      btnCommands.addEventListener('click', function () {
        openCallAndCommandsSheet('commands');
      });

      const rowActions = document.createElement('div');
      rowActions.className = 'world-dock-actions';

      const btnPalaceMenu = document.createElement('button');
      btnPalaceMenu.type = 'button';
      btnPalaceMenu.className = 'world-dock-btn active';
      btnPalaceMenu.textContent = 'Town Services & 7F';
      btnPalaceMenu.addEventListener('click', function () {
        openPalaceDirectory('services');
      });

      const btnDockCommands = document.createElement('button');
      btnDockCommands.type = 'button';
      btnDockCommands.className = 'world-dock-btn active';
      btnDockCommands.textContent = 'Call & Cmds (C)';
      btnDockCommands.addEventListener('click', function () {
        openCallAndCommandsSheet('commands');
      });

      const btnDispatch = document.createElement('button');
      btnDispatch.type = 'button';
      btnDispatch.className = 'world-dock-btn';
      btnDispatch.textContent = 'Crown Dispatch';
      btnDispatch.addEventListener('click', function () {
        openPalaceDirectory('dispatch');
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

      const btnGo4F = document.createElement('button');
      btnGo4F.type = 'button';
      btnGo4F.className = 'world-dock-btn';
      btnGo4F.textContent = '4F Treasury';
      btnGo4F.addEventListener('click', function () {
        playerCtrl.teleport(0, -21.2, Math.PI, 15.65);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnGo7F = document.createElement('button');
      btnGo7F.type = 'button';
      btnGo7F.className = 'world-dock-btn';
      btnGo7F.textContent = '7F Penthouse';
      btnGo7F.addEventListener('click', function () {
        playerCtrl.teleport(0, -21.2, Math.PI, 30.65);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnGoWestTown = document.createElement('button');
      btnGoWestTown.type = 'button';
      btnGoWestTown.className = 'world-dock-btn';
      btnGoWestTown.textContent = '3BR Houses & Stables';
      btnGoWestTown.addEventListener('click', function () {
        playerCtrl.teleport(-72.0, 19.2, -Math.PI * 0.5, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(-Math.PI * 0.5);
      });

      const btnGoMansionettes = document.createElement('button');
      btnGoMansionettes.type = 'button';
      btnGoMansionettes.className = 'world-dock-btn';
      btnGoMansionettes.textContent = 'Mansionettes';
      btnGoMansionettes.addEventListener('click', function () {
        playerCtrl.teleport(-95.5, -12.5, Math.PI, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(Math.PI);
      });

      const btnGoFarm = document.createElement('button');
      btnGoFarm.type = 'button';
      btnGoFarm.className = 'world-dock-btn';
      btnGoFarm.textContent = 'Farm';
      btnGoFarm.addEventListener('click', function () {
        playerCtrl.teleport(-122.0, -30.5, Math.PI, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(Math.PI);
      });

      const btnGoHospital = document.createElement('button');
      btnGoHospital.type = 'button';
      btnGoHospital.className = 'world-dock-btn';
      btnGoHospital.textContent = 'Hospital';
      btnGoHospital.addEventListener('click', function () {
        playerCtrl.teleport(79.6, -13.5, Math.PI, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(Math.PI);
      });

      const btnGoCars = document.createElement('button');
      btnGoCars.type = 'button';
      btnGoCars.className = 'world-dock-btn';
      btnGoCars.textContent = 'Royal Cars';
      btnGoCars.addEventListener('click', function () {
        playerCtrl.teleport(-34.0, -22.5, -Math.PI * 0.5, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(-Math.PI * 0.5);
      });

      const btnGoSchools = document.createElement('button');
      btnGoSchools.type = 'button';
      btnGoSchools.className = 'world-dock-btn';
      btnGoSchools.textContent = 'Schools & Uni';
      btnGoSchools.addEventListener('click', function () {
        playerCtrl.teleport(106.5, 19.2, Math.PI, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(Math.PI);
      });

      const btnGoEastTown = document.createElement('button');
      btnGoEastTown.type = 'button';
      btnGoEastTown.className = 'world-dock-btn';
      btnGoEastTown.textContent = 'Pool, Hotel & Club';
      btnGoEastTown.addEventListener('click', function () {
        playerCtrl.teleport(79.6, 34.5, Math.PI, 0);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(Math.PI);
      });

      const btnFloorCutaway = document.createElement('button');
      btnFloorCutaway.type = 'button';
      btnFloorCutaway.className = 'world-dock-btn';
      btnFloorCutaway.textContent = 'Cutaway: Auto';
      const modes = ['auto', '1f', '2f', '3f', '4f', '5f', '6f', '7f', 'exterior'];
      const modeLabels = {
        auto: 'Cutaway: Auto',
        '1f': 'Floor View: 1F',
        '2f': 'Floor View: 2F',
        '3f': 'Floor View: 3F',
        '4f': 'Floor View: 4F',
        '5f': 'Floor View: 5F',
        '6f': 'Floor View: 6F',
        '7f': 'Floor View: 7F',
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
      rowActions.appendChild(btnDockCommands);
      rowActions.appendChild(btnDispatch);
      rowActions.appendChild(btnCas);
      rowActions.appendChild(btnGardens);
      rowActions.appendChild(btnEnterHall);
      rowActions.appendChild(btnGo4F);
      rowActions.appendChild(btnGo7F);
      rowActions.appendChild(btnGoCars);
      rowActions.appendChild(btnGoWestTown);
      rowActions.appendChild(btnGoMansionettes);
      rowActions.appendChild(btnGoFarm);
      rowActions.appendChild(btnGoHospital);
      rowActions.appendChild(btnGoSchools);
      rowActions.appendChild(btnGoEastTown);
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

      const raycastTargets = (castle.interactiveMeshes || []).concat(
        actors.map(function (a) { return a.mesh.root; })
      );

      function onCanvasPointerUp(ev) {
        if (ev.target !== renderer.domElement) return;
        const dist = Math.hypot(ev.clientX - tapDownX, ev.clientY - tapDownY);
        const dtMs = performance.now() - tapDownTime;
        if (dist > 10 || dtMs > 300 || !interactMgr || !raycastTargets.length) return;

        const rect = renderer.domElement.getBoundingClientRect();
        tapNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        tapNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(tapNdc, camera);
        const hits = raycaster.intersectObjects(raycastTargets, true);
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
            if (foundId.indexOf('door_') === 0 && typeof castle.toggleDoor === 'function') {
              const toggled = castle.toggleDoor(foundId);
              if (toggled) {
                if (window.CrownAudio) window.CrownAudio.playSelect();
                g.toast((toggled.title || 'Doors') + (toggled.manualOpen ? ' held open' : ' returned to auto'));
                break;
              }
            }
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
        if (activeConversation) {
          closeNpcConversation();
          return;
        }
        if (playerCtrl.getTransport()) {
          playerCtrl.exitTransport();
          syncHud(playerCtrl.actor.root.position);
          return;
        }
        if (interactMgr && interactMgr.getActiveActivity()) {
          interactMgr.stopActivity(false);
          return;
        }
        if (playerCtrl.isSwimming()) {
          playerCtrl.exitPool();
          syncHud(playerCtrl.actor.root.position);
          return;
        }
        if (currentTarget) {
          if (window.CrownAudio) window.CrownAudio.playSelect();
          if (currentTarget.kind === 'actor' && currentTarget.actor) {
            openNpcConversation(currentTarget.actor);
            return;
          }
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
        } else if (ev.code === 'KeyC') {
          openCallAndCommandsSheet('commands');
        } else if (ev.code === 'KeyH') {
          dockToggle.click();
        } else if (ev.code === 'Escape') {
          closeNpcConversation();
          closeActionSheet();
          if (playerCtrl.getTransport()) {
            playerCtrl.exitTransport();
            syncHud(playerCtrl.actor.root.position);
          } else if (interactMgr) {
            interactMgr.stopActivity(false);
          }
        }
      }
      window.addEventListener('keydown', onWorldKeyDown);

      const _hudCache = Object.create(null);
      function setTextCached(el, key, val) {
        if (_hudCache[key] !== val) {
          _hudCache[key] = val;
          el.textContent = val;
        }
      }
      function setHtmlCached(el, key, val) {
        if (_hudCache[key] !== val) {
          _hudCache[key] = val;
          el.innerHTML = val;
        }
      }
      function setBannerVisible(vis) {
        if (_hudCache.bannerVis !== vis) {
          _hudCache.bannerVis = vis;
          activityBanner.classList.toggle('visible', vis);
        }
      }
      function setDoorBtnDisplay(disp) {
        if (_hudCache.doorDisp !== disp) {
          _hudCache.doorDisp = disp;
          activityDoorBtn.style.display = disp;
        }
      }
      function setExtraBtnDisplay(disp) {
        if (_hudCache.extraDisp !== disp) {
          _hudCache.extraDisp = disp;
          activityExtraBtn.style.display = disp;
        }
      }

      function syncHud(pos) {
        g.world.zone = castle.detectZone(pos);
        setTextCached(zoneSpan, 'zone', g.world.zone);
        setTextCached(timeSpan, 'time', 'Day ' + (g.world.day || 1) + ' · ' + formatClock(g.world.hour || 10.5));
        setTextCached(moneySpan, 'money', window.CrownSave ? window.CrownSave.formatCrowns(g.money) : '₡' + g.money);

        setTextCached(chipEnergy, 'energy', 'Energy ' + Math.round(g.needs.energy) + '%');
        setTextCached(chipHunger, 'hunger', 'Food ' + Math.round(g.needs.hunger) + '%');
        setTextCached(chipHygiene, 'hygiene', 'Bath ' + Math.round(g.needs.hygiene) + '%');
        setTextCached(chipFun, 'fun', 'Fun ' + Math.round(g.needs.fun || 100) + '%');
        setTextCached(chipPoise, 'poise', 'Poise ' + Math.round(g.needs.composure) + '%');
        setTextCached(chipMood, 'mood', 'Mood: ' + (g.needs.mood || 'Poised'));

        const tr = playerCtrl.getTransport();
        const activeAct = interactMgr ? interactMgr.getActiveActivity() : null;
        const swimmingNow = playerCtrl.isSwimming();

        if (tr) {
          setExtraBtnDisplay('inline-block');
          if (tr.kind === 'car') {
            setDoorBtnDisplay('inline-block');
            const cd = tr.entity && tr.entity.group && tr.entity.group.userData && tr.entity.group.userData.carDoors;
            setTextCached(activityDoorBtn, 'doorText', cd && cd.manualOpen ? 'Close Doors' : 'Open Doors');
            setTextCached(activityText, 'actText', 'Driving ' + (tr.entity.title || 'Car'));
            setTextCached(activityExtraBtn, 'extraText', 'Honk Horn');
            setTextCached(activityStopBtn, 'stopText', 'Exit Car');
            setHtmlCached(interactBtn, 'interactHtml', '<span>Park & Exit Car</span><span>Tap / E</span>');
          } else {
            setDoorBtnDisplay('none');
            setTextCached(activityText, 'actText', 'Riding ' + (tr.entity.title || 'Steed'));
            setTextCached(activityExtraBtn, 'extraText', tr.boost ? 'Canter: Fast' : 'Trot Pace');
            setTextCached(activityStopBtn, 'stopText', 'Dismount');
            setHtmlCached(interactBtn, 'interactHtml', '<span>Dismount Horse</span><span>Tap / E</span>');
          }
          setBannerVisible(true);
          if (interactBtn.disabled) interactBtn.disabled = false;
          currentTarget = null;
          return;
        }

        setDoorBtnDisplay('none');
        if (activeAct) {
          const isInBed = activeAct.pose === 'sleep' || activeAct.pose === 'nap';
          setExtraBtnDisplay(isInBed ? 'inline-block' : 'none');
          if (isInBed) {
            setTextCached(activityExtraBtn, 'extraText', 'Meal in Bed');
          }
          setTextCached(activityText, 'actText', activeAct.statusText || activeAct.label);
          setTextCached(activityStopBtn, 'stopText', isInBed || activeAct.pose === 'eat_in_bed' ? 'Wake Up' : 'Stand Up');
          setBannerVisible(true);
          if (interactBtn.disabled) interactBtn.disabled = false;
          setHtmlCached(
            interactBtn,
            'interactHtml',
            '<span>' +
            (isInBed || activeAct.pose === 'eat_in_bed' ? 'Wake Up From Bed' : 'Stand Up (' + activeAct.label + ')') +
            '</span><span>Tap / E</span>'
          );
          currentTarget = null;
          return;
        }

        setExtraBtnDisplay('none');

        if (swimmingNow) {
          setTextCached(activityText, 'actText', 'Swimming freely — move with stick/WASD!');
          setTextCached(activityStopBtn, 'stopText', 'Exit Pool');
          setBannerVisible(true);
          if (interactBtn.disabled) interactBtn.disabled = false;
          setHtmlCached(interactBtn, 'interactHtml', '<span>Climb Out of Pool</span><span>Tap / E</span>');
          currentTarget = null;
          return;
        }

        setBannerVisible(false);

        const nearest = interactMgr ? interactMgr.getNearest(pos) : null;
        currentTarget = nearest;
        if (interactBtn.disabled) interactBtn.disabled = false;
        if (nearest) {
          setHtmlCached(interactBtn, 'interactHtml', '<span>' + nearest.title + '</span><span>Use / E</span>');
        } else {
          setHtmlCached(interactBtn, 'interactHtml', '<span>Tap Bed, Car, Horse, Pool or Palace Actions</span><span>Actions</span>');
        }
      }

      syncHud(playerCtrl.actor.root.position);

      const _daySky = new THREE.Color(0xcce4f8);
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
        if (P && typeof P.clearSharedCaches === 'function') {
          P.clearSharedCaches();
        }
        renderer.dispose();
      }

      window.addEventListener('crowngame:screenchange', function onLeave(ev) {
        if (ev.detail && ev.detail.screen !== 'game') {
          window.removeEventListener('crowngame:screenchange', onLeave);
          cleanup();
        }
      });

      const _swimPassiveAct = { rates: { fun: 12, hygiene: 10, energy: 2 } };
      const _topDay = new THREE.Color(0x74b2eb);
      const _topSunset = new THREE.Color(0x4b4776);
      const _topNight = new THREE.Color(0x0b1224);

      let lastCutX = Infinity;
      let lastCutY = Infinity;
      let lastCutZ = Infinity;
      let lastCutMode = '';
      let lastSunX = Infinity;
      let lastSunZ = Infinity;
      let lastSkyHr = -999;

      function getPalaceFloorFromY(yVal) {
        if (yVal >= 28.2) return 7;
        if (yVal >= 23.2) return 6;
        if (yVal >= 18.2) return 5;
        if (yVal >= 13.2) return 4;
        if (yVal >= 8.2) return 3;
        if (yVal >= 3.2) return 2;
        return 1;
      }

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
        const px = pInfo.position.x;
        const py = pInfo.position.y;
        const pz = pInfo.position.z;

        if (
          floorMode !== lastCutMode ||
          Math.abs(px - lastCutX) > 0.25 ||
          Math.abs(pz - lastCutZ) > 0.25 ||
          Math.abs(py - lastCutY) > 0.15
        ) {
          castle.updateCutaway(pInfo.position, floorMode);
          lastCutX = px;
          lastCutY = py;
          lastCutZ = pz;
          lastCutMode = floorMode;
        }
        castle.update(elapsed, pInfo.transport, pInfo.position);

        // Keep SkyDome & Player-Tracking Sun Shadows synced cleanly across all 304m of Riviera Town!
        if (Math.abs(px - lastSunX) > 0.35 || Math.abs(pz - lastSunZ) > 0.35) {
          skyDome.position.set(px, 0, pz);
          sunLight.target.position.set(px, 0, pz);
          sunLight.position.set(px + 36, 52, pz + 32);
          sunLight.target.updateMatrixWorld();
          lastSunX = px;
          lastSunZ = pz;
        }

        if (window.CrownNeeds) {
          const curNeedAct =
            interactMgr && interactMgr.getActiveActivity()
              ? interactMgr.getActiveActivity()
              : pInfo.inWater
                ? _swimPassiveAct
                : null;
          window.CrownNeeds.tick(delta, curNeedAct, g);
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
        if (Math.abs(hr - lastSkyHr) > 0.003 || hr < lastSkyHr) {
          lastSkyHr = hr;
          if (hr >= 6 && hr < 17) {
            _curSky.copy(_daySky);
            skyUniforms.uTopColor.value.copy(_topDay);
            skyUniforms.uNightMix.value = 0.0;
            sunLight.intensity = 2.08;
            hemiLight.intensity = 1.08;
          } else if (hr >= 17 && hr < 20) {
            const t = (hr - 17) / 3;
            _curSky.copy(_daySky).lerp(_sunsetSky, Math.sin(t * Math.PI));
            skyUniforms.uTopColor.value.copy(_topDay).lerp(_topSunset, t);
            skyUniforms.uNightMix.value = t * 0.35;
            sunLight.intensity = 2.08 - t * 0.92;
            hemiLight.intensity = 0.98 - t * 0.32;
          } else {
            _curSky.copy(_nightSky);
            skyUniforms.uTopColor.value.copy(_topNight);
            skyUniforms.uNightMix.value = 1.0;
            sunLight.intensity = 0.72;
            hemiLight.intensity = 0.52;
          }
          skyUniforms.uHorizonColor.value.copy(_curSky);
          scene.background.copy(_curSky);
          scene.fog.color.copy(_curSky);
        }

        const insidePalaceNow = castle.isInsidePalace(pInfo.position);
        let visiblePalaceMaxFloor = 7;
        if (floorMode !== 'exterior' && !(floorMode === 'auto' && !insidePalaceNow)) {
          visiblePalaceMaxFloor =
            floorMode !== 'auto' && /^[1-7]f$/.test(floorMode)
              ? parseInt(floorMode.charAt(0), 10)
              : getPalaceFloorFromY(py);
        }
        const updateSkinFn = typeof playerCtrl.updateLivingSkin === 'function' ? playerCtrl.updateLivingSkin : null;

        // Natural Waypoint Pedestrian Walking + Arrival Pauses + Summoned Staff/Friends + Genuine Conversation Facing
        for (let actIdx = 0; actIdx < actors.length; actIdx++) {
          const act = actors[actIdx];
          const rootObj = act.mesh.root;
          const posNow = rootObj.position;
          const sum = act.summon;
          const isSummoned = Boolean(sum && sum.active);

          if (!act.isTalking && !isSummoned) {
            const dxP = posNow.x - px;
            const dzP = posNow.z - pz;
            const distSqP = dxP * dxP + dzP * dzP;
            const actorInPalace = Math.abs(posNow.x) <= 30.8 && posNow.z <= -17.2 && posNow.z >= -38.8;
            const hiddenByCutaway = actorInPalace && getPalaceFloorFromY(typeof act.homeY === 'number' ? act.homeY : posNow.y) > visiblePalaceMaxFloor;
            const showActor = !hiddenByCutaway && distSqP <= 3364;
            if (rootObj.visible !== showActor) rootObj.visible = showActor;
            if (!showActor) continue;
          } else if (!rootObj.visible) {
            rootObj.visible = true;
          }

          if (act.isTalking) {
            if (updateSkinFn) {
              updateSkinFn(act.mesh, elapsed + act.phase, null, false, 0);
            }
            rootObj.rotation.y = Math.atan2(px - posNow.x, pz - posNow.z);
            act.mesh.leftLeg.rotation.x = 0;
            act.mesh.rightLeg.rotation.x = 0;
            if (act.mesh.leftKnee) act.mesh.leftKnee.rotation.x = 0;
            if (act.mesh.rightKnee) act.mesh.rightKnee.rotation.x = 0;
            act.mesh.leftArm.rotation.x = -0.32 + Math.sin(elapsed * 3.2 + act.phase) * 0.14;
            act.mesh.rightArm.rotation.x = -0.44 + Math.cos(elapsed * 3.7 + act.phase) * 0.18;
            act.mesh.leftArm.rotation.z = 0.14;
            act.mesh.rightArm.rotation.z = -0.18;
            act.mesh.headGroup.rotation.x = Math.sin(elapsed * 2.1 + act.phase) * 0.08;
            act.mesh.headGroup.rotation.y = Math.sin(elapsed * 1.4 + act.phase) * 0.1;
            continue;
          }

          if (isSummoned) {
            if (sum.follow) {
              const pYaw = playerCtrl.actor.root.rotation.y || 0;
              sum.targetX = px - Math.sin(pYaw) * 1.75;
              sum.targetZ = pz - Math.cos(pYaw) * 1.75;
              sum.targetY = py;
              if (Math.hypot(sum.targetX - posNow.x, sum.targetZ - posNow.z) > 18 || Math.abs(posNow.y - py) > 2.2) {
                posNow.set(sum.targetX, py, sum.targetZ);
              }
            } else {
              sum.timer -= delta;
              if (sum.timer <= 0) {
                act.summon = null;
                setActorPropVisible(act, null);
                continue;
              }
            }
            const sdx = sum.targetX - posNow.x;
            const sdz = sum.targetZ - posNow.z;
            const sDist = Math.hypot(sdx, sdz);
            if (sDist > 0.34) {
              sum.arrived = false;
              const spd = (act.walkSpeed || 1.32) * (sum.follow ? 1.75 : 1.48);
              act.curSpeed = spd;
              const step = Math.min(sDist, spd * delta);
              const dirX = sdx / sDist;
              const dirZ = sdz / sDist;
              let nx = posNow.x + dirX * step;
              let nz = posNow.z + dirZ * step;
              if (typeof castle.resolveCollision === 'function') {
                const res = castle.resolveCollision(nx, nz, 0.24, sum.targetY);
                nx = res.x;
                nz = res.z;
              }
              posNow.set(nx, castle.groundHeightAt(nx, nz, sum.targetY), nz);
              const targetYaw = Math.atan2(dirX, dirZ);
              let yawDiff = ((targetYaw - rootObj.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
              if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
              rootObj.rotation.y += yawDiff * Math.min(1, delta * 9.0);
              act.phase += delta * 6.0;
              const swing = Math.sin(act.phase) * 0.38;
              act.mesh.leftLeg.rotation.x = swing;
              act.mesh.rightLeg.rotation.x = -swing;
              if (act.mesh.leftKnee) act.mesh.leftKnee.rotation.x = Math.max(0, Math.sin(act.phase + 0.45) * 0.3);
              if (act.mesh.rightKnee) act.mesh.rightKnee.rotation.x = Math.max(0, Math.sin(-act.phase + 0.45) * 0.3);
              if (sum.pose === 'serve' && window.CrownAnim) {
                act.mesh.rightArm.rotation.x = -1.18;
                act.mesh.rightArm.rotation.z = -0.14;
                act.mesh.leftArm.rotation.x = -0.35;
              } else {
                act.mesh.leftArm.rotation.x = -swing * 0.6;
                act.mesh.rightArm.rotation.x = swing * 0.6;
              }
            } else {
              sum.arrived = true;
              act.curSpeed = 0;
              if (!sum.firedArrive) {
                sum.firedArrive = true;
                if (typeof sum.onArrive === 'function') sum.onArrive();
              }
              rootObj.rotation.y = Math.atan2(px - posNow.x, pz - posNow.z);
              act.mesh.leftLeg.rotation.x = 0;
              act.mesh.rightLeg.rotation.x = 0;
              if (sum.pose === 'serve' && window.CrownAnim) {
                window.CrownAnim.applyPose(act.mesh, 'serve', delta, elapsed);
              } else {
                act.mesh.leftArm.rotation.x = -0.24 + Math.sin(elapsed * 2.2 + act.phase) * 0.08;
                act.mesh.rightArm.rotation.x = -0.32 + Math.cos(elapsed * 2.4 + act.phase) * 0.08;
                act.mesh.headGroup.rotation.y = Math.sin(elapsed * 1.1 + act.phase) * 0.1;
              }
            }
            if (updateSkinFn) updateSkinFn(act.mesh, elapsed + act.phase, null, false, sDist > 0.34 ? 1 : 0);
            continue;
          }

          const nearDetail = (posNow.x - px) * (posNow.x - px) + (posNow.z - pz) * (posNow.z - pz) <= 1156;

          if (!Array.isArray(act.waypoints) || act.waypoints.length < 2 || act.patrolR <= 0) {
            if (act.stationaryPose && window.CrownAnim) {
              const curActObj = interact && typeof interact.getActiveActivity === 'function' ? interact.getActiveActivity() : null;
              const curActIdStr = curActObj && curActObj.id ? curActObj.id : '';
              const vacatedByPlayer = Boolean(
                act.occupiesSpotId && act.vacatePos && curActIdStr.indexOf(act.occupiesSpotId) === 0
              );
              if (vacatedByPlayer) {
                posNow.set(act.vacatePos.x, act.vacatePos.y, act.vacatePos.z);
                rootObj.rotation.y = act.vacatePos.yaw || 0;
                window.CrownAnim.applyLocomotion(act.mesh, delta, elapsed + act.phase, 0, 0, act.mesh.baseLeg || 0.94);
              } else {
                posNow.set(act.homeX, act.homeY, act.homeZ);
                rootObj.rotation.y = act.stationaryYaw || 0;
                window.CrownAnim.applyPose(act.mesh, act.stationaryPose, delta, elapsed + act.phase, {
                  rigOffsetY: act.rigOffsetY,
                });
              }
              if (nearDetail && updateSkinFn) {
                updateSkinFn(act.mesh, elapsed + act.phase, null, false, 0);
              }
              continue;
            }
            if (nearDetail && updateSkinFn) {
              updateSkinFn(act.mesh, elapsed + act.phase, null, false, 0);
            }
            act.mesh.leftArm.rotation.z = 0;
            act.mesh.rightArm.rotation.z = 0;
            act.mesh.leftArm.rotation.x = 0;
            act.mesh.rightArm.rotation.x = 0;
            act.mesh.leftLeg.rotation.x = 0;
            act.mesh.rightLeg.rotation.x = 0;
            act.mesh.headGroup.rotation.y = Math.sin(elapsed * 0.85 + act.phase) * 0.12;
            continue;
          }

          const baseY = typeof act.homeY === 'number' ? act.homeY : 0;
          const targetWp = act.waypoints[act.wpIndex % act.waypoints.length];
          const prevWp = act.waypoints[(act.wpIndex - 1 + act.waypoints.length) % act.waypoints.length];
          let speedTarget = 0;

          if ((act.pauseTimer || 0) > 0) {
            act.pauseTimer = Math.max(0, act.pauseTimer - delta);
            act.curSpeed = Math.max(0, (act.curSpeed || 0) - delta * 4.5);
            if (prevWp && typeof prevWp.faceYaw === 'number') {
              let fDiff = ((prevWp.faceYaw - rootObj.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
              if (fDiff < -Math.PI) fDiff += Math.PI * 2;
              rootObj.rotation.y += fDiff * Math.min(1, delta * 6.5);
            }
            if (prevWp && prevWp.workPose && window.CrownAnim) {
              window.CrownAnim.applyPose(act.mesh, prevWp.workPose, delta, elapsed + act.phase);
              if (nearDetail && updateSkinFn) {
                updateSkinFn(act.mesh, elapsed + act.phase, null, false, 0);
              }
              continue;
            } else {
              setActorPropVisible(act, null);
              act.mesh.headGroup.rotation.x = Math.sin(elapsed * 1.1 + act.phase) * 0.04;
              act.mesh.headGroup.rotation.y = Math.sin(elapsed * 0.8 + act.phase) * 0.16;
            }
          } else {
            setActorPropVisible(act, null);
            const dx = targetWp.x - posNow.x;
            const dz = targetWp.z - posNow.z;
            const dist = Math.hypot(dx, dz);

            if (dist < 0.24) {
              act.wpIndex = (act.wpIndex + 1) % act.waypoints.length;
              act.pauseTimer = targetWp.pause || (2.0 + ((actIdx + act.wpIndex) % 4) * 0.75);
              act.stuckTimer = 0;
              act.curSpeed = Math.max(0, (act.curSpeed || 0) - delta * 4.5);
            } else {
              const walkSpd = act.walkSpeed || 1.28;
              speedTarget = walkSpd;
              act.curSpeed = (act.curSpeed || 0) + (speedTarget - (act.curSpeed || 0)) * Math.min(1, delta * 6.5);
              const moveStep = Math.min(dist, act.curSpeed * delta);
              const dirX = dx / dist;
              const dirZ = dz / dist;
              let nx = posNow.x + dirX * moveStep;
              let nz = posNow.z + dirZ * moveStep;

              if (baseY < 0.45 && typeof castle.resolveCollision === 'function') {
                const resolved = castle.resolveCollision(nx, nz, 0.26);
                nx = resolved.x;
                nz = resolved.z;
              }

              const movedDist = Math.hypot(nx - posNow.x, nz - posNow.z);
              posNow.set(nx, castle.groundHeightAt(nx, nz, baseY), nz);

              if (movedDist < moveStep * 0.25) {
                act.stuckTimer = (act.stuckTimer || 0) + delta;
                if (act.stuckTimer > 1.35) {
                  act.wpIndex = (act.wpIndex + 1) % act.waypoints.length;
                  act.pauseTimer = 0.75;
                  act.stuckTimer = 0;
                }
              } else {
                act.stuckTimer = 0;
              }

              // Smooth natural human yaw turn toward travel heading
              const targetYaw = Math.atan2(dirX, dirZ);
              let yawDiff = ((targetYaw - rootObj.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
              if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
              rootObj.rotation.y += yawDiff * Math.min(1, delta * 7.5);
              act.mesh.headGroup.rotation.x = 0;
              act.mesh.headGroup.rotation.y = yawDiff * 0.18;
            }
          }

          const spdNorm = Math.min(1.15, (act.curSpeed || 0) / 1.3);
          if (nearDetail && updateSkinFn) {
            updateSkinFn(act.mesh, elapsed + act.phase, null, false, spdNorm > 0.12 ? 1 : 0);
          }

          if (spdNorm > 0.04) {
            act.phase += delta * (4.35 * Math.max(0.45, spdNorm));
            const swing = Math.sin(act.phase) * 0.34 * spdNorm;
            act.mesh.leftLeg.rotation.x = swing;
            act.mesh.rightLeg.rotation.x = -swing;
            if (nearDetail) {
              if (act.mesh.leftKnee) act.mesh.leftKnee.rotation.x = Math.max(0, Math.sin(act.phase + 0.45) * 0.28 * spdNorm);
              if (act.mesh.rightKnee) act.mesh.rightKnee.rotation.x = Math.max(0, Math.sin(-act.phase + 0.45) * 0.28 * spdNorm);
            }
            act.mesh.leftArm.rotation.x = -swing * 0.62;
            act.mesh.rightArm.rotation.x = swing * 0.62;
            act.mesh.leftArm.rotation.z = 0;
            act.mesh.rightArm.rotation.z = 0;
            act.mesh.bodyGroup.rotation.x = 0;
            act.mesh.bodyGroup.rotation.z = 0;
          } else {
            act.mesh.leftLeg.rotation.x *= 0.82;
            act.mesh.rightLeg.rotation.x *= 0.82;
            if (nearDetail) {
              if (act.mesh.leftKnee) act.mesh.leftKnee.rotation.x *= 0.82;
              if (act.mesh.rightKnee) act.mesh.rightKnee.rotation.x *= 0.82;
            }
            act.mesh.leftArm.rotation.x *= 0.82;
            act.mesh.rightArm.rotation.x *= 0.82;
            act.mesh.leftArm.rotation.z = 0;
            act.mesh.rightArm.rotation.z = 0;
            act.mesh.bodyGroup.rotation.x *= 0.82;
            act.mesh.bodyGroup.rotation.z *= 0.82;
          }
        }

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
