/* Crown & Scandal 3D — Expanded Capital District, 8 Enterable Buildings, 3 Roundabouts, Waterfront Villas & Coastal Cliffs */
(function () {
  'use strict';

  function buildKingdomExpansion(ctx) {
    const THREE = ctx.THREE;
    const kit = ctx.kit;
    const townGroup = ctx.townGroup;
    if (!THREE || !kit || !townGroup) return null;

    const sharedColliders = ctx.sharedColliders;
    const walkableFloors = ctx.walkableFloors;
    const cutaways = ctx.cutaways;
    const townZones = ctx.townZones;
    const townDirectory = ctx.townDirectory;
    const townDoors = ctx.townDoors;
    const dynamicNodes = ctx.dynamicNodes;

    const ivoryMat = ctx.ivoryMat;
    const marbleMat = ctx.marbleMat;
    const whiteMarbleMat = ctx.whiteMarbleMat || marbleMat;
    const parquetMat = ctx.parquetMat;
    const goldMat = ctx.goldMat;
    const glassMat = ctx.glassMat;
    const slateRoofMat = ctx.slateRoofMat;
    const waterMat = ctx.waterMat;
    const boxwoodMat = ctx.boxwoodMat;
    const sidewalkMat = ctx.sidewalkMat;
    const asphaltMat = ctx.asphaltMat;
    const terracottaMat = ctx.terracottaMat;
    const pastelPinkWall = ctx.pastelPinkWall;
    const mintWallMat = ctx.mintWallMat;
    const skyWallMat = ctx.skyWallMat;
    const butterWallMat = ctx.butterWallMat;
    const stoneWallMat = ctx.stoneWallMat;
    const clubDarkMat = ctx.clubDarkMat;
    const tileFloorMat = ctx.tileFloorMat;

    const addBox = ctx.addBox;
    const addCircle = ctx.addCircle;
    const addWallX = ctx.addWallX;
    const addWallZ = ctx.addWallZ;
    const placeBed = ctx.placeBed;
    const placeToilet = ctx.placeToilet;
    const placeVanitySink = ctx.placeVanitySink;
    const placeShower = ctx.placeShower;
    const placeSofa = ctx.placeSofa;
    const placeArmchair = ctx.placeArmchair;
    const tagInteractable = ctx.tagInteractable;
    const registerSpot = ctx.registerSpot;
    const addEnterableLot = ctx.addEnterableLot;
    const addStreetStrip = ctx.addStreetStrip;
    const recordDispatchGossip = ctx.recordDispatchGossip;

    const localMats = [];
    function keepMat(m) { localMats.push(m); return m; }

    // -----------------------------------------------------------
    // 1. EXPANDED PAVED AVENUES & 3 LANDSCAPED ROUNDABOUTS
    // -----------------------------------------------------------
    // West Avenue Extensions (z = 0.0, 19.2, 48.0 from -236 to -153.5)
    addStreetStrip(-194.75, 0.0, 82.5, 4.4, true);
    addStreetStrip(-194.75, 19.2, 82.5, 4.2, true);
    addStreetStrip(-194.75, 48.0, 82.5, 5.6, true);
    addStreetStrip(-186.0, 24.0, 4.2, 52.0, false);
    addStreetStrip(-218.0, 24.0, 4.0, 52.0, false);

    // East Avenue Extensions (z = 0.0, 19.2, 48.0 from +156.5 to +238.0)
    addStreetStrip(197.25, 0.0, 81.5, 4.4, true);
    addStreetStrip(197.25, 19.2, 81.5, 4.2, true);
    addStreetStrip(197.25, 48.0, 81.5, 5.6, true);
    addStreetStrip(190.0, 24.0, 4.2, 52.0, false);
    addStreetStrip(222.0, 24.0, 4.0, 52.0, false);

    const roundabouts = [
      { id: 'rb_west_civic', x: -153.5, z: 19.2, outerR: 5.6, innerR: 2.2, style: 'obelisk' },
      { id: 'rb_west_plaza', x: -186.0, z: 19.2, outerR: 5.6, innerR: 2.2, style: 'fountain' },
      { id: 'rb_east_plaza', x: 190.0, z: 19.2, outerR: 5.6, innerR: 2.2, style: 'fountain' },
    ];
    roundabouts.forEach(function (rb) {
      const roadRing = new THREE.Mesh(new THREE.CylinderGeometry(rb.outerR, rb.outerR, 0.04, 28), asphaltMat);
      roadRing.position.set(rb.x, 0.029, rb.z);
      roadRing.receiveShadow = true;
      townGroup.add(roadRing);

      const innerCurb = new THREE.Mesh(new THREE.CylinderGeometry(rb.innerR + 0.18, rb.innerR + 0.24, 0.22, 24), whiteMarbleMat);
      innerCurb.position.set(rb.x, 0.11, rb.z);
      townGroup.add(innerCurb);

      const hedgeIsland = new THREE.Mesh(new THREE.CylinderGeometry(rb.innerR - 0.12, rb.innerR - 0.06, 0.36, 20), boxwoodMat);
      hedgeIsland.position.set(rb.x, 0.28, rb.z);
      townGroup.add(hedgeIsland);

      if (rb.style === 'obelisk') {
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.4), ivoryMat);
        plinth.position.set(rb.x, 0.72, rb.z);
        townGroup.add(plinth);
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.42, 3.8, 4), whiteMarbleMat);
        shaft.rotation.y = Math.PI * 0.25;
        shaft.position.set(rb.x, 3.05, rb.z);
        townGroup.add(shaft);
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.55, 4), goldMat);
        tip.rotation.y = Math.PI * 0.25;
        tip.position.set(rb.x, 5.2, rb.z);
        townGroup.add(tip);
      } else {
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.2, 0.55, 18), whiteMarbleMat);
        basin.position.set(rb.x, 0.62, rb.z);
        townGroup.add(basin);
        const poolDisk = new THREE.Mesh(new THREE.CircleGeometry(1.25, 18), waterMat);
        poolDisk.rotation.x = -Math.PI / 2;
        poolDisk.position.set(rb.x, 0.91, rb.z);
        townGroup.add(poolDisk);
        const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.36, 1.6, 12), goldMat);
        finial.position.set(rb.x, 1.45, rb.z);
        townGroup.add(finial);
      }
      addCircle(sharedColliders, rb.x, rb.z, rb.innerR + 0.28);
    });

    // -----------------------------------------------------------
    // 2. EIGHT ENTERABLE CAPITAL TOWN BUILDINGS
    // -----------------------------------------------------------

    // 2A. ROYAL CROWN BANK & TREASURY (x = -170.0, z = 8.4)
    addEnterableLot({
      id: 'town_bank',
      title: 'Royal Crown Bank & Treasury',
      signTitle: 'Royal Crown Bank',
      signColor: '#1f3652',
      x: -170.0, z: 8.4, w: 11.6, d: 8.2, wallH: 3.9,
      wallMat: ivoryMat,
      floorMat: whiteMarbleMat,
      doorFace: 'N', doorW: 2.6,
      roofMat: slateRoofMat, flatRoof: true,
      shutterMat: kit.palette.fabricColors.sapphire,
      category: 'town',
      shortcut: true,
      actions: [
        {
          id: 'bank_visit',
          label: 'Withdraw Sovereign Bank Interest (+₡120)',
          hint: 'Collect daily Kingdom Bank interest & +10 Poise',
          instant: true,
          onInstant: function (actCtx) {
            if (actCtx.game) actCtx.game.money = (actCtx.game.money || 0) + 120;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 10, fun: 6 });
            actCtx.toast('Collected +₡120 Crowns sovereign banking yield!');
          },
        },
        {
          id: 'bank_invest',
          label: 'Invest in Riviera Treasury Bonds (₡200 → +₡290)',
          hint: 'Requires ₡200 · Instant +₡90 net return & +3 Clout',
          instant: true,
          onInstant: function (actCtx) {
            if (!actCtx.game || (actCtx.game.money || 0) < 200) {
              return actCtx.toast('Need ₡200 Crowns to underwrite Treasury Bonds.');
            }
            actCtx.game.money += 90;
            if (actCtx.game.reputation) actCtx.game.reputation.clout = Math.min(100, (actCtx.game.reputation.clout || 50) + 3);
            actCtx.toast('Riviera Treasury Bonds matured cleanly! (+₡90 net, +3 Clout)');
          },
        },
      ],
    });
    if (typeof kit.buildCashierCounter === 'function') {
      const bankCounter = kit.buildCashierCounter('town_bank', '#1f3652', 'CROWN BANK');
      bankCounter.position.set(-170.0, 0.12, 10.6);
      townGroup.add(bankCounter);
      tagInteractable(bankCounter, 'town_bank');
      addBox(sharedColliders, -170.0, 10.6, 3.6, 1.0);
    }
    const vaultDoor = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 16), goldMat);
    vaultDoor.rotation.x = Math.PI * 0.5;
    vaultDoor.position.set(-174.4, 1.65, 12.1);
    townGroup.add(vaultDoor);
    placeArmchair(townGroup, sharedColliders, { id: 'bank_chair', title: 'Bank Client Lounge Chair', floor: 0, x: -166.0, y: 0.12, z: 7.5, yaw: -Math.PI * 0.5, tone: 'sapphire' });

    // 2B. LUMINA BEAUTY SALON & SPA (x = -202.0, z = 8.4)
    addEnterableLot({
      id: 'town_salon',
      title: 'Lumina Beauty Salon & Spa',
      signTitle: 'Lumina Beauty Salon',
      signColor: '#9e4765',
      x: -202.0, z: 8.4, w: 11.4, d: 8.0, wallH: 3.7,
      wallMat: pastelPinkWall,
      floorMat: marbleMat,
      doorFace: 'N', doorW: 2.5,
      roofMat: slateRoofMat, dormer: true,
      shutterMat: kit.palette.fabricColors.rose,
      category: 'town',
      shortcut: true,
      actions: [
        {
          id: 'salon_glam',
          label: 'Royal Blowout & Couture Glam Session (₡45)',
          hint: '+36 Poise, +24 Fun & +24 Hygiene!',
          pose: 'powder',
          anchor: { x: -204.2, y: 0.18, z: 10.4, yaw: Math.PI, rigOffsetY: -0.45, floorY: 0.12, exitX: -204.2, exitZ: 8.6, exitYaw: 0 },
          rates: { composure: 22, fun: 16, hygiene: 14 },
          statusText: 'Receiving a luminous Riviera blowout & manicure at Lumina Salon...',
        },
        {
          id: 'salon_instant_spa',
          label: 'Express Facial & Rosewater Manicure (₡30)',
          hint: 'Instant +40 Hygiene & +28 Poise',
          instant: true,
          onInstant: function (actCtx) {
            if (!actCtx.game || (actCtx.game.money || 0) < 30) return actCtx.toast('Need ₡30 Crowns.');
            actCtx.game.money -= 30;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hygiene: 40, composure: 28, fun: 14 });
            actCtx.toast('Luminous facial complete! (+40 Bath, +28 Poise)');
          },
        },
      ],
    });
    if (typeof kit.buildDressingVanity === 'function') {
      [-204.2, -200.0].forEach(function (vx) {
        const van = kit.buildDressingVanity('town_salon', 'rose');
        van.position.set(vx, 0.12, 11.2);
        townGroup.add(van);
        tagInteractable(van, 'town_salon');
        addBox(sharedColliders, vx, 11.2, 1.5, 0.7);
      });
    }
    placeSofa(townGroup, sharedColliders, { id: 'salon_sofa', title: 'Lumina Salon Velvet Sofa', floor: 0, x: -197.8, y: 0.12, z: 8.2, yaw: -Math.PI * 0.5, tone: 'rose', w: 2.2 });
    placeToilet(townGroup, sharedColliders, { id: 'salon_toilet', title: 'Salon Powder Room Toilet', floor: 0, x: -206.4, y: 0.12, z: 6.2, yaw: Math.PI * 0.5 });

    // 2C. COURONNE ATHLETIC CLUB / TOWN GYM (x = -170.0, z = 32.0)
    const gymFloorDarkMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x2c3340, roughness: 0.72 }));
    addEnterableLot({
      id: 'town_gym',
      title: 'Couronne Athletic Club (Gym)',
      signTitle: 'Couronne Athletic Club',
      signColor: '#254a63',
      x: -170.0, z: 32.0, w: 11.8, d: 8.8, wallH: 3.9,
      wallMat: skyWallMat,
      floorMat: gymFloorDarkMat,
      doorFace: 'N', doorW: 2.6,
      roofMat: slateRoofMat, flatRoof: true,
      shutterMat: kit.palette.fabricColors.sapphire,
      category: 'town',
      shortcut: true,
      actions: [
        {
          id: 'town_gym_treadmill',
          label: 'Run Cardio Sprint on Club Treadmill',
          hint: '+20 Fun/s & +14 Poise/s',
          pose: 'workout',
          anchor: { x: -172.6, y: 0.28, z: 33.8, yaw: Math.PI, floorY: 0.12, exitX: -172.6, exitZ: 31.6, exitYaw: 0 },
          rates: { fun: 20, composure: 14, energy: -2 },
          statusText: 'Running brisk cardio intervals at Couronne Athletic Club...',
        },
        {
          id: 'town_gym_yoga',
          label: 'Guided Pilates & Stretching Class',
          hint: '+16 Poise/s & +10 Energy/s',
          pose: 'curtsy',
          anchor: { x: -167.0, y: 0.14, z: 31.4, yaw: Math.PI, floorY: 0.12, exitX: -167.0, exitZ: 29.8, exitYaw: 0 },
          rates: { composure: 16, energy: 10, fun: 8 },
          statusText: 'Following Pilates & posture flow at the Athletic Club...',
        },
      ],
    });
    [-172.6, -170.2].forEach(function (tx) {
      const tm = new THREE.Group();
      tm.position.set(tx, 0.12, 34.0);
      kit.addMesh(tm, kit.g.box1, kit.palette.iron || gymFloorDarkMat, 0.96, 0.16, 1.9, 0, 0.08, 0);
      kit.addMesh(tm, kit.g.cyl1, kit.palette.gold, 0.06, 1.15, 0.06, -0.4, 0.65, -0.78);
      kit.addMesh(tm, kit.g.cyl1, kit.palette.gold, 0.06, 1.15, 0.06, 0.4, 0.65, -0.78);
      kit.addMesh(tm, kit.g.box1, kit.palette.iron || gymFloorDarkMat, 0.88, 0.32, 0.24, 0, 1.24, -0.78, -0.45, 0, 0);
      townGroup.add(tm);
      tagInteractable(tm, 'town_gym');
      addBox(sharedColliders, tx, 34.0, 1.05, 1.95);
    });
    placeShower(townGroup, sharedColliders, { id: 'town_gym_shower', title: 'Athletic Club Locker Shower', floor: 0, x: -165.4, y: 0.12, z: 34.8, yaw: 0 });
    placeToilet(townGroup, sharedColliders, { id: 'town_gym_toilet', title: 'Athletic Club Toilet', floor: 0, x: -165.4, y: 0.12, z: 29.2, yaw: -Math.PI * 0.5 });

    // 2D. GRAND ROYAL PUBLIC LIBRARY (x = -202.0, z = 32.0)
    addEnterableLot({
      id: 'town_library',
      title: 'Grand Royal Public Library',
      signTitle: 'Royal Public Library',
      signColor: '#4c3526',
      x: -202.0, z: 32.0, w: 11.8, d: 8.8, wallH: 3.9,
      wallMat: butterWallMat,
      floorMat: parquetMat,
      doorFace: 'N', doorW: 2.6,
      roofMat: terracottaMat, cupola: true,
      shutterMat: kit.palette.fabricColors.emerald,
      category: 'schools',
      shortcut: true,
      actions: [
        {
          id: 'pub_lib_read',
          label: 'Read Kingdom Chronicles & History',
          hint: '+16 Poise/s & +12 Fun/s',
          pose: 'sit_read',
          anchor: { x: -202.0, y: 0.56, z: 32.2, yaw: 0, rigOffsetY: -0.44, floorY: 0.12, exitX: -202.0, exitZ: 30.2, exitYaw: 0 },
          rates: { composure: 16, fun: 12, energy: 4 },
          statusText: 'Studying rare illuminated manuscripts in the Royal Public Library...',
        },
      ],
    });
    [-205.8, -198.2].forEach(function (bx, bi) {
      if (typeof kit.buildBookshelf === 'function') {
        const sh = kit.buildBookshelf('pub_lib_shelf_' + bi, true);
        sh.position.set(bx, 0.12, 35.6);
        townGroup.add(sh);
        tagInteractable(sh, 'town_library');
        addBox(sharedColliders, bx, 35.6, 1.8, 0.55);
      }
    });
    if (typeof kit.buildTableSet === 'function') {
      const libTbl = kit.buildTableSet('town_library', false);
      libTbl.position.set(-202.0, 0.12, 32.2);
      townGroup.add(libTbl);
      tagInteractable(libTbl, 'town_library');
      addBox(sharedColliders, -202.0, 32.2, 1.6, 1.1);
    }
    placeArmchair(townGroup, sharedColliders, { id: 'pub_lib_chair', title: 'Library Velvet Reading Chair', floor: 0, x: -205.4, y: 0.12, z: 30.0, yaw: Math.PI * 0.5, tone: 'emerald' });

    // 2E. RIVIERA GRAND PUBLIC CINEMA (x = +173.5, z = 8.4)
    addEnterableLot({
      id: 'town_cinema',
      title: 'Riviera Grand Public Cinema',
      signTitle: 'Riviera Grand Cinema',
      signColor: '#5c1428',
      x: 173.5, z: 8.4, w: 12.2, d: 8.6, wallH: 4.1,
      wallMat: clubDarkMat,
      floorMat: keepMat(new THREE.MeshStandardMaterial({ color: 0x3b1320, roughness: 0.78 })),
      doorFace: 'N', doorW: 2.6,
      roofMat: slateRoofMat, flatRoof: true,
      shutterMat: kit.palette.fabricColors.crimson,
      category: 'town',
      shortcut: true,
      actions: [
        {
          id: 'cinema_watch',
          label: 'Watch Riviera Gala Film Screening (₡20)',
          hint: '+30 Fun/s & +10 Energy/s',
          pose: 'sofa',
          anchor: { x: 173.5, y: 0.24, z: 9.2, yaw: 0, rigOffsetY: -0.46, floorY: 0.12, exitX: 173.5, exitZ: 6.4, exitYaw: 0 },
          rates: { fun: 30, energy: 10, composure: 6 },
          statusText: 'Watching the glittering Riviera Premiere inside Grand Public Cinema...',
        },
        {
          id: 'cinema_popcorn',
          label: 'Order Butter Caramel Popcorn Box (₡12)',
          hint: '+35 Food & +12 Fun',
          instant: true,
          onInstant: function (actCtx) {
            if (!actCtx.game || (actCtx.game.money || 0) < 12) return actCtx.toast('Need ₡12 Crowns.');
            actCtx.game.money -= 12;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 35, fun: 12 });
            actCtx.toast('Warm butter caramel popcorn served! (+35 Food, +12 Fun)');
          },
        },
      ],
    });
    if (typeof kit.buildCinemaScreenWall === 'function') {
      const pubScreen = kit.buildCinemaScreenWall(8.6, 3.1);
      pubScreen.position.set(173.5, 0.35, 12.35);
      pubScreen.rotation.y = Math.PI;
      townGroup.add(pubScreen);
      tagInteractable(pubScreen, 'town_cinema');
    }
    [170.5, 173.5, 176.5].forEach(function (cxSeat, ci) {
      placeArmchair(townGroup, sharedColliders, { id: 'cinema_seat_' + ci, title: 'Cinema Velvet Seat', floor: 0, x: cxSeat, y: 0.12, z: 9.2, yaw: 0, tone: 'crimson' });
    });
    if (typeof kit.buildCashierCounter === 'function') {
      const boxOff = kit.buildCashierCounter('town_cinema', '#5c1428', 'BOX OFFICE');
      boxOff.position.set(169.0, 0.12, 5.8);
      townGroup.add(boxOff);
      tagInteractable(boxOff, 'town_cinema');
      addBox(sharedColliders, 169.0, 5.8, 2.4, 0.9);
    }

    // 2F. MAISON CIVIC & BUSINESS OFFICES (x = +206.0, z = 8.4)
    addEnterableLot({
      id: 'town_offices',
      title: 'Maison Civic & Business Offices',
      signTitle: 'Civic & Business Offices',
      signColor: '#294058',
      x: 206.0, z: 8.4, w: 11.6, d: 8.2, wallH: 3.9,
      wallMat: stoneWallMat,
      floorMat: tileFloorMat,
      doorFace: 'N', doorW: 2.6,
      roofMat: slateRoofMat, flatRoof: true,
      shutterMat: kit.palette.fabricColors.sapphire,
      category: 'town',
      shortcut: true,
      actions: [
        {
          id: 'office_work_shift',
          label: 'Work Executive Business Shift (+₡165)',
          hint: 'Manage kingdom commerce & earn +₡165 Crowns + 3 Clout',
          instant: true,
          onInstant: function (actCtx) {
            if (actCtx.game) {
              actCtx.game.money = (actCtx.game.money || 0) + 165;
              if (actCtx.game.reputation) actCtx.game.reputation.clout = Math.min(100, (actCtx.game.reputation.clout || 50) + 3);
            }
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 12, energy: -8 });
            actCtx.toast('Executive shift completed! Earned +₡165 Crowns & +3 Clout.');
          },
        },
        {
          id: 'office_boardroom',
          label: 'Chair Commerce Strategy Meeting',
          hint: '+16 Poise/s & +8 Fun/s',
          pose: 'work_station',
          anchor: { x: 204.2, y: 0.14, z: 9.8, yaw: Math.PI, floorY: 0.12, exitX: 204.2, exitZ: 8.0, exitYaw: 0 },
          rates: { composure: 16, fun: 8 },
          statusText: 'Reviewing Kingdom commercial expansion plans...',
        },
      ],
    });
    if (typeof kit.buildWritingDesk === 'function') {
      [204.2, 208.2].forEach(function (dxOff) {
        const ed = kit.buildWritingDesk('town_offices', 'sapphire');
        ed.position.set(dxOff, 0.12, 10.6);
        townGroup.add(ed);
        tagInteractable(ed, 'town_offices');
        addBox(sharedColliders, dxOff, 10.6, 1.8, 0.9);
      });
    }
    placeToilet(townGroup, sharedColliders, { id: 'office_toilet', title: 'Business Office Washroom', floor: 0, x: 210.6, y: 0.12, z: 6.0, yaw: -Math.PI * 0.5 });

    // 2G. KINGDOM COMMUNITY CENTRE (x = +173.5, z = 32.0)
    addEnterableLot({
      id: 'town_community',
      title: 'Kingdom Community Centre',
      signTitle: 'Community Centre',
      signColor: '#2f6a52',
      x: 173.5, z: 32.0, w: 11.8, d: 8.8, wallH: 3.7,
      wallMat: mintWallMat,
      floorMat: parquetMat,
      doorFace: 'N', doorW: 2.6,
      roofMat: terracottaMat, dormer: true,
      shutterMat: kit.palette.fabricColors.emerald,
      category: 'town',
      shortcut: true,
      actions: [
        {
          id: 'comm_piano',
          label: 'Play Piano for Citizens & Neighbors',
          hint: '+18 Fun/s & +12 Poise/s',
          pose: 'piano',
          anchor: { x: 171.2, y: 0.24, z: 33.4, yaw: Math.PI, rigOffsetY: -0.45, floorY: 0.12, exitX: 171.2, exitZ: 31.8, exitYaw: 0 },
          rates: { fun: 18, composure: 12 },
          statusText: 'Performing joyful music at the Community Centre...',
        },
        {
          id: 'comm_charity_mixer',
          label: 'Host Community Tea & Charity Drive (₡40)',
          hint: '+5 Clout, +24 Fun & Crown Dispatch praise!',
          instant: true,
          onInstant: function (actCtx) {
            if (!actCtx.game || (actCtx.game.money || 0) < 40) return actCtx.toast('Need ₡40 Crowns.');
            actCtx.game.money -= 40;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 24, composure: 18 });
            recordDispatchGossip(actCtx, 'Princess hosts beloved charity tea at Kingdom Community Centre!', 5, -2);
            actCtx.toast('Neighborhood applause! (+5 Clout, +24 Fun)');
          },
        },
      ],
    });
    if (typeof kit.buildGrandPiano === 'function') {
      const cPiano = kit.buildGrandPiano('community_piano');
      cPiano.position.set(171.2, 0.12, 34.4);
      townGroup.add(cPiano);
      tagInteractable(cPiano, 'town_community');
      addBox(sharedColliders, 171.2, 34.4, 1.8, 2.0);
    }
    if (typeof kit.buildChessTable === 'function') {
      const cChess = kit.buildChessTable('community_chess');
      cChess.position.set(176.2, 0.12, 34.0);
      townGroup.add(cChess);
      tagInteractable(cChess, 'town_community');
      addBox(sharedColliders, 176.2, 34.0, 1.3, 1.3);
    }
    placeSofa(townGroup, sharedColliders, { id: 'comm_sofa', title: 'Community Lounge Sofa', floor: 0, x: 176.4, y: 0.12, z: 30.0, yaw: -Math.PI * 0.5, tone: 'emerald', w: 2.4 });

    // 2H. BELVEDERE 2-STOREY LUXURY APARTMENTS (x = +206.0, z = 32.0)
    const aptCx = 206.0;
    const aptCz = 32.0;
    const aptW = 12.0;
    const aptD = 9.0;
    const aptY1 = 0.12;
    const aptY2 = 4.12;
    const aptUpperGrp = new THREE.Group();
    const aptRoofGrp = new THREE.Group();
    const apt2FColliders = [];
    townGroup.add(aptUpperGrp, aptRoofGrp);

    // 1F Shell (built cleanly without duplicate roof via custom upperGrp + roofGrp)
    const aptPad = new THREE.Mesh(new THREE.BoxGeometry(aptW + 2.2, 0.08, aptD + 2.2), sidewalkMat);
    aptPad.position.set(aptCx, 0.04, aptCz);
    aptPad.receiveShadow = true;
    townGroup.add(aptPad);

    const aptFloor1 = new THREE.Mesh(new THREE.BoxGeometry(aptW, 0.16, aptD), parquetMat);
    aptFloor1.position.set(aptCx, 0.06, aptCz);
    aptFloor1.receiveShadow = true;
    townGroup.add(aptFloor1);

    addWallX(townGroup, sharedColliders, 0, 3.9, aptCz - aptD * 0.5, aptCx - aptW * 0.5, aptCx + aptW * 0.5, aptCx, 2.6, 0.28, ivoryMat);
    addWallX(townGroup, sharedColliders, 0, 3.9, aptCz + aptD * 0.5, aptCx - aptW * 0.5, aptCx + aptW * 0.5, null, 0, 0.28, ivoryMat);
    addWallZ(townGroup, sharedColliders, 0, 3.9, aptCx - aptW * 0.5, aptCz - aptD * 0.5, aptCz + aptD * 0.5, null, 0, 0.28, ivoryMat);
    addWallZ(townGroup, sharedColliders, 0, 3.9, aptCx + aptW * 0.5, aptCz - aptD * 0.5, aptCz + aptD * 0.5, null, 0, 0.28, ivoryMat);

    // Articulated Swinging Apartment Entrance Doors (North face)
    if (typeof kit.buildHingedDoors === 'function') {
      const aptDoors = kit.buildHingedDoors({ width: 2.5, height: 2.65, count: 2, frameMat: ivoryMat, leafColor: 0xfaf2e4, handleMat: goldMat, filigree: true });
      aptDoors.group.position.set(aptCx, aptY1, aptCz - aptD * 0.5);
      aptDoors.group.rotation.y = Math.PI;
      townGroup.add(aptDoors.group);
      tagInteractable(aptDoors.leftPivot, 'door_town_apartments_N');
      if (aptDoors.rightPivot) tagInteractable(aptDoors.rightPivot, 'door_town_apartments_N');
      aptDoors.group.userData.noMerge = true;
      aptDoors.group.userData.noFreeze = true;
      dynamicNodes.push(aptDoors.group);
      townDoors.push({
        id: 'door_town_apartments_N', title: 'Belvedere Apartments Doors',
        x: aptCx, y: aptY1, z: aptCz - aptD * 0.5, radius: 4.0, doors: aptDoors, openRatio: 0, manualOpen: false,
      });
    }
    const aptSign = kit.buildPlotSign('Belvedere Apartments', '#354961');
    aptSign.position.set(aptCx + 2.4, 0, aptCz - aptD * 0.5 - 1.25);
    aptSign.rotation.y = Math.PI;
    townGroup.add(aptSign);

    walkableFloors.push({ minX: aptCx - aptW * 0.5, maxX: aptCx + aptW * 0.5, minZ: aptCz - aptD * 0.5, maxZ: aptCz + aptD * 0.5, y: aptY1 });
    townZones.push({ minX: aptCx - aptW * 0.5 - 0.5, maxX: aptCx + aptW * 0.5 + 0.5, minZ: aptCz - aptD * 0.5 - 0.5, maxZ: aptCz + aptD * 0.5 + 0.5, label: 'Belvedere 2-Storey Luxury Apartments' });

    // Exterior Staircase along East Side (x = +212.0..+213.8, z = 35.6 [0.12] up to z = 29.0 [4.12])
    const stairX = aptCx + aptW * 0.5 + 0.95;
    for (let si = 0; si < 12; si++) {
      const t = si / 11;
      const sz = 35.6 - t * 6.4;
      const sy = 0.28 + t * 3.84;
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.24, 0.6), whiteMarbleMat);
      stepMesh.position.set(stairX, sy, sz);
      townGroup.add(stepMesh);
    }
    // 2F Balcony Landing (x = 211.6..214.0, z = 27.6..29.6)
    const aptLanding = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.24, 2.2), whiteMarbleMat);
    aptLanding.position.set(aptCx + aptW * 0.5 + 0.85, aptY2 - 0.12, 28.6);
    aptUpperGrp.add(aptLanding);

    // 2F Slab + Walls (cutaway with doorway at East Landing z = 28.6)
    const aptFloor2 = new THREE.Mesh(new THREE.BoxGeometry(aptW, 0.2, aptD), parquetMat);
    aptFloor2.position.set(aptCx, aptY2 - 0.1, aptCz);
    aptUpperGrp.add(aptFloor2);

    addWallX(aptUpperGrp, apt2FColliders, aptY2, 3.6, aptCz - aptD * 0.5, aptCx - aptW * 0.5, aptCx + aptW * 0.5, null, 0, 0.26, ivoryMat);
    addWallX(aptUpperGrp, apt2FColliders, aptY2, 3.6, aptCz + aptD * 0.5, aptCx - aptW * 0.5, aptCx + aptW * 0.5, null, 0, 0.26, ivoryMat);
    addWallZ(aptUpperGrp, apt2FColliders, aptY2, 3.6, aptCx - aptW * 0.5, aptCz - aptD * 0.5, aptCz + aptD * 0.5, null, 0, 0.26, ivoryMat);
    addWallZ(aptUpperGrp, apt2FColliders, aptY2, 3.6, aptCx + aptW * 0.5, aptCz - aptD * 0.5, aptCz + aptD * 0.5, 28.6, 2.0, 0.26, ivoryMat);

    const aptRoofMesh = kit.buildGableRoof(aptW, aptD, 2.1, slateRoofMat, ivoryMat, { chimney: true, dormer: true });
    aptRoofMesh.position.set(aptCx, aptY2 + 3.55, aptCz);
    aptRoofGrp.add(aptRoofMesh);

    cutaways.push({
      minX: aptCx - aptW * 0.5 - 1.2,
      maxX: aptCx + aptW * 0.5 + 2.4,
      minZ: aptCz - aptD * 0.5 - 1.0,
      maxZ: aptCz + aptD * 0.5 + 1.0,
      upperGrp: aptUpperGrp,
      roofGrp: aptRoofGrp,
    });

    // 1F Apartment Suite Furnishings
    placeBed(townGroup, sharedColliders, { id: 'apt_1f_bed', title: 'Belvedere Apt 1F Suite Bed', floor: 0, x: aptCx - 3.6, y: aptY1, z: aptCz + 2.6, yaw: 0, tone: 'champagne', w: 2.0, d: 2.5 });
    placeSofa(townGroup, sharedColliders, { id: 'apt_1f_sofa', title: 'Belvedere Apt 1F Lounge Sofa', floor: 0, x: aptCx + 3.2, y: aptY1, z: aptCz + 2.6, yaw: 0, tone: 'sapphire', w: 2.3 });
    placeToilet(townGroup, sharedColliders, { id: 'apt_1f_toilet', title: 'Belvedere Apt 1F Toilet', floor: 0, x: aptCx - 4.8, y: aptY1, z: aptCz - 2.2, yaw: Math.PI * 0.5 });
    placeVanitySink(townGroup, sharedColliders, { id: 'apt_1f_sink', title: 'Belvedere Apt 1F Vanity', floor: 0, style: 'slate', x: aptCx - 4.8, y: aptY1, z: aptCz - 0.5, yaw: Math.PI * 0.5 });

    // 2F Apartment Penthouse Furnishings
    placeBed(aptUpperGrp, apt2FColliders, { id: 'apt_2f_bed', title: 'Belvedere Apt 2F Penthouse Bed', floor: 2, canopy: true, x: aptCx - 3.6, y: aptY2, z: aptCz + 2.6, yaw: 0, tone: 'rose', w: 2.2, d: 2.6 });
    placeSofa(aptUpperGrp, apt2FColliders, { id: 'apt_2f_sofa', title: 'Belvedere Apt 2F Sky Sofa', floor: 2, x: aptCx + 2.4, y: aptY2, z: aptCz + 2.4, yaw: 0, tone: 'lavender', w: 2.4 });
    placeToilet(aptUpperGrp, apt2FColliders, { id: 'apt_2f_toilet', title: 'Belvedere Apt 2F Bath Toilet', floor: 2, x: aptCx - 4.8, y: aptY2, z: aptCz - 2.2, yaw: Math.PI * 0.5 });
    placeShower(aptUpperGrp, apt2FColliders, { id: 'apt_2f_shower', title: 'Belvedere Apt 2F Rain Shower', floor: 2, x: aptCx - 4.6, y: aptY2, z: aptCz - 0.2, yaw: Math.PI * 0.5 });

    const aptSpot = {
      id: 'town_apartments',
      title: 'Belvedere 2-Storey Luxury Apartments',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: aptCx, y: aptY1, z: aptCz - 2.6,
      radius: 4.5,
      actions: [
        {
          id: 'apt_go_2f',
          label: 'Take Exterior Stairs to 2F Penthouse Suite',
          hint: 'Arrive in the 2F Belvedere Residence overlooking East Riviera',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.playerCtrl.teleport(aptCx + 1.0, aptCz, Math.PI, aptY2);
            actCtx.toast('Arrived inside Belvedere Apartment 2F Penthouse!');
          },
        },
        {
          id: 'apt_manage_prop',
          label: 'Buy / Set As Primary Residence (Real Estate)',
          hint: 'Open Royal Real Estate & Property Ownership Sheet',
          instant: true,
          onInstant: function () {
            if (window.CrownCommands && typeof window.CrownCommands.openRealEstateSheet === 'function') {
              window.CrownCommands.openRealEstateSheet();
            }
          },
        },
      ],
    };
    registerSpot(aptSpot);
    townDirectory.push(aptSpot);

    // -----------------------------------------------------------
    // 3. TWO ENTERABLE WATERFRONT BEACHFRONT VILLAS (z = 54.4)
    // -----------------------------------------------------------
    const villas = [
      { id: 'beach_villa_west', title: 'Villa Soléa Waterfront Beach House', sign: 'Villa Soléa', x: -194.0, z: 54.4, tone: 'rose', wall: butterWallMat, shutter: kit.palette.fabricColors.sapphire },
      { id: 'beach_villa_east', title: 'Cap d’Azur Waterfront Beach House', sign: 'Cap d’Azur Villa', x: 194.0, z: 54.4, tone: 'sapphire', wall: ivoryMat, shutter: kit.palette.fabricColors.emerald },
    ];
    villas.forEach(function (vl) {
      addEnterableLot({
        id: vl.id,
        title: vl.title,
        signTitle: vl.sign,
        signColor: '#1f5a75',
        x: vl.x, z: vl.z, w: 10.6, d: 5.8, wallH: 3.5,
        wallMat: vl.wall,
        floorMat: parquetMat,
        doorFace: 'NS', doorW: 2.4,
        roofMat: terracottaMat,
        shutterMat: vl.shutter,
        category: 'cottages',
        shortcut: true,
        actions: [
          {
            id: vl.id + '_terrace',
            label: 'Step Out Onto Beachfront Terrace',
            hint: 'Admire sparkling blue ocean waves right from your villa',
            instant: true,
            onInstant: function (actCtx) {
              actCtx.playerCtrl.teleport(vl.x, vl.z + 3.9, 0, 0.04);
              actCtx.toast('Stepped onto the golden beachfront at ' + vl.sign + '!');
            },
          },
          {
            id: vl.id + '_estate',
            label: 'Buy / Set Waterfront Villa as Home',
            hint: 'Manage Royal Real Estate Ownership',
            instant: true,
            onInstant: function () {
              if (window.CrownCommands && typeof window.CrownCommands.openRealEstateSheet === 'function') {
                window.CrownCommands.openRealEstateSheet();
              }
            },
          },
        ],
      });
      placeBed(townGroup, sharedColliders, { id: vl.id + '_bed', title: vl.sign + ' Ocean Suite Bed', floor: 0, canopy: true, x: vl.x - 3.2, y: 0.12, z: vl.z + 1.0, yaw: 0, tone: vl.tone, w: 1.9, d: 2.3 });
      placeSofa(townGroup, sharedColliders, { id: vl.id + '_sofa', title: vl.sign + ' Sea-View Sofa', floor: 0, x: vl.x + 2.8, y: 0.12, z: vl.z + 1.1, yaw: Math.PI, tone: vl.tone, w: 2.2 });
      placeToilet(townGroup, sharedColliders, { id: vl.id + '_toilet', title: vl.sign + ' Bath Toilet', floor: 0, x: vl.x + 4.3, y: 0.12, z: vl.z - 1.8, yaw: -Math.PI * 0.5 });
      if (typeof kit.buildBeachUmbrellaSet === 'function') {
        const bDeck = kit.buildBeachUmbrellaSet(vl.tone, null);
        bDeck.position.set(vl.x, 0.03, vl.z + 4.4);
        bDeck.rotation.y = Math.PI;
        townGroup.add(bDeck);
      }
    });

    // -----------------------------------------------------------
    // 4. TWO WALKABLE RIVIERA COASTAL CLIFFS & SCENIC OVERLOOKS
    // -----------------------------------------------------------
    const limestoneRockMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xcfc2ab, roughness: 0.88 }));
    const cliffDefs = [
      { id: 'cliff_west', title: 'Falaise d’Or Sunset Coastal Cliff', x: -232.0, z: 63.0, stairSide: 1, deckY: 4.0 },
      { id: 'cliff_east', title: 'Cap Sapphire Sunrise Coastal Cliff', x: 232.0, z: 63.0, stairSide: -1, deckY: 4.0 },
    ];
    cliffDefs.forEach(function (cf) {
      const rockMound = new THREE.Mesh(new THREE.CylinderGeometry(8.6, 11.4, cf.deckY, 10), limestoneRockMat);
      rockMound.position.set(cf.x, cf.deckY * 0.5 - 0.1, cf.z);
      rockMound.castShadow = true;
      rockMound.receiveShadow = true;
      townGroup.add(rockMound);

      const deckSlab = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.36, 9.2), whiteMarbleMat);
      deckSlab.position.set(cf.x, cf.deckY - 0.16, cf.z);
      deckSlab.receiveShadow = true;
      townGroup.add(deckSlab);

      // Walkable Stone Stairway up from beach (inner x edge moves inward toward ocean/villa side)
      for (let st = 0; st < 10; st++) {
        const t = st / 9;
        const sx = cf.x + cf.stairSide * (5.2 + (1 - t) * 5.4);
        const sy = 0.22 + t * (cf.deckY - 0.25);
        const step = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.3, 2.6), whiteMarbleMat);
        step.position.set(sx, sy, cf.z - 2.0);
        townGroup.add(step);
      }

      // Scenic Balustrade on North/South/Outer edges (leave stair mouth open!)
      [
        { x: cf.x, z: cf.z + 4.45, w: 10.2, d: 0.26 },
        { x: cf.x, z: cf.z - 4.45, w: 10.2, d: 0.26 },
        { x: cf.x - cf.stairSide * 4.95, z: cf.z, w: 0.26, d: 9.0 },
      ].forEach(function (b) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(b.w, 0.92, b.d), ivoryMat);
        rail.position.set(b.x, cf.deckY + 0.46, b.z);
        townGroup.add(rail);
      });

      // Brass Cliffside Ocean Viewpoint Telescope & Bench
      const tele = new THREE.Group();
      tele.position.set(cf.x, cf.deckY, cf.z + 3.2);
      kit.addMesh(tele, kit.g.cyl1, kit.palette.gold, 0.14, 1.35, 0.14, 0, 0.68, 0);
      kit.addMesh(tele, kit.g.cyl1, kit.palette.brass, 0.12, 0.9, 0.12, 0, 1.35, 0.16, 1.25, 0, 0);
      townGroup.add(tele);
      tagInteractable(tele, cf.id);

      const clSpot = {
        id: cf.id,
        title: cf.title,
        floor: 0,
        category: 'gardens',
        shortcut: true,
        x: cf.x, y: cf.deckY, z: cf.z + 2.0,
        radius: 5.5,
        actions: [
          {
            id: cf.id + '_lookout',
            label: 'Admire Riviera Blue Sea from Cliff Overlook',
            hint: '+20 Poise/s & +18 Fun/s',
            pose: 'stargaze',
            anchor: { x: cf.x, y: cf.deckY, z: cf.z + 2.4, yaw: 0, floorY: cf.deckY, exitX: cf.x, exitZ: cf.z, exitYaw: 0 },
            rates: { composure: 20, fun: 18 },
            statusText: 'Taking in the breathtaking azure Riviera horizon from ' + cf.title + '...',
          },
          {
            id: cf.id + '_photo',
            label: 'Pose for Riviera Cliffside Portrait (+3 Clout)',
            hint: '+22 Fun & +3 Crown Dispatch Clout',
            instant: true,
            onInstant: function (actCtx) {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 22, composure: 16 });
              recordDispatchGossip(actCtx, 'Royal cliffside sunset portrait captured at ' + cf.title + '!', 3, 0);
              actCtx.toast('Captured stunning ocean cliffside portrait! (+3 Clout)');
            },
          },
        ],
      };
      registerSpot(clSpot);
      townDirectory.push(clSpot);
    });

    // District Zones & Extra Streetlights
    townZones.push(
      { minX: -242, maxX: -156, minZ: -6, maxZ: 51, label: 'West Capital District (Bank, Salon, Gym & Library)' },
      { minX: 158, maxX: 242, minZ: -6, maxZ: 51, label: 'East Capital District (Cinema, Offices, Community & Apartments)' },
      { minX: -242, maxX: -220, minZ: 56, maxZ: 72, label: 'Falaise d’Or Sunset Coastal Cliff' },
      { minX: 220, maxX: 242, minZ: 56, maxZ: 72, label: 'Cap Sapphire Sunrise Coastal Cliff' }
    );

    const extraLamps = [
      [-170, 2.8], [-202, 2.8], [-170, 22.0], [-202, 22.0], [-186, 44.8], [-218, 44.8],
      [173.5, 2.8], [206, 2.8], [173.5, 22.0], [206, 22.0], [190, 44.8], [222, 44.8],
    ];
    const exDummy = new THREE.Object3D();
    const exLampPost = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.08, 0.12, 3.6, 8), kit.palette.iron, extraLamps.length);
    const exLampBulb = new THREE.InstancedMesh(new THREE.SphereGeometry(0.22, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffebb8 }), extraLamps.length);
    extraLamps.forEach(function (lp, i) {
      exDummy.position.set(lp[0], 1.8, lp[1]);
      exDummy.rotation.set(0, 0, 0);
      exDummy.scale.set(1, 1, 1);
      exDummy.updateMatrix();
      exLampPost.setMatrixAt(i, exDummy.matrix);
      exDummy.position.set(lp[0], 3.68, lp[1]);
      exDummy.updateMatrix();
      exLampBulb.setMatrixAt(i, exDummy.matrix);
    });
    exLampPost.computeBoundingSphere();
    exLampBulb.computeBoundingSphere();
    townGroup.add(exLampPost, exLampBulb);

    // -----------------------------------------------------------
    // 5. QUERIES: HEIGHTS, 2F APARTMENT COLLISION & DRIVABLE SURFACES
    // -----------------------------------------------------------
    function groundHeightAtExpansion(x, z, yNow) {
      // Belvedere Apartments Exterior Stairs (x in [212.0, 213.9], z: 35.8 [0.12] -> 29.0 [4.12])
      if (x >= 211.9 && x <= 214.1 && z <= 36.2 && z >= 28.4) {
        const t = THREE.MathUtils.clamp((35.6 - z) / 6.4, 0, 1);
        const stY = 0.12 + t * 4.0;
        if (Math.abs(yNow - stY) < 2.2) return stY;
      }
      // Belvedere Apartments 2F Floor & Landing
      if (yNow >= 2.2 && x >= aptCx - aptW * 0.5 && x <= aptCx + aptW * 0.5 + 2.2 && z >= aptCz - aptD * 0.5 && z <= aptCz + aptD * 0.5) {
        return aptY2;
      }
      // West Coastal Cliff & Stairs (stairSide: 1 => x from -221.4 [0.05] to -226.8 [4.0])
      if (x >= -237.4 && x <= -221.2 && z >= 58.2 && z <= 67.8) {
        if (x <= -226.8) return 4.0;
        if (z >= 59.4 && z <= 62.6) {
          const tW = THREE.MathUtils.clamp((-221.4 - x) / 5.4, 0, 1);
          return 0.05 + tW * 3.95;
        }
      }
      // East Coastal Cliff & Stairs (stairSide: -1 => x from 221.4 [0.05] to 226.8 [4.0])
      if (x >= 221.2 && x <= 237.4 && z >= 58.2 && z <= 67.8) {
        if (x >= 226.8) return 4.0;
        if (z >= 59.4 && z <= 62.6) {
          const tE = THREE.MathUtils.clamp((x - 221.4) / 5.4, 0, 1);
          return 0.05 + tE * 3.95;
        }
      }
      return null;
    }

    function isOnUpperFloor(x, z, yNow) {
      return (
        yNow >= 2.2 &&
        x >= aptCx - aptW * 0.5 - 0.5 &&
        x <= aptCx + aptW * 0.5 + 2.4 &&
        z >= aptCz - aptD * 0.5 - 0.5 &&
        z <= aptCz + aptD * 0.5 + 0.5
      );
    }

    function resolveUpperCollision(nx, nz, radius, yNow) {
      if (!isOnUpperFloor(nx, nz, yNow)) return null;
      let rx = THREE.MathUtils.clamp(nx, aptCx - aptW * 0.5 + 0.25, aptCx + aptW * 0.5 + 1.8);
      let rz = THREE.MathUtils.clamp(nz, aptCz - aptD * 0.5 + 0.25, aptCz + aptD * 0.5 - 0.25);
      for (let i = 0; i < apt2FColliders.length; i++) {
        const c = apt2FColliders[i];
        if (c.type === 'circle') {
          const dx = rx - c.x;
          const dz = rz - c.z;
          const md = c.r + radius;
          const dSq = dx * dx + dz * dz;
          if (dSq < md * md && dSq > 0.0001) {
            const d = Math.sqrt(dSq);
            rx = c.x + (dx / d) * md;
            rz = c.z + (dz / d) * md;
          }
        } else {
          const cx = THREE.MathUtils.clamp(rx, c.minX, c.maxX);
          const cz = THREE.MathUtils.clamp(rz, c.minZ, c.maxZ);
          const dx = rx - cx;
          const dz = rz - cz;
          const dSq = dx * dx + dz * dz;
          if (dSq < radius * radius) {
            if (dSq > 0.00001) {
              const d = Math.sqrt(dSq);
              rx = cx + (dx / d) * radius;
              rz = cz + (dz / d) * radius;
            }
          }
        }
      }
      return { x: rx, z: rz };
    }

    function isExtraDrivable(x, z) {
      // Roundabout circular road rings (keep cars out of inner island center!)
      for (let i = 0; i < roundabouts.length; i++) {
        const rb = roundabouts[i];
        const dist = Math.hypot(x - rb.x, z - rb.z);
        if (dist < rb.innerR + 0.35) return false;
        if (dist <= rb.outerR + 0.3) return true;
      }
      // Expanded West Streets (-238..-153.5)
      if (x >= -238.0 && x <= -153.0) {
        if (Math.abs(z - 0.0) <= 2.6 || Math.abs(z - 19.2) <= 2.5 || (z >= 44.8 && z <= 50.8)) return true;
        if ((Math.abs(x - -186.0) <= 2.5 || Math.abs(x - -218.0) <= 2.5) && z >= -2.5 && z <= 50.5) return true;
      }
      // Expanded East Streets (+156.5..+240.0)
      if (x >= 156.0 && x <= 240.0) {
        if (Math.abs(z - 0.0) <= 2.6 || Math.abs(z - 19.2) <= 2.5 || (z >= 44.8 && z <= 50.8)) return true;
        if ((Math.abs(x - 190.0) <= 2.5 || Math.abs(x - 222.0) <= 2.5) && z >= -2.5 && z <= 50.5) return true;
      }
      return false;
    }

    return {
      groundHeightAtExpansion: groundHeightAtExpansion,
      isOnUpperFloor: isOnUpperFloor,
      resolveUpperCollision: resolveUpperCollision,
      isExtraDrivable: isExtraDrivable,
      dispose: function () {
        localMats.forEach(function (m) { m.dispose(); });
      },
    };
  }

  window.CrownKingdomExpansion = {
    build: buildKingdomExpansion,
  };
})();
