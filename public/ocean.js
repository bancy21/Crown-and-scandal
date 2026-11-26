(function () {
  'use strict';

  function smoothstepJS(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / Math.max(0.0001, edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  // Shared ocean coordinates & island geography (used by GLSL, physics, buoys & docking)
  const ISLAND_DOR = { x: 62, z: 168, r: 15.8, dockX: 62, dockZ: 150.5, dockW: 4.8, dockD: 9.2 };
  const ISLAND_LIGHT = { x: -74, z: 156, r: 14.5, dockX: -62, dockZ: 145.0, dockW: 7.4, dockD: 4.2 };
  const CORAL_REEF = { x: 122, z: 78, r: 13.5 };
  const MARINA = { minX: -25.5, maxX: -4.2, minZ: 53.5, maxZ: 70.5 };
  const BEACH_CLUB = { x: -37.5, z: 54.4, minX: -45.5, maxX: -29.5, minZ: 51.8, maxZ: 58.6 };

  function getWaterDepth(x, z) {
    // Negative / zero = dry shore, Marina pier, or Island interior; Positive = depth in meters (0..4.5)
    if (z <= 58.5) return 0.0;
    // Central Yacht Pier
    if (Math.abs(x) <= 2.75 && z <= 67.2) return 0.0;
    // Marina Timber Boardwalk & Slips
    if (x >= -24.5 && x <= -5.2 && z <= 59.6) return 0.0;
    if ((Math.abs(x - -22.0) <= 1.15 || Math.abs(x - -13.5) <= 1.15 || Math.abs(x - -6.5) <= 1.15) && z <= 70.2) {
      return 0.0;
    }
    // Île d'Or Landing Dock & Island
    if (Math.abs(x - ISLAND_DOR.dockX) <= 2.3 && z >= 145.6 && z <= 156.5) return 0.0;
    const dDor = Math.hypot(x - ISLAND_DOR.x, z - ISLAND_DOR.z);
    if (dDor < ISLAND_DOR.r - 1.2) return 0.0;

    // Lighthouse Isle Dock & Island
    if (x >= -67.5 && x <= -57.2 && Math.abs(z - ISLAND_LIGHT.dockZ) <= 2.0) return 0.0;
    const dLight = Math.hypot(x - ISLAND_LIGHT.x, z - ISLAND_LIGHT.z);
    if (dLight < ISLAND_LIGHT.r - 1.2) return 0.0;

    // Base depth gradient from shoreline (z = 58.5) offshore
    let baseDepth = smoothstepJS(58.5, 86.0, z) * 4.2 + 0.16;

    // Shallow turquoise reef shelves around islands & eastern coral cove
    if (dDor < ISLAND_DOR.r + 16.0) {
      const sDor = smoothstepJS(ISLAND_DOR.r - 1.2, ISLAND_DOR.r + 16.0, dDor);
      baseDepth = Math.min(baseDepth, 0.25 + sDor * 3.8);
    }
    if (dLight < ISLAND_LIGHT.r + 15.0) {
      const sLight = smoothstepJS(ISLAND_LIGHT.r - 1.2, ISLAND_LIGHT.r + 15.0, dLight);
      baseDepth = Math.min(baseDepth, 0.25 + sLight * 3.8);
    }
    const dReef = Math.hypot(x - CORAL_REEF.x, z - CORAL_REEF.z);
    if (dReef < CORAL_REEF.r + 10.0) {
      const sReef = smoothstepJS(4.0, CORAL_REEF.r + 10.0, dReef);
      baseDepth = Math.min(baseDepth, 0.72 + sReef * 3.1);
    }
    return baseDepth;
  }

  // Synchronized CPU wave height matching GLSL vertex displacement
  function getWaveHeight(x, z, t, waveScale) {
    const amp = typeof waveScale === 'number' ? waveScale : 1.0;
    const shoreAtten = smoothstepJS(58.6, 67.0, z);
    const w1 = Math.sin(x * 0.11 + z * 0.08 + t * 1.45) * 0.14;
    const w2 = Math.cos(x * 0.17 - z * 0.13 + t * 1.15) * 0.095;
    const w3 = Math.sin(z * 0.24 - t * 1.85) * 0.065;
    return (w1 + w2 + w3) * amp * (0.28 + 0.72 * shoreAtten);
  }

  function buildOceanWorld(scene, renderer, opts) {
    const THREE = window.THREE;
    if (!THREE || !scene) return null;

    const cfg = opts || {};
    const isSoftwareGl = Boolean(cfg.isSoftwareGl);
    const isLow = isSoftwareGl || Boolean(cfg.isLowQuality);
    const registerSpot = typeof cfg.registerSpot === 'function' ? cfg.registerSpot : function () {};
    const tagInteractable = typeof cfg.tagInteractable === 'function' ? cfg.tagInteractable : function () {};

    const oceanGroup = new THREE.Group();
    oceanGroup.userData.noMerge = true;
    oceanGroup.userData.noFreeze = true;
    scene.add(oceanGroup);

    const weatherState = {
      mode: 'clear', // 'clear' | 'sunset' | 'rain' | 'storm'
      waveAmp: 1.0,
      rainMix: 0.0,
      stormDark: 0.0,
      sunsetMix: 0.0,
    };

    // -----------------------------------------------------------
    // 1. RICH NATURAL BLUE MEDITERRANEAN GLSL OCEAN SHADER
    // -----------------------------------------------------------
    const oceanUniforms = {
      uTime: { value: 0 },
      uWaveAmp: { value: 1.0 },
      uRainMix: { value: 0.0 },
      uStormDark: { value: 0.0 },
      uMoonMix: { value: 0.0 },
      uSunsetMix: { value: 0.0 },
      uSunDir: { value: new THREE.Vector3(0.45, 0.72, 0.52).normalize() },
      uSunColor: { value: new THREE.Color(0xfff4d8) },
      uSkyColor: { value: new THREE.Color(0x88c7f8) },
      uFogColor: { value: new THREE.Color(0xcce4f8) },
      uFogDensity: { value: 0.0016 },
      uBoatWake: { value: new THREE.Vector4(0, 200, 0, 0) },
    };

    const oceanVertexShader = [
      'uniform float uTime;',
      'uniform float uWaveAmp;',
      'uniform vec4 uBoatWake;',
      'varying vec3 vWorldPos;',
      'varying float vWaveH;',
      'void main() {',
      '  vec4 wp = modelMatrix * vec4(position, 1.0);',
      '  float shoreAtten = smoothstep(58.4, 67.0, wp.z);',
      '  float t = uTime;',
      '  float w1 = sin(wp.x * 0.11 + wp.z * 0.08 + t * 1.45) * 0.14;',
      '  float w2 = cos(wp.x * 0.17 - wp.z * 0.13 + t * 1.15) * 0.095;',
      '  float w3 = sin(wp.z * 0.24 - t * 1.85) * 0.065;',
      '  float w4 = sin((wp.x + wp.z) * 0.36 + t * 2.35) * 0.03;',
      '  float h = (w1 + w2 + w3 + w4) * uWaveAmp * (0.28 + 0.72 * shoreAtten);',
      '  // Subtle bow/stern wake ridge near moving vessel',
      '  if (uBoatWake.w > 0.4) {',
      '    vec2 rel = wp.xz - uBoatWake.xy;',
      '    float cs = cos(uBoatWake.z);',
      '    float sn = sin(uBoatWake.z);',
      '    vec2 localB = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs);',
      '    if (localB.y < 3.0 && localB.y > -28.0) {',
      '      float spread = abs(localB.x) - (-localB.y * 0.34 + 1.4);',
      '      float wakeMask = exp(-spread * spread * 0.35) * smoothstep(-28.0, -2.0, localB.y);',
      '      h += wakeMask * sin(localB.y * 1.4 - t * 6.5) * 0.08 * min(1.0, uBoatWake.w * 0.12);',
      '    }',
      '  }',
      '  wp.y += h;',
      '  vWaveH = h;',
      '  vWorldPos = wp.xyz;',
      '  gl_Position = projectionMatrix * viewMatrix * wp;',
      '}',
    ].join('\n');

    const oceanFragmentShader = [
      'uniform float uTime;',
      'uniform float uWaveAmp;',
      'uniform float uRainMix;',
      'uniform float uStormDark;',
      'uniform float uMoonMix;',
      'uniform float uSunsetMix;',
      'uniform vec3 uSunDir;',
      'uniform vec3 uSunColor;',
      'uniform vec3 uSkyColor;',
      'uniform vec3 uFogColor;',
      'uniform float uFogDensity;',
      'uniform vec4 uBoatWake;',
      'varying vec3 vWorldPos;',
      'varying float vWaveH;',
      '',
      'float coastDepth(vec2 xz) {',
      '  float dCoast = smoothstep(58.2, 85.0, xz.y);',
      '  float dDor = length(xz - vec2(62.0, 168.0));',
      '  float nearDor = smoothstep(14.5, 31.0, dDor);',
      '  float dLight = length(xz - vec2(-74.0, 156.0));',
      '  float nearLight = smoothstep(13.2, 29.0, dLight);',
      '  float dReef = length(xz - vec2(122.0, 78.0));',
      '  float nearReef = smoothstep(4.0, 22.0, dReef);',
      '  float depth = min(dCoast, min(nearDor, nearLight));',
      '  depth = min(depth, 0.16 + nearReef * 0.84);',
      '  return clamp(depth, 0.0, 1.0);',
      '}',
      '',
      'void main() {',
      '  vec2 p = vWorldPos.xz;',
      '  float t = uTime;',
      '  float depth = coastDepth(p);',
      '',
      '  // Rich multi-layered animated water normal for crisp sky/sun reflections',
      '  float r1 = sin(p.x * 0.65 + p.y * 0.48 + t * 2.4) * 0.09;',
      '  float r2 = cos(p.x * 1.15 - p.y * 0.92 + t * 3.1) * 0.06;',
      '  float r3 = sin(p.x * 2.1 + p.y * 1.8 - t * 4.0) * 0.035;',
      '  float r4 = cos(p.x * 0.28 + p.y * 0.32 + t * 1.55) * 0.11;',
      '  float rainRip = uRainMix * sin(length(fract(p * 0.35) - 0.5) * 28.0 - t * 9.0) * 0.07;',
      '  vec3 N = normalize(vec3(',
      '    (r1 + r2 + r3 + r4 + rainRip) * (0.75 + uWaveAmp * 0.32),',
      '    1.0,',
      '    (r2 - r1 * 0.8 + r3 * 0.9 + rainRip) * (0.75 + uWaveAmp * 0.32)',
      '  ));',
      '',
      '  vec3 V = normalize(cameraPosition - vWorldPos);',
      '  float NoV = clamp(dot(N, V), 0.02, 1.0);',
      '  float fresnel = pow(1.0 - NoV, 3.6);',
      '',
      '  // STRICT NATURAL BLUE PALETTE (Turquoise shallows -> Royal Azure -> Deep Mediterranean Sapphire)',
      '  vec3 colShallow = vec3(0.04, 0.77, 0.94);',
      '  vec3 colAzure   = vec3(0.015, 0.49, 0.84);',
      '  vec3 colDeep    = vec3(0.012, 0.21, 0.56);',
      '',
      '  // Storm shifts deep water to rich cobalt-indigo (never muddy grey/brown/green)',
      '  colShallow = mix(colShallow, vec3(0.05, 0.58, 0.78), uStormDark * 0.55);',
      '  colAzure   = mix(colAzure,   vec3(0.015, 0.34, 0.68), uStormDark * 0.65);',
      '  colDeep    = mix(colDeep,    vec3(0.01,  0.14, 0.42), uStormDark * 0.65);',
      '',
      '  // Night deepens blue richly while keeping azure identity',
      '  colShallow = mix(colShallow, vec3(0.03, 0.42, 0.68), uMoonMix * 0.65);',
      '  colAzure   = mix(colAzure,   vec3(0.015, 0.24, 0.54), uMoonMix * 0.70);',
      '  colDeep    = mix(colDeep,    vec3(0.008, 0.11, 0.34), uMoonMix * 0.72);',
      '',
      '  vec3 waterBody = mix(colShallow, colAzure, smoothstep(0.02, 0.34, depth));',
      '  waterBody = mix(waterBody, colDeep, smoothstep(0.28, 0.88, depth));',
      '',
      '  // Shallow sunlit caustic sparkle near beach & coral reefs',
      '  float caustic = pow(max(0.0, sin(p.x * 1.3 + t * 2.1) * cos(p.y * 1.3 - t * 1.7)), 3.0);',
      '  waterBody += vec3(0.10, 0.38, 0.44) * caustic * (1.0 - smoothstep(0.0, 0.36, depth)) * (1.0 - uMoonMix * 0.75);',
      '',
      '  // Fresnel sky reflection (clean blue day, warm amber-gold sunset, cool silver-blue night)',
      '  vec3 dayRefl = mix(vec3(0.20, 0.66, 0.96), uSkyColor, 0.55);',
      '  vec3 sunsetRefl = vec3(0.98, 0.66, 0.40);',
      '  vec3 nightRefl = vec3(0.14, 0.30, 0.58);',
      '  vec3 skyRefl = mix(dayRefl, sunsetRefl, uSunsetMix * 0.78);',
      '  skyRefl = mix(skyRefl, nightRefl, uMoonMix);',
      '  vec3 col = mix(waterBody, skyRefl, clamp(fresnel * 0.74 + 0.05, 0.0, 0.82));',
      '',
      '  // Sunlight / Sunset / Moonlight sparkling glitter path',
      '  vec3 L = normalize(uSunDir);',
      '  vec3 H = normalize(L + V);',
      '  float specBroad = pow(max(dot(N, H), 0.0), 42.0) * 0.42;',
      '  float specGlint = pow(max(dot(N, H), 0.0), 260.0) * 1.45;',
      '  vec3 glintCol = mix(uSunColor, vec3(1.0, 0.78, 0.42), uSunsetMix * 0.85);',
      '  glintCol = mix(glintCol, vec3(0.76, 0.88, 1.0), uMoonMix);',
      '  col += glintCol * (specBroad + specGlint) * (1.0 - uStormDark * 0.68);',
      '',
      '  // Animated crisp coastal & island shoreline surf foam + storm whitecaps',
      '  float shoreWave = sin(p.x * 0.35 + t * 2.1) * 0.025 + sin(t * 2.5 - depth * 28.0) * 0.025;',
      '  float shoreFoam = (1.0 - smoothstep(0.0, 0.085, depth + shoreWave)) * smoothstep(57.8, 59.0, p.y);',
      '  float crestFoam = smoothstep(0.19, 0.36, vWaveH) * (0.22 + 0.78 * uStormDark);',
      '  float wakeFoam = 0.0;',
      '  if (uBoatWake.w > 0.5) {',
      '    vec2 rel = p - uBoatWake.xy;',
      '    float cs = cos(uBoatWake.z);',
      '    float sn = sin(uBoatWake.z);',
      '    vec2 localB = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs);',
      '    if (localB.y < 2.2 && localB.y > -26.0) {',
      '      float spread = abs(localB.x) - (-localB.y * 0.28 + 1.05);',
      '      float edgeLine = exp(-spread * spread * 1.4) + 0.45 * exp(-localB.x * localB.x * 0.6);',
      '      wakeFoam = edgeLine * smoothstep(-26.0, -1.0, localB.y) * smoothstep(2.4, -1.2, localB.y) * min(1.0, uBoatWake.w * 0.14);',
      '    }',
      '  }',
      '  float totalFoam = clamp(shoreFoam * 0.88 + crestFoam * 0.55 + wakeFoam * 0.72, 0.0, 0.92);',
      '  vec3 foamColor = mix(vec3(0.90, 0.98, 1.0), vec3(1.0, 0.93, 0.84), uSunsetMix * 0.5);',
      '  foamColor = mix(foamColor, vec3(0.75, 0.87, 0.98), uMoonMix * 0.7);',
      '  col = mix(col, foamColor, totalFoam);',
      '',
      '  // Crystal-clear semi-transparency right along shallow sandy beaches so seabed shows through',
      '  float alpha = mix(0.74, 0.97, smoothstep(0.0, 0.22, depth));',
      '  alpha = max(alpha, totalFoam);',
      '',
      '  // Match scene exponential squared fog smoothly toward horizon',
      '  float dist = length(cameraPosition - vWorldPos);',
      '  float fogFactor = 1.0 - exp(-uFogDensity * uFogDensity * dist * dist);',
      '  col = mix(col, uFogColor, clamp(fogFactor, 0.0, 1.0));',
      '',
      '  gl_FragColor = vec4(col, alpha);',
      '}',
    ].join('\n');

    const oceanMat = new THREE.ShaderMaterial({
      uniforms: oceanUniforms,
      vertexShader: oceanVertexShader,
      fragmentShader: oceanFragmentShader,
      transparent: true,
      depthWrite: true,
    });

    // Near high-detail LOD ocean plane + seamless Far Horizon skirt
    const nearSegX = isLow ? 56 : 104;
    const nearSegZ = isLow ? 34 : 58;
    const nearGeo = new THREE.PlaneGeometry(640, 260, nearSegX, nearSegZ);
    nearGeo.rotateX(-Math.PI / 2);
    const nearOceanMesh = new THREE.Mesh(nearGeo, oceanMat);
    nearOceanMesh.position.set(0, -0.35, 186);
    nearOceanMesh.frustumCulled = false;
    oceanGroup.add(nearOceanMesh);

    const farOceanMat = oceanMat.clone();
    farOceanMat.uniforms = oceanUniforms; // share live uniforms with zero extra uniform upload work
    const farGeo = new THREE.PlaneGeometry(1280, 760, 16, 12);
    farGeo.rotateX(-Math.PI / 2);
    const farOceanMesh = new THREE.Mesh(farGeo, farOceanMat);
    farOceanMesh.position.set(0, -0.44, 436);
    farOceanMesh.frustumCulled = false;
    oceanGroup.add(farOceanMesh);

    // -----------------------------------------------------------
    // 2. UNDERWATER SEABED, CORAL REEFS & TROPICAL FISH SCHOOLS
    // -----------------------------------------------------------
    const seabedGeo = new THREE.PlaneGeometry(640, 260, 56, 30);
    seabedGeo.rotateX(-Math.PI / 2);
    const sbPos = seabedGeo.attributes.position;
    const sbColors = new Float32Array(sbPos.count * 3);
    const cSand = new THREE.Color(0xe6d6ad);
    const cTurqBed = new THREE.Color(0x289fb8);
    const cDeepBed = new THREE.Color(0x0a3875);
    const _tmpC = new THREE.Color();

    for (let i = 0; i < sbPos.count; i++) {
      const wx = sbPos.getX(i);
      const wz = sbPos.getZ(i) + 186;
      const depth = getWaterDepth(wx, wz);
      const yBed = depth <= 0.01 ? -0.42 : -0.42 - Math.min(4.4, depth);
      sbPos.setY(i, yBed);
      if (depth < 0.85) {
        _tmpC.copy(cSand).lerp(cTurqBed, depth / 0.85);
      } else {
        _tmpC.copy(cTurqBed).lerp(cDeepBed, Math.min(1, (depth - 0.85) / 3.4));
      }
      sbColors[i * 3] = _tmpC.r;
      sbColors[i * 3 + 1] = _tmpC.g;
      sbColors[i * 3 + 2] = _tmpC.b;
    }
    seabedGeo.setAttribute('color', new THREE.BufferAttribute(sbColors, 3));
    seabedGeo.computeVertexNormals();
    const seabedMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.02,
    });
    const seabedMesh = new THREE.Mesh(seabedGeo, seabedMat);
    seabedMesh.position.set(0, 0, 186);
    seabedMesh.receiveShadow = true;
    oceanGroup.add(seabedMesh);

    // Instanced Underwater Coral & Reef Rocks around Cove d'Azur, Île d'Or Lagoon & Lighthouse Cove
    const coralZones = [
      { cx: 122, cz: 78, r: 10 },
      { cx: 52, cz: 152, r: 9 },
      { cx: -64, cz: 148, r: 8 },
      { cx: 24, cz: 72, r: 7 },
    ];
    const coralCount = isLow ? 36 : 68;
    const coralGeo = new THREE.DodecahedronGeometry(0.42, 0);
    const coralMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.65, metalness: 0.04 });
    const coralInst = new THREE.InstancedMesh(coralGeo, coralMat, coralCount);
    const coralPalette = [0xff6b8b, 0xff9f43, 0x1dd1a1, 0xa29bfe, 0x48dbfb, 0xf368e0];
    const _dummyM = new THREE.Object3D();
    for (let ci = 0; ci < coralCount; ci++) {
      const zc = coralZones[ci % coralZones.length];
      const ang = ((ci * 137.5) % 360) * (Math.PI / 180);
      const rad = 2.0 + ((ci * 7.3) % zc.r);
      const cx = zc.cx + Math.cos(ang) * rad;
      const cz = zc.cz + Math.sin(ang) * rad;
      const dBed = getWaterDepth(cx, cz);
      const cy = dBed > 0.1 ? -0.45 - Math.min(3.5, dBed) + 0.15 : -0.65;
      _dummyM.position.set(cx, cy, cz);
      _dummyM.rotation.set((ci % 5) * 0.2, ang, (ci % 3) * 0.2);
      const s = 0.7 + (ci % 4) * 0.35;
      _dummyM.scale.set(s, s * (0.8 + (ci % 3) * 0.45), s);
      _dummyM.updateMatrix();
      coralInst.setMatrixAt(ci, _dummyM.matrix);
      _tmpC.setHex(coralPalette[ci % coralPalette.length]);
      coralInst.setColorAt(ci, _tmpC);
    }
    coralInst.instanceMatrix.needsUpdate = true;
    if (coralInst.instanceColor) coralInst.instanceColor.needsUpdate = true;
    coralInst.computeBoundingSphere();
    oceanGroup.add(coralInst);

    // Instanced Swimming Tropical Fish Schools
    const fishCount = isLow ? 28 : 54;
    const fishGeo = new THREE.ConeGeometry(0.11, 0.42, 5);
    fishGeo.rotateX(Math.PI * 0.5);
    const fishMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.25 });
    const fishInst = new THREE.InstancedMesh(fishGeo, fishMat, fishCount);
    fishInst.frustumCulled = false;
    const fishSeeds = [];
    const fishColors = [0xffbe0b, 0x00bbf9, 0xf15bb5, 0x00f5d4, 0xff7b54];
    for (let fi = 0; fi < fishCount; fi++) {
      const zc = coralZones[fi % coralZones.length];
      fishSeeds.push({
        cx: zc.cx,
        cz: zc.cz,
        r: 3.2 + (fi % 7) * 1.15,
        spd: (fi % 2 === 0 ? 1 : -1) * (0.35 + (fi % 5) * 0.08),
        phase: fi * 0.73,
        depth: -0.78 - (fi % 4) * 0.32,
      });
      _tmpC.setHex(fishColors[fi % fishColors.length]);
      fishInst.setColorAt(fi, _tmpC);
    }
    if (fishInst.instanceColor) fishInst.instanceColor.needsUpdate = true;
    oceanGroup.add(fishInst);

    // -----------------------------------------------------------
    // 3. MARINA, PALOMA BEACH CLUB, CLIFFS, COVES & PRIVATE ISLANDS
    // -----------------------------------------------------------
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xf1dcaf, roughness: 0.88 });
    const deckWoodMat = new THREE.MeshStandardMaterial({ color: 0x936642, roughness: 0.76 });
    const limestoneMat = new THREE.MeshStandardMaterial({ color: 0xd6ccb8, roughness: 0.88 });
    const grassIsleMat = new THREE.MeshStandardMaterial({ color: 0x5d8d4a, roughness: 0.86 });
    const goldAccentMat = new THREE.MeshStandardMaterial({ color: 0xd9ad4d, roughness: 0.28, metalness: 0.78 });
    const ivoryStructMat = new THREE.MeshStandardMaterial({ color: 0xf7efe4, roughness: 0.52 });
    const navyStructMat = new THREE.MeshStandardMaterial({ color: 0x1c3d69, roughness: 0.48 });
    const fabricWhiteMat = new THREE.MeshStandardMaterial({ color: 0xfefaf4, roughness: 0.72 });
    const coralUmbrellaMat = new THREE.MeshStandardMaterial({ color: 0xd85c6b, roughness: 0.75 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7c5838, roughness: 0.9 });
    const palmLeafMat = new THREE.MeshStandardMaterial({ color: 0x3b7a3c, roughness: 0.78 });

    const oceanColliders = []; // Static shore/island/cliff obstacles

    function addPalmTree(x, y, z, scale) {
      const sc = scale || 1.0;
      const g = new THREE.Group();
      g.position.set(x, y, z);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.13 * sc, 0.22 * sc, 4.4 * sc, 7), trunkMat);
      trunk.position.y = 2.2 * sc;
      trunk.rotation.z = 0.08;
      g.add(trunk);
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        const frond = new THREE.Mesh(new THREE.ConeGeometry(0.45 * sc, 2.5 * sc, 5), palmLeafMat);
        frond.position.set(Math.cos(ang) * 0.95 * sc, 4.25 * sc, Math.sin(ang) * 0.95 * sc);
        frond.rotation.z = -Math.PI * 0.36;
        frond.rotation.y = -ang;
        g.add(frond);
      }
      oceanGroup.add(g);
    }

    // -- Royal Riviera Marina (West of Yacht Pier: x = -24.5..-4.5, z = 53.5..70.2) --
    const marinaQuay = new THREE.Mesh(new THREE.BoxGeometry(20.0, 0.32, 6.2), deckWoodMat);
    marinaQuay.position.set(-14.5, 0.10, 56.8);
    marinaQuay.receiveShadow = true;
    oceanGroup.add(marinaQuay);

    [-22.0, -13.5, -6.5].forEach(function (px, idx) {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.24, 10.8), deckWoodMat);
      finger.position.set(px, 0.14, 65.0);
      finger.receiveShadow = true;
      oceanGroup.add(finger);
      [62.0, 69.8].forEach(function (pz) {
        const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.56, 8), goldAccentMat);
        bollard.position.set(px + (idx === 0 ? -0.85 : 0.85), 0.48, pz);
        oceanGroup.add(bollard);
      });
    });

    // Harbormaster & Captain Pier Kiosk
    const harborKiosk = new THREE.Group();
    harborKiosk.position.set(-9.5, 0.26, 56.5);
    const kioskBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.15, 2.0), ivoryStructMat);
    kioskBase.position.y = 0.58;
    const kioskRoof = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 2.6), navyStructMat);
    kioskRoof.position.y = 2.65;
    [-1.4, 1.4].forEach(function (kx) {
      [-0.85, 0.85].forEach(function (kz) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.55, 8), goldAccentMat);
        post.position.set(kx, 1.35, kz);
        harborKiosk.add(post);
      });
    });
    harborKiosk.add(kioskBase, kioskRoof);
    oceanGroup.add(harborKiosk);
    tagInteractable(harborKiosk, 'riviera_marina_dock');
    oceanColliders.push({ type: 'box', minX: -11.3, maxX: -7.7, minZ: 55.3, maxZ: 57.7, isWall: true });

    registerSpot({
      id: 'riviera_marina_dock',
      title: 'Royal Riviera Marina & Harbormaster',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: -9.5, y: 0.26, z: 58.6,
      radius: 4.5,
      actions: [
        {
          id: 'marina_captain_cruise',
          label: 'Have Captain Henri Sail Yacht (Autopilot)',
          hint: 'Choose Private Island, Sunset Cruise, Beach Club or Lighthouse Cove',
          type: 'boat_captain_cruise',
          boatId: 'riviera_royal_yacht',
        },
        {
          id: 'marina_board_friends',
          label: 'Invite Friends Aboard Royal Yacht',
          hint: 'Up to 4 friends sit & socialize on deck while sailing!',
          type: 'boat_passengers',
          boatId: 'riviera_royal_yacht',
        },
        {
          id: 'marina_pier_fish',
          label: 'Fish From Riviera Marina Pier',
          hint: '+22 Fun/s & +₡15 Crowns per catch!',
          pose: 'fish',
          anchor: { x: -13.5, y: 0.26, z: 69.2, yaw: 0, rigOffsetY: 0, floorY: 0.26, exitX: -13.5, exitZ: 66.0, exitYaw: Math.PI },
          rates: { fun: 22, composure: 10 },
          statusText: 'Casting a golden fishing line off Riviera Marina...',
        },
        {
          id: 'marina_water_sports',
          label: 'Launch Coastal Rowboat Regatta',
          hint: 'Row the West cedar boat through the Slalom Buoys!',
          type: 'board_boat',
          boatId: 'riviera_rowboat_west',
        },
      ],
    });

    // -- Paloma Beach Club & Waterfront Bistro (x = -37.5, z = 54.4) --
    const clubDeck = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.26, 6.8), deckWoodMat);
    clubDeck.position.set(BEACH_CLUB.x, 0.08, BEACH_CLUB.z);
    clubDeck.receiveShadow = true;
    oceanGroup.add(clubDeck);

    const clubPergola = new THREE.Group();
    clubPergola.position.set(BEACH_CLUB.x, 0.21, BEACH_CLUB.z - 0.5);
    [[-6.4, -2.4], [0, -2.4], [6.4, -2.4], [-6.4, 2.4], [0, 2.4], [6.4, 2.4]].forEach(function (pt) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 3.1, 8), ivoryStructMat);
      col.position.set(pt[0], 1.55, pt[1]);
      clubPergola.add(col);
    });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.12, 5.4), fabricWhiteMat);
    canopy.position.y = 3.12;
    clubPergola.add(canopy);
    // Waterfront Bistro Bar + 2 Lounge Dining Tables
    const barCounter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.05, 0.9), ivoryStructMat);
    barCounter.position.set(-3.8, 0.52, -1.6);
    const barTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.08, 1.05), goldAccentMat);
    barTop.position.set(-3.8, 1.06, -1.6);
    clubPergola.add(barCounter, barTop);

    [1.8, 4.6].forEach(function (tx) {
      const tTop = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.08, 12), ivoryStructMat);
      tTop.position.set(tx, 0.78, 0.6);
      const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 0.76, 8), goldAccentMat);
      tLeg.position.set(tx, 0.38, 0.6);
      clubPergola.add(tTop, tLeg);
    });
    oceanGroup.add(clubPergola);
    tagInteractable(clubPergola, 'riviera_beach_club');
    oceanColliders.push({ type: 'box', minX: -43.5, maxX: -39.1, minZ: 51.8, maxZ: 53.0, isWall: true });

    registerSpot({
      id: 'riviera_beach_club',
      title: 'Paloma Beach Club & Waterfront Bistro',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: BEACH_CLUB.x + 2.5, y: 0.21, z: BEACH_CLUB.z + 0.8,
      radius: 5.5,
      actions: [
        {
          id: 'beach_club_dine',
          label: 'Dine Waterfront at Paloma Bistro',
          hint: '+24 Food/s, +18 Fun/s & Ocean View',
          pose: 'eat',
          anchor: { x: BEACH_CLUB.x + 1.8, y: 0.21, z: BEACH_CLUB.z + 1.1, yaw: 0, rigOffsetY: -0.45, floorY: 0.21, exitX: BEACH_CLUB.x + 1.8, exitZ: BEACH_CLUB.z + 2.8, exitYaw: 0 },
          partnerAnchor: { x: BEACH_CLUB.x + 1.8, y: 0.21, z: BEACH_CLUB.z - 0.8, yaw: Math.PI },
          rates: { hunger: 24, fun: 18, composure: 10 },
          statusText: 'Dining overlooking the crystal-blue Riviera bay...',
        },
        {
          id: 'beach_club_party',
          label: 'Host Royal Beach Club Event (₡120)',
          hint: 'Music, champagne & +35 Fun, +22 Poise & +6 Clout!',
          instant: true,
          onInstant: function (ctx) {
            if (ctx.game && (ctx.game.money || 0) < 120) return ctx.toast('Need ₡120 Crowns.');
            if (ctx.game) ctx.game.money -= 120;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 35, composure: 22, hunger: 12 });
            if (ctx.game && ctx.game.reputation) ctx.game.reputation.clout = Math.min(100, (ctx.game.reputation.clout || 50) + 6);
            ctx.toast('Paloma Beach Club sparkles for your Royal Seaside Event! (+6 Clout)');
          },
        },
        {
          id: 'beach_club_date',
          label: 'Romantic Sunset Ocean Toast (₡45)',
          hint: '+28 Fun, +24 Poise & coastal romance glow',
          pose: 'club_dance',
          anchor: { x: BEACH_CLUB.x + 4.2, y: 0.21, z: BEACH_CLUB.z + 1.2, yaw: 0, floorY: 0.21, exitX: BEACH_CLUB.x + 4.2, exitZ: BEACH_CLUB.z + 2.8 },
          rates: { fun: 28, composure: 24 },
          statusText: 'Dancing under the beachfront pergola at Paloma Beach Club...',
        },
      ],
    });

    // -- Eastern Coastal Cliffs, Palm Grove & Hidden Coral Cove (x = 116..168, z = 54..92) --
    [
      { x: 146, y: 3.2, z: 66, rx: 14, ry: 7.5, rz: 12 },
      { x: 158, y: 4.5, z: 76, rx: 16, ry: 10.5, rz: 14 },
      { x: 138, y: 2.0, z: 58, rx: 10, ry: 4.8, rz: 7 },
      { x: -146, y: 3.6, z: 68, rx: 15, ry: 8.5, rz: 13 },
      { x: -162, y: 5.0, z: 80, rx: 18, ry: 11.2, rz: 15 },
    ].forEach(function (cl) {
      const m = new THREE.Mesh(new THREE.DodecahedronGeometry(1, 1), limestoneMat);
      m.scale.set(cl.rx, cl.ry, cl.rz);
      m.position.set(cl.x, cl.y - cl.ry * 0.3, cl.z);
      m.castShadow = true;
      m.receiveShadow = true;
      oceanGroup.add(m);
      oceanColliders.push({ type: 'circle', x: cl.x, z: cl.z, r: Math.max(cl.rx, cl.rz) * 0.72, isWall: true });
    });

    // Palm Trees along Sandy Coast
    [-112, -84, -52, -26, 18, 46, 86, 114, 128].forEach(function (px, i) {
      addPalmTree(px, 0.03, 52.8 + (i % 2) * 1.4, 0.92 + (i % 3) * 0.14);
    });

    // Eastern Coral Cove & Snorkel Pier (x = 122, z = 62)
    const covePier = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.22, 8.2), deckWoodMat);
    covePier.position.set(122, 0.16, 62.5);
    covePier.receiveShadow = true;
    oceanGroup.add(covePier);
    tagInteractable(covePier, 'riviera_coral_cove');
    registerSpot({
      id: 'riviera_coral_cove',
      title: 'Cove d’Azur Coral Reef & Snorkel Spot',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: 122, y: 0.16, z: 65.5,
      radius: 5.5,
      actions: [
        {
          id: 'cove_snorkel',
          label: 'Snorkel Over Coral Reef & Tropical Fish',
          hint: 'Automatic swimwear · +24 Fun/s & +16 Hygiene/s!',
          pose: 'snorkel',
          anchor: { x: 122, y: -0.55, z: 73.5, yaw: 0, rigOffsetY: -0.1, floorY: -0.55, exitX: 122, exitZ: 58.2, exitYaw: Math.PI },
          rates: { fun: 24, hygiene: 16, composure: 10 },
          statusText: 'Snorkeling over vivid corals & tropical fish in Cove d’Azur...',
        },
        {
          id: 'cove_dive_under',
          label: 'Free-Dive Into Turquoise Shallows',
          hint: 'Glide underwater beside coral gardens!',
          pose: 'swim_dive',
          anchor: { x: 124.5, y: -1.35, z: 77.5, yaw: 0.4, rigOffsetY: -0.1, floorY: -1.35, exitX: 122, exitZ: 58.2, exitYaw: Math.PI },
          rates: { fun: 26, hygiene: 14 },
          statusText: 'Diving beneath crystal-blue Riviera waves...',
        },
      ],
    });

    // -- Private Island #1: Île d'Or (x = 62, z = 168) --
    const dorGroup = new THREE.Group();
    dorGroup.position.set(ISLAND_DOR.x, 0, ISLAND_DOR.z);
    const dorSand = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 17.5, 1.4, 24), sandMat);
    dorSand.position.y = -0.12;
    dorSand.receiveShadow = true;
    const dorLawn = new THREE.Mesh(new THREE.CylinderGeometry(10.8, 12.6, 0.75, 20), grassIsleMat);
    dorLawn.position.y = 0.62;
    dorLawn.receiveShadow = true;
    dorGroup.add(dorSand, dorLawn);

    // Île d'Or Landing Dock (North face)
    const dorDock = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.24, 11.5), deckWoodMat);
    dorDock.position.set(0, 0.25, -17.0);
    dorDock.receiveShadow = true;
    dorGroup.add(dorDock);

    // Gilded Sunset Pergola & Champagne Date Table
    const dorGazebo = new THREE.Group();
    dorGazebo.position.set(0, 1.0, -1.5);
    [[-2.2, -2.2], [2.2, -2.2], [-2.2, 2.2], [2.2, 2.2]].forEach(function (gp) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 3.0, 8), ivoryStructMat);
      col.position.set(gp[0], 1.5, gp[1]);
      dorGazebo.add(col);
    });
    const dorRoof = new THREE.Mesh(new THREE.ConeGeometry(3.6, 1.25, 4), fabricWhiteMat);
    dorRoof.position.y = 3.6;
    dorRoof.rotation.y = Math.PI * 0.25;
    const dorTable = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 0.08, 12), ivoryStructMat);
    dorTable.position.y = 0.76;
    const dorTableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.25, 0.74, 8), goldAccentMat);
    dorTableLeg.position.y = 0.37;
    const umbrella = new THREE.Mesh(new THREE.ConeGeometry(1.75, 0.7, 8), coralUmbrellaMat);
    umbrella.position.set(4.5, 2.4, 2.2);
    const umbPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 6), goldAccentMat);
    umbPole.position.set(4.5, 1.2, 2.2);
    dorGazebo.add(dorRoof, dorTable, dorTableLeg, umbrella, umbPole);
    dorGroup.add(dorGazebo);
    oceanGroup.add(dorGroup);

    addPalmTree(ISLAND_DOR.x - 6.8, 0.7, ISLAND_DOR.z + 3.2, 1.15);
    addPalmTree(ISLAND_DOR.x + 7.2, 0.7, ISLAND_DOR.z + 1.8, 1.08);
    addPalmTree(ISLAND_DOR.x - 4.2, 0.7, ISLAND_DOR.z - 6.2, 1.0);
    addPalmTree(ISLAND_DOR.x + 5.8, 0.7, ISLAND_DOR.z - 5.4, 0.96);

    tagInteractable(dorGroup, 'ile_dor_island');
    oceanColliders.push({ type: 'circle', x: ISLAND_DOR.x - 6.8, z: ISLAND_DOR.z + 3.2, r: 0.6, isWall: true });
    oceanColliders.push({ type: 'circle', x: ISLAND_DOR.x + 7.2, z: ISLAND_DOR.z + 1.8, r: 0.6, isWall: true });

    registerSpot({
      id: 'ile_dor_island',
      title: 'Île d’Or Private Royal Island',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: ISLAND_DOR.x, y: 1.0, z: ISLAND_DOR.z - 2.0,
      radius: 10.5,
      actions: [
        {
          id: 'island_sunset_date',
          label: 'Romantic Private Island Ocean Date',
          hint: '+30 Fun/s, +24 Poise/s & Island Champagne Pavilion',
          pose: 'eat',
          anchor: { x: ISLAND_DOR.x, y: 1.0, z: ISLAND_DOR.z - 0.3, yaw: Math.PI, rigOffsetY: -0.45, floorY: 1.0, exitX: ISLAND_DOR.x, exitZ: ISLAND_DOR.z - 5.2, exitYaw: Math.PI },
          partnerAnchor: { x: ISLAND_DOR.x, y: 1.0, z: ISLAND_DOR.z - 2.7, yaw: 0 },
          rates: { fun: 30, composure: 24, hunger: 16 },
          statusText: 'Sharing a romantic ocean date on Private Island Île d’Or...',
        },
        {
          id: 'island_yacht_party',
          label: 'Throw Private Island Sunset Cruise Party (₡150)',
          hint: '+40 Fun, +25 Poise, +8 Clout & Crown Dispatch Buzz!',
          instant: true,
          onInstant: function (ctx) {
            if (ctx.game && (ctx.game.money || 0) < 150) return ctx.toast('Need ₡150 Crowns.');
            if (ctx.game) ctx.game.money -= 150;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 40, composure: 25, hunger: 18 });
            if (ctx.game && ctx.game.reputation) ctx.game.reputation.clout = Math.min(100, (ctx.game.reputation.clout || 50) + 8);
            ctx.toast('Île d’Or glows with lanterns, music & champagne! (+8 Clout)');
          },
        },
        {
          id: 'island_lagoon_swim',
          label: 'Swim in Île d’Or Turquoise Lagoon',
          hint: 'Automatic swimwear · crystal-clear shallows!',
          instant: true,
          onInstant: function (ctx) {
            if (ctx.playerCtrl) {
              ctx.playerCtrl.teleport(ISLAND_DOR.x - 16.5, ISLAND_DOR.z - 4.0, -Math.PI * 0.5, -0.35);
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 16, hygiene: 14 });
              ctx.toast('Dove into the crystal-turquoise lagoon of Île d’Or!');
            }
          },
        },
      ],
    });

    // -- Private Island #2: Sapphire Lighthouse Isle (x = -74, z = 156) --
    const lightGroup = new THREE.Group();
    lightGroup.position.set(ISLAND_LIGHT.x, 0, ISLAND_LIGHT.z);
    const lSand = new THREE.Mesh(new THREE.CylinderGeometry(12.8, 15.6, 1.35, 22), sandMat);
    lSand.position.y = -0.1;
    lSand.receiveShadow = true;
    const lRock = new THREE.Mesh(new THREE.CylinderGeometry(8.5, 10.6, 1.6, 16), limestoneMat);
    lRock.position.y = 1.05;
    lRock.receiveShadow = true;
    lightGroup.add(lSand, lRock);

    // Striped Royal White & Navy Lighthouse Tower
    const towerLower = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 2.2, 5.2, 16), ivoryStructMat);
    towerLower.position.set(-1.5, 4.2, 1.0);
    towerLower.castShadow = true;
    const towerBand = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.72, 2.6, 16), navyStructMat);
    towerBand.position.set(-1.5, 7.8, 1.0);
    const towerUpper = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.5, 2.2, 16), ivoryStructMat);
    towerUpper.position.set(-1.5, 10.1, 1.0);
    const lanternGlass = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.25, 1.4, 12),
      new THREE.MeshBasicMaterial({ color: 0xffe49e })
    );
    lanternGlass.position.set(-1.5, 11.9, 1.0);
    const lanternCap = new THREE.Mesh(new THREE.ConeGeometry(1.45, 1.1, 12), goldAccentMat);
    lanternCap.position.set(-1.5, 13.15, 1.0);
    lightGroup.add(towerLower, towerBand, towerUpper, lanternGlass, lanternCap);

    // Lighthouse Wooden Fishing & Landing Pier (East face)
    const lightDock = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.24, 3.8), deckWoodMat);
    lightDock.position.set(12.0, 0.25, -11.0);
    lightDock.receiveShadow = true;
    lightGroup.add(lightDock);
    oceanGroup.add(lightGroup);

    addPalmTree(ISLAND_LIGHT.x + 5.6, 0.55, ISLAND_LIGHT.z + 3.4, 1.05);
    addPalmTree(ISLAND_LIGHT.x - 6.4, 0.55, ISLAND_LIGHT.z - 4.0, 0.98);

    tagInteractable(lightGroup, 'lighthouse_island');
    oceanColliders.push({ type: 'circle', x: ISLAND_LIGHT.x - 1.5, z: ISLAND_LIGHT.z + 1.0, r: 2.5, isWall: true });

    registerSpot({
      id: 'lighthouse_island',
      title: 'Sapphire Lighthouse Isle & Fishing Pier',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: ISLAND_LIGHT.x + 11.5, y: 0.35, z: ISLAND_LIGHT.z - 11.0,
      radius: 9.5,
      actions: [
        {
          id: 'lighthouse_fish',
          label: 'Deep-Water Ocean Fishing off Lighthouse Pier',
          hint: '+26 Fun/s, +12 Poise/s & rare Riviera catch!',
          pose: 'fish',
          anchor: { x: ISLAND_LIGHT.x + 15.8, y: 0.37, z: ISLAND_LIGHT.z - 11.0, yaw: Math.PI * 0.5, rigOffsetY: 0, floorY: 0.37, exitX: ISLAND_LIGHT.x + 11.5, exitZ: ISLAND_LIGHT.z - 11.0, exitYaw: -Math.PI * 0.5 },
          rates: { fun: 26, composure: 12 },
          statusText: 'Fishing in deep royal-blue waters off Sapphire Lighthouse...',
        },
        {
          id: 'lighthouse_gaze',
          label: 'Admire Horizon View from Lighthouse Terrace',
          hint: '+20 Poise/s & +14 Fun/s',
          pose: 'stargaze',
          anchor: { x: ISLAND_LIGHT.x + 2.4, y: 1.85, z: ISLAND_LIGHT.z + 1.2, yaw: 0, floorY: 1.85, exitX: ISLAND_LIGHT.x + 4.8, exitZ: ISLAND_LIGHT.z - 2.0 },
          rates: { composure: 20, fun: 14 },
          statusText: 'Taking in the 360-degree Mediterranean horizon...',
        },
      ],
    });

    // -- Floating Water Sports Regatta Slalom Buoys (x = 24..46, z = 96..136) --
    const buoySeeds = [
      { x: 26, z: 96, phase: 0.2, red: true },
      { x: 38, z: 108, phase: 1.1, red: false },
      { x: 28, z: 122, phase: 2.0, red: true },
      { x: 42, z: 134, phase: 2.9, red: false },
    ];
    const buoyMeshes = [];
    const buoyRedMat = new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.38 });
    buoySeeds.forEach(function (bs) {
      const bg = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.52, 0.9, 10), bs.red ? buoyRedMat : goldAccentMat);
      body.position.y = 0.28;
      const topCap = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), ivoryStructMat);
      topCap.position.y = 0.85;
      bg.add(body, topCap);
      bg.position.set(bs.x, -0.35, bs.z);
      oceanGroup.add(bg);
      buoyMeshes.push({ mesh: bg, base: bs });
    });

    // -----------------------------------------------------------
    // 4. DYNAMIC INSTANCED WAKE TRAIL, SPLASHES, SEAGULLS & RAIN
    // -----------------------------------------------------------
    // Wake Foam Trail (72 rings/plumes)
    const WAKE_COUNT = 72;
    const wakeGeo = new THREE.RingGeometry(0.26, 0.72, 12);
    wakeGeo.rotateX(-Math.PI / 2);
    const wakeMat = new THREE.MeshBasicMaterial({
      color: 0xeaf8ff,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
    });
    const wakeInst = new THREE.InstancedMesh(wakeGeo, wakeMat, WAKE_COUNT);
    wakeInst.frustumCulled = false;
    const wakePool = [];
    for (let wi = 0; wi < WAKE_COUNT; wi++) {
      wakePool.push({ x: 0, z: 200, age: 99, maxAge: 1.8, scale0: 1.0 });
      _dummyM.position.set(0, -10, 0);
      _dummyM.scale.set(0.001, 0.001, 0.001);
      _dummyM.updateMatrix();
      wakeInst.setMatrixAt(wi, _dummyM.matrix);
    }
    wakeInst.instanceMatrix.needsUpdate = true;
    oceanGroup.add(wakeInst);
    let wakeCursor = 0;
    let wakeEmitAccum = 0;

    function emitBoatWake(x, z, yaw, speed, isYacht) {
      if (Math.abs(speed) < 0.8) return;
      const sternDist = isYacht ? 6.2 : 1.75;
      const sx = x - Math.sin(yaw) * sternDist;
      const sz = z - Math.cos(yaw) * sternDist;
      const spread = isYacht ? 0.95 : 0.42;
      for (let side = -1; side <= 1; side += 2) {
        const w = wakePool[wakeCursor];
        wakeCursor = (wakeCursor + 1) % WAKE_COUNT;
        w.x = sx + Math.cos(yaw) * spread * side;
        w.z = sz - Math.sin(yaw) * spread * side;
        w.age = 0;
        w.maxAge = isYacht ? 2.4 : 1.45;
        w.scale0 = isYacht ? 1.55 : 0.65;
      }
    }

    // Water Entry/Exit & Swim Splashes (28 rings)
    const SPLASH_COUNT = 28;
    const splashGeo = new THREE.RingGeometry(0.18, 0.42, 14);
    splashGeo.rotateX(-Math.PI / 2);
    const splashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.78,
      depthWrite: false,
    });
    const splashInst = new THREE.InstancedMesh(splashGeo, splashMat, SPLASH_COUNT);
    splashInst.frustumCulled = false;
    const splashPool = [];
    for (let si = 0; si < SPLASH_COUNT; si++) {
      splashPool.push({ x: 0, y: -10, z: 0, age: 99, maxAge: 0.85, scale0: 1.0 });
      _dummyM.position.set(0, -10, 0);
      _dummyM.scale.set(0.001, 0.001, 0.001);
      _dummyM.updateMatrix();
      splashInst.setMatrixAt(si, _dummyM.matrix);
    }
    splashInst.instanceMatrix.needsUpdate = true;
    oceanGroup.add(splashInst);
    let splashCursor = 0;

    function triggerSplash(x, z, scale) {
      const sc = scale || 1.0;
      for (let k = 0; k < 2; k++) {
        const s = splashPool[splashCursor];
        splashCursor = (splashCursor + 1) % SPLASH_COUNT;
        s.x = x + (k - 0.5) * 0.25;
        s.z = z + (k - 0.5) * 0.25;
        s.y = -0.32;
        s.age = k * -0.09;
        s.maxAge = 0.85;
        s.scale0 = sc * (1.0 + k * 0.35);
      }
    }

    // Coastal Seagulls (14 gliding birds)
    const GULL_COUNT = isLow ? 8 : 14;
    const gullGeo = new THREE.BoxGeometry(1.15, 0.06, 0.24);
    const gullMat = new THREE.MeshStandardMaterial({ color: 0xfbf9f5, roughness: 0.55 });
    const gullInst = new THREE.InstancedMesh(gullGeo, gullMat, GULL_COUNT);
    gullInst.frustumCulled = false;
    const gullSeeds = [];
    for (let gi = 0; gi < GULL_COUNT; gi++) {
      gullSeeds.push({
        cx: gi % 3 === 0 ? 58 : gi % 3 === 1 ? -68 : 0,
        cz: gi % 3 === 0 ? 162 : gi % 3 === 1 ? 152 : 95,
        rx: 18 + (gi % 4) * 7,
        rz: 14 + (gi % 3) * 6,
        y: 12 + (gi % 5) * 2.6,
        spd: 0.14 + (gi % 4) * 0.04,
        phase: gi * 1.15,
      });
    }
    oceanGroup.add(gullInst);

    // Lightweight Instanced Rain Streaks (only active in rain/storm weather)
    const RAIN_COUNT = isLow ? 90 : 180;
    const rainGeo = new THREE.BoxGeometry(0.028, 0.95, 0.028);
    const rainMat = new THREE.MeshBasicMaterial({
      color: 0xc8e8ff,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const rainInst = new THREE.InstancedMesh(rainGeo, rainMat, RAIN_COUNT);
    rainInst.frustumCulled = false;
    rainInst.visible = false;
    const rainSeeds = [];
    for (let ri = 0; ri < RAIN_COUNT; ri++) {
      rainSeeds.push({
        ox: ((ri * 73.1) % 44) - 22,
        oz: ((ri * 41.7) % 44) - 22,
        oy: (ri * 3.17) % 18,
        spd: 17 + (ri % 5) * 2.5,
      });
    }
    oceanGroup.add(rainInst);

    // -----------------------------------------------------------
    // 5. WALKABLE HEIGHT, OCEAN SWIM ZONES & OBSTACLE COLLIDERS
    // -----------------------------------------------------------
    function groundHeightAtOcean(x, z, yNow) {
      if (yNow >= 2.6) return null;
      // Central Yacht Pier
      if (Math.abs(x) <= 2.6 && z >= 51.8 && z <= 67.0) return 0.26;
      // Marina Timber Boardwalk & 3 Pier Fingers
      if (x >= -24.5 && x <= -5.2 && z >= 53.5 && z <= 59.6) return 0.26;
      if ((Math.abs(x - -22.0) <= 1.25 || Math.abs(x - -13.5) <= 1.25 || Math.abs(x - -6.5) <= 1.25) && z >= 59.0 && z <= 70.2) {
        return 0.26;
      }
      // Paloma Beach Club Deck
      if (x >= BEACH_CLUB.minX && x <= BEACH_CLUB.maxX && z >= BEACH_CLUB.minZ && z <= BEACH_CLUB.maxZ) return 0.21;
      // Eastern Coral Cove Pier
      if (Math.abs(x - 122) <= 1.4 && z >= 58.0 && z <= 66.6) return 0.27;
      // Île d'Or Landing Dock & Island Interior
      if (Math.abs(x - ISLAND_DOR.dockX) <= 2.2 && z >= 145.4 && z <= 156.5) return 0.37;
      const dDor = Math.hypot(x - ISLAND_DOR.x, z - ISLAND_DOR.z);
      if (dDor <= 11.2) return 0.98;
      if (dDor <= ISLAND_DOR.r - 1.2) {
        return 0.56 - smoothstepJS(11.2, ISLAND_DOR.r - 1.2, dDor) * 0.45;
      }
      // Lighthouse Isle Dock & Island Interior
      if (x >= -67.6 && x <= -57.0 && Math.abs(z - ISLAND_LIGHT.dockZ) <= 1.95) return 0.37;
      const dLight = Math.hypot(x - ISLAND_LIGHT.x, z - ISLAND_LIGHT.z);
      if (dLight <= 9.0 && x < ISLAND_LIGHT.x + 7.5 && z > ISLAND_LIGHT.z - 8.5) return 1.85;
      if (dLight <= ISLAND_LIGHT.r - 1.2) {
        return 0.58 - smoothstepJS(9.0, ISLAND_LIGHT.r - 1.2, dLight) * 0.48;
      }
      // Golden Sandy Beach
      if (z >= 51.8 && z <= 59.2) return 0.03;
      // Deep Ocean Seabed (characters swim at surface -0.35 via player.js buoyancy, seabed prevents walking on deep floor!)
      if (z > 59.2 && Math.abs(x) <= 295) {
        const depth = getWaterDepth(x, z);
        return -0.38 - Math.min(4.2, depth);
      }
      return null;
    }

    function isInOceanWater(pos) {
      if (!pos || pos.y >= 1.25 || pos.z < 59.2 || Math.abs(pos.x) > 295) return false;
      // Exclude dry piers, marina boardwalk & private island dry ground
      if (Math.abs(pos.x) <= 2.75 && pos.z <= 67.2) return false;
      if (pos.x >= -24.5 && pos.x <= -5.2 && pos.z <= 59.6) return false;
      if ((Math.abs(pos.x - -22.0) <= 1.25 || Math.abs(pos.x - -13.5) <= 1.25 || Math.abs(pos.x - -6.5) <= 1.25) && pos.z <= 70.4) return false;
      if (Math.abs(pos.x - 122) <= 1.4 && pos.z <= 66.8) return false;
      if (Math.abs(pos.x - ISLAND_DOR.dockX) <= 2.25 && pos.z >= 145.4 && pos.z <= 156.5) return false;
      if (Math.hypot(pos.x - ISLAND_DOR.x, pos.z - ISLAND_DOR.z) <= ISLAND_DOR.r - 1.4) return false;
      if (pos.x >= -67.6 && pos.x <= -57.0 && Math.abs(pos.z - ISLAND_LIGHT.dockZ) <= 1.95) return false;
      if (Math.hypot(pos.x - ISLAND_LIGHT.x, pos.z - ISLAND_LIGHT.z) <= ISLAND_LIGHT.r - 1.4) return false;
      if (Math.abs(pos.x) >= 220.0 && Math.abs(pos.x) <= 244.0 && pos.z <= 73.0) return false;
      return true;
    }

    function resolveOceanObstacles(rx, rz, radius, isBoat) {
      let x = rx;
      let z = rz;
      const r = radius || 0.5;
      for (let i = 0; i < oceanColliders.length; i++) {
        const c = oceanColliders[i];
        if (c.type === 'circle') {
          const dx = x - c.x;
          const dz = z - c.z;
          const minDist = c.r + r;
          const dSq = dx * dx + dz * dz;
          if (dSq < minDist * minDist && dSq > 0.0001) {
            const d = Math.sqrt(dSq);
            x = c.x + (dx / d) * minDist;
            z = c.z + (dz / d) * minDist;
          }
        } else {
          const cx = Math.max(c.minX, Math.min(c.maxX, x));
          const cz = Math.max(c.minZ, Math.min(c.maxZ, z));
          const dx = x - cx;
          const dz = z - cz;
          const dSq = dx * dx + dz * dz;
          if (dSq < r * r && dSq > 0.00001) {
            const d = Math.sqrt(dSq);
            x = cx + (dx / d) * r;
            z = cz + (dz / d) * r;
          }
        }
      }
      if (isBoat) {
        // Keep boats clear of dry Private Island hulls, Coastal Cliffs and Marina piers
        const islands = [
          { x: ISLAND_DOR.x, z: ISLAND_DOR.z, r: ISLAND_DOR.r + 0.8 },
          { x: ISLAND_LIGHT.x, z: ISLAND_LIGHT.z, r: ISLAND_LIGHT.r + 0.8 },
          { x: -232.0, z: 63.0, r: 10.5 },
          { x: 232.0, z: 63.0, r: 10.5 },
        ];
        for (let ii = 0; ii < islands.length; ii++) {
          const isl = islands[ii];
          const dx = x - isl.x;
          const dz = z - isl.z;
          const minD = isl.r + r;
          const dSq = dx * dx + dz * dz;
          if (dSq < minD * minD && dSq > 0.0001) {
            const d = Math.sqrt(dSq);
            x = isl.x + (dx / d) * minD;
            z = isl.z + (dz / d) * minD;
          }
        }
        // Keep clear of Marina Finger Piers
        if (x >= -24.5 - r && x <= -4.5 + r && z < 71.2 + r) {
          if (x < -14.5) x = -24.5 - r;
          else if (z > 68.0) z = 71.2 + r;
          else x = -4.5 + r;
        }
      }
      return { x: x, z: z };
    }

    function detectOceanZone(pos) {
      if (!pos) return null;
      if (Math.hypot(pos.x - ISLAND_DOR.x, pos.z - ISLAND_DOR.z) < 20) return 'Île d’Or Private Royal Island';
      if (Math.hypot(pos.x - ISLAND_LIGHT.x, pos.z - ISLAND_LIGHT.z) < 19) return 'Sapphire Lighthouse Isle';
      if (pos.x >= BEACH_CLUB.minX && pos.x <= BEACH_CLUB.maxX && pos.z >= 51.8 && pos.z <= 59.5) return 'Paloma Beach Club & Bistro';
      if (pos.x >= -25.5 && pos.x <= -4.2 && pos.z >= 53.0 && pos.z <= 71.5) return 'Royal Riviera Marina';
      if (Math.hypot(pos.x - 122, pos.z - 72) < 16) return 'Cove d’Azur Coral Reef';
      if (pos.z >= 59.5 && Math.abs(pos.x) <= 4.5 && pos.z <= 69.0) return 'Riviera Yacht Pier';
      if (pos.z >= 59.2) return 'Riviera Sapphire Ocean';
      if (pos.z >= 51.8) return 'Riviera Golden Sandy Beach';
      return null;
    }

    function setWeather(mode) {
      weatherState.mode = mode || 'clear';
      if (weatherState.mode === 'storm') {
        weatherState.waveAmp = 2.2;
        weatherState.rainMix = 1.0;
        weatherState.stormDark = 1.0;
        weatherState.sunsetMix = 0.0;
      } else if (weatherState.mode === 'rain') {
        weatherState.waveAmp = 1.38;
        weatherState.rainMix = 0.85;
        weatherState.stormDark = 0.45;
        weatherState.sunsetMix = 0.0;
      } else if (weatherState.mode === 'sunset') {
        weatherState.waveAmp = 0.88;
        weatherState.rainMix = 0.0;
        weatherState.stormDark = 0.0;
        weatherState.sunsetMix = 1.0;
      } else {
        weatherState.waveAmp = 1.0;
        weatherState.rainMix = 0.0;
        weatherState.stormDark = 0.0;
        weatherState.sunsetMix = 0.0;
      }
      return weatherState;
    }

    let lastUpdateSec = 0;

    function update(elapsedSec, activeTransport, playerPos, envInfo) {
      const dt = Math.min(0.08, Math.max(0.001, elapsedSec - lastUpdateSec));
      lastUpdateSec = elapsedSec;

      const env = envInfo || {};
      oceanUniforms.uTime.value = elapsedSec;
      oceanUniforms.uWaveAmp.value = weatherState.waveAmp;
      oceanUniforms.uRainMix.value = weatherState.rainMix;
      oceanUniforms.uStormDark.value = weatherState.stormDark;

      if (typeof env.moonMix === 'number') oceanUniforms.uMoonMix.value = env.moonMix;
      if (typeof env.sunsetMix === 'number') {
        oceanUniforms.uSunsetMix.value = Math.max(weatherState.sunsetMix, env.sunsetMix);
      } else {
        oceanUniforms.uSunsetMix.value = weatherState.sunsetMix;
      }
      if (env.sunDir) oceanUniforms.uSunDir.value.copy(env.sunDir);
      if (env.skyColor) oceanUniforms.uSkyColor.value.copy(env.skyColor);
      if (env.fogColor) oceanUniforms.uFogColor.value.copy(env.fogColor);
      if (typeof env.fogDensity === 'number') oceanUniforms.uFogDensity.value = env.fogDensity;

      // Update active boat shader wake & spawn 3D wake plume discs
      const tr = activeTransport;
      if (tr && tr.kind === 'boat' && tr.entity && tr.entity.group) {
        const bg = tr.entity.group;
        oceanUniforms.uBoatWake.value.set(bg.position.x, bg.position.z, bg.rotation.y, Math.abs(tr.speed || 0));
        wakeEmitAccum += dt * (4 + Math.abs(tr.speed || 0) * 1.4);
        if (wakeEmitAccum >= 1.0) {
          wakeEmitAccum = 0;
          emitBoatWake(bg.position.x, bg.position.z, bg.rotation.y, tr.speed || 0, Boolean(tr.entity.isYacht));
        }
      } else {
        oceanUniforms.uBoatWake.value.w *= 0.85;
      }

      // Bobbing Water Sports Regatta Buoys
      for (let bi = 0; bi < buoyMeshes.length; bi++) {
        const b = buoyMeshes[bi];
        const wh = getWaveHeight(b.base.x, b.base.z, elapsedSec, weatherState.waveAmp);
        b.mesh.position.y = -0.35 + wh;
        b.mesh.rotation.z = Math.sin(elapsedSec * 2.1 + b.base.phase) * 0.14 * weatherState.waveAmp;
      }

      // Update Wake Foam Pool
      for (let wi = 0; wi < WAKE_COUNT; wi++) {
        const w = wakePool[wi];
        if (w.age < w.maxAge) {
          w.age += dt;
          const p = w.age / w.maxAge;
          if (p >= 1) {
            _dummyM.position.set(0, -10, 0);
            _dummyM.scale.set(0.001, 0.001, 0.001);
          } else {
            const sc = w.scale0 * (0.7 + p * 2.4) * (1 - p * 0.35);
            const wy = -0.31 + getWaveHeight(w.x, w.z, elapsedSec, weatherState.waveAmp) * 0.65;
            _dummyM.position.set(w.x, wy, w.z);
            _dummyM.rotation.set(0, 0, 0);
            _dummyM.scale.set(sc, 1, sc);
          }
          _dummyM.updateMatrix();
          wakeInst.setMatrixAt(wi, _dummyM.matrix);
        }
      }
      wakeInst.instanceMatrix.needsUpdate = true;

      // Update Splash Ring Pool
      for (let si = 0; si < SPLASH_COUNT; si++) {
        const sp = splashPool[si];
        if (sp.age < sp.maxAge) {
          sp.age += dt;
          if (sp.age < 0 || sp.age >= sp.maxAge) {
            _dummyM.position.set(0, -10, 0);
            _dummyM.scale.set(0.001, 0.001, 0.001);
          } else {
            const p = sp.age / sp.maxAge;
            const sc = sp.scale0 * (0.45 + p * 3.1) * (1 - p * 0.25);
            _dummyM.position.set(sp.x, sp.y + (1 - p) * 0.08, sp.z);
            _dummyM.rotation.set(0, 0, 0);
            _dummyM.scale.set(sc, 1, sc);
          }
          _dummyM.updateMatrix();
          splashInst.setMatrixAt(si, _dummyM.matrix);
        }
      }
      splashInst.instanceMatrix.needsUpdate = true;

      // Animate Tropical Fish Schools (only when player is near coast/water for Redmi optimization)
      if (!playerPos || playerPos.z > 32) {
        for (let fi = 0; fi < fishCount; fi++) {
          const fs = fishSeeds[fi];
          const ang = elapsedSec * fs.spd + fs.phase;
          const fx = fs.cx + Math.cos(ang) * fs.r;
          const fz = fs.cz + Math.sin(ang) * fs.r;
          _dummyM.position.set(fx, fs.depth + Math.sin(elapsedSec * 2.4 + fs.phase) * 0.12, fz);
          _dummyM.rotation.set(0, -ang + (fs.spd > 0 ? 0 : Math.PI), 0);
          _dummyM.scale.set(1, 1, 1);
          _dummyM.updateMatrix();
          fishInst.setMatrixAt(fi, _dummyM.matrix);
        }
        fishInst.instanceMatrix.needsUpdate = true;
      }

      // Animate Coastal Seagulls
      for (let gi = 0; gi < GULL_COUNT; gi++) {
        const gs = gullSeeds[gi];
        const ang = elapsedSec * gs.spd + gs.phase;
        const gx = gs.cx + Math.cos(ang) * gs.rx;
        const gz = gs.cz + Math.sin(ang) * gs.rz;
        const gy = gs.y + Math.sin(elapsedSec * 1.8 + gs.phase) * 0.7;
        const flap = 0.75 + Math.abs(Math.sin(elapsedSec * 6.5 + gs.phase)) * 0.45;
        _dummyM.position.set(gx, gy, gz);
        _dummyM.rotation.set(0, -ang, Math.sin(elapsedSec * 6.5 + gs.phase) * 0.18);
        _dummyM.scale.set(flap, 1, 1);
        _dummyM.updateMatrix();
        gullInst.setMatrixAt(gi, _dummyM.matrix);
      }
      gullInst.instanceMatrix.needsUpdate = true;

      // Animate Rain Streaks when weather is Rain or Storm
      const showRain = weatherState.rainMix > 0.15;
      if (rainInst.visible !== showRain) rainInst.visible = showRain;
      if (showRain && playerPos) {
        const px = playerPos.x || 0;
        const py = playerPos.y || 0;
        const pz = playerPos.z || 0;
        for (let ri = 0; ri < RAIN_COUNT; ri++) {
          const rs = rainSeeds[ri];
          const fall = ((rs.oy - elapsedSec * rs.spd) % 18 + 18) % 18;
          _dummyM.position.set(px + rs.ox, py + fall - 1.5, pz + rs.oz);
          _dummyM.rotation.set(0, 0, weatherState.stormDark > 0.6 ? 0.18 : 0.06);
          _dummyM.scale.set(1, 1, 1);
          _dummyM.updateMatrix();
          rainInst.setMatrixAt(ri, _dummyM.matrix);
        }
        rainInst.instanceMatrix.needsUpdate = true;
      }
    }

    function dispose() {
      oceanGroup.traverse(function (obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(function (m) { m.dispose(); });
          else obj.material.dispose();
        }
      });
    }

    return {
      group: oceanGroup,
      weatherState: weatherState,
      setWeather: setWeather,
      getWaveHeight: getWaveHeight,
      getWaterDepth: getWaterDepth,
      groundHeightAtOcean: groundHeightAtOcean,
      isInOceanWater: isInOceanWater,
      resolveOceanObstacles: resolveOceanObstacles,
      detectOceanZone: detectOceanZone,
      triggerSplash: triggerSplash,
      emitBoatWake: emitBoatWake,
      update: update,
      dispose: dispose,
      dockDestinations: [
        { id: 'marina', title: 'Royal Riviera Marina', x: -10.5, z: 75.5, yaw: Math.PI, dockX: -10.5, dockZ: 68.5, dockY: 0.26 },
        { id: 'pier', title: 'Central Yacht Pier', x: 5.5, z: 68.5, yaw: Math.PI * 0.42, dockX: 0.0, dockZ: 65.0, dockY: 0.26 },
        { id: 'ile_dor', title: 'Île d’Or Private Island', x: 62.0, z: 141.0, yaw: 0, dockX: 62.0, dockZ: 152.5, dockY: 0.37 },
        { id: 'lighthouse', title: 'Sapphire Lighthouse Isle', x: -51.5, z: 145.0, yaw: -Math.PI * 0.5, dockX: -62.5, dockZ: 145.0, dockY: 0.37 },
        { id: 'coral_cove', title: 'Cove d’Azur Coral Reef', x: 118.0, z: 74.0, yaw: Math.PI * 0.35, dockX: 122.0, dockZ: 64.5, dockY: 0.27 },
        { id: 'sunset_loop', title: 'Grand Sunset Bay Cruise', x: 0.0, z: 145.0, yaw: -Math.PI * 0.5, dockX: 5.5, dockZ: 65.0, dockY: 0.26 },
      ],
    };
  }

  window.CrownOcean = {
    buildOceanWorld: buildOceanWorld,
    getWaveHeight: getWaveHeight,
    getWaterDepth: getWaterDepth,
  };
})();
