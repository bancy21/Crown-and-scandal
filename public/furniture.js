(function () {
  'use strict';

  function createSharedKit(THREE) {
    const geos = [];
    const mats = [];
    const textures = [];
    const keepGeo = function (g) { geos.push(g); return g; };
    const keepMat = function (m) { mats.push(m); return m; };
    const keepTex = function (t) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = THREE.RepeatWrapping;
      t.wrapT = THREE.RepeatWrapping;
      textures.push(t);
      return t;
    };

    function makeTex(size, drawFn) {
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      drawFn(ctx, size);
      return keepTex(new THREE.CanvasTexture(c));
    }

    // 1. High-Fidelity Procedural PBR CanvasTextures (Zero External 404s)
    const woodMahoganyTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#4e271c';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 90; i++) {
        const y = (i / 90) * s;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(98, 52, 34, 0.35)' : 'rgba(38, 16, 10, 0.25)';
        ctx.fillRect(0, y, s, 2 + (i % 3));
      }
      ctx.strokeStyle = 'rgba(130, 74, 46, 0.22)';
      ctx.lineWidth = 2;
      for (let w = 0; w < 14; w++) {
        ctx.beginPath();
        const yy = (w / 14) * s;
        ctx.moveTo(0, yy);
        ctx.bezierCurveTo(s * 0.33, yy + 6, s * 0.66, yy - 6, s, yy);
        ctx.stroke();
      }
    });

    const woodOakTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#8b5e3c';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(165, 118, 78, 0.28)' : 'rgba(95, 58, 32, 0.2)';
        ctx.fillRect(0, (i / 80) * s, s, 2);
      }
    });

    const carraraTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#f8f3ec';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = 'rgba(178, 164, 152, 0.34)';
      ctx.lineWidth = 2.2;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo((i * 41) % s, 0);
        ctx.bezierCurveTo((i * 73) % s, s * 0.33, (i * 29 + 60) % s, s * 0.66, (i * 53 + 90) % s, s);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(208, 178, 112, 0.16)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i * 47) % s);
        ctx.lineTo(s, (i * 61 + 40) % s);
        ctx.stroke();
      }
    });

    const damaskTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#f6f2ef';
      ctx.fillRect(0, 0, s, s);
      const step = 32;
      ctx.strokeStyle = 'rgba(160, 145, 145, 0.22)';
      ctx.lineWidth = 1.5;
      for (let y = 0; y < s; y += step) {
        for (let x = 0; x < s; x += step) {
          ctx.beginPath();
          ctx.moveTo(x + step * 0.5, y);
          ctx.lineTo(x + step, y + step * 0.5);
          ctx.lineTo(x + step * 0.5, y + step);
          ctx.lineTo(x, y + step * 0.5);
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = 'rgba(120, 105, 108, 0.28)';
          ctx.beginPath();
          ctx.arc(x + step * 0.5, y + step * 0.5, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    damaskTex.repeat.set(3, 3);

    const rugTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#f2e6da';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = '#c59642';
      ctx.lineWidth = 12;
      ctx.strokeRect(12, 12, s - 24, s - 24);
      ctx.strokeStyle = '#9c4c60';
      ctx.lineWidth = 5;
      ctx.strokeRect(24, 24, s - 48, s - 48);
      ctx.fillStyle = 'rgba(197, 150, 66, 0.24)';
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.5, s * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#9c4c60';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#fff9f2';
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.5, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
    });

    const pianoKeysTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#fcfaf5';
      ctx.fillRect(0, 0, s, s);
      const whites = 24;
      const w = s / whites;
      ctx.strokeStyle = '#b8b0a4';
      ctx.lineWidth = 1;
      for (let i = 0; i < whites; i++) {
        ctx.strokeRect(i * w, 0, w, s);
      }
      ctx.fillStyle = '#1b181d';
      for (let i = 0; i < whites; i++) {
        const mod = i % 7;
        if (mod !== 2 && mod !== 6) {
          ctx.fillRect(i * w + w * 0.68, 0, w * 0.62, s * 0.62);
        }
      }
    });

    function makeArtTexture(variant) {
      return makeTex(256, function (ctx, s) {
        const g = ctx.createLinearGradient(0, 0, 0, s);
        if (variant === 0) {
          g.addColorStop(0, '#c5d7e8');
          g.addColorStop(0.55, '#f2d9cb');
          g.addColorStop(1, '#58784d');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, s, s);
          ctx.fillStyle = '#f5ebd8';
          ctx.fillRect(s * 0.2, s * 0.36, s * 0.6, s * 0.24);
          ctx.fillStyle = '#405368';
          ctx.fillRect(s * 0.35, s * 0.26, s * 0.3, s * 0.1);
          ctx.fillStyle = '#d4af55';
          ctx.beginPath();
          ctx.arc(s * 0.5, s * 0.78, 22, 0, Math.PI * 2);
          ctx.fill();
        } else if (variant === 1) {
          g.addColorStop(0, '#3a2b36');
          g.addColorStop(1, '#6c4952');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, s, s);
          ctx.fillStyle = '#e6c2b0';
          ctx.beginPath();
          ctx.arc(s * 0.5, s * 0.34, 24, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#c87086';
          ctx.beginPath();
          ctx.moveTo(s * 0.5, s * 0.44);
          ctx.lineTo(s * 0.74, s * 0.94);
          ctx.lineTo(s * 0.26, s * 0.94);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#e7c162';
          ctx.fillRect(s * 0.44, s * 0.19, s * 0.12, 8);
        } else if (variant === 2) {
          g.addColorStop(0, '#4c3e32');
          g.addColorStop(1, '#261e19');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, s, s);
          ctx.fillStyle = '#c99b42';
          ctx.beginPath();
          ctx.arc(s * 0.5, s * 0.72, 34, 0, Math.PI * 2);
          ctx.fill();
          const bloomCols = ['#e6889f', '#f4d378', '#f5ede2', '#b93f56'];
          for (let i = 0; i < 8; i++) {
            const ang = (i / 8) * Math.PI * 2;
            ctx.fillStyle = bloomCols[i % bloomCols.length];
            ctx.beginPath();
            ctx.arc(s * 0.5 + Math.cos(ang) * 28, s * 0.44 + Math.sin(ang) * 22, 16, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          g.addColorStop(0, '#f3b794');
          g.addColorStop(0.55, '#d599a8');
          g.addColorStop(1, '#3b6d8a');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, s, s);
          ctx.fillStyle = '#fff0b8';
          ctx.beginPath();
          ctx.arc(s * 0.5, s * 0.5, 26, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.45)';
          ctx.fillRect(s * 0.25, s * 0.72, s * 0.5, 5);
        }
      });
    }

    const artMats = [0, 1, 2, 3].map(function (v) {
      return keepMat(new THREE.MeshStandardMaterial({ map: makeArtTexture(v), roughness: 0.52 }));
    });

    const palette = {
      ivory: keepMat(new THREE.MeshStandardMaterial({ color: 0xf6efe4, roughness: 0.42, metalness: 0.04 })),
      creamMarble: keepMat(new THREE.MeshPhysicalMaterial({ map: carraraTex, color: 0xffffff, roughness: 0.22, clearcoat: 0.52 })),
      porcelain: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xfcfbf9, roughness: 0.12, clearcoat: 0.92, metalness: 0.04 })),
      gold: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xdfb454, roughness: 0.22, metalness: 0.86, clearcoat: 0.45 })),
      brass: keepMat(new THREE.MeshStandardMaterial({ color: 0xb98a3c, roughness: 0.34, metalness: 0.72 })),
      silver: keepMat(new THREE.MeshStandardMaterial({ color: 0xd9dfe6, roughness: 0.22, metalness: 0.88 })),
      mahogany: keepMat(new THREE.MeshStandardMaterial({ map: woodMahoganyTex, color: 0xffffff, roughness: 0.44, metalness: 0.08 })),
      oak: keepMat(new THREE.MeshStandardMaterial({ map: woodOakTex, color: 0xffffff, roughness: 0.62, metalness: 0.04 })),
      creamSilk: keepMat(new THREE.MeshPhysicalMaterial({ map: damaskTex, color: 0xf7eee3, roughness: 0.64, sheen: 0.6 })),
      rug: keepMat(new THREE.MeshStandardMaterial({ map: rugTex, roughness: 0.85 })),
      pianoKeys: keepMat(new THREE.MeshStandardMaterial({ map: pianoKeysTex, roughness: 0.28 })),
      sheerVeil: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xfff8f2, roughness: 0.48, transparent: true, opacity: 0.46 })),
      mirror: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xeaf4fc, roughness: 0.05, metalness: 0.9, clearcoat: 1 })),
      crystal: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xeff8ff, roughness: 0.06, metalness: 0.15, transparent: true, opacity: 0.76, clearcoat: 1 })),
      iron: keepMat(new THREE.MeshStandardMaterial({ color: 0x22242a, roughness: 0.36, metalness: 0.68 })),
      flame: keepMat(new THREE.MeshBasicMaterial({ color: 0xffa644 })),
      ember: keepMat(new THREE.MeshBasicMaterial({ color: 0xff521b })),
      warmBulb: keepMat(new THREE.MeshBasicMaterial({ color: 0xfff0c2 })),
      linen: keepMat(new THREE.MeshStandardMaterial({ color: 0xe6dac9, roughness: 0.82 })),
      foliage: keepMat(new THREE.MeshStandardMaterial({ color: 0x3f6e39, roughness: 0.74 })),
      foliageLight: keepMat(new THREE.MeshStandardMaterial({ color: 0x578c49, roughness: 0.72 })),
      fabricColors: {
        rose: keepMat(new THREE.MeshPhysicalMaterial({ map: damaskTex, color: 0xd98fa0, roughness: 0.58, sheen: 0.84 })),
        sapphire: keepMat(new THREE.MeshPhysicalMaterial({ map: damaskTex, color: 0x46669c, roughness: 0.58, sheen: 0.84 })),
        emerald: keepMat(new THREE.MeshPhysicalMaterial({ map: damaskTex, color: 0x3b7660, roughness: 0.58, sheen: 0.84 })),
        crimson: keepMat(new THREE.MeshPhysicalMaterial({ map: damaskTex, color: 0x9b2d43, roughness: 0.58, sheen: 0.84 })),
        lavender: keepMat(new THREE.MeshPhysicalMaterial({ map: damaskTex, color: 0x9b82b8, roughness: 0.58, sheen: 0.84 })),
        champagne: keepMat(new THREE.MeshPhysicalMaterial({ map: damaskTex, color: 0xddc397, roughness: 0.54, sheen: 0.78 })),
        rustic: keepMat(new THREE.MeshStandardMaterial({ color: 0x8d6346, roughness: 0.84 })),
      },
      bookColors: [
        keepMat(new THREE.MeshStandardMaterial({ color: 0x8b2f3d, roughness: 0.68 })),
        keepMat(new THREE.MeshStandardMaterial({ color: 0x2f5378, roughness: 0.68 })),
        keepMat(new THREE.MeshStandardMaterial({ color: 0x366446, roughness: 0.68 })),
        keepMat(new THREE.MeshStandardMaterial({ color: 0xb68b3e, roughness: 0.52 })),
      ],
      artCanvases: artMats,
    };

    // 2. Sculpted Sims-4 Geometry Builders & Pooled Primitives
    function buildRoundedShape(w, d, r) {
      const hw = w * 0.5;
      const hd = d * 0.5;
      const rad = Math.min(r, hw * 0.45, hd * 0.45);
      const shape = new THREE.Shape();
      shape.moveTo(-hw + rad, -hd);
      shape.lineTo(hw - rad, -hd);
      shape.quadraticCurveTo(hw, -hd, hw, -hd + rad);
      shape.lineTo(hw, hd - rad);
      shape.quadraticCurveTo(hw, hd, hw - rad, hd);
      shape.lineTo(-hw + rad, hd);
      shape.quadraticCurveTo(-hw, hd, -hw, hd - rad);
      shape.lineTo(-hw, -hd + rad);
      shape.quadraticCurveTo(-hw, -hd, -hw + rad, -hd);
      return shape;
    }

    function makeRoundedSlab(w, h, d, r, bevel) {
      const bv = typeof bevel === 'number' ? bevel : Math.min(h * 0.25, 0.035);
      const innerH = Math.max(0.01, h - bv * 2);
      const innerW = Math.max(0.02, w - bv * 2);
      const innerD = Math.max(0.02, d - bv * 2);
      const shape = buildRoundedShape(innerW, innerD, r || 0.08);
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: innerH,
        bevelEnabled: bv > 0.002,
        bevelThickness: bv,
        bevelSize: bv,
        bevelSegments: 3,
        curveSegments: 8,
      });
      geo.rotateX(-Math.PI * 0.5);
      geo.center();
      return keepGeo(geo);
    }

    function makeArchHeadboardGeo(w, h, depth) {
      const hw = w * 0.5;
      const shape = new THREE.Shape();
      shape.moveTo(-hw, 0);
      shape.lineTo(hw, 0);
      shape.lineTo(hw, h * 0.68);
      shape.bezierCurveTo(hw * 0.72, h * 0.85, hw * 0.42, h * 1.04, 0, h);
      shape.bezierCurveTo(-hw * 0.42, h * 1.04, -hw * 0.72, h * 0.85, -hw, h * 0.68);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: Math.max(0.03, depth - 0.04),
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.02,
        bevelSegments: 2,
        curveSegments: 14,
      });
      geo.center();
      return keepGeo(geo);
    }

    /**
     * Sculpted Hollow Coverlet Dome Shell:
     * Arches from side hems (y = 0) up to curved dome crest (y = archH), with hollow interior
     * so lying characters tuck INSIDE the coverlet cleanly instead of getting sliced in half!
     */
    function makeHollowDuvetGeo(w, archH, lenZ) {
      const hw = w * 0.5;
      const thick = 0.045;
      const shape = new THREE.Shape();
      shape.moveTo(-hw, 0);
      shape.bezierCurveTo(-hw * 0.92, archH * 0.88, -hw * 0.52, archH, 0, archH);
      shape.bezierCurveTo(hw * 0.52, archH, hw * 0.92, archH * 0.88, hw, 0);
      shape.lineTo(hw - thick, 0);
      shape.bezierCurveTo((hw - thick) * 0.9, (archH - thick) * 0.88, (hw - thick) * 0.5, archH - thick, 0, archH - thick);
      shape.bezierCurveTo(-(hw - thick) * 0.5, archH - thick, -(hw - thick) * 0.9, (archH - thick) * 0.88, -hw + thick, 0);
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: lenZ,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.02,
        bevelSegments: 2,
        curveSegments: 14,
      });
      geo.translate(0, 0, -lenZ * 0.5);
      return keepGeo(geo);
    }

    function makeGrandPianoBodyGeo() {
      const shape = new THREE.Shape();
      shape.moveTo(-0.82, 0.72);
      shape.lineTo(0.82, 0.72);
      shape.lineTo(0.82, -0.05);
      shape.bezierCurveTo(0.82, -0.55, 0.42, -0.78, 0.22, -1.25);
      shape.bezierCurveTo(0.08, -1.62, -0.62, -1.66, -0.78, -1.22);
      shape.bezierCurveTo(-0.84, -0.95, -0.82, 0.25, -0.82, 0.72);
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.22,
        bevelEnabled: true,
        bevelThickness: 0.025,
        bevelSize: 0.02,
        bevelSegments: 2,
        curveSegments: 14,
      });
      geo.rotateX(Math.PI * 0.5);
      return keepGeo(geo);
    }

    const cushionGeo = makeRoundedSlab(1, 1, 1, 0.14, 0.06);
    const pillowGeo = makeRoundedSlab(1, 1, 1, 0.2, 0.07);
    const cabrioleLegGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.024, 0.0),
      new THREE.Vector2(0.036, 0.12),
      new THREE.Vector2(0.026, 0.34),
      new THREE.Vector2(0.052, 0.72),
      new THREE.Vector2(0.044, 0.92),
      new THREE.Vector2(0.058, 1.0),
    ], 12));
    const toiletBowlGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.14, 0.0),
      new THREE.Vector2(0.16, 0.08),
      new THREE.Vector2(0.11, 0.24),
      new THREE.Vector2(0.21, 0.38),
      new THREE.Vector2(0.24, 0.45),
      new THREE.Vector2(0.19, 0.45),
      new THREE.Vector2(0.15, 0.28),
      new THREE.Vector2(0.04, 0.24),
    ], 18));
    const sinkBasinGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.02, 0.0),
      new THREE.Vector2(0.18, 0.03),
      new THREE.Vector2(0.26, 0.11),
      new THREE.Vector2(0.29, 0.14),
      new THREE.Vector2(0.26, 0.14),
      new THREE.Vector2(0.16, 0.05),
      new THREE.Vector2(0.02, 0.02),
    ], 18));
    const lampBaseGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.075, 0.0),
      new THREE.Vector2(0.08, 0.04),
      new THREE.Vector2(0.042, 0.1),
      new THREE.Vector2(0.095, 0.22),
      new THREE.Vector2(0.038, 0.34),
      new THREE.Vector2(0.024, 0.42),
    ], 14));
    const lampShadeGeo = keepGeo(new THREE.CylinderGeometry(0.11, 0.18, 0.22, 16, 1, true));
    const vaseUrnGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.055, 0.0),
      new THREE.Vector2(0.068, 0.04),
      new THREE.Vector2(0.038, 0.09),
      new THREE.Vector2(0.11, 0.19),
      new THREE.Vector2(0.055, 0.28),
      new THREE.Vector2(0.085, 0.33),
    ], 14));

    const g = {
      box1: keepGeo(new THREE.BoxGeometry(1, 1, 1)),
      cyl1: keepGeo(new THREE.CylinderGeometry(0.5, 0.5, 1, 14)),
      capsule1: keepGeo(new THREE.CapsuleGeometry(0.5, 1, 6, 12)),
      cone1: keepGeo(new THREE.ConeGeometry(0.5, 1, 12)),
      sphere1: keepGeo(new THREE.SphereGeometry(0.5, 14, 10)),
      torus1: keepGeo(new THREE.TorusGeometry(0.5, 0.08, 10, 22)),
      cushion: cushionGeo,
      pillow: pillowGeo,
      leg: cabrioleLegGeo,
      toiletBowl: toiletBowlGeo,
      sinkBasin: sinkBasinGeo,
      lampBase: lampBaseGeo,
      lampShade: lampShadeGeo,
      vaseUrn: vaseUrnGeo,
      pianoBody: makeGrandPianoBodyGeo(),
    };

    const duvetCache = {};
    function getHollowDuvet(w, archH, lenZ) {
      const k = w.toFixed(2) + '_' + archH.toFixed(2) + '_' + lenZ.toFixed(2);
      if (!duvetCache[k]) duvetCache[k] = makeHollowDuvetGeo(w, archH, lenZ);
      return duvetCache[k];
    }

    const hbCache = {};
    function getArchHeadboard(w, h, d) {
      const k = w.toFixed(2) + '_' + h.toFixed(2) + '_' + d.toFixed(2);
      if (!hbCache[k]) hbCache[k] = makeArchHeadboardGeo(w, h, d);
      return hbCache[k];
    }

    function addMesh(parent, geo, mat, sx, sy, sz, px, py, pz, rx, ry, rz) {
      const m = new THREE.Mesh(geo, mat);
      if (sx !== undefined) m.scale.set(sx, sy, sz);
      if (px !== undefined) m.position.set(px, py, pz);
      if (rx || ry || rz) m.rotation.set(rx || 0, ry || 0, rz || 0);
      parent.add(m);
      return m;
    }

    function tag(obj, interactId) {
      obj.userData.interactId = interactId;
      obj.traverse(function (ch) {
        ch.userData.interactId = interactId;
      });
      return obj;
    }

    /**
     * Sims 4 Lexington-Style Royal or Cottage Bed:
     * Mattress surface sits cleanly at y = 0.58; sculpted curved hollow coverlet arches from 0.58..0.88
     * over the lower body (`z = -0.04*d..+0.48*d`), leaving pillow zone open so the sleeper's body & face
     * sit 100% cleanly above the mattress tucked comfortably inside the covers!
     */
    function buildBed(opts) {
      const cfg = opts || {};
      const grp = new THREE.Group();
      const tone = palette.fabricColors[cfg.tone || 'rose'] || palette.fabricColors.rose;
      const isCottage = Boolean(cfg.cottage);
      const isCanopy = Boolean(cfg.canopy);
      const w = cfg.w || (isCottage ? 1.75 : 2.35);
      const d = cfg.d || (isCottage ? 2.35 : 2.95);
      const frameMat = isCottage ? palette.oak : palette.gold;
      const woodAccent = isCottage ? palette.oak : palette.mahogany;

      if (!isCottage) {
        // Woven Aubusson Silk Suite Rug
        addMesh(grp, g.cushion, palette.rug, w + 1.75, 0.024, d + 1.75, 0, 0.012, 0.24);
      }

      // 4 Lathe-turned cabriole legs + molded base plinth
      [-w * 0.45, w * 0.45].forEach(function (lx) {
        [-d * 0.45, d * 0.45].forEach(function (lz) {
          addMesh(grp, g.leg, frameMat, 1.35, 0.24, 1.35, lx, 0, lz);
        });
      });
      addMesh(grp, g.cushion, woodAccent, w + 0.14, 0.16, d + 0.14, 0, 0.28, 0);

      // Plump rounded Cream Damask Mattress (top surface strictly at y = 0.58!)
      addMesh(grp, g.cushion, palette.creamSilk, w, 0.24, d, 0, 0.46, 0);

      // Sculpted Hollow Arched Coverlet Dome (y = 0.57..0.88 over lower legs z = -0.04*d..+0.48*d)
      const duvetLen = d * 0.54;
      const duvetDome = new THREE.Mesh(getHollowDuvet(w + 0.06, 0.31, duvetLen), tone);
      duvetDome.position.set(0, 0.57, d * 0.22);
      grp.add(duvetDome);

      // Hanging Tailored Side Bedskirts & Rolled Top Cuff Fold
      addMesh(grp, g.cushion, tone, 0.07, 0.25, duvetLen + 0.04, -w * 0.505, 0.44, d * 0.22);
      addMesh(grp, g.cushion, tone, 0.07, 0.25, duvetLen + 0.04, w * 0.505, 0.44, d * 0.22);
      addMesh(grp, g.cushion, tone, w + 0.06, 0.25, 0.07, 0, 0.44, d * 0.49);
      // Silk Turned-Back Duvet Collar Cuff at chest fold
      addMesh(grp, g.cushion, palette.creamSilk, w * 0.94, 0.08, 0.18, 0, 0.85, -d * 0.04);
      // Decorative velvet runner throw across foot of bed
      addMesh(grp, g.cushion, palette.gold, w * 0.98, 0.04, 0.28, 0, 0.87, d * 0.34);

      // Twin Sculpted Plump Pillows (y = 0.59..0.72, z = -d * 0.36)
      addMesh(grp, g.pillow, palette.creamSilk, w * 0.4, 0.13, 0.48, -w * 0.22, 0.64, -d * 0.36, 0.1, 0, 0);
      addMesh(grp, g.pillow, palette.creamSilk, w * 0.4, 0.13, 0.48, w * 0.22, 0.64, -d * 0.36, 0.1, 0, 0);

      // Carved Scalloped Tufted Headboard (-Z edge cleanly at -d * 0.5 - 0.08)
      const hbH = isCottage ? 1.15 : 1.92;
      const hbOuter = new THREE.Mesh(getArchHeadboard(w + 0.24, hbH, 0.15), frameMat);
      hbOuter.position.set(0, hbH * 0.5 + 0.14, -d * 0.5 - 0.09);
      grp.add(hbOuter);
      const hbInner = new THREE.Mesh(getArchHeadboard(w - 0.16, hbH * 0.78, 0.17), tone);
      hbInner.position.set(0, hbH * 0.48 + 0.14, -d * 0.5 - 0.05);
      grp.add(hbInner);

      if (!isCottage) {
        addMesh(grp, g.sphere1, frameMat, 0.22, 0.26, 0.22, 0, hbH + 0.24, -d * 0.5 - 0.09);
        // Tufted Velvet Footboard Bench (cleanly at +d * 0.5 + 0.45)
        [-w * 0.32, w * 0.32].forEach(function (bx) {
          addMesh(grp, g.leg, frameMat, 1.2, 0.3, 1.2, bx, 0, d * 0.5 + 0.45);
        });
        addMesh(grp, g.cushion, frameMat, w * 0.76, 0.1, 0.42, 0, 0.34, d * 0.5 + 0.45);
        addMesh(grp, g.cushion, tone, w * 0.74, 0.13, 0.4, 0, 0.44, d * 0.5 + 0.45);
      }

      if (isCanopy) {
        [-w * 0.48, w * 0.48].forEach(function (px) {
          [-d * 0.48, d * 0.48].forEach(function (pz) {
            addMesh(grp, g.cyl1, palette.gold, 0.085, 3.25, 0.085, px, 1.65, pz);
            addMesh(grp, g.sphere1, palette.gold, 0.15, 0.2, 0.15, px, 3.36, pz);
            addMesh(grp, g.cyl1, palette.sheerVeil, 0.22, 2.7, 0.22, px * 0.94, 1.8, pz * 0.94);
          });
        });
        addMesh(grp, g.cushion, palette.gold, w + 0.18, 0.12, d + 0.18, 0, 3.26, 0);
        addMesh(grp, g.cushion, palette.creamSilk, w - 0.08, 0.06, d - 0.08, 0, 3.2, 0);
      }

      // Carved Mahogany Nightstand + Porcelain Urn Lamp (+X side only so -X stays clear)
      if (!cfg.noSideTable) {
        const nx = w * 0.5 + 0.52;
        const nz = -d * 0.35;
        addMesh(grp, g.cushion, woodAccent, 0.54, 0.52, 0.52, nx, 0.3, nz);
        addMesh(grp, g.cushion, palette.creamMarble, 0.58, 0.06, 0.56, nx, 0.58, nz);
        addMesh(grp, g.sphere1, palette.gold, 0.05, 0.05, 0.05, nx, 0.42, nz + 0.27);
        addMesh(grp, g.lampBase, palette.gold, 1, 1, 1, nx, 0.61, nz);
        const shade = addMesh(grp, g.lampShade, palette.creamSilk, 1, 1, 1, nx, 0.96, nz);
        shade.material = palette.creamSilk;
        addMesh(grp, g.sphere1, palette.warmBulb, 0.11, 0.11, 0.11, nx, 0.94, nz);
      }

      if (cfg.interactId) tag(grp, cfg.interactId);
      return grp;
    }

    /**
     * Realistic Lathe-Turned Porcelain Toilet + Curved Seat Ring & Cistern.
     */
    function buildToilet(interactId, rustic) {
      const grp = new THREE.Group();
      const bodyMat = rustic ? palette.ivory : palette.porcelain;
      const trimMat = rustic ? palette.oak : palette.gold;
      addMesh(grp, g.toiletBowl, bodyMat, 1, 1, 1.15, 0, 0, 0.08);
      addMesh(grp, g.torus1, rustic ? palette.oak : palette.ivory, 0.38, 0.44, 0.35, 0, 0.46, 0.08, Math.PI / 2, 0, 0);
      addMesh(grp, g.cushion, bodyMat, 0.48, 0.56, 0.24, 0, 0.68, -0.2);
      addMesh(grp, g.cushion, trimMat, 0.52, 0.06, 0.28, 0, 0.98, -0.2);
      addMesh(grp, g.box1, palette.gold, 0.09, 0.03, 0.03, 0.26, 0.86, -0.14);
      if (!rustic) {
        addMesh(grp, g.cushion, palette.rug, 0.64, 0.022, 0.52, 0, 0.011, 0.26);
      }
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Carrara Marble Vanity + Scalloped Oval Sink + Sculpted Perfume Decanters & Twin Sconces.
     */
    function buildVanitySink(interactId, rustic) {
      const grp = new THREE.Group();
      const cabMat = rustic ? palette.oak : palette.ivory;
      const trim = rustic ? palette.oak : palette.gold;
      const topMat = rustic ? palette.linen : palette.creamMarble;
      addMesh(grp, g.cushion, cabMat, 1.24, 0.82, 0.58, 0, 0.43, 0);
      addMesh(grp, g.cushion, trim, 1.16, 0.04, 0.04, 0, 0.72, 0.29);
      addMesh(grp, g.cushion, topMat, 1.32, 0.08, 0.64, 0, 0.86, 0);
      addMesh(grp, g.sinkBasin, palette.porcelain, 1.0, 1.0, 0.85, 0, 0.85, 0.02);
      addMesh(grp, g.cyl1, palette.gold, 0.045, 0.22, 0.045, 0, 0.98, -0.2);
      addMesh(grp, g.box1, palette.gold, 0.04, 0.04, 0.16, 0, 1.08, -0.13);
      addMesh(grp, g.vaseUrn, palette.crystal, 0.55, 0.55, 0.55, -0.44, 0.9, 0.06);
      addMesh(grp, g.cyl1, palette.fabricColors.rose, 0.1, 0.22, 0.1, 0.44, 0.94, 0.08, 0, 0, Math.PI * 0.5);
      addMesh(grp, g.cushion, trim, 1.04, 1.28, 0.08, 0, 1.74, -0.25);
      addMesh(grp, g.cushion, palette.mirror, 0.84, 1.1, 0.09, 0, 1.74, -0.24);
      [-0.62, 0.62].forEach(function (sx) {
        addMesh(grp, g.cyl1, trim, 0.05, 0.18, 0.05, sx, 1.72, -0.22);
        addMesh(grp, g.sphere1, palette.warmBulb, 0.12, 0.14, 0.12, sx, 1.84, -0.2);
      });
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Sims 4 Sculpted Tufted Salon Sofa (Multi-Cushion Rounded Seats, Rolled Arms, Scalloped Crown & Gold Legs).
     */
    function buildSofa(opts) {
      const cfg = opts || {};
      const grp = new THREE.Group();
      const tone = palette.fabricColors[cfg.tone || 'crimson'] || palette.fabricColors.crimson;
      const w = cfg.w || 2.55;
      const frame = cfg.cottage ? palette.oak : palette.gold;

      [-w * 0.44, w * 0.44].forEach(function (lx) {
        [-0.34, 0.34].forEach(function (lz) {
          addMesh(grp, g.leg, frame, 1.3, 0.2, 1.3, lx, 0, lz);
        });
      });
      addMesh(grp, g.cushion, frame, w, 0.12, 0.92, 0, 0.22, 0);
      // 3 distinct rounded seat cushions
      const cW = (w - 0.38) / 3;
      for (let i = -1; i <= 1; i++) {
        addMesh(grp, g.cushion, tone, cW - 0.02, 0.22, 0.84, i * cW, 0.39, 0.05);
      }
      // Scalloped Tufted Camelback Backrest + Carved Crest Rail
      const bk = new THREE.Mesh(getArchHeadboard(w - 0.08, 0.78, 0.22), tone);
      bk.position.set(0, 0.72, -0.35);
      grp.add(bk);
      addMesh(grp, g.cushion, frame, w * 0.92, 0.07, 0.24, 0, 1.08, -0.36);
      // Rolled cylindrical armrests
      [-w * 0.5 + 0.13, w * 0.5 - 0.13].forEach(function (ax) {
        addMesh(grp, g.cushion, tone, 0.24, 0.36, 0.88, ax, 0.44, 0);
        addMesh(grp, g.capsule1, tone, 0.13, 0.48, 0.13, ax, 0.64, 0, Math.PI * 0.5, 0, 0);
      });
      // Angled Silk Throw Pillows
      addMesh(grp, g.pillow, palette.creamSilk, 0.38, 0.38, 0.14, -w * 0.33, 0.65, -0.17, 0, 0.28, 0.14);
      addMesh(grp, g.pillow, palette.creamSilk, 0.38, 0.38, 0.14, w * 0.33, 0.65, -0.17, 0, -0.28, -0.14);

      if (cfg.interactId) tag(grp, cfg.interactId);
      return grp;
    }

    function buildArmchair(opts) {
      const cfg = opts || {};
      const grp = new THREE.Group();
      const tone = palette.fabricColors[cfg.tone || 'rose'] || palette.fabricColors.rose;
      const frame = cfg.cottage ? palette.oak : palette.gold;
      [-0.36, 0.36].forEach(function (lx) {
        [-0.32, 0.32].forEach(function (lz) {
          addMesh(grp, g.leg, frame, 1.2, 0.2, 1.2, lx, 0, lz);
        });
      });
      addMesh(grp, g.cushion, frame, 0.92, 0.12, 0.86, 0, 0.22, 0);
      addMesh(grp, g.cushion, tone, 0.72, 0.21, 0.78, 0, 0.38, 0.04);
      const bk = new THREE.Mesh(getArchHeadboard(0.88, 0.76, 0.18), tone);
      bk.position.set(0, 0.72, -0.34);
      grp.add(bk);
      addMesh(grp, g.cushion, frame, 0.84, 0.06, 0.2, 0, 1.08, -0.35);
      [-0.39, 0.39].forEach(function (ax) {
        addMesh(grp, g.capsule1, tone, 0.1, 0.44, 0.1, ax, 0.56, 0, Math.PI * 0.5, 0, 0);
        addMesh(grp, g.cushion, tone, 0.16, 0.32, 0.76, ax, 0.4, 0);
      });
      if (cfg.interactId) tag(grp, cfg.interactId);
      return grp;
    }

    function buildDiningChair(toneName, rustic) {
      const grp = new THREE.Group();
      const frame = rustic ? palette.oak : palette.gold;
      const seatMat = palette.fabricColors[toneName || 'rose'] || palette.fabricColors.rose;
      [-0.24, 0.24].forEach(function (lx) {
        [-0.24, 0.24].forEach(function (lz) {
          addMesh(grp, g.leg, frame, 0.9, 0.44, 0.9, lx, 0, lz);
        });
      });
      addMesh(grp, g.cushion, frame, 0.62, 0.08, 0.62, 0, 0.44, 0);
      addMesh(grp, g.cushion, seatMat, 0.58, 0.11, 0.58, 0, 0.52, 0.01);
      const ovalBack = new THREE.Mesh(getArchHeadboard(0.56, 0.68, 0.1), seatMat);
      ovalBack.position.set(0, 0.92, -0.26);
      grp.add(ovalBack);
      addMesh(grp, g.cushion, frame, 0.6, 0.05, 0.11, 0, 1.24, -0.26);
      return grp;
    }

    function buildRoyalThrone(toneName) {
      const grp = new THREE.Group();
      const seatMat = palette.fabricColors[toneName || 'rose'] || palette.fabricColors.rose;
      [-0.44, 0.44].forEach(function (lx) {
        [-0.36, 0.36].forEach(function (lz) {
          addMesh(grp, g.leg, palette.gold, 1.3, 0.38, 1.3, lx, 0, lz);
        });
      });
      addMesh(grp, g.cushion, palette.gold, 1.08, 0.22, 0.94, 0, 0.46, 0);
      addMesh(grp, g.cushion, seatMat, 0.94, 0.16, 0.82, 0, 0.64, 0.03);
      const back = new THREE.Mesh(getArchHeadboard(1.06, 1.56, 0.18), seatMat);
      back.position.set(0, 1.32, -0.38);
      grp.add(back);
      addMesh(grp, g.sphere1, palette.gold, 0.24, 0.24, 0.14, 0, 2.08, -0.4);
      [-0.48, 0.48].forEach(function (ax) {
        addMesh(grp, g.capsule1, palette.gold, 0.075, 0.54, 0.075, ax, 0.88, -0.04, Math.PI * 0.5, 0, 0);
      });
      return grp;
    }

    function buildFireplace(interactId, rustic) {
      const grp = new THREE.Group();
      const stone = rustic ? palette.linen : palette.creamMarble;
      const trim = rustic ? palette.oak : palette.gold;
      addMesh(grp, g.cushion, stone, 2.55, 0.12, 1.15, 0, 0.06, 0.24);
      addMesh(grp, g.cushion, stone, 0.44, 1.5, 0.65, -0.92, 0.75, 0);
      addMesh(grp, g.cushion, stone, 0.44, 1.5, 0.65, 0.92, 0.75, 0);
      addMesh(grp, g.cushion, stone, 2.42, 0.35, 0.74, 0, 1.56, 0.04);
      addMesh(grp, g.cushion, trim, 2.58, 0.1, 0.84, 0, 1.76, 0.06);
      [-0.88, 0.88].forEach(function (mx) {
        addMesh(grp, g.lampBase, trim, 0.7, 0.8, 0.7, mx, 1.81, 0.14);
        addMesh(grp, g.sphere1, palette.warmBulb, 0.1, 0.14, 0.1, mx, 2.18, 0.14);
      });
      addMesh(grp, g.box1, palette.iron, 1.45, 1.4, 0.2, 0, 0.7, -0.22);
      addMesh(grp, g.cyl1, palette.oak, 0.18, 0.9, 0.18, 0, 0.16, 0, 0, 0, Math.PI / 2);
      addMesh(grp, g.sphere1, palette.ember, 0.55, 0.28, 0.35, 0, 0.28, 0);
      addMesh(grp, g.sphere1, palette.flame, 0.35, 0.52, 0.25, 0, 0.48, 0);
      addMesh(grp, g.cushion, stone, 1.78, 2.4, 0.55, 0, 2.95, -0.04);
      addMesh(grp, g.cushion, trim, 1.38, 1.5, 0.08, 0, 2.8, 0.26);
      addMesh(grp, g.box1, palette.mirror, 1.18, 1.28, 0.09, 0, 2.8, 0.27);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildGrandPiano(interactId) {
      const grp = new THREE.Group();
      // Genuine curved S-bend Grand Piano Case (ExtrudeGeometry!)
      addMesh(grp, g.pianoBody, palette.iron, 1, 1, 1, 0, 0.98, 0);
      [-0.7, 0.7].forEach(function (px) {
        addMesh(grp, g.leg, palette.iron, 1.3, 0.76, 1.3, px, 0, 0.54);
      });
      addMesh(grp, g.leg, palette.iron, 1.3, 0.76, 1.3, -0.15, 0, -1.25);
      addMesh(grp, g.box1, palette.gold, 0.32, 0.65, 0.06, 0, 0.34, 0.44);
      // 88-Key Black/White Keyboard & Sheet Music
      addMesh(grp, g.box1, palette.pianoKeys, 1.38, 0.05, 0.24, 0, 0.83, 0.74);
      addMesh(grp, g.cushion, palette.gold, 0.65, 0.32, 0.04, 0, 1.16, 0.46, -0.22, 0, 0);
      addMesh(grp, g.box1, palette.porcelain, 0.52, 0.28, 0.05, 0, 1.17, 0.47, -0.22, 0, 0);
      // Propped wing lid
      addMesh(grp, g.pianoBody, palette.iron, 0.94, 0.22, 0.94, -0.14, 1.18, -0.04, 0, 0, 0.34);
      addMesh(grp, g.cyl1, palette.gold, 0.04, 0.68, 0.04, 0.56, 1.18, -0.1, 0, 0, -0.15);
      // Tufted Bench
      [-0.4, 0.4].forEach(function (bx) {
        addMesh(grp, g.leg, palette.iron, 1, 0.44, 1, bx, 0, 1.15);
      });
      addMesh(grp, g.cushion, palette.iron, 0.96, 0.09, 0.42, 0, 0.48, 1.15);
      addMesh(grp, g.cushion, palette.fabricColors.crimson, 0.92, 0.1, 0.4, 0, 0.56, 1.15);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildKitchenCounter(interactId, rustic) {
      const grp = new THREE.Group();
      const cabMat = rustic ? palette.oak : palette.ivory;
      const topMat = rustic ? palette.linen : palette.creamMarble;
      addMesh(grp, g.cushion, cabMat, 3.2, 0.88, 0.88, 0, 0.44, 0);
      addMesh(grp, g.cushion, topMat, 3.28, 0.08, 0.94, 0, 0.9, 0);
      addMesh(grp, g.cushion, palette.iron, 1.05, 0.92, 0.9, -0.8, 0.46, 0.02);
      addMesh(grp, g.cyl1, palette.brass, 0.42, 0.28, 0.42, -0.8, 1.08, 0);
      addMesh(grp, g.box1, palette.ember, 0.64, 0.32, 0.04, -0.8, 0.45, 0.47);
      addMesh(grp, g.cushion, palette.oak, 0.52, 0.04, 0.36, 0.6, 0.96, 0.08);
      addMesh(grp, g.vaseUrn, palette.gold, 0.85, 0.85, 0.85, 1.15, 0.94, -0.05);
      if (!rustic) {
        addMesh(grp, g.cushion, palette.gold, 1.25, 0.65, 0.72, -0.8, 2.35, -0.04);
      }
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildBookshelf(interactId, rustic) {
      const grp = new THREE.Group();
      const wood = rustic ? palette.oak : palette.mahogany;
      addMesh(grp, g.cushion, wood, 1.65, 2.35, 0.44, 0, 1.18, 0);
      addMesh(grp, g.cushion, rustic ? palette.oak : palette.gold, 1.76, 0.1, 0.52, 0, 2.38, 0);
      [0.45, 1.0, 1.55, 2.05].forEach(function (sy, rIdx) {
        addMesh(grp, g.box1, palette.gold, 1.54, 0.05, 0.46, 0, sy - 0.14, 0.02);
        for (let b = 0; b < 5; b++) {
          const bMat = palette.bookColors[(rIdx * 3 + b) % palette.bookColors.length];
          addMesh(grp, g.cushion, bMat, 0.16, 0.28 + (b % 2) * 0.05, 0.3, -0.52 + b * 0.26, sy + 0.04, 0.08);
        }
      });
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildWardrobe(interactId, rustic) {
      const grp = new THREE.Group();
      const wood = rustic ? palette.oak : palette.mahogany;
      const trim = rustic ? palette.iron : palette.gold;
      addMesh(grp, g.cushion, wood, 1.48, 2.24, 0.7, 0, 1.12, 0);
      addMesh(grp, g.cushion, trim, 1.58, 0.12, 0.78, 0, 2.28, 0);
      addMesh(grp, g.box1, trim, 0.04, 1.85, 0.04, -0.02, 1.05, 0.36);
      addMesh(grp, g.sphere1, trim, 0.08, 0.08, 0.08, -0.14, 1.15, 0.38);
      addMesh(grp, g.sphere1, trim, 0.08, 0.08, 0.08, 0.1, 1.15, 0.38);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildTableSet(interactId, rustic) {
      const grp = new THREE.Group();
      const wood = rustic ? palette.oak : palette.gold;
      addMesh(grp, g.cushion, wood, 1.6, 0.08, 1.05, 0, 0.76, 0);
      addMesh(grp, g.leg, wood, 1.8, 0.72, 1.8, 0, 0, 0);
      addMesh(grp, g.vaseUrn, palette.porcelain, 0.85, 0.8, 0.85, 0, 0.8, 0);
      [-1.02, 1.02].forEach(function (cx) {
        const c = buildDiningChair(rustic ? 'rustic' : 'rose', rustic);
        c.position.set(cx, 0, 0);
        c.rotation.y = cx < 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
        grp.add(c);
      });
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildDressingVanity(interactId, toneName) {
      const grp = new THREE.Group();
      const seatMat = palette.fabricColors[toneName || 'rose'] || palette.fabricColors.rose;
      addMesh(grp, g.cushion, palette.ivory, 1.38, 0.14, 0.62, 0, 0.74, 0);
      addMesh(grp, g.cushion, palette.gold, 1.42, 0.05, 0.66, 0, 0.82, 0);
      [-0.6, 0.6].forEach(function (lx) {
        [-0.24, 0.24].forEach(function (lz) {
          addMesh(grp, g.leg, palette.gold, 1.1, 0.68, 1.1, lx, 0, lz);
        });
      });
      addMesh(grp, g.cushion, palette.gold, 0.78, 0.96, 0.06, 0, 1.32, -0.24);
      addMesh(grp, g.box1, palette.mirror, 0.64, 0.82, 0.07, 0, 1.32, -0.23);
      addMesh(grp, g.cushion, palette.gold, 0.34, 0.86, 0.05, -0.52, 1.28, -0.17, 0, 0.32, 0);
      addMesh(grp, g.cushion, palette.gold, 0.34, 0.86, 0.05, 0.52, 1.28, -0.17, 0, -0.32, 0);
      addMesh(grp, g.vaseUrn, palette.crystal, 0.45, 0.45, 0.45, -0.42, 0.84, 0.08);
      addMesh(grp, g.vaseUrn, palette.fabricColors.rose, 0.4, 0.4, 0.4, -0.28, 0.84, 0.14);
      addMesh(grp, g.cushion, palette.gold, 0.24, 0.1, 0.18, 0.38, 0.89, 0.1);
      addMesh(grp, g.cyl1, palette.gold, 0.4, 0.36, 0.4, 0, 0.18, 0.64);
      addMesh(grp, g.cushion, seatMat, 0.48, 0.15, 0.48, 0, 0.42, 0.64);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildWritingDesk(interactId, toneName) {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.mahogany, 1.56, 0.14, 0.78, 0, 0.76, 0);
      addMesh(grp, g.cushion, palette.gold, 1.6, 0.04, 0.82, 0, 0.83, 0);
      addMesh(grp, g.cushion, palette.mahogany, 0.42, 0.72, 0.72, -0.56, 0.36, 0);
      addMesh(grp, g.cushion, palette.mahogany, 0.42, 0.72, 0.72, 0.56, 0.36, 0);
      addMesh(grp, g.cushion, palette.porcelain, 0.42, 0.03, 0.32, 0, 0.87, 0.06);
      addMesh(grp, g.lampBase, palette.gold, 0.75, 0.75, 0.75, -0.45, 0.85, -0.18);
      addMesh(grp, g.sphere1, palette.warmBulb, 0.09, 0.12, 0.09, -0.45, 1.18, -0.18);
      const deskChair = buildDiningChair(toneName || 'crimson', false);
      deskChair.position.set(0, 0, 0.72);
      deskChair.rotation.y = Math.PI;
      grp.add(deskChair);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildChestOfDrawers(interactId, toneName, rustic) {
      const grp = new THREE.Group();
      const bodyMat = rustic ? palette.oak : palette.mahogany;
      const trim = rustic ? palette.iron : palette.gold;
      const accent = palette.fabricColors[toneName || 'champagne'] || palette.fabricColors.champagne;
      addMesh(grp, g.cushion, bodyMat, 1.28, 1.08, 0.58, 0, 0.54, 0);
      addMesh(grp, g.cushion, rustic ? palette.linen : palette.creamMarble, 1.36, 0.07, 0.64, 0, 1.1, 0);
      [0.24, 0.54, 0.84].forEach(function (dy) {
        addMesh(grp, g.box1, trim, 1.06, 0.04, 0.04, 0, dy, 0.3);
        addMesh(grp, g.sphere1, trim, 0.06, 0.06, 0.06, -0.3, dy, 0.32);
        addMesh(grp, g.sphere1, trim, 0.06, 0.06, 0.06, 0.3, dy, 0.32);
      });
      addMesh(grp, g.vaseUrn, accent, 1, 1, 1, 0, 1.14, 0);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildChandelier(scale) {
      const s = scale || 1;
      const grp = new THREE.Group();
      addMesh(grp, g.cyl1, palette.gold, 0.08 * s, 0.95 * s, 0.08 * s, 0, 0.5 * s, 0);
      addMesh(grp, g.torus1, palette.gold, 1.55 * s, 1.55 * s, 0.45 * s, 0, 0, 0, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.torus1, palette.gold, 0.95 * s, 0.95 * s, 0.35 * s, 0, 0.28 * s, 0, Math.PI * 0.5, 0, 0);
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const cx = Math.cos(a) * 0.78 * s;
        const cz = Math.sin(a) * 0.78 * s;
        addMesh(grp, g.cyl1, palette.porcelain, 0.06 * s, 0.18 * s, 0.06 * s, cx, 0.12 * s, cz);
        addMesh(grp, g.sphere1, palette.warmBulb, 0.09 * s, 0.12 * s, 0.09 * s, cx, 0.24 * s, cz);
        addMesh(grp, g.cone1, palette.crystal, 0.08 * s, 0.22 * s, 0.08 * s, cx * 0.92, -0.14 * s, cz * 0.92, Math.PI, 0, 0);
      }
      addMesh(grp, g.sphere1, palette.crystal, 0.22 * s, 0.28 * s, 0.22 * s, 0, -0.22 * s, 0);
      return grp;
    }

    function buildWallArt(variant, w, h) {
      const grp = new THREE.Group();
      const fw = w || 1.35;
      const fh = h || 1.65;
      const canvasMat = palette.artCanvases[(variant || 0) % palette.artCanvases.length];
      addMesh(grp, g.cushion, palette.gold, fw, fh, 0.07, 0, 0, 0);
      addMesh(grp, g.cushion, palette.ivory, fw * 0.86, fh * 0.86, 0.08, 0, 0, 0.01);
      addMesh(grp, g.box1, canvasMat, fw * 0.76, fh * 0.76, 0.09, 0, 0, 0.02);
      return grp;
    }

    function buildCurtainPair(toneName, spanW, h) {
      const grp = new THREE.Group();
      const mat = palette.fabricColors[toneName || 'crimson'] || palette.fabricColors.crimson;
      const sw = spanW || 2.3;
      const ch = h || 3.4;
      addMesh(grp, g.cyl1, palette.gold, 0.07, sw + 0.4, 0.07, 0, ch, 0.08, 0, 0, Math.PI * 0.5);
      addMesh(grp, g.cushion, mat, sw * 0.24, ch, 0.2, -sw * 0.42, ch * 0.5, 0.08);
      addMesh(grp, g.cushion, mat, sw * 0.24, ch, 0.2, sw * 0.42, ch * 0.5, 0.08);
      addMesh(grp, g.cushion, mat, sw + 0.16, 0.28, 0.22, 0, ch - 0.12, 0.1);
      return grp;
    }

    function buildBanquetSetting() {
      const grp = new THREE.Group();
      [-1.75, 1.75].forEach(function (pz) {
        addMesh(grp, g.lampBase, palette.gold, 1, 0.9, 1, 0, 0, pz);
        addMesh(grp, g.box1, palette.gold, 0.42, 0.05, 0.08, 0, 0.42, pz);
        [-0.18, 0, 0.18].forEach(function (cx) {
          addMesh(grp, g.cyl1, palette.porcelain, 0.05, 0.18, 0.05, cx, 0.52, pz);
          addMesh(grp, g.sphere1, palette.warmBulb, 0.07, 0.1, 0.07, cx, 0.64, pz);
        });
      });
      addMesh(grp, g.vaseUrn, palette.gold, 1.1, 0.9, 1.1, 0, 0, 0);
      addMesh(grp, g.sphere1, palette.foliage, 0.46, 0.34, 0.46, 0, 0.34, 0);
      addMesh(grp, g.sphere1, palette.fabricColors.rose, 0.24, 0.2, 0.24, -0.1, 0.42, 0.08);
      addMesh(grp, g.sphere1, palette.creamSilk, 0.22, 0.18, 0.22, 0.12, 0.44, -0.06);
      [-1.7, 1.7].forEach(function (pz) {
        [-0.78, 0.78].forEach(function (px) {
          addMesh(grp, g.cyl1, palette.gold, 0.38, 0.03, 0.38, px, 0.02, pz);
          addMesh(grp, g.cyl1, palette.porcelain, 0.28, 0.04, 0.28, px, 0.04, pz);
          addMesh(grp, g.cyl1, palette.crystal, 0.08, 0.16, 0.08, px * 0.76, 0.09, pz + (pz < 0 ? 0.25 : -0.25));
        });
      });
      return grp;
    }

    function buildKitchenIsland() {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.ivory, 2.35, 0.88, 1.05, 0, 0.44, 0);
      addMesh(grp, g.cushion, palette.creamMarble, 2.48, 0.09, 1.15, 0, 0.92, 0);
      addMesh(grp, g.cyl1, palette.gold, 0.45, 0.12, 0.45, -0.4, 1.02, 0);
      addMesh(grp, g.sphere1, palette.fabricColors.crimson, 0.18, 0.18, 0.18, -0.45, 1.12, 0.05);
      addMesh(grp, g.sphere1, palette.fabricColors.champagne, 0.18, 0.18, 0.18, -0.32, 1.12, -0.04);
      addMesh(grp, g.cushion, palette.oak, 0.54, 0.05, 0.38, 0.45, 0.98, 0.1);
      return grp;
    }

    function buildPedestalPlant(isTall) {
      const grp = new THREE.Group();
      if (isTall) {
        addMesh(grp, g.cushion, palette.ivory, 0.48, 0.56, 0.48, 0, 0.28, 0);
        addMesh(grp, g.vaseUrn, palette.gold, 1.5, 1.25, 1.5, 0, 0.56, 0);
        addMesh(grp, g.cone1, palette.foliage, 0.76, 0.92, 0.76, 0, 1.32, 0);
        addMesh(grp, g.sphere1, palette.foliageLight, 0.62, 0.45, 0.62, 0, 1.18, 0);
      } else {
        addMesh(grp, g.vaseUrn, palette.ivory, 1.4, 1.1, 1.4, 0, 0, 0);
        addMesh(grp, g.sphere1, palette.foliage, 0.62, 0.48, 0.62, 0, 0.52, 0);
      }
      return grp;
    }

    function buildChessTable(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.leg, palette.mahogany, 2.2, 0.72, 2.2, 0, 0, 0);
      addMesh(grp, g.cushion, palette.mahogany, 1.24, 0.09, 1.24, 0, 0.76, 0);
      addMesh(grp, g.box1, palette.creamMarble, 0.88, 0.03, 0.88, 0, 0.82, 0);
      addMesh(grp, g.box1, palette.iron, 0.42, 0.035, 0.42, -0.2, 0.825, -0.2);
      addMesh(grp, g.box1, palette.iron, 0.42, 0.035, 0.42, 0.2, 0.825, 0.2);
      addMesh(grp, g.cone1, palette.gold, 0.08, 0.18, 0.08, -0.18, 0.91, -0.22);
      addMesh(grp, g.cone1, palette.porcelain, 0.08, 0.18, 0.08, 0.12, 0.91, 0.18);
      [-0.96, 0.96].forEach(function (cz) {
        const c = buildDiningChair('emerald', false);
        c.position.set(0, 0, cz);
        c.rotation.y = cz < 0 ? 0 : Math.PI;
        grp.add(c);
      });
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildEasel(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.box1, palette.oak, 0.1, 1.85, 0.1, -0.34, 0.92, 0.08, -0.18, 0, 0.12);
      addMesh(grp, g.box1, palette.oak, 0.1, 1.85, 0.1, 0.34, 0.92, 0.08, -0.18, 0, -0.12);
      addMesh(grp, g.box1, palette.oak, 0.1, 1.9, 0.1, 0, 0.94, -0.32, 0.26, 0, 0);
      addMesh(grp, g.cushion, palette.gold, 0.96, 1.15, 0.06, 0, 1.24, 0.08, -0.16, 0, 0);
      addMesh(grp, g.box1, palette.artCanvases[1], 0.82, 1.0, 0.07, 0, 1.24, 0.09, -0.16, 0, 0);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildGrandfatherClock() {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.mahogany, 0.68, 2.25, 0.46, 0, 1.12, 0);
      addMesh(grp, g.cushion, palette.gold, 0.76, 0.12, 0.54, 0, 2.28, 0);
      addMesh(grp, g.cyl1, palette.porcelain, 0.42, 0.06, 0.42, 0, 1.88, 0.23, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.box1, palette.gold, 0.26, 0.72, 0.06, 0, 1.12, 0.22);
      return grp;
    }

    function buildBathTowelStand() {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.gold, 0.68, 0.06, 0.36, 0, 0.03, 0);
      addMesh(grp, g.cyl1, palette.gold, 0.05, 0.95, 0.05, -0.28, 0.5, 0);
      addMesh(grp, g.cyl1, palette.gold, 0.05, 0.95, 0.05, 0.28, 0.5, 0);
      addMesh(grp, g.cyl1, palette.gold, 0.05, 0.62, 0.05, 0, 0.96, 0, 0, 0, Math.PI * 0.5);
      addMesh(grp, g.cushion, palette.creamSilk, 0.44, 0.68, 0.08, 0, 0.65, 0);
      addMesh(grp, g.cushion, palette.fabricColors.rose, 0.4, 0.48, 0.1, 0, 0.74, 0.02);
      return grp;
    }

    /**
     * Composite 3D Suburban Car (parked cleanly outside Middle-Class Houses):
     * Lower beveled chassis, tapered tinted cabin, wheels & chrome rims, lamps & grille.
     */
    function buildParkedCar(paintHex, isSuv, interactId) {
      const grp = new THREE.Group();
      const bodyMat = keepMat(new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(paintHex || 0xd6c7b8),
        roughness: 0.2,
        metalness: 0.42,
        clearcoat: 0.9,
      }));
      const glassDark = keepMat(new THREE.MeshPhysicalMaterial({
        color: 0x202d3a,
        roughness: 0.1,
        metalness: 0.25,
        clearcoat: 0.95,
      }));
      const tailRed = keepMat(new THREE.MeshBasicMaterial({ color: 0xdd3344 }));
      const carLen = isSuv ? 3.85 : 3.7;
      const roofY = isSuv ? 1.18 : 1.04;
      const cabLen = isSuv ? 2.15 : 1.68;

      // Chassis body + beveled upper hood/trunk shell
      addMesh(grp, g.cushion, bodyMat, 1.72, 0.52, carLen, 0, 0.5, 0);
      addMesh(grp, g.cushion, palette.iron, 1.78, 0.16, carLen + 0.06, 0, 0.26, 0);
      // Tapered greenhouse cabin + glass wrap
      addMesh(grp, g.cushion, bodyMat, 1.48, 0.46, cabLen, 0, roofY, -0.18);
      addMesh(grp, g.box1, glassDark, 1.5, 0.34, cabLen - 0.18, 0, roofY - 0.01, -0.18);
      // Grille, Headlights & Taillights
      addMesh(grp, g.cushion, palette.silver, 0.72, 0.2, 0.08, 0, 0.48, carLen * 0.5 + 0.02);
      [-0.58, 0.58].forEach(function (lx) {
        addMesh(grp, g.sphere1, palette.warmBulb, 0.22, 0.16, 0.12, lx, 0.54, carLen * 0.5 + 0.01);
        addMesh(grp, g.box1, tailRed, 0.26, 0.12, 0.08, lx, 0.54, -carLen * 0.5 - 0.01);
      });
      // Side mirrors
      [-0.88, 0.88].forEach(function (mx) {
        addMesh(grp, g.cushion, bodyMat, 0.16, 0.1, 0.18, mx, 0.86, 0.46);
      });
      // 4 Rubber Tires + Silver Alloy Hubs
      [-0.82, 0.82].forEach(function (wx) {
        [-1.12, 1.14].forEach(function (wz) {
          addMesh(grp, g.cyl1, palette.iron, 0.62, 0.22, 0.62, wx, 0.31, wz, 0, 0, Math.PI * 0.5);
          addMesh(grp, g.cyl1, palette.silver, 0.36, 0.24, 0.36, wx, 0.31, wz, 0, 0, Math.PI * 0.5);
        });
      });

      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Composite 3D Sculpted Royal Horse (Barrel Torso, Neck, Head, Ears, Mane, 4 Legs & Leather Saddle).
     */
    function buildHorse(coatHex, maneHex, interactId) {
      const grp = new THREE.Group();
      const coatMat = keepMat(new THREE.MeshStandardMaterial({ color: new THREE.Color(coatHex || 0x7b482c), roughness: 0.74 }));
      const maneMat = keepMat(new THREE.MeshStandardMaterial({ color: new THREE.Color(maneHex || 0x261a14), roughness: 0.84 }));
      const hoofMat = palette.iron;

      // Barrel Torso & Haunches
      addMesh(grp, g.capsule1, coatMat, 0.66, 0.82, 0.66, 0, 1.18, 0, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.sphere1, coatMat, 0.68, 0.66, 0.66, 0, 1.2, -0.45);
      addMesh(grp, g.sphere1, coatMat, 0.66, 0.68, 0.64, 0, 1.22, 0.45);
      // Angled Neck & Sculpted Head + Muzzle + Ears
      addMesh(grp, g.capsule1, coatMat, 0.34, 0.62, 0.38, 0, 1.56, 0.72, 0.55, 0, 0);
      addMesh(grp, g.capsule1, coatMat, 0.26, 0.36, 0.26, 0, 1.84, 1.02, 1.18, 0, 0);
      addMesh(grp, g.sphere1, coatMat, 0.22, 0.2, 0.22, 0, 1.72, 1.22);
      [-0.08, 0.08].forEach(function (ex) {
        addMesh(grp, g.cone1, coatMat, 0.07, 0.18, 0.07, ex, 2.02, 0.92, -0.2, 0, ex > 0 ? -0.2 : 0.2);
      });
      // Flowing Mane & Tail
      addMesh(grp, g.cushion, maneMat, 0.1, 0.56, 0.16, 0, 1.68, 0.58, 0.52, 0, 0);
      addMesh(grp, g.cone1, maneMat, 0.16, 0.78, 0.16, 0, 0.98, -0.82, -0.28, 0, 0);
      // 4 Jointed Legs + Hooves
      [-0.2, 0.2].forEach(function (lx) {
        [-0.48, 0.46].forEach(function (lz) {
          addMesh(grp, g.cyl1, coatMat, 0.13, 0.95, 0.13, lx, 0.52, lz);
          addMesh(grp, g.cyl1, hoofMat, 0.14, 0.1, 0.14, lx, 0.05, lz);
        });
      });
      // Velvet Saddle Cloth & Gold Stirrups
      addMesh(grp, g.cushion, palette.fabricColors.crimson, 0.72, 0.1, 0.54, 0, 1.48, -0.02);
      addMesh(grp, g.cushion, palette.mahogany, 0.54, 0.1, 0.46, 0, 1.54, 0);

      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Sims-4 Open-Plan Suburban Kitchen Island with 3 Breakfast Bar Stools.
     */
    function buildModernBreakfastIsland() {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.ivory, 2.6, 0.88, 1.05, 0, 0.44, 0);
      addMesh(grp, g.cushion, palette.creamMarble, 2.74, 0.08, 1.24, 0, 0.92, 0.04);
      addMesh(grp, g.cyl1, palette.silver, 0.06, 0.25, 0.06, -0.45, 1.06, -0.1);
      addMesh(grp, g.vaseUrn, palette.porcelain, 0.7, 0.7, 0.7, 0.65, 0.96, 0);
      [-0.78, 0, 0.78].forEach(function (sx) {
        addMesh(grp, g.cyl1, palette.iron, 0.06, 0.64, 0.06, sx, 0.32, 0.78);
        addMesh(grp, g.cyl1, palette.oak, 0.38, 0.07, 0.38, sx, 0.65, 0.78);
      });
      return grp;
    }

    /**
     * Sims-4 Lounge TV Console & Wall-Mounted Flatscreen.
     */
    function buildWallTVConsole(rustic) {
      const grp = new THREE.Group();
      const wood = rustic ? palette.oak : palette.mahogany;
      addMesh(grp, g.cushion, wood, 1.9, 0.52, 0.48, 0, 0.26, 0);
      addMesh(grp, g.box1, palette.iron, 1.48, 0.88, 0.08, 0, 1.06, -0.04);
      addMesh(grp, g.box1, palette.crystal, 1.38, 0.78, 0.09, 0, 1.06, -0.03);
      return grp;
    }

    /**
     * Teak & Cushioned Resort Pool Lounger + Umbrella.
     */
    function buildPoolLounger(toneName, interactId) {
      const grp = new THREE.Group();
      const pad = palette.fabricColors[toneName || 'champagne'] || palette.fabricColors.champagne;
      [-0.32, 0.32].forEach(function (lx) {
        [-0.75, 0.75].forEach(function (lz) {
          addMesh(grp, g.leg, palette.oak, 1, 0.26, 1, lx, 0, lz);
        });
      });
      addMesh(grp, g.cushion, palette.oak, 0.8, 0.09, 1.88, 0, 0.28, 0);
      addMesh(grp, g.cushion, pad, 0.74, 0.1, 1.24, 0, 0.37, 0.28);
      addMesh(grp, g.cushion, pad, 0.74, 0.1, 0.66, 0, 0.56, -0.58, 0.45, 0, 0);
      addMesh(grp, g.pillow, palette.creamSilk, 0.46, 0.1, 0.26, 0, 0.76, -0.68, 0.45, 0, 0);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Crisp Procedural Estate Plot Plaque ("Bakery", "Middle-Class Villa", "Club", etc.).
     */
    function buildPlotSign(titleText, bgHex) {
      const grp = new THREE.Group();
      const tex = makeTex(512, function (ctx, s) {
        ctx.fillStyle = bgHex || '#241920';
        ctx.fillRect(0, 0, s, s);
        ctx.strokeStyle = '#dfb454';
        ctx.lineWidth = 14;
        ctx.strokeRect(16, 16, s - 32, s - 32);
        ctx.fillStyle = '#fff8ee';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const words = String(titleText || 'Estate Plot').split(' ');
        const lines = [];
        let cur = '';
        words.forEach(function (w) {
          if ((cur + ' ' + w).trim().length > 14 && cur) {
            lines.push(cur.trim());
            cur = w;
          } else {
            cur = (cur + ' ' + w).trim();
          }
        });
        if (cur) lines.push(cur.trim());
        ctx.font = 'bold 54px Georgia, serif';
        const lineH = 68;
        const startY = s * 0.5 - ((lines.length - 1) * lineH) * 0.5;
        lines.forEach(function (ln, li) {
          ctx.fillText(ln, s * 0.5, startY + li * lineH);
        });
      });
      const signMat = keepMat(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.42 }));
      addMesh(grp, g.cyl1, palette.gold, 0.08, 1.35, 0.08, 0, 0.68, 0);
      addMesh(grp, g.cushion, palette.gold, 1.56, 0.92, 0.1, 0, 1.52, 0);
      addMesh(grp, g.box1, signMat, 1.42, 0.78, 0.12, 0, 1.52, 0.01);
      return grp;
    }

    function dispose() {
      geos.forEach(function (geo) { geo.dispose(); });
      mats.forEach(function (mat) { mat.dispose(); });
      textures.forEach(function (tex) { tex.dispose(); });
    }

    return {
      palette: palette,
      g: g,
      addMesh: addMesh,
      keepMat: keepMat,
      buildBed: buildBed,
      buildToilet: buildToilet,
      buildVanitySink: buildVanitySink,
      buildSofa: buildSofa,
      buildArmchair: buildArmchair,
      buildDiningChair: buildDiningChair,
      buildRoyalThrone: buildRoyalThrone,
      buildFireplace: buildFireplace,
      buildGrandPiano: buildGrandPiano,
      buildKitchenCounter: buildKitchenCounter,
      buildBookshelf: buildBookshelf,
      buildWardrobe: buildWardrobe,
      buildTableSet: buildTableSet,
      buildDressingVanity: buildDressingVanity,
      buildWritingDesk: buildWritingDesk,
      buildChestOfDrawers: buildChestOfDrawers,
      buildChandelier: buildChandelier,
      buildWallArt: buildWallArt,
      buildCurtainPair: buildCurtainPair,
      buildBanquetSetting: buildBanquetSetting,
      buildKitchenIsland: buildKitchenIsland,
      buildPedestalPlant: buildPedestalPlant,
      buildChessTable: buildChessTable,
      buildEasel: buildEasel,
      buildGrandfatherClock: buildGrandfatherClock,
      buildBathTowelStand: buildBathTowelStand,
      buildParkedCar: buildParkedCar,
      buildHorse: buildHorse,
      buildModernBreakfastIsland: buildModernBreakfastIsland,
      buildWallTVConsole: buildWallTVConsole,
      buildPoolLounger: buildPoolLounger,
      buildPlotSign: buildPlotSign,
      dispose: dispose,
    };
  }

  window.CrownFurniture = {
    createKit: createSharedKit,
  };
})();
