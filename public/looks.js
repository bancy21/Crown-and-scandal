(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  const SKIN_TONES = [
    { id: 'porcelain', label: 'Porcelain', undertone: 'cool', base: '#f7dfd5', shadow: '#d7ada0', highlight: '#fff4ee', blush: '#e69aa6' },
    { id: 'alabaster', label: 'Alabaster', undertone: 'neutral', base: '#f3d4c3', shadow: '#ce9f89', highlight: '#fdede3', blush: '#df9596' },
    { id: 'peach-ivory', label: 'Peach Ivory', undertone: 'warm', base: '#f0cbb4', shadow: '#ca987b', highlight: '#fde5d5', blush: '#df8b82' },
    { id: 'golden-honey', label: 'Golden Honey', undertone: 'warm', base: '#e2b28b', shadow: '#b98057', highlight: '#f6d4b0', blush: '#d47c70' },
    { id: 'warm-olive', label: 'Riviera Olive', undertone: 'olive', base: '#d5a882', shadow: '#a87852', highlight: '#ebc8a8', blush: '#c77a72' },
    { id: 'caramel', label: 'Caramel Amber', undertone: 'warm', base: '#c48d63', shadow: '#966039', highlight: '#dfb088', blush: '#b96460' },
    { id: 'sienna', label: 'Bronze Sienna', undertone: 'neutral', base: '#a66d48', shadow: '#794728', highlight: '#c48f6a', blush: '#a75658' },
    { id: 'chestnut', label: 'Deep Chestnut', undertone: 'warm', base: '#7d4d32', shadow: '#542f1b', highlight: '#9e6b4d', blush: '#8f474d' },
    { id: 'espresso', label: 'Espresso Velvet', undertone: 'cool', base: '#593424', shadow: '#381e13', highlight: '#7a4f3b', blush: '#7b3c46' },
  ];

  const UNDERTONES = [
    { id: 'cool', label: 'Cool Rose', shiftHex: '#f5b8c8', weight: 0.08 },
    { id: 'neutral', label: 'Neutral Ivory', shiftHex: '#f2decb', weight: 0.04 },
    { id: 'warm', label: 'Warm Gold', shiftHex: '#f2c37e', weight: 0.09 },
    { id: 'olive', label: 'Sunlit Olive', shiftHex: '#cfc78b', weight: 0.08 },
  ];

  const FRECKLE_STYLES = [
    { id: 'none', label: 'None' },
    { id: 'light-nose', label: 'Bridge Kiss' },
    { id: 'sun-kissed', label: 'Riviera Sun-Kissed' },
    { id: 'full-cheek', label: 'Full Cheek Dusting' },
  ];

  const MOLE_STYLES = [
    { id: 'none', label: 'None' },
    { id: 'cheek-left', label: 'Left Cheekbone' },
    { id: 'lip-corner', label: 'Lip Corner' },
    { id: 'brow-arch', label: 'Brow Arch' },
  ];

  const BLUSH_STYLES = [
    { id: 'none', label: 'None', hex: '#e69aa6' },
    { id: 'soft-rose', label: 'Soft Rose', hex: '#e0899a' },
    { id: 'peach-glow', label: 'Riviera Peach', hex: '#e39074' },
    { id: 'royal-berry', label: 'Royal Berry', hex: '#b6546f' },
  ];

  const SCAR_STYLES = [
    { id: 'none', label: 'None' },
    { id: 'brow-nick', label: 'Subtle Brow Nick' },
    { id: 'cheek-line', label: 'Fencing Cheek Mark' },
    { id: 'collar-mark', label: 'Collarbone Scar' },
  ];

  const EYE_SHAPES = [
    { id: 'almond', label: 'Almond', heightRatio: 0.54, tilt: -0.08 },
    { id: 'doe', label: 'Doe Round', heightRatio: 0.68, tilt: 0.02 },
    { id: 'cat-eye', label: 'Feline Uplift', heightRatio: 0.5, tilt: -0.16 },
    { id: 'hooded', label: 'Sultry Hooded', heightRatio: 0.45, tilt: -0.05 },
    { id: 'royal-wide', label: 'Grand Wide', heightRatio: 0.62, tilt: -0.04 },
  ];

  const EYE_COLORS = [
    { id: 'sapphire', label: 'Sapphire Blue', hex: '#3b6ca8' },
    { id: 'emerald', label: 'Court Emerald', hex: '#347a5e' },
    { id: 'hazel', label: 'Hazel Gold', hex: '#866e3a' },
    { id: 'amber', label: 'Warm Amber', hex: '#a86426' },
    { id: 'espresso', label: 'Dark Espresso', hex: '#43291d' },
    { id: 'violet', label: 'Twilight Violet', hex: '#634c91' },
    { id: 'slate', label: 'Silver Slate', hex: '#637687' },
    { id: 'ice', label: 'Glacier Blue', hex: '#71aad1' },
    { id: 'garnet', label: 'Royal Garnet', hex: '#8f293b' },
    { id: 'jade', label: 'Riviera Jade', hex: '#4b9182' },
  ];

  const PUPIL_SHAPES = [
    { id: 'round', label: 'Classic Round', desc: 'Balanced royal gaze' },
    { id: 'feline-slit', label: 'Feline Slit', desc: 'Sharp vertical intrigue' },
    { id: 'almond-soft', label: 'Soft Oval', desc: 'Elongated velvet focus' },
    { id: 'dilated', label: 'Captivating Wide', desc: 'Enlarged romantic depth' },
    { id: 'pinpoint', label: 'Sharp Pinpoint', desc: 'Piercing iris clarity' },
    { id: 'starlight', label: 'Royal Starburst', desc: 'Faceted jewel silhouette' },
  ];

  const EYE_DEPTH_PRESETS = [
    { id: 'shallow', label: 'Luminous Shallow', value: 0.22, desc: 'Forward-set bright lid' },
    { id: 'balanced', label: 'Classic Sculpted', value: 0.55, desc: 'Natural orbital contour' },
    { id: 'deep-set', label: 'Deep-Set Intrigue', value: 0.9, desc: 'Dramatic socket shadow' },
  ];

  const BROW_STYLES = [
    { id: 'arched', label: 'Classic Royal Arch' },
    { id: 'soft-straight', label: 'Soft Parisian' },
    { id: 'feathered', label: 'Feathered Full' },
    { id: 'high-regal', label: 'High Dramatic' },
    { id: 'sleek', label: 'Sleek Tapered' },
  ];

  const NOSE_SHAPES = [
    { id: 'delicate', label: 'Delicate Straight', width: 0.85, tipLift: 0.05 },
    { id: 'classic', label: 'Classic Aristocrat', width: 1.0, tipLift: 0.0 },
    { id: 'aquiline', label: 'Sculpted Aquiline', width: 0.94, tipLift: -0.05 },
    { id: 'button', label: 'Soft Button', width: 1.0, tipLift: 0.1 },
    { id: 'sculpted', label: 'Chiseled Bridge', width: 0.9, tipLift: 0.02 },
  ];

  const LIP_SHAPES = [
    { id: 'cupid-bow', label: 'Defined Cupid Bow', arch: 1.15, width: 0.96 },
    { id: 'full-plush', label: 'Plush Velvet', arch: 0.95, width: 1.04 },
    { id: 'rosebud', label: 'Petite Rosebud', arch: 1.05, width: 0.86 },
    { id: 'wide-smile', label: 'Radiant Wide', arch: 0.85, width: 1.1 },
    { id: 'sculpted-matte', label: 'Sculpted Couture', arch: 1.1, width: 1.0 },
  ];

  const JAW_SHAPES = [
    { id: 'oval-soft', label: 'Soft Oval', chinRatio: 0.52, jawFlare: 0.82 },
    { id: 'heart-taper', label: 'Heart Taper', chinRatio: 0.4, jawFlare: 0.85 },
    { id: 'sculpted-square', label: 'Regal Square', chinRatio: 0.62, jawFlare: 0.9 },
    { id: 'diamond-high', label: 'High Cheekbone', chinRatio: 0.45, jawFlare: 0.78 },
  ];

  const EYELINER_STYLES = [
    { id: 'none', label: 'Bare Lash' },
    { id: 'classic-wing', label: 'Parisian Wing' },
    { id: 'smoky-kohl', label: 'Smoky Kohl' },
    { id: 'editorial-flick', label: 'Gala Graphic Flick' },
  ];

  const EYESHADOW_PALETTES = [
    { id: 'none', label: 'Bare Lid', hex: '#d7b4a0', alpha: 0 },
    { id: 'champagne', label: 'Champagne Gold', hex: '#d8b57d', alpha: 0.42 },
    { id: 'rose-gold', label: 'Rose Silk', hex: '#c87e8d', alpha: 0.45 },
    { id: 'bronze-smoke', label: 'Bronze Smoke', hex: '#7a5241', alpha: 0.52 },
    { id: 'plum-velvet', label: 'Plum Intrigue', hex: '#6c3b5c', alpha: 0.52 },
    { id: 'midnight', label: 'Riviera Midnight', hex: '#344163', alpha: 0.52 },
  ];

  const LIPSTICK_SHADES = [
    { id: 'natural', label: 'Natural Tint', hex: '#cc7b7e', gloss: 0.25 },
    { id: 'bare-rose', label: 'Bare Satin Rose', hex: '#cc7b86', gloss: 0.38 },
    { id: 'petal-pink', label: 'Versailles Petal', hex: '#d46f89', gloss: 0.48 },
    { id: 'crimson-velvet', label: 'Royal Crimson', hex: '#a62639', gloss: 0.28 },
    { id: 'burgundy-wine', label: 'Scandal Wine', hex: '#6e1c30', gloss: 0.24 },
    { id: 'mocha-satin', label: 'Chai Cashmere', hex: '#965c52', gloss: 0.34 },
    { id: 'coral-riviera', label: 'Riviera Coral', hex: '#cf5a52', gloss: 0.5 },
  ];

  const HIGHLIGHTERS = [
    { id: 'none', label: 'Natural Matte', hex: '#fff7ea', alpha: 0 },
    { id: 'pearl-glow', label: 'Pearl Dew', hex: '#fff2f4', alpha: 0.38 },
    { id: 'gold-leaf', label: 'Versailles Gold Leaf', hex: '#ffe3a8', alpha: 0.44 },
  ];

  const HAIR_STYLES = [
    { id: 'regal-waves', category: 'long', label: 'Versailles Waves', desc: 'Cascading royal curls past the shoulders' },
    { id: 'silk-straight', category: 'long', label: 'Long Silk Part', desc: 'Sleek waist-grazing middle part' },
    { id: 'mermaid-curls', category: 'long', label: 'Riviera Waterfall', desc: 'Voluminous billowing princess curls' },
    { id: 'side-swept-curls', category: 'long', label: 'Gala Side Curls', desc: 'Lush volume swept over one shoulder' },
    { id: 'half-up-ribbon', category: 'long', label: 'Half-Up Royal', desc: 'Lifted half-crown with flowing waves' },
    { id: 'hollywood-blowout', category: 'long', label: 'Couture Blowout', desc: 'Bouncy layered salon waves' },
    { id: 'marie-updo', category: 'updo', label: 'Court Chignon', desc: 'Sculpted royal updo with framing tendrils' },
    { id: 'braided-crown', category: 'updo', label: 'Imperial Plaits', desc: 'Woven royal halo braid & twin plaits' },
    { id: 'sleek-ponytail', category: 'updo', label: 'Runway High Pony', desc: 'Lifted crown tail with sculpted waves' },
    { id: 'romantic-bun', category: 'updo', label: 'Château Low Bun', desc: 'Soft parted chignon with loose wisps' },
    { id: 'milkmaid-braids', category: 'updo', label: 'Double Woven Crown', desc: 'Twinned braided crest around the head' },
    { id: 'riviera-bob', category: 'short', label: 'Riviera French Bob', desc: 'Chic textured collar-length waves' },
    { id: 'couture-lob', category: 'short', label: 'Collarbone Lob', desc: 'Sleek angled long bob' },
    { id: 'wavy-curtain-shag', category: 'short', label: 'Curtain Layers', desc: 'Feathered shoulder-length layers' },
    { id: 'pixie-coiffure', category: 'short', label: 'Gamine Pixie', desc: 'Soft feathered crop framing cheekbones' },
    { id: 'slick-gala', category: 'short', label: 'Slicked-Back Gala', desc: 'Sleek editorial swept-back coiffure' },
  ];

  const HAIR_COLOR_PRESETS = [
    { id: 'champagne-blonde', label: 'Champagne Blonde', root: '#a9854c', tip: '#e9d39c', highlight: '#fff2cf' },
    { id: 'honey-caramel', label: 'Honey Balayage', root: '#6c482c', tip: '#cfa069', highlight: '#f2cb97' },
    { id: 'chestnut', label: 'Chestnut Silk', root: '#4a2b1c', tip: '#7a4d34', highlight: '#aa7755' },
    { id: 'raven-noir', label: 'Raven Noir', root: '#19151c', tip: '#2f2836', highlight: '#5d536b' },
    { id: 'auburn-copper', label: 'Royal Auburn', root: '#6f291b', tip: '#ba5231', highlight: '#e68857' },
    { id: 'rosewood', label: 'Blush Rosewood', root: '#693c4a', tip: '#be7c8e', highlight: '#e7b1bf' },
    { id: 'silver-platinum', label: 'Silver Platinum', root: '#93919b', tip: '#e5e3eb', highlight: '#ffffff' },
    { id: 'burgundy', label: 'Velvet Burgundy', root: '#3c1622', tip: '#822741', highlight: '#b84c6a' },
  ];

  const FACE_SLIDER_LIMITS = {
    eyeSize: { label: 'Eye Size', min: 0.85, max: 1.18, step: 0.01 },
    eyeSpacing: { label: 'Eye Spacing', min: 0.88, max: 1.14, step: 0.01 },
    noseLength: { label: 'Nose Length', min: 0.85, max: 1.15, step: 0.01 },
    lipFullness: { label: 'Lip Fullness', min: 0.84, max: 1.22, step: 0.01 },
    jawWidth: { label: 'Jaw Width', min: 0.86, max: 1.14, step: 0.01 },
    cheekbones: { label: 'Cheekbones', min: 0.86, max: 1.16, step: 0.01 },
  };

  function clamp(val, min, max) {
    const n = Number(val);
    if (!Number.isFinite(n)) return min;
    return Math.max(min, Math.min(max, n));
  }

  function normalizeHex(hex, fallback) {
    const raw = String(hex || '').trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
      return ('#' + raw[1] + raw[1] + raw[2] + raw[2] + raw[3] + raw[3]).toLowerCase();
    }
    return (fallback || '#b88938').toLowerCase();
  }

  function hexToRgb(hex) {
    const clean = normalizeHex(hex, '#000000').slice(1);
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }

  function rgbToHex(r, g, b) {
    function part(v) {
      return Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
    }
    return '#' + part(r) + part(g) + part(b);
  }

  function mixHex(hexA, hexB, t) {
    const ratio = clamp(t, 0, 1);
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    return rgbToHex(
      a.r + (b.r - a.r) * ratio,
      a.g + (b.g - a.g) * ratio,
      a.b + (b.b - a.b) * ratio
    );
  }

  function rgba(hex, alpha) {
    const c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function hslToHex(h, s, l) {
    const hue = ((Number(h) % 360) + 360) % 360;
    const sat = clamp(s, 0, 100) / 100;
    const lig = clamp(l, 0, 100) / 100;
    const k = function (n) {
      return (n + hue / 30) % 12;
    };
    const a = sat * Math.min(lig, 1 - lig);
    const f = function (n) {
      return lig - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    };
    return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
  }

  function hexToHsl(hex) {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function findById(list, id, fallbackIdx) {
    return (
      list.find(function (item) {
        return item.id === id;
      }) || list[fallbackIdx || 0]
    );
  }

  function clampLook(raw) {
    const src = raw || {};
    const skinObj = findById(SKIN_TONES, src.skinToneId, 2);
    const undertoneObj = findById(UNDERTONES, src.undertone || skinObj.undertone, 1);
    const hairPreset = findById(HAIR_COLOR_PRESETS, src.hairPresetId, 0);

    const rawSliders = src.faceSliders || {};
    const faceSliders = {};
    Object.keys(FACE_SLIDER_LIMITS).forEach(function (key) {
      const lim = FACE_SLIDER_LIMITS[key];
      const val = rawSliders[key] !== undefined ? rawSliders[key] : 1.0;
      faceSliders[key] = Number(clamp(val, lim.min, lim.max).toFixed(2));
    });

    const hairRoot = normalizeHex(src.hairRootHex, hairPreset.root);
    const hairTip = normalizeHex(src.hairTipHex, hairPreset.tip);
    const hairHighlight = normalizeHex(src.hairHighlightHex, hairPreset.highlight);
    const eyeObj = findById(EYE_COLORS, src.eyeColorId, 0);

    return {
      skinToneId: skinObj.id,
      undertone: undertoneObj.id,
      freckles: findById(FRECKLE_STYLES, src.freckles, 0).id,
      mole: findById(MOLE_STYLES, src.mole, 0).id,
      blush: findById(BLUSH_STYLES, src.blush, 1).id,
      blushIntensity: Number(clamp(src.blushIntensity !== undefined ? src.blushIntensity : 0.45, 0, 1).toFixed(2)),
      scar: findById(SCAR_STYLES, src.scar, 0).id,
      eyeShape: findById(EYE_SHAPES, src.eyeShape, 0).id,
      eyeColorId: eyeObj.id,
      eyeColorHex: normalizeHex(src.eyeColorHex, eyeObj.hex),
      pupilShape: findById(PUPIL_SHAPES, src.pupilShape, 0).id,
      eyeDepth: Number(clamp(src.eyeDepth !== undefined ? src.eyeDepth : 0.55, 0, 1).toFixed(2)),
      browStyle: findById(BROW_STYLES, src.browStyle, 0).id,
      noseShape: findById(NOSE_SHAPES, src.noseShape, 1).id,
      lipShape: findById(LIP_SHAPES, src.lipShape, 0).id,
      jawShape: findById(JAW_SHAPES, src.jawShape, 0).id,
      eyeliner: findById(EYELINER_STYLES, src.eyeliner, 1).id,
      eyeshadow: findById(EYESHADOW_PALETTES, src.eyeshadow, 1).id,
      lipstick: findById(LIPSTICK_SHADES, src.lipstick, 1).id,
      highlighter: findById(HIGHLIGHTERS, src.highlighter, 1).id,
      hairStyle: findById(HAIR_STYLES, src.hairStyle, 0).id,
      hairPresetId: hairPreset.id,
      hairRootHex: hairRoot,
      hairTipHex: hairTip,
      hairHighlightHex: hairHighlight,
      hairBlend: Number(clamp(src.hairBlend !== undefined ? src.hairBlend : 0.55, 0, 1).toFixed(2)),
      hairHighlightStrength: Number(
        clamp(src.hairHighlightStrength !== undefined ? src.hairHighlightStrength : 0.62, 0, 1).toFixed(2)
      ),
      faceSliders: faceSliders,
    };
  }

  function createDefaultLook() {
    return clampLook({
      skinToneId: 'peach-ivory',
      undertone: 'warm',
      freckles: 'none',
      mole: 'none',
      blush: 'soft-rose',
      blushIntensity: 0.48,
      scar: 'none',
      eyeShape: 'almond',
      eyeColorId: 'sapphire',
      eyeColorHex: '#3b6ca8',
      pupilShape: 'round',
      eyeDepth: 0.55,
      browStyle: 'arched',
      noseShape: 'classic',
      lipShape: 'cupid-bow',
      jawShape: 'heart-taper',
      eyeliner: 'classic-wing',
      eyeshadow: 'champagne',
      lipstick: 'bare-rose',
      highlighter: 'pearl-glow',
      hairStyle: 'regal-waves',
      hairPresetId: 'champagne-blonde',
      hairRootHex: '#a9854c',
      hairTipHex: '#e9d39c',
      hairHighlightHex: '#fff2cf',
      hairBlend: 0.52,
      hairHighlightStrength: 0.68,
      faceSliders: {
        eyeSize: 1.04,
        eyeSpacing: 1.0,
        noseLength: 0.98,
        lipFullness: 1.04,
        jawWidth: 0.96,
        cheekbones: 1.04,
      },
    });
  }

  function getSkinPalette(lookConfig) {
    const cfg = clampLook(lookConfig);
    const tone = findById(SKIN_TONES, cfg.skinToneId, 2);
    const under = findById(UNDERTONES, cfg.undertone, 1);

    return {
      base: mixHex(tone.base, under.shiftHex, under.weight),
      shadow: mixHex(tone.shadow, under.shiftHex, under.weight * 0.6),
      highlight: mixHex(tone.highlight, under.shiftHex, under.weight * 0.5),
      blushTint: tone.blush,
      lipNatural: mixHex(tone.shadow, '#bc5d66', 0.48),
    };
  }

  function makeHairGradient(ctx, look, topY, botY) {
    const grad = ctx.createLinearGradient(0, topY, 0, botY);
    const blend = clamp(look.hairBlend, 0.08, 0.92);
    const mid = mixHex(look.hairRootHex, look.hairTipHex, 0.54);
    grad.addColorStop(0, look.hairRootHex);
    grad.addColorStop(clamp(blend * 0.58, 0.05, 0.7), look.hairRootHex);
    grad.addColorStop(clamp(blend + (1 - blend) * 0.35, 0.25, 0.9), mid);
    grad.addColorStop(1, look.hairTipHex);
    return grad;
  }

  /**
   * Paints a flowing sculpted S-wave hair lock with shadow, gradient body & silk highlight.
   */
  function drawWaveLock(ctx, x0, y0, cx1, cy1, cx2, cy2, x1, y1, widthStart, widthEnd, grad, deepShadow, highlightHex, hlStrength) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Under-shadow depth
    ctx.strokeStyle = rgba(deepShadow, 0.42);
    ctx.lineWidth = widthStart * 1.14;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x1, y1);
    ctx.stroke();

    // Main lock gradient body (tapered by drawing outer + tip stroke)
    ctx.strokeStyle = grad;
    ctx.lineWidth = (widthStart + widthEnd) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x1, y1);
    ctx.stroke();

    // Fine internal strand contour
    ctx.strokeStyle = rgba(deepShadow, 0.26);
    ctx.lineWidth = Math.max(1, widthEnd * 0.24);
    ctx.beginPath();
    ctx.moveTo(x0 + widthStart * 0.14, y0);
    ctx.bezierCurveTo(cx1 + widthStart * 0.16, cy1, cx2 - widthEnd * 0.16, cy2, x1, y1);
    ctx.stroke();

    // Specular silk highlight ribbon
    if (hlStrength > 0.04) {
      ctx.strokeStyle = rgba(highlightHex, hlStrength * 0.56);
      ctx.lineWidth = Math.max(1.2, widthStart * 0.22);
      ctx.beginPath();
      ctx.moveTo(x0 - widthStart * 0.1, y0 + 2);
      ctx.bezierCurveTo(cx1 - widthStart * 0.14, cy1, cx2 + widthEnd * 0.1, cy2, x1 - widthEnd * 0.1, y1 - 3);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawHairBack(ctx, rig, lookConfig) {
    const look = clampLook(lookConfig);
    const hc = rig.joints.headCenter;
    const hr = rig.headR;
    const j = rig.joints;
    const f = rig.fit;

    const deepShadow = mixHex(look.hairRootHex, '#120a0d', 0.55);
    const style = look.hairStyle;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const topY = hc.y - hr * 1.3;
    const farBot = j.waistL.y + hr * 1.4;
    const grad = makeHairGradient(ctx, look, topY, farBot);

    if (style === 'regal-waves') {
      const botY = j.bustY + hr * 2.7;
      const spread = Math.max(hr * 1.9, f.shoulderHalf * 1.04);

      // Deep shaded under-curtain behind shoulders
      ctx.fillStyle = deepShadow;
      ctx.beginPath();
      ctx.moveTo(hc.x - hr * 1.24, hc.y - hr * 0.15);
      ctx.bezierCurveTo(hc.x - spread * 1.06, j.shoulderL.y - hr * 0.1, hc.x - spread * 0.98, botY - hr * 0.6, hc.x - spread * 0.8, botY);
      ctx.quadraticCurveTo(hc.x, botY + hr * 0.45, hc.x + spread * 0.8, botY);
      ctx.bezierCurveTo(hc.x + spread * 0.98, botY - hr * 0.6, hc.x + spread * 1.06, j.shoulderR.y - hr * 0.1, hc.x + hr * 1.24, hc.y - hr * 0.15);
      ctx.closePath();
      ctx.fill();

      // Cascading golden S-curl layers on both sides
      [-1, 1].forEach(function (side) {
        drawWaveLock(
          ctx,
          hc.x + side * hr * 0.95,
          hc.y - hr * 0.25,
          hc.x + side * spread * 0.98,
          j.neckBase.y + hr * 0.4,
          hc.x + side * spread * 0.68,
          j.bustY + hr * 0.6,
          hc.x + side * spread * 0.84,
          botY - hr * 0.2,
          hr * 0.58,
          hr * 0.34,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
        drawWaveLock(
          ctx,
          hc.x + side * hr * 1.08,
          hc.y + hr * 0.1,
          hc.x + side * spread * 1.12,
          j.shoulderL.y + hr * 0.6,
          hc.x + side * spread * 0.88,
          j.bustY + hr * 1.2,
          hc.x + side * spread * 0.56,
          botY - hr * 0.45,
          hr * 0.46,
          hr * 0.24,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
      });
    } else if (style === 'silk-straight') {
      const botY = j.waistL.y + hr * 0.65;
      const w = Math.max(hr * 1.48, f.shoulderHalf * 0.86);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(hc.x - hr * 1.15, hc.y - hr * 0.28);
      ctx.bezierCurveTo(hc.x - w * 1.02, j.shoulderL.y, hc.x - w * 1.04, botY * 0.7, hc.x - w * 0.92, botY);
      ctx.quadraticCurveTo(hc.x, botY + hr * 0.25, hc.x + w * 0.92, botY);
      ctx.bezierCurveTo(hc.x + w * 1.04, botY * 0.7, hc.x + w * 1.02, j.shoulderR.y, hc.x + hr * 1.15, hc.y - hr * 0.28);
      ctx.closePath();
      ctx.fill();

      // Sleek vertical silk sheen ribbons
      if (look.hairHighlightStrength > 0.04) {
        ctx.strokeStyle = rgba(look.hairHighlightHex, look.hairHighlightStrength * 0.44);
        ctx.lineWidth = hr * 0.14;
        [-0.78, -0.45, 0.45, 0.78].forEach(function (rx) {
          ctx.beginPath();
          ctx.moveTo(hc.x + rx * hr * 1.25, hc.y + hr * 0.2);
          ctx.lineTo(hc.x + rx * w * 0.82, botY - hr * 0.4);
          ctx.stroke();
        });
      }
    } else if (style === 'marie-updo') {
      // High voluminous Versailles chignon crown
      ctx.fillStyle = deepShadow;
      ctx.beginPath();
      ctx.ellipse(hc.x, hc.y - hr * 1.14, hr * 1.06, hr * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(hc.x, hc.y - hr * 1.18, hr * 0.98, hr * 0.74, 0, 0, Math.PI * 2);
      ctx.fill();

      // Delicate ringlet tendrils behind shoulders
      [-1, 1].forEach(function (side) {
        drawWaveLock(
          ctx,
          hc.x + side * hr * 0.86,
          hc.y + hr * 0.2,
          hc.x + side * hr * 1.18,
          j.neckBase.y + hr * 0.2,
          hc.x + side * hr * 0.74,
          j.shoulderL.y + hr * 0.25,
          hc.x + side * hr * 0.96,
          j.shoulderL.y + hr * 1.05,
          hr * 0.24,
          hr * 0.11,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
      });
    } else if (style === 'riviera-bob') {
      const botY = j.neckBase.y + hr * 0.92;
      [-1, 1].forEach(function (side) {
        drawWaveLock(
          ctx,
          hc.x + side * hr * 0.96,
          hc.y - hr * 0.2,
          hc.x + side * hr * 1.48,
          hc.y + hr * 0.55,
          hc.x + side * hr * 1.38,
          botY - hr * 0.35,
          hc.x + side * hr * 0.88,
          botY,
          hr * 0.52,
          hr * 0.32,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
      });
    } else if (style === 'braided-crown') {
      // Sculpted braided updo + symmetrical woven shoulder plaits (like Screenshot 4!)
      ctx.fillStyle = deepShadow;
      ctx.beginPath();
      ctx.ellipse(hc.x, hc.y - hr * 0.35, hr * 1.15, hr * 1.05, 0, 0, Math.PI * 2);
      ctx.fill();

      const botY = j.bustY + hr * 1.45;
      [-1, 1].forEach(function (side) {
        for (let i = 0; i < 6; i++) {
          const t = i / 5;
          const bx = hc.x + side * (hr * 0.92 + t * hr * 0.36);
          const by = j.chin.y + t * (botY - j.chin.y);
          const r = hr * (0.24 - t * 0.06);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(bx, by, r * 1.12, r * 0.82, side * 0.32, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = rgba(deepShadow, 0.45);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    } else if (style === 'side-swept-curls') {
      const botY = j.bustY + hr * 2.55;
      drawWaveLock(
        ctx,
        hc.x - hr * 0.92,
        hc.y - hr * 0.1,
        hc.x - hr * 1.68,
        j.shoulderL.y + hr * 0.2,
        hc.x - hr * 1.44,
        j.bustY + hr * 0.8,
        hc.x - hr * 0.82,
        botY,
        hr * 0.72,
        hr * 0.36,
        grad,
        deepShadow,
        look.hairHighlightHex,
        look.hairHighlightStrength
      );
      drawWaveLock(
        ctx,
        hc.x - hr * 0.55,
        hc.y + hr * 0.45,
        hc.x - hr * 1.18,
        j.shoulderL.y + hr * 0.65,
        hc.x - hr * 1.02,
        j.bustY + hr * 1.25,
        hc.x - hr * 0.48,
        botY - hr * 0.3,
        hr * 0.54,
        hr * 0.28,
        grad,
        deepShadow,
        look.hairHighlightHex,
        look.hairHighlightStrength
      );
    } else if (style === 'sleek-ponytail') {
      const tailBot = j.bustY + hr * 1.9;
      drawWaveLock(
        ctx,
        hc.x + hr * 0.15,
        hc.y - hr * 1.05,
        hc.x + hr * 1.75,
        hc.y - hr * 0.3,
        hc.x + hr * 1.95,
        j.shoulderR.y + hr * 0.7,
        hc.x + hr * 1.12,
        tailBot,
        hr * 0.58,
        hr * 0.26,
        grad,
        deepShadow,
        look.hairHighlightHex,
        look.hairHighlightStrength
      );
    } else if (style === 'mermaid-curls' || style === 'half-up-ribbon' || style === 'hollywood-blowout') {
      const botY = j.waistL.y + (style === 'mermaid-curls' ? hr * 1.1 : hr * 0.4);
      const spread = Math.max(hr * 2.05, f.shoulderHalf * 1.12);
      ctx.fillStyle = deepShadow;
      ctx.beginPath();
      ctx.moveTo(hc.x - hr * 1.25, hc.y - hr * 0.15);
      ctx.bezierCurveTo(hc.x - spread * 1.08, j.shoulderL.y, hc.x - spread * 1.05, botY * 0.72, hc.x - spread * 0.82, botY);
      ctx.quadraticCurveTo(hc.x, botY + hr * 0.55, hc.x + spread * 0.82, botY);
      ctx.bezierCurveTo(hc.x + spread * 1.05, botY * 0.72, hc.x + spread * 1.08, j.shoulderR.y, hc.x + hr * 1.25, hc.y - hr * 0.15);
      ctx.closePath();
      ctx.fill();

      [-1, 1].forEach(function (side) {
        drawWaveLock(
          ctx,
          hc.x + side * hr * 0.92,
          hc.y - hr * 0.25,
          hc.x + side * spread * 1.04,
          j.shoulderL.y + hr * 0.2,
          hc.x + side * spread * 0.72,
          j.bustY + hr * 0.9,
          hc.x + side * spread * 0.88,
          botY - hr * 0.15,
          hr * 0.62,
          hr * 0.34,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
        drawWaveLock(
          ctx,
          hc.x + side * hr * 0.65,
          hc.y + hr * 0.45,
          hc.x + side * spread * 0.88,
          j.bustY + hr * 0.3,
          hc.x + side * spread * 0.96,
          j.waistL.y,
          hc.x + side * spread * 0.55,
          botY - hr * 0.3,
          hr * 0.5,
          hr * 0.28,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
      });

      if (style === 'half-up-ribbon') {
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(hc.x, hc.y - hr * 1.08, hr * 0.82, hr * 0.52, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (style === 'romantic-bun' || style === 'milkmaid-braids') {
      // Soft low chignon at nape + wisps
      ctx.fillStyle = deepShadow;
      ctx.beginPath();
      ctx.ellipse(hc.x, j.neck.y + hr * 0.05, hr * 0.95, hr * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(hc.x, j.neck.y, hr * 0.86, hr * 0.54, 0, 0, Math.PI * 2);
      ctx.fill();
      [-1, 1].forEach(function (side) {
        drawWaveLock(
          ctx,
          hc.x + side * hr * 0.85,
          hc.y + hr * 0.15,
          hc.x + side * hr * 1.1,
          j.neckBase.y + hr * 0.15,
          hc.x + side * hr * 0.88,
          j.shoulderL.y + hr * 0.1,
          hc.x + side * hr * 0.96,
          j.shoulderL.y + hr * 0.65,
          hr * 0.2,
          hr * 0.09,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
      });
    } else if (style === 'couture-lob' || style === 'wavy-curtain-shag') {
      const botY = j.shoulderL.y + hr * 0.58;
      [-1, 1].forEach(function (side) {
        drawWaveLock(
          ctx,
          hc.x + side * hr * 0.96,
          hc.y - hr * 0.2,
          hc.x + side * hr * 1.54,
          hc.y + hr * 0.65,
          hc.x + side * hr * 1.48,
          botY - hr * 0.25,
          hc.x + side * hr * 0.96,
          botY,
          hr * 0.56,
          hr * 0.3,
          grad,
          deepShadow,
          look.hairHighlightHex,
          look.hairHighlightStrength
        );
      });
    } else if (style === 'pixie-coiffure' || style === 'slick-gala') {
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(hc.x, hc.y - hr * 0.12, hr * 1.14, hr * 1.08, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawHeadAndFace(ctx, rig, lookConfig, options) {
    const look = clampLook(lookConfig);
    const skin = getSkinPalette(look);
    const fs = look.faceSliders;
    const age = rig.age || { jawSoftness: 1.0, cheekDepth: 0.15 };
    const jawObj = findById(JAW_SHAPES, look.jawShape, 0);
    const eyeObj = findById(EYE_SHAPES, look.eyeShape, 0);
    const noseObj = findById(NOSE_SHAPES, look.noseShape, 1);
    const lipObj = findById(LIP_SHAPES, look.lipShape, 0);
    const blushObj = findById(BLUSH_STYLES, look.blush, 1);
    const shadowObj = findById(EYESHADOW_PALETTES, look.eyeshadow, 1);
    const lipstickObj = findById(LIPSTICK_SHADES, look.lipstick, 1);
    const highObj = findById(HIGHLIGHTERS, look.highlighter, 1);

    const hc = rig.joints.headCenter;
    const hr = rig.headR;
    const opts = options || {};
    const blink = Boolean(opts.blink);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Delicate Ears with Inner Shading
    [-1, 1].forEach(function (side) {
      const ex = hc.x + side * hr * 0.96;
      const ey = hc.y + hr * 0.08;
      ctx.fillStyle = skin.shadow;
      ctx.beginPath();
      ctx.ellipse(ex, ey, hr * 0.15, hr * 0.26, side * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = skin.base;
      ctx.beginPath();
      ctx.ellipse(ex - side * hr * 0.02, ey, hr * 0.11, hr * 0.21, side * 0.14, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Sculpted Face Contour with Volumetric 3D-style Lighting
    const cheekW = hr * (0.93 + (fs.cheekbones - 1) * 0.26);
    const jawW = hr * jawObj.jawFlare * fs.jawWidth * (0.94 + age.jawSoftness * 0.06);
    const chinW = hr * jawObj.chinRatio * fs.jawWidth * 0.42;
    const topY = hc.y - hr * 1.04;
    const chinY = hc.y + hr * 1.02;

    const faceGrad = ctx.createRadialGradient(
      hc.x - hr * 0.22,
      hc.y - hr * 0.25,
      hr * 0.12,
      hc.x,
      hc.y + hr * 0.12,
      hr * 1.25
    );
    faceGrad.addColorStop(0, skin.highlight);
    faceGrad.addColorStop(0.58, skin.base);
    faceGrad.addColorStop(1, skin.shadow);

    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.moveTo(hc.x, topY);
    ctx.bezierCurveTo(hc.x + hr * 0.78, topY, hc.x + cheekW, hc.y - hr * 0.24, hc.x + cheekW, hc.y + hr * 0.08);
    ctx.bezierCurveTo(hc.x + cheekW * 0.95, hc.y + hr * 0.45, hc.x + jawW, hc.y + hr * 0.74, hc.x + chinW, chinY - hr * 0.05);
    ctx.quadraticCurveTo(hc.x, chinY + hr * 0.05, hc.x - chinW, chinY - hr * 0.05);
    ctx.bezierCurveTo(hc.x - jawW, hc.y + hr * 0.74, hc.x - cheekW * 0.95, hc.y + hr * 0.45, hc.x - cheekW, hc.y + hr * 0.08);
    ctx.bezierCurveTo(hc.x - cheekW, hc.y - hr * 0.24, hc.x - hr * 0.78, topY, hc.x, topY);
    ctx.closePath();
    ctx.fill();

    // Soft jawline shadow edge (no harsh dark line)
    ctx.strokeStyle = rgba(skin.shadow, 0.45);
    ctx.lineWidth = Math.max(0.8, hr * 0.025);
    ctx.stroke();

    // Cheekbone hollow contour
    if (age.cheekDepth > 0.12 || fs.cheekbones > 1.01) {
      const contourAlpha = clamp(age.cheekDepth * 0.35 + (fs.cheekbones - 0.85) * 0.3, 0.06, 0.24);
      [-1, 1].forEach(function (side) {
        const cxC = hc.x + side * cheekW * 0.62;
        const cyC = hc.y + hr * 0.32;
        const cg = ctx.createRadialGradient(cxC, cyC, 1, cxC, cyC, hr * 0.32);
        cg.addColorStop(0, rgba(skin.shadow, contourAlpha));
        cg.addColorStop(1, rgba(skin.shadow, 0));
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.ellipse(cxC, cyC, hr * 0.32, hr * 0.14, side * -0.45, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 3. Soft Airbrushed Blush
    if (look.blush !== 'none' && look.blushIntensity > 0.02) {
      const blushColor = mixHex(skin.blushTint, blushObj.hex, 0.72);
      const blushAlpha = clamp(look.blushIntensity * 0.46, 0.04, 0.48);
      [-1, 1].forEach(function (side) {
        const bx = hc.x + side * hr * 0.5;
        const by = hc.y + hr * 0.2;
        const grad = ctx.createRadialGradient(bx, by, 1, bx, by, hr * 0.3);
        grad.addColorStop(0, rgba(blushColor, blushAlpha));
        grad.addColorStop(1, rgba(blushColor, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(bx, by, hr * 0.3, hr * 0.19, side * -0.2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 4. Cheekbone & Nose Highlighter
    if (highObj.alpha > 0) {
      [-1, 1].forEach(function (side) {
        const hx = hc.x + side * hr * 0.5;
        const hy = hc.y + hr * 0.1;
        const hg = ctx.createRadialGradient(hx, hy, 1, hx, hy, hr * 0.2);
        hg.addColorStop(0, rgba(highObj.hex, highObj.alpha * 0.75));
        hg.addColorStop(1, rgba(highObj.hex, 0));
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.ellipse(hx, hy, hr * 0.19, hr * 0.08, side * -0.25, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 5. Freckles
    if (look.freckles !== 'none') {
      ctx.fillStyle = rgba(mixHex(skin.shadow, '#7c4829', 0.45), 0.45);
      const spots =
        look.freckles === 'light-nose'
          ? [[-0.08, 0.14], [0, 0.12], [0.09, 0.15], [-0.04, 0.18], [0.05, 0.19]]
          : look.freckles === 'sun-kissed'
          ? [
              [-0.08, 0.14], [0, 0.12], [0.09, 0.15],
              [-0.36, 0.16], [-0.46, 0.2], [-0.28, 0.22],
              [0.36, 0.16], [0.46, 0.2], [0.28, 0.22],
            ]
          : [
              [-0.08, 0.14], [0, 0.12], [0.09, 0.15],
              [-0.34, 0.14], [-0.44, 0.18], [-0.54, 0.23], [-0.38, 0.25], [-0.26, 0.21],
              [0.34, 0.14], [0.44, 0.18], [0.54, 0.23], [0.38, 0.25], [0.26, 0.21],
            ];
      spots.forEach(function (pt) {
        ctx.beginPath();
        ctx.arc(hc.x + pt[0] * hr, hc.y + pt[1] * hr, Math.max(0.7, hr * 0.019), 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // 6. Beauty Mark / Mole
    if (look.mole !== 'none') {
      ctx.fillStyle = '#3b241d';
      let mx = hc.x - hr * 0.42;
      let my = hc.y + hr * 0.24;
      if (look.mole === 'lip-corner') {
        mx = hc.x + hr * 0.32;
        my = hc.y + hr * 0.54;
      } else if (look.mole === 'brow-arch') {
        mx = hc.x - hr * 0.46;
        my = hc.y - hr * 0.32;
      }
      ctx.beginPath();
      ctx.arc(mx, my, Math.max(1.0, hr * 0.026), 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Subtle Scar
    if (look.scar !== 'none') {
      ctx.strokeStyle = rgba(mixHex(skin.shadow, '#f2d9d4', 0.35), 0.65);
      ctx.lineWidth = Math.max(1.0, hr * 0.028);
      ctx.beginPath();
      if (look.scar === 'brow-nick') {
        ctx.moveTo(hc.x + hr * 0.38, hc.y - hr * 0.32);
        ctx.lineTo(hc.x + hr * 0.44, hc.y - hr * 0.14);
      } else if (look.scar === 'cheek-line') {
        ctx.moveTo(hc.x - hr * 0.56, hc.y + hr * 0.16);
        ctx.lineTo(hc.x - hr * 0.4, hc.y + hr * 0.32);
      } else if (look.scar === 'collar-mark') {
        const j = rig.joints;
        ctx.moveTo(rig.cx + hr * 0.45, j.shoulderR.y + hr * 0.25);
        ctx.lineTo(rig.cx + hr * 0.85, j.shoulderR.y + hr * 0.15);
      }
      ctx.stroke();
    }

    // 8. Luminous Semi-Realistic Eyes with 3D Orbital Depth, Radial Iris & Distinct Pupil Shapes
    const eyeY = hc.y - hr * 0.06;
    const eyeDx = hr * 0.39 * fs.eyeSpacing;
    const eyeRx = hr * 0.22 * fs.eyeSize;
    const eyeRy = eyeRx * (eyeObj.heightRatio * 1.26);
    const depth = clamp(look.eyeDepth, 0, 1);

    [-1, 1].forEach(function (side) {
      const ex = hc.x + side * eyeDx;
      const tilt = eyeObj.tilt * side;

      ctx.save();
      ctx.translate(ex, eyeY);
      ctx.rotate(tilt);

      // 8a. Orbital Socket Recess Shadow (scales smoothly with eyeDepth)
      const socketAlpha = 0.14 + depth * 0.44;
      const socketGrad = ctx.createRadialGradient(
        -side * eyeRx * 0.12,
        -eyeRy * 0.42,
        eyeRx * 0.28,
        0,
        -eyeRy * 0.12,
        eyeRx * 1.65
      );
      socketGrad.addColorStop(0, rgba(mixHex(skin.shadow, '#2e161b', 0.25), socketAlpha));
      socketGrad.addColorStop(0.55, rgba(skin.shadow, socketAlpha * 0.58));
      socketGrad.addColorStop(1, rgba(skin.shadow, 0));
      ctx.fillStyle = socketGrad;
      ctx.beginPath();
      ctx.ellipse(0, -eyeRy * 0.15, eyeRx * 1.55, eyeRy * 1.85, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brow-bone highlight above orbital socket for crisp 3D relief
      const browBoneGrad = ctx.createRadialGradient(0, -eyeRy * 1.72, 1, 0, -eyeRy * 1.72, eyeRx * 1.1);
      browBoneGrad.addColorStop(0, rgba(skin.highlight, 0.22 + depth * 0.35));
      browBoneGrad.addColorStop(1, rgba(skin.highlight, 0));
      ctx.fillStyle = browBoneGrad;
      ctx.beginPath();
      ctx.ellipse(0, -eyeRy * 1.66, eyeRx * 1.1, eyeRy * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Upper eyelid crease depth (deeper overhang & stronger fold shadow when deep-set)
      const creaseLift = eyeRy * (1.76 - depth * 0.24);
      ctx.strokeStyle = rgba(mixHex(skin.shadow, '#3a1b20', 0.32), 0.35 + depth * 0.5);
      ctx.lineWidth = Math.max(0.8, hr * (0.02 + depth * 0.025));
      ctx.beginPath();
      ctx.moveTo(-eyeRx * 0.96, -eyeRy * (0.64 - depth * 0.14));
      ctx.quadraticCurveTo(0, -creaseLift, eyeRx * 0.98, -eyeRy * (0.58 - depth * 0.14));
      ctx.stroke();

      // Subtle lower lid shelf highlight + under-eye depth shadow
      if (depth > 0.15) {
        ctx.strokeStyle = rgba(skin.shadow, 0.12 + depth * 0.26);
        ctx.lineWidth = Math.max(0.9, hr * 0.032);
        ctx.beginPath();
        ctx.moveTo(-eyeRx * 0.78, eyeRy * 1.24);
        ctx.quadraticCurveTo(0, eyeRy * (1.65 + depth * 0.2), eyeRx * 0.8, eyeRy * 1.22);
        ctx.stroke();
      }

      // Blended Eyeshadow
      if (shadowObj.alpha > 0) {
        const sg = ctx.createRadialGradient(0, -eyeRy * 0.38, eyeRx * 0.15, 0, -eyeRy * 0.38, eyeRx * 1.42);
        sg.addColorStop(0, rgba(shadowObj.hex, shadowObj.alpha));
        sg.addColorStop(1, rgba(shadowObj.hex, 0));
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(0, -eyeRy * 0.38, eyeRx * 1.38, eyeRy * 1.45, 0, Math.PI, Math.PI * 2);
        ctx.fill();
      }

      if (blink) {
        ctx.strokeStyle = '#28171c';
        ctx.lineWidth = Math.max(1.4, hr * 0.048);
        ctx.beginPath();
        ctx.moveTo(-eyeRx, 0);
        ctx.quadraticCurveTo(0, eyeRy * 0.55, eyeRx, 0);
        ctx.stroke();
      } else {
        // Sclera sphere shading (note: quadratic control at +-1.88 / +1.55 yields full open eye height ~1.72 * eyeRy)
        const scleraVert = ctx.createLinearGradient(0, -eyeRy * 1.1, 0, eyeRy * 0.95);
        scleraVert.addColorStop(0, mixHex('#dcd2d0', '#8f7d7f', depth * 0.55));
        scleraVert.addColorStop(0.22 + depth * 0.18, '#f8f3f0');
        scleraVert.addColorStop(0.68, '#fffdfb');
        scleraVert.addColorStop(1, '#ebe2df');
        ctx.fillStyle = scleraVert;

        ctx.beginPath();
        ctx.moveTo(-eyeRx, 0);
        ctx.quadraticCurveTo(0, -eyeRy * 1.88, eyeRx, 0);
        ctx.quadraticCurveTo(0, eyeRy * 1.56, -eyeRx, 0);
        ctx.closePath();
        ctx.fill();

        // Clip to the TRUE eye opening path for optical 3D iris, radial fibers & sculpted pupil
        ctx.save();
        ctx.clip();

        // Warm inner tear duct accent inside clipped corner
        ctx.fillStyle = rgba('#d47f86', 0.48);
        ctx.beginPath();
        ctx.arc(-side * eyeRx * 0.88, 0, eyeRx * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Lateral sclera sphere shadow at outer corners
        const scleraSide = ctx.createRadialGradient(0, 0, eyeRx * 0.45, 0, 0, eyeRx * 1.08);
        scleraSide.addColorStop(0, 'rgba(0,0,0,0)');
        scleraSide.addColorStop(1, rgba('#6d565c', 0.16 + depth * 0.16));
        ctx.fillStyle = scleraSide;
        ctx.fillRect(-eyeRx * 1.2, -eyeRy * 1.6, eyeRx * 2.4, eyeRy * 3.2);

        const irisR = Math.min(eyeRx * 0.56, eyeRy * 0.9);
        const irisCy = -eyeRy * 0.04;
        const irisDark = mixHex(look.eyeColorHex, '#08050a', 0.58);
        const irisMid = look.eyeColorHex;
        const irisBright = mixHex(look.eyeColorHex, '#ffffff', 0.48);
        const collaretteHex = mixHex(look.eyeColorHex, '#f5d484', 0.42);

        // Concave iris bowl gradient (shadowed top from recessed cornea, luminous lower crescent)
        const irisGrad = ctx.createRadialGradient(
          0,
          irisCy + irisR * 0.2,
          irisR * 0.08,
          0,
          irisCy,
          irisR
        );
        irisGrad.addColorStop(0, irisBright);
        irisGrad.addColorStop(0.55, irisMid);
        irisGrad.addColorStop(0.86, irisDark);
        irisGrad.addColorStop(1, mixHex(irisDark, '#040305', 0.48));

        ctx.fillStyle = irisGrad;
        ctx.beginPath();
        ctx.arc(0, irisCy, irisR, 0, Math.PI * 2);
        ctx.fill();

        // Central collarette warm inner ring for realistic iris relief
        const colGrad = ctx.createRadialGradient(0, irisCy, irisR * 0.22, 0, irisCy, irisR * 0.72);
        colGrad.addColorStop(0, rgba(collaretteHex, 0.55));
        colGrad.addColorStop(0.65, rgba(collaretteHex, 0.2));
        colGrad.addColorStop(1, rgba(collaretteHex, 0));
        ctx.fillStyle = colGrad;
        ctx.beginPath();
        ctx.arc(0, irisCy, irisR * 0.72, 0, Math.PI * 2);
        ctx.fill();

        // Radial Iris Trabeculae / Fibers (distinct non-flat optical structure)
        const fiberCount = 20;
        for (let fi = 0; fi < fiberCount; fi++) {
          const ang = (fi / fiberCount) * Math.PI * 2;
          const isLight = fi % 2 === 0;
          ctx.strokeStyle = isLight ? rgba(irisBright, 0.36) : rgba(irisDark, 0.38);
          ctx.lineWidth = Math.max(0.6, irisR * 0.058);
          ctx.beginPath();
          ctx.moveTo(Math.cos(ang) * irisR * 0.34, irisCy + Math.sin(ang) * irisR * 0.34);
          ctx.lineTo(Math.cos(ang) * irisR * 0.88, irisCy + Math.sin(ang) * irisR * 0.88);
          ctx.stroke();
        }

        // Upper lid cast shadow across top of iris (stronger with higher eyeDepth)
        const irisLidShadow = ctx.createLinearGradient(0, irisCy - irisR, 0, irisCy + irisR * 0.16);
        irisLidShadow.addColorStop(0, rgba('#0c060a', 0.22 + depth * 0.36));
        irisLidShadow.addColorStop(0.55, rgba('#0c060a', 0.04 + depth * 0.12));
        irisLidShadow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = irisLidShadow;
        ctx.beginPath();
        ctx.arc(0, irisCy, irisR, 0, Math.PI * 2);
        ctx.fill();

        // Dark outer limbal ring
        ctx.strokeStyle = rgba(irisDark, 0.94);
        ctx.lineWidth = Math.max(1.1, irisR * 0.16);
        ctx.beginPath();
        ctx.arc(0, irisCy, irisR * 0.94, 0, Math.PI * 2);
        ctx.stroke();

        // Distinct Jet-Black Pupil Shapes (sized clearly so they never disappear)
        const pType = look.pupilShape || 'round';
        ctx.fillStyle = '#080407';
        ctx.beginPath();
        if (pType === 'feline-slit') {
          const slitH = irisR * 0.78;
          const slitW = irisR * 0.26;
          ctx.moveTo(0, irisCy - slitH);
          ctx.quadraticCurveTo(slitW, irisCy, 0, irisCy + slitH);
          ctx.quadraticCurveTo(-slitW, irisCy, 0, irisCy - slitH);
          ctx.closePath();
        } else if (pType === 'almond-soft') {
          ctx.ellipse(0, irisCy, irisR * 0.31, irisR * 0.56, 0, 0, Math.PI * 2);
        } else if (pType === 'dilated') {
          ctx.arc(0, irisCy, irisR * 0.62, 0, Math.PI * 2);
        } else if (pType === 'pinpoint') {
          ctx.arc(0, irisCy, irisR * 0.25, 0, Math.PI * 2);
        } else if (pType === 'starlight') {
          const outerR = irisR * 0.56;
          const innerR = irisR * 0.24;
          for (let sp = 0; sp < 8; sp++) {
            const rad = sp % 2 === 0 ? outerR : innerR;
            const sAng = (sp * Math.PI) / 4 - Math.PI / 2;
            const sx = Math.cos(sAng) * rad;
            const sy = irisCy + Math.sin(sAng) * rad;
            if (sp === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.closePath();
        } else {
          ctx.arc(0, irisCy, irisR * 0.45, 0, Math.PI * 2);
        }
        ctx.fill();

        // Offset crisp specular catchlights (placed at upper-left iris edge so pupil stays clear!)
        const hlAlpha = 0.95 - depth * 0.12;
        ctx.fillStyle = 'rgba(255, 255, 255, ' + hlAlpha.toFixed(2) + ')';
        ctx.beginPath();
        ctx.arc(-irisR * 0.44, irisCy - irisR * 0.38, Math.max(0.75, irisR * 0.14), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.68)';
        ctx.beginPath();
        ctx.arc(irisR * 0.36, irisCy + irisR * 0.32, Math.max(0.45, irisR * 0.08), 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Subtle lower waterline rim
        ctx.strokeStyle = rgba(skin.shadow, 0.45);
        ctx.lineWidth = Math.max(0.7, hr * 0.02);
        ctx.beginPath();
        ctx.moveTo(-eyeRx * 0.85, 0);
        ctx.quadraticCurveTo(0, eyeRy * 1.54, eyeRx * 0.85, 0);
        ctx.stroke();

        // Lush tapered upper lash line
        ctx.strokeStyle = '#1d1015';
        ctx.lineWidth = Math.max(1.5, hr * 0.052);
        ctx.beginPath();
        ctx.moveTo(-eyeRx * 1.02, 0);
        ctx.quadraticCurveTo(0, -eyeRy * 1.9, eyeRx * 1.04, 0);
        ctx.stroke();

        // Delicate outer lash sweep
        for (let k = 0; k < 3; k++) {
          const lx = side * eyeRx * (0.68 + k * 0.16);
          const ly = -eyeRy * (0.55 - k * 0.22);
          ctx.lineWidth = Math.max(0.8, hr * 0.026);
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.quadraticCurveTo(lx + side * eyeRx * 0.14, ly - eyeRy * 0.28, lx + side * eyeRx * 0.24, ly - eyeRy * 0.44);
          ctx.stroke();
        }

        // Eyeliner variants
        if (look.eyeliner !== 'none') {
          const outerX = side * eyeRx * 1.02;
          ctx.strokeStyle = '#180e13';
          ctx.lineWidth = look.eyeliner === 'smoky-kohl' ? Math.max(2.0, hr * 0.07) : Math.max(1.4, hr * 0.048);
          ctx.beginPath();
          ctx.moveTo(outerX, 0);
          if (look.eyeliner === 'classic-wing') {
            ctx.quadraticCurveTo(outerX + side * eyeRx * 0.18, -eyeRy * 0.15, outerX + side * eyeRx * 0.34, -eyeRy * 0.62);
          } else if (look.eyeliner === 'editorial-flick') {
            ctx.quadraticCurveTo(outerX + side * eyeRx * 0.24, -eyeRy * 0.25, outerX + side * eyeRx * 0.5, -eyeRy * 0.92);
          } else if (look.eyeliner === 'smoky-kohl') {
            ctx.lineTo(outerX + side * eyeRx * 0.22, -eyeRy * 0.35);
          }
          ctx.stroke();
        }
      }

      ctx.restore();

      // 9. Tapered Feathered Eyebrows
      const browColor = mixHex(look.hairRootHex, '#231512', 0.48);
      const browY = eyeY - eyeRy * 1.5 - hr * 0.08;
      const innerX = ex - side * eyeRx * 0.96;
      const outerBrowX = ex + side * eyeRx * 1.1;
      let peakY = browY - hr * 0.09;
      let outerY = browY + hr * 0.03;
      if (look.browStyle === 'soft-straight') {
        peakY = browY - hr * 0.02;
        outerY = browY + hr * 0.01;
      } else if (look.browStyle === 'high-regal') {
        peakY = browY - hr * 0.15;
        outerY = browY + hr * 0.04;
      }

      const browThick =
        look.browStyle === 'feathered'
          ? hr * 0.055
          : look.browStyle === 'sleek'
          ? hr * 0.034
          : hr * 0.044;

      ctx.fillStyle = rgba(browColor, 0.88);
      ctx.beginPath();
      ctx.moveTo(innerX, browY + browThick * 0.6);
      ctx.quadraticCurveTo(ex + side * eyeRx * 0.22, peakY - browThick * 0.6, outerBrowX, outerY);
      ctx.quadraticCurveTo(ex + side * eyeRx * 0.22, peakY + browThick * 0.45, innerX, browY + browThick * 1.15);
      ctx.closePath();
      ctx.fill();
    });

    // 10. Painterly Nose (soft bridge highlight + tip glow + delicate underside shadow)
    const noseTopY = eyeY + hr * 0.04;
    const noseBotY = noseTopY + hr * (0.28 * fs.noseLength);
    const noseW = hr * 0.11 * noseObj.width;

    // Soft bridge highlight
    const bridgeGrad = ctx.createLinearGradient(hc.x, noseTopY, hc.x, noseBotY);
    bridgeGrad.addColorStop(0, rgba(skin.highlight, 0));
    bridgeGrad.addColorStop(0.5, rgba(skin.highlight, 0.55));
    bridgeGrad.addColorStop(1, rgba(skin.highlight, 0.72));
    ctx.strokeStyle = bridgeGrad;
    ctx.lineWidth = Math.max(1.4, hr * 0.055);
    ctx.beginPath();
    ctx.moveTo(hc.x - hr * 0.01, noseTopY + hr * 0.04);
    ctx.lineTo(hc.x, noseBotY - hr * 0.04);
    ctx.stroke();

    // Soft side-bridge shadow
    ctx.strokeStyle = rgba(skin.shadow, 0.42);
    ctx.lineWidth = Math.max(1.0, hr * 0.032);
    ctx.beginPath();
    if (look.noseShape === 'aquiline') {
      ctx.moveTo(hc.x + hr * 0.045, noseTopY + hr * 0.03);
      ctx.quadraticCurveTo(hc.x + hr * 0.07, (noseTopY + noseBotY) * 0.55, hc.x + hr * 0.035, noseBotY - hr * 0.04);
    } else {
      ctx.moveTo(hc.x + hr * 0.04, noseTopY + hr * 0.06);
      ctx.lineTo(hc.x + hr * 0.045, noseBotY - hr * 0.05);
    }
    ctx.stroke();

    // Delicate tip shadow & subtle nostrils
    ctx.strokeStyle = rgba(skin.shadow, 0.65);
    ctx.lineWidth = Math.max(1.0, hr * 0.028);
    ctx.beginPath();
    ctx.moveTo(hc.x - noseW, noseBotY);
    ctx.quadraticCurveTo(hc.x, noseBotY + hr * (0.04 - noseObj.tipLift * 0.14), hc.x + noseW, noseBotY);
    ctx.stroke();

    // 11. Plush Dimensional Lips & Lipstick
    const mouthY = hc.y + hr * 0.56;
    const mouthW = hr * 0.25 * lipObj.width;
    const lipH = hr * 0.084 * fs.lipFullness;
    const lipColor =
      look.lipstick === 'natural'
        ? skin.lipNatural
        : mixHex(skin.lipNatural, lipstickObj.hex, 0.88);
    const upperLipColor = mixHex(lipColor, '#260c13', 0.2);
    const lowerLipHighlight = mixHex(lipColor, '#ffffff', 0.28);

    // Subtle shadow beneath lower lip
    const chinLipShadow = ctx.createRadialGradient(hc.x, mouthY + lipH * 1.45, 1, hc.x, mouthY + lipH * 1.45, mouthW * 0.8);
    chinLipShadow.addColorStop(0, rgba(skin.shadow, 0.45));
    chinLipShadow.addColorStop(1, rgba(skin.shadow, 0));
    ctx.fillStyle = chinLipShadow;
    ctx.beginPath();
    ctx.ellipse(hc.x, mouthY + lipH * 1.45, mouthW * 0.72, lipH * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Upper lip
    ctx.fillStyle = upperLipColor;
    ctx.beginPath();
    ctx.moveTo(hc.x - mouthW, mouthY);
    ctx.quadraticCurveTo(hc.x - mouthW * 0.42, mouthY - lipH * lipObj.arch, hc.x - mouthW * 0.14, mouthY - lipH * 0.64);
    ctx.quadraticCurveTo(hc.x, mouthY - lipH * 0.34, hc.x + mouthW * 0.14, mouthY - lipH * 0.64);
    ctx.quadraticCurveTo(hc.x + mouthW * 0.42, mouthY - lipH * lipObj.arch, hc.x + mouthW, mouthY);
    ctx.quadraticCurveTo(hc.x, mouthY + lipH * 0.18, hc.x - mouthW, mouthY);
    ctx.closePath();
    ctx.fill();

    // Lower lip with vertical cushion gradient
    const lowerGrad = ctx.createLinearGradient(0, mouthY, 0, mouthY + lipH * 1.45);
    lowerGrad.addColorStop(0, lipColor);
    lowerGrad.addColorStop(0.55, lowerLipHighlight);
    lowerGrad.addColorStop(1, upperLipColor);
    ctx.fillStyle = lowerGrad;
    ctx.beginPath();
    ctx.moveTo(hc.x - mouthW * 0.94, mouthY);
    ctx.quadraticCurveTo(hc.x, mouthY + lipH * 1.48, hc.x + mouthW * 0.94, mouthY);
    ctx.quadraticCurveTo(hc.x, mouthY + lipH * 0.18, hc.x - mouthW * 0.94, mouthY);
    ctx.closePath();
    ctx.fill();

    // Soft mouth parting line
    ctx.strokeStyle = rgba(mixHex(lipColor, '#1f070c', 0.68), 0.78);
    ctx.lineWidth = Math.max(0.9, hr * 0.025);
    ctx.beginPath();
    ctx.moveTo(hc.x - mouthW * 0.96, mouthY);
    ctx.quadraticCurveTo(hc.x, mouthY + lipH * 0.18, hc.x + mouthW * 0.96, mouthY);
    ctx.stroke();

    // Cupid's bow & lower-lip satin gleam
    ctx.fillStyle = rgba('#ffffff', Math.max(0.2, lipstickObj.gloss * 0.6));
    ctx.beginPath();
    ctx.ellipse(hc.x, mouthY + lipH * 0.56, mouthW * 0.34, lipH * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawHairFront(ctx, rig, lookConfig) {
    const look = clampLook(lookConfig);
    const hc = rig.joints.headCenter;
    const hr = rig.headR;
    const j = rig.joints;
    const style = look.hairStyle;
    const deepShadow = mixHex(look.hairRootHex, '#140b0e', 0.52);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const grad = makeHairGradient(ctx, look, hc.y - hr * 1.25, hc.y + hr * 2.2);

    if (style === 'braided-crown' || style === 'milkmaid-braids') {
      // Soft middle-part crown + woven halo braid
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(hc.x - hr * 1.04, hc.y - hr * 0.06);
      ctx.bezierCurveTo(hc.x - hr * 1.04, hc.y - hr * 1.18, hc.x + hr * 1.04, hc.y - hr * 1.18, hc.x + hr * 1.04, hc.y - hr * 0.06);
      ctx.quadraticCurveTo(hc.x + hr * 0.52, hc.y - hr * 0.76, hc.x, hc.y - hr * 0.74);
      ctx.quadraticCurveTo(hc.x - hr * 0.52, hc.y - hr * 0.76, hc.x - hr * 1.04, hc.y - hr * 0.06);
      ctx.closePath();
      ctx.fill();

      const rows = style === 'milkmaid-braids' ? 2 : 1;
      for (let row = 0; row < rows; row++) {
        const yOff = row * -hr * 0.2;
        for (let i = -4; i <= 4; i++) {
          const angle = (i / 5) * 0.92;
          const bx = hc.x + Math.sin(angle) * hr * 0.94;
          const by = hc.y - Math.cos(angle) * hr * 0.96 + yOff;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.ellipse(bx, by, hr * 0.24, hr * 0.15, angle, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = rgba(deepShadow, 0.45);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    } else if (style === 'pixie-coiffure') {
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(hc.x - hr * 1.04, hc.y - hr * 0.12);
      ctx.bezierCurveTo(hc.x - hr * 1.04, hc.y - hr * 1.18, hc.x + hr * 0.98, hc.y - hr * 1.24, hc.x + hr * 1.05, hc.y - hr * 0.08);
      ctx.quadraticCurveTo(hc.x + hr * 0.54, hc.y - hr * 0.62, hc.x - hr * 0.16, hc.y - hr * 0.48);
      ctx.quadraticCurveTo(hc.x - hr * 0.72, hc.y - hr * 0.38, hc.x - hr * 1.04, hc.y - hr * 0.12);
      ctx.closePath();
      ctx.fill();
    } else if (style === 'marie-updo' || style === 'sleek-ponytail' || style === 'romantic-bun' || style === 'slick-gala') {
      // Swept-back royal crown with soft volume
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(hc.x - hr * 1.04, hc.y - hr * 0.06);
      ctx.bezierCurveTo(hc.x - hr * 1.02, hc.y - hr * 1.2, hc.x + hr * 1.02, hc.y - hr * 1.2, hc.x + hr * 1.04, hc.y - hr * 0.06);
      ctx.quadraticCurveTo(hc.x + hr * 0.54, hc.y - hr * 0.78, hc.x, hc.y - hr * 0.75);
      ctx.quadraticCurveTo(hc.x - hr * 0.54, hc.y - hr * 0.78, hc.x - hr * 1.04, hc.y - hr * 0.06);
      ctx.closePath();
      ctx.fill();
    } else {
      // Full voluminous parted crown + graceful face-framing waves (matching Screenshot 1!)
      const partShift = style === 'side-swept-curls' || style === 'couture-lob' ? hr * 0.28 : 0;

      // Crown roots dome
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(hc.x - hr * 1.06, hc.y - hr * 0.02);
      ctx.bezierCurveTo(hc.x - hr * 1.12, hc.y - hr * 1.24, hc.x + hr * 1.12, hc.y - hr * 1.24, hc.x + hr * 1.06, hc.y - hr * 0.02);
      ctx.quadraticCurveTo(hc.x + hr * 0.68, hc.y - hr * 0.68, hc.x + partShift, hc.y - hr * 0.78);
      ctx.quadraticCurveTo(hc.x - hr * 0.68, hc.y - hr * 0.68, hc.x - hr * 1.06, hc.y - hr * 0.02);
      ctx.closePath();
      ctx.fill();

      // Soft tapered face-framing ribbons curving cleanly along temples & sweeping behind ears to collarbone
      const isLong =
        style === 'regal-waves' ||
        style === 'silk-straight' ||
        style === 'side-swept-curls' ||
        style === 'mermaid-curls' ||
        style === 'half-up-ribbon' ||
        style === 'hollywood-blowout';
      const frameEndY = isLong ? j.clavicleY + hr * 0.88 : hc.y + hr * 0.92;

      [-1, 1].forEach(function (side) {
        const rootX = hc.x + partShift + side * hr * 0.06;
        const rootY = hc.y - hr * 0.94;
        const tipX = hc.x + side * hr * (isLong ? 1.18 : 1.02);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.bezierCurveTo(
          hc.x + side * hr * 1.12,
          hc.y - hr * 0.84,
          hc.x + side * hr * 1.28,
          hc.y + hr * 0.18,
          tipX,
          frameEndY
        );
        ctx.bezierCurveTo(
          hc.x + side * hr * 0.98,
          frameEndY - hr * 0.55,
          hc.x + side * hr * 0.98,
          hc.y + hr * 0.05,
          hc.x + side * hr * 0.86,
          hc.y - hr * 0.42
        );
        ctx.quadraticCurveTo(hc.x + side * hr * 0.48, hc.y - hr * 0.72, rootX, rootY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = rgba(deepShadow, 0.32);
        ctx.lineWidth = Math.max(0.8, hr * 0.025);
        ctx.stroke();

        if (look.hairHighlightStrength > 0.05) {
          ctx.strokeStyle = rgba(look.hairHighlightHex, look.hairHighlightStrength * 0.48);
          ctx.lineWidth = Math.max(1.0, hr * 0.055);
          ctx.beginPath();
          ctx.moveTo(hc.x + side * hr * 0.44, hc.y - hr * 0.78);
          ctx.bezierCurveTo(
            hc.x + side * hr * 1.08,
            hc.y - hr * 0.52,
            hc.x + side * hr * 1.16,
            hc.y + hr * 0.25,
            tipX - side * hr * 0.08,
            frameEndY - hr * 0.25
          );
          ctx.stroke();
        }
      });
    }

    // Crown Halo Specular Sheen
    if (look.hairHighlightStrength > 0.05) {
      ctx.strokeStyle = rgba(look.hairHighlightHex, look.hairHighlightStrength * 0.52);
      ctx.lineWidth = Math.max(1.6, hr * 0.12);
      ctx.beginPath();
      ctx.arc(hc.x, hc.y - hr * 0.2, hr * 0.82, -Math.PI * 0.76, -Math.PI * 0.24);
      ctx.stroke();
    }

    ctx.restore();
  }

  window.CrownLooks = {
    SKIN_TONES: SKIN_TONES,
    UNDERTONES: UNDERTONES,
    FRECKLE_STYLES: FRECKLE_STYLES,
    MOLE_STYLES: MOLE_STYLES,
    BLUSH_STYLES: BLUSH_STYLES,
    SCAR_STYLES: SCAR_STYLES,
    EYE_SHAPES: EYE_SHAPES,
    EYE_COLORS: EYE_COLORS,
    PUPIL_SHAPES: PUPIL_SHAPES,
    EYE_DEPTH_PRESETS: EYE_DEPTH_PRESETS,
    BROW_STYLES: BROW_STYLES,
    NOSE_SHAPES: NOSE_SHAPES,
    LIP_SHAPES: LIP_SHAPES,
    JAW_SHAPES: JAW_SHAPES,
    EYELINER_STYLES: EYELINER_STYLES,
    EYESHADOW_PALETTES: EYESHADOW_PALETTES,
    LIPSTICK_SHADES: LIPSTICK_SHADES,
    HIGHLIGHTERS: HIGHLIGHTERS,
    HAIR_STYLES: HAIR_STYLES,
    HAIR_COLOR_PRESETS: HAIR_COLOR_PRESETS,
    FACE_SLIDER_LIMITS: FACE_SLIDER_LIMITS,
    createDefaultLook: createDefaultLook,
    clampLook: clampLook,
    getSkinPalette: getSkinPalette,
    drawHairBack: drawHairBack,
    drawHeadAndFace: drawHeadAndFace,
    drawHairFront: drawHairFront,
    colorUtils: {
      normalizeHex: normalizeHex,
      mixHex: mixHex,
      rgba: rgba,
      hslToHex: hslToHex,
      hexToHsl: hexToHsl,
    },
  };
})();
