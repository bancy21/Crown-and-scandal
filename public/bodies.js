(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  // Grounded in anthropometric WHR & Shoulder/Bust/High-Hip/Lower-Hip ratios
  const BODY_TYPES = [
    {
      id: 'hourglass',
      label: 'Hourglass',
      desc: 'Even bust & hips with dramatic 0.70 waist curve',
      sliders: {
        height: 1.0,
        legLength: 1.01,
        shoulders: 1.0,
        bust: 1.14,
        waist: 0.77,
        highHip: 1.06,
        hips: 1.16,
        thighs: 1.06,
        arms: 0.94,
      },
    },
    {
      id: 'pear',
      label: 'Pear (Triangle)',
      desc: 'Narrow shoulders & bust with lush wide hips & thighs',
      sliders: {
        height: 0.99,
        legLength: 0.98,
        shoulders: 0.89,
        bust: 0.86,
        waist: 0.83,
        highHip: 1.15,
        hips: 1.24,
        thighs: 1.22,
        arms: 0.88,
      },
    },
    {
      id: 'spoon',
      label: 'Spoon',
      desc: 'Defined waist with pronounced high-hip shelf curve',
      sliders: {
        height: 0.99,
        legLength: 0.97,
        shoulders: 0.9,
        bust: 0.88,
        waist: 0.82,
        highHip: 1.26,
        hips: 1.2,
        thighs: 1.16,
        arms: 0.9,
      },
    },
    {
      id: 'apple',
      label: 'Apple (Round)',
      desc: 'Fuller chest & round midsection with slender legs',
      sliders: {
        height: 0.99,
        legLength: 1.02,
        shoulders: 1.05,
        bust: 1.18,
        waist: 1.2,
        highHip: 1.04,
        hips: 0.93,
        thighs: 0.84,
        arms: 1.04,
      },
    },
    {
      id: 'rectangle',
      label: 'Rectangle',
      desc: 'Straight balanced shoulder-waist-hip silhouette',
      sliders: {
        height: 1.01,
        legLength: 1.03,
        shoulders: 0.97,
        bust: 0.93,
        waist: 1.04,
        highHip: 0.96,
        hips: 0.95,
        thighs: 0.93,
        arms: 0.94,
      },
    },
    {
      id: 'inverted-triangle',
      label: 'Inverted Triangle',
      desc: 'Broad sculpted shoulders tapering to slim hips',
      sliders: {
        height: 1.02,
        legLength: 1.04,
        shoulders: 1.15,
        bust: 1.12,
        waist: 0.88,
        highHip: 0.87,
        hips: 0.85,
        thighs: 0.86,
        arms: 1.03,
      },
    },
    {
      id: 'petite',
      label: 'Petite',
      desc: 'Compact delicate frame & shorter stature',
      sliders: {
        height: 0.91,
        legLength: 0.93,
        shoulders: 0.9,
        bust: 0.88,
        waist: 0.84,
        highHip: 0.92,
        hips: 0.92,
        thighs: 0.88,
        arms: 0.86,
      },
    },
    {
      id: 'plus-size',
      label: 'Plus-Size Curvy',
      desc: 'Voluptuous regal curves across bust, waist & hips',
      sliders: {
        height: 1.0,
        legLength: 0.96,
        shoulders: 1.08,
        bust: 1.22,
        waist: 1.16,
        highHip: 1.22,
        hips: 1.24,
        thighs: 1.22,
        arms: 1.15,
      },
    },
    {
      id: 'tall',
      label: 'Tall Runway',
      desc: 'Statuesque height with elongated legs',
      sliders: {
        height: 1.09,
        legLength: 1.09,
        shoulders: 0.98,
        bust: 0.96,
        waist: 0.86,
        highHip: 0.95,
        hips: 0.96,
        thighs: 0.92,
        arms: 0.92,
      },
    },
  ];

  const AGE_LOOKS = [
    { id: 'young-adult', label: 'Young Adult', posture: 0, jawSoftness: 1.0, cheekDepth: 0.16 },
    { id: 'adult', label: 'Adult', posture: 0.01, jawSoftness: 0.86, cheekDepth: 0.3 },
    { id: 'mature', label: 'Mature', posture: 0.02, jawSoftness: 0.74, cheekDepth: 0.44 },
  ];

  const SLIDER_LIMITS = {
    height: { label: 'Height', min: 0.88, max: 1.12, step: 0.01 },
    legLength: { label: 'Leg Length', min: 0.88, max: 1.12, step: 0.01 },
    shoulders: { label: 'Shoulders', min: 0.84, max: 1.18, step: 0.01 },
    bust: { label: 'Bust & Chest', min: 0.8, max: 1.24, step: 0.01 },
    waist: { label: 'Waist', min: 0.74, max: 1.24, step: 0.01 },
    highHip: { label: 'High Hip Shelf', min: 0.82, max: 1.28, step: 0.01 },
    hips: { label: 'Lower Hips', min: 0.82, max: 1.26, step: 0.01 },
    thighs: { label: 'Thighs', min: 0.8, max: 1.26, step: 0.01 },
    arms: { label: 'Arms', min: 0.8, max: 1.2, step: 0.01 },
  };

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, Number(val) || min));
  }

  function clampBody(raw) {
    const base = raw || {};
    const typeObj =
      BODY_TYPES.find(function (t) {
        return t.id === base.bodyType;
      }) || BODY_TYPES[0];

    const src = base.sliders || typeObj.sliders;
    const out = {};
    Object.keys(SLIDER_LIMITS).forEach(function (key) {
      const lim = SLIDER_LIMITS[key];
      const fallback = typeObj.sliders[key] !== undefined ? typeObj.sliders[key] : 1.0;
      out[key] = Number(clamp(src[key] !== undefined ? src[key] : fallback, lim.min, lim.max).toFixed(2));
    });

    const ageObj =
      AGE_LOOKS.find(function (a) {
        return a.id === base.ageLook;
      }) || AGE_LOOKS[0];

    return {
      bodyType: typeObj.id,
      ageLook: ageObj.id,
      sliders: out,
    };
  }

  function createDefaultBody(presetId) {
    const preset =
      BODY_TYPES.find(function (t) {
        return t.id === presetId;
      }) || BODY_TYPES[0];
    return clampBody({
      bodyType: preset.id,
      ageLook: 'young-adult',
      sliders: Object.assign({}, preset.sliders),
    });
  }

  function parseHex(hex, fallback) {
    const clean = String(hex || fallback || '#e5b89b').replace('#', '');
    if (clean.length !== 6) return { r: 229, g: 184, b: 155 };
    return {
      r: parseInt(clean.slice(0, 2), 16) || 0,
      g: parseInt(clean.slice(2, 4), 16) || 0,
      b: parseInt(clean.slice(4, 6), 16) || 0,
    };
  }

  function rgba(hex, alpha) {
    const c = parseHex(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + alpha + ')';
  }

  /**
   * Computes anatomically accurate joints & multi-station fit metrics
   * (neck -> trapezius -> deltoid -> ribcage -> natural waist -> high-hip shelf -> lower hip -> thigh -> calf -> ankle).
   */
  function computeRig(bodyConfig, cx, baseY, unitScale) {
    const cfg = clampBody(bodyConfig);
    const s = cfg.sliders;
    const age =
      AGE_LOOKS.find(function (a) {
        return a.id === cfg.ageLook;
      }) || AGE_LOOKS[0];

    const H = (unitScale || 260) * s.height;
    const legH = H * 0.47 * s.legLength;
    const torsoH = H * 0.345;
    const headR = (unitScale || 260) * 0.068;

    const ankleY = baseY - H * 0.03;
    const calfY = ankleY - legH * 0.32;
    const kneeY = ankleY - legH * 0.5;
    const hipY = ankleY - legH;
    const highHipY = hipY - torsoH * 0.16;
    const waistY = hipY - torsoH * 0.38;
    const bustY = hipY - torsoH * 0.68;
    const shoulderY = hipY - torsoH;

    const neckBaseY = shoulderY - headR * 0.08;
    const neckY = shoulderY - headR * 0.54;
    const headCy = neckY - headR * 0.96;

    const shoulderHalf = headR * 2.08 * s.shoulders;
    const bustHalf = headR * 1.66 * (s.bust * 0.72 + s.shoulders * 0.18 + s.waist * 0.1);
    const waistHalf = headR * 1.15 * s.waist;
    const highHipHalf = headR * 1.68 * s.highHip;
    const hipHalf = headR * 1.92 * s.hips;
    const armThickness = headR * 0.34 * s.arms;
    const thighHalf = headR * 0.88 * (0.35 + s.thighs * 0.65);

    const shoulderDropY = shoulderY + headR * 0.36;
    const deltoidY = shoulderDropY + headR * 0.46;
    const elbowY = shoulderDropY + torsoH * 0.48;
    const wristY = hipY + legH * 0.04;

    const deltoidX = shoulderHalf + armThickness * 0.22;
    const maxBodyHalf = Math.max(shoulderHalf, hipHalf, waistHalf);
    const elbowX = maxBodyHalf + armThickness * 0.58;
    const wristX = Math.max(hipHalf, waistHalf * 0.95) + armThickness * 0.72;

    const stanceX = Math.max(hipHalf * 0.44, thighHalf * 0.92);

    return {
      config: cfg,
      age: age,
      cx: cx,
      baseY: baseY,
      H: H,
      headR: headR,
      joints: {
        headTop: { x: cx, y: headCy - headR },
        headCenter: { x: cx, y: headCy },
        chin: { x: cx, y: headCy + headR * 0.98 },
        neck: { x: cx, y: neckY },
        neckBase: { x: cx, y: neckBaseY },
        shoulderL: { x: cx - shoulderHalf, y: shoulderDropY },
        shoulderR: { x: cx + shoulderHalf, y: shoulderDropY },
        deltoidL: { x: cx - deltoidX, y: deltoidY },
        deltoidR: { x: cx + deltoidX, y: deltoidY },
        clavicleY: neckBaseY + headR * 0.24,
        bustY: bustY,
        waistL: { x: cx - waistHalf, y: waistY },
        waistR: { x: cx + waistHalf, y: waistY },
        highHipL: { x: cx - highHipHalf, y: highHipY },
        highHipR: { x: cx + highHipHalf, y: highHipY },
        hipL: { x: cx - hipHalf, y: hipY },
        hipR: { x: cx + hipHalf, y: hipY },
        elbowL: { x: cx - elbowX, y: elbowY },
        elbowR: { x: cx + elbowX, y: elbowY },
        wristL: { x: cx - wristX, y: wristY },
        wristR: { x: cx + wristX, y: wristY },
        kneeL: { x: cx - stanceX * 0.88, y: kneeY },
        kneeR: { x: cx + stanceX * 0.88, y: kneeY },
        calfL: { x: cx - stanceX * 0.82, y: calfY },
        calfR: { x: cx + stanceX * 0.82, y: calfY },
        ankleL: { x: cx - stanceX * 0.72, y: ankleY },
        ankleR: { x: cx + stanceX * 0.72, y: ankleY },
      },
      fit: {
        neckHalf: headR * 0.34,
        shoulderHalf: shoulderHalf,
        bustHalf: bustHalf,
        waistHalf: waistHalf,
        highHipHalf: highHipHalf,
        hipHalf: hipHalf,
        armThickness: armThickness,
        thighHalf: thighHalf,
        stanceX: stanceX,
        collarRadius: headR * 0.48,
        crownWidth: headR * 1.65,
        skirtPad: armThickness * 0.65,
      },
    };
  }

  /**
   * Draws unified anatomical silhouette + sculpted two-piece satin Bra & Panties.
   */
  function drawBaseBody(ctx, rig, skinPalette) {
    const j = rig.joints;
    const f = rig.fit;
    const hr = rig.headR;
    const skin = skinPalette || { base: '#e8bca0', shadow: '#c58f70', highlight: '#fae0ce' };

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // 1. Soft Studio Pedestal Shadow
    ctx.fillStyle = 'rgba(42, 26, 30, 0.18)';
    ctx.beginPath();
    ctx.ellipse(rig.cx, rig.baseY, f.hipHalf * 1.24, f.armThickness * 1.05, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Sculpted Anatomical Legs (outer thigh swell -> knee -> gastrocnemius calf -> tapered ankle)
    function drawLeg(side) {
      const thighCenter = rig.cx + side * f.stanceX;
      const knee = side < 0 ? j.kneeL : j.kneeR;
      const calf = side < 0 ? j.calfL : j.calfR;
      const ankle = side < 0 ? j.ankleL : j.ankleR;
      const calfHalf = f.armThickness * (0.94 + (f.thighHalf / Math.max(1, hr * 0.88) - 1) * 0.28);

      const legGrad = ctx.createLinearGradient(thighCenter - f.thighHalf, j.hipL.y, thighCenter + f.thighHalf, ankle.y);
      legGrad.addColorStop(0, skin.base);
      legGrad.addColorStop(0.45, skin.highlight);
      legGrad.addColorStop(1, skin.shadow);

      ctx.fillStyle = legGrad;
      ctx.beginPath();
      // Outer thigh from hip shelf
      const outerTopX = rig.cx + side * f.hipHalf * 0.96;
      const innerTopX = rig.cx + side * Math.max(hr * 0.08, f.stanceX - f.thighHalf * 0.66);

      if (side < 0) {
        ctx.moveTo(outerTopX, j.hipL.y);
        ctx.bezierCurveTo(
          outerTopX - f.thighHalf * 0.14,
          j.hipL.y + hr * 0.85,
          knee.x - f.thighHalf * 0.52,
          knee.y - hr * 0.35,
          knee.x - f.armThickness * 0.92,
          knee.y
        );
        ctx.bezierCurveTo(
          calf.x - calfHalf * 1.18,
          calf.y - hr * 0.25,
          ankle.x - f.armThickness * 0.62,
          ankle.y - hr * 0.35,
          ankle.x - f.armThickness * 0.56,
          ankle.y
        );
        ctx.quadraticCurveTo(ankle.x, ankle.y + f.armThickness * 1.15, ankle.x + f.armThickness * 0.56, ankle.y);
        ctx.bezierCurveTo(
          ankle.x + f.armThickness * 0.62,
          ankle.y - hr * 0.35,
          calf.x + calfHalf * 1.04,
          calf.y - hr * 0.25,
          knee.x + f.armThickness * 0.9,
          knee.y
        );
        ctx.bezierCurveTo(
          knee.x + f.thighHalf * 0.44,
          knee.y - hr * 0.35,
          innerTopX - f.thighHalf * 0.08,
          j.hipL.y + hr * 0.9,
          innerTopX,
          j.hipL.y + f.thighHalf * 0.32
        );
      } else {
        ctx.moveTo(innerTopX, j.hipR.y + f.thighHalf * 0.32);
        ctx.bezierCurveTo(
          innerTopX + f.thighHalf * 0.08,
          j.hipR.y + hr * 0.9,
          knee.x - f.thighHalf * 0.44,
          knee.y - hr * 0.35,
          knee.x - f.armThickness * 0.9,
          knee.y
        );
        ctx.bezierCurveTo(
          calf.x - calfHalf * 1.04,
          calf.y - hr * 0.25,
          ankle.x - f.armThickness * 0.62,
          ankle.y - hr * 0.35,
          ankle.x - f.armThickness * 0.56,
          ankle.y
        );
        ctx.quadraticCurveTo(ankle.x, ankle.y + f.armThickness * 1.15, ankle.x + f.armThickness * 0.56, ankle.y);
        ctx.bezierCurveTo(
          ankle.x + f.armThickness * 0.62,
          ankle.y - hr * 0.35,
          calf.x + calfHalf * 1.18,
          calf.y - hr * 0.25,
          knee.x + f.armThickness * 0.92,
          knee.y
        );
        ctx.bezierCurveTo(
          knee.x + f.thighHalf * 0.52,
          knee.y - hr * 0.35,
          outerTopX + f.thighHalf * 0.14,
          j.hipR.y + hr * 0.85,
          outerTopX,
          j.hipR.y
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgba(skin.shadow, 0.42);
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    drawLeg(-1);
    drawLeg(1);

    // 3. Arms + Continuous Sloping Trapezius/Deltoid Contour
    function drawArmBehind(side) {
      const sh = side < 0 ? j.shoulderL : j.shoulderR;
      const delt = side < 0 ? j.deltoidL : j.deltoidR;
      const elb = side < 0 ? j.elbowL : j.elbowR;
      const wr = side < 0 ? j.wristL : j.wristR;
      const wTop = f.armThickness * 0.96;
      const wMid = f.armThickness * 0.8;
      const wBot = f.armThickness * 0.52;

      const neckAttachX = rig.cx + side * f.neckHalf * 0.96;
      const neckAttachY = j.neckBase.y - hr * 0.14;

      const armGrad = ctx.createLinearGradient(neckAttachX, neckAttachY, wr.x, wr.y);
      armGrad.addColorStop(0, skin.highlight);
      armGrad.addColorStop(0.45, skin.base);
      armGrad.addColorStop(1, skin.shadow);

      function traceArmOuter() {
        ctx.moveTo(neckAttachX, neckAttachY);
        ctx.bezierCurveTo(
          rig.cx + side * f.shoulderHalf * 0.5,
          j.neckBase.y + hr * 0.08,
          sh.x + side * wTop * 0.08,
          sh.y - hr * 0.02,
          delt.x + side * wTop * 0.36,
          delt.y - hr * 0.06
        );
        ctx.bezierCurveTo(
          delt.x + side * wTop * 0.42,
          (delt.y + elb.y) * 0.5,
          elb.x + side * wMid * 0.92,
          elb.y - hr * 0.12,
          elb.x + side * wMid * 0.9,
          elb.y
        );
        ctx.bezierCurveTo(
          elb.x + side * wMid * 0.82,
          (elb.y + wr.y) * 0.5,
          wr.x + side * wBot * 0.88,
          wr.y - hr * 0.25,
          wr.x + side * wBot * 0.84,
          wr.y
        );
        ctx.quadraticCurveTo(
          wr.x + side * wBot * 0.64,
          wr.y + f.armThickness * 1.92,
          wr.x - side * wBot * 0.14,
          wr.y + f.armThickness * 2.12
        );
        ctx.quadraticCurveTo(
          wr.x - side * wBot * 0.88,
          wr.y + f.armThickness * 1.32,
          wr.x - side * wBot * 0.82,
          wr.y
        );
        ctx.bezierCurveTo(
          wr.x - side * wBot * 0.8,
          (elb.y + wr.y) * 0.5,
          elb.x - side * wMid * 0.76,
          elb.y + hr * 0.08,
          elb.x - side * wMid * 0.8,
          elb.y
        );
        ctx.bezierCurveTo(
          elb.x - side * wMid * 0.68,
          (delt.y + elb.y) * 0.5,
          rig.cx + side * f.bustHalf * 0.94,
          j.bustY - hr * 0.14,
          rig.cx + side * f.bustHalf * 0.82,
          j.bustY - hr * 0.02
        );
      }

      ctx.fillStyle = armGrad;
      ctx.beginPath();
      traceArmOuter();
      ctx.lineTo(rig.cx + side * f.neckHalf * 0.4, j.neckBase.y + hr * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = rgba(skin.shadow, 0.44);
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      traceArmOuter();
      ctx.stroke();
    }

    drawArmBehind(-1);
    drawArmBehind(1);

    // Layer B: Multi-Station Sculpted Torso (Chest -> Ribcage -> Waist -> High Hip Shelf -> Lower Hip)
    const neckHalf = f.neckHalf;
    const bodyGrad = ctx.createRadialGradient(
      rig.cx - f.bustHalf * 0.22,
      j.clavicleY + hr * 0.35,
      hr * 0.18,
      rig.cx,
      j.waistL.y,
      Math.max(f.shoulderHalf, f.hipHalf) * 2.1
    );
    bodyGrad.addColorStop(0, skin.highlight);
    bodyGrad.addColorStop(0.55, skin.base);
    bodyGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(rig.cx - neckHalf, j.chin.y - hr * 0.28);
    ctx.bezierCurveTo(
      rig.cx - neckHalf * 0.96,
      j.neckBase.y - hr * 0.14,
      rig.cx - f.shoulderHalf * 0.68,
      j.neckBase.y + hr * 0.26,
      rig.cx - f.bustHalf * 0.96,
      j.bustY - hr * 0.12
    );
    // Bust -> natural waist
    ctx.bezierCurveTo(
      rig.cx - f.bustHalf * 0.92,
      (j.bustY + j.waistL.y) * 0.54,
      j.waistL.x,
      j.waistL.y - hr * 0.14,
      j.waistL.x,
      j.waistL.y
    );
    // Natural waist -> high hip shelf -> lower hip
    ctx.bezierCurveTo(
      j.waistL.x,
      j.waistL.y + hr * 0.18,
      j.highHipL.x,
      j.highHipL.y - hr * 0.14,
      j.highHipL.x,
      j.highHipL.y
    );
    ctx.bezierCurveTo(
      j.highHipL.x,
      j.highHipL.y + hr * 0.18,
      j.hipL.x,
      j.hipL.y - hr * 0.16,
      j.hipL.x,
      j.hipL.y + f.thighHalf * 0.32
    );
    ctx.quadraticCurveTo(rig.cx, j.hipR.y + f.thighHalf * 0.78, j.hipR.x, j.hipR.y + f.thighHalf * 0.32);
    ctx.bezierCurveTo(
      j.hipR.x,
      j.hipR.y - hr * 0.16,
      j.highHipR.x,
      j.highHipR.y + hr * 0.18,
      j.highHipR.x,
      j.highHipR.y
    );
    ctx.bezierCurveTo(
      j.highHipR.x,
      j.highHipR.y - hr * 0.14,
      j.waistR.x,
      j.waistR.y + hr * 0.18,
      j.waistR.x,
      j.waistR.y
    );
    ctx.bezierCurveTo(
      j.waistR.x,
      j.waistR.y - hr * 0.14,
      rig.cx + f.bustHalf * 0.92,
      (j.bustY + j.waistR.y) * 0.54,
      rig.cx + f.bustHalf * 0.96,
      j.bustY - hr * 0.12
    );
    ctx.bezierCurveTo(
      rig.cx + f.shoulderHalf * 0.68,
      j.neckBase.y + hr * 0.26,
      rig.cx + neckHalf * 0.96,
      j.neckBase.y - hr * 0.14,
      rig.cx + neckHalf,
      j.chin.y - hr * 0.28
    );
    ctx.closePath();
    ctx.fill();

    // Subtle torso side strokes (neck sides & ribcage-to-hip curve; zero seam across shoulders)
    ctx.strokeStyle = rgba(skin.shadow, 0.45);
    ctx.lineWidth = 0.9;
    [-1, 1].forEach(function (side) {
      ctx.beginPath();
      ctx.moveTo(rig.cx + side * neckHalf, j.chin.y - hr * 0.28);
      ctx.lineTo(rig.cx + side * neckHalf * 0.96, j.neckBase.y - hr * 0.14);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rig.cx + side * f.bustHalf * 0.95, j.bustY - hr * 0.08);
      ctx.bezierCurveTo(
        rig.cx + side * f.bustHalf * 0.92,
        (j.bustY + j.waistL.y) * 0.54,
        rig.cx + side * f.waistHalf,
        j.waistL.y - hr * 0.14,
        rig.cx + side * f.waistHalf,
        j.waistL.y
      );
      ctx.bezierCurveTo(
        rig.cx + side * f.waistHalf,
        j.waistL.y + hr * 0.18,
        rig.cx + side * f.highHipHalf,
        j.highHipL.y - hr * 0.14,
        rig.cx + side * f.highHipHalf,
        j.highHipL.y
      );
      ctx.bezierCurveTo(
        rig.cx + side * f.highHipHalf,
        j.highHipL.y + hr * 0.18,
        rig.cx + side * f.hipHalf,
        j.hipL.y - hr * 0.16,
        rig.cx + side * f.hipHalf,
        j.hipL.y + f.thighHalf * 0.32
      );
      ctx.stroke();
    });

    // 4. Soft Chin Cast Shadow & Subtle Clavicle Shading
    const chinShadow = ctx.createLinearGradient(0, j.chin.y - hr * 0.1, 0, j.neckBase.y + hr * 0.24);
    chinShadow.addColorStop(0, rgba(skin.shadow, 0.6));
    chinShadow.addColorStop(1, rgba(skin.shadow, 0));
    ctx.fillStyle = chinShadow;
    ctx.beginPath();
    ctx.ellipse(rig.cx, j.chin.y + hr * 0.14, neckHalf * 0.98, hr * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = rgba(skin.shadow, 0.4);
    ctx.lineWidth = Math.max(1, hr * 0.034);
    [-1, 1].forEach(function (side) {
      ctx.beginPath();
      ctx.moveTo(rig.cx + side * hr * 0.14, j.clavicleY + hr * 0.14);
      ctx.quadraticCurveTo(
        rig.cx + side * f.shoulderHalf * 0.42,
        j.clavicleY + hr * 0.02,
        rig.cx + side * f.shoulderHalf * 0.72,
        j.clavicleY + hr * 0.14
      );
      ctx.stroke();
    });

    // Subtle soft midsection / bust under-shading so Apple vs Hourglass depth reads in 3D
    if (rig.config.sliders.waist > 1.06) {
      const bellyGrad = ctx.createRadialGradient(
        rig.cx,
        j.waistL.y + hr * 0.22,
        hr * 0.1,
        rig.cx,
        j.waistL.y + hr * 0.24,
        f.waistHalf * 0.85
      );
      bellyGrad.addColorStop(0, rgba(skin.highlight, 0.32));
      bellyGrad.addColorStop(0.65, rgba(skin.shadow, 0.08));
      bellyGrad.addColorStop(1, rgba(skin.shadow, 0.24));
      ctx.fillStyle = bellyGrad;
      ctx.beginPath();
      ctx.ellipse(rig.cx, j.waistL.y + hr * 0.24, f.waistHalf * 0.72, hr * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Symmetrical Satin Bra & High-Cut Panties (always hugs exact torso/high-hip/hip curves)
    const lingGrad = ctx.createLinearGradient(rig.cx - f.bustHalf, j.bustY, rig.cx + f.bustHalf, j.hipL.y);
    lingGrad.addColorStop(0, '#f4e6d8');
    lingGrad.addColorStop(0.5, '#fffaf4');
    lingGrad.addColorStop(1, '#dfd0c2');

    ctx.strokeStyle = 'rgba(220, 198, 175, 0.92)';
    ctx.lineWidth = Math.max(1.1, hr * 0.032);
    [-1, 1].forEach(function (side) {
      ctx.beginPath();
      ctx.moveTo(rig.cx + side * f.bustHalf * 0.56, j.bustY - hr * 0.24);
      ctx.lineTo(rig.cx + side * f.shoulderHalf * 0.5, j.neckBase.y + hr * 0.14);
      ctx.stroke();
    });

    const braTopY = j.bustY - hr * 0.26;
    const braBotY = j.bustY + hr * 0.38;
    const braHalf = f.bustHalf * 0.98;
    ctx.fillStyle = lingGrad;
    ctx.beginPath();
    ctx.moveTo(rig.cx - braHalf, braTopY + hr * 0.08);
    ctx.quadraticCurveTo(rig.cx - braHalf * 0.5, braTopY - hr * 0.18, rig.cx, braTopY + hr * 0.26);
    ctx.quadraticCurveTo(rig.cx + braHalf * 0.5, braTopY - hr * 0.18, rig.cx + braHalf, braTopY + hr * 0.08);
    ctx.lineTo(rig.cx + braHalf * 0.93, braBotY);
    ctx.quadraticCurveTo(rig.cx + braHalf * 0.45, braBotY + hr * 0.08, rig.cx, braBotY - hr * 0.02);
    ctx.quadraticCurveTo(rig.cx - braHalf * 0.45, braBotY + hr * 0.08, rig.cx - braHalf * 0.93, braBotY);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(184, 137, 56, 0.62)';
    ctx.lineWidth = Math.max(0.9, hr * 0.028);
    ctx.stroke();

    // Navel mark
    ctx.fillStyle = rgba(skin.shadow, 0.36);
    ctx.beginPath();
    ctx.ellipse(rig.cx, j.waistL.y + hr * 0.18, hr * 0.032, hr * 0.048, 0, 0, Math.PI * 2);
    ctx.fill();

    // High-Cut Satin Panties tracking high-hip & lower-hip width
    const pantTopY = j.highHipL.y - hr * 0.04;
    const pantBotY = j.hipL.y + f.thighHalf * 0.58;
    const pantTopHalf = f.highHipHalf * 0.99;
    const pantSideHalf = f.hipHalf * 0.98;
    ctx.fillStyle = lingGrad;
    ctx.beginPath();
    ctx.moveTo(rig.cx - pantTopHalf, pantTopY);
    ctx.quadraticCurveTo(rig.cx, pantTopY + hr * 0.22, rig.cx + pantTopHalf, pantTopY);
    ctx.lineTo(rig.cx + pantSideHalf, j.hipR.y + hr * 0.08);
    ctx.quadraticCurveTo(rig.cx + pantSideHalf * 0.32, j.hipR.y + f.thighHalf * 0.25, rig.cx + hr * 0.16, pantBotY);
    ctx.lineTo(rig.cx - hr * 0.16, pantBotY);
    ctx.quadraticCurveTo(rig.cx - pantSideHalf * 0.32, j.hipL.y + f.thighHalf * 0.25, rig.cx - pantSideHalf, j.hipL.y + hr * 0.08);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(184, 137, 56, 0.62)';
    ctx.lineWidth = Math.max(0.9, hr * 0.028);
    ctx.stroke();

    ctx.restore();
  }

  window.CrownBodies = {
    BODY_TYPES: BODY_TYPES,
    AGE_LOOKS: AGE_LOOKS,
    SLIDER_LIMITS: SLIDER_LIMITS,
    createDefaultBody: createDefaultBody,
    clampBody: clampBody,
    computeRig: computeRig,
    drawBaseBody: drawBaseBody,
  };
})();
