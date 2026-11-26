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
        background: #faf7f0;
        border: 1px solid rgba(184, 137, 56, 0.28);
        font-family: var(--font-sans);
        font-size: 13px;
        line-height: 1.42;
        color: var(--ink-primary);
        max-height: 195px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .world-converse-turn {
        padding: 7px 10px;
        border-radius: 10px;
        font-size: 12.5px;
        line-height: 1.4;
        max-width: 92%;
      }

      .world-converse-turn.you {
        align-self: flex-end;
        background: #fff3da;
        border: 1px solid rgba(184, 137, 56, 0.35);
        color: #5b3b09;
        font-weight: 600;
      }

      .world-converse-turn.npc {
        align-self: flex-start;
        background: #ffffff;
        border: 1px solid rgba(184, 137, 56, 0.22);
        color: var(--ink-primary);
      }

      .world-converse-turn strong {
        display: block;
        font-size: 10.5px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: #8c621b;
        margin-bottom: 2px;
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

      .s4-plumbob {
        display: inline-block;
        width: 11px;
        height: 15px;
        margin-right: 7px;
        vertical-align: -1px;
        background: linear-gradient(145deg, #6bf092, #1ea34c 60%, #0d6d2f);
        clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        flex-shrink: 0;
      }

      .s4-cat-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        padding: 2px 0 4px;
      }

      .s4-cat-chip {
        padding: 4px 10px;
        border-radius: 14px;
        border: 1px solid rgba(184, 137, 56, 0.34);
        background: #ffffff;
        color: var(--ink-primary);
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
      }

      .s4-cat-chip.active {
        background: linear-gradient(135deg, #27b364, #148342);
        border-color: #116f38;
        color: #ffffff;
      }

      .s4-action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(168px, 1fr));
        gap: 7px;
      }

      .world-action-item.s4-card {
        border-left-width: 4px;
        position: relative;
        transition: transform 0.1s ease, background 0.12s ease;
      }

      .s4-cat-friendly { border-left-color: #24a45d !important; }
      .s4-cat-romance { border-left-color: #d64178 !important; }
      .s4-cat-funny { border-left-color: #e08d18 !important; }
      .s4-cat-meal { border-left-color: #b88938 !important; }
      .s4-cat-swim { border-left-color: #1587b8 !important; }
      .s4-cat-activity { border-left-color: #6b4cb8 !important; }

      .s4-tag-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
        margin-top: 2px;
      }

      .s4-cat-pill {
        font-size: 9.5px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 1px 6px;
        border-radius: 6px;
        background: rgba(36, 164, 93, 0.12);
        color: #176c3c;
      }

      .s4-cat-romance .s4-cat-pill { background: rgba(214, 65, 120, 0.12); color: #9c204f; }
      .s4-cat-funny .s4-cat-pill { background: rgba(224, 141, 24, 0.14); color: #945507; }
      .s4-cat-meal .s4-cat-pill { background: rgba(184, 137, 56, 0.15); color: #7a5414; }
      .s4-cat-swim .s4-cat-pill { background: rgba(21, 135, 184, 0.13); color: #0e5f85; }
      .s4-cat-activity .s4-cat-pill { background: rgba(107, 76, 184, 0.12); color: #4c3191; }

      .world-converse-btn.s4-cat-friendly { border-left: 4px solid #24a45d; }
      .world-converse-btn.s4-cat-romance { border-left: 4px solid #d64178; }
      .world-converse-btn.s4-cat-funny { border-left: 4px solid #e08d18; }
      .world-converse-btn.s4-cat-activity { border-left: 4px solid #6b4cb8; }
      .world-converse-btn.s4-cat-meal { border-left: 4px solid #b88938; }

      .world-underwater-tint {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 2;
        opacity: 0;
        background: radial-gradient(circle at 50% 25%, rgba(28, 175, 224, 0.24) 0%, rgba(10, 88, 168, 0.48) 70%, rgba(6, 48, 114, 0.64) 100%);
        transition: opacity 0.25s ease;
      }

      .world-underwater-tint.visible {
        opacity: 1;
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

      const isMobileDevice = Boolean(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
      const qualityCap = isMobileDevice
        ? (g.settings.quality === 'low' ? 0.9 : g.settings.quality === 'medium' ? 1.05 : 1.25)
        : (g.settings.quality === 'low' ? 1 : g.settings.quality === 'medium' ? 1.25 : 1.5);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, qualityCap));
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(window.innerWidth || 390, window.innerHeight || 844);
      canvasMount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const skyHex = 0xcce4f8;
      scene.background = new THREE.Color(skyHex);
      scene.fog = new THREE.FogExp2(skyHex, 0.0014);

      let envRT = null;
      if (window.CrownRoomEnvironment) {
        const pmrem = new THREE.PMREMGenerator(renderer);
        envRT = pmrem.fromScene(new window.CrownRoomEnvironment(), 0.04);
        scene.environment = envRT.texture;
        pmrem.dispose();
      }

      const aspect = (window.innerWidth || 390) / Math.max(1, window.innerHeight || 844);
      const camera = new THREE.PerspectiveCamera(aspect < 0.8 ? 58 : 54, aspect, 0.25, 820);

      // Procedural Atmospheric SkyDome (Zenith gradient + Horizon glow + Sun disc + Twilight stars)
      const skyUniforms = {
        uTopColor: { value: new THREE.Color(0x7cb6ec) },
        uHorizonColor: { value: new THREE.Color(0xe6f0fa) },
        uSunDir: { value: new THREE.Vector3(0.55, 0.72, 0.42).normalize() },
        uSunColor: { value: new THREE.Color(0xfff4d6) },
        uNightMix: { value: 0.0 },
      };
      const skyGeo = new THREE.SphereGeometry(560, 24, 16);
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
      const sunShadowRes = isSoftwareGl
        ? 512
        : isMobileDevice
          ? (g.settings.quality === 'low' ? 512 : g.settings.quality === 'medium' ? 768 : 1024)
          : (g.settings.quality === 'low' ? 768 : g.settings.quality === 'medium' ? 1024 : 1536);
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
        isLowQuality: g.settings.quality === 'low' || isMobileDevice,
        crestHex: crestHex,
      });

      const worldApi = {
        groundHeightAt: castle.groundHeightAt,
        resolveCollision: castle.resolveCollision,
        isInPool: castle.isInPool,
        isNearWaterZone: castle.isNearWaterZone,
        getWaveHeight: castle.getWaveHeight,
        triggerWaterSplash: castle.triggerWaterSplash,
        resolveOceanBoat: castle.resolveOceanBoat,
      };

      // Reset unsafe old spawn or spawn cleanly along the Parterre Promenade
      if (!g.world) g.world = {};
      if (!g.world.playerPos || g.world.playerPos.z < -60 || g.world.playerPos.z > 275 || Math.abs(g.world.playerPos.x) > 290) {
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
                if (window.CrownHospitalCheckup && typeof window.CrownHospitalCheckup.startCheckup === 'function') {
                  window.CrownHospitalCheckup.startCheckup('desk', actCtx);
                  return;
                }
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
              hint: '+60 Energy, +40 Hygiene & Nurse-assisted screening',
              instant: true,
              onInstant: function (actCtx) {
                if ((actCtx.game.money || 0) < 15) return actCtx.toast('Need ₡15 Crowns.');
                if (window.CrownHospitalCheckup && typeof window.CrownHospitalCheckup.startCheckup === 'function') {
                  window.CrownHospitalCheckup.startCheckup('vaccine', actCtx);
                  return;
                }
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
          { id: 'hotel', name: 'Hotel', title: 'Grand Hôtel Montieri Paris', spotId: 'hotel_concierge', x: 136.4, y: 0.14, z: 7.4, yaw: 0 },
          { id: 'bank', name: 'Crown Bank', title: 'Royal Crown Bank & Treasury', spotId: 'town_bank', x: -170.0, y: 0.12, z: 5.5, yaw: Math.PI },
          { id: 'salon', name: 'Beauty Salon', title: 'Lumina Beauty Salon & Spa', spotId: 'town_salon', x: -202.0, y: 0.12, z: 5.5, yaw: Math.PI },
          { id: 'gym', name: 'Athletic Club', title: 'Couronne Athletic Club (Gym)', spotId: 'town_gym', x: -170.0, y: 0.12, z: 29.0, yaw: Math.PI },
          { id: 'library', name: 'Public Library', title: 'Grand Royal Public Library', spotId: 'town_library', x: -202.0, y: 0.12, z: 29.0, yaw: Math.PI },
          { id: 'cinema', name: 'Cinema', title: 'Riviera Grand Public Cinema', spotId: 'town_cinema', x: 173.5, y: 0.12, z: 5.5, yaw: Math.PI },
          { id: 'offices', name: 'Civic Offices', title: 'Maison Civic & Business Offices', spotId: 'town_offices', x: 206.0, y: 0.12, z: 5.5, yaw: Math.PI },
          { id: 'community', name: 'Community Hall', title: 'Kingdom Community Centre', spotId: 'town_community', x: 173.5, y: 0.12, z: 29.0, yaw: Math.PI },
          { id: 'apartments', name: 'Apartments', title: 'Belvedere 2-Storey Luxury Apartments', spotId: 'town_apartments', x: 206.0, y: 0.12, z: 29.0, yaw: Math.PI },
          { id: 'villa_west', name: 'Beach House W', title: 'Villa Soléa Waterfront Beach House', spotId: 'beach_villa_west', x: -194.0, y: 0.12, z: 54.4, yaw: Math.PI },
          { id: 'villa_east', name: 'Beach House E', title: 'Cap d’Azur Waterfront Beach House', spotId: 'beach_villa_east', x: 194.0, y: 0.12, z: 54.4, yaw: Math.PI },
          { id: 'cliff_west', name: 'Sunset Cliff', title: 'Falaise d’Or Sunset Coastal Cliff', spotId: 'cliff_west', x: -232.0, y: 4.0, z: 65.0, yaw: 0 },
          { id: 'cliff_east', name: 'Sunrise Cliff', title: 'Cap Sapphire Sunrise Coastal Cliff', spotId: 'cliff_east', x: 232.0, y: 4.0, z: 65.0, yaw: 0 },
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
            { x: -13.8, z: -27.2, pause: 2.4 },
            { x: -13.8, z: -22.5, pause: 2.8 },
          ],
          prompt: 'Speak to Banquet Butler Sébastien',
          msg: 'White gloves spotless and silverware aligned, Your Highness — shall I serve vintage champagne or rose macarons?',
          duty: 'I serve every banquet in the West Dining Hall, pour grand cru tastings, and supervise 1F salon guests.',
          gossip: 'A Duke tried tipping me ₡200 to ask who your mysterious guest at Club Couronne was!',
          flirt: 'At your service morning or midnight, Princess — just ring the golden bell.',
          clout: 2, male: true,
        },
        {
          id: 'butler-laurent', role: 'butler', name: 'Concierge Butler Laurent', roleLabel: 'Grand Hôtel Montieri Head Butler',
          x: 139.2, z: 7.7, y: 0.14, patrolR: 0.9, dressHex: '#1f1d29', trimHex: '#d9b04e', hairStyle: 'slick-gala',
          waypoints: [
            { x: 139.2, z: 7.7, pause: 3.0 },
            { x: 139.2, z: 11.3, pause: 2.6 },
            { x: 140.5, z: 11.3, pause: 2.8 },
            { x: 140.5, z: 7.7, pause: 2.5 },
          ],
          prompt: 'Speak to Concierge Butler Laurent (Hôtel Montieri)',
          msg: 'Good afternoon! Welcome to Grand Hôtel Montieri Paris — shall I call the glass lift or book you a table at Le Montieri?',
          duty: 'Coordinating bell service, airport transfers, Le Montieri dinner reservations, and 3F Penthouse arrivals.',
          gossip: 'A Paris travel writer stayed in Imperial Suite 201 last night and raved about the rosewater jacuzzi!',
          flirt: 'You always bring extra sparkle to our marble atrium whenever you stop by.',
          clout: 2, male: true,
        },
        {
          id: 'maid-colette', role: 'maid', name: 'Head Maid Colette', roleLabel: 'Head Palace Maid (1F)',
          x: -12.6, z: -24.0, y: 0.65, patrolR: 1.0, dressHex: '#242129', trimHex: '#faf6f0', hairStyle: 'regency-bun',
          waypoints: [
            { x: -12.6, z: -24.0, pause: 2.6 },
            { x: -7.8, z: -24.0, pause: 2.2 },
            { x: -7.8, z: -20.8, pause: 2.6 },
            { x: -7.8, z: -24.0, pause: 0.6 },
            { x: -12.6, z: -24.0, pause: 0.6 },
            { x: -12.6, z: -27.2, pause: 2.8 },
            { x: -12.6, z: -24.0, pause: 0.6 },
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
          x: -13.8, z: -31.0, y: 0.65, patrolR: 0.9, dressHex: '#2b2833', trimHex: '#faf6f0', hairStyle: 'romantic-bun',
          waypoints: [
            { x: -13.8, z: -31.0, pause: 2.8 },
            { x: -16.8, z: -30.5, pause: 2.5 },
            { x: -16.8, z: -29.2, pause: 2.4 },
            { x: -13.8, z: -29.2, pause: 2.8 },
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
          x: -11.5, z: -23.8, y: 15.65, patrolR: 0.9, dressHex: '#252630', trimHex: '#faf6f0', hairStyle: 'regency-bun',
          waypoints: [
            { x: -11.5, z: -23.8, pause: 2.8 },
            { x: -7.5, z: -23.8, pause: 2.5 },
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
          x: -9.2, z: -26.0, y: 30.65, patrolR: 0.9, dressHex: '#262430', trimHex: '#f4d5e0', hairStyle: 'marie-updo',
          waypoints: [
            { x: -9.2, z: -26.0, pause: 2.8 },
            { x: -5.8, z: -26.0, pause: 2.5 },
            { x: -5.8, z: -22.4, pause: 2.5 },
            { x: -9.2, z: -22.4, pause: 2.8 },
          ],
          prompt: 'Talk to Maid Claudette (7F Penthouse)',
          msg: 'Welcome up to the 7F Imperial Penthouse! The hot springs terrace and starlight bath are ready for you.',
          duty: 'I maintain the 7F Penthouse bedrooms, diamond mirrors, and private rosewater soaking tubs.',
          gossip: 'From this sky terrace, I could spot your convertible parked outside Palazzo Napoli Pizzeria!',
          flirt: 'Up here above the clouds, everything feels a little breathless — doesn’t it, Your Highness?',
          clout: 2,
        },
        {
          id: 'maid-juliette', role: 'maid', name: 'Housekeeper Juliette', roleLabel: 'Hôtel Montieri Housekeeping',
          x: 141.6, z: 12.2, y: 0.14, patrolR: 0.85, dressHex: '#242129', trimHex: '#faf6f0', hairStyle: 'romantic-bun',
          waypoints: [
            { x: 141.6, z: 12.2, pause: 2.8 },
            { x: 145.4, z: 12.2, pause: 2.6 },
            { x: 145.4, z: 10.2, pause: 2.4 },
            { x: 139.2, z: 10.2, pause: 2.4 },
            { x: 139.2, z: 11.4, pause: 2.6 },
            { x: 139.2, z: 10.2, pause: 1.0 },
            { x: 145.4, z: 10.2, pause: 1.0 },
          ],
          prompt: 'Talk to Housekeeper Juliette (Hotel)',
          msg: 'Hey there! Fresh monogrammed towels are folded upstairs in Suite 201 and the thermal spa smells like roses.',
          duty: 'Keeping the Montieri suites, fresh floral vases, and 2F spa linens spotless for every guest.',
          gossip: 'Three couples booked our Thermal Rosewater Spa back-to-back for this weekend!',
          flirt: 'Always lovely bumping into you in the atrium — let me know if you need extra pillows upstairs!',
          clout: 1,
        },
        {
          id: 'hotel-reception-camille', role: 'staff', name: 'Receptionist Camille', roleLabel: 'Montieri Front Desk Concierge',
          x: 140.4, z: 4.35, y: 0.14, patrolR: 0.7, dressHex: '#1f1c24', trimHex: '#d4af55', hairStyle: 'regency-bun',
          waypoints: [
            { x: 139.5, z: 4.35, pause: 4.0, workPose: 'work_station', faceYaw: 0 },
            { x: 141.3, z: 4.35, pause: 4.2, workPose: 'work_station', faceYaw: 0 },
          ],
          prompt: 'Check In with Receptionist Camille',
          msg: 'Welcome to Hôtel Montieri! Would you like keycards for Crimson Suite 201, Ivory Suite 202, or our 3F Royal Penthouse?',
          duty: 'Managing hotel check-ins, restaurant bookings at Le Montieri, and concierge requests behind the crimson marble desk.',
          gossip: 'Everyone is talking about the Sunset Sky Bar up on the third floor tonight — the view over Riviera Boulevard is unreal.',
          flirt: 'We always keep our quietest penthouse key set aside just in case you feel like a spontaneous staycation.',
          clout: 2,
        },
        {
          id: 'hotel-chef-henri', role: 'chef', name: 'Hotel Chef Henri', roleLabel: 'Le Montieri Executive Chef',
          x: 149.2, z: 5.5, y: 0.14, patrolR: 0.75, dressHex: '#faf7f2', trimHex: '#912232', hairStyle: 'slick-gala',
          waypoints: [
            { x: 149.2, z: 5.5, pause: 4.4, workPose: 'cook', faceYaw: Math.PI },
            { x: 150.5, z: 5.5, pause: 3.8, workPose: 'cook', faceYaw: Math.PI },
            { x: 147.8, z: 5.5, pause: 2.8, workPose: 'serve', faceYaw: 0 },
            { x: 147.8, z: 7.6, pause: 3.0, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
            { x: 147.8, z: 5.5, pause: 1.0 },
          ],
          prompt: 'Chat with Hotel Chef Henri (Kitchen)',
          msg: 'Step right past the copper pans! I am searing herb-butter scallops and simmering lobster bisque for Le Montieri dinner service.',
          duty: 'Running the Montieri hotel kitchen brigade, prepping room service trays, and plating Le Montieri tasting menus.',
          gossip: 'Valet Damien keeps sneaking warm brioche rolls from the pass whenever a VIP sedan pulls onto the red carpet.',
          flirt: 'Pull up a stool by the kitchen pass anytime — I will plate a private tasting course with extra truffle just for you.',
          clout: 2, male: true,
        },
        {
          id: 'hotel-valet-damien', role: 'staff', name: 'Valet Damien', roleLabel: 'Montieri Forecourt Valet',
          x: 126.2, z: 10.7, y: 0.06, patrolR: 0.9, dressHex: '#1b202e', trimHex: '#d9b04e', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: 126.2, z: 10.7, pause: 3.8, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
            { x: 129.6, z: 10.7, pause: 2.8, workPose: 'converse', faceYaw: 0 },
            { x: 129.6, z: 8.6, pause: 2.8, workPose: 'converse', faceYaw: Math.PI },
            { x: 126.2, z: 8.6, pause: 3.4, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
          ],
          prompt: 'Talk to Valet Damien (Courtyard)',
          msg: 'Morning! We have our Midnight Executive Sedan and Champagne Convertible parked right here in the cobblestone courtyard if you fancy a drive!',
          duty: 'Greeting cars at the Montieri archway gate, handing out valet tickets, and lugging trunks up to 2F & 3F.',
          gossip: 'Your chauffeur Lucien and I swap coffee outside before the morning rush — nicest driver on the whole boulevard!',
          flirt: 'Keys to the champagne convertible are right in my pocket whenever you feel like taking the top down.',
          clout: 1, male: true,
        },
        {
          id: 'hotel-spa-ines', role: 'staff', hotelFloor: 2, name: 'Spa Therapist Inès', roleLabel: '2F Montieri Thermal Spa',
          x: 148.1, z: 10.7, y: 4.54, patrolR: 0.7, dressHex: '#f5efe6', trimHex: '#b8844c', hairStyle: 'romantic-bun',
          waypoints: [
            { x: 148.1, z: 10.7, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 148.1, z: 12.4, pause: 4.2, workPose: 'serve', faceYaw: Math.PI * 0.5 },
            { x: 148.1, z: 14.4, pause: 3.2, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
          ],
          prompt: 'Speak with Spa Therapist Inès (2F Spa)',
          msg: 'Welcome up to the Thermal Rosewater Spa! The whirlpool jets are warm, candles are lit, and fresh plush robes are ready.',
          duty: 'Preparing essential oils, refilling candlelit rose baths, and pampering guests in the 2F spa lounge.',
          gossip: 'Half of the hospital nurses come straight here after long ER shifts for an hour in the jacuzzi.',
          flirt: 'Stay as long as you like — nobody rushes wellness on the second floor.',
          clout: 2,
        },
        {
          id: 'hotel-guest-julien', role: 'citizen', hotelFloor: 2, name: 'Guest Julien (Suite 201)', roleLabel: 'Hôtel Montieri Weekend Guest',
          x: 138.6, z: 13.0, y: 4.54, patrolR: 0.8, dressHex: '#4f3a42', trimHex: '#e6c373', hairStyle: 'slick-gala',
          waypoints: [
            { x: 138.6, z: 13.0, pause: 3.6, workPose: 'converse', faceYaw: 0 },
            { x: 141.0, z: 13.0, pause: 3.8, workPose: 'read', faceYaw: Math.PI },
            { x: 141.0, z: 14.0, pause: 3.0, workPose: 'converse', faceYaw: -Math.PI * 0.5 },
            { x: 138.6, z: 13.6, pause: 2.8 },
          ],
          prompt: 'Chat with Guest Julien (Suite 201)',
          msg: 'Hi! Checking in for a long weekend — honestly the tufted crimson bed and marble espresso station in Suite 201 beat my own apartment.',
          duty: 'In town visiting friends on Willow Creek Lane and taking meetings down at Le Montieri.',
          gossip: 'Heard the bakery across town added an upstairs piano salon — I am grabbing pistachio croissants there tomorrow!',
          flirt: 'Funny running into someone so stylish in the Suite 201 corridor — heading up to the Sky Bar later?',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'hotel-barman-hugo', role: 'staff', hotelFloor: 3, name: 'Sky Barman Hugo', roleLabel: '3F Montieri Rooftop Mixologist',
          x: 147.8, z: 11.4, y: 8.94, patrolR: 0.75, dressHex: '#1b1d24', trimHex: '#e6c373', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: 147.8, z: 11.4, pause: 4.2, workPose: 'serve', faceYaw: Math.PI * 0.5 },
            { x: 147.8, z: 13.0, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 147.2, z: 14.0, pause: 3.2, workPose: 'serve', faceYaw: 0 },
            { x: 147.8, z: 12.2, pause: 3.0 },
          ],
          prompt: 'Order at the 3F Sky Bar with Hugo',
          msg: 'Welcome up to the 3F Sky Terrace! Can I pour you chilled peach bellinis, espresso martinis, or sparkling rose lemonade?',
          duty: 'Mixing rooftop cocktails, chilling vintage champagne, and keeping the terrace lights glowing at sunset.',
          gossip: 'From up here on the third floor, you can watch cars cruising both avenues all the way to the park!',
          flirt: 'You have an open tab at my bar anytime — name the drink and watch the sunset.',
          clout: 2, male: true,
        },
        {
          id: 'hotel-vip-claire', role: 'friend', hotelFloor: 3, name: 'VIP Guest Claire (Penthouse)', roleLabel: '3F Penthouse Socialite Friend',
          x: 138.4, z: 10.6, y: 8.94, patrolR: 0.85, dressHex: '#7d2638', trimHex: '#f5dfb2', hairStyle: 'royal-waves',
          waypoints: [
            { x: 138.4, z: 10.6, pause: 3.8, workPose: 'converse', faceYaw: -Math.PI * 0.5 },
            { x: 138.4, z: 8.6, pause: 3.6, workPose: 'read', faceYaw: Math.PI },
            { x: 136.4, z: 12.4, pause: 3.4, workPose: 'converse', faceYaw: 0 },
          ],
          prompt: 'Hang Out with VIP Guest Claire (3F Penthouse)',
          msg: 'OMG look at the fresco dome ceiling up here in Penthouse 301! Grab a drink with me on the Sky Bar terrace in a minute!',
          duty: 'Throwing small rooftop soirées, browsing Galerie Royale couture, and carpooling down the boulevard.',
          gossip: 'Everyone at the hotel lobby was whispering about that custom champagne tourer parked in the valet courtyard!',
          flirt: 'You look straight out of a Paris editorial tonight — come sit by the terrace with me!',
          clout: 2,
        },
        {
          id: 'chef-auguste', role: 'chef', name: 'Royal Chef Auguste', roleLabel: 'Palace Master Chef',
          x: -16.2, z: -35.8, y: 0.65, patrolR: 0.7, dressHex: '#faf7f2', trimHex: '#d4af55', hairStyle: 'slick-gala',
          waypoints: [
            { x: -16.2, z: -35.8, pause: 4.2, workPose: 'cook', faceYaw: Math.PI },
            { x: -13.6, z: -35.6, pause: 2.8, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: -13.6, z: -31.2, pause: 2.6, workPose: 'serve', faceYaw: 0 },
            { x: -16.5, z: -30.6, pause: 3.0, workPose: 'cook', faceYaw: Math.PI },
            { x: -13.6, z: -31.2, pause: 1.0 },
            { x: -13.6, z: -35.6, pause: 1.0 },
          ],
          prompt: 'Speak to Chef Auguste (1F Kitchen)',
          msg: 'Bonjour, Princess! I am whisking truffle velouté right on the stove — tell me anytime if you want a hot meal or breakfast in bed!',
          duty: 'Preparing six-course dinners in the kitchen, tasting sauces, and trading recipes with Chef Henri over at Hôtel Montieri.',
          gossip: 'The hospital nurses always sneak over for warm brioche tarts during shift change!',
          flirt: 'Hard to focus on my soufflé when you walk into the kitchen smiling like that!',
          clout: 1, male: true,
        },
        {
          id: 'chauffeur-lucien', role: 'chauffeur', name: 'Chauffeur Lucien', roleLabel: 'Personal Chauffeur & Friend',
          x: -34.2, z: -21.0, y: 0.0, patrolR: 0.9, dressHex: '#1e2738', trimHex: '#d4af55', hairStyle: 'slick-gala',
          waypoints: [
            { x: -34.2, z: -21.0, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: -34.2, z: -16.2, pause: 2.6 },
            { x: -36.8, z: -16.2, pause: 2.4 },
            { x: -36.8, z: -18.8, pause: 3.2, workPose: 'work_station', faceYaw: 0 },
            { x: -36.8, z: -16.2, pause: 0.5 },
            { x: -34.2, z: -16.2, pause: 0.5 },
          ],
          prompt: 'Chat with Chauffeur Lucien (Cars)',
          msg: 'Hey! Good to see you — coffee is hot, the engine is purring, and I am always ready whenever you want a lift or a carpool!',
          duty: 'Driving you anywhere in town, picking up your friends to carpool in back, and keeping every car spotless.',
          gossip: 'Two neighborhood cruisers have been rolling up and down the avenues all afternoon — traffic is lively today!',
          flirt: 'No rushing today — tell me where you want to go, put on your favorite song, and let me take the wheel.',
          clout: 2, male: true,
        },
        {
          id: 'gardener-bastien', role: 'staff', name: 'Gardener Bastien', roleLabel: 'Parterre Master Gardener',
          x: -24.0, z: 22.0, y: 0.0, patrolR: 1.5, dressHex: '#46613e', trimHex: '#d8c5a0', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: -24.0, z: 22.0, pause: 3.5, workPose: 'toddler_watch', faceYaw: -Math.PI * 0.5 },
            { x: -16.5, z: 22.0, pause: 3.0, workPose: 'work_station', faceYaw: 0 },
            { x: -16.5, z: 12.0, pause: 3.0, workPose: 'toddler_watch', faceYaw: Math.PI * 0.5 },
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
          x: -127.8, z: 12.0, y: 0.0, patrolR: 1.2, dressHex: '#63432c', trimHex: '#e6c373', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: -127.8, z: 12.0, pause: 3.6, workPose: 'pet_horse', faceYaw: -Math.PI * 0.5 },
            { x: -124.0, z: 12.0, pause: 2.8, workPose: 'work_station', faceYaw: 0 },
            { x: -124.0, z: 6.5, pause: 3.2, workPose: 'pet_horse', faceYaw: Math.PI * 0.5 },
            { x: -127.8, z: 6.5, pause: 3.0 },
          ],
          prompt: 'Talk to Stablehand Olivier (Horses)',
          msg: 'Look how lively Vesper, Celeste, Onyx, and Aurelia are trotting around the paddock today! Mount any horse anytime!',
          duty: 'I groom the four purebred horses every morning, saddle them for you, and haul fresh oats from Greenfields Farm.',
          gossip: 'Your chestnut stallion kicked up dust racing Neighbor Claire’s sedan down the avenue yesterday!',
          flirt: 'You look breathtaking in equestrian boots, Your Highness — want to gallop out toward the hills?',
          clout: 2, male: true,
        },
        {
          id: 'doctor-moreau', role: 'doctor', name: 'Chief Physician Dr. Moreau', roleLabel: 'Hôpital Royal Chief Doctor',
          x: 80.6, z: -25.0, y: 0.12, patrolR: 1.0, dressHex: '#f4f8fc', trimHex: '#a62639', hairStyle: 'slick-gala',
          outfitId: 'equestrian-tailored', walkSpeed: 1.38,
          waypoints: [
            { x: 80.6, z: -25.0, pause: 4.2, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 80.6, z: -21.3, pause: 3.6, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 75.5, z: -21.3, pause: 3.8, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 79.6, z: -21.3, pause: 0.6 },
            { x: 79.6, z: -27.0, pause: 2.8, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
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
          x: 72.8, z: -27.1, y: 0.12, patrolR: 0.9, dressHex: '#1e6e8c', trimHex: '#a9dfed', hairStyle: 'slick-gala',
          outfitId: 'equestrian-tailored', walkSpeed: 1.32,
          waypoints: [
            { x: 72.8, z: -27.1, pause: 8.5, workPose: 'work_operate', faceYaw: Math.PI * 0.5 },
            { x: 72.8, z: -25.6, pause: 3.2, workPose: 'work_examine', faceYaw: -Math.PI * 0.75 },
            { x: 75.8, z: -25.6, pause: 0.6 },
            { x: 76.2, z: -26.8, pause: 2.6, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
            { x: 75.8, z: -25.6, pause: 0.6 },
            { x: 72.8, z: -25.6, pause: 0.6 },
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
          x: 84.5, z: -18.5, y: 0.12, patrolR: 1.0, dressHex: '#1e6e8c', trimHex: '#d4af55', hairStyle: 'regency-bun',
          outfitId: 'equestrian-tailored', walkSpeed: 1.36,
          waypoints: [
            { x: 84.5, z: -18.5, pause: 5.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 80.2, z: -18.5, pause: 0.6 },
            { x: 80.2, z: -21.2, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 80.2, z: -23.35, pause: 0.6 },
            { x: 84.5, z: -23.35, pause: 4.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 80.2, z: -23.35, pause: 0.6 },
            { x: 80.2, z: -18.5, pause: 0.6 },
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
          x: 75.4, z: -17.3, y: 0.12, patrolR: 1.0, dressHex: '#f4f8fc', trimHex: '#b8283c', hairStyle: 'slick-gala',
          outfitId: 'equestrian-tailored', walkSpeed: 1.44,
          waypoints: [
            { x: 75.4, z: -17.3, pause: 5.5, workPose: 'work_examine', faceYaw: -Math.PI * 0.75 },
            { x: 75.8, z: -18.9, pause: 4.5, workPose: 'work_station', faceYaw: Math.PI },
            { x: 75.8, z: -17.25, pause: 0.6 },
            { x: 72.9, z: -17.25, pause: 3.5, workPose: 'work_examine', faceYaw: -Math.PI * 0.75 },
            { x: 75.8, z: -17.25, pause: 0.6 },
            { x: 75.8, z: -18.5, pause: 0.6 },
            { x: 79.5, z: -18.5, pause: 0.6 },
            { x: 79.5, z: -17.2, pause: 2.2, workPose: 'work_station', faceYaw: 0 },
            { x: 79.5, z: -18.5, pause: 0.6 },
            { x: 75.8, z: -18.5, pause: 0.6 },
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
          x: 75.8, z: -17.3, y: 0.12, patrolR: 1.0, dressHex: '#f4f8fc', trimHex: '#b8283c', hairStyle: 'royal-waves',
          outfitId: 'equestrian-tailored', walkSpeed: 1.42,
          waypoints: [
            { x: 75.8, z: -17.3, pause: 4.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 75.9, z: -18.9, pause: 4.0, workPose: 'work_station', faceYaw: Math.PI },
            { x: 75.8, z: -18.5, pause: 0.6 },
            { x: 79.5, z: -18.5, pause: 0.6 },
            { x: 79.5, z: -21.3, pause: 0.6 },
            { x: 76.7, z: -21.3, pause: 3.4, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 79.5, z: -21.3, pause: 0.6 },
            { x: 79.5, z: -18.5, pause: 0.6 },
            { x: 75.8, z: -18.5, pause: 0.6 },
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
          x: 80.2, z: -22.2, y: 0.12, patrolR: 0.9, dressHex: '#dfeef7', trimHex: '#2f7a58', hairStyle: 'marie-updo',
          outfitId: 'equestrian-tailored', walkSpeed: 1.32,
          waypoints: [
            { x: 80.2, z: -22.2, pause: 4.5, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 80.2, z: -18.5, pause: 0.6 },
            { x: 84.5, z: -18.5, pause: 4.5, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 80.2, z: -18.5, pause: 0.6 },
            { x: 80.2, z: -23.35, pause: 0.6 },
            { x: 84.5, z: -23.35, pause: 3.8, workPose: 'work_examine', faceYaw: Math.PI * 0.5 },
            { x: 80.2, z: -23.35, pause: 0.6 },
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
          x: 75.8, z: -26.6, y: 0.12, patrolR: 0.9, dressHex: '#c8e4ef', trimHex: '#1e6e8c', hairStyle: 'romantic-bun',
          outfitId: 'equestrian-tailored', walkSpeed: 1.34,
          waypoints: [
            { x: 75.8, z: -26.6, pause: 6.5, workPose: 'work_operate', faceYaw: -Math.PI * 0.5 },
            { x: 75.8, z: -25.6, pause: 0.6 },
            { x: 72.75, z: -25.6, pause: 3.0, workPose: 'work_examine', faceYaw: Math.PI * 0.75 },
            { x: 75.8, z: -25.6, pause: 0.6 },
            { x: 76.2, z: -27.0, pause: 0.6 },
            { x: 78.8, z: -27.0, pause: 0.6 },
            { x: 81.5, z: -27.8, pause: 3.0, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 78.8, z: -27.0, pause: 0.6 },
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
            { x: 79.6, z: -33.6, pause: 0.6 },
            { x: 79.6, z: -29.8, pause: 0.6 },
            { x: 79.6, z: -21.3, pause: 0.6 },
            { x: 77.2, z: -21.3, pause: 3.0, workPose: 'work_examine', faceYaw: Math.PI },
            { x: 79.6, z: -21.3, pause: 0.6 },
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
          vacatePos: { x: 71.8, y: 0.12, z: -25.8, yaw: 0 },
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
          x: 76.95, z: -17.72, y: 0.20, patrolR: 0, dressHex: '#b27c88', trimHex: '#faf2e6', hairStyle: 'riviera-bob',
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
          id: 'patient-coming-henri', role: 'citizen', name: 'Citizen Olivier (Coming & Going)', roleLabel: 'Hospital Outpatient & Resident',
          x: -18.0, z: -13.5, y: 0.0, patrolR: 1.5, dressHex: '#4f6d82', trimHex: '#f1d08a', hairStyle: 'slick-gala',
          walkSpeed: 1.38,
          waypoints: [
            { x: -18.0, z: -13.5, pause: 1.4 },
            { x: 35.0, z: -13.5, pause: 0.6 },
            { x: 79.6, z: -15.0, pause: 0.6 },
            { x: 80.5, z: -24.6, pause: 3.6, workPose: 'converse', faceYaw: Math.PI * 0.5 },
            { x: 79.6, z: -21.3, pause: 0.4 },
            { x: 76.65, z: -21.3, pause: 0.4 },
            { x: 76.65, z: -22.22, pause: 6.5, workPose: 'sleep', yOverride: 0.70, rigOffsetY: 0.09, faceYaw: 0, lockSpotId: 'hospital_bed_3' },
            { x: 76.65, z: -21.3, pause: 0.4 },
            { x: 79.6, z: -21.3, pause: 0.4 },
            { x: 79.6, z: -15.2, pause: 1.2 },
            { x: 32.0, z: -13.5, pause: 1.2 },
            { x: -18.0, z: -13.5, pause: 3.5 },
          ],
          prompt: 'Talk to Citizen Olivier (Outpatient)',
          msg: 'I walked down Riviera Way to Hôpital Royal for my check-up and bed rest in Bay 03 — now heading home feeling brand new!',
          duty: 'Coming and going between the suburban blocks and Hôpital Royal Check-Up Desk.',
          gossip: 'Emergency responders at the separated ER Wing stabilized three neighborhood residents this morning!',
          flirt: 'Walking down the boulevard feels twice as bright when the Princess waves!',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'patient-coming-noemie', role: 'citizen', name: 'Resident Noémie (Outpatient)', roleLabel: 'Riviera Outpatient Visitor',
          x: 56.0, z: 2.0, y: 0.0, patrolR: 1.5, dressHex: '#8d5b76', trimHex: '#faf2e6', hairStyle: 'royal-waves',
          walkSpeed: 1.34,
          waypoints: [
            { x: 56.0, z: 2.0, pause: 1.6 },
            { x: 79.6, z: -13.5, pause: 0.6 },
            { x: 79.6, z: -18.5, pause: 0.6 },
            { x: 76.0, z: -18.5, pause: 0.4 },
            { x: 76.95, z: -16.88, pause: 4.5, workPose: 'sit', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: -Math.PI * 0.5 },
            { x: 76.0, z: -18.5, pause: 0.4 },
            { x: 79.6, z: -18.5, pause: 0.4 },
            { x: 79.6, z: -29.8, pause: 0.6 },
            { x: 79.6, z: -34.2, pause: 4.2, workPose: 'converse', faceYaw: 0 },
            { x: 79.6, z: -15.2, pause: 0.6 },
            { x: 56.0, z: 2.0, pause: 3.2 },
          ],
          prompt: 'Talk to Resident Noémie (Hospital Visitor)',
          msg: 'I stroll up from East Avenue into Hôpital Royal whenever I need Dr. Marchetti’s triage desk and fresh garden air!',
          duty: 'Visiting ER triage, relaxing in the Green Healing Courtyard, then walking back into town.',
          gossip: 'Everyone in town can watch patients walking in, resting in the wards, and getting discharged!',
          flirt: 'It is comforting knowing the Crown Heiress keeps the hospital doors open to all residents!',
          clout: 1, isCitizen: true,
        },
        {
          id: 'patient-emergency', role: 'patient', name: 'Emergency Resident Mateo', roleLabel: 'ER Ambulance Arrival Patient',
          x: 68.5, z: -13.5, y: 0.0, patrolR: 1.2, dressHex: '#c84b59', trimHex: '#ffffff', hairStyle: 'wavy-curtain-shag',
          walkSpeed: 1.32,
          waypoints: [
            { x: 68.5, z: -13.5, pause: 3.5 },
            { x: 79.6, z: -15.5, pause: 1.2 },
            { x: 79.6, z: -18.5, pause: 0.5 },
            { x: 75.8, z: -18.5, pause: 0.5 },
            { x: 75.8, z: -17.25, pause: 0.4 },
            { x: 72.0, z: -17.25, pause: 0.4 },
            { x: 72.0, z: -18.12, pause: 8.0, workPose: 'sleep', yOverride: 0.70, rigOffsetY: 0.09, faceYaw: 0, lockSpotId: 'hospital_bed_4' },
            { x: 72.0, z: -17.25, pause: 0.4 },
            { x: 75.8, z: -17.25, pause: 0.4 },
            { x: 75.8, z: -18.5, pause: 0.6 },
            { x: 79.6, z: -18.5, pause: 0.6 },
            { x: 79.6, z: -15.0, pause: 1.2 },
            { x: 68.5, z: -13.5, pause: 4.0 },
          ],
          prompt: 'Check on ER Resident Mateo',
          msg: 'The separated ER doctors and nurses stabilized my vitals fast — thank goodness Hôpital Royal is right down the avenue!',
          duty: 'Arriving for urgent ER Bay 01 care during ambulance calls and discharging once cleared.',
          gossip: 'Watch Dr. Vance and Nurse Clara rush right to Bay 01 whenever an emergency is called!',
          flirt: 'Seeing the Princess visit the ER wing gave me an instant recovery boost!',
          clout: 2, male: true, isCitizen: true,
        },
        {
          id: 'farmer-gerard', role: 'staff', name: 'Farmer Gérard', roleLabel: 'Greenfields Farm Owner',
          x: -120.5, z: -31.5, y: 0.0, patrolR: 1.4, dressHex: '#5e733b', trimHex: '#d9a441', hairStyle: 'slick-gala',
          waypoints: [
            { x: -120.5, z: -31.5, pause: 3.6, workPose: 'cook', faceYaw: Math.PI },
            { x: -126.0, z: -31.5, pause: 3.2, workPose: 'toddler_watch', faceYaw: -Math.PI * 0.5 },
            { x: -126.0, z: -28.0, pause: 3.0, workPose: 'work_station', faceYaw: 0 },
            { x: -141.5, z: -28.0, pause: 0.5 },
            { x: -141.5, z: -36.5, pause: 0.5 },
            { x: -145.1, z: -37.8, pause: 5.8, workPose: 'sleep', yOverride: 0.70, rigOffsetY: 0.09, faceYaw: Math.PI * 0.5, lockSpotId: 'farm_bed' },
            { x: -141.5, z: -36.5, pause: 0.5 },
            { x: -141.5, z: -28.0, pause: 0.5 },
            { x: -126.0, z: -28.0, pause: 0.5 },
          ],
          prompt: 'Talk to Farmer Gérard (Farm)',
          msg: 'Hey there! Just finished checking the strawberry rows — the cows are grazing and I catch a quick afternoon nap inside the farmhouse when work slows down.',
          duty: 'Harvesting organic berries, looking after the barn animals, and delivering fresh crates to the bakery and hotel kitchen.',
          gossip: 'Neighbors in the Stone Mansionettes swear my rooster is a better alarm clock than their phones!',
          flirt: 'Fresh country air looks great on you — grab a basket of ripe strawberries before you head back!',
          clout: 2, male: true,
        },
        {
          id: 'mansionette-sophia', role: 'citizen', name: 'Lady Sophia (Mansionettes)', roleLabel: 'Stone Mansionette Resident',
          x: -95.5, z: -14.5, y: 0.0, patrolR: 1.3, dressHex: '#5c4b75', trimHex: '#f1d08a', hairStyle: 'royal-waves',
          waypoints: [
            { x: -95.5, z: -14.5, pause: 2.8 },
            { x: -95.5, z: -18.5, pause: 0.5 },
            { x: -95.4, z: -23.9, pause: 4.0, workPose: 'cook', faceYaw: Math.PI },
            { x: -95.4, z: -21.2, pause: 0.5 },
            { x: -91.5, z: -21.2, pause: 0.5 },
            { x: -90.68, z: -19.4, pause: 4.2, workPose: 'sofa', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: -Math.PI * 0.5, lockSpotId: 'mansionette_2_sofa' },
            { x: -91.6, z: -17.6, pause: 0.5 },
            { x: -95.5, z: -17.6, pause: 0.5 },
            { x: -95.5, z: -14.5, pause: 0.5 },
            { x: -86.5, z: -14.5, pause: 3.0 },
          ],
          prompt: 'Chat with Lady Sophia (Mansionettes)',
          msg: 'Come tour our four 2-Bedroom Stone Mansionettes! Each has two real bedrooms, an enclosed full bath, kitchen, and lounge!',
          duty: 'I cook dinner on the stone kitchen range, curl up on the parlor sofa, and stroll the mansionette gardens.',
          gossip: 'Half of Willow Creek is buzzing about your Royal Motorcade driving down Riviera Boulevard!',
          flirt: 'Don’t stand out in the lane too long looking so glamorous — come inside Ashford or Bellevue Mansionette!',
          clout: 2,
        },
        {
          id: 'lady-camille', role: 'friend', name: 'Lady Camille (Best Friend)', roleLabel: 'Inner-Circle Bestie',
          x: -64.5, z: 14.5, y: 0, patrolR: 1.4, dressHex: '#b85d74', trimHex: '#e6c373', hairStyle: 'royal-waves',
          waypoints: [
            { x: -64.5, z: 14.5, pause: 2.8 },
            { x: -64.5, z: 24.0, pause: 3.0 },
            { x: -69.5, z: 24.0, pause: 2.8 },
            { x: -69.5, z: 14.5, pause: 2.6 },
          ],
          prompt: 'Chat & Gossip with Best Friend Camille',
          msg: 'Bestie!! Did you see the Green Hospital Garden, the Pizza booths, and the Bakeries? Invite me into your car or dine together!',
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
          msg: 'Heyyy girl! Grab a hot pepperoni slice with me at Palazzo Napoli — or hop in a car and ride through town together!',
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
          x: 19.8, z: 5.0, y: 0.0, patrolR: 1.3, dressHex: '#2f3d58', trimHex: '#d4af55', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: 19.8, z: 5.0, pause: 2.8 },
            { x: 19.8, z: 20.0, pause: 3.0 },
            { x: 5.2, z: 20.0, pause: 2.8 },
            { x: 5.2, z: 5.0, pause: 2.6 },
          ],
          prompt: 'Walk & Chat with Marquis Julian',
          msg: 'Your Highness! I was hoping we might share afternoon tea at the Patisserie or take a spin down Riviera Boulevard!',
          duty: 'Escort for garden walks, shared meals, car rides, and fierce chess matches.',
          gossip: 'Head Butler Henri told me the whole court bets on which sports car you will drive next!',
          flirt: 'Tell me straight — would you escape this courtyard with me to Palazzo Napoli or Club Couronne tonight?',
          clout: 2, male: true,
        },
        {
          id: 'baker-luc', role: 'chef', name: 'Master Baker Luc', roleLabel: 'Wallflour & Maison Brioche Patissier',
          x: -84.0, z: 38.5, y: 0.12, patrolR: 0.8, dressHex: '#faf7f2', trimHex: '#91424c', hairStyle: 'slick-gala',
          waypoints: [
            { x: -84.0, z: 38.5, pause: 4.5, workPose: 'cook', faceYaw: Math.PI },
            { x: -79.2, z: 38.5, pause: 3.4, workPose: 'serve', faceYaw: 0 },
            { x: -79.2, z: 39.4, pause: 2.6, workPose: 'work_station', faceYaw: 0 },
            { x: -84.0, z: 39.4, pause: 3.0, workPose: 'cook', faceYaw: Math.PI },
          ],
          prompt: 'Chat with Master Baker Luc (Patisserie)',
          msg: 'Warm croissants, fresh baguettes, and Louis XVI macaron boxes are freshly baked in our Wallflour vitrine, Your Highness!',
          duty: 'I bake artisan sourdough, croissants, and ribboned rose macarons inside Wallflour & Maison Brioche.',
          gossip: 'Honors students from University North Hall always sprint here between debates!',
          flirt: 'Sweet as powdered rosewater, Princess — may I box a special treat just for you?',
          clout: 1, male: true,
        },
        {
          id: 'baker-maya', role: 'chef', name: 'Conservatory Baker Maya', roleLabel: 'Bumblebee Glasshouse Baker',
          x: -75.2, z: 38.8, y: 0.12, patrolR: 0.75, dressHex: '#f4ebdc', trimHex: '#d99a2b', hairStyle: 'romantic-bun',
          waypoints: [
            { x: -75.2, z: 38.8, pause: 4.2, workPose: 'cook', faceYaw: Math.PI },
            { x: -71.5, z: 38.8, pause: 3.2, workPose: 'serve', faceYaw: 0 },
            { x: -71.5, z: 42.5, pause: 3.0, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
            { x: -75.2, z: 42.5, pause: 2.8 },
          ],
          prompt: 'Talk to Baker Maya (Bumblebee Glasshouse)',
          msg: 'Step inside our sunny Bumblebee Conservatory! Wildflower Honey Cake, lemon cupcakes, and bee pollen scones are glazing right now!',
          duty: 'I frost layered wildflower honey cakes, bake lemon curd cupcakes, and tend the climbing conservatory ivy.',
          gossip: 'Even the Palace Maids order our wildflower honey jars for the Princess’s Breakfast in Bed!',
          flirt: 'Golden honey sunlight suits you wonderfully, Your Highness!',
          clout: 2,
        },
        {
          id: 'waitress-gabrielle', role: 'staff', name: 'Tea Hostess Gabrielle', roleLabel: 'Gingham Salon & 2F Loft Server',
          x: -82.6, z: 39.2, y: 0.12, patrolR: 0.9, dressHex: '#92b6da', trimHex: '#fffaf5', hairStyle: 'riviera-bob',
          waypoints: [
            { x: -82.6, z: 39.2, pause: 2.6, workPose: 'work_station', faceYaw: Math.PI },
            { x: -82.6, z: 42.6, pause: 3.2, workPose: 'serve', faceYaw: -Math.PI * 0.5 },
            { x: -84.0, z: 42.6, pause: 0.5 },
            { x: -84.0, z: 45.6, pause: 3.4, workPose: 'serve', faceYaw: Math.PI },
            { x: -82.4, z: 45.6, pause: 2.4, workPose: 'serve', faceYaw: Math.PI },
            { x: -84.0, z: 45.6, pause: 0.5 },
            { x: -84.0, z: 42.6, pause: 0.5 },
            { x: -82.6, z: 42.6, pause: 0.5 },
          ],
          prompt: 'Order Tea with Hostess Gabrielle (Bakery)',
          msg: 'Take a seat at our powder-blue gingham tables, outside at the sidewalk rose bistro, or dine with a friend upstairs!',
          duty: 'I carry silver tea trays between the gingham tables and the sidewalk rose bistro.',
          gossip: 'Duchess Vivienne and Lady Camille booked the upstairs piano tasting table for this evening!',
          flirt: 'A quiet gingham table by the arched windows is always saved for you, Princess.',
          clout: 1,
        },
        {
          id: 'pizza-chef-marco', role: 'chef', name: 'Pizzaiolo Chef Marco', roleLabel: 'Palazzo Napoli Wood-Fired Chef',
          x: -140.8, z: 36.5, y: 0.12, patrolR: 0.9, dressHex: '#faf7f2', trimHex: '#a6262e', hairStyle: 'slick-gala',
          waypoints: [
            { x: -140.8, z: 36.5, pause: 5.0, workPose: 'cook', faceYaw: Math.PI },
            { x: -136.2, z: 36.5, pause: 3.2, workPose: 'serve', faceYaw: 0 },
            { x: -136.2, z: 39.2, pause: 0.5 },
            { x: -141.6, z: 39.2, pause: 3.4, workPose: 'serve', faceYaw: -Math.PI * 0.5 },
            { x: -136.2, z: 39.2, pause: 0.5 },
            { x: -136.2, z: 36.5, pause: 0.5 },
          ],
          prompt: 'Order Pizza from Chef Marco',
          msg: 'Wood-fired truffle margherita and pepperoni slices hot out of our brick oven! Grab a booth or invite friends along!',
          duty: 'I toss fresh Neapolitan dough by the stone pizza oven and serve hot slices at the red booths.',
          gossip: 'Besties Chloe and Camille always split a spicy truffle pie here every Friday!',
          flirt: 'First slice off the stone hearth is always complimentary for royalty!',
          clout: 1, male: true,
        },
        {
          id: 'market-clerk-jules', role: 'staff', name: 'Grocer Clerk Jules', roleLabel: 'Royale Fresh Market Cashier',
          x: -115.4, z: 40.2, y: 0.12, patrolR: 0.9, dressHex: '#3f6c45', trimHex: '#f4e6d2', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: -115.4, z: 40.2, pause: 4.5, workPose: 'work_station', faceYaw: 0 },
            { x: -109.2, z: 40.2, pause: 3.2, workPose: 'cook', faceYaw: -Math.PI * 0.5 },
            { x: -109.2, z: 42.6, pause: 3.2, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: -112.4, z: 42.6, pause: 2.2 },
            { x: -112.4, z: 40.2, pause: 0.6 },
          ],
          prompt: 'Shop with Grocer Jules (Market)',
          msg: 'Fresh peaches, truffles, and iced sodas stocked neatly in Royale Fresh Market — step right up to the register!',
          duty: 'I ring up Royal Fresh Market baskets, restock orchard berries, and pack picnic hampers.',
          gossip: 'Baker Maya gets her early-morning wildflower honey crates delivered right through my shop!',
          flirt: 'Picking the ripest Riviera strawberries just for Your Highness!',
          clout: 1, male: true,
        },
        {
          id: 'boutique-stylist-rose', role: 'staff', name: 'Boutique Director Rose', roleLabel: 'Galerie Royale Luxury Advisor',
          x: 106.5, z: 42.3, y: 0.12, patrolR: 0.9, dressHex: '#2f2136', trimHex: '#e6c373', hairStyle: 'marie-updo',
          waypoints: [
            { x: 106.5, z: 42.3, pause: 4.4, workPose: 'work_station', faceYaw: 0 },
            { x: 108.6, z: 42.3, pause: 3.0, workPose: 'serve', faceYaw: -Math.PI * 0.5 },
            { x: 108.6, z: 39.1, pause: 3.4, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 104.4, z: 39.1, pause: 3.0, workPose: 'serve', faceYaw: Math.PI },
            { x: 108.6, z: 39.1, pause: 0.5 },
            { x: 108.6, z: 42.3, pause: 0.5 },
          ],
          prompt: 'Browse with Director Rose (Boutique)',
          msg: 'Silk ribbon handbags, Riviera resort dresses, and velvet evening jewelry await in Galerie Royale!',
          duty: 'I style boutique displays, ring up couture purchases, and advise court guests on gala looks.',
          gossip: 'The velvet tiara clutch in Display Case #2 sold out within twenty minutes of Crown Dispatch!',
          flirt: 'You make every silk dress on the rack look effortless, Your Highness!',
          clout: 2,
        },
        {
          id: 'stylist-celine', role: 'staff', name: 'Couturier Céline', roleLabel: 'Maison de Couture Director',
          x: 79.6, z: 41.2, y: 0.12, patrolR: 0.9, dressHex: '#5e2b45', trimHex: '#f1d08a', hairStyle: 'marie-updo',
          waypoints: [
            { x: 79.6, z: 41.2, pause: 4.2, workPose: 'work_station', faceYaw: Math.PI },
            { x: 81.4, z: 41.2, pause: 3.2, workPose: 'serve', faceYaw: Math.PI * 0.5 },
            { x: 81.4, z: 38.6, pause: 3.0, workPose: 'work_station', faceYaw: 0 },
            { x: 79.6, z: 38.6, pause: 2.8 },
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
          x: 86.6, z: 30.8, y: 0.24, patrolR: 1.1, dressHex: '#2f6f8e', trimHex: '#fff4dc', hairStyle: 'wavy-curtain-shag',
          waypoints: [
            { x: 86.6, z: 30.8, pause: 3.8, workPose: 'stargaze', faceYaw: -Math.PI * 0.5 },
            { x: 86.6, z: 21.9, pause: 3.4, workPose: 'work_station', faceYaw: -Math.PI * 0.5 },
            { x: 76.0, z: 21.9, pause: 3.0, workPose: 'serve', faceYaw: 0 },
            { x: 86.6, z: 21.9, pause: 0.5 },
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
            { x: 132.2, z: 37.8, pause: 5.5, workPose: 'club_dance', faceYaw: 0 },
            { x: 134.8, z: 37.8, pause: 4.5, workPose: 'club_dance', faceYaw: 0 },
            { x: 134.8, z: 39.8, pause: 3.2, workPose: 'serve', faceYaw: 0 },
            { x: 132.2, z: 39.8, pause: 4.0, workPose: 'club_dance', faceYaw: 0 },
          ],
          prompt: 'Talk to DJ Vivienne (Club Privé)',
          msg: 'Hit the neon dancefloor or order bottle service, Princess — the VIP booth is always yours!',
          duty: 'I spin midnight synth-baroque sets live at the neon booth while keeping the dancefloor electric.',
          gossip: 'Crown Dispatch offered my bartender ₡500 for photos of whoever sneaks into the VIP booth tonight!',
          flirt: 'Careful — one slow dance under these magenta spotlights and the whole court will talk!',
          clout: 3,
        },
        {
          id: 'neighbor-claire', role: 'citizen', name: 'Elmwood St. Neighbor Claire', roleLabel: '3-Bedroom House Neighbor',
          x: -69.5, z: 28.5, y: 0.0, patrolR: 1.4, dressHex: '#6c8b78', trimHex: '#f4e6d2', hairStyle: 'romantic-bun',
          waypoints: [
            { x: -69.5, z: 28.5, pause: 2.8 },
            { x: -65.5, z: 28.5, pause: 3.0 },
            { x: -65.5, z: 21.5, pause: 2.6 },
            { x: -69.5, z: 21.5, pause: 2.8 },
          ],
          prompt: 'Chat with Neighbor Claire',
          msg: 'Come inside our 3-Bedroom Middle-Class Houses! Kids are playing on the lawns while families cook and watch the toddlers indoors!',
          duty: 'I organize Willow Creek block parties and wave to everyone driving down Cypress Street.',
          gossip: 'Everyone noticed the new 2-Bedroom Stone Mansionettes up the block — real estate is booming!',
          flirt: 'Always lovely seeing royalty drop by our cozy suburban picket-fence block!',
          clout: 1,
        },
        {
          id: 'headmistress-laurent', role: 'staff', name: 'Headmistress Laurent', roleLabel: 'High School Principal',
          x: 79.6, z: 17.0, y: 0.04, patrolR: 0.9, dressHex: '#23324b', trimHex: '#e6c373', hairStyle: 'regency-bun',
          waypoints: [
            { x: 79.6, z: 17.0, pause: 3.4, workPose: 'work_station', faceYaw: 0 },
            { x: 79.6, z: 12.6, pause: 3.4, workPose: 'read', faceYaw: 0 },
            { x: 75.8, z: 12.6, pause: 3.0, workPose: 'work_station', faceYaw: Math.PI * 0.5 },
            { x: 79.6, z: 12.6, pause: 0.6 },
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
          x: 76.2, z: 12.6, y: 0.12, patrolR: 0.8, dressHex: '#a43753', trimHex: '#f8e6c8', hairStyle: 'riviera-bob',
          waypoints: [
            { x: 76.2, z: 12.6, pause: 3.2, workPose: 'read', faceYaw: Math.PI },
            { x: 83.0, z: 12.6, pause: 2.8, workPose: 'converse', faceYaw: -Math.PI * 0.5 },
            { x: 83.0, z: 13.8, pause: 2.6 },
            { x: 76.2, z: 13.8, pause: 2.8 },
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
            { x: 106.5, z: 16.5, pause: 3.6, workPose: 'read', faceYaw: Math.PI },
            { x: 106.5, z: 11.4, pause: 3.4, workPose: 'work_station', faceYaw: 0 },
            { x: 111.5, z: 11.4, pause: 3.2, workPose: 'read', faceYaw: -Math.PI * 0.5 },
            { x: 106.5, z: 11.4, pause: 0.6 },
          ],
          prompt: 'Consult Professor Beaumont (University)',
          msg: 'Welcome to Crown University! Visit our Debate Hall, Concert Piano, North Dorms Clock Tower & Botanic Glasshouse!',
          duty: 'I chair the Diplomacy Faculty and supervise our North Dormitories and research library.',
          gossip: 'Our Botanic Glasshouse orchids bloomed early right as your limousine pulled up!',
          flirt: 'True brilliance and elegance rarely meet in one person — you honour our university halls.',
          clout: 2, male: true,
        },
        // LIVELY HOUSEHOLD FAMILIES, FAMILY MEALS, SLEEPING, KIDS PLAYING & TODDLERS BEING WATCHED
        {
          id: 'hh1-dad-arthur', role: 'citizen', name: 'Arthur (Elmwood Villa)', roleLabel: '3-Bed Villa Father',
          x: -79.4, z: 6.1, y: 0.12, patrolR: 1.1, dressHex: '#455b70', trimHex: '#efe2cb', hairStyle: 'slick-gala',
          walkSpeed: 1.18,
          waypoints: [
            { x: -79.4, z: 6.1, pause: 4.2, workPose: 'cook', faceYaw: Math.PI },
            { x: -79.4, z: 8.26, pause: 4.8, workPose: 'eat', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_1_island' },
            { x: -81.15, z: 8.26, pause: 0.4 },
            { x: -81.15, z: 12.0, pause: 5.0, workPose: 'toddler_watch', faceYaw: Math.PI * 0.5 },
            { x: -81.15, z: 13.38, pause: 0.4 },
            { x: -79.2, z: 13.38, pause: 0.4 },
            { x: -79.2, z: 14.28, pause: 4.0, workPose: 'sofa', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_1_sofa' },
            { x: -79.2, z: 13.38, pause: 0.4 },
            { x: -81.15, z: 13.38, pause: 0.4 },
            { x: -81.15, z: 9.8, pause: 0.5 },
            { x: -85.0, z: 9.8, pause: 0.5 },
            { x: -88.4, z: 9.8, pause: 6.0, workPose: 'sleep', yOverride: 0.70, rigOffsetY: 0.09, faceYaw: Math.PI * 0.5, lockSpotId: 'mid_house_1_bed_2' },
            { x: -85.0, z: 9.8, pause: 0.5 },
            { x: -81.15, z: 9.8, pause: 0.5 },
            { x: -81.15, z: 6.1, pause: 0.4 },
          ],
          prompt: 'Visit Arthur at Elmwood Villa',
          msg: 'Come on inside! I just flipped pancakes at the stove, we are sitting down to eat at the breakfast bar while little Lily plays on the rug.',
          duty: 'Cooking family breakfast, eating together at the island, watching toddler Lily, and catching a nap.',
          gossip: 'Leo keeps trying to beat everyone down Cypress Street on his bike!',
          flirt: 'Pull up a stool at our breakfast bar whenever you want real homemade coffee!',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'hh1-kid-leo', role: 'citizen', ageGroup: 'child', name: 'Leo (Elmwood Kid)', roleLabel: 'Willow Creek Kid',
          x: -72.8, z: 8.6, y: 0.0, patrolR: 1.2, dressHex: '#3f76a8', trimHex: '#f8e6c8', hairStyle: 'wavy-curtain-shag',
          walkSpeed: 1.52,
          waypoints: [
            { x: -72.8, z: 8.6, pause: 4.0, workPose: 'play_kid', faceYaw: 0 },
            { x: -75.2, z: 9.8, pause: 0.5 },
            { x: -77.4, z: 9.8, pause: 0.5 },
            { x: -77.4, z: 8.26, pause: 0.4 },
            { x: -78.58, z: 8.26, pause: 4.4, workPose: 'eat', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_1_island' },
            { x: -80.8, z: 8.26, pause: 0.4 },
            { x: -80.6, z: 13.4, pause: 3.8, workPose: 'play_kid', faceYaw: Math.PI },
            { x: -80.8, z: 9.8, pause: 0.5 },
            { x: -75.2, z: 9.8, pause: 0.5 },
            { x: -72.8, z: 11.2, pause: 2.2, workPose: 'play_kid', faceYaw: 0 },
          ],
          prompt: 'Wave at Kid Leo (Elmwood)',
          msg: 'Hi!! Watch how high I can hop on the lawn — right after Dad calls me inside for pancakes at the breakfast island!',
          duty: 'Playing on the Elmwood yard, eating family breakfast with Dad, and playing with baby Lily.',
          gossip: 'I saw two bright shiny cars cruising right down the boulevard earlier!',
          flirt: 'Bet you can’t beat me in a race to the corner sidewalk!',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'hh1-toddler-lily', role: 'citizen', ageGroup: 'toddler', name: 'Baby Lily (Elmwood Toddler)', roleLabel: 'Willow Creek Toddler',
          x: -80.6, z: 12.1, y: 0.12, patrolR: 0.5, dressHex: '#e69db2', trimHex: '#fffaf5', hairStyle: 'riviera-bob',
          walkSpeed: 0.72,
          waypoints: [
            { x: -80.6, z: 12.1, pause: 4.8, workPose: 'toddler_play', faceYaw: Math.PI },
            { x: -80.6, z: 13.3, pause: 4.0, workPose: 'toddler_play', faceYaw: Math.PI * 0.5 },
            { x: -79.8, z: 13.5, pause: 4.4, workPose: 'toddler_play', faceYaw: -Math.PI * 0.5 },
            { x: -80.6, z: 13.3, pause: 0.6 },
          ],
          prompt: 'Play with Toddler Lily (Elmwood)',
          msg: 'Giggles and claps happily on the soft pastel parlor rug while Dad watches closely!',
          duty: 'Bouncing, clapping hands, and toddling safely on the living room rug inside Elmwood Villa.',
          gossip: 'Arthur keeps plush cushions all around so Lily never bumps into the coffee table!',
          flirt: 'Yay! Yay! Peek-a-boo!',
          clout: 1, isCitizen: true,
        },
        {
          id: 'hh2-mom-eleonore', role: 'citizen', name: 'Éléonore (Lavender Gables)', roleLabel: '3-Bed Home Mother',
          x: -81.15, z: 30.7, y: 0.12, patrolR: 1.0, dressHex: '#b87088', trimHex: '#fff8ef', hairStyle: 'romantic-bun',
          walkSpeed: 1.20,
          waypoints: [
            { x: -81.15, z: 30.7, pause: 5.0, workPose: 'toddler_watch', faceYaw: Math.PI * 0.5 },
            { x: -81.15, z: 24.8, pause: 0.4 },
            { x: -79.4, z: 24.8, pause: 4.2, workPose: 'cook', faceYaw: Math.PI },
            { x: -79.4, z: 26.96, pause: 4.8, workPose: 'eat', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_2_island' },
            { x: -81.15, z: 26.96, pause: 0.4 },
            { x: -81.15, z: 32.08, pause: 0.4 },
            { x: -79.2, z: 32.08, pause: 0.4 },
            { x: -79.2, z: 32.98, pause: 3.8, workPose: 'sofa', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_2_sofa' },
            { x: -79.2, z: 32.08, pause: 0.4 },
            { x: -81.15, z: 32.08, pause: 0.4 },
            { x: -81.15, z: 28.5, pause: 0.5 },
            { x: -85.0, z: 28.5, pause: 0.5 },
            { x: -88.4, z: 28.5, pause: 5.8, workPose: 'sleep', yOverride: 0.70, rigOffsetY: 0.09, faceYaw: Math.PI * 0.5, lockSpotId: 'mid_house_2_bed_2' },
            { x: -85.0, z: 28.5, pause: 0.5 },
            { x: -81.15, z: 28.5, pause: 0.5 },
          ],
          prompt: 'Chat with Éléonore (Lavender Gables)',
          msg: 'Come in! Chloé-Marie and I are having honey scones at the breakfast island while little Hugo toddles right beside us.',
          duty: 'Watching toddler Hugo, cooking family meals, eating together at the island, and napping upstairs.',
          gossip: 'We walk right up the street to Wallflour Bakery for warm croissants almost every morning!',
          flirt: 'You always brighten our block — come join us for tea anytime!',
          clout: 1, isCitizen: true,
        },
        {
          id: 'hh2-toddler-hugo', role: 'citizen', ageGroup: 'toddler', name: 'Baby Hugo (Lavender Gables)', roleLabel: '3-Bed Home Toddler',
          x: -80.6, z: 30.8, y: 0.12, patrolR: 0.45, dressHex: '#7da8c9', trimHex: '#fff8ef', hairStyle: 'wavy-curtain-shag',
          walkSpeed: 0.70,
          waypoints: [
            { x: -80.6, z: 30.8, pause: 4.5, workPose: 'toddler_play', faceYaw: Math.PI },
            { x: -80.6, z: 32.0, pause: 4.2, workPose: 'toddler_play', faceYaw: -Math.PI * 0.5 },
            { x: -79.8, z: 32.2, pause: 4.0, workPose: 'toddler_play', faceYaw: Math.PI * 0.5 },
            { x: -80.6, z: 32.0, pause: 0.6 },
          ],
          prompt: 'Wave to Baby Hugo (Lavender Gables)',
          msg: 'Claps both little hands excitedly as Mom smiles and cheers him on!',
          duty: 'Toddling around the Lavender Gables rug under his mother’s watchful eyes.',
          gossip: 'Hugo took his very first steady steps right beside the rose coffee table!',
          flirt: 'Wheee! Happy baby bounces!',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'hh2-kid-chloemarie', role: 'citizen', ageGroup: 'child', name: 'Chloé-Marie (Lavender Kid)', roleLabel: 'Willow Creek Kid',
          x: -72.8, z: 27.2, y: 0.0, patrolR: 1.2, dressHex: '#9c6ba8', trimHex: '#fff4e4', hairStyle: 'royal-waves',
          walkSpeed: 1.48,
          waypoints: [
            { x: -72.8, z: 27.2, pause: 4.0, workPose: 'play_kid', faceYaw: 0 },
            { x: -75.2, z: 28.5, pause: 0.5 },
            { x: -77.4, z: 28.5, pause: 0.5 },
            { x: -77.4, z: 26.96, pause: 0.4 },
            { x: -78.58, z: 26.96, pause: 4.5, workPose: 'eat', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_2_island' },
            { x: -80.8, z: 26.96, pause: 0.4 },
            { x: -80.6, z: 32.0, pause: 3.4, workPose: 'play_kid', faceYaw: Math.PI },
            { x: -80.8, z: 28.5, pause: 0.5 },
            { x: -75.2, z: 28.5, pause: 0.5 },
            { x: -72.8, z: 29.8, pause: 2.2, workPose: 'play_kid', faceYaw: 0 },
          ],
          prompt: 'Talk to Kid Chloé-Marie',
          msg: 'I love running outside to play, then sitting with Mom at the breakfast bar for warm cocoa and scones!',
          duty: 'Playing on the front yard, eating family supper at the island, and making baby Hugo giggle.',
          gossip: 'Wallflour Bakery just upstairs has raspberry tarts in the window right now!',
          flirt: 'Your hair looks so pretty today! Are you going out to eat with friends?',
          clout: 1, isCitizen: true,
        },
        {
          id: 'hh3-mom-nadine', role: 'citizen', name: 'Nadine (Oakridge House)', roleLabel: '3-Bed Oakridge Mother',
          x: -107.4, z: 6.1, y: 0.12, patrolR: 1.0, dressHex: '#3f7662', trimHex: '#f4e6d2', hairStyle: 'regency-bun',
          walkSpeed: 1.18,
          waypoints: [
            { x: -107.4, z: 6.1, pause: 4.2, workPose: 'cook', faceYaw: Math.PI },
            { x: -107.4, z: 8.26, pause: 4.8, workPose: 'eat', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_3_island' },
            { x: -109.15, z: 8.26, pause: 0.4 },
            { x: -109.15, z: 13.38, pause: 3.4, workPose: 'read', faceYaw: Math.PI * 0.5 },
            { x: -107.2, z: 13.38, pause: 0.4 },
            { x: -107.2, z: 14.28, pause: 4.4, workPose: 'sofa', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_3_sofa' },
            { x: -107.2, z: 13.38, pause: 0.4 },
            { x: -109.15, z: 13.38, pause: 0.4 },
            { x: -109.15, z: 9.8, pause: 0.5 },
            { x: -113.0, z: 9.8, pause: 0.5 },
            { x: -116.4, z: 9.8, pause: 5.8, workPose: 'sleep', yOverride: 0.70, rigOffsetY: 0.09, faceYaw: Math.PI * 0.5, lockSpotId: 'mid_house_3_bed_2' },
            { x: -113.0, z: 9.8, pause: 0.5 },
            { x: -109.15, z: 9.8, pause: 0.5 },
            { x: -109.15, z: 6.1, pause: 0.4 },
          ],
          prompt: 'Visit Nadine (Oakridge House)',
          msg: 'Stop in anytime! I have soup simmering, Lucas Jr. and I share lunch at the breakfast bar, and I catch quiet reading time on the sofa.',
          duty: 'Cooking, sharing family meals at the island, reading novels, and sleeping in the bedroom.',
          gossip: 'Everyone down the street is trying the new rooftop sky bar over at Hôtel Montieri this week!',
          flirt: 'Our kitchen door is always open if you want a quiet homemade meal away from the crowds.',
          clout: 1, isCitizen: true,
        },
        {
          id: 'hh3-kid-lucasjr', role: 'citizen', ageGroup: 'child', name: 'Lucas Jr. (Oakridge Kid)', roleLabel: 'Oakridge House Kid',
          x: -100.8, z: 8.6, y: 0.0, patrolR: 1.2, dressHex: '#4f7a58', trimHex: '#fff4e4', hairStyle: 'wavy-curtain-shag',
          walkSpeed: 1.50,
          waypoints: [
            { x: -100.8, z: 8.6, pause: 4.2, workPose: 'play_kid', faceYaw: 0 },
            { x: -103.2, z: 9.8, pause: 0.5 },
            { x: -105.4, z: 9.8, pause: 0.5 },
            { x: -105.4, z: 8.26, pause: 0.4 },
            { x: -106.58, z: 8.26, pause: 4.4, workPose: 'eat', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: Math.PI, lockSpotId: 'mid_house_3_island' },
            { x: -108.8, z: 8.26, pause: 0.4 },
            { x: -108.6, z: 13.4, pause: 3.6, workPose: 'play_kid', faceYaw: Math.PI },
            { x: -108.8, z: 9.8, pause: 0.5 },
            { x: -103.2, z: 9.8, pause: 0.5 },
            { x: -100.8, z: 11.0, pause: 2.2, workPose: 'play_kid', faceYaw: 0 },
          ],
          prompt: 'Say Hi to Kid Lucas Jr.',
          msg: 'Zoom zoom! I play outside on the yard, rush inside when Mom makes sandwiches, and wave at the horses across the street!',
          duty: 'Playing hopscotch on the Oakridge yard, eating lunch with Mom, and waving at the stable horses.',
          gossip: 'Stablehand Olivier let me feed Aurelia a carrot this morning!',
          flirt: 'Want to race my bike against your sports car someday?!',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'hhm-mom-margaux', role: 'citizen', name: 'Margaux (Mansionette #1)', roleLabel: 'Stone Mansionette Parent',
          x: -76.1, z: -17.6, y: 0.12, patrolR: 1.0, dressHex: '#8d5368', trimHex: '#f1d08a', hairStyle: 'marie-updo',
          walkSpeed: 1.18,
          waypoints: [
            { x: -76.1, z: -17.6, pause: 5.2, workPose: 'toddler_watch', faceYaw: Math.PI },
            { x: -79.4, z: -17.6, pause: 0.4 },
            { x: -79.4, z: -23.9, pause: 4.2, workPose: 'cook', faceYaw: Math.PI },
            { x: -79.4, z: -23.3, pause: 0.4 },
            { x: -83.6, z: -23.4, pause: 5.8, workPose: 'sleep', yOverride: 0.70, rigOffsetY: 0.09, faceYaw: Math.PI * 0.5, lockSpotId: 'mansionette_1_bed_1' },
            { x: -79.4, z: -23.3, pause: 0.4 },
            { x: -79.4, z: -17.6, pause: 0.4 },
            { x: -74.7, z: -17.6, pause: 0.4 },
            { x: -74.68, z: -19.4, pause: 4.0, workPose: 'sofa', yOverride: 0.20, rigOffsetY: -0.45, faceYaw: -Math.PI * 0.5, lockSpotId: 'mansionette_1_sofa' },
            { x: -74.7, z: -17.6, pause: 0.4 },
          ],
          prompt: 'Visit Margaux (Mansionette #1)',
          msg: 'Come right in! I am keeping an eye on baby Juliette while supper simmers, then grabbing a quiet nap in the back bedroom.',
          duty: 'Watching toddler Juliette, cooking supper, lounging on the sofa, and resting in Bedroom #1.',
          gossip: 'Our front yard looks right out toward Greenfields Farm windmills!',
          flirt: 'Always lovely having good company over — stay and rest your feet for a minute!',
          clout: 1, isCitizen: true,
        },
        {
          id: 'hhm-toddler-juliette', role: 'citizen', ageGroup: 'toddler', name: 'Baby Juliette (Mansionette)', roleLabel: 'Stone Mansionette Toddler',
          x: -76.6, z: -17.6, y: 0.12, patrolR: 0.45, dressHex: '#e3b282', trimHex: '#fffaf5', hairStyle: 'riviera-bob',
          walkSpeed: 0.70,
          waypoints: [
            { x: -76.6, z: -17.6, pause: 4.6, workPose: 'toddler_play', faceYaw: -Math.PI * 0.5 },
            { x: -75.6, z: -17.6, pause: 4.0, workPose: 'toddler_play', faceYaw: Math.PI },
            { x: -76.1, z: -18.0, pause: 4.2, workPose: 'toddler_play', faceYaw: 0 },
          ],
          prompt: 'Greet Baby Juliette (Mansionette #1)',
          msg: 'Bouncing gleefully on the wool parlor rug while Mom watches proudly!',
          duty: 'Clapping and playing in the Mansionette living room while Margaux watches.',
          gossip: 'Margaux knitted that tiny cream cardigan herself!',
          flirt: 'Peek-a-boo! Happy claps!',
          clout: 1, isCitizen: true,
        },
        {
          id: 'hhf-kid-tom', role: 'citizen', ageGroup: 'child', name: 'Farm Kid Tom (Greenfields)', roleLabel: 'Greenfields Farm Kid',
          x: -139.8, z: -34.2, y: 0.12, patrolR: 1.2, dressHex: '#6c8544', trimHex: '#f4e6d2', hairStyle: 'wavy-curtain-shag',
          walkSpeed: 1.50,
          waypoints: [
            { x: -139.8, z: -34.2, pause: 3.8, workPose: 'play_kid', faceYaw: -Math.PI * 0.5 },
            { x: -141.5, z: -34.2, pause: 0.4 },
            { x: -141.5, z: -28.0, pause: 0.6 },
            { x: -134.5, z: -28.0, pause: 4.2, workPose: 'play_kid', faceYaw: Math.PI * 0.5 },
            { x: -141.5, z: -28.0, pause: 0.6 },
            { x: -141.5, z: -34.2, pause: 0.4 },
          ],
          prompt: 'Chat with Farm Kid Tom (Greenfields)',
          msg: 'Hey Your Highness!! Look at me playing beside the farmhouse and cheering on the grazing cows!',
          duty: 'Helping Farmer Gérard watch the pasture and playing outside Greenfields Farmhouse.',
          gossip: 'Chef Auguste said our farm strawberries made yesterday’s royal macarons extra sweet!',
          flirt: 'You are the coolest Princess in the whole kingdom!',
          clout: 1, male: true, isCitizen: true,
        },
        {
          id: 'captain-henri', role: 'chauffeur', name: 'Captain Henri (Royal Yacht)', roleLabel: 'Royal Riviera Yachtmaster',
          x: -10.5, z: 58.2, y: 0.26, patrolR: 0, stationaryPose: 'idle', stationaryYaw: 0,
          dressHex: '#193558', trimHex: '#d4af55', hairStyle: 'classic-chignon',
          outfitId: 'equestrian-tailored',
          prompt: 'Speak to Captain Henri (Marina)',
          msg: 'The Riviera waters are clear, blue, and calm, Your Highness. Say the word and I shall sail the Royal Superyacht to Île d’Or or Lighthouse Isle!',
          duty: 'Commanding the Riviera Royal Superyacht, docking smoothly, and guiding royal bay excursions.',
          gossip: 'Dolphins and schools of sapphire fish have been circling Cove d’Azur all morning!',
          flirt: 'Every sunset cruise feels brighter with Your Highness on the bow sunbed.',
          clout: 3, male: true,
        },
        {
          id: 'hostess-coralie', role: 'citizen', name: 'Coralie (Paloma Beach Club)', roleLabel: 'Waterfront Bistro Hostess',
          x: -35.5, z: 54.4, y: 0.21, patrolR: 1.6, dressHex: '#1888a8', trimHex: '#fff5e4', hairStyle: 'riviera-bob',
          walkSpeed: 1.15,
          waypoints: [
            { x: -35.5, z: 54.4, pause: 4.0, faceYaw: 0 },
            { x: -32.2, z: 54.4, pause: 3.5, faceYaw: 0.3 },
          ],
          prompt: 'Visit Coralie at Paloma Beach Club',
          msg: 'Bienvenue to Paloma Beach Club! Sparkling turquoise shallows, chilled rosé, and waterfront cabanas await.',
          duty: 'Hosting Royal Beach Events, waterfront dining, and sunset music nights.',
          gossip: 'Half the court booked sunset tables for tonight’s golden ocean view!',
          flirt: 'Your cabana is always reserved right by the water’s edge, Your Highness!',
          clout: 2, isCitizen: true,
        },
        {
          id: 'diver-marco', role: 'citizen', name: 'Guide Marco (Cove d’Azur)', roleLabel: 'Reef & Snorkel Guide',
          x: 122.0, z: 63.0, y: 0.27, patrolR: 0, stationaryPose: 'idle', stationaryYaw: 0,
          dressHex: '#1b6ca8', trimHex: '#48dbfb', hairStyle: 'wavy-curtain-shag',
          outfitId: 'equestrian-tailored',
          prompt: 'Chat with Reef Guide Marco',
          msg: 'Crystal visibility down to the coral garden today! Step off the pier to snorkel or dive alongside the reef fish.',
          duty: 'Guiding snorkelers, deep-water divers, and coastal explorers at Cove d’Azur.',
          gossip: 'Rumour says Île d’Or’s lagoon glows brightest right before sunset.',
          flirt: 'Race me around the regatta buoys anytime, Your Highness!',
          clout: 2, male: true, isCitizen: true,
        },
      ].forEach(function (npc, idx) {
        const isMaleNpc = Boolean(npc.male);
        const ageGrp = npc.ageGroup || 'adult';
        const mesh = P.buildRoyalCharacterMesh(
          {
            body: { sliders: { height: isMaleNpc ? 1.03 : 0.98 } },
            look: { hairStyle: npc.hairStyle },
            wardrobe: { outfitId: npc.outfitId || (isMaleNpc ? 'equestrian-tailored' : 'ballgown-silk'), themeId: 'signature' },
          },
          { name: npc.id, role: npc.role || 'staff', ageGroup: ageGrp, dressHex: npc.dressHex, trimHex: npc.trimHex, showPlumbob: false }
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
          ageGroup: ageGrp,
          actorCategory: actCat,
          name: npc.name,
          roleLabel: npc.roleLabel || 'Riviera Resident',
          homeX: npc.x,
          homeY: npc.y,
          origHomeY: npc.y,
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
          hotelFloor: typeof npc.hotelFloor === 'number' ? npc.hotelFloor : null,
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

      const underwaterTintEl = document.createElement('div');
      underwaterTintEl.className = 'world-underwater-tint';
      shell.appendChild(underwaterTintEl);

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
      const convCatTabs = document.createElement('div');
      convCatTabs.className = 's4-cat-tabs';
      const convChoices = document.createElement('div');
      convChoices.className = 'world-converse-choices';
      convCard.appendChild(convHead);
      convCard.appendChild(convRole);
      convCard.appendChild(convBubble);
      convCard.appendChild(convCatTabs);
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

      function appendConversationTurn(who, speaker, text) {
        if (!activeConversation) return;
        activeConversation.history.push({ who: who, speaker: speaker, text: text });
        if (activeConversation.history.length > 24) {
          activeConversation.history.shift();
        }
        convBubble.innerHTML = '';
        for (let i = 0; i < activeConversation.history.length; i++) {
          const item = activeConversation.history[i];
          const row = document.createElement('div');
          row.className = 'world-converse-turn ' + (item.who === 'you' ? 'you' : 'npc');
          const lbl = document.createElement('strong');
          lbl.textContent = item.speaker;
          const body = document.createElement('span');
          body.textContent = item.text;
          row.appendChild(lbl);
          row.appendChild(body);
          convBubble.appendChild(row);
        }
        convBubble.scrollTop = convBubble.scrollHeight;
      }

      function getEverydayTopicBank(act) {
        if (act.ageGroup === 'toddler') {
          return [
            {
              label: 'Play Peek-a-Boo',
              you: 'Peek-a-boo! Look how big you are getting today!',
              reply: '*giggles loudly and claps both tiny hands together!* "Boo!! Up, up!"',
              rel: 7,
              fun: 14,
            },
            {
              label: 'Ask About Favorite Toy',
              you: 'What is your favorite toy on the rug right now?',
              reply: '*points excitedly at a fluffy plush bear* "Bear! Soft! Mama gave bear!"',
              rel: 6,
              fun: 12,
            },
            {
              label: 'Offer Strawberry Snack',
              you: 'Want a sweet little strawberry bite?',
              reply: '*grins ear to ear and bounces on both knees* "Mmm! Berries! Yummy!"',
              rel: 8,
              fun: 12,
            },
          ];
        }
        if (act.ageGroup === 'child') {
          return [
            {
              label: 'Ask About School & Games',
              you: 'What games are you playing with your friends today?',
              reply: 'We had a relay race around the picket fence, then Mom called us inside for warm buttered toast! Wanna race next?',
              rel: 6,
              fun: 12,
            },
            {
              label: 'Talk About Favorite Snacks',
              you: 'If you could pick any treat from Wallflour Bakery, what would you get?',
              reply: 'Definitely the strawberry glazed tart — or two chocolate brioche buns if nobody is looking! What about you?',
              rel: 6,
              fun: 12,
            },
            {
              label: 'Tell a Funny Story',
              you: 'Wait until I tell you what happened down by the stables earlier!',
              reply: '*laughs out loud* No way! The horses always try to steal carrots straight out of people’s bags!',
              rel: 8,
              fun: 15,
            },
          ];
        }
        if (act.role === 'chauffeur') {
          return [
            {
              label: 'Catch Up On Town Drive',
              you: 'How has traffic been along Riviera Boulevard today, Lucien?',
              reply: 'Smooth sailing! A couple of neighbors were out carpooling past the bakery, and the new cobblestone turn-in at Hôtel Montieri drives like butter.',
              rel: 6,
              fun: 10,
            },
            {
              label: 'Ask About His Favorite Route',
              you: 'Which drive is your favorite when the sun starts setting?',
              reply: 'Definitely the coastal curve past Villa Azure up to the Montieri archway — when the golden lamps kick on, nothing beats that view. Want a ride?',
              rel: 7,
              fun: 12,
            },
            {
              label: 'Talk Music & Road Trips',
              you: 'What do you listen to while waiting between pickups?',
              reply: 'Smooth jazz and a little acoustic French pop — keeps things relaxed! Hop in anytime and pick your own playlist.',
              rel: 6,
              fun: 12,
            },
          ];
        }
        if (act.isMedicalStaff) {
          return [
            {
              label: 'Ask How Their Shift Is Going',
              you: 'Busy shift in the wing today? Have you had time for a coffee break?',
              reply: 'Steady morning! A few neighborhood check-ups, an ambulance drill in ER Bay 01, and now I am finally grabbing tea. How are you feeling today?',
              rel: 6,
              fun: 10,
            },
            {
              label: 'Swap Wellness Tips',
              you: 'Any easy tips for keeping energy up during a packed week?',
              reply: 'Fresh air in the Healing Garden, real sit-down meals instead of rushing, and plenty of water — honestly a soak at the Montieri Spa helps too!',
              rel: 6,
              composure: 10,
            },
            {
              label: 'Talk Weekend Plans',
              you: 'Doing anything relaxing once your shift wraps up?',
              reply: 'A quiet dinner at Le Montieri or grabbing wood-fired pizza with friends — nothing beats clocking out with good company.',
              rel: 7,
              fun: 12,
            },
          ];
        }
        if (act.role === 'chef') {
          return [
            {
              label: 'Ask What Is Cooking Now',
              you: 'Smells incredible over here — what are you working on today?',
              reply: 'Brown-butter croissants and slow-simmered herb sauce! I always save a warm plate on the warmer for friends dropping by.',
              rel: 6,
              fun: 12,
            },
            {
              label: 'Share Recipe Ideas',
              you: 'Have you tried pairing wildflower honey with warm fig tart?',
              reply: '*eyes light up* Now THAT is a great idea — I am testing a batch with Farm strawberries right after lunch!',
              rel: 7,
              fun: 12,
            },
            {
              label: 'Ask About Evening Rush',
              you: 'Does the dinner rush get chaotic later tonight?',
              reply: 'Wait until 7 PM when everyone walks in starving! Having good music on in the kitchen makes all the difference.',
              rel: 5,
              fun: 10,
            },
          ];
        }
        if (act.isCitizen) {
          return [
            {
              label: 'Chat About Family & Home',
              you: 'How is everybody at home today? Keeping busy around the neighborhood?',
              reply: 'Honestly it is nonstop — cooking meals, checking on the kids, catching a quick nap when things settle down! How has your day been?',
              rel: 6,
              fun: 10,
            },
            {
              label: 'Talk About Town Spots',
              you: 'Have you checked out the new 3-storey Hôtel Montieri or the Bakery loft lately?',
              reply: 'Yes!! The conservatory pastries and the Montieri lobby fountain are gorgeous — we are planning a neighborhood dinner night soon!',
              rel: 6,
              fun: 12,
            },
            {
              label: 'Invite For Dinner / Coffee',
              you: 'We should definitely grab lunch at the breakfast bar or go for a carpool ride sometime!',
              reply: 'Count me in! Just say when — I am always up for good food and a ride down the boulevard.',
              rel: 8,
              fun: 14,
            },
          ];
        }
        return [
          {
            label: 'Catch Up On Daily Life',
            you: 'How has your day been treating you so far?',
            reply: 'Pretty good actually! Been chatting with guests, grabbing espresso between tasks, and watching the boulevard buzz outside. How about you?',
            rel: 6,
            fun: 10,
          },
          {
            label: 'Ask What Is Trending Today',
            you: 'Heard anything fun happening around town tonight?',
            reply: 'People are heading up to the Montieri 3F Sky Bar for sunset drinks, then swinging by Club Couronne or Palazzo Napoli later!',
            rel: 6,
            fun: 12,
          },
          {
            label: 'Ask About Favorite Hobbies',
            you: 'When you finally get a free evening off, what do you like doing most?',
            reply: 'Honestly? Long evening drives with the windows down, browsing Galerie Royale, or unwinding with friends over dinner.',
            rel: 7,
            fun: 12,
          },
        ];
      }

      function renderConversationChoices() {
        if (!activeConversation) return;
        const act = activeConversation.actor;
        const turn = activeConversation.turn || 0;
        const topics = getEverydayTopicBank(act);
        const curTopic = topics[turn % topics.length];
        const nextTopic = topics[(turn + 1) % topics.length];
        const curFilter = activeConversation.catFilter || 'all';
        convCatTabs.innerHTML = '';
        convChoices.innerHTML = '';

        const catDefs = [
          { id: 'all', label: 'All' },
          { id: 'friendly', label: 'Friendly' },
          { id: 'funny', label: 'Funny' },
        ];
        if (act.ageGroup !== 'child' && act.ageGroup !== 'toddler') {
          catDefs.push({ id: 'romance', label: 'Romance' });
        }
        catDefs.push({ id: 'activity', label: 'Activities & Service' });
        catDefs.forEach(function (cd) {
          const chip = document.createElement('button');
          chip.type = 'button';
          chip.className = 's4-cat-chip' + (curFilter === cd.id ? ' active' : '');
          chip.textContent = cd.label;
          chip.addEventListener('click', function () {
            activeConversation.catFilter = cd.id;
            renderConversationChoices();
          });
          convCatTabs.appendChild(chip);
        });

        function makeBtn(label, cat, onClick, isBye) {
          if (curFilter !== 'all' && !isBye && cat !== curFilter) return;
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'world-converse-btn' + (isBye ? ' bye' : (cat ? ' s4-cat-' + cat : ''));
          b.textContent = label;
          b.addEventListener('click', function () {
            if (window.CrownAudio) window.CrownAudio.playSelect();
            onClick();
          });
          convChoices.appendChild(b);
        }

        // Sims 4 Friendly category choices (continuous topic loop)
        makeBtn(curTopic.label, 'friendly', function () {
          if (window.CrownNeeds) {
            window.CrownNeeds.applyBoost({ fun: curTopic.fun || 10, composure: curTopic.composure || 6 });
          }
          addRelScore(act, curTopic.rel || 6);
          activeConversation.turn += 1;
          appendConversationTurn('you', 'You', curTopic.you);
          appendConversationTurn('npc', act.name || 'Friend', curTopic.reply);
          renderConversationChoices();
        });

        makeBtn(nextTopic.label, 'friendly', function () {
          if (window.CrownNeeds) {
            window.CrownNeeds.applyBoost({ fun: nextTopic.fun || 10, composure: nextTopic.composure || 6 });
          }
          addRelScore(act, nextTopic.rel || 6);
          activeConversation.turn += 1;
          appendConversationTurn('you', 'You', nextTopic.you);
          appendConversationTurn('npc', act.name || 'Friend', nextTopic.reply);
          renderConversationChoices();
        });

        makeBtn(turn % 2 === 0 ? 'Deepen Friendship · Ask Routine' : 'Share Town Gossip', 'friendly', function () {
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 12, composure: 6 });
          addRelScore(act, 5);
          const askDuty = turn % 2 === 0;
          activeConversation.turn += 1;
          appendConversationTurn(
            'you',
            'You',
            askDuty ? 'What keeps you busiest during the day?' : 'Heard any interesting stories around town lately?'
          );
          appendConversationTurn(
            'npc',
            act.name || 'Friend',
            askDuty
              ? (act.dutyLine || 'Keeping everything organized and taking care of everyone who stops by!')
              : (act.gossipLine || 'Things have been lively from Willow Creek all the way to Hôtel Montieri!')
          );
          renderConversationChoices();
        });

        // Sims 4 Funny interaction
        makeBtn('Tell Joke / Playful Tease', 'funny', function () {
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 18, composure: 4 });
          addRelScore(act, 7);
          activeConversation.turn += 1;
          const jokes = [
            'Wait — did you see someone try to parallel park a gilded carriage near the fountain earlier?',
            'I tried baking macaron shells at 2 AM and invented pastry frisbees instead!',
            'If our mayor adds one more golden swan statue, the ducks are going to start charging rent!',
          ];
          const replies = [
            '*laughs out loud* Stop it, I nearly spilled my espresso just picturing that!',
            'Hahaha okay that actually made my entire afternoon — you are hilarious!',
            '*giggles uncontrollably* Honestly we needed a good laugh today!',
          ];
          appendConversationTurn('you', 'You', jokes[turn % jokes.length]);
          appendConversationTurn('npc', act.name || 'Friend', replies[turn % replies.length]);
          renderConversationChoices();
        });

        // Sims 4 Romance (adults only — skip for kids/toddlers!)
        if (act.ageGroup !== 'child' && act.ageGroup !== 'toddler') {
          makeBtn('Flirt & Give Romantic Compliment', 'romance', function () {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 16, composure: 6 });
            if (g.reputation) g.reputation.scandal = Math.min(100, (g.reputation.scandal || 0) + 1);
            addRelScore(act, 8);
            activeConversation.turn += 1;
            const flirts = [
              'You always know how to make my whole day — seriously, how do you look this good effortlessly?',
              'Should we sneak off for a coffee or sunset boat ride when you get a break?',
              'I always look forward to running into you more than anyone else in town.',
            ];
            appendConversationTurn('you', 'You', flirts[turn % flirts.length]);
            appendConversationTurn(
              'npc',
              act.name || 'Friend',
              act.flirtLine || '*smiles warmly* Wait until you hear how often I look for you around town too.'
            );
            renderConversationChoices();
          });
        }

        if (act.isMedicalStaff) {
          makeBtn('Run Medical Check-Up (Free)', 'activity', function () {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 65, hygiene: 50, composure: 18 });
            addRelScore(act, 10);
            if (townServices && typeof townServices.recordCitizenCheckup === 'function') {
              townServices.recordCitizenCheckup((g.princess && g.princess.firstName) || 'Crown Heiress', 'Cleared by ' + act.name);
            }
            activeConversation.turn += 1;
            appendConversationTurn('you', 'You', 'Could you give me a quick check-up while I am here?');
            appendConversationTurn('npc', act.name, 'Of course! Your pulse and vitals are strong and healthy (+65 Energy, +50 Hygiene).');
            renderConversationChoices();
          });
        } else if (act.isCitizen && act.ageGroup !== 'toddler') {
          makeBtn('Sponsor Check-Up (+₡25)', 'activity', function () {
            g.money = (g.money || 0) + 25;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 12, fun: 8 });
            addRelScore(act, 10);
            if (townServices && typeof townServices.recordCitizenCheckup === 'function') {
              townServices.recordCitizenCheckup(act.name, 'Hospital Check-Up Logged · Healthy');
            }
            convRole.textContent = (act.roleLabel || 'Riviera Resident') + ' · Check-Up: Cleared';
            activeConversation.turn += 1;
            appendConversationTurn('you', 'You', 'Feel free to put your annual Hôpital Royal check-up on my tab today!');
            appendConversationTurn('npc', act.name, 'Thank you so much! That really helps our household out (+₡25 Grant, +10 Affinity).');
            renderConversationChoices();
          });
        }

        if (act.role === 'butler' || act.role === 'maid' || act.role === 'staff') {
          makeBtn('Serve Meal in Bed', 'meal', function () {
            closeNpcConversation();
            royalCommands.serveMealInBed(null, null, act);
          });
        } else if (act.role === 'chef') {
          makeBtn('Cook Meal For Me', 'meal', function () {
            closeNpcConversation();
            royalCommands.cookForMe(act);
          });
        } else if (act.role === 'chauffeur') {
          makeBtn('Drive Me Anywhere...', 'activity', function () {
            closeNpcConversation();
            openChauffeurRideSheet();
          });
          makeBtn('Carpool / Ride With Friends', 'activity', function () {
            closeNpcConversation();
            openCarPassengersSheet();
          });
        }

        if (act.id === 'captain-henri') {
          makeBtn('Sail Yacht w/ Captain Henri', 'activity', function () {
            closeNpcConversation();
            openBoatCaptainSheet('riviera_royal_yacht');
          });
        } else if (act.ageGroup !== 'toddler') {
          makeBtn('Invite Yachting (Royal Superyacht)', 'activity', function () {
            closeNpcConversation();
            inviteActorToBoat(act, 'riviera_royal_yacht');
          });
          makeBtn('Invite Boating (Cedar Rowboat)', 'activity', function () {
            closeNpcConversation();
            inviteActorToBoat(act, 'riviera_rowboat_west');
          });
          makeBtn(act.summon && act.summon.follow ? 'Stop Walking With Me' : 'Form Group / Hang Out', 'activity', function () {
            if (act.summon && act.summon.follow) {
              act.summon = null;
              activeConversation.turn += 1;
              appendConversationTurn('you', 'You', 'Catch you later! I will see you around the block.');
              appendConversationTurn('npc', act.name, 'Sounds good! Catch me anytime if you want company.');
              renderConversationChoices();
            } else {
              closeNpcConversation();
              royalCommands.summonActorToPlayer(act, { follow: true });
              g.toast(act.name + ' is walking along with you!');
            }
          });
        }

        makeBtn('Give Gift (₡25)', 'friendly', function () {
          activeConversation.turn += 1;
          if ((g.money || 0) < 25) {
            appendConversationTurn('npc', 'Pocket Check', 'You need ₡25 Crowns to give a gift right now.');
            renderConversationChoices();
            return;
          }
          g.money -= 25;
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 14, fun: 10 });
          addRelScore(act, 14);
          appendConversationTurn('you', 'You', 'Picked up a little ₡25 treat for you today!');
          appendConversationTurn('npc', act.name || 'Friend', 'Wait, for me?! That is so thoughtful of you — thank you! (+14 Affinity)');
          renderConversationChoices();
        });

        makeBtn('Say Goodbye', 'friendly', function () {
          closeNpcConversation();
        }, true);
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
        activeConversation = { actor: act, turn: 0, history: [], catFilter: 'all' };
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

        convTitle.innerHTML = '<span class="s4-plumbob"></span>' + (act.name || act.prompt || 'Friend');
        const healthEntry = g.citizenHealthLog && g.citizenHealthLog[act.name];
        convRole.textContent = (act.roleLabel || 'Riviera Resident') + (healthEntry ? ' · Check-Up: ' + healthEntry.status : '');
        addRelScore(act, 2);
        appendConversationTurn('npc', act.name || 'Friend', act.greetLine || 'Hey! Good to run into you — how is your day going?');
        const repNow = g.reputation || { clout: 50, scandal: 0 };
        const secMode = (g.world && g.world.securityMode) || 'royal';
        if (act.role === 'guard') {
          const secLine = secMode === 'lockdown'
            ? 'Security Alert: Gates are on HIGH GUARD LOCKDOWN — unauthorized guests are turned away.'
            : secMode === 'public'
              ? 'Public Tour Active: Kingdom gates are open for peaceful citizens & visitors today.'
              : 'Royal Protocol: Palace checkpoints are filtering for Court guests & invited nobles.';
          appendConversationTurn('npc', act.name || 'Guard', secLine);
        } else if ((repNow.scandal || 0) >= 35) {
          appendConversationTurn('npc', act.name || 'Friend', 'Psst — did you see Crown Dispatch?! Everyone across the kingdom is buzzing about that ' + Math.round(repNow.scandal) + '% scandal!');
        } else if ((repNow.clout || 50) >= 75) {
          appendConversationTurn('npc', act.name || 'Friend', 'Your prestige precedes you today — society is endlessly impressed (' + Math.round(repNow.clout) + '% Clout)!');
        }
        renderConversationChoices();

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
        const candOffsets = [0, 0.6, -0.6, 1.2, -1.2, 2.0, -2.0, 2.8];
        let tx = pxNow + Math.sin(sideAngle) * offDist;
        let tz = pzNow + Math.cos(sideAngle) * offDist;
        if (typeof castle.resolveCollision === 'function') {
          let foundSpot = false;
          for (let ci = 0; ci < candOffsets.length; ci++) {
            const ang = sideAngle + candOffsets[ci];
            const cx = pxNow + Math.sin(ang) * offDist;
            const cz = pzNow + Math.cos(ang) * offDist;
            const r = castle.resolveCollision(cx, cz, 0.28, pyNow);
            if (Math.hypot(r.x - cx, r.z - cz) <= 0.35) {
              tx = r.x;
              tz = r.z;
              foundSpot = true;
              break;
            }
          }
          if (!foundSpot) {
            const r = castle.resolveCollision(tx, tz, 0.28, pyNow);
            tx = r.x;
            tz = r.z;
          }
        }
        const nPos = act.mesh.root.position;
        const curDist = Math.hypot(nPos.x - tx, nPos.z - tz);
        const diffFloor = Math.abs(nPos.y - pyNow) > 1.4;
        if (diffFloor || curDist > 16) {
          // Bring via nearby open approach vector so they smoothly walk up without spawning inside walls
          const spawnDists = [5.8, 3.2, 1.8];
          const spawnAngles = [0.35, -0.35, 1.0, -1.0, 1.7, -1.7, 2.4, -2.4, 0];
          let spawnX = tx;
          let spawnZ = tz;
          let pickedSpawn = false;
          for (let di = 0; di < spawnDists.length && !pickedSpawn; di++) {
            for (let ai = 0; ai < spawnAngles.length; ai++) {
              const ang = sideAngle + spawnAngles[ai];
              const cx = pxNow + Math.sin(ang) * spawnDists[di];
              const cz = pzNow + Math.cos(ang) * spawnDists[di];
              if (typeof castle.resolveCollision === 'function') {
                const sr = castle.resolveCollision(cx, cz, 0.28, pyNow);
                if (Math.hypot(sr.x - cx, sr.z - cz) <= 0.35 &&
                    (!castle.hasBlockedSegment || !castle.hasBlockedSegment(sr.x, sr.z, tx, tz, 0.22, pyNow))) {
                  spawnX = sr.x;
                  spawnZ = sr.z;
                  pickedSpawn = true;
                  break;
                }
              } else {
                spawnX = cx;
                spawnZ = cz;
                pickedSpawn = true;
                break;
              }
            }
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
          waypoints: Array.isArray(cfg.waypoints) ? cfg.waypoints.slice() : null,
          wpIdx: 0,
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
        // Deliver cleanly on nearest paved street/apron (never grass) outside or at Château Portico if indoors
        const outdoors = pPos.y < 0.8 && !castle.isInsidePalace(pPos);
        let cx = outdoors ? pPos.x + 3.6 : 0;
        let cz = outdoors ? pPos.z + 2.2 : 5.5;
        if (typeof castle.snapToDrivableSurface === 'function') {
          const snapped = castle.snapToDrivableSurface(cx, cz);
          cx = snapped.x;
          cz = snapped.z;
        }
        if (typeof castle.resolveCollision === 'function') {
          const r = castle.resolveCollision(cx, cz, 1.5, 0, { ignoreEntityId: car.id, carMode: true });
          cx = r.x;
          cz = r.z;
        }
        if (typeof castle.isDrivableSurface === 'function' && !castle.isDrivableSurface(cx, cz, 0.3) && typeof castle.snapToDrivableSurface === 'function') {
          const snapped2 = castle.snapToDrivableSurface(cx, cz);
          cx = snapped2.x;
          cz = snapped2.z;
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
          let lx = cx - 1.55;
          let lz = cz + 0.65;
          if (typeof castle.resolveCollision === 'function') {
            const lr = castle.resolveCollision(lx, lz, 0.28, 0);
            lx = lr.x;
            lz = lr.z;
          }
          summonActorToPlayer(chauffeur, {
            pose: 'converse',
            distance: 2.2,
            duration: 18,
            announce: false,
          });
          if (chauffeur.summon) {
            chauffeur.summon.targetX = lx;
            chauffeur.summon.targetZ = lz;
            chauffeur.summon.targetY = 0;
          }
        }
        g.toast((car.title || 'Royal Car') + ' delivered onto paved road with doors held open!');
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

      // ---- LIVE DOCTOR+NURSE CHECKUP ON PRINCESS ----
      let activeCheckupTimer = 0;
      let activeCheckupLock = false;
      function startMedicalCheckup(mode, actCtx) {
        if (activeCheckupLock) {
          g.toast('A Doctor & Nurse are already finishing your examination!');
          return;
        }
        const cost = mode === 'er' ? 30 : mode === 'or' ? 40 : mode === 'vaccine' ? 15 : 0;
        if (cost > 0 && (g.money || 0) < cost) {
          g.toast('Need ₡' + cost + ' Crowns.');
          return;
        }
        if (playerCtrl.getTransport()) playerCtrl.exitTransport();
        activeCheckupLock = true;
        let doc = getActorById('doctor-moreau');
        let nurse = getActorById('nurse-amelie');
        let patientSpec = {
          id: 'checkup_desk_patient',
          label: 'Hospital Check-Up',
          pose: 'converse',
          anchor: { x: 80.5, y: 0.12, z: -25.0, yaw: Math.PI * 0.5, floorY: 0.12, exitX: 80.2, exitZ: -24.2, exitYaw: 0 },
          statusText: 'Dr. Moreau & Nurse Amélie are checking your vitals...',
        };
        let docPos = { x: 81.1, y: 0.12, z: -24.1, yaw: -0.3 };
        let nursePos = { x: 81.1, y: 0.12, z: -25.9, yaw: -Math.PI + 0.3 };

        if (mode === 'or') {
          doc = getActorById('surgeon-valmont') || doc;
          nurse = getActorById('nurse-sophie') || nurse;
          patientSpec = {
            id: 'hospital_exam_patient',
            label: 'OR Telemetry Scan',
            pose: 'sleep',
            anchor: { x: 74.3, y: 1.02, z: -26.18, yaw: 0, rigOffsetY: 0.09, floorY: 0.12, exitX: 73.1, exitZ: -25.6, exitYaw: 0 },
            statusText: 'Surgeon Valmont & Nurse Sophie performing telemetry scan...',
          };
          docPos = { x: 72.9, y: 0.12, z: -26.9, yaw: Math.PI * 0.5 };
          nursePos = { x: 75.7, y: 0.12, z: -26.9, yaw: -Math.PI * 0.5 };
        } else if (mode === 'er') {
          doc = getActorById('er-doctor-vance') || doc;
          nurse = getActorById('nurse-clara') || nurse;
          patientSpec = {
            id: 'hospital_bed_4_er_checkup',
            label: 'ER Doctor Check-Up',
            pose: 'sleep',
            anchor: { x: 72.0, y: 0.70, z: -18.12, yaw: 0, rigOffsetY: 0.09, floorY: 0.12, exitX: 73.1, exitZ: -18.6, exitYaw: 0 },
            statusText: 'ER Dr. Vance & Nurse Clara checking trauma vitals in ER Bay 01...',
          };
          const erPatPrev = getActorById('patient-emergency');
          if (erPatPrev && erPatPrev.summon) erPatPrev.summon = null;
          docPos = { x: 73.15, y: 0.12, z: -18.55, yaw: -Math.PI * 0.75 };
          nursePos = { x: 70.95, y: 0.12, z: -18.55, yaw: Math.PI * 0.75 };
        } else if (mode === 'vaccine') {
          doc = getActorById('doctor-moreau') || doc;
          nurse = getActorById('nurse-amelie') || nurse;
          patientSpec = {
            id: 'clinic_vaccine_checkup',
            label: 'Clinic Screening',
            pose: 'converse',
            anchor: { x: 77.0, y: 0.12, z: -25.6, yaw: Math.PI, floorY: 0.12, exitX: 77.0, exitZ: -24.6, exitYaw: 0 },
            statusText: 'Nurse Amélie & Dr. Moreau administering immunity screening...',
          };
          docPos = { x: 77.8, y: 0.12, z: -26.1, yaw: -Math.PI * 0.35 };
          nursePos = { x: 76.2, y: 0.12, z: -26.1, yaw: Math.PI * 0.35 };
        }

        if (interactMgr) {
          interactMgr.runAction(patientSpec);
        }
        if (doc) {
          summonActorToPlayer(doc, { pose: mode === 'or' ? 'work_operate' : 'work_examine', holdProp: 'instrument', duration: 9, announce: false });
          if (doc.summon) {
            doc.summon.targetX = docPos.x;
            doc.summon.targetY = docPos.y;
            doc.summon.targetZ = docPos.z;
          }
        }
        if (nurse) {
          summonActorToPlayer(nurse, { pose: 'work_station', holdProp: 'chart', duration: 9, announce: false });
          if (nurse.summon) {
            nurse.summon.targetX = nursePos.x;
            nurse.summon.targetY = nursePos.y;
            nurse.summon.targetZ = nursePos.z;
          }
        }
        g.toast((doc ? doc.name : 'Doctor') + ' & ' + (nurse ? nurse.name : 'Nurse') + ' are examining your vitals...');
        clearTimeout(activeCheckupTimer);
        activeCheckupTimer = window.setTimeout(function () {
          activeCheckupLock = false;
          if (!active) return;
          if (cost > 0) g.money = Math.max(0, (g.money || 0) - cost);
          const logCheckup = function (note) {
            if (townServices && typeof townServices.recordCitizenCheckup === 'function') {
              townServices.recordCitizenCheckup((g.princess && g.princess.firstName) || 'Crown Heiress', note);
            }
          };
          if (mode === 'or') {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 100, hygiene: 100, composure: 25, hunger: 25 });
            logCheckup('OR Telemetry Scan · 62 BPM · SpO2 99%');
            g.toast('Check-up & Telemetry Scan complete! 62 BPM · SpO2 99% (+100 Energy & Bath)');
          } else if (mode === 'er') {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 85, hygiene: 50, composure: 20 });
            logCheckup('ER Doctor & Nurse Stabilization Complete');
            g.toast('ER Doctor & Nurse stabilized your vitals! (+85 Energy, +50 Bath)');
          } else if (mode === 'vaccine') {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 60, hygiene: 40, composure: 12 });
            logCheckup('Annual Immunity Booster · Cleared');
            g.toast('Immunity Booster & Screening complete! (+60 Energy, +40 Hygiene)');
          } else {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 35, hygiene: 25, composure: 15, hunger: 10 });
            logCheckup('BP 112/72 · Pulse 68 bpm · Full Clearance');
            if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 3);
            g.toast('Medical Check-Up complete! Vitals 112/72 · +35 Energy, +25 Hygiene, +3 Clout.');
          }
          if (interactMgr && patientSpec.pose === 'converse') {
            interactMgr.stopActivity(false);
          }
          if (doc && doc.summon) doc.summon.timer = Math.min(doc.summon.timer, 1.5);
          if (nurse && nurse.summon) nurse.summon.timer = Math.min(nurse.summon.timer, 1.5);
        }, 4200);
      }
      window.CrownHospitalCheckup = { startCheckup: startMedicalCheckup };

      // ---- LIVE ER EMERGENCY EVENT SYSTEM ----
      let emergencyCooldown = 48;
      let emergencyActiveTimer = 0;
      function triggerEmergencyEvent(manual) {
        if (activeCheckupLock) return;
        const erPat = getActorById('patient-emergency');
        const drVance = getActorById('er-doctor-vance');
        const drMarch = getActorById('er-doctor-marchetti');
        const nurseCl = getActorById('nurse-clara');
        if (!erPat) return;
        emergencyActiveTimer = 16;
        emergencyCooldown = 78;
        const epPos = erPat.mesh.root.position;
        if (Math.hypot(epPos.x - 79.6, epPos.z - -15.5) > 22) {
          epPos.set(81.5, 0.0, -14.2);
        }
        const patWps = [];
        if (epPos.z > -16.5) patWps.push({ x: 79.6, z: -15.5 });
        if (epPos.x >= 78.0) patWps.push({ x: 79.6, z: -18.5 }, { x: 75.8, z: -18.5 }, { x: 75.8, z: -17.25 });
        else if (epPos.x > 73.5) patWps.push({ x: 75.8, z: -17.25 });
        patWps.push({ x: 72.0, z: -17.25 });
        erPat.summon = {
          active: true,
          waypoints: patWps,
          wpIdx: 0,
          targetX: 72.0,
          targetY: 0.70,
          targetZ: -18.12,
          pose: 'sleep',
          holdProp: null,
          follow: false,
          timer: 15.5,
          arrived: false,
          firedArrive: false,
          rigOffsetY: 0.09,
          faceYaw: 0,
          yOverride: 0.70,
        };
        function makeErStaffWps(actObj) {
          const p = actObj.mesh.root.position;
          if (p.x >= 78.0) {
            return [{ x: 78.6, z: -18.5 }, { x: 75.8, z: -18.5 }, { x: 75.8, z: -17.25 }];
          }
          if (p.z < -19.8) {
            return [{ x: 75.8, z: -17.25 }];
          }
          return null;
        }
        if (drVance) {
          drVance.summon = {
            active: true, waypoints: makeErStaffWps(drVance), wpIdx: 0,
            targetX: 73.18, targetY: 0.12, targetZ: -18.4,
            pose: 'work_examine', holdProp: 'instrument', follow: false, timer: 15.5, arrived: false, firedArrive: false,
            faceYaw: -Math.PI * 0.5,
          };
          setActorPropVisible(drVance, 'instrument');
        }
        if (drMarch) {
          drMarch.summon = {
            active: true, waypoints: makeErStaffWps(drMarch), wpIdx: 0,
            targetX: 73.18, targetY: 0.12, targetZ: -17.4,
            pose: 'work_station', holdProp: 'chart', follow: false, timer: 15.5, arrived: false, firedArrive: false,
            faceYaw: -Math.PI * 0.75,
          };
          setActorPropVisible(drMarch, 'chart');
        }
        if (nurseCl) {
          nurseCl.summon = {
            active: true, waypoints: makeErStaffWps(nurseCl), wpIdx: 0,
            targetX: 72.0, targetY: 0.12, targetZ: -17.35,
            pose: 'work_operate', holdProp: 'instrument', follow: false, timer: 15.5, arrived: false, firedArrive: false,
            faceYaw: Math.PI,
          };
          setActorPropVisible(nurseCl, 'instrument');
        }
        if (manual || Math.hypot(playerCtrl.actor.root.position.x - 79.6, playerCtrl.actor.root.position.z - -21.0) < 62) {
          g.toast('LIVE EMERGENCY: Resident rushing into Hôpital Royal ER Bay 01 — ER Doctors & Nurses responding!');
        }
      }

      // ---- CHAUFFEUR DRIVE & CAR PASSENGERS ----
      const CHAUFFEUR_DESTINATIONS = [
        { id: 'palace', title: 'Grand Château Portico', x: 0, z: 5.5, yaw: Math.PI * 0.5 },
        { id: 'hotel', title: 'Grand Hôtel Montieri & Valet Lot', x: 125.0, z: 9.8, yaw: Math.PI * 0.5 },
        { id: 'bakery', title: 'Wallflour & Maison Brioche Bakery', x: -84.0, z: 48.0, yaw: -Math.PI * 0.5 },
        { id: 'hospital', title: 'Hôpital Royal & Emergency ER', x: 86.2, z: -10.5, yaw: Math.PI * 0.5 },
        { id: 'pizza', title: 'Palazzo Napoli Pizzeria', x: -139.0, z: 48.0, yaw: -Math.PI * 0.5 },
        { id: 'club', title: 'Club Couronne Privé Nightclub', x: 133.6, z: 48.0, yaw: Math.PI * 0.5 },
        { id: 'pool', title: 'Villa Azure Resort Pool', x: 79.6, z: 19.2, yaw: Math.PI * 0.5 },
        { id: 'stables', title: 'Royal Stables & Paddock', x: -136.0, z: 0.0, yaw: -Math.PI * 0.5 },
        { id: 'farm', title: 'Greenfields Royal Farm', x: -153.5, z: -32.0, yaw: -Math.PI * 0.5 },
        { id: 'elmwood', title: 'Elmwood 3-Bedroom Houses', x: -83.0, z: 0.0, yaw: -Math.PI * 0.5 },
        { id: 'university', title: 'Crown University & High School', x: 106.5, z: 0.0, yaw: Math.PI * 0.5 },
        { id: 'bank_salon', title: 'Royal Crown Bank & Lumina Salon', x: -194.0, z: 0.0, yaw: -Math.PI * 0.5 },
        { id: 'gym_library', title: 'Couronne Athletic Club & Library', x: -194.0, z: 48.0, yaw: -Math.PI * 0.5 },
        { id: 'cinema_offices', title: 'Riviera Cinema & Business Offices', x: 198.0, z: 0.0, yaw: Math.PI * 0.5 },
        { id: 'community_apts', title: 'Community Centre & Belvedere Apts', x: 206.0, z: 19.2, yaw: Math.PI * 0.5 },
        { id: 'villa_west', title: 'Villa Soléa Waterfront (West Beach)', x: -194.0, z: 48.0, yaw: -Math.PI * 0.5 },
        { id: 'villa_east', title: 'Cap d’Azur Villa & Cliff (East Beach)', x: 206.0, z: 48.0, yaw: Math.PI * 0.5 },
      ];

      let roadGraphCache = null;
      function getRoadGraph() {
        if (roadGraphCache) return roadGraphCache;
        const nodes = [];
        const edges = [];
        function addNode(x, z) {
          for (let i = 0; i < nodes.length; i++) {
            if (Math.hypot(nodes[i].x - x, nodes[i].z - z) < 0.1) return i;
          }
          nodes.push({ x: x, z: z });
          edges.push([]);
          return nodes.length - 1;
        }
        function isEdgeClean(x0, z0, x1, z1) {
          const dist = Math.hypot(x1 - x0, z1 - z0);
          const steps = Math.max(4, Math.ceil(dist / 0.8));
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const x = x0 + (x1 - x0) * t;
            const z = z0 + (z1 - z0) * t;
            if (typeof castle.isDrivableSurface === 'function' && !castle.isDrivableSurface(x, z, 0.3)) return false;
          }
          if (typeof castle.hasBlockedSegment === 'function' && castle.hasBlockedSegment(x0, z0, x1, z1, 0.9, 0, { carMode: true })) return false;
          return true;
        }
        function linkIfClean(x0, z0, x1, z1) {
          if (isEdgeClean(x0, z0, x1, z1)) {
            const a = addNode(x0, z0);
            const b = addNode(x1, z1);
            const w = Math.hypot(x1 - x0, z1 - z0);
            edges[a].push({ to: b, w: w });
            edges[b].push({ to: a, w: w });
          }
        }
        function connectAxis(xs, zs) {
          for (let zi = 0; zi < zs.length; zi++) {
            const z = zs[zi];
            for (let xi = 0; xi < xs.length - 1; xi++) {
              linkIfClean(xs[xi], z, xs[xi + 1], z);
            }
          }
          for (let xi = 0; xi < xs.length; xi++) {
            const x = xs[xi];
            for (let zi = 0; zi < zs.length - 1; zi++) {
              linkIfClean(x, zs[zi], x, zs[zi + 1]);
            }
          }
        }
        // Core West, Courtyard & East Road Grid (splitting around the 3 Roundabouts!)
        connectAxis([-153.5, -123.5, -95.0, -67.0, -44.0], [-10.5, 0.0, 48.0]);
        connectAxis([-123.5, -95.0, -67.0, -44.0], [0.0, 19.2, 48.0]);
        connectAxis([-153.5, -67.0], [-32.0, -10.5]);
        connectAxis([-44.0, -20.0, 0.0, 20.0, 44.0], [4.8, 20.2, 36.5, 48.0]);
        connectAxis([0.0], [4.8, 5.5, 20.2, 36.5, 48.0]);
        connectAxis([44.0, 67.0, 92.5, 120.5, 156.5], [-10.5, 0.0, 19.2, 48.0]);
        connectAxis([67.0, 92.5, 120.5, 156.5], [-32.0, -10.5]);
        connectAxis([120.5], [0.0, 9.8, 19.2]);
        connectAxis([120.5, 125.0], [9.8]);

        // Expanded West District Streets (-218, -186, -153.5)
        connectAxis([-218.0, -186.0, -153.5], [0.0, 48.0]);
        connectAxis([-218.0], [0.0, 19.2, 48.0]);

        // Expanded East District Streets (156.5, 190.0, 222.0)
        connectAxis([156.5, 190.0, 222.0], [0.0, 48.0]);
        connectAxis([156.5, 222.0], [0.0, 19.2, 48.0]);

        // Circumferential 8-Node Octagon Rings + Street Tangents for all 3 Landscaped Roundabouts
        const rbs = [
          { x: -153.5, z: 19.2, westX: -181.2, eastX: -123.5, southZ: 48.0, northZ: 0.0 },
          { x: -186.0, z: 19.2, westX: -218.0, eastX: -158.3, southZ: 48.0, northZ: 0.0 },
          { x: 190.0, z: 19.2, westX: 156.5, eastX: 222.0, southZ: 48.0, northZ: 0.0 },
        ];
        rbs.forEach(function (rb) {
          const ringR = 4.85;
          const pts = [];
          for (let k = 0; k < 8; k++) {
            const ang = (k / 8) * Math.PI * 2;
            pts.push([rb.x + Math.cos(ang) * ringR, rb.z + Math.sin(ang) * ringR]);
          }
          for (let k = 0; k < 8; k++) {
            const n = (k + 1) % 8;
            linkIfClean(pts[k][0], pts[k][1], pts[n][0], pts[n][1]);
          }
          linkIfClean(pts[0][0], pts[0][1], rb.eastX, rb.z); // East tangent
          linkIfClean(pts[4][0], pts[4][1], rb.westX, rb.z); // West tangent
          linkIfClean(pts[2][0], pts[2][1], rb.x, rb.southZ); // South tangent
          linkIfClean(pts[6][0], pts[6][1], rb.x, rb.northZ); // North tangent
        });
        linkIfClean(-194.0, 48.0, -186.0, 48.0);
        linkIfClean(-194.0, 0.0, -186.0, 0.0);
        linkIfClean(198.0, 0.0, 190.0, 0.0);
        linkIfClean(206.0, 48.0, 190.0, 48.0);
        linkIfClean(206.0, 19.2, 194.85, 19.2);
        linkIfClean(206.0, 19.2, 222.0, 19.2);

        roadGraphCache = { nodes: nodes, edges: edges, isEdgeClean: isEdgeClean };
        return roadGraphCache;
      }

      function buildCarRoadWaypoints(sx, sz, dx, dz, endYaw) {
        const rg = getRoadGraph();
        const nodes = rg.nodes;
        const edges = rg.edges;
        const isEdgeClean = rg.isEdgeClean;
        const sSnap = typeof castle.snapToDrivableSurface === 'function' ? castle.snapToDrivableSurface(sx, sz) : { x: sx, z: sz };
        const dSnap = typeof castle.snapToDrivableSurface === 'function' ? castle.snapToDrivableSurface(dx, dz) : { x: dx, z: dz };

        function attachPt(pt) {
          const list = [];
          for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            const d = Math.hypot(n.x - pt.x, n.z - pt.z);
            if (d <= 60 && isEdgeClean(pt.x, pt.z, n.x, n.z)) list.push({ i: i, d: d });
          }
          list.sort(function (a, b) { return a.d - b.d; });
          if (!list.length) {
            let bi = 0;
            let bd = Infinity;
            for (let i = 0; i < nodes.length; i++) {
              const d = Math.hypot(nodes[i].x - pt.x, nodes[i].z - pt.z);
              if (d < bd) { bd = d; bi = i; }
            }
            list.push({ i: bi, d: bd });
          }
          return list.slice(0, 4);
        }

        const starts = attachPt(sSnap);
        const ends = attachPt(dSnap);
        const endMap = {};
        ends.forEach(function (e) { endMap[e.i] = e.d; });

        const dist = new Array(nodes.length).fill(Infinity);
        const prev = new Array(nodes.length).fill(-1);
        const vis = new Array(nodes.length).fill(false);
        starts.forEach(function (s) { dist[s.i] = s.d; });

        let bestEndNode = -1;
        let bestTotal = Infinity;
        for (let iter = 0; iter < nodes.length; iter++) {
          let u = -1;
          let ud = Infinity;
          for (let i = 0; i < nodes.length; i++) {
            if (!vis[i] && dist[i] < ud) { ud = dist[i]; u = i; }
          }
          if (u === -1) break;
          vis[u] = true;
          if (typeof endMap[u] === 'number' && ud + endMap[u] < bestTotal) {
            bestTotal = ud + endMap[u];
            bestEndNode = u;
          }
          for (let ei = 0; ei < edges[u].length; ei++) {
            const e = edges[u][ei];
            if (ud + e.w < dist[e.to]) { dist[e.to] = ud + e.w; prev[e.to] = u; }
          }
        }

        const raw = [];
        if (Math.hypot(sSnap.x - sx, sSnap.z - sz) > 0.25) raw.push({ x: sSnap.x, z: sSnap.z });
        const nodeSeq = [];
        let cur = bestEndNode;
        while (cur !== -1) {
          nodeSeq.unshift(nodes[cur]);
          cur = prev[cur];
        }
        for (let i = 0; i < nodeSeq.length; i++) raw.push({ x: nodeSeq[i].x, z: nodeSeq[i].z });
        if (Math.hypot(dSnap.x - dx, dSnap.z - dz) > 0.25) raw.push({ x: dSnap.x, z: dSnap.z });
        raw.push({ x: dx, z: dz, yaw: endYaw });

        const out = [];
        for (let i = 0; i < raw.length; i++) {
          const p = raw[i];
          if (out.length && Math.hypot(p.x - out[out.length - 1].x, p.z - out[out.length - 1].z) < 0.25 && typeof p.yaw === 'undefined') {
            continue;
          }
          out.push(p);
        }
        return out;
      }

      function resolveTargetVehicle(vehicleId) {
        const list = castle.vehicles || [];
        if (vehicleId) {
          const found = list.find(function (v) { return v.id === vehicleId; });
          if (found) return found;
        }
        const curTr = playerCtrl.getTransport();
        if (curTr && curTr.kind === 'car' && curTr.entity) return curTr.entity;
        return list.find(function (v) { return v.id === 'royal_palace_car'; }) || list[0] || null;
      }

      function openChauffeurRideSheet(vehicleId) {
        const carDef = resolveTargetVehicle(vehicleId);
        const lucien = getActorById('chauffeur-lucien');
        if (!carDef || !lucien) {
          g.toast('No vehicle or Chauffeur Lucien available right now.');
          return;
        }
        actionTitle.textContent = 'Chauffeur Lucien — Choose Destination';
        actionList.innerHTML = '';
        CHAUFFEUR_DESTINATIONS.forEach(function (dest) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item';
          const tEl = document.createElement('strong');
          tEl.textContent = 'Drive to ' + dest.title;
          const hEl = document.createElement('span');
          hEl.textContent = 'Sit in passenger seat while Lucien drives ' + (carDef.title || 'Royal Car') + ' there';
          btn.appendChild(tEl);
          btn.appendChild(hEl);
          btn.addEventListener('click', function () {
            closeActionSheet();
            const wps = buildCarRoadWaypoints(carDef.x, carDef.z, dest.x, dest.z, dest.yaw);
            playerCtrl.setChauffeurRide(carDef, lucien, wps, dest.title, function (arrivedTitle) {
              g.toast('Chauffeur Lucien pulled up cleanly at ' + arrivedTitle + '!');
            });
            g.toast('Chauffeur Lucien is driving you to ' + dest.title + '!');
            syncHud(playerCtrl.actor.root.position);
          });
          actionList.appendChild(btn);
        });
        actionOverlay.classList.add('open');
      }

      function openCarPassengersSheet(vehicleId) {
        const carDef = resolveTargetVehicle(vehicleId);
        if (!carDef) return;
        const curTr = playerCtrl.getTransport();
        if (!curTr || curTr.kind !== 'car' || curTr.entity.id !== carDef.id) {
          playerCtrl.enterCar(carDef);
        }
        actionTitle.textContent = 'Invite Companions Into ' + (carDef.title || 'Car');
        actionList.innerHTML = '';

        const seatedList = playerCtrl.getPassengers ? playerCtrl.getPassengers() : [];
        const seatedMap = {};
        for (let i = 0; i < seatedList.length; i++) seatedMap[seatedList[i].id] = seatedList[i];

        const chaufBtn = document.createElement('button');
        chaufBtn.type = 'button';
        chaufBtn.className = 'world-action-item';
        const cTitle = document.createElement('strong');
        cTitle.textContent = 'Have Chauffeur Lucien Drive Us Instead';
        const cHint = document.createElement('span');
        cHint.textContent = 'Pick a destination while everyone rides along in back';
        chaufBtn.appendChild(cTitle);
        chaufBtn.appendChild(cHint);
        chaufBtn.addEventListener('click', function () {
          openChauffeurRideSheet(carDef.id);
        });
        actionList.appendChild(chaufBtn);

        const candidates = actors.filter(function (a) {
          return a.id !== 'chauffeur-lucien' && (a.actorCategory === 'friend' || a.actorCategory === 'staff' || a.actorCategory === 'citizen') && a.ageGroup !== 'toddler';
        }).slice(0, 14);

        candidates.forEach(function (act) {
          const isIn = Boolean(seatedMap[act.id]);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item';
          const tEl = document.createElement('strong');
          tEl.textContent = (isIn ? '✓ Unboard ' : '+ Board ') + act.name;
          const hEl = document.createElement('span');
          hEl.textContent = isIn ? ('Sitting in seat: ' + seatedMap[act.id].seatKey) : (act.roleLabel || 'Court Guest');
          btn.appendChild(tEl);
          btn.appendChild(hEl);
          btn.addEventListener('click', function () {
            if (isIn) {
              playerCtrl.removePassenger(act.id);
              g.toast(act.name + ' stepped out of the car.');
            } else {
              const ok = playerCtrl.addPassenger({ id: act.id, name: act.name, actor: act.mesh, npcRef: act });
              if (!ok) g.toast('All passenger seats are full! Unboard someone first.');
              else g.toast(act.name + ' climbed into the car beside you!');
            }
            openCarPassengersSheet(carDef.id);
            syncHud(playerCtrl.actor.root.position);
          });
          actionList.appendChild(btn);
        });
        actionOverlay.classList.add('open');
      }

      // ---- MULTI-CHAIR "CALL TO MEAL" & DINE WITH SOMEONE ----
      let activeDiningGroup = [];
      function releaseDiningGroup() {
        for (let di = 0; di < activeDiningGroup.length; di++) {
          const dm = activeDiningGroup[di];
          if (!dm) continue;
          dm.summon = null;
          setActorPropVisible(dm, null);
          if (dm.wasInPose && dm.mesh) {
            dm.wasInPose = false;
            if (dm.mesh.rig) dm.mesh.rig.position.set(0, 0, 0);
            if (dm.mesh.leftLeg) dm.mesh.leftLeg.rotation.set(0, 0, 0);
            if (dm.mesh.rightLeg) dm.mesh.rightLeg.rotation.set(0, 0, 0);
            if (dm.mesh.leftArm) dm.mesh.leftArm.rotation.set(0, 0, 0);
            if (dm.mesh.rightArm) dm.mesh.rightArm.rotation.set(0, 0, 0);
          }
          if (dm.mesh && dm.mesh.root) {
            dm.mesh.root.position.set(dm.homeX, dm.homeY || 0, dm.homeZ);
          }
        }
        activeDiningGroup = [];
      }

      function seatMemberAtChair(act, seat, instantSit) {
        if (!act || !seat) return;
        const nPos = act.mesh.root.position;
        const diffFloor = Math.abs(nPos.y - seat.y) > 1.3;
        const distFar = Math.hypot(nPos.x - seat.x, nPos.z - seat.z) > 22;
        if (diffFloor || distFar) {
          const sx = typeof seat.approachX === 'number' ? seat.approachX : seat.x;
          const sz = typeof seat.approachZ === 'number' ? seat.approachZ : seat.z;
          nPos.set(sx, seat.y, sz);
          act.homeY = seat.y;
        }
        act.isTalking = false;
        setActorPropVisible(act, 'teacup');
        if (instantSit) {
          nPos.set(seat.x, seat.y, seat.z);
          act.mesh.root.rotation.y = seat.yaw || 0;
        }
        act.summon = {
          active: true,
          targetX: seat.x,
          targetY: seat.y,
          targetZ: seat.z,
          pose: 'eat',
          holdProp: 'teacup',
          follow: false,
          timer: 180,
          arrived: Boolean(instantSit),
          firedArrive: Boolean(instantSit),
          rigOffsetY: seat.rigOffsetY,
          faceYaw: seat.yaw,
          yOverride: seat.y,
          waypoints: instantSit || typeof seat.approachX !== 'number' ? null : [{ x: seat.approachX, z: seat.approachZ }],
          wpIdx: 0,
          assignedSeat: seat,
        };
      }

      function getAvailableDiningSeats(seatsList) {
        if (!Array.isArray(seatsList) || !seatsList.length) return [];
        const pPos = playerCtrl.actor.root.position;
        // Identify which chair the player is sitting in (nearest chair within 1.1m, else index 0)
        let playerSeatIdx = 0;
        let bestP = Infinity;
        for (let si = 0; si < seatsList.length; si++) {
          const d = Math.hypot(pPos.x - seatsList[si].x, pPos.z - seatsList[si].z);
          if (d < bestP) {
            bestP = d;
            playerSeatIdx = si;
          }
        }
        const avail = [];
        for (let si = 0; si < seatsList.length; si++) {
          if (si === playerSeatIdx) continue;
          const seat = seatsList[si];
          const taken = activeDiningGroup.some(function (dm) {
            return dm && dm.summon && dm.summon.assignedSeat &&
              Math.hypot(dm.summon.assignedSeat.x - seat.x, dm.summon.assignedSeat.z - seat.z) < 0.25;
          });
          if (!taken) avail.push(seat);
        }
        return avail;
      }

      function callGroupToMeal(spot, action) {
        const activeAct = interactMgr ? interactMgr.getActiveActivity() : null;
        let targetSpot = spot;
        if (!targetSpot && action && action.spotId && castle && castle.spots) {
          targetSpot = castle.spots[action.spotId];
        }
        const seatsList =
          (targetSpot && targetSpot.seats) ||
          (activeAct && activeAct.seats) ||
          (activeAct && activeAct.partnerAnchor ? [activeAct.partnerAnchor] : null);

        if (!seatsList || !seatsList.length) {
          g.toast('No dining chairs found nearby!');
          return;
        }

        // Seat the player in seat[0] first if not already seated eating
        if (!activeAct || activeAct.pose !== 'eat') {
          const eatAction = targetSpot && Array.isArray(targetSpot.actions)
            ? targetSpot.actions.find(function (a) { return a.pose === 'eat'; })
            : null;
          if (eatAction && interactMgr) {
            interactMgr.runAction(eatAction);
          }
        }

        releaseDiningGroup();
        const availSeats = getAvailableDiningSeats(seatsList);
        if (!availSeats.length) {
          g.toast('Every dining chair at this table is already filled!');
          return;
        }

        const pPos = playerCtrl.actor.root.position;
        const pool = actors
          .filter(function (a) {
            return a.ageGroup !== 'toddler' && !a.isTalking &&
              (a.actorCategory === 'friend' || a.actorCategory === 'citizen' || a.actorCategory === 'staff');
          })
          .sort(function (a, b) {
            const aFriend = a.actorCategory === 'friend' ? -30 : 0;
            const bFriend = b.actorCategory === 'friend' ? -30 : 0;
            const aFloor = Math.abs((a.homeY || 0) - pPos.y) < 1.5 ? 0 : 18;
            const bFloor = Math.abs((b.homeY || 0) - pPos.y) < 1.5 ? 0 : 18;
            const da = Math.hypot(a.mesh.root.position.x - pPos.x, a.mesh.root.position.z - pPos.z) + aFriend + aFloor;
            const db = Math.hypot(b.mesh.root.position.x - pPos.x, b.mesh.root.position.z - pPos.z) + bFriend + bFloor;
            return da - db;
          });

        const count = Math.min(availSeats.length, pool.length);
        const names = [];
        for (let i = 0; i < count; i++) {
          const guest = pool[i];
          const seat = availSeats[i];
          activeDiningGroup.push(guest);
          seatMemberAtChair(guest, seat, false);
          names.push(guest.name);
        }

        if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 16, composure: 10 });
        g.toast('Called to meal: ' + names.join(', ') + ' — everyone is heading to their own chair!');
      }

      function openDiningPartnerSheet() {
        const activeAct = interactMgr ? interactMgr.getActiveActivity() : null;
        const seatsList = (activeAct && activeAct.seats) || (activeAct && activeAct.partnerAnchor ? [activeAct.partnerAnchor] : null);
        if (!activeAct || !seatsList || !seatsList.length) {
          g.toast('Sit at any dining table, bistro, or breakfast bar first!');
          return;
        }
        const availSeats = getAvailableDiningSeats(seatsList);
        if (!availSeats.length) {
          g.toast('All dining chairs at this table are occupied!');
          return;
        }

        actionTitle.innerHTML = '<span class="s4-plumbob"></span>Call to Meal · Invite Guests';
        actionList.innerHTML = '';

        const callAllBtn = document.createElement('button');
        callAllBtn.type = 'button';
        callAllBtn.className = 'world-action-item s4-card s4-cat-meal';
        callAllBtn.innerHTML =
          '<strong>Call Household & Friends to Meal (' + availSeats.length + ' Open Chairs)</strong>' +
          '<span>Fills every open seat automatically — zero chair stacking!</span>';
        callAllBtn.addEventListener('click', function () {
          closeActionSheet();
          callGroupToMeal(null, null);
        });
        actionList.appendChild(callAllBtn);

        const pool = actors.filter(function (a) {
          return a.ageGroup !== 'toddler' &&
            activeDiningGroup.indexOf(a) === -1 &&
            (a.actorCategory === 'friend' || a.actorCategory === 'staff' || a.actorCategory === 'citizen');
        }).slice(0, 14);

        pool.forEach(function (act) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item s4-card s4-cat-friendly';
          const tEl = document.createElement('strong');
          tEl.textContent = 'Invite ' + act.name + ' to Their Own Chair';
          const hEl = document.createElement('span');
          hEl.textContent = (act.roleLabel || 'Guest') + ' · Takes open seat #' + (activeDiningGroup.length + 2);
          btn.appendChild(tEl);
          btn.appendChild(hEl);
          btn.addEventListener('click', function () {
            closeActionSheet();
            const openNow = getAvailableDiningSeats(seatsList);
            if (!openNow.length) {
              g.toast('All chairs are taken!');
              return;
            }
            activeDiningGroup.push(act);
            seatMemberAtChair(act, openNow[0], true);
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 14, composure: 8 });
            g.toast(act.name + ' sat down in their own chair to dine with you! (+14 Fun)');
          });
          actionList.appendChild(btn);
        });
        actionOverlay.classList.add('open');
      }

      function resolveTargetBoat(boatId) {
        const list = castle.boats || [];
        if (boatId) {
          const found = list.find(function (b) { return b.id === boatId; });
          if (found) return found;
        }
        const curTr = playerCtrl.getTransport();
        if (curTr && curTr.kind === 'boat' && curTr.entity) return curTr.entity;
        return list.find(function (b) { return b.isYacht; }) || list[0] || null;
      }

      function buildMarineWaypoints(sx, sz, dx, dz, endYaw, destId) {
        const wps = [];
        // Exit sheltered pier/marina zone into open channel first if needed
        if (sz < 72.0) {
          wps.push({ x: sx < -4.0 ? -10.5 : (sx > 10.0 ? sx : 7.5), z: 76.0 });
        }
        if (destId === 'sunset_loop') {
          wps.push({ x: -24.0, z: 112.0 }, { x: 0.0, z: 148.0 }, { x: 34.0, z: 118.0 }, { x: 6.5, z: 72.0, yaw: Math.PI * 0.42 });
          return wps;
        }
        // Clear Île d'Or & Lighthouse Isle safely via central bay channel if crossing far east/west
        if (Math.abs(sx - dx) > 65 && dz > 110) {
          wps.push({ x: (sx + dx) * 0.5, z: 112.0 });
        }
        wps.push({ x: dx, z: dz, yaw: endYaw });
        return wps;
      }

      function openBoatCaptainSheet(boatId) {
        const boatDef = resolveTargetBoat(boatId);
        const capHenri = getActorById('captain-henri');
        const dests = (castle.ocean && castle.ocean.dockDestinations) || [
          { id: 'ile_dor', title: 'Île d’Or Private Island', x: 62, z: 141, yaw: 0 },
          { id: 'lighthouse', title: 'Sapphire Lighthouse Isle', x: -51.5, z: 145, yaw: -Math.PI * 0.5 },
          { id: 'coral_cove', title: 'Cove d’Azur Coral Reef', x: 118, z: 74, yaw: Math.PI * 0.35 },
          { id: 'marina', title: 'Royal Riviera Marina', x: -10.5, z: 75.5, yaw: Math.PI },
        ];
        if (!boatDef) return;
        actionTitle.innerHTML = '<span class="s4-plumbob"></span>Captain Henri — Sail Destination';
        actionList.innerHTML = '';

        const selfPilotBtn = document.createElement('button');
        selfPilotBtn.type = 'button';
        selfPilotBtn.className = 'world-action-item s4-card s4-cat-swim';
        const spT = document.createElement('strong');
        spT.textContent = 'Take Helm Control Yourself';
        const spH = document.createElement('span');
        spH.textContent = 'Drive forward, reverse & steer freely across the Riviera Ocean';
        selfPilotBtn.appendChild(spT);
        selfPilotBtn.appendChild(spH);
        selfPilotBtn.addEventListener('click', function () {
          closeActionSheet();
          const trNow = playerCtrl.getTransport();
          if (trNow && trNow.kind === 'boat' && trNow.entity.id === boatDef.id) {
            playerCtrl.takeBoatControl();
          } else {
            playerCtrl.enterBoat(boatDef);
          }
          g.toast('You have the helm of ' + (boatDef.title || 'Royal Superyacht') + '!');
          syncHud(playerCtrl.actor.root.position);
        });
        actionList.appendChild(selfPilotBtn);

        dests.forEach(function (dest) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item s4-card s4-cat-activity';
          const tEl = document.createElement('strong');
          tEl.textContent = 'Captain Sail → ' + dest.title;
          const hEl = document.createElement('span');
          hEl.textContent = 'Relax on the bow sunbeds while Captain Henri steers across open waves';
          btn.appendChild(tEl);
          btn.appendChild(hEl);
          btn.addEventListener('click', function () {
            closeActionSheet();
            const wps = buildMarineWaypoints(boatDef.x, boatDef.z, dest.x, dest.z, dest.yaw, dest.id);
            playerCtrl.setYachtCaptainCruise(boatDef, capHenri, wps, dest.title, function (arrivedTitle) {
              g.toast('Captain Henri dropped anchor smoothly at ' + arrivedTitle + '!');
            });
            g.toast('Captain Henri is sailing ' + (boatDef.title || 'Yacht') + ' toward ' + dest.title + '!');
            syncHud(playerCtrl.actor.root.position);
          });
          actionList.appendChild(btn);
        });
        actionOverlay.classList.add('open');
      }

      function inviteActorToBoat(act, boatId) {
        const boatDef = resolveTargetBoat(boatId || 'riviera_royal_yacht');
        if (!boatDef) return false;
        const curTr = playerCtrl.getTransport();
        if (!curTr || curTr.kind !== 'boat' || curTr.entity.id !== boatDef.id) {
          playerCtrl.enterBoat(boatDef);
        }
        if (act && act.id !== 'captain-henri') {
          const ok = playerCtrl.addBoatPassenger({ id: act.id, name: act.name, actor: act.mesh, npcRef: act });
          if (!ok) {
            g.toast('All seats on ' + (boatDef.title || 'the vessel') + ' are filled!');
          } else {
            g.toast(act.name + ' came aboard ' + (boatDef.title || 'the vessel') + ' with you!');
          }
        }
        camCtrl.resetCamera(0);
        syncHud(playerCtrl.actor.root.position);
        return true;
      }

      function getSortedBoatCandidates() {
        const vipBoost = {
          'hostess-coralie': 1,
          'diver-marco': 2,
          'mansionette-sophia': 3,
          'neighbor-claire': 4,
          'lifeguard-gabriel': 5,
        };
        return actors
          .filter(function (a) {
            return a.id !== 'captain-henri' && (a.actorCategory === 'friend' || a.actorCategory === 'citizen' || a.actorCategory === 'staff') && a.ageGroup !== 'toddler';
          })
          .sort(function (a, b) {
            const aRank = a.actorCategory === 'friend' ? 0 : (vipBoost[a.id] ? 1 : (a.actorCategory === 'citizen' ? 2 : 3));
            const bRank = b.actorCategory === 'friend' ? 0 : (vipBoost[b.id] ? 1 : (b.actorCategory === 'citizen' ? 2 : 3));
            if (aRank !== bRank) return aRank - bRank;
            if (vipBoost[a.id] || vipBoost[b.id]) return (vipBoost[a.id] || 99) - (vipBoost[b.id] || 99);
            return 0;
          });
      }

      function openBoatPassengersSheet(boatId) {
        const boatDef = resolveTargetBoat(boatId);
        if (!boatDef) return;
        const curTr = playerCtrl.getTransport();
        if (!curTr || curTr.kind !== 'boat' || curTr.entity.id !== boatDef.id) {
          playerCtrl.enterBoat(boatDef);
        }
        actionTitle.innerHTML = '<span class="s4-plumbob"></span>Friends Aboard ' + (boatDef.title || 'Vessel');
        actionList.innerHTML = '';

        const seatedList = playerCtrl.getBoatPassengers ? playerCtrl.getBoatPassengers() : [];
        const seatedMap = {};
        for (let i = 0; i < seatedList.length; i++) seatedMap[seatedList[i].id] = seatedList[i];

        const candidates = getSortedBoatCandidates();

        const inviteBestiesBtn = document.createElement('button');
        inviteBestiesBtn.type = 'button';
        inviteBestiesBtn.className = 'world-action-item s4-card s4-cat-friendly';
        const ibT = document.createElement('strong');
        ibT.textContent = boatDef.isYacht ? 'Invite All 4 Besties Aboard Yacht' : 'Invite 2 Besties Into Rowboat';
        const ibH = document.createElement('span');
        ibH.textContent = boatDef.isYacht ? 'Boards Camille, Chloe, Vivienne & Julian together onto deck!' : 'Seats Camille & Chloe on bow & stern benches!';
        inviteBestiesBtn.appendChild(ibT);
        inviteBestiesBtn.appendChild(ibH);
        inviteBestiesBtn.addEventListener('click', function () {
          const maxSeats = boatDef.isYacht ? 4 : 2;
          let added = 0;
          for (let ci = 0; ci < candidates.length && added < maxSeats; ci++) {
            const c = candidates[ci];
            if (playerCtrl.addBoatPassenger({ id: c.id, name: c.name, actor: c.mesh, npcRef: c })) {
              added += 1;
            }
          }
          g.toast('Friends came aboard ' + (boatDef.title || 'the vessel') + '!');
          openBoatPassengersSheet(boatDef.id);
          syncHud(playerCtrl.actor.root.position);
        });
        actionList.appendChild(inviteBestiesBtn);

        const altBoatId = boatDef.isYacht ? 'riviera_rowboat_west' : 'riviera_royal_yacht';
        const switchBtn = document.createElement('button');
        switchBtn.type = 'button';
        switchBtn.className = 'world-action-item s4-card s4-cat-activity';
        const swT = document.createElement('strong');
        swT.textContent = boatDef.isYacht ? 'Switch to Cedar Rowboat Trip' : 'Switch to Royal Superyacht';
        const swH = document.createElement('span');
        swH.textContent = boatDef.isYacht ? 'Row across blue Riviera waters with up to 2 friends' : 'Cruise on the luxury superyacht with up to 4 friends';
        switchBtn.appendChild(swT);
        switchBtn.appendChild(swH);
        switchBtn.addEventListener('click', function () {
          openBoatPassengersSheet(altBoatId);
        });
        actionList.appendChild(switchBtn);

        if (boatDef.isYacht) {
          const capBtn = document.createElement('button');
          capBtn.type = 'button';
          capBtn.className = 'world-action-item s4-card s4-cat-swim';
          const cT = document.createElement('strong');
          cT.textContent = 'Have Captain Henri Steer Yacht';
          const cH = document.createElement('span');
          cH.textContent = 'Pick an Island, Sunset Cruise, or Marina destination';
          capBtn.appendChild(cT);
          capBtn.appendChild(cH);
          capBtn.addEventListener('click', function () {
            openBoatCaptainSheet(boatDef.id);
          });
          actionList.appendChild(capBtn);
        }

        candidates.forEach(function (act) {
          const isIn = Boolean(seatedMap[act.id]);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item s4-card s4-cat-friendly';
          const tEl = document.createElement('strong');
          tEl.textContent = (isIn ? '✓ Disembark ' : '+ Board ') + act.name;
          const hEl = document.createElement('span');
          hEl.textContent = isIn ? ('Seated on deck: ' + seatedMap[act.id].seatKey) : (act.roleLabel || 'Court Guest');
          btn.appendChild(tEl);
          btn.appendChild(hEl);
          btn.addEventListener('click', function () {
            if (isIn) {
              playerCtrl.removeBoatPassenger(act.id);
              g.toast(act.name + ' stepped ashore.');
            } else {
              const ok = playerCtrl.addBoatPassenger({ id: act.id, name: act.name, actor: act.mesh, npcRef: act });
              if (!ok) g.toast('All deck seats are filled! Disembark someone first.');
              else g.toast(act.name + ' came aboard ' + (boatDef.title || 'the vessel') + '!');
            }
            openBoatPassengersSheet(boatDef.id);
            syncHud(playerCtrl.actor.root.position);
          });
          actionList.appendChild(btn);
        });
        actionOverlay.classList.add('open');
      }

      const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
      const SEASON_LABELS = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' };
      function getCurrentSeason() {
        if (g.world && g.world.seasonOverride && SEASONS.indexOf(g.world.seasonOverride) !== -1) {
          return g.world.seasonOverride;
        }
        const dayIdx = Math.max(0, (g.world && g.world.day ? g.world.day : 1) - 1);
        return SEASONS[Math.floor(dayIdx / 7) % 4];
      }
      function applySeasonEffects(forceTint) {
        const s = getCurrentSeason();
        const changed = !g.world || g.world.season !== s;
        if (g.world) g.world.season = s;
        if ((changed || forceTint) && castle && typeof castle.setSeasonTint === 'function') {
          castle.setSeasonTint(s);
          lastSkyHr = -999;
        }
        return s;
      }
      function cycleSeason() {
        const curOv = g.world && g.world.seasonOverride;
        if (!curOv) {
          const cur = getCurrentSeason();
          g.world.seasonOverride = SEASONS[(SEASONS.indexOf(cur) + 1) % SEASONS.length];
        } else {
          const idx = SEASONS.indexOf(curOv);
          g.world.seasonOverride = idx === SEASONS.length - 1 ? null : SEASONS[idx + 1];
        }
        const nextS = applySeasonEffects(true);
        if (window.CrownSave) window.CrownSave.save(true);
        syncHud(playerCtrl.actor.root.position);
        g.toast(
          g.world.seasonOverride
            ? 'Kingdom Season set to ' + SEASON_LABELS[nextS] + '!'
            : 'Seasonal Auto-Cycle restored (' + SEASON_LABELS[nextS] + ')!'
        );
      }

      const SECURITY_MODES = ['public', 'royal', 'lockdown'];
      const SECURITY_LABELS = {
        public: 'Public Open Kingdom Tour',
        royal: 'Royal Court Clearance Only',
        lockdown: 'High Guard Lockdown',
      };
      function cycleSecurityMode() {
        const cur = (g.world && g.world.securityMode) || 'royal';
        const nxt = SECURITY_MODES[(SECURITY_MODES.indexOf(cur) + 1) % SECURITY_MODES.length];
        g.world.securityMode = nxt;
        if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
        g.gossipLog.unshift({
          day: (g.world && g.world.day) || 1,
          text: 'Crown Dispatch Protocol: Royal Gate Security switched to ' + SECURITY_LABELS[nxt] + '.',
        });
        if (g.gossipLog.length > 24) g.gossipLog.length = 24;
        if (window.CrownSave) window.CrownSave.save(true);
        g.toast('Palace Gate Security: ' + SECURITY_LABELS[nxt] + '!');
      }

      const REAL_ESTATE_CATALOG = [
        { id: 'palace', title: 'Grand Royal Château de Versailles', subtitle: '7 Floors · 15+ Suites, Ballroom, 4F Vault & 7F Sky Pool', price: 0, x: 0, y: 0.65, z: -20.5, yaw: Math.PI },
        { id: 'belvedere_apt', title: 'Belvedere 2-Storey Luxury Penthouse', subtitle: 'East Capital District · 2-Storey Private Loft Residence', price: 900, x: 206.0, y: 4.12, z: 32.0, yaw: Math.PI },
        { id: 'villa_solea', title: 'Villa Soléa Waterfront Beach House', subtitle: 'West Riviera Coastline · Direct Sand & Blue Ocean Access', price: 1800, x: -194.0, y: 0.12, z: 54.4, yaw: 0 },
        { id: 'cap_dazur', title: 'Cap d’Azur Waterfront Beach Villa', subtitle: 'East Riviera Coastline · Private Sea-View Terrace', price: 2200, x: 194.0, y: 0.12, z: 54.4, yaw: 0 },
        { id: 'elmwood_house', title: 'Elmwood 3-Bedroom Family Residence', subtitle: 'Willow Creek Avenue · Lawn, Car Garage & Garden Porch', price: 750, x: -83.0, y: 0.12, z: 13.0, yaw: Math.PI },
        { id: 'stone_mansionette', title: 'Willow Creek 2-Storey Mansionette', subtitle: 'North Suburb · Twin Reception Salon & Nursery Suite', price: 1350, x: -77.5, y: 0.12, z: -20.5, yaw: Math.PI },
        { id: 'village_cottage', title: 'Charming Village Hearth Cottage', subtitle: 'West Courtyard Quarter · Rustic Hearth & Cozy Study', price: 420, x: -50.8, y: 0.08, z: 9.0, yaw: Math.PI * 0.5 },
      ];

      function openRealEstateSheet() {
        if (!Array.isArray(g.ownedProperties)) g.ownedProperties = ['palace'];
        if (g.ownedProperties.indexOf('palace') === -1) g.ownedProperties.unshift('palace');
        if (!g.homePropertyId) g.homePropertyId = 'palace';
        actionTitle.textContent = 'Royal Real Estate & Kingdom Homes';
        actionList.innerHTML = '';
        REAL_ESTATE_CATALOG.forEach(function (prop) {
          const isOwned = g.ownedProperties.indexOf(prop.id) !== -1;
          const isPrimary = g.homePropertyId === prop.id;
          const card = document.createElement('div');
          card.className = 'world-action-item';
          card.style.cursor = 'default';
          const titleEl = document.createElement('strong');
          titleEl.textContent = prop.title + (isPrimary ? ' [Primary Home]' : isOwned ? ' [Owned]' : ' · ₡' + prop.price);
          const subEl = document.createElement('span');
          subEl.textContent = prop.subtitle;
          card.appendChild(titleEl);
          card.appendChild(subEl);

          const btnRow = document.createElement('div');
          btnRow.style.display = 'flex';
          btnRow.style.gap = '6px';
          btnRow.style.marginTop = '6px';
          btnRow.style.flexWrap = 'wrap';

          if (!isOwned) {
            const buyBtn = document.createElement('button');
            buyBtn.type = 'button';
            buyBtn.className = 'world-dir-tab active';
            buyBtn.textContent = 'Buy Property (₡' + prop.price + ')';
            buyBtn.addEventListener('click', function () {
              if ((g.money || 0) < prop.price) {
                return g.toast('Need ₡' + prop.price + ' Crowns to purchase ' + prop.title + '.');
              }
              g.money -= prop.price;
              g.ownedProperties.push(prop.id);
              g.homePropertyId = prop.id;
              if (g.reputation) g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + 6);
              if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
              g.gossipLog.unshift({
                day: (g.world && g.world.day) || 1,
                text: 'Crown Dispatch Estates: Princess acquired deed to ' + prop.title + '!',
              });
              if (window.CrownSave) window.CrownSave.save(true);
              syncHud(playerCtrl.actor.root.position);
              g.toast('Congratulations! Purchased ' + prop.title + ' (+6 Clout)!');
              openRealEstateSheet();
            });
            btnRow.appendChild(buyBtn);
          } else if (!isPrimary) {
            const homeBtn = document.createElement('button');
            homeBtn.type = 'button';
            homeBtn.className = 'world-dir-tab';
            homeBtn.textContent = 'Set as Primary Home';
            homeBtn.addEventListener('click', function () {
              g.homePropertyId = prop.id;
              if (window.CrownSave) window.CrownSave.save(true);
              g.toast(prop.title + ' set as your Primary Residence!');
              openRealEstateSheet();
            });
            btnRow.appendChild(homeBtn);
          }

          const visitBtn = document.createElement('button');
          visitBtn.type = 'button';
          visitBtn.className = 'world-dir-tab';
          visitBtn.textContent = isOwned ? 'Go Home Here' : 'Tour Exterior';
          visitBtn.addEventListener('click', function () {
            closeActionSheet();
            floorMode = 'auto';
            btnFloorCutaway.textContent = 'Cutaway: Auto';
            btnFloorCutaway.classList.remove('active');
            playerCtrl.teleport(prop.x, prop.z, prop.yaw, prop.y);
            camCtrl.resetCamera(prop.yaw);
            syncHud(playerCtrl.actor.root.position);
          });
          btnRow.appendChild(visitBtn);

          card.appendChild(btnRow);
          actionList.appendChild(card);
        });
        actionOverlay.classList.add('open');
      }

      const ROYAL_EVENTS_CATALOG = [
        {
          id: 'state_dinner', title: 'Royal State Dinner Banquet', cost: 120,
          venue: 'West Royal Dining Salon (1F)', x: -13.0, y: 0.65, z: -24.5, yaw: Math.PI,
          clout: 5, scandal: 0, fun: 28, hunger: 35, composure: 16,
          headline: 'Candlelit State Dinner dazzled courtiers inside the Royal Dining Salon!',
        },
        {
          id: 'birthday_party', title: 'Princess Birthday Soirée', cost: 150,
          venue: 'Hall of Mirrors Crystal Ballroom', x: 0, y: 0.65, z: -23.0, yaw: Math.PI,
          clout: 7, scandal: 1, fun: 36, hunger: 20, composure: 20,
          headline: 'Champagne towers & birthday toasts echoed beneath the Hall of Mirrors!',
        },
        {
          id: 'grand_ball', title: 'Golden Chandelier Grand Royal Ball', cost: 220,
          venue: 'Grand Royal Ballroom (1F East)', x: 15.0, y: 0.65, z: -31.0, yaw: Math.PI,
          clout: 10, scandal: 0, fun: 40, hunger: 18, composure: 28,
          headline: 'Silk ballgowns & waltzes captivated high society at the Grand Royal Ball!',
        },
        {
          id: 'royal_wedding', title: 'Royal Wedding & Coronation Celebration', cost: 350,
          venue: 'Grand Ballroom Thrones (1F)', x: 15.0, y: 0.65, z: -30.5, yaw: Math.PI,
          clout: 15, scandal: 0, fun: 45, hunger: 25, composure: 32,
          headline: 'Bells rang across the Kingdom as guests celebrated a glittering Royal Wedding Gala!',
        },
        {
          id: 'family_gathering', title: 'Private Royal Family Tea Gathering', cost: 60,
          venue: 'Private Family Sitting Room (1F)', x: 16.0, y: 0.65, z: -22.5, yaw: Math.PI,
          clout: 4, scandal: -2, fun: 24, hunger: 22, composure: 18,
          headline: 'Warm laughter & pastries united the Royal Family in their private sitting room.',
        },
        {
          id: 'charity_gala', title: 'Kingdom Hearts & Charity Gala', cost: 140,
          venue: 'Kingdom Community Centre', x: 173.5, y: 0.12, z: 32.0, yaw: Math.PI,
          clout: 12, scandal: -4, fun: 26, hunger: 15, composure: 22,
          headline: 'Generous Kingdom Charity Gala raised Crowns for citizens across Riviera Town!',
        },
        {
          id: 'beach_party', title: 'Riviera Waterfront Sunset Party', cost: 160,
          venue: 'Paloma Beach Club & Shore', x: -35.5, y: 0.21, z: 54.4, yaw: 0,
          clout: 8, scandal: 2, fun: 38, hunger: 20, composure: 14,
          headline: 'Music & golden sunset lanterns illuminated Paloma Beach Club for a royal party!',
        },
      ];

      function openHostEventSheet() {
        actionTitle.textContent = 'Host Royal Party, Gala or Ceremony';
        actionList.innerHTML = '';
        ROYAL_EVENTS_CATALOG.forEach(function (ev) {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item';
          const tEl = document.createElement('strong');
          tEl.textContent = ev.title + ' (₡' + ev.cost + ')';
          const hEl = document.createElement('span');
          hEl.textContent = ev.venue + ' · +' + ev.clout + ' Clout, +' + ev.fun + ' Fun & summons guests';
          btn.appendChild(tEl);
          btn.appendChild(hEl);
          btn.addEventListener('click', function () {
            if ((g.money || 0) < ev.cost) {
              return g.toast('Need ₡' + ev.cost + ' Crowns to host ' + ev.title + '.');
            }
            closeActionSheet();
            g.money -= ev.cost;
            g.world.hostedEventsCount = (g.world.hostedEventsCount || 0) + 1;
            floorMode = 'auto';
            btnFloorCutaway.textContent = 'Cutaway: Auto';
            btnFloorCutaway.classList.remove('active');
            playerCtrl.teleport(ev.x, ev.z, ev.yaw, ev.y);
            camCtrl.resetCamera(ev.yaw);

            // Summon up to 5 friends/butlers/guests around the venue
            const guestPool = actors.filter(function (a) {
              return a.actorCategory === 'friend' || a.role === 'butler' || a.role === 'citizen';
            }).slice(0, 5);
            guestPool.forEach(function (guest, gi) {
              summonActorToPlayer(guest, {
                distance: 1.9 + (gi % 2) * 0.65,
                sideAngle: (gi - 2) * 0.72,
              });
            });

            if (window.CrownNeeds) {
              window.CrownNeeds.applyBoost({ fun: ev.fun, hunger: ev.hunger, composure: ev.composure });
            }
            if (!g.reputation) g.reputation = { clout: 50, scandal: 0, rank: 'Crown Heiress' };
            g.reputation.clout = Math.min(100, (g.reputation.clout || 50) + ev.clout);
            g.reputation.scandal = Math.max(0, Math.min(100, (g.reputation.scandal || 0) + ev.scandal));
            if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
            g.gossipLog.unshift({
              day: (g.world && g.world.day) || 1,
              text: 'Crown Dispatch Events: ' + ev.headline,
            });
            if (g.gossipLog.length > 24) g.gossipLog.length = 24;
            if (window.CrownSave) window.CrownSave.save(true);
            syncHud(playerCtrl.actor.root.position);
            g.toast('Hosted ' + ev.title + '! +' + ev.clout + ' Clout & guests arrived!');
          });
          actionList.appendChild(btn);
        });
        actionOverlay.classList.add('open');
      }

      const WEATHER_MODES = ['clear', 'sunset', 'rain', 'storm'];
      const WEATHER_LABELS = { clear: 'Clear Blue', sunset: 'Golden Sunset', rain: 'Coastal Rain', storm: 'Ocean Storm' };
      function setOceanWeather(mode) {
        if (!castle || typeof castle.setWeather !== 'function') return;
        const st = castle.setWeather(mode);
        lastSkyHr = -999;
        if (typeof btnWeather !== 'undefined' && btnWeather) {
          btnWeather.textContent = 'Ocean: ' + (WEATHER_LABELS[st.mode] || 'Clear');
          btnWeather.classList.toggle('active', st.mode !== 'clear');
        }
        g.toast('Riviera Ocean weather set to ' + (WEATHER_LABELS[st.mode] || st.mode) + '!');
      }

      const royalCommands = {
        summonActorToPlayer: summonActorToPlayer,
        serveMealInBed: serveMealInBed,
        cookForMe: cookForMe,
        serveChampagne: serveChampagne,
        summonMyCar: summonMyCar,
        dismissAllSummons: dismissAllSummons,
        triggerEmergency: triggerEmergencyEvent,
        openChauffeurRideSheet: openChauffeurRideSheet,
        openCarPassengersSheet: openCarPassengersSheet,
        openBoatCaptainSheet: openBoatCaptainSheet,
        openBoatPassengersSheet: openBoatPassengersSheet,
        setOceanWeather: setOceanWeather,
        openDiningPartnerSheet: openDiningPartnerSheet,
        callGroupToMeal: callGroupToMeal,
        openRealEstateSheet: openRealEstateSheet,
        openHostEventSheet: openHostEventSheet,
        cycleSecurityMode: cycleSecurityMode,
        cycleSeason: cycleSeason,
      };
      window.CrownCommands = royalCommands;
      applySeasonEffects(true);

      activityDoorBtn.addEventListener('click', function () {
        const tr = playerCtrl.getTransport();
        if (tr && tr.kind === 'car' && typeof playerCtrl.toggleCarDoors === 'function') {
          const nowOpen = playerCtrl.toggleCarDoors(tr.entity);
          activityDoorBtn.textContent = nowOpen ? 'Close Doors' : 'Open Doors';
          g.toast(nowOpen ? 'Car doors swung open!' : 'Car doors closed!');
        } else if (tr && tr.kind === 'boat') {
          if (tr.captainRoute && tr.captainRoute.active && typeof playerCtrl.takeBoatControl === 'function') {
            playerCtrl.takeBoatControl();
            g.toast('Took manual helm control from Captain Henri!');
            syncHud(playerCtrl.actor.root.position);
          } else if (typeof playerCtrl.setBoatReverse === 'function') {
            const rev = playerCtrl.setBoatReverse();
            g.toast(rev ? 'Reverse gear engaged!' : 'Forward gear engaged!');
            syncHud(playerCtrl.actor.root.position);
          }
        }
      });

      activityExtraBtn.addEventListener('click', function () {
        const tr = playerCtrl.getTransport();
        if (tr && tr.kind === 'car') {
          openCarPassengersSheet(tr.entity && tr.entity.id);
        } else if (tr && tr.kind === 'boat') {
          openBoatPassengersSheet(tr.entity && tr.entity.id);
        } else if (tr && tr.kind === 'horse') {
          tr.boost = !tr.boost;
          activityExtraBtn.textContent = tr.boost ? 'Canter: Fast' : 'Trot Pace';
          g.toast(tr.boost ? 'Galloping at full canter!' : 'Relaxed equestrian trot.');
        } else if (playerCtrl.isSwimming() && playerCtrl.actor.root.position.z >= 58.6 && typeof playerCtrl.setSwimMode === 'function') {
          const modesSwim = ['swim', 'snorkel', 'dive'];
          const curM = playerCtrl.getSwimMode ? playerCtrl.getSwimMode() : 'swim';
          const nxtM = modesSwim[(modesSwim.indexOf(curM) + 1) % modesSwim.length];
          playerCtrl.setSwimMode(nxtM);
          g.toast(nxtM === 'dive' ? 'Free-diving underwater!' : nxtM === 'snorkel' ? 'Snorkeling along the surface!' : 'Surface swimming!');
          syncHud(playerCtrl.actor.root.position);
        } else {
          const activeAct = interactMgr ? interactMgr.getActiveActivity() : null;
          if (activeAct && (activeAct.pose === 'sleep' || activeAct.pose === 'nap')) {
            serveMealInBed(null, activeAct);
          } else if (activeAct && activeAct.pose === 'eat' && (activeAct.partnerAnchor || activeAct.seats)) {
            openDiningPartnerSheet();
          }
        }
      });

      activityStopBtn.addEventListener('click', function () {
        releaseDiningGroup();
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

      function classifyActionSims4(act) {
        const idStr = ((act.id || '') + ' ' + (act.label || '') + ' ' + (act.pose || '')).toLowerCase();
        if (/swim|float|splash|ocean|pool|boat|row|yacht|bath|shower/.test(idStr)) {
          return { cat: 'swim', tag: 'Water & Ocean' };
        }
        if (/eat|meal|dine|cook|breakfast|feast|macaron|champagne|tea|espresso|bakery|pastry/.test(idStr)) {
          return { cat: 'meal', tag: 'Food & Drink' };
        }
        if (/flirt|kiss|romance|candle/.test(idStr)) {
          return { cat: 'romance', tag: 'Romance' };
        }
        if (/joke|play|dance|fun|game|party|carousel|toy|piano/.test(idStr)) {
          return { cat: 'funny', tag: 'Fun & Play' };
        }
        if (/drive|car|chauffeur|carpool|horse|ride|sleep|nap|sit|study|read/.test(idStr)) {
          return { cat: 'activity', tag: 'Activity' };
        }
        return { cat: 'friendly', tag: 'Social & Life' };
      }

      function openObjectSheet(target, backCategory) {
        if (!target || !interactMgr) return;
        if (target.kind === 'actor' && target.actor) {
          openNpcConversation(target.actor);
          return;
        }
        actionTitle.innerHTML = '<span class="s4-plumbob"></span>' + (target.title || 'Sims Action');
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
          walkBtn.className = 'world-action-item s4-card s4-cat-activity';
          const wTitle = document.createElement('strong');
          wTitle.textContent = 'Walk Over Here';
          const wHint = document.createElement('span');
          wHint.textContent = 'Go directly to ' + (target.title || 'location');
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

        const gridBox = document.createElement('div');
        gridBox.className = 's4-action-grid';
        actionList.appendChild(gridBox);

        (target.actions || []).forEach(function (act) {
          const cls = classifyActionSims4(act);
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'world-action-item s4-card s4-cat-' + cls.cat;
          const titleEl = document.createElement('strong');
          titleEl.textContent = act.label;
          const hintEl = document.createElement('span');
          hintEl.textContent = act.hint || '';
          const tagRow = document.createElement('div');
          tagRow.className = 's4-tag-row';
          const pill = document.createElement('span');
          pill.className = 's4-cat-pill';
          pill.textContent = cls.tag;
          tagRow.appendChild(pill);
          btn.appendChild(titleEl);
          btn.appendChild(hintEl);
          btn.appendChild(tagRow);
          btn.addEventListener('click', function () {
            closeActionSheet();
            floorMode = 'auto';
            btnFloorCutaway.textContent = 'Cutaway: Auto';
            btnFloorCutaway.classList.remove('active');
            interactMgr.runAction(act);
            camCtrl.resetCamera(playerCtrl.actor.root.rotation.y);
          });
          gridBox.appendChild(btn);
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
          { id: 'properties', label: 'Real Estate & Homes' },
          { id: 'schools', label: 'Schools & University' },
          { id: 'floors', label: '1F–7F Lifts' },
          { id: 'living', label: 'Salons & Theatre' },
          { id: 'bedrooms', label: '22 Bedrooms + Hotel' },
          { id: 'toilets', label: 'Baths & Pool' },
          { id: 'cottages', label: 'Houses, Villas & Cottages' },
          { id: 'gardens', label: 'Gardens & Cliffs' },
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
          if (cat === 'properties') {
            openRealEstateSheet();
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
            addCmdItem('Have Chauffeur Lucien Drive Me...', 'Pick any Palace, Montieri Hotel or Riviera destination while Lucien drives', function () {
              openChauffeurRideSheet();
            });
            addCmdItem('Carpool / Ride With Friends', 'Invite friends, family or neighbors to hop inside your car', function () {
              openCarPassengersSheet();
            });
            const curTrCmd = playerCtrl.getTransport();
            const nearWaterCmd = Boolean(
              (curTrCmd && curTrCmd.kind === 'boat') ||
              (castle.isNearWaterZone && castle.isNearWaterZone(playerCtrl.actor.root.position))
            );
            if (nearWaterCmd && typeof playerCtrl.setSwimwearPreferred === 'function') {
              const wearingSwim = Boolean(playerCtrl.isInSwimwear && playerCtrl.isInSwimwear());
              addCmdItem(
                wearingSwim ? 'Change Back Into Royal Outfit' : 'Wear Swimming Costume',
                wearingSwim ? 'Switch out of swimwear while poolside, on beach or yacht' : 'Put on your swimming costume for the pool, beach or yacht',
                function () {
                  playerCtrl.setSwimwearPreferred(!wearingSwim);
                  g.toast(!wearingSwim ? 'Changed into your swimming costume!' : 'Changed back into your outfit!');
                }
              );
            }
            addCmdItem('Sail Yacht w/ Captain Henri', 'Relax on bow sunbeds while Captain Henri sails to Islands or Sunset Cruise', function () {
              openBoatCaptainSheet('riviera_royal_yacht');
            });
            addCmdItem('Invite Friends Aboard Yacht', 'Board up to 4 friends on deck to lounge & sail across Riviera Bay', function () {
              openBoatPassengersSheet('riviera_royal_yacht');
            });
            addCmdItem('Go Boating w/ Friends (Cedar Rowboat)', 'Invite up to 2 friends into a Cedar Rowboat to paddle across Riviera Bay', function () {
              openBoatPassengersSheet('riviera_rowboat_west');
            });
            addCmdItem('Host Royal Event, Party or Wedding Gala', 'Throw a State Dinner, Birthday Party, Grand Ball, Charity Gala or Wedding', function () {
              openHostEventSheet();
            });
            addCmdItem('Royal Real Estate & Kingdom Properties', 'Buy beachfront villas, Belvedere Penthouse or set your primary home', function () {
              openRealEstateSheet();
            });
            addCmdItem('Cycle Estate Gate Security (' + (SECURITY_LABELS[(g.world && g.world.securityMode) || 'royal']) + ')', 'Switch Kingdom Gate Checkpoints between Public, Royal Court or Lockdown', function () {
              cycleSecurityMode();
            });
            addCmdItem('Cycle Kingdom Season (' + (SEASON_LABELS[getCurrentSeason()]) + ')', 'Switch between Spring, Summer, Autumn, Winter or Auto-Cycle', function () {
              cycleSeason();
            });
            addCmdItem('Cycle Ocean Weather (Clear / Sunset / Rain / Storm)', 'Change live waves, reflections, sunset light & coastal rain', function () {
              const curW = (castle.ocean && castle.ocean.weatherState && castle.ocean.weatherState.mode) || 'clear';
              const nxtW = WEATHER_MODES[(WEATHER_MODES.indexOf(curW) + 1) % WEATHER_MODES.length];
              setOceanWeather(nxtW);
            });
            addCmdItem('Visit Île d’Or Private Royal Island', 'Arrive on the sandy lagoon dock & sunset champagne pergola', function () {
              playerCtrl.teleport(62.0, 152.5, 0, 0.37);
              camCtrl.resetCamera(0);
              syncHud(playerCtrl.actor.root.position);
            });
            addCmdItem('Call Live Hospital ER Emergency', 'Trigger ambulance emergency arrival with ER doctors & nurses treating live', function () {
              triggerEmergencyEvent(true);
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

      const btnGoBeach = document.createElement('button');
      btnGoBeach.type = 'button';
      btnGoBeach.className = 'world-dock-btn';
      btnGoBeach.textContent = 'Riviera Yacht & Beach';
      btnGoBeach.addEventListener('click', function () {
        playerCtrl.teleport(-10.5, 58.6, 0, 0.26);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnGoIsland = document.createElement('button');
      btnGoIsland.type = 'button';
      btnGoIsland.className = 'world-dock-btn';
      btnGoIsland.textContent = 'Île d’Or Island';
      btnGoIsland.addEventListener('click', function () {
        playerCtrl.teleport(62.0, 152.5, 0, 0.37);
        floorMode = 'auto';
        btnFloorCutaway.textContent = 'Cutaway: Auto';
        btnFloorCutaway.classList.remove('active');
        camCtrl.resetCamera(0);
      });

      const btnWeather = document.createElement('button');
      btnWeather.type = 'button';
      btnWeather.className = 'world-dock-btn';
      btnWeather.textContent = 'Ocean: Clear Blue';
      btnWeather.addEventListener('click', function () {
        const curW = (castle.ocean && castle.ocean.weatherState && castle.ocean.weatherState.mode) || 'clear';
        const nxtW = WEATHER_MODES[(WEATHER_MODES.indexOf(curW) + 1) % WEATHER_MODES.length];
        setOceanWeather(nxtW);
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
      rowActions.appendChild(btnGoBeach);
      rowActions.appendChild(btnGoIsland);
      rowActions.appendChild(btnWeather);
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
        const sLbl = SEASON_LABELS[getCurrentSeason()] || 'Spring';
        setTextCached(timeSpan, 'time', 'Day ' + (g.world.day || 1) + ' · ' + sLbl + ' · ' + formatClock(g.world.hour || 10.5));
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
          if (tr.kind === 'car') {
            setExtraBtnDisplay('inline-block');
            setDoorBtnDisplay('inline-block');
            const cd = tr.entity && tr.entity.group && tr.entity.group.userData && tr.entity.group.userData.carDoors;
            setTextCached(activityDoorBtn, 'doorText', cd && cd.manualOpen ? 'Close Doors' : 'Open Doors');
            const passCount = Array.isArray(tr.passengers) ? tr.passengers.length : 0;
            const autoActive = Boolean(tr.chauffeur && tr.chauffeurRoute && tr.chauffeurRoute.active);
            const carStatus = autoActive
              ? ('Chauffeur Lucien → ' + (tr.chauffeurRoute.destTitle || 'Destination'))
              : (tr.chauffeur ? 'Chauffeur Parked' : 'Driving ' + (tr.entity.title || 'Car')) + (passCount ? (' · ' + passCount + ' w/ you') : '');
            setTextCached(activityText, 'actText', carStatus);
            setTextCached(activityExtraBtn, 'extraText', 'Ride w/ Friends');
            setTextCached(activityStopBtn, 'stopText', 'Exit Car');
            setHtmlCached(interactBtn, 'interactHtml', '<span>Park & Exit Car</span><span>Tap / E</span>');
          } else if (tr.kind === 'boat') {
            setDoorBtnDisplay('inline-block');
            setExtraBtnDisplay('inline-block');
            const capActive = Boolean(tr.captainRoute && tr.captainRoute.active);
            const boatPassCount = Array.isArray(tr.passengers) ? tr.passengers.length : 0;
            setTextCached(activityDoorBtn, 'doorText', capActive ? 'Take Helm' : (tr.reverseGear ? 'Gear: Reverse' : 'Gear: Forward'));
            setTextCached(activityExtraBtn, 'extraText', 'Friends (' + boatPassCount + ')');
            const boatVerb = capActive
              ? ('Captain Henri → ' + (tr.captainRoute.destTitle || 'Bay'))
              : (tr.entity && tr.entity.isYacht ? 'Piloting ' : 'Rowing ') + (tr.entity.title || 'Boat') + (tr.reverseGear ? ' [REV]' : '');
            setTextCached(activityText, 'actText', boatVerb + (boatPassCount ? (' · ' + boatPassCount + ' aboard') : ''));
            setTextCached(activityStopBtn, 'stopText', 'Dock & Disembark');
            setHtmlCached(interactBtn, 'interactHtml', '<span>Dock &amp; Disembark</span><span>Tap / E</span>');
          } else {
            setDoorBtnDisplay('none');
            setExtraBtnDisplay('inline-block');
            setTextCached(activityText, 'actText', 'Riding ' + (tr.entity.title || 'Steed'));
            setTextCached(activityExtraBtn, 'extraText', tr.boost ? 'Canter: Fast' : 'Trot Pace');
            setTextCached(activityStopBtn, 'stopText', 'Dismount');
            setHtmlCached(interactBtn, 'interactHtml', '<span>Dismount Horse</span><span>Tap / E</span>');
          }
          setBannerVisible(true);
          if (interactBtn.disabled) interactBtn.disabled = false;
          currentTarget = null;
          underwaterTintEl.classList.remove('visible');
          return;
        }

        setDoorBtnDisplay('none');
        if (activeAct) {
          const isInBed = activeAct.pose === 'sleep' || activeAct.pose === 'nap';
          const canDinePartner = activeAct.pose === 'eat' && Boolean(activeAct.partnerAnchor || activeAct.seats);
          setExtraBtnDisplay(isInBed || canDinePartner ? 'inline-block' : 'none');
          if (isInBed) {
            setTextCached(activityExtraBtn, 'extraText', 'Meal in Bed');
          } else if (canDinePartner) {
            setTextCached(activityExtraBtn, 'extraText', 'Call to Meal');
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
          underwaterTintEl.classList.toggle('visible', Boolean(playerCtrl.isUnderwater && playerCtrl.isUnderwater()));
          return;
        }

        if (swimmingNow) {
          const inOcean = pos.z >= 58.6;
          setExtraBtnDisplay(inOcean ? 'inline-block' : 'none');
          if (inOcean) {
            const sm = playerCtrl.getSwimMode ? playerCtrl.getSwimMode() : 'swim';
            setTextCached(activityExtraBtn, 'extraText', sm === 'dive' ? 'Mode: Dive' : sm === 'snorkel' ? 'Mode: Snorkel' : 'Mode: Swim');
          }
          underwaterTintEl.classList.toggle('visible', Boolean(playerCtrl.isUnderwater && playerCtrl.isUnderwater()));
          setTextCached(activityText, 'actText', (inOcean ? 'Swimming in Riviera Ocean' : 'Swimming in Pool') + ' — stick/WASD!');
          setTextCached(activityStopBtn, 'stopText', 'Exit Water');
          setBannerVisible(true);
          if (interactBtn.disabled) interactBtn.disabled = false;
          setHtmlCached(interactBtn, 'interactHtml', '<span>' + (inOcean ? 'Return to Shore/Dock' : 'Climb Out of Pool') + '</span><span>Tap / E</span>');
          currentTarget = null;
          return;
        }

        setExtraBtnDisplay('none');
        underwaterTintEl.classList.remove('visible');
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
        clearTimeout(activeCheckupTimer);
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

      const _stormSky = new THREE.Color(0x6b92bd);
      const _topStorm = new THREE.Color(0x304c75);
      const _envInfo = {
        sunDir: new THREE.Vector3(0.45, 0.72, 0.52).normalize(),
        skyColor: new THREE.Color(0x88c7f8),
        fogColor: new THREE.Color(0xcce4f8),
        fogDensity: 0.0014,
        moonMix: 0.0,
        sunsetMix: 0.0,
      };
      let npcFrameCount = 0;

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
        npcFrameCount = (npcFrameCount + 1) & 1023;

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

        // Day / Sunset / Night / Weather Cycle
        const prevDay = g.world.day || 1;
        g.world.hour = (g.world.hour || 10.5) + delta * 0.07 * (g.world.timeScale || 1);
        if (g.world.hour >= 24) {
          g.world.hour -= 24;
          g.world.day = prevDay + 1;
          if (window.CrownSave) window.CrownSave.grantAllowanceIfNewWeek(prevDay, g.world.day);
          applySeasonEffects(false);
        }

        const hr = g.world.hour;
        const curSeason = getCurrentSeason();
        const wState = (castle.ocean && castle.ocean.weatherState) || { mode: 'clear', stormDark: 0, sunsetMix: 0 };
        if (Math.abs(hr - lastSkyHr) > 0.003 || hr < lastSkyHr) {
          lastSkyHr = hr;
          let moonMix = 0.0;
          let sunsetMix = wState.sunsetMix || 0.0;
          if (wState.mode === 'sunset') {
            _curSky.copy(_sunsetSky);
            skyUniforms.uTopColor.value.copy(_topSunset);
            skyUniforms.uNightMix.value = 0.18;
            sunLight.intensity = 1.65;
            hemiLight.intensity = 0.92;
            _envInfo.sunDir.set(0.35, 0.24, 0.90).normalize();
            sunsetMix = 1.0;
          } else if (hr >= 6 && hr < 17) {
            _curSky.copy(_daySky);
            skyUniforms.uTopColor.value.copy(_topDay);
            skyUniforms.uNightMix.value = 0.0;
            sunLight.intensity = 2.08;
            hemiLight.intensity = 1.08;
            _envInfo.sunDir.set(0.45, 0.72, 0.52).normalize();
          } else if (hr >= 17 && hr < 20) {
            const t = (hr - 17) / 3;
            sunsetMix = Math.max(sunsetMix, Math.sin(t * Math.PI));
            _curSky.copy(_daySky).lerp(_sunsetSky, sunsetMix);
            skyUniforms.uTopColor.value.copy(_topDay).lerp(_topSunset, t);
            skyUniforms.uNightMix.value = t * 0.35;
            sunLight.intensity = 2.08 - t * 0.92;
            hemiLight.intensity = 0.98 - t * 0.32;
            _envInfo.sunDir.set(0.35, Math.max(0.18, 0.65 - t * 0.45), 0.75).normalize();
          } else {
            moonMix = 1.0;
            _curSky.copy(_nightSky);
            skyUniforms.uTopColor.value.copy(_topNight);
            skyUniforms.uNightMix.value = 1.0;
            sunLight.intensity = 0.72;
            hemiLight.intensity = 0.52;
            _envInfo.sunDir.set(-0.3, 0.55, 0.78).normalize();
          }
          if (wState.stormDark > 0.05) {
            _curSky.lerp(_stormSky, wState.stormDark * 0.68);
            skyUniforms.uTopColor.value.lerp(_topStorm, wState.stormDark * 0.65);
            sunLight.intensity *= (1.0 - wState.stormDark * 0.45);
          }
          if (curSeason === 'autumn') {
            _curSky.offsetHSL(-0.02, 0.04, -0.02);
          } else if (curSeason === 'winter') {
            _curSky.offsetHSL(0.01, -0.14, 0.03);
          } else if (curSeason === 'summer') {
            sunLight.intensity *= 1.05;
          }
          skyUniforms.uHorizonColor.value.copy(_curSky);
          scene.background.copy(_curSky);
          scene.fog.color.copy(_curSky);
          scene.fog.density = 0.0014 + (wState.stormDark || 0) * 0.0012 + (curSeason === 'winter' ? 0.0002 : 0);
          _envInfo.skyColor.copy(skyUniforms.uTopColor.value);
          _envInfo.fogColor.copy(_curSky);
          _envInfo.fogDensity = scene.fog.density;
          _envInfo.moonMix = moonMix;
          _envInfo.sunsetMix = sunsetMix;
        }

        castle.update(elapsed, pInfo.transport, pInfo.position, _envInfo);

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

        const insidePalaceNow = castle.isInsidePalace(pInfo.position);
        let visiblePalaceMaxFloor = 7;
        if (floorMode !== 'exterior' && !(floorMode === 'auto' && !insidePalaceNow)) {
          visiblePalaceMaxFloor =
            floorMode !== 'auto' && /^[1-7]f$/.test(floorMode)
              ? parseInt(floorMode.charAt(0), 10)
              : getPalaceFloorFromY(py);
        }
        const updateSkinFn = typeof playerCtrl.updateLivingSkin === 'function' ? playerCtrl.updateLivingSkin : null;

        // Autonomous Hospital ER Emergency Cycle (~78s cadence)
        if (emergencyActiveTimer > 0) {
          emergencyActiveTimer -= delta;
        } else {
          emergencyCooldown -= delta;
          if (emergencyCooldown <= 0) {
            emergencyCooldown = 78;
            if (Math.hypot(px - 79.6, pz - -21.0) < 62) {
              triggerEmergencyEvent(false);
            }
          }
        }

        // Release all seated dining companions cleanly if Princess stood up via WASD
        const curPlayerAct = interactMgr && typeof interactMgr.getActiveActivity === 'function' ? interactMgr.getActiveActivity() : null;
        if (activeDiningGroup.length && (!curPlayerAct || curPlayerAct.pose !== 'eat')) {
          releaseDiningGroup();
        }

        // Map any actors currently seated inside the active car or boat (Chauffeur/Captain/Passengers)
        const carOccupantsMap = {};
        if (pInfo.transport && pInfo.transport.kind === 'car' && pInfo.transport.entity && pInfo.transport.entity.group) {
          const trCar = pInfo.transport;
          const grpCar = trCar.entity.group;
          const cUd = grpCar.userData || {};
          const seatsMap = cUd.seats || {
            driver: { x: cUd.seatX || -0.35, y: cUd.seatY || 0.44, z: cUd.seatZ || -0.14 },
            frontPass: { x: 0.35, y: cUd.seatY || 0.44, z: cUd.seatZ || -0.14 },
            rearLeft: { x: -0.35, y: 0.42, z: -0.78 },
            rearRight: { x: 0.35, y: 0.42, z: -0.78 },
          };
          const cCos = Math.cos(grpCar.rotation.y);
          const cSin = Math.sin(grpCar.rotation.y);
          if (trCar.chauffeur && trCar.chauffeur.id) {
            carOccupantsMap[trCar.chauffeur.id] = { grp: grpCar, seat: seatsMap.driver, pose: 'drive', steer: trCar.steer, cos: cCos, sin: cSin, yOff: -0.28 };
          }
          if (Array.isArray(trCar.passengers)) {
            for (let pi = 0; pi < trCar.passengers.length; pi++) {
              const pass = trCar.passengers[pi];
              if (pass && pass.id && seatsMap[pass.seatKey]) {
                carOccupantsMap[pass.id] = { grp: grpCar, seat: seatsMap[pass.seatKey], pose: 'drive_passenger', steer: trCar.steer, cos: cCos, sin: cSin, yOff: -0.28 };
              }
            }
          }
        } else if (pInfo.transport && pInfo.transport.kind === 'boat' && pInfo.transport.entity && pInfo.transport.entity.group) {
          const trBoat = pInfo.transport;
          const grpBoat = trBoat.entity.group;
          const bUd = grpBoat.userData || {};
          const bSeats = bUd.seats || {
            captain: { x: 0, y: 2.25, z: -0.2 },
            sunbedL: { x: -0.78, y: 1.56, z: 3.1 },
            sunbedR: { x: 0.78, y: 1.56, z: 3.1 },
            loungeL: { x: -0.95, y: 1.48, z: -3.2 },
            loungeR: { x: 0.95, y: 1.48, z: -3.2 },
            stern: { x: 0, y: 0.46, z: -0.82 },
          };
          const bCos = Math.cos(grpBoat.rotation.y);
          const bSin = Math.sin(grpBoat.rotation.y);
          if (trBoat.captain && trBoat.captain.id) {
            const capSeat = bSeats.captain || bSeats.helm;
            if (capSeat) {
              carOccupantsMap[trBoat.captain.id] = { grp: grpBoat, seat: capSeat, pose: 'drive', steer: trBoat.steer, cos: bCos, sin: bSin, yOff: -0.16 };
            }
          }
          if (Array.isArray(trBoat.passengers)) {
            for (let pi = 0; pi < trBoat.passengers.length; pi++) {
              const pass = trBoat.passengers[pi];
              const pSeat = pass && (bSeats[pass.seatKey] || bSeats.stern || bSeats.loungeL);
              if (pass && pass.id && pSeat) {
                carOccupantsMap[pass.id] = { grp: grpBoat, seat: pSeat, pose: 'sofa', steer: 0, cos: bCos, sin: bSin, yOff: -0.16 };
              }
            }
          }
        }

        function resetNpcToUpright(actObj, keepProp) {
          const m = actObj && actObj.mesh;
          if (!m) return;
          if (m.rig) {
            m.rig.position.set(0, 0, 0);
            m.rig.rotation.set(0, 0, 0);
          }
          if (m.skirtMesh) {
            m.skirtMesh.rotation.set(0, 0, 0);
            m.skirtMesh.scale.set(1, 1, 1);
          }
          if (m.bodyGroup) {
            m.bodyGroup.position.y = m.baseLeg || 0.94;
            m.bodyGroup.rotation.set(0, 0, 0);
          }
          if (m.leftLeg) m.leftLeg.rotation.set(0, 0, 0);
          if (m.rightLeg) m.rightLeg.rotation.set(0, 0, 0);
          if (m.leftKnee) m.leftKnee.rotation.set(0, 0, 0);
          if (m.rightKnee) m.rightKnee.rotation.set(0, 0, 0);
          if (m.leftArm) m.leftArm.rotation.set(0, 0, 0);
          if (m.rightArm) m.rightArm.rotation.set(0, 0, 0);
          if (m.headGroup) m.headGroup.rotation.set(0, 0, 0);
          if (m.contactShadow) m.contactShadow.visible = true;
          if (!keepProp) setActorPropVisible(actObj, null);
        }

        // Natural Waypoint Pedestrian Walking + Arrival Pauses + Summoned Staff/Friends + Vehicle/Vessel Occupants + Work/Home Poses
        for (let actIdx = 0; actIdx < actors.length; actIdx++) {
          const act = actors[actIdx];
          const rootObj = act.mesh.root;
          const posNow = rootObj.position;
          const carSeatInfo = carOccupantsMap[act.id];

          if (carSeatInfo) {
            rootObj.visible = true;
            const sg = carSeatInfo.grp;
            const st = carSeatInfo.seat;
            const yOff = typeof carSeatInfo.yOff === 'number' ? carSeatInfo.yOff : -0.28;
            posNow.set(
              sg.position.x + st.x * carSeatInfo.cos + st.z * carSeatInfo.sin,
              sg.position.y + st.y + yOff,
              sg.position.z - st.x * carSeatInfo.sin + st.z * carSeatInfo.cos
            );
            rootObj.rotation.y = sg.rotation.y;
            if (window.CrownAnim) {
              const aBaseLeg = act.mesh.baseLeg || 0.94;
              window.CrownAnim.applyPose(act.mesh, carSeatInfo.pose, delta, elapsed + act.phase, {
                steer: carSeatInfo.steer || 0,
                rigOffsetY: -aBaseLeg * 0.58,
              });
              act.wasInPose = true;
            }
            if (updateSkinFn) updateSkinFn(act.mesh, elapsed + act.phase, null, false, 0);
            continue;
          }

          const sum = act.summon;
          const isSummoned = Boolean(sum && sum.active);

          if (!act.isTalking && !isSummoned) {
            const dxP = posNow.x - px;
            const dzP = posNow.z - pz;
            const distSqP = dxP * dxP + dzP * dzP;
            const actorInPalace = Math.abs(posNow.x) <= 30.8 && posNow.z <= -17.2 && posNow.z >= -38.8;
            const hiddenByCutaway = actorInPalace && getPalaceFloorFromY(typeof act.homeY === 'number' ? act.homeY : posNow.y) > visiblePalaceMaxFloor;
            const insideHotelNow = px >= 133.2 && px <= 152.4 && pz >= 3.5 && pz <= 16.1;
            const hiddenByHotelCutaway = typeof act.hotelFloor === 'number' && insideHotelNow && (
              (act.hotelFloor >= 3 && py < 7.2) || (act.hotelFloor >= 2 && py < 2.2)
            );
            const showActor = !hiddenByCutaway && !hiddenByHotelCutaway && distSqP <= 3364;
            if (rootObj.visible !== showActor) rootObj.visible = showActor;
            if (!showActor) continue;
            // Distant NPC cadence throttling on mobile/laptop so Redmi Note 13 Pro+ 5G stays smooth
            if (distSqP > 676 && ((actIdx + npcFrameCount) & 1) === 1 && !act.wasInPose) continue;
          } else if (!rootObj.visible) {
            rootObj.visible = true;
          }

          if (typeof act.mesh.setSwimwear === 'function') {
            const npcInPool = Boolean(castle.isInPool && castle.isInPool(posNow));
            if (npcInPool) {
              act.swimwearPreferred = true;
            } else if (!castle.isNearWaterZone || !castle.isNearWaterZone(posNow)) {
              act.swimwearPreferred = false;
            }
            act.mesh.setSwimwear(Boolean(npcInPool || act.swimwearPreferred));
          }

          if (act.isTalking) {
            const stPose = act.stationaryPose;
            const curWpPose = Array.isArray(act.waypoints) && act.waypoints.length >= 2 && (act.pauseTimer || 0) > 0
              ? (act.waypoints[(act.wpIndex - 1 + act.waypoints.length) % act.waypoints.length] || {}).workPose
              : null;
            const activeRestPose = (isSummoned && sum.arrived && sum.pose) || stPose || curWpPose;
            const keepRestingPose = Boolean(
              activeRestPose && (
                activeRestPose === 'sleep' || activeRestPose === 'nap' || activeRestPose === 'sit' ||
                activeRestPose === 'sofa' || activeRestPose === 'eat' || activeRestPose === 'eat_in_bed' ||
                activeRestPose === 'sit_read'
              )
            );
            if (keepRestingPose && window.CrownAnim) {
              window.CrownAnim.applyPose(act.mesh, activeRestPose, delta, elapsed + act.phase, { rigOffsetY: act.rigOffsetY });
              act.mesh.headGroup.rotation.x = Math.sin(elapsed * 2.1 + act.phase) * 0.06;
              act.mesh.headGroup.rotation.y = Math.sin(elapsed * 1.4 + act.phase) * 0.08;
              act.wasInPose = true;
              if (updateSkinFn) updateSkinFn(act.mesh, elapsed + act.phase, null, false, 0);
              continue;
            }
            if (act.wasInPose) {
              resetNpcToUpright(act, Boolean(isSummoned && sum.holdProp));
              act.wasInPose = false;
              posNow.y = castle.groundHeightAt(posNow.x, posNow.z, typeof act.homeY === 'number' ? act.homeY : posNow.y);
            }
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
              sum.waypoints = null;
              if (Math.hypot(sum.targetX - posNow.x, sum.targetZ - posNow.z) > 18 || Math.abs(posNow.y - py) > 2.2) {
                let fx = sum.targetX;
                let fz = sum.targetZ;
                if (typeof castle.resolveCollision === 'function') {
                  const fr = castle.resolveCollision(fx, fz, 0.28, py);
                  fx = fr.x;
                  fz = fr.z;
                }
                posNow.set(fx, py, fz);
              }
            } else {
              sum.timer -= delta;
              if (sum.timer <= 0) {
                act.summon = null;
                if (act.wasInPose) {
                  resetNpcToUpright(act, false);
                  act.wasInPose = false;
                } else {
                  setActorPropVisible(act, null);
                }
                posNow.y = castle.groundHeightAt(posNow.x, posNow.z, typeof act.homeY === 'number' ? act.homeY : 0);
                continue;
              }
            }

            let goalX = sum.targetX;
            let goalZ = sum.targetZ;
            let viaWaypoint = false;
            if (Array.isArray(sum.waypoints) && (sum.wpIdx || 0) < sum.waypoints.length) {
              const swp = sum.waypoints[sum.wpIdx || 0];
              if (Math.hypot(swp.x - posNow.x, swp.z - posNow.z) < 0.35) {
                sum.wpIdx = (sum.wpIdx || 0) + 1;
              }
              if ((sum.wpIdx || 0) < sum.waypoints.length) {
                goalX = sum.waypoints[sum.wpIdx || 0].x;
                goalZ = sum.waypoints[sum.wpIdx || 0].z;
                viaWaypoint = true;
              }
            }

            const sdx = goalX - posNow.x;
            const sdz = goalZ - posNow.z;
            const sDist = Math.hypot(sdx, sdz);
            const arrivedThreshold = viaWaypoint ? 0.25 : 0.34;
            if (sDist > arrivedThreshold || viaWaypoint) {
              sum.arrived = false;
              if (act.wasInPose) {
                resetNpcToUpright(act, Boolean(sum.holdProp));
                act.wasInPose = false;
              }
              const spd = (act.walkSpeed || 1.32) * (sum.follow ? 1.75 : 1.48);
              act.curSpeed = spd;
              const step = Math.min(Math.max(0.01, sDist), spd * delta);
              const baseAng = Math.atan2(sdx, sdz);
              let bestX = posNow.x + (sdx / Math.max(0.001, sDist)) * step;
              let bestZ = posNow.z + (sdz / Math.max(0.001, sDist)) * step;
              let chosenAng = baseAng;
              const nearFinalBed = !viaWaypoint && (typeof sum.yOverride === 'number' || sum.pose === 'sleep') && sDist < 1.55;
              if (typeof castle.resolveCollision === 'function') {
                const res = castle.resolveCollision(bestX, bestZ, 0.24, sum.targetY, {
                  prevX: posNow.x,
                  prevZ: posNow.z,
                  wallsOnly: nearFinalBed,
                });
                let moved = Math.hypot(res.x - posNow.x, res.z - posNow.z);
                bestX = res.x;
                bestZ = res.z;
                if (moved < step * 0.35 && !nearFinalBed) {
                  const steerOffsets = [0.78, -0.78, 1.35, -1.35, 1.75, -1.75];
                  for (let si = 0; si < steerOffsets.length; si++) {
                    const ang = baseAng + steerOffsets[si];
                    const cx = posNow.x + Math.sin(ang) * step;
                    const cz = posNow.z + Math.cos(ang) * step;
                    const sr = castle.resolveCollision(cx, cz, 0.24, sum.targetY, {
                      prevX: posNow.x,
                      prevZ: posNow.z,
                    });
                    const mDist = Math.hypot(sr.x - posNow.x, sr.z - posNow.z);
                    if (mDist > moved + 0.001) {
                      moved = mDist;
                      bestX = sr.x;
                      bestZ = sr.z;
                      chosenAng = ang;
                    }
                  }
                }
              }
              posNow.set(bestX, castle.groundHeightAt(bestX, bestZ, sum.targetY), bestZ);
              let yawDiff = ((chosenAng - rootObj.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
              if (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
              rootObj.rotation.y += yawDiff * Math.min(1, delta * 9.0);
              act.phase += delta * 6.0;
              if (window.CrownAnim) {
                window.CrownAnim.applyLocomotion(act.mesh, delta, act.phase, 1.0, 0, act.mesh.baseLeg || 0.94);
              } else {
                const swing = Math.sin(act.phase) * 0.38;
                act.mesh.leftLeg.rotation.x = swing;
                act.mesh.rightLeg.rotation.x = -swing;
                if (act.mesh.leftKnee) act.mesh.leftKnee.rotation.x = Math.max(0, Math.sin(act.phase + 0.45) * 0.3);
                if (act.mesh.rightKnee) act.mesh.rightKnee.rotation.x = Math.max(0, Math.sin(-act.phase + 0.45) * 0.3);
                act.mesh.leftArm.rotation.x = -swing * 0.6;
                act.mesh.rightArm.rotation.x = swing * 0.6;
              }
              if (sum.pose === 'serve') {
                act.mesh.rightArm.rotation.x = -1.18;
                act.mesh.rightArm.rotation.z = -0.14;
                act.mesh.leftArm.rotation.x = -0.35;
              }
            } else {
              sum.arrived = true;
              act.curSpeed = 0;
              if (!sum.firedArrive) {
                sum.firedArrive = true;
                if (typeof sum.onArrive === 'function') sum.onArrive();
              }
              if (typeof sum.yOverride === 'number' || sum.pose === 'sleep') {
                posNow.set(sum.targetX, sum.targetY, sum.targetZ);
              }
              rootObj.rotation.y = typeof sum.faceYaw === 'number' ? sum.faceYaw : Math.atan2(px - posNow.x, pz - posNow.z);
              act.mesh.leftLeg.rotation.x = 0;
              act.mesh.rightLeg.rotation.x = 0;
              if (window.CrownAnim && sum.pose && sum.pose !== 'converse') {
                window.CrownAnim.applyPose(act.mesh, sum.pose, delta, elapsed + act.phase, { rigOffsetY: sum.rigOffsetY });
                act.wasInPose = true;
              } else {
                if (act.wasInPose) {
                  resetNpcToUpright(act, Boolean(sum.holdProp));
                  act.wasInPose = false;
                }
                act.mesh.leftArm.rotation.x = -0.24 + Math.sin(elapsed * 2.2 + act.phase) * 0.08;
                act.mesh.rightArm.rotation.x = -0.32 + Math.cos(elapsed * 2.4 + act.phase) * 0.08;
                act.mesh.headGroup.rotation.y = Math.sin(elapsed * 1.1 + act.phase) * 0.1;
              }
            }
            if (updateSkinFn) updateSkinFn(act.mesh, elapsed + act.phase, null, false, sDist > arrivedThreshold || viaWaypoint ? 1 : 0);
            continue;
          }

          const nearDetail = (posNow.x - px) * (posNow.x - px) + (posNow.z - pz) * (posNow.z - pz) <= 1156;

          if (!Array.isArray(act.waypoints) || act.waypoints.length < 2 || act.patrolR <= 0) {
            if (act.stationaryPose && window.CrownAnim) {
              const curActIdStr = curPlayerAct && curPlayerAct.id ? curPlayerAct.id : '';
              const vacatedByPlayer = Boolean(
                act.occupiesSpotId && act.vacatePos && curActIdStr.indexOf(act.occupiesSpotId) === 0
              );
              if (vacatedByPlayer) {
                if (act.wasInPose) {
                  resetNpcToUpright(act, false);
                  act.wasInPose = false;
                }
                posNow.set(act.vacatePos.x, act.vacatePos.y, act.vacatePos.z);
                rootObj.rotation.y = act.vacatePos.yaw || 0;
                window.CrownAnim.applyLocomotion(act.mesh, delta, elapsed + act.phase, 0, 0, act.mesh.baseLeg || 0.94);
              } else {
                posNow.set(act.homeX, act.homeY, act.homeZ);
                rootObj.rotation.y = act.stationaryYaw || 0;
                window.CrownAnim.applyPose(act.mesh, act.stationaryPose, delta, elapsed + act.phase, {
                  rigOffsetY: act.rigOffsetY,
                });
                act.wasInPose = true;
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
            const curActStr = curPlayerAct && curPlayerAct.id ? curPlayerAct.id : '';
            const wpBlockedByPlayer = Boolean(prevWp && prevWp.lockSpotId && curActStr.indexOf(prevWp.lockSpotId) === 0);
            if (prevWp && typeof prevWp.faceYaw === 'number' && !wpBlockedByPlayer) {
              let fDiff = ((prevWp.faceYaw - rootObj.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
              if (fDiff < -Math.PI) fDiff += Math.PI * 2;
              rootObj.rotation.y += fDiff * Math.min(1, delta * 6.5);
            }
            if (prevWp && prevWp.workPose && window.CrownAnim && !wpBlockedByPlayer) {
              if (typeof prevWp.yOverride === 'number') {
                posNow.set(prevWp.x, prevWp.yOverride, prevWp.z);
              }
              window.CrownAnim.applyPose(act.mesh, prevWp.workPose, delta, elapsed + act.phase, { rigOffsetY: prevWp.rigOffsetY });
              act.wasInPose = true;
              if (nearDetail && updateSkinFn) {
                updateSkinFn(act.mesh, elapsed + act.phase, null, false, 0);
              }
              continue;
            } else {
              if (act.wasInPose) {
                resetNpcToUpright(act, false);
                act.wasInPose = false;
              } else {
                setActorPropVisible(act, null);
              }
              act.mesh.headGroup.rotation.x = Math.sin(elapsed * 1.1 + act.phase) * 0.04;
              act.mesh.headGroup.rotation.y = Math.sin(elapsed * 0.8 + act.phase) * 0.16;
            }
          } else {
            if (act.wasInPose) {
              resetNpcToUpright(act, false);
              act.wasInPose = false;
              posNow.y = castle.groundHeightAt(posNow.x, posNow.z, baseY);
            } else if (prevWp && typeof prevWp.yOverride === 'number') {
              posNow.y = castle.groundHeightAt(posNow.x, posNow.z, baseY);
            }
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

              const nearFurnitureTarget =
                (typeof targetWp.yOverride === 'number' && dist < 1.55) ||
                (prevWp && typeof prevWp.yOverride === 'number' && Math.hypot(posNow.x - prevWp.x, posNow.z - prevWp.z) < 1.55);

              if (typeof castle.resolveCollision === 'function') {
                const resolved = castle.resolveCollision(nx, nz, 0.26, baseY, {
                  prevX: posNow.x,
                  prevZ: posNow.z,
                  wallsOnly: nearFurnitureTarget,
                });
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

          if (window.CrownAnim) {
            if (spdNorm > 0.04) {
              act.phase += delta * (4.35 * Math.max(0.45, spdNorm));
            }
            window.CrownAnim.applyLocomotion(act.mesh, delta, act.phase, spdNorm, 0, act.mesh.baseLeg || 0.94);
          } else if (spdNorm > 0.04) {
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
