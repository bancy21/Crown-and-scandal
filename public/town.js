(function () {
  'use strict';

  function buildRivieraTown(ctx) {
    const THREE = ctx.THREE;
    const kit = ctx.kit;
    const scene = ctx.scene;
    if (!THREE || !kit || !scene) return null;

    const sharedColliders = ctx.sharedColliders;
    const ivoryMat = ctx.ivoryMat;
    const whiteMarbleMat = ctx.whiteMarbleMat;
    const parquetMat = ctx.parquetMat;
    const marbleMat = ctx.marbleMat;
    const goldMat = ctx.goldMat;
    const glassMat = ctx.glassMat;
    const cottageFloorMat = ctx.cottageFloorMat;
    const cottageWallMat = ctx.cottageWallMat;
    const slateRoofMat = ctx.slateRoofMat;
    const waterMat = ctx.waterMat;
    const boxwoodMat = ctx.boxwoodMat;

    const addBox = ctx.addBox;
    const addCircle = ctx.addCircle;
    const addWallX = ctx.addWallX;
    const addWallZ = ctx.addWallZ;
    const placeBed = ctx.placeBed;
    const placeToilet = ctx.placeToilet;
    const placeVanitySink = ctx.placeVanitySink;
    const placeTub = ctx.placeTub;
    const placeShower = ctx.placeShower;
    const placeSofa = ctx.placeSofa;
    const placeArmchair = ctx.placeArmchair;
    const tagInteractable = ctx.tagInteractable;
    const registerSpot = ctx.registerSpot;
    const localToWorld = ctx.localToWorld;

    const townGroup = new THREE.Group();
    scene.add(townGroup);

    const cutaways = [];
    const walkableFloors = [];
    const townZones = [];
    const poolZones = [];
    const townDirectory = [];
    const vehicles = [];
    const horsesList = [];
    const farmAnimals = [];
    const tvScreens = [];
    const animatedFlames = [];
    const poolFloatRings = [];
    const windmillRotors = [];
    const townDoors = [];
    const dynamicNodes = [];
    let lastTownElapsed = 0;

    const asphaltMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0x3b404b, roughness: 0.86 }));
    const sidewalkMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xded6c8, roughness: 0.68 }));
    const roadLineMat = kit.keepMat(new THREE.MeshBasicMaterial({ color: 0xf8f1df }));
    const driveMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0x8e8c87, roughness: 0.85 }));
    const tileFloorMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xe3dfd8, roughness: 0.52 }));
    const clinicalFloorMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xedf4f7, roughness: 0.44 }));
    const hospitalWallMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xf4f8fa, roughness: 0.58 }));
    const brickMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0x9b4d42, roughness: 0.76 }));
    const terracottaMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xa6503f, roughness: 0.72 }));
    const pastelPinkWall = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xf6e2e6, roughness: 0.72 }));
    const mintWallMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xe1ede5, roughness: 0.72 }));
    const skyWallMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xe2eaf2, roughness: 0.72 }));
    const butterWallMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xf7ecd5, roughness: 0.72 }));
    const stoneWallMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xd8cfc2, roughness: 0.74 }));
    const clubDarkMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0x1d1624, roughness: 0.48, metalness: 0.25 }));
    const poolDeckMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xf0e7d8, roughness: 0.65 }));

    // -----------------------------------------------------------
    // 1. EXPANDED SIMS-4 ASPHALT STREET GRID (North + South Green Land)
    // -----------------------------------------------------------
    const dashSpecs = [];

    function addStreetStrip(x, z, w, d, isHorizontal) {
      const road = new THREE.Mesh(new THREE.PlaneGeometry(w, d), asphaltMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(x, 0.028, z);
      road.receiveShadow = true;
      townGroup.add(road);

      if (isHorizontal) {
        [-d * 0.5 - 0.55, d * 0.5 + 0.55].forEach(function (dz) {
          const sw = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, 1.1), sidewalkMat);
          sw.position.set(x, 0.035, z + dz);
          sw.receiveShadow = true;
          townGroup.add(sw);
        });
        for (let sx = x - w * 0.5 + 3; sx <= x + w * 0.5 - 3; sx += 5.5) {
          dashSpecs.push([sx, z, 2.4, 0.14]);
        }
      } else {
        [-w * 0.5 - 0.55, w * 0.5 + 0.55].forEach(function (dx) {
          const sw = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, d), sidewalkMat);
          sw.position.set(x + dx, 0.035, z);
          sw.receiveShadow = true;
          townGroup.add(sw);
        });
        for (let sz = z - d * 0.5 + 3; sz <= z + d * 0.5 - 3; sz += 5.5) {
          dashSpecs.push([x, sz, 0.14, 2.4]);
        }
      }
    }

    // West Town Streets (connected straight across to Château West Side Lane x = -44)
    addStreetStrip(-101.0, -10.5, 114, 4.4, true);
    addStreetStrip(-101.0, 0.0, 114, 4.4, true);
    addStreetStrip(-101.0, 19.2, 114, 4.2, true);
    addStreetStrip(-67.0, 4.0, 4.0, 88.0, false);
    addStreetStrip(-95.0, 18.0, 4.4, 57.0, false);
    addStreetStrip(-123.5, 18.0, 4.4, 57.0, false);
    addStreetStrip(-153.5, 4.0, 4.0, 88.0, false);

    // East Campus, Hospital & Riviera Streets (shifted East edge 156.5 to clear 3-Storey Montieri Hotel + Valet Lot)
    addStreetStrip(105.0, -10.5, 122, 4.4, true);
    addStreetStrip(105.0, 0.0, 122, 4.4, true);
    addStreetStrip(105.0, 19.2, 122, 4.2, true);
    addStreetStrip(67.0, 2.0, 4.0, 88.0, false);
    addStreetStrip(92.5, 2.0, 4.4, 88.0, false);
    addStreetStrip(120.5, 2.0, 4.4, 88.0, false);
    addStreetStrip(156.5, 2.0, 4.0, 88.0, false);

    // Zebra Crosswalks at Major Town, Hospital, Mansionette & School Crossings
    [
      [-79.5, -10.5], [-111.5, -10.5], [-139.0, -10.5],
      [-83.0, 19.2], [-111.0, 19.2], [-139.0, 19.2],
      [79.6, -10.5], [106.5, -10.5], [133.6, -10.5],
      [79.6, 19.2], [106.5, 19.2], [133.6, 19.2],
      [79.6, 48.0], [106.5, 48.0], [-81.0, 48.0], [-111.0, 48.0],
    ].forEach(function (cw) {
      for (let bar = -1.4; bar <= 1.4; bar += 0.7) {
        dashSpecs.push([cw[0] + bar, cw[1], 0.36, 3.2]);
      }
    });

    if (dashSpecs.length) {
      const dashDummy = new THREE.Object3D();
      const dashInst = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), roadLineMat, dashSpecs.length);
      for (let di = 0; di < dashSpecs.length; di++) {
        const sp = dashSpecs[di];
        dashDummy.position.set(sp[0], 0.035, sp[1]);
        dashDummy.rotation.set(-Math.PI / 2, 0, 0);
        dashDummy.scale.set(sp[2], sp[3], 1);
        dashDummy.updateMatrix();
        dashInst.setMatrixAt(di, dashDummy.matrix);
      }
      dashInst.computeBoundingSphere();
      townGroup.add(dashInst);
    }

    function recordDispatchGossip(ctxAct, headline, cloutDelta, scandalDelta) {
      const g = ctxAct.game || window.CrownGame;
      if (!g) return;
      if (!g.reputation) g.reputation = { clout: 50, scandal: 0, rank: 'Crown Heiress' };
      g.reputation.clout = Math.max(0, Math.min(100, (g.reputation.clout || 50) + (cloutDelta || 0)));
      g.reputation.scandal = Math.max(0, Math.min(100, (g.reputation.scandal || 0) + (scandalDelta || 0)));
      if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
      if (headline) {
        const clean = headline.indexOf('Crown Dispatch:') === 0 ? headline : 'Crown Dispatch: ' + headline;
        g.gossipLog.unshift({ day: (g.world && g.world.day) || 1, text: clean });
        if (g.gossipLog.length > 24) g.gossipLog.length = 24;
      }
    }

    function registerDrivableCar(cfg) {
      const car = kit.buildParkedCar(cfg.paintHex, cfg.isSuv, cfg.id, Boolean(cfg.isConvertible));
      car.position.set(cfg.x, 0.02, cfg.z);
      car.rotation.y = cfg.yaw || 0;
      townGroup.add(car);
      tagInteractable(car, cfg.id);
      const carSpot = {
        id: cfg.id,
        title: cfg.title,
        floor: 0,
        category: 'town',
        shortcut: Boolean(cfg.shortcut),
        x: cfg.x, y: 0.02, z: cfg.z,
        radius: 3.9,
        actions: [
          {
            id: cfg.id + '_drive',
            type: 'drive_vehicle',
            vehicleId: cfg.id,
            label: 'Get In & Drive ' + cfg.title,
            hint: 'Drive across avenues, suburbs, farm, hospital & beachfront!',
            instant: true,
          },
          {
            id: cfg.id + '_chauffeur',
            type: 'chauffeur_drive',
            vehicleId: cfg.id,
            label: 'Have Chauffeur Lucien Drive Me...',
            hint: 'Ride in passenger seat while Lucien drives to any destination!',
            instant: true,
          },
          {
            id: cfg.id + '_passengers',
            type: 'invite_car_passengers',
            vehicleId: cfg.id,
            label: 'Invite Companions Into Car',
            hint: 'Board friends, courtiers or staff into passenger seats with you',
            instant: true,
          },
          {
            id: cfg.id + '_doors',
            type: 'toggle_car_doors',
            vehicleId: cfg.id,
            label: 'Open / Close Car Doors',
            hint: 'Swing driver & passenger doors open or shut',
            instant: true,
          },
          {
            id: cfg.id + '_horn',
            label: 'Sound Horn & Pose by Vehicle',
            hint: '+8 Fun & Royal Press Buzz',
            instant: true,
            onInstant: function (actCtx) {
              if (window.CrownAudio) window.CrownAudio.playHorn ? window.CrownAudio.playHorn() : window.CrownAudio.playSelect();
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 8 });
              if (cfg.gossipText) {
                recordDispatchGossip(actCtx, cfg.gossipText, 2, 1);
              }
              actCtx.toast('Beep beep! Press Drive anytime to cruise in ' + cfg.title + '.');
            },
          },
        ],
      };
      registerSpot(carSpot);
      vehicles.push({
        id: cfg.id,
        title: cfg.title,
        group: car,
        spot: carSpot,
        x: cfg.x,
        z: cfg.z,
        yaw: cfg.yaw || 0,
        radius: 1.45,
      });
      if (cfg.inDirectory) {
        townDirectory.push(carSpot);
      }
      return carSpot;
    }

    /**
     * Sims-4 Enterable Architectural Lot Builder
     */
    function addEnterableLot(cfg) {
      const w = cfg.w;
      const d = cfg.d;
      const wallH = cfg.wallH || 3.6;
      const cx = cfg.x;
      const cz = cfg.z;
      const baseFloorY = 0.12;

      const lotPad = new THREE.Mesh(new THREE.BoxGeometry(w + 2.2, 0.08, d + 2.2), sidewalkMat);
      lotPad.position.set(cx, 0.04, cz);
      lotPad.receiveShadow = true;
      townGroup.add(lotPad);

      const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, d), cfg.floorMat || tileFloorMat);
      floor.position.set(cx, 0.06, cz);
      floor.receiveShadow = true;
      townGroup.add(floor);

      const wallMat = cfg.wallMat || ivoryMat;
      const doorW = cfg.doorW || 2.6;
      const doorFace = cfg.doorFace || 'S';
      addWallX(townGroup, sharedColliders, 0, wallH, cz - d * 0.5, cx - w * 0.5, cx + w * 0.5, doorFace.indexOf('N') !== -1 ? cx : null, doorW, 0.28, wallMat);
      addWallX(townGroup, sharedColliders, 0, wallH, cz + d * 0.5, cx - w * 0.5, cx + w * 0.5, doorFace.indexOf('S') !== -1 ? cx : null, doorW, 0.28, wallMat);
      addWallZ(townGroup, sharedColliders, 0, wallH, cx - w * 0.5, cz - d * 0.5, cz + d * 0.5, doorFace.indexOf('W') !== -1 ? cz : null, doorW, 0.28, wallMat);
      addWallZ(townGroup, sharedColliders, 0, wallH, cx + w * 0.5, cz - d * 0.5, cz + d * 0.5, doorFace.indexOf('E') !== -1 ? cz : null, doorW, 0.28, wallMat);

      // Articulated Swinging Entrance Doors on every town building doorway (open automatically on foot OR when driving up!)
      if (!cfg.noDoors && typeof kit.buildHingedDoors === 'function') {
        const doorLeafCol = cfg.doorColor || (wallMat === clubDarkMat ? 0x2b1d36 : 0xfaf2e4);
        const doorFrame = wallMat === brickMat || wallMat === clubDarkMat ? ivoryMat : wallMat;
        for (let fi = 0; fi < doorFace.length; fi++) {
          const df = doorFace[fi];
          let dpx = cx;
          let dpz = cz;
          let dRot = 0;
          if (df === 'S') { dpz = cz + d * 0.5; dRot = 0; }
          else if (df === 'N') { dpz = cz - d * 0.5; dRot = Math.PI; }
          else if (df === 'E') { dpx = cx + w * 0.5; dRot = Math.PI * 0.5; }
          else if (df === 'W') { dpx = cx - w * 0.5; dRot = -Math.PI * 0.5; }
          else continue;
          const doorsObj = kit.buildHingedDoors({
            width: Math.max(1.8, doorW - 0.08),
            height: Math.min(wallH - 0.35, 2.65),
            count: doorW >= 1.9 ? 2 : 1,
            frameMat: doorFrame,
            leafColor: doorLeafCol,
            handleMat: goldMat,
            filigree: doorW >= 2.2,
          });
          doorsObj.group.position.set(dpx, baseFloorY, dpz);
          doorsObj.group.rotation.y = dRot;
          townGroup.add(doorsObj.group);
          const doorId = 'door_' + cfg.id + '_' + df;
          tagInteractable(doorsObj.leftPivot, doorId);
          if (doorsObj.rightPivot) tagInteractable(doorsObj.rightPivot, doorId);
          doorsObj.group.userData.noMerge = true;
          doorsObj.group.userData.noFreeze = true;
          dynamicNodes.push(doorsObj.group);
          townDoors.push({
            id: doorId,
            title: cfg.title + ' Doors',
            x: dpx,
            y: baseFloorY,
            z: dpz,
            radius: 4.0,
            doors: doorsObj,
            openRatio: 0,
            manualOpen: false,
          });
        }
      }

      if (cfg.windows !== false) {
        const shutMat = cfg.shutterMat || kit.palette.fabricColors.sapphire;
        if (doorFace.indexOf('S') === -1) {
          const wbS = kit.buildWindowBox(shutMat);
          wbS.position.set(cx, 1.75, cz + d * 0.5 + 0.17);
          townGroup.add(wbS);
        } else if (w >= 10.5) {
          [-w * 0.28, w * 0.28].forEach(function (wx) {
            const wb = kit.buildWindowBox(shutMat);
            wb.position.set(cx + wx, 1.85, cz + d * 0.5 + 0.17);
            townGroup.add(wb);
          });
        }
        if (doorFace.indexOf('E') === -1) {
          const wbE = kit.buildWindowBox(shutMat);
          wbE.rotation.y = Math.PI * 0.5;
          wbE.position.set(cx + w * 0.5 + 0.17, 1.75, cz);
          townGroup.add(wbE);
        }
      }

      const roofGrp = new THREE.Group();
      if (cfg.flatRoof) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.45, d + 0.8), cfg.roofMat || slateRoofMat);
        slab.position.set(cx, wallH + 0.22, cz);
        slab.castShadow = true;
        roofGrp.add(slab);
        const cornice = new THREE.Mesh(new THREE.BoxGeometry(w + 1.1, 0.18, d + 1.1), ivoryMat);
        cornice.position.set(cx, wallH + 0.48, cz);
        roofGrp.add(cornice);
      } else {
        const gable = kit.buildGableRoof(w, d, cfg.pitchH || 2.15, cfg.roofMat || terracottaMat, ivoryMat, {
          chimney: cfg.chimney !== false,
          dormer: Boolean(cfg.dormer),
          cupola: Boolean(cfg.cupola),
        });
        gable.position.set(cx, wallH - 0.02, cz);
        roofGrp.add(gable);
      }
      townGroup.add(roofGrp);

      const sign = kit.buildPlotSign(cfg.signTitle || cfg.title, cfg.signColor);
      if (doorFace === 'E') {
        sign.position.set(cx + w * 0.5 + 1.35, 0, cz - doorW * 0.82);
        sign.rotation.y = Math.PI * 0.5;
      } else if (doorFace === 'W') {
        sign.position.set(cx - w * 0.5 - 1.35, 0, cz - doorW * 0.82);
        sign.rotation.y = -Math.PI * 0.5;
      } else if (doorFace === 'N') {
        sign.position.set(cx + doorW * 0.85, 0, cz - d * 0.5 - 1.25);
        sign.rotation.y = Math.PI;
      } else {
        sign.position.set(cx + doorW * 0.85, 0, cz + d * 0.5 + 1.25);
      }
      townGroup.add(sign);

      walkableFloors.push({
        minX: cx - w * 0.5,
        maxX: cx + w * 0.5,
        minZ: cz - d * 0.5,
        maxZ: cz + d * 0.5,
        y: baseFloorY,
      });

      cutaways.push({
        minX: cx - w * 0.5 - 0.6,
        maxX: cx + w * 0.5 + 0.6,
        minZ: cz - d * 0.5 - 0.6,
        maxZ: cz + d * 0.5 + 0.6,
        roofGrp: roofGrp,
      });

      townZones.push({
        minX: cx - w * 0.5 - 0.5,
        maxX: cx + w * 0.5 + 0.5,
        minZ: cz - d * 0.5 - 0.5,
        maxZ: cz + d * 0.5 + 0.5,
        label: cfg.title,
      });

      const lotCat = cfg.dirCategory || cfg.category || 'town';
      const customActs = Array.isArray(cfg.actions) ? cfg.actions : [];
      if (customActs.length > 0) {
        registerSpot({
          id: cfg.id,
          title: cfg.title,
          floor: 0,
          category: lotCat,
          shortcut: Boolean(cfg.shortcut),
          x: cx,
          y: baseFloorY,
          z: cz,
          radius: Math.max(4.4, Math.min(w, d) * 0.62),
          actions: customActs,
        });
      }

      const entrySpotId = cfg.id + '_plot_visit';
      const teleX = doorFace === 'E' ? cx + 2.4 : doorFace === 'W' ? cx - 2.4 : cx;
      const teleZ = doorFace.indexOf('S') !== -1 ? cz + d * 0.28 : doorFace.indexOf('N') !== -1 ? cz - d * 0.28 : cz;
      const teleYaw = doorFace === 'E' ? -Math.PI * 0.5 : doorFace === 'W' ? Math.PI * 0.5 : Math.PI;
      const dirEntry = {
        id: entrySpotId,
        title: cfg.title,
        floor: 0,
        category: lotCat,
        x: cx,
        y: baseFloorY,
        z: cz,
        radius: 3.0,
        isDirectoryOnly: true,
        actions: [
          {
            id: 'visit_' + cfg.id,
            label: 'Visit & Walk Inside ' + cfg.title,
            hint: cfg.subtitle || 'Explore & use interactive plot',
            instant: true,
            onInstant: function (actCtx) {
              actCtx.playerCtrl.teleport(teleX, teleZ, teleYaw, baseFloorY);
              actCtx.toast('Arrived at ' + cfg.title);
            },
          },
        ].concat(customActs),
      };
      registerSpot(dirEntry);
      townDirectory.push(dirEntry);

      return { cx: cx, cz: cz, y: baseFloorY, w: w, d: d, roofGrp: roofGrp };
    }

    function addPicketYard(cx, cz, frontEdgeX, minZ, maxZ) {
      [-1, 1].forEach(function (side) {
        const segLen = (maxZ - minZ) * 0.5 - 1.6;
        const railZ = side < 0 ? minZ + segLen * 0.5 : maxZ - segLen * 0.5;
        const bar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, segLen), ivoryMat);
        bar.position.set(frontEdgeX, 0.36, railZ);
        bar.castShadow = true;
        townGroup.add(bar);
        addBox(sharedColliders, frontEdgeX, railZ, 0.25, segLen);
      });
      [-2.8, 2.8].forEach(function (sz) {
        const bush = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 6), boxwoodMat);
        bush.position.set(frontEdgeX - 0.75, 0.45, cz + sz);
        townGroup.add(bush);
      });
    }

    // -----------------------------------------------------------
    // 2. ROYAL MOTORCADE: 2 PALACE AUTO PAVILIONS + COURTYARD ROADSTER
    // -----------------------------------------------------------
    const westPav = kit.buildAutoPavilion(9.2, 7.6);
    westPav.position.set(-38.8, 0, -22.5);
    townGroup.add(westPav);
    const eastPav = kit.buildAutoPavilion(9.2, 7.6);
    eastPav.position.set(38.8, 0, -22.5);
    townGroup.add(eastPav);

    townZones.push({ minX: -43.5, maxX: -34.0, minZ: -26.5, maxZ: -18.5, label: 'West Royal Auto Pavilion' });
    townZones.push({ minX: 34.0, maxX: 43.5, minZ: -26.5, maxZ: -18.5, label: 'East Royal Auto Pavilion' });

    registerDrivableCar({
      id: 'royal_palace_car',
      title: 'Royal Pearl Convertible Roadster',
      x: 12.2, z: 36.2, yaw: -Math.PI * 0.5,
      paintHex: '#f6ebd8', isSuv: false, isConvertible: true, shortcut: true, inDirectory: true,
      gossipText: 'Crown Princess turns heads in her open-top Pearl Convertible Roadster!',
    });
    registerDrivableCar({
      id: 'royal_palace_limo',
      title: 'Obsidian Royal Ceremonial Limousine',
      x: -40.8, z: -22.5, yaw: 0,
      paintHex: '#1d1f28', isSuv: true, isConvertible: false, shortcut: true, inDirectory: true,
      gossipText: 'Royal Ceremonial Limousine rolled out from the West Auto Pavilion!',
    });
    registerDrivableCar({
      id: 'royal_palace_coupe',
      title: 'Burgundy Crown Sport Coupe',
      x: -36.8, z: -22.5, yaw: 0,
      paintHex: '#9c223c', isSuv: false, isConvertible: true, shortcut: false, inDirectory: true,
      gossipText: 'Speeding royalty! Crimson Sport Coupe spotted leaving the Palace!',
    });
    registerDrivableCar({
      id: 'royal_palace_tourer',
      title: 'Sapphire Riviera Touring Sedan',
      x: 36.8, z: -22.5, yaw: 0,
      paintHex: '#2c4e70', isSuv: false, isConvertible: false, shortcut: false, inDirectory: true,
    });
    registerDrivableCar({
      id: 'royal_palace_suv',
      title: 'Champagne State Royal SUV',
      x: 40.8, z: -22.5, yaw: 0,
      paintHex: '#f0e6d2', isSuv: true, isConvertible: false, shortcut: false, inDirectory: true,
    });

    // -----------------------------------------------------------
    // 3. 4 AUTHENTIC 3-BEDROOM + 2-BATHROOM MIDDLE-CLASS HOUSES + CARS
    // -----------------------------------------------------------
    const middleHouses = [
      { id: 'mid_house_1', title: 'Elmwood 3-Bedroom Villa', x: -83.0, z: 9.8, carHex: '#e2d7c5', isSuv: false, wall: skyWallMat, tone: 'sapphire', roof: slateRoofMat },
      { id: 'mid_house_2', title: 'Lavender Gables 3-Bed Home', x: -83.0, z: 28.5, carHex: '#d998a8', isSuv: false, wall: pastelPinkWall, tone: 'rose', roof: slateRoofMat },
      { id: 'mid_house_3', title: 'Oakridge 3-Bedroom House', x: -111.0, z: 9.8, carHex: '#4f6d9a', isSuv: false, wall: mintWallMat, tone: 'emerald', roof: terracottaMat },
      { id: 'mid_house_4', title: 'Coastal Crest 3-Bed Family Home', x: -111.0, z: 28.5, carHex: '#3c5a4f', isSuv: true, wall: butterWallMat, tone: 'champagne', roof: terracottaMat },
    ];

    middleHouses.forEach(function (mh, mIdx) {
      const lot = addEnterableLot({
        id: mh.id,
        title: mh.title,
        signTitle: mh.title,
        signColor: '#2c3d4f',
        subtitle: '3 Bedrooms, 2 Full Bathrooms, Kitchen, Lounge & Car outside',
        dirCategory: 'cottages',
        x: mh.x,
        z: mh.z,
        w: 14.2,
        d: 11.2,
        wallH: 3.6,
        pitchH: 2.15,
        dormer: true,
        chimney: true,
        doorFace: 'E',
        doorW: 2.5,
        floorMat: tileFloorMat,
        wallMat: mh.wall,
        roofMat: mh.roof,
      });

      const cx = lot.cx;
      const cz = lot.cz;
      const y = lot.y;

      // Covered Front Porch + White Picket Yard facing East Road
      const porch = kit.buildFrontPorch(6.6, 2.2, ivoryMat);
      porch.rotation.y = Math.PI * 0.5;
      porch.position.set(cx + lot.w * 0.5 + 1.1, 0, cz);
      townGroup.add(porch);
      addPicketYard(cx, cz, cx + lot.w * 0.5 + 2.6, cz - 5.2, cz + 5.2);

      // Paved Driveway + Drivable Family Car outside
      const driveX = cx + 11.6;
      const driveZ = cz + 3.2;
      const driveway = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 3.0), driveMat);
      driveway.rotation.x = -Math.PI / 2;
      driveway.position.set(driveX, 0.02, driveZ);
      townGroup.add(driveway);

      registerDrivableCar({
        id: mh.id + '_car',
        title: mh.title + ' Family Car',
        x: driveX, z: driveZ, yaw: Math.PI * 0.5,
        paintHex: mh.carHex, isSuv: mh.isSuv, isConvertible: false, shortcut: mIdx === 0, inDirectory: false,
        gossipText: 'Princess spotted cruising in a suburban family car along Willow Creek Lane!',
      });

      // Partitioned 3-Bedroom + 2-Bathroom + Living/Kitchen Floorplan!
      // West Bedroom Column (`x = cx - 2.6`, divided into 3 real bedrooms with doorways)
      addWallZ(townGroup, sharedColliders, 0, 3.3, cx - 2.6, cz - 5.5, cz - 1.8, cz - 3.6, 1.5, 0.22, mh.wall);
      addWallZ(townGroup, sharedColliders, 0, 3.3, cx - 2.6, cz - 1.8, cz + 1.9, cz + 0.0, 1.5, 0.22, mh.wall);
      addWallZ(townGroup, sharedColliders, 0, 3.3, cx - 2.6, cz + 1.9, cz + 5.5, cz + 3.6, 1.5, 0.22, mh.wall);
      addWallX(townGroup, sharedColliders, 0, 3.3, cz - 1.8, cx - 7.0, cx - 2.6, null, 0, 0.22, mh.wall);
      addWallX(townGroup, sharedColliders, 0, 3.3, cz + 1.9, cx - 7.0, cx - 2.6, null, 0, 0.22, mh.wall);

      // Central Enclosed Bathroom #1 (North) & Bathroom #2 (South)
      addWallZ(townGroup, sharedColliders, 0, 3.3, cx + 1.2, cz - 5.5, cz - 2.4, null, 0, 0.22, mh.wall);
      addWallX(townGroup, sharedColliders, 0, 3.3, cz - 2.4, cx - 2.6, cx + 1.2, cx - 0.1, 1.4, 0.22, mh.wall);
      addWallZ(townGroup, sharedColliders, 0, 3.3, cx + 1.2, cz + 2.4, cz + 5.5, null, 0, 0.22, mh.wall);
      addWallX(townGroup, sharedColliders, 0, 3.3, cz + 2.4, cx - 2.6, cx + 1.2, cx - 0.1, 1.4, 0.22, mh.wall);

      // 3 Separate Bedrooms with Beds, Bookshelf & Wardrobe
      placeBed(townGroup, sharedColliders, {
        id: mh.id + '_bed_1', title: mh.title + ' Master Bedroom #1', floor: 0, cottage: true,
        x: cx - 5.4, y: y, z: cz - 3.7, yaw: Math.PI * 0.5, tone: mh.tone, w: 1.65, d: 2.15, noSideTable: true,
      });
      placeBed(townGroup, sharedColliders, {
        id: mh.id + '_bed_2', title: mh.title + ' Family Bedroom #2', floor: 0, cottage: true,
        x: cx - 5.4, y: y, z: cz + 0.0, yaw: Math.PI * 0.5, tone: 'rose', w: 1.55, d: 2.1, noSideTable: true,
      });
      placeBed(townGroup, sharedColliders, {
        id: mh.id + '_bed_3', title: mh.title + ' Guest Bedroom #3', floor: 0, cottage: true,
        x: cx - 5.4, y: y, z: cz + 3.7, yaw: Math.PI * 0.5, tone: 'champagne', w: 1.55, d: 2.1, noSideTable: true,
      });
      const mwWard = kit.buildWardrobe(mh.id + '_ward', true);
      mwWard.position.set(cx - 3.9, y, cz - 5.05);
      townGroup.add(mwWard);
      addBox(sharedColliders, cx - 3.9, cz - 5.05, 1.4, 0.65);

      // Enclosed Full Bathroom #1 (North: Toilet + Vanity Sink + Bathtub)
      placeToilet(townGroup, sharedColliders, {
        id: mh.id + '_toilet_1', title: mh.title + ' Master Bath Toilet', floor: 0, rustic: true,
        x: cx - 1.9, y: y, z: cz - 4.85, yaw: 0,
      });
      placeVanitySink(townGroup, sharedColliders, {
        id: mh.id + '_sink_1', title: mh.title + ' Master Bath Vanity', floor: 0, rustic: true,
        x: cx - 0.1, y: y, z: cz - 4.95, yaw: 0,
      });
      if (placeTub) {
        placeTub(townGroup, sharedColliders, {
          id: mh.id + '_tub_1', title: mh.title + ' Master Bathtub', floor: 0, rustic: true,
          x: cx - 1.3, y: y, z: cz - 3.45, yaw: 0, exitZOffset: 0.95,
        });
      }

      // Enclosed Bathroom #2 (South: Toilet + Vanity Sink + Walk-in Rain Shower)
      placeToilet(townGroup, sharedColliders, {
        id: mh.id + '_toilet_2', title: mh.title + ' Washroom #2 Toilet', floor: 0, rustic: true,
        x: cx - 1.9, y: y, z: cz + 4.85, yaw: Math.PI,
      });
      placeVanitySink(townGroup, sharedColliders, {
        id: mh.id + '_sink_2', title: mh.title + ' Washroom #2 Vanity', floor: 0, rustic: true,
        x: cx - 0.1, y: y, z: cz + 4.95, yaw: Math.PI,
      });
      if (placeShower) {
        placeShower(townGroup, sharedColliders, {
          id: mh.id + '_shower_2', title: mh.title + ' Bathroom #2 Rain Shower', floor: 0, rustic: true,
          x: cx - 1.5, y: y, z: cz + 3.4, yaw: Math.PI * 0.5, exitZOffset: 1.0,
        });
      }

      // East Open-Plan Kitchen (Stove, French-Door Fridge, Breakfast Island) & Living Salon
      const kCounter = kit.buildKitchenCounter(mh.id + '_stove', true);
      kCounter.position.set(cx + 3.6, y, cz - 4.8);
      townGroup.add(kCounter);
      tagInteractable(kCounter, mh.id + '_stove');
      addBox(sharedColliders, cx + 3.6, cz - 4.8, 3.0, 0.9);
      registerSpot({
        id: mh.id + '_stove',
        title: mh.title + ' Kitchen',
        floor: 0,
        category: 'cottages',
        x: cx + 3.6, y: y, z: cz - 4.8,
        radius: 3.0,
        actions: [
          {
            id: mh.id + '_cook',
            label: 'Cook Home-Style Brunch at Stove',
            hint: '+16 Food/s & +7 Fun/s',
            pose: 'cook',
            anchor: { x: cx + 3.6, y: y, z: cz - 3.7, yaw: Math.PI, floorY: y, exitX: cx + 3.6, exitZ: cz - 3.7, exitYaw: Math.PI },
            rates: { hunger: 16, fun: 7 },
            statusText: 'Cooking inside ' + mh.title + '...',
          },
        ],
      });

      const fridge = kit.buildFridge(true);
      fridge.position.set(cx + 6.1, y, cz - 4.8);
      townGroup.add(fridge);
      addBox(sharedColliders, cx + 6.1, cz - 4.8, 0.95, 0.78);

      const island = kit.buildModernBreakfastIsland();
      island.position.set(cx + 3.6, y, cz - 2.3);
      townGroup.add(island);
      tagInteractable(island, mh.id + '_island');
      addBox(sharedColliders, cx + 3.6, cz - 2.3, 2.5, 1.0);
      const mhBarSeats = [
        { x: cx + 3.1, y: y + 0.08, z: cz - 1.54, yaw: Math.PI, rigOffsetY: -0.45, floorY: y, exitX: cx + 3.1, exitZ: cz - 0.8, exitYaw: 0, approachX: cx + 3.1, approachZ: cz - 0.85 },
        { x: cx + 3.85, y: y + 0.08, z: cz - 1.54, yaw: Math.PI, rigOffsetY: -0.45, floorY: y, exitX: cx + 3.85, exitZ: cz - 0.8, exitYaw: 0, approachX: cx + 3.85, approachZ: cz - 0.85 },
        { x: cx + 4.5, y: y + 0.08, z: cz - 1.54, yaw: Math.PI, rigOffsetY: -0.45, floorY: y, exitX: cx + 4.5, exitZ: cz - 0.8, exitYaw: 0, approachX: cx + 4.5, approachZ: cz - 0.85 },
      ];
      registerSpot({
        id: mh.id + '_island',
        title: mh.title + ' Breakfast Bar',
        floor: 0,
        category: 'cottages',
        x: cx + 3.6, y: y, z: cz - 2.3,
        radius: 3.0,
        seats: mhBarSeats,
        actions: [
          {
            id: mh.id + '_eat_bar',
            label: 'Sit at Breakfast Bar & Eat',
            hint: '+18 Food/s & +6 Fun/s',
            pose: 'eat',
            anchor: {
              x: cx + 3.1, y: y + 0.08, z: cz - 1.54, yaw: Math.PI, rigOffsetY: -0.45, floorY: y, exitX: cx + 3.1, exitZ: cz - 0.8, exitYaw: 0,
              partnerAnchor: mhBarSeats[1],
              seats: mhBarSeats,
            },
            rates: { hunger: 18, fun: 6 },
            statusText: 'Dining at ' + mh.title + ' breakfast island...',
          },
          {
            id: mh.id + '_call_meal',
            label: 'Call Household to Breakfast',
            hint: 'Each member sits in their own separate stool!',
            type: 'call_to_meal',
            spotId: mh.id + '_island',
          },
        ],
      });

      const mhRug = kit.buildRug(3.6, 3.0, mh.tone);
      mhRug.position.set(cx + 3.8, y, cz + 2.8);
      townGroup.add(mhRug);

      const mhCoffee = kit.buildCoffeeTable(true);
      mhCoffee.position.set(cx + 3.8, y, cz + 2.85);
      townGroup.add(mhCoffee);
      addBox(sharedColliders, cx + 3.8, cz + 2.85, 1.35, 0.75);

      placeSofa(townGroup, sharedColliders, {
        id: mh.id + '_sofa', title: mh.title + ' Living Sofa', floor: 0, cottage: true,
        x: cx + 3.8, y: y, z: cz + 4.4, yaw: 0, tone: mh.tone, w: 2.3,
      });
      placeArmchair(townGroup, sharedColliders, {
        id: mh.id + '_chair', title: mh.title + ' Reading Armchair', floor: 0, cottage: true,
        x: cx + 5.7, y: y, z: cz + 2.8, yaw: -Math.PI * 0.5, tone: 'rose',
      });
      const tv = kit.buildWallTVConsole(true, mh.id + '_tv');
      tv.position.set(cx + 3.8, y, cz + 1.15);
      townGroup.add(tv);
      tvScreens.push(tv);
      tagInteractable(tv, mh.id + '_tv');
      addBox(sharedColliders, cx + 3.8, cz + 1.15, 1.8, 0.5);
      registerSpot({
        id: mh.id + '_tv',
        title: mh.title + ' Smart TV Console',
        floor: 0,
        category: 'cottages',
        x: cx + 3.8, y: y, z: cz + 1.15,
        radius: 3.4,
        actions: [
          {
            id: mh.id + '_watch_tv',
            label: 'Lounge & Watch Riviera Court Drama',
            hint: '+16 Fun/s & +5 Energy/s',
            pose: 'sofa',
            anchor: { x: cx + 3.8, y: y, z: cz + 4.48, yaw: Math.PI, rigOffsetY: -0.45, floorY: y, exitX: cx + 3.8, exitZ: cz + 3.4, exitYaw: 0 },
            rates: { fun: 16, energy: 5 },
            statusText: 'Watching TV in ' + mh.title + '...',
          },
        ],
      });

      const shelf = kit.buildBookshelf(mh.id + '_shelf', true);
      shelf.position.set(cx + 2.1, y, cz + 4.95);
      townGroup.add(shelf);
      tagInteractable(shelf, mh.id + '_shelf');
      addBox(sharedColliders, cx + 2.1, cz + 4.95, 1.5, 0.5);
      registerSpot({
        id: mh.id + '_shelf',
        title: mh.title + ' Family Bookshelf',
        floor: 0,
        category: 'cottages',
        x: cx + 2.1, y: y, z: cz + 4.95,
        radius: 3.0,
        actions: [
          {
            id: mh.id + '_read_shelf',
            label: 'Hold Book & Read Suburban Novel',
            hint: '+10 Poise/s & +10 Fun/s',
            pose: 'read',
            anchor: { x: cx + 2.1, y: y, z: cz + 3.85, yaw: 0, floorY: y, exitX: cx + 2.1, exitZ: cz + 3.85, exitYaw: 0 },
            rates: { composure: 10, fun: 10 },
            statusText: 'Reading beside ' + mh.title + ' bookshelf...',
          },
        ],
      });

      const mhChand = kit.buildChandelier(0.75);
      mhChand.position.set(cx + 3.6, y + 2.95, cz + 0.5);
      lot.roofGrp.add(mhChand);
    });

    // -----------------------------------------------------------
    // 3B. 4 ENTERABLE 2-BEDROOM STONE MANSIONETTES (Willow Creek North, z = -21.0)
    // -----------------------------------------------------------
    const mansionettes = [
      { id: 'mansionette_1', title: 'Ashford 2-Bedroom Mansionette', x: -79.5, z: -21.0, carHex: '#7e303c', tone: 'crimson' },
      { id: 'mansionette_2', title: 'Bellevue 2-Bed Mansionette', x: -95.5, z: -21.0, carHex: null, tone: 'sapphire' },
      { id: 'mansionette_3', title: 'Wisteria 2-Bed Mansionette', x: -111.5, z: -21.0, carHex: '#4f6d9a', tone: 'lavender' },
      { id: 'mansionette_4', title: 'Cotswold 2-Bed Mansionette', x: -127.5, z: -21.0, carHex: null, tone: 'emerald' },
    ];

    mansionettes.forEach(function (ms, msIdx) {
      const lot = addEnterableLot({
        id: ms.id,
        title: ms.title,
        signTitle: ms.title,
        signColor: '#3f342a',
        subtitle: '2 Bedrooms, Enclosed Full Bath, Lounge, Kitchen & Front Yard',
        dirCategory: 'cottages',
        x: ms.x,
        z: ms.z,
        w: 12.2,
        d: 9.4,
        wallH: 3.5,
        pitchH: 2.05,
        dormer: true,
        chimney: true,
        doorFace: 'S',
        doorW: 2.4,
        floorMat: parquetMat,
        wallMat: stoneWallMat,
        roofMat: slateRoofMat,
      });

      const cx = lot.cx;
      const cz = lot.cz;
      const y = lot.y;

      const msPorch = kit.buildFrontPorch(5.4, 1.9, ivoryMat);
      msPorch.position.set(cx, 0, cz + lot.d * 0.5 + 0.95);
      townGroup.add(msPorch);

      if (ms.carHex) {
        const msDrive = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 3.2), driveMat);
        msDrive.rotation.x = -Math.PI / 2;
        msDrive.position.set(cx + 4.1, 0.02, cz + 6.2);
        townGroup.add(msDrive);

        registerDrivableCar({
          id: ms.id + '_car',
          title: ms.title + ' Coupe',
          x: cx + 4.1, z: cz + 6.2, yaw: 0,
          paintHex: ms.carHex, isSuv: false, isConvertible: false, shortcut: false, inDirectory: false,
        });
      }

      // Internal Partition Walls: 2 West Bedrooms + 1 NE Full Bathroom + Open Kitchen/Living
      addWallZ(townGroup, sharedColliders, 0, 3.2, cx - 1.5, cz - 4.6, cz, cz - 2.3, 1.4, 0.22, stoneWallMat);
      addWallZ(townGroup, sharedColliders, 0, 3.2, cx - 1.5, cz, cz + 4.6, cz + 2.3, 1.4, 0.22, stoneWallMat);
      addWallX(townGroup, sharedColliders, 0, 3.2, cz, cx - 6.0, cx - 1.5, null, 0, 0.22, stoneWallMat);
      addWallZ(townGroup, sharedColliders, 0, 3.2, cx + 2.0, cz - 4.6, cz - 1.2, null, 0, 0.22, stoneWallMat);
      addWallX(townGroup, sharedColliders, 0, 3.2, cz - 1.2, cx + 2.0, cx + 6.0, cx + 3.1, 1.4, 0.22, stoneWallMat);

      placeBed(townGroup, sharedColliders, {
        id: ms.id + '_bed_1', title: ms.title + ' Bedroom #1', floor: 0, cottage: true,
        x: cx - 4.1, y: y, z: cz - 2.4, yaw: Math.PI * 0.5, tone: ms.tone, w: 1.6, d: 2.1, noSideTable: true,
      });
      placeBed(townGroup, sharedColliders, {
        id: ms.id + '_bed_2', title: ms.title + ' Bedroom #2', floor: 0, cottage: true,
        x: cx - 4.1, y: y, z: cz + 2.3, yaw: Math.PI * 0.5, tone: 'champagne', w: 1.55, d: 2.1, noSideTable: true,
      });

      // Full Enclosed Mansionette Bathroom (Toilet + Vanity Sink + Bathtub)
      placeToilet(townGroup, sharedColliders, {
        id: ms.id + '_toilet', title: ms.title + ' Bathroom Toilet', floor: 0, rustic: true,
        x: cx + 5.2, y: y, z: cz - 4.0, yaw: -Math.PI * 0.5,
      });
      placeVanitySink(townGroup, sharedColliders, {
        id: ms.id + '_sink', title: ms.title + ' Bathroom Vanity', floor: 0, rustic: true,
        x: cx + 3.4, y: y, z: cz - 4.1, yaw: 0,
      });
      if (placeTub) {
        placeTub(townGroup, sharedColliders, {
          id: ms.id + '_tub', title: ms.title + ' Bathtub', floor: 0, rustic: true,
          x: cx + 4.4, y: y, z: cz - 2.4, yaw: 0, exitZOffset: 0.9,
        });
      }

      // Open Living & Kitchen
      const mKitchen = kit.buildKitchenCounter(ms.id + '_stove', true);
      mKitchen.position.set(cx + 0.1, y, cz - 4.0);
      townGroup.add(mKitchen);
      tagInteractable(mKitchen, ms.id + '_stove');
      addBox(sharedColliders, cx + 0.1, cz - 4.0, 2.8, 0.9);
      registerSpot({
        id: ms.id + '_stove',
        title: ms.title + ' Kitchenette',
        floor: 0,
        category: 'cottages',
        x: cx + 0.1, y: y, z: cz - 4.0,
        radius: 3.0,
        actions: [{
          id: ms.id + '_cook', label: 'Cook Dinner at Stone Kitchen', hint: '+15 Food/s & +6 Fun/s', pose: 'cook',
          anchor: { x: cx + 0.1, y: y, z: cz - 2.9, yaw: Math.PI, floorY: y, exitX: cx + 0.1, exitZ: cz - 2.9, exitYaw: Math.PI },
          rates: { hunger: 15, fun: 6 }, statusText: 'Cooking inside ' + ms.title + '...',
        }],
      });

      const mFridge = kit.buildFridge(true);
      mFridge.position.set(cx + 1.4, y, cz - 2.6);
      mFridge.rotation.y = -Math.PI * 0.5;
      townGroup.add(mFridge);
      addBox(sharedColliders, cx + 1.4, cz - 2.6, 0.85, 0.9);

      const msRug = kit.buildRug(3.2, 2.6, ms.tone);
      msRug.position.set(cx + 3.4, y, cz + 1.6);
      townGroup.add(msRug);
      const msCoffee = kit.buildCoffeeTable(true);
      msCoffee.position.set(cx + 3.4, y, cz + 1.6);
      townGroup.add(msCoffee);
      addBox(sharedColliders, cx + 3.4, cz + 1.6, 1.3, 0.72);

      placeSofa(townGroup, sharedColliders, {
        id: ms.id + '_sofa', title: ms.title + ' Lounge Sofa', floor: 0, cottage: true,
        x: cx + 4.9, y: y, z: cz + 1.6, yaw: -Math.PI * 0.5, tone: ms.tone, w: 2.2,
      });
      const msTv = kit.buildWallTVConsole(true, ms.id + '_tv');
      msTv.rotation.y = Math.PI * 0.5;
      msTv.position.set(cx + 1.6, y, cz + 1.6);
      townGroup.add(msTv);
      tvScreens.push(msTv);
      tagInteractable(msTv, ms.id + '_tv');
      addBox(sharedColliders, cx + 1.6, cz + 1.6, 0.5, 1.7);
      registerSpot({
        id: ms.id + '_tv',
        title: ms.title + ' Living TV Console',
        floor: 0,
        category: 'cottages',
        x: cx + 1.6, y: y, z: cz + 1.6,
        radius: 3.2,
        actions: [{
          id: ms.id + '_watch_tv', label: 'Watch Evening News on Sofa', hint: '+15 Fun/s & +5 Energy/s', pose: 'sofa',
          anchor: { x: cx + 4.82, y: y, z: cz + 1.6, yaw: -Math.PI * 0.5, rigOffsetY: -0.45, floorY: y, exitX: cx + 3.8, exitZ: cz + 1.6, exitYaw: -Math.PI * 0.5 },
          rates: { fun: 15, energy: 5 }, statusText: 'Watching TV in ' + ms.title + '...',
        }],
      });
    });

    // -----------------------------------------------------------
    // 4. ROYAL EQUESTRIAN STABLES — MOVING PATROLLING HORSES! (x = -139.0, z = 9.5)
    // -----------------------------------------------------------
    const stX = -139.0;
    const stZ = 9.5;
    const paddockMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xd9bf8d, roughness: 0.92 }));
    const paddockGround = new THREE.Mesh(new THREE.PlaneGeometry(20.0, 14.0), paddockMat);
    paddockGround.rotation.x = -Math.PI / 2;
    paddockGround.position.set(stX, 0.025, stZ);
    townGroup.add(paddockGround);

    const barnWall = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.4, 11.4), terracottaMat);
    barnWall.position.set(stX - 7.4, 1.7, stZ);
    barnWall.castShadow = true;
    townGroup.add(barnWall);
    addBox(sharedColliders, stX - 7.4, stZ, 4.4, 11.4);
    const barnGable = kit.buildGableRoof(4.6, 11.6, 1.8, kit.palette.oak, ivoryMat, { chimney: false });
    barnGable.position.set(stX - 7.4, 3.38, stZ);
    townGroup.add(barnGable);

    [
      [stX, stZ - 7.0, 20.0, 0.28],
      [stX - 6.0, stZ + 7.0, 8.0, 0.28],
      [stX + 6.0, stZ + 7.0, 8.0, 0.28],
      [stX + 10.0, stZ - 4.0, 0.28, 6.0],
      [stX + 10.0, stZ + 4.4, 0.28, 5.2],
    ].forEach(function (fn) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(fn[2], 1.12, fn[3]), kit.palette.oak);
      bar.position.set(fn[0], 0.56, fn[1]);
      bar.castShadow = true;
      bar.receiveShadow = true;
      townGroup.add(bar);
      addBox(sharedColliders, fn[0], fn[1], fn[2], fn[3]);
    });

    const stableSign = kit.buildPlotSign('Royal Equestrian Stables', '#4b3022');
    stableSign.position.set(stX + 10.6, 0, stZ + 2.5);
    stableSign.rotation.y = Math.PI * 0.5;
    townGroup.add(stableSign);

    townZones.push({ minX: stX - 10, maxX: stX + 10, minZ: stZ - 7, maxZ: stZ + 7, label: 'Royal Equestrian Stables' });
    const horses = [
      { id: 'horse_1', title: 'Royal Chestnut Stallion (Vesper)', x: stX + 2.5, z: stZ - 3.6, rx: 5.0, rz: 2.0, cxOff: 1.5, czOff: -2.0, speed: 0.34, yaw: 0.4, coat: '#7e4327', mane: '#1f140f' },
      { id: 'horse_2', title: 'White Andalusian Mare (Celeste)', x: stX + 4.8, z: stZ + 2.4, rx: 4.2, rz: 2.2, cxOff: 2.8, czOff: 2.4, speed: 0.29, yaw: -0.7, coat: '#f4efe6', mane: '#d9d0c1' },
      { id: 'horse_3', title: 'Midnight Friesian Steed (Onyx)', x: stX - 1.5, z: stZ + 2.8, rx: 3.6, rz: 2.4, cxOff: 0.2, czOff: 0.8, speed: 0.31, yaw: 1.2, coat: '#242228', mane: '#121014' },
      { id: 'horse_4', title: 'Golden Palomino Pony (Aurelia)', x: stX - 1.2, z: stZ - 3.8, rx: 3.8, rz: 1.8, cxOff: 0.0, czOff: -2.4, speed: 0.27, yaw: -0.3, coat: '#c9934c', mane: '#faf0d6' },
    ];
    horses.forEach(function (hr, hi) {
      const hMesh = kit.buildHorse(hr.coat, hr.mane, hr.id);
      hMesh.position.set(hr.x, 0.03, hr.z);
      hMesh.rotation.y = hr.yaw;
      townGroup.add(hMesh);
      tagInteractable(hMesh, hr.id);
      const stand = localToWorld(hr.x, hr.z, hr.yaw, 0.95, 0.2);
      const horseSpot = {
        id: hr.id,
        title: hr.title,
        floor: 0,
        category: 'town',
        shortcut: hi === 0,
        x: hr.x, y: 0.03, z: hr.z,
        radius: 3.8,
        actions: [
          {
            id: hr.id + '_mount',
            type: 'mount_horse',
            horseId: hr.id,
            label: 'Mount & Ride ' + hr.title,
            hint: 'Trots & canters smoothly across paddocks, streets & campuses!',
            instant: true,
          },
          {
            id: hr.id + '_pet',
            label: 'Pet & Brush ' + hr.title,
            hint: '+16 Fun/s & +10 Poise/s',
            pose: 'pet_horse',
            anchor: { x: stand.x, y: 0.03, z: stand.z, yaw: hr.yaw - Math.PI * 0.5, floorY: 0, exitX: stand.x, exitZ: stand.z, exitYaw: hr.yaw },
            rates: { fun: 16, composure: 10 },
            statusText: 'Brushing the glossy coat of ' + hr.title + '...',
          },
          {
            id: hr.id + '_ride',
            label: 'Feed Golden Carrots (+28 Fun)',
            hint: '+28 Fun & Crown Dispatch Equestrian Clout',
            instant: true,
            onInstant: function (actCtx) {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 28, composure: 14 });
              recordDispatchGossip(actCtx, 'Princess spotted feeding golden carrots to ' + hr.title + ' at the Royal Stables!', 4, 0);
              actCtx.toast(hr.title + ' whinnies happily! (+28 Fun, +4 Clout)');
            },
          },
        ],
      };
      registerSpot(horseSpot);
      horsesList.push({
        id: hr.id,
        title: hr.title,
        group: hMesh,
        spot: horseSpot,
        baseY: 0.03,
        x: hr.x,
        z: hr.z,
        yaw: hr.yaw,
        patrolCx: stX + hr.cxOff,
        patrolCz: stZ + hr.czOff,
        patrolRx: hr.rx,
        patrolRz: hr.rz,
        patrolSpeed: hr.speed,
        phase: hi * 1.65,
        radius: 0.85,
      });
      if (hi === 0) townDirectory.push(horseSpot);
    });

    // -----------------------------------------------------------
    // 4B. GREENFIELDS ROYAL FARM (North-West Green Land: Barn, Silo, Windmill, Crops, Pasture, Farmhouse)
    // -----------------------------------------------------------
    const farmHouse = addEnterableLot({
      id: 'plot_farm',
      title: 'Greenfields Royal Farmhouse & Farm',
      signTitle: 'Greenfields Royal Farm',
      signColor: '#486028',
      subtitle: 'Farmhouse, Red Barn, Silo, Windmill, Crops & Pastures',
      dirCategory: 'town',
      x: -141.5, z: -35.5, w: 10.6, d: 8.4,
      dormer: true, chimney: true,
      doorFace: 'S',
      floorMat: parquetMat, wallMat: butterWallMat, roofMat: terracottaMat,
      shutterMat: kit.palette.fabricColors.emerald,
    });
    // Farmhouse Full Furnished Interior + Enclosed Bathroom!
    addWallZ(townGroup, sharedColliders, 0, 3.2, farmHouse.cx + 1.6, farmHouse.cz - 4.1, farmHouse.cz - 0.6, null, 0, 0.22, butterWallMat);
    addWallX(townGroup, sharedColliders, 0, 3.2, farmHouse.cz - 0.6, farmHouse.cx + 1.6, farmHouse.cx + 5.2, farmHouse.cx + 3.0, 1.4, 0.22, butterWallMat);
    placeBed(townGroup, sharedColliders, {
      id: 'farm_bed', title: 'Farmhouse Timber Quilt Bed', floor: 0, cottage: true,
      x: farmHouse.cx - 3.6, y: farmHouse.y, z: farmHouse.cz - 2.3, yaw: Math.PI * 0.5, tone: 'emerald', w: 1.6, d: 2.1, noSideTable: true,
    });
    const farmStove = kit.buildKitchenCounter('farm_kitchen', true);
    farmStove.position.set(farmHouse.cx - 0.6, farmHouse.y, farmHouse.cz - 3.4);
    townGroup.add(farmStove);
    tagInteractable(farmStove, 'farm_kitchen');
    addBox(sharedColliders, farmHouse.cx - 0.6, farmHouse.cz - 3.4, 2.8, 0.85);
    registerSpot({
      id: 'farm_kitchen',
      title: 'Farmhouse Country Kitchen',
      floor: 0,
      category: 'town',
      x: farmHouse.cx - 0.6, y: farmHouse.y, z: farmHouse.cz - 3.4,
      radius: 2.9,
      actions: [{
        id: 'farm_cook', label: 'Cook Farm-Fresh Supper', hint: '+16 Food/s & +6 Fun/s', pose: 'cook',
        anchor: { x: farmHouse.cx - 0.6, y: farmHouse.y, z: farmHouse.cz - 2.3, yaw: Math.PI, floorY: farmHouse.y, exitX: farmHouse.cx - 0.6, exitZ: farmHouse.cz - 2.3, exitYaw: Math.PI },
        statusText: 'Cooking farm-fresh stew in the country kitchen...',
        rates: { hunger: 16.0, fun: 6.0, energy: -1.2 },
      }],
    });
    const farmFridge = kit.buildFridge(true);
    farmFridge.position.set(farmHouse.cx - 4.4, farmHouse.y, farmHouse.cz + 1.4);
    farmFridge.rotation.y = Math.PI * 0.5;
    townGroup.add(farmFridge);
    addBox(sharedColliders, farmHouse.cx - 4.4, farmHouse.cz + 1.4, 0.8, 0.9);
    const farmRug = kit.buildRug(2.8, 2.2, 'champagne');
    farmRug.position.set(farmHouse.cx + 2.8, farmHouse.y, farmHouse.cz + 1.6);
    townGroup.add(farmRug);
    placeSofa(townGroup, sharedColliders, {
      id: 'farm_sofa', title: 'Farmhouse Hearth Sofa', floor: 0, cottage: true,
      x: farmHouse.cx + 3.2, y: farmHouse.y, z: farmHouse.cz + 2.8, yaw: Math.PI, tone: 'champagne', w: 2.2,
    });
    placeToilet(townGroup, sharedColliders, {
      id: 'farm_toilet', title: 'Farmhouse Bathroom Toilet', floor: 0, rustic: true,
      x: farmHouse.cx + 4.4, y: farmHouse.y, z: farmHouse.cz - 3.4, yaw: -Math.PI * 0.5,
    });
    placeVanitySink(townGroup, sharedColliders, {
      id: 'farm_sink', title: 'Farmhouse Bathroom Vanity', floor: 0, rustic: true,
      x: farmHouse.cx + 2.8, y: farmHouse.y, z: farmHouse.cz - 3.5, yaw: 0,
    });
    if (placeTub) {
      placeTub(townGroup, sharedColliders, {
        id: 'farm_tub', title: 'Farmhouse Copper Tub', floor: 0, rustic: true,
        x: farmHouse.cx + 3.6, y: farmHouse.y, z: farmHouse.cz - 1.9, yaw: 0, exitZOffset: 0.9,
      });
    }

    // Classic Red Farm Barn + Silo + Windmill + Tractor
    const farmBarn = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.2, 9.0), brickMat);
    farmBarn.position.set(-127.0, 2.1, -39.5);
    farmBarn.castShadow = true;
    townGroup.add(farmBarn);
    addBox(sharedColliders, -127.0, -39.5, 7.2, 9.0);
    const farmBarnRoof = kit.buildGableRoof(7.4, 9.2, 2.4, slateRoofMat, ivoryMat, { chimney: false });
    farmBarnRoof.position.set(-127.0, 4.18, -39.5);
    townGroup.add(farmBarnRoof);

    const silo = kit.buildSilo();
    silo.position.set(-121.0, 0, -40.5);
    townGroup.add(silo);
    addCircle(sharedColliders, -121.0, -40.5, 1.8);

    const windmill = kit.buildWindmill();
    windmill.position.set(-133.5, 0, -44.2);
    townGroup.add(windmill);
    addCircle(sharedColliders, -133.5, -44.2, 1.2);
    if (windmill.userData && windmill.userData.rotor) {
      windmillRotors.push(windmill.userData.rotor);
    }

    const tractor = kit.buildTractor('farm_tractor');
    tractor.position.set(-124.0, 0, -33.2);
    tractor.rotation.y = 0.28;
    townGroup.add(tractor);
    tagInteractable(tractor, 'farm_tractor');
    addBox(sharedColliders, -124.0, -33.2, 2.2, 2.6);
    registerSpot({
      id: 'farm_tractor',
      title: 'Greenfields Royal Tractor & Barn',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: -124.0, y: 0, z: -33.2,
      radius: 4.0,
      actions: [
        {
          id: 'drive_tractor_chore',
          label: 'Plow Fields & Deliver Fresh Dairy (+₡130)',
          hint: '+₡130 Crowns, +18 Fun & +3 Clout',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.game.money = (actCtx.game.money || 0) + 130;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 18, hunger: 12, energy: -4 });
            recordDispatchGossip(actCtx, 'Hands-on royalty! Crown Princess spotted steering the Greenfields Farm tractor!', 3, 1);
            actCtx.toast('Royal farm delivery complete! (+₡130 Crowns, +18 Fun)');
          },
        },
      ],
    });
    townDirectory.push(ctx.spots ? ctx.spots.farm_tractor : { id: 'farm_tractor', title: 'Greenfields Royal Farm', category: 'town', actions: [] });

    // 4 Harvestable Raised Crop Beds (Wheat, Pumpkins, Strawberries)
    [
      { x: -112.0, z: -34.0, kind: 'wheat' },
      { x: -112.0, z: -37.8, kind: 'pumpkins' },
      { x: -105.5, z: -34.0, kind: 'berries' },
      { x: -105.5, z: -37.8, kind: 'wheat' },
    ].forEach(function (cb, cbi) {
      const bed = kit.buildCropBed(cb.kind, 'farm_harvest_crops');
      bed.position.set(cb.x, 0, cb.z);
      townGroup.add(bed);
      tagInteractable(bed, 'farm_harvest_crops');
      addBox(sharedColliders, cb.x, cb.z, 4.4, 2.4);
    });
    registerSpot({
      id: 'farm_harvest_crops',
      title: 'Organic Strawberry, Pumpkin & Wheat Beds',
      floor: 0,
      category: 'town',
      x: -108.8, y: 0, z: -35.8,
      radius: 5.5,
      actions: [
        {
          id: 'harvest_organic',
          label: 'Harvest Fresh Strawberries & Organic Harvest (+₡85)',
          hint: '+₡85 Crowns, +28 Food & +16 Fun',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.game.money = (actCtx.game.money || 0) + 85;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 28, fun: 16 });
            actCtx.toast('Fresh strawberries & golden wheat harvested! (+₡85, +28 Food)');
          },
        },
      ],
    });

    // Fenced Farm Animal Pasture (Cows, Sheep, Chickens)
    const pasturePad = new THREE.Mesh(new THREE.PlaneGeometry(18.0, 12.0), paddockMat);
    pasturePad.rotation.x = -Math.PI / 2;
    pasturePad.position.set(-92.0, 0.02, -39.0);
    townGroup.add(pasturePad);
    [
      [-92.0, -45.0, 18.0, 0.24],
      [-92.0, -33.0, 18.0, 0.24],
      [-101.0, -39.0, 0.24, 12.0],
      [-83.0, -39.0, 0.24, 12.0],
    ].forEach(function (fn) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(fn[2], 0.96, fn[3]), kit.palette.oak);
      bar.position.set(fn[0], 0.48, fn[1]);
      townGroup.add(bar);
      addBox(sharedColliders, fn[0], fn[1], fn[2], fn[3]);
    });
    [
      { kind: 'cow', x: -95.5, z: -40.2, rx: 1.6, rz: 1.2 },
      { kind: 'cow', x: -89.5, z: -37.8, rx: 1.4, rz: 1.1 },
      { kind: 'sheep', x: -92.8, z: -41.6, rx: 1.8, rz: 1.4 },
      { kind: 'sheep', x: -87.4, z: -40.8, rx: 1.3, rz: 1.2 },
      { kind: 'chicken', x: -96.2, z: -36.0, rx: 1.0, rz: 0.9 },
      { kind: 'chicken', x: -94.0, z: -35.6, rx: 0.9, rz: 0.9 },
    ].forEach(function (fa, fi) {
      const am = kit.buildFarmAnimal(fa.kind, 'farm_animals_pasture');
      am.position.set(fa.x, 0.02, fa.z);
      townGroup.add(am);
      tagInteractable(am, 'farm_animals_pasture');
      farmAnimals.push({
        group: am,
        kind: fa.kind,
        homeX: fa.x,
        homeZ: fa.z,
        rx: fa.rx,
        rz: fa.rz,
        phase: fi * 1.4,
      });
    });
    registerSpot({
      id: 'farm_animals_pasture',
      title: 'Royal Dairy Cows, Sheep & Henhouse Pasture',
      floor: 0,
      category: 'town',
      x: -92.0, y: 0, z: -39.0,
      radius: 6.2,
      actions: [
        {
          id: 'tend_pasture',
          label: 'Feed Farm Cows, Pet Lambs & Gather Eggs (+₡65)',
          hint: '+₡65 Crowns, +22 Fun & +14 Food',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.game.money = (actCtx.game.money || 0) + 65;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 22, hunger: 14 });
            actCtx.toast('Warm milk & fresh eggs gathered at Greenfields Pasture! (+₡65)');
          },
        },
      ],
    });
    townZones.push({ minX: -148, maxX: -82, minZ: -47, maxZ: -30, label: 'Greenfields Royal Farm & Pastures' });

    // -----------------------------------------------------------
    // 4C. WEST TOWN SQUARE PARK — FOUNDERS' GREEN GAZEBO & CHESS (x = -139.0, z = 28.5)
    // -----------------------------------------------------------
    const parkX = -139.0;
    const parkZ = 28.5;
    const parkPad = new THREE.Mesh(new THREE.BoxGeometry(19.0, 0.08, 12.0), sidewalkMat);
    parkPad.position.set(parkX, 0.04, parkZ);
    townGroup.add(parkPad);
    const gazebo = kit.buildGazebo('town_park_gazebo');
    gazebo.position.set(parkX, 0.08, parkZ);
    townGroup.add(gazebo);
    tagInteractable(gazebo, 'town_park_gazebo');
    registerSpot({
      id: 'town_park_gazebo',
      title: "Founders' Green Park Gazebo",
      floor: 0,
      category: 'schools',
      shortcut: true,
      x: parkX, y: 0.08, z: parkZ,
      radius: 4.5,
      actions: [
        {
          id: 'park_picnic',
          label: 'Rest & Read Under Park Gazebo',
          hint: '+12 Energy/s & +12 Poise/s',
          pose: 'sit_read',
          anchor: { x: parkX - 1.5, y: 0.54, z: parkZ, yaw: Math.PI * 0.5, rigOffsetY: -0.44, floorY: 0.08, exitX: parkX, exitZ: parkZ + 3.4, exitYaw: 0 },
          rates: { energy: 12, composure: 12, fun: 8 },
          statusText: "Relaxing inside Founders' Green Gazebo...",
        },
      ],
    });
    const parkChess = kit.buildChessTable('town_park_chess');
    parkChess.position.set(parkX + 6.2, 0.08, parkZ - 2.6);
    townGroup.add(parkChess);
    tagInteractable(parkChess, 'town_park_chess');
    addCircle(sharedColliders, parkX + 6.2, parkZ - 2.6, 0.8);
    registerSpot({
      id: 'town_park_chess',
      title: 'Town Square Outdoor Chess Table',
      floor: 0,
      category: 'schools',
      x: parkX + 6.2, y: 0.08, z: parkZ - 2.6,
      radius: 3.2,
      actions: [
        {
          id: 'play_park_chess',
          label: 'Play Strategy Chess with Townspeople',
          hint: '+15 Fun/s & +10 Poise/s',
          pose: 'sit',
          anchor: { x: parkX + 6.2, y: 0.08, z: parkZ - 1.5, yaw: Math.PI, rigOffsetY: -0.45, floorY: 0.08, exitX: parkX + 4.8, exitZ: parkZ - 1.5, exitYaw: 0 },
          rates: { fun: 15, composure: 10 },
          statusText: 'Outsmarting town rivals at outdoor chess...',
        },
      ],
    });
    townZones.push({ minX: parkX - 9.5, maxX: parkX + 9.5, minZ: parkZ - 6.0, maxZ: parkZ + 6.0, label: "Founders' Town Square Park" });

    // -----------------------------------------------------------
    // 5. HOSPITAL — HÔPITAL ROYAL DE VERSAILLES (Delegated to hospital.js)
    // -----------------------------------------------------------
    let hospitalMod = null;
    if (window.CrownHospital && typeof window.CrownHospital.build === 'function') {
      hospitalMod = window.CrownHospital.build({
        THREE: THREE,
        kit: kit,
        townGroup: townGroup,
        sharedColliders: sharedColliders,
        ivoryMat: ivoryMat,
        slateRoofMat: slateRoofMat,
        boxwoodMat: boxwoodMat,
        poolDeckMat: poolDeckMat,
        sidewalkMat: sidewalkMat,
        driveMat: driveMat,
        clinicalFloorMat: clinicalFloorMat,
        hospitalWallMat: hospitalWallMat,
        addBox: addBox,
        addCircle: addCircle,
        addWallX: addWallX,
        addWallZ: addWallZ,
        placeToilet: placeToilet,
        placeVanitySink: placeVanitySink,
        placeShower: placeShower,
        tagInteractable: tagInteractable,
        registerSpot: registerSpot,
        addEnterableLot: addEnterableLot,
        registerDrivableCar: registerDrivableCar,
        recordDispatchGossip: recordDispatchGossip,
        townDirectory: townDirectory,
        townZones: townZones,
        townDoors: townDoors,
        dynamicNodes: dynamicNodes,
        spots: ctx.spots,
      });
    }

    // -----------------------------------------------------------
    // 6. THE SCHOOLS & PROMOTED NORTH UNIVERSITY CAMPUS (East Quarter!)
    // -----------------------------------------------------------
    // 6A) Académie Couronne — Royal Prep High School (x = 79.6, z = 9.5)
    const hs = addEnterableLot({
      id: 'plot_high_school',
      title: 'Académie Couronne High School',
      signTitle: 'Royal Prep High School',
      signColor: '#1f3a5c',
      subtitle: 'Classrooms, lockers, art studio & washroom',
      dirCategory: 'schools',
      x: 79.6, z: 9.5, w: 18.0, d: 11.2,
      wallH: 4.0,
      pitchH: 2.3,
      cupola: true,
      chimney: false,
      doorFace: 'S',
      doorW: 3.0,
      floorMat: parquetMat, wallMat: brickMat, roofMat: slateRoofMat,
      shutterMat: kit.palette.fabricColors.champagne,
    });
    const hsPorch = kit.buildFrontPorch(6.8, 2.2, ivoryMat);
    hsPorch.position.set(hs.cx, 0, hs.cz + hs.d * 0.5 + 1.1);
    townGroup.add(hsPorch);

    const lockers = kit.buildSchoolLockers('hs_lockers');
    lockers.position.set(hs.cx - 6.2, hs.y, hs.cz - 4.8);
    townGroup.add(lockers);
    tagInteractable(lockers, 'hs_lockers');
    addBox(sharedColliders, hs.cx - 6.2, hs.cz - 4.8, 3.4, 0.7);
    registerSpot({
      id: 'hs_lockers',
      title: 'High School Hallway Lockers',
      floor: 0,
      category: 'schools',
      shortcut: true,
      x: hs.cx - 6.2, y: hs.y, z: hs.cz - 4.8,
      radius: 3.6,
      actions: [{
        id: 'locker_gossip', label: 'Swap Secrets & Love Notes at Lockers', hint: '+22 Fun & Crown Dispatch High-School Rumor!', instant: true,
        onInstant: function (actCtx) {
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 22, composure: 10 });
          recordDispatchGossip(actCtx, 'High School Scandal: Secret crimson envelope slipped into Locker #7 at Académie Couronne!', 3, 4);
          actCtx.toast('Locker whispers stirred! (+22 Fun, +4 Scandal)');
        },
      }],
    });

    const chalk = kit.buildChalkboardLectern('hs_classroom');
    chalk.position.set(hs.cx + 1.2, hs.y, hs.cz - 4.9);
    townGroup.add(chalk);
    tagInteractable(chalk, 'hs_classroom');
    addBox(sharedColliders, hs.cx + 1.2, hs.cz - 4.9, 3.8, 1.3);

    [[-0.6, -1.6], [2.4, -1.6], [-0.6, 0.8], [2.4, 0.8]].forEach(function (dp, di) {
      const desk = kit.buildSchoolDeskSet('hs_classroom');
      desk.position.set(hs.cx + dp[0], hs.y, hs.cz + dp[1]);
      townGroup.add(desk);
      tagInteractable(desk, 'hs_classroom');
      addBox(sharedColliders, hs.cx + dp[0], hs.cz + dp[1], 1.1, 1.3);
      if (di === 0) {
        registerSpot({
          id: 'hs_classroom',
          title: 'High School Royal History Classroom',
          floor: 0,
          category: 'schools',
          shortcut: true,
          x: hs.cx + dp[0], y: hs.y, z: hs.cz + dp[1],
          radius: 4.5,
          actions: [
            {
              id: 'attend_hs_class', label: 'Attend Royal Etiquette & History Class', hint: '+16 Poise/s & Study Academic Skill', pose: 'sit_read',
              anchor: { x: hs.cx + dp[0], y: hs.y + 0.08, z: hs.cz + dp[1] + 0.65, yaw: Math.PI, rigOffsetY: -0.45, floorY: hs.y, exitX: hs.cx - 2.4, exitZ: hs.cz + 1.8, exitYaw: 0 },
              rates: { composure: 16, fun: 6, energy: -2 }, statusText: 'Taking diligent notes in Académie Couronne class...',
            },
            {
              id: 'hs_ace_quiz', label: 'Pass Pop Quiz & Earn Royal Allowance (+₡95)', hint: '+₡95 Crowns, +18 Poise & +4 Clout', instant: true,
              onInstant: function (actCtx) {
                actCtx.game.money = (actCtx.game.money || 0) + 95;
                if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 18, fun: 12 });
                recordDispatchGossip(actCtx, 'Top of the class! Royal Heiress aced Académie Couronne Honors Quiz.', 4, 0);
                actCtx.toast('A+ Honors Grade! Earned +₡95 Crowns & +4 Clout!');
              },
            },
          ],
        });
      }
    });

    const hsEasel = kit.buildEasel('hs_art_easel');
    hsEasel.position.set(hs.cx + 6.4, hs.y, hs.cz - 2.0);
    hsEasel.rotation.y = -Math.PI * 0.35;
    townGroup.add(hsEasel);
    tagInteractable(hsEasel, 'hs_art_easel');
    addCircle(sharedColliders, hs.cx + 6.4, hs.cz - 2.0, 0.7);
    registerSpot({
      id: 'hs_art_easel',
      title: 'High School Art Studio Easel',
      floor: 0,
      category: 'schools',
      x: hs.cx + 6.4, y: hs.y, z: hs.cz - 2.0,
      radius: 3.4,
      actions: [{
        id: 'paint_hs_canvas', label: 'Paint Portrait for School Exhibition', hint: '+16 Fun/s & +10 Poise/s', pose: 'paint',
        anchor: { x: hs.cx + 5.7, y: hs.y, z: hs.cz - 1.5, yaw: -Math.PI * 0.35, floorY: hs.y, exitX: hs.cx + 4.8, exitZ: hs.cz, exitYaw: 0 },
        rates: { fun: 16, composure: 10 }, statusText: 'Painting a pastel canvas in High School Art Lab...',
      }],
    });
    // High School Student Washroom (SW Corner)
    placeToilet(townGroup, sharedColliders, { id: 'hs_toilet', title: 'High School Washroom Toilet', floor: 0, rustic: true, x: hs.cx - 7.8, y: hs.y, z: hs.cz + 4.2, yaw: Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'hs_sink', title: 'High School Washroom Sink', floor: 0, rustic: true, x: hs.cx - 6.0, y: hs.y, z: hs.cz + 4.5, yaw: Math.PI });
    townDirectory.push(ctx.spots ? ctx.spots.hs_classroom : { id: 'hs_classroom', title: 'Académie Couronne High School', category: 'schools', actions: [] });

    // 6B) Crown University & Conservatory (x = 106.5, z = 9.5) — FIXED 1-ARG buildGrandPiano!
    const uni = addEnterableLot({
      id: 'plot_university',
      title: 'Crown University & Conservatory',
      signTitle: 'Crown University',
      signColor: '#4c2638',
      subtitle: 'Debate podium, grand piano hall, washroom & archive',
      dirCategory: 'schools',
      x: 106.5, z: 9.5, w: 17.6, d: 11.2,
      wallH: 4.4,
      pitchH: 2.5,
      cupola: true,
      dormer: true,
      chimney: false,
      doorFace: 'S',
      doorW: 3.0,
      floorMat: marbleMat, wallMat: ivoryMat, roofMat: slateRoofMat,
      shutterMat: kit.palette.fabricColors.crimson,
    });
    const uniPorch = kit.buildFrontPorch(6.6, 2.2, ivoryMat);
    uniPorch.position.set(uni.cx, 0, uni.cz + uni.d * 0.5 + 1.1);
    townGroup.add(uniPorch);

    const podium = kit.buildDebatePodium('uni_debate_podium');
    podium.position.set(uni.cx - 3.6, uni.y, uni.cz - 3.6);
    townGroup.add(podium);
    tagInteractable(podium, 'uni_debate_podium');
    addBox(sharedColliders, uni.cx - 3.6, uni.cz - 3.6, 1.3, 0.9);
    registerSpot({
      id: 'uni_debate_podium',
      title: 'University Diplomacy & Law Podium',
      floor: 0,
      category: 'schools',
      shortcut: true,
      x: uni.cx - 3.6, y: uni.y, z: uni.cz - 3.6,
      radius: 3.6,
      actions: [{
        id: 'uni_speech', label: 'Deliver Royal Debate Lecture (+₡150)', hint: '+28 Poise, +6 Clout & +₡150 Stipend', instant: true,
        onInstant: function (actCtx) {
          actCtx.game.money = (actCtx.game.money || 0) + 150;
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 28, fun: 14 });
          recordDispatchGossip(actCtx, 'Standing ovation! Princess captivated Crown University Lecture Hall.', 6, 0);
          actCtx.toast('Brilliant speech at Crown University! (+₡150, +6 Clout)');
        },
      }],
    });

    const uniPiano = kit.buildGrandPiano('uni_conservatory_piano');
    uniPiano.position.set(uni.cx + 4.4, uni.y, uni.cz - 2.8);
    uniPiano.rotation.y = -Math.PI * 0.3;
    townGroup.add(uniPiano);
    tagInteractable(uniPiano, 'uni_conservatory_piano');
    addBox(sharedColliders, uni.cx + 4.4, uni.cz - 2.8, 2.2, 2.0);
    registerSpot({
      id: 'uni_conservatory_piano',
      title: 'Conservatory Concert Grand Piano',
      floor: 0,
      category: 'schools',
      x: uni.cx + 4.4, y: uni.y, z: uni.cz - 2.8,
      radius: 3.6,
      actions: [{
        id: 'uni_play_piano', label: 'Perform Chopin Concerto at Conservatory', hint: '+18 Fun/s & +14 Poise/s', pose: 'piano',
        anchor: { x: uni.cx + 3.2, y: uni.y + 0.08, z: uni.cz - 1.5, yaw: -Math.PI * 0.3, rigOffsetY: -0.45, floorY: uni.y, exitX: uni.cx + 2.0, exitZ: uni.cz + 1.0, exitYaw: 0 },
        rates: { fun: 18, composure: 14 }, statusText: 'Performing concert piano inside Crown Conservatory...',
      }],
    });

    const uniShelf = kit.buildBookshelf('uni_honors_library', false);
    uniShelf.position.set(uni.cx - 6.8, uni.y, uni.cz + 1.5);
    uniShelf.rotation.y = Math.PI * 0.5;
    townGroup.add(uniShelf);
    tagInteractable(uniShelf, 'uni_honors_library');
    addBox(sharedColliders, uni.cx - 6.8, uni.cz + 1.5, 0.7, 1.8);
    registerSpot({
      id: 'uni_honors_library',
      title: 'University Honors Archive Shelves',
      floor: 0,
      category: 'schools',
      x: uni.cx - 6.8, y: uni.y, z: uni.cz + 1.5,
      radius: 3.4,
      actions: [{
        id: 'uni_study_finals', label: 'Study Honors Thesis (Read Archive)', hint: '+16 Poise/s & +8 Fun/s', pose: 'read',
        anchor: { x: uni.cx - 5.8, y: uni.y, z: uni.cz + 1.5, yaw: -Math.PI * 0.5, floorY: uni.y, exitX: uni.cx - 4.8, exitZ: uni.cz + 1.5, exitYaw: 0 },
        rates: { composure: 16, fun: 8 }, statusText: 'Researching royal jurisprudence at Crown University...',
      }],
    });
    placeToilet(townGroup, sharedColliders, { id: 'uni_toilet', title: 'University Hall Restroom Toilet', floor: 0, rustic: false, x: uni.cx + 7.2, y: uni.y, z: uni.cz + 4.1, yaw: -Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'uni_sink', title: 'University Hall Marble Vanity', floor: 0, rustic: false, x: uni.cx + 5.2, y: uni.y, z: uni.cz + 4.4, yaw: Math.PI });
    const uniChand = kit.buildChandelier(0.95);
    uniChand.position.set(uni.cx, uni.y + 3.6, uni.cz);
    uni.roofGrp.add(uniChand);

    // 6C) CROWN UNIVERSITY NORTH CAMPUS — HONORS DORMITORIES & CLOCK TOWER (x = 106.5, z = -23.0)
    const uniN = addEnterableLot({
      id: 'plot_uni_north',
      title: 'Crown University Dorms & Clock Hall',
      signTitle: 'University Dorms',
      signColor: '#4c2638',
      subtitle: '2 Student Dorm Bedrooms, 2 Bathrooms, Library & Commons',
      dirCategory: 'schools',
      x: 106.5, z: -23.0, w: 18.0, d: 13.0,
      wallH: 4.5,
      pitchH: 2.6,
      cupola: true,
      dormer: true,
      chimney: false,
      doorFace: 'S',
      doorW: 3.0,
      floorMat: parquetMat, wallMat: brickMat, roofMat: slateRoofMat,
      shutterMat: kit.palette.fabricColors.champagne,
    });
    const uniNPorch = kit.buildFrontPorch(6.8, 2.2, ivoryMat);
    uniNPorch.position.set(uniN.cx, 0, uniN.cz + uniN.d * 0.5 + 1.1);
    townGroup.add(uniNPorch);

    // 2 Partitioned Dorm Bedrooms (West Wing) & 2 Campus Washrooms (East Wing)
    addWallZ(townGroup, sharedColliders, 0, 3.6, uniN.cx - 3.6, uniN.cz - 6.4, uniN.cz, uniN.cz - 3.2, 1.5, 0.22, ivoryMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, uniN.cx - 3.6, uniN.cz, uniN.cz + 6.4, uniN.cz + 3.2, 1.5, 0.22, ivoryMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, uniN.cz, uniN.cx - 8.9, uniN.cx - 3.6, null, 0, 0.22, ivoryMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, uniN.cx + 3.8, uniN.cz - 6.4, uniN.cz - 2.6, uniN.cz - 4.4, 1.5, 0.22, ivoryMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, uniN.cz - 2.6, uniN.cx + 3.8, uniN.cx + 8.9, null, 0, 0.22, ivoryMat);

    placeBed(townGroup, sharedColliders, {
      id: 'uni_dorm_bed_1', title: 'Honors Dorm Room #1', floor: 0, cottage: true,
      x: uniN.cx - 6.8, y: uniN.y, z: uniN.cz - 3.4, yaw: Math.PI * 0.5, tone: 'crimson', w: 1.6, d: 2.1, noSideTable: true,
    });
    placeBed(townGroup, sharedColliders, {
      id: 'uni_dorm_bed_2', title: 'Honors Dorm Room #2', floor: 0, cottage: true,
      x: uniN.cx - 6.8, y: uniN.y, z: uniN.cz + 3.4, yaw: Math.PI * 0.5, tone: 'sapphire', w: 1.6, d: 2.1, noSideTable: true,
    });
    placeToilet(townGroup, sharedColliders, { id: 'uni_dorm_toilet', title: 'Dorm Bathroom Toilet', floor: 0, rustic: false, x: uniN.cx + 7.8, y: uniN.y, z: uniN.cz - 5.5, yaw: -Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'uni_dorm_sink', title: 'Dorm Bathroom Vanity', floor: 0, rustic: false, x: uniN.cx + 6.0, y: uniN.y, z: uniN.cz - 5.6, yaw: 0 });
    if (placeShower) {
      placeShower(townGroup, sharedColliders, { id: 'uni_dorm_shower', title: 'Dorm Shower Cubicle', floor: 0, rustic: false, x: uniN.cx + 5.2, y: uniN.y, z: uniN.cz - 4.1, yaw: Math.PI * 0.5, exitZOffset: 1.0 });
    }

    const uniRug = kit.buildRug(4.2, 3.2, 'crimson');
    uniRug.position.set(uniN.cx, uniN.y, uniN.cz);
    townGroup.add(uniRug);
    const uniCoffee = kit.buildCoffeeTable(false);
    uniCoffee.position.set(uniN.cx, uniN.y, uniN.cz);
    townGroup.add(uniCoffee);
    addBox(sharedColliders, uniN.cx, uniN.cz, 1.3, 0.75);
    placeSofa(townGroup, sharedColliders, {
      id: 'uni_commons_sofa', title: 'Honors Commons Velvet Sofa', floor: 0,
      x: uniN.cx, y: uniN.y, z: uniN.cz - 2.1, yaw: 0, tone: 'crimson', w: 2.5,
    });
    const uniNorthDesk = kit.buildWritingDesk('uni_north_study', 'sapphire');
    uniNorthDesk.position.set(uniN.cx + 6.4, uniN.y, uniN.cz + 2.2);
    uniNorthDesk.rotation.y = -Math.PI * 0.5;
    townGroup.add(uniNorthDesk);
    tagInteractable(uniNorthDesk, 'uni_north_study');
    registerSpot({
      id: 'uni_north_study',
      title: 'University Dorm Honours Study Desk',
      floor: 0,
      category: 'schools',
      x: uniN.cx + 6.4, y: uniN.y, z: uniN.cz + 2.2,
      radius: 3.4,
      actions: [{
        id: 'uni_thesis_write', label: 'Draft Royal Doctorate Thesis (+₡140)', hint: '+₡140 Crowns & +22 Poise', instant: true,
        onInstant: function (actCtx) {
          actCtx.game.money = (actCtx.game.money || 0) + 140;
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 22, fun: 8 });
          actCtx.toast('Academic grant awarded for University Thesis! (+₡140 Crowns)');
        },
      }],
    });

    // 6D) BOTANIC GLASSHOUSE CONSERVATORY & HEALING GARDENS (x = 133.6, z = -23.0)
    const botanic = addEnterableLot({
      id: 'plot_botanic',
      title: 'Botanic Conservatory Glasshouse',
      signTitle: 'Botanic Glasshouse',
      signColor: '#255c42',
      subtitle: 'Rare orchids, palms, herbal tea Salon & botanical stroll',
      dirCategory: 'schools',
      x: 133.6, z: -23.0, w: 16.0, d: 12.0,
      wallH: 4.0,
      flatRoof: true,
      doorFace: 'S',
      floorMat: marbleMat, wallMat: glassMat, roofMat: glassMat,
      windows: false,
    });
    [[-4.8, -3.2], [4.8, -3.2], [-4.8, 3.0], [4.8, 3.0]].forEach(function (pt) {
      const pPlant = kit.buildPedestalPlant(true);
      pPlant.position.set(botanic.cx + pt[0], botanic.y, botanic.cz + pt[1]);
      townGroup.add(pPlant);
      addCircle(sharedColliders, botanic.cx + pt[0], botanic.cz + pt[1], 0.55);
    });
    const botTable = kit.buildTableSet('botanic_tea_table', false);
    botTable.position.set(botanic.cx, botanic.y, botanic.cz - 0.5);
    townGroup.add(botTable);
    tagInteractable(botTable, 'botanic_tea_table');
    addBox(sharedColliders, botanic.cx, botanic.cz - 0.5, 1.6, 1.0);
    registerSpot({
      id: 'botanic_tea_table',
      title: 'Botanic Conservatory Herbal Tea Salon',
      floor: 0,
      category: 'schools',
      x: botanic.cx, y: botanic.y, z: botanic.cz - 0.5,
      radius: 3.8,
      actions: [{
        id: 'sip_botanic_tea', label: 'Sip Jasmine Tea Among Orchids', hint: '+15 Poise/s & +14 Energy/s', pose: 'eat',
        anchor: {
          x: botanic.cx - 1.0, y: botanic.y, z: botanic.cz - 0.5, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: botanic.y, exitX: botanic.cx, exitZ: botanic.cz + 1.8, exitYaw: 0,
          partnerAnchor: { x: botanic.cx + 1.0, y: botanic.y, z: botanic.cz - 0.5, yaw: -Math.PI * 0.5, rigOffsetY: -0.45 },
        },
        rates: { composure: 15, energy: 14, hunger: 6 }, statusText: 'Sipping rare jasmine tea inside Botanic Glasshouse...',
      }],
    });

    // -----------------------------------------------------------
    // 7. WALLFLOUR & MAISON BRIOCHE 2-STORY PATISSERIE + BUMBLEBEE GLASSHOUSE (Delegated to bakery.js)
    // -----------------------------------------------------------
    let bakeryMod = null;
    if (window.CrownBakery && typeof window.CrownBakery.build === 'function') {
      bakeryMod = window.CrownBakery.build({
        THREE: THREE,
        kit: kit,
        townGroup: townGroup,
        sharedColliders: sharedColliders,
        ivoryMat: ivoryMat,
        parquetMat: parquetMat,
        sidewalkMat: sidewalkMat,
        goldMat: goldMat,
        glassMat: glassMat,
        terracottaMat: terracottaMat,
        addBox: addBox,
        addCircle: addCircle,
        addWallX: addWallX,
        addWallZ: addWallZ,
        placeToilet: placeToilet,
        placeVanitySink: placeVanitySink,
        tagInteractable: tagInteractable,
        registerSpot: registerSpot,
        recordDispatchGossip: recordDispatchGossip,
        cutaways: cutaways,
        walkableFloors: walkableFloors,
        townDirectory: townDirectory,
        townZones: townZones,
        townDoors: townDoors,
        dynamicNodes: dynamicNodes,
      });
    }

    // SUPERMARKET (x = -111.0, z = 40.0)
    const market = addEnterableLot({
      id: 'plot_supermarket',
      title: 'Marché Royale Supermarket',
      signTitle: 'Supermarket Marché',
      signColor: '#25523b',
      subtitle: 'Fresh produce aisles, beverage coolers, checkout POS & restroom',
      dirCategory: 'town',
      x: -111.0, z: 40.0, w: 13.6, d: 8.6,
      flatRoof: true, doorFace: 'S',
      floorMat: kit.palette.checkeredTile || tileFloorMat, wallMat: mintWallMat, roofMat: slateRoofMat,
      shutterMat: kit.palette.fabricColors.emerald,
    });
    [-3.6, 0, 3.6].forEach(function (ax, ai) {
      const shelfRow = kit.buildBookshelf('market_aisle_' + ai, true);
      shelfRow.position.set(market.cx + ax, market.y, market.cz - 1.5);
      townGroup.add(shelfRow);
      addBox(sharedColliders, market.cx + ax, market.cz - 1.5, 1.7, 0.55);
    });
    [-5.6, -4.4].forEach(function (fx) {
      const mF = kit.buildFridge(false);
      mF.position.set(market.cx + fx, market.y, market.cz - 3.4);
      townGroup.add(mF);
      addBox(sharedColliders, market.cx + fx, market.cz - 3.4, 0.95, 0.78);
    });
    const mCooler = kit.buildBeverageCooler();
    mCooler.position.set(market.cx + 5.2, market.y, market.cz - 3.4);
    townGroup.add(mCooler);
    addBox(sharedColliders, market.cx + 5.2, market.cz - 3.4, 1.2, 0.8);
    const checkout = kit.buildCashierCounter('market_checkout', '#25523b', 'CHECKOUT POS');
    checkout.position.set(market.cx - 3.6, market.y, market.cz + 1.8);
    townGroup.add(checkout);
    tagInteractable(checkout, 'market_checkout');
    addBox(sharedColliders, market.cx - 3.6, market.cz + 1.8, 2.5, 0.9);
    registerSpot({
      id: 'market_checkout',
      title: 'Marché Royale Grocery Checkout',
      floor: 0,
      category: 'town',
      x: market.cx - 3.6, y: market.y, z: market.cz + 1.8,
      radius: 4.0,
      actions: [{
        id: 'buy_groceries', label: 'Buy Gourmet Groceries & Champagne (₡45)', hint: '+55 Food & +10 Fun', instant: true,
        onInstant: function (actCtx) {
          if ((actCtx.game.money || 0) < 45) return actCtx.toast('Need ₡45 Crowns.');
          actCtx.game.money -= 45;
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 55, fun: 10 });
          recordDispatchGossip(actCtx, 'A royal princess spotted wheeling her own gourmet cart at Marché Royale!', 2, 1);
          actCtx.toast('Gourmet hamper purchased! (+55 Food)');
        },
      }],
    });
    addWallZ(townGroup, sharedColliders, 0, 3.3, market.cx + 3.4, market.cz + 1.2, market.cz + 4.2, market.cz + 2.7, 1.2, 0.2, mintWallMat);
    addWallX(townGroup, sharedColliders, 0, 3.3, market.cz + 1.2, market.cx + 3.4, market.cx + 6.7, null, 0, 0.2, mintWallMat);
    placeToilet(townGroup, sharedColliders, { id: 'market_toilet', title: 'Supermarket Washroom Toilet', floor: 0, rustic: true, x: market.cx + 5.7, y: market.y, z: market.cz + 3.2, yaw: -Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'market_sink', title: 'Supermarket Washroom Sink', floor: 0, rustic: true, x: market.cx + 4.5, y: market.y, z: market.cz + 1.9, yaw: 0 });

    // PIZZA PLACE — PALAZZO NAPOLI (x = -139.0, z = 40.0 — Full Sims-4 Pizzeria with Cashier, Menu, Showcase, Booths & Restroom!)
    const pizza = addEnterableLot({
      id: 'plot_pizza',
      title: 'Palazzo Napoli Pizza Place',
      signTitle: 'Pizza Place Napoli',
      signColor: '#8d2f23',
      subtitle: 'Wood-fired oven, hot slice vitrine, cashier counter, booths & washroom',
      dirCategory: 'town',
      x: -139.0, z: 40.0, w: 12.0, d: 8.6,
      dormer: true, doorFace: 'S',
      floorMat: kit.palette.pizzeriaTile || tileFloorMat, wallMat: butterWallMat, roofMat: terracottaMat,
      shutterMat: kit.palette.fabricColors.crimson,
    });
    const pizzaOven = kit.buildFireplace('pizza_oven', true);
    pizzaOven.position.set(pizza.cx - 3.6, pizza.y, pizza.cz - 3.4);
    townGroup.add(pizzaOven);
    if (pizzaOven.userData && pizzaOven.userData.flames) animatedFlames.push(pizzaOven.userData.flames);
    tagInteractable(pizzaOven, 'pizza_oven');
    addBox(sharedColliders, pizza.cx - 3.6, pizza.cz - 3.4, 2.4, 1.2);

    const pizzaCashier = kit.buildCashierCounter('pizza_cashier', '#8d2f23', 'PIZZA CASHIER');
    pizzaCashier.position.set(pizza.cx + 0.9, pizza.y, pizza.cz - 2.2);
    townGroup.add(pizzaCashier);
    tagInteractable(pizzaCashier, 'pizza_cashier');
    addBox(sharedColliders, pizza.cx + 0.9, pizza.cz - 2.2, 2.5, 0.9);

    const pizzaShowcase = kit.buildPizzaDisplayCase('pizza_case');
    pizzaShowcase.position.set(pizza.cx - 1.3, pizza.y, pizza.cz - 2.2);
    townGroup.add(pizzaShowcase);
    tagInteractable(pizzaShowcase, 'pizza_cashier');
    addBox(sharedColliders, pizza.cx - 1.3, pizza.cz - 2.2, 1.85, 0.9);

    if (kit.palette.pizzaMenu) {
      const menuBoard = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.25, 0.08), kit.palette.pizzaMenu);
      menuBoard.position.set(pizza.cx + 0.9, pizza.y + 2.25, pizza.cz - 4.05);
      townGroup.add(menuBoard);
    }
    const pCooler = kit.buildBeverageCooler();
    pCooler.position.set(pizza.cx + 4.4, pizza.y, pizza.cz - 3.5);
    townGroup.add(pCooler);
    addBox(sharedColliders, pizza.cx + 4.4, pizza.cz - 3.5, 1.2, 0.8);

    const pArt = kit.buildWallArt('landscape', 1.5, 1.15);
    pArt.rotation.y = Math.PI * 0.5;
    pArt.position.set(pizza.cx - 5.75, pizza.y + 2.0, pizza.cz);
    townGroup.add(pArt);

    [
      { x: pizza.cx - 3.6, z: pizza.cz + 0.7 },
      { x: pizza.cx - 0.8, z: pizza.cz + 0.7 },
      { x: pizza.cx - 3.6, z: pizza.cz + 2.9 },
    ].forEach(function (bt) {
      const bSet = kit.buildBoothTableSet('pizza_table');
      bSet.position.set(bt.x, pizza.y, bt.z);
      townGroup.add(bSet);
      tagInteractable(bSet, 'pizza_table');
      addBox(sharedColliders, bt.x, bt.z, 1.65, 1.1);
    });

    function onOrderPizza(actCtx) {
      if ((actCtx.game.money || 0) < 24) return actCtx.toast('Need ₡24 Crowns.');
      actCtx.game.money -= 24;
      if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 48, fun: 14 });
      actCtx.toast('Piping hot brick-oven Margherita served at Palazzo Napoli! (+48 Food)');
    }
    const pizzaEatAction = {
      id: 'eat_pizza_sit', label: 'Sit in Pizzeria Booth & Eat Slice', hint: '+20 Food/s & +10 Fun/s', pose: 'eat',
      anchor: {
        x: pizza.cx - 4.58, y: pizza.y, z: pizza.cz + 0.7, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: pizza.y, exitX: pizza.cx - 2.3, exitZ: pizza.cz + 0.7, exitYaw: 0,
        partnerAnchor: { x: pizza.cx - 2.62, y: pizza.y, z: pizza.cz + 0.7, yaw: -Math.PI * 0.5, rigOffsetY: -0.45 },
      },
      rates: { hunger: 20, fun: 10 }, statusText: 'Feasting on wood-fired pizza at Palazzo Napoli...',
    };
    registerSpot({
      id: 'pizza_cashier',
      title: 'Palazzo Napoli Cashier & Slice Counter',
      floor: 0,
      category: 'town',
      x: pizza.cx + 0.9, y: pizza.y, z: pizza.cz - 2.2,
      radius: 3.6,
      actions: [
        { id: 'order_pizza_cashier', label: 'Pay Cashier for Truffle Pizza & Soda (₡24)', hint: '+48 Food & +14 Fun', instant: true, onInstant: onOrderPizza },
        pizzaEatAction,
      ],
    });
    registerSpot({
      id: 'pizza_table',
      title: 'Palazzo Napoli Pizzeria Dining Booths',
      floor: 0,
      category: 'town',
      x: pizza.cx - 2.6, y: pizza.y, z: pizza.cz + 1.4,
      radius: 4.0,
      actions: [
        pizzaEatAction,
        { id: 'order_pizza_booth', label: 'Order Truffle Pizza & Soda to Table (₡24)', hint: '+48 Food & +14 Fun', instant: true, onInstant: onOrderPizza },
      ],
    });
    registerSpot({
      id: 'pizza_oven',
      title: 'Wood-Fired Pizza Oven',
      floor: 0,
      category: 'town',
      x: pizza.cx - 3.6, y: pizza.y, z: pizza.cz - 3.4,
      radius: 3.4,
      actions: [
        { id: 'order_pizza', label: 'Order Brick-Oven Margherita (₡24)', hint: '+48 Food & +14 Fun', instant: true, onInstant: onOrderPizza },
        pizzaEatAction,
      ],
    });
    addWallZ(townGroup, sharedColliders, 0, 3.3, pizza.cx + 2.4, pizza.cz + 1.0, pizza.cz + 4.2, pizza.cz + 2.6, 1.2, 0.2, butterWallMat);
    addWallX(townGroup, sharedColliders, 0, 3.3, pizza.cz + 1.0, pizza.cx + 2.4, pizza.cx + 5.9, null, 0, 0.2, butterWallMat);
    placeToilet(townGroup, sharedColliders, { id: 'pizza_toilet', title: 'Pizzeria Washroom Toilet', floor: 0, rustic: true, x: pizza.cx + 5.0, y: pizza.y, z: pizza.cz + 3.2, yaw: -Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'pizza_sink', title: 'Pizzeria Washroom Sink', floor: 0, rustic: true, x: pizza.cx + 3.6, y: pizza.y, z: pizza.cz + 1.7, yaw: 0 });

    // -----------------------------------------------------------
    // 8. SEAMSTRESS, SHOPPING ARCADE, CLUB, POOL & HOTEL (Enriched!)
    // -----------------------------------------------------------
    const seam = addEnterableLot({
      id: 'plot_seamstress',
      title: 'Maison de Couture Seamstress',
      signTitle: 'Seamstress Couture',
      signColor: '#7f3c5c',
      subtitle: 'Silk gowns, fitting mirrors, lounge & partitioned washroom',
      dirCategory: 'town',
      x: 79.6, z: 39.8, w: 12.0, d: 8.2,
      dormer: true, doorFace: 'S',
      floorMat: parquetMat, wallMat: pastelPinkWall, roofMat: slateRoofMat,
      shutterMat: kit.palette.fabricColors.rose,
    });
    const seamRug = kit.buildRug(3.6, 2.8, 'rose');
    seamRug.position.set(seam.cx, seam.y, seam.cz);
    townGroup.add(seamRug);
    const seamVanity = kit.buildDressingVanity('seamstress_fitting', 'rose');
    seamVanity.position.set(seam.cx, seam.y, seam.cz - 3.0);
    townGroup.add(seamVanity);
    tagInteractable(seamVanity, 'seamstress_fitting');
    addBox(sharedColliders, seam.cx, seam.cz - 3.0, 1.4, 0.8);
    [-3.6, -2.0, 3.4].forEach(function (mx, mi) {
      const gCol = [kit.palette.fabricColors.rose, kit.palette.fabricColors.sapphire, kit.palette.fabricColors.gold || kit.palette.gold][mi];
      kit.addMesh(townGroup, kit.g.cyl1, kit.palette.gold, 0.1, 0.9, 0.1, seam.cx + mx, seam.y + 0.45, seam.cz - 2.1);
      kit.addMesh(townGroup, kit.g.cone1, gCol, 0.72, 1.15, 0.72, seam.cx + mx, seam.y + 1.05, seam.cz - 2.1);
      addCircle(sharedColliders, seam.cx + mx, seam.cz - 2.1, 0.42);
    });
    const seamDesk = kit.buildCashierCounter('seamstress_fitting', '#7f3c5c', 'ATELIER POS');
    seamDesk.position.set(seam.cx + 3.2, seam.y, seam.cz + 1.0);
    seamDesk.rotation.y = -Math.PI * 0.5;
    townGroup.add(seamDesk);
    tagInteractable(seamDesk, 'seamstress_fitting');
    addBox(sharedColliders, seam.cx + 3.2, seam.cz + 1.0, 0.9, 2.4);
    registerSpot({
      id: 'seamstress_fitting',
      title: 'Seamstress Fitting Mirror & Atelier',
      floor: 0,
      category: 'town',
      x: seam.cx, y: seam.y, z: seam.cz - 3.0,
      radius: 3.6,
      actions: [
        {
          id: 'open_cas_seamstress', label: 'Commission Bespoke Gown (Open Wardrobe / CAS)', hint: 'Customize outfit, tiara & accessories', instant: true,
          onInstant: function () { if (window.CrownSave) window.CrownSave.save(true); window.CrownMenu.go('creator'); },
        },
        {
          id: 'fit_couture', label: 'Fit Silk Dress & Adjust Hem (-₡110)', hint: '+28 Poise & +4 Crown Dispatch Clout', instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 110) return actCtx.toast('Need ₡110 Crowns.');
            actCtx.game.money -= 110;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 28, fun: 16 });
            recordDispatchGossip(actCtx, 'A stunning custom gown just left Maison de Couture!', 4, 0);
            actCtx.toast('Tailored couture perfection! (+28 Poise, +4 Clout)');
          },
        },
      ],
    });
    addWallZ(townGroup, sharedColliders, 0, 3.3, seam.cx - 2.6, seam.cz + 1.0, seam.cz + 4.0, seam.cz + 2.5, 1.2, 0.2, pastelPinkWall);
    addWallX(townGroup, sharedColliders, 0, 3.3, seam.cz + 1.0, seam.cx - 5.9, seam.cx - 2.6, null, 0, 0.2, pastelPinkWall);
    placeToilet(townGroup, sharedColliders, { id: 'seam_toilet', title: 'Atelier Powder Toilet', floor: 0, rustic: false, x: seam.cx - 4.9, y: seam.y, z: seam.cz + 3.0, yaw: Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'seam_sink', title: 'Atelier Powder Sink', floor: 0, rustic: false, x: seam.cx - 3.8, y: seam.y, z: seam.cz + 1.6, yaw: 0 });

    // SHOPPING PLACE (x = 106.5, z = 39.8)
    const shop = addEnterableLot({
      id: 'plot_shopping',
      title: 'Galerie Royale Shopping Place',
      signTitle: 'Shopping Place Galerie',
      signColor: '#4a3520',
      subtitle: 'Luxury boutiques, handbags, perfumes, jewels, cashier & washroom',
      dirCategory: 'town',
      x: 106.5, z: 39.8, w: 13.0, d: 8.2,
      flatRoof: true, doorFace: 'S',
      floorMat: marbleMat, wallMat: ivoryMat, roofMat: slateRoofMat,
      shutterMat: kit.palette.fabricColors.champagne,
    });
    [-3.6, 0, 3.6].forEach(function (sx, si) {
      const vitrine = new THREE.Group();
      vitrine.position.set(shop.cx + sx, shop.y, shop.cz - 2.0);
      kit.addMesh(vitrine, kit.g.cushion, kit.palette.ivory, 1.2, 0.95, 1.0, 0, 0.48, 0);
      kit.addMesh(vitrine, kit.g.box1, kit.palette.crystal, 1.05, 0.65, 0.85, 0, 1.28, 0);
      kit.addMesh(vitrine, kit.g.sphere1, [kit.palette.gold, kit.palette.fabricColors.rose, kit.palette.fabricColors.sapphire][si], 0.34, 0.28, 0.26, 0, 1.15, 0);
      townGroup.add(vitrine);
      addBox(sharedColliders, shop.cx + sx, shop.cz - 2.0, 1.3, 1.1);
    });
    const shopRug = kit.buildRug(3.6, 2.4, 'champagne');
    shopRug.position.set(shop.cx, shop.y, shop.cz + 0.6);
    townGroup.add(shopRug);
    placeSofa(townGroup, sharedColliders, {
      id: 'shop_lounge_sofa', title: 'Boutique Velvet Settee', floor: 0,
      x: shop.cx, y: shop.y, z: shop.cz + 0.5, yaw: 0, tone: 'champagne', w: 2.3,
    });
    const cashWrap = kit.buildCashierCounter('shop_cashier', '#4a3520', 'GALERIE CASHIER');
    cashWrap.position.set(shop.cx + 3.8, shop.y, shop.cz + 1.4);
    townGroup.add(cashWrap);
    tagInteractable(cashWrap, 'shop_cashier');
    addBox(sharedColliders, shop.cx + 3.8, shop.cz + 1.4, 2.5, 0.9);
    registerSpot({
      id: 'shop_cashier',
      title: 'Galerie Royale Luxury Boutique',
      floor: 0,
      category: 'town',
      x: shop.cx + 3.8, y: shop.y, z: shop.cz + 1.4,
      radius: 4.0,
      actions: [{
        id: 'buy_luxury_bag', label: 'Buy Designer Handbag & Perfume Set (₡90)', hint: '+30 Fun, +18 Poise & +5 Clout', instant: true,
        onInstant: function (actCtx) {
          if ((actCtx.game.money || 0) < 90) return actCtx.toast('Need ₡90 Crowns.');
          actCtx.game.money -= 90;
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 30, composure: 18 });
          recordDispatchGossip(actCtx, 'Royal shopping spree at Galerie Royale turns every head!', 5, 0);
          actCtx.toast('Luxury shopping bags secured! (+30 Fun, +5 Clout)');
        },
      }],
    });
    addWallZ(townGroup, sharedColliders, 0, 3.3, shop.cx - 3.0, shop.cz + 1.0, shop.cz + 4.0, shop.cz + 2.5, 1.2, 0.2, ivoryMat);
    addWallX(townGroup, sharedColliders, 0, 3.3, shop.cz + 1.0, shop.cx - 6.4, shop.cx - 3.0, null, 0, 0.2, ivoryMat);
    placeToilet(townGroup, sharedColliders, { id: 'shop_toilet', title: 'Galerie VIP Restroom Toilet', floor: 0, rustic: false, x: shop.cx - 5.4, y: shop.y, z: shop.cz + 3.0, yaw: Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'shop_sink', title: 'Galerie VIP Restroom Sink', floor: 0, rustic: false, x: shop.cx - 4.2, y: shop.y, z: shop.cz + 1.6, yaw: 0 });

    // CLUB COURONNE PRIVÉ (18+, x = 133.6, z = 39.4)
    const club = addEnterableLot({
      id: 'plot_club',
      title: 'Club Couronne Privé (18+)',
      signTitle: 'Club Nightlife 18+',
      signColor: '#36143d',
      subtitle: 'VIP velvet booths, illuminated dancefloor, bar & washroom',
      dirCategory: 'town',
      x: 133.6, z: 39.4, w: 13.6, d: 8.6,
      flatRoof: true, windows: false, doorFace: 'S',
      floorMat: clubDarkMat, wallMat: clubDarkMat, roofMat: slateRoofMat,
    });
    const danceFloorMat = kit.keepMat(new THREE.MeshBasicMaterial({ color: 0xd966ff }));
    const danceFloor = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 4.2), danceFloorMat);
    danceFloor.rotation.x = -Math.PI / 2;
    danceFloor.position.set(club.cx, club.y + 0.03, club.cz + 0.2);
    danceFloor.userData.noMerge = true;
    townGroup.add(danceFloor);
    const djBooth = kit.buildKitchenCounter('club_dj', false);
    djBooth.position.set(club.cx, club.y, club.cz - 3.0);
    townGroup.add(djBooth);
    tagInteractable(djBooth, 'club_dj');
    addBox(sharedColliders, club.cx, club.cz - 3.0, 3.0, 0.9);
    placeSofa(townGroup, sharedColliders, {
      id: 'club_vip_booth', title: 'Club Couronne VIP Booth', floor: 0,
      x: club.cx - 4.4, y: club.y, z: club.cz - 0.6, yaw: Math.PI * 0.5, tone: 'crimson', w: 2.6,
    });
    placeToilet(townGroup, sharedColliders, { id: 'club_toilet', title: 'Club Couronne VIP Restroom', floor: 0, rustic: false, x: club.cx + 5.6, y: club.y, z: club.cz - 2.9, yaw: -Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'club_sink', title: 'Club Powder Mirror Vanity', floor: 0, rustic: false, x: club.cx + 5.4, y: club.y, z: club.cz + 0.6, yaw: -Math.PI * 0.5 });
    const clubChand = kit.buildChandelier(0.95);
    clubChand.position.set(club.cx, club.y + 3.0, club.cz);
    club.roofGrp.add(clubChand);
    registerSpot({
      id: 'club_dj',
      title: 'Club Couronne Dancefloor & Bar',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: club.cx, y: club.y, z: club.cz + 0.2,
      radius: 4.5,
      actions: [
        {
          id: 'club_dance', label: 'Dance Under Chandelier Lasers', hint: '+22 Fun/s & VIP Scandal Buzz', pose: 'dance',
          anchor: { x: club.cx, y: club.y, z: club.cz + 0.2, yaw: Math.PI, floorY: club.y, exitX: club.cx, exitZ: club.cz + 2.2, exitYaw: 0 },
          rates: { fun: 22, energy: -3 }, statusText: 'Dancing at Club Couronne Privé...',
        },
        {
          id: 'club_toast', label: 'Order Champagne Bottle Service (₡30)', hint: '+26 Fun & +5 Scandal on Crown Dispatch', instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 30) return actCtx.toast('Need ₡30 Crowns.');
            actCtx.game.money -= 30;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 26, energy: 6 });
            recordDispatchGossip(actCtx, 'After-hours scandal: Heiress photographed dancing inside Club Couronne Privé!', 3, 5);
            actCtx.toast('Sparkling elixir served! Crown Dispatch took note (+5 Scandal)');
          },
        },
      ],
    });

    // VILLA AZURE SWIMMING POOL (x = 79.6, z = 27.6)
    const poolX = 79.6;
    const poolZ = 27.6;
    const poolDeck = new THREE.Mesh(new THREE.BoxGeometry(19.0, 0.24, 12.2), poolDeckMat);
    poolDeck.position.set(poolX, 0.12, poolZ);
    poolDeck.receiveShadow = true;
    townGroup.add(poolDeck);
    walkableFloors.push({ minX: poolX - 9.5, maxX: poolX + 9.5, minZ: poolZ - 6.1, maxZ: poolZ + 6.1, y: 0.24 });

    const poolBasin = new THREE.Mesh(new THREE.BoxGeometry(10.8, 0.18, 6.4), waterMat);
    poolBasin.position.set(poolX, 0.23, poolZ + 0.5);
    townGroup.add(poolBasin);
    const poolRim = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.08, 7.0), whiteMarbleMat);
    poolRim.position.set(poolX, 0.21, poolZ + 0.5);
    townGroup.add(poolRim);
    const poolExtras = kit.buildPoolExtras();
    poolExtras.position.set(poolX, 0.24, poolZ + 0.5);
    townGroup.add(poolExtras);
    if (poolExtras.userData && poolExtras.userData.floatRing) {
      poolFloatRings.push({ mesh: poolExtras.userData.floatRing, baseX: -2.4, baseZ: 0.6 });
    }
    tagInteractable(poolBasin, 'azure_pool_swim');
    tagInteractable(poolRim, 'azure_pool_swim');
    tagInteractable(poolExtras, 'azure_pool_swim');
    poolZones.push({ minX: poolX - 5.2, maxX: poolX + 5.2, minZ: poolZ - 2.6, maxZ: poolZ + 3.6, y: 0.24 });
    townZones.push({ minX: poolX - 9.5, maxX: poolX + 9.5, minZ: poolZ - 6.1, maxZ: poolZ + 6.1, label: 'Villa Azure Swimming Pool' });

    const poolSign = kit.buildPlotSign('Villa Azure Swimming Pool', '#1c637a');
    poolSign.position.set(poolX - 9.8, 0, poolZ + 3.2);
    poolSign.rotation.y = -Math.PI * 0.5;
    townGroup.add(poolSign);

    [-3.8, 0, 3.8].forEach(function (lx, li) {
      const lounger = kit.buildPoolLounger(['champagne', 'rose', 'sapphire'][li], 'pool_lounger_' + li);
      lounger.position.set(poolX + lx, 0.24, poolZ - 4.3);
      townGroup.add(lounger);
      tagInteractable(lounger, 'pool_lounger_' + li);
      addBox(sharedColliders, poolX + lx, poolZ - 4.3, 0.9, 1.9);
      registerSpot({
        id: 'pool_lounger_' + li, title: 'Poolside Sun Lounger', floor: 0, category: 'town',
        x: poolX + lx, y: 0.24, z: poolZ - 4.3, radius: 2.2,
        actions: [{
          id: 'tan_' + li, label: 'Sunbathe on Riviera Pool Lounger', hint: '+12 Energy/s & +10 Fun/s', pose: 'daydream',
          anchor: { x: poolX + lx, y: 0.56, z: poolZ - 4.1, yaw: 0, rigOffsetY: 0.34, floorY: 0.24, exitX: poolX + lx + 1.1, exitZ: poolZ - 4.1, exitYaw: 0 },
          rates: { energy: 12, fun: 10, composure: 5 }, statusText: 'Basking beside the turquoise Villa Azure Swimming Pool...',
        }],
      });
    });

    registerSpot({
      id: 'azure_pool_swim',
      title: 'Villa Azure Swimming Pool',
      floor: 0,
      category: 'toilets',
      shortcut: true,
      x: poolX, y: 0.24, z: poolZ + 0.5,
      bounds: { minX: poolX - 5.6, maxX: poolX + 5.6, minZ: poolZ - 3.0, maxZ: poolZ + 4.0 },
      radius: 2.4,
      actions: [
        {
          id: 'swim_azure', label: 'Jump In & Swim Laps', hint: '+16 Fun/s & +12 Hygiene/s (switches into swimwear!)', instant: true,
          onInstant: function (actCtx) {
            actCtx.playerCtrl.teleport(poolX, poolZ + 0.5, Math.PI * 0.5, 0.14);
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 12, hygiene: 10 });
            actCtx.toast('Changed into swimwear and dove into Villa Azure Pool!');
          },
        },
        {
          id: 'float_azure', label: 'Float on Back & Relax', hint: '+12 Energy/s, +16 Fun/s & +10 Hygiene/s', pose: 'swim_float',
          anchor: { x: poolX - 1.5, y: 0.08, z: poolZ + 0.5, yaw: 0, rigOffsetY: 0.16, floorY: 0.24, exitX: poolX, exitZ: poolZ + 4.4, exitYaw: 0 },
          rates: { energy: 12, fun: 16, hygiene: 10, composure: 8 },
          statusText: 'Floating weightlessly on the Villa Azure Pool...',
        },
        {
          id: 'splash_azure', label: 'Splash & Play in Pool', hint: '+20 Fun/s & +12 Hygiene/s', pose: 'swim_splash',
          anchor: { x: poolX + 1.5, y: 0.08, z: poolZ + 0.5, yaw: Math.PI, rigOffsetY: -0.40, floorY: 0.24, exitX: poolX, exitZ: poolZ + 4.4, exitYaw: 0 },
          rates: { fun: 20, hygiene: 12 },
          statusText: 'Splashing playfully in the turquoise Villa Azure Pool...',
        },
      ],
    });
    townDirectory.push(ctx.spots ? ctx.spots.azure_pool_swim : { id: 'azure_pool_swim', title: 'Villa Azure Swimming Pool', category: 'town', x: poolX, y: 0.24, z: poolZ, actions: [] });

    // Riviera Campus Quad Lawn (x = 106.5, z = 27.6)
    const quadPad = new THREE.Mesh(new THREE.BoxGeometry(19.0, 0.08, 11.4), sidewalkMat);
    quadPad.position.set(106.5, 0.04, 27.6);
    townGroup.add(quadPad);
    const quadGazebo = kit.buildGazebo('campus_quad_gazebo');
    quadGazebo.position.set(106.5, 0.08, 27.6);
    townGroup.add(quadGazebo);
    tagInteractable(quadGazebo, 'campus_quad_gazebo');
    registerSpot({
      id: 'campus_quad_gazebo',
      title: 'University Campus Quad Pavilion',
      floor: 0,
      category: 'schools',
      x: 106.5, y: 0.08, z: 27.6,
      radius: 4.5,
      actions: [{
        id: 'quad_study', label: 'Study & Sketch at Campus Pavilion', hint: '+14 Poise/s & +10 Fun/s', pose: 'sit_read',
        anchor: { x: 105.0, y: 0.54, z: 27.6, yaw: Math.PI * 0.5, rigOffsetY: -0.44, floorY: 0.08, exitX: 106.5, exitZ: 31.2, exitYaw: 0 },
        rates: { composure: 14, fun: 10, energy: 8 }, statusText: 'Studying beneath the University Quad Pavilion...',
      }],
    });

    // GRAND HÔTEL MONTIERI PARIS (3-STOREY + COURTYARD VALET PARKING, delegated to hotel.js)
    let hotelMod = null;
    if (window.CrownHotel && typeof window.CrownHotel.build === 'function') {
      hotelMod = window.CrownHotel.build({
        THREE: THREE,
        kit: kit,
        townGroup: townGroup,
        sharedColliders: sharedColliders,
        walkableFloors: walkableFloors,
        cutaways: cutaways,
        townZones: townZones,
        townDirectory: townDirectory,
        townDoors: townDoors,
        dynamicNodes: dynamicNodes,
        animatedFlames: animatedFlames,
        ivoryMat: ivoryMat,
        marbleMat: marbleMat,
        whiteMarbleMat: whiteMarbleMat,
        parquetMat: parquetMat,
        goldMat: goldMat,
        glassMat: glassMat,
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
        tagInteractable: tagInteractable,
        registerSpot: registerSpot,
        registerDrivableCar: registerDrivableCar,
        recordDispatchGossip: recordDispatchGossip,
      });
    }

    // AUTONOMOUS CARPOOL CRUISERS ON RIVIERA BOULEVARDS
    const cruisers = [];
    if (kit && typeof kit.buildParkedCar === 'function') {
      const cruiserDefs = [
        {
          id: 'boulevard_cruiser_west',
          paintHex: '#253954',
          isConvertible: true,
          speed: 6.4,
          loop: [[-123.5, 0.0], [-67.0, 0.0], [-67.0, -10.5], [-123.5, -10.5]],
          riders: [
            { seat: 'driver', hex: '#1e2738', trim: '#d4af55', hair: 'slick-gala', male: true },
            { seat: 'frontPass', hex: '#b85d74', trim: '#fff4e4', hair: 'royal-waves', male: false },
            { seat: 'rearRight', hex: '#4f7a9e', trim: '#f8e6c8', hair: 'riviera-bob', male: false },
          ],
        },
        {
          id: 'boulevard_cruiser_east',
          paintHex: '#7d2236',
          isConvertible: false,
          speed: 6.0,
          loop: [[67.0, 0.0], [120.5, 0.0], [120.5, -10.5], [67.0, -10.5]],
          riders: [
            { seat: 'driver', hex: '#283244', trim: '#d4af55', hair: 'wavy-curtain-shag', male: true },
            { seat: 'frontPass', hex: '#4b7a5e', trim: '#faf2e6', hair: 'romantic-bun', male: false },
          ],
        },
      ];
      cruiserDefs.forEach(function (cd) {
        const car = kit.buildParkedCar(cd.paintHex, false, null, cd.isConvertible);
        car.position.set(cd.loop[0][0], 0.03, cd.loop[0][1]);
        car.userData.noMerge = true;
        townGroup.add(car);
        dynamicNodes.push(car);
        if (window.CrownPlayer && typeof window.CrownPlayer.buildRoyalCharacterMesh === 'function' && car.userData.seats) {
          cd.riders.forEach(function (rd, rIdx) {
            const seatCoord = car.userData.seats[rd.seat];
            if (!seatCoord) return;
            const rMesh = window.CrownPlayer.buildRoyalCharacterMesh(
              {
                body: { sliders: { height: rd.male ? 1.02 : 0.96 } },
                look: { hairStyle: rd.hair },
                wardrobe: { outfitId: rd.male ? 'equestrian-tailored' : 'riviera-resort-midi', themeId: 'signature' },
              },
              { name: cd.id + '_rider_' + rIdx, role: rd.seat === 'driver' ? 'chauffeur' : 'royal', dressHex: rd.hex, trimHex: rd.trim, showPlumbob: false }
            );
            if (!rMesh || !rMesh.root) return;
            rMesh.root.userData.noMerge = true;
            if (typeof seatCoord.add === 'function') {
              rMesh.root.position.set(0, -0.28, 0);
              rMesh.root.rotation.set(0, 0, 0);
              seatCoord.add(rMesh.root);
            } else {
              rMesh.root.position.set(seatCoord.x, (typeof seatCoord.y === 'number' ? seatCoord.y : 0.44) - 0.28, seatCoord.z);
              rMesh.root.rotation.set(0, 0, 0);
              car.add(rMesh.root);
            }
            if (window.CrownAnim && typeof window.CrownAnim.applyPose === 'function') {
              const rBaseLeg = rMesh.baseLeg || 0.94;
              window.CrownAnim.applyPose(rMesh, rd.seat === 'driver' ? 'drive' : 'drive_passenger', 0.016, rIdx * 0.7, {
                steer: 0,
                rigOffsetY: -rBaseLeg * 0.62,
              });
            }
          });
        }
        cruisers.push({
          id: cd.id,
          group: car,
          loop: cd.loop,
          segIdx: 0,
          x: cd.loop[0][0],
          z: cd.loop[0][1],
          yaw: Math.PI * 0.5,
          maxSpeed: cd.speed,
          curSpeed: cd.speed,
          wheelRot: 0,
          radius: 1.5,
        });
      });
    }

    // -----------------------------------------------------------
    // 9. RIVIERA INSTANCED CYPRESS TREES, PASTEL BLOSSOMS & STREETLAMPS
    // -----------------------------------------------------------
    const dObj = new THREE.Object3D();
    const tCol = new THREE.Color();
    const lampSpots = [
      [-67.0, -7.2], [-95.0, -7.2], [-123.5, -7.2], [-153.5, -7.2],
      [67.0, -7.2], [92.5, -7.2], [120.5, -7.2], [156.5, -7.2],
      [-67.0, -14.0], [-95.0, -14.0], [-123.5, -14.0],
      [67.0, -14.0], [92.5, -14.0], [120.5, -14.0],
      [-67.0, 34.5], [-95.0, 34.5], [-123.5, 34.5], [-153.5, 34.5],
      [67.0, 34.5], [92.5, 34.5], [120.5, 34.5], [156.5, 34.5],
      [-40, 44.8], [-20, 44.8], [20, 44.8], [40, 44.8],
      [-81, 45.2], [-111, 45.2], [-139, 45.2],
      [79.6, 45.2], [106.5, 45.2], [133.6, 45.2],
    ];
    const lampPostMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.08, 0.12, 3.6, 8), kit.palette.iron, lampSpots.length);
    const lampCapMesh = new THREE.InstancedMesh(new THREE.ConeGeometry(0.28, 0.25, 6), goldMat, lampSpots.length);
    const lampBulbMesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.22, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xffebb8 }),
      lampSpots.length
    );
    lampSpots.forEach(function (lp, i) {
      dObj.position.set(lp[0], 1.8, lp[1]);
      dObj.rotation.set(0, 0, 0);
      dObj.scale.set(1, 1, 1);
      dObj.updateMatrix();
      lampPostMesh.setMatrixAt(i, dObj.matrix);
      dObj.position.set(lp[0], 3.92, lp[1]);
      dObj.updateMatrix();
      lampCapMesh.setMatrixAt(i, dObj.matrix);
      dObj.position.set(lp[0], 3.68, lp[1]);
      dObj.updateMatrix();
      lampBulbMesh.setMatrixAt(i, dObj.matrix);
    });
    lampPostMesh.castShadow = true;
    lampPostMesh.computeBoundingSphere();
    lampCapMesh.computeBoundingSphere();
    lampBulbMesh.computeBoundingSphere();
    townGroup.add(lampPostMesh, lampCapMesh, lampBulbMesh);

    const grovePts = [];
    for (let gx = -150; gx <= -68; gx += 12) {
      grovePts.push([gx, -51.5], [gx, 52.8]);
    }
    for (let gx2 = 68; gx2 <= 148; gx2 += 12) {
      grovePts.push([gx2, -51.5], [gx2, 52.8]);
    }
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c412d, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.78 });
    const groveTrunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.22, 0.34, 2.4, 7), trunkMat, grovePts.length);
    const groveCrowns = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1.75, 1), leafMat, grovePts.length);
    grovePts.forEach(function (gp, i) {
      const sc = 0.85 + ((i * 13) % 20) / 55;
      dObj.position.set(gp[0], 1.2 * sc, gp[1]);
      dObj.scale.set(sc, sc, sc);
      dObj.rotation.set(0, i * 0.7, 0);
      dObj.updateMatrix();
      groveTrunks.setMatrixAt(i, dObj.matrix);
      dObj.position.set(gp[0], 3.2 * sc, gp[1]);
      dObj.scale.set(sc * 0.92, sc * (i % 3 === 0 ? 1.65 : 1.05), sc * 0.92);
      dObj.updateMatrix();
      groveCrowns.setMatrixAt(i, dObj.matrix);
      if (i % 4 === 0) tCol.setHex(0xf3bfd0);
      else if (i % 4 === 1) tCol.setHex(0x6c9658);
      else tCol.setHex(0x4b7444);
      groveCrowns.setColorAt(i, tCol);
    });
    if (groveCrowns.instanceColor) groveCrowns.instanceColor.needsUpdate = true;
    groveCrowns.castShadow = true;
    groveTrunks.computeBoundingSphere();
    groveCrowns.computeBoundingSphere();
    townGroup.add(groveTrunks, groveCrowns);

    let expansionMod = null;
    if (window.CrownKingdomExpansion && typeof window.CrownKingdomExpansion.build === 'function') {
      expansionMod = window.CrownKingdomExpansion.build({
        THREE: THREE,
        kit: kit,
        townGroup: townGroup,
        sharedColliders: sharedColliders,
        walkableFloors: walkableFloors,
        cutaways: cutaways,
        townZones: townZones,
        townDirectory: townDirectory,
        townDoors: townDoors,
        dynamicNodes: dynamicNodes,
        ivoryMat: ivoryMat,
        marbleMat: marbleMat,
        whiteMarbleMat: whiteMarbleMat,
        parquetMat: parquetMat,
        goldMat: goldMat,
        glassMat: glassMat,
        slateRoofMat: slateRoofMat,
        waterMat: waterMat,
        boxwoodMat: boxwoodMat,
        sidewalkMat: sidewalkMat,
        asphaltMat: asphaltMat,
        terracottaMat: terracottaMat,
        pastelPinkWall: pastelPinkWall,
        mintWallMat: mintWallMat,
        skyWallMat: skyWallMat,
        butterWallMat: butterWallMat,
        stoneWallMat: stoneWallMat,
        clubDarkMat: clubDarkMat,
        tileFloorMat: tileFloorMat,
        addBox: addBox,
        addCircle: addCircle,
        addWallX: addWallX,
        addWallZ: addWallZ,
        placeBed: placeBed,
        placeToilet: placeToilet,
        placeVanitySink: placeVanitySink,
        placeShower: placeShower,
        placeSofa: placeSofa,
        placeArmchair: placeArmchair,
        tagInteractable: tagInteractable,
        registerSpot: registerSpot,
        addEnterableLot: addEnterableLot,
        addStreetStrip: addStreetStrip,
        recordDispatchGossip: recordDispatchGossip,
      });
    }

    // Tag animated nodes and spatially batch static town geometry for low draw calls + frustum culling
    danceFloor.userData.noMerge = true;
    dynamicNodes.push(danceFloor);
    for (let i = 0; i < tvScreens.length; i++) {
      if (tvScreens[i]) {
        tvScreens[i].userData.noMerge = true;
        dynamicNodes.push(tvScreens[i]);
      }
    }
    for (let i = 0; i < animatedFlames.length; i++) {
      const fl = animatedFlames[i];
      for (let k = 0; k < fl.length; k++) {
        if (fl[k]) {
          fl[k].userData.noMerge = true;
          dynamicNodes.push(fl[k]);
        }
      }
    }
    for (let i = 0; i < poolFloatRings.length; i++) {
      if (poolFloatRings[i] && poolFloatRings[i].mesh) {
        poolFloatRings[i].mesh.userData.noMerge = true;
        dynamicNodes.push(poolFloatRings[i].mesh);
      }
    }
    for (let i = 0; i < windmillRotors.length; i++) {
      if (windmillRotors[i]) {
        windmillRotors[i].userData.noMerge = true;
        dynamicNodes.push(windmillRotors[i]);
      }
    }
    for (let i = 0; i < vehicles.length; i++) {
      if (vehicles[i] && vehicles[i].group) {
        vehicles[i].group.userData.noMerge = true;
        dynamicNodes.push(vehicles[i].group);
      }
    }
    for (let i = 0; i < horsesList.length; i++) {
      if (horsesList[i] && horsesList[i].group) {
        horsesList[i].group.userData.noMerge = true;
        dynamicNodes.push(horsesList[i].group);
      }
    }
    for (let i = 0; i < farmAnimals.length; i++) {
      if (farmAnimals[i] && farmAnimals[i].group) {
        farmAnimals[i].group.userData.noMerge = true;
        dynamicNodes.push(farmAnimals[i].group);
      }
    }

    if (kit && typeof kit.mergeStaticGroup === 'function') {
      const nonInteractFilter = function (m) {
        return !(m.userData && (m.userData.interactId || m.userData.noMerge));
      };
      const cutawaySet = new Set();
      for (let i = 0; i < cutaways.length; i++) {
        const c = cutaways[i];
        if (c.roofGrp) {
          cutawaySet.add(c.roofGrp);
          kit.mergeStaticGroup(c.roofGrp, { filter: nonInteractFilter });
          c.roofGrp.userData.noMerge = true;
        }
        if (c.upperGrp) {
          cutawaySet.add(c.upperGrp);
          kit.mergeStaticGroup(c.upperGrp, { filter: nonInteractFilter });
          c.upperGrp.userData.noMerge = true;
        }
        if (c.floor3Grp) {
          cutawaySet.add(c.floor3Grp);
          kit.mergeStaticGroup(c.floor3Grp, { filter: nonInteractFilter });
          c.floor3Grp.userData.noMerge = true;
        }
      }

      function hasSpecialDescendant(node) {
        if (!node) return false;
        const ud = node.userData;
        if (ud && (ud.interactId || ud.noMerge || ud.rig || ud.rotor)) return true;
        if (node.isInstancedMesh || node.isLight) return true;
        const ch = node.children;
        for (let k = 0; k < ch.length; k++) {
          if (hasSpecialDescendant(ch[k])) return true;
        }
        return false;
      }

      const spatialZones = [
        new THREE.Group(), // 0: West Outer (x < -100)
        new THREE.Group(), // 1: West Inner (-100 <= x < -45)
        new THREE.Group(), // 2: Center (-45 <= x <= 45)
        new THREE.Group(), // 3: East Inner (45 < x <= 100)
        new THREE.Group(), // 4: East Outer (x > 100)
      ];
      const _tmpBox = new THREE.Box3();
      const _tmpCtr = new THREE.Vector3();
      townGroup.updateMatrixWorld(true);
      const origChildren = townGroup.children.slice();
      for (let ci = 0; ci < origChildren.length; ci++) {
        const ch = origChildren[ci];
        if (cutawaySet.has(ch) || hasSpecialDescendant(ch)) continue;
        _tmpBox.setFromObject(ch);
        if (_tmpBox.isEmpty()) continue;
        _tmpBox.getCenter(_tmpCtr);
        const bx = _tmpCtr.x;
        const zi = bx < -100 ? 0 : bx < -45 ? 1 : bx <= 45 ? 2 : bx <= 100 ? 3 : 4;
        spatialZones[zi].add(ch);
      }
      for (let zi = 0; zi < spatialZones.length; zi++) {
        if (spatialZones[zi].children.length > 0) {
          townGroup.add(spatialZones[zi]);
          kit.mergeStaticGroup(spatialZones[zi], { filter: nonInteractFilter });
        }
      }
    }

    function groundHeightAtTown(x, z, yNow) {
      if (expansionMod && typeof expansionMod.groundHeightAtExpansion === 'function') {
        const eh = expansionMod.groundHeightAtExpansion(x, z, yNow);
        if (typeof eh === 'number') return eh;
      }
      if (hotelMod && typeof hotelMod.groundHeightAtHotel === 'function') {
        const hh = hotelMod.groundHeightAtHotel(x, z, yNow);
        if (typeof hh === 'number') return hh;
      }
      if (bakeryMod && typeof bakeryMod.groundHeightAtBakery === 'function') {
        const bh = bakeryMod.groundHeightAtBakery(x, z, yNow);
        if (typeof bh === 'number') return bh;
      }
      for (let p = 0; p < poolZones.length; p++) {
        const pz = poolZones[p];
        if (x >= pz.minX && x <= pz.maxX && z >= pz.minZ && z <= pz.maxZ) return 0.08;
      }
      for (let i = 0; i < walkableFloors.length; i++) {
        const wf = walkableFloors[i];
        if (x >= wf.minX && x <= wf.maxX && z >= wf.minZ && z <= wf.maxZ) return wf.y;
      }
      return null;
    }

    function updateTownCutaway(playerPos) {
      for (let i = 0; i < cutaways.length; i++) {
        const c = cutaways[i];
        const inside =
          playerPos.x >= c.minX && playerPos.x <= c.maxX &&
          playerPos.z >= c.minZ && playerPos.z <= c.maxZ;
        if (c.floor3Grp) {
          c.upperGrp.visible = !inside || playerPos.y >= 2.2;
          c.floor3Grp.visible = !inside || playerPos.y >= 7.2;
          c.roofGrp.visible = !inside;
        } else if (c.upperGrp && c.roofGrp) {
          c.upperGrp.visible = !inside || playerPos.y >= 2.2;
          c.roofGrp.visible = !inside;
        } else if (c.roofGrp) {
          c.roofGrp.visible = !inside;
        }
      }
    }

    function detectTownZone(pos) {
      if (hotelMod && typeof hotelMod.detectZone === 'function') {
        const hz = hotelMod.detectZone(pos);
        if (hz) return hz;
      }
      if (bakeryMod && typeof bakeryMod.detectZone === 'function') {
        const bz = bakeryMod.detectZone(pos);
        if (bz) return bz;
      }
      for (let i = 0; i < townZones.length; i++) {
        const tz = townZones[i];
        if (pos.x >= tz.minX && pos.x <= tz.maxX && pos.z >= tz.minZ && pos.z <= tz.maxZ) {
          return tz.label;
        }
      }
      if (pos.x < -64) return 'Willow Creek Suburbs, Mansionettes & Farm';
      if (pos.x > 64) return 'Royal Hospital, Campus, Hotel & Promenade';
      return null;
    }

    function isOnUpperFloor(x, z, yNow) {
      if (expansionMod && typeof expansionMod.isOnUpperFloor === 'function' && expansionMod.isOnUpperFloor(x, z, yNow)) {
        return true;
      }
      if (hotelMod && typeof hotelMod.isOnUpperFloor === 'function' && hotelMod.isOnUpperFloor(x, z, yNow)) {
        return true;
      }
      return Boolean(bakeryMod && typeof bakeryMod.isOnUpperFloor === 'function' && bakeryMod.isOnUpperFloor(x, z, yNow));
    }

    function resolveUpperCollision(nx, nz, radius, yNow) {
      if (expansionMod && typeof expansionMod.resolveUpperCollision === 'function') {
        const er = expansionMod.resolveUpperCollision(nx, nz, radius, yNow);
        if (er) return er;
      }
      if (hotelMod && typeof hotelMod.resolveUpperCollision === 'function') {
        const hr = hotelMod.resolveUpperCollision(nx, nz, radius, yNow);
        if (hr) return hr;
      }
      if (bakeryMod && typeof bakeryMod.resolveUpperCollision === 'function') {
        const br = bakeryMod.resolveUpperCollision(nx, nz, radius, yNow);
        if (br) return br;
      }
      return null;
    }

    function toggleDoor(doorId) {
      for (let i = 0; i < townDoors.length; i++) {
        const td = townDoors[i];
        if (td.id === doorId) {
          td.manualOpen = !td.manualOpen;
          return td;
        }
      }
      return null;
    }

    function update(elapsedSec, activeTransport, playerPos) {
      const dtDoor = Math.min(0.08, Math.max(0.008, elapsedSec - lastTownElapsed || 0.016));
      lastTownElapsed = elapsedSec;
      const hasP = Boolean(playerPos);
      const px = hasP ? playerPos.x : 0;
      const py = hasP ? playerPos.y : 0;
      const pz = hasP ? playerPos.z : 0;

      if (!hasP || (px - club.cx) * (px - club.cx) + (pz - club.cz) * (pz - club.cz) < 3600) {
        const hue = (elapsedSec * 0.14) % 1;
        danceFloorMat.color.setHSL(hue, 0.72, 0.62);
      }

      const activeCar = activeTransport && activeTransport.kind === 'car' ? activeTransport.entity : null;
      const activeSpeed = activeTransport ? Math.abs(activeTransport.speed || 0) : 0;

      // Autonomous Boulevard Carpool Cruisers (yield smoothly if player/car is ahead!)
      for (let ci = 0; ci < cruisers.length; ci++) {
        const cr = cruisers[ci];
        const targetPt = cr.loop[(cr.segIdx + 1) % cr.loop.length];
        const toX = targetPt[0] - cr.x;
        const toZ = targetPt[1] - cr.z;
        const dist = Math.hypot(toX, toZ);
        if (dist < 0.85) {
          cr.segIdx = (cr.segIdx + 1) % cr.loop.length;
        }
        const nx = dist > 0.01 ? toX / dist : 0;
        const nz = dist > 0.01 ? toZ / dist : 1;
        let yieldStop = false;
        if (hasP) {
          const pdx = px - cr.x;
          const pdz = pz - cr.z;
          const pDistSq = pdx * pdx + pdz * pdz;
          if (pDistSq < 38.4 && (pdx * nx + pdz * nz) > 0.25) {
            yieldStop = true;
          }
        }
        const goalSpeed = yieldStop ? 0 : cr.maxSpeed;
        cr.curSpeed += (goalSpeed - cr.curSpeed) * Math.min(1, dtDoor * 6.0);
        cr.x += nx * cr.curSpeed * dtDoor;
        cr.z += nz * cr.curSpeed * dtDoor;
        const desiredYaw = Math.atan2(nx, nz);
        let diffYaw = desiredYaw - cr.yaw;
        while (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
        while (diffYaw < -Math.PI) diffYaw += Math.PI * 2;
        cr.yaw += diffYaw * Math.min(1, dtDoor * 6.5);
        cr.group.position.set(cr.x, 0.03, cr.z);
        cr.group.rotation.y = cr.yaw;
        cr.wheelRot += cr.curSpeed * dtDoor * 2.2;
        const ud = cr.group.userData;
        if (ud && Array.isArray(ud.wheels)) {
          for (let wi = 0; wi < ud.wheels.length; wi++) {
            ud.wheels[wi].rotation.x = cr.wheelRot;
          }
        }
        if (ud && Array.isArray(ud.frontSteer)) {
          const steerAng = THREE.MathUtils.clamp(diffYaw * 0.45, -0.35, 0.35);
          for (let si = 0; si < ud.frontSteer.length; si++) {
            ud.frontSteer[si].rotation.y = steerAng;
          }
        }
      }

      for (let v = 0; v < vehicles.length; v++) {
        const vh = vehicles[v];
        if (vh.spot) {
          vh.spot.x = vh.group.position.x;
          vh.spot.z = vh.group.position.z;
        }
        const cd = vh.group && vh.group.userData && vh.group.userData.carDoors;
        if (cd) {
          if (cd.doorBurstTimer > 0) {
            cd.doorBurstTimer = Math.max(0, cd.doorBurstTimer - dtDoor);
          }
          let targetOpen = cd.manualOpen ? 1 : 0;
          if (!targetOpen && activeCar === vh) {
            targetOpen = activeSpeed > 0.75 ? 0 : cd.doorBurstTimer > 0 ? 1 : 0;
          } else if (!targetOpen && hasP) {
            const dx = vh.group.position.x - px;
            const dz = vh.group.position.z - pz;
            if (cd.doorBurstTimer > 0 || dx * dx + dz * dz < 11.5) targetOpen = 1;
          }
          if (Math.abs(cd.openRatio - targetOpen) > 0.002) {
            cd.openRatio += (targetOpen - cd.openRatio) * Math.min(1, dtDoor * 8.5);
            if (cd.left) cd.left.rotation.y = -cd.openRatio * 1.05;
            if (cd.right) cd.right.rotation.y = cd.openRatio * 1.05;
          }
        }
      }

      // Swinging Storefront & House Doors (automatically open on foot OR driving up to them!)
      for (let di = 0; di < townDoors.length; di++) {
        const td = townDoors[di];
        if (hasP) {
          const ddx = td.x - px;
          const ddz = td.z - pz;
          const distSq = ddx * ddx + ddz * ddz;
          if (distSq > 324 && td.openRatio <= 0.002 && !td.manualOpen) continue;
          const rad = (td.radius || 3.8) + (activeCar ? 2.2 : 0);
          const nearPlayer = Math.abs(td.y - py) < 2.2 && distSq < rad * rad;
          const target = td.manualOpen || nearPlayer ? 1 : 0;
          if (Math.abs(td.openRatio - target) > 0.002) {
            td.openRatio += (target - td.openRatio) * Math.min(1, dtDoor * 7.5);
            const ang = td.openRatio * (td.doors.maxAngle || 1.42);
            if (td.doors.leftPivot) td.doors.leftPivot.rotation.y = ang;
            if (td.doors.rightPivot) td.doors.rightPivot.rotation.y = -ang;
          }
        }
      }

      // Spin Greenfields Windmill blades continuously
      for (let w = 0; w < windmillRotors.length; w++) {
        const wr = windmillRotors[w];
        if (hasP && wr.parent) {
          const dx = wr.parent.position.x - px;
          const dz = wr.parent.position.z - pz;
          if (dx * dx + dz * dz > 15625) continue;
        }
        wr.rotation.z = elapsedSec * 0.85;
      }

      // Gently patrol Cows, Sheep & Chickens in Greenfields Farm Pasture
      for (let a = 0; a < farmAnimals.length; a++) {
        const fa = farmAnimals[a];
        if (hasP) {
          const dx = fa.group.position.x - px;
          const dz = fa.group.position.z - pz;
          if (dx * dx + dz * dz > 4624) continue;
        }
        const ap = elapsedSec * 0.25 + fa.phase;
        const ax = fa.homeX + Math.sin(ap) * fa.rx;
        const az = fa.homeZ + Math.cos(ap * 0.8) * fa.rz;
        const adx = Math.cos(ap) * fa.rx * 0.25;
        const adz = -Math.sin(ap * 0.8) * fa.rz * 0.2;
        fa.group.position.set(ax, 0.02, az);
        if (Math.abs(adx) + Math.abs(adz) > 0.001) {
          fa.group.rotation.y = Math.atan2(adx, adz);
        }
        const fRig = fa.group.userData && fa.group.userData.rig;
        if (fRig) {
          if (fRig.headPivot) fRig.headPivot.rotation.x = Math.sin(elapsedSec * 1.4 + fa.phase) * 0.22;
          if (fRig.legs && fRig.legs.length >= 4) {
            const ls = Math.sin(elapsedSec * 3.4 + fa.phase) * 0.24;
            fRig.legs[0].rotation.x = ls;
            fRig.legs[3].rotation.x = ls;
            fRig.legs[1].rotation.x = -ls;
            fRig.legs[2].rotation.x = -ls;
          }
        }
      }

      // Living Walking & Grazing Horses in Paddock!
      const mountedHorseId =
        activeTransport && activeTransport.kind === 'horse' && activeTransport.entity
          ? activeTransport.entity.id
          : null;
      for (let h = 0; h < horsesList.length; h++) {
        const hr = horsesList[h];
        if (hr.id !== mountedHorseId) {
          if (hasP) {
            const dx = hr.group.position.x - px;
            const dz = hr.group.position.z - pz;
            if (dx * dx + dz * dz > 5476) continue;
          }
          const cycle = (elapsedSec * hr.patrolSpeed + hr.phase) % 14.0;
          const isGrazing = cycle > 10.6;
          if (!isGrazing) {
            hr._walkT = (hr._walkT || hr.phase) + 0.016 * hr.patrolSpeed;
          }
          const theta = hr._walkT !== undefined ? hr._walkT : hr.phase;
          const nx = hr.patrolCx + Math.cos(theta) * hr.patrolRx;
          const nz = hr.patrolCz + Math.sin(theta * 2) * hr.patrolRz;
          const vx = -Math.sin(theta) * hr.patrolRx;
          const vz = Math.cos(theta * 2) * hr.patrolRz * 2;
          hr.x = nx;
          hr.z = nz;
          hr.group.position.set(nx, hr.baseY, nz);
          if (!isGrazing && (Math.abs(vx) + Math.abs(vz) > 0.001)) {
            hr.yaw = Math.atan2(vx, vz);
            hr.group.rotation.y = hr.yaw;
          }
          const rig = hr.group && hr.group.userData && hr.group.userData.rig;
          if (rig) {
            const ph = elapsedSec + hr.phase;
            if (rig.headPivot) {
              rig.headPivot.rotation.x = isGrazing ? 0.62 + Math.sin(ph * 2.5) * 0.08 : Math.sin(ph * 3.2) * 0.08;
              rig.headPivot.rotation.y = isGrazing ? Math.sin(ph * 0.8) * 0.16 : 0;
            }
            if (rig.tailPivot) {
              rig.tailPivot.rotation.x = Math.sin(ph * 2.6) * 0.09;
              rig.tailPivot.rotation.z = Math.sin(ph * 1.9) * 0.16;
            }
            if (rig.earL) rig.earL.rotation.x = Math.sin(ph * 4.0) * 0.14;
            if (rig.earR) rig.earR.rotation.x = -Math.sin(ph * 4.0 + 0.6) * 0.14;
            if (rig.legs && rig.legs.length >= 4) {
              const stride = isGrazing ? 0 : Math.sin(elapsedSec * 5.2 + hr.phase) * 0.36;
              rig.legs[0].rotation.x = stride;
              rig.legs[3].rotation.x = stride;
              rig.legs[1].rotation.x = -stride;
              rig.legs[2].rotation.x = -stride;
            }
          }
        }
        if (hr.spot) {
          hr.spot.x = hr.group.position.x;
          hr.spot.z = hr.group.position.z;
        }
      }

      for (let t = 0; t < tvScreens.length; t++) {
        const tv = tvScreens[t];
        if (tv && tv.userData && tv.userData.tvMat) {
          if (hasP) {
            const dx = tv.position.x - px;
            const dz = tv.position.z - pz;
            if (dx * dx + dz * dz > 3025) continue;
          }
          const tvHue = ((elapsedSec * 0.08 + t * 0.22) % 1);
          tv.userData.tvMat.color.setHSL(tvHue, 0.52, 0.58 + Math.sin(elapsedSec * 3.2 + t) * 0.08);
        }
      }

      for (let f = 0; f < animatedFlames.length; f++) {
        const fl = animatedFlames[f];
        if (hasP && fl.length > 0 && fl[0].parent) {
          const p0 = fl[0].parent;
          const dx = p0.position.x - px;
          const dz = p0.position.z - pz;
          if (dx * dx + dz * dz > 3025) continue;
        }
        for (let k = 0; k < fl.length; k++) {
          fl[k].scale.y = 0.82 + Math.sin(elapsedSec * (9.5 + k * 2.1) + f) * 0.28;
        }
      }

      for (let r = 0; r < poolFloatRings.length; r++) {
        const pr = poolFloatRings[r];
        if (pr.mesh) {
          if (hasP) {
            const dx = pr.baseX - px;
            const dz = pr.baseZ - pz;
            if (dx * dx + dz * dz > 4225) continue;
          }
          pr.mesh.position.x = pr.baseX + Math.sin(elapsedSec * 0.45) * 0.35;
          pr.mesh.position.z = pr.baseZ + Math.cos(elapsedSec * 0.35) * 0.3;
          pr.mesh.position.y = 0.29 + Math.sin(elapsedSec * 2.0) * 0.025;
        }
      }
    }

    return {
      groundHeightAtTown: groundHeightAtTown,
      updateTownCutaway: updateTownCutaway,
      detectTownZone: detectTownZone,
      isOnUpperFloor: isOnUpperFloor,
      resolveUpperCollision: resolveUpperCollision,
      isExtraDrivable: expansionMod && typeof expansionMod.isExtraDrivable === 'function' ? expansionMod.isExtraDrivable : null,
      toggleDoor: toggleDoor,
      townDirectory: townDirectory,
      townDoors: townDoors,
      vehicles: vehicles,
      cruisers: cruisers,
      horses: horsesList,
      poolZones: poolZones,
      dynamicNodes: dynamicNodes,
      update: update,
      dispose: function () {
        if (hospitalMod && typeof hospitalMod.dispose === 'function') hospitalMod.dispose();
        if (bakeryMod && typeof bakeryMod.dispose === 'function') bakeryMod.dispose();
        if (hotelMod && typeof hotelMod.dispose === 'function') hotelMod.dispose();
        if (expansionMod && typeof expansionMod.dispose === 'function') expansionMod.dispose();
      },
    };
  }

  window.CrownTown = {
    build: buildRivieraTown,
  };
})();
