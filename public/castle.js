(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  function createPalaceTexture(renderer, kind, size) {
    const THREE = window.THREE;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');

    if (kind === 'marble-checker') {
      const tile = size / 2;
      ctx.fillStyle = '#f8f2e8';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#332d35';
      ctx.fillRect(0, 0, tile, tile);
      ctx.fillRect(tile, tile, tile, tile);
      ctx.strokeStyle = 'rgba(212, 175, 85, 0.36)';
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, size - 3, size - 3);
      ctx.beginPath();
      ctx.moveTo(0, tile);
      ctx.lineTo(size, tile);
      ctx.moveTo(tile, 0);
      ctx.lineTo(tile, size);
      ctx.stroke();
    } else if (kind === 'ivory-limestone') {
      ctx.fillStyle = '#efe3cf';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = 'rgba(214, 196, 168, 0.25)';
      for (let i = 0; i < 120; i++) {
        ctx.fillRect((i * 53) % size, (i * 37) % size, 12, 5);
      }
      ctx.strokeStyle = 'rgba(155, 128, 92, 0.28)';
      ctx.lineWidth = 1.6;
      for (let y = 0; y < size; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
        const off = (y / 32) % 2 === 0 ? 0 : 32;
        for (let x = off; x < size; x += 64) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 32);
          ctx.stroke();
        }
      }
    } else if (kind === 'baroque-facade') {
      ctx.fillStyle = '#f0e4d0';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(152, 126, 92, 0.26)';
      ctx.lineWidth = 1.5;
      for (let y = 0; y < size; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }
      ctx.fillStyle = '#e2d2b8';
      ctx.fillRect(0, 0, size, 28);
      ctx.fillRect(0, size - 22, size, 22);
      ctx.fillStyle = '#cbb694';
      ctx.fillRect(0, 26, size, 6);
      ctx.fillRect(0, size - 26, size, 5);

      [14, size * 0.5 - 12, size - 36].forEach(function (px) {
        ctx.fillStyle = '#e7d8bf';
        ctx.fillRect(px, 28, 22, size - 50);
        ctx.strokeStyle = 'rgba(130, 105, 72, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px, 28, 22, size - 50);
        ctx.fillStyle = '#d4b885';
        ctx.fillRect(px - 3, 28, 28, 12);
      });

      const bayW = size * 0.5;
      for (let b = 0; b < 2; b++) {
        const bx = b * bayW + bayW * 0.5;
        const winW = bayW * 0.44;
        const winTop = 64;
        const winBot = size - 44;
        const archR = winW * 0.5;

        ctx.fillStyle = '#d9c6a5';
        ctx.beginPath();
        ctx.moveTo(bx - winW * 0.65, winTop + archR);
        ctx.lineTo(bx, winTop - 22);
        ctx.lineTo(bx + winW * 0.65, winTop + archR);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(128, 104, 74, 0.42)';
        ctx.stroke();

        ctx.fillStyle = '#dfd0b6';
        ctx.beginPath();
        ctx.arc(bx, winTop + archR, archR + 7, Math.PI, 0);
        ctx.lineTo(bx + archR + 7, winBot + 4);
        ctx.lineTo(bx - archR - 7, winBot + 4);
        ctx.closePath();
        ctx.fill();

        const glassGrad = ctx.createLinearGradient(bx - archR, winTop, bx + archR, winBot);
        glassGrad.addColorStop(0, '#2a394b');
        glassGrad.addColorStop(0.45, '#465d75');
        glassGrad.addColorStop(0.7, '#273545');
        glassGrad.addColorStop(1, '#1d2733');
        ctx.fillStyle = glassGrad;
        ctx.beginPath();
        ctx.arc(bx, winTop + archR, archR, Math.PI, 0);
        ctx.lineTo(bx + archR, winBot);
        ctx.lineTo(bx - archR, winBot);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 224, 158, 0.16)';
        ctx.fillRect(bx - archR * 0.72, winTop + archR * 0.9, winW * 0.72, (winBot - winTop) * 0.35);

        ctx.strokeStyle = '#f2e8d8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx, winTop);
        ctx.lineTo(bx, winBot);
        for (let r = 1; r <= 4; r++) {
          const ty = winTop + archR + ((winBot - winTop - archR) * r) / 5;
          ctx.moveTo(bx - archR, ty);
          ctx.lineTo(bx + archR, ty);
        }
        ctx.stroke();

        ctx.fillStyle = '#e5d5bc';
        ctx.fillRect(bx - archR - 9, winBot - 16, winW + 18, 22);
        ctx.strokeStyle = 'rgba(130, 105, 72, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx - archR - 9, winBot - 16, winW + 18, 22);
      }
    } else if (kind === 'mansard-slate') {
      ctx.fillStyle = '#334457';
      ctx.fillRect(0, 0, size, size);
      const rowH = 18;
      const colW = 24;
      for (let r = 0; r < size / rowH; r++) {
        const y = r * rowH;
        const off = r % 2 === 0 ? 0 : colW * 0.5;
        for (let x = -colW; x < size + colW; x += colW) {
          ctx.fillStyle = (r + Math.floor(x / colW)) % 3 === 0 ? '#3b4e63' : '#2d3d4f';
          ctx.fillRect(x + off + 1, y + 1, colW - 2, rowH - 2);
        }
        ctx.fillStyle = 'rgba(18, 25, 34, 0.32)';
        ctx.fillRect(0, y + rowH - 2, size, 2);
      }
    } else if (kind === 'parquet-gold') {
      ctx.fillStyle = '#d7b585';
      ctx.fillRect(0, 0, size, size);
      const step = size / 4;
      for (let r = 0; r < 4; r++) {
        for (let col = 0; col < 4; col++) {
          ctx.fillStyle = (r + col) % 2 === 0 ? '#dfc092' : '#c9a16d';
          ctx.fillRect(col * step + 2, r * step + 2, step - 4, step - 4);
        }
      }
      ctx.strokeStyle = 'rgba(130, 86, 40, 0.28)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, size - 2, size - 2);
    } else if (kind === 'blush-rug') {
      ctx.fillStyle = '#e7bcc5';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = '#cfa34e';
      ctx.lineWidth = 10;
      ctx.strokeRect(14, 14, size - 28, size - 28);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(26, 26, size - 52, size - 52);
    } else if (kind === 'grass') {
      ctx.fillStyle = '#5c9348';
      ctx.fillRect(0, 0, size, size);
      for (let i = 0; i < 420; i++) {
        const gx = (i * 73) % size;
        const gy = (i * 139) % size;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(116, 174, 78, 0.34)' : i % 3 === 1 ? 'rgba(72, 122, 52, 0.28)' : 'rgba(140, 192, 92, 0.22)';
        ctx.beginPath();
        ctx.arc(gx, gy, 4 + (i % 7), 0, Math.PI * 2);
        ctx.fill();
      }
      for (let f = 0; f < 46; f++) {
        ctx.fillStyle = f % 2 === 0 ? 'rgba(255, 246, 198, 0.52)' : 'rgba(255, 224, 232, 0.48)';
        ctx.fillRect((f * 97 + 19) % size, (f * 61 + 11) % size, 2, 2);
      }
    } else if (kind === 'gravel-walk') {
      ctx.fillStyle = '#efe4d0';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = 'rgba(176, 148, 108, 0.22)';
      for (let i = 0; i < 220; i++) {
        ctx.fillRect((i * 73) % size, (i * 41) % size, 3, 3);
      }
    } else if (kind === 'water') {
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#3296c2');
      grad.addColorStop(0.5, '#5cc5e6');
      grad.addColorStop(1, '#267da3');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = 'rgba(235, 250, 255, 0.35)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        const y = (i / 20) * size;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(size * 0.33, y - 5, size * 0.66, y + 5, size, y);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if (renderer && renderer.capabilities) {
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy() || 1);
    }
    return tex;
  }

  function localToWorld(bx, bz, yaw, lx, lz) {
    const c = Math.cos(yaw);
    const s = Math.sin(yaw);
    return {
      x: bx + lx * c + lz * s,
      z: bz - lx * s + lz * c,
    };
  }

  function buildVersaillesEstate(scene, renderer, options) {
    const THREE = window.THREE;
    const opts = options || {};
    const isSoftwareGl = Boolean(opts.isSoftwareGl);
    const crestHex = opts.crestHex || '#b8324f';
    const textures = [];

    function trackTex(t) {
      textures.push(t);
      return t;
    }

    const kit = window.CrownFurniture ? window.CrownFurniture.createKit(THREE) : null;

    const marbleTex = trackTex(createPalaceTexture(renderer, 'marble-checker', 256));
    marbleTex.repeat.set(8, 6);
    const limestoneTex = trackTex(createPalaceTexture(renderer, 'ivory-limestone', 256));
    limestoneTex.repeat.set(4, 2);
    const facadeWingTex = trackTex(createPalaceTexture(renderer, 'baroque-facade', 512));
    facadeWingTex.repeat.set(2, 1);
    const facadePavTex = trackTex(createPalaceTexture(renderer, 'baroque-facade', 512));
    facadePavTex.repeat.set(1.5, 1);
    const slateTex = trackTex(createPalaceTexture(renderer, 'mansard-slate', 256));
    slateTex.repeat.set(5, 2);
    const parquetTex = trackTex(createPalaceTexture(renderer, 'parquet-gold', 256));
    parquetTex.repeat.set(6, 5);
    const blushRugTex = trackTex(createPalaceTexture(renderer, 'blush-rug', 256));
    const grassTex = trackTex(createPalaceTexture(renderer, 'grass', 256));
    grassTex.repeat.set(34, 28);
    const gravelTex = trackTex(createPalaceTexture(renderer, 'gravel-walk', 256));
    gravelTex.repeat.set(18, 18);
    const waterTex = trackTex(createPalaceTexture(renderer, 'water', 256));
    waterTex.repeat.set(12, 8);

    const ivoryMat = new THREE.MeshStandardMaterial({ map: limestoneTex, color: 0xf7efe0, roughness: 0.58, metalness: 0.03 });
    const wingFacadeMat = new THREE.MeshStandardMaterial({ map: facadeWingTex, roughness: 0.52, metalness: 0.05 });
    const pavFacadeMat = new THREE.MeshStandardMaterial({ map: facadePavTex, roughness: 0.52, metalness: 0.05 });
    const slateRoofMat = new THREE.MeshStandardMaterial({ map: slateTex, color: 0x3b4d63, roughness: 0.48, metalness: 0.14 });
    const marbleMat = new THREE.MeshPhysicalMaterial({ map: marbleTex, roughness: 0.18, metalness: 0.06, clearcoat: 0.45 });
    const whiteMarbleMat = new THREE.MeshStandardMaterial({ color: 0xf4eee4, roughness: 0.28, metalness: 0.06 });
    const parquetMat = new THREE.MeshStandardMaterial({ map: parquetTex, roughness: 0.34, metalness: 0.05 });
    const cottageFloorMat = new THREE.MeshStandardMaterial({ color: 0x9b7552, roughness: 0.78 });
    const cottageWallMat = new THREE.MeshStandardMaterial({ color: 0xf3e8d6, roughness: 0.74 });
    const cottageRoofMat = new THREE.MeshStandardMaterial({ color: 0x7b4737, roughness: 0.7 });
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xdfb454, roughness: 0.22, metalness: 0.88, clearcoat: 0.5 });
    const goldMatteMat = new THREE.MeshStandardMaterial({ color: 0xc99c42, roughness: 0.34, metalness: 0.72 });
    const wroughtIronMat = new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.42, metalness: 0.65 });
    const boxwoodMat = new THREE.MeshStandardMaterial({ color: 0x4c6e32, roughness: 0.86, metalness: 0.02 });
    const grassMat = new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.88 });
    const gravelMat = new THREE.MeshStandardMaterial({ map: gravelTex, roughness: 0.78 });
    const waterUniforms = { uWaterTime: { value: 0 } };
    const waterMat = new THREE.MeshPhysicalMaterial({
      map: waterTex,
      color: 0x5bc8ea,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.35,
    });
    const seaWaterMat = waterMat.clone();
    if (!isSoftwareGl) {
      seaWaterMat.onBeforeCompile = function (shader) {
        shader.uniforms.uWaterTime = waterUniforms.uWaterTime;
        shader.vertexShader = 'uniform float uWaterTime;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\n  transformed.z += sin(position.x * 0.45 + uWaterTime * 1.9) * 0.025 + cos(position.y * 0.5 + uWaterTime * 1.4) * 0.02;'
        );
      };
    }
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x3a4f66, roughness: 0.12, metalness: 0.22, transparent: true, opacity: 0.46 });
    const mirrorGlassMat = new THREE.MeshPhysicalMaterial({ color: 0xeaf4fc, roughness: 0.05, metalness: 0.88, clearcoat: 1.0 });
    const pinkVelvetMat = new THREE.MeshStandardMaterial({ color: 0xd98fa0, roughness: 0.72, metalness: 0.02 });
    const creamDrapesMat = new THREE.MeshStandardMaterial({ color: 0xf7ece0, roughness: 0.76, metalness: 0.02 });
    const blushRugMat = new THREE.MeshStandardMaterial({ map: blushRugTex, roughness: 0.8 });
    const crestMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(crestHex), roughness: 0.55 });

    // Colliders separated cleanly by Floor 1 (+ Outdoors), Floor 2, Floor 3
    const sharedColliders = [];
    const floor1Colliders = [];
    const floor2Colliders = [];
    const floor3Colliders = [];

    function addBox(targetArr, cx, cz, w, d, isWall) {
      targetArr.push({
        type: 'box',
        isWall: Boolean(isWall),
        minX: cx - w * 0.5,
        maxX: cx + w * 0.5,
        minZ: cz - d * 0.5,
        maxZ: cz + d * 0.5,
      });
    }
    function addCircle(targetArr, cx, cz, r) {
      targetArr.push({ type: 'circle', x: cx, z: cz, r: r });
    }

    // Dynamic catalog spots populated directly by room builders below
    const spots = {};
    const shortcutsList = [];
    const interactiveMeshes = [];
    const enterableCottages = [];

    function tagInteractable(obj, interactId) {
      if (!obj) return;
      obj.userData.interactId = interactId;
      interactiveMeshes.push(obj);
      if (obj.traverse) {
        obj.traverse(function (child) {
          if (child !== obj) child.userData.interactId = interactId;
        });
      }
    }

    function registerSpot(def) {
      spots[def.id] = def;
      if (def.shortcut) {
        shortcutsList.push(def);
      }
    }

    const parterreBeds = [
      { x: -12.5, z: -2.0, w: 10.5, d: 11.0 }, { x: 12.5, z: -2.0, w: 10.5, d: 11.0 },
      { x: -13.0, z: 12.5, w: 11.5, d: 13.0 }, { x: 13.0, z: 12.5, w: 11.5, d: 13.0 },
      { x: -12.5, z: 27.5, w: 10.5, d: 12.0 }, { x: 12.5, z: 27.5, w: 10.5, d: 12.0 },
      { x: -26.5, z: 12.5, w: 10.0, d: 28.0 }, { x: 26.5, z: 12.5, w: 10.0, d: 28.0 },
    ];

    let upperFloors = null;
    let townMod = null;

    // Walkable Height across Courtyard, Grass Parterres, 1F-7F Palace Suites, Town Lots, Pool & Hotel
    function groundHeightAt(x, z, currentY) {
      const yNow = typeof currentY === 'number' ? currentY : 0;

      if (upperFloors) {
        const upH = upperFloors.groundHeightAtUpper(x, z, yNow);
        if (typeof upH === 'number') return upH;
      }

      // Staircase 2F -> 3F (x in [4.1 .. 6.7], z from -28.6 [5.65] to -37.0 [10.65])
      if (x >= 4.0 && x <= 6.85 && z <= -28.4 && z >= -37.2 && yNow >= 4.2 && yNow < 13.2) {
        const t3 = THREE.MathUtils.clamp((-28.8 - z) / 8.0, 0, 1);
        const stair3Y = 5.65 + t3 * 5.0;
        if (Math.abs(yNow - stair3Y) < 2.2) {
          return stair3Y;
        }
      }

      // Floor 3 Mansard Grand Suites (y = 10.65)
      if (yNow >= 8.2 && yNow < 13.2 && Math.abs(x) <= 30.6 && z <= -17.2 && z >= -38.6) {
        return 10.65;
      }

      // Grand Imperial Staircase 1F -> 2F (x in [-2.8 .. +2.8], z from -28.6 [0.65] to -37.0 [5.65])
      if (Math.abs(x) <= 2.9 && z <= -28.4 && z >= -37.2 && yNow < 8.2) {
        const t2 = THREE.MathUtils.clamp((-28.8 - z) / 8.0, 0, 1);
        const stair2Y = 0.65 + t2 * 5.0;
        if (Math.abs(yNow - stair2Y) < 2.2) {
          return stair2Y;
        }
      }

      // Floor 2 Interior & Upper Terrace Balcony (y = 5.65)
      if (yNow >= 3.2 && yNow < 8.2 && Math.abs(x) <= 30.6 && z <= -14.2 && z >= -38.6) {
        return 5.65;
      }

      // Courtyard Grand Entrance Steps (z = -13.2 to -17.5, x = -9.2 to 9.2)
      if (Math.abs(x) <= 9.2 && z <= -13.2 && z >= -17.5 && yNow < 2.5) {
        return THREE.MathUtils.clamp((-13.2 - z) / 4.3, 0, 1) * 0.65;
      }

      // Palace Terrace Plinth & Floor 1 Interior (y = 0.65)
      if (Math.abs(x) <= 32.5 && z <= -17.0 && z >= -39.0 && yNow < 3.2) {
        return 0.65;
      }

      if (townMod) {
        const tH = townMod.groundHeightAtTown(x, z, yNow);
        if (typeof tH === 'number') return tH;
      }

      // Enterable Commoner Cottage slightly raised plank floors (y = 0.08)
      for (let i = 0; i < enterableCottages.length; i++) {
        const ct = enterableCottages[i];
        if (x >= ct.minX && x <= ct.maxX && z >= ct.minZ && z <= ct.maxZ) {
          return 0.08;
        }
      }

      // Walkable Versailles Parterre Grass Lawns (y = 0.14)
      if (yNow < 1.5) {
        for (let p = 0; p < parterreBeds.length; p++) {
          const pb = parterreBeds[p];
          if (Math.abs(x - pb.x) <= pb.w * 0.5 && Math.abs(z - pb.z) <= pb.d * 0.5) {
            return 0.14;
          }
        }
      }

      // Riviera Timber Yacht Pier, Golden Sandy Beach & Swimmable Ocean Shallows
      if (yNow < 2.0 && Math.abs(x) <= 2.6 && z >= 51.8 && z <= 67.0) {
        return 0.26;
      }
      if (yNow < 2.0 && z >= 51.8 && z <= 59.4) {
        return 0.03;
      }
      if (yNow < 1.5 && z > 59.4 && z <= 145 && Math.abs(x) <= 158) {
        return -0.35;
      }

      return 0;
    }

    function resolveList(list, rx, rz, radius, wallsOnly) {
      let x = rx;
      let z = rz;
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < list.length; i++) {
          const c = list[i];
          if (wallsOnly && !c.isWall) continue;
          if (c.type === 'circle') {
            const dx = x - c.x;
            const dz = z - c.z;
            const minDist = c.r + radius;
            const distSq = dx * dx + dz * dz;
            if (distSq < minDist * minDist) {
              if (distSq > 0.0001) {
                const d = Math.sqrt(distSq);
                x = c.x + (dx / d) * minDist;
                z = c.z + (dz / d) * minDist;
              } else {
                z = c.z + minDist;
              }
            }
          } else {
            const cx = THREE.MathUtils.clamp(x, c.minX, c.maxX);
            const cz = THREE.MathUtils.clamp(z, c.minZ, c.maxZ);
            const dx = x - cx;
            const dz = z - cz;
            const dSq = dx * dx + dz * dz;
            if (dSq < radius * radius) {
              if (dSq > 0.00001) {
                const d = Math.sqrt(dSq);
                x = cx + (dx / d) * radius;
                z = cz + (dz / d) * radius;
              } else {
                // Push out along the minimum penetration axis (never teleport across long horizontal walls!)
                const penLeft = x - c.minX;
                const penRight = c.maxX - x;
                const penTop = z - c.minZ;
                const penBot = c.maxZ - z;
                const minPen = Math.min(penLeft, penRight, penTop, penBot);
                if (minPen === penLeft) x = c.minX - radius;
                else if (minPen === penRight) x = c.maxX + radius;
                else if (minPen === penTop) z = c.minZ - radius;
                else z = c.maxZ + radius;
              }
            }
          }
        }
      }
      return { x: x, z: z };
    }

    function resolveSingleStepCollision(nx, nz, radius, currentY, opts) {
      const yNow = typeof currentY === 'number' ? currentY : 0;
      const cfg = opts || {};
      const wallsOnly = Boolean(cfg.wallsOnly);
      const maxZBound = (cfg.ignoreEntityId || cfg.excludePools) ? 50.2 : 136;
      let rx = THREE.MathUtils.clamp(nx, -162, 162);
      let rz = THREE.MathUtils.clamp(nz, -56, maxZBound);

      if (upperFloors && yNow >= 13.2 && Math.abs(nx) <= 34 && nz <= -13) {
        const upCol = upperFloors.getColliderFloor(yNow);
        if (upCol) {
          rx = THREE.MathUtils.clamp(rx, -29.8, 29.8);
          rz = THREE.MathUtils.clamp(rz, -38.0, -17.6);
          return resolveList(upCol.list, rx, rz, radius, wallsOnly);
        }
      }

      if (yNow >= 8.2 && Math.abs(nx) <= 34 && nz <= -13) {
        rx = THREE.MathUtils.clamp(rx, -29.8, 29.8);
        rz = THREE.MathUtils.clamp(rz, -38.0, -17.6);
        return resolveList(floor3Colliders, rx, rz, radius, wallsOnly);
      }

      // Town Multi-Storey Interiors (Montieri Hotel 2F/3F & Wallflour Bakery 2F)
      if (townMod && typeof townMod.resolveUpperCollision === 'function' && yNow >= 2.2) {
        const upTown = townMod.resolveUpperCollision(rx, rz, radius, yNow);
        if (upTown) return upTown;
      }

      if (yNow >= 3.2 && Math.abs(nx) <= 34 && nz <= -12) {
        rx = THREE.MathUtils.clamp(rx, -29.8, 29.8);
        rz = THREE.MathUtils.clamp(rz, -38.0, -14.8);
        return resolveList(floor2Colliders, rx, rz, radius, wallsOnly);
      }

      let res = resolveList(sharedColliders, rx, rz, radius, wallsOnly);
      res = resolveList(floor1Colliders, res.x, res.z, radius, wallsOnly);
      if (wallsOnly) return res;

      if (townMod) {
        if (Array.isArray(townMod.vehicles)) {
          for (let v = 0; v < townMod.vehicles.length; v++) {
            const vh = townMod.vehicles[v];
            if (cfg.ignoreEntityId && vh.id === cfg.ignoreEntityId) continue;
            const dx = res.x - vh.x;
            const dz = res.z - vh.z;
            const minDist = (vh.radius || 1.4) + radius;
            const dSq = dx * dx + dz * dz;
            if (dSq < minDist * minDist && dSq > 0.0001) {
              const dist = Math.sqrt(dSq);
              res.x = vh.x + (dx / dist) * minDist;
              res.z = vh.z + (dz / dist) * minDist;
            }
          }
        }
        if (Array.isArray(townMod.cruisers)) {
          for (let c = 0; c < townMod.cruisers.length; c++) {
            const cr = townMod.cruisers[c];
            const dx = res.x - cr.x;
            const dz = res.z - cr.z;
            const minDist = (cr.radius || 1.5) + radius;
            const dSq = dx * dx + dz * dz;
            if (dSq < minDist * minDist && dSq > 0.0001) {
              const dist = Math.sqrt(dSq);
              res.x = cr.x + (dx / dist) * minDist;
              res.z = cr.z + (dz / dist) * minDist;
            }
          }
        }
        if (Array.isArray(townMod.horses)) {
          for (let h = 0; h < townMod.horses.length; h++) {
            const hr = townMod.horses[h];
            if (cfg.ignoreEntityId && hr.id === cfg.ignoreEntityId) continue;
            const dx = res.x - hr.x;
            const dz = res.z - hr.z;
            const minDist = (hr.radius || 0.85) + radius;
            const dSq = dx * dx + dz * dz;
            if (dSq < minDist * minDist && dSq > 0.0001) {
              const dist = Math.sqrt(dSq);
              res.x = hr.x + (dx / dist) * minDist;
              res.z = hr.z + (dz / dist) * minDist;
            }
          }
        }
        if (cfg.excludePools && Array.isArray(townMod.poolZones)) {
          for (let p = 0; p < townMod.poolZones.length; p++) {
            const pz = townMod.poolZones[p];
            const cx = THREE.MathUtils.clamp(res.x, pz.minX, pz.maxX);
            const cz = THREE.MathUtils.clamp(res.z, pz.minZ, pz.maxZ);
            const dx = res.x - cx;
            const dz = res.z - cz;
            const dSq = dx * dx + dz * dz;
            if (dSq < radius * radius) {
              if (dSq > 0.00001) {
                const dist = Math.sqrt(dSq);
                res.x = cx + (dx / dist) * radius;
                res.z = cz + (dz / dist) * radius;
              } else {
                const pL = res.x - pz.minX;
                const pR = pz.maxX - res.x;
                const pT = res.z - pz.minZ;
                const pB = pz.maxZ - res.z;
                const mP = Math.min(pL, pR, pT, pB);
                if (mP === pL) res.x = pz.minX - radius;
                else if (mP === pR) res.x = pz.maxX + radius;
                else if (mP === pT) res.z = pz.minZ - radius;
                else res.z = pz.maxZ + radius;
              }
            }
          }
        }
      }

      return res;
    }

    function resolveCollision(nx, nz, radius, currentY, opts) {
      const cfg = opts || {};
      if (typeof cfg.prevX === 'number' && typeof cfg.prevZ === 'number') {
        const dx = nx - cfg.prevX;
        const dz = nz - cfg.prevZ;
        const moveDist = Math.hypot(dx, dz);
        if (moveDist > 0.16 && moveDist < 6.0) {
          const steps = Math.min(16, Math.ceil(moveDist / 0.15));
          let cur = { x: cfg.prevX, z: cfg.prevZ };
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const stepX = cfg.prevX + dx * t;
            const stepZ = cfg.prevZ + dz * t;
            // Blend toward target constrained by prior resolved position so walls never get tunneled
            const nextCandX = s === 1 ? stepX : cur.x + (stepX - (cfg.prevX + dx * ((s - 1) / steps)));
            const nextCandZ = s === 1 ? stepZ : cur.z + (stepZ - (cfg.prevZ + dz * ((s - 1) / steps)));
            cur = resolveSingleStepCollision(nextCandX, nextCandZ, radius, currentY, cfg);
          }
          return cur;
        }
      }
      return resolveSingleStepCollision(nx, nz, radius, currentY, cfg);
    }

    function hasBlockedSegment(x0, z0, x1, z1, radius, currentY, wallsOnly) {
      const dist = Math.hypot(x1 - x0, z1 - z0);
      if (dist < 0.05) return false;
      const r = radius || 0.24;
      const yNow = typeof currentY === 'number' ? currentY : 0;
      const steps = Math.max(2, Math.ceil(dist / 0.22));
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const px = x0 + (x1 - x0) * t;
        const pz = z0 + (z1 - z0) * t;
        const res = resolveSingleStepCollision(px, pz, r, yNow, { wallsOnly: Boolean(wallsOnly) });
        if (Math.hypot(res.x - px, res.z - pz) > 0.08) return true;
      }
      return false;
    }

    function isDrivableSurface(x, z, radius) {
      const r = typeof radius === 'number' ? radius : 0.4;
      // Explicitly keep cars OFF all 8 Versailles Parterre Grass Lawns
      for (let p = 0; p < parterreBeds.length; p++) {
        const pb = parterreBeds[p];
        if (Math.abs(x - pb.x) < pb.w * 0.5 + r && Math.abs(z - pb.z) < pb.d * 0.5 + r) {
          return false;
        }
      }
      // Waterfront Riviera Boulevard (z = 48.0, width 5.6 + curb lip)
      if (x >= -158.0 && x <= 158.0 && z >= 44.8 && z <= 50.8) return true;
      // Château Side Lanes (x = -44.0 and x = 44.0)
      if ((Math.abs(x - -44.0) <= 3.0 || Math.abs(x - 44.0) <= 3.0) && z >= -26.5 && z <= 50.5) return true;
      // West & East Auto Pavilions & connecting gravel apron
      if ((x >= -44.8 && x <= -33.2 && z >= -27.2 && z <= -13.0) || (x >= 33.2 && x <= 44.8 && z >= -27.2 && z <= -13.0)) return true;
      // Château Gravel Courtyard (x in [-41, 41], z in [-14.2, 44.6], parterres already excluded above)
      if (x >= -41.5 && x <= 41.5 && z >= -14.2 && z <= 44.8) return true;
      // West Willow Creek Streets & Driveways
      if (x >= -156.5 && x <= -41.0) {
        if (Math.abs(z - -10.5) <= 2.6 || Math.abs(z - 0.0) <= 2.6 || Math.abs(z - 19.2) <= 2.5) return true;
        if (Math.abs(x - -67.0) <= 2.5 && z >= -42.0 && z <= 50.5) return true;
        if (Math.abs(x - -95.0) <= 2.6 && z >= -13.0 && z <= 50.5) return true;
        if (Math.abs(x - -123.5) <= 2.6 && z >= -13.0 && z <= 50.5) return true;
        if (Math.abs(x - -153.5) <= 2.5 && z >= -42.0 && z <= 50.5) return true;
        // 3-Bed Family House driveways connecting East into -67 / -95 streets
        if (x >= -75.0 && x <= -64.5 && ((z >= 10.6 && z <= 15.6) || (z >= 29.3 && z <= 34.3))) return true;
        if (x >= -103.0 && x <= -92.5 && ((z >= 10.6 && z <= 15.6) || (z >= 29.3 && z <= 34.3))) return true;
        // Stone Mansionette driveways connecting South into z = -10.5 street
        if (((x >= -78.2 && x <= -72.6) || (x >= -110.2 && x <= -104.6)) && z >= -17.2 && z <= -8.0) return true;
      }
      // East Campus, Hospital & Hôtel Montieri Streets & Paved Courtyards
      if (x >= 41.0 && x <= 159.5) {
        if (Math.abs(z - -10.5) <= 2.6 || Math.abs(z - 0.0) <= 2.6 || Math.abs(z - 19.2) <= 2.5) return true;
        if (Math.abs(x - 67.0) <= 2.5 && z >= -42.0 && z <= 50.5) return true;
        if (Math.abs(x - 92.5) <= 2.6 && z >= -42.0 && z <= 50.5) return true;
        if (Math.abs(x - 120.5) <= 2.6 && z >= -42.0 && z <= 50.5) return true;
        if (Math.abs(x - 156.5) <= 2.5 && z >= -42.0 && z <= 50.5) return true;
        // Hospital Ambulance Apron & Front Pull-up
        if (x >= 83.2 && x <= 90.0 && z >= -17.8 && z <= -8.0) return true;
        // Hôtel Montieri Cobblestone Valet Courtyard (connects cleanly at x = 120.5)
        if (x >= 118.0 && x <= 133.2 && z >= 3.4 && z <= 16.2) return true;
      }
      return false;
    }

    function snapToDrivableSurface(x, z) {
      if (isDrivableSurface(x, z, 0.3)) return { x: x, z: z };
      let best = null;
      let bestDistSq = Infinity;
      const roadZs = [48.0, 19.2, 0.0, -10.5];
      const roadXs = [-153.5, -123.5, -95.0, -67.0, -44.0, 44.0, 67.0, 92.5, 120.5, 156.5];
      for (let i = 0; i < roadZs.length; i++) {
        const rz = roadZs[i];
        const rx = THREE.MathUtils.clamp(x, -154.0, 156.0);
        if (isDrivableSurface(rx, rz, 0.2)) {
          const dSq = (rx - x) * (rx - x) + (rz - z) * (rz - z);
          if (dSq < bestDistSq) { bestDistSq = dSq; best = { x: rx, z: rz }; }
        }
      }
      for (let j = 0; j < roadXs.length; j++) {
        const rx = roadXs[j];
        const minZ = (rx === -95.0 || rx === -123.5) ? -10.5 : (Math.abs(rx) === 44.0 ? -22.5 : -38.0);
        const rz = THREE.MathUtils.clamp(z, minZ, 48.0);
        if (isDrivableSurface(rx, rz, 0.2)) {
          const dSq = (rx - x) * (rx - x) + (rz - z) * (rz - z);
          if (dSq < bestDistSq) { bestDistSq = dSq; best = { x: rx, z: rz }; }
        }
      }
      if (Math.abs(x) <= 38 && z >= -14 && z <= 44) {
        const candPts = [[0, 6.2], [0, 20.0], [0, 36.5], [-20.0, 36.5], [20.0, 36.5], [-6.5, 18.0], [6.5, 18.0]];
        for (let k = 0; k < candPts.length; k++) {
          const cx = candPts[k][0];
          const cz = candPts[k][1];
          const dSq = (cx - x) * (cx - x) + (cz - z) * (cz - z);
          if (dSq < bestDistSq) { bestDistSq = dSq; best = { x: cx, z: cz }; }
        }
      }
      return best || { x: 0, z: 48.0 };
    }

    // Helper: Partition Wall along X (z = const, x from x0..x1) with optional centered doorway gap
    function addWallX(group, colList, floorY, wallH, z, x0, x1, doorCenter, doorW, thick, mat, castShadow) {
      const t = thick || 0.34;
      const wMat = mat || ivoryMat;
      const doCast = Boolean(castShadow);
      if (typeof doorCenter === 'number' && doorW > 0) {
        const g0 = doorCenter - doorW * 0.5;
        const g1 = doorCenter + doorW * 0.5;
        if (g0 - x0 > 0.15) {
          const wA = g0 - x0;
          const cxA = x0 + wA * 0.5;
          const mA = new THREE.Mesh(new THREE.BoxGeometry(wA, wallH, t), wMat);
          mA.position.set(cxA, floorY + wallH * 0.5, z);
          mA.castShadow = doCast;
          mA.receiveShadow = true;
          group.add(mA);
          addBox(colList, cxA, z, wA, t + 0.1, true);
        }
        if (x1 - g1 > 0.15) {
          const wB = x1 - g1;
          const cxB = g1 + wB * 0.5;
          const mB = new THREE.Mesh(new THREE.BoxGeometry(wB, wallH, t), wMat);
          mB.position.set(cxB, floorY + wallH * 0.5, z);
          mB.castShadow = doCast;
          mB.receiveShadow = true;
          group.add(mB);
          addBox(colList, cxB, z, wB, t + 0.1, true);
        }
        // Overhead doorway lintel
        const lintelH = Math.max(0.5, wallH - 2.6);
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorW, lintelH, t), goldMatteMat);
        lintel.position.set(doorCenter, floorY + wallH - lintelH * 0.5, z);
        lintel.castShadow = doCast;
        group.add(lintel);
      } else {
        const wAll = Math.abs(x1 - x0);
        const cxAll = (x0 + x1) * 0.5;
        const mAll = new THREE.Mesh(new THREE.BoxGeometry(wAll, wallH, t), wMat);
        mAll.position.set(cxAll, floorY + wallH * 0.5, z);
        mAll.castShadow = doCast;
        mAll.receiveShadow = true;
        group.add(mAll);
        addBox(colList, cxAll, z, wAll, t + 0.1, true);
      }
    }

    // Helper: Partition Wall along Z (x = const, z from z0..z1 where z0 < z1) with optional doorway
    function addWallZ(group, colList, floorY, wallH, x, z0, z1, doorCenter, doorW, thick, mat, castShadow) {
      const t = thick || 0.34;
      const wMat = mat || ivoryMat;
      const doCast = Boolean(castShadow);
      const lo = Math.min(z0, z1);
      const hi = Math.max(z0, z1);
      if (typeof doorCenter === 'number' && doorW > 0) {
        const g0 = doorCenter - doorW * 0.5;
        const g1 = doorCenter + doorW * 0.5;
        if (g0 - lo > 0.15) {
          const dA = g0 - lo;
          const czA = lo + dA * 0.5;
          const mA = new THREE.Mesh(new THREE.BoxGeometry(t, wallH, dA), wMat);
          mA.position.set(x, floorY + wallH * 0.5, czA);
          mA.castShadow = doCast;
          mA.receiveShadow = true;
          group.add(mA);
          addBox(colList, x, czA, t + 0.1, dA, true);
        }
        if (hi - g1 > 0.15) {
          const dB = hi - g1;
          const czB = g1 + dB * 0.5;
          const mB = new THREE.Mesh(new THREE.BoxGeometry(t, wallH, dB), wMat);
          mB.position.set(x, floorY + wallH * 0.5, czB);
          mB.castShadow = doCast;
          mB.receiveShadow = true;
          group.add(mB);
          addBox(colList, x, czB, t + 0.1, dB, true);
        }
        const lintelH = Math.max(0.5, wallH - 2.6);
        const lintel = new THREE.Mesh(new THREE.BoxGeometry(t, lintelH, doorW), goldMatteMat);
        lintel.position.set(x, floorY + wallH - lintelH * 0.5, doorCenter);
        lintel.castShadow = doCast;
        group.add(lintel);
      } else {
        const dAll = hi - lo;
        const czAll = (lo + hi) * 0.5;
        const mAll = new THREE.Mesh(new THREE.BoxGeometry(t, wallH, dAll), wMat);
        mAll.position.set(x, floorY + wallH * 0.5, czAll);
        mAll.castShadow = doCast;
        mAll.receiveShadow = true;
        group.add(mAll);
        addBox(colList, x, czAll, t + 0.1, dAll, true);
      }
    }

    // Helper: Place & Register Interactive Furniture cleanly across all 3 Palace Floors & 10 Cottages
    function placeBed(parent, colList, opts) {
      if (!kit) return;
      const isCottage = Boolean(opts.cottage);
      const wBed = opts.w || (isCottage ? 1.75 : 2.35);
      const dBed = opts.d || (isCottage ? 2.35 : 2.95);
      const mesh = kit.buildBed({
        tone: opts.tone,
        canopy: opts.canopy,
        cottage: isCottage,
        circularRug: opts.circularRug,
        interactId: opts.id,
        w: wBed,
        d: dBed,
        noSideTable: opts.noSideTable,
      });
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.y = opts.yaw || 0;
      parent.add(mesh);
      tagInteractable(mesh, opts.id);
      if (colList) {
        const rotated = opts.yaw && Math.abs(Math.sin(opts.yaw)) > 0.5;
        const bw = (rotated ? dBed : wBed) * 0.86;
        const bd = (rotated ? wBed : dBed) * 0.88;
        addBox(colList, opts.x, opts.z, bw, bd);
      }

      // Align head precisely centered on the sculpted pillow (-0.36 * dBed) while lying smoothly inside hollow duvet
      const sleepLz = Math.min(dBed * 0.45, -dBed * 0.36 + 1.71);
      const sleepPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, sleepLz);
      const exitLx = typeof opts.exitSide === 'number' ? opts.exitSide : -(wBed * 0.5 + 0.62);
      const exitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, exitLx, 0.25);
      const mattY = opts.y + 0.58;

      registerSpot({
        id: opts.id,
        title: opts.title,
        floor: opts.floor,
        category: isCottage ? 'cottages' : 'bedrooms',
        shortcut: opts.shortcut,
        x: opts.x,
        y: opts.y,
        z: opts.z,
        radius: 4.8,
        actions: [
          {
            id: opts.id + '_sleep',
            label: 'Get In Bed & Sleep (' + opts.title + ')',
            hint: '+14 Energy/s & +4 Poise/s',
            pose: 'sleep',
            anchor: {
              x: sleepPos.x, y: mattY, z: sleepPos.z, yaw: opts.yaw || 0, rigOffsetY: 0.09,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: (opts.yaw || 0) - Math.PI * 0.5,
            },
            rates: { energy: 14, composure: 4 },
            statusText: 'Sleeping tucked inside ' + opts.title + '...',
          },
          {
            id: opts.id + '_nap',
            label: 'Take Quick Nap',
            hint: '+11 Energy/s',
            pose: 'nap',
            anchor: {
              x: sleepPos.x, y: mattY, z: sleepPos.z, yaw: opts.yaw || 0, rigOffsetY: 0.09,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: (opts.yaw || 0) - Math.PI * 0.5,
            },
            rates: { energy: 11, composure: 2.5 },
            statusText: 'Napping comfortably in ' + opts.title + '...',
          },
          {
            id: opts.id + '_daydream',
            label: 'Lounge & Daydream Atop Covers',
            hint: '+8 Fun/s & +5 Energy/s',
            pose: 'daydream',
            anchor: {
              x: sleepPos.x, y: mattY, z: sleepPos.z, yaw: opts.yaw || 0, rigOffsetY: 0.35,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: (opts.yaw || 0) - Math.PI * 0.5,
            },
            rates: { fun: 8, energy: 5, composure: 3 },
            statusText: 'Lounging atop ' + opts.title + '...',
          },
          {
            id: opts.id + '_full',
            label: 'Sleep Until Morning (Rest 100%)',
            hint: 'Advance +6 hrs & fill Energy',
            instant: true,
            onInstant: function (ctx) {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 100, composure: 22 });
              if (ctx.game && ctx.game.world) ctx.game.world.hour = ((ctx.game.world.hour || 10) + 6) % 24;
              ctx.startPose({
                pose: 'sleep',
                label: 'Beauty Sleep',
                statusText: 'Waking refreshed in ' + opts.title,
                anchor: {
                  x: sleepPos.x, y: mattY, z: sleepPos.z, yaw: opts.yaw || 0, rigOffsetY: 0.09,
                  floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: (opts.yaw || 0) - Math.PI * 0.5,
                },
                rates: { energy: 4, composure: 2 },
              });
            },
          },
        ],
      });
    }

    function placeToilet(parent, colList, opts) {
      if (!kit) return;
      const mesh = kit.buildToilet(opts.id, opts.rustic);
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.y = opts.yaw || 0;
      parent.add(mesh);
      tagInteractable(mesh, opts.id);
      if (colList) addCircle(colList, opts.x, opts.z, 0.36);

      const sitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 0.08);
      const exitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 0.92);

      registerSpot({
        id: opts.id,
        title: opts.title,
        floor: opts.floor,
        category: 'toilets',
        shortcut: opts.shortcut,
        x: opts.x,
        y: opts.y,
        z: opts.z,
        radius: 3.0,
        actions: [
          {
            id: opts.id + '_use',
            label: 'Use ' + opts.title,
            hint: 'Relieves Hygiene & +6 Poise/s',
            pose: 'toilet',
            anchor: {
              x: sitPos.x, y: opts.y + 0.1, z: sitPos.z, yaw: opts.yaw || 0, rigOffsetY: -0.45,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: opts.yaw || 0,
            },
            rates: { hygiene: 12, composure: 6 },
            statusText: 'Using ' + opts.title + ' (privacy restored)...',
          },
        ],
      });
    }

    function placeVanitySink(parent, colList, opts) {
      if (!kit) return;
      const mesh = kit.buildVanitySink(opts.id, opts.rustic, opts.style);
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.y = opts.yaw || 0;
      parent.add(mesh);
      tagInteractable(mesh, opts.id);
      if (colList) {
        const rotated = opts.yaw && Math.abs(Math.sin(opts.yaw)) > 0.5;
        const vw = opts.style ? 1.88 : 0.95;
        const vd = 0.66;
        addBox(colList, opts.x, opts.z, rotated ? vd : vw, rotated ? vw : vd);
      }

      const standPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 0.72);
      registerSpot({
        id: opts.id,
        title: opts.title,
        floor: opts.floor,
        category: 'toilets',
        x: opts.x,
        y: opts.y,
        z: opts.z,
        radius: 3.0,
        actions: [
          {
            id: opts.id + '_wash',
            label: 'Wash Hands & Splash Face',
            hint: '+15 Hygiene/s & +8 Poise/s',
            pose: 'wash',
            anchor: {
              x: standPos.x, y: opts.y, z: standPos.z, yaw: (opts.yaw || 0) + Math.PI,
              floorY: opts.y, exitX: standPos.x, exitZ: standPos.z, exitYaw: (opts.yaw || 0) + Math.PI,
            },
            rates: { hygiene: 15, composure: 8 },
            statusText: 'Washing hands with rosewater soap...',
          },
        ],
      });
    }

    function placeSofa(parent, colList, opts) {
      if (!kit) return;
      const mesh = kit.buildSofa({ tone: opts.tone, w: opts.w, cottage: opts.cottage, interactId: opts.id });
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.y = opts.yaw || 0;
      parent.add(mesh);
      tagInteractable(mesh, opts.id);
      if (colList) {
        const horiz = Math.abs(Math.cos(opts.yaw || 0)) > 0.5;
        addBox(colList, opts.x, opts.z, horiz ? (opts.w || 2.5) * 0.9 : 0.95, horiz ? 0.95 : (opts.w || 2.5) * 0.9);
      }
      const sitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 0.08);
      const exitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 1.05);
      registerSpot({
        id: opts.id,
        title: opts.title,
        floor: opts.floor,
        category: 'living',
        shortcut: opts.shortcut,
        x: opts.x,
        y: opts.y,
        z: opts.z,
        radius: 3.4,
        actions: [
          {
            id: opts.id + '_lounge',
            label: 'Lounge on ' + opts.title,
            hint: '+10 Energy/s & +8 Fun/s',
            pose: 'sofa',
            anchor: {
              x: sitPos.x, y: opts.y + 0.08, z: sitPos.z, yaw: opts.yaw || 0, rigOffsetY: -0.45,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: opts.yaw || 0,
            },
            rates: { energy: 10, fun: 8, composure: 6 },
            statusText: 'Relaxing on ' + opts.title + '...',
          },
          {
            id: opts.id + '_read_sofa',
            label: 'Hold Book & Read on ' + opts.title,
            hint: '+11 Poise/s & +10 Fun/s',
            pose: 'sit_read',
            anchor: {
              x: sitPos.x, y: opts.y + 0.08, z: sitPos.z, yaw: opts.yaw || 0, rigOffsetY: -0.45,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: opts.yaw || 0,
            },
            rates: { composure: 11, fun: 10, energy: 6 },
            statusText: 'Reading a gilded palace novel on ' + opts.title + '...',
          },
        ],
      });
    }

    function placeArmchair(parent, colList, opts) {
      if (!kit) return;
      const mesh = kit.buildArmchair({ tone: opts.tone, cottage: opts.cottage, ottoman: opts.ottoman, interactId: opts.id });
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.y = opts.yaw || 0;
      parent.add(mesh);
      tagInteractable(mesh, opts.id);
      if (colList) {
        addCircle(colList, opts.x, opts.z, 0.45);
        if (opts.ottoman) {
          const ottPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 0.86);
          addBox(colList, ottPos.x, ottPos.z, 0.68, 0.64);
        }
      }
      const sitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 0.06);
      const exitPos = opts.ottoman
        ? localToWorld(opts.x, opts.z, opts.yaw || 0, 0.78, 0.42)
        : localToWorld(opts.x, opts.z, opts.yaw || 0, 0, 0.96);
      registerSpot({
        id: opts.id,
        title: opts.title,
        floor: opts.floor,
        category: 'living',
        x: opts.x,
        y: opts.y,
        z: opts.z,
        radius: 3.0,
        actions: [
          {
            id: opts.id + '_sit_read',
            label: 'Hold Book & Read in ' + opts.title,
            hint: '+11 Poise/s & +9 Fun/s',
            pose: 'sit_read',
            anchor: {
              x: sitPos.x, y: opts.y + 0.08, z: sitPos.z, yaw: opts.yaw || 0, rigOffsetY: -0.46,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: opts.yaw || 0,
            },
            rates: { composure: 11, fun: 9, energy: 6 },
            statusText: 'Holding an open book and reading in ' + opts.title + '...',
          },
          {
            id: opts.id + '_sit',
            label: 'Sit & Rest in ' + opts.title,
            hint: '+8 Energy/s & +7 Poise/s',
            pose: 'sit',
            anchor: {
              x: sitPos.x, y: opts.y + 0.08, z: sitPos.z, yaw: opts.yaw || 0, rigOffsetY: -0.46,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: opts.yaw || 0,
            },
            rates: { energy: 8, composure: 7, fun: 4 },
            statusText: 'Seated comfortably in ' + opts.title + '...',
          },
        ],
      });
    }

    function placeTub(parent, colList, opts) {
      if (!kit || typeof kit.buildBathtub !== 'function') return;
      const mesh = kit.buildBathtub(opts.id, opts.rustic, opts.style);
      const isBaroque = !opts.rustic && opts.style === 'baroque';
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.y = opts.yaw || 0;
      parent.add(mesh);
      tagInteractable(mesh, opts.id);
      if (colList) {
        const horiz = Math.abs(Math.cos(opts.yaw || 0)) > 0.5;
        addBox(colList, opts.x, opts.z, horiz ? 1.78 : 0.98, horiz ? 0.98 : 1.78);
      }
      const exitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0, opts.exitZOffset || -1.0);
      registerSpot({
        id: opts.id,
        title: opts.title,
        floor: opts.floor || 0,
        category: opts.category || 'toilets',
        shortcut: Boolean(opts.shortcut),
        x: opts.x, y: opts.y, z: opts.z,
        radius: 3.0,
        actions: [
          {
            id: opts.id + '_soak',
            label: 'Soak in Warm Bubble Bath',
            hint: '+16 Hygiene/s & +7 Poise/s',
            pose: 'bath',
            anchor: {
              x: opts.x, y: opts.y + (isBaroque ? 0.42 : 0.25), z: opts.z, yaw: opts.yaw || 0, rigOffsetY: -0.5,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: opts.yaw || 0,
            },
            rates: { hygiene: 16, composure: 7, fun: 5 },
            statusText: 'Soaking warmly inside ' + opts.title + '...',
          },
        ],
      });
    }

    function placeShower(parent, colList, opts) {
      if (!kit || typeof kit.buildShowerCubicle !== 'function') return;
      const mesh = kit.buildShowerCubicle(opts.id, opts.rustic);
      mesh.position.set(opts.x, opts.y, opts.z);
      mesh.rotation.y = opts.yaw || 0;
      parent.add(mesh);
      tagInteractable(mesh, opts.id);
      if (colList) addBox(colList, opts.x, opts.z, 1.38, 1.38);
      const exitPos = localToWorld(opts.x, opts.z, opts.yaw || 0, 0.85, 0.85);
      registerSpot({
        id: opts.id,
        title: opts.title,
        floor: opts.floor || 0,
        category: opts.category || 'toilets',
        shortcut: Boolean(opts.shortcut),
        x: opts.x, y: opts.y, z: opts.z,
        radius: 3.0,
        actions: [
          {
            id: opts.id + '_shower',
            label: 'Take Warm Rain Shower',
            hint: '+18 Hygiene/s & +5 Energy/s',
            pose: 'shower',
            anchor: {
              x: opts.x, y: opts.y + 0.06, z: opts.z, yaw: opts.yaw || 0,
              floorY: opts.y, exitX: exitPos.x, exitZ: exitPos.z, exitYaw: opts.yaw || 0,
            },
            rates: { hygiene: 18, energy: 5, composure: 4 },
            statusText: 'Refreshing inside ' + opts.title + '...',
          },
        ],
      });
    }

    // -----------------------------------------------------------
    // 1. ESTATE GROUNDS, HILLS, COASTAL QUAY & COMMONERS' VILLAGES
    // -----------------------------------------------------------
    const grounds = new THREE.Mesh(new THREE.PlaneGeometry(640, 420), grassMat);
    grounds.rotation.x = -Math.PI / 2;
    grounds.position.set(0, 0, -35);
    grounds.receiveShadow = true;
    scene.add(grounds);

    const courtyardPaving = new THREE.Mesh(new THREE.PlaneGeometry(76, 58), gravelMat);
    courtyardPaving.rotation.x = -Math.PI / 2;
    courtyardPaving.position.set(0, 0.02, 12);
    courtyardPaving.receiveShadow = true;
    scene.add(courtyardPaving);

    // Sims-4 Curbed Paved Waterfront Boulevard + Raised Stone Sidewalk + Centerline
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x3b404b, roughness: 0.86 });
    const curbStoneMat = new THREE.MeshStandardMaterial({ color: 0xded6c8, roughness: 0.68 });
    const stripeMat = new THREE.MeshBasicMaterial({ color: 0xf9f3e3 });
    const eastWestRoad = new THREE.Mesh(new THREE.PlaneGeometry(340, 5.6), roadMat);
    eastWestRoad.rotation.x = -Math.PI / 2;
    eastWestRoad.position.set(0, 0.028, 48.0);
    eastWestRoad.receiveShadow = true;
    scene.add(eastWestRoad);

    [-45.0, 51.1].forEach(function (swZ, si) {
      const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(340, 0.08, si === 0 ? 1.2 : 1.6), curbStoneMat);
      sidewalk.position.set(0, 0.04, si === 0 ? 44.7 : 51.5);
      sidewalk.receiveShadow = true;
      scene.add(sidewalk);
    });
    const roadDashSpecs = [];
    for (let sx = -152; sx <= 152; sx += 6) {
      roadDashSpecs.push([sx, 48.0, 2.6, 0.14]);
    }

    [-44, 44].forEach(function (laneX) {
      const sideLane = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 62), roadMat);
      sideLane.rotation.x = -Math.PI / 2;
      sideLane.position.set(laneX, 0.028, 17);
      sideLane.receiveShadow = true;
      scene.add(sideLane);
      for (let sz = -11; sz <= 44; sz += 6) {
        roadDashSpecs.push([laneX, sz, 0.14, 2.4]);
      }
      [-2.85, 2.85].forEach(function (offX) {
        const curb = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.07, 56), curbStoneMat);
        curb.position.set(laneX + offX, 0.035, 19);
        scene.add(curb);
      });
    });

    if (roadDashSpecs.length) {
      const rdDummy = new THREE.Object3D();
      const rdInst = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), stripeMat, roadDashSpecs.length);
      for (let ri = 0; ri < roadDashSpecs.length; ri++) {
        const sp = roadDashSpecs[ri];
        rdDummy.position.set(sp[0], 0.034, sp[1]);
        rdDummy.rotation.set(-Math.PI / 2, 0, 0);
        rdDummy.scale.set(sp[2], sp[3], 1);
        rdDummy.updateMatrix();
        rdInst.setMatrixAt(ri, rdDummy.matrix);
      }
      rdInst.computeBoundingSphere();
      scene.add(rdInst);
    }

    const centralAvenue = new THREE.Mesh(new THREE.PlaneGeometry(9.0, 48), gravelMat);
    centralAvenue.rotation.x = -Math.PI / 2;
    centralAvenue.position.set(0, 0.025, 24);
    scene.add(centralAvenue);

    // Riviera Golden Sandy Beach + Timber Yacht Pier + Moored Royal Yacht!
    const sandMat = new THREE.MeshStandardMaterial({ color: 0xeed9b0, roughness: 0.9 });
    const beachStrip = new THREE.Mesh(new THREE.BoxGeometry(360, 0.42, 7.6), sandMat);
    beachStrip.position.set(0, -0.18, 55.8);
    beachStrip.receiveShadow = true;
    scene.add(beachStrip);

    const timberPierMat = new THREE.MeshStandardMaterial({ color: 0x8e6340, roughness: 0.78 });
    const yachtPier = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.24, 15.0), timberPierMat);
    yachtPier.position.set(0, 0.14, 59.5);
    yachtPier.receiveShadow = true;
    scene.add(yachtPier);
    const boatsList = [];
    if (kit) {
      const yacht = kit.buildRoyalYacht('riviera_royal_yacht');
      yacht.position.set(5.4, -0.42, 65.5);
      yacht.rotation.y = Math.PI * 0.42;
      yacht.userData.noMerge = true;
      yacht.userData.noFreeze = true;
      scene.add(yacht);
      tagInteractable(yacht, 'riviera_royal_yacht');
      boatsList.push({
        id: 'riviera_royal_yacht',
        title: 'Riviera Royal Superyacht',
        isYacht: true,
        baseWaterY: -0.42,
        phase: 0.4,
        x: 5.4,
        z: 65.5,
        yaw: Math.PI * 0.42,
        group: yacht,
      });
      registerSpot({
        id: 'riviera_royal_yacht',
        title: 'Riviera Royal Superyacht',
        floor: 0,
        category: 'town',
        shortcut: true,
        x: 3.0, y: 0.14, z: 65.5,
        radius: 6.8,
        actions: [
          {
            id: 'yacht_pilot',
            label: 'Pilot Royal Superyacht Across Ocean',
            hint: 'Sail anywhere along Riviera Bay with stick or WASD!',
            type: 'board_boat',
            boatId: 'riviera_royal_yacht',
          },
          {
            id: 'yacht_cruise',
            label: 'Champagne Sun Deck Party (₡80)',
            hint: '+30 Fun, +20 Poise & +4 Crown Dispatch Clout',
            instant: true,
            onInstant: function (ctx) {
              if (ctx.game && (ctx.game.money || 0) < 80) return ctx.toast('Need ₡80 Crowns.');
              if (ctx.game) ctx.game.money -= 80;
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 30, composure: 20 });
              if (ctx.game && ctx.game.reputation) ctx.game.reputation.clout = Math.min(100, (ctx.game.reputation.clout || 50) + 4);
              ctx.toast('Sailing past the Riviera coast in champagne splendor! (+30 Fun)');
            },
          },
        ],
      });

      // Interactive Wooden Rowboats along Riviera Beach
      [
        { id: 'riviera_rowboat_west', title: 'Ivory Cedar Rowboat (West)', x: -14, z: 61.2, yaw: 0.15, hull: 0xf6efe2, phase: 0.8 },
        { id: 'riviera_rowboat_east', title: 'Sapphire Cedar Rowboat (East)', x: 15, z: 61.2, yaw: -0.18, hull: 0x2a5c8a, phase: 2.1 },
        { id: 'riviera_rowboat_villa', title: 'Crimson Riviera Rowboat (Villa Shore)', x: 79.6, z: 61.2, yaw: 0.08, hull: 0x9e2b3e, phase: 3.4 },
      ].forEach(function (rbCfg) {
        if (typeof kit.buildRowboat !== 'function') return;
        const rb = kit.buildRowboat(rbCfg.hull, rbCfg.id);
        rb.position.set(rbCfg.x, -0.40, rbCfg.z);
        rb.rotation.y = rbCfg.yaw;
        rb.userData.noMerge = true;
        rb.userData.noFreeze = true;
        scene.add(rb);
        tagInteractable(rb, rbCfg.id);
        boatsList.push({
          id: rbCfg.id,
          title: rbCfg.title,
          isYacht: false,
          baseWaterY: -0.40,
          phase: rbCfg.phase,
          x: rbCfg.x,
          z: rbCfg.z,
          yaw: rbCfg.yaw,
          group: rb,
        });
        registerSpot({
          id: rbCfg.id,
          title: rbCfg.title,
          floor: 0,
          category: 'town',
          shortcut: rbCfg.id === 'riviera_rowboat_west',
          x: rbCfg.x, y: 0.03, z: rbCfg.z - 2.0,
          radius: 4.8,
          actions: [
            {
              id: 'row_' + rbCfg.id,
              label: 'Row Boat Across Ocean',
              hint: '+Fun & real oar-rowing across Riviera Bay!',
              type: 'board_boat',
              boatId: rbCfg.id,
            },
            {
              id: 'swim_from_' + rbCfg.id,
              label: 'Swim Into Riviera Ocean From Shore',
              hint: 'Changes into swimwear automatically — swim freely!',
              instant: true,
              onInstant: function (actCtx) {
                if (actCtx && actCtx.playerCtrl) {
                  actCtx.playerCtrl.teleport(rbCfg.x + 2.4, 62.6, 0, -0.35);
                  if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 12, hygiene: 10 });
                  actCtx.toast('Changed into swimwear and dove into Riviera Ocean!');
                }
              },
            },
          ],
        });
      });

      // Sims 4 Ocean Swim & Float Hotspot along the Riviera Sandy Shoreline
      registerSpot({
        id: 'riviera_ocean_swim',
        title: 'Riviera Ocean Shoreline',
        floor: 0,
        category: 'town',
        shortcut: true,
        x: 0, y: 0.03, z: 60.5,
        bounds: { minX: -145, maxX: 145, minZ: 58.6, maxZ: 74 },
        radius: 3.0,
        actions: [
          {
            id: 'ocean_swim_laps',
            label: 'Swim Laps in Riviera Ocean',
            hint: '+18 Fun/s & +12 Hygiene/s (switches into swimwear!)',
            instant: true,
            onInstant: function (actCtx) {
              if (actCtx && actCtx.playerCtrl) {
                const pxNow = actCtx.playerCtrl.actor.root.position.x || 8;
                actCtx.playerCtrl.teleport(pxNow, 63.2, 0, -0.35);
                if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 14, hygiene: 10 });
                actCtx.toast('Swimming in Riviera Ocean! Move with stick/WASD.');
              }
            },
          },
          {
            id: 'ocean_back_float',
            label: 'Float on Back Under Sun',
            hint: '+14 Energy/s, +16 Fun/s & +10 Poise/s',
            pose: 'swim_float',
            anchor: { x: 8, y: -0.35, z: 64.5, yaw: 0, rigOffsetY: 0.08, floorY: -0.35, exitX: 8, exitZ: 57.6, exitYaw: Math.PI },
            rates: { energy: 14, fun: 16, composure: 10, hygiene: 10 },
            statusText: 'Floating peacefully on the warm Riviera waves...',
          },
          {
            id: 'ocean_splash_play',
            label: 'Splash & Play in the Waves',
            hint: '+22 Fun/s & +12 Hygiene/s',
            pose: 'swim_splash',
            anchor: { x: 5.5, y: -0.35, z: 61.8, yaw: Math.PI, rigOffsetY: -0.45, floorY: -0.35, exitX: 5.5, exitZ: 57.6, exitYaw: Math.PI },
            rates: { fun: 22, hygiene: 12 },
            statusText: 'Splashing joyfully in the Riviera surf...',
          },
        ],
      });

      [-28, -14, 14, 28, 72, 92, -72, -92].forEach(function (bx, bi) {
        const bSet = kit.buildBeachUmbrellaSet(['rose', 'sapphire', 'champagne'][bi % 3], null);
        bSet.position.set(bx, 0.03, 55.2);
        bSet.rotation.y = Math.PI;
        scene.add(bSet);
      });
    }

    const seaMesh = new THREE.Mesh(new THREE.PlaneGeometry(720, 280, 36, 18), seaWaterMat);
    seaMesh.rotation.x = -Math.PI / 2;
    seaMesh.position.set(0, -0.45, 198);
    seaMesh.userData.noMerge = true;
    scene.add(seaMesh);

    const hillMatFar = new THREE.MeshStandardMaterial({ color: 0x4c7041, roughness: 0.92 });
    const hillMatMid = new THREE.MeshStandardMaterial({ color: 0x5c8549, roughness: 0.88 });
    [
      { x: -165, z: -92, rx: 74, ry: 22, rz: 50, mat: hillMatFar },
      { x: -64, z: -115, rx: 76, ry: 24, rz: 46, mat: hillMatFar },
      { x: 0, z: -125, rx: 84, ry: 22, rz: 44, mat: hillMatFar },
      { x: 64, z: -115, rx: 76, ry: 24, rz: 46, mat: hillMatFar },
      { x: 165, z: -92, rx: 74, ry: 22, rz: 50, mat: hillMatFar },
      { x: -182, z: -46, rx: 42, ry: 11.5, rz: 34, mat: hillMatMid },
      { x: 182, z: -48, rx: 42, ry: 11.5, rz: 34, mat: hillMatMid },
    ].forEach(function (h) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), h.mat);
      m.scale.set(h.rx, h.ry, h.rz);
      m.position.set(h.x, -0.2, h.z);
      scene.add(m);
    });

    // Distant Rival/Allied Royal Châteaux on Hills
    function buildDistantRoyalChateau(cx, baseY, cz, yawAngle, accentMat) {
      const g = new THREE.Group();
      g.position.set(cx, baseY, cz);
      g.rotation.y = yawAngle;
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(28, 2.2, 13), ivoryMat);
      plinth.position.y = 1.0;
      g.add(plinth);
      const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(24, 6.2, 10), wingFacadeMat);
      mainBlock.position.y = 5.1;
      g.add(mainBlock);
      const centerBody = new THREE.Mesh(new THREE.BoxGeometry(8.5, 7.6, 11.4), pavFacadeMat);
      centerBody.position.y = 5.8;
      g.add(centerBody);
      const centerMansard = new THREE.Mesh(new THREE.CylinderGeometry(4.4, 5.2, 3.6, 8), slateRoofMat);
      centerMansard.rotation.y = Math.PI / 8;
      centerMansard.position.y = 11.3;
      g.add(centerMansard);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.45, 2.2, 8), goldMat);
      spire.position.y = 14.1;
      g.add(spire);
      [-9.5, 9.5].forEach(function (px) {
        const pav = new THREE.Mesh(new THREE.BoxGeometry(5.6, 7.0, 11.0), pavFacadeMat);
        pav.position.set(px, 5.5, 0);
        g.add(pav);
        const roof = new THREE.Mesh(new THREE.SphereGeometry(3.2, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), slateRoofMat);
        roof.scale.set(1.0, 1.25, 1.0);
        roof.position.set(px, 9.0, 0);
        g.add(roof);
      });
      const banner = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.4, 2.2), accentMat);
      banner.position.set(0, 14.2, 0);
      g.add(banner);
      scene.add(g);
    }
    buildDistantRoyalChateau(-182, 10.2, -46, 0.55, crestMat);
    buildDistantRoyalChateau(182, 10.7, -48, -0.55, goldMat);

    // -----------------------------------------------------------
    // 1B. 10 ENTERABLE, FURNISHED COMMONERS' COTTAGES (WITH ENCLOSED BATHROOMS!) + OUTER HORIZON TOWN
    // -----------------------------------------------------------
    const cottageSpecs = [
      { id: 'cottage_1', title: 'Village Bakery Cottage', x: -50.8, z: 9.0, doorSide: 1, tone: 'champagne' },
      { id: 'cottage_2', title: 'Seamstress Townhouse', x: -50.8, z: 19.0, doorSide: 1, tone: 'rose' },
      { id: 'cottage_3', title: 'Cobbler Hearth Home', x: -50.8, z: 29.0, doorSide: 1, tone: 'rustic' },
      { id: 'cottage_4', title: 'Apothecary Cottage', x: -59.4, z: 14.0, doorSide: 1, tone: 'emerald' },
      { id: 'cottage_5', title: "Clocktower Keeper's House", x: -59.4, z: 34.0, doorSide: 1, tone: 'sapphire' },
      { id: 'cottage_6', title: 'Village Florist Cottage', x: 50.8, z: 9.0, doorSide: -1, tone: 'lavender' },
      { id: 'cottage_7', title: 'Harbor Tailor House', x: 50.8, z: 19.0, doorSide: -1, tone: 'rose' },
      { id: 'cottage_8', title: "Tavern Keeper's Cottage", x: 50.8, z: 29.0, doorSide: -1, tone: 'crimson' },
      { id: 'cottage_9', title: "Painter's Studio Cottage", x: 59.4, z: 14.0, doorSide: -1, tone: 'champagne' },
      { id: 'cottage_10', title: 'Fisherman Cottage', x: 59.4, z: 34.0, doorSide: -1, tone: 'sapphire' },
    ];

    cottageSpecs.forEach(function (c, idx) {
      const cw = 7.4;
      const cd = 6.8;
      const wallH = 3.15;
      const grp = new THREE.Group();
      scene.add(grp);

      // Warm Wooden Interior Plank Floor
      const floor = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.14, cd), cottageFloorMat);
      floor.position.set(c.x, 0.04, c.z);
      floor.receiveShadow = true;
      grp.add(floor);

      // Back Wall (away from street), North Wall, South Wall, and Front Doorway Wall!
      const frontX = c.x + c.doorSide * (cw * 0.5);
      const backX = c.x - c.doorSide * (cw * 0.5);
      addWallZ(grp, sharedColliders, 0, wallH, backX, c.z - cd * 0.5, c.z + cd * 0.5, null, 0, 0.28, cottageWallMat);
      addWallZ(grp, sharedColliders, 0, wallH, frontX, c.z - cd * 0.5, c.z + cd * 0.5, c.z, 2.2, 0.28, cottageWallMat);
      addWallX(grp, sharedColliders, 0, wallH, c.z - cd * 0.5, c.x - cw * 0.5, c.x + cw * 0.5, null, 0, 0.28, cottageWallMat);
      addWallX(grp, sharedColliders, 0, wallH, c.z + cd * 0.5, c.x - cw * 0.5, c.x + cw * 0.5, null, 0, 0.28, cottageWallMat);

      // Enclosed Partitioned Bathroom Corner inside every Cottage (Back-South Corner 2.9m x 2.8m with open doorway)
      const innerDir = -c.doorSide; // points toward back wall
      const bathDivX = c.x + innerDir * 0.85;
      const bathDivZ = c.z + 0.6;
      const xMinBath = Math.min(backX, bathDivX);
      const xMaxBath = Math.max(backX, bathDivX);
      addWallX(grp, sharedColliders, 0, wallH - 0.05, bathDivZ, xMinBath, xMaxBath, null, 0, 0.2, cottageWallMat);
      addWallZ(grp, sharedColliders, 0, wallH - 0.05, bathDivX, bathDivZ, c.z + cd * 0.5, c.z + 2.0, 1.35, 0.2, cottageWallMat);

      // Stone step at open front doorway
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 2.4), roadMat);
      step.position.set(frontX + c.doorSide * 0.3, 0.05, c.z);
      grp.add(step);

      // Cutaway Roof Group — Sims-4 Pitched Timber Gable Roof + Chimney + Shuttered Floral Windows!
      const roofGrp = new THREE.Group();
      if (kit && typeof kit.buildGableRoof === 'function') {
        const gableRoof = kit.buildGableRoof(cw, cd, 1.9, cottageRoofMat, ivoryMat, { chimney: true, dormer: idx % 2 === 0 });
        gableRoof.position.set(c.x, wallH - 0.02, c.z);
        gableRoof.rotation.y = c.doorSide > 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
        roofGrp.add(gableRoof);
        const wBox = kit.buildWindowBox(c.doorSide > 0 ? kit.palette.fabricColors.sapphire : kit.palette.fabricColors.rose);
        wBox.position.set(c.x, 1.65, c.z + cd * 0.5 + 0.16);
        grp.add(wBox);
      } else {
        const roofCone = new THREE.Mesh(new THREE.ConeGeometry(4.9, 2.3, 4), cottageRoofMat);
        roofCone.rotation.y = Math.PI * 0.25;
        roofCone.scale.set(1.06, 1, 1.0);
        roofCone.position.set(c.x, wallH + 1.15, c.z);
        roofGrp.add(roofCone);
      }
      grp.add(roofGrp);

      // Furnished Interior Inside Each Enterable Commoner Cottage:
      // 1) Cozy Cottage Bed (North-Back Zone)
      placeBed(grp, sharedColliders, {
        id: 'cot_bed_' + (idx + 1),
        title: c.title + ' Bed',
        floor: 0,
        shortcut: false,
        x: c.x + innerDir * 2.1,
        y: 0.08,
        z: c.z - 1.75,
        yaw: c.doorSide < 0 ? -Math.PI * 0.5 : Math.PI * 0.5,
        tone: c.tone,
        cottage: true,
        w: 1.55,
        d: 2.15,
        noSideTable: true,
      });

      // 2) Full Enclosed Bathroom (Toilet + Vanity Basin + Bathtub!)
      placeToilet(grp, sharedColliders, {
        id: 'cot_toilet_' + (idx + 1),
        title: c.title + ' Toilet',
        floor: 0,
        rustic: true,
        x: c.x + innerDir * 3.05,
        y: 0.08,
        z: c.z + 1.35,
        yaw: innerDir < 0 ? Math.PI * 0.5 : -Math.PI * 0.5,
      });
      placeVanitySink(grp, sharedColliders, {
        id: 'cot_sink_' + (idx + 1),
        title: c.title + ' Bathroom Sink',
        floor: 0,
        rustic: true,
        x: c.x + innerDir * 1.78,
        y: 0.08,
        z: c.z + 1.12,
        yaw: 0,
      });
      placeTub(grp, sharedColliders, {
        id: 'cot_tub_' + (idx + 1),
        title: c.title + ' Bathtub',
        floor: 0,
        category: 'cottages',
        rustic: true,
        x: c.x + innerDir * 2.35,
        y: 0.08,
        z: c.z + 2.75,
        yaw: 0,
        exitZOffset: -0.95,
      });

      // 3) Cottage Kitchen Stove / Hearth Counter + Fridge + Dining Set
      if (kit) {
        const stove = kit.buildKitchenCounter('cot_stove_' + (idx + 1), true);
        stove.scale.set(0.68, 0.92, 0.85);
        stove.position.set(c.x - innerDir * 0.25, 0.08, c.z - 2.65);
        grp.add(stove);
        tagInteractable(stove, 'cot_stove_' + (idx + 1));
        addBox(sharedColliders, c.x - innerDir * 0.25, c.z - 2.65, 2.2, 0.8);
        registerSpot({
          id: 'cot_stove_' + (idx + 1),
          title: c.title + ' Hearth Stove',
          floor: 0,
          category: 'cottages',
          x: c.x - innerDir * 0.25,
          y: 0.08,
          z: c.z - 2.65,
          radius: 2.8,
          actions: [
            {
              id: 'cot_cook_' + (idx + 1),
              label: 'Cook Warm Village Stew & Bread',
              hint: '+16 Food/s & +5 Fun/s',
              pose: 'cook',
              anchor: {
                x: c.x - innerDir * 0.25, y: 0.08, z: c.z - 1.75, yaw: Math.PI,
                floorY: 0.08, exitX: c.x - innerDir * 0.25, exitZ: c.z - 1.75, exitYaw: Math.PI,
              },
              rates: { hunger: 16, fun: 5 },
              statusText: 'Cooking rustic stew at ' + c.title + '...',
            },
          ],
        });

        if (typeof kit.buildFridge === 'function') {
          const fridge = kit.buildFridge(true);
          fridge.position.set(c.x - innerDir * 2.15, 0.08, c.z - 2.65);
          grp.add(fridge);
          addBox(sharedColliders, c.x - innerDir * 2.15, c.z - 2.65, 1.0, 0.8);
        }

        // 4) Wooden Dining Table & Chairs
        const tbl = kit.buildTableSet('cot_table_' + (idx + 1), true);
        tbl.position.set(c.x - innerDir * 1.15, 0.08, c.z + 2.0);
        grp.add(tbl);
        tagInteractable(tbl, 'cot_table_' + (idx + 1));
        addBox(sharedColliders, c.x - innerDir * 1.15, c.z + 2.0, 1.5, 1.0);
        registerSpot({
          id: 'cot_table_' + (idx + 1),
          title: c.title + ' Dining Table',
          floor: 0,
          category: 'cottages',
          x: c.x - innerDir * 1.15,
          y: 0.08,
          z: c.z + 2.0,
          radius: 2.8,
          actions: [
            {
              id: 'cot_eat_' + (idx + 1),
              label: 'Sit & Eat Fresh Pastries',
              hint: '+16 Food/s & +7 Energy/s',
              pose: 'eat',
              anchor: {
                x: c.x - innerDir * 1.15 - 0.98, y: 0.08, z: c.z + 2.0, yaw: Math.PI * 0.5, rigOffsetY: -0.45,
                floorY: 0.08, exitX: c.x - innerDir * 1.15, exitZ: c.z + 0.85, exitYaw: 0,
              },
              rates: { hunger: 16, energy: 7, fun: 5 },
              statusText: 'Dining warmly inside ' + c.title + '...',
            },
          ],
        });
      }

      enterableCottages.push({
        id: c.id,
        title: c.title,
        minX: c.x - cw * 0.5,
        maxX: c.x + cw * 0.5,
        minZ: c.z - cd * 0.5,
        maxZ: c.z + cd * 0.5,
        cx: c.x,
        cz: c.z,
        doorX: frontX + c.doorSide * 1.4,
        roofGrp: roofGrp,
        grp: grp,
      });

      if (idx === 0 || idx === 5) {
        registerSpot({
          id: c.id + '_entry',
          title: 'Visit ' + c.title,
          floor: 0,
          category: 'cottages',
          shortcut: true,
          x: c.x,
          y: 0.08,
          z: c.z,
          radius: 3.4,
          actions: [
            {
              id: 'visit_' + c.id,
              label: 'Walk Inside ' + c.title,
              hint: 'Inspect furnished commoner cottage',
              instant: true,
              onInstant: function (ctx) {
                ctx.playerCtrl.teleport(c.x, c.z + 0.1, c.doorSide < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, 0.08);
                ctx.toast('Welcome inside ' + c.title + ' — tap the Bed, Stove, Table or Toilet!');
              },
            },
          ],
        });
      }
    });

    // Background outer hillside cottages (instanced for skyline richness)
    const dummy = new THREE.Object3D();
    const tint = new THREE.Color();
    const outerHouses = [
      [-164, 10], [-166, 22], [-162, 36], [-172, 16], [-170, 30], [-160, -14],
      [164, 10], [166, 22], [162, 36], [172, 16], [170, 30], [160, -14],
    ];
    const hwMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.78 });
    const hrMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.68 });
    const houseWalls = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), hwMat, outerHouses.length);
    const houseRoofs = new THREE.InstancedMesh(new THREE.ConeGeometry(0.84, 1, 4), hrMat, outerHouses.length);
    const cColors = [0xf2e6d3, 0xe8d5bc, 0xf6ede0, 0xead8cc];
    const rColors = [0x8b4e3c, 0x45566a, 0x9b5d47, 0x3b4d63];
    outerHouses.forEach(function (pt, i) {
      const w = 4.6 + (i % 3) * 0.8;
      const h = 3.5 + (i % 2) * 1.2;
      const d = 5.0;
      dummy.position.set(pt[0], h * 0.5, pt[1]);
      dummy.rotation.set(0, (i % 2 === 0 ? 0.1 : -0.1), 0);
      dummy.scale.set(w, h, d);
      dummy.updateMatrix();
      houseWalls.setMatrixAt(i, dummy.matrix);
      tint.setHex(cColors[i % cColors.length]);
      houseWalls.setColorAt(i, tint);

      dummy.position.set(pt[0], h + 1.1, pt[1]);
      dummy.rotation.set(0, Math.PI * 0.25, 0);
      dummy.scale.set(w * 1.06, 2.2, d * 1.06);
      dummy.updateMatrix();
      houseRoofs.setMatrixAt(i, dummy.matrix);
      tint.setHex(rColors[i % rColors.length]);
      houseRoofs.setColorAt(i, tint);
      addBox(sharedColliders, pt[0], pt[1], w * 0.9, d * 0.9);
    });
    if (houseWalls.instanceColor) houseWalls.instanceColor.needsUpdate = true;
    if (houseRoofs.instanceColor) houseRoofs.instanceColor.needsUpdate = true;
    houseWalls.computeBoundingSphere();
    houseRoofs.computeBoundingSphere();
    scene.add(houseWalls, houseRoofs);

    // Town Clocktower Spire at North-West Cottage Plaza (clear of avenues & pavilions)
    const clockBase = new THREE.Mesh(new THREE.BoxGeometry(4.4, 10.5, 4.4), ivoryMat);
    clockBase.position.set(-55.5, 5.25, -4.5);
    scene.add(clockBase);
    addBox(sharedColliders, -55.5, -4.5, 4.6, 4.6);
    const clockRoof = new THREE.Mesh(new THREE.ConeGeometry(3.4, 5.2, 4), slateRoofMat);
    clockRoof.rotation.y = Math.PI * 0.25;
    clockRoof.position.set(-55.5, 13.0, -4.5);
    scene.add(clockRoof);

    // Perimeter Trees (moved clear of North auto pavilions & North civic avenues)
    const treeCoords = [
      [-45, -36], [-39, 6], [-40, 20], [-40, 34],
      [45, -36], [39, 6], [40, 20], [40, 34],
      [-42, -55], [-26, -56], [0, -57], [26, -56], [42, -55],
    ];
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a422f, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });
    const treeTrunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.32, 0.45, 2.8, 7), trunkMat, treeCoords.length);
    const treeCrowns = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(2.6, 1), foliageMat, treeCoords.length);
    treeCoords.forEach(function (pt, i) {
      const s = 0.88 + ((i * 19) % 24) / 70;
      dummy.position.set(pt[0], 1.4 * s, pt[1]);
      dummy.rotation.set(0, i * 0.8, 0);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      treeTrunks.setMatrixAt(i, dummy.matrix);
      dummy.position.set(pt[0], 4.2 * s, pt[1]);
      dummy.scale.set(s * 1.15, s * 1.25, s * 1.15);
      dummy.updateMatrix();
      treeCrowns.setMatrixAt(i, dummy.matrix);
      tint.setHSL(0.27 + (i % 3) * 0.018, 0.36, 0.27 + (i % 4) * 0.03);
      treeCrowns.setColorAt(i, tint);
    });
    if (treeCrowns.instanceColor) treeCrowns.instanceColor.needsUpdate = true;
    treeTrunks.computeBoundingSphere();
    treeCrowns.computeBoundingSphere();
    scene.add(treeTrunks, treeCrowns);

    // -----------------------------------------------------------
    // 2. VERSAILLES PARTERRE GARDENS, 3 FOUNTAINS & MARBLE BENCHES
    // -----------------------------------------------------------
    const animatedFountains = [];
    function buildBaroqueFountain(cx, cz, radius, hasDropParticles, interactId) {
      const fGroup = new THREE.Group();
      fGroup.position.set(cx, 0, cz);
      scene.add(fGroup);
      addCircle(sharedColliders, cx, cz, radius);

      const hedgeCollar = new THREE.Mesh(new THREE.TorusGeometry(radius + 0.45, 0.36, 8, 28), boxwoodMat);
      hedgeCollar.rotation.x = Math.PI / 2;
      hedgeCollar.position.y = 0.32;
      fGroup.add(hedgeCollar);

      const pts = [
        new THREE.Vector2(radius, 0), new THREE.Vector2(radius, 0.5),
        new THREE.Vector2(radius - 0.32, 0.56), new THREE.Vector2(radius - 0.45, 0.16),
        new THREE.Vector2(1.05, 0.16), new THREE.Vector2(0.75, 1.35),
        new THREE.Vector2(radius * 0.34, 1.65), new THREE.Vector2(0.4, 2.55),
        new THREE.Vector2(0.24, 3.35), new THREE.Vector2(0, 3.55),
      ];
      const stone = new THREE.Mesh(new THREE.LatheGeometry(pts, 24), ivoryMat);
      fGroup.add(stone);
      const basinWater = new THREE.Mesh(new THREE.CircleGeometry(radius - 0.35, 24), waterMat);
      basinWater.rotation.x = -Math.PI / 2;
      basinWater.position.y = 0.44;
      fGroup.add(basinWater);
      const topOrnament = new THREE.Mesh(new THREE.SphereGeometry(0.3, 10, 8), whiteMarbleMat);
      topOrnament.position.y = 3.72;
      fGroup.add(topOrnament);

      let drops = null;
      if (hasDropParticles) {
        drops = new THREE.InstancedMesh(
          new THREE.SphereGeometry(0.085, 6, 6),
          new THREE.MeshBasicMaterial({ color: 0xecfaff, transparent: true, opacity: 0.85 }),
          16
        );
        drops.frustumCulled = false;
        drops.userData.noMerge = true;
        drops.userData.noFreeze = true;
        fGroup.add(drops);
      }

      tagInteractable(fGroup, interactId);
      animatedFountains.push({ drops: drops, radius: radius });
      registerSpot({
        id: interactId,
        title: 'Versailles Parterre Fountain',
        floor: 0,
        category: 'gardens',
        shortcut: interactId === 'fountain_center',
        x: cx, y: 0, z: cz,
        radius: radius + 2.1,
        actions: [
          {
            id: interactId + '_wish',
            label: 'Toss Gold Coin & Make Wish (₡50)',
            hint: '+24 Fun & +14 Poise',
            instant: true,
            onInstant: function (ctx) {
              if (ctx.game && ctx.game.money >= 50) {
                ctx.game.money -= 50;
                if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 24, composure: 14 });
                ctx.startPose({
                  pose: 'wish',
                  label: 'Fountain Wish',
                  statusText: 'Making a secret royal wish upon the fountain...',
                  anchor: { x: cx, y: 0, z: cz + radius + 0.9, yaw: Math.PI, floorY: 0, exitX: cx, exitZ: cz + radius + 0.9, exitYaw: Math.PI },
                  rates: { fun: 6, composure: 4 },
                });
                ctx.toast('Tossed a ₡50 gold sovereign — fortune awaits! (+24 Fun)');
              } else {
                ctx.toast('Need ₡50 to toss a wishing sovereign.');
              }
            },
          },
          {
            id: interactId + '_splash',
            label: 'Cool Face in Fountain Mist',
            hint: '+15 Hygiene & +8 Energy',
            instant: true,
            onInstant: function (ctx) {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hygiene: 15, energy: 8 });
              ctx.toast('Refreshing mist restores your glow! (+15 Bath)');
            },
          },
        ],
      });
    }

    buildBaroqueFountain(0, -2.5, 3.3, false, 'fountain_north');
    buildBaroqueFountain(0, 11.5, 4.4, true, 'fountain_center');
    buildBaroqueFountain(0, 27.5, 3.9, true, 'fountain_south');

    [
      { x: -6.1, z: 11.5, yaw: Math.PI * 0.5, id: 'bench_west_mid' },
      { x: 6.1, z: 11.5, yaw: -Math.PI * 0.5, id: 'bench_east_mid' },
      { x: -6.1, z: 27.5, yaw: Math.PI * 0.5, id: 'bench_west_south' },
      { x: 6.1, z: 27.5, yaw: -Math.PI * 0.5, id: 'bench_east_south' },
    ].forEach(function (bDef) {
      const bench = new THREE.Group();
      bench.position.set(bDef.x, 0, bDef.z);
      bench.rotation.y = bDef.yaw;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.14, 0.72), whiteMarbleMat);
      seat.position.y = 0.48;
      bench.add(seat);
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.08, 0.58), pinkVelvetMat);
      cushion.position.y = 0.57;
      bench.add(cushion);
      [-0.78, 0.78].forEach(function (lx) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.44, 0.62), ivoryMat);
        leg.position.set(lx, 0.22, 0);
        bench.add(leg);
      });
      scene.add(bench);
      addBox(sharedColliders, bDef.x, bDef.z, 0.8, 1.8);
      tagInteractable(bench, bDef.id);
      const ex = bDef.x < 0 ? -4.8 : 4.8;
      registerSpot({
        id: bDef.id,
        title: 'Marble Parterre Bench',
        floor: 0,
        category: 'gardens',
        x: bDef.x, y: 0, z: bDef.z,
        radius: 3.4,
        actions: [
          {
            id: 'sit_' + bDef.id,
            label: 'Sit & Admire Palace Gardens',
            hint: '+9 Energy/s & +7 Poise/s',
            pose: 'sit',
            anchor: { x: bDef.x, y: 0.14, z: bDef.z, yaw: bDef.yaw, rigOffsetY: -0.44, floorY: 0, exitX: ex, exitZ: bDef.z, exitYaw: bDef.yaw },
            rates: { energy: 9, composure: 7, fun: 5 },
            statusText: 'Enjoying the sunlit Versailles gardens...',
          },
        ],
      });
    });

    const flowerPositions = [];
    const coneTopiaries = [];
    const sphereTopiaries = [];

    // Walkable Parterre Grass Lawns with wide 2.8m N/S/E/W open hedge entrances (no blocking lawn walls!)
    parterreBeds.forEach(function (b, bi) {
      const innerLawn = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.14, b.d), grassMat);
      innerLawn.position.set(b.x, 0.07, b.z);
      scene.add(innerLawn);

      const hThick = 0.52;
      const hHeight = 0.42;
      const gapW = 2.8;
      const xSegW = Math.max(1.2, (b.w - gapW) * 0.5);
      const zSegD = Math.max(1.2, (b.d - gapW) * 0.5);
      const xOff = gapW * 0.5 + xSegW * 0.5;
      const zOff = gapW * 0.5 + zSegD * 0.5;

      [-1, 1].forEach(function (sx) {
        const nSeg = new THREE.Mesh(new THREE.BoxGeometry(xSegW, hHeight, hThick), boxwoodMat);
        nSeg.position.set(b.x + sx * xOff, hHeight * 0.5, b.z - b.d * 0.5);
        scene.add(nSeg);
        const sSeg = new THREE.Mesh(new THREE.BoxGeometry(xSegW, hHeight, hThick), boxwoodMat);
        sSeg.position.set(b.x + sx * xOff, hHeight * 0.5, b.z + b.d * 0.5);
        scene.add(sSeg);
      });
      [-1, 1].forEach(function (sz) {
        const wSeg = new THREE.Mesh(new THREE.BoxGeometry(hThick, hHeight, zSegD), boxwoodMat);
        wSeg.position.set(b.x - b.w * 0.5, hHeight * 0.5, b.z + sz * zOff);
        scene.add(wSeg);
        const eSeg = new THREE.Mesh(new THREE.BoxGeometry(hThick, hHeight, zSegD), boxwoodMat);
        eSeg.position.set(b.x + b.w * 0.5, hHeight * 0.5, b.z + sz * zOff);
        scene.add(eSeg);
      });

      if (bi % 2 === 0) coneTopiaries.push([b.x, b.z]); else sphereTopiaries.push([b.x, b.z]);
      sphereTopiaries.push([b.x - b.w * 0.44, b.z - b.d * 0.44], [b.x + b.w * 0.44, b.z + b.d * 0.44]);
      for (let fx = -b.w * 0.34; fx <= b.w * 0.34; fx += 2.2) {
        for (let fz = -b.d * 0.36; fz <= b.d * 0.36; fz += 2.2) {
          if (Math.abs(fx) < 1.3 || Math.abs(fz) < 1.3) continue; // keep cross paths clean on grass!
          flowerPositions.push([b.x + fx, 0.28, b.z + fz]);
        }
      }
    });

    [
      { id: 'parterre_lawn_west', title: 'West Parterre Grass Lawn', x: -13.0, z: 12.5 },
      { id: 'parterre_lawn_east', title: 'East Parterre Grass Lawn', x: 13.0, z: 12.5 },
    ].forEach(function (lw) {
      registerSpot({
        id: lw.id,
        title: lw.title,
        floor: 0,
        category: 'gardens',
        x: lw.x, y: 0.14, z: lw.z,
        radius: 5.5,
        actions: [
          {
            id: lw.id + '_read',
            label: 'Sit on Soft Grass & Read Book',
            hint: '+10 Fun/s & +9 Poise/s',
            pose: 'sit_read',
            anchor: {
              x: lw.x + 1.8, y: 0.14, z: lw.z + 1.8, yaw: 0.4, rigOffsetY: -0.78,
              floorY: 0.14, exitX: lw.x + 1.8, exitZ: lw.z + 1.8, exitYaw: 0.4,
            },
            rates: { fun: 10, composure: 9, energy: 6 },
            statusText: 'Reading peacefully on the sunlit Versailles grass...',
          },
        ],
      });
    });

    [-6.2, 6.2].forEach(function (ax) {
      [-9, 3, 18, 34].forEach(function (az) {
        coneTopiaries.push([ax, az]);
        addCircle(sharedColliders, ax, az, 0.72);
      });
    });

    const flowerMesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.4, 0), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.72 }), flowerPositions.length);
    const flowerPal = [0xf2c94c, 0xeb8da7, 0xfff0cc, 0xd4a442, 0xe8a2b8, 0xb886c9];
    flowerPositions.forEach(function (fp, i) {
      const s = 0.78 + ((i * 17) % 24) / 75;
      dummy.position.set(fp[0], fp[1], fp[2]);
      dummy.scale.set(s * 1.15, s * 0.68, s * 1.15);
      dummy.rotation.set(0, i * 0.7, 0);
      dummy.updateMatrix();
      flowerMesh.setMatrixAt(i, dummy.matrix);
      tint.setHex(flowerPal[i % flowerPal.length]);
      flowerMesh.setColorAt(i, tint);
    });
    if (flowerMesh.instanceColor) flowerMesh.instanceColor.needsUpdate = true;
    flowerMesh.computeBoundingSphere();
    scene.add(flowerMesh);

    const topiaryMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.82 });
    const coneInst = new THREE.InstancedMesh(new THREE.ConeGeometry(0.76, 2.9, 10), topiaryMat, coneTopiaries.length);
    coneTopiaries.forEach(function (pt, i) {
      const s = 0.9 + ((i * 11) % 18) / 80;
      dummy.position.set(pt[0], 1.45 * s, pt[1]);
      dummy.rotation.set(0, i * 0.5, 0);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      coneInst.setMatrixAt(i, dummy.matrix);
      tint.setHSL(0.26 + (i % 3) * 0.012, 0.42, 0.28 + (i % 3) * 0.025);
      coneInst.setColorAt(i, tint);
    });
    if (coneInst.instanceColor) coneInst.instanceColor.needsUpdate = true;
    coneInst.computeBoundingSphere();
    scene.add(coneInst);

    const sphereInst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.68, 10, 8), topiaryMat, sphereTopiaries.length);
    sphereTopiaries.forEach(function (pt, i) {
      const s = 0.82 + ((i * 13) % 20) / 80;
      dummy.position.set(pt[0], 0.65 * s, pt[1]);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(s, s * 0.92, s);
      dummy.updateMatrix();
      sphereInst.setMatrixAt(i, dummy.matrix);
      tint.setHSL(0.26 + (i % 3) * 0.015, 0.4, 0.3 + (i % 3) * 0.025);
      sphereInst.setColorAt(i, tint);
    });
    if (sphereInst.instanceColor) sphereInst.instanceColor.needsUpdate = true;
    sphereInst.computeBoundingSphere();
    scene.add(sphereInst);

    // Estate Iron Gate Fence (with open drive archway x = -6.8..6.8)
    [-22, 22].forEach(function (gx) {
      const wallBar = new THREE.Mesh(new THREE.BoxGeometry(29.2, 0.95, 0.45), ivoryMat);
      wallBar.position.set(gx, 0.48, 41);
      scene.add(wallBar);
      const ironRails = new THREE.Mesh(new THREE.BoxGeometry(29.2, 1.4, 0.14), wroughtIronMat);
      ironRails.position.set(gx, 1.65, 41);
      scene.add(ironRails);
      addBox(sharedColliders, gx, 41, 29.0, 0.6);
    });
    [-7.2, 7.2].forEach(function (px) {
      const pier = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.4, 1.3), ivoryMat);
      pier.position.set(px, 1.7, 41);
      scene.add(pier);
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), goldMat);
      finial.position.set(px, 3.7, 41);
      scene.add(finial);
      addCircle(sharedColliders, px, 41, 0.85);
    });

    // -----------------------------------------------------------
    // 3. 3-STORY 15-BEDROOM FRENCH BAROQUE CHÂTEAU
    // -----------------------------------------------------------
    const palaceRoot = new THREE.Group();
    scene.add(palaceRoot);

    const floor1Group = new THREE.Group();
    const floor1FrontCutaway = new THREE.Group();
    const floor2Group = new THREE.Group();
    const floor2FrontCutaway = new THREE.Group();
    const floor3Group = new THREE.Group();
    const floor3FrontCutaway = new THREE.Group();
    const roofAndDomesGroup = new THREE.Group();

    palaceRoot.add(floor1Group, floor1FrontCutaway, floor2Group, floor2FrontCutaway, floor3Group, floor3FrontCutaway, roofAndDomesGroup);

    // Plinth & Entrance Steps
    const terracePlinth = new THREE.Mesh(new THREE.BoxGeometry(66, 0.65, 22.8), ivoryMat);
    terracePlinth.position.set(0, 0.325, -28.0);
    palaceRoot.add(terracePlinth);
    for (let st = 0; st < 5; st++) {
      const w = 18.2 - st * 1.1;
      const step = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, 1.0), ivoryMat);
      step.position.set(0, 0.07 + st * 0.13, -13.6 - st * 0.85);
      palaceRoot.add(step);
    }
    [-21, 21].forEach(function (bx) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(22, 0.88, 0.36), ivoryMat);
      rail.position.set(bx, 1.1, -17.0);
      palaceRoot.add(rail);
      addBox(floor1Colliders, bx, -17.0, 22, 0.6);
    });

    // ------------------ FLOOR 1 (y = 0.65): STATE ROOMS, LIVING ROOM, KITCHEN, 2 TOILETS, BEDS #1-#3 ------------------
    const f1HallFloor = new THREE.Mesh(new THREE.PlaneGeometry(20, 21), marbleMat);
    f1HallFloor.rotation.x = -Math.PI / 2;
    f1HallFloor.position.set(0, 0.67, -28.2);
    floor1Group.add(f1HallFloor);
    const f1WestFloor = new THREE.Mesh(new THREE.PlaneGeometry(21, 21), parquetMat);
    f1WestFloor.rotation.x = -Math.PI / 2;
    f1WestFloor.position.set(-20.2, 0.67, -28.2);
    floor1Group.add(f1WestFloor);
    const f1EastFloor = new THREE.Mesh(new THREE.PlaneGeometry(21, 21), parquetMat);
    f1EastFloor.rotation.x = -Math.PI / 2;
    f1EastFloor.position.set(20.2, 0.67, -28.2);
    floor1Group.add(f1EastFloor);

    // Structural North & Side Walls 1F
    addWallX(floor1Group, floor1Colliders, 0.65, 5.0, -38.6, -30.6, 30.6, null, 0, 0.7, wingFacadeMat, true);
    addWallZ(floor1Group, floor1Colliders, 0.65, 5.0, -30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat, true);
    addWallZ(floor1Group, floor1Colliders, 0.65, 5.0, 30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat, true);

    // 1F Room Partitions (Wide open doorways along Z=-24 Gallery Corridor!)
    addWallZ(floor1Group, floor1Colliders, 0.65, 4.9, -9.8, -38.4, -17.6, -24.0, 3.2, 0.36, ivoryMat);
    addWallZ(floor1Group, floor1Colliders, 0.65, 4.9, 9.8, -38.4, -17.6, -24.0, 3.2, 0.36, ivoryMat);
    // East outer wing rooms (Bed #1, Bed #2, Toilet #1)
    addWallZ(floor1Group, floor1Colliders, 0.65, 4.9, 21.8, -38.4, -17.6, -21.0, 2.2, 0.32, ivoryMat);
    addWallX(floor1Group, floor1Colliders, 0.65, 4.9, -23.6, 21.8, 30.4, 24.5, 1.8, 0.3, ivoryMat);
    addWallX(floor1Group, floor1Colliders, 0.65, 4.9, -31.2, 21.8, 30.4, 24.5, 1.8, 0.3, ivoryMat);
    addWallX(floor1Group, floor1Colliders, 0.65, 4.9, -27.8, 10.0, 21.6, 15.8, 3.2, 0.3, ivoryMat);
    // West outer wing rooms (Bed #3, Toilet #2, Kitchen/Dining split)
    addWallZ(floor1Group, floor1Colliders, 0.65, 4.9, -21.8, -38.4, -17.6, -24.5, 2.2, 0.32, ivoryMat);
    addWallX(floor1Group, floor1Colliders, 0.65, 4.9, -23.6, -30.4, -21.8, -24.5, 1.8, 0.3, ivoryMat);

    // 1F South Facade Cutaway Segments
    [
      { x: -26.0, z: -17.4, w: 10.0, d: 1.2, mat: pavFacadeMat },
      { x: -16.0, z: -18.0, w: 10.0, d: 0.7, mat: wingFacadeMat },
      { x: -7.8, z: -17.2, w: 7.4, d: 1.2, mat: pavFacadeMat },
      { x: 7.8, z: -17.2, w: 7.4, d: 1.2, mat: pavFacadeMat },
      { x: 16.0, z: -18.0, w: 10.0, d: 0.7, mat: wingFacadeMat },
      { x: 26.0, z: -17.4, w: 10.0, d: 1.2, mat: pavFacadeMat },
    ].forEach(function (seg) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(seg.w, 5.0, seg.d), seg.mat);
      wall.position.set(seg.x, 3.15, seg.z);
      floor1FrontCutaway.add(wall);
      addBox(floor1Colliders, seg.x, seg.z, seg.w, seg.d + 0.2);
    });

    // Grand Triple-Arched Entrance Portico Columns
    const porticoEntablature = new THREE.Mesh(new THREE.BoxGeometry(11.6, 1.15, 2.7), ivoryMat);
    porticoEntablature.position.set(0, 5.15, -16.8);
    floor1FrontCutaway.add(porticoEntablature);
    [-4.8, -3.7, 3.7, 4.8].forEach(function (px) {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 4.4, 12), ivoryMat);
      col.position.set(px, 2.85, -16.0);
      palaceRoot.add(col);
    });

    // Staircase 1F -> 2F (x in [-2.6..2.6], z = -29.2..-37.0)
    for (let s = 0; s < 14; s++) {
      const t = s / 13;
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.35, 0.72), marbleMat);
      stepMesh.position.set(0, 0.82 + t * 4.7, -29.2 - t * 7.8);
      floor1Group.add(stepMesh);
    }
    [-2.75, 2.75].forEach(function (sx) {
      const railBar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 8.6), goldMat);
      railBar.position.set(sx, 3.7, -33.1);
      railBar.rotation.x = 0.56;
      floor1Group.add(railBar);
      addBox(floor1Colliders, sx, -33.1, 0.4, 8.4);
    });

    // Royal Atelier Mirror (Hall of Mirrors 1F)
    const atelierGroup = new THREE.Group();
    atelierGroup.position.set(-7.6, 0.67, -21.2);
    atelierGroup.rotation.y = Math.PI * 0.22;
    const atFrame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.1, 0.2), goldMat);
    atFrame.position.y = 1.65;
    atelierGroup.add(atFrame);
    const atMirror = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.7), mirrorGlassMat);
    atMirror.position.set(0, 1.65, 0.12);
    atelierGroup.add(atMirror);
    floor1Group.add(atelierGroup);
    tagInteractable(atelierGroup, 'atelier_mirror');
    registerSpot({
      id: 'atelier_mirror',
      title: 'Royal Atelier Mirror (CAS)',
      floor: 1,
      category: 'living',
      x: -7.6, y: 0.67, z: -21.2,
      radius: 3.4,
      actions: [
        {
          id: 'open_cas', label: 'Enter Create-A-Princess', hint: 'Customize look, body, eyes & wardrobe', instant: true,
          onInstant: function () { if (window.CrownSave) window.CrownSave.save(true); window.CrownMenu.go('creator'); },
        },
        {
          id: 'admire_mirror', label: 'Check Reflection & Poise', hint: 'Instant +18 Poise', instant: true,
          onInstant: function (ctx) { if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 18, fun: 8 }); ctx.toast('Poised & radiant! (+18 Poise)'); },
        },
      ],
    });

    // 1F Grand Crystal Chandelier & Waltz Spot
    const hallPointLight = new THREE.PointLight(0xffe4b8, 2.4, 34, 1.4);
    hallPointLight.position.set(0, 4.8, -23.0);
    floor1Group.add(hallPointLight);
    const chandRing = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.06, 8, 24), goldMat);
    chandRing.rotation.x = Math.PI / 2;
    chandRing.position.set(0, 5.1, -23.0);
    floor1Group.add(chandRing);
    registerSpot({
      id: 'ballroom_waltz',
      title: 'Hall of Mirrors Crystal Chandelier',
      floor: 1,
      category: 'living',
      shortcut: true,
      x: 0, y: 0.67, z: -23.0,
      radius: 4.5,
      actions: [
        {
          id: 'waltz_dance', label: 'Waltz Under Crystal Chandelier', hint: '+14 Fun/s & +7 Poise/s', pose: 'dance',
          anchor: { x: 0, y: 0.67, z: -23.0, yaw: 0, floorY: 0.65, exitX: 0, exitZ: -23.0, exitYaw: 0 },
          rates: { fun: 14, composure: 7 }, statusText: 'Waltzing beneath the crystal chandelier...',
        },
        {
          id: 'curtsy_hall', label: 'Practice Royal Debutante Curtsy', hint: '+10 Poise/s', pose: 'curtsy',
          anchor: { x: 0, y: 0.67, z: -23.0, yaw: 0, floorY: 0.65, exitX: 0, exitZ: -23.0, exitYaw: 0 },
          rates: { composure: 10, fun: 5 }, statusText: 'Practicing your regal court curtsy...',
        },
      ],
    });

    // ---- 1F ROYAL LIVING ROOM / DRAWING SALON (East Center: x = 10..21.5, z = -17.8..-27.5) ----
    let palaceFlames = [];
    if (kit) {
      const livingRug = typeof kit.buildRug === 'function'
        ? kit.buildRug(8.6, 6.8, 'champagne')
        : new THREE.Mesh(new THREE.PlaneGeometry(8.5, 6.8), blushRugMat);
      if (!livingRug.isGroup) {
        livingRug.rotation.x = -Math.PI / 2;
      }
      livingRug.position.set(16.0, 0.68, -22.2);
      floor1Group.add(livingRug);

      // Marble Fireplace on East Partition
      const fp = kit.buildFireplace('fireplace_living', false);
      fp.position.set(20.9, 0.67, -22.2);
      fp.rotation.y = -Math.PI * 0.5;
      floor1Group.add(fp);
      palaceFlames = fp.userData && fp.userData.flames ? fp.userData.flames : [];
      for (let fi = 0; fi < palaceFlames.length; fi++) {
        if (palaceFlames[fi]) {
          palaceFlames[fi].userData.noMerge = true;
          palaceFlames[fi].userData.noFreeze = true;
        }
      }
      tagInteractable(fp, 'fireplace_living');
      addBox(floor1Colliders, 20.9, -22.2, 0.9, 2.3);
      registerSpot({
        id: 'fireplace_living',
        title: 'Royal Living Room Fireplace',
        floor: 1,
        category: 'living',
        shortcut: true,
        x: 20.9, y: 0.67, z: -22.2,
        radius: 3.4,
        actions: [
          {
            id: 'warm_fireplace', label: 'Warm Hands by the Hearth Fire', hint: '+10 Energy/s & +8 Poise/s', pose: 'warm',
            anchor: { x: 19.6, y: 0.67, z: -22.2, yaw: Math.PI * 0.5, floorY: 0.65, exitX: 19.2, exitZ: -22.2, exitYaw: -Math.PI * 0.5 },
            rates: { energy: 10, composure: 8, fun: 5 }, statusText: 'Warming beside the glowing marble fireplace...',
          },
        ],
      });

      // Plush Royal Living Room Sofas + Armchair (Image 3 Cream Tufted Grand Salon)
      placeSofa(floor1Group, floor1Colliders, {
        id: 'sofa_living_main', title: 'Royal Drawing Room Sofa', floor: 1, shortcut: true,
        x: 15.8, y: 0.67, z: -22.2, yaw: Math.PI * 0.5, tone: 'creamTufted', w: 2.8,
      });
      placeSofa(floor1Group, floor1Colliders, {
        id: 'sofa_living_south', title: 'Salon Silk Settee', floor: 1,
        x: 18.0, y: 0.67, z: -19.0, yaw: 0, tone: 'creamTufted', w: 2.3,
      });
      placeArmchair(floor1Group, floor1Colliders, {
        id: 'chair_living_1', title: 'Velvet Drawing Room Armchair', floor: 1,
        x: 17.6, y: 0.67, z: -25.2, yaw: Math.PI, tone: 'champagne',
      });

      // Portoro Black-and-Gold Marble Coffee Table between Sofas
      const coffeeTbl = kit.buildCoffeeTable(false, true);
      coffeeTbl.position.set(18.2, 0.67, -22.2);
      floor1Group.add(coffeeTbl);
      addBox(floor1Colliders, 18.2, -22.2, 1.95, 1.18);

      // Concert Grand Piano & Bookshelf in Drawing Salon
      const piano = kit.buildGrandPiano('piano_living');
      piano.position.set(12.2, 0.67, -20.6);
      piano.rotation.y = 0.25;
      floor1Group.add(piano);
      tagInteractable(piano, 'piano_living');
      addBox(floor1Colliders, 12.2, -20.6, 1.8, 2.2);
      const benchSpot = localToWorld(12.2, -20.6, 0.25, 0, 1.15);
      const pianoExit = localToWorld(12.2, -20.6, 0.25, 1.3, 1.15);
      registerSpot({
        id: 'piano_living',
        title: 'Royal Concert Grand Piano',
        floor: 1,
        category: 'living',
        shortcut: true,
        x: 12.2, y: 0.67, z: -20.6,
        radius: 3.4,
        actions: [
          {
            id: 'play_piano', label: 'Play Classical Waltz on Grand Piano', hint: '+16 Fun/s & +9 Poise/s', pose: 'piano',
            anchor: {
              x: benchSpot.x, y: 0.72, z: benchSpot.z, yaw: 0.25 + Math.PI, rigOffsetY: -0.45,
              floorY: 0.65, exitX: pianoExit.x, exitZ: pianoExit.z, exitYaw: 0.25,
            },
            rates: { fun: 16, composure: 9 }, statusText: 'Playing a classical Chopin nocturne...',
          },
        ],
      });

      const bShelf = kit.buildBookshelf('bookshelf_living', false);
      bShelf.position.set(11.8, 0.67, -27.2);
      floor1Group.add(bShelf);
      tagInteractable(bShelf, 'bookshelf_living');
      addBox(floor1Colliders, 11.8, -27.2, 1.7, 0.5);
      registerSpot({
        id: 'bookshelf_living',
        title: 'Royal Court Library Shelf',
        floor: 1,
        category: 'living',
        x: 11.8, y: 0.67, z: -27.2,
        radius: 3.0,
        actions: [
          {
            id: 'read_book', label: 'Read Court History & Etiquette', hint: '+10 Poise/s & +8 Fun/s', pose: 'read',
            anchor: { x: 11.8, y: 0.67, z: -26.2, yaw: Math.PI, floorY: 0.65, exitX: 11.8, exitZ: -26.2, exitYaw: 0 },
            rates: { composure: 10, fun: 8 }, statusText: 'Reading leather-bound palace archives...',
          },
        ],
      });
    }

    // ---- 1F BALLROOM THRONES (x = 12..21, z = -28.5..-38.2) ----
    const dais = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.35, 3.4), marbleMat);
    dais.position.set(16.0, 0.84, -35.6);
    floor1Group.add(dais);
    [-1.4, 1.4].forEach(function (tx, ti) {
      const throneGroup = kit ? kit.buildRoyalThrone(ti === 0 ? 'rose' : 'crimson') : new THREE.Group();
      throneGroup.position.set(16.0 + tx, 1.0, -35.8);
      floor1Group.add(throneGroup);
      const tid = ti === 0 ? 'throne_left' : 'throne_right';
      tagInteractable(throneGroup, tid);
      registerSpot({
        id: tid,
        title: ti === 0 ? 'Royal Ballroom Throne' : 'Consort Velvet Throne',
        floor: 1,
        category: 'living',
        shortcut: ti === 0,
        x: 16.0 + tx, y: 1.0, z: -35.8,
        radius: 3.6,
        actions: [
          {
            id: 'sit_' + tid, label: 'Sit & Hold Royal Court', hint: '+8 Poise/s & +4 Fun/s', pose: 'sit',
            anchor: { x: 16.0 + tx, y: 1.08, z: -35.62, yaw: 0, rigOffsetY: -0.48, floorY: 0.65, exitX: 16.0 + tx, exitZ: -33.2, exitYaw: 0 },
            rates: { composure: 8, fun: 4, energy: 3 }, statusText: 'Presiding regally upon the gilded throne...',
          },
        ],
      });
    });
    addBox(floor1Colliders, 16.0, -36.0, 5.0, 2.0);

    // ---- 1F WEST DINING ROOM & ROYAL KITCHEN HEARTH (x = -21.5..-10.2) ----
    const banquetGroup = new THREE.Group();
    banquetGroup.position.set(-15.8, 0.67, -22.2);
    floor1Group.add(banquetGroup);
    const banquetTable = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 6.2), creamDrapesMat);
    banquetTable.position.set(0, 0.45, 0);
    banquetGroup.add(banquetTable);
    const tableRunner = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.93, 6.25), goldMat);
    tableRunner.position.set(0, 0.45, 0);
    banquetGroup.add(tableRunner);
    tagInteractable(banquetGroup, 'banquet_table');
    addBox(floor1Colliders, -15.8, -22.2, 2.4, 6.0);

    const banquetSeats = [
      { x: -13.75, y: 0.67, z: -20.2, yaw: -Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -12.3, exitZ: -20.2, exitYaw: Math.PI * 0.5, approachX: -12.35, approachZ: -20.2 },
      { x: -17.85, y: 0.67, z: -20.2, yaw: Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -19.2, exitZ: -20.2, exitYaw: -Math.PI * 0.5, approachX: -19.25, approachZ: -20.2 },
      { x: -13.75, y: 0.67, z: -22.2, yaw: -Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -12.3, exitZ: -22.2, exitYaw: Math.PI * 0.5, approachX: -12.35, approachZ: -22.2 },
      { x: -17.85, y: 0.67, z: -22.2, yaw: Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -19.2, exitZ: -22.2, exitYaw: -Math.PI * 0.5, approachX: -19.25, approachZ: -22.2 },
      { x: -13.75, y: 0.67, z: -24.2, yaw: -Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -12.3, exitZ: -24.2, exitYaw: Math.PI * 0.5, approachX: -12.35, approachZ: -24.2 },
      { x: -17.85, y: 0.67, z: -24.2, yaw: Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -19.2, exitZ: -24.2, exitYaw: -Math.PI * 0.5, approachX: -19.25, approachZ: -24.2 },
    ];
    [
      { x: -13.7, z: -20.2, yaw: -Math.PI * 0.5, id: 'dining_e1' },
      { x: -13.7, z: -22.2, yaw: -Math.PI * 0.5, id: 'dining_e2' },
      { x: -13.7, z: -24.2, yaw: -Math.PI * 0.5, id: 'dining_e3' },
      { x: -17.9, z: -20.2, yaw: Math.PI * 0.5, id: 'dining_w1' },
      { x: -17.9, z: -22.2, yaw: Math.PI * 0.5, id: 'dining_w2' },
      { x: -17.9, z: -24.2, yaw: Math.PI * 0.5, id: 'dining_w3' },
    ].forEach(function (ch) {
      const chair = kit ? kit.buildDiningChair('rose', false) : new THREE.Group();
      chair.position.set(ch.x, 0.67, ch.z);
      chair.rotation.y = ch.yaw;
      floor1Group.add(chair);
      tagInteractable(chair, 'banquet_table');
    });
    registerSpot({
      id: 'banquet_table',
      title: 'Royal Banquet Dining Table',
      floor: 1,
      category: 'living',
      shortcut: true,
      x: -15.8, y: 0.67, z: -22.2,
      radius: 4.5,
      seats: banquetSeats,
      actions: [
        {
          id: 'eat_macarons', label: 'Dine on Macarons & Tea', hint: '+16 Food/s & +6 Fun/s', pose: 'eat',
          anchor: {
            x: -13.75, y: 0.67, z: -20.2, yaw: -Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -12.3, exitZ: -20.2, exitYaw: Math.PI * 0.5,
            partnerAnchor: banquetSeats[1],
            seats: banquetSeats,
          },
          rates: { hunger: 16, fun: 6, composure: 4 }, statusText: 'Savoring rose macarons & Darjeeling tea...',
        },
        {
          id: 'eat_banquet', label: 'Enjoy Full Royal Feast', hint: '+20 Food/s & +8 Poise/s', pose: 'eat',
          anchor: {
            x: -13.75, y: 0.67, z: -24.2, yaw: -Math.PI * 0.5, rigOffsetY: -0.46, floorY: 0.65, exitX: -12.3, exitZ: -24.2, exitYaw: Math.PI * 0.5,
            partnerAnchor: banquetSeats[5],
            seats: banquetSeats,
          },
          rates: { hunger: 20, composure: 8, energy: 3 }, statusText: 'Feasting at the gilded banquet table...',
        },
        {
          id: 'banquet_call_meal',
          label: 'Call Family & Court to Meal',
          hint: 'Summons up to 5 members — each takes their own separate chair!',
          type: 'call_to_meal',
          spotId: 'banquet_table',
        },
      ],
    });

    // Palace Kitchen Range & Counters (1F West North: Image 1 Mahogany & Inlaid Marble Hearth)
    if (kit) {
      const kFloorMat = (kit.palette && (kit.palette.kitchenInlayFloor || kit.palette.checkeredTile));
      if (kFloorMat) {
        const kitchenTileMat = new THREE.Mesh(new THREE.PlaneGeometry(10.8, 9.6), kFloorMat);
        kitchenTileMat.rotation.x = -Math.PI / 2;
        kitchenTileMat.position.set(-15.8, 0.676, -33.2);
        kitchenTileMat.receiveShadow = true;
        floor1Group.add(kitchenTileMat);
      }
      const kStove = kit.buildKitchenCounter('kitchen_stove', false);
      kStove.position.set(-16.2, 0.67, -37.2);
      floor1Group.add(kStove);
      tagInteractable(kStove, 'kitchen_stove');
      addBox(floor1Colliders, -16.2, -37.2, 4.2, 0.96);
      registerSpot({
        id: 'kitchen_stove',
        title: 'Palace Kitchen Range & Hearth',
        floor: 1,
        category: 'living',
        shortcut: true,
        x: -16.2, y: 0.67, z: -37.2,
        radius: 3.4,
        actions: [
          {
            id: 'cook_royal', label: 'Simmer Royal Soup & Pastries', hint: '+18 Food/s & +8 Fun/s', pose: 'cook',
            anchor: { x: -16.2, y: 0.67, z: -36.25, yaw: Math.PI, floorY: 0.65, exitX: -16.2, exitZ: -35.8, exitYaw: Math.PI },
            rates: { hunger: 18, fun: 8, composure: 4 }, statusText: 'Cooking delicate French cuisine in the Royal Kitchen...',
          },
        ],
      });
    }

    // ---- 1F TOILETS (#1 & #2) & BEDROOMS (#1, #2, #3) ----
    placeToilet(floor1Group, floor1Colliders, { id: 'toilet_1', title: '1F East Powder Toilet #1', floor: 1, shortcut: true, x: 29.4, y: 0.67, z: -19.2, yaw: -Math.PI * 0.5 });
    placeVanitySink(floor1Group, floor1Colliders, { id: 'sink_1', title: '1F East Marble Vanity', floor: 1, x: 29.4, y: 0.67, z: -21.5, yaw: -Math.PI * 0.5 });
    placeToilet(floor1Group, floor1Colliders, { id: 'toilet_2', title: '1F West Powder Toilet #2', floor: 1, x: -29.4, y: 0.67, z: -19.2, yaw: Math.PI * 0.5 });
    placeVanitySink(floor1Group, floor1Colliders, { id: 'sink_2', title: '1F West Marble Vanity', floor: 1, x: -29.4, y: 0.67, z: -21.5, yaw: Math.PI * 0.5 });

    // Bedroom #1, #2, #3 on Floor 1
    placeBed(floor1Group, floor1Colliders, { id: 'bed_1', title: 'Bedroom #1 (Rose Garden 1F)', floor: 1, x: 27.8, y: 0.67, z: -27.5, yaw: -Math.PI * 0.5, tone: 'rose', w: 2.1, d: 2.7 });
    placeBed(floor1Group, floor1Colliders, { id: 'bed_2', title: 'Bedroom #2 (Champagne State 1F)', floor: 1, x: 27.8, y: 0.67, z: -35.0, yaw: -Math.PI * 0.5, tone: 'champagne', w: 2.1, d: 2.7 });
    placeBed(floor1Group, floor1Colliders, { id: 'bed_3', title: 'Bedroom #3 (Lavender Wing 1F)', floor: 1, x: -27.6, y: 0.67, z: -31.0, yaw: Math.PI * 0.5, tone: 'lavender', w: 2.2, d: 2.8 });
    if (kit) {
      const w3 = kit.buildWardrobe('wardrobe_3', false);
      w3.position.set(-25.0, 0.67, -37.5);
      floor1Group.add(w3);
      addBox(floor1Colliders, -25.0, -37.5, 1.4, 0.7);
    }

    // ------------------ FLOOR 2 (y = 5.65): MASTER CANOPY SUITE, MASTER BATH + 3 TOILETS (#3-#5), 6 BEDROOMS (#4-#9), 2F LOUNGE ------------------
    const f2LeftFloor = new THREE.Mesh(new THREE.PlaneGeometry(27.2, 21.4), parquetMat);
    f2LeftFloor.rotation.x = -Math.PI / 2;
    f2LeftFloor.position.set(-16.8, 5.65, -28.0);
    floor2Group.add(f2LeftFloor);
    const f2RightFloor = new THREE.Mesh(new THREE.PlaneGeometry(27.2, 21.4), parquetMat);
    f2RightFloor.rotation.x = -Math.PI / 2;
    f2RightFloor.position.set(16.8, 5.65, -28.0);
    floor2Group.add(f2RightFloor);
    const f2FrontBridge = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 11.4), marbleMat);
    f2FrontBridge.rotation.x = -Math.PI / 2;
    f2FrontBridge.position.set(0, 5.65, -22.8);
    floor2Group.add(f2FrontBridge);
    // Landing bridge North of 1F->2F stairwell
    const f2NorthBridge = new THREE.Mesh(new THREE.PlaneGeometry(7.6, 1.8), marbleMat);
    f2NorthBridge.rotation.x = -Math.PI / 2;
    f2NorthBridge.position.set(0, 5.65, -37.8);
    floor2Group.add(f2NorthBridge);

    // 2F Exterior Upper Balcony
    const upperBalcony = new THREE.Mesh(new THREE.BoxGeometry(58, 0.4, 4.2), ivoryMat);
    upperBalcony.position.set(0, 5.45, -16.0);
    floor2Group.add(upperBalcony);
    const balconyRail = new THREE.Mesh(new THREE.BoxGeometry(58, 0.85, 0.28), ivoryMat);
    balconyRail.position.set(0, 6.08, -14.1);
    floor2Group.add(balconyRail);

    // 2F Perimeter Walls
    addWallX(floor2Group, floor2Colliders, 5.65, 5.0, -38.6, -30.6, 30.6, null, 0, 0.7, wingFacadeMat, true);
    addWallZ(floor2Group, floor2Colliders, 5.65, 5.0, -30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat, true);
    addWallZ(floor2Group, floor2Colliders, 5.65, 5.0, 30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat, true);

    // 2F Facade Cutaway
    [
      { x: -26.0, z: -17.4, w: 10.0, d: 1.2, mat: pavFacadeMat },
      { x: -16.0, z: -18.0, w: 10.0, d: 0.7, mat: wingFacadeMat },
      { x: -7.8, z: -17.2, w: 7.4, d: 1.2, mat: pavFacadeMat },
      { x: 7.8, z: -17.2, w: 7.4, d: 1.2, mat: pavFacadeMat },
      { x: 16.0, z: -18.0, w: 10.0, d: 0.7, mat: wingFacadeMat },
      { x: 26.0, z: -17.4, w: 10.0, d: 1.2, mat: pavFacadeMat },
    ].forEach(function (seg) {
      const fw = new THREE.Mesh(new THREE.BoxGeometry(seg.w, 5.0, seg.d), seg.mat);
      fw.position.set(seg.x, 8.15, seg.z);
      floor2FrontCutaway.add(fw);
      addBox(floor2Colliders, seg.x, seg.z, seg.w, seg.d + 0.2);
    });

    // 2F Gallery Corridor North Partition Wall (`z = -25.0`, doorways into every 2F bedroom & bath!)
    addWallX(floor2Group, floor2Colliders, 5.65, 4.9, -25.0, -30.4, -21.8, -26.0, 2.4, 0.28, ivoryMat);
    addWallX(floor2Group, floor2Colliders, 5.65, 4.9, -25.0, -21.8, -11.4, -16.5, 2.4, 0.28, ivoryMat);
    addWallX(floor2Group, floor2Colliders, 5.65, 4.9, -25.0, -11.4, -3.3, -7.2, 2.4, 0.28, ivoryMat);
    addWallX(floor2Group, floor2Colliders, 5.65, 4.9, -25.0, 7.6, 17.6, 12.6, 2.4, 0.28, ivoryMat);
    addWallX(floor2Group, floor2Colliders, 5.65, 4.9, -25.0, 17.6, 22.6, 20.0, 1.8, 0.28, ivoryMat);
    addWallX(floor2Group, floor2Colliders, 5.65, 4.9, -25.0, 22.6, 30.4, 26.2, 2.2, 0.28, ivoryMat);

    // 2F North Suite Dividing Walls
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, -21.8, -38.4, -25.0, null, 0, 0.28, ivoryMat);
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, -11.4, -38.4, -25.0, null, 0, 0.28, ivoryMat);
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, -3.3, -38.4, -25.0, null, 0, 0.28, ivoryMat);
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, 7.6, -38.4, -25.0, null, 0, 0.28, ivoryMat);
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, 17.6, -38.4, -25.0, null, 0, 0.28, ivoryMat);
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, 22.6, -38.4, -25.0, null, 0, 0.28, ivoryMat);
    // 2F South Wing Corner Suite Walls (Bedroom #5 & #9)
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, -22.2, -21.8, -17.6, -19.8, 2.0, 0.28, ivoryMat);
    addWallZ(floor2Group, floor2Colliders, 5.65, 4.9, 22.2, -21.8, -17.6, -19.8, 2.0, 0.28, ivoryMat);

    // 2F -> 3F Grand Staircase (`x in [4.1..6.7]`, z from -28.6 [5.65] up to -37.0 [10.65])
    for (let s3 = 0; s3 < 14; s3++) {
      const t3 = s3 / 13;
      const step3 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.35, 0.72), marbleMat);
      step3.position.set(5.4, 5.82 + t3 * 4.7, -29.2 - t3 * 7.8);
      floor2Group.add(step3);
    }
    [4.0, 6.8].forEach(function (sx3) {
      const r3 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.85, 8.6), goldMat);
      r3.position.set(sx3, 8.7, -33.1);
      r3.rotation.x = 0.56;
      floor2Group.add(r3);
      addBox(floor2Colliders, sx3, -33.1, 0.36, 8.4);
    });
    // 2F stairwell opening guard rails around the 1F->2F hole
    addBox(floor2Colliders, -3.1, -32.8, 0.32, 8.0);
    addBox(floor2Colliders, 3.1, -32.8, 0.32, 8.0);
    addBox(floor2Colliders, 0, -28.65, 5.8, 0.32);

    // Bedroom #4 (Princess Canopy Master Suite, Image 4 Plum Quilted Bedding + Circular Medallion Rug)
    placeBed(floor2Group, floor2Colliders, {
      id: 'canopy_bed', title: 'Bedroom #4 (Princess Master Canopy)', floor: 2, shortcut: true,
      canopy: true, circularRug: true, tone: 'plum', x: -16.5, y: 5.67, z: -34.2, yaw: 0, w: 2.6, d: 3.1,
    });
    placeSofa(floor2Group, floor2Colliders, {
      id: 'sofa_master_2f', title: 'Master Suite Velvet Sofa', floor: 2,
      x: -16.5, y: 5.67, z: -28.2, yaw: Math.PI, tone: 'champagne', w: 2.2,
    });

    // Master Marble Bath (Image 5 Carved Mahogany Double Vanity, Stepped Marble Plinth Clawfoot Tub & Rain Shower)
    const tubGroup = kit
      ? kit.buildBathtub('clawfoot_tub', false, 'baroque')
      : new THREE.Group();
    tubGroup.position.set(-25.6, 5.65, -34.2);
    floor2Group.add(tubGroup);
    tagInteractable(tubGroup, 'clawfoot_tub');
    addBox(floor2Colliders, -25.6, -34.2, 2.3, 1.45);
    registerSpot({
      id: 'clawfoot_tub', title: 'Gold Rosewater Clawfoot Tub (2F)', floor: 2, category: 'toilets', shortcut: true,
      x: -25.6, y: 5.67, z: -34.2, radius: 3.8,
      actions: [
        {
          id: 'tub_bubble', label: 'Soak in Rosewater Bubble Bath', hint: '+16 Hygiene/s & +8 Poise/s', pose: 'bath',
          anchor: { x: -25.8, y: 6.12, z: -34.2, yaw: Math.PI * 0.5, rigOffsetY: -0.5, floorY: 5.65, exitX: -25.6, exitZ: -31.8, exitYaw: 0 },
          rates: { hygiene: 16, composure: 8, fun: 5 }, statusText: 'Soaking in warm rosewater steam...',
        },
        {
          id: 'tub_freshen', label: 'Quick Perfume Freshen', hint: 'Instant +35 Hygiene', instant: true,
          onInstant: function (ctx) { if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hygiene: 35, composure: 15 }); ctx.toast('Rose perfume applied (+35 Bath)'); },
        },
      ],
    });

    const showerGroup = kit
      ? kit.buildShowerCubicle('shower_booth', false)
      : new THREE.Group();
    showerGroup.position.set(-28.4, 5.65, -28.0);
    if (kit) showerGroup.scale.set(1.55, 1.32, 1.55);
    floor2Group.add(showerGroup);
    const showerSpray = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.36, 2.1, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xdff6ff, transparent: true, opacity: 0.34, side: THREE.DoubleSide, depthWrite: false })
    );
    showerSpray.position.set(0, 1.32, 0);
    showerSpray.visible = false;
    showerSpray.userData.noMerge = true;
    showerSpray.userData.noFreeze = true;
    showerGroup.add(showerSpray);
    tagInteractable(showerGroup, 'shower_booth');
    addBox(floor2Colliders, -28.4, -28.0, 2.2, 2.2);
    registerSpot({
      id: 'shower_booth', title: 'Marble Rain Shower (2F)', floor: 2, category: 'toilets', shortcut: true,
      x: -28.4, y: 5.67, z: -28.0, radius: 3.4,
      actions: [
        {
          id: 'shower_warm', label: 'Take Warm Rain Shower', hint: '+18 Hygiene/s & +5 Energy/s', pose: 'shower', usesShowerSpray: true,
          anchor: { x: -28.4, y: 5.74, z: -28.0, yaw: Math.PI * 0.25, floorY: 5.65, exitX: -26.0, exitZ: -28.0, exitYaw: Math.PI * 0.5 },
          rates: { hygiene: 18, energy: 5, composure: 4 }, statusText: 'Enjoying the cascading rain shower...',
        },
      ],
    });

    placeToilet(floor2Group, floor2Colliders, { id: 'toilet_3', title: '2F Master Bath Toilet #3', floor: 2, shortcut: true, x: -29.4, y: 5.67, z: -35.2, yaw: Math.PI * 0.5 });
    placeVanitySink(floor2Group, floor2Colliders, { id: 'sink_3', title: '2F Master Double Vanity', floor: 2, style: 'baroque', x: -23.5, y: 5.67, z: -37.6, yaw: 0 });

    // Remaining Floor 2 Bedrooms #5, #6, #7, #8, #9 + Toilets #4, #5 + 2F Gallery Living Sofa
    placeBed(floor2Group, floor2Colliders, { id: 'bed_5', title: 'Bedroom #5 (Crimson Balcony 2F)', floor: 2, x: -27.8, y: 5.67, z: -19.8, yaw: Math.PI * 0.5, tone: 'crimson', w: 2.0, d: 2.6 });
    placeBed(floor2Group, floor2Colliders, { id: 'bed_6', title: 'Bedroom #6 (Sapphire Guest 2F)', floor: 2, x: -7.2, y: 5.67, z: -34.8, yaw: 0, tone: 'sapphire', w: 2.2, d: 2.8 });
    placeBed(floor2Group, floor2Colliders, { id: 'bed_7', title: 'Bedroom #7 (Queen Mother Canopy 2F)', floor: 2, canopy: true, x: 12.5, y: 5.67, z: -34.5, yaw: 0, tone: 'crimson', w: 2.4, d: 2.9 });
    placeBed(floor2Group, floor2Colliders, { id: 'bed_8', title: 'Bedroom #8 (Emerald Veranda 2F)', floor: 2, x: 27.6, y: 5.67, z: -34.0, yaw: -Math.PI * 0.5, tone: 'emerald', w: 2.2, d: 2.8 });
    placeBed(floor2Group, floor2Colliders, { id: 'bed_9', title: 'Bedroom #9 (Champagne Sunlit 2F)', floor: 2, x: 27.8, y: 5.67, z: -19.8, yaw: -Math.PI * 0.5, tone: 'champagne', w: 2.0, d: 2.6 });

    placeToilet(floor2Group, floor2Colliders, { id: 'toilet_4', title: '2F East Suite Toilet #4', floor: 2, x: 20.8, y: 5.67, z: -35.8, yaw: -Math.PI * 0.5 });
    placeVanitySink(floor2Group, floor2Colliders, { id: 'sink_4', title: '2F East Suite Vanity', floor: 2, style: 'slate', x: 20.8, y: 5.67, z: -33.2, yaw: -Math.PI * 0.5 });
    placeToilet(floor2Group, floor2Colliders, { id: 'toilet_5', title: '2F Gallery Powder Toilet #5', floor: 2, x: 18.8, y: 5.67, z: -18.8, yaw: 0 });

    placeSofa(floor2Group, floor2Colliders, { id: 'sofa_gallery_2f', title: '2F Upper Gallery Sofa', floor: 2, x: 0, y: 5.67, z: -18.8, yaw: 0, tone: 'lavender', w: 2.6 });
    placeArmchair(floor2Group, floor2Colliders, { id: 'tea_chair_2f', title: 'Queen Mother Tea Chair', floor: 2, x: 12.5, y: 5.67, z: -28.0, yaw: Math.PI, tone: 'rose' });

    const suiteLight = new THREE.PointLight(0xffe0c4, 2.0, 32, 1.5);
    suiteLight.position.set(0, 9.6, -24);
    floor2Group.add(suiteLight);

    // ------------------ FLOOR 3 (y = 10.65): MANSARD SUITES BEDROOMS #10-#15 + 2 TOILETS (#6-#7) + READING LOUNGE ------------------
    const f3LeftFloor = new THREE.Mesh(new THREE.PlaneGeometry(33.8, 21.4), parquetMat);
    f3LeftFloor.rotation.x = -Math.PI / 2;
    f3LeftFloor.position.set(-13.5, 10.65, -28.0);
    floor3Group.add(f3LeftFloor);
    const f3RightFloor = new THREE.Mesh(new THREE.PlaneGeometry(23.6, 21.4), parquetMat);
    f3RightFloor.rotation.x = -Math.PI / 2;
    f3RightFloor.position.set(18.8, 10.65, -28.0);
    floor3Group.add(f3RightFloor);
    const f3FrontBridge = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 11.4), marbleMat);
    f3FrontBridge.rotation.x = -Math.PI / 2;
    f3FrontBridge.position.set(5.4, 10.65, -22.8);
    floor3Group.add(f3FrontBridge);
    const f3NorthBridge = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.8), marbleMat);
    f3NorthBridge.rotation.x = -Math.PI / 2;
    f3NorthBridge.position.set(5.4, 10.65, -37.8);
    floor3Group.add(f3NorthBridge);
    // 3F stairwell opening guard rails around the 2F->3F hole
    addBox(floor3Colliders, 3.85, -32.8, 0.32, 8.0);
    addBox(floor3Colliders, 6.95, -32.8, 0.32, 8.0);
    addBox(floor3Colliders, 5.4, -28.65, 2.9, 0.32);

    // 3F Perimeter & Divider Walls
    addWallX(floor3Group, floor3Colliders, 10.65, 3.6, -38.6, -30.6, 30.6, null, 0, 0.7, wingFacadeMat, true);
    addWallZ(floor3Group, floor3Colliders, 10.65, 3.6, -30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat, true);
    addWallZ(floor3Group, floor3Colliders, 10.65, 3.6, 30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat, true);
    addWallX(floor3FrontCutaway, floor3Colliders, 10.65, 3.6, -17.4, -30.6, 30.6, null, 0, 0.7, wingFacadeMat, true);

    // 3F Corridor North Wall (`z = -25.0`)
    addWallX(floor3Group, floor3Colliders, 10.65, 3.5, -25.0, -30.4, -22.0, -26.2, 2.4, 0.28, ivoryMat);
    addWallX(floor3Group, floor3Colliders, 10.65, 3.5, -25.0, -22.0, -17.2, -19.6, 1.8, 0.28, ivoryMat);
    addWallX(floor3Group, floor3Colliders, 10.65, 3.5, -25.0, -17.2, -8.4, -12.8, 2.4, 0.28, ivoryMat);
    addWallX(floor3Group, floor3Colliders, 10.65, 3.5, -25.0, -8.4, 2.6, -3.0, 2.4, 0.28, ivoryMat);
    addWallX(floor3Group, floor3Colliders, 10.65, 3.5, -25.0, 7.6, 17.6, 12.6, 2.4, 0.28, ivoryMat);
    addWallX(floor3Group, floor3Colliders, 10.65, 3.5, -25.0, 17.6, 22.6, 20.0, 1.8, 0.28, ivoryMat);
    addWallX(floor3Group, floor3Colliders, 10.65, 3.5, -25.0, 22.6, 30.4, 26.2, 2.2, 0.28, ivoryMat);

    [-22.0, -17.2, -8.4, 2.6, 7.6, 17.6, 22.6].forEach(function (dx3) {
      addWallZ(floor3Group, floor3Colliders, 10.65, 3.5, dx3, -38.4, -25.0, null, 0, 0.26, ivoryMat);
    });
    addWallZ(floor3Group, floor3Colliders, 10.65, 3.5, -21.0, -21.8, -17.6, -19.8, 2.0, 0.26, ivoryMat);

    // Bedrooms #10 - #15 on Floor 3 + Toilets #6 - #7 + Reading Lounge!
    placeBed(floor3Group, floor3Colliders, { id: 'bed_10', title: 'Bedroom #10 (West Tower Ivory 3F)', floor: 3, x: -27.8, y: 10.67, z: -34.2, yaw: Math.PI * 0.5, tone: 'champagne', w: 2.1, d: 2.7 });
    placeBed(floor3Group, floor3Colliders, { id: 'bed_11', title: 'Bedroom #11 (Rosewood Mansard 3F)', floor: 3, x: -12.8, y: 10.67, z: -34.5, yaw: 0, tone: 'rose', w: 2.1, d: 2.7 });
    placeBed(floor3Group, floor3Colliders, { id: 'bed_12', title: 'Bedroom #12 (Midnight Velvet 3F)', floor: 3, x: -3.0, y: 10.67, z: -34.5, yaw: 0, tone: 'sapphire', w: 2.2, d: 2.8 });
    placeBed(floor3Group, floor3Colliders, { id: 'bed_13', title: 'Bedroom #13 (Imperial Dome Canopy 3F)', floor: 3, canopy: true, x: 12.6, y: 10.67, z: -34.5, yaw: 0, tone: 'crimson', w: 2.4, d: 2.9 });
    placeBed(floor3Group, floor3Colliders, { id: 'bed_14', title: 'Bedroom #14 (Emerald Dormer 3F)', floor: 3, x: 27.6, y: 10.67, z: -34.0, yaw: -Math.PI * 0.5, tone: 'emerald', w: 2.1, d: 2.7 });
    placeBed(floor3Group, floor3Colliders, { id: 'bed_15', title: 'Bedroom #15 (Lady-in-Waiting 3F)', floor: 3, x: -27.6, y: 10.67, z: -19.8, yaw: Math.PI * 0.5, tone: 'lavender', w: 2.0, d: 2.6 });

    placeToilet(floor3Group, floor3Colliders, { id: 'toilet_6', title: '3F West Bath Toilet #6', floor: 3, x: -20.4, y: 10.67, z: -36.5, yaw: 0 });
    placeVanitySink(floor3Group, floor3Colliders, { id: 'sink_6', title: '3F West Vanity', floor: 3, style: 'slate', x: -18.8, y: 10.67, z: -37.2, yaw: 0 });
    placeToilet(floor3Group, floor3Colliders, { id: 'toilet_7', title: '3F East Bath Toilet #7', floor: 3, x: 20.8, y: 10.67, z: -36.0, yaw: -Math.PI * 0.5 });
    placeVanitySink(floor3Group, floor3Colliders, { id: 'sink_7', title: '3F East Vanity', floor: 3, style: 'slate', x: 20.8, y: 10.67, z: -33.2, yaw: -Math.PI * 0.5 });

    placeSofa(floor3Group, floor3Colliders, { id: 'sofa_3f_west', title: '3F Mansard Reading Sofa', floor: 3, x: -6.0, y: 10.67, z: -19.2, yaw: 0, tone: 'rose', w: 2.4 });
    placeSofa(floor3Group, floor3Colliders, { id: 'sofa_3f_east', title: '3F Dome Lounge Sofa', floor: 3, x: 14.0, y: 10.67, z: -19.2, yaw: 0, tone: 'emerald', w: 2.4 });

    // ------------------ EXTERIOR SLATE-BLUE MANSARD ROOFS & DOMES (sits cleanly above Floor 7 at y=34.9!) ------------------
    roofAndDomesGroup.position.y = 20.6;
    const eaveCornice = new THREE.Mesh(new THREE.BoxGeometry(63.4, 0.55, 22.8), ivoryMat);
    eaveCornice.position.set(0, 14.3, -28.0);
    roofAndDomesGroup.add(eaveCornice);
    const mansardBody = new THREE.Mesh(new THREE.CylinderGeometry(11.6, 15.2, 3.4, 4), slateRoofMat);
    mansardBody.rotation.y = Math.PI * 0.25;
    mansardBody.scale.set(2.86, 1, 1.0);
    mansardBody.position.set(0, 16.3, -28.0);
    roofAndDomesGroup.add(mansardBody);

    [-20, -15, -10, 10, 15, 20].forEach(function (dx) {
      const dFrame = new THREE.Mesh(new THREE.BoxGeometry(1.85, 2.2, 1.6), ivoryMat);
      dFrame.position.set(dx, 16.0, -18.3);
      roofAndDomesGroup.add(dFrame);
      const dGlass = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.4, 1.68), glassMat);
      dGlass.position.set(dx, 15.9, -18.3);
      roofAndDomesGroup.add(dGlass);
    });

    const centerDrum = new THREE.Mesh(new THREE.BoxGeometry(13.2, 2.2, 13.8), ivoryMat);
    centerDrum.position.set(0, 16.6, -24.5);
    roofAndDomesGroup.add(centerDrum);
    const centerDome = new THREE.Mesh(new THREE.SphereGeometry(7.2, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.5), slateRoofMat);
    centerDome.scale.set(1.06, 0.92, 1.1);
    centerDome.position.set(0, 17.5, -24.5);
    roofAndDomesGroup.add(centerDome);
    const centerLantern = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.65, 2.2, 8), ivoryMat);
    centerLantern.position.set(0, 24.8, -24.5);
    roofAndDomesGroup.add(centerLantern);
    const centerSpire = new THREE.Mesh(new THREE.ConeGeometry(0.32, 2.2, 8), goldMat);
    centerSpire.position.set(0, 28.5, -24.5);
    roofAndDomesGroup.add(centerSpire);

    [-26.0, 26.0].forEach(function (dx) {
      const sideDrum = new THREE.Mesh(new THREE.BoxGeometry(10.0, 1.8, 12.0), ivoryMat);
      sideDrum.position.set(dx, 16.0, -24.0);
      roofAndDomesGroup.add(sideDrum);
      const sideDome = new THREE.Mesh(new THREE.SphereGeometry(5.1, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), slateRoofMat);
      sideDome.scale.set(1.0, 1.04, 1.12);
      sideDome.position.set(dx, 16.8, -24.0);
      roofAndDomesGroup.add(sideDome);
      const sideFinial = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.7, 6), goldMat);
      sideFinial.position.set(dx, 24.8, -24.0);
      roofAndDomesGroup.add(sideFinial);
    });

    [-10, 10].forEach(function (bx) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.5, 8), goldMat);
      pole.position.set(bx, 2.9, -15.6);
      palaceRoot.add(pole);
      const banner = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.8, 0.95), crestMat);
      banner.position.set(bx, 4.1, -15.1);
      palaceRoot.add(banner);
    });

    if (window.CrownPalaceRooms && typeof window.CrownPalaceRooms.furnish === 'function') {
      window.CrownPalaceRooms.furnish({
        THREE: THREE,
        kit: kit,
        floor1Group: floor1Group,
        floor1Colliders: floor1Colliders,
        floor2Group: floor2Group,
        floor2Colliders: floor2Colliders,
        floor3Group: floor3Group,
        floor3Colliders: floor3Colliders,
        sharedColliders: sharedColliders,
        cottages: enterableCottages,
        placeArmchair: placeArmchair,
        placeTub: placeTub,
        placeShower: placeShower,
        addBox: addBox,
        addCircle: addCircle,
        tagInteractable: tagInteractable,
        registerSpot: registerSpot,
        localToWorld: localToWorld,
      });
    }

    if (window.CrownPalaceUpper && typeof window.CrownPalaceUpper.build === 'function') {
      upperFloors = window.CrownPalaceUpper.build({
        THREE: THREE,
        kit: kit,
        palaceRoot: palaceRoot,
        floor1Group: floor1Group,
        floor1Colliders: floor1Colliders,
        floor2Group: floor2Group,
        floor2Colliders: floor2Colliders,
        floor3Group: floor3Group,
        floor3Colliders: floor3Colliders,
        ivoryMat: ivoryMat,
        wingFacadeMat: wingFacadeMat,
        pavFacadeMat: pavFacadeMat,
        marbleMat: marbleMat,
        parquetMat: parquetMat,
        goldMat: goldMat,
        blushRugMat: blushRugMat,
        addBox: addBox,
        addCircle: addCircle,
        addWallX: addWallX,
        addWallZ: addWallZ,
        placeBed: placeBed,
        placeToilet: placeToilet,
        placeVanitySink: placeVanitySink,
        placeTub: placeTub,
        placeShower: placeShower,
        placeSofa: placeSofa,
        placeArmchair: placeArmchair,
        tagInteractable: tagInteractable,
        registerSpot: registerSpot,
        localToWorld: localToWorld,
      });
    }

    if (window.CrownTown && typeof window.CrownTown.build === 'function') {
      townMod = window.CrownTown.build({
        THREE: THREE,
        kit: kit,
        scene: scene,
        sharedColliders: sharedColliders,
        spots: spots,
        ivoryMat: ivoryMat,
        whiteMarbleMat: whiteMarbleMat,
        parquetMat: parquetMat,
        marbleMat: marbleMat,
        goldMat: goldMat,
        glassMat: glassMat,
        cottageFloorMat: cottageFloorMat,
        cottageWallMat: cottageWallMat,
        slateRoofMat: slateRoofMat,
        waterMat: waterMat,
        boxwoodMat: boxwoodMat,
        addBox: addBox,
        addCircle: addCircle,
        addWallX: addWallX,
        addWallZ: addWallZ,
        placeBed: placeBed,
        placeToilet: placeToilet,
        placeVanitySink: placeVanitySink,
        placeTub: placeTub,
        placeShower: placeShower,
        placeSofa: placeSofa,
        placeArmchair: placeArmchair,
        tagInteractable: tagInteractable,
        registerSpot: registerSpot,
        localToWorld: localToWorld,
      });
    }

    // Merge static geometry across palace floors, cottages, palace shell, and exterior landscape buckets
    if (kit && typeof kit.mergeStaticGroup === 'function') {
      const nonInteractFilter = function (m) {
        return !(m.userData && (m.userData.interactId || m.userData.noMerge));
      };
      [
        floor1Group, floor1FrontCutaway,
        floor2Group, floor2FrontCutaway,
        floor3Group, floor3FrontCutaway,
        roofAndDomesGroup,
      ].forEach(function (fg) {
        kit.mergeStaticGroup(fg, { filter: nonInteractFilter });
      });

      const palaceShellBatch = new THREE.Group();
      const directPalaceChildren = palaceRoot.children.slice();
      for (let pi = 0; pi < directPalaceChildren.length; pi++) {
        const pch = directPalaceChildren[pi];
        if (pch.isMesh && !pch.isInstancedMesh && nonInteractFilter(pch)) {
          palaceShellBatch.add(pch);
        }
      }
      if (palaceShellBatch.children.length > 0) {
        palaceRoot.add(palaceShellBatch);
        kit.mergeStaticGroup(palaceShellBatch, { filter: nonInteractFilter });
      }

      for (let ci = 0; ci < enterableCottages.length; ci++) {
        const ct = enterableCottages[ci];
        if (ct.roofGrp) {
          kit.mergeStaticGroup(ct.roofGrp, { filter: nonInteractFilter });
          ct.roofGrp.userData.noMerge = true;
        }
        if (ct.grp) {
          kit.mergeStaticGroup(ct.grp, { filter: nonInteractFilter });
        }
      }

      function hasSpecialSceneNode(node) {
        if (!node) return false;
        const ud = node.userData;
        if (ud && (ud.interactId || ud.noMerge || ud.rig || ud.rotor)) return true;
        if (node.isInstancedMesh || node.isLight) return true;
        const ch = node.children;
        for (let k = 0; k < ch.length; k++) {
          if (hasSpecialSceneNode(ch[k])) return true;
        }
        return false;
      }

      const sceneStaticSkip = new Set([palaceRoot, grounds, seaMesh]);
      const extZones = [new THREE.Group(), new THREE.Group(), new THREE.Group()];
      const _extBox = new THREE.Box3();
      const _extCtr = new THREE.Vector3();
      scene.updateMatrixWorld(true);
      const sceneOrigChildren = scene.children.slice();
      for (let si = 0; si < sceneOrigChildren.length; si++) {
        const sch = sceneOrigChildren[si];
        if (sceneStaticSkip.has(sch) || hasSpecialSceneNode(sch)) continue;
        _extBox.setFromObject(sch);
        if (_extBox.isEmpty()) continue;
        _extBox.getCenter(_extCtr);
        const zi = _extCtr.x < -55 ? 0 : _extCtr.x <= 55 ? 1 : 2;
        extZones[zi].add(sch);
      }
      for (let zi = 0; zi < extZones.length; zi++) {
        if (extZones[zi].children.length > 0) {
          scene.add(extZones[zi]);
          kit.mergeStaticGroup(extZones[zi], { filter: nonInteractFilter });
        }
      }
    }

    // -----------------------------------------------------------
    // 4. SIMS-4 CUTAWAY CONTROLLER (7 Palace Floors + 10 Cottages + Town Buildings!)
    // -----------------------------------------------------------
    function isInsidePalace(pos) {
      return Math.abs(pos.x) <= 30.8 && pos.z <= -17.2 && pos.z >= -38.8;
    }

    function updateCutaway(playerPos, floorMode) {
      const mode = floorMode || 'auto';
      const inside = isInsidePalace(playerPos);

      // Individual Commoner Cottage Cutaway: hides pitched roof when inside a cottage!
      for (let i = 0; i < enterableCottages.length; i++) {
        const ct = enterableCottages[i];
        const inCot = playerPos.y < 1.5 && playerPos.x >= ct.minX - 0.5 && playerPos.x <= ct.maxX + 0.5 && playerPos.z >= ct.minZ - 0.5 && playerPos.z <= ct.maxZ + 0.5;
        ct.roofGrp.visible = !inCot;
      }

      if (townMod) {
        townMod.updateTownCutaway(playerPos);
      }

      if (mode === 'exterior' || (mode === 'auto' && !inside)) {
        roofAndDomesGroup.visible = true;
        floor3Group.visible = true;
        floor3FrontCutaway.visible = true;
        floor2Group.visible = true;
        floor2FrontCutaway.visible = true;
        floor1FrontCutaway.visible = true;
        hallPointLight.visible = false;
        suiteLight.visible = false;
        if (upperFloors) upperFloors.setUpperCutaway(7, true);
        return;
      }

      let activeLevel = 1;
      if (mode !== 'auto' && /^[1-7]f$/.test(mode)) {
        activeLevel = parseInt(mode.charAt(0), 10);
      } else if (playerPos.y >= 28.2) {
        activeLevel = 7;
      } else if (playerPos.y >= 23.2) {
        activeLevel = 6;
      } else if (playerPos.y >= 18.2) {
        activeLevel = 5;
      } else if (playerPos.y >= 13.2) {
        activeLevel = 4;
      } else if (playerPos.y >= 8.2) {
        activeLevel = 3;
      } else if (playerPos.y >= 3.2) {
        activeLevel = 2;
      } else {
        activeLevel = 1;
      }

      roofAndDomesGroup.visible = false;
      floor1FrontCutaway.visible = activeLevel > 1;
      floor2Group.visible = activeLevel >= 2;
      floor2FrontCutaway.visible = activeLevel > 2;
      floor3Group.visible = activeLevel >= 3;
      floor3FrontCutaway.visible = activeLevel > 3;
      hallPointLight.visible = activeLevel === 1;
      suiteLight.visible = activeLevel === 2;
      if (upperFloors) upperFloors.setUpperCutaway(activeLevel, false);
    }

    // -----------------------------------------------------------
    // 5. WATER FOUNTAIN ANIMATION & ZONES
    // -----------------------------------------------------------
    const _dropPos = new THREE.Vector3();
    const _mat4 = new THREE.Matrix4();

    function isInPool(pos) {
      if (!pos) return false;
      if (upperFloors && typeof upperFloors.isInUpperPool === 'function' && upperFloors.isInUpperPool(pos)) {
        return true;
      }
      if (townMod && Array.isArray(townMod.poolZones) && pos.y < 1.5) {
        for (let p = 0; p < townMod.poolZones.length; p++) {
          const pz = townMod.poolZones[p];
          if (pos.x >= pz.minX && pos.x <= pz.maxX && pos.z >= pz.minZ && pos.z <= pz.maxZ) {
            return true;
          }
        }
      }
      // Riviera Ocean Swimming Shallows (clear of Yacht Pier)
      if (
        pos.y < 1.2 &&
        pos.z >= 59.4 &&
        pos.z <= 145 &&
        Math.abs(pos.x) <= 156 &&
        !(Math.abs(pos.x) <= 2.75 && pos.z <= 67.2)
      ) {
        return true;
      }
      return false;
    }

    // Soft Multi-Puff Cumulus Clouds Drifting Overhead
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0 });
    const cloudGroup = new THREE.Group();
    const cloudSeeds = [
      [-120, 62, -95, 1.2], [-45, 68, -110, 1.4], [55, 64, -98, 1.1],
      [135, 60, -82, 1.3], [-95, 58, 95, 1.1], [25, 65, 115, 1.35], [125, 60, 100, 1.15],
    ];
    cloudSeeds.forEach(function (cs) {
      const cg = new THREE.Group();
      cg.position.set(cs[0], cs[1], cs[2]);
      const sc = cs[3];
      [[-3.2, 0, 0, 3.6, 2.1, 2.6], [0, 1.0, 0, 4.6, 2.7, 3.1], [3.5, 0.2, 0.4, 3.4, 2.0, 2.5]].forEach(function (p) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), cloudMat);
        puff.scale.set(p[3] * sc, p[4] * sc, p[5] * sc);
        puff.position.set(p[0] * sc, p[1] * sc, p[2] * sc);
        cg.add(puff);
      });
      cloudGroup.add(cg);
    });
    cloudGroup.userData.noMerge = true;
    cloudGroup.userData.noFreeze = true;
    scene.add(cloudGroup);

    // Freeze static mesh matrices across the scene while keeping animated/interactive rigs dynamic
    const dynamicSubtrees = new Set([cloudGroup, showerSpray, hallPointLight, suiteLight]);
    for (let fi = 0; fi < animatedFountains.length; fi++) {
      if (animatedFountains[fi] && animatedFountains[fi].drops) {
        dynamicSubtrees.add(animatedFountains[fi].drops);
      }
    }
    for (let pi = 0; pi < palaceFlames.length; pi++) {
      if (palaceFlames[pi]) dynamicSubtrees.add(palaceFlames[pi]);
    }
    if (townMod && Array.isArray(townMod.dynamicNodes)) {
      for (let di = 0; di < townMod.dynamicNodes.length; di++) {
        if (townMod.dynamicNodes[di]) dynamicSubtrees.add(townMod.dynamicNodes[di]);
      }
    }
    scene.updateMatrixWorld(true);
    (function freezeStaticMatrices(node, inDynSubtree) {
      const ud = node.userData;
      const isDyn = inDynSubtree || dynamicSubtrees.has(node) || node.isLight || node.isCamera || (ud && (ud.noFreeze || ud.rig || ud.rotor));
      if (!isDyn && (node.isMesh || node.isInstancedMesh)) {
        node.updateMatrix();
        node.matrixAutoUpdate = false;
      }
      const ch = node.children;
      for (let i = 0; i < ch.length; i++) {
        freezeStaticMatrices(ch[i], isDyn);
      }
    })(scene, false);

    function update(elapsedSec, activeTransport, playerPos) {
      waterUniforms.uWaterTime.value = elapsedSec;
      waterTex.offset.x = (elapsedSec * 0.028) % 1;
      waterTex.offset.y = (elapsedSec * 0.016) % 1;
      cloudGroup.position.x = Math.sin(elapsedSec * 0.015) * 28;
      for (let f = 0; f < animatedFountains.length; f++) {
        const ft = animatedFountains[f];
        if (!ft.drops) continue;
        for (let i = 0; i < 16; i++) {
          const ang = (i / 16) * Math.PI * 2 + elapsedSec * (0.7 + f * 0.15);
          const phase = (elapsedSec * 1.05 + i * 0.23 + f * 0.31) % 1;
          const rad = 0.25 + phase * (ft.radius * 0.56);
          const yDrop = 3.6 + (1 - Math.pow(phase * 2 - 1, 2)) * 1.4 - phase * 3.0;
          _dropPos.set(Math.cos(ang) * rad, Math.max(0.45, yDrop), Math.sin(ang) * rad);
          _mat4.makeTranslation(_dropPos.x, _dropPos.y, _dropPos.z);
          ft.drops.setMatrixAt(i, _mat4);
        }
        ft.drops.instanceMatrix.needsUpdate = true;
      }
      for (let k = 0; k < palaceFlames.length; k++) {
        palaceFlames[k].scale.y = 0.85 + Math.sin(elapsedSec * (9.0 + k * 2.2)) * 0.25;
      }
      if (showerSpray.visible) {
        showerSpray.rotation.y = elapsedSec * 6.0;
      }
      const activeBoat = activeTransport && activeTransport.kind === 'boat' ? activeTransport.entity : null;
      for (let bi = 0; bi < boatsList.length; bi++) {
        const bt = boatsList[bi];
        if (!bt || !bt.group || bt === activeBoat) continue;
        bt.group.position.y = (bt.baseWaterY || -0.40) + Math.sin(elapsedSec * 1.9 + (bt.phase || 0)) * 0.045;
        bt.group.rotation.z = Math.sin(elapsedSec * 1.3 + (bt.phase || 0)) * 0.03;
      }
      if (townMod) {
        townMod.update(elapsedSec, activeTransport, playerPos);
      }
    }

    function detectZone(pos) {
      if (upperFloors && pos.y >= 13.2 && isInsidePalace(pos)) {
        const upZone = upperFloors.detectUpperZone(pos);
        if (upZone) return upZone;
      }
      if (pos.y >= 8.2 && isInsidePalace(pos)) {
        if (pos.x < -17.2 && pos.z < -25) return 'Bedroom #10 & Bath (3F)';
        if (pos.x < 3 && pos.z < -25) return 'Mansard Guest Suites #11-#12 (3F)';
        if (pos.x >= 7.6 && pos.z < -25) return 'Dome Canopy Suite #13-#14 (3F)';
        return '3F Mansard Reading Lounge';
      }
      if (pos.y >= 3.2 && isInsidePalace(pos)) {
        if (pos.z > -18.5) return 'Upper Château Balcony (2F)';
        if (pos.x < -21.8 && pos.z < -25) return 'Master Marble Bath (2F)';
        if (pos.x < -11.4 && pos.z < -25) return 'Princess Master Bedroom #4 (2F)';
        if (pos.x < 4.5) return '2F Upper Suites & Gallery';
        return 'Queen Mother Imperial Wing (2F)';
      }
      if (isInsidePalace(pos)) {
        if (pos.x < -21.8) return '1F West Wing Suites & Powder Room';
        if (pos.x < -9.8 && pos.z < -28.0) return 'Palace Kitchen Hearth (1F)';
        if (pos.x < -9.8) return 'Royal Dining Salon (1F)';
        if (pos.x > 21.8) return '1F East Suites & Powder Room';
        if (pos.x > 9.8 && pos.z > -27.8) return 'Royal Drawing Living Room (1F)';
        if (pos.x > 9.8) return 'Grand Ballroom & Thrones (1F)';
        return 'Hall of Mirrors (1F)';
      }
      for (let i = 0; i < enterableCottages.length; i++) {
        const ct = enterableCottages[i];
        if (pos.x >= ct.minX && pos.x <= ct.maxX && pos.z >= ct.minZ && pos.z <= ct.maxZ) {
          return ct.title + ' (Interior)';
        }
      }
      if (townMod) {
        const tz = townMod.detectTownZone(pos);
        if (tz) return tz;
      }
      if (pos.z < -12) return 'Palace Grand Steps';
      if (pos.z <= 41 && Math.abs(pos.x) <= 42) return 'Versailles Parterre Gardens';
      if (pos.z >= 59.5 && Math.abs(pos.x) <= 4.5) return 'Riviera Yacht Pier';
      if (pos.z >= 51.8) return 'Riviera Golden Sandy Beach';
      if (pos.x < -42) return 'Willow Creek Suburbs & Civic Town';
      if (pos.x > 42) return 'Royal Campus, Pool & Promenade';
      return 'Waterfront Riviera Boulevard';
    }

    function setShowerActive(on) {
      showerSpray.visible = Boolean(on);
    }

    function dispose() {
      textures.forEach(function (t) { t.dispose(); });
      if (townMod && typeof townMod.dispose === 'function') townMod.dispose();
      if (kit) kit.dispose();
    }

    return {
      groundHeightAt: groundHeightAt,
      resolveCollision: resolveCollision,
      hasBlockedSegment: hasBlockedSegment,
      isDrivableSurface: isDrivableSurface,
      snapToDrivableSurface: snapToDrivableSurface,
      updateCutaway: updateCutaway,
      detectZone: detectZone,
      isInsidePalace: isInsidePalace,
      isInPool: isInPool,
      interactiveMeshes: interactiveMeshes,
      spots: spots,
      shortcuts: shortcutsList,
      cottages: enterableCottages,
      vehicles: townMod ? townMod.vehicles : [],
      horses: townMod ? townMod.horses : [],
      boats: boatsList,
      townDirectory: townMod ? townMod.townDirectory : [],
      townDoors: townMod ? townMod.townDoors : [],
      toggleDoor: townMod && townMod.toggleDoor,
      setShowerActive: setShowerActive,
      update: update,
      dispose: dispose,
    };
  }

  window.CrownCastle = {
    buildVersaillesEstate: buildVersaillesEstate,
  };
})();
