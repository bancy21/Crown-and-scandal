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

    const matCache = {};
    function getStdMat(hex, roughness, metalness) {
      const k = 'std_' + String(hex) + '_' + (roughness ?? 0.5) + '_' + (metalness ?? 0);
      if (!matCache[k]) {
        matCache[k] = keepMat(new THREE.MeshStandardMaterial({
          color: new THREE.Color(hex),
          roughness: roughness !== undefined ? roughness : 0.5,
          metalness: metalness !== undefined ? metalness : 0,
        }));
      }
      return matCache[k];
    }
    function getBasicMat(hex) {
      const k = 'bas_' + String(hex);
      if (!matCache[k]) {
        matCache[k] = keepMat(new THREE.MeshBasicMaterial({ color: new THREE.Color(hex) }));
      }
      return matCache[k];
    }

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

    const portoroTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#151418';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 14; i++) {
        ctx.strokeStyle = i % 3 === 0 ? 'rgba(218, 174, 82, 0.58)' : 'rgba(240, 224, 188, 0.24)';
        ctx.lineWidth = i % 3 === 0 ? 2.2 : 1.2;
        ctx.beginPath();
        ctx.moveTo((i * 37) % s, 0);
        ctx.bezierCurveTo((i * 71 + 40) % s, s * 0.35, (i * 29 + 90) % s, s * 0.7, (i * 63 + 20) % s, s);
        ctx.stroke();
      }
    });

    const kitchenMarbleTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#f5ebdc';
      ctx.fillRect(0, 0, s, s);
      for (let i = 0; i < 18; i++) {
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(166, 130, 86, 0.36)' : 'rgba(116, 92, 68, 0.22)';
        ctx.lineWidth = 1.4 + (i % 3) * 0.8;
        ctx.beginPath();
        ctx.moveTo(0, (i * 29) % s);
        ctx.bezierCurveTo(s * 0.33, (i * 53 + 24) % s, s * 0.66, (i * 19 + 70) % s, s, (i * 41) % s);
        ctx.stroke();
      }
    });

    const kitchenInlayFloorTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#f2e5d2';
      ctx.fillRect(0, 0, s, s);
      // Warm veining across ivory tile base
      ctx.strokeStyle = 'rgba(176, 146, 108, 0.25)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo((i * 47) % s, 0);
        ctx.lineTo((i * 83 + 50) % s, s);
        ctx.stroke();
      }
      // Dark espresso marble inlaid outer border & diamond medallion
      ctx.strokeStyle = '#3b241c';
      ctx.lineWidth = 14;
      ctx.strokeRect(10, 10, s - 20, s - 20);
      ctx.strokeStyle = '#c89b46';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(20, 20, s - 40, s - 40);
      ctx.beginPath();
      ctx.moveTo(s * 0.5, 28);
      ctx.lineTo(s - 28, s * 0.5);
      ctx.lineTo(s * 0.5, s - 28);
      ctx.lineTo(28, s * 0.5);
      ctx.closePath();
      ctx.strokeStyle = '#4e2f23';
      ctx.lineWidth = 5;
      ctx.stroke();
    });
    kitchenInlayFloorTex.repeat.set(3, 2);

    const mahoganyPanelTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#4a2216';
      ctx.fillRect(0, 0, s, s);
      for (let y = 0; y < s; y += 4) {
        ctx.fillStyle = y % 8 === 0 ? 'rgba(84, 41, 26, 0.35)' : 'rgba(28, 12, 8, 0.28)';
        ctx.fillRect(0, y, s, 3);
      }
      // Molded gilded baroque boiserie rectangle panels
      ctx.strokeStyle = '#d4af55';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 18, s * 0.5 - 24, s - 36);
      ctx.strokeRect(s * 0.5 + 8, 18, s * 0.5 - 24, s - 36);
      ctx.strokeStyle = 'rgba(223, 180, 84, 0.45)';
      ctx.lineWidth = 2;
      ctx.strokeRect(26, 28, s * 0.5 - 44, s - 56);
      ctx.strokeRect(s * 0.5 + 18, 28, s * 0.5 - 44, s - 56);
    });

    const slateBluePanelTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#405f7b';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = '#2d465c';
      ctx.lineWidth = 6;
      ctx.strokeRect(14, 16, s * 0.5 - 22, s - 32);
      ctx.strokeRect(s * 0.5 + 8, 16, s * 0.5 - 22, s - 32);
      ctx.strokeStyle = 'rgba(235, 242, 250, 0.24)';
      ctx.lineWidth = 2;
      ctx.strokeRect(18, 20, s * 0.5 - 30, s - 40);
      ctx.strokeRect(s * 0.5 + 12, 20, s * 0.5 - 30, s - 40);
    });

    const blueBorderMarbleTex = makeTex(256, function (ctx, s) {
      ctx.fillStyle = '#f4f5f7';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = 'rgba(130, 148, 170, 0.34)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo((i * 41) % s, 0);
        ctx.bezierCurveTo((i * 63) % s, s * 0.35, (i * 29 + 50) % s, s * 0.7, (i * 79) % s, s);
        ctx.stroke();
      }
      ctx.strokeStyle = '#3f5f7d';
      ctx.lineWidth = 14;
      ctx.strokeRect(12, 12, s - 24, s - 24);
      ctx.strokeStyle = '#6f8ea9';
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, s - 48, s - 48);
    });

    const persianCircleRugTex = makeTex(512, function (ctx, s) {
      const c = s * 0.5;
      ctx.fillStyle = '#e8dfd4';
      ctx.fillRect(0, 0, s, s);
      // Concentric Persian rings
      const rings = [
        { r: 0.48, col: '#4a1b2a' },
        { r: 0.44, col: '#cfa34c' },
        { r: 0.39, col: '#2d232b' },
        { r: 0.31, col: '#e7dac9' },
        { r: 0.20, col: '#692338' },
        { r: 0.11, col: '#d4af55' },
        { r: 0.05, col: '#f5ece0' },
      ];
      rings.forEach(function (rg) {
        ctx.fillStyle = rg.col;
        ctx.beginPath();
        ctx.arc(c, c, s * rg.r, 0, Math.PI * 2);
        ctx.fill();
      });
      // Radial floral arabesque spokes
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(218, 178, 92, 0.65)' : 'rgba(246, 232, 214, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * s * 0.08, c + Math.sin(a) * s * 0.08);
        ctx.lineTo(c + Math.cos(a) * s * 0.43, c + Math.sin(a) * s * 0.43);
        ctx.stroke();
      }
    });

    const poolMosaicTex = makeTex(512, function (ctx, s) {
      const c = s * 0.5;
      ctx.fillStyle = '#0e4c5c';
      ctx.fillRect(0, 0, s, s);
      ctx.strokeStyle = '#1f778c';
      ctx.lineWidth = 10;
      ctx.strokeRect(18, 18, s - 36, s - 36);
      ctx.strokeStyle = '#d4af55';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, s - 60, s - 60);
      // Classical circular mosaic medallion in pool center
      [0.28, 0.22, 0.14, 0.07].forEach(function (rad, idx) {
        ctx.strokeStyle = idx % 2 === 0 ? '#5fc4d6' : '#e6c36c';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(c, c, s * rad, 0, Math.PI * 2);
        ctx.stroke();
      });
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        ctx.strokeStyle = 'rgba(130, 224, 240, 0.45)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(c + Math.cos(a) * s * 0.07, c + Math.sin(a) * s * 0.07);
        ctx.lineTo(c + Math.cos(a) * s * 0.28, c + Math.sin(a) * s * 0.28);
        ctx.stroke();
      }
    });

    const cinemaScreenTex = makeTex(512, function (ctx, s) {
      const sky = ctx.createLinearGradient(0, 0, 0, s * 0.62);
      sky.addColorStop(0, '#273549');
      sky.addColorStop(0.55, '#686e7d');
      sky.addColorStop(0.85, '#e8b97b');
      sky.addColorStop(1, '#fff1c9');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, s, s * 0.62);
      // Sun glow over coastal sea
      const sun = ctx.createRadialGradient(s * 0.5, s * 0.58, 6, s * 0.5, s * 0.58, s * 0.25);
      sun.addColorStop(0, '#ffffff');
      sun.addColorStop(0.35, '#ffe5a3');
      sun.addColorStop(1, 'rgba(255, 229, 163, 0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, s, s * 0.68);
      // Sea reflection
      const sea = ctx.createLinearGradient(0, s * 0.62, 0, s);
      sea.addColorStop(0, '#a88c66');
      sea.addColorStop(0.4, '#324858');
      sea.addColorStop(1, '#121c26');
      ctx.fillStyle = sea;
      ctx.fillRect(0, s * 0.62, s, s * 0.38);
      // Shimmering sun trail on waves
      ctx.fillStyle = 'rgba(255, 232, 168, 0.5)';
      ctx.beginPath();
      ctx.moveTo(s * 0.44, s * 0.62);
      ctx.lineTo(s * 0.56, s * 0.62);
      ctx.lineTo(s * 0.68, s);
      ctx.lineTo(s * 0.32, s);
      ctx.closePath();
      ctx.fill();
      // Twin Mediterranean sea stack islands
      ctx.fillStyle = '#181c22';
      ctx.beginPath();
      ctx.moveTo(s * 0.02, s * 0.64);
      ctx.quadraticCurveTo(s * 0.18, s * 0.4, s * 0.28, s * 0.64);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.68, s * 0.64);
      ctx.quadraticCurveTo(s * 0.84, s * 0.34, s * 0.98, s * 0.64);
      ctx.closePath();
      ctx.fill();
    });

    function makePlaqueSignMat(text) {
      return keepMat(new THREE.MeshStandardMaterial({
        map: makeTex(256, function (ctx, s) {
          ctx.fillStyle = '#3b1c14';
          ctx.fillRect(0, 0, s, s);
          ctx.strokeStyle = '#dfb454';
          ctx.lineWidth = 10;
          ctx.strokeRect(10, 10, s - 20, s - 20);
          ctx.fillStyle = '#f8e6be';
          ctx.font = 'bold 42px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, s * 0.5, s * 0.52);
        }),
        roughness: 0.42,
      }));
    }

    const palette = {
      ivory: keepMat(new THREE.MeshStandardMaterial({ color: 0xf6efe4, roughness: 0.42, metalness: 0.04 })),
      creamMarble: keepMat(new THREE.MeshPhysicalMaterial({ map: carraraTex, color: 0xffffff, roughness: 0.22, clearcoat: 0.52 })),
      portoroMarble: keepMat(new THREE.MeshPhysicalMaterial({ map: portoroTex, color: 0xffffff, roughness: 0.14, metalness: 0.08, clearcoat: 0.88 })),
      veinedKitchenMarble: keepMat(new THREE.MeshPhysicalMaterial({ map: kitchenMarbleTex, color: 0xffffff, roughness: 0.16, clearcoat: 0.72 })),
      kitchenInlayFloor: keepMat(new THREE.MeshPhysicalMaterial({ map: kitchenInlayFloorTex, color: 0xffffff, roughness: 0.2, clearcoat: 0.58 })),
      mahoganyPanel: keepMat(new THREE.MeshStandardMaterial({ map: mahoganyPanelTex, color: 0xffffff, roughness: 0.4, metalness: 0.08 })),
      slateBluePanel: keepMat(new THREE.MeshStandardMaterial({ map: slateBluePanelTex, color: 0xffffff, roughness: 0.48, metalness: 0.05 })),
      blueBorderMarble: keepMat(new THREE.MeshPhysicalMaterial({ map: blueBorderMarbleTex, color: 0xffffff, roughness: 0.18, clearcoat: 0.65 })),
      persianCircleRug: keepMat(new THREE.MeshStandardMaterial({ map: persianCircleRugTex, roughness: 0.84 })),
      poolMosaic: keepMat(new THREE.MeshStandardMaterial({ map: poolMosaicTex, roughness: 0.24 })),
      cinemaScreen: keepMat(new THREE.MeshBasicMaterial({ map: cinemaScreenTex })),
      pantrySign: makePlaqueSignMat('PANTRY'),
      butlersSign: makePlaqueSignMat("BUTLER'S"),
      porcelain: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xfcfbf9, roughness: 0.12, clearcoat: 0.92, metalness: 0.04 })),
      gold: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xdfb454, roughness: 0.22, metalness: 0.86, clearcoat: 0.45 })),
      brass: keepMat(new THREE.MeshStandardMaterial({ color: 0xb98a3c, roughness: 0.34, metalness: 0.72 })),
      silver: keepMat(new THREE.MeshStandardMaterial({ color: 0xd9dfe6, roughness: 0.22, metalness: 0.88 })),
      mahogany: keepMat(new THREE.MeshStandardMaterial({ map: woodMahoganyTex, color: 0xffffff, roughness: 0.4, metalness: 0.1 })),
      oak: keepMat(new THREE.MeshStandardMaterial({ map: woodOakTex, color: 0xffffff, roughness: 0.62, metalness: 0.04 })),
      creamSilk: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0xf7eee3, roughness: 0.62 })),
      rug: keepMat(new THREE.MeshStandardMaterial({ map: rugTex, roughness: 0.85 })),
      pianoKeys: keepMat(new THREE.MeshStandardMaterial({ map: pianoKeysTex, roughness: 0.28 })),
      sheerVeil: keepMat(new THREE.MeshStandardMaterial({ color: 0xfff8f2, roughness: 0.55, transparent: true, opacity: 0.46 })),
      mirror: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xeaf4fc, roughness: 0.05, metalness: 0.9, clearcoat: 1 })),
      crystal: keepMat(new THREE.MeshPhysicalMaterial({ color: 0xeff8ff, roughness: 0.06, metalness: 0.15, transparent: true, opacity: 0.76, clearcoat: 1 })),
      iron: keepMat(new THREE.MeshStandardMaterial({ color: 0x22242a, roughness: 0.36, metalness: 0.68 })),
      flame: keepMat(new THREE.MeshBasicMaterial({ color: 0xffa644 })),
      ember: keepMat(new THREE.MeshBasicMaterial({ color: 0xff521b })),
      warmBulb: keepMat(new THREE.MeshBasicMaterial({ color: 0xfff0c2 })),
      warmCoveGlow: keepMat(new THREE.MeshBasicMaterial({ color: 0xffe4ad })),
      linen: keepMat(new THREE.MeshStandardMaterial({ color: 0xe6dac9, roughness: 0.82 })),
      foliage: keepMat(new THREE.MeshStandardMaterial({ color: 0x3f6e39, roughness: 0.74 })),
      foliageLight: keepMat(new THREE.MeshStandardMaterial({ color: 0x578c49, roughness: 0.72 })),
      fabricColors: {
        rose: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0xd98fa0, roughness: 0.58 })),
        sapphire: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0x46669c, roughness: 0.58 })),
        emerald: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0x3b7660, roughness: 0.58 })),
        crimson: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0x9b2d43, roughness: 0.58 })),
        plum: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0x5d1935, roughness: 0.52 })),
        burgundy: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0x5d1935, roughness: 0.52 })),
        lavender: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0x9b82b8, roughness: 0.58 })),
        champagne: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0xddc397, roughness: 0.56 })),
        creamTufted: keepMat(new THREE.MeshStandardMaterial({ map: damaskTex, color: 0xf4eadb, roughness: 0.54 })),
        rustic: keepMat(new THREE.MeshStandardMaterial({ color: 0x8d6346, roughness: 0.84 })),
      },
      bookColors: [
        keepMat(new THREE.MeshStandardMaterial({ color: 0x8b2f3d, roughness: 0.68 })),
        keepMat(new THREE.MeshStandardMaterial({ color: 0x2f5378, roughness: 0.68 })),
        keepMat(new THREE.MeshStandardMaterial({ color: 0x366446, roughness: 0.68 })),
        keepMat(new THREE.MeshStandardMaterial({ color: 0xb68b3e, roughness: 0.52 })),
      ],
      artCanvases: artMats,
      checkeredTile: keepMat(new THREE.MeshStandardMaterial({
        map: makeTex(256, function (ctx, s) {
          const half = s * 0.25;
          for (let r = 0; r < 4; r++) {
            for (let col = 0; col < 4; col++) {
              ctx.fillStyle = (r + col) % 2 === 0 ? '#faf4ea' : '#2e3038';
              ctx.fillRect(col * half, r * half, half, half);
            }
          }
          ctx.strokeStyle = 'rgba(180, 160, 130, 0.35)';
          ctx.lineWidth = 2;
          for (let i = 0; i <= 4; i++) {
            ctx.beginPath();
            ctx.moveTo(i * half, 0);
            ctx.lineTo(i * half, s);
            ctx.moveTo(0, i * half);
            ctx.lineTo(s, i * half);
            ctx.stroke();
          }
        }),
        roughness: 0.42,
      })),
      pizzeriaTile: keepMat(new THREE.MeshStandardMaterial({
        map: makeTex(256, function (ctx, s) {
          const half = s * 0.25;
          for (let r = 0; r < 4; r++) {
            for (let col = 0; col < 4; col++) {
              ctx.fillStyle = (r + col) % 2 === 0 ? '#fbf3e6' : '#9c342b';
              ctx.fillRect(col * half, r * half, half, half);
            }
          }
          ctx.strokeStyle = 'rgba(218, 198, 170, 0.45)';
          ctx.lineWidth = 2;
          for (let i = 0; i <= 4; i++) {
            ctx.beginPath();
            ctx.moveTo(i * half, 0);
            ctx.lineTo(i * half, s);
            ctx.moveTo(0, i * half);
            ctx.lineTo(s, i * half);
            ctx.stroke();
          }
        }),
        roughness: 0.45,
      })),
      pizzaMenu: keepMat(new THREE.MeshStandardMaterial({
        map: makeTex(256, function (ctx, s) {
          ctx.fillStyle = '#1e2622';
          ctx.fillRect(0, 0, s, s);
          ctx.strokeStyle = '#dfb454';
          ctx.lineWidth = 10;
          ctx.strokeRect(8, 8, s - 16, s - 16);
          ctx.fillStyle = '#f8d26a';
          ctx.font = 'bold 26px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillText('PIZZERIA NAPOLI', s * 0.5, 48);
          ctx.fillStyle = '#fff5e4';
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'left';
          ['Margherita ........ C20', 'Truffle pie ........ C24', 'Pepperoni .......... C22', 'Gelato & Espresso .. C14'].forEach(function (ln, li) {
            ctx.fillText(ln, 24, 92 + li * 36);
          });
        }),
        roughness: 0.5,
      })),
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
        bevelSegments: 1,
        curveSegments: 4,
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
        bevelSegments: 1,
        curveSegments: 7,
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
        bevelSegments: 1,
        curveSegments: 8,
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
        bevelSegments: 1,
        curveSegments: 8,
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
    ], 8));
    const toiletBowlGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.14, 0.0),
      new THREE.Vector2(0.16, 0.08),
      new THREE.Vector2(0.11, 0.24),
      new THREE.Vector2(0.21, 0.38),
      new THREE.Vector2(0.24, 0.45),
      new THREE.Vector2(0.19, 0.45),
      new THREE.Vector2(0.15, 0.28),
      new THREE.Vector2(0.04, 0.24),
    ], 12));
    const sinkBasinGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.02, 0.0),
      new THREE.Vector2(0.18, 0.03),
      new THREE.Vector2(0.26, 0.11),
      new THREE.Vector2(0.29, 0.14),
      new THREE.Vector2(0.26, 0.14),
      new THREE.Vector2(0.16, 0.05),
      new THREE.Vector2(0.02, 0.02),
    ], 12));
    const lampBaseGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.075, 0.0),
      new THREE.Vector2(0.08, 0.04),
      new THREE.Vector2(0.042, 0.1),
      new THREE.Vector2(0.095, 0.22),
      new THREE.Vector2(0.038, 0.34),
      new THREE.Vector2(0.024, 0.42),
    ], 10));
    const lampShadeGeo = keepGeo(new THREE.CylinderGeometry(0.11, 0.18, 0.22, 12, 1, true));
    const vaseUrnGeo = keepGeo(new THREE.LatheGeometry([
      new THREE.Vector2(0.055, 0.0),
      new THREE.Vector2(0.068, 0.04),
      new THREE.Vector2(0.038, 0.09),
      new THREE.Vector2(0.11, 0.19),
      new THREE.Vector2(0.055, 0.28),
      new THREE.Vector2(0.085, 0.33),
    ], 10));

    const g = {
      box1: keepGeo(new THREE.BoxGeometry(1, 1, 1)),
      cyl1: keepGeo(new THREE.CylinderGeometry(0.5, 0.5, 1, 10)),
      capsule1: keepGeo(new THREE.CapsuleGeometry(0.5, 1, 3, 8)),
      cone1: keepGeo(new THREE.ConeGeometry(0.5, 1, 8)),
      sphere1: keepGeo(new THREE.SphereGeometry(0.5, 10, 7)),
      torus1: keepGeo(new THREE.TorusGeometry(0.5, 0.08, 6, 14)),
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
      m.castShadow = false;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    }

    /**
     * Merges static non-transparent child Mesh objects within `group` by
     * (material, castShadow, receiveShadow, interactId) into single batched draw calls,
     * skipping animated subtrees (`noMerge`, `rig`, `rotor`) and preserving transforms & UVs.
     */
    const _mergeInvRoot = new THREE.Matrix4();
    const _mergeRelMat = new THREE.Matrix4();
    const _mergeNormMat = new THREE.Matrix3();
    const _mergeV = new THREE.Vector3();
    const _mergeN = new THREE.Vector3();
    function mergeStaticGroup(group, opts) {
      if (!group) return group;
      const cfg = opts || {};
      group.updateMatrixWorld(true);
      _mergeInvRoot.copy(group.matrixWorld).invert();

      const buckets = Object.create(null);
      const bucketList = [];

      function collect(node) {
        if (!node || node.visible === false) return;
        const ud = node.userData;
        if (ud && (ud.noMerge || ud.rig || ud.rotor)) return;
        if (node.isMesh && !node.isInstancedMesh) {
          const mat = node.material;
          const geo = node.geometry;
          if (
            mat && !Array.isArray(mat) && !mat.transparent &&
            geo && geo.attributes && geo.attributes.position &&
            (!cfg.filter || cfg.filter(node))
          ) {
            const iid = (ud && ud.interactId) || '';
            const key = mat.uuid + '|' + (node.castShadow ? '1' : '0') + (node.receiveShadow ? '1' : '0') + '|' + iid;
            let b = buckets[key];
            if (!b) {
              b = {
                material: mat,
                castShadow: Boolean(node.castShadow),
                receiveShadow: Boolean(node.receiveShadow),
                interactId: iid,
                items: [],
              };
              buckets[key] = b;
              bucketList.push(b);
            }
            b.items.push({ mesh: node, parent: node.parent });
          }
          return;
        }
        const ch = node.children;
        for (let i = 0; i < ch.length; i++) {
          collect(ch[i]);
        }
      }
      collect(group);

      for (let bi = 0; bi < bucketList.length; bi++) {
        const b = bucketList[bi];
        if (b.items.length < 2) continue;

        let totalVerts = 0;
        for (let ii = 0; ii < b.items.length; ii++) {
          const geo = b.items[ii].mesh.geometry;
          if (geo.index) {
            totalVerts += geo.index.count;
          } else {
            totalVerts += geo.attributes.position.count;
          }
        }
        if (totalVerts <= 0) continue;

        const posArr = new Float32Array(totalVerts * 3);
        const normArr = new Float32Array(totalVerts * 3);
        const uvArr = new Float32Array(totalVerts * 2);
        let cursor = 0;

        for (let ii = 0; ii < b.items.length; ii++) {
          const item = b.items[ii];
          const mesh = item.mesh;
          const geo = mesh.geometry;
          if (!geo.attributes.normal) geo.computeVertexNormals();
          const posAttr = geo.attributes.position;
          const normAttr = geo.attributes.normal;
          const uvAttr = geo.attributes.uv;
          const idxAttr = geo.index;

          _mergeRelMat.multiplyMatrices(_mergeInvRoot, mesh.matrixWorld);
          _mergeNormMat.getNormalMatrix(_mergeRelMat);
          const flip = _mergeRelMat.determinant() < 0;

          const triVertCount = idxAttr ? idxAttr.count : posAttr.count;
          for (let t = 0; t + 2 < triVertCount; t += 3) {
            const a = idxAttr ? idxAttr.getX(t) : t;
            const bIdx = idxAttr ? idxAttr.getX(t + (flip ? 2 : 1)) : (t + (flip ? 2 : 1));
            const c = idxAttr ? idxAttr.getX(t + (flip ? 1 : 2)) : (t + (flip ? 1 : 2));
            const idxs = [a, bIdx, c];
            for (let k = 0; k < 3; k++) {
              const vi = idxs[k];
              _mergeV.fromBufferAttribute(posAttr, vi).applyMatrix4(_mergeRelMat);
              const pOff = cursor * 3;
              posArr[pOff] = _mergeV.x;
              posArr[pOff + 1] = _mergeV.y;
              posArr[pOff + 2] = _mergeV.z;

              _mergeN.fromBufferAttribute(normAttr, vi).applyMatrix3(_mergeNormMat).normalize();
              normArr[pOff] = _mergeN.x;
              normArr[pOff + 1] = _mergeN.y;
              normArr[pOff + 2] = _mergeN.z;

              if (uvAttr) {
                const uOff = cursor * 2;
                uvArr[uOff] = uvAttr.getX(vi);
                uvArr[uOff + 1] = uvAttr.getY(vi);
              }
              cursor++;
            }
          }
          if (item.parent) item.parent.remove(mesh);
        }

        const mergedGeo = new THREE.BufferGeometry();
        mergedGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
        mergedGeo.setAttribute('normal', new THREE.BufferAttribute(normArr, 3));
        mergedGeo.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));
        if (!cfg.skipKeepGeo) keepGeo(mergedGeo);

        const mergedMesh = new THREE.Mesh(mergedGeo, b.material);
        mergedMesh.castShadow = b.castShadow;
        mergedMesh.receiveShadow = b.receiveShadow;
        if (b.interactId) mergedMesh.userData.interactId = b.interactId;
        group.add(mergedMesh);
      }

      // Prune empty non-animated wrapper sub-groups
      function pruneEmpty(node) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          const ch = node.children[i];
          if (ch.isGroup && (!ch.userData || (!ch.userData.noMerge && !ch.userData.rig && !ch.userData.rotor && !ch.userData.keepEmpty))) {
            pruneEmpty(ch);
            if (ch.children.length === 0) node.remove(ch);
          }
        }
      }
      pruneEmpty(group);
      return group;
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
      const useCircularRug = !isCottage && (Boolean(cfg.circularRug) || isCanopy);
      const w = cfg.w || (isCottage ? 1.75 : 2.35);
      const d = cfg.d || (isCottage ? 2.35 : 2.95);
      const frameMat = isCottage ? palette.oak : palette.gold;
      const woodAccent = isCottage ? palette.oak : palette.mahogany;

      if (!isCottage) {
        if (useCircularRug) {
          // Image 4 Imperial Rotunda Circular Persian Medallion Rug
          addMesh(grp, g.cyl1, palette.persianCircleRug, (w + 2.3) * 1.0, 0.024, (w + 2.3) * 1.0, 0, 0.012, 0.25);
        } else {
          // Woven Aubusson Silk Suite Rug
          addMesh(grp, g.cushion, palette.rug, w + 1.75, 0.024, d + 1.75, 0, 0.012, 0.24);
        }
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

      // Sculpted Deep Hollow Arched Coverlet Dome (inner vault up to y = 0.96 over legs & chest)
      // Open front chest tunnel (`z < -0.05*d`) with NO blocking solid cushion box across opening!
      const duvetLen = d * 0.54;
      const duvetDome = new THREE.Mesh(getHollowDuvet(w + 0.08, 0.44, duvetLen), tone);
      duvetDome.position.set(0, 0.56, d * 0.22);
      grp.add(duvetDome);

      // Hanging Tailored Side Bedskirts & Hollow Turned-Back Silk Cuff Collar
      addMesh(grp, g.cushion, tone, 0.07, 0.26, duvetLen + 0.04, -w * 0.505, 0.44, d * 0.22);
      addMesh(grp, g.cushion, tone, 0.07, 0.26, duvetLen + 0.04, w * 0.505, 0.44, d * 0.22);
      addMesh(grp, g.cushion, tone, w + 0.08, 0.26, 0.07, 0, 0.44, d * 0.49);
      const collarCuff = new THREE.Mesh(getHollowDuvet(w + 0.09, 0.45, 0.16), palette.creamSilk);
      collarCuff.position.set(0, 0.56, -d * 0.05);
      grp.add(collarCuff);
      // Thin gold runner throw curving neatly on crest near foot of bed
      const footThrow = new THREE.Mesh(getHollowDuvet(w + 0.10, 0.455, 0.26), palette.gold);
      footThrow.position.set(0, 0.56, d * 0.34);
      grp.add(footThrow);

      // Twin Sculpted Plump Pillows + Layered Silk Accent Shams (y = 0.59..0.78, z = -d * 0.36)
      addMesh(grp, g.pillow, palette.creamSilk, w * 0.4, 0.13, 0.48, -w * 0.22, 0.64, -d * 0.36, 0.1, 0, 0);
      addMesh(grp, g.pillow, palette.creamSilk, w * 0.4, 0.13, 0.48, w * 0.22, 0.64, -d * 0.36, 0.1, 0, 0);
      if (!isCottage) {
        addMesh(grp, g.pillow, palette.gold, w * 0.22, 0.22, 0.14, 0, 0.72, -d * 0.42, -0.25, 0, 0);
      }

      // Carved Scalloped Tufted Headboard (-Z edge cleanly at -d * 0.5 - 0.08)
      const hbH = isCottage ? 1.15 : 1.98;
      const hbOuter = new THREE.Mesh(getArchHeadboard(w + 0.24, hbH, 0.15), frameMat);
      hbOuter.position.set(0, hbH * 0.5 + 0.14, -d * 0.5 - 0.09);
      grp.add(hbOuter);
      const hbInner = new THREE.Mesh(getArchHeadboard(w - 0.16, hbH * 0.78, 0.17), tone);
      hbInner.position.set(0, hbH * 0.48 + 0.14, -d * 0.5 - 0.05);
      grp.add(hbInner);

      if (!isCottage) {
        addMesh(grp, g.sphere1, frameMat, 0.24, 0.28, 0.24, 0, hbH + 0.24, -d * 0.5 - 0.09);
        // Sculpted Baroque Gilded Low Footboard (matches Image 4 carved frame silhouette)
        const fbArch = new THREE.Mesh(getArchHeadboard(w + 0.14, 0.76, 0.11), frameMat);
        fbArch.position.set(0, 0.46, d * 0.5 + 0.07);
        grp.add(fbArch);
        // Tufted Velvet Footboard Bench (cleanly at +d * 0.5 + 0.50)
        [-w * 0.32, w * 0.32].forEach(function (bx) {
          addMesh(grp, g.leg, frameMat, 1.2, 0.3, 1.2, bx, 0, d * 0.5 + 0.50);
        });
        addMesh(grp, g.cushion, frameMat, w * 0.78, 0.1, 0.44, 0, 0.34, d * 0.5 + 0.50);
        addMesh(grp, g.cushion, palette.fabricColors.creamTufted, w * 0.76, 0.14, 0.42, 0, 0.44, d * 0.5 + 0.50);
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

      // Carved Mahogany Nightstand + Porcelain/Crystal Lamp (+X side only so -X exit stays clear)
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
        if (!isCottage) {
          addMesh(grp, g.vaseUrn, palette.crystal, 0.48, 0.48, 0.48, nx - 0.12, 0.61, nz + 0.16);
          addMesh(grp, g.sphere1, tone, 0.15, 0.12, 0.15, nx - 0.12, 0.8, nz + 0.16);
        }
      }

      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Carrara / Baroque Mahogany / Slate-Blue Suite Vanity with Glowing Cove, Vessel/Oval Sinks & Arched Mirrors.
     */
    function buildVanitySink(interactId, rustic, style) {
      const grp = new THREE.Group();
      if (!rustic && style === 'baroque') {
        // Image 5 Carved Mahogany Double Vessel Vanity + Filigree Mirror + White Rose Urns
        addMesh(grp, g.cushion, palette.mahoganyPanel, 1.85, 0.84, 0.62, 0, 0.44, 0);
        addMesh(grp, g.cushion, palette.gold, 1.88, 0.06, 0.64, 0, 0.86, 0);
        addMesh(grp, g.cushion, palette.creamMarble, 1.94, 0.07, 0.68, 0, 0.91, 0);
        [-0.46, 0.46].forEach(function (vx) {
          addMesh(grp, g.sinkBasin, palette.gold, 0.92, 1.15, 0.82, vx, 0.92, 0.04);
          addMesh(grp, g.cyl1, palette.brass, 0.04, 0.24, 0.04, vx, 1.04, -0.2);
          addMesh(grp, g.box1, palette.brass, 0.04, 0.04, 0.16, vx, 1.15, -0.13);
        });
        [-0.82, 0.82].forEach(function (fx) {
          addMesh(grp, g.vaseUrn, palette.gold, 0.65, 0.65, 0.65, fx, 0.95, -0.02);
          addMesh(grp, g.sphere1, palette.porcelain, 0.24, 0.18, 0.24, fx, 1.24, -0.02);
        });
        const archFrame = new THREE.Mesh(getArchHeadboard(1.42, 1.62, 0.1), palette.gold);
        archFrame.position.set(0, 1.82, -0.27);
        grp.add(archFrame);
        const archMirror = new THREE.Mesh(getArchHeadboard(1.18, 1.38, 0.11), palette.mirror);
        archMirror.position.set(0, 1.82, -0.25);
        grp.add(archMirror);
        [-0.88, 0.88].forEach(function (sx) {
          addMesh(grp, g.cyl1, palette.gold, 0.05, 0.24, 0.05, sx, 1.78, -0.22);
          addMesh(grp, g.sphere1, palette.warmBulb, 0.11, 0.16, 0.11, sx, 1.94, -0.2);
        });
      } else if (!rustic && style === 'slate') {
        // Image 6 Dusty Slate-Blue Vanity + Under-Toe Warm Cove Glow + Twin Arched Gold Mirrors + Sconces
        addMesh(grp, g.box1, palette.warmCoveGlow, 1.72, 0.055, 0.44, 0, 0.03, 0.02);
        addMesh(grp, g.cushion, palette.slateBluePanel, 1.82, 0.78, 0.58, 0, 0.45, 0);
        addMesh(grp, g.cushion, palette.porcelain, 1.88, 0.07, 0.64, 0, 0.87, 0);
        [-0.44, 0.44].forEach(function (vx) {
          addMesh(grp, g.sinkBasin, palette.porcelain, 0.88, 0.9, 0.78, vx, 0.86, 0.02);
          addMesh(grp, g.cyl1, palette.brass, 0.04, 0.2, 0.04, vx, 0.99, -0.2);
          const mArch = new THREE.Mesh(getArchHeadboard(0.68, 1.38, 0.07), palette.gold);
          mArch.position.set(vx, 1.76, -0.26);
          grp.add(mArch);
          const mGlass = new THREE.Mesh(getArchHeadboard(0.58, 1.26, 0.08), palette.mirror);
          mGlass.position.set(vx, 1.76, -0.24);
          grp.add(mGlass);
        });
        [-0.86, 0, 0.86].forEach(function (sx) {
          addMesh(grp, g.cyl1, palette.brass, 0.04, 0.12, 0.04, sx, 1.66, -0.2);
          addMesh(grp, g.cyl1, palette.warmBulb, 0.08, 0.24, 0.08, sx, 1.78, -0.18);
        });
      } else {
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
      }
      mergeStaticGroup(grp);
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
      // Layered Gold & Cream Silk Throw Pillows
      addMesh(grp, g.pillow, palette.creamSilk, 0.38, 0.38, 0.14, -w * 0.33, 0.65, -0.17, 0, 0.28, 0.14);
      addMesh(grp, g.pillow, palette.creamSilk, 0.38, 0.38, 0.14, w * 0.33, 0.65, -0.17, 0, -0.28, -0.14);
      if (!cfg.cottage) {
        addMesh(grp, g.pillow, palette.gold, 0.3, 0.3, 0.12, -w * 0.22, 0.61, -0.15, 0, 0.2, 0.08);
        addMesh(grp, g.pillow, palette.gold, 0.3, 0.3, 0.12, w * 0.22, 0.61, -0.15, 0, -0.2, -0.08);
      }

      mergeStaticGroup(grp);
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
      if (cfg.ottoman) {
        // Image 2 Tufted Cinema / Salon Companion Square Ottoman
        addMesh(grp, g.cushion, frame, 0.68, 0.1, 0.62, 0, 0.12, 0.86);
        addMesh(grp, g.cushion, tone, 0.66, 0.2, 0.58, 0, 0.26, 0.86);
      }
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      return grp;
    }

    function buildFireplace(interactId, rustic) {
      const grp = new THREE.Group();
      const stone = rustic ? palette.linen : palette.creamMarble;
      const trim = rustic ? palette.oak : palette.gold;
      const firebox = rustic ? palette.iron : palette.portoroMarble;
      addMesh(grp, g.cushion, stone, 2.75, 0.14, 1.22, 0, 0.07, 0.24);
      addMesh(grp, g.cushion, firebox, 1.85, 1.48, 0.55, 0, 0.76, -0.08);
      addMesh(grp, g.cushion, stone, 0.48, 1.54, 0.68, -0.96, 0.78, 0);
      addMesh(grp, g.cushion, stone, 0.48, 1.54, 0.68, 0.96, 0.78, 0);
      addMesh(grp, g.cushion, stone, 2.58, 0.38, 0.78, 0, 1.62, 0.04);
      addMesh(grp, g.cushion, trim, 2.74, 0.12, 0.88, 0, 1.82, 0.06);
      [-0.92, 0.92].forEach(function (mx) {
        addMesh(grp, g.lampBase, trim, 0.75, 0.85, 0.75, mx, 1.88, 0.14);
        if (!rustic) {
          addMesh(grp, g.lampShade, palette.creamSilk, 0.85, 0.85, 0.85, mx, 2.25, 0.14);
        }
        addMesh(grp, g.sphere1, palette.warmBulb, 0.11, 0.15, 0.11, mx, 2.24, 0.14);
      });
      addMesh(grp, g.box1, palette.iron, 1.42, 1.32, 0.24, 0, 0.7, -0.18);
      addMesh(grp, g.cyl1, palette.oak, 0.18, 0.9, 0.18, 0, 0.16, 0, 0, 0, Math.PI / 2);
      const ember = addMesh(grp, g.sphere1, palette.ember, 0.62, 0.3, 0.36, 0, 0.28, 0);
      const flameMain = addMesh(grp, g.cone1, palette.flame, 0.38, 0.62, 0.26, 0, 0.52, 0);
      const flameL = addMesh(grp, g.cone1, palette.flame, 0.24, 0.44, 0.2, -0.22, 0.44, 0.04, 0, 0, 0.18);
      const flameR = addMesh(grp, g.cone1, palette.flame, 0.24, 0.44, 0.2, 0.22, 0.44, 0.04, 0, 0, -0.18);
      ember.castShadow = false;
      flameMain.castShadow = false;
      flameL.castShadow = false;
      flameR.castShadow = false;
      ember.userData.noMerge = true;
      flameMain.userData.noMerge = true;
      flameL.userData.noMerge = true;
      flameR.userData.noMerge = true;
      grp.userData.flames = [flameMain, flameL, flameR];
      // Image 3 Grand Baroque Oil Painting Overmantel + Flanking Columns & Pediment
      addMesh(grp, g.cushion, stone, 1.98, 2.55, 0.55, 0, 3.12, -0.04);
      addMesh(grp, g.cushion, trim, 1.56, 1.88, 0.09, 0, 2.98, 0.26);
      addMesh(grp, g.box1, rustic ? palette.mirror : palette.artCanvases[0], 1.34, 1.66, 0.1, 0, 2.98, 0.27);
      if (!rustic) {
        addMesh(grp, g.sphere1, trim, 0.28, 0.26, 0.12, 0, 3.98, 0.27);
      }
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildKitchenCounter(interactId, rustic) {
      const grp = new THREE.Group();
      if (rustic) {
        addMesh(grp, g.cushion, palette.oak, 3.2, 0.88, 0.88, 0, 0.44, 0);
        addMesh(grp, g.cushion, palette.linen, 3.28, 0.08, 0.94, 0, 0.9, 0);
        addMesh(grp, g.cushion, palette.iron, 1.05, 0.92, 0.9, -0.8, 0.46, 0.02);
        addMesh(grp, g.cyl1, palette.brass, 0.42, 0.28, 0.42, -0.8, 1.08, 0);
        addMesh(grp, g.box1, palette.ember, 0.64, 0.32, 0.04, -0.8, 0.45, 0.47);
        addMesh(grp, g.box1, palette.silver, 0.62, 0.04, 0.48, 0.58, 0.945, 0);
        addMesh(grp, g.cyl1, palette.silver, 0.04, 0.22, 0.04, 0.58, 1.05, -0.2);
        addMesh(grp, g.box1, palette.silver, 0.04, 0.04, 0.14, 0.58, 1.15, -0.14);
        addMesh(grp, g.vaseUrn, palette.gold, 0.85, 0.85, 0.85, 1.25, 0.94, -0.05);
        addMesh(grp, g.box1, palette.silver, 1.16, 0.58, 0.66, -0.8, 2.24, -0.06);
        addMesh(grp, g.box1, palette.silver, 0.48, 0.82, 0.46, -0.8, 2.86, -0.16);
        addMesh(grp, g.cushion, palette.oak, 1.65, 0.85, 0.44, 0.72, 2.38, -0.22);
        addMesh(grp, g.box1, palette.iron, 0.04, 0.76, 0.04, 0.72, 2.38, 0.01);
      } else {
        // Image 1 Monumental Baroque Mahogany Hearth, Ivory Range Hood & Illuminated China Cabinets
        // Lower Mahogany Cabinetry + Veined Cream/Gold Marble Slab
        addMesh(grp, g.cushion, palette.mahoganyPanel, 4.2, 0.88, 0.92, 0, 0.44, 0);
        addMesh(grp, g.cushion, palette.veinedKitchenMarble, 4.3, 0.08, 0.98, 0, 0.9, 0);
        // Wide Pro Stainless 8-Burner Range with Signature Red Knobs & Dual Ovens (center-left)
        addMesh(grp, g.cushion, palette.silver, 1.85, 0.92, 0.94, -0.35, 0.46, 0.03);
        addMesh(grp, g.box1, palette.iron, 1.72, 0.06, 0.8, -0.35, 0.94, 0.02);
        [-0.92, -0.54, -0.16, 0.22].forEach(function (bx) {
          addMesh(grp, g.cyl1, palette.iron, 0.24, 0.05, 0.24, bx, 0.98, 0.04);
          addMesh(grp, g.cyl1, palette.fabricColors.crimson, 0.065, 0.05, 0.065, bx, 0.84, 0.51, Math.PI * 0.5, 0, 0);
        });
        addMesh(grp, g.box1, palette.ember, 0.7, 0.34, 0.04, -0.78, 0.44, 0.50);
        addMesh(grp, g.box1, palette.ember, 0.7, 0.34, 0.04, 0.08, 0.44, 0.50);
        // Sculpted Travertine Tile Range Backsplash & Brass Pot Filler Arm
        addMesh(grp, g.cushion, palette.linen, 1.85, 1.12, 0.08, -0.35, 1.48, -0.4);
        addMesh(grp, g.cyl1, palette.brass, 0.04, 0.38, 0.04, -0.35, 1.46, -0.26, Math.PI * 0.5, 0, 0);
        // Monumental Carved Ivory Baroque Range Hood + Gold Medallion Crest
        addMesh(grp, g.cushion, palette.ivory, 2.08, 0.44, 0.82, -0.35, 2.22, -0.06);
        addMesh(grp, g.cushion, palette.ivory, 1.56, 0.78, 0.66, -0.35, 2.78, -0.14);
        addMesh(grp, g.cushion, palette.gold, 1.78, 0.1, 0.72, -0.35, 3.18, -0.12);
        addMesh(grp, g.sphere1, palette.gold, 0.52, 0.42, 0.14, -0.35, 2.72, 0.21);
        // Right Apron Farm Sink & Flanking Illuminated Glass-Front China Cabinets
        addMesh(grp, g.box1, palette.silver, 0.68, 0.04, 0.5, 1.38, 0.945, 0.02);
        addMesh(grp, g.cyl1, palette.gold, 0.04, 0.25, 0.04, 1.38, 1.07, -0.2);
        addMesh(grp, g.box1, palette.gold, 0.04, 0.04, 0.16, 1.38, 1.18, -0.13);
        [-1.68, 1.38].forEach(function (cx) {
          addMesh(grp, g.cushion, palette.mahogany, 1.05, 1.65, 0.48, cx, 2.38, -0.22);
          addMesh(grp, g.box1, palette.warmCoveGlow, 0.84, 1.12, 0.06, cx, 2.36, -0.12);
          addMesh(grp, g.box1, palette.crystal, 0.88, 1.24, 0.06, cx, 2.36, 0.02);
          [2.04, 2.42].forEach(function (sy) {
            addMesh(grp, g.cyl1, palette.porcelain, 0.26, 0.06, 0.26, cx - 0.18, sy, -0.06);
            addMesh(grp, g.vaseUrn, palette.gold, 0.35, 0.35, 0.35, cx + 0.18, sy - 0.03, -0.06);
          });
        });
      }
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildChandelier(scale, grand) {
      const s = scale || 1;
      const grp = new THREE.Group();
      const rings = grand ? 10 : 6;
      addMesh(grp, g.cyl1, palette.ivory, 0.52 * s, 0.06 * s, 0.52 * s, 0, 0.96 * s, 0);
      addMesh(grp, g.cyl1, palette.gold, 0.09 * s, 1.05 * s, 0.09 * s, 0, 0.48 * s, 0);
      addMesh(grp, g.torus1, palette.gold, 1.75 * s, 1.75 * s, 0.45 * s, 0, 0, 0, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.torus1, palette.gold, 1.12 * s, 1.12 * s, 0.36 * s, 0, 0.28 * s, 0, Math.PI * 0.5, 0, 0);
      if (grand) {
        addMesh(grp, g.torus1, palette.crystal, 1.38 * s, 1.38 * s, 0.28 * s, 0, -0.16 * s, 0, Math.PI * 0.5, 0, 0);
      }
      for (let i = 0; i < rings; i++) {
        const a = (i / rings) * Math.PI * 2;
        const cx = Math.cos(a) * 0.88 * s;
        const cz = Math.sin(a) * 0.88 * s;
        addMesh(grp, g.cyl1, palette.porcelain, 0.055 * s, 0.18 * s, 0.055 * s, cx, 0.12 * s, cz);
        addMesh(grp, g.sphere1, palette.warmBulb, 0.09 * s, 0.13 * s, 0.09 * s, cx, 0.24 * s, cz);
        addMesh(grp, g.cone1, palette.crystal, 0.08 * s, 0.24 * s, 0.08 * s, cx * 0.92, -0.14 * s, cz * 0.92, Math.PI, 0, 0);
      }
      addMesh(grp, g.sphere1, palette.crystal, 0.28 * s, 0.38 * s, 0.28 * s, 0, -0.26 * s, 0);
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      return grp;
    }

    function buildKitchenIsland() {
      const grp = new THREE.Group();
      // Image 1 Oversized Carved Mahogany Island, Fluted Corner Columns, Veined Marble Top & 4 Tufted Barstools
      addMesh(grp, g.cushion, palette.mahoganyPanel, 2.85, 0.88, 1.24, 0, 0.44, 0);
      [[-1.34, -0.56], [1.34, -0.56], [-1.34, 0.56], [1.34, 0.56]].forEach(function (cp) {
        addMesh(grp, g.cyl1, palette.mahogany, 0.18, 0.9, 0.18, cp[0], 0.45, cp[1]);
        addMesh(grp, g.box1, palette.gold, 0.22, 0.08, 0.22, cp[0], 0.84, cp[1]);
      });
      addMesh(grp, g.cushion, palette.veinedKitchenMarble, 3.04, 0.1, 1.44, 0, 0.93, 0);
      // Lush Floral Brass Centerpiece & Twin Warm Table Lanterns
      addMesh(grp, g.vaseUrn, palette.gold, 1.15, 1.05, 1.15, 0, 0.98, 0);
      addMesh(grp, g.sphere1, palette.foliageLight, 0.48, 0.34, 0.48, 0, 1.38, 0);
      addMesh(grp, g.sphere1, palette.fabricColors.rose, 0.28, 0.24, 0.28, -0.14, 1.48, 0.08);
      addMesh(grp, g.sphere1, palette.porcelain, 0.28, 0.22, 0.28, 0.14, 1.5, -0.06);
      [-0.65, 0.65].forEach(function (lx) {
        addMesh(grp, g.box1, palette.gold, 0.16, 0.26, 0.16, lx, 1.11, 0.05);
        addMesh(grp, g.sphere1, palette.warmBulb, 0.09, 0.12, 0.09, lx, 1.11, 0.05);
      });
      // Undermount prep sink on West side
      addMesh(grp, g.box1, palette.silver, 0.46, 0.04, 0.36, -1.05, 0.985, 0);
      addMesh(grp, g.cyl1, palette.brass, 0.035, 0.22, 0.035, -1.05, 1.09, -0.15);
      // 4 Cream Tufted Barstools neatly tucked along South front overhang (+Z side)
      [-1.02, -0.34, 0.34, 1.02].forEach(function (sx) {
        addMesh(grp, g.leg, palette.mahogany, 0.85, 0.56, 0.85, sx - 0.14, 0, 0.72);
        addMesh(grp, g.leg, palette.mahogany, 0.85, 0.56, 0.85, sx + 0.14, 0, 0.72);
        addMesh(grp, g.cushion, palette.fabricColors.creamTufted, 0.42, 0.12, 0.42, sx, 0.62, 0.82);
        addMesh(grp, g.cushion, palette.fabricColors.creamTufted, 0.4, 0.34, 0.1, sx, 0.82, 0.98);
      });
      mergeStaticGroup(grp);
      return grp;
    }

    function buildPedestalPlant(isTall) {
      const grp = new THREE.Group();
      if (isTall) {
        addMesh(grp, g.cushion, palette.ivory, 0.52, 0.56, 0.52, 0, 0.28, 0);
        addMesh(grp, g.vaseUrn, palette.gold, 1.55, 1.25, 1.55, 0, 0.56, 0);
        // Sculpted Fanned Parlor Palm Fronds
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * Math.PI * 2;
          const frond = addMesh(grp, g.cone1, i % 2 === 0 ? palette.foliage : palette.foliageLight, 0.24, 1.25, 0.08, Math.cos(a) * 0.26, 1.48, Math.sin(a) * 0.26, 0.55, a, 0);
          frond.rotation.order = 'YXZ';
          frond.rotation.set(0.65, a, 0);
        }
        addMesh(grp, g.cone1, palette.foliageLight, 0.26, 1.35, 0.26, 0, 1.58, 0);
      } else {
        addMesh(grp, g.vaseUrn, palette.ivory, 1.4, 1.1, 1.4, 0, 0, 0);
        addMesh(grp, g.sphere1, palette.foliage, 0.62, 0.48, 0.62, 0, 0.52, 0);
      }
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    function buildGrandfatherClock() {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.mahogany, 0.68, 2.25, 0.46, 0, 1.12, 0);
      addMesh(grp, g.cushion, palette.gold, 0.76, 0.12, 0.54, 0, 2.28, 0);
      addMesh(grp, g.cyl1, palette.porcelain, 0.42, 0.06, 0.42, 0, 1.88, 0.23, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.box1, palette.gold, 0.26, 0.72, 0.06, 0, 1.12, 0.22);
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Articulated 3D Drivable Car (Convertible Royal Roadster or Suburban Sedan/SUV):
     * Rotating wheels, steerable front axle, seats, steering wheel, headlights & chrome trim.
     */
    function buildParkedCar(paintHex, isSuv, interactId, isConvertible) {
      const grp = new THREE.Group();
      const isAmb = paintHex === 'ambulance';
      const bodyMat = keepMat(new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(isAmb ? '#f7f9fc' : paintHex || 0xd6c7b8),
        roughness: 0.18,
        metalness: 0.45,
        clearcoat: 0.95,
      }));
      const seatMat = getStdMat(isConvertible ? 0x8e2c3e : 0x3b2c26, 0.65);
      const glassClear = keepMat(new THREE.MeshPhysicalMaterial({
        color: 0x3b5870,
        roughness: 0.06,
        metalness: 0.12,
        clearcoat: 1.0,
        transparent: true,
        opacity: isConvertible ? 0.38 : 0.34,
        depthWrite: false,
      }));
      const tailRed = getBasicMat(0xee3344);
      const headMat = getBasicMat(0xfff5d4);
      const carLen = isConvertible ? 4.0 : isSuv ? 4.18 : 4.0;
      const cabLen = isSuv ? 2.38 : 2.12;
      // Tall realistic greenhouse roof top (1.70m sedan, 1.82m SUV/Ambulance) so seated occupants stay cleanly INSIDE
      const roofPanelY = isSuv ? 1.82 : 1.70;
      const beltY = 0.78;
      const pillarH = roofPanelY - beltY;

      // Sculpted lower chassis, wheel arches & hood/trunk decks
      addMesh(grp, g.cushion, palette.iron, 1.84, 0.14, carLen + 0.08, 0, 0.24, 0);
      const lowerBody = addMesh(grp, g.cushion, bodyMat, 1.78, 0.44, carLen, 0, 0.52, 0);
      lowerBody.castShadow = true;
      // Hood & Trunk (kept forward/aft of central cockpit opening)
      addMesh(grp, g.cushion, bodyMat, 1.68, 0.18, 1.12, 0, 0.76, carLen * 0.35);
      addMesh(grp, g.cushion, bodyMat, 1.68, 0.18, 0.72, 0, 0.76, -carLen * 0.40);

      // Interior Floor, Twin Front Bucket Seats, 2-Person Rear Bench, Dashboard & Steering Wheel
      addMesh(grp, g.box1, palette.iron, 1.48, 0.08, 1.92, 0, 0.31, -0.26);
      [-0.36, 0.36].forEach(function (sx) {
        addMesh(grp, g.cushion, seatMat, 0.46, 0.14, 0.44, sx, 0.42, -0.14);
        addMesh(grp, g.cushion, seatMat, 0.44, 0.54, 0.12, sx, 0.70, -0.35, -0.16, 0, 0);
      });
      // Rear 2-seat quilted passenger bench
      addMesh(grp, g.cushion, seatMat, 1.32, 0.15, 0.46, 0, 0.41, -0.82);
      addMesh(grp, g.cushion, seatMat, 1.30, 0.52, 0.13, 0, 0.69, -1.04, -0.14, 0, 0);
      addMesh(grp, g.cushion, palette.mahogany, 1.44, 0.22, 0.32, 0, 0.78, 0.48);
      addMesh(grp, g.torus1, palette.gold, 0.3, 0.3, 0.16, -0.36, 0.90, 0.28, -0.45, 0, 0);

      if (isConvertible) {
        // Open-Top Luxury Roadster Raked Windshield Clearing Driver Crown
        addMesh(grp, g.box1, glassClear, 1.48, 0.66, 0.05, 0, 1.14, 0.66, -0.42, 0, 0);
        addMesh(grp, g.box1, palette.silver, 1.54, 0.06, 0.08, 0, 1.42, 0.50, -0.42, 0, 0);
      } else {
        // 4 Slim Pillars + Raised Solid Roof Panel + Translucent Front/Side/Rear Glass Wrap (hollow cabin interior!)
        const cabZ = -0.26;
        [
          [-0.72, cabZ + cabLen * 0.44, 0.24],
          [0.72, cabZ + cabLen * 0.44, 0.24],
          [-0.72, cabZ - cabLen * 0.46, -0.18],
          [0.72, cabZ - cabLen * 0.46, -0.18],
        ].forEach(function (pl) {
          addMesh(grp, g.box1, bodyMat, 0.09, pillarH, 0.12, pl[0], beltY + pillarH * 0.5, pl[1], pl[2], 0, 0);
        });
        // Solid Painted Car Roof Cap (bottom at roofPanelY - 0.05, top at roofPanelY + 0.05 -> 1.75..1.87m!)
        const roofCap = addMesh(grp, g.cushion, bodyMat, 1.54, 0.11, cabLen - 0.12, 0, roofPanelY, cabZ);
        roofCap.castShadow = true;
        // Translucent Front Windshield, Rear Glass, & Rear Quarter Windows (front door bays open cleanly!)
        const wf = addMesh(grp, g.box1, glassClear, 1.42, pillarH * 0.88, 0.04, 0, beltY + pillarH * 0.46, cabZ + cabLen * 0.42, -0.24, 0, 0);
        const wb = addMesh(grp, g.box1, glassClear, 1.42, pillarH * 0.84, 0.04, 0, beltY + pillarH * 0.46, cabZ - cabLen * 0.44, 0.18, 0, 0);
        const qLen = Math.max(0.38, cabLen * 0.44);
        const qZ = cabZ - cabLen * 0.22;
        const wL = addMesh(grp, g.box1, glassClear, 0.04, pillarH * 0.78, qLen, -0.74, beltY + pillarH * 0.46, qZ);
        const wR = addMesh(grp, g.box1, glassClear, 0.04, pillarH * 0.78, qLen, 0.74, beltY + pillarH * 0.46, qZ);
        wf.castShadow = false;
        wb.castShadow = false;
        wL.castShadow = false;
        wR.castShadow = false;

        if (isAmb) {
          const crossMat = palette.fabricColors.crimson;
          addMesh(grp, g.box1, crossMat, 0.06, 0.28, 0.1, -0.91, 0.56, -0.5);
          addMesh(grp, g.box1, crossMat, 0.06, 0.1, 0.28, -0.91, 0.56, -0.5);
          addMesh(grp, g.box1, crossMat, 0.06, 0.28, 0.1, 0.91, 0.56, -0.5);
          addMesh(grp, g.box1, crossMat, 0.06, 0.1, 0.28, 0.91, 0.56, -0.5);
          addMesh(grp, g.box1, tailRed, 0.42, 0.14, 0.22, -0.22, roofPanelY + 0.11, 0.15);
          addMesh(grp, g.box1, palette.fabricColors.sapphire, 0.42, 0.14, 0.22, 0.22, roofPanelY + 0.11, 0.15);
        }
      }

      // Articulated Swinging Left & Right Front Car Doors (open cleanly when entering, exiting, or toggling!)
      function buildCarDoorLeaf(sideSign) {
        const pivot = new THREE.Group();
        pivot.position.set(sideSign * 0.89, 0.34, 0.44);
        // Sculpted outer painted door skin
        addMesh(pivot, g.cushion, bodyMat, 0.07, 0.44, 0.96, 0, 0.22, -0.48);
        // Chrome door handle & trim strip
        addMesh(pivot, g.box1, palette.silver, 0.04, 0.05, 0.16, sideSign * 0.035, 0.34, -0.78);
        addMesh(pivot, g.box1, palette.silver, 0.02, 0.03, 0.86, sideSign * 0.03, 0.14, -0.48);
        // Interior leather door trim & armrest
        addMesh(pivot, g.box1, seatMat, 0.04, 0.32, 0.84, -sideSign * 0.03, 0.20, -0.48);
        if (!isConvertible) {
          // Upper framed window glass & B-pillar sash on sedan/SUV doors
          const winH = Math.max(0.42, pillarH * 0.78);
          addMesh(pivot, g.box1, bodyMat, 0.05, winH + 0.06, 0.06, -sideSign * 0.08, 0.44 + winH * 0.5, -0.92);
          addMesh(pivot, g.box1, bodyMat, 0.05, 0.05, 0.88, -sideSign * 0.08, 0.44 + winH + 0.02, -0.48);
          const dGlass = addMesh(pivot, g.box1, glassClear, 0.03, winH * 0.92, 0.82, -sideSign * 0.08, 0.44 + winH * 0.48, -0.48);
          dGlass.castShadow = false;
        }
        mergeStaticGroup(pivot);
        pivot.userData.noMerge = true;
        pivot.userData.noFreeze = true;
        return pivot;
      }
      const doorL = buildCarDoorLeaf(-1);
      const doorR = buildCarDoorLeaf(1);
      grp.add(doorL, doorR);

      // Chrome Grille, Headlights, Taillights & Gold License Plate
      addMesh(grp, g.cushion, palette.silver, 0.78, 0.22, 0.08, 0, 0.48, carLen * 0.5 + 0.02);
      addMesh(grp, g.box1, palette.gold, 0.38, 0.12, 0.04, 0, 0.34, -carLen * 0.5 - 0.03);
      const headlights = [];
      [-0.58, 0.58].forEach(function (lx) {
        const hl = addMesh(grp, g.sphere1, headMat, 0.22, 0.16, 0.12, lx, 0.55, carLen * 0.5 + 0.02);
        hl.userData.noMerge = true;
        headlights.push(hl);
        addMesh(grp, g.box1, tailRed, 0.28, 0.12, 0.08, lx, 0.55, -carLen * 0.5 - 0.02);
      });
      [-0.9, 0.9].forEach(function (mx) {
        addMesh(grp, g.cushion, bodyMat, 0.16, 0.1, 0.18, mx, 0.86, 0.46);
      });

      // 4 Articulated Steerable & Spinning Wheels [FL, FR, BL, BR]
      const wheels = [];
      const frontSteer = [];
      [1.16, -1.12].forEach(function (wz, zi) {
        [-0.84, 0.84].forEach(function (wx) {
          const steerPivot = new THREE.Group();
          steerPivot.userData.noMerge = true;
          steerPivot.position.set(wx, 0.31, wz);
          const wheelSpin = new THREE.Group();
          addMesh(wheelSpin, g.cyl1, palette.iron, 0.62, 0.23, 0.62, 0, 0, 0, 0, 0, Math.PI * 0.5);
          addMesh(wheelSpin, g.cyl1, palette.silver, 0.36, 0.25, 0.36, 0, 0, 0, 0, 0, Math.PI * 0.5);
          addMesh(wheelSpin, g.box1, palette.gold, 0.26, 0.27, 0.07, 0, 0, 0);
          mergeStaticGroup(wheelSpin);
          steerPivot.add(wheelSpin);
          grp.add(steerPivot);
          wheels.push(wheelSpin);
          if (zi === 0) frontSteer.push(steerPivot);
        });
      });

      grp.userData.wheels = wheels;
      grp.userData.frontSteer = frontSteer;
      grp.userData.headlights = headlights;
      grp.userData.carDoors = {
        left: doorL,
        right: doorR,
        openRatio: 0,
        manualOpen: false,
      };
      grp.userData.seatY = 0.44;
      grp.userData.seatX = -0.35;
      grp.userData.seatZ = -0.14;
      grp.userData.seats = {
        driver: { x: -0.35, y: 0.44, z: -0.14 },
        frontPass: { x: 0.35, y: 0.44, z: -0.14 },
        rearLeft: { x: -0.35, y: 0.42, z: -0.78 },
        rearRight: { x: 0.35, y: 0.42, z: -0.78 },
      };
      grp.userData.roofTopY = isConvertible ? 1.44 : roofPanelY + 0.05;

      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Articulated Swinging Entrance Doors (French double glazed doors or single architectural door)
     * Each pivot leaf is pre-merged cleanly and tagged noMerge/noFreeze for silky 60fps opening.
     */
    function buildHingedDoors(opts) {
      const o = opts || {};
      const width = o.width || 2.5;
      const height = o.height || 2.55;
      const count = o.count === 1 ? 1 : 2;
      const frameMat = o.frameMat || palette.ivory;
      const leafMat = o.leafMat || getStdMat(o.leafColor || 0xfaf2e4, 0.42, 0.06);
      const glassPanelMat = o.glassMat || palette.crystal;
      const handleMat = o.handleMat || palette.gold;
      const swingSign = o.inward ? -1 : 1;

      const grp = new THREE.Group();
      // Subtle low threshold & top frame casing
      const frameWrap = new THREE.Group();
      addMesh(frameWrap, g.box1, frameMat, width + 0.18, 0.06, 0.34, 0, 0.03, 0);
      addMesh(frameWrap, g.box1, frameMat, width + 0.22, 0.11, 0.36, 0, height + 0.05, 0);
      addMesh(frameWrap, g.box1, frameMat, 0.09, height, 0.34, -width * 0.5 - 0.04, height * 0.5, 0);
      addMesh(frameWrap, g.box1, frameMat, 0.09, height, 0.34, width * 0.5 + 0.04, height * 0.5, 0);
      if (o.transom) {
        addMesh(frameWrap, g.box1, frameMat, width + 0.14, 0.62, 0.24, 0, height + 0.38, 0);
        addMesh(frameWrap, g.box1, glassPanelMat, width - 0.16, 0.46, 0.12, 0, height + 0.38, 0);
        [-0.32, 0, 0.32].forEach(function (mx) {
          addMesh(frameWrap, g.box1, handleMat, 0.04, 0.44, 0.16, mx * width, height + 0.38, 0);
        });
      }
      mergeStaticGroup(frameWrap);
      grp.add(frameWrap);

      function makeLeaf(sideSign, leafW) {
        const pivot = new THREE.Group();
        pivot.position.set(sideSign * width * 0.5, 0.04, 0);
        const dir = -sideSign;
        // Door stiles, bottom kickplate & rails
        const kickH = height * 0.34;
        addMesh(pivot, g.box1, leafMat, leafW - 0.02, kickH, 0.07, dir * leafW * 0.5, kickH * 0.5, 0);
        addMesh(pivot, g.box1, frameMat, leafW * 0.72, kickH * 0.58, 0.09, dir * leafW * 0.5, kickH * 0.5, 0);
        // Side stiles + top rail framing clear pane glass
        addMesh(pivot, g.box1, leafMat, 0.11, height - kickH, 0.07, dir * 0.055, kickH + (height - kickH) * 0.5, 0);
        addMesh(pivot, g.box1, leafMat, 0.11, height - kickH, 0.07, dir * (leafW - 0.065), kickH + (height - kickH) * 0.5, 0);
        addMesh(pivot, g.box1, leafMat, leafW - 0.02, 0.16, 0.07, dir * leafW * 0.5, height - 0.08, 0);
        // Translucent glazed window pane & Parisian grid mullions
        const glassW = Math.max(0.24, leafW - 0.24);
        const glassH = Math.max(0.6, height - kickH - 0.24);
        const glassY = kickH + glassH * 0.5 + 0.03;
        addMesh(pivot, g.box1, glassPanelMat, glassW, glassH, 0.03, dir * leafW * 0.5, glassY, 0);
        addMesh(pivot, g.box1, leafMat, glassW, 0.035, 0.05, dir * leafW * 0.5, glassY, 0);
        if (o.filigree) {
          addMesh(pivot, g.box1, handleMat, 0.03, glassH * 0.86, 0.05, dir * leafW * 0.5, glassY, 0);
        }
        // Brass Push/Pull Handles on Exterior & Interior
        const handleX = dir * (leafW - 0.16);
        addMesh(pivot, g.cyl1, handleMat, 0.032, 0.34, 0.032, handleX, 1.02, 0.06);
        addMesh(pivot, g.cyl1, handleMat, 0.032, 0.34, 0.032, handleX, 1.02, -0.06);
        mergeStaticGroup(pivot);
        pivot.userData.noMerge = true;
        pivot.userData.noFreeze = true;
        return pivot;
      }

      const leafW = count === 2 ? width * 0.5 : width;
      const leftPivot = makeLeaf(-1, leafW);
      grp.add(leftPivot);
      let rightPivot = null;
      if (count === 2) {
        rightPivot = makeLeaf(1, leafW);
        grp.add(rightPivot);
      }

      return {
        group: grp,
        leftPivot: leftPivot,
        rightPivot: rightPivot,
        maxAngle: (o.maxAngle || 1.42) * swingSign,
      };
    }

    /**
     * Living Articulated 3D Royal Horse:
     * Exposed pivot hierarchy for leg trotting/cantering, grazing/nodding neck+head,
     * twitching ears, swishing tail, bridle & royal saddle.
     */
    function buildHorse(coatHex, maneHex, interactId) {
      const grp = new THREE.Group();
      const coatMat = getStdMat(coatHex || 0x7b482c, 0.48, 0.06);
      const maneMat = getStdMat(maneHex || 0x261a14, 0.78);
      const leatherMat = getStdMat(0x3b2016, 0.52);
      const hoofMat = palette.iron;
      const eyeMat = palette.iron;

      // Barrel Torso & Sculpted Shoulders/Haunches
      const barrel = addMesh(grp, g.capsule1, coatMat, 0.66, 0.84, 0.66, 0, 1.18, 0, Math.PI * 0.5, 0, 0);
      barrel.castShadow = true;
      addMesh(grp, g.sphere1, coatMat, 0.68, 0.66, 0.66, 0, 1.2, -0.45);
      addMesh(grp, g.sphere1, coatMat, 0.66, 0.68, 0.64, 0, 1.22, 0.45);

      // Velvet Saddle Cloth & Sculpted Riding Saddle
      addMesh(grp, g.cushion, palette.fabricColors.crimson, 0.74, 0.12, 0.56, 0, 1.48, -0.02);
      addMesh(grp, g.cushion, leatherMat, 0.56, 0.12, 0.48, 0, 1.54, 0);
      addMesh(grp, g.cushion, palette.gold, 0.46, 0.08, 0.12, 0, 1.61, 0.18);
      addMesh(grp, g.cushion, palette.gold, 0.48, 0.08, 0.12, 0, 1.6, -0.2);

      // Articulated Head & Neck Pivot (for grazing, nodding & spirited tossing)
      const headPivot = new THREE.Group();
      headPivot.userData.noMerge = true;
      headPivot.position.set(0, 1.32, 0.56);
      grp.add(headPivot);

      const neckMesh = addMesh(headPivot, g.capsule1, coatMat, 0.34, 0.62, 0.38, 0, 0.24, 0.16, 0.55, 0, 0);
      neckMesh.castShadow = true;
      addMesh(headPivot, g.cushion, maneMat, 0.1, 0.58, 0.16, 0, 0.36, 0.02, 0.52, 0, 0);
      addMesh(headPivot, g.capsule1, coatMat, 0.26, 0.36, 0.26, 0, 0.52, 0.46, 1.18, 0, 0);
      addMesh(headPivot, g.sphere1, coatMat, 0.21, 0.19, 0.22, 0, 0.4, 0.66);

      // Living Glossy Eyes + Leather Bridle & Brass Bit
      [-0.1, 0.1].forEach(function (ex) {
        addMesh(headPivot, g.sphere1, eyeMat, 0.048, 0.055, 0.048, ex, 0.56, 0.48);
        addMesh(headPivot, g.sphere1, palette.gold, 0.036, 0.036, 0.036, ex * 1.04, 0.42, 0.62);
      });
      addMesh(headPivot, g.torus1, leatherMat, 0.22, 0.22, 0.14, 0, 0.43, 0.62, 1.15, 0, 0);

      // Independent Ear Pivots
      const earL = new THREE.Group();
      earL.position.set(-0.08, 0.68, 0.36);
      addMesh(earL, g.cone1, coatMat, 0.07, 0.18, 0.07, 0, 0.07, 0, -0.2, 0, 0.18);
      headPivot.add(earL);

      const earR = new THREE.Group();
      earR.position.set(0.08, 0.68, 0.36);
      addMesh(earR, g.cone1, coatMat, 0.07, 0.18, 0.07, 0, 0.07, 0, -0.2, 0, -0.18);
      headPivot.add(earR);

      // Articulated Swishing Tail Pivot
      const tailPivot = new THREE.Group();
      tailPivot.userData.noMerge = true;
      tailPivot.position.set(0, 1.3, -0.74);
      addMesh(tailPivot, g.cone1, maneMat, 0.16, 0.82, 0.16, 0, -0.36, -0.1, -0.26, 0, 0);
      grp.add(tailPivot);

      // 4 Independent Articulated Leg Pivots [FL, FR, BL, BR]
      const legs = [];
      [
        [-0.2, 0.46],
        [0.2, 0.46],
        [-0.2, -0.48],
        [0.2, -0.48],
      ].forEach(function (pt) {
        const legPivot = new THREE.Group();
        legPivot.userData.noMerge = true;
        legPivot.position.set(pt[0], 0.98, pt[1]);
        addMesh(legPivot, g.cyl1, coatMat, 0.13, 0.9, 0.13, 0, -0.46, 0);
        addMesh(legPivot, g.cyl1, hoofMat, 0.145, 0.1, 0.145, 0, -0.92, 0);
        mergeStaticGroup(legPivot);
        grp.add(legPivot);
        legs.push(legPivot);
      });

      grp.userData.rig = {
        headPivot: headPivot,
        tailPivot: tailPivot,
        earL: earL,
        earR: earR,
        legs: legs,
      };

      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Sims-4 Lounge TV Console & Wall-Mounted Flatscreen (live color-animated screen!).
     */
    function buildWallTVConsole(rustic, interactId) {
      const grp = new THREE.Group();
      const wood = rustic ? palette.oak : palette.mahogany;
      const screenMat = keepMat(new THREE.MeshBasicMaterial({ color: 0x3b6088 }));
      addMesh(grp, g.cushion, wood, 1.9, 0.52, 0.48, 0, 0.26, 0);
      addMesh(grp, g.box1, palette.iron, 1.48, 0.88, 0.08, 0, 1.06, -0.04);
      const scr = addMesh(grp, g.box1, screenMat, 1.38, 0.78, 0.09, 0, 1.06, -0.03);
      scr.castShadow = false;
      scr.userData.noMerge = true;
      grp.userData.tvScreen = scr;
      grp.userData.tvMat = screenMat;
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Bakery Glass Pastry Vitrine Counter filled with Golden Croissants, Macarons & Cakes.
     */
    function buildBakeryShowcase(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.ivory, 2.8, 0.88, 0.9, 0, 0.44, 0);
      addMesh(grp, g.box1, palette.crystal, 2.65, 0.56, 0.78, 0, 1.16, 0);
      addMesh(grp, g.cushion, palette.gold, 2.74, 0.06, 0.84, 0, 1.45, 0);
      [-0.85, 0, 0.85].forEach(function (px, pi) {
        addMesh(grp, g.cyl1, palette.gold, 0.45, 0.04, 0.45, px, 0.92, 0);
        const treatMat = [palette.fabricColors.champagne, palette.fabricColors.rose, palette.creamSilk][pi];
        addMesh(grp, g.cyl1, treatMat, 0.34, 0.22, 0.34, px, 1.04, 0);
        addMesh(grp, g.sphere1, palette.fabricColors.crimson, 0.1, 0.1, 0.1, px, 1.2, 0);
      });
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Poolside Teak Diving Board, Brass Pool Ladder & Floating Flamingo/Pastel Swim Ring.
     */
    function buildPoolExtras() {
      const grp = new THREE.Group();
      // Diving Board (+Z south end pointing over turquoise pool water)
      addMesh(grp, g.cushion, palette.gold, 0.66, 0.25, 0.5, 0, 0.34, 4.35);
      addMesh(grp, g.cushion, palette.ivory, 0.58, 0.07, 1.95, 0, 0.48, 3.65);
      // Floating pastel pool ring gently drifting inside pool
      const floatRing = addMesh(grp, g.torus1, palette.fabricColors.rose, 1.15, 1.15, 0.85, -2.4, 0.29, 0.8, Math.PI * 0.5, 0, 0);
      floatRing.userData.noMerge = true;
      grp.userData.floatRing = floatRing;
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
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
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Sims-4 Multi-Part Pitched Gable Roof with Overhanging Cream Eaves,
     * Chimney, Optional Dormer Window & Optional Collegiate Clock Bell Cupola.
     */
    function buildGableRoof(w, d, pitchH, roofMat, trimMat, opts) {
      const grp = new THREE.Group();
      const o = opts || {};
      const overhang = 0.65;
      const hw = w * 0.5 + overhang;
      const hd = d * 0.5 + overhang;
      const ph = pitchH || 2.1;

      const shape = new THREE.Shape();
      shape.moveTo(-hw, 0);
      shape.lineTo(0, ph);
      shape.lineTo(hw, 0);
      shape.closePath();

      const gableGeo = keepGeo(new THREE.ExtrudeGeometry(shape, { depth: hd * 2, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 1 }));
      gableGeo.translate(0, 0, -hd);
      const roofMesh = new THREE.Mesh(gableGeo, roofMat || palette.oak);
      roofMesh.castShadow = true;
      roofMesh.receiveShadow = true;
      grp.add(roofMesh);

      // Eave soffit fascia trim along left/right edges
      [-hw + 0.05, hw - 0.05].forEach(function (ex) {
        addMesh(grp, g.box1, trimMat || palette.ivory, 0.14, 0.16, hd * 2 + 0.08, ex, -0.02, 0);
      });

      // Brick Chimney with smoking flue cap
      if (o.chimney !== false) {
        const brickMat = getStdMat(0x9b4b3c, 0.82);
        addMesh(grp, g.box1, brickMat, 0.62, ph + 1.05, 0.62, -w * 0.28, (ph + 0.9) * 0.5, -d * 0.18);
        addMesh(grp, g.box1, palette.ivory, 0.74, 0.14, 0.74, -w * 0.28, ph + 1.04, -d * 0.18);
      }

      // Dormer Window (front roof slope accent)
      if (o.dormer) {
        addMesh(grp, g.box1, trimMat || palette.ivory, 1.35, 1.05, 1.4, 0, ph * 0.44, d * 0.34);
        addMesh(grp, g.box1, palette.crystal, 0.85, 0.68, 0.12, 0, ph * 0.46, d * 0.34 + 0.66);
        addMesh(grp, g.cone1, roofMat || palette.oak, 1.15, 0.72, 1.15, 0, ph * 0.44 + 0.86, d * 0.34, 0, Math.PI * 0.25, 0);
      }

      // Collegiate Bell & Clock Cupola Tower (High School & University centerpiece!)
      if (o.cupola) {
        addMesh(grp, g.box1, trimMat || palette.ivory, 2.3, 1.9, 2.3, 0, ph + 0.75, 0);
        addMesh(grp, g.box1, palette.crystal, 1.45, 1.15, 2.36, 0, ph + 0.85, 0);
        addMesh(grp, g.cyl1, palette.gold, 1.3, 0.42, 1.3, 0, ph + 1.92, 0);
        addMesh(grp, g.cone1, roofMat || palette.oak, 2.1, 1.65, 2.1, 0, ph + 2.88, 0);
        addMesh(grp, g.sphere1, palette.gold, 0.32, 0.32, 0.32, 0, ph + 3.8, 0);
      }
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Sims-4 Front Veranda Porch: Deck, Steps, Timber Columns, Balusters & Lantern.
     */
    function buildFrontPorch(w, d, trimMat) {
      const grp = new THREE.Group();
      const tMat = trimMat || palette.ivory;
      const deckMat = getStdMat(0xb99a74, 0.78);
      addMesh(grp, g.box1, deckMat, w, 0.16, d, 0, 0.08, 0);
      addMesh(grp, g.box1, deckMat, 2.5, 0.08, 0.55, 0, 0.04, d * 0.5 + 0.27);
      // Canopy porch roof
      addMesh(grp, g.box1, tMat, w + 0.3, 0.16, d + 0.3, 0, 2.86, 0);
      addMesh(grp, g.cone1, palette.oak, w * 0.68, 0.9, d * 0.68, 0, 3.35, 0, 0, Math.PI * 0.25, 0);
      // Slender turned columns & safety railings on flanks
      const postXs = [-w * 0.44, -1.45, 1.45, w * 0.44];
      postXs.forEach(function (px) {
        addMesh(grp, g.cyl1, tMat, 0.16, 2.7, 0.16, px, 1.42, d * 0.42);
      });
      // Left & Right railings leaving central entry stairs clear
      if (w > 4.2) {
        const railW = (w * 0.44) - 1.5;
        [-1, 1].forEach(function (side) {
          addMesh(grp, g.box1, tMat, railW, 0.08, 0.09, side * (1.45 + railW * 0.5), 0.95, d * 0.42);
          addMesh(grp, g.box1, tMat, railW, 0.55, 0.06, side * (1.45 + railW * 0.5), 0.55, d * 0.42);
        });
      }
      // Warm hanging porch lantern
      addMesh(grp, g.sphere1, palette.crystal, 0.22, 0.28, 0.22, 0, 2.65, d * 0.22);
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Multi-Pane Shuttered French Window + Blooming Floral Window Box.
     */
    function buildWindowBox(shuttersMat) {
      const grp = new THREE.Group();
      const sMat = shuttersMat || palette.fabricColors.sapphire;
      addMesh(grp, g.box1, palette.ivory, 1.45, 1.55, 0.12, 0, 0, 0);
      addMesh(grp, g.box1, palette.crystal, 1.15, 1.25, 0.14, 0, 0, 0.02);
      // Cross mullions
      addMesh(grp, g.box1, palette.ivory, 0.06, 1.28, 0.16, 0, 0, 0.03);
      addMesh(grp, g.box1, palette.ivory, 1.18, 0.06, 0.16, 0, 0.08, 0.03);
      // Left & right shutters
      addMesh(grp, g.box1, sMat, 0.38, 1.45, 0.09, -0.94, 0, 0.03);
      addMesh(grp, g.box1, sMat, 0.38, 1.45, 0.09, 0.94, 0, 0.03);
      // Flower planter box & pink blossoms
      addMesh(grp, g.box1, palette.oak, 1.38, 0.24, 0.28, 0, -0.82, 0.14);
      [-0.42, 0, 0.42].forEach(function (fx, fi) {
        addMesh(grp, g.sphere1, fi === 1 ? palette.fabricColors.champagne : palette.fabricColors.rose, 0.22, 0.2, 0.22, fx, -0.62, 0.16);
      });
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Royal Academy Student Desk & Upholstered Chair with Open Textbook & Inkwell.
     */
    function buildSchoolDeskSet(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.oak, 1.08, 0.08, 0.72, 0, 0.75, 0);
      [-0.44, 0.44].forEach(function (lx) {
        [-0.28, 0.28].forEach(function (lz) {
          addMesh(grp, g.leg, palette.iron, 0.9, 0.72, 0.9, lx, 0, lz);
        });
      });
      // Open Notebook & Gold Pen
      addMesh(grp, g.box1, palette.creamSilk, 0.42, 0.03, 0.3, -0.1, 0.8, 0);
      addMesh(grp, g.cyl1, palette.gold, 0.08, 0.08, 0.08, 0.28, 0.82, -0.14);
      // Tuck-behind Classroom Chair
      addMesh(grp, g.cushion, palette.fabricColors.sapphire, 0.52, 0.08, 0.48, 0, 0.46, 0.66);
      addMesh(grp, g.cushion, palette.fabricColors.sapphire, 0.5, 0.48, 0.08, 0, 0.74, 0.88);
      [-0.2, 0.2].forEach(function (cx) {
        [-0.18, 0.18].forEach(function (cz) {
          addMesh(grp, g.leg, palette.iron, 0.7, 0.44, 0.7, cx, 0, 0.66 + cz);
        });
      });
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Classroom Chalkboard, Teacher Podium & Brass Rotating Globe.
     */
    function buildChalkboardLectern(interactId) {
      const grp = new THREE.Group();
      const boardMat = getStdMat(0x244234, 0.72);
      addMesh(grp, g.box1, palette.oak, 3.8, 1.75, 0.12, 0, 1.65, -0.25);
      addMesh(grp, g.box1, boardMat, 3.5, 1.5, 0.14, 0, 1.65, -0.23);
      addMesh(grp, g.box1, palette.oak, 3.7, 0.1, 0.22, 0, 0.78, -0.18);
      // Lectern + Spinning Brass Globe beside it
      addMesh(grp, g.cushion, palette.mahogany, 0.95, 1.12, 0.66, 0.2, 0.56, 0.8);
      addMesh(grp, g.cyl1, palette.gold, 0.22, 0.36, 0.22, -1.25, 0.62, 0.75);
      addMesh(grp, g.sphere1, palette.fabricColors.sapphire, 0.36, 0.36, 0.36, -1.25, 0.95, 0.75);
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * High-School Locker Row (5 Collegiate Crimson & Gold Lockers).
     */
    function buildSchoolLockers(interactId) {
      const grp = new THREE.Group();
      const lockMat = getStdMat(0x38587a, 0.42, 0.32);
      for (let i = 0; i < 5; i++) {
        const lx = -1.32 + i * 0.66;
        addMesh(grp, g.box1, lockMat, 0.62, 2.05, 0.52, lx, 1.025, 0);
        addMesh(grp, g.box1, palette.gold, 0.06, 0.16, 0.06, lx + 0.18, 1.08, 0.27);
        addMesh(grp, g.box1, palette.ivory, 0.38, 0.08, 0.04, lx, 1.75, 0.27);
      }
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * University Debate & Law Podium with Golden Crest Seal.
     */
    function buildDebatePodium(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.mahogany, 1.1, 1.15, 0.75, 0, 0.58, 0);
      addMesh(grp, g.cushion, palette.gold, 1.18, 0.08, 0.82, 0, 1.16, 0);
      addMesh(grp, g.cyl1, palette.gold, 0.38, 0.06, 0.38, 0, 0.65, 0.39, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.cyl1, palette.silver, 0.03, 0.28, 0.03, -0.18, 1.28, -0.1);
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Octagonal Ivory & Gold Town Square Park Pergola Gazebo.
     */
    function buildGazebo(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.cyl1, palette.ivory, 6.2, 0.34, 6.2, 0, 0.17, 0);
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2;
        addMesh(grp, g.cyl1, palette.ivory, 0.22, 3.0, 0.22, Math.cos(ang) * 2.55, 1.7, Math.sin(ang) * 2.55);
      }
      const gazRoof = addMesh(grp, g.cone1, palette.fabricColors.sapphire, 6.8, 1.9, 6.8, 0, 4.15, 0);
      gazRoof.castShadow = true;
      addMesh(grp, g.sphere1, palette.gold, 0.38, 0.48, 0.38, 0, 5.2, 0);
      // Curved interior benches
      [-1.55, 1.55].forEach(function (bx) {
        addMesh(grp, g.cushion, palette.oak, 0.58, 0.45, 2.2, bx, 0.56, 0);
      });
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Riviera Beach Striped Umbrella & Lounger Set.
     */
    function buildBeachUmbrellaSet(toneName, interactId) {
      const grp = new THREE.Group();
      const pad = palette.fabricColors[toneName || 'rose'] || palette.fabricColors.rose;
      addMesh(grp, g.cyl1, palette.oak, 0.08, 2.5, 0.08, 0.85, 1.25, -0.25);
      addMesh(grp, g.cone1, pad, 2.5, 0.72, 2.5, 0.85, 2.48, -0.25);
      addMesh(grp, g.cushion, palette.ivory, 0.82, 0.14, 1.95, -0.25, 0.12, 0);
      addMesh(grp, g.cushion, pad, 0.78, 0.1, 0.68, -0.25, 0.32, -0.62, 0.45, 0, 0);
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Moored Royal Riviera Yacht at Coastal Pier.
     */
    function buildRoyalYacht(interactId) {
      const grp = new THREE.Group();
      const deckMat = getStdMat(0xb07c4a, 0.62);
      const hull = addMesh(grp, g.cushion, palette.ivory, 3.6, 1.4, 12.2, 0, 0.65, 0);
      hull.castShadow = true;
      addMesh(grp, g.cone1, palette.ivory, 3.5, 3.6, 2.2, 0, 0.72, 7.6, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.cushion, deckMat, 3.2, 0.08, 10.6, 0, 1.36, -0.2);
      // Sleek Cabin & Tinted Bridge Glass
      addMesh(grp, g.cushion, palette.ivory, 2.5, 1.15, 5.2, 0, 1.95, 0.6);
      addMesh(grp, g.box1, palette.crystal, 2.56, 0.62, 4.4, 0, 2.02, 0.8);
      addMesh(grp, g.cushion, palette.gold, 2.6, 0.08, 5.3, 0, 2.54, 0.6);
      addMesh(grp, g.cyl1, palette.gold, 0.1, 2.8, 0.1, 0, 3.85, 1.1);
      mergeStaticGroup(grp);
      grp.userData.isYacht = true;
      grp.userData.noMerge = true;
      grp.userData.seatPos = { x: 0, y: 1.56, z: 1.25 };
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Classic Painted Riviera Cedar Rowboat with Twin Articulated Oars & Brass Oarlocks.
     */
    function buildRowboat(hullHex, interactId) {
      const grp = new THREE.Group();
      const paintMat = getStdMat(hullHex || '#f6f0e4', 0.44, 0.08);
      const oakMat = getStdMat(0x8e5d34, 0.62);
      const trimMat = palette.royalNavy || getStdMat(0x1f3654, 0.42, 0.12);

      // Slatted Floor & Curved Hull
      addMesh(grp, g.cushion, oakMat, 1.18, 0.14, 3.0, 0, 0.16, 0);
      addMesh(grp, g.cone1, paintMat, 1.15, 1.1, 0.72, 0, 0.28, 1.78, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.cone1, paintMat, 1.05, 0.85, 0.68, 0, 0.28, -1.7, -Math.PI * 0.5, 0, 0);
      [-0.56, 0.56].forEach(function (sx) {
        addMesh(grp, g.cushion, paintMat, 0.14, 0.44, 3.05, sx, 0.34, 0);
        addMesh(grp, g.box1, trimMat, 0.16, 0.07, 3.08, sx, 0.56, 0);
      });
      // Bow / Mid / Stern Rowing Benches
      [0.82, -0.06, -0.92].forEach(function (bz) {
        addMesh(grp, g.box1, oakMat, 1.02, 0.06, 0.34, 0, 0.40, bz);
      });
      mergeStaticGroup(grp);

      // Twin Pivotable Oars in Brass Oarlocks
      function makeOar(side) {
        const oarPivot = new THREE.Group();
        oarPivot.position.set(side * 0.60, 0.58, 0.12);
        const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.09, 6), palette.gold);
        lock.position.y = -0.02;
        oarPivot.add(lock);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.024, 1.85, 8), oakMat);
        shaft.rotation.z = side * Math.PI * 0.41;
        shaft.position.set(side * 0.56, -0.14, 0);
        oarPivot.add(shaft);
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.022, 0.14), trimMat);
        blade.rotation.z = side * Math.PI * 0.41;
        blade.position.set(side * 1.38, -0.36, 0);
        oarPivot.add(blade);
        grp.add(oarPivot);
        return oarPivot;
      }
      grp.userData.oarL = makeOar(-1);
      grp.userData.oarR = makeOar(1);
      grp.userData.isRowboat = true;
      grp.userData.noMerge = true;
      grp.userData.seatPos = { x: 0, y: 0.44, z: -0.06 };
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Sculpted Porcelain & Marble Clawfoot / Alcove / Pedestal Plinth Bathtub.
     */
    const _tubWaterCache = {};
    function buildBathtub(interactId, rustic, style) {
      const grp = new THREE.Group();
      const rimMat = rustic ? palette.silver : palette.gold;
      const isBaroque = !rustic && style === 'baroque';
      const isSlate = !rustic && style === 'slate';
      const bodyMat = isBaroque ? palette.creamMarble : (palette.porcelain || palette.ivory);
      const waterHex = rustic ? 0x9de6f2 : (isSlate ? 0xbef0f7 : 0xf4c8d8);
      const tubWaterMat = _tubWaterCache[waterHex] || (_tubWaterCache[waterHex] = keepMat(new THREE.MeshPhysicalMaterial({
        color: waterHex,
        roughness: 0.12,
        transparent: true,
        opacity: 0.8,
        clearcoat: 0.9,
      })));

      if (isBaroque) {
        // Image 5 Oval Veined Marble Clawfoot Tub Elevated on Rounded Stepped Marble Plinth
        addMesh(grp, g.cyl1, palette.creamMarble, 2.24, 0.16, 1.38, 0, 0.08, 0);
        addMesh(grp, g.cyl1, palette.gold, 2.28, 0.03, 1.42, 0, 0.16, 0);
        addMesh(grp, g.cyl1, bodyMat, 1.78, 0.56, 0.98, 0, 0.52, 0);
        addMesh(grp, g.torus1, palette.gold, 1.72, 0.94, 0.42, 0, 0.80, 0, Math.PI * 0.5, 0, 0);
        addMesh(grp, g.cyl1, tubWaterMat, 1.54, 0.06, 0.78, 0, 0.74, 0);
        [[-0.64, -0.34], [0.64, -0.34], [-0.64, 0.34], [0.64, 0.34]].forEach(function (ft) {
          addMesh(grp, g.sphere1, palette.gold, 0.14, 0.18, 0.14, ft[0], 0.22, ft[1]);
        });
        addMesh(grp, g.cyl1, palette.brass, 0.06, 0.88, 0.06, -0.96, 0.6, 0);
        addMesh(grp, g.box1, palette.brass, 0.22, 0.06, 0.06, -0.84, 1.02, 0);
      } else if (isSlate) {
        // Image 6 Deep Sculpted Modern Oval White Soaking Tub + Tall Floor-Mount Brass Filler
        addMesh(grp, g.cyl1, palette.porcelain, 1.74, 0.58, 0.96, 0, 0.3, 0);
        addMesh(grp, g.torus1, palette.porcelain, 1.7, 0.92, 0.4, 0, 0.59, 0, Math.PI * 0.5, 0, 0);
        addMesh(grp, g.cyl1, tubWaterMat, 1.52, 0.06, 0.76, 0, 0.54, 0);
        addMesh(grp, g.cyl1, palette.brass, 0.055, 0.86, 0.055, -0.88, 0.43, 0);
        addMesh(grp, g.box1, palette.brass, 0.2, 0.055, 0.055, -0.78, 0.84, 0);
      } else {
        addMesh(grp, g.cushion, bodyMat, 1.72, 0.56, 0.92, 0, 0.36, 0);
        addMesh(grp, g.box1, rimMat, 1.76, 0.08, 0.96, 0, 0.64, 0);
        addMesh(grp, g.box1, tubWaterMat, 1.48, 0.06, 0.72, 0, 0.59, 0);
        [[-0.72, -0.36], [0.72, -0.36], [-0.72, 0.36], [0.72, 0.36]].forEach(function (ft) {
          addMesh(grp, g.sphere1, rimMat, 0.1, 0.12, 0.1, ft[0], 0.08, ft[1]);
        });
        addMesh(grp, g.cyl1, rimMat, 0.06, 0.32, 0.06, -0.78, 0.78, 0);
        addMesh(grp, g.box1, rimMat, 0.18, 0.06, 0.06, -0.68, 0.9, 0);
      }
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Frameless Glass Walk-In Rain Shower Cubicle with Veined Marble Wall & Warm Backlit Shampoo Niches.
     */
    function buildShowerCubicle(interactId, rustic) {
      const grp = new THREE.Group();
      const metal = rustic ? palette.silver : palette.brass;
      addMesh(grp, g.box1, rustic ? palette.ivory : palette.creamMarble, 1.38, 0.12, 1.38, 0, 0.06, 0);
      if (!rustic) {
        // Image 6 Marble Splash Wall + 3 Warm Backlit Recessed Toiletry Niches + Bottles
        addMesh(grp, g.box1, palette.creamMarble, 1.32, 2.55, 0.08, 0, 1.34, -0.66);
        [1.0, 1.36, 1.72].forEach(function (ny, ni) {
          addMesh(grp, g.box1, palette.warmCoveGlow, 0.42, 0.24, 0.04, 0, ny, -0.61);
          [-0.1, 0.1].forEach(function (bx, bi) {
            const bCol = (ni + bi) % 2 === 0 ? palette.iron : palette.brass;
            addMesh(grp, g.cyl1, bCol, 0.06, 0.14, 0.06, bx, ny - 0.03, -0.58);
          });
        });
      } else {
        addMesh(grp, g.box1, palette.crystal, 1.28, 2.25, 0.06, 0, 1.24, -0.64);
      }
      addMesh(grp, g.box1, palette.crystal, 0.05, 2.45, 1.28, -0.65, 1.32, 0);
      addMesh(grp, g.box1, palette.crystal, 0.05, 2.45, 1.28, 0.65, 1.32, 0);
      addMesh(grp, g.box1, metal, 1.34, 0.06, 1.34, 0, 2.56, 0);
      addMesh(grp, g.cyl1, metal, 0.3, 0.06, 0.3, 0, 2.42, 0);
      addMesh(grp, g.cyl1, metal, 0.05, 1.7, 0.05, -0.54, 1.56, -0.54);
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Sub-Zero Twin Illuminated Glass-Door Pro Refrigerator (Palace) or Rustic Cottage Fridge.
     */
    function buildFridge(rustic) {
      const grp = new THREE.Group();
      if (rustic) {
        const bodyMat = getStdMat(0xe9ebe6, 0.28, 0.12);
        addMesh(grp, g.cushion, bodyMat, 0.98, 2.02, 0.78, 0, 1.01, 0);
        addMesh(grp, g.box1, palette.iron, 0.98, 0.04, 0.8, 0, 0.68, 0);
        addMesh(grp, g.box1, palette.iron, 0.04, 1.25, 0.8, 0, 1.34, 0);
        [-0.08, 0.08].forEach(function (hx) {
          addMesh(grp, g.cyl1, palette.silver, 0.03, 0.65, 0.03, hx, 1.35, 0.42);
        });
      } else {
        // Image 1 Twin Illuminated Glass-Door Sub-Zero Pro Refrigerator
        addMesh(grp, g.cushion, palette.mahoganyPanel, 1.68, 2.55, 0.84, 0, 1.28, 0);
        addMesh(grp, g.box1, palette.silver, 1.54, 0.34, 0.06, 0, 2.28, 0.41);
        addMesh(grp, g.box1, palette.warmCoveGlow, 1.44, 1.76, 0.06, 0, 1.06, 0.34);
        [-0.36, 0.36].forEach(function (dx) {
          addMesh(grp, g.box1, palette.crystal, 0.68, 1.74, 0.05, dx, 1.06, 0.42);
          addMesh(grp, g.cyl1, palette.silver, 0.035, 0.92, 0.035, dx + (dx < 0 ? 0.25 : -0.25), 1.08, 0.46);
          [0.54, 0.92, 1.32, 1.66].forEach(function (sy, si) {
            addMesh(grp, g.box1, palette.silver, 0.62, 0.03, 0.26, dx, sy, 0.26);
            [-0.16, 0.14].forEach(function (fx, fi) {
              const prodMat = [palette.fabricColors.crimson, palette.foliageLight, palette.fabricColors.champagne, palette.porcelain][(si + fi) % 4];
              addMesh(grp, g.sphere1, prodMat, 0.16, 0.14, 0.16, dx + fx, sy + 0.09, 0.3);
            });
          });
        });
      }
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Carved Living Room Cocktail Coffee Table (Image 3 Portoro Black-and-Gold Veined Marble Option).
     */
    function buildCoffeeTable(rustic, grand) {
      const grp = new THREE.Group();
      if (rustic) {
        addMesh(grp, g.cushion, palette.oak, 1.38, 0.08, 0.78, 0, 0.45, 0);
        [[-0.56, -0.3], [0.56, -0.3], [-0.56, 0.3], [0.56, 0.3]].forEach(function (pt) {
          addMesh(grp, g.cyl1, palette.ivory, 0.06, 0.42, 0.06, pt[0], 0.21, pt[1]);
        });
      } else {
        const tw = grand ? 1.95 : 1.48;
        const td = grand ? 1.18 : 0.88;
        addMesh(grp, g.cushion, palette.portoroMarble, tw, 0.08, td, 0, 0.48, 0);
        addMesh(grp, g.cushion, palette.gold, tw + 0.06, 0.06, td + 0.06, 0, 0.43, 0);
        [[-tw * 0.42, -td * 0.38], [tw * 0.42, -td * 0.38], [-tw * 0.42, td * 0.38], [tw * 0.42, td * 0.38]].forEach(function (pt) {
          addMesh(grp, g.leg, palette.gold, 1.35, 0.42, 1.35, pt[0], 0, pt[1]);
        });
        // Gold Floral Centerpiece Urn + Art Books + Crystal Votives
        addMesh(grp, g.vaseUrn, palette.gold, 0.95, 0.95, 0.95, 0, 0.52, 0);
        addMesh(grp, g.sphere1, palette.foliageLight, 0.42, 0.28, 0.42, 0, 0.88, 0);
        addMesh(grp, g.sphere1, palette.porcelain, 0.28, 0.22, 0.28, -0.1, 0.96, 0.06);
        addMesh(grp, g.sphere1, palette.fabricColors.rose, 0.24, 0.2, 0.24, 0.12, 0.96, -0.05);
        addMesh(grp, g.box1, palette.fabricColors.crimson, 0.36, 0.06, 0.26, -tw * 0.28, 0.55, 0.14);
        addMesh(grp, g.box1, palette.gold, 0.32, 0.05, 0.24, -tw * 0.28, 0.60, 0.14);
        addMesh(grp, g.cyl1, palette.crystal, 0.11, 0.18, 0.11, tw * 0.28, 0.61, -0.1);
      }
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Woven Sims-4 Area Rug with Contrasting Border Trim.
     */
    function buildRug(w, d, toneName) {
      const grp = new THREE.Group();
      const base = palette.fabricColors[toneName || 'champagne'] || palette.fabricColors.champagne;
      addMesh(grp, g.box1, palette.ivory, w, 0.024, d, 0, 0.012, 0);
      addMesh(grp, g.box1, base, w * 0.86, 0.028, d * 0.84, 0, 0.014, 0);
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Open Colonnade Royal Auto Pavilion (protects Royal Fleet Cars beside the Château).
     */
    function buildAutoPavilion(w, d) {
      const grp = new THREE.Group();
      const roof = palette.slate || getStdMat(0x3b4858, 0.62);
      addMesh(grp, g.box1, palette.ivory, w, 0.14, d, 0, 0.07, 0);
      [
        [-w * 0.44, -d * 0.44],
        [w * 0.44, -d * 0.44],
        [-w * 0.44, d * 0.44],
        [w * 0.44, d * 0.44],
      ].forEach(function (p) {
        addMesh(grp, g.cyl1, palette.ivory, 0.28, 3.2, 0.28, p[0], 1.74, p[1]);
        addMesh(grp, g.box1, palette.gold, 0.42, 0.14, 0.42, p[0], 3.3, p[1]);
      });
      addMesh(grp, g.box1, palette.ivory, w + 0.5, 0.28, d + 0.5, 0, 3.48, 0);
      const rMesh = addMesh(grp, g.box1, roof, w + 0.2, 0.45, d + 0.2, 0, 3.82, 0);
      rMesh.castShadow = true;
      addMesh(grp, g.box1, palette.gold, w + 0.55, 0.08, d + 0.55, 0, 3.62, 0);
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Hospital Clinic Bed with Hollow Blanket Dome (patient lies cleanly INSIDE),
     * IV Drip Pole, Privacy Curtain Rail Option & Heart-Rate Telemetry Monitor.
     */
    let _dripFluidMat = null;
    function buildHospitalBed(interactId) {
      const grp = new THREE.Group();
      const railMat = palette.silver;
      const blanket = palette.fabricColors.sapphire;
      if (!_dripFluidMat) _dripFluidMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xb9ecff, roughness: 0.18, transparent: true, opacity: 0.72 }));

      // Bed frame & Mattress (top at y = 0.58)
      addMesh(grp, g.box1, railMat, 1.18, 0.14, 2.22, 0, 0.42, 0);
      addMesh(grp, g.cushion, palette.ivory, 1.08, 0.20, 2.12, 0, 0.48, 0);

      // Hollow Hospital Blanket Dome (open chest tunnel z < -0.26 so sleeper enters blankets cleanly!)
      const hospDuvet = new THREE.Mesh(getHollowDuvet(1.14, 0.42, 1.38), blanket);
      hospDuvet.position.set(0, 0.56, 0.34);
      grp.add(hospDuvet);
      const hospCuff = new THREE.Mesh(getHollowDuvet(1.15, 0.425, 0.15), palette.porcelain);
      hospCuff.position.set(0, 0.56, -0.35);
      grp.add(hospCuff);

      // Plump Hospital Pillow
      addMesh(grp, g.pillow, palette.porcelain, 0.76, 0.13, 0.44, 0, 0.64, -0.78, 0.1, 0, 0);

      // Headboard + Footboard + Lowered Side Safety Rails
      addMesh(grp, g.box1, palette.ivory, 1.18, 0.88, 0.1, 0, 0.72, -1.06);
      addMesh(grp, g.box1, palette.ivory, 1.18, 0.58, 0.1, 0, 0.54, 1.06);
      [-0.58, 0.58].forEach(function (rx) {
        addMesh(grp, g.box1, railMat, 0.05, 0.18, 1.05, rx, 0.68, -0.18);
      });

      // IV Drip Stand & Saline Bag (-X side)
      addMesh(grp, g.cyl1, railMat, 0.04, 1.92, 0.04, -0.72, 0.96, -0.78);
      addMesh(grp, g.box1, railMat, 0.32, 0.04, 0.04, -0.60, 1.90, -0.78);
      addMesh(grp, g.cushion, _dripFluidMat, 0.14, 0.24, 0.08, -0.48, 1.72, -0.78);

      // Heart Monitor Screen on Stand (+X side)
      addMesh(grp, g.cyl1, railMat, 0.06, 1.45, 0.06, 0.74, 0.72, -0.82);
      addMesh(grp, g.box1, palette.iron, 0.42, 0.32, 0.12, 0.74, 1.42, -0.82);
      addMesh(grp, g.box1, getBasicMat(0x38e290), 0.34, 0.24, 0.04, 0.74, 1.42, -0.75);
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Hospital Medical Curtain Divider Rail & Aqua Drape Panels.
     */
    let _drapeMat = null;
    function buildMedicalCurtain(lenZ) {
      const grp = new THREE.Group();
      const czLen = lenZ || 2.3;
      if (!_drapeMat) _drapeMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x9cd8dc, roughness: 0.62, transparent: true, opacity: 0.76 }));
      addMesh(grp, g.cyl1, palette.silver, 0.04, czLen, 0.04, 0, 2.52, 0, Math.PI * 0.5, 0, 0);
      addMesh(grp, g.cushion, _drapeMat, 0.05, 2.05, czLen * 0.86, 0, 1.48, 0.05);
      return grp;
    }

    /**
     * Sims-4 Store Cashier Wrap Counter + Digital/Brass POS Register & Card Terminal.
     */
    function buildCashierCounter(interactId, accentHex, labelText) {
      const grp = new THREE.Group();
      const accent = getStdMat(accentHex || '#8d2f23', 0.45);
      addMesh(grp, g.cushion, palette.oak, 2.2, 0.92, 0.78, 0, 0.46, 0);
      addMesh(grp, g.cushion, palette.creamMarble, 2.32, 0.08, 0.88, 0, 0.95, 0);
      addMesh(grp, g.box1, accent, 1.9, 0.55, 0.05, 0, 0.48, 0.41);
      // POS Register Monitor + Till Drawer + Card Reader + Bell
      addMesh(grp, g.box1, palette.iron, 0.54, 0.12, 0.42, -0.35, 1.05, 0);
      addMesh(grp, g.cyl1, palette.silver, 0.05, 0.24, 0.05, -0.35, 1.2, -0.08);
      addMesh(grp, g.box1, palette.iron, 0.44, 0.30, 0.05, -0.35, 1.38, -0.06, -0.18, 0, 0);
      addMesh(grp, g.box1, getBasicMat(0x52e596), 0.36, 0.22, 0.02, -0.35, 1.38, -0.03, -0.18, 0, 0);
      addMesh(grp, g.box1, palette.iron, 0.16, 0.06, 0.24, 0.25, 1.03, 0.16, 0.22, 0, 0);
      addMesh(grp, g.sphere1, palette.gold, 0.11, 0.08, 0.11, 0.65, 1.03, 0.16);
      if (labelText) {
        addMesh(grp, g.cushion, palette.gold, 0.85, 0.32, 0.08, 0.45, 1.15, -0.22);
      }
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Pizzeria Heated Glass Pizza Showcase Counter + Slice Trays & Stacked Boxes.
     */
    function buildPizzaDisplayCase(interactId) {
      const grp = new THREE.Group();
      const crustMat = getStdMat(0xd9a157, 0.68);
      const cheeseMat = getStdMat(0xf6cf62, 0.48);
      const pepMat = palette.fabricColors.crimson;
      addMesh(grp, g.cushion, palette.oak, 2.2, 0.90, 0.82, 0, 0.45, 0);
      addMesh(grp, g.box1, palette.crystal, 2.08, 0.56, 0.72, 0, 1.18, 0);
      addMesh(grp, g.cushion, palette.iron, 2.16, 0.06, 0.78, 0, 1.48, 0);
      [-0.62, 0.08].forEach(function (px, pi) {
        addMesh(grp, g.cyl1, palette.silver, 0.58, 0.03, 0.58, px, 0.94, 0);
        addMesh(grp, g.cyl1, crustMat, 0.52, 0.04, 0.52, px, 0.97, 0);
        addMesh(grp, g.cyl1, cheeseMat, 0.44, 0.045, 0.44, px, 0.978, 0);
        if (pi === 0) {
          [-0.1, 0.1, 0].forEach(function (ox, oi) {
            addMesh(grp, g.cyl1, pepMat, 0.09, 0.05, 0.09, px + ox, 0.985, (oi - 1) * 0.11);
          });
        } else {
          addMesh(grp, g.sphere1, palette.foliageLight, 0.08, 0.03, 0.08, px, 1.0, 0);
        }
      });
      // Stack of white Pizza Boxes beside glass display
      for (let b = 0; b < 4; b++) {
        addMesh(grp, g.box1, palette.ivory, 0.48, 0.055, 0.48, 0.75, 0.95 + b * 0.06, 0.02);
        addMesh(grp, g.box1, pepMat, 0.485, 0.015, 0.12, 0.75, 0.95 + b * 0.06, 0.02);
      }
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Pizzeria Tufted Diner Booths & Table + Pizza Pie, Wine Glasses & Cloth.
     */
    function buildBoothTableSet(interactId) {
      const grp = new THREE.Group();
      const boothMat = palette.fabricColors.crimson;
      const cheeseMat = getStdMat(0xf4cc5b, 0.45);
      // Table in center
      addMesh(grp, g.cushion, palette.oak, 1.38, 0.08, 0.96, 0, 0.76, 0);
      addMesh(grp, g.leg, palette.iron, 1.6, 0.72, 1.6, 0, 0, 0);
      addMesh(grp, g.box1, palette.creamSilk, 0.7, 0.02, 0.98, 0, 0.805, 0);
      // Piping-hot whole Pizza on wooden board + Plates & Glasses
      addMesh(grp, g.cyl1, palette.oak, 0.44, 0.03, 0.44, 0, 0.825, 0);
      addMesh(grp, g.cyl1, cheeseMat, 0.38, 0.035, 0.38, 0, 0.835, 0);
      [-0.45, 0.45].forEach(function (gx) {
        addMesh(grp, g.cyl1, palette.porcelain, 0.24, 0.025, 0.24, gx, 0.82, 0.15);
        addMesh(grp, g.cyl1, palette.crystal, 0.07, 0.16, 0.07, gx * 0.85, 0.89, -0.18);
      });
      // Twin Plush Padded Diner Booths / Upholstered Seating facing table
      [-0.86, 0.86].forEach(function (bx) {
        const sign = bx < 0 ? -1 : 1;
        addMesh(grp, g.cushion, palette.oak, 0.56, 0.24, 1.24, bx, 0.14, 0);
        addMesh(grp, g.cushion, boothMat, 0.54, 0.18, 1.22, bx, 0.36, 0);
        addMesh(grp, g.cushion, boothMat, 0.16, 0.66, 1.24, bx + sign * 0.22, 0.72, 0);
      });
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Pizzeria / Market Illuminated Glass-Door Beverage Cooler.
     */
    function buildBeverageCooler() {
      const grp = new THREE.Group();
      const bodyMat = getStdMat(0x242830, 0.38, 0.32);
      addMesh(grp, g.cushion, bodyMat, 1.05, 2.15, 0.74, 0, 1.075, 0);
      addMesh(grp, g.box1, palette.crystal, 0.86, 1.64, 0.05, 0, 1.15, 0.36);
      [0.65, 1.05, 1.45].forEach(function (sy, si) {
        addMesh(grp, g.box1, palette.silver, 0.82, 0.04, 0.56, 0, sy, 0);
        [-0.26, 0, 0.26].forEach(function (bx, bi) {
          const bCol = [palette.fabricColors.crimson, palette.fabricColors.emerald, palette.fabricColors.sapphire][(si + bi) % 3];
          addMesh(grp, g.cyl1, bCol, 0.11, 0.26, 0.11, bx, sy + 0.15, 0.12);
        });
      });
      addMesh(grp, g.box1, getBasicMat(0xfff0c4), 0.86, 0.22, 0.05, 0, 2.02, 0.36);
      mergeStaticGroup(grp);
      return grp;
    }

    /**
     * Hospital MRI / Medical Exam Console & Diagnostic Desk.
     */
    function buildMedicalStation(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.cushion, palette.ivory, 2.2, 0.92, 0.82, 0, 0.46, 0);
      addMesh(grp, g.box1, palette.fabricColors.sapphire, 2.24, 0.06, 0.86, 0, 0.93, 0);
      addMesh(grp, g.box1, palette.iron, 0.68, 0.44, 0.08, -0.45, 1.24, -0.15);
      addMesh(grp, g.box1, getBasicMat(0x6ce3ff), 0.6, 0.36, 0.04, -0.45, 1.24, -0.1);
      addMesh(grp, g.cyl1, palette.silver, 0.22, 0.36, 0.22, 0.55, 1.12, 0.08);
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Hospital Apothecary & Pharmacy Dispensary Cabinet Shelf.
     */
    function buildPharmacyShelves(interactId) {
      const grp = new THREE.Group();
      addMesh(grp, g.box1, palette.ivory, 2.4, 2.2, 0.48, 0, 1.1, 0);
      [0.65, 1.25, 1.85].forEach(function (sy, ri) {
        addMesh(grp, g.box1, palette.silver, 2.28, 0.05, 0.44, 0, sy, 0.02);
        for (let b = -0.85; b <= 0.85; b += 0.42) {
          const bCol = (ri + Math.round(b * 2)) % 2 === 0 ? palette.fabricColors.sapphire : palette.fabricColors.emerald;
          addMesh(grp, g.cyl1, bCol, 0.14, 0.26, 0.14, b, sy + 0.16, 0.06);
        }
      });
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Rustic Timber Grain Silo & Rotating Countryside Windmill for Greenfields Farm.
     */
    function buildSilo() {
      const grp = new THREE.Group();
      const tinMat = getStdMat(0xc2c8cf, 0.42, 0.55);
      const tank = addMesh(grp, g.cyl1, palette.fabricColors.crimson, 3.2, 6.2, 3.2, 0, 3.1, 0);
      tank.castShadow = true;
      addMesh(grp, g.sphere1, tinMat, 3.3, 2.4, 3.3, 0, 6.2, 0);
      addMesh(grp, g.box1, palette.ivory, 0.45, 5.8, 0.2, 1.55, 3.0, 0);
      mergeStaticGroup(grp);
      return grp;
    }

    function buildWindmill() {
      const grp = new THREE.Group();
      const body = addMesh(grp, g.cyl1, palette.ivory, 2.0, 6.4, 2.0, 0, 3.2, 0);
      body.castShadow = true;
      const cap = addMesh(grp, g.cone1, getStdMat(0xa64135, 0.72), 2.5, 1.8, 2.5, 0, 7.2, 0);
      cap.castShadow = true;
      const rotor = new THREE.Group();
      rotor.userData.noMerge = true;
      rotor.position.set(0, 6.0, 1.15);
      for (let i = 0; i < 4; i++) {
        const blade = new THREE.Group();
        blade.rotation.z = (i * Math.PI) * 0.5;
        addMesh(blade, g.box1, palette.oak, 0.14, 2.75, 0.08, 0, 1.4, 0);
        addMesh(blade, g.box1, palette.creamSilk, 0.65, 2.1, 0.04, 0.28, 1.55, 0.02);
        rotor.add(blade);
      }
      mergeStaticGroup(rotor);
      grp.add(rotor);
      grp.userData.rotor = rotor;
      return grp;
    }

    /**
     * Harvestable Raised Farm Crop Plot (Wheat, Pumpkins, Strawberries).
     */
    function buildCropBed(kind, interactId) {
      const grp = new THREE.Group();
      const soilMat = getStdMat(0x5c422c, 0.94);
      const wheatMat = getStdMat(0xe3bd56, 0.78);
      const leafMat = getStdMat(0x4b7f3f, 0.8);
      const pumpMat = getStdMat(0xe27724, 0.68);
      const berryMat = getStdMat(0xd93855, 0.52);
      addMesh(grp, g.box1, palette.oak, 4.4, 0.28, 2.4, 0, 0.14, 0);
      addMesh(grp, g.box1, soilMat, 4.1, 0.24, 2.1, 0, 0.18, 0);
      for (let x = -1.6; x <= 1.6; x += 0.8) {
        for (let z = -0.6; z <= 0.6; z += 0.6) {
          if (kind === 'wheat') {
            addMesh(grp, g.cyl1, wheatMat, 0.24, 0.9, 0.24, x, 0.68, z);
          } else if (kind === 'pumpkins') {
            addMesh(grp, g.sphere1, pumpMat, 0.42, 0.34, 0.42, x, 0.42, z);
            addMesh(grp, g.cyl1, leafMat, 0.08, 0.14, 0.08, x, 0.6, z);
          } else {
            addMesh(grp, g.sphere1, leafMat, 0.38, 0.3, 0.38, x, 0.38, z);
            addMesh(grp, g.sphere1, berryMat, 0.16, 0.16, 0.16, x + 0.1, 0.48, z + 0.08);
          }
        }
      }
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Royal Farm Tractor parked by Barn.
     */
    function buildTractor(interactId) {
      const grp = new THREE.Group();
      const bodyMat = getStdMat(0x3b723f, 0.45, 0.28);
      const tBody = addMesh(grp, g.cushion, bodyMat, 1.35, 0.72, 2.2, 0, 0.86, 0);
      tBody.castShadow = true;
      addMesh(grp, g.cushion, bodyMat, 1.25, 0.95, 1.05, 0, 1.62, -0.45);
      addMesh(grp, g.box1, palette.crystal, 1.15, 0.6, 0.95, 0, 1.65, -0.45);
      addMesh(grp, g.cyl1, palette.iron, 0.14, 0.65, 0.14, 0.38, 1.48, 0.72);
      // Big rear wheels, smaller front wheels
      [-0.78, 0.78].forEach(function (wx) {
        addMesh(grp, g.cyl1, palette.iron, 1.18, 0.32, 1.18, wx, 0.58, -0.62, 0, 0, Math.PI * 0.5);
        addMesh(grp, g.cyl1, palette.gold, 0.56, 0.35, 0.56, wx, 0.58, -0.62, 0, 0, Math.PI * 0.5);
        addMesh(grp, g.cyl1, palette.iron, 0.74, 0.24, 0.74, wx, 0.37, 0.78, 0, 0, Math.PI * 0.5);
      });
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    /**
     * Articulated Living Farm Animals (Cow, Sheep, Chicken) with Animated Walk Rig.
     */
    function buildFarmAnimal(kind, interactId) {
      const grp = new THREE.Group();
      const headPivot = new THREE.Group();
      headPivot.userData.noMerge = true;
      const legs = [];
      if (kind === 'cow') {
        const coat = palette.ivory;
        const spot = palette.iron;
        addMesh(grp, g.capsule1, coat, 0.58, 0.78, 0.58, 0, 0.88, 0, Math.PI * 0.5, 0, 0);
        addMesh(grp, g.sphere1, spot, 0.36, 0.28, 0.34, 0.2, 0.95, -0.15);
        addMesh(grp, g.sphere1, spot, 0.32, 0.24, 0.32, -0.18, 0.88, 0.22);
        headPivot.position.set(0, 1.0, 0.54);
        addMesh(headPivot, g.box1, coat, 0.34, 0.34, 0.42, 0, 0.04, 0.16);
        addMesh(headPivot, g.sphere1, palette.fabricColors.rose, 0.28, 0.2, 0.22, 0, -0.04, 0.36);
        [-0.14, 0.14].forEach(function (hx) {
          addMesh(headPivot, g.cone1, palette.ivory, 0.07, 0.18, 0.07, hx, 0.24, 0.12);
        });
        [[-0.16, 0.32], [0.16, 0.32], [-0.16, -0.34], [0.16, -0.34]].forEach(function (pt) {
          const lp = new THREE.Group();
          lp.userData.noMerge = true;
          lp.position.set(pt[0], 0.62, pt[1]);
          addMesh(lp, g.cyl1, coat, 0.12, 0.56, 0.12, 0, -0.28, 0);
          addMesh(lp, g.cyl1, spot, 0.13, 0.08, 0.13, 0, -0.58, 0);
          mergeStaticGroup(lp);
          grp.add(lp);
          legs.push(lp);
        });
      } else if (kind === 'sheep') {
        const wool = palette.creamSilk;
        const face = palette.iron;
        addMesh(grp, g.sphere1, wool, 0.52, 0.48, 0.68, 0, 0.58, 0);
        headPivot.position.set(0, 0.65, 0.36);
        addMesh(headPivot, g.sphere1, face, 0.24, 0.24, 0.28, 0, 0, 0.1);
        [[-0.12, 0.18], [0.12, 0.18], [-0.12, -0.2], [0.12, -0.2]].forEach(function (pt) {
          const lp = new THREE.Group();
          lp.userData.noMerge = true;
          lp.position.set(pt[0], 0.36, pt[1]);
          addMesh(lp, g.cyl1, face, 0.08, 0.32, 0.08, 0, -0.16, 0);
          grp.add(lp);
          legs.push(lp);
        });
      } else {
        const feather = getStdMat(0xf7e7cf, 0.75);
        addMesh(grp, g.sphere1, feather, 0.26, 0.24, 0.32, 0, 0.28, 0);
        headPivot.position.set(0, 0.4, 0.14);
        addMesh(headPivot, g.sphere1, feather, 0.14, 0.14, 0.14, 0, 0.06, 0.04);
        addMesh(headPivot, g.cone1, palette.gold, 0.06, 0.1, 0.06, 0, 0.04, 0.13, Math.PI * 0.5, 0, 0);
        addMesh(headPivot, g.box1, palette.fabricColors.crimson, 0.04, 0.08, 0.1, 0, 0.15, 0.04);
      }
      mergeStaticGroup(headPivot);
      grp.add(headPivot);
      grp.userData.rig = { headPivot: headPivot, legs: legs };
      mergeStaticGroup(grp);
      if (interactId) tag(grp, interactId);
      return grp;
    }

    // New Architectural & Palace Showcase Builders (Images 1–7)
    function buildFlutedColumn(height, isDark) {
      const grp = new THREE.Group();
      const h = height || 4.6;
      const shaftMat = isDark ? palette.mahogany : palette.ivory;
      addMesh(grp, g.box1, shaftMat, 0.78, 0.28, 0.78, 0, 0.14, 0);
      addMesh(grp, g.cyl1, shaftMat, 0.56, h - 0.52, 0.56, 0, h * 0.5, 0);
      addMesh(grp, g.box1, palette.gold, 0.82, 0.28, 0.82, 0, h - 0.14, 0);
      mergeStaticGroup(grp);
      return grp;
    }

    function buildCinemaScreenWall(w, h) {
      const grp = new THREE.Group();
      const sw = w || 8.4;
      const sh = h || 3.85;
      addMesh(grp, g.box1, palette.iron, sw + 0.6, sh + 0.6, 0.28, 0, sh * 0.5 + 0.45, 0);
      addMesh(grp, g.box1, palette.gold, sw + 0.35, sh + 0.35, 0.3, 0, sh * 0.5 + 0.45, 0.02);
      const scr = addMesh(grp, g.box1, palette.cinemaScreen, sw, sh, 0.32, 0, sh * 0.5 + 0.45, 0.04);
      scr.castShadow = false;
      mergeStaticGroup(grp);
      return grp;
    }

    function buildClassicalStatue(height) {
      const grp = new THREE.Group();
      const h = height || 2.1;
      addMesh(grp, g.box1, palette.ivory, 0.68, 0.85, 0.68, 0, 0.425, 0);
      addMesh(grp, g.box1, palette.gold, 0.72, 0.06, 0.72, 0, 0.86, 0);
      addMesh(grp, g.cyl1, palette.porcelain, 0.34, h * 0.55, 0.32, 0, 0.88 + h * 0.27, 0);
      addMesh(grp, g.capsule1, palette.porcelain, 0.28, 0.28, 0.22, 0, 0.88 + h * 0.56, 0);
      addMesh(grp, g.sphere1, palette.porcelain, 0.22, 0.26, 0.22, 0, 0.88 + h * 0.78, 0);
      mergeStaticGroup(grp);
      return grp;
    }

    function buildPantryButlerArches() {
      const grp = new THREE.Group();
      [
        { x: -1.15, signMat: palette.pantrySign },
        { x: 1.15, signMat: palette.butlersSign },
      ].forEach(function (item) {
        addMesh(grp, g.box1, palette.mahoganyPanel, 1.9, 3.3, 0.16, item.x, 1.65, 0);
        addMesh(grp, g.box1, palette.warmCoveGlow, 1.25, 2.1, 0.08, item.x, 1.15, 0.06);
        addMesh(grp, g.box1, palette.crystal, 1.28, 2.15, 0.04, item.x, 1.15, 0.10);
        [0.65, 1.15, 1.65].forEach(function (sy) {
          addMesh(grp, g.box1, palette.gold, 1.18, 0.04, 0.12, item.x, sy, 0.07);
        });
        addMesh(grp, g.cushion, palette.gold, 1.16, 0.46, 0.12, item.x, 2.72, 0.09);
        addMesh(grp, g.box1, item.signMat, 1.04, 0.38, 0.14, item.x, 2.72, 0.10);
      });
      mergeStaticGroup(grp);
      return grp;
    }

    function buildMasterBathExtras() {
      const grp = new THREE.Group();
      // Image 5 Tufted Champagne Bench + 3-Panel Gilded Glass Dressing Screen + Circular Persian Rug
      addMesh(grp, g.cyl1, palette.persianCircleRug, 3.6, 0.022, 3.6, 0, 0.011, 0.2);
      // Tufted bench positioned to the +Z front side of tub plinth
      [-0.58, 0.58].forEach(function (bx) {
        addMesh(grp, g.leg, palette.gold, 1.1, 0.28, 1.1, bx, 0, 1.38);
      });
      addMesh(grp, g.cushion, palette.gold, 1.48, 0.09, 0.54, 0, 0.32, 1.38);
      addMesh(grp, g.cushion, palette.fabricColors.creamTufted, 1.44, 0.14, 0.5, 0, 0.42, 1.38);
      // 3-Panel Folding Gilded Glass Screen behind tub (-Z)
      [[-0.72, 0.2], [0, 0], [0.72, -0.2]].forEach(function (pn) {
        const panel = new THREE.Group();
        panel.position.set(pn[0], 1.12, -1.18);
        panel.rotation.y = pn[1];
        addMesh(panel, g.cushion, palette.gold, 0.68, 2.15, 0.05, 0, 0, 0);
        addMesh(panel, g.box1, palette.crystal, 0.56, 1.98, 0.06, 0, 0, 0);
        grp.add(panel);
      });
      mergeStaticGroup(grp);
      return grp;
    }

    function buildSlateArchPortal(w, h) {
      const grp = new THREE.Group();
      const pw = w || 3.4;
      const ph = h || 3.6;
      addMesh(grp, g.box1, palette.ivory, 0.28, ph, 0.26, -pw * 0.5, ph * 0.5, 0);
      addMesh(grp, g.box1, palette.ivory, 0.28, ph, 0.26, pw * 0.5, ph * 0.5, 0);
      addMesh(grp, g.box1, palette.ivory, pw + 0.3, 0.48, 0.28, 0, ph - 0.24, 0);
      mergeStaticGroup(grp);
      return grp;
    }

    function buildSideTableLamp(toneName) {
      const grp = new THREE.Group();
      addMesh(grp, g.cyl1, palette.gold, 0.54, 0.06, 0.54, 0, 0.62, 0);
      addMesh(grp, g.cyl1, palette.portoroMarble, 0.50, 0.05, 0.50, 0, 0.66, 0);
      addMesh(grp, g.leg, palette.gold, 1.15, 0.58, 1.15, 0, 0, 0);
      addMesh(grp, g.vaseUrn, palette.fabricColors[toneName || 'rose'] || palette.porcelain, 0.85, 0.9, 0.85, 0, 0.69, 0);
      addMesh(grp, g.lampShade, palette.creamSilk, 1.35, 1.3, 1.35, 0, 1.14, 0);
      addMesh(grp, g.sphere1, palette.warmBulb, 0.13, 0.13, 0.13, 0, 1.12, 0);
      mergeStaticGroup(grp);
      return grp;
    }

    function buildBedWindowLounge(toneName) {
      const grp = new THREE.Group();
      const tone = toneName || 'plum';
      addMesh(grp, g.cyl1, palette.persianCircleRug, 2.8, 0.022, 2.8, 0, 0.011, 0);
      const settee = buildSofa({ tone: tone, w: 2.0 });
      settee.position.set(0, 0.02, -0.75);
      grp.add(settee);
      addMesh(grp, g.cyl1, palette.creamMarble, 0.86, 0.06, 0.86, 0, 0.46, 0.28);
      addMesh(grp, g.leg, palette.gold, 1.15, 0.42, 1.15, 0, 0.02, 0.28);
      addMesh(grp, g.vaseUrn, palette.crystal, 0.55, 0.55, 0.55, 0, 0.49, 0.28);
      mergeStaticGroup(grp);
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
      getStdMat: getStdMat,
      getBasicMat: getBasicMat,
      mergeStaticGroup: mergeStaticGroup,
      buildBed: buildBed,
      buildToilet: buildToilet,
      buildVanitySink: buildVanitySink,
      buildBathtub: buildBathtub,
      buildShowerCubicle: buildShowerCubicle,
      buildFridge: buildFridge,
      buildCoffeeTable: buildCoffeeTable,
      buildRug: buildRug,
      buildAutoPavilion: buildAutoPavilion,
      buildHospitalBed: buildHospitalBed,
      buildMedicalStation: buildMedicalStation,
      buildPharmacyShelves: buildPharmacyShelves,
      buildSilo: buildSilo,
      buildWindmill: buildWindmill,
      buildCropBed: buildCropBed,
      buildTractor: buildTractor,
      buildFarmAnimal: buildFarmAnimal,
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
      buildBakeryShowcase: buildBakeryShowcase,
      buildPoolExtras: buildPoolExtras,
      buildPoolLounger: buildPoolLounger,
      buildPlotSign: buildPlotSign,
      buildGableRoof: buildGableRoof,
      buildFrontPorch: buildFrontPorch,
      buildWindowBox: buildWindowBox,
      buildSchoolDeskSet: buildSchoolDeskSet,
      buildChalkboardLectern: buildChalkboardLectern,
      buildSchoolLockers: buildSchoolLockers,
      buildDebatePodium: buildDebatePodium,
      buildGazebo: buildGazebo,
      buildBeachUmbrellaSet: buildBeachUmbrellaSet,
      buildRoyalYacht: buildRoyalYacht,
      buildRowboat: buildRowboat,
      buildMedicalCurtain: buildMedicalCurtain,
      buildCashierCounter: buildCashierCounter,
      buildPizzaDisplayCase: buildPizzaDisplayCase,
      buildBoothTableSet: buildBoothTableSet,
      buildBeverageCooler: buildBeverageCooler,
      buildFlutedColumn: buildFlutedColumn,
      buildCinemaScreenWall: buildCinemaScreenWall,
      buildClassicalStatue: buildClassicalStatue,
      buildPantryButlerArches: buildPantryButlerArches,
      buildMasterBathExtras: buildMasterBathExtras,
      buildSlateArchPortal: buildSlateArchPortal,
      buildSideTableLamp: buildSideTableLamp,
      buildBedWindowLounge: buildBedWindowLounge,
      buildHingedDoors: buildHingedDoors,
      getHollowDuvet: getHollowDuvet,
      dispose: dispose,
    };
  }

  window.CrownFurniture = {
    createKit: createSharedKit,
  };
})();
