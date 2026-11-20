(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  const OUTFITS = [
    {
      id: 'versailles-ivory-gown',
      category: 'gowns',
      label: 'Versailles Ivory Corset',
      desc: 'Off-shoulder gilded corset with pleated ballgown skirt',
      defaultTheme: 'ivory-gold',
    },
    {
      id: 'riviera-sky-gown',
      category: 'gowns',
      label: 'Riviera Sky Ballgown',
      desc: 'Lace-up sweetheart bodice, fitted sleeves & draped overskirt',
      defaultTheme: 'riviera-sky',
    },
    {
      id: 'imperial-gold-crimson',
      category: 'gowns',
      label: 'Imperial Brocade & Cape',
      desc: 'Sculpted metallic brocade slit gown with crimson opera sleeves',
      defaultTheme: 'imperial-crimson',
    },
    {
      id: 'rose-velvet-gala',
      category: 'gowns',
      label: 'Grand Gala Mermaid',
      desc: 'Velvet sweetheart corset with satin sash & floor train',
      defaultTheme: 'blush-rose',
    },
    {
      id: 'midnight-opera-slip',
      category: 'gowns',
      label: 'Opera Satin Column',
      desc: 'Bias-cut silk column gown with draped cowl neckline',
      defaultTheme: 'midnight-sapphire',
    },
    {
      id: 'riviera-resort-midi',
      category: 'casual',
      label: 'Riviera Promenade Midi',
      desc: 'Sunlit ruched sundress with belted waist & breezy skirt',
      defaultTheme: 'riviera-sky',
    },
    {
      id: 'parisian-trench-chic',
      category: 'casual',
      label: 'Parisian Street Chic',
      desc: 'Silk camisole tucked into tailored high-waist trousers & jacket',
      defaultTheme: 'noir-satin',
    },
    {
      id: 'riviera-crop-skirt',
      category: 'casual',
      label: 'Riviera Knit & Midi Skirt',
      desc: 'Fitted bateau knit top paired with flowing A-line skirt',
      defaultTheme: 'blush-rose',
    },
    {
      id: 'equestrian-tailored',
      category: 'casual',
      label: 'Palace Equestrian Suit',
      desc: 'Tailored riding jacket with gold buttons & fitted breeches',
      defaultTheme: 'noir-satin',
    },
    {
      id: 'silk-robe-pajamas',
      category: 'pajamas',
      label: 'Silk Lounge Pajamas',
      desc: 'Satin camisole & piped royal lounge shorts',
      defaultTheme: 'blush-rose',
    },
    {
      id: 'lace-nightgown',
      category: 'pajamas',
      label: 'Satin & Lace Chemise',
      desc: 'Delicate knee-length satin nightgown with lace trim',
      defaultTheme: 'ivory-gold',
    },
    {
      id: 'velvet-morning-robe',
      category: 'pajamas',
      label: 'Belted Silk Morning Robe',
      desc: 'Draped palace robe over satin loungewear',
      defaultTheme: 'crimson-velvet',
    },
    {
      id: 'foundation-slip',
      category: 'lingerie',
      label: 'Bra & Panties (Body Check)',
      desc: 'Clean two-piece satin foundation to evaluate body curves',
      defaultTheme: 'ivory-gold',
    },
  ];

  const COLOR_THEMES = [
    { id: 'signature', label: 'Signature Couture', primary: '#ece7e1', secondary: '#c9a34c', accent: '#2e5ea8', trim: '#f8f2e6' },
    { id: 'ivory-gold', label: 'Ivory & Gold', primary: '#ece8e2', secondary: '#cfa74e', accent: '#2b5ea8', trim: '#fffaf2' },
    { id: 'riviera-sky', label: 'Riviera Sky', primary: '#63a4c9', secondary: '#d8b664', accent: '#3d7fa8', trim: '#f5ede2' },
    { id: 'imperial-crimson', label: 'Imperial Gold & Crimson', primary: '#d2ae58', secondary: '#911d2c', accent: '#b82538', trim: '#f5efe4' },
    { id: 'crimson-velvet', label: 'Crimson Velvet', primary: '#8c1d30', secondary: '#d4af55', accent: '#d99a9e', trim: '#f7ece6' },
    { id: 'court-emerald', label: 'Court Emerald', primary: '#1e634c', secondary: '#d4af55', accent: '#8ad4b5', trim: '#f4efe2' },
    { id: 'midnight-sapphire', label: 'Midnight Sapphire', primary: '#21355c', secondary: '#cfd7e8', accent: '#4d7ad1', trim: '#eaeff8' },
    { id: 'blush-rose', label: 'Versailles Rose', primary: '#c77087', secondary: '#d8b468', accent: '#f3cad5', trim: '#fff6f5' },
    { id: 'noir-satin', label: 'Noir & Champagne', primary: '#252026', secondary: '#d4af55', accent: '#9d7d43', trim: '#f4ebe1' },
  ];

  let activeCategory = 'all';

  function findById(list, id, fallbackIdx) {
    return (
      list.find(function (item) {
        return item.id === id;
      }) || list[fallbackIdx || 0]
    );
  }

  function hexToRgb(hex) {
    const clean = String(hex || '#d4af55').replace('#', '');
    if (clean.length !== 6) return { r: 212, g: 175, b: 85 };
    return {
      r: parseInt(clean.slice(0, 2), 16) || 0,
      g: parseInt(clean.slice(2, 4), 16) || 0,
      b: parseInt(clean.slice(4, 6), 16) || 0,
    };
  }

  function mixHex(hexA, hexB, t) {
    const ratio = Math.max(0, Math.min(1, Number(t) || 0));
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    function part(v) {
      return Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
    }
    return '#' + part(a.r + (b.r - a.r) * ratio) + part(a.g + (b.g - a.g) * ratio) + part(a.b + (b.b - a.b) * ratio);
  }

  function rgba(hex, alpha) {
    const c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + Math.max(0, Math.min(1, alpha)).toFixed(3) + ')';
  }

  function clampWardrobe(raw) {
    const src = raw || {};
    const id = src.outfitId === 'foundation-lingerie' ? 'foundation-slip' : src.outfitId;
    const outfit = findById(OUTFITS, id, 0);
    const theme = findById(COLOR_THEMES, src.themeId, 0);
    return {
      outfitId: outfit.id,
      themeId: theme.id,
    };
  }

  function createDefaultWardrobe() {
    return clampWardrobe({
      outfitId: 'versailles-ivory-gown',
      themeId: 'signature',
    });
  }

  function resolveColors(outfit, themeId) {
    const effectiveThemeId = themeId === 'signature' ? outfit.defaultTheme : themeId;
    const t = findById(COLOR_THEMES, effectiveThemeId, 1);
    return {
      primary: t.primary,
      primaryDark: mixHex(t.primary, '#1a1216', 0.36),
      primaryLight: mixHex(t.primary, '#ffffff', 0.38),
      secondary: t.secondary,
      secondaryDark: mixHex(t.secondary, '#2d1c08', 0.42),
      secondaryLight: mixHex(t.secondary, '#fff7dc', 0.5),
      accent: t.accent,
      trim: t.trim,
    };
  }

  /**
   * Traces the shared body-fitted corset bodice contour strictly from rig joints & fit metrics.
   */
  function traceFittedBodice(ctx, rig, topY, centerDipY, pad) {
    const j = rig.joints;
    const f = rig.fit;
    const bustW = f.bustHalf + pad;
    const waistW = f.waistHalf + pad;
    const cx = rig.cx;

    ctx.beginPath();
    ctx.moveTo(cx - bustW, topY);
    ctx.quadraticCurveTo(cx - bustW * 0.45, topY - rig.headR * 0.14, cx, centerDipY);
    ctx.quadraticCurveTo(cx + bustW * 0.45, topY - rig.headR * 0.14, cx + bustW, topY);
    ctx.bezierCurveTo(
      cx + bustW * 0.96,
      (topY + j.waistR.y) * 0.56,
      cx + waistW,
      j.waistR.y - rig.headR * 0.1,
      cx + waistW,
      j.waistR.y + pad * 0.5
    );
    ctx.quadraticCurveTo(cx + waistW * 0.45, j.waistR.y + rig.headR * 0.38, cx, j.waistR.y + rig.headR * 0.56);
    ctx.quadraticCurveTo(cx - waistW * 0.45, j.waistL.y + rig.headR * 0.38, cx - waistW, j.waistL.y + pad * 0.5);
    ctx.bezierCurveTo(
      cx - waistW,
      j.waistL.y - rig.headR * 0.1,
      cx - bustW * 0.96,
      (topY + j.waistL.y) * 0.56,
      cx - bustW,
      topY
    );
    ctx.closePath();
  }

  /**
   * Draws an anatomical sleeve hugging from upper arm/deltoid down to wrist or elbow.
   */
  function drawFittedSleeve(ctx, rig, side, startFrac, endFrac, fillStyle, borderHex, cuffTrimHex) {
    const j = rig.joints;
    const f = rig.fit;
    const hr = rig.headR;
    const sh = side < 0 ? j.shoulderL : j.shoulderR;
    const delt = side < 0 ? j.deltoidL : j.deltoidR;
    const elb = side < 0 ? j.elbowL : j.elbowR;
    const wr = side < 0 ? j.wristL : j.wristR;

    const wTop = f.armThickness * 1.02;
    const wMid = f.armThickness * 0.86;
    const wBot = f.armThickness * 0.58;

    const topOuterX = delt.x + side * wTop * 0.44;
    const topOuterY = sh.y + (delt.y - sh.y) * startFrac;
    const topInnerX = rig.cx + side * f.bustHalf * 0.96;
    const topInnerY = j.bustY - hr * 0.06;

    const endX = elb.x + (wr.x - elb.x) * endFrac;
    const endY = elb.y + (wr.y - elb.y) * endFrac;
    const endHalf = wMid + (wBot - wMid) * endFrac;

    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(topOuterX, topOuterY);
    ctx.bezierCurveTo(
      delt.x + side * wTop * 0.46,
      (topOuterY + elb.y) * 0.5,
      elb.x + side * wMid * 0.98,
      elb.y - hr * 0.1,
      elb.x + side * wMid * 0.96,
      elb.y
    );
    if (endFrac > 0.05) {
      ctx.bezierCurveTo(
        elb.x + side * wMid * 0.9,
        (elb.y + endY) * 0.5,
        endX + side * endHalf * 0.96,
        endY - hr * 0.15,
        endX + side * endHalf * 0.94,
        endY
      );
      ctx.lineTo(endX - side * endHalf * 0.9, endY);
      ctx.bezierCurveTo(
        endX - side * endHalf * 0.88,
        (elb.y + endY) * 0.5,
        elb.x - side * wMid * 0.82,
        elb.y + hr * 0.06,
        elb.x - side * wMid * 0.84,
        elb.y
      );
    } else {
      ctx.lineTo(elb.x - side * wMid * 0.84, elb.y);
    }
    ctx.bezierCurveTo(
      elb.x - side * wMid * 0.72,
      (delt.y + elb.y) * 0.5,
      topInnerX,
      topInnerY + hr * 0.1,
      topInnerX,
      topInnerY
    );
    ctx.quadraticCurveTo((topOuterX + topInnerX) * 0.5, topOuterY - hr * 0.1, topOuterX, topOuterY);
    ctx.closePath();
    ctx.fill();

    if (borderHex) {
      ctx.strokeStyle = borderHex;
      ctx.lineWidth = Math.max(0.9, hr * 0.028);
      ctx.stroke();
    }

    if (cuffTrimHex) {
      ctx.strokeStyle = cuffTrimHex;
      ctx.lineWidth = Math.max(1.4, hr * 0.052);
      ctx.beginPath();
      ctx.moveTo(endX - side * endHalf * 0.92, endY);
      ctx.lineTo(endX + side * endHalf * 0.94, endY);
      ctx.stroke();
    }
  }

  /**
   * Draws smooth downward-draped off-shoulder bands hugging the upper arm curves without pointed horns.
   */
  function drawOffShoulderBands(ctx, rig, topY, bandThickness, col) {
    const j = rig.joints;
    const f = rig.fit;
    const hr = rig.headR;

    [-1, 1].forEach(function (side) {
      const innerX = rig.cx + side * f.bustHalf * 0.95;
      const innerY = topY + hr * 0.02;
      const outerX = (side < 0 ? j.deltoidL.x : j.deltoidR.x) + side * f.armThickness * 0.34;
      const outerY = j.deltoidL.y + hr * 0.14;

      const bandGrad = ctx.createLinearGradient(innerX, innerY, outerX, outerY + bandThickness);
      bandGrad.addColorStop(0, col.secondaryLight);
      bandGrad.addColorStop(0.5, col.secondary);
      bandGrad.addColorStop(1, col.secondaryDark);

      ctx.fillStyle = bandGrad;
      ctx.beginPath();
      ctx.moveTo(innerX, innerY);
      ctx.quadraticCurveTo((innerX + outerX) * 0.5, innerY + hr * 0.08, outerX, outerY);
      ctx.quadraticCurveTo(outerX + side * f.armThickness * 0.08, outerY + bandThickness * 0.55, outerX - side * f.armThickness * 0.04, outerY + bandThickness * 0.95);
      ctx.quadraticCurveTo((innerX + outerX) * 0.5, innerY + bandThickness + hr * 0.08, innerX, innerY + bandThickness * 0.88);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = col.secondaryDark;
      ctx.lineWidth = Math.max(0.85, hr * 0.026);
      ctx.stroke();
    });
  }

  function drawOutfit(ctx, rig, wardrobeConfig) {
    const cfg = clampWardrobe(wardrobeConfig);
    if (cfg.outfitId === 'foundation-slip') return; // Shows clean Bra & Panties from bodies.js!

    const outfit = findById(OUTFITS, cfg.outfitId, 0);
    const col = resolveColors(outfit, cfg.themeId);
    const j = rig.joints;
    const f = rig.fit;
    const hr = rig.headR;
    const cx = rig.cx;
    const pad = Math.max(1.4, hr * 0.042);

    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const topY = j.bustY - hr * 0.24;
    const centerDipY = j.bustY + hr * 0.16;
    const highHipW = Math.max(f.highHipHalf, f.hipHalf * 0.92) + pad;
    const lowerHipW = Math.max(f.hipHalf, f.highHipHalf * 0.94) + pad;
    const skirtHipMax = Math.max(f.hipHalf, f.highHipHalf);

    // ---------------------------------------------------------
    // 1. VERSAILLES IVORY CORSETED BALLGOWN
    // ---------------------------------------------------------
    if (cfg.outfitId === 'versailles-ivory-gown') {
      [-1, 1].forEach(function (side) {
        const armOuterX = (side < 0 ? j.deltoidL.x : j.deltoidR.x) + side * f.armThickness * 0.36;
        const armOuterY = j.deltoidL.y + hr * 0.18;
        const elbX = (side < 0 ? j.elbowL.x : j.elbowR.x) + side * f.armThickness * 0.52;
        const skirtSideX = cx + side * (skirtHipMax * 1.58);
        const drapeBotY = j.kneeL.y + hr * 1.45;

        const capeGrad = ctx.createLinearGradient(armOuterX, armOuterY, skirtSideX, drapeBotY);
        capeGrad.addColorStop(0, rgba(col.primaryLight, 0.92));
        capeGrad.addColorStop(0.55, rgba(col.primary, 0.78));
        capeGrad.addColorStop(1, rgba(col.primaryDark, 0.45));

        ctx.fillStyle = capeGrad;
        ctx.beginPath();
        ctx.moveTo(cx + side * f.bustHalf * 0.95, topY + hr * 0.18);
        ctx.lineTo(armOuterX, armOuterY);
        ctx.quadraticCurveTo(elbX + side * hr * 0.52, j.waistL.y + hr * 0.6, skirtSideX, drapeBotY);
        ctx.quadraticCurveTo(cx + side * skirtHipMax * 1.15, drapeBotY + hr * 0.2, cx + side * f.waistHalf, j.waistL.y);
        ctx.closePath();
        ctx.fill();
      });

      const skirtBotY = rig.baseY - hr * 0.15;
      const skirtFlareX = Math.max(skirtHipMax * 1.85, f.shoulderHalf * 1.48);
      const skirtGrad = ctx.createLinearGradient(cx - skirtFlareX, j.waistL.y, cx + skirtFlareX, skirtBotY);
      skirtGrad.addColorStop(0, col.primaryDark);
      skirtGrad.addColorStop(0.28, col.primary);
      skirtGrad.addColorStop(0.52, col.primaryLight);
      skirtGrad.addColorStop(0.76, col.primary);
      skirtGrad.addColorStop(1, col.primaryDark);

      ctx.fillStyle = skirtGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.waistHalf - pad, j.waistL.y + pad * 0.4);
      ctx.bezierCurveTo(cx - Math.max(highHipW, skirtHipMax * 1.38), j.highHipL.y, cx - skirtFlareX * 1.02, j.kneeL.y, cx - skirtFlareX, skirtBotY);
      ctx.quadraticCurveTo(cx, skirtBotY + hr * 0.45, cx + skirtFlareX, skirtBotY);
      ctx.bezierCurveTo(cx + skirtFlareX * 1.02, j.kneeR.y, cx + Math.max(highHipW, skirtHipMax * 1.38), j.highHipR.y, cx + f.waistHalf + pad, j.waistR.y + pad * 0.4);
      ctx.quadraticCurveTo(cx, j.waistR.y + hr * 0.58, cx - f.waistHalf - pad, j.waistL.y + pad * 0.4);
      ctx.closePath();
      ctx.fill();

      for (let p = -5; p <= 5; p++) {
        if (p === 0) continue;
        const topFrac = p / 6;
        const botFrac = p / 5.4;
        ctx.strokeStyle = p % 2 === 0 ? rgba(col.primaryDark, 0.34) : rgba(col.trim, 0.35);
        ctx.lineWidth = Math.max(1.2, hr * 0.045);
        ctx.beginPath();
        ctx.moveTo(cx + topFrac * f.waistHalf * 0.92, j.waistL.y + hr * 0.42);
        ctx.quadraticCurveTo(cx + botFrac * skirtHipMax * 1.25, j.kneeL.y, cx + botFrac * skirtFlareX * 0.92, skirtBotY + hr * 0.08);
        ctx.stroke();
      }

      ctx.strokeStyle = col.secondary;
      ctx.lineWidth = Math.max(2, hr * 0.075);
      ctx.beginPath();
      ctx.moveTo(cx - skirtFlareX * 0.98, skirtBotY - hr * 0.08);
      ctx.quadraticCurveTo(cx, skirtBotY + hr * 0.36, cx + skirtFlareX * 0.98, skirtBotY - hr * 0.08);
      ctx.stroke();

      const bodiceGrad = ctx.createLinearGradient(cx - f.bustHalf, topY, cx + f.bustHalf, j.waistL.y);
      bodiceGrad.addColorStop(0, col.primary);
      bodiceGrad.addColorStop(0.45, col.primaryLight);
      bodiceGrad.addColorStop(1, col.primaryDark);
      ctx.fillStyle = bodiceGrad;
      traceFittedBodice(ctx, rig, topY, centerDipY, pad);
      ctx.fill();

      ctx.strokeStyle = col.secondary;
      ctx.lineWidth = Math.max(1.8, hr * 0.075);
      traceFittedBodice(ctx, rig, topY, centerDipY, pad);
      ctx.stroke();

      ctx.strokeStyle = rgba(col.secondary, 0.85);
      ctx.lineWidth = Math.max(1.1, hr * 0.036);
      [-0.48, 0.48].forEach(function (frac) {
        ctx.beginPath();
        ctx.moveTo(cx + frac * f.bustHalf * 0.78, topY + hr * 0.16);
        ctx.quadraticCurveTo(cx + frac * f.waistHalf * 0.75, (topY + j.waistL.y) * 0.58, cx + frac * f.waistHalf * 0.55, j.waistL.y + hr * 0.32);
        ctx.stroke();
      });

      drawOffShoulderBands(ctx, rig, topY + hr * 0.08, hr * 0.26, col);

      const broochY = topY + hr * 0.42;
      ctx.fillStyle = col.secondary;
      ctx.beginPath();
      ctx.ellipse(cx, broochY, hr * 0.16, hr * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = col.accent;
      ctx.beginPath();
      ctx.ellipse(cx, broochY, hr * 0.1, hr * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.beginPath();
      ctx.arc(cx - hr * 0.03, broochY - hr * 0.05, hr * 0.035, 0, Math.PI * 2);
      ctx.fill();

    // ---------------------------------------------------------
    // 2. RIVIERA SKY LACE-UP BALLGOWN
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'riviera-sky-gown') {
      const skirtBotY = rig.baseY - hr * 0.1;
      const skirtFlareX = Math.max(skirtHipMax * 1.9, f.shoulderHalf * 1.54);

      const pettiGrad = ctx.createLinearGradient(cx - skirtFlareX, j.waistL.y, cx + skirtFlareX, skirtBotY);
      pettiGrad.addColorStop(0, mixHex(col.trim, '#3d2c28', 0.18));
      pettiGrad.addColorStop(0.5, col.trim);
      pettiGrad.addColorStop(1, mixHex(col.trim, '#3d2c28', 0.22));

      ctx.fillStyle = pettiGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.waistHalf - pad, j.waistL.y + pad * 0.5);
      ctx.bezierCurveTo(cx - Math.max(highHipW, skirtHipMax * 1.35), j.highHipL.y, cx - skirtFlareX, j.kneeL.y, cx - skirtFlareX * 0.96, skirtBotY);
      ctx.quadraticCurveTo(cx, skirtBotY + hr * 0.42, cx + skirtFlareX * 0.96, skirtBotY);
      ctx.bezierCurveTo(cx + skirtFlareX, j.kneeR.y, cx + Math.max(highHipW, skirtHipMax * 1.35), j.highHipR.y, cx + f.waistHalf + pad, j.waistR.y + pad * 0.5);
      ctx.closePath();
      ctx.fill();

      for (let p = -4; p <= 4; p++) {
        ctx.strokeStyle = rgba('#8c7566', 0.26);
        ctx.lineWidth = Math.max(1.0, hr * 0.035);
        ctx.beginPath();
        ctx.moveTo(cx + (p / 5) * f.waistHalf * 0.65, j.hipL.y);
        ctx.lineTo(cx + (p / 4.5) * skirtFlareX * 0.85, skirtBotY + hr * 0.08);
        ctx.stroke();
      }

      const overGrad = ctx.createLinearGradient(cx - skirtFlareX, j.waistL.y, cx + skirtFlareX, skirtBotY);
      overGrad.addColorStop(0, col.primaryDark);
      overGrad.addColorStop(0.5, col.primaryLight);
      overGrad.addColorStop(1, col.primaryDark);
      ctx.fillStyle = overGrad;

      [-1, 1].forEach(function (side) {
        ctx.beginPath();
        ctx.moveTo(cx + side * f.waistHalf * 0.15, j.waistL.y + hr * 0.45);
        ctx.lineTo(cx + side * (f.waistHalf + pad), j.waistL.y + pad * 0.4);
        ctx.bezierCurveTo(cx + side * Math.max(highHipW, skirtHipMax * 1.48), j.highHipL.y, cx + side * skirtFlareX * 1.04, j.kneeL.y + hr * 0.3, cx + side * skirtFlareX * 1.02, skirtBotY - hr * 0.55);
        ctx.quadraticCurveTo(cx + side * skirtHipMax * 1.12, j.kneeL.y + hr * 0.65, cx + side * f.waistHalf * 0.15, j.waistL.y + hr * 0.45);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = col.secondary;
        ctx.lineWidth = Math.max(1.6, hr * 0.055);
        ctx.stroke();
      });

      const sleeveGrad = ctx.createLinearGradient(j.shoulderL.x, j.shoulderL.y, j.wristR.x, j.wristR.y);
      sleeveGrad.addColorStop(0, col.primaryLight);
      sleeveGrad.addColorStop(0.55, col.primary);
      sleeveGrad.addColorStop(1, col.primaryDark);
      drawFittedSleeve(ctx, rig, -1, 0.08, 0.94, sleeveGrad, col.primaryDark, col.secondary);
      drawFittedSleeve(ctx, rig, 1, 0.08, 0.94, sleeveGrad, col.primaryDark, col.secondary);

      const bodiceGrad = ctx.createLinearGradient(cx - f.bustHalf, topY, cx + f.bustHalf, j.waistL.y);
      bodiceGrad.addColorStop(0, col.primary);
      bodiceGrad.addColorStop(0.5, col.primaryLight);
      bodiceGrad.addColorStop(1, col.primaryDark);
      ctx.fillStyle = bodiceGrad;
      traceFittedBodice(ctx, rig, topY, centerDipY, pad);
      ctx.fill();

      ctx.strokeStyle = col.secondary;
      ctx.lineWidth = Math.max(1.6, hr * 0.06);
      traceFittedBodice(ctx, rig, topY, centerDipY, pad);
      ctx.stroke();

      ctx.strokeStyle = col.secondaryLight;
      ctx.lineWidth = Math.max(1.1, hr * 0.032);
      for (let i = 0; i < 4; i++) {
        const y0 = centerDipY + hr * 0.18 + i * hr * 0.28;
        const y1 = y0 + hr * 0.24;
        const w = hr * 0.16;
        ctx.beginPath();
        ctx.moveTo(cx - w, y0);
        ctx.lineTo(cx + w, y1);
        ctx.moveTo(cx + w, y0);
        ctx.lineTo(cx - w, y1);
        ctx.stroke();
      }

      drawOffShoulderBands(ctx, rig, topY + hr * 0.06, hr * 0.24, col);

    // ---------------------------------------------------------
    // 3. IMPERIAL GOLD BROCADE & CRIMSON CAPE GOWN
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'imperial-gold-crimson') {
      const skirtBotY = rig.baseY - hr * 0.12;
      const capeSpread = Math.max(skirtHipMax * 1.72, f.shoulderHalf * 1.42);

      [-1, 1].forEach(function (side) {
        const shX = (side < 0 ? j.shoulderL.x : j.shoulderR.x) + side * f.armThickness * 0.22;
        const shY = j.shoulderL.y + hr * 0.14;
        const outerX = cx + side * capeSpread;

        ctx.fillStyle = col.secondary;
        ctx.beginPath();
        ctx.moveTo(cx + side * f.bustHalf * 0.9, topY + hr * 0.1);
        ctx.lineTo(shX, shY);
        ctx.bezierCurveTo(outerX * 1.01, j.elbowL.y, outerX, j.kneeL.y, outerX * 0.95, skirtBotY);
        ctx.lineTo(cx + side * skirtHipMax * 0.9, skirtBotY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = col.primary;
        ctx.lineWidth = Math.max(2, hr * 0.07);
        ctx.stroke();
      });

      ctx.fillStyle = col.trim;
      ctx.beginPath();
      ctx.moveTo(cx - skirtHipMax * 0.72, j.hipL.y);
      ctx.lineTo(cx - skirtHipMax * 1.05, skirtBotY);
      ctx.quadraticCurveTo(cx, skirtBotY + hr * 0.28, cx + skirtHipMax * 1.05, skirtBotY);
      ctx.lineTo(cx + skirtHipMax * 0.72, j.hipR.y);
      ctx.closePath();
      ctx.fill();

      const brocadeGrad = ctx.createLinearGradient(cx - skirtHipMax, topY, cx + skirtHipMax, skirtBotY);
      brocadeGrad.addColorStop(0, col.primaryDark);
      brocadeGrad.addColorStop(0.38, col.primaryLight);
      brocadeGrad.addColorStop(0.68, col.primary);
      brocadeGrad.addColorStop(1, col.primaryDark);

      ctx.fillStyle = brocadeGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.bustHalf - pad, topY);
      ctx.quadraticCurveTo(cx - f.bustHalf * 0.45, topY - hr * 0.14, cx, centerDipY);
      ctx.quadraticCurveTo(cx + f.bustHalf * 0.45, topY - hr * 0.14, cx + f.bustHalf + pad, topY);
      ctx.bezierCurveTo(cx + f.bustHalf, (topY + j.waistR.y) * 0.55, cx + f.waistHalf + pad, j.waistR.y, cx + f.waistHalf + pad, j.waistR.y);
      ctx.bezierCurveTo(cx + highHipW, j.waistR.y + hr * 0.18, cx + highHipW, j.highHipR.y, cx + lowerHipW, j.hipR.y);
      ctx.bezierCurveTo(cx + lowerHipW, j.hipR.y + hr * 0.4, cx + skirtHipMax * 1.1, j.kneeR.y, cx + skirtHipMax * 1.15, skirtBotY);
      ctx.lineTo(cx + skirtHipMax * 0.25, skirtBotY);
      ctx.quadraticCurveTo(cx + skirtHipMax * 0.58, j.kneeR.y - hr * 0.6, cx + skirtHipMax * 0.28, j.hipR.y + hr * 0.85);
      ctx.quadraticCurveTo(cx - skirtHipMax * 0.2, j.kneeL.y + hr * 0.8, cx - skirtHipMax * 1.15, skirtBotY);
      ctx.bezierCurveTo(cx - skirtHipMax * 1.1, j.kneeL.y, cx - lowerHipW, j.hipL.y + hr * 0.4, cx - lowerHipW, j.hipL.y);
      ctx.bezierCurveTo(cx - highHipW, j.highHipL.y, cx - highHipW, j.waistL.y + hr * 0.18, cx - f.waistHalf - pad, j.waistL.y);
      ctx.bezierCurveTo(cx - f.waistHalf - pad, j.waistL.y, cx - f.bustHalf, (topY + j.waistL.y) * 0.55, cx - f.bustHalf - pad, topY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = col.primaryDark;
      ctx.lineWidth = Math.max(1.4, hr * 0.048);
      ctx.stroke();

      ctx.fillStyle = col.accent;
      ctx.beginPath();
      ctx.ellipse(cx, j.hipL.y + hr * 0.35, hr * 0.12, hr * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = col.primaryLight;
      ctx.lineWidth = Math.max(1, hr * 0.03);
      ctx.stroke();

      drawOffShoulderBands(ctx, rig, topY + hr * 0.05, hr * 0.24, col);

    // ---------------------------------------------------------
    // 4. GRAND GALA MERMAID VELVET GOWN
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'rose-velvet-gala') {
      const skirtBotY = rig.baseY - hr * 0.12;
      const flareX = skirtHipMax * 1.56;
      const gGrad = ctx.createLinearGradient(cx - flareX, topY, cx + flareX, skirtBotY);
      gGrad.addColorStop(0, col.primaryDark);
      gGrad.addColorStop(0.45, col.primary);
      gGrad.addColorStop(0.65, col.primaryLight);
      gGrad.addColorStop(1, col.primaryDark);

      ctx.fillStyle = gGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.bustHalf - pad, topY);
      ctx.quadraticCurveTo(cx - f.bustHalf * 0.4, topY - hr * 0.15, cx, centerDipY);
      ctx.quadraticCurveTo(cx + f.bustHalf * 0.4, topY - hr * 0.15, cx + f.bustHalf + pad, topY);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y);
      ctx.bezierCurveTo(cx + highHipW, j.waistR.y + hr * 0.18, cx + highHipW, j.highHipR.y, cx + lowerHipW, j.hipR.y);
      ctx.bezierCurveTo(cx + lowerHipW, j.hipR.y + hr * 0.3, cx + f.hipHalf * 0.88, j.kneeR.y - hr * 0.2, cx + flareX, skirtBotY);
      ctx.quadraticCurveTo(cx, skirtBotY + hr * 0.4, cx - flareX, skirtBotY);
      ctx.bezierCurveTo(cx - f.hipHalf * 0.88, j.kneeL.y - hr * 0.2, cx - lowerHipW, j.hipL.y + hr * 0.3, cx - lowerHipW, j.hipL.y);
      ctx.bezierCurveTo(cx - highHipW, j.highHipL.y, cx - highHipW, j.waistL.y + hr * 0.18, cx - f.waistHalf - pad, j.waistL.y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = col.secondary;
      ctx.fillRect(cx - f.waistHalf - pad, j.waistL.y - hr * 0.14, (f.waistHalf + pad) * 2, hr * 0.28);

      drawOffShoulderBands(ctx, rig, topY + hr * 0.08, hr * 0.24, col);

    // ---------------------------------------------------------
    // 5. OPERA LIQUID SATIN COLUMN GOWN
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'midnight-opera-slip') {
      const skirtBotY = rig.baseY - hr * 0.14;
      const colGrad = ctx.createLinearGradient(cx - skirtHipMax, topY, cx + skirtHipMax, skirtBotY);
      colGrad.addColorStop(0, col.primaryDark);
      colGrad.addColorStop(0.42, col.primaryLight);
      colGrad.addColorStop(0.68, col.primary);
      colGrad.addColorStop(1, col.primaryDark);

      ctx.strokeStyle = col.secondary;
      ctx.lineWidth = Math.max(1.2, hr * 0.042);
      [-1, 1].forEach(function (side) {
        ctx.beginPath();
        ctx.moveTo(cx + side * f.bustHalf * 0.62, topY + hr * 0.08);
        ctx.lineTo(cx + side * f.shoulderHalf * 0.56, j.neckBase.y + hr * 0.15);
        ctx.stroke();
      });

      ctx.fillStyle = colGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.bustHalf - pad, topY + hr * 0.06);
      ctx.quadraticCurveTo(cx, topY + hr * 0.38, cx + f.bustHalf + pad, topY + hr * 0.06);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y);
      ctx.bezierCurveTo(cx + highHipW, j.waistR.y + hr * 0.18, cx + highHipW, j.highHipR.y, cx + lowerHipW, j.hipR.y);
      ctx.bezierCurveTo(cx + lowerHipW, j.hipR.y + hr * 0.35, cx + skirtHipMax * 1.05, j.kneeR.y, cx + skirtHipMax * 1.12, skirtBotY);
      ctx.quadraticCurveTo(cx, skirtBotY + hr * 0.25, cx - skirtHipMax * 1.12, skirtBotY);
      ctx.bezierCurveTo(cx - skirtHipMax * 1.05, j.kneeL.y, cx - lowerHipW, j.hipL.y + hr * 0.35, cx - lowerHipW, j.hipL.y);
      ctx.bezierCurveTo(cx - highHipW, j.highHipL.y, cx - highHipW, j.waistL.y + hr * 0.18, cx - f.waistHalf - pad, j.waistL.y);
      ctx.closePath();
      ctx.fill();

    // ---------------------------------------------------------
    // 6. CASUAL: RIVIERA PROMENADE SUNDRESS MIDI
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'riviera-resort-midi') {
      const midiY = (j.kneeL.y + j.ankleL.y) * 0.52;
      const flareX = skirtHipMax * 1.48;
      const dGrad = ctx.createLinearGradient(cx - flareX, topY, cx + flareX, midiY);
      dGrad.addColorStop(0, col.primaryDark);
      dGrad.addColorStop(0.5, col.primaryLight);
      dGrad.addColorStop(1, col.primaryDark);

      ctx.strokeStyle = col.primary;
      ctx.lineWidth = Math.max(1.8, hr * 0.068);
      [-1, 1].forEach(function (side) {
        ctx.beginPath();
        ctx.moveTo(cx + side * f.bustHalf * 0.62, topY + hr * 0.06);
        ctx.lineTo(cx + side * f.shoulderHalf * 0.54, j.neckBase.y + hr * 0.14);
        ctx.stroke();
      });

      ctx.fillStyle = dGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.bustHalf - pad, topY + hr * 0.06);
      ctx.quadraticCurveTo(cx - f.bustHalf * 0.4, topY - hr * 0.08, cx, centerDipY);
      ctx.quadraticCurveTo(cx + f.bustHalf * 0.4, topY - hr * 0.08, cx + f.bustHalf + pad, topY + hr * 0.06);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y);
      ctx.bezierCurveTo(cx + highHipW, j.waistR.y + hr * 0.18, cx + Math.max(highHipW * 1.05, skirtHipMax * 1.18), j.highHipR.y, cx + flareX, midiY);
      ctx.quadraticCurveTo(cx, midiY + hr * 0.28, cx - flareX, midiY);
      ctx.bezierCurveTo(cx - Math.max(highHipW * 1.05, skirtHipMax * 1.18), j.highHipL.y, cx - highHipW, j.waistL.y + hr * 0.18, cx - f.waistHalf - pad, j.waistL.y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = col.secondary;
      ctx.fillRect(cx - f.waistHalf - pad, j.waistL.y - hr * 0.1, (f.waistHalf + pad) * 2, hr * 0.22);

    // ---------------------------------------------------------
    // 7. CASUAL: PARISIAN STREET CHIC (Silk Cami + Trousers + Cropped Jacket)
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'parisian-trench-chic') {
      // Tailored high-waisted wide trousers tracking high-hip shelf cleanly
      [-1, 1].forEach(function (side) {
        const knee = side < 0 ? j.kneeL : j.kneeR;
        const ankle = side < 0 ? j.ankleL : j.ankleR;

        ctx.fillStyle = col.primary;
        ctx.beginPath();
        ctx.moveTo(cx, j.waistL.y);
        ctx.lineTo(cx + side * (f.waistHalf + pad), j.waistL.y);
        ctx.bezierCurveTo(cx + side * highHipW, j.waistL.y + hr * 0.18, cx + side * highHipW, j.highHipL.y, cx + side * lowerHipW, j.hipL.y);
        ctx.bezierCurveTo(cx + side * lowerHipW, j.hipL.y + hr * 0.4, knee.x + side * f.armThickness * 1.24, knee.y, ankle.x + side * f.armThickness * 0.92, ankle.y - hr * 0.15);
        ctx.lineTo(ankle.x - side * f.armThickness * 0.86, ankle.y - hr * 0.15);
        ctx.lineTo(cx + side * f.armThickness * 0.12, j.hipL.y + f.thighHalf * 0.42);
        ctx.lineTo(cx, j.waistL.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = col.primaryDark;
        ctx.lineWidth = 0.9;
        ctx.stroke();
      });

      // Silk camisole tucked into waist
      ctx.fillStyle = col.trim;
      ctx.beginPath();
      ctx.moveTo(cx - f.bustHalf * 0.94, topY + hr * 0.08);
      ctx.quadraticCurveTo(cx, topY + hr * 0.28, cx + f.bustHalf * 0.94, topY + hr * 0.08);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y);
      ctx.lineTo(cx - f.waistHalf - pad, j.waistL.y);
      ctx.closePath();
      ctx.fill();

      // Open tailored blazer sleeves + lapels
      drawFittedSleeve(ctx, rig, -1, 0, 0.9, col.primary, col.primaryDark, col.secondary);
      drawFittedSleeve(ctx, rig, 1, 0, 0.9, col.primary, col.primaryDark, col.secondary);

      [-1, 1].forEach(function (side) {
        ctx.fillStyle = col.primary;
        ctx.beginPath();
        ctx.moveTo(cx + side * f.neckHalf * 1.05, j.neckBase.y + hr * 0.08);
        ctx.bezierCurveTo(cx + side * f.shoulderHalf * 0.64, j.neckBase.y + hr * 0.25, cx + side * f.bustHalf * 1.04, j.bustY - hr * 0.2, cx + side * (f.bustHalf + pad), j.bustY);
        ctx.lineTo(cx + side * (f.waistHalf + pad), j.waistL.y + hr * 0.12);
        ctx.lineTo(cx + side * f.waistHalf * 0.36, j.waistL.y + hr * 0.12);
        ctx.lineTo(cx + side * f.neckHalf * 0.92, j.neckBase.y + hr * 0.12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = col.secondary;
        ctx.lineWidth = Math.max(1.0, hr * 0.032);
        ctx.stroke();
      });

      // Gold belt buckle
      ctx.fillStyle = col.secondary;
      ctx.fillRect(cx - f.waistHalf - pad, j.waistL.y - hr * 0.08, (f.waistHalf + pad) * 2, hr * 0.18);

    // ---------------------------------------------------------
    // 8. CASUAL: RIVIERA KNIT TOP & PLEATED MIDI SKIRT
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'riviera-crop-skirt') {
      const midiY = (j.kneeL.y + j.ankleL.y) * 0.56;
      const flareX = skirtHipMax * 1.54;

      // Flowing pleated midi skirt
      const sGrad = ctx.createLinearGradient(cx - flareX, j.waistL.y, cx + flareX, midiY);
      sGrad.addColorStop(0, col.primaryDark);
      sGrad.addColorStop(0.5, col.primary);
      sGrad.addColorStop(1, col.primaryDark);
      ctx.fillStyle = sGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.waistHalf - pad, j.waistL.y);
      ctx.quadraticCurveTo(cx, j.waistL.y + hr * 0.12, cx + f.waistHalf + pad, j.waistR.y);
      ctx.bezierCurveTo(cx + highHipW, j.waistR.y + hr * 0.18, cx + Math.max(highHipW, skirtHipMax * 1.2), j.highHipR.y, cx + flareX, midiY);
      ctx.quadraticCurveTo(cx, midiY + hr * 0.3, cx - flareX, midiY);
      ctx.bezierCurveTo(cx - Math.max(highHipW, skirtHipMax * 1.2), j.highHipL.y, cx - highHipW, j.waistL.y + hr * 0.18, cx - f.waistHalf - pad, j.waistL.y);
      ctx.closePath();
      ctx.fill();

      // Fitted cream knit top with 3/4 sleeves
      drawFittedSleeve(ctx, rig, -1, 0, 0.52, col.trim, rgba('#7d6c64', 0.35), null);
      drawFittedSleeve(ctx, rig, 1, 0, 0.52, col.trim, rgba('#7d6c64', 0.35), null);

      ctx.fillStyle = col.trim;
      ctx.beginPath();
      ctx.moveTo(cx - f.shoulderHalf * 0.65, j.neckBase.y + hr * 0.14);
      ctx.quadraticCurveTo(cx, j.clavicleY + hr * 0.22, cx + f.shoulderHalf * 0.65, j.neckBase.y + hr * 0.14);
      ctx.lineTo(cx + f.bustHalf + pad, j.bustY);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y);
      ctx.lineTo(cx - f.waistHalf - pad, j.waistL.y);
      ctx.lineTo(cx - f.bustHalf - pad, j.bustY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgba('#7d6c64', 0.35);
      ctx.lineWidth = 0.9;
      ctx.stroke();

    // ---------------------------------------------------------
    // 9. CASUAL: PALACE EQUESTRIAN TAILORED SUIT
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'equestrian-tailored') {
      [-1, 1].forEach(function (side) {
        const hipX = cx + side * f.hipHalf * 0.42;
        const outerHipX = cx + side * Math.max(f.hipHalf, f.highHipHalf * 0.96);
        const knee = side < 0 ? j.kneeL : j.kneeR;
        const ankle = side < 0 ? j.ankleL : j.ankleR;

        ctx.fillStyle = col.trim;
        ctx.beginPath();
        ctx.moveTo(hipX - f.thighHalf * 0.76, j.hipL.y - hr * 0.16);
        ctx.bezierCurveTo(
          side < 0 ? outerHipX - pad : hipX - f.thighHalf * 0.76,
          (j.hipL.y + knee.y) * 0.5,
          knee.x - f.armThickness * 1.06,
          knee.y,
          ankle.x - f.armThickness * 0.64,
          ankle.y
        );
        ctx.lineTo(ankle.x + f.armThickness * 0.64, ankle.y);
        ctx.bezierCurveTo(
          knee.x + f.armThickness * 1.06,
          knee.y,
          side > 0 ? outerHipX + pad : hipX + f.thighHalf * 0.76,
          (j.hipL.y + knee.y) * 0.5,
          hipX + f.thighHalf * 0.76,
          j.hipL.y - hr * 0.16
        );
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = rgba('#40302a', 0.3);
        ctx.lineWidth = 0.9;
        ctx.stroke();
      });

      drawFittedSleeve(ctx, rig, -1, 0, 0.96, col.primary, col.primaryDark, col.secondary);
      drawFittedSleeve(ctx, rig, 1, 0, 0.96, col.primary, col.primaryDark, col.secondary);

      ctx.fillStyle = col.trim;
      ctx.beginPath();
      ctx.moveTo(cx - f.neckHalf * 1.15, j.neckBase.y + hr * 0.08);
      ctx.lineTo(cx + f.neckHalf * 1.15, j.neckBase.y + hr * 0.08);
      ctx.lineTo(cx + f.bustHalf * 0.55, j.bustY + hr * 0.45);
      ctx.lineTo(cx - f.bustHalf * 0.55, j.bustY + hr * 0.45);
      ctx.closePath();
      ctx.fill();

      const jGrad = ctx.createLinearGradient(cx - f.bustHalf, j.neckBase.y, cx + f.bustHalf, j.hipL.y);
      jGrad.addColorStop(0, col.primaryLight);
      jGrad.addColorStop(0.5, col.primary);
      jGrad.addColorStop(1, col.primaryDark);
      ctx.fillStyle = jGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.neckHalf * 1.15, j.neckBase.y + hr * 0.08);
      ctx.bezierCurveTo(cx - f.shoulderHalf * 0.65, j.neckBase.y + hr * 0.24, cx - f.bustHalf * 1.05, j.bustY - hr * 0.25, cx - f.bustHalf - pad, j.bustY);
      ctx.lineTo(cx - f.waistHalf - pad, j.waistL.y);
      ctx.bezierCurveTo(cx - highHipW, j.waistL.y + hr * 0.16, cx - highHipW, j.highHipL.y, cx - lowerHipW, j.hipL.y + hr * 0.35);
      ctx.quadraticCurveTo(cx, j.hipL.y + hr * 0.55, cx + lowerHipW, j.hipR.y + hr * 0.35);
      ctx.bezierCurveTo(cx + highHipW, j.highHipR.y, cx + highHipW, j.waistR.y + hr * 0.16, cx + f.waistHalf + pad, j.waistR.y);
      ctx.lineTo(cx + f.bustHalf + pad, j.bustY);
      ctx.bezierCurveTo(cx + f.bustHalf * 1.05, j.bustY - hr * 0.25, cx + f.shoulderHalf * 0.65, j.neckBase.y + hr * 0.24, cx + f.neckHalf * 1.15, j.neckBase.y + hr * 0.08);
      ctx.lineTo(cx, j.bustY + hr * 0.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = col.secondary;
      for (let b = 0; b < 3; b++) {
        ctx.beginPath();
        ctx.arc(cx, j.bustY + hr * 0.68 + b * hr * 0.36, hr * 0.075, 0, Math.PI * 2);
        ctx.fill();
      }

    // ---------------------------------------------------------
    // 10. PAJAMAS: SILK LOUNGE PAJAMAS (Cami + Shorts)
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'silk-robe-pajamas') {
      const pjGrad = ctx.createLinearGradient(cx - skirtHipMax, topY, cx + skirtHipMax, j.hipL.y + f.thighHalf);
      pjGrad.addColorStop(0, col.primaryLight);
      pjGrad.addColorStop(0.55, col.primary);
      pjGrad.addColorStop(1, col.primaryDark);

      ctx.strokeStyle = col.trim;
      ctx.lineWidth = Math.max(1.2, hr * 0.036);
      [-1, 1].forEach(function (side) {
        ctx.beginPath();
        ctx.moveTo(cx + side * f.bustHalf * 0.6, topY + hr * 0.08);
        ctx.lineTo(cx + side * f.shoulderHalf * 0.54, j.neckBase.y + hr * 0.14);
        ctx.stroke();
      });

      // Silk camisole
      ctx.fillStyle = pjGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.bustHalf - pad, topY + hr * 0.08);
      ctx.quadraticCurveTo(cx, topY + hr * 0.3, cx + f.bustHalf + pad, topY + hr * 0.08);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y + hr * 0.12);
      ctx.quadraticCurveTo(cx, j.waistL.y + hr * 0.24, cx - f.waistHalf - pad, j.waistL.y + hr * 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = col.trim;
      ctx.lineWidth = Math.max(1.0, hr * 0.032);
      ctx.stroke();

      // Satin piped pajama shorts
      const shortBotY = j.hipL.y + f.thighHalf * 1.15;
      const shortOuter = Math.max(lowerHipW * 1.04, highHipW * 1.03);
      ctx.fillStyle = pjGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.waistHalf - pad, j.waistL.y + hr * 0.15);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y + hr * 0.15);
      ctx.bezierCurveTo(cx + highHipW * 1.04, j.highHipR.y, cx + shortOuter * 1.08, j.hipR.y, cx + shortOuter * 1.04, shortBotY);
      ctx.lineTo(cx + hr * 0.14, shortBotY);
      ctx.lineTo(cx, j.hipL.y + f.thighHalf * 0.52);
      ctx.lineTo(cx - hr * 0.14, shortBotY);
      ctx.lineTo(cx - shortOuter * 1.04, shortBotY);
      ctx.bezierCurveTo(cx - shortOuter * 1.08, j.hipL.y, cx - highHipW * 1.04, j.highHipL.y, cx - f.waistHalf - pad, j.waistL.y + hr * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = col.trim;
      ctx.stroke();

    // ---------------------------------------------------------
    // 11. PAJAMAS: SATIN & LACE CHEMISE NIGHTGOWN
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'lace-nightgown') {
      const hemY = (j.hipL.y + j.kneeL.y) * 0.54;
      const flareX = skirtHipMax * 1.24;
      const nGrad = ctx.createLinearGradient(cx - flareX, topY, cx + flareX, hemY);
      nGrad.addColorStop(0, col.primaryLight);
      nGrad.addColorStop(0.5, col.primary);
      nGrad.addColorStop(1, col.primaryDark);

      ctx.strokeStyle = col.secondary;
      ctx.lineWidth = Math.max(1.1, hr * 0.032);
      [-1, 1].forEach(function (side) {
        ctx.beginPath();
        ctx.moveTo(cx + side * f.bustHalf * 0.6, topY + hr * 0.06);
        ctx.lineTo(cx + side * f.shoulderHalf * 0.54, j.neckBase.y + hr * 0.14);
        ctx.stroke();
      });

      ctx.fillStyle = nGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.bustHalf - pad, topY + hr * 0.08);
      ctx.quadraticCurveTo(cx, centerDipY + hr * 0.08, cx + f.bustHalf + pad, topY + hr * 0.08);
      ctx.lineTo(cx + f.waistHalf + pad, j.waistR.y);
      ctx.bezierCurveTo(cx + highHipW, j.highHipR.y, cx + flareX, j.hipR.y + hr * 0.3, cx + flareX, hemY);
      ctx.quadraticCurveTo(cx, hemY + hr * 0.24, cx - flareX, hemY);
      ctx.bezierCurveTo(cx - flareX, j.hipL.y + hr * 0.3, cx - highHipW, j.highHipL.y, cx - f.waistHalf - pad, j.waistL.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = col.trim;
      ctx.lineWidth = Math.max(1.6, hr * 0.055);
      ctx.beginPath();
      ctx.moveTo(cx - flareX, hemY);
      ctx.quadraticCurveTo(cx, hemY + hr * 0.24, cx + flareX, hemY);
      ctx.stroke();

    // ---------------------------------------------------------
    // 12. PAJAMAS: BELTED SILK MORNING ROBE
    // ---------------------------------------------------------
    } else if (cfg.outfitId === 'velvet-morning-robe') {
      const hemY = j.kneeL.y + hr * 0.45;
      const flareX = skirtHipMax * 1.38;
      const rGrad = ctx.createLinearGradient(cx - flareX, j.neckBase.y, cx + flareX, hemY);
      rGrad.addColorStop(0, col.primaryDark);
      rGrad.addColorStop(0.5, col.primary);
      rGrad.addColorStop(1, col.primaryDark);

      drawFittedSleeve(ctx, rig, -1, 0, 0.72, col.primary, col.primaryDark, col.secondary);
      drawFittedSleeve(ctx, rig, 1, 0, 0.72, col.primary, col.primaryDark, col.secondary);

      ctx.fillStyle = rGrad;
      ctx.beginPath();
      ctx.moveTo(cx - f.neckHalf * 1.1, j.neckBase.y + hr * 0.1);
      ctx.bezierCurveTo(cx - f.shoulderHalf * 0.65, j.neckBase.y + hr * 0.22, cx - f.bustHalf * 1.02, j.bustY - hr * 0.15, cx - f.bustHalf - pad, j.bustY);
      ctx.lineTo(cx - f.waistHalf - pad, j.waistL.y);
      ctx.bezierCurveTo(cx - highHipW, j.highHipL.y, cx - flareX, j.hipL.y + hr * 0.4, cx - flareX, hemY);
      ctx.quadraticCurveTo(cx, hemY + hr * 0.28, cx + flareX, hemY);
      ctx.bezierCurveTo(cx + flareX, j.hipR.y + hr * 0.4, cx + highHipW, j.highHipR.y, cx + f.waistHalf + pad, j.waistR.y);
      ctx.lineTo(cx + f.bustHalf + pad, j.bustY);
      ctx.bezierCurveTo(cx + f.bustHalf * 1.02, j.bustY - hr * 0.15, cx + f.shoulderHalf * 0.65, j.neckBase.y + hr * 0.22, cx + f.neckHalf * 1.1, j.neckBase.y + hr * 0.1);
      ctx.lineTo(cx, j.bustY + hr * 0.35);
      ctx.closePath();
      ctx.fill();

      // Satin wrap tie sash at waist
      ctx.fillStyle = col.secondary;
      ctx.fillRect(cx - f.waistHalf - pad, j.waistL.y - hr * 0.1, (f.waistHalf + pad) * 2, hr * 0.22);
    }

    ctx.restore();
  }

  function renderSelector(container, draft, onChange) {
    draft.wardrobe = clampWardrobe(draft.wardrobe);

    function addSectionLabel(text) {
      const el = document.createElement('span');
      el.className = 'crown-label';
      el.textContent = text;
      container.appendChild(el);
    }

    addSectionLabel('Wardrobe Category');
    const cats = [
      { id: 'all', label: 'All (' + OUTFITS.length + ')' },
      { id: 'gowns', label: 'Gowns' },
      { id: 'casual', label: 'Casual' },
      { id: 'pajamas', label: 'Pajamas' },
      { id: 'lingerie', label: 'Bra & Panties' },
    ];
    const catRow = document.createElement('div');
    catRow.className = 'cas-swatch-grid';
    cats.forEach(function (cat) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cas-swatch' + (cat.id === activeCategory ? ' active' : '');
      btn.textContent = cat.label;
      btn.addEventListener('click', function () {
        activeCategory = cat.id;
        onChange();
      });
      catRow.appendChild(btn);
    });
    container.appendChild(catRow);

    const visibleOutfits =
      activeCategory === 'all'
        ? OUTFITS
        : OUTFITS.filter(function (o) {
            return o.category === activeCategory;
          });

    addSectionLabel('Outfits & Attire');
    const grid = document.createElement('div');
    grid.className = 'cas-grid';
    visibleOutfits.forEach(function (item) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cas-choice' + (item.id === draft.wardrobe.outfitId ? ' active' : '');
      btn.innerHTML = '<span>' + item.label + '</span><span class="cas-choice-sub">' + item.desc + '</span>';
      btn.addEventListener('click', function () {
        draft.wardrobe.outfitId = item.id;
        onChange();
      });
      grid.appendChild(btn);
    });
    container.appendChild(grid);

    addSectionLabel('Silk & Velvet Palette Swatches');
    const swatchRow = document.createElement('div');
    swatchRow.className = 'cas-swatch-grid';
    COLOR_THEMES.forEach(function (theme) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cas-swatch' + (theme.id === draft.wardrobe.themeId ? ' active' : '');
      btn.innerHTML =
        '<span class="cas-dot" style="background:linear-gradient(135deg,' +
        theme.primary +
        ' 55%,' +
        theme.secondary +
        ' 55%)"></span><span>' +
        theme.label +
        '</span>';
      btn.addEventListener('click', function () {
        draft.wardrobe.themeId = theme.id;
        onChange();
      });
      swatchRow.appendChild(btn);
    });
    container.appendChild(swatchRow);

    // Quick Footwear Strip right inside Wardrobe for convenience
    if (window.CrownAccessories && window.CrownAccessories.SHOES && draft.accessories) {
      addSectionLabel('Footwear');
      const shoeGrid = document.createElement('div');
      shoeGrid.className = 'cas-swatch-grid';
      window.CrownAccessories.SHOES.forEach(function (shoe) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cas-swatch' + (shoe.id === draft.accessories.shoes ? ' active' : '');
        btn.textContent = shoe.label;
        btn.addEventListener('click', function () {
          draft.accessories.shoes = shoe.id;
          onChange();
        });
        shoeGrid.appendChild(btn);
      });
      container.appendChild(shoeGrid);
    }
  }

  window.CrownWardrobe = {
    OUTFITS: OUTFITS,
    COLOR_THEMES: COLOR_THEMES,
    createDefaultWardrobe: createDefaultWardrobe,
    clampWardrobe: clampWardrobe,
    drawOutfit: drawOutfit,
    renderSelector: renderSelector,
  };
})();
