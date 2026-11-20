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
    const roadMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xb7ab97, roughness: 0.85 }));
    const driveMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0x99958d, roughness: 0.88 }));
    const tileFloorMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xd9dce0, roughness: 0.55 }));
    const terracottaMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xa64d3c, roughness: 0.72 }));
    const pastelPinkWall = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xf7e1e5, roughness: 0.72 }));
    const mintWallMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xe2ede6, roughness: 0.72 }));
    const skyWallMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xe3ebf2, roughness: 0.72 }));
    const clubDarkMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0x1d1624, roughness: 0.48, metalness: 0.25 }));
    const poolDeckMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xf0e7d8, roughness: 0.65 }));

    // -----------------------------------------------------------
    // 1. EXPANDED TOWN AVENUE GRID (Zero overlaps, drives cleanly!)
    // -----------------------------------------------------------
    [
      { x: -102, z: -2.0, w: 128, d: 5.4 },
      { x: 102, z: -2.0, w: 128, d: 5.4 },
      { x: -102, z: 32.2, w: 128, d: 4.2 },
      { x: 102, z: 32.2, w: 128, d: 4.2 },
      { x: -64.5, z: 22.0, w: 4.4, d: 54 },
      { x: -91.5, z: 22.0, w: 4.4, d: 54 },
      { x: -118.0, z: 22.0, w: 4.6, d: 54 },
      { x: -146.0, z: 22.0, w: 4.4, d: 54 },
      { x: 64.5, z: 22.0, w: 4.4, d: 54 },
      { x: 96.5, z: 22.0, w: 4.4, d: 54 },
      { x: 115.0, z: 22.0, w: 4.4, d: 54 },
      { x: 144.0, z: 22.0, w: 4.4, d: 54 },
    ].forEach(function (rd) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(rd.w, rd.d), roadMat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(rd.x, 0.016, rd.z);
      townGroup.add(m);
    });

    function recordDispatchGossip(ctxAct, headline, cloutDelta, scandalDelta) {
      const g = ctxAct.game || window.CrownGame;
      if (!g) return;
      if (!g.reputation) g.reputation = { clout: 50, scandal: 0, rank: 'Crown Heiress' };
      g.reputation.clout = Math.max(0, Math.min(100, (g.reputation.clout || 50) + (cloutDelta || 0)));
      g.reputation.scandal = Math.max(0, Math.min(100, (g.reputation.scandal || 0) + (scandalDelta || 0)));
      if (!Array.isArray(g.gossipLog)) g.gossipLog = [];
      if (headline) {
        g.gossipLog.unshift({ day: (g.world && g.world.day) || 1, text: 'Crown Dispatch: ' + headline });
        if (g.gossipLog.length > 24) g.gossipLog.length = 24;
      }
    }

    function addEnterableLot(cfg) {
      const w = cfg.w;
      const d = cfg.d;
      const wallH = cfg.wallH || 3.6;
      const cx = cfg.x;
      const cz = cfg.z;
      const baseFloorY = 0.1;

      const lotPad = new THREE.Mesh(new THREE.BoxGeometry(w + 2.2, 0.06, d + 2.2), poolDeckMat);
      lotPad.position.set(cx, 0.03, cz);
      townGroup.add(lotPad);

      const floor = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, d), cfg.floorMat || tileFloorMat);
      floor.position.set(cx, 0.05, cz);
      townGroup.add(floor);

      const wallMat = cfg.wallMat || ivoryMat;
      const doorW = cfg.doorW || 2.6;
      const doorFace = cfg.doorFace || 'S'; // N, S, E, W
      addWallX(townGroup, sharedColliders, 0, wallH, cz - d * 0.5, cx - w * 0.5, cx + w * 0.5, doorFace === 'N' ? cx : null, doorW, 0.28, wallMat);
      addWallX(townGroup, sharedColliders, 0, wallH, cz + d * 0.5, cx - w * 0.5, cx + w * 0.5, doorFace === 'S' ? cx : null, doorW, 0.28, wallMat);
      addWallZ(townGroup, sharedColliders, 0, wallH, cx - w * 0.5, cz - d * 0.5, cz + d * 0.5, doorFace === 'W' ? cz : null, doorW, 0.28, wallMat);
      addWallZ(townGroup, sharedColliders, 0, wallH, cx + w * 0.5, cz - d * 0.5, cz + d * 0.5, doorFace === 'E' ? cz : null, doorW, 0.28, wallMat);

      // Cutaway Roof Group
      const roofGrp = new THREE.Group();
      if (cfg.flatRoof) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.45, d + 0.6), cfg.roofMat || slateRoofMat);
        slab.position.set(cx, wallH + 0.22, cz);
        roofGrp.add(slab);
      } else {
        const rCone = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.72, 2.5, 4), cfg.roofMat || terracottaMat);
        rCone.rotation.y = Math.PI * 0.25;
        rCone.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d));
        rCone.position.set(cx, wallH + 1.25, cz);
        roofGrp.add(rCone);
      }
      townGroup.add(roofGrp);

      // Crisp Plot Plaque outside door
      const sign = kit.buildPlotSign(cfg.signTitle || cfg.title, cfg.signColor);
      if (doorFace === 'E') {
        sign.position.set(cx + w * 0.5 + 1.1, 0, cz - doorW * 0.72);
        sign.rotation.y = Math.PI * 0.5;
      } else if (doorFace === 'W') {
        sign.position.set(cx - w * 0.5 - 1.1, 0, cz - doorW * 0.72);
        sign.rotation.y = -Math.PI * 0.5;
      } else if (doorFace === 'N') {
        sign.position.set(cx + doorW * 0.75, 0, cz - d * 0.5 - 1.1);
        sign.rotation.y = Math.PI;
      } else {
        sign.position.set(cx + doorW * 0.75, 0, cz + d * 0.5 + 1.1);
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

      const entrySpotId = cfg.id + '_plot_visit';
      const teleX = doorFace === 'E' ? cx + 1.5 : cx;
      const teleZ = doorFace === 'S' ? cz + 1.4 : cz;
      const teleYaw = doorFace === 'E' ? -Math.PI * 0.5 : Math.PI;
      const dirEntry = {
        id: entrySpotId,
        title: cfg.title,
        floor: 0,
        category: cfg.dirCategory || 'town',
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
        ],
      };
      registerSpot(dirEntry);
      townDirectory.push(dirEntry);

      return { cx: cx, cz: cz, y: baseFloorY, w: w, d: d, roofGrp: roofGrp };
    }

    // -----------------------------------------------------------
    // 2. 4 SIMS-4 MIDDLE-CLASS HOUSES WITH CARS PARKED OUTSIDE
    //    (Modeled directly on the open-plan suburban floorplan!)
    // -----------------------------------------------------------
    const middleHouses = [
      { id: 'mid_house_1', title: 'Elmwood Middle-Class House', x: -76, z: 10.5, carHex: '#e2d7c5', isSuv: false, wall: skyWallMat, tone: 'sapphire' },
      { id: 'mid_house_2', title: 'Lavender Gables Home', x: -76, z: 24.5, carHex: '#d998a8', isSuv: false, wall: pastelPinkWall, tone: 'rose' },
      { id: 'mid_house_3', title: 'Oakridge Family Villa', x: -104, z: 10.5, carHex: '#4f6d9a', isSuv: false, wall: mintWallMat, tone: 'emerald' },
      { id: 'mid_house_4', title: 'Coastal Crest House', x: -104, z: 24.5, carHex: '#3c5a4f', isSuv: true, wall: cottageWallMat, tone: 'champagne' },
    ];

    middleHouses.forEach(function (mh, idx) {
      const lot = addEnterableLot({
        id: mh.id,
        title: mh.title,
        signTitle: mh.title,
        signColor: '#2c3d4f',
        subtitle: 'Open-plan suburban home + parked car outside',
        dirCategory: 'cottages',
        x: mh.x,
        z: mh.z,
        w: 11.4,
        d: 9.2,
        wallH: 3.4,
        doorFace: 'E',
        doorW: 2.4,
        floorMat: tileFloorMat,
        wallMat: mh.wall,
        roofMat: terracottaMat,
      });

      const cx = lot.cx;
      const cz = lot.cz;
      const y = lot.y;

      // Paved Driveway + Sculpted Car Parked Outside (+X East side of house facing street)
      const driveX = cx + 8.4;
      const driveZ = cz + 2.1;
      const driveway = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 3.6), driveMat);
      driveway.rotation.x = -Math.PI / 2;
      driveway.position.set(driveX, 0.02, driveZ);
      townGroup.add(driveway);

      const car = kit.buildParkedCar(mh.carHex, mh.isSuv, mh.id + '_car');
      car.position.set(driveX, 0.02, driveZ);
      car.rotation.y = Math.PI * 0.5;
      townGroup.add(car);
      tagInteractable(car, mh.id + '_car');
      addBox(sharedColliders, driveX, driveZ, 3.9, 1.85);
      registerSpot({
        id: mh.id + '_car',
        title: mh.title + ' Parked Car',
        floor: 0,
        category: 'town',
        x: driveX, y: 0.02, z: driveZ,
        radius: 3.6,
        actions: [
          {
            id: mh.id + '_car_inspect',
            label: 'Admire Parked Sedan & Sound Horn',
            hint: '+8 Fun & Royal Slumming Gossip Check',
            instant: true,
            onInstant: function (actCtx) {
              if (window.CrownAudio) window.CrownAudio.playSelect();
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 8 });
              recordDispatchGossip(actCtx, 'Princess spotted beside a middle-class car on Cypress Street!', 1, 2);
              actCtx.toast('Beep beep! Sleek family sedan parked in the driveway.');
            },
          },
        ],
      });

      // --- Open-Plan Sims 4 Interior (matching screenshot layout!) ---
      // Kitchen Back-North Counters + Modern Breakfast Island with 3 Stools
      const kCounter = kit.buildKitchenCounter(mh.id + '_stove', true);
      kCounter.position.set(cx + 0.2, y, cz - 3.9);
      townGroup.add(kCounter);
      tagInteractable(kCounter, mh.id + '_stove');
      addBox(sharedColliders, cx + 0.2, cz - 3.9, 3.2, 0.9);
      registerSpot({
        id: mh.id + '_stove',
        title: mh.title + ' Kitchen',
        floor: 0,
        category: 'cottages',
        x: cx + 0.2, y: y, z: cz - 3.9,
        radius: 3.0,
        actions: [
          {
            id: mh.id + '_cook',
            label: 'Cook Home-Style Brunch at Island',
            hint: '+16 Food/s & +7 Fun/s',
            pose: 'cook',
            anchor: { x: cx + 0.2, y: y, z: cz - 3.0, yaw: Math.PI, floorY: y, exitX: cx + 0.2, exitZ: cz - 2.9, exitYaw: Math.PI },
            rates: { hunger: 16, fun: 7 },
            statusText: 'Cooking comfortably in ' + mh.title + ' kitchen...',
          },
        ],
      });

      const island = kit.buildModernBreakfastIsland();
      island.position.set(cx + 0.3, y, cz - 1.9);
      townGroup.add(island);
      addBox(sharedColliders, cx + 0.3, cz - 1.9, 2.7, 1.3);

      // Dining Table & Chairs (South-East near window)
      const diningTbl = kit.buildTableSet(mh.id + '_dining', true);
      diningTbl.position.set(cx + 2.8, y, cz + 2.2);
      townGroup.add(diningTbl);
      tagInteractable(diningTbl, mh.id + '_dining');
      addBox(sharedColliders, cx + 2.8, cz + 2.2, 1.6, 1.1);
      registerSpot({
        id: mh.id + '_dining',
        title: mh.title + ' Dining Table',
        floor: 0,
        category: 'cottages',
        x: cx + 2.8, y: y, z: cz + 2.2,
        radius: 3.0,
        actions: [
          {
            id: mh.id + '_eat',
            label: 'Dine with Tea at Suburban Table',
            hint: '+16 Food/s & +6 Energy/s',
            pose: 'eat',
            anchor: { x: cx + 1.78, y: y, z: cz + 2.2, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: y, exitX: cx + 1.2, exitZ: cz + 2.2, exitYaw: 0 },
            rates: { hunger: 16, energy: 6, fun: 5 },
            statusText: 'Enjoying warm tea at ' + mh.title + '...',
          },
        ],
      });

      // Open Living Area (2 Cozy Sofas + Rug + Wall TV Console)
      placeSofa(townGroup, sharedColliders, {
        id: mh.id + '_sofa', title: mh.title + ' Living Room Sofa', floor: 0, cottage: true,
        x: cx - 0.5, y: y, z: cz + 2.8, yaw: Math.PI, tone: mh.tone, w: 2.3,
      });
      const tvUnit = kit.buildWallTVConsole(true);
      tvUnit.position.set(cx - 0.5, y, cz + 0.4);
      townGroup.add(tvUnit);
      addBox(sharedColliders, cx - 0.5, cz + 0.4, 1.9, 0.5);

      // Master Bedroom (West Wing of House) + Bath (North-West Corner)
      placeBed(townGroup, sharedColliders, {
        id: mh.id + '_bed', title: mh.title + ' Master Bed', floor: 0, cottage: true,
        x: cx - 4.0, y: y, z: cz + 2.4, yaw: Math.PI * 0.5, tone: mh.tone, w: 1.75, d: 2.35, noSideTable: true,
      });
      placeToilet(townGroup, sharedColliders, {
        id: mh.id + '_toilet', title: mh.title + ' Bathroom Toilet', floor: 0, rustic: true,
        x: cx - 4.8, y: y, z: cz - 3.6, yaw: Math.PI * 0.5,
      });
      placeVanitySink(townGroup, sharedColliders, {
        id: mh.id + '_sink', title: mh.title + ' Bathroom Vanity', floor: 0, rustic: true,
        x: cx - 3.0, y: y, z: cz - 3.8, yaw: 0,
      });
      // Bookshelf / Study Desk
      const shelf = kit.buildBookshelf(mh.id + '_shelf', true);
      shelf.position.set(cx + 4.4, y, cz - 3.8);
      townGroup.add(shelf);
      addBox(sharedColliders, cx + 4.4, cz - 3.8, 1.6, 0.5);
    });

    // -----------------------------------------------------------
    // 3. HORSE PLACE — ROYAL EQUESTRIAN STABLES & PADDOCK (x = -132, z = 13)
    // -----------------------------------------------------------
    const stX = -133;
    const stZ = 14;
    const paddockMat = kit.keepMat(new THREE.MeshStandardMaterial({ color: 0xd9bf8d, roughness: 0.92 }));
    const paddockGround = new THREE.Mesh(new THREE.PlaneGeometry(22.0, 24.0), paddockMat);
    paddockGround.rotation.x = -Math.PI / 2;
    paddockGround.position.set(stX, 0.025, stZ);
    townGroup.add(paddockGround);

    // Timber Barn Roof + Open Front Stalls (West edge of Paddock)
    const barnWall = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.6, 15.0), terracottaMat);
    barnWall.position.set(stX - 7.8, 1.8, stZ - 1.5);
    townGroup.add(barnWall);
    addBox(sharedColliders, stX - 7.8, stZ - 1.5, 4.8, 15.0);
    const barnRoof = new THREE.Mesh(new THREE.ConeGeometry(10.8, 2.8, 4), kit.palette.oak);
    barnRoof.rotation.y = Math.PI * 0.25;
    barnRoof.scale.set(0.55, 1, 1.25);
    barnRoof.position.set(stX - 7.2, 4.8, stZ - 1.5);
    townGroup.add(barnRoof);

    // Open Wooden Corral Fence with wide 3.2m entrances
    [
      [stX, stZ - 12.0, 22.0, 0.28],
      [stX - 6.0, stZ + 12.0, 10.0, 0.28],
      [stX + 6.0, stZ + 12.0, 10.0, 0.28],
      [stX + 11.0, stZ - 6.0, 0.28, 12.0],
      [stX + 11.0, stZ + 7.5, 0.28, 9.0],
    ].forEach(function (fn) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(fn[2], 1.15, fn[3]), kit.palette.oak);
      bar.position.set(fn[0], 0.58, fn[1]);
      townGroup.add(bar);
      addBox(sharedColliders, fn[0], fn[1], fn[2], fn[3]);
    });

    const stableSign = kit.buildPlotSign('Royal Equestrian Stables & Horses', '#4b3022');
    stableSign.position.set(stX + 11.8, 0, stZ + 2.8);
    stableSign.rotation.y = Math.PI * 0.5;
    townGroup.add(stableSign);

    townZones.push({ minX: stX - 11, maxX: stX + 11, minZ: stZ - 12, maxZ: stZ + 12, label: 'Royal Equestrian Stables' });
    const horses = [
      { id: 'horse_1', title: 'Royal Chestnut Stallion (Vesper)', x: stX + 1.5, z: stZ - 5.2, yaw: 0.4, coat: '#7e4327', mane: '#1f140f' },
      { id: 'horse_2', title: 'White Andalusian Mare (Celeste)', x: stX + 4.5, z: stZ + 2.2, yaw: -0.7, coat: '#f4efe6', mane: '#d9d0c1' },
      { id: 'horse_3', title: 'Midnight Friesian Steed (Onyx)', x: stX - 2.0, z: stZ + 4.5, yaw: 1.2, coat: '#242228', mane: '#121014' },
      { id: 'horse_4', title: 'Golden Palomino Pony (Aurelia)', x: stX - 1.8, z: stZ - 7.5, yaw: -0.3, coat: '#c9934c', mane: '#faf0d6' },
    ];
    horses.forEach(function (hr, hi) {
      const hMesh = kit.buildHorse(hr.coat, hr.mane, hr.id);
      hMesh.position.set(hr.x, 0.03, hr.z);
      hMesh.rotation.y = hr.yaw;
      townGroup.add(hMesh);
      tagInteractable(hMesh, hr.id);
      addBox(sharedColliders, hr.x, hr.z, 1.1, 1.9);
      const stand = localToWorld(hr.x, hr.z, hr.yaw, 0.95, 0.2);
      registerSpot({
        id: hr.id,
        title: hr.title,
        floor: 0,
        category: 'town',
        shortcut: hi === 0,
        x: hr.x, y: 0.03, z: hr.z,
        radius: 3.8,
        actions: [
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
            label: 'Feed Golden Carrots & Canter Paddock',
            hint: '+28 Fun & Crown Dispatch Equestrian Clout',
            instant: true,
            onInstant: function (actCtx) {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 28, composure: 14 });
              recordDispatchGossip(actCtx, 'Princess spotted riding ' + hr.title + ' at the Royal Stables!', 4, 0);
              actCtx.toast('Graceful equestrian ride on ' + hr.title + '! (+28 Fun, +4 Clout)');
            },
          },
        ],
      });
      if (hi === 0) townDirectory.push(ctx.spots ? ctx.spots[hr.id] : { id: hr.id, title: 'Royal Equestrian Stables (4 Horses)', category: 'town', x: hr.x, y: 0.03, z: hr.z, actions: [] });
    });

    // -----------------------------------------------------------
    // 4. BAKERY — MAISON BRIOCHE ROYAL BAKERY (x = -76, z = 39)
    // -----------------------------------------------------------
    const bakery = addEnterableLot({
      id: 'plot_bakery',
      title: 'Maison Brioche Bakery',
      signTitle: 'Bakery Maison Brioche',
      signColor: '#7b3e4c',
      subtitle: 'Croissants, macarons & royal pastry counter',
      dirCategory: 'town',
      x: -76, z: 39, w: 11.2, d: 8.6,
      doorFace: 'S',
      floorMat: marbleMat, wallMat: pastelPinkWall, roofMat: terracottaMat,
    });
    const bCounter = kit.buildKitchenCounter('bakery_counter', false);
    bCounter.position.set(bakery.cx - 1.2, bakery.y, bakery.cz - 2.6);
    townGroup.add(bCounter);
    tagInteractable(bCounter, 'bakery_counter');
    addBox(sharedColliders, bakery.cx - 1.2, bakery.cz - 2.6, 3.2, 0.9);
    registerSpot({
      id: 'bakery_counter',
      title: 'Maison Brioche Pastry Counter',
      floor: 0,
      category: 'town',
      x: bakery.cx - 1.2, y: bakery.y, z: bakery.cz - 2.6,
      radius: 3.4,
      actions: [
        {
          id: 'buy_croissant',
          label: 'Buy Fresh Croissant & Rose Latte (₡18)',
          hint: '+35 Food, +14 Fun',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 18) return actCtx.toast('Need ₡18 Crowns.');
            actCtx.game.money -= 18;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 35, fun: 14 });
            actCtx.toast('Flaky butter croissant & latte enjoyed! (+35 Food)');
          },
        },
        {
          id: 'bake_bakery',
          label: 'Bake Royal Brioche Loaves',
          hint: '+16 Food/s & +9 Fun/s',
          pose: 'cook',
          anchor: { x: bakery.cx - 1.2, y: bakery.y, z: bakery.cz - 1.7, yaw: Math.PI, floorY: bakery.y, exitX: bakery.cx - 1.2, exitZ: bakery.cz - 1.6, exitYaw: Math.PI },
          rates: { hunger: 16, fun: 9 },
          statusText: 'Glazing fresh royal brioche in the Bakery...',
        },
      ],
    });
    const bTable = kit.buildTableSet('bakery_bistro', false);
    bTable.position.set(bakery.cx + 2.4, bakery.y, bakery.cz + 1.0);
    townGroup.add(bTable);
    tagInteractable(bTable, 'bakery_bistro');
    addBox(sharedColliders, bakery.cx + 2.4, bakery.cz + 1.0, 1.6, 1.1);
    registerSpot({
      id: 'bakery_bistro', title: 'Bakery Bistro Table', floor: 0, category: 'town',
      x: bakery.cx + 2.4, y: bakery.y, z: bakery.cz + 1.0, radius: 3.0,
      actions: [{
        id: 'eat_bakery_bistro', label: 'Sit & Eat Strawberry Tart', hint: '+18 Food/s & +8 Fun/s', pose: 'eat',
        anchor: { x: bakery.cx + 1.38, y: bakery.y, z: bakery.cz + 1.0, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: bakery.y, exitX: bakery.cx + 0.6, exitZ: bakery.cz + 1.0, exitYaw: 0 },
        rates: { hunger: 18, fun: 8, composure: 5 }, statusText: 'Sipping espresso at Maison Brioche Bakery...',
      }],
    });

    // -----------------------------------------------------------
    // 5. SUPERMARKET — MARCHÉ ROYALE SUPERMARKET (x = -104, z = 39)
    // -----------------------------------------------------------
    const market = addEnterableLot({
      id: 'plot_market',
      title: 'Marché Royale Supermarket',
      signTitle: 'Supermarket Marché Royale',
      signColor: '#2d5c46',
      subtitle: 'Fresh produce aisles, gourmet goods & checkout',
      dirCategory: 'town',
      x: -104, z: 39, w: 13.0, d: 9.0,
      doorFace: 'S',
      flatRoof: true,
      floorMat: tileFloorMat, wallMat: mintWallMat, roofMat: slateRoofMat,
    });
    [-3.4, 0, 3.4].forEach(function (ax, ai) {
      const shelfA = kit.buildBookshelf('mkt_aisle_' + ai, true);
      shelfA.scale.set(1.2, 0.88, 1.4);
      shelfA.position.set(market.cx + ax, market.y, market.cz - 1.4);
      townGroup.add(shelfA);
      addBox(sharedColliders, market.cx + ax, market.cz - 1.4, 2.0, 0.7);
    });
    const mktCheckout = kit.buildKitchenIsland();
    mktCheckout.position.set(market.cx - 3.6, market.y, market.cz + 2.1);
    townGroup.add(mktCheckout);
    tagInteractable(mktCheckout, 'market_checkout');
    addBox(sharedColliders, market.cx - 3.6, market.cz + 2.1, 2.4, 1.1);
    registerSpot({
      id: 'market_checkout',
      title: 'Supermarket Produce & Checkout',
      floor: 0,
      category: 'town',
      x: market.cx - 3.6, y: market.y, z: market.cz + 2.1,
      radius: 4.0,
      actions: [
        {
          id: 'buy_groceries',
          label: 'Buy Gourmet Groceries & Champagne (₡45)',
          hint: '+55 Food & +10 Fun',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 45) return actCtx.toast('Need ₡45 Crowns.');
            actCtx.game.money -= 45;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 55, fun: 10 });
            recordDispatchGossip(actCtx, 'A royal princess spotted wheeling her own gourmet cart at Marché Royale!', 2, 1);
            actCtx.toast('Gourmet hamper purchased! (+55 Food)');
          },
        },
      ],
    });

    // -----------------------------------------------------------
    // 6. PIZZA PLACE — PALAZZO NAPOLI PIZZERIA (x = -132, z = 39)
    // -----------------------------------------------------------
    const pizza = addEnterableLot({
      id: 'plot_pizza',
      title: 'Palazzo Napoli Pizza Place',
      signTitle: 'Pizza Place Napoli',
      signColor: '#8d2f23',
      subtitle: 'Wood-fired oven, hot slices & checkered booths',
      dirCategory: 'town',
      x: -132, z: 39, w: 11.4, d: 8.6,
      doorFace: 'S',
      floorMat: tileFloorMat, wallMat: cottageWallMat, roofMat: terracottaMat,
    });
    const pizzaOven = kit.buildFireplace('pizza_oven', true);
    pizzaOven.position.set(pizza.cx, pizza.y, pizza.cz - 3.4);
    townGroup.add(pizzaOven);
    tagInteractable(pizzaOven, 'pizza_oven');
    addBox(sharedColliders, pizza.cx, pizza.cz - 3.4, 2.5, 1.2);
    const pTable1 = kit.buildTableSet('pizza_table', true);
    pTable1.position.set(pizza.cx - 2.6, pizza.y, pizza.cz + 0.8);
    townGroup.add(pTable1);
    tagInteractable(pTable1, 'pizza_table');
    addBox(sharedColliders, pizza.cx - 2.6, pizza.cz + 0.8, 1.6, 1.1);
    registerSpot({
      id: 'pizza_oven',
      title: 'Wood-Fired Pizza Oven & Counter',
      floor: 0,
      category: 'town',
      x: pizza.cx, y: pizza.y, z: pizza.cz - 3.4,
      radius: 3.6,
      actions: [
        {
          id: 'order_pizza',
          label: 'Order Wood-Fired Truffle Pizza (₡24)',
          hint: '+48 Food & +14 Fun',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 24) return actCtx.toast('Need ₡24 Crowns.');
            actCtx.game.money -= 24;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 48, fun: 14 });
            actCtx.toast('Piping hot brick-oven Margherita served! (+48 Food)');
          },
        },
        {
          id: 'eat_pizza_sit',
          label: 'Sit & Eat Fresh Slice at Pizzeria',
          hint: '+20 Food/s & +10 Fun/s',
          pose: 'eat',
          anchor: { x: pizza.cx - 3.62, y: pizza.y, z: pizza.cz + 0.8, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: pizza.y, exitX: pizza.cx - 1.5, exitZ: pizza.cz + 0.8, exitYaw: 0 },
          rates: { hunger: 20, fun: 10 },
          statusText: 'Feasting on wood-fired pizza at Palazzo Napoli...',
        },
      ],
    });

    // -----------------------------------------------------------
    // 7. SEAMSTRESS PLACE — MAISON DE COUTURE (x = +78, z = 39)
    // -----------------------------------------------------------
    const seam = addEnterableLot({
      id: 'plot_seamstress',
      title: 'Maison de Couture Seamstress',
      signTitle: 'Seamstress Couture',
      signColor: '#7f3c5c',
      subtitle: 'Silk gowns, fitting mirrors & royal dressmaker',
      dirCategory: 'town',
      x: 78, z: 39, w: 11.4, d: 8.6,
      doorFace: 'S',
      floorMat: parquetMat, wallMat: pastelPinkWall, roofMat: slateRoofMat,
    });
    const seamVanity = kit.buildDressingVanity('seamstress_fitting', 'rose');
    seamVanity.position.set(seam.cx, seam.y, seam.cz - 3.3);
    townGroup.add(seamVanity);
    tagInteractable(seamVanity, 'seamstress_fitting');
    addBox(sharedColliders, seam.cx, seam.cz - 3.3, 1.4, 0.8);
    // 3 Gown Display Mannequins
    [-3.6, -2.0, 3.4].forEach(function (mx, mi) {
      const gCol = [kit.palette.fabricColors.rose, kit.palette.fabricColors.sapphire, kit.palette.fabricColors.gold || kit.palette.gold][mi];
      kit.addMesh(townGroup, kit.g.cyl1, kit.palette.gold, 0.1, 0.9, 0.1, seam.cx + mx, seam.y + 0.45, seam.cz - 2.4);
      kit.addMesh(townGroup, kit.g.cone1, gCol, 0.72, 1.15, 0.72, seam.cx + mx, seam.y + 1.05, seam.cz - 2.4);
      addCircle(sharedColliders, seam.cx + mx, seam.cz - 2.4, 0.42);
    });
    const seamDesk = kit.buildWritingDesk('seamstress_table', 'rose');
    seamDesk.position.set(seam.cx + 2.6, seam.y, seam.cz + 0.6);
    seamDesk.rotation.y = -Math.PI * 0.5;
    townGroup.add(seamDesk);
    registerSpot({
      id: 'seamstress_fitting',
      title: 'Seamstress Fitting Mirror & Atelier',
      floor: 0,
      category: 'town',
      x: seam.cx, y: seam.y, z: seam.cz - 3.3,
      radius: 3.6,
      actions: [
        {
          id: 'open_cas_seamstress',
          label: 'Commission Bespoke Gown (Open Wardrobe / CAS)',
          hint: 'Customize outfit, tiara & accessories',
          instant: true,
          onInstant: function () {
            if (window.CrownSave) window.CrownSave.save(true);
            window.CrownMenu.go('creator');
          },
        },
        {
          id: 'fit_couture',
          label: 'Fit Silk Dress & Adjust Hem (-₡110)',
          hint: '+28 Poise & +4 Crown Dispatch Clout',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 110) return actCtx.toast('Need ₡110 Crowns.');
            actCtx.game.money -= 110;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 28, fun: 16 });
            recordDispatchGossip(actCtx, 'Crown Dispatch: A stunning custom gown just left Maison de Couture!', 4, 0);
            actCtx.toast('Tailored couture perfection! (+28 Poise, +4 Clout)');
          },
        },
      ],
    });

    // -----------------------------------------------------------
    // 8. SHOPPING PLACE — GALERIE ROYALE LUXURY ARCADE (x = +105, z = 39)
    // -----------------------------------------------------------
    const shop = addEnterableLot({
      id: 'plot_shopping',
      title: 'Galerie Royale Shopping Place',
      signTitle: 'Shopping Place Galerie',
      signColor: '#4a3520',
      subtitle: 'Luxury boutiques, handbags, perfumes & jewels',
      dirCategory: 'town',
      x: 105, z: 39, w: 13.2, d: 9.0,
      doorFace: 'S',
      flatRoof: true,
      floorMat: marbleMat, wallMat: ivoryMat, roofMat: slateRoofMat,
    });
    [-3.6, 0, 3.6].forEach(function (sx, si) {
      const vitrine = new THREE.Group();
      vitrine.position.set(shop.cx + sx, shop.y, shop.cz - 2.2);
      kit.addMesh(vitrine, kit.g.cushion, kit.palette.ivory, 1.2, 0.95, 1.0, 0, 0.48, 0);
      kit.addMesh(vitrine, kit.g.box1, kit.palette.crystal, 1.05, 0.65, 0.85, 0, 1.28, 0);
      kit.addMesh(vitrine, kit.g.sphere1, [kit.palette.gold, kit.palette.fabricColors.rose, kit.palette.fabricColors.sapphire][si], 0.34, 0.28, 0.26, 0, 1.15, 0);
      townGroup.add(vitrine);
      addBox(sharedColliders, shop.cx + sx, shop.cz - 2.2, 1.3, 1.1);
    });
    placeSofa(townGroup, sharedColliders, {
      id: 'shop_lounge_sofa', title: 'Boutique Velvet Settee', floor: 0,
      x: shop.cx, y: shop.y, z: shop.cz + 0.6, yaw: 0, tone: 'champagne', w: 2.4,
    });
    const cashWrap = kit.buildKitchenIsland();
    cashWrap.position.set(shop.cx + 3.6, shop.y, shop.cz + 1.8);
    townGroup.add(cashWrap);
    tagInteractable(cashWrap, 'shop_cashier');
    addBox(sharedColliders, shop.cx + 3.6, shop.cz + 1.8, 2.4, 1.1);
    registerSpot({
      id: 'shop_cashier',
      title: 'Galerie Royale Luxury Boutique',
      floor: 0,
      category: 'town',
      x: shop.cx + 3.6, y: shop.y, z: shop.cz + 1.8,
      radius: 4.0,
      actions: [
        {
          id: 'buy_luxury_bag',
          label: 'Buy Designer Handbag & Perfume Set (₡90)',
          hint: '+30 Fun, +18 Poise & +5 Clout',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 90) return actCtx.toast('Need ₡90 Crowns.');
            actCtx.game.money -= 90;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 30, composure: 18 });
            recordDispatchGossip(actCtx, 'Royal shopping spree at Galerie Royale turns every head!', 5, 0);
            actCtx.toast('Luxury shopping bags secured! (+30 Fun, +5 Clout)');
          },
        },
      ],
    });

    // -----------------------------------------------------------
    // 9. CLUB (18+) — CLUB COURONNE PRIVÉ NIGHTCLUB (x = +132, z = 39)
    // -----------------------------------------------------------
    const club = addEnterableLot({
      id: 'plot_club',
      title: 'Club Couronne Privé (18+)',
      signTitle: 'Velvet Crown Nightclub',
      signColor: '#28112e',
      subtitle: 'Illuminated dancefloor, DJ booth, cocktail bar & VIP gossip',
      dirCategory: 'town',
      x: 132, z: 39, w: 13.0, d: 9.4,
      wallH: 4.0,
      doorFace: 'S',
      flatRoof: true,
      floorMat: clubDarkMat, wallMat: clubDarkMat, roofMat: clubDarkMat,
    });
    // Lit Gold-Magenta Dancefloor Grid
    const danceFloorMat = kit.keepMat(new THREE.MeshBasicMaterial({ color: 0xe388b8 }));
    const danceFloor = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 4.8), danceFloorMat);
    danceFloor.rotation.x = -Math.PI / 2;
    danceFloor.position.set(club.cx - 1.2, club.y + 0.03, club.cz - 0.2);
    townGroup.add(danceFloor);
    tagInteractable(danceFloor, 'club_dancefloor');
    const clubLight = new THREE.PointLight(0xff77c8, 1.8, 22, 1.4);
    clubLight.position.set(club.cx, 3.6, club.cz);
    townGroup.add(clubLight);

    // DJ Booth + Speakers
    const djBooth = new THREE.Group();
    djBooth.position.set(club.cx - 1.2, club.y, club.cz - 3.6);
    kit.addMesh(djBooth, kit.g.cushion, kit.palette.gold, 3.0, 1.15, 0.85, 0, 0.58, 0);
    kit.addMesh(djBooth, kit.g.cyl1, kit.palette.iron, 0.48, 0.08, 0.48, -0.55, 1.18, 0);
    kit.addMesh(djBooth, kit.g.cyl1, kit.palette.iron, 0.48, 0.08, 0.48, 0.55, 1.18, 0);
    townGroup.add(djBooth);
    addBox(sharedColliders, club.cx - 1.2, club.cz - 3.6, 3.0, 0.9);

    // Illuminated Club Bar
    const clubBar = kit.buildModernBreakfastIsland();
    clubBar.position.set(club.cx + 4.2, club.y, club.cz - 1.8);
    clubBar.rotation.y = -Math.PI * 0.5;
    townGroup.add(clubBar);
    addBox(sharedColliders, club.cx + 4.2, club.cz - 1.8, 1.2, 2.7);
    placeSofa(townGroup, sharedColliders, {
      id: 'club_vip_booth', title: 'Club VIP Velvet Booth', floor: 0,
      x: club.cx + 3.8, y: club.y, z: club.cz + 2.3, yaw: Math.PI * 0.5, tone: 'crimson', w: 2.3,
    });
    registerSpot({
      id: 'club_dancefloor',
      title: 'Velvet Crown Club Dancefloor & Bar',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: club.cx - 1.2, y: club.y, z: club.cz - 0.2,
      radius: 4.8,
      actions: [
        {
          id: 'dance_club',
          label: 'Dance Under Velvet Club Lights',
          hint: '+20 Fun/s & Court Scandal Thrill',
          pose: 'club_dance',
          anchor: { x: club.cx - 1.2, y: club.y, z: club.cz - 0.2, yaw: 0, floorY: club.y, exitX: club.cx - 1.2, exitZ: club.cz + 2.2, exitYaw: 0 },
          rates: { fun: 20, energy: -1 },
          statusText: 'Dancing under the Velvet Crown disco lights...',
        },
        {
          id: 'club_cocktail',
          label: 'Order Gold Champagne Cocktail (₡30)',
          hint: '+26 Fun & Crown Dispatch Scandal',
          instant: true,
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

    // -----------------------------------------------------------
    // 10. SWIMMING POOL — VILLA AZURE SWIMMING POOL & LIDO (x = +82, z = 14)
    // -----------------------------------------------------------
    const poolX = 82;
    const poolZ = 14;
    const poolDeck = new THREE.Mesh(new THREE.BoxGeometry(20.0, 0.24, 18.0), poolDeckMat);
    poolDeck.position.set(poolX, 0.12, poolZ);
    townGroup.add(poolDeck);
    walkableFloors.push({ minX: poolX - 10, maxX: poolX + 10, minZ: poolZ - 9, maxZ: poolZ + 9, y: 0.24 });

    const poolBasin = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.18, 7.6), waterMat);
    poolBasin.position.set(poolX, 0.18, poolZ);
    townGroup.add(poolBasin);
    const poolRim = new THREE.Mesh(new THREE.BoxGeometry(12.1, 0.08, 8.3), whiteMarbleMat);
    poolRim.position.set(poolX, 0.21, poolZ);
    townGroup.add(poolRim);
    // Keep water on top of rim center cleanly (+0.025)
    poolBasin.position.y = 0.23;
    tagInteractable(poolBasin, 'azure_pool_swim');
    poolZones.push({ minX: poolX - 5.5, maxX: poolX + 5.5, minZ: poolZ - 3.6, maxZ: poolZ + 3.6, y: 0.24 });
    townZones.push({ minX: poolX - 10, maxX: poolX + 10, minZ: poolZ - 9, maxZ: poolZ + 9, label: 'Villa Azure Swimming Pool' });

    const poolSign = kit.buildPlotSign('Villa Azure Swimming Pool', '#1c637a');
    poolSign.position.set(poolX - 10.6, 0, poolZ + 4.8);
    poolSign.rotation.y = -Math.PI * 0.5;
    townGroup.add(poolSign);

    [-4.0, 0, 4.0].forEach(function (lx, li) {
      const lounger = kit.buildPoolLounger(['champagne', 'rose', 'sapphire'][li], 'pool_lounger_' + li);
      lounger.position.set(poolX + lx, 0.24, poolZ - 5.8);
      townGroup.add(lounger);
      tagInteractable(lounger, 'pool_lounger_' + li);
      addBox(sharedColliders, poolX + lx, poolZ - 5.8, 0.9, 1.9);
      registerSpot({
        id: 'pool_lounger_' + li, title: 'Poolside Sun Lounger', floor: 0, category: 'town',
        x: poolX + lx, y: 0.24, z: poolZ - 5.8, radius: 3.0,
        actions: [{
          id: 'tan_' + li, label: 'Sunbathe on Riviera Pool Lounger', hint: '+12 Energy/s & +10 Fun/s', pose: 'daydream',
          anchor: { x: poolX + lx, y: 0.56, z: poolZ - 5.6, yaw: 0, rigOffsetY: 0.34, floorY: 0.24, exitX: poolX + lx + 1.1, exitZ: poolZ - 5.6, exitYaw: 0 },
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
      x: poolX, y: 0.24, z: poolZ,
      radius: 7.4,
      actions: [
        {
          id: 'swim_azure',
          label: 'Dive In & Swim Laps',
          hint: '+16 Fun/s & +12 Hygiene/s',
          pose: 'swim',
          anchor: { x: poolX, y: 0.14, z: poolZ, yaw: Math.PI * 0.5, rigOffsetY: 0.18, floorY: 0.24, exitX: poolX, exitZ: poolZ + 4.8, exitYaw: 0 },
          rates: { fun: 16, hygiene: 12, energy: 4 },
          statusText: 'Swimming gracefully through warm turquoise water...',
        },
      ],
    });
    townDirectory.push(ctx.spots ? ctx.spots.azure_pool_swim : { id: 'azure_pool_swim', title: 'Villa Azure Swimming Pool', category: 'town', x: poolX, y: 0.24, z: poolZ, actions: [] });

    // -----------------------------------------------------------
    // 11. HOTEL — HÔTEL IMPÉRIAL DE VERSAILLES (2-STORY ENTERABLE! x = +128, z = 14)
    // -----------------------------------------------------------
    const hotelX = 128;
    const hotelZ = 14;
    const hotelW = 16.0;
    const hotelD = 13.0;
    const hotel1Y = 0.14;
    const hotel2Y = 4.54;

    const hotel1Floor = new THREE.Mesh(new THREE.BoxGeometry(hotelW, 0.24, hotelD), marbleMat);
    hotel1Floor.position.set(hotelX, 0.06, hotelZ);
    townGroup.add(hotel1Floor);
    walkableFloors.push({ minX: hotelX - hotelW * 0.5, maxX: hotelX + hotelW * 0.5, minZ: hotelZ - hotelD * 0.5, maxZ: hotelZ + hotelD * 0.5, y: hotel1Y });

    // Lobby Walls (Open doorway on West facing Swimming Pool & Boulevard!)
    addWallX(townGroup, sharedColliders, 0, 4.4, hotelZ - hotelD * 0.5, hotelX - hotelW * 0.5, hotelX + hotelW * 0.5, null, 0, 0.34, ivoryMat);
    addWallX(townGroup, sharedColliders, 0, 4.4, hotelZ + hotelD * 0.5, hotelX - hotelW * 0.5, hotelX + hotelW * 0.5, null, 0, 0.34, ivoryMat);
    addWallZ(townGroup, sharedColliders, 0, 4.4, hotelX + hotelW * 0.5, hotelZ - hotelD * 0.5, hotelZ + hotelD * 0.5, null, 0, 0.34, ivoryMat);
    addWallZ(townGroup, sharedColliders, 0, 4.4, hotelX - hotelW * 0.5, hotelZ - hotelD * 0.5, hotelZ + hotelD * 0.5, hotelZ, 3.0, 0.34, ivoryMat);

    const hotelSign = kit.buildPlotSign('Grand Hôtel Impérial', '#5c4119');
    hotelSign.position.set(hotelX - hotelW * 0.5 - 1.2, 0, hotelZ - 2.6);
    hotelSign.rotation.y = -Math.PI * 0.5;
    townGroup.add(hotelSign);

    // Concierge Desk + Lobby Sofas + Stairs to 2F Suites
    const hDesk = kit.buildWritingDesk('hotel_concierge', 'crimson');
    hDesk.position.set(hotelX - 1.5, hotel1Y, hotelZ - 4.4);
    townGroup.add(hDesk);
    tagInteractable(hDesk, 'hotel_concierge');
    addBox(sharedColliders, hotelX - 1.5, hotelZ - 4.4, 1.6, 0.8);
    registerSpot({
      id: 'hotel_concierge',
      title: 'Grand Hôtel Impérial Concierge',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: hotelX - 1.5, y: hotel1Y, z: hotelZ - 4.4,
      radius: 4.0,
      actions: [
        {
          id: 'hotel_checkin',
          label: 'Book VIP Imperial Penthouse Suite (₡140)',
          hint: 'Teleport Upstairs to Hotel Honeymoon Suite',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 140) return actCtx.toast('Need ₡140 Crowns.');
            actCtx.game.money -= 140;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 25, composure: 20 });
            recordDispatchGossip(actCtx, 'Secret rendezvous? Royal suite booked at Grand Hôtel Impérial!', 2, 4);
            actCtx.playerCtrl.teleport(hotelX - 1.5, hotelZ + 1.5, Math.PI, hotel2Y);
            actCtx.toast('Checked into Grand Hôtel Suite 2F! (+20 Poise, +4 Scandal)');
          },
        },
      ],
    });
    placeSofa(townGroup, sharedColliders, {
      id: 'hotel_lobby_sofa', title: 'Hotel Grand Lobby Velvet Sofa', floor: 0,
      x: hotelX + 2.2, y: hotel1Y, z: hotelZ + 2.8, yaw: Math.PI, tone: 'crimson', w: 2.8,
    });

    // Hotel 2F Suite Slab + Roof (Cutaway when inside Hotel!)
    const hotel2Grp = new THREE.Group();
    const h2Slab = new THREE.Mesh(new THREE.BoxGeometry(hotelW, 0.22, hotelD), parquetMat);
    h2Slab.position.set(hotelX, hotel2Y - 0.11, hotelZ);
    hotel2Grp.add(h2Slab);
    const hotelRoofGrp = new THREE.Group();
    const hRoof = new THREE.Mesh(new THREE.ConeGeometry(10.8, 3.2, 4), slateRoofMat);
    hRoof.rotation.y = Math.PI * 0.25;
    hRoof.scale.set(1.25, 1, 1.0);
    hRoof.position.set(hotelX, hotel2Y + 5.2, hotelZ);
    hotelRoofGrp.add(hRoof);
    hotel2Grp.add(hotelRoofGrp);
    townGroup.add(hotel2Grp);

    // Hotel 2F Suite Furnishing (Bed + Bath + Return Elevator Spot!)
    placeBed(hotel2Grp, null, {
      id: 'bed_hotel_vip', title: 'Grand Hôtel Honeymoon Canopy Bed', floor: 0, canopy: true,
      x: hotelX + 3.8, y: hotel2Y, z: hotelZ - 3.0, yaw: 0, tone: 'rose', w: 2.4, d: 2.9,
    });
    placeToilet(hotel2Grp, null, {
      id: 'toilet_hotel', title: 'Grand Hôtel Suite Marble Toilet', floor: 0,
      x: hotelX - 5.6, y: hotel2Y, z: hotelZ - 4.4, yaw: Math.PI * 0.5,
    });
    const liftDownHotel = kit.buildWardrobe('hotel_lift_down', false);
    liftDownHotel.position.set(hotelX - 6.2, hotel2Y, hotelZ + 3.8);
    hotel2Grp.add(liftDownHotel);
    tagInteractable(liftDownHotel, 'hotel_lift_down');
    registerSpot({
      id: 'hotel_lift_down', title: 'Hotel 2F Elevator Down to Lobby', floor: 0, category: 'town',
      x: hotelX - 6.2, y: hotel2Y, z: hotelZ + 3.8, radius: 3.4,
      actions: [{
        id: 'hotel_down', label: 'Take Hotel Lift to 1F Lobby', hint: 'Return to ground floor', instant: true,
        onInstant: function (actCtx) { actCtx.playerCtrl.teleport(hotelX - 3.5, hotelZ, -Math.PI * 0.5, hotel1Y); },
      }],
    });

    cutaways.push({
      minX: hotelX - hotelW * 0.5 - 0.6, maxX: hotelX + hotelW * 0.5 + 0.6,
      minZ: hotelZ - hotelD * 0.5 - 0.6, maxZ: hotelZ + hotelD * 0.5 + 0.6,
      roofGrp: hotelRoofGrp,
      upperGrp: hotel2Grp,
    });
    townZones.push({ minX: hotelX - hotelW * 0.5, maxX: hotelX + hotelW * 0.5, minZ: hotelZ - hotelD * 0.5, maxZ: hotelZ + hotelD * 0.5, label: 'Grand Hôtel Impérial' });
    const hDir = {
      id: 'hotel_dir', title: 'Grand Hôtel Impérial (Lobby & VIP Suites)', floor: 0, category: 'town',
      x: hotelX - 3.5, y: hotel1Y, z: hotelZ, radius: 3.0, isDirectoryOnly: true,
      actions: [{
        id: 'go_hotel', label: 'Visit Grand Hôtel Lobby', hint: 'Check in or ride lift to Honeymoon Suite', instant: true,
        onInstant: function (actCtx) { actCtx.playerCtrl.teleport(hotelX - 4.0, hotelZ, -Math.PI * 0.5, hotel1Y); },
      }],
    };
    registerSpot(hDir);
    townDirectory.push(hDir);

    function groundHeightAtTown(x, z, yNow) {
      if (yNow >= 3.2 && x >= hotelX - hotelW * 0.5 && x <= hotelX + hotelW * 0.5 && z >= hotelZ - hotelD * 0.5 && z <= hotelZ + hotelD * 0.5) {
        return hotel2Y;
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
        if (c.upperGrp && c.roofGrp) {
          c.roofGrp.visible = !inside;
        } else if (c.roofGrp) {
          c.roofGrp.visible = !inside;
        }
      }
    }

    function detectTownZone(pos) {
      for (let i = 0; i < townZones.length; i++) {
        const tz = townZones[i];
        if (pos.x >= tz.minX && pos.x <= tz.maxX && pos.z >= tz.minZ && pos.z <= tz.maxZ) {
          return tz.label;
        }
      }
      if (pos.x < -64) return 'West Riviera Town & Suburbs';
      if (pos.x > 64) return 'East Promenade, Pool & Nightlife';
      return null;
    }

    function update(elapsedSec) {
      // Subtle club dancefloor color shift
      const hue = (elapsedSec * 0.14) % 1;
      danceFloorMat.color.setHSL(hue, 0.72, 0.62);
    }

    return {
      groundHeightAtTown: groundHeightAtTown,
      updateTownCutaway: updateTownCutaway,
      detectTownZone: detectTownZone,
      townDirectory: townDirectory,
      update: update,
    };
  }

  window.CrownTown = {
    build: buildRivieraTown,
  };
})();
