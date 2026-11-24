(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  function resolveOutfitPalette(wardrobe) {
    const W = window.CrownWardrobe;
    if (!W) {
      return {
        primary: '#ece8e2',
        secondary: '#cfa74e',
        accent: '#2b5ea8',
        trim: '#fffaf2',
        category: 'gowns',
        outfitId: 'versailles-ivory-gown',
      };
    }
    const cfg = W.clampWardrobe(wardrobe || W.createDefaultWardrobe());
    const outfit =
      W.OUTFITS.find(function (o) {
        return o.id === cfg.outfitId;
      }) || W.OUTFITS[0];
    const themeId = cfg.themeId === 'signature' ? outfit.defaultTheme : cfg.themeId;
    const theme =
      W.COLOR_THEMES.find(function (t) {
        return t.id === themeId;
      }) || W.COLOR_THEMES[1];
    return {
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      trim: theme.trim || '#fffaf2',
      category: outfit.category,
      outfitId: outfit.id,
    };
  }

  function resolveLookData(look) {
    const L = window.CrownLooks;
    const cfg = L ? L.clampLook(look || L.createDefaultLook()) : look || {};
    const skinPal = L && typeof L.getSkinPalette === 'function' ? L.getSkinPalette(cfg) : null;

    let lipHex = '#cc7b86';
    if (L && Array.isArray(L.LIPSTICK_SHADES)) {
      const foundLip = L.LIPSTICK_SHADES.find(function (item) {
        return item.id === cfg.lipstick;
      });
      if (foundLip) lipHex = foundLip.hex;
    }

    let eyeHex = cfg.eyeColorHex || '#3b6ca8';
    if (!cfg.eyeColorHex && L && Array.isArray(L.EYE_COLORS)) {
      const foundEye = L.EYE_COLORS.find(function (item) {
        return item.id === cfg.eyeColorId;
      });
      if (foundEye) eyeHex = foundEye.hex;
    }

    let blushHex = (skinPal && skinPal.blushTint) || '#e0899a';
    if (L && Array.isArray(L.BLUSH_STYLES)) {
      const foundBlush = L.BLUSH_STYLES.find(function (item) {
        return item.id === cfg.blush;
      });
      if (foundBlush && cfg.blush !== 'none') blushHex = foundBlush.hex;
    }

    let shadowHex = '#d8b57d';
    let shadowAlpha = 0.25;
    if (L && Array.isArray(L.EYESHADOW_PALETTES)) {
      const foundShadow = L.EYESHADOW_PALETTES.find(function (item) {
        return item.id === cfg.eyeshadow;
      });
      if (foundShadow) {
        shadowHex = foundShadow.hex;
        shadowAlpha = foundShadow.alpha;
      }
    }

    return {
      cfg: cfg,
      skinHex: (skinPal && skinPal.base) || '#f0cbb4',
      skinShadowHex: (skinPal && skinPal.shadow) || '#ca987b',
      skinHighlightHex: (skinPal && skinPal.highlight) || '#fde5d5',
      blushHex: blushHex,
      blushIntensity: typeof cfg.blushIntensity === 'number' ? cfg.blushIntensity : 0.45,
      hairRootHex: cfg.hairRootHex || '#a9854c',
      hairTipHex: cfg.hairTipHex || '#e9d39c',
      hairHighlightHex: cfg.hairHighlightHex || '#fff2cf',
      eyeHex: eyeHex,
      eyeShape: cfg.eyeShape || 'almond',
      eyeSize: cfg.faceSliders && typeof cfg.faceSliders.eyeSize === 'number' ? cfg.faceSliders.eyeSize : 1.0,
      eyeSpacing: cfg.faceSliders && typeof cfg.faceSliders.eyeSpacing === 'number' ? cfg.faceSliders.eyeSpacing : 1.0,
      eyeDepth: typeof cfg.eyeDepth === 'number' ? cfg.eyeDepth : 0.55,
      pupilShape: cfg.pupilShape || 'round',
      eyeliner: cfg.eyeliner || 'classic-wing',
      shadowHex: shadowHex,
      shadowAlpha: shadowAlpha,
      lipHex: lipHex,
      lipFullness: cfg.faceSliders && typeof cfg.faceSliders.lipFullness === 'number' ? cfg.faceSliders.lipFullness : 1.0,
      browStyle: cfg.browStyle || 'arched',
      freckles: cfg.freckles || 'none',
      mole: cfg.mole || 'none',
      hairStyle: cfg.hairStyle || 'regal-waves',
    };
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#ffffff').replace('#', '');
    const r = parseInt(clean.slice(0, 2), 16) || 200;
    const g = parseInt(clean.slice(2, 4), 16) || 170;
    const b = parseInt(clean.slice(4, 6), 16) || 150;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  const _sharedTexCache = Object.create(null);
  const _sharedMatCache = Object.create(null);
  const _sharedGeoCache = Object.create(null);

  function markShared(res) {
    if (res) {
      if (!res.userData) res.userData = {};
      res.userData._sharedCache = true;
    }
    return res;
  }

  function getCachedGeo(key, builder) {
    if (!_sharedGeoCache[key]) {
      _sharedGeoCache[key] = markShared(builder());
    }
    return _sharedGeoCache[key];
  }

  function getCachedStdMat(key, params) {
    if (!_sharedMatCache[key]) {
      _sharedMatCache[key] = markShared(new THREE.MeshStandardMaterial(params));
    }
    return _sharedMatCache[key];
  }

  function clearSharedCaches() {
    Object.keys(_sharedTexCache).forEach(function (k) {
      if (_sharedTexCache[k] && typeof _sharedTexCache[k].dispose === 'function') _sharedTexCache[k].dispose();
      delete _sharedTexCache[k];
    });
    Object.keys(_sharedMatCache).forEach(function (k) {
      if (_sharedMatCache[k] && typeof _sharedMatCache[k].dispose === 'function') _sharedMatCache[k].dispose();
      delete _sharedMatCache[k];
    });
    Object.keys(_sharedGeoCache).forEach(function (k) {
      if (_sharedGeoCache[k] && typeof _sharedGeoCache[k].dispose === 'function') _sharedGeoCache[k].dispose();
      delete _sharedGeoCache[k];
    });
  }

  /**
   * 512x512 (player) / 256x256 (NPC) crisp planar-projected royal face texture.
   * Front face vertices map cleanly into x=[0.16..0.84], y=[0.06..0.94]; back-of-head maps to [0..0.12].
   */
  function createRoyalFaceTexture(lookInfo, texSize) {
    const THREE = window.THREE;
    const size = texSize || 512;
    const s = size / 512;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (s !== 1) ctx.scale(s, s);
    const vSize = 512;

    ctx.fillStyle = lookInfo.skinHex;
    ctx.fillRect(0, 0, vSize, vSize);

    // Subtle facial volumetric sculpting (forehead light, temple & jaw contour)
    const cx = vSize * 0.5;
    const faceGlow = ctx.createRadialGradient(cx, vSize * 0.48, vSize * 0.04, cx, vSize * 0.5, vSize * 0.36);
    faceGlow.addColorStop(0, hexToRgba(lookInfo.skinHighlightHex, 0.36));
    faceGlow.addColorStop(0.65, hexToRgba(lookInfo.skinHex, 0));
    faceGlow.addColorStop(1, hexToRgba(lookInfo.skinShadowHex, 0.42));
    ctx.fillStyle = faceGlow;
    ctx.fillRect(vSize * 0.1, 0, vSize * 0.85, vSize);

    // Eye anchors match planar projection of sculptural head (+y = top of canvas in UV, canvas y=0 is top!)
    // In BufferGeometry UV v=0 is chin (bottom -> canvas y=vSize), v=1 is crown (top -> canvas y=0)
    const eyeY = vSize * 0.47;
    const eyeSep = vSize * 0.095 * lookInfo.eyeSpacing;
    const eyeScale = 0.92 + (lookInfo.eyeSize - 0.85) * 0.55;
    const rx = 25 * eyeScale;
    const ry = (lookInfo.eyeShape === 'doe' ? 16.5 : lookInfo.eyeShape === 'hooded' ? 12.2 : 14.5) * eyeScale;

    // Airbrushed Cheekbone Blush
    if (lookInfo.blushIntensity > 0.02) {
      [-1, 1].forEach(function (side) {
        const bx = cx + side * vSize * 0.14;
        const by = vSize * 0.585;
        const bg = ctx.createRadialGradient(bx, by, 4, bx, by, 44);
        bg.addColorStop(0, hexToRgba(lookInfo.blushHex, Math.min(0.55, lookInfo.blushIntensity * 0.5)));
        bg.addColorStop(1, hexToRgba(lookInfo.blushHex, 0));
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(bx, by, 44, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Soft sculpted nose bridge highlight + subtle nostrils shadow (zero cone polygon needed!)
    const noseBridge = ctx.createLinearGradient(cx, eyeY - 4, cx, vSize * 0.615);
    noseBridge.addColorStop(0, hexToRgba(lookInfo.skinHighlightHex, 0.45));
    noseBridge.addColorStop(1, hexToRgba(lookInfo.skinHighlightHex, 0.14));
    ctx.strokeStyle = noseBridge;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, eyeY - 2);
    ctx.lineTo(cx, vSize * 0.6);
    ctx.stroke();

    ctx.fillStyle = hexToRgba(lookInfo.skinShadowHex, 0.34);
    ctx.beginPath();
    ctx.ellipse(cx, vSize * 0.616, 15, 5.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = hexToRgba(lookInfo.skinShadowHex, 0.55);
    [-1, 1].forEach(function (s) {
      ctx.beginPath();
      ctx.ellipse(cx + s * 6.5, vSize * 0.62, 2.8, 1.6, s * 0.25, 0, Math.PI * 2);
      ctx.fill();
    });

    // Freckles
    if (lookInfo.freckles && lookInfo.freckles !== 'none') {
      ctx.fillStyle = hexToRgba(lookInfo.skinShadowHex, 0.55);
      const count = lookInfo.freckles === 'full-cheek' ? 32 : 16;
      for (let i = 0; i < count; i++) {
        const fx = cx + Math.sin(i * 7.3) * (lookInfo.freckles === 'light-nose' ? 28 : 66);
        const fy = vSize * 0.555 + Math.cos(i * 4.1) * 14;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Beauty Mark / Mole
    if (lookInfo.mole && lookInfo.mole !== 'none') {
      ctx.fillStyle = '#331d19';
      let mx = cx - 44;
      let my = vSize * 0.57;
      if (lookInfo.mole === 'lip-corner') {
        mx = cx + 32;
        my = vSize * 0.695;
      } else if (lookInfo.mole === 'brow-arch') {
        mx = cx + 48;
        my = eyeY - 30;
      }
      ctx.beginPath();
      ctx.arc(mx, my, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // High-Definition Living Eyes (Orbital Depth + Eyeshadow + Optical Iris + Distinct Pupil Shape)
    const depth = typeof lookInfo.eyeDepth === 'number' ? lookInfo.eyeDepth : 0.55;
    const tiltAngle = lookInfo.eyeShape === 'cat-eye' ? -0.14 : lookInfo.eyeShape === 'doe' ? 0.03 : -0.06;

    [-1, 1].forEach(function (side) {
      const ex = cx + side * eyeSep;
      ctx.save();
      ctx.translate(ex, eyeY);
      ctx.rotate(side * tiltAngle);

      // Orbital depth socket shadow + eyeshadow
      const sock = ctx.createRadialGradient(0, -3, rx * 0.25, 0, -2, rx * 1.48);
      sock.addColorStop(0, hexToRgba(lookInfo.shadowHex, Math.max(0.18 + depth * 0.34, lookInfo.shadowAlpha)));
      sock.addColorStop(1, hexToRgba(lookInfo.skinHex, 0));
      ctx.fillStyle = sock;
      ctx.beginPath();
      ctx.ellipse(0, -2, rx * 1.45, ry * 1.55, 0, 0, Math.PI * 2);
      ctx.fill();

      // Crease shadow arc
      ctx.strokeStyle = hexToRgba(lookInfo.skinShadowHex, 0.35 + depth * 0.35);
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(-rx * 0.9, -ry * 0.72);
      ctx.quadraticCurveTo(0, -ry * 1.55, rx * 0.95, -ry * 0.65);
      ctx.stroke();

      // Almond Eye Sclera Opening
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-rx, 1);
      ctx.bezierCurveTo(-rx * 0.48, -ry * 1.08, rx * 0.48, -ry * 1.08, rx, 0);
      ctx.bezierCurveTo(rx * 0.46, ry * 0.92, -rx * 0.46, ry * 0.92, -rx, 1);
      ctx.closePath();

      const scleraGrad = ctx.createLinearGradient(0, -ry, 0, ry);
      scleraGrad.addColorStop(0, '#cfc7ca');
      scleraGrad.addColorStop(0.28, '#fffcf9');
      scleraGrad.addColorStop(1, '#f1eae6');
      ctx.fillStyle = scleraGrad;
      ctx.fill();
      ctx.clip();

      // Tear duct pink corner
      ctx.fillStyle = 'rgba(214, 130, 140, 0.55)';
      ctx.beginPath();
      ctx.arc(-side * rx * 0.88, 0.5, rx * 0.14, 0, Math.PI * 2);
      ctx.fill();

      // Multi-ring Optical Iris
      const irisR = ry * 0.9;
      const irisGrad = ctx.createRadialGradient(0, irisR * 0.12, irisR * 0.12, 0, 0, irisR);
      irisGrad.addColorStop(0, lookInfo.eyeHex);
      irisGrad.addColorStop(0.68, lookInfo.eyeHex);
      irisGrad.addColorStop(0.9, '#1a121d');
      irisGrad.addColorStop(1, '#0d0810');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.arc(0, 0, irisR, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Golden/Bright Iris Collarette Rim
      ctx.strokeStyle = 'rgba(255, 240, 200, 0.25)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, irisR * 0.56, 0, Math.PI * 2);
      ctx.stroke();

      // Crisp CAS Pupil Shapes
      ctx.fillStyle = '#090609';
      const pShape = lookInfo.pupilShape;
      if (pShape === 'feline-slit') {
        ctx.beginPath();
        ctx.ellipse(0, 0, irisR * 0.22, irisR * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (pShape === 'almond-soft') {
        ctx.beginPath();
        ctx.ellipse(0, 0, irisR * 0.36, irisR * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (pShape === 'dilated') {
        ctx.beginPath();
        ctx.arc(0, 0, irisR * 0.62, 0, Math.PI * 2);
        ctx.fill();
      } else if (pShape === 'pinpoint') {
        ctx.beginPath();
        ctx.arc(0, 0, irisR * 0.25, 0, Math.PI * 2);
        ctx.fill();
      } else if (pShape === 'starlight') {
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const ang = (k / 8) * Math.PI * 2;
          const rPt = k % 2 === 0 ? irisR * 0.58 : irisR * 0.28;
          if (k === 0) ctx.moveTo(Math.cos(ang) * rPt, Math.sin(ang) * rPt);
          else ctx.lineTo(Math.cos(ang) * rPt, Math.sin(ang) * rPt);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, irisR * 0.44, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glossy Living Catchlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.beginPath();
      ctx.arc(-irisR * 0.34, -irisR * 0.34, irisR * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
      ctx.beginPath();
      ctx.arc(irisR * 0.28, irisR * 0.28, irisR * 0.12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Upper Eyelash Line + Parisian Winged Eyeliner
      ctx.strokeStyle = '#150d12';
      ctx.lineWidth = lookInfo.eyeliner === 'none' ? 2.4 : 4.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-rx, 1);
      ctx.bezierCurveTo(-rx * 0.48, -ry * 1.12, rx * 0.48, -ry * 1.12, rx, 0);
      if (lookInfo.eyeliner !== 'none') {
        ctx.lineTo(rx + side * 8, -6);
      }
      ctx.stroke();

      // Lower Lash Shadow
      ctx.strokeStyle = 'rgba(42, 26, 30, 0.38)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-rx * 0.72, ry * 0.42);
      ctx.quadraticCurveTo(0, ry * 0.94, rx * 0.78, ry * 0.35);
      ctx.stroke();

      ctx.restore();

      // Arched Feathered Eyebrows
      ctx.strokeStyle = lookInfo.hairRootHex;
      ctx.lineWidth = 4.6;
      ctx.lineCap = 'round';
      const browY = eyeY - ry * 1.75;
      ctx.beginPath();
      ctx.moveTo(ex - side * rx * 0.85, browY + 4);
      ctx.quadraticCurveTo(
        ex + side * rx * 0.1,
        browY - (lookInfo.browStyle === 'soft-straight' ? 4 : 9),
        ex + side * rx * 1.08,
        browY + 2
      );
      ctx.stroke();
    });

    // Sculpted Cupid's Bow Couture Lips
    const lipY = vSize * 0.71;
    const lipW = 28 * (0.9 + lookInfo.lipFullness * 0.14);
    const lipH = 10.5 * (0.82 + lookInfo.lipFullness * 0.28);

    ctx.fillStyle = lookInfo.lipHex;
    ctx.beginPath();
    ctx.moveTo(cx - lipW, lipY);
    ctx.quadraticCurveTo(cx - lipW * 0.42, lipY - lipH * 0.92, cx - lipW * 0.16, lipY - lipH * 0.76);
    ctx.quadraticCurveTo(cx, lipY - lipH * 0.38, cx + lipW * 0.16, lipY - lipH * 0.76);
    ctx.quadraticCurveTo(cx + lipW * 0.42, lipY - lipH * 0.92, cx + lipW, lipY);
    ctx.quadraticCurveTo(cx, lipY + 2, cx - lipW, lipY);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx - lipW * 0.92, lipY);
    ctx.quadraticCurveTo(cx, lipY + lipH * 1.55, cx + lipW * 0.92, lipY);
    ctx.quadraticCurveTo(cx, lipY + 1.2, cx - lipW * 0.92, lipY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(48, 18, 26, 0.44)';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(cx - lipW * 0.85, lipY);
    ctx.quadraticCurveTo(cx, lipY + 2.2, cx + lipW * 0.85, lipY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 242, 246, 0.48)';
    ctx.beginPath();
    ctx.ellipse(cx, lipY + lipH * 0.56, lipW * 0.36, lipH * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  /**
   * 512x512 (player) / 256x256 (NPC) tailored haute-couture bodice, bra/panties, or gown fabric texture.
   */
  function createCoutureFabricTexture(primaryHex, goldHex, trimHex, outfitId, role, skinHex, texSize) {
    const THREE = window.THREE;
    const size = texSize || 512;
    const s = size / 512;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (s !== 1) ctx.scale(s, s);
    const vSize = 512;

    if (role === 'royal' && outfitId === 'foundation-slip') {
      // Crisp satin lacy bralette & high-cut panties painted directly on bare skin torso
      ctx.fillStyle = skinHex || '#f0cbb4';
      ctx.fillRect(0, 0, vSize, vSize);

      const braTop = vSize * 0.22;
      const braBot = vSize * 0.4;
      ctx.fillStyle = primaryHex;
      ctx.fillRect(0, braTop, vSize, braBot - braTop);
      ctx.strokeStyle = goldHex;
      ctx.lineWidth = 4;
      ctx.strokeRect(0, braTop, vSize, braBot - braTop);

      ctx.fillStyle = primaryHex;
      ctx.fillRect(0, vSize * 0.8, vSize, vSize * 0.2);
      ctx.strokeStyle = goldHex;
      ctx.strokeRect(0, vSize * 0.8, vSize, vSize * 0.2);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    const baseGrad = ctx.createLinearGradient(0, 0, 0, vSize);
    baseGrad.addColorStop(0, primaryHex);
    baseGrad.addColorStop(0.55, primaryHex);
    baseGrad.addColorStop(1, hexToRgba(primaryHex, 1));
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, vSize, vSize);

    // Subtle silk satin weave & vertical couture princess seams
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 2.5;
    for (let x = 16; x < vSize; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 8, vSize);
      ctx.stroke();
    }

    if (role === 'royal') {
      // Gold embroidered corset boning & Baroque floral damask
      ctx.strokeStyle = hexToRgba(goldHex, 0.52);
      ctx.lineWidth = 2.4;
      for (let gx = 48; gx < vSize; gx += 96) {
        for (let gy = 56; gy < vSize - 64; gy += 96) {
          ctx.beginPath();
          ctx.ellipse(gx, gy, 16, 26, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(gx, gy, 6, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      // Ornate gold & cream embroidered gown hem band
      ctx.fillStyle = hexToRgba(goldHex, 0.88);
      ctx.fillRect(0, vSize - 42, vSize, 14);
      ctx.fillStyle = trimHex;
      ctx.fillRect(0, vSize - 22, vSize, 8);
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    return tex;
  }

  /**
   * Feathered Alpha-Card Silky Hair Strand Texture (replaces Play-Doh Tubes completely!)
   */
  function createHairStrandTexture(rootHex, tipHex, highlightHex) {
    const THREE = window.THREE;
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    ctx.clearRect(0, 0, size, size);

    // Rich strand silhouette (rounded feathered tips along bottom!)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, 0);
    ctx.lineTo(size, size * 0.78);
    for (let x = size; x >= 0; x -= 16) {
      const tipY = size * (0.82 + 0.16 * Math.abs(Math.sin(x * 0.08)));
      ctx.lineTo(x, tipY);
    }
    ctx.closePath();
    ctx.clip();

    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, rootHex);
    grad.addColorStop(0.38, tipHex);
    grad.addColorStop(1, tipHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Crisp silk hair strands & specular highlights
    for (let x = 2; x < size; x += 5) {
      ctx.strokeStyle = x % 15 === 0 ? hexToRgba(highlightHex, 0.42) : 'rgba(20, 12, 16, 0.18)';
      ctx.lineWidth = x % 15 === 0 ? 2.2 : 1.1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.bezierCurveTo(x - 4, size * 0.35, x + 5, size * 0.7, x, size);
      ctx.stroke();
    }
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }

  /**
   * Builds a seamless sculpted anatomical head with delicate cheekbone/chin heart-taper,
   * soft integrated nasal bridge & nose tip vertices (zero cone primitives!),
   * and planar front-hemisphere UVs so every facial detail renders razor sharp.
   */
  function buildSculptedHeadGeometry() {
    const THREE = window.THREE;
    const latSegs = 24;
    const lonSegs = 36;
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let iy = 0; iy <= latSegs; iy++) {
      const vFrac = iy / latSegs; // 0 = chin base (-0.122), 1 = crown (+0.126)
      const phi = vFrac * Math.PI;
      const yBase = -Math.cos(phi) * 0.124;

      // Heart-tapered fashion doll jaw profile
      const ringR = Math.sin(phi) * (0.095 + (vFrac < 0.35 ? -0.016 * (1 - vFrac / 0.35) : 0.008));

      for (let ix = 0; ix <= lonSegs; ix++) {
        const uFrac = ix / lonSegs;
        const theta = (uFrac - 0.5) * Math.PI * 2; // 0 is front +Z
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        let x = sinT * ringR * 0.92;
        let y = yBase;
        let z = cosT * ringR * 1.02;

        // Soft integrated sculptural nose bridge & tip between y=-0.025..+0.02, |x| < 0.022, z > 0
        if (cosT > 0.72) {
          const centerAlign = Math.max(0, 1 - Math.abs(sinT) / 0.24);
          const noseBand = Math.max(0, 1 - Math.abs(vFrac - 0.44) / 0.14);
          const noseLift = centerAlign * noseBand * 0.014;
          z += noseLift;

          // Subtle sculpted lips mound below nose
          const mouthBand = Math.max(0, 1 - Math.abs(vFrac - 0.28) / 0.075);
          const lipAlign = Math.max(0, 1 - Math.abs(sinT) / 0.3);
          z += mouthBand * lipAlign * 0.008;
        }

        // Front-hemisphere planar UV projection: 320px width strictly across the front face!
        let u;
        let v;
        if (cosT > 0.08) {
          u = THREE.MathUtils.clamp(0.5 + (x / 0.105) * 0.34, 0.14, 0.86);
          v = THREE.MathUtils.clamp((y + 0.124) / 0.248, 0.04, 0.96);
        } else {
          // Back/sides map to pure smooth skin corner swatch -> zero smeared eyes on back of head!
          u = 0.04;
          v = 0.5;
        }

        positions.push(x, y, z);
        uvs.push(u, v);
      }
    }

    const row = lonSegs + 1;
    for (let iy = 0; iy < latSegs; iy++) {
      for (let ix = 0; ix < lonSegs; ix++) {
        const a = iy * row + ix;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * Builds a curved layered feathered hair-card shell draping seamlessly over cranium/back/shoulders.
   */
  function buildHairRibbonShell(opts) {
    const THREE = window.THREE;
    const rows = opts.rows || 10;
    const cols = opts.cols || 16;
    const startAngle = opts.startAngle;
    const endAngle = opts.endAngle;
    const topY = opts.topY;
    const botY = opts.botY;
    const topR = opts.topR;
    const botR = opts.botR;
    const zShiftBot = opts.zShiftBot || -0.02;
    const waveAmp = opts.waveAmp || 0.014;

    const positions = [];
    const uvs = [];
    const indices = [];

    for (let r = 0; r <= rows; r++) {
      const vt = r / rows; // 0=top, 1=bottom tip
      const y = topY + (botY - topY) * vt;
      const rad = topR + (botR - topR) * Math.pow(vt, 0.75) + Math.sin(vt * Math.PI * 2.5) * waveAmp;
      const zOff = zShiftBot * vt;

      for (let c = 0; c <= cols; c++) {
        const ut = c / cols;
        const ang = startAngle + (endAngle - startAngle) * ut;
        const x = Math.sin(ang) * rad * 0.96;
        const z = Math.cos(ang) * rad + zOff;
        positions.push(x, y, z);
        uvs.push(ut, 1 - vt);
      }
    }

    const stride = cols + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const a = r * stride + c;
        const b = a + 1;
        const cc = a + stride;
        const d = cc + 1;
        indices.push(a, cc, b);
        indices.push(b, cc, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * Builds continuous seamless anatomical torso-to-collarbone lofted BufferGeometry
   * driven directly by CAS body ratios (hourglass, pear, apple, rectangle, etc.).
   */
  function buildAnatomicalTorsoGeometry(scales) {
    const THREE = window.THREE;
    const radialSegs = 28;
    const sh = scales.shoulders;
    const bu = scales.bust;
    const wa = scales.waist;
    const hh = scales.highHip;
    const hi = scales.hips;

    const rings = [
      [0.0, 0.138 * hi, 0.098 * hi, 0.0],
      [0.06, 0.184 * hi, 0.122 * hi, -0.008],
      [0.12, 0.168 * hh, 0.112 * hh, -0.004],
      [0.19, 0.124 * wa, 0.088 * wa, 0.002],
      [0.26, 0.118 * wa, 0.086 * wa, 0.004],
      [0.34, 0.144 * bu, 0.102 * bu, 0.014],
      [0.42, 0.152 * bu, 0.112 * bu, 0.022],
      [0.50, 0.156 * sh, 0.092, 0.004],
      [0.56, 0.115 * sh, 0.072, 0.0],
      [0.60, 0.048, 0.048, 0.0],
    ];

    const positions = [];
    const uvs = [];
    const indices = [];

    for (let r = 0; r < rings.length; r++) {
      const ring = rings[r];
      const y = ring[0];
      const rx = ring[1];
      const rz = ring[2];
      const zOff = ring[3];
      const v = r / (rings.length - 1);

      for (let s = 0; s <= radialSegs; s++) {
        const u = s / radialSegs;
        const theta = u * Math.PI * 2;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        let bustLift = 0;
        if (r === 5 || r === 6) {
          const frontFactor = Math.max(0, cosT);
          const dualCurve = 0.72 + 0.28 * Math.sin(Math.abs(sinT) * Math.PI);
          bustLift = frontFactor * dualCurve * 0.044 * bu;
        }
        let hipLift = 0;
        if (r === 1 || r === 2) {
          const backFactor = Math.max(0, -cosT);
          hipLift = -backFactor * 0.03 * hi;
        }

        positions.push(sinT * rx, y, cosT * rz + zOff + bustLift + hipLift);
        uvs.push(u, v);
      }
    }

    const rowStride = radialSegs + 1;
    for (let r = 0; r < rings.length - 1; r++) {
      for (let s = 0; s < radialSegs; s++) {
        const a = r * rowStride + s;
        const b = a + 1;
        const c = a + rowStride;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * Builds a pleated billowing couture ballgown skirt with soft sinusoidal vertical silk folds & slight back royal sweep.
   */
  function buildPleatedSkirtGeometry(waistW, hipW, lengthY, topY, numPleats) {
    const THREE = window.THREE;
    const rings = 9;
    const segs = 36;
    const positions = [];
    const uvs = [];
    const indices = [];

    for (let r = 0; r <= rings; r++) {
      const vt = r / rings; // 0 = waist, 1 = floor hem
      const y = topY - vt * lengthY;
      const baseR = waistW + (hipW - waistW) * Math.pow(vt, 0.78);
      const backTrain = vt * 0.085;

      for (let s = 0; s <= segs; s++) {
        const ut = s / segs;
        const theta = ut * Math.PI * 2;
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);
        const pleat = Math.sin(theta * (numPleats || 14)) * 0.024 * vt;
        const rad = baseR + pleat;
        const x = sinT * rad * 1.03;
        const z = cosT * rad * 0.94 - Math.max(0, -cosT) * backTrain;
        positions.push(x, y, z);
        uvs.push(ut * 2, 1 - vt);
      }
    }

    const stride = segs + 1;
    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < segs; s++) {
        const a = r * stride + s;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  /**
   * Seamless continuous lofted arm + flexed elbow + slender forearm + delicate hand (zero shoulder balls!)
   */
  function buildContinuousArmGeometry(side, armR) {
    const THREE = window.THREE;
    const segs = 12;
    // [xCenter, yCenter, zCenter, rx, rz] from shoulder socket down to fingertips
    const rings = [
      [0.0, 0.015, 0.0, armR * 0.72, armR * 0.72],
      [side * 0.012, -0.04, 0.0, armR * 0.92, armR * 0.88],
      [side * 0.025, -0.14, -0.004, armR * 0.82, armR * 0.8],
      [side * 0.036, -0.25, 0.006, armR * 0.72, armR * 0.72], // subtle flexed elbow
      [side * 0.044, -0.37, 0.028, armR * 0.64, armR * 0.6], // tapered forearm
      [side * 0.048, -0.47, 0.046, armR * 0.46, armR * 0.4], // delicate wrist
      [side * 0.05, -0.525, 0.058, armR * 0.56, armR * 0.34], // graceful flat palm
      [side * 0.049, -0.585, 0.068, armR * 0.34, armR * 0.16], // tapered fingertips
      [side * 0.048, -0.60, 0.07, armR * 0.1, armR * 0.06],
    ];

    const positions = [];
    const uvs = [];
    const indices = [];

    for (let r = 0; r < rings.length; r++) {
      const ring = rings[r];
      for (let s = 0; s <= segs; s++) {
        const theta = (s / segs) * Math.PI * 2;
        positions.push(
          ring[0] + Math.sin(theta) * ring[3],
          ring[1],
          ring[2] + Math.cos(theta) * ring[4]
        );
        uvs.push(s / segs, r / (rings.length - 1));
      }
    }

    const stride = segs + 1;
    for (let r = 0; r < rings.length - 1; r++) {
      for (let s = 0; s < segs; s++) {
        const a = r * stride + s;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  function buildSculptedThighGeometry(thighR, thighLen) {
    const THREE = window.THREE;
    const pts = [
      new THREE.Vector2(thighR * 0.56, -thighLen - 0.025),
      new THREE.Vector2(thighR * 0.62, -thighLen * 0.85),
      new THREE.Vector2(thighR * 0.82, -thighLen * 0.48),
      new THREE.Vector2(thighR * 0.96, -thighLen * 0.16),
      new THREE.Vector2(thighR * 0.86, 0.01),
    ];
    return new THREE.LatheGeometry(pts, 16);
  }

  function buildSculptedShinGeometry(thighR, shinLen) {
    const THREE = window.THREE;
    const pts = [
      new THREE.Vector2(thighR * 0.36, -shinLen + 0.068),
      new THREE.Vector2(thighR * 0.42, -shinLen * 0.72),
      new THREE.Vector2(thighR * 0.66, -shinLen * 0.36),
      new THREE.Vector2(thighR * 0.56, -shinLen * 0.06),
      new THREE.Vector2(thighR * 0.52, 0.032),
    ];
    return new THREE.LatheGeometry(pts, 16);
  }

  /**
   * True ExtrudeGeometry Stiletto Court Pump (sleek arched heel, pointed toe, zero pancake spheres!)
   */
  function buildCouturePumpMesh(shoeMat, isBoot, shinLen) {
    const THREE = window.THREE;
    const footGroup = new THREE.Group();

    const shape = new THREE.Shape();
    shape.moveTo(-0.042, 0.004);
    shape.lineTo(-0.042, 0.072);
    shape.lineTo(-0.022, 0.072);
    shape.lineTo(-0.016, 0.026); // sleek stiletto stem
    shape.quadraticCurveTo(0.022, 0.045, 0.068, 0.022); // graceful instep arch
    shape.lineTo(0.118, 0.008);
    shape.quadraticCurveTo(0.128, 0.002, 0.116, 0.0); // pointed court toe
    shape.lineTo(0.056, 0.0);
    shape.quadraticCurveTo(0.015, 0.032, -0.02, 0.004);
    shape.closePath();

    const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.052,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.005,
      bevelSegments: 2,
    });
    // Orient Shape's X -> +Z forward, Y -> +Y up, depth -> X width centered
    extrudeGeo.rotateY(-Math.PI / 2);
    extrudeGeo.translate(0.026, -shinLen, 0.0);

    const pumpMesh = new THREE.Mesh(extrudeGeo, shoeMat);
    pumpMesh.castShadow = true;
    footGroup.add(pumpMesh);

    if (isBoot) {
      const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.041, shinLen * 0.78, 14), shoeMat);
      cuff.position.set(0, -shinLen * 0.56, 0.004);
      cuff.castShadow = true;
      footGroup.add(cuff);
    }

    return footGroup;
  }

  function buildRoyalCharacterMesh(character, options) {
    const THREE = window.THREE;
    if (!THREE) return null;
    const opts = options || {};
    const role = opts.role || 'royal';
    const isTailoredCoat =
      role === 'guard' ||
      role === 'butler' ||
      role === 'chauffeur' ||
      role === 'chef' ||
      role === 'doctor' ||
      role === 'er_doctor' ||
      role === 'surgeon' ||
      role === 'anesthesiologist';
    const B = window.CrownBodies;
    const A = window.CrownAccessories;
    const char = character || {};
    const body = (char.body && char.body.sliders) || (B ? B.createDefaultBody('hourglass').sliders : {});
    const lookInfo = resolveLookData(char.look);
    const acc = A ? A.clampAccessories(char.accessories || A.createDefaultAccessories()) : char.accessories || {};
    const outfitPal = resolveOutfitPalette(char.wardrobe);

    const root = new THREE.Group();
    root.name = opts.name || 'royal-character';

    const heightScale = body.height || 1.0;
    const legScale = body.legLength || 1.0;
    const shoulderScale = body.shoulders || (isTailoredCoat ? 1.06 : 0.92);
    const bustScale = body.bust || (isTailoredCoat ? 0.94 : 1.05);
    const waistScale = body.waist || (isTailoredCoat ? 0.9 : 0.78);
    const highHipScale = body.highHip || (isTailoredCoat ? 0.94 : 1.04);
    const hipScale = Math.max(body.hips || (isTailoredCoat ? 0.94 : 1.12), highHipScale);
    const armScale = body.arms || 0.9;

    const defaultRoleDress =
      role === 'maid'
        ? '#242129'
        : role === 'guard'
          ? '#911d2c'
          : role === 'butler'
            ? '#1b1d26'
            : role === 'chauffeur'
              ? '#1e2738'
              : role === 'chef'
                ? '#faf7f2'
                : role === 'surgeon'
                  ? '#1e6e8c'
                  : role === 'anesthesiologist'
                    ? '#235a6e'
                    : role === 'doctor' || role === 'er_doctor' || role === 'nurse'
                      ? '#f4f8fc'
                      : outfitPal.primary;
    const defaultRoleGold =
      role === 'maid' || role === 'chef' || role === 'nurse' || role === 'doctor' || role === 'er_doctor' || role === 'surgeon' || role === 'anesthesiologist'
        ? '#faf6f0'
        : role === 'guard' || role === 'butler' || role === 'chauffeur'
          ? '#d9b04e'
          : outfitPal.secondary;

    const dressHex = opts.dressHex || defaultRoleDress;
    const goldHex = opts.trimHex || defaultRoleGold;
    const trimHex =
      role === 'maid' || role === 'guard' || role === 'butler' || role === 'chef' || role === 'chauffeur' || role === 'doctor' || role === 'er_doctor' || role === 'surgeon' || role === 'anesthesiologist' || role === 'nurse'
        ? '#faf6f0'
        : outfitPal.trim || '#fffaf2';

    const skinColor = new THREE.Color(lookInfo.skinHex);
    const dressPrimary = new THREE.Color(dressHex);
    const dressGold = new THREE.Color(goldHex);
    const dressTrim = new THREE.Color(trimHex);

    const textures = [];
    function keepTex(t) {
      if (t && (!t.userData || !t.userData._sharedCache)) textures.push(t);
      return t;
    }

    const isNPC = !opts.showPlumbob;
    let faceTex;
    let fabricTex;
    let hairTex;

    if (isNPC) {
      const faceKey = 'f256|' + lookInfo.skinHex + '|' + lookInfo.eyeHex + '|' + lookInfo.lipHex + '|' + lookInfo.hairRootHex + '|' + lookInfo.eyeShape + '|' + lookInfo.browStyle;
      faceTex = _sharedTexCache[faceKey] || (_sharedTexCache[faceKey] = markShared(createRoyalFaceTexture(lookInfo, 256)));
      const fabKey = 'fab256|' + dressHex + '|' + goldHex + '|' + trimHex + '|' + outfitPal.outfitId + '|' + role + '|' + lookInfo.skinHex;
      fabricTex = _sharedTexCache[fabKey] || (_sharedTexCache[fabKey] = markShared(createCoutureFabricTexture(dressHex, goldHex, trimHex, outfitPal.outfitId, role, lookInfo.skinHex, 256)));
    } else {
      faceTex = keepTex(createRoyalFaceTexture(lookInfo, 512));
      fabricTex = keepTex(createCoutureFabricTexture(dressHex, goldHex, trimHex, outfitPal.outfitId, role, lookInfo.skinHex, 512));
    }
    const hairKey = 'hair|' + lookInfo.hairRootHex + '|' + lookInfo.hairTipHex + '|' + lookInfo.hairHighlightHex;
    hairTex = _sharedTexCache[hairKey] || (_sharedTexCache[hairKey] = markShared(createHairStrandTexture(lookInfo.hairRootHex, lookInfo.hairTipHex, lookInfo.hairHighlightHex)));

    const skinMat = isNPC
      ? getCachedStdMat('skin|' + lookInfo.skinHex, { color: skinColor, roughness: 0.48, metalness: 0.01 })
      : new THREE.MeshPhysicalMaterial({
          color: skinColor,
          roughness: 0.44,
          metalness: 0.01,
          sheen: 0.42,
          sheenRoughness: 0.45,
          sheenColor: new THREE.Color(lookInfo.skinHighlightHex),
          clearcoat: 0.14,
          clearcoatRoughness: 0.56,
        });

    const headFaceMat = isNPC
      ? getCachedStdMat('hface|' + (faceTex.uuid || lookInfo.skinHex), { map: faceTex, roughness: 0.44, metalness: 0.01 })
      : new THREE.MeshPhysicalMaterial({
          map: faceTex,
          roughness: 0.4,
          metalness: 0.01,
          sheen: 0.32,
          sheenColor: new THREE.Color(lookInfo.skinHighlightHex),
          clearcoat: 0.18,
          clearcoatRoughness: 0.52,
        });

    const fabricMat = isNPC
      ? getCachedStdMat('fab|' + (fabricTex.uuid || dressHex), { map: fabricTex, roughness: 0.4, metalness: 0.08, side: THREE.DoubleSide })
      : new THREE.MeshPhysicalMaterial({
          map: fabricTex,
          roughness: 0.36,
          metalness: 0.08,
          sheen: 0.72,
          sheenRoughness: 0.4,
          sheenColor: dressGold,
          side: THREE.DoubleSide,
        });

    const trimMat = getCachedStdMat('trim|' + trimHex, {
      color: dressTrim,
      roughness: 0.36,
      metalness: 0.08,
    });

    const goldMat = getCachedStdMat('gold|' + goldHex, {
      color: dressGold,
      roughness: 0.2,
      metalness: 0.88,
    });

    const hairCardMat = isNPC
      ? getCachedStdMat('hcard|' + (hairTex.uuid || lookInfo.hairRootHex), { map: hairTex, roughness: 0.44, metalness: 0.05, alphaTest: 0.28, side: THREE.DoubleSide })
      : new THREE.MeshPhysicalMaterial({
          map: hairTex,
          roughness: 0.38,
          metalness: 0.05,
          sheen: 0.65,
          sheenColor: new THREE.Color(lookInfo.hairHighlightHex),
          alphaTest: 0.28,
          side: THREE.DoubleSide,
        });

    const hairSolidMat = isNPC
      ? getCachedStdMat('hsolid|' + lookInfo.hairRootHex, { color: new THREE.Color(lookInfo.hairRootHex), roughness: 0.48 })
      : new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(lookInfo.hairRootHex),
          roughness: 0.42,
          sheen: 0.5,
          sheenColor: new THREE.Color(lookInfo.hairHighlightHex),
        });

    const gloveMat =
      role === 'guard'
        ? trimMat
        : acc.gloves === 'noir-satin'
          ? getCachedStdMat('glove|noir', { color: 0x221d24, roughness: 0.36 })
          : acc.gloves === 'ivory-opera'
            ? getCachedStdMat('glove|ivory', { color: 0xf7f1e8, roughness: 0.36 })
            : acc.gloves === 'lace-mittens'
              ? goldMat
              : skinMat;

    const shoeColor =
      role === 'guard' || role === 'maid' || role === 'butler' || role === 'chauffeur' || role === 'chef'
        ? new THREE.Color('#1d191e')
        : role === 'doctor' || role === 'er_doctor' || role === 'surgeon' || role === 'anesthesiologist' || role === 'nurse'
          ? new THREE.Color('#eef3f8')
          : acc.shoes === 'barefoot'
            ? skinColor
            : acc.shoes === 'riding-boots'
              ? new THREE.Color('#2a1e1a')
              : dressGold.clone().lerp(new THREE.Color('#23181d'), 0.34);

    const isBarefootRoyal = acc.shoes === 'barefoot' && role === 'royal';
    const shoeMat = getCachedStdMat('shoe|' + shoeColor.getHexString() + '|' + (isBarefootRoyal ? 'b' : 's'), {
      color: shoeColor,
      roughness: isBarefootRoyal ? 0.58 : 0.24,
      metalness: isBarefootRoyal ? 0.02 : 0.38,
    });

    // Ground Contact Shadow (shared unit disc scaled per hipScale)
    const shadowGeo = getCachedGeo('contactShadow', function () {
      const g = new THREE.CircleGeometry(0.45, 16);
      g.rotateX(-Math.PI / 2);
      return g;
    });
    const shadowMat = _sharedMatCache['contactShadowMat'] || (_sharedMatCache['contactShadowMat'] = markShared(
      new THREE.MeshBasicMaterial({ color: 0x1e1318, transparent: true, opacity: 0.32, depthWrite: false })
    ));
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.scale.set(hipScale, 1, hipScale);
    contactShadow.position.y = 0.026;
    root.add(contactShadow);

    const rig = new THREE.Group();
    rig.scale.set(1, heightScale, 1);
    root.add(rig);

    // 7.5-Head Couture Fashion Proportions
    const legLen = 0.94 * legScale;
    const pelvisY = legLen;

    // 1. Articulated Sculpted Thigh + Knee Joint + Calf + ExtrudeGeometry Court Pumps / Boots
    const thighR = 0.062 * Math.min(1.24, Math.max(0.84, body.thighs || hipScale));
    const thighLen = legLen * 0.48;
    const shinLen = legLen - thighLen;
    const isTrousers =
      isTailoredCoat ||
      outfitPal.outfitId === 'parisian-trench-chic' ||
      outfitPal.outfitId === 'equestrian-tailored';
    const isBoot = role === 'guard' || role === 'chauffeur' || acc.shoes === 'riding-boots';

    const thighKey = 'thigh|' + thighR.toFixed(3) + '|' + thighLen.toFixed(3);
    const shinKey = 'shin|' + thighR.toFixed(3) + '|' + shinLen.toFixed(3);
    const thighGeo = getCachedGeo(thighKey, function () { return buildSculptedThighGeometry(thighR, thighLen); });
    const shinGeo = getCachedGeo(shinKey, function () { return buildSculptedShinGeometry(thighR, shinLen); });

    const pumpExtrudeKey = 'pump|' + shinLen.toFixed(3);
    const sharedPumpGeo = getCachedGeo(pumpExtrudeKey, function () {
      const shape = new THREE.Shape();
      shape.moveTo(-0.042, 0.004);
      shape.lineTo(-0.042, 0.072);
      shape.lineTo(-0.022, 0.072);
      shape.lineTo(-0.016, 0.026);
      shape.quadraticCurveTo(0.022, 0.045, 0.068, 0.022);
      shape.lineTo(0.118, 0.008);
      shape.quadraticCurveTo(0.128, 0.002, 0.116, 0.0);
      shape.lineTo(0.056, 0.0);
      shape.quadraticCurveTo(0.015, 0.032, -0.02, 0.004);
      shape.closePath();
      const eg = new THREE.ExtrudeGeometry(shape, {
        depth: 0.052,
        bevelEnabled: true,
        bevelThickness: 0.006,
        bevelSize: 0.005,
        bevelSegments: 1,
      });
      eg.rotateY(-Math.PI / 2);
      eg.translate(0.026, -shinLen, 0.0);
      return eg;
    });
    const sharedBootCuffGeo = isBoot ? getCachedGeo('bootcuff|' + shinLen.toFixed(3), function () {
      return new THREE.CylinderGeometry(0.052, 0.041, shinLen * 0.78, 12);
    }) : null;

    function makeLeg(side) {
      const hipPivot = new THREE.Group();
      hipPivot.position.set(side * 0.088 * Math.max(0.92, hipScale * 0.9), pelvisY, 0);

      const legMat =
        role === 'guard'
          ? trimMat
          : isTrousers
            ? fabricMat
            : skinMat;
      const thighMesh = new THREE.Mesh(thighGeo, legMat);
      hipPivot.add(thighMesh);

      const kneePivot = new THREE.Group();
      kneePivot.position.set(0, -thighLen, 0);
      hipPivot.add(kneePivot);

      const shinMesh = new THREE.Mesh(shinGeo, legMat);
      kneePivot.add(shinMesh);

      const footGroup = new THREE.Group();
      const pumpMesh = new THREE.Mesh(sharedPumpGeo, shoeMat);
      footGroup.add(pumpMesh);
      if (isBoot && sharedBootCuffGeo) {
        const cuff = new THREE.Mesh(sharedBootCuffGeo, shoeMat);
        cuff.position.set(0, -shinLen * 0.56, 0.004);
        footGroup.add(cuff);
      }
      kneePivot.add(footGroup);
      return { hip: hipPivot, knee: kneePivot };
    }

    const leftLegObj = makeLeg(-1);
    const rightLegObj = makeLeg(1);
    const leftLeg = leftLegObj.hip;
    const rightLeg = rightLegObj.hip;
    const leftKnee = leftLegObj.knee;
    const rightKnee = rightLegObj.knee;
    rig.add(leftLeg);
    rig.add(rightLeg);

    // 2. Sculpted Seamless Anatomical Torso + Pleated Couture Gown
    const bodyGroup = new THREE.Group();
    bodyGroup.position.y = pelvisY;
    rig.add(bodyGroup);

    const isLingerie = role === 'royal' && outfitPal.outfitId === 'foundation-slip';
    const torsoKey = 'torso|' + shoulderScale.toFixed(2) + '|' + bustScale.toFixed(2) + '|' + waistScale.toFixed(2) + '|' + highHipScale.toFixed(2) + '|' + hipScale.toFixed(2);
    const torsoGeo = getCachedGeo(torsoKey, function () {
      return buildAnatomicalTorsoGeometry({
        shoulders: shoulderScale,
        bust: bustScale,
        waist: waistScale,
        highHip: highHipScale,
        hips: hipScale,
      });
    });
    const torsoMesh = new THREE.Mesh(torsoGeo, fabricMat);
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    bodyGroup.add(torsoMesh);

    const isBallgown =
      role === 'royal' &&
      outfitPal.category === 'gowns' &&
      outfitPal.outfitId !== 'midnight-opera-slip';
    const isCasualSkirt =
      role === 'maid' ||
      role === 'nurse' ||
      ((role === 'royal' || role === 'friend' || role === 'citizen' || role === 'staff') &&
        (outfitPal.outfitId === 'riviera-resort-midi' ||
          outfitPal.outfitId === 'riviera-crop-skirt' ||
          outfitPal.outfitId === 'lace-nightgown' ||
          outfitPal.outfitId === 'velvet-morning-robe'));

    let skirtMesh = null;
    if (isBallgown) {
      const skirtKey = 'bskirt|' + waistScale.toFixed(2) + '|' + hipScale.toFixed(2) + '|' + legLen.toFixed(2);
      const skirtGeo = getCachedGeo(skirtKey, function () {
        return buildPleatedSkirtGeometry(0.132 * waistScale, 0.52 * hipScale, legLen + 0.1, 0.19, 14);
      });
      skirtMesh = new THREE.Mesh(skirtGeo, fabricMat);
      skirtMesh.castShadow = true;
      skirtMesh.receiveShadow = true;
      bodyGroup.add(skirtMesh);

      const pepKey = 'peplum|' + waistScale.toFixed(2) + '|' + hipScale.toFixed(2);
      const peplumGeo = getCachedGeo(pepKey, function () {
        const peplumPts = [
          new THREE.Vector2(0.25 * hipScale, -0.18),
          new THREE.Vector2(0.23 * hipScale, 0.02),
          new THREE.Vector2(0.134 * waistScale, 0.195),
        ];
        return new THREE.LatheGeometry(peplumPts, 18, -0.2, Math.PI + 0.4);
      });
      const peplum = new THREE.Mesh(peplumGeo, goldMat);
      peplum.rotation.y = Math.PI * 0.5;
      peplum.scale.set(1.04, 1, 0.94);
      bodyGroup.add(peplum);
    } else if (isCasualSkirt || (role === 'royal' && outfitPal.outfitId === 'midnight-opera-slip')) {
      const skirtLen =
        role === 'maid' || role === 'nurse'
          ? legLen * 0.64
          : outfitPal.outfitId === 'midnight-opera-slip'
            ? legLen * 0.94
            : legLen * 0.58;
      const flare = outfitPal.outfitId === 'midnight-opera-slip' ? 0.24 * hipScale : 0.34 * hipScale;
      const cSkirtKey = 'cskirt|' + waistScale.toFixed(2) + '|' + flare.toFixed(2) + '|' + skirtLen.toFixed(2);
      const skirtGeo = getCachedGeo(cSkirtKey, function () {
        return buildPleatedSkirtGeometry(0.13 * waistScale, flare, skirtLen, 0.19, 10);
      });
      skirtMesh = new THREE.Mesh(skirtGeo, fabricMat);
      skirtMesh.castShadow = true;
      bodyGroup.add(skirtMesh);

      if (role === 'maid') {
        const apron = new THREE.Mesh(
          getCachedGeo('maidApron|' + waistScale.toFixed(2) + '|' + hipScale.toFixed(2) + '|' + skirtLen.toFixed(2), function () {
            return new THREE.CylinderGeometry(0.135 * waistScale, 0.28 * hipScale, skirtLen * 0.82, 12, 1, false, -0.7, 1.4);
          }),
          trimMat
        );
        apron.position.y = 0.17 - skirtLen * 0.42;
        bodyGroup.add(apron);

        const bib = new THREE.Mesh(getCachedGeo('maidBib', function () { return new THREE.BoxGeometry(0.15, 0.22, 0.03); }), trimMat);
        bib.position.set(0, 0.36, 0.11);
        bodyGroup.add(bib);

        const collarRing = new THREE.Mesh(getCachedGeo('maidCollar', function () { return new THREE.TorusGeometry(0.068, 0.015, 6, 14); }), trimMat);
        collarRing.rotation.x = Math.PI * 0.46;
        collarRing.position.set(0, 0.56, 0.014);
        bodyGroup.add(collarRing);

        const bowBack = new THREE.Mesh(getCachedGeo('maidBow', function () { return new THREE.BoxGeometry(0.16, 0.08, 0.04); }), trimMat);
        bowBack.position.set(0, 0.19, -0.14);
        bodyGroup.add(bowBack);
      }
    }

    if (
      !isLingerie &&
      role !== 'guard' &&
      role !== 'doctor' &&
      role !== 'er_doctor' &&
      role !== 'surgeon' &&
      role !== 'anesthesiologist' &&
      role !== 'nurse'
    ) {
      const belt = new THREE.Mesh(
        getCachedGeo('belt|' + waistScale.toFixed(2), function () { return new THREE.TorusGeometry(0.128 * waistScale, 0.014, 8, 18); }),
        goldMat
      );
      belt.rotation.x = Math.PI / 2;
      belt.scale.set(1.02, 0.78, 1);
      belt.position.set(0, 0.2, 0.004);
      bodyGroup.add(belt);
    }

    if (role === 'guard') {
      const sash = new THREE.Mesh(
        getCachedGeo('guardSash', function () { return new THREE.CylinderGeometry(0.14, 0.14, 0.42, 10, 1, true, -0.35, 0.7); }),
        trimMat
      );
      sash.position.set(0, 0.34, 0.015);
      sash.rotation.z = 0.42;
      bodyGroup.add(sash);
    }

    // Distinct 3D Role Uniform Details (Butlers, Chauffeurs, Chefs, Doctors & Nurses)
    const medicalRedMat = getCachedStdMat('medicalRed', { color: 0xc82b3f, roughness: 0.35 });
    const ebonyMat = getCachedStdMat('ebony', { color: 0x181920, roughness: 0.45 });
    if (role === 'butler' || role === 'chauffeur') {
      const shirtBib = new THREE.Mesh(getCachedGeo('shirtBib', function () { return new THREE.BoxGeometry(0.105, 0.26, 0.04); }), trimMat);
      shirtBib.position.set(0, 0.41, 0.095);
      bodyGroup.add(shirtBib);

      if (role === 'butler') {
        const tieGeo = getCachedGeo('bowtie', function () { return new THREE.ConeGeometry(0.022, 0.048, 6); });
        const tailGeo = getCachedGeo('tailcoat', function () { return new THREE.BoxGeometry(0.11, 0.36, 0.025); });
        const tieLeft = new THREE.Mesh(tieGeo, ebonyMat);
        tieLeft.rotation.z = -Math.PI * 0.5;
        tieLeft.position.set(-0.024, 0.545, 0.085);
        bodyGroup.add(tieLeft);
        const tieRight = new THREE.Mesh(tieGeo, ebonyMat);
        tieRight.rotation.z = Math.PI * 0.5;
        tieRight.position.set(0.024, 0.545, 0.085);
        bodyGroup.add(tieRight);
        const tailCoatL = new THREE.Mesh(tailGeo, fabricMat);
        tailCoatL.position.set(-0.068, 0.02, -0.108);
        tailCoatL.rotation.x = 0.08;
        bodyGroup.add(tailCoatL);
        const tailCoatR = new THREE.Mesh(tailGeo, fabricMat);
        tailCoatR.position.set(0.068, 0.02, -0.108);
        tailCoatR.rotation.x = 0.08;
        bodyGroup.add(tailCoatR);
      } else {
        const tie = new THREE.Mesh(getCachedGeo('chTie', function () { return new THREE.BoxGeometry(0.032, 0.22, 0.02); }), ebonyMat);
        tie.position.set(0, 0.42, 0.116);
        bodyGroup.add(tie);
      }

      const btnGeo = getCachedGeo('btnSphere', function () { return new THREE.SphereGeometry(0.011, 6, 5); });
      [-1, 1].forEach(function (side) {
        for (let bi = 0; bi < 3; bi++) {
          const btn = new THREE.Mesh(btnGeo, goldMat);
          btn.position.set(side * 0.042, 0.25 + bi * 0.075, 0.114);
          bodyGroup.add(btn);
        }
      });
    } else if (role === 'chef') {
      const kerchief = new THREE.Mesh(getCachedGeo('kerchief', function () { return new THREE.TorusGeometry(0.062, 0.014, 6, 14); }), medicalRedMat);
      kerchief.rotation.x = Math.PI * 0.46;
      kerchief.position.set(0, 0.555, 0.014);
      bodyGroup.add(kerchief);
      const btnGeo = getCachedGeo('btnSphere', function () { return new THREE.SphereGeometry(0.011, 6, 5); });
      [-1, 1].forEach(function (side) {
        for (let bi = 0; bi < 3; bi++) {
          const btn = new THREE.Mesh(btnGeo, ebonyMat);
          btn.position.set(side * 0.048, 0.27 + bi * 0.075, 0.112);
          bodyGroup.add(btn);
        }
      });
      const waistApron = new THREE.Mesh(
        getCachedGeo('chefApron|' + waistScale.toFixed(2) + '|' + hipScale.toFixed(2), function () {
          return new THREE.CylinderGeometry(0.138 * waistScale, 0.185 * hipScale, 0.42, 12, 1, false, -0.68, 1.36);
        }),
        trimMat
      );
      waistApron.position.set(0, -0.02, 0.018);
      bodyGroup.add(waistApron);
    } else if (role === 'doctor' || role === 'er_doctor' || role === 'surgeon' || role === 'anesthesiologist' || role === 'nurse') {
      const crossV = new THREE.Mesh(getCachedGeo('medCV', function () { return new THREE.BoxGeometry(0.018, 0.056, 0.016); }), medicalRedMat);
      crossV.position.set(-0.078, 0.44, 0.118);
      bodyGroup.add(crossV);
      const crossH = new THREE.Mesh(getCachedGeo('medCH', function () { return new THREE.BoxGeometry(0.056, 0.018, 0.016); }), medicalRedMat);
      crossH.position.set(-0.078, 0.44, 0.118);
      bodyGroup.add(crossH);

      if (role === 'surgeon' || role === 'anesthesiologist') {
        const pocketHex = role === 'surgeon' ? 0x16536a : 0x184252;
        const pocketMat = getCachedStdMat('pocket|' + pocketHex, { color: pocketHex, roughness: 0.45 });
        const pocket = new THREE.Mesh(getCachedGeo('medPocket', function () { return new THREE.BoxGeometry(0.08, 0.085, 0.02); }), pocketMat);
        pocket.position.set(0.072, 0.42, 0.112);
        bodyGroup.add(pocket);
      }

      const stethMat = getCachedStdMat('stethMat', { color: 0x26313d, roughness: 0.35, metalness: 0.25 });
      const stethTubeGeo = getCachedGeo('stethTube', function () {
        const stethCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-0.068, 0.42, 0.102),
          new THREE.Vector3(-0.066, 0.555, 0.04),
          new THREE.Vector3(0, 0.575, -0.055),
          new THREE.Vector3(0.066, 0.555, 0.04),
          new THREE.Vector3(0.062, 0.39, 0.108),
        ]);
        return new THREE.TubeGeometry(stethCurve, 14, 0.008, 6, false);
      });
      const stethTube = new THREE.Mesh(stethTubeGeo, stethMat);
      bodyGroup.add(stethTube);
      const stethBell = new THREE.Mesh(
        getCachedGeo('stethBell', function () { return new THREE.CylinderGeometry(0.018, 0.018, 0.012, 10); }),
        getCachedStdMat('stethBellMat', { color: 0xd0d6de, roughness: 0.18, metalness: 0.85 })
      );
      stethBell.rotation.x = Math.PI * 0.5;
      stethBell.position.set(0.062, 0.375, 0.114);
      bodyGroup.add(stethBell);
    }

    // Slender Sculpted Neck & Collarbone Necklace
    const neckGeo = getCachedGeo('neckGeo', function () {
      const neckPts = [
        new THREE.Vector2(0.052, 0.565),
        new THREE.Vector2(0.039, 0.64),
        new THREE.Vector2(0.041, 0.705),
      ];
      return new THREE.LatheGeometry(neckPts, 12);
    });
    bodyGroup.add(new THREE.Mesh(neckGeo, skinMat));

    if (role === 'royal' && acc.necklace && acc.necklace !== 'none') {
      const collar = new THREE.Mesh(
        getCachedGeo('necklaceCollar', function () { return new THREE.TorusGeometry(0.056, 0.009, 6, 16); }),
        goldMat
      );
      collar.rotation.x = Math.PI * 0.44;
      collar.position.set(0, 0.585, 0.012);
      bodyGroup.add(collar);
    }

    // 3. Continuous Seamless Arms + Hands (zero spherical joint seams!)
    const shoulderSpan = 0.144 * shoulderScale;
    const armR = 0.032 * armScale;
    const hasSleeves =
      role === 'guard' ||
      role === 'maid' ||
      role === 'butler' ||
      role === 'chef' ||
      role === 'chauffeur' ||
      role === 'doctor' ||
      role === 'er_doctor' ||
      role === 'surgeon' ||
      role === 'anesthesiologist' ||
      role === 'nurse' ||
      outfitPal.outfitId === 'riviera-sky-gown' ||
      outfitPal.outfitId === 'parisian-trench-chic' ||
      outfitPal.outfitId === 'equestrian-tailored';

    function makeArm(side) {
      const armPivot = new THREE.Group();
      armPivot.position.set(side * shoulderSpan, 0.525, 0.004);

      const armMat =
        role === 'guard' || hasSleeves
          ? fabricMat
          : acc.gloves === 'ivory-opera' || acc.gloves === 'noir-satin'
            ? gloveMat
            : skinMat;

      const armMesh = new THREE.Mesh(
        getCachedGeo('arm|' + side + '|' + armR.toFixed(3), function () { return buildContinuousArmGeometry(side, armR); }),
        armMat
      );
      armPivot.add(armMesh);

      if (role === 'butler' || role === 'chauffeur' || role === 'surgeon' || role === 'anesthesiologist') {
        const handGloveMat = role === 'butler'
          ? trimMat
          : role === 'chauffeur'
            ? ebonyMat
            : getCachedStdMat('surgGlove', { color: 0xccebf7, roughness: 0.34 });
        const gloveHand = new THREE.Mesh(
          getCachedGeo('gloveH|' + armR.toFixed(3), function () { return new THREE.SphereGeometry(armR * 0.72, 8, 6); }),
          handGloveMat
        );
        gloveHand.scale.set(0.85, 1.55, 0.65);
        gloveHand.position.set(side * 0.049, -0.545, 0.061);
        armPivot.add(gloveHand);
      } else if (role === 'maid') {
        const cuffLace = new THREE.Mesh(
          getCachedGeo('maidCuff|' + armR.toFixed(3), function () { return new THREE.TorusGeometry(armR * 0.92, 0.012, 6, 12); }),
          trimMat
        );
        cuffLace.rotation.x = Math.PI / 2;
        cuffLace.position.set(side * 0.014, -0.045, 0);
        armPivot.add(cuffLace);
      }

      if (role === 'royal' && outfitPal.outfitId === 'versailles-ivory-gown') {
        const cuff = new THREE.Mesh(
          getCachedGeo('royCuff|' + armR.toFixed(3), function () { return new THREE.TorusGeometry(armR * 1.15, 0.013, 6, 14); }),
          trimMat
        );
        cuff.rotation.x = Math.PI / 2;
        cuff.position.set(side * 0.015, -0.055, 0);
        armPivot.add(cuff);
      }

      if (role === 'guard' && side === 1) {
        const staff = new THREE.Mesh(getCachedGeo('guardStaff', function () { return new THREE.CylinderGeometry(0.015, 0.015, 1.85, 6); }), goldMat);
        staff.position.set(0.055, -0.1, 0.075);
        armPivot.add(staff);
        const spearHead = new THREE.Mesh(getCachedGeo('guardSpear', function () { return new THREE.ConeGeometry(0.048, 0.2, 6); }), goldMat);
        spearHead.position.set(0.055, 0.9, 0.075);
        armPivot.add(spearHead);
      }

      return armPivot;
    }

    const leftArm = makeArm(-1);
    const rightArm = makeArm(1);
    bodyGroup.add(leftArm);
    bodyGroup.add(rightArm);

    // 3B. Handheld Interactive 3D Props (toggled dynamically per pose in anim.js, all shared geo/mat/tex!)
    const heldProps = {};

    // Open Leather-Bound Gilded Royal Book (held between both hands during 'read' / 'sit_read')
    const bookGroup = new THREE.Group();
    bookGroup.name = 'held-book';
    bookGroup.visible = false;
    bookGroup.position.set(0, 0.25, 0.34);
    bookGroup.rotation.set(-0.68, 0, 0);

    const pageTex = _sharedTexCache['bookPage'] || (_sharedTexCache['bookPage'] = markShared((function () {
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = 128;
      pageCanvas.height = 128;
      const pCtx = pageCanvas.getContext('2d');
      pCtx.fillStyle = '#fbf3df';
      pCtx.fillRect(0, 0, 128, 128);
      pCtx.strokeStyle = '#c5993b';
      pCtx.lineWidth = 4;
      pCtx.strokeRect(8, 8, 112, 112);
      pCtx.fillStyle = '#9e2b3e';
      pCtx.fillRect(18, 18, 26, 26);
      pCtx.fillStyle = '#3c2e28';
      for (let ln = 0; ln < 9; ln++) {
        const yLn = 22 + ln * 10;
        const xStart = ln < 3 ? 50 : 18;
        pCtx.fillRect(xStart, yLn, 110 - xStart - ((ln % 3) * 8), 3);
      }
      const pt = new THREE.CanvasTexture(pageCanvas);
      pt.colorSpace = THREE.SRGBColorSpace;
      return pt;
    })()));

    const bookCoverMat = getCachedStdMat('bookCover', { color: 0x7b1f32, roughness: 0.45, metalness: 0.12 });
    const bookPageMat = getCachedStdMat('bookPageMat', { map: pageTex, roughness: 0.84 });
    const bookSpine = new THREE.Mesh(getCachedGeo('bookSpine', function () { return new THREE.BoxGeometry(0.032, 0.24, 0.025); }), goldMat);
    bookGroup.add(bookSpine);
    const bookCoverGeo = getCachedGeo('bookCoverG', function () { return new THREE.BoxGeometry(0.15, 0.245, 0.012); });
    const bookPageGeo = getCachedGeo('bookPageG', function () { return new THREE.BoxGeometry(0.138, 0.228, 0.016); });
    [-1, 1].forEach(function (side) {
      const leaf = new THREE.Group();
      leaf.position.set(side * 0.012, 0, 0);
      leaf.rotation.y = side * -0.34;
      const cover = new THREE.Mesh(bookCoverGeo, bookCoverMat);
      cover.position.set(side * 0.075, 0, -0.008);
      leaf.add(cover);
      const pageBlock = new THREE.Mesh(bookPageGeo, bookPageMat);
      pageBlock.position.set(side * 0.072, 0, 0.004);
      leaf.add(pageBlock);
      bookGroup.add(leaf);
    });
    const ribbon = new THREE.Mesh(getCachedGeo('bookRib', function () { return new THREE.BoxGeometry(0.012, 0.27, 0.005); }), goldMat);
    ribbon.position.set(0.01, -0.02, 0.012);
    ribbon.rotation.z = 0.08;
    bookGroup.add(ribbon);
    bodyGroup.add(bookGroup);
    heldProps.book = bookGroup;

    // Porcelain Teacup & Saucer (attached to right hand during 'eat' / tea poses)
    const teacupGroup = new THREE.Group();
    teacupGroup.name = 'held-teacup';
    teacupGroup.visible = false;
    teacupGroup.position.set(0.048, -0.535, 0.068);
    teacupGroup.rotation.x = Math.PI * 0.44;
    const chinaMat = getCachedStdMat('teaChina', { color: 0xfefaf5, roughness: 0.16, metalness: 0.05 });
    const saucer = new THREE.Mesh(getCachedGeo('teaSaucer', function () { return new THREE.CylinderGeometry(0.068, 0.035, 0.014, 12); }), chinaMat);
    teacupGroup.add(saucer);
    const cup = new THREE.Mesh(getCachedGeo('teaCup', function () { return new THREE.CylinderGeometry(0.036, 0.024, 0.048, 10); }), chinaMat);
    cup.position.y = 0.028;
    teacupGroup.add(cup);
    const cupRim = new THREE.Mesh(getCachedGeo('teaRim', function () { return new THREE.TorusGeometry(0.036, 0.003, 5, 12); }), goldMat);
    cupRim.rotation.x = Math.PI * 0.5;
    cupRim.position.y = 0.052;
    teacupGroup.add(cupRim);
    const teaFill = new THREE.Mesh(
      getCachedGeo('teaFill', function () { return new THREE.CircleGeometry(0.032, 10); }),
      getCachedStdMat('teaFillMat', { color: 0x9b4d2b, roughness: 0.2 })
    );
    teaFill.rotation.x = -Math.PI * 0.5;
    teaFill.position.y = 0.046;
    teacupGroup.add(teaFill);
    rightArm.add(teacupGroup);
    heldProps.teacup = teacupGroup;

    // Artist Paintbrush (right hand) & Palette (left hand) for 'paint'
    const brushGroup = new THREE.Group();
    brushGroup.visible = false;
    brushGroup.position.set(0.048, -0.545, 0.072);
    brushGroup.rotation.x = Math.PI * 0.45;
    const brushHandle = new THREE.Mesh(
      getCachedGeo('brushH', function () { return new THREE.CylinderGeometry(0.005, 0.008, 0.26, 6); }),
      getCachedStdMat('brushHMat', { color: 0x5c2f1c, roughness: 0.5 })
    );
    brushHandle.position.y = 0.06;
    brushGroup.add(brushHandle);
    const brushTip = new THREE.Mesh(
      getCachedGeo('brushT', function () { return new THREE.ConeGeometry(0.009, 0.034, 6); }),
      getCachedStdMat('brushTMat', { color: 0xc84b6b, roughness: 0.6 })
    );
    brushTip.position.y = 0.205;
    brushGroup.add(brushTip);
    rightArm.add(brushGroup);
    heldProps.brush = brushGroup;

    const paletteGroup = new THREE.Group();
    paletteGroup.visible = false;
    paletteGroup.position.set(-0.048, -0.53, 0.075);
    paletteGroup.rotation.set(Math.PI * 0.46, 0, -0.15);
    const board = new THREE.Mesh(
      getCachedGeo('palBoard', function () { return new THREE.CylinderGeometry(0.11, 0.11, 0.012, 12); }),
      getCachedStdMat('palBoardMat', { color: 0xa47449, roughness: 0.65 })
    );
    board.scale.set(1.18, 1, 0.88);
    paletteGroup.add(board);
    const dabGeo = getCachedGeo('palDab', function () { return new THREE.SphereGeometry(0.016, 6, 5); });
    [0xc93b52, 0xe8b948, 0x3f6ba8, 0x4b8f5c].forEach(function (hex, pi) {
      const dab = new THREE.Mesh(dabGeo, getCachedStdMat('palDabMat|' + hex, { color: hex, roughness: 0.35 }));
      const a = -0.9 + pi * 0.58;
      dab.scale.set(1, 0.45, 1);
      dab.position.set(Math.cos(a) * 0.068, 0.008, Math.sin(a) * 0.052);
      paletteGroup.add(dab);
    });
    leftArm.add(paletteGroup);
    heldProps.palette = paletteGroup;

    // Brass & Oak Kitchen Stirring Spoon ('cook')
    const ladleGroup = new THREE.Group();
    ladleGroup.visible = false;
    ladleGroup.position.set(0.048, -0.545, 0.07);
    ladleGroup.rotation.x = Math.PI * 0.48;
    const ladleShaft = new THREE.Mesh(
      getCachedGeo('ladleS', function () { return new THREE.CylinderGeometry(0.007, 0.008, 0.34, 6); }),
      getCachedStdMat('ladleSMat', { color: 0x7c4e2d, roughness: 0.6 })
    );
    ladleShaft.position.y = 0.1;
    ladleGroup.add(ladleShaft);
    const ladleBowl = new THREE.Mesh(getCachedGeo('ladleB', function () { return new THREE.SphereGeometry(0.032, 8, 6); }), goldMat);
    ladleBowl.scale.set(1, 0.55, 1.15);
    ladleBowl.position.y = 0.27;
    ladleGroup.add(ladleBowl);
    rightArm.add(ladleGroup);
    heldProps.ladle = ladleGroup;

    // Royal Silver Breakfast-in-Bed & Meal Serving Platter ('serve')
    const platterGroup = new THREE.Group();
    platterGroup.name = 'held-platter';
    platterGroup.visible = false;
    platterGroup.position.set(0.06, -0.52, 0.20);
    platterGroup.rotation.x = Math.PI * 0.46;
    const silverTrayMat = getCachedStdMat('silverTrayMat', { color: 0xeaf0f5, roughness: 0.16, metalness: 0.85 });
    const trayDisc = new THREE.Mesh(
      getCachedGeo('trayDisc', function () { return new THREE.CylinderGeometry(0.24, 0.21, 0.02, 16); }),
      silverTrayMat
    );
    trayDisc.scale.set(1.22, 1, 0.92);
    platterGroup.add(trayDisc);
    const clocheDome = new THREE.Mesh(
      getCachedGeo('trayCloche', function () { return new THREE.SphereGeometry(0.115, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5); }),
      silverTrayMat
    );
    clocheDome.position.set(-0.06, 0.012, 0);
    platterGroup.add(clocheDome);
    const clocheKnob = new THREE.Mesh(getCachedGeo('trayKnob', function () { return new THREE.SphereGeometry(0.018, 6, 5); }), goldMat);
    clocheKnob.position.set(-0.06, 0.132, 0);
    platterGroup.add(clocheKnob);
    const potBody = new THREE.Mesh(getCachedGeo('trayPot', function () { return new THREE.CylinderGeometry(0.042, 0.048, 0.095, 10); }), chinaMat);
    potBody.position.set(0.12, 0.058, -0.04);
    platterGroup.add(potBody);
    const cupMini = new THREE.Mesh(getCachedGeo('trayCup', function () { return new THREE.CylinderGeometry(0.028, 0.02, 0.042, 8); }), chinaMat);
    cupMini.position.set(0.11, 0.032, 0.07);
    platterGroup.add(cupMini);
    const pastryBerry = new THREE.Mesh(
      getCachedGeo('trayBerry', function () { return new THREE.SphereGeometry(0.024, 6, 5); }),
      getCachedStdMat('trayBerryMat', { color: 0xc82644, roughness: 0.35 })
    );
    pastryBerry.position.set(0.02, 0.03, 0.10);
    platterGroup.add(pastryBerry);
    rightArm.add(platterGroup);
    heldProps.platter = platterGroup;

    // Medical Clipboard Chart ('work_examine', 'work_station') held on left forearm
    const chartGroup = new THREE.Group();
    chartGroup.name = 'held-chart';
    chartGroup.visible = false;
    chartGroup.position.set(-0.04, -0.50, 0.14);
    chartGroup.rotation.set(Math.PI * 0.42, 0.12, 0);
    const chartBoard = new THREE.Mesh(
      getCachedGeo('medChartBoard', function () { return new THREE.BoxGeometry(0.18, 0.24, 0.016); }),
      getCachedStdMat('medChartMat', { color: 0x3f593b, roughness: 0.5 })
    );
    const chartPaper = new THREE.Mesh(
      getCachedGeo('medChartPaper', function () { return new THREE.BoxGeometry(0.15, 0.20, 0.018); }),
      chinaMat
    );
    chartPaper.position.y = -0.01;
    const chartClip = new THREE.Mesh(
      getCachedGeo('medChartClip', function () { return new THREE.BoxGeometry(0.06, 0.025, 0.024); }),
      silverTrayMat
    );
    chartClip.position.y = 0.105;
    chartGroup.add(chartBoard, chartPaper, chartClip);
    leftArm.add(chartGroup);
    heldProps.chart = chartGroup;

    // Medical Instrument / Surgical Probe ('work_operate', 'work_examine') held in right hand
    const instGroup = new THREE.Group();
    instGroup.name = 'held-instrument';
    instGroup.visible = false;
    instGroup.position.set(0.02, -0.53, 0.08);
    instGroup.rotation.x = Math.PI * 0.48;
    const instStem = new THREE.Mesh(
      getCachedGeo('medInstStem', function () { return new THREE.CylinderGeometry(0.008, 0.008, 0.22, 6); }),
      silverTrayMat
    );
    instStem.position.y = 0.10;
    const instTip = new THREE.Mesh(
      getCachedGeo('medInstTip', function () { return new THREE.SphereGeometry(0.018, 6, 5); }),
      getCachedStdMat('medInstTipMat', { color: 0x3b8ea5, roughness: 0.25, metalness: 0.45 })
    );
    instTip.position.y = 0.21;
    instGroup.add(instStem, instTip);
    rightArm.add(instGroup);
    heldProps.instrument = instGroup;

    // 4. Sculpted Planar-UV Royal Head + Feathered Layered Hair Cards
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.775, 0.008);
    bodyGroup.add(headGroup);

    const headMesh = new THREE.Mesh(
      getCachedGeo('sculptedHead', function () { return buildSculptedHeadGeometry(); }),
      headFaceMat
    );
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Delicate Sculpted Ears
    const earGeo = getCachedGeo('earGeo', function () { return new THREE.SphereGeometry(0.018, 6, 5); });
    [-1, 1].forEach(function (side) {
      const ear = new THREE.Mesh(earGeo, skinMat);
      ear.scale.set(0.42, 1.28, 0.72);
      ear.position.set(side * 0.088, -0.004, -0.004);
      headGroup.add(ear);
    });

    // Natural 3D Blinking Eyelid Caps (sits smoothly over eye sockets during blink cycles)
    const lidGeo = getCachedGeo('eyelidGeo', function () { return new THREE.SphereGeometry(0.019, 8, 5); });
    const leftLid = new THREE.Mesh(lidGeo, skinMat);
    leftLid.position.set(-0.032, 0.016, 0.092);
    leftLid.scale.set(1.15, 0.12, 0.42);
    leftLid.visible = false;
    headGroup.add(leftLid);
    const rightLid = new THREE.Mesh(lidGeo, skinMat);
    rightLid.position.set(0.032, 0.016, 0.092);
    rightLid.scale.set(1.15, 0.12, 0.42);
    rightLid.visible = false;
    headGroup.add(rightLid);

    if (role === 'royal' && acc.eyewear && acc.eyewear !== 'none') {
      const lensMat = _sharedMatCache['eyewearLens'] || (_sharedMatCache['eyewearLens'] = markShared(
        new THREE.MeshPhysicalMaterial({ color: 0x1e1928, transparent: true, opacity: 0.68, clearcoat: 1 })
      ));
      const rimGeo = getCachedGeo('eyeRim', function () { return new THREE.TorusGeometry(0.021, 0.0028, 5, 14); });
      const lensGeo = getCachedGeo('eyeLens', function () { return new THREE.CircleGeometry(0.02, 12); });
      [-1, 1].forEach(function (side) {
        const rim = new THREE.Mesh(rimGeo, goldMat);
        rim.position.set(side * 0.032, 0.01, 0.098);
        headGroup.add(rim);
        const lens = new THREE.Mesh(lensGeo, lensMat);
        lens.position.set(side * 0.032, 0.01, 0.098);
        headGroup.add(lens);
      });
    }

    // Hair Crown Skull Cap + Sweeping Parted Bangs + Feathered Hair-Card Tresses (Zero Play-Doh Tubes!)
    const hairCap = new THREE.Mesh(
      getCachedGeo('hairCap', function () { return new THREE.SphereGeometry(0.108, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.58); }),
      hairSolidMat
    );
    hairCap.scale.set(0.95, 1.06, 1.04);
    hairCap.position.set(0, 0.018, -0.008);
    headGroup.add(hairCap);

    // Soft feathered front-temple curtain bangs hugging face sides cleanly
    [-1, 1].forEach(function (side) {
      const a0 = side < 0 ? -Math.PI * 0.22 : Math.PI * 0.22;
      const a1 = side < 0 ? -Math.PI * 0.65 : Math.PI * 0.65;
      const bangGeo = getCachedGeo('bang|' + side, function () {
        return buildHairRibbonShell({
          rows: 6,
          cols: 6,
          startAngle: Math.min(a0, a1),
          endAngle: Math.max(a0, a1),
          topY: 0.11,
          botY: -0.14,
          topR: 0.104,
          botR: 0.112,
          zShiftBot: -0.012,
          waveAmp: 0.008,
        });
      });
      const bang = new THREE.Mesh(bangGeo, hairCardMat);
      headGroup.add(bang);
    });

    const isUpdo =
      role === 'maid' ||
      lookInfo.hairStyle === 'marie-updo' ||
      lookInfo.hairStyle === 'braided-crown' ||
      lookInfo.hairStyle === 'sleek-ponytail' ||
      lookInfo.hairStyle === 'romantic-bun' ||
      lookInfo.hairStyle === 'milkmaid-braids';
    const isShort =
      role === 'guard' ||
      lookInfo.hairStyle === 'riviera-bob' ||
      lookInfo.hairStyle === 'couture-lob' ||
      lookInfo.hairStyle === 'wavy-curtain-shag' ||
      lookInfo.hairStyle === 'pixie-coiffure' ||
      lookInfo.hairStyle === 'slick-gala';

    if (isUpdo) {
      const chignon = new THREE.Mesh(getCachedGeo('chignon', function () { return new THREE.SphereGeometry(0.072, 12, 9); }), hairSolidMat);
      chignon.scale.set(1.05, 0.9, 0.85);
      chignon.position.set(0, 0.068, -0.102);
      headGroup.add(chignon);

      const napeWisps = new THREE.Mesh(
        getCachedGeo('napeWisps', function () {
          return buildHairRibbonShell({
            rows: 5,
            cols: 10,
            startAngle: Math.PI * 0.55,
            endAngle: Math.PI * 1.45,
            topY: 0.06,
            botY: -0.12,
            topR: 0.106,
            botR: 0.095,
            zShiftBot: -0.01,
            waveAmp: 0.005,
          });
        }),
        hairCardMat
      );
      headGroup.add(napeWisps);
    } else if (isShort) {
      const bobShell = new THREE.Mesh(
        getCachedGeo('bobShell', function () {
          return buildHairRibbonShell({
            rows: 6,
            cols: 12,
            startAngle: Math.PI * 0.42,
            endAngle: Math.PI * 1.58,
            topY: 0.09,
            botY: -0.15,
            topR: 0.106,
            botR: 0.126,
            zShiftBot: -0.015,
            waveAmp: 0.01,
          });
        }),
        hairCardMat
      );
      headGroup.add(bobShell);
    } else {
      // Multi-layered flowing feathered silk hair-card cape draping down upper back
      const innerLayer = new THREE.Mesh(
        getCachedGeo('hairInner', function () {
          return buildHairRibbonShell({
            rows: 8,
            cols: 12,
            startAngle: Math.PI * 0.46,
            endAngle: Math.PI * 1.54,
            topY: 0.095,
            botY: -0.34,
            topR: 0.105,
            botR: 0.145,
            zShiftBot: -0.04,
            waveAmp: 0.016,
          });
        }),
        hairCardMat
      );
      headGroup.add(innerLayer);

      const outerLayer = new THREE.Mesh(
        getCachedGeo('hairOuter', function () {
          return buildHairRibbonShell({
            rows: 8,
            cols: 10,
            startAngle: Math.PI * 0.58,
            endAngle: Math.PI * 1.42,
            topY: 0.09,
            botY: -0.39,
            topR: 0.114,
            botR: 0.16,
            zShiftBot: -0.055,
            waveAmp: 0.022,
          });
        }),
        hairCardMat
      );
      headGroup.add(outerLayer);
    }

    // Headgear: Guards (Shako), Maids (Lace Cap), Chefs (Toque), Chauffeurs (Visor Cap), Nurses (Cross Cap), Royals (Tiara ONLY!)
    if (role === 'guard') {
      const shako = new THREE.Mesh(
        getCachedGeo('guardShako', function () { return new THREE.CylinderGeometry(0.1, 0.11, 0.21, 12); }),
        getCachedStdMat('shakoMat', { color: 0x1b1921, roughness: 0.75 })
      );
      shako.position.set(0, 0.17, 0);
      headGroup.add(shako);
      const plume = new THREE.Mesh(getCachedGeo('guardPlume', function () { return new THREE.ConeGeometry(0.03, 0.12, 6); }), goldMat);
      plume.position.set(0, 0.31, 0.025);
      headGroup.add(plume);
    } else if (role === 'maid') {
      const cap = new THREE.Mesh(getCachedGeo('maidCap', function () { return new THREE.SphereGeometry(0.104, 12, 8); }), trimMat);
      cap.scale.set(1.04, 0.44, 0.92);
      cap.position.set(0, 0.118, -0.01);
      headGroup.add(cap);
      const frill = new THREE.Mesh(getCachedGeo('maidFrill', function () { return new THREE.TorusGeometry(0.088, 0.011, 5, 14); }), trimMat);
      frill.rotation.x = Math.PI * 0.48;
      frill.position.set(0, 0.118, -0.006);
      headGroup.add(frill);
    } else if (role === 'chef') {
      const band = new THREE.Mesh(getCachedGeo('chefBand', function () { return new THREE.CylinderGeometry(0.095, 0.092, 0.085, 12); }), trimMat);
      band.position.set(0, 0.135, -0.005);
      headGroup.add(band);
      const puff = new THREE.Mesh(getCachedGeo('chefPuff', function () { return new THREE.SphereGeometry(0.115, 12, 8); }), trimMat);
      puff.scale.set(1.06, 0.78, 1.06);
      puff.position.set(0, 0.215, -0.008);
      headGroup.add(puff);
    } else if (role === 'chauffeur') {
      const navyCapMat = getCachedStdMat('chaufCap', { color: 0x1a2233, roughness: 0.45 });
      const capCrown = new THREE.Mesh(getCachedGeo('chCrown', function () { return new THREE.CylinderGeometry(0.106, 0.096, 0.075, 12); }), navyCapMat);
      capCrown.position.set(0, 0.128, -0.006);
      headGroup.add(capCrown);
      const capBand = new THREE.Mesh(getCachedGeo('chBand', function () { return new THREE.CylinderGeometry(0.098, 0.098, 0.018, 12); }), goldMat);
      capBand.position.set(0, 0.1, -0.006);
      headGroup.add(capBand);
      const visor = new THREE.Mesh(
        getCachedGeo('chVisor', function () { return new THREE.CylinderGeometry(0.095, 0.1, 0.014, 10, 1, false, -0.95, 1.9); }),
        getCachedStdMat('chVisorMat', { color: 0x101218, roughness: 0.2 })
      );
      visor.rotation.x = 0.28;
      visor.position.set(0, 0.088, 0.056);
      headGroup.add(visor);
    } else if (role === 'surgeon' || role === 'anesthesiologist') {
      const capHex = role === 'surgeon' ? 0x2682a4 : 0x2c6e82;
      const capMat = getCachedStdMat('scrubCap|' + capHex, { color: capHex, roughness: 0.62 });
      const scrubCap = new THREE.Mesh(getCachedGeo('scrubCapG', function () { return new THREE.SphereGeometry(0.108, 12, 8); }), capMat);
      scrubCap.scale.set(1.06, 0.62, 1.08);
      scrubCap.position.set(0, 0.088, -0.005);
      headGroup.add(scrubCap);
      const maskMat = getCachedStdMat('medMaskMat', { color: 0xbde6f5, roughness: 0.72 });
      const mask = new THREE.Mesh(getCachedGeo('medMaskG', function () { return new THREE.BoxGeometry(0.112, 0.058, 0.036); }), maskMat);
      mask.position.set(0, -0.048, 0.095);
      headGroup.add(mask);
    } else if (role === 'nurse') {
      const nurseCap = new THREE.Mesh(getCachedGeo('nurseCapG', function () { return new THREE.BoxGeometry(0.16, 0.072, 0.085); }), trimMat);
      nurseCap.position.set(0, 0.132, -0.01);
      headGroup.add(nurseCap);
      const cV = new THREE.Mesh(getCachedGeo('nurseCV', function () { return new THREE.BoxGeometry(0.012, 0.036, 0.014); }), medicalRedMat);
      cV.position.set(0, 0.132, 0.034);
      headGroup.add(cV);
      const cH = new THREE.Mesh(getCachedGeo('nurseCH', function () { return new THREE.BoxGeometry(0.036, 0.012, 0.014); }), medicalRedMat);
      cH.position.set(0, 0.132, 0.034);
      headGroup.add(cH);
    } else if (role === 'royal' && (!acc.crown || acc.crown !== 'none')) {
      const tiaraGroup = new THREE.Group();
      tiaraGroup.position.set(0, 0.116, 0.012);
      const band = new THREE.Mesh(getCachedGeo('tiaraBand', function () { return new THREE.TorusGeometry(0.078, 0.008, 6, 16); }), goldMat);
      band.rotation.x = Math.PI * 0.48;
      tiaraGroup.add(band);
      for (let i = -2; i <= 2; i++) {
        const ang = i * 0.32;
        const hPeak = i === 0 ? 0.058 : Math.abs(i) === 1 ? 0.038 : 0.024;
        const spire = new THREE.Mesh(getCachedGeo('tiaraSpire|' + hPeak, function () { return new THREE.ConeGeometry(0.009, hPeak, 5); }), goldMat);
        spire.position.set(Math.sin(ang) * 0.074, hPeak * 0.5, Math.cos(ang) * 0.074);
        tiaraGroup.add(spire);
      }
      const gemMat = getCachedStdMat('tiaraGem|' + dressHex, { color: dressPrimary, roughness: 0.12, metalness: 0.25 });
      const gem = new THREE.Mesh(
        getCachedGeo('tiaraGemG', function () { return new THREE.OctahedronGeometry(0.014, 0); }),
        gemMat
      );
      gem.position.set(0, 0.034, 0.078);
      tiaraGroup.add(gem);
      headGroup.add(tiaraGroup);
    }

    // Active Player Plumbob
    let plumbob = null;
    if (opts.showPlumbob) {
      const pbMat = new THREE.MeshPhysicalMaterial({
        color: 0x3ad17a,
        emissive: 0x1e8f4e,
        emissiveIntensity: 0.42,
        roughness: 0.12,
        metalness: 0.22,
        clearcoat: 1.0,
      });
      const pbGeo = new THREE.OctahedronGeometry(0.095, 0);
      pbGeo.scale(0.75, 1.55, 0.75);
      plumbob = new THREE.Mesh(pbGeo, pbMat);
      plumbob.position.set(0, pelvisY + 1.24, 0);
      rig.add(plumbob);
    }

    // Pool Swimming Water Ripple Ring
    const swimRipple = new THREE.Mesh(
      getCachedGeo('swimRipple', function () { return new THREE.RingGeometry(0.28, 0.48, 16); }),
      _sharedMatCache['swimRippleMat'] || (_sharedMatCache['swimRippleMat'] = markShared(
        new THREE.MeshBasicMaterial({ color: 0xe6fbff, transparent: true, opacity: 0.72, side: THREE.DoubleSide, depthWrite: false })
      ))
    );
    swimRipple.rotation.x = -Math.PI / 2;
    swimRipple.position.y = 0.22;
    swimRipple.visible = false;
    root.add(swimRipple);

    return {
      root: root,
      rig: rig,
      leftLeg: leftLeg,
      rightLeg: rightLeg,
      leftKnee: leftKnee,
      rightKnee: rightKnee,
      leftArm: leftArm,
      rightArm: rightArm,
      bodyGroup: bodyGroup,
      headGroup: headGroup,
      leftLid: leftLid,
      rightLid: rightLid,
      swimRipple: swimRipple,
      skirtMesh: skirtMesh,
      heldProps: heldProps,
      contactShadow: contactShadow,
      plumbob: plumbob,
      baseLeg: pelvisY,
      dispose: function () {
        textures.forEach(function (t) {
          if (t && (!t.userData || !t.userData._sharedCache)) t.dispose();
        });
        root.traverse(function (obj) {
          if (obj.geometry && (!obj.geometry.userData || !obj.geometry.userData._sharedCache)) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(function (m) {
                if (m && (!m.userData || !m.userData._sharedCache)) m.dispose();
              });
            } else if (!obj.material.userData || !obj.material.userData._sharedCache) {
              obj.material.dispose();
            }
          }
        });
      },
    };
  }

  function buildRoyalHorseMesh(options) {
    const THREE = window.THREE;
    if (!THREE) return null;
    const opts = options || {};
    const coatHex = opts.coatHex || '#f5f1ea';
    const maneHex = opts.maneHex || '#d8d2c6';
    const blanketHex = opts.blanketHex || '#911d2c';

    const root = new THREE.Group();
    const coatMat = new THREE.MeshStandardMaterial({ color: coatHex, roughness: 0.52, metalness: 0.05 });
    const maneMat = new THREE.MeshStandardMaterial({ color: maneHex, roughness: 0.65 });
    const hoofMat = new THREE.MeshStandardMaterial({ color: 0x1c181a, roughness: 0.4 });
    const saddleMat = new THREE.MeshStandardMaterial({ color: 0x4b2a19, roughness: 0.45 });
    const blanketMat = new THREE.MeshStandardMaterial({ color: blanketHex, roughness: 0.55 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9b04e, roughness: 0.22, metalness: 0.85 });

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.95, 16),
      new THREE.MeshBasicMaterial({ color: 0x1e1318, transparent: true, opacity: 0.28, depthWrite: false })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.03;
    root.add(shadow);

    const barrelPts = [
      new THREE.Vector2(0.01, -0.82),
      new THREE.Vector2(0.36, -0.58),
      new THREE.Vector2(0.34, 0),
      new THREE.Vector2(0.38, 0.55),
      new THREE.Vector2(0.01, 0.82),
    ];
    const barrel = new THREE.Mesh(new THREE.LatheGeometry(barrelPts, 16), coatMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.scale.set(0.84, 1, 1.05);
    barrel.position.set(0, 1.15, 0);
    barrel.castShadow = true;
    root.add(barrel);

    const blanket = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.65, 16, 1, false, -1.2, 2.4), blanketMat);
    blanket.rotation.z = Math.PI / 2;
    blanket.rotation.y = Math.PI / 2;
    blanket.position.set(0, 1.18, -0.02);
    root.add(blanket);

    const saddle = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), saddleMat);
    saddle.scale.set(1.05, 0.45, 1.3);
    saddle.position.set(0, 1.48, -0.02);
    root.add(saddle);

    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.28, 0.68);
    root.add(headGroup);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.24, 0.78, 12), coatMat);
    neck.position.set(0, 0.34, 0.18);
    neck.rotation.x = 0.52;
    neck.castShadow = true;
    headGroup.add(neck);

    const maneCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.08, -0.04),
      new THREE.Vector3(0, 0.42, 0.14),
      new THREE.Vector3(0, 0.72, 0.32),
    ]);
    const mane = new THREE.Mesh(new THREE.TubeGeometry(maneCurve, 10, 0.065, 8, false), maneMat);
    headGroup.add(mane);

    const headPts = [
      new THREE.Vector2(0.06, -0.26),
      new THREE.Vector2(0.11, 0.0),
      new THREE.Vector2(0.13, 0.24),
    ];
    const head = new THREE.Mesh(new THREE.LatheGeometry(headPts, 12), coatMat);
    head.position.set(0, 0.64, 0.44);
    head.rotation.x = -Math.PI * 0.35;
    head.castShadow = true;
    headGroup.add(head);

    [-1, 1].forEach(function (side) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.14, 6), coatMat);
      ear.position.set(side * 0.075, 0.82, 0.32);
      headGroup.add(ear);
    });

    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.25, -0.82),
      new THREE.Vector3(0, 0.95, -1.04),
      new THREE.Vector3(0, 0.52, -1.1),
    ]);
    const tail = new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 10, 0.075, 8, false), maneMat);
    root.add(tail);

    const legs = [];
    [
      [-0.19, 0.56],
      [0.19, 0.56],
      [-0.19, -0.56],
      [0.19, -0.56],
    ].forEach(function (pt) {
      const legPivot = new THREE.Group();
      legPivot.position.set(pt[0], 0.98, pt[1]);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.048, 0.92, 10), coatMat);
      leg.position.y = -0.46;
      leg.castShadow = true;
      legPivot.add(leg);
      const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.064, 0.08, 10), hoofMat);
      hoof.position.y = -0.94;
      legPivot.add(hoof);
      root.add(legPivot);
      legs.push(legPivot);
    });

    return {
      root: root,
      legs: legs,
      headGroup: headGroup,
      tail: tail,
      goldMat: goldMat,
      dispose: function () {
        root.traverse(function (obj) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        });
      },
    };
  }

  function createPlayerController(scene, worldApi, character, initialWorldState) {
    const THREE = window.THREE;
    if (!THREE) return null;

    const actor = buildRoyalCharacterMesh(character, {
      name: 'player-princess',
      showPlumbob: true,
    });

    const startPos = (initialWorldState && initialWorldState.playerPos) || { x: 2.8, y: 0, z: 18 };
    const sx = typeof startPos.x === 'number' ? startPos.x : 2.8;
    const sz = typeof startPos.z === 'number' ? startPos.z : 18;
    const sy = worldApi.groundHeightAt(sx, sz, typeof startPos.y === 'number' ? startPos.y : 0);
    actor.root.position.set(sx, sy, sz);
    actor.root.rotation.y =
      typeof (initialWorldState && initialWorldState.playerYaw) === 'number'
        ? initialWorldState.playerYaw
        : Math.PI;
    scene.add(actor.root);

    const keys = {};
    const joyVec = { x: 0, y: 0, active: false };
    let walkPhase = 0;
    let speedMag = 0;

    function onKeyDown(ev) {
      keys[ev.code] = true;
    }
    function onKeyUp(ev) {
      keys[ev.code] = false;
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    function setJoystick(nx, ny, isActive) {
      joyVec.x = THREE.MathUtils.clamp(nx || 0, -1, 1);
      joyVec.y = THREE.MathUtils.clamp(ny || 0, -1, 1);
      joyVec.active = Boolean(isActive);
    }

    const _moveDir = new THREE.Vector3();
    const _seatOff = new THREE.Vector3();
    let currentActivity = null; // { pose, x, y, z, yaw, floorY, rigOffsetY, onCancel }
    let transport = null; // { kind: 'car'|'horse', entity, speed, steer, wheelAngle, gallopPhase, boost }
    let inWater = false;
    let swimPhase = 0;
    let transportListener = null;
    let movementLocked = false;

    function setMovementLocked(locked) {
      movementLocked = Boolean(locked);
      if (movementLocked) speedMag = 0;
    }

    function notifyTransport() {
      if (typeof transportListener === 'function') {
        transportListener(transport);
      }
    }

    function setTransportListener(fn) {
      transportListener = fn;
    }

    function updateLivingSkin(act, elapsedSec, needsObj, isSwim, spd, isSleep) {
      const t = elapsedSec || 0;
      if (act.leftLid && act.rightLid) {
        if (isSleep) {
          act.leftLid.visible = true;
          act.rightLid.visible = true;
          act.leftLid.scale.set(1.18, 0.96, 0.52);
          act.rightLid.scale.set(1.18, 0.96, 0.52);
        } else {
          const cycle = (t * 0.28 + (act.root.id || 0) * 0.37) % 1;
          const blink = cycle > 0.945 ? Math.sin(((cycle - 0.945) / 0.055) * Math.PI) : 0;
          const openBlink = blink > 0.06;
          act.leftLid.visible = openBlink;
          act.rightLid.visible = openBlink;
          if (openBlink) {
            const sy = 0.14 + blink * 0.72;
            act.leftLid.scale.set(1.15, sy, 0.45);
            act.rightLid.scale.set(1.15, sy, 0.45);
          }
        }
      }
      if (act.swimRipple) {
        act.swimRipple.visible = Boolean(isSwim);
        if (isSwim) {
          const pulse = 0.85 + Math.sin(t * 4.5) * 0.18 + Math.min(0.35, (spd || 0) * 0.08);
          act.swimRipple.scale.set(pulse, pulse, 1);
          act.swimRipple.material.opacity = 0.55 + Math.sin(t * 4.5) * 0.2;
        }
      }
      if (act.plumbob && act.plumbob.material && needsObj) {
        const minNeed = Math.min(
          needsObj.energy ?? 100,
          needsObj.hunger ?? 100,
          needsObj.hygiene ?? 100,
          needsObj.fun ?? 100,
          needsObj.composure ?? 100
        );
        if (minNeed < 25) {
          act.plumbob.material.color.setHex(0xeb5a5a);
          act.plumbob.material.emissive.setHex(0x8c2222);
        } else if (minNeed < 50) {
          act.plumbob.material.color.setHex(0xe8bf48);
          act.plumbob.material.emissive.setHex(0x8e6a15);
        } else {
          act.plumbob.material.color.setHex(0x3ad17a);
          act.plumbob.material.emissive.setHex(0x1e8f4e);
        }
      }
    }

    function setActivityPose(spec) {
      if (transport) exitTransport();
      if (!spec) {
        clearActivityPose();
        return;
      }
      currentActivity = Object.assign({}, spec);
      speedMag = 0;
      if (typeof spec.x === 'number' && typeof spec.z === 'number') {
        const yPos = typeof spec.y === 'number' ? spec.y : worldApi.groundHeightAt(spec.x, spec.z, actor.root.position.y);
        actor.root.position.set(spec.x, yPos, spec.z);
      }
      if (typeof spec.yaw === 'number') {
        actor.root.rotation.y = spec.yaw;
      }
    }

    function clearActivityPose(restoreStandPos) {
      if (!currentActivity) return;
      const prev = currentActivity;
      currentActivity = null;
      if (restoreStandPos !== false) {
        const floorRef = typeof prev.floorY === 'number' ? prev.floorY : actor.root.position.y;
        const rawX = typeof prev.exitX === 'number' ? prev.exitX : actor.root.position.x;
        const rawZ = typeof prev.exitZ === 'number' ? prev.exitZ : actor.root.position.z;
        const safe = worldApi.resolveCollision ? worldApi.resolveCollision(rawX, rawZ, 0.48, floorRef) : { x: rawX, z: rawZ };
        const sy = worldApi.groundHeightAt(safe.x, safe.z, floorRef);
        actor.root.position.set(safe.x, sy, safe.z);
        if (typeof prev.exitYaw === 'number') {
          actor.root.rotation.y = prev.exitYaw;
        }
      }
      if (actor.contactShadow) {
        actor.contactShadow.visible = true;
      }
    }

    function getActivity() {
      return currentActivity;
    }

    function enterCar(carDef) {
      if (!carDef || !carDef.group) return;
      if (currentActivity) clearActivityPose(false);
      if (transport) exitTransport();
      const cd = carDef.group.userData && carDef.group.userData.carDoors;
      if (cd) {
        cd.doorBurstTimer = 1.25;
        cd.manualOpen = false;
      }
      transport = {
        kind: 'car',
        entity: carDef,
        speed: 0,
        steer: 0,
        wheelAngle: 0,
      };
      inWater = false;
      speedMag = 0;
      notifyTransport();
    }

    function toggleCarDoors(carDef) {
      const target = carDef || (transport && transport.kind === 'car' ? transport.entity : null);
      if (!target || !target.group || !target.group.userData || !target.group.userData.carDoors) return false;
      const cd = target.group.userData.carDoors;
      cd.manualOpen = !cd.manualOpen;
      cd.doorBurstTimer = cd.manualOpen ? 0 : 0;
      return cd.manualOpen;
    }

    function mountHorse(horseDef) {
      if (!horseDef || !horseDef.group) return;
      if (currentActivity) clearActivityPose(false);
      if (transport) exitTransport();
      transport = {
        kind: 'horse',
        entity: horseDef,
        speed: 0,
        steer: 0,
        gallopPhase: 0,
        boost: false,
      };
      inWater = false;
      speedMag = 0;
      notifyTransport();
    }

    function exitTransport() {
      if (!transport) return;
      const ent = transport.entity;
      const wasKind = transport.kind;
      transport = null;
      speedMag = 0;
      if (wasKind === 'car' && ent && ent.group && ent.group.userData && ent.group.userData.carDoors) {
        ent.group.userData.carDoors.manualOpen = false;
        ent.group.userData.carDoors.doorBurstTimer = 1.45;
      }
      const sideOff = wasKind === 'car' ? -1.65 : -1.25;
      const grpPos = ent && ent.group ? ent.group.position : actor.root.position;
      const yaw = ent && ent.group ? ent.group.rotation.y : actor.root.rotation.y;
      const rawX = grpPos.x + Math.cos(yaw) * sideOff;
      const rawZ = grpPos.z - Math.sin(yaw) * sideOff;
      const safe = worldApi.resolveCollision ? worldApi.resolveCollision(rawX, rawZ, 0.52, 0) : { x: rawX, z: rawZ };
      const sy = worldApi.groundHeightAt(safe.x, safe.z, 0);
      actor.root.position.set(safe.x, sy, safe.z);
      actor.root.rotation.y = yaw;
      if (ent && ent.group && ent.group.userData && ent.group.userData.rig && wasKind === 'horse') {
        const legs = ent.group.userData.rig.legs || [];
        for (let i = 0; i < legs.length; i++) legs[i].rotation.x = 0;
        ent.group.position.y = ent.baseY || 0.03;
      }
      if (actor.contactShadow) actor.contactShadow.visible = true;
      notifyTransport();
    }

    function setCanterBoost(val) {
      if (transport && transport.kind === 'horse') {
        transport.boost = Boolean(val);
      }
    }

    function exitPool() {
      if (currentActivity && currentActivity.pose === 'swim') {
        clearActivityPose(true);
        return true;
      }
      if (!inWater) return false;
      inWater = false;
      const px = actor.root.position.x;
      const pz = actor.root.position.z;
      const py = actor.root.position.y;
      let ex = px;
      let ez = pz + 4.6;
      if (Math.abs(px - 82) < 12 && pz < 26) {
        ex = 82;
        ez = 19.2;
      } else if (py > 10) {
        ex = -21.5;
        ez = -29.2;
      }
      const sy = worldApi.groundHeightAt(ex, ez, py);
      actor.root.position.set(ex, sy, ez);
      if (actor.contactShadow) actor.contactShadow.visible = true;
      return true;
    }

    function update(delta, cameraYaw, elapsedSec) {
      const dt = Math.min(Math.max(delta || 0.016, 0.001), 0.1);
      const tNow = elapsedSec || 0;

      let inputX = 0;
      let inputZ = 0;
      if (keys.KeyA || keys.ArrowLeft) inputX -= 1;
      if (keys.KeyD || keys.ArrowRight) inputX += 1;
      if (keys.KeyW || keys.ArrowUp) inputZ -= 1;
      if (keys.KeyS || keys.ArrowDown) inputZ += 1;

      if (joyVec.active) {
        inputX += joyVec.x;
        inputZ += joyVec.y;
      }

      const len = movementLocked ? 0 : Math.hypot(inputX, inputZ);
      if (currentActivity && !movementLocked && len > 0.2) {
        const onCancel = currentActivity.onCancel;
        clearActivityPose(true);
        if (typeof onCancel === 'function') {
          onCancel();
        }
      }

      const baseLeg =
        actor.baseLeg ||
        0.94 * ((character && character.body && character.body.sliders && character.body.sliders.legLength) || 1);

      if (transport && transport.kind === 'car' && transport.entity && transport.entity.group) {
        const car = transport.entity;
        const grp = car.group;
        const maxCarSpeed = (keys.ShiftLeft || keys.ShiftRight || len > 0.88) ? 16.0 : 12.2;
        if (len > 0.08) {
          const clamped = Math.min(1, len);
          const nx = inputX / len;
          const nz = inputZ / len;
          const sinY = Math.sin(cameraYaw);
          const cosY = Math.cos(cameraYaw);
          _moveDir.set(nx * cosY + nz * sinY, 0, -nx * sinY + nz * cosY).normalize();

          const targetYaw = Math.atan2(_moveDir.x, _moveDir.z);
          let angDiff = targetYaw - grp.rotation.y;
          while (angDiff > Math.PI) angDiff -= Math.PI * 2;
          while (angDiff < -Math.PI) angDiff += Math.PI * 2;

          transport.steer += (THREE.MathUtils.clamp(angDiff, -0.7, 0.7) - transport.steer) * (1 - Math.exp(-10 * dt));
          grp.rotation.y += angDiff * (1 - Math.exp(-5.4 * dt));
          const targetSpd = maxCarSpeed * clamped * Math.max(0.25, Math.cos(Math.min(1.3, Math.abs(angDiff))));
          transport.speed += (targetSpd - transport.speed) * (1 - Math.exp(-5.5 * dt));
        } else {
          transport.steer += (0 - transport.steer) * (1 - Math.exp(-8 * dt));
          transport.speed += (0 - transport.speed) * (1 - Math.exp(-7 * dt));
        }

        const fwdX = Math.sin(grp.rotation.y);
        const fwdZ = Math.cos(grp.rotation.y);
        const nextX = THREE.MathUtils.clamp(grp.position.x + fwdX * transport.speed * dt, -158, 158);
        const nextZ = THREE.MathUtils.clamp(grp.position.z + fwdZ * transport.speed * dt, -52.0, 50.2);
        const resolved = worldApi.resolveCollision(nextX, nextZ, 1.35, 0, {
          ignoreEntityId: car.id,
          excludePools: true,
        });
        grp.position.x = resolved.x;
        grp.position.z = resolved.z;
        grp.position.y = 0.02;
        car.x = resolved.x;
        car.z = resolved.z;
        car.yaw = grp.rotation.y;

        transport.wheelAngle += transport.speed * dt * 3.1;
        const ud = grp.userData || {};
        if (Array.isArray(ud.wheels)) {
          for (let w = 0; w < ud.wheels.length; w++) ud.wheels[w].rotation.x = transport.wheelAngle;
        }
        if (Array.isArray(ud.frontSteer)) {
          for (let fs = 0; fs < ud.frontSteer.length; fs++) ud.frontSteer[fs].rotation.y = transport.steer * 0.45;
        }

        const cosRot = Math.cos(grp.rotation.y);
        const sinRot = Math.sin(grp.rotation.y);
        const sx = ud.seatX || -0.35;
        const sy = ud.seatY || 0.44;
        const sz = ud.seatZ || -0.26;
        actor.root.position.set(
          grp.position.x + sx * cosRot + sz * sinRot,
          grp.position.y + sy - 0.28,
          grp.position.z - sx * sinRot + sz * cosRot
        );
        actor.root.rotation.y = grp.rotation.y;
        speedMag = transport.speed;

        if (window.CrownAnim) {
          window.CrownAnim.applyPose(actor, 'drive', dt, tNow, { steer: transport.steer, rigOffsetY: -baseLeg * 0.62 });
        }
        updateLivingSkin(actor, tNow, window.CrownGame && window.CrownGame.needs, false, speedMag);
      } else if (transport && transport.kind === 'horse' && transport.entity && transport.entity.group) {
        const hr = transport.entity;
        const grp = hr.group;
        const isFast = transport.boost || Boolean(keys.ShiftLeft || keys.ShiftRight || len > 0.88);
        const maxHorseSpd = isFast ? 12.2 : 8.2;

        if (len > 0.08) {
          const clamped = Math.min(1, len);
          const nx = inputX / len;
          const nz = inputZ / len;
          const sinY = Math.sin(cameraYaw);
          const cosY = Math.cos(cameraYaw);
          _moveDir.set(nx * cosY + nz * sinY, 0, -nx * sinY + nz * cosY).normalize();

          const targetYaw = Math.atan2(_moveDir.x, _moveDir.z);
          let angDiff = targetYaw - grp.rotation.y;
          while (angDiff > Math.PI) angDiff -= Math.PI * 2;
          while (angDiff < -Math.PI) angDiff += Math.PI * 2;

          grp.rotation.y += angDiff * (1 - Math.exp(-7.5 * dt));
          transport.speed += (maxHorseSpd * clamped - transport.speed) * (1 - Math.exp(-7.0 * dt));
          transport.gallopPhase += dt * (transport.speed * 1.85 + 2.5);
        } else {
          transport.speed += (0 - transport.speed) * (1 - Math.exp(-8.5 * dt));
        }

        const fwdX = Math.sin(grp.rotation.y);
        const fwdZ = Math.cos(grp.rotation.y);
        const nextX = THREE.MathUtils.clamp(grp.position.x + fwdX * transport.speed * dt, -158, 158);
        const nextZ = THREE.MathUtils.clamp(grp.position.z + fwdZ * transport.speed * dt, -52.0, 50.2);
        const resolved = worldApi.resolveCollision(nextX, nextZ, 0.72, 0, {
          ignoreEntityId: hr.id,
        });
        const baseY = worldApi.groundHeightAt(resolved.x, resolved.z, 0);
        const bob = transport.speed > 0.35 ? Math.abs(Math.sin(transport.gallopPhase)) * 0.05 : 0;
        grp.position.set(resolved.x, baseY + bob, resolved.z);
        hr.x = resolved.x;
        hr.z = resolved.z;
        hr.yaw = grp.rotation.y;

        const rig = grp.userData && grp.userData.rig;
        if (rig && rig.legs && rig.legs.length >= 4) {
          const swingAmp = Math.min(1, transport.speed / 5.5) * 0.68;
          const gp = transport.gallopPhase;
          rig.legs[0].rotation.x = Math.sin(gp) * swingAmp;
          rig.legs[3].rotation.x = Math.sin(gp + 0.35) * swingAmp;
          rig.legs[1].rotation.x = -Math.sin(gp) * swingAmp;
          rig.legs[2].rotation.x = -Math.sin(gp + 0.35) * swingAmp;
          if (rig.headPivot) {
            rig.headPivot.rotation.x = transport.speed > 0.35 ? Math.sin(gp * 2) * 0.09 + 0.06 : Math.sin(tNow * 1.6) * 0.04;
          }
          if (rig.tailPivot) {
            rig.tailPivot.rotation.x = transport.speed > 0.35 ? -0.34 + Math.sin(gp) * 0.14 : Math.sin(tNow * 2.2) * 0.06;
          }
        }

        actor.root.position.set(grp.position.x, grp.position.y + 1.48, grp.position.z);
        actor.root.rotation.y = grp.rotation.y;
        speedMag = transport.speed;

        if (window.CrownAnim) {
          window.CrownAnim.applyPose(actor, 'ride_horse', dt, tNow, {
            gallopPhase: transport.gallopPhase,
            horseSpeed: transport.speed,
            rigOffsetY: -baseLeg * 0.34,
          });
        }
        updateLivingSkin(actor, tNow, window.CrownGame && window.CrownGame.needs, false, speedMag);
      } else if (currentActivity && window.CrownAnim) {
        window.CrownAnim.applyPose(actor, currentActivity.pose, dt, tNow, currentActivity);
        updateLivingSkin(
          actor,
          tNow,
          window.CrownGame && window.CrownGame.needs,
          currentActivity.pose === 'swim',
          0,
          currentActivity.pose === 'sleep' || currentActivity.pose === 'nap'
        );
      } else {
        const wasWater = inWater;
        inWater = Boolean(worldApi.isInPool && worldApi.isInPool(actor.root.position));
        const isSprinting = Boolean(keys.ShiftLeft || keys.ShiftRight || len > 0.88);
        const maxSpeed = inWater ? 3.4 : isSprinting ? 7.6 : 4.8;

        if (len > 0.08) {
          const clampedLen = Math.min(1, len);
          const nx = inputX / len;
          const nz = inputZ / len;

          const sinY = Math.sin(cameraYaw);
          const cosY = Math.cos(cameraYaw);
          _moveDir.set(nx * cosY + nz * sinY, 0, -nx * sinY + nz * cosY).normalize();

          const targetSpeed = maxSpeed * clampedLen;
          speedMag += (targetSpeed - speedMag) * (1 - Math.exp(-12 * dt));

          const nextX = actor.root.position.x + _moveDir.x * speedMag * dt;
          const nextZ = actor.root.position.z + _moveDir.z * speedMag * dt;
          const resolved = worldApi.resolveCollision(nextX, nextZ, 0.52, actor.root.position.y);

          actor.root.position.x = resolved.x;
          actor.root.position.z = resolved.z;

          const targetYaw = Math.atan2(_moveDir.x, _moveDir.z);
          let diff = targetYaw - actor.root.rotation.y;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          actor.root.rotation.y += diff * (1 - Math.exp(-14 * dt));

          walkPhase += dt * (speedMag * 2.15);
          swimPhase += dt * (speedMag * 2.5 + 1.4);
        } else {
          speedMag += (0 - speedMag) * (1 - Math.exp(-10 * dt));
        }

        actor.root.position.y = worldApi.groundHeightAt(
          actor.root.position.x,
          actor.root.position.z,
          actor.root.position.y
        );

        inWater = Boolean(worldApi.isInPool && worldApi.isInPool(actor.root.position));
        if (inWater && !wasWater && window.CrownNeeds) {
          window.CrownNeeds.applyBoost({ fun: 4, hygiene: 4 });
        }

        const moveWeight = Math.min(1, speedMag / (inWater ? 2.4 : 4.2));
        if (inWater && window.CrownAnim && typeof window.CrownAnim.applySwimLocomotion === 'function') {
          window.CrownAnim.applySwimLocomotion(actor, dt, tNow, swimPhase, moveWeight, baseLeg);
        } else if (window.CrownAnim) {
          window.CrownAnim.applyLocomotion(actor, dt, tNow, walkPhase, moveWeight, baseLeg);
        }
        updateLivingSkin(actor, tNow, window.CrownGame && window.CrownGame.needs, inWater, speedMag);
      }

      if (actor.plumbob) {
        actor.plumbob.rotation.y = tNow * 1.4;
        actor.plumbob.position.y = baseLeg + 1.24 + Math.sin(tNow * 2.2) * 0.035;
      }

      if (window.CrownGame && window.CrownGame.world) {
        if (!window.CrownGame.world.playerPos) window.CrownGame.world.playerPos = {};
        window.CrownGame.world.playerPos.x = Math.round(actor.root.position.x * 100) * 0.01;
        window.CrownGame.world.playerPos.y = Math.round(actor.root.position.y * 100) * 0.01;
        window.CrownGame.world.playerPos.z = Math.round(actor.root.position.z * 100) * 0.01;
        window.CrownGame.world.playerYaw = Math.round(actor.root.rotation.y * 1000) * 0.001;
      }

      return {
        position: actor.root.position,
        yaw: actor.root.rotation.y,
        speed: speedMag,
        activity: currentActivity,
        transport: transport,
        inWater: inWater,
      };
    }

    function teleport(x, z, yaw, floorY) {
      if (transport) exitTransport();
      if (currentActivity) {
        clearActivityPose(false);
      }
      inWater = false;
      const targetY = worldApi.groundHeightAt(x, z, typeof floorY === 'number' ? floorY : actor.root.position.y);
      actor.root.position.set(x, targetY, z);
      if (typeof yaw === 'number') actor.root.rotation.y = yaw;
    }

    function dispose() {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      scene.remove(actor.root);
      actor.dispose();
    }

    return {
      actor: actor,
      setJoystick: setJoystick,
      setActivityPose: setActivityPose,
      clearActivityPose: clearActivityPose,
      getActivity: getActivity,
      enterCar: enterCar,
      toggleCarDoors: toggleCarDoors,
      mountHorse: mountHorse,
      exitTransport: exitTransport,
      getTransport: function () { return transport; },
      setTransportListener: setTransportListener,
      setCanterBoost: setCanterBoost,
      isSwimming: function () { return inWater || Boolean(currentActivity && currentActivity.pose === 'swim'); },
      setMovementLocked: setMovementLocked,
      exitPool: exitPool,
      updateLivingSkin: updateLivingSkin,
      update: update,
      teleport: teleport,
      dispose: dispose,
    };
  }

  window.CrownPlayer = {
    buildRoyalCharacterMesh: buildRoyalCharacterMesh,
    buildRoyalHorseMesh: buildRoyalHorseMesh,
    createController: createPlayerController,
    clearSharedCaches: clearSharedCaches,
  };
})();
