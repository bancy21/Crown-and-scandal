(function () {
  'use strict';

  function buildUpperFloors(ctx) {
    const THREE = ctx.THREE;
    const kit = ctx.kit;
    if (!THREE || !kit) return null;

    const palaceRoot = ctx.palaceRoot;
    const ivoryMat = ctx.ivoryMat;
    const wingFacadeMat = ctx.wingFacadeMat;
    const pavFacadeMat = ctx.pavFacadeMat;
    const marbleMat = ctx.marbleMat;
    const parquetMat = ctx.parquetMat;
    const goldMat = ctx.goldMat;
    const blushRugMat = ctx.blushRugMat;
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

    const floorGroups = {};
    const frontCutaways = {};
    const floorColliders = { 4: [], 5: [], 6: [], 7: [] };

    [4, 5, 6, 7].forEach(function (f) {
      floorGroups[f] = new THREE.Group();
      frontCutaways[f] = new THREE.Group();
      palaceRoot.add(floorGroups[f], frontCutaways[f]);
    });

    // Helper: Build floor slab leaving optional rectangular stair hole open
    function addFloorSlabWithOpening(parent, floorY, mat, hole) {
      if (!hole) {
        const slab = new THREE.Mesh(new THREE.PlaneGeometry(61.0, 21.4), mat);
        slab.rotation.x = -Math.PI / 2;
        slab.position.set(0, floorY, -28.0);
        parent.add(slab);
        return;
      }
      // North strip behind stair (z: -38.6 .. hole.zMin)
      const nDepth = hole.zMin - -38.6;
      if (nDepth > 0.1) {
        const nSlab = new THREE.Mesh(new THREE.PlaneGeometry(61.0, nDepth), mat);
        nSlab.rotation.x = -Math.PI / 2;
        nSlab.position.set(0, floorY, -38.6 + nDepth * 0.5);
        parent.add(nSlab);
      }
      // South strip in front of stair (z: hole.zMax .. -17.4)
      const sDepth = -17.4 - hole.zMax;
      if (sDepth > 0.1) {
        const sSlab = new THREE.Mesh(new THREE.PlaneGeometry(61.0, sDepth), mat);
        sSlab.rotation.x = -Math.PI / 2;
        sSlab.position.set(0, floorY, hole.zMax + sDepth * 0.5);
        parent.add(sSlab);
      }
      // West strip left of hole (x: -30.5 .. hole.xMin)
      const hDepth = hole.zMax - hole.zMin;
      const hZ = (hole.zMin + hole.zMax) * 0.5;
      const wWidth = hole.xMin - -30.5;
      if (wWidth > 0.1) {
        const wSlab = new THREE.Mesh(new THREE.PlaneGeometry(wWidth, hDepth), mat);
        wSlab.rotation.x = -Math.PI / 2;
        wSlab.position.set(-30.5 + wWidth * 0.5, floorY, hZ);
        parent.add(wSlab);
      }
      // East strip right of hole (x: hole.xMax .. 30.5)
      const eWidth = 30.5 - hole.xMax;
      if (eWidth > 0.1) {
        const eSlab = new THREE.Mesh(new THREE.PlaneGeometry(eWidth, hDepth), mat);
        eSlab.rotation.x = -Math.PI / 2;
        eSlab.position.set(hole.xMax + eWidth * 0.5, floorY, hZ);
        parent.add(eSlab);
      }
    }

    // Helper: Build Baroque Front Facade Cutaway Row for floor f
    function addFacadeCutawayRow(targetGrp, colList, centerY) {
      [
        { x: -26.0, z: -17.4, w: 10.0, d: 1.2, mat: pavFacadeMat },
        { x: -16.0, z: -18.0, w: 10.0, d: 0.7, mat: wingFacadeMat },
        { x: -7.8, z: -17.2, w: 7.4, d: 1.2, mat: pavFacadeMat },
        { x: 7.8, z: -17.2, w: 7.4, d: 1.2, mat: pavFacadeMat },
        { x: 16.0, z: -18.0, w: 10.0, d: 0.7, mat: wingFacadeMat },
        { x: 26.0, z: -17.4, w: 10.0, d: 1.2, mat: pavFacadeMat },
      ].forEach(function (seg) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(seg.w, 5.0, seg.d), seg.mat);
        wall.position.set(seg.x, centerY, seg.z);
        targetGrp.add(wall);
        addBox(colList, seg.x, seg.z, seg.w, seg.d + 0.2);
      });
    }

    // Helper: Stair Flight along X from bottomX to topX at zCenter
    function addHorizontalStairFlight(parent, colList, floorY, bottomX, topX, zCenter) {
      const steps = 14;
      const dir = topX > bottomX ? 1 : -1;
      for (let i = 0; i < steps; i++) {
        const t = i / (steps - 1);
        const sx = bottomX + (topX - bottomX) * t;
        const sy = floorY + 0.18 + t * 4.72;
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.35, 2.3), marbleMat);
        st.position.set(sx, sy, zCenter);
        parent.add(st);
      }
      const midX = (bottomX + topX) * 0.5;
      const midY = floorY + 3.05;
      const span = Math.abs(topX - bottomX) + 0.8;
      [-1.25, 1.25].forEach(function (dz) {
        const rail = new THREE.Mesh(new THREE.BoxGeometry(span, 0.78, 0.16), goldMat);
        rail.position.set(midX, midY, zCenter + dz);
        rail.rotation.z = dir * 0.58;
        parent.add(rail);
        addBox(colList, midX, zCenter + dz, span, 0.32);
      });
    }

    // Golden Royal Palace Elevator / Lift Doors on ALL 7 Floors (x = -5.6, z = -23.8 on corridor side)
    const floorLiftLevels = [
      { f: 1, label: '1F Palace Lobby & Dining', x: 0, z: -20.5, y: 0.65 },
      { f: 2, label: '2F Princess & Queen Suites', x: 0, z: -20.8, y: 5.65 },
      { f: 3, label: '3F Mansard Games & Reading', x: 0.2, z: -21.8, y: 10.65 },
      { f: 4, label: '4F Royal Treasury & Crown Vault', x: 0, z: -21.2, y: 15.65 },
      { f: 5, label: '5F Spa Conservatory & Ambassadors', x: 0, z: -21.2, y: 20.65 },
      { f: 6, label: '6F Grand Theatre & Music Hall', x: 0, z: -21.2, y: 25.65 },
      { f: 7, label: '7F Sky Penthouse & Observatory', x: 0, z: -21.2, y: 30.65 },
    ];

    function buildLiftActions(curFloor) {
      return floorLiftLevels
        .filter(function (lv) {
          return lv.f !== curFloor;
        })
        .map(function (lv) {
          return {
            id: 'lift_' + curFloor + '_to_' + lv.f,
            label: 'Take Golden Lift to ' + lv.label,
            hint: 'Instant Palace Elevator Ride',
            instant: true,
            onInstant: function (actCtx) {
              actCtx.playerCtrl.teleport(lv.x, lv.z, Math.PI, lv.y);
              actCtx.toast('Arrived at ' + lv.label);
            },
          };
        });
    }

    floorLiftLevels.forEach(function (lv) {
      const hostGrp =
        lv.f === 1 ? ctx.floor1Group :
        lv.f === 2 ? ctx.floor2Group :
        lv.f === 3 ? ctx.floor3Group : floorGroups[lv.f];
      const colArr =
        lv.f === 1 ? ctx.floor1Colliders :
        lv.f === 2 ? ctx.floor2Colliders :
        lv.f === 3 ? ctx.floor3Colliders : floorColliders[lv.f];
      if (!hostGrp) return;

      const liftX = -7.6;
      const liftZ = -24.55;
      const cab = new THREE.Group();
      cab.position.set(liftX, lv.y, liftZ);
      kit.addMesh(cab, kit.g.cushion, kit.palette.gold, 2.2, 3.6, 0.36, 0, 1.8, 0);
      kit.addMesh(cab, kit.g.box1, kit.palette.brass, 0.85, 3.1, 0.4, -0.46, 1.65, 0.04);
      kit.addMesh(cab, kit.g.box1, kit.palette.brass, 0.85, 3.1, 0.4, 0.46, 1.65, 0.04);
      kit.addMesh(cab, kit.g.cyl1, kit.palette.gold, 0.24, 0.14, 0.24, 0, 3.55, 0.2, Math.PI * 0.5, 0, 0);
      hostGrp.add(cab);
      const liftId = 'royal_lift_' + lv.f;
      tagInteractable(cab, liftId);
      addBox(colArr, liftX, liftZ, 2.2, 0.5);
      registerSpot({
        id: liftId,
        title: 'Golden Royal Palace Lift (' + lv.f + 'F)',
        floor: lv.f,
        category: 'floors',
        shortcut: lv.f === 1 || lv.f === 4 || lv.f === 7,
        x: liftX,
        y: lv.y,
        z: liftZ,
        radius: 3.6,
        actions: buildLiftActions(lv.f),
      });
    });

    // -----------------------------------------------------------
    // STAIR 3F -> 4F (West Gallery: x = -13.5 up to -20.5, z = -22.2)
    // -----------------------------------------------------------
    addHorizontalStairFlight(ctx.floor3Group, ctx.floor3Colliders, 10.65, -13.5, -20.5, -22.2);

    // -----------------------------------------------------------
    // FLOOR 4 (y = 15.65): ROYAL TREASURY, CROWN VAULT & GALA SALON (Beds #16-#17, Toilet #8)
    // -----------------------------------------------------------
    const f4G = floorGroups[4];
    const f4C = floorColliders[4];
    const y4 = 15.65;
    addFloorSlabWithOpening(f4G, y4, parquetMat, { xMin: -21.0, xMax: -13.0, zMin: -23.5, zMax: -20.9 });
    addBox(f4C, -17.0, -20.75, 8.2, 0.3);
    addBox(f4C, -17.0, -23.65, 8.2, 0.3);
    addWallX(f4G, f4C, y4, 5.0, -38.6, -30.6, 30.6, null, 0, 0.7, wingFacadeMat);
    addWallZ(f4G, f4C, y4, 5.0, -30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addWallZ(f4G, f4C, y4, 5.0, 30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addFacadeCutawayRow(frontCutaways[4], f4C, 18.15);

    // 4F Partitions
    addWallX(f4G, f4C, y4, 4.9, -25.2, -30.4, -10.5, -20.5, 2.8, 0.3, ivoryMat);
    addWallX(f4G, f4C, y4, 4.9, -25.2, -10.5, 8.0, -1.2, 3.0, 0.3, ivoryMat);
    addWallX(f4G, f4C, y4, 4.9, -25.2, 8.0, 21.5, 14.5, 2.4, 0.3, ivoryMat);
    addWallX(f4G, f4C, y4, 4.9, -25.2, 21.5, 30.4, 25.5, 2.2, 0.3, ivoryMat);
    addWallZ(f4G, f4C, y4, 4.9, -10.5, -38.4, -25.2, null, 0, 0.28, ivoryMat);
    addWallZ(f4G, f4C, y4, 4.9, 8.0, -38.4, -25.2, null, 0, 0.28, ivoryMat);
    addWallZ(f4G, f4C, y4, 4.9, 21.5, -38.4, -25.2, null, 0, 0.28, ivoryMat);

    // Stair 4F -> 5F (East Gallery: x = +12.5 up to +19.5, z = -22.2)
    addHorizontalStairFlight(f4G, f4C, y4, 12.5, 19.5, -22.2);

    // 4F Gala Salon & Crown Jewel Vault
    const rug4 = new THREE.Mesh(new THREE.PlaneGeometry(11.0, 6.2), blushRugMat);
    rug4.rotation.x = -Math.PI / 2;
    rug4.position.set(0, y4 + 0.02, -31.8);
    f4G.add(rug4);
    const ch4 = kit.buildChandelier(1.1);
    ch4.position.set(0, y4 + 4.1, -31.8);
    f4G.add(ch4);

    // Royal Crown Jewel Display Case (4F West Vault x = -22, z = -33)
    const vaultGrp = new THREE.Group();
    vaultGrp.position.set(-22.0, y4 + 0.02, -33.0);
    kit.addMesh(vaultGrp, kit.g.cushion, kit.palette.gold, 2.2, 0.95, 1.5, 0, 0.48, 0);
    kit.addMesh(vaultGrp, kit.g.cushion, kit.palette.fabricColors.crimson, 1.85, 0.14, 1.2, 0, 1.0, 0);
    kit.addMesh(vaultGrp, kit.g.torus1, kit.palette.gold, 0.55, 0.55, 0.35, -0.4, 1.15, 0, Math.PI * 0.5, 0, 0);
    kit.addMesh(vaultGrp, kit.g.sphere1, kit.palette.fabricColors.sapphire, 0.24, 0.32, 0.24, 0.42, 1.2, 0);
    kit.addMesh(vaultGrp, kit.g.box1, kit.palette.crystal, 2.1, 0.85, 1.4, 0, 1.4, 0);
    f4G.add(vaultGrp);
    tagInteractable(vaultGrp, 'crown_vault_4f');
    addBox(f4C, -22.0, -33.0, 2.4, 1.7);
    registerSpot({
      id: 'crown_vault_4f',
      title: '4F Royal Crown Treasury Vault',
      floor: 4,
      category: 'living',
      shortcut: true,
      x: -22.0, y: y4, z: -33.0,
      radius: 3.5,
      actions: [
        {
          id: 'inspect_jewels_4f',
          label: 'Inspect Dynasty Crown Jewels',
          hint: '+16 Poise & Crown Dispatch Clout',
          instant: true,
          onInstant: function (actCtx) {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 16, fun: 10 });
            if (actCtx.game && actCtx.game.reputation) actCtx.game.reputation.clout = Math.min(100, (actCtx.game.reputation.clout || 50) + 3);
            actCtx.toast('The Sapphire Diadem gleams! (+16 Poise, +3 Clout)');
          },
        },
      ],
    });

    placeSofa(f4G, f4C, { id: 'sofa_4f', title: '4F Gala Salon Sofa', floor: 4, x: 0, y: y4 + 0.02, z: -34.2, yaw: 0, tone: 'crimson', w: 2.8 });
    placeBed(f4G, f4C, { id: 'bed_16', title: 'Bedroom #16 (Ruby Regency 4F)', floor: 4, canopy: true, x: 14.8, y: y4 + 0.02, z: -34.2, yaw: 0, tone: 'crimson', w: 2.3, d: 2.8 });
    placeBed(f4G, f4C, { id: 'bed_17', title: 'Bedroom #17 (Diamond State 4F)', floor: 4, x: 26.8, y: y4 + 0.02, z: -34.2, yaw: 0, tone: 'champagne', w: 2.1, d: 2.7 });
    placeToilet(f4G, f4C, { id: 'toilet_8', title: '4F Treasury Suite Toilet #8', floor: 4, x: -28.6, y: y4 + 0.02, z: -36.0, yaw: Math.PI * 0.5 });
    placeVanitySink(f4G, f4C, { id: 'sink_8', title: '4F Treasury Vanity', floor: 4, x: -28.6, y: y4 + 0.02, z: -32.8, yaw: Math.PI * 0.5 });

    // -----------------------------------------------------------
    // FLOOR 5 (y = 20.65): AMBASSADORS' WING & ROYAL SPA CONSERVATORY (Beds #18-#19, Toilet #9)
    // -----------------------------------------------------------
    const f5G = floorGroups[5];
    const f5C = floorColliders[5];
    const y5 = 20.65;
    addFloorSlabWithOpening(f5G, y5, marbleMat, { xMin: 12.0, xMax: 20.0, zMin: -23.5, zMax: -20.9 });
    addBox(f5C, 16.0, -20.75, 8.2, 0.3);
    addBox(f5C, 16.0, -23.65, 8.2, 0.3);
    addWallX(f5G, f5C, y5, 5.0, -38.6, -30.6, 30.6, null, 0, 0.7, wingFacadeMat);
    addWallZ(f5G, f5C, y5, 5.0, -30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addWallZ(f5G, f5C, y5, 5.0, 30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addFacadeCutawayRow(frontCutaways[5], f5C, 23.15);

    addWallX(f5G, f5C, y5, 4.9, -25.2, -30.4, -10.5, -20.5, 2.8, 0.3, ivoryMat);
    addWallX(f5G, f5C, y5, 4.9, -25.2, -10.5, 10.5, 0, 3.0, 0.3, ivoryMat);
    addWallX(f5G, f5C, y5, 4.9, -25.2, 10.5, 30.4, 20.5, 2.8, 0.3, ivoryMat);
    addWallZ(f5G, f5C, y5, 4.9, -10.5, -38.4, -25.2, null, 0, 0.28, ivoryMat);
    addWallZ(f5G, f5C, y5, 4.9, 10.5, -38.4, -25.2, null, 0, 0.28, ivoryMat);

    // Stair 5F -> 6F (West Gallery: x = -13.5 up to -20.5, z = -22.2)
    addHorizontalStairFlight(f5G, f5C, y5, -13.5, -20.5, -22.2);

    // 5F Rosewater Spa Thermal Plunge Pool (x = -21.5, z = -33.2)
    const spaGrp = new THREE.Group();
    spaGrp.position.set(-21.5, y5 + 0.02, -33.2);
    kit.addMesh(spaGrp, kit.g.cushion, kit.palette.creamMarble, 5.4, 0.56, 4.2, 0, 0.28, 0);
    const spaWaterMat = kit.keepMat(new THREE.MeshPhysicalMaterial({ color: 0x6cd8e8, roughness: 0.1, transparent: true, opacity: 0.78, clearcoat: 0.9 }));
    kit.addMesh(spaGrp, kit.g.box1, spaWaterMat, 4.6, 0.08, 3.4, 0, 0.55, 0);
    f5G.add(spaGrp);
    tagInteractable(spaGrp, 'spa_pool_5f');
    addBox(f5C, -21.5, -33.2, 5.4, 4.2);
    registerSpot({
      id: 'spa_pool_5f',
      title: '5F Rosewater Thermal Spa Plunge',
      floor: 5,
      category: 'toilets',
      shortcut: true,
      x: -21.5, y: y5, z: -33.2,
      radius: 4.5,
      actions: [
        {
          id: 'swim_spa_5f',
          label: 'Soak & Swim in Thermal Spa',
          hint: '+18 Hygiene/s & +10 Energy/s',
          pose: 'swim',
          anchor: { x: -21.5, y: y5 + 0.28, z: -33.2, yaw: Math.PI * 0.5, rigOffsetY: 0.14, floorY: y5, exitX: -21.5, exitZ: -29.8, exitYaw: 0 },
          rates: { hygiene: 18, energy: 10, composure: 9 },
          statusText: 'Floating blissfully in the 5F mineral spa pool...',
        },
      ],
    });

    // 5F Diplomatic Council Chamber & Palm Conservatory
    const confTable = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.12, 24), kit.palette.mahogany);
    confTable.position.set(0, y5 + 0.78, -32.2);
    f5G.add(confTable);
    const confPed = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.1, 0.75, 16), goldMat);
    confPed.position.set(0, y5 + 0.38, -32.2);
    f5G.add(confPed);
    addCircle(f5C, 0, -32.2, 2.2);
    [[-3.0, -32.2, Math.PI * 0.5], [3.0, -32.2, -Math.PI * 0.5], [0, -35.2, 0]].forEach(function (cp) {
      const dc = kit.buildDiningChair('emerald', false);
      dc.position.set(cp[0], y5 + 0.02, cp[1]);
      dc.rotation.y = cp[2];
      f5G.add(dc);
    });
    const spaPlant1 = kit.buildPedestalPlant(true);
    spaPlant1.position.set(-14.0, y5 + 0.02, -37.2);
    f5G.add(spaPlant1);

    placeBed(f5G, f5C, { id: 'bed_18', title: 'Bedroom #18 (Ambassador Gold 5F)', floor: 5, x: 18.0, y: y5 + 0.02, z: -34.2, yaw: 0, tone: 'emerald', w: 2.3, d: 2.8 });
    placeBed(f5G, f5C, { id: 'bed_19', title: 'Bedroom #19 (Versailles Rose 5F)', floor: 5, x: 26.8, y: y5 + 0.02, z: -34.2, yaw: 0, tone: 'rose', w: 2.1, d: 2.7 });
    placeToilet(f5G, f5C, { id: 'toilet_9', title: '5F Spa Toilet #9', floor: 5, x: -28.8, y: y5 + 0.02, z: -36.5, yaw: Math.PI * 0.5 });

    // -----------------------------------------------------------
    // FLOOR 6 (y = 25.65): GRAND THEATRE STAGE & MUSIC CONSERVATORY (Beds #20-#21, Toilet #10)
    // -----------------------------------------------------------
    const f6G = floorGroups[6];
    const f6C = floorColliders[6];
    const y6 = 25.65;
    addFloorSlabWithOpening(f6G, y6, parquetMat, { xMin: -21.0, xMax: -13.0, zMin: -23.5, zMax: -20.9 });
    addBox(f6C, -17.0, -20.75, 8.2, 0.3);
    addBox(f6C, -17.0, -23.65, 8.2, 0.3);
    addWallX(f6G, f6C, y6, 5.0, -38.6, -30.6, 30.6, null, 0, 0.7, wingFacadeMat);
    addWallZ(f6G, f6C, y6, 5.0, -30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addWallZ(f6G, f6C, y6, 5.0, 30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addFacadeCutawayRow(frontCutaways[6], f6C, 28.15);

    addWallX(f6G, f6C, y6, 4.9, -25.2, -30.4, 8.0, 0, 3.4, 0.3, ivoryMat);
    addWallX(f6G, f6C, y6, 4.9, -25.2, 8.0, 30.4, 19.0, 2.6, 0.3, ivoryMat);
    addWallZ(f6G, f6C, y6, 4.9, 8.0, -38.4, -25.2, null, 0, 0.28, ivoryMat);

    // Stair 6F -> 7F (East Gallery: x = +12.5 up to +19.5, z = -22.2)
    addHorizontalStairFlight(f6G, f6C, y6, 12.5, 19.5, -22.2);

    // 6F Royal Theatre Stage & Velvet Curtains (West Hall x = -18, z = -34)
    const stageGrp = new THREE.Group();
    stageGrp.position.set(-18.0, y6 + 0.02, -34.2);
    kit.addMesh(stageGrp, kit.g.cushion, kit.palette.mahogany, 10.5, 0.45, 5.2, 0, 0.22, 0);
    kit.addMesh(stageGrp, kit.g.cushion, kit.palette.gold, 10.7, 0.08, 5.4, 0, 0.46, 0);
    const stageCurtain = kit.buildCurtainPair('crimson', 9.2, 3.8);
    stageCurtain.position.set(0, 0.45, -2.0);
    stageGrp.add(stageCurtain);
    f6G.add(stageGrp);
    tagInteractable(stageGrp, 'theatre_stage_6f');
    registerSpot({
      id: 'theatre_stage_6f',
      title: '6F Royal Velvet Theatre Stage',
      floor: 6,
      category: 'living',
      shortcut: true,
      x: -18.0, y: y6, z: -34.2,
      radius: 4.8,
      actions: [
        {
          id: 'perform_stage_6f',
          label: 'Perform Opera & Royal Waltz on Stage',
          hint: '+18 Fun/s & +12 Poise/s',
          pose: 'dance',
          anchor: { x: -18.0, y: y6 + 0.5, z: -33.6, yaw: 0, floorY: y6, exitX: -18.0, exitZ: -30.0, exitYaw: 0 },
          rates: { fun: 18, composure: 12 },
          statusText: 'Commanding the royal spotlight upon the 6F Theatre Stage...',
        },
      ],
    });
    // Audience Velvet Chairs
    [-21.0, -18.0, -15.0].forEach(function (ax, ai) {
      placeArmchair(f6G, f6C, { id: 'theatre_seat_' + ai, title: 'Royal Theatre Velvet Seat', floor: 6, x: ax, y: y6 + 0.02, z: -28.6, yaw: Math.PI, tone: 'crimson' });
    });

    placeBed(f6G, f6C, { id: 'bed_20', title: 'Bedroom #20 (Prima Donna Suite 6F)', floor: 6, x: 14.5, y: y6 + 0.02, z: -34.2, yaw: 0, tone: 'lavender', w: 2.3, d: 2.8 });
    placeBed(f6G, f6C, { id: 'bed_21', title: 'Bedroom #21 (Sapphire Loggia 6F)', floor: 6, x: 26.5, y: y6 + 0.02, z: -34.2, yaw: 0, tone: 'sapphire', w: 2.1, d: 2.7 });
    placeToilet(f6G, f6C, { id: 'toilet_10', title: '6F Theatre Dressing Toilet #10', floor: 6, x: -28.8, y: y6 + 0.02, z: -36.5, yaw: Math.PI * 0.5 });

    // -----------------------------------------------------------
    // FLOOR 7 (y = 30.65): CROWN HEIRESS SKY PENTHOUSE & STARLIGHT OBSERVATORY (Bed #22, Toilet #11)
    // -----------------------------------------------------------
    const f7G = floorGroups[7];
    const f7C = floorColliders[7];
    const y7 = 30.65;
    addFloorSlabWithOpening(f7G, y7, marbleMat, { xMin: 12.0, xMax: 20.0, zMin: -23.5, zMax: -20.9 });
    addBox(f7C, 16.0, -20.75, 8.2, 0.3);
    addBox(f7C, 16.0, -23.65, 8.2, 0.3);
    addWallX(f7G, f7C, y7, 4.2, -38.6, -30.6, 30.6, null, 0, 0.7, wingFacadeMat);
    addWallZ(f7G, f7C, y7, 4.2, -30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addWallZ(f7G, f7C, y7, 4.2, 30.6, -38.6, -17.4, null, 0, 0.7, pavFacadeMat);
    addFacadeCutawayRow(frontCutaways[7], f7C, 32.8);

    addWallX(f7G, f7C, y7, 4.0, -25.2, -30.4, -10.5, -20.5, 2.8, 0.28, ivoryMat);
    addWallZ(f7G, f7C, y7, 4.0, -10.5, -38.4, -25.2, null, 0, 0.28, ivoryMat);

    const ch7 = kit.buildChandelier(1.3);
    ch7.position.set(0, y7 + 3.6, -31.8);
    f7G.add(ch7);

    // 7F Starlight Brass Observatory Telescope (Center Sky Lounge x = 0, z = -34)
    const teleGrp = new THREE.Group();
    teleGrp.position.set(0, y7 + 0.02, -33.5);
    kit.addMesh(teleGrp, kit.g.cyl1, kit.palette.mahogany, 0.09, 1.35, 0.09, -0.32, 0.65, 0.22, 0.25, 0, -0.2);
    kit.addMesh(teleGrp, kit.g.cyl1, kit.palette.mahogany, 0.09, 1.35, 0.09, 0.32, 0.65, 0.22, 0.25, 0, 0.2);
    kit.addMesh(teleGrp, kit.g.cyl1, kit.palette.mahogany, 0.09, 1.35, 0.09, 0, 0.65, -0.32, -0.28, 0, 0);
    kit.addMesh(teleGrp, kit.g.cyl1, kit.palette.gold, 0.16, 1.65, 0.16, 0, 1.48, 0.15, 1.05, 0, 0);
    kit.addMesh(teleGrp, kit.g.cyl1, kit.palette.brass, 0.22, 0.22, 0.22, 0, 1.85, 0.78, 1.05, 0, 0);
    f7G.add(teleGrp);
    tagInteractable(teleGrp, 'telescope_7f');
    addCircle(f7C, 0, -33.5, 0.85);
    registerSpot({
      id: 'telescope_7f',
      title: '7F Royal Starlight Telescope & Lookout',
      floor: 7,
      category: 'living',
      shortcut: true,
      x: 0, y: y7, z: -33.5,
      radius: 3.6,
      actions: [
        {
          id: 'stargaze_7f',
          label: 'Stargaze & Survey Riviera Kingdom',
          hint: '+16 Fun/s & +14 Poise/s',
          pose: 'stargaze',
          anchor: { x: 0, y: y7 + 0.02, z: -34.65, yaw: 0, floorY: y7, exitX: 0, exitZ: -35.2, exitYaw: 0 },
          rates: { fun: 16, composure: 14 },
          statusText: 'Surveying the sparkling Riviera coast from the 7F Penthouse Observatory...',
        },
      ],
    });

    placeBed(f7G, f7C, { id: 'bed_22', title: 'Bedroom #22 (7F Sky Penthouse Canopy)', floor: 7, canopy: true, shortcut: true, x: -20.5, y: y7 + 0.02, z: -34.2, yaw: 0, tone: 'rose', w: 2.6, d: 3.0 });
    placeSofa(f7G, f7C, { id: 'sofa_7f', title: '7F Penthouse Sky Lounge Sofa', floor: 7, x: 9.0, y: y7 + 0.02, z: -33.2, yaw: 0, tone: 'champagne', w: 2.8 });
    placeArmchair(f7G, f7C, { id: 'chair_7f', title: '7F Observatory Reading Chair', floor: 7, x: -4.2, y: y7 + 0.02, z: -31.8, yaw: Math.PI * 0.5, tone: 'rose' });
    placeToilet(f7G, f7C, { id: 'toilet_11', title: '7F Penthouse Bath Toilet #11', floor: 7, x: -28.6, y: y7 + 0.02, z: -36.5, yaw: Math.PI * 0.5 });
    placeVanitySink(f7G, f7C, { id: 'sink_11', title: '7F Sky Penthouse Marble Vanity', floor: 7, x: -28.6, y: y7 + 0.02, z: -32.8, yaw: Math.PI * 0.5 });

    // Ground height helper strictly for stairs 3->4, 4->5, 5->6, 6->7 + floors 4..7
    function groundHeightAtUpper(x, z, yNow) {
      // Stair 6F -> 7F (x: 12.5 [25.65] -> 19.5 [30.65], z in [-23.4 .. -21.0])
      if (x >= 12.2 && x <= 19.8 && z <= -20.9 && z >= -23.5 && yNow >= 23.2) {
        const t7 = THREE.MathUtils.clamp((x - 12.5) / 7.0, 0, 1);
        const stair7Y = 25.65 + t7 * 5.0;
        if (Math.abs(yNow - stair7Y) < 2.5) return stair7Y;
      }
      // Floor 7 (y = 30.65)
      if (yNow >= 28.2 && Math.abs(x) <= 30.6 && z <= -17.2 && z >= -38.6) return 30.65;

      // Stair 5F -> 6F (x: -13.5 [20.65] -> -20.5 [25.65], z in [-23.4 .. -21.0])
      if (x <= -13.2 && x >= -20.8 && z <= -20.9 && z >= -23.5 && yNow >= 18.2 && yNow < 28.2) {
        const t6 = THREE.MathUtils.clamp((-13.5 - x) / 7.0, 0, 1);
        const stair6Y = 20.65 + t6 * 5.0;
        if (Math.abs(yNow - stair6Y) < 2.5) return stair6Y;
      }
      // Floor 6 (y = 25.65)
      if (yNow >= 23.2 && Math.abs(x) <= 30.6 && z <= -17.2 && z >= -38.6) return 25.65;

      // Stair 4F -> 5F (x: 12.5 [15.65] -> 19.5 [20.65], z in [-23.4 .. -21.0])
      if (x >= 12.2 && x <= 19.8 && z <= -20.9 && z >= -23.5 && yNow >= 13.2 && yNow < 23.2) {
        const t5 = THREE.MathUtils.clamp((x - 12.5) / 7.0, 0, 1);
        const stair5Y = 15.65 + t5 * 5.0;
        if (Math.abs(yNow - stair5Y) < 2.5) return stair5Y;
      }
      // Floor 5 (y = 20.65)
      if (yNow >= 18.2 && Math.abs(x) <= 30.6 && z <= -17.2 && z >= -38.6) return 20.65;

      // Stair 3F -> 4F (x: -13.5 [10.65] -> -20.5 [15.65], z in [-23.4 .. -21.0])
      if (x <= -13.2 && x >= -20.8 && z <= -20.9 && z >= -23.5 && yNow >= 8.2 && yNow < 18.2) {
        const t4 = THREE.MathUtils.clamp((-13.5 - x) / 7.0, 0, 1);
        const stair4Y = 10.65 + t4 * 5.0;
        if (Math.abs(yNow - stair4Y) < 2.5) return stair4Y;
      }
      // Floor 4 (y = 15.65)
      if (yNow >= 13.2 && Math.abs(x) <= 30.6 && z <= -17.2 && z >= -38.6) return 15.65;

      return null;
    }

    function getColliderFloor(yNow) {
      if (yNow >= 28.2) return { floor: 7, list: floorColliders[7] };
      if (yNow >= 23.2) return { floor: 6, list: floorColliders[6] };
      if (yNow >= 18.2) return { floor: 5, list: floorColliders[5] };
      if (yNow >= 13.2) return { floor: 4, list: floorColliders[4] };
      return null;
    }

    function setUpperCutaway(activeLevel, isExterior) {
      [4, 5, 6, 7].forEach(function (f) {
        if (isExterior) {
          floorGroups[f].visible = true;
          frontCutaways[f].visible = true;
        } else {
          floorGroups[f].visible = activeLevel >= f;
          frontCutaways[f].visible = activeLevel > f;
        }
      });
    }

    function detectUpperZone(pos) {
      if (pos.y >= 28.2) return '7F Sky Penthouse & Starlight Observatory';
      if (pos.y >= 23.2) return '6F Grand Theatre & Music Conservatory';
      if (pos.y >= 18.2) return '5F Rosewater Spa & Ambassadors Wing';
      if (pos.y >= 13.2) return '4F Royal Treasury & Gala Salon';
      return null;
    }

    return {
      groundHeightAtUpper: groundHeightAtUpper,
      getColliderFloor: getColliderFloor,
      setUpperCutaway: setUpperCutaway,
      detectUpperZone: detectUpperZone,
    };
  }

  window.CrownPalaceUpper = {
    build: buildUpperFloors,
  };
})();
