(function () {
  'use strict';

  function furnishPalaceRooms(ctx) {
    const THREE = ctx.THREE;
    const kit = ctx.kit;
    if (!THREE || !kit) return;

    const floor1Group = ctx.floor1Group;
    const floor1Colliders = ctx.floor1Colliders;
    const floor2Group = ctx.floor2Group;
    const floor2Colliders = ctx.floor2Colliders;
    const floor3Group = ctx.floor3Group;
    const floor3Colliders = ctx.floor3Colliders;
    const addBox = ctx.addBox;
    const addCircle = ctx.addCircle;
    const tagInteractable = ctx.tagInteractable;
    const registerSpot = ctx.registerSpot;
    const localToWorld = ctx.localToWorld;

    function addArt(parent, x, y, z, yaw, variant, w, h) {
      const art = kit.buildWallArt(variant, w || 1.4, h || 1.65);
      art.position.set(x, y, z);
      art.rotation.y = yaw || 0;
      parent.add(art);
    }

    function addDrapes(parent, x, y, z, yaw, tone, spanW, h) {
      const dr = kit.buildCurtainPair(tone, spanW || 2.4, h || 3.6);
      dr.position.set(x, y, z);
      dr.rotation.y = yaw || 0;
      parent.add(dr);
    }

    function addChandelier(parent, x, y, z, scale) {
      const ch = kit.buildChandelier(scale || 1.0);
      ch.position.set(x, y, z);
      parent.add(ch);
    }

    function addPlant(parent, colList, x, y, z, tall) {
      const pl = kit.buildPedestalPlant(Boolean(tall));
      pl.position.set(x, y, z);
      parent.add(pl);
      if (colList) addCircle(colList, x, z, 0.34);
    }

    function addChest(parent, colList, id, x, y, z, yaw, tone, rustic) {
      const ch = kit.buildChestOfDrawers(id, tone, Boolean(rustic));
      ch.position.set(x, y, z);
      ch.rotation.y = yaw || 0;
      parent.add(ch);
      if (colList) addBox(colList, x, z, 0.95, 0.65);
    }

    function addTowelStand(parent, colList, x, y, z, yaw) {
      const st = kit.buildBathTowelStand();
      st.position.set(x, y, z);
      if (yaw) st.rotation.y = yaw;
      parent.add(st);
      if (colList) addBox(colList, x, z, yaw ? 0.45 : 0.7, yaw ? 0.7 : 0.45);
    }

    function addWardrobeSpot(parent, colList, id, title, floor, x, y, z, yaw) {
      const wd = kit.buildWardrobe(id, false);
      wd.position.set(x, y, z);
      wd.rotation.y = yaw || 0;
      parent.add(wd);
      tagInteractable(wd, id);
      if (colList) addBox(colList, x, z, 1.35, 0.72);
      const stand = localToWorld(x, z, yaw || 0, 0, 0.95);
      registerSpot({
        id: id,
        title: title,
        floor: floor,
        category: 'living',
        x: x,
        y: y,
        z: z,
        radius: 2.8,
        actions: [
          {
            id: id + '_dress',
            label: 'Open Wardrobe (Change Gown & Style)',
            hint: 'Enter Atelier wardrobe customization',
            instant: true,
            onInstant: function () {
              if (window.CrownSave) window.CrownSave.save(true);
              window.CrownMenu.go('creator');
            },
          },
          {
            id: id + '_freshen',
            label: 'Adjust Tiara & Silk Sash',
            hint: 'Instant +16 Poise & +10 Hygiene',
            instant: true,
            onInstant: function (actCtx) {
              if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 16, hygiene: 10 });
              actCtx.toast('Immaculate royal attire! (+16 Poise, +10 Bath)');
            },
          },
        ],
        _stand: stand,
      });
    }

    function addVanitySpot(parent, colList, id, title, floor, x, y, z, yaw, tone) {
      const vn = kit.buildDressingVanity(id, tone);
      vn.position.set(x, y, z);
      vn.rotation.y = yaw || 0;
      parent.add(vn);
      tagInteractable(vn, id);
      if (colList) addBox(colList, x, z, 1.25, 0.7);
      const sit = localToWorld(x, z, yaw || 0, 0, 0.62);
      const ex = localToWorld(x, z, yaw || 0, 0, 1.28);
      registerSpot({
        id: id,
        title: title,
        floor: floor,
        category: 'living',
        x: x,
        y: y,
        z: z,
        radius: 3.0,
        actions: [
          {
            id: id + '_powder',
            label: 'Powder Nose & Spritz Perfume',
            hint: '+14 Poise/s & +10 Hygiene/s',
            pose: 'powder',
            anchor: {
              x: sit.x, y: y + 0.06, z: sit.z, yaw: (yaw || 0) + Math.PI, rigOffsetY: -0.46,
              floorY: y - 0.02, exitX: ex.x, exitZ: ex.z, exitYaw: yaw || 0,
            },
            rates: { composure: 14, hygiene: 10, fun: 4 },
            statusText: 'Powdering cheeks & fixing hair at ' + title + '...',
          },
        ],
      });
    }

    function addDeskSpot(parent, colList, id, title, floor, x, y, z, yaw, tone) {
      const dk = kit.buildWritingDesk(id, tone);
      dk.position.set(x, y, z);
      dk.rotation.y = yaw || 0;
      parent.add(dk);
      tagInteractable(dk, id);
      if (colList) addBox(colList, x, z, 1.4, 0.8);
      const sit = localToWorld(x, z, yaw || 0, 0, 0.72);
      const ex = localToWorld(x, z, yaw || 0, 0, 1.4);
      registerSpot({
        id: id,
        title: title,
        floor: floor,
        category: 'living',
        x: x,
        y: y,
        z: z,
        radius: 3.0,
        actions: [
          {
            id: id + '_write',
            label: 'Write Private Diary & Royal Letters',
            hint: '+12 Poise/s & +7 Fun/s',
            pose: 'eat',
            anchor: {
              x: sit.x, y: y + 0.06, z: sit.z, yaw: (yaw || 0) + Math.PI, rigOffsetY: -0.46,
              floorY: y - 0.02, exitX: ex.x, exitZ: ex.z, exitYaw: yaw || 0,
            },
            rates: { composure: 12, fun: 7 },
            statusText: 'Writing secrets into your gilded journal...',
          },
        ],
      });
    }

    function addDecorativeArmchair(parent, colList, id, title, floor, x, y, z, yaw, tone) {
      const ch = kit.buildArmchair({ tone: tone, interactId: id });
      ch.position.set(x, y, z);
      ch.rotation.y = yaw || 0;
      parent.add(ch);
      tagInteractable(ch, id);
      if (colList) addCircle(colList, x, z, 0.44);
      const sit = localToWorld(x, z, yaw || 0, 0, 0.06);
      const ex = localToWorld(x, z, yaw || 0, 0, 0.94);
      registerSpot({
        id: id,
        title: title,
        floor: floor,
        category: 'living',
        x: x,
        y: y,
        z: z,
        radius: 2.8,
        actions: [
          {
            id: id + '_sit_read',
            label: 'Hold Book & Read in ' + title,
            hint: '+11 Poise/s & +9 Fun/s',
            pose: 'sit_read',
            anchor: {
              x: sit.x, y: y + 0.08, z: sit.z, yaw: yaw || 0, rigOffsetY: -0.46,
              floorY: y - 0.02, exitX: ex.x, exitZ: ex.z, exitYaw: yaw || 0,
            },
            rates: { composure: 11, fun: 9, energy: 6 },
            statusText: 'Holding an open book and reading in ' + title + '...',
          },
          {
            id: id + '_sit',
            label: 'Sit & Relax in ' + title,
            hint: '+9 Energy/s & +7 Poise/s',
            pose: 'sit',
            anchor: {
              x: sit.x, y: y + 0.08, z: sit.z, yaw: yaw || 0, rigOffsetY: -0.46,
              floorY: y - 0.02, exitX: ex.x, exitZ: ex.z, exitYaw: yaw || 0,
            },
            rates: { energy: 9, composure: 7, fun: 4 },
            statusText: 'Relaxing in ' + title + '...',
          },
        ],
      });
    }

    // -----------------------------------------------------------
    // 1. FLOOR 1 STATE ROOMS (Banquet, Kitchen, Living Salon, Ballroom, Foyer)
    // -----------------------------------------------------------
    // Foyer Grand Portraits & Flanking Potted Palms + Velvet Drapes
    addArt(floor1Group, -5.8, 3.0, -38.1, 0, 0, 1.8, 2.2);
    addArt(floor1Group, 5.8, 3.0, -38.1, 0, 1, 1.8, 2.2);
    addDrapes(floor1Group, -5.8, 0.67, -38.15, 0, 'crimson', 2.4, 4.1);
    addDrapes(floor1Group, 5.8, 0.67, -38.15, 0, 'crimson', 2.4, 4.1);
    addPlant(floor1Group, floor1Colliders, -3.6, 0.67, -28.0, true);
    addPlant(floor1Group, floor1Colliders, 3.6, 0.67, -28.0, true);
    addPlant(floor1Group, floor1Colliders, -8.8, 0.67, -18.8, true);
    addPlant(floor1Group, floor1Colliders, 8.8, 0.67, -18.8, true);

    // Banquet Dining Setting ON TOP of banquet_table (-15.8, 1.57, -22.2) + Dining Chandelier & Credenza
    const setting = kit.buildBanquetSetting();
    setting.position.set(-15.8, 1.57, -22.2);
    floor1Group.add(setting);
    addChandelier(floor1Group, -15.8, 4.95, -22.2, 1.15);
    addChest(floor1Group, floor1Colliders, 'buffet_1f', -10.5, 0.67, -20.2, -Math.PI * 0.5, 'champagne');
    addArt(floor1Group, -10.22, 3.1, -20.2, -Math.PI * 0.5, 2, 1.7, 1.4);
    addDrapes(floor1Group, -15.8, 0.67, -18.55, Math.PI, 'rose', 3.4, 4.0);

    // Kitchen Marble Island + Pantry Shelf + Herbs
    const island = kit.buildKitchenIsland();
    island.position.set(-16.2, 0.67, -32.8);
    floor1Group.add(island);
    addBox(floor1Colliders, -16.2, -32.8, 2.4, 1.1);
    addChest(floor1Group, floor1Colliders, 'kitchen_pantry', -20.6, 0.67, -36.8, Math.PI * 0.5, 'champagne', true);

    // 1F Drawing Living Room Finishes (Chandelier, Coffee Table Tea Set, Twin Palms, Wall Art, Drapes)
    addChandelier(floor1Group, 16.5, 4.95, -22.2, 1.15);
    addArt(floor1Group, 16.2, 3.0, -27.45, 0, 3, 2.2, 1.6);
    addArt(floor1Group, 10.22, 3.0, -20.5, Math.PI * 0.5, 0, 1.5, 1.8);
    addDrapes(floor1Group, 16.2, 0.67, -18.55, Math.PI, 'crimson', 3.2, 4.0);
    addPlant(floor1Group, floor1Colliders, 20.6, 0.67, -25.2, true);
    addPlant(floor1Group, floor1Colliders, 20.6, 0.67, -19.2, true);

    // Ballroom State Finishes (Chandelier + Twin Throne Portraits & Palms)
    addChandelier(floor1Group, 16.0, 4.95, -33.2, 1.25);
    addArt(floor1Group, 16.0, 3.2, -38.1, 0, 0, 2.6, 2.0);
    addDrapes(floor1Group, 16.0, 0.67, -38.15, 0, 'crimson', 3.8, 4.2);
    addPlant(floor1Group, floor1Colliders, 11.2, 0.67, -37.2, true);
    addPlant(floor1Group, floor1Colliders, 20.8, 0.67, -37.2, true);

    // 1F Toilets & Bathrooms Finishes (#1 East, #2 West)
    addTowelStand(floor1Group, floor1Colliders, 23.0, 0.67, -18.6, 0);
    addPlant(floor1Group, floor1Colliders, 29.4, 0.67, -22.8, false);
    addTowelStand(floor1Group, floor1Colliders, -23.0, 0.67, -18.6, 0);
    addPlant(floor1Group, floor1Colliders, -29.4, 0.67, -22.8, false);

    // 1F Finished Bedrooms #1, #2, #3
    // Bedroom #1 (x: 22..30.4, z: -23.6..-31.2)
    addArt(floor1Group, 30.1, 2.95, -27.5, -Math.PI * 0.5, 1, 1.5, 1.7);
    addChest(floor1Group, floor1Colliders, 'chest_b1', 29.2, 0.67, -24.4, Math.PI, 'rose');
    addVanitySpot(floor1Group, floor1Colliders, 'vanity_b1', 'Suite #1 Dressing Vanity', 1, 23.2, 0.67, -29.8, Math.PI * 0.5, 'rose');
    addPlant(floor1Group, floor1Colliders, 29.5, 0.67, -30.3, false);

    // Bedroom #2 (x: 22..30.4, z: -31.2..-38.4)
    addArt(floor1Group, 30.1, 2.95, -35.0, -Math.PI * 0.5, 2, 1.5, 1.7);
    addChest(floor1Group, floor1Colliders, 'chest_b2', 29.2, 0.67, -37.8, 0, 'champagne');
    addDecorativeArmchair(floor1Group, floor1Colliders, 'chair_b2', 'Suite #2 Reading Chair', 1, 23.2, 0.67, -37.0, 0.5, 'champagne');
    addPlant(floor1Group, floor1Colliders, 29.5, 0.67, -32.2, false);

    // Bedroom #3 (x: -30.4..-22, z: -23.6..-38.4)
    addArt(floor1Group, -30.1, 2.95, -31.0, Math.PI * 0.5, 3, 1.6, 1.8);
    addVanitySpot(floor1Group, floor1Colliders, 'vanity_b3', 'Suite #3 Dressing Vanity', 1, -29.3, 0.67, -36.8, Math.PI * 0.5, 'lavender');
    addDecorativeArmchair(floor1Group, floor1Colliders, 'chair_b3', 'Suite #3 Velvet Chair', 1, -23.2, 0.67, -36.6, -0.5, 'lavender');
    addPlant(floor1Group, floor1Colliders, -29.4, 0.67, -24.6, true);

    // -----------------------------------------------------------
    // 2. FLOOR 2 FINISHED SUITES (Master Bath, Master Suite #4, #5-#9, Salon)
    // -----------------------------------------------------------
    // Master Marble Bath Finishes
    addTowelStand(floor2Group, floor2Colliders, -23.0, 5.67, -32.2, -Math.PI * 0.5);
    addPlant(floor2Group, floor2Colliders, -22.8, 5.67, -26.2, true);
    addArt(floor2Group, -26.0, 7.9, -38.1, 0, 1, 1.4, 1.5);

    // Bedroom #4 Master Princess Canopy Suite Finishes (x: -21.6..-11.6, z: -38.4..-25.0)
    addChandelier(floor2Group, -16.5, 9.75, -31.5, 1.15);
    addArt(floor2Group, -16.5, 8.2, -38.1, 0, 0, 2.0, 1.7);
    addDrapes(floor2Group, -16.5, 5.67, -38.12, 0, 'rose', 3.4, 4.1);
    addWardrobeSpot(floor2Group, floor2Colliders, 'wardrobe_b4', 'Princess Royal Wardrobe (2F)', 2, -20.6, 5.67, -37.3, 0);
    addVanitySpot(floor2Group, floor2Colliders, 'vanity_b4', 'Princess Dressing Vanity (2F)', 2, -12.8, 5.67, -37.3, 0, 'rose');
    addPlant(floor2Group, floor2Colliders, -12.4, 5.67, -26.2, true);

    // Bedroom #5 (x: -30.4..-22.4, z: -24.8..-18.2)
    addArt(floor2Group, -30.1, 7.9, -19.8, Math.PI * 0.5, 2, 1.4, 1.5);
    addChest(floor2Group, floor2Colliders, 'chest_b5', -24.2, 5.67, -18.8, Math.PI, 'crimson');
    addPlant(floor2Group, floor2Colliders, -29.4, 5.67, -23.8, false);

    // Bedroom #6 (x: -11.2..-3.5, z: -38.4..-25.0)
    addChandelier(floor2Group, -7.2, 9.75, -32.0, 0.95);
    addArt(floor2Group, -7.2, 8.1, -38.1, 0, 1, 1.6, 1.6);
    addWardrobeSpot(floor2Group, floor2Colliders, 'wardrobe_b6', 'Sapphire Suite Wardrobe (2F)', 2, -10.3, 5.67, -37.4, 0);
    addDeskSpot(floor2Group, floor2Colliders, 'desk_b6', 'Sapphire Suite Writing Desk', 2, -4.6, 5.67, -37.3, 0, 'sapphire');

    // Bedroom #7 Queen Mother Imperial Suite (x: 7.8..17.4, z: -38.4..-25.0)
    addChandelier(floor2Group, 12.5, 9.75, -31.5, 1.1);
    addArt(floor2Group, 12.5, 8.15, -38.1, 0, 0, 1.9, 1.7);
    addWardrobeSpot(floor2Group, floor2Colliders, 'wardrobe_b7', 'Queen Mother Wardrobe (2F)', 2, 8.8, 5.67, -37.4, 0);
    addVanitySpot(floor2Group, floor2Colliders, 'vanity_b7', 'Queen Mother Dressing Vanity', 2, 16.0, 5.67, -37.3, 0, 'crimson');
    addPlant(floor2Group, floor2Colliders, 8.6, 5.67, -26.2, true);

    // 2F East Bath Finishes (Toilet #4)
    addTowelStand(floor2Group, floor2Colliders, 18.6, 5.67, -37.4, 0);

    // Bedroom #8 (x: 22.8..30.4, z: -38.4..-25.0)
    addArt(floor2Group, 30.1, 8.0, -34.0, -Math.PI * 0.5, 3, 1.5, 1.6);
    addChest(floor2Group, floor2Colliders, 'chest_b8', 29.2, 5.67, -37.6, 0, 'emerald');
    addDecorativeArmchair(floor2Group, floor2Colliders, 'chair_b8', 'Suite #8 Emerald Armchair', 2, 23.8, 5.67, -37.3, 0.4, 'emerald');

    // Bedroom #9 (x: 22.4..30.4, z: -24.8..-18.2)
    addArt(floor2Group, 30.1, 7.9, -19.8, -Math.PI * 0.5, 2, 1.4, 1.5);
    addChest(floor2Group, floor2Colliders, 'chest_b9', 24.0, 5.67, -18.8, Math.PI, 'champagne');
    addPlant(floor2Group, floor2Colliders, 29.4, 5.67, -23.8, false);

    // 2F Upper Gallery Salon Finishes
    addChandelier(floor2Group, 0, 9.75, -21.2, 1.15);
    addPlant(floor2Group, floor2Colliders, -3.8, 5.67, -19.2, true);
    addPlant(floor2Group, floor2Colliders, 3.8, 5.67, -19.2, true);
    const gfClock2 = kit.buildGrandfatherClock();
    gfClock2.position.set(16.6, 5.67, -24.3);
    floor2Group.add(gfClock2);
    addBox(floor2Colliders, 16.6, -24.3, 0.75, 0.55);

    // -----------------------------------------------------------
    // 3. FLOOR 3 FINISHED MANSARD SUITES (#10-#15) + GAMES & ART ACTIVITIES PARLOR
    // -----------------------------------------------------------
    // Bedroom #10 (x: -30.4..-22.2, z: -38.4..-25.0)
    addArt(floor3Group, -30.1, 12.6, -34.2, Math.PI * 0.5, 2, 1.4, 1.4);
    addWardrobeSpot(floor3Group, floor3Colliders, 'wardrobe_b10', 'Suite #10 Ivory Wardrobe (3F)', 3, -23.4, 10.67, -37.4, 0);
    addPlant(floor3Group, floor3Colliders, -29.4, 10.67, -26.2, false);

    // 3F West Bath (#6)
    addTowelStand(floor3Group, floor3Colliders, -21.0, 10.67, -32.2, Math.PI * 0.5);

    // Bedroom #11 (x: -17.0..-8.6, z: -38.4..-25.0)
    addArt(floor3Group, -12.8, 12.6, -38.1, 0, 3, 1.5, 1.4);
    addWardrobeSpot(floor3Group, floor3Colliders, 'wardrobe_b11', 'Suite #11 Rosewood Wardrobe (3F)', 3, -15.8, 10.67, -37.4, 0);
    addDeskSpot(floor3Group, floor3Colliders, 'desk_b11', 'Suite #11 Reading Desk (3F)', 3, -9.8, 10.67, -37.3, 0, 'rose');

    // Bedroom #12 (x: -8.2..2.4, z: -38.4..-25.0)
    addChandelier(floor3Group, -3.0, 13.7, -32.0, 0.9);
    addArt(floor3Group, -3.0, 12.6, -38.1, 0, 1, 1.6, 1.4);
    addWardrobeSpot(floor3Group, floor3Colliders, 'wardrobe_b12', 'Suite #12 Midnight Wardrobe (3F)', 3, -6.9, 10.67, -37.4, 0);
    addVanitySpot(floor3Group, floor3Colliders, 'vanity_b12', 'Suite #12 Dressing Vanity (3F)', 3, 1.2, 10.67, -37.3, 0, 'sapphire');

    // Bedroom #13 Imperial Dome Canopy Suite (x: 7.8..17.4, z: -38.4..-25.0)
    addChandelier(floor3Group, 12.6, 13.7, -32.0, 0.95);
    addArt(floor3Group, 12.6, 12.6, -38.1, 0, 0, 1.8, 1.5);
    addWardrobeSpot(floor3Group, floor3Colliders, 'wardrobe_b13', 'Imperial Dome Wardrobe (3F)', 3, 8.8, 10.67, -37.4, 0);
    addVanitySpot(floor3Group, floor3Colliders, 'vanity_b13', 'Imperial Dome Vanity (3F)', 3, 16.0, 10.67, -37.3, 0, 'crimson');

    // 3F East Bath (#7)
    addTowelStand(floor3Group, floor3Colliders, 18.6, 10.67, -37.4, 0);

    // Bedroom #14 (x: 22.8..30.4, z: -38.4..-25.0)
    addArt(floor3Group, 27.6, 12.6, -38.1, 0, 3, 1.5, 1.4);
    addChest(floor3Group, floor3Colliders, 'chest_b14', 24.0, 10.67, -37.4, 0, 'emerald');
    addDecorativeArmchair(floor3Group, floor3Colliders, 'chair_b14', 'Suite #14 Dormer Chair', 3, 24.0, 10.67, -27.4, 0.6, 'emerald');

    // Bedroom #15 (x: -30.4..-21.2, z: -24.6..-18.2)
    addArt(floor3Group, -30.1, 12.5, -19.8, Math.PI * 0.5, 1, 1.4, 1.4);
    addChest(floor3Group, floor3Colliders, 'chest_b15', -22.6, 10.67, -18.8, Math.PI, 'lavender');
    addPlant(floor3Group, floor3Colliders, -29.4, 10.67, -23.8, false);

    // 3F Imperial Activities & Games Parlor (South Corridor `z = -24.6 .. -18.2`)
    const gfClock3 = kit.buildGrandfatherClock();
    gfClock3.position.set(-12.0, 10.67, -24.3);
    floor3Group.add(gfClock3);
    addBox(floor3Colliders, -12.0, -24.3, 0.75, 0.55);

    const bShelf3 = kit.buildBookshelf('bookshelf_3f', false);
    bShelf3.position.set(10.0, 10.67, -24.4);
    floor3Group.add(bShelf3);
    tagInteractable(bShelf3, 'bookshelf_3f');
    addBox(floor3Colliders, 10.0, -24.4, 1.7, 0.5);
    registerSpot({
      id: 'bookshelf_3f',
      title: '3F Mansard Archive Bookshelf',
      floor: 3,
      category: 'living',
      x: 10.0,
      y: 10.67,
      z: -24.4,
      radius: 3.0,
      actions: [
        {
          id: 'read_3f',
          label: 'Pick Up Book & Read Archive Tome',
          hint: '+12 Poise/s & +9 Fun/s',
          pose: 'read',
          anchor: {
            x: 10.0, y: 10.67, z: -23.4, yaw: Math.PI,
            floorY: 10.65, exitX: 10.0, exitZ: -23.4, exitYaw: 0,
          },
          rates: { composure: 12, fun: 9 },
          statusText: 'Holding open leather-bound chronicle & reading...',
        },
      ],
    });

    addChandelier(floor3Group, 0.5, 13.7, -20.8, 0.95);
    addPlant(floor3Group, floor3Colliders, -16.0, 10.67, -19.0, true);
    addPlant(floor3Group, floor3Colliders, 26.5, 10.67, -19.0, true);

    // Interactive Royal Chess Table (3F Parlor)
    const chessTbl = kit.buildChessTable('chess_table_3f');
    chessTbl.position.set(0.2, 10.67, -20.5);
    floor3Group.add(chessTbl);
    tagInteractable(chessTbl, 'chess_table_3f');
    addBox(floor3Colliders, 0.2, -20.5, 1.3, 1.3);
    registerSpot({
      id: 'chess_table_3f',
      title: 'Royal Marble Chess Table (3F)',
      floor: 3,
      category: 'living',
      shortcut: true,
      x: 0.2,
      y: 10.67,
      z: -20.5,
      radius: 3.2,
      actions: [
        {
          id: 'play_chess_3f',
          label: 'Play Royal Court Chess',
          hint: '+16 Fun/s & +10 Poise/s',
          pose: 'chess',
          anchor: {
            x: 0.2, y: 10.72, z: -19.54, yaw: Math.PI, rigOffsetY: -0.45,
            floorY: 10.65, exitX: 1.4, exitZ: -19.54, exitYaw: Math.PI * 0.5,
          },
          rates: { fun: 16, composure: 10 },
          statusText: 'Strategizing a royal checkmate on the inlaid chessboard...',
        },
      ],
    });

    // Interactive Portrait Easel (3F Art Alcove)
    const easel = kit.buildEasel('easel_3f');
    easel.position.set(22.5, 10.67, -20.4);
    easel.rotation.y = -0.35;
    floor3Group.add(easel);
    tagInteractable(easel, 'easel_3f');
    addBox(floor3Colliders, 22.5, -20.4, 1.0, 1.0);
    const easelStand = localToWorld(22.5, -20.4, -0.35, 0, 0.95);
    registerSpot({
      id: 'easel_3f',
      title: 'Royal Painting Easel (3F)',
      floor: 3,
      category: 'living',
      x: 22.5,
      y: 10.67,
      z: -20.4,
      radius: 3.0,
      actions: [
        {
          id: 'paint_3f',
          label: 'Paint Dynasty Oil Portrait',
          hint: '+15 Fun/s & +9 Poise/s',
          pose: 'paint',
          anchor: {
            x: easelStand.x, y: 10.67, z: easelStand.z, yaw: -0.35 + Math.PI,
            floorY: 10.65, exitX: easelStand.x, exitZ: easelStand.z, exitYaw: -0.35 + Math.PI,
          },
          rates: { fun: 15, composure: 9 },
          statusText: 'Painting an oil portrait in the 3F sunlit studio...',
        },
      ],
    });

    // -----------------------------------------------------------
    // 4. COMMONERS' COTTAGES INTERIOR FINISHING (All 10 Enterable Homes!)
    // -----------------------------------------------------------
    if (Array.isArray(ctx.cottages)) {
      ctx.cottages.forEach(function (ct, ci) {
        const grp = ct.grp;
        if (!grp) return;
        const innerDir = ct.doorX > ct.cx ? -1 : 1;
        // Framed Pastoral Artwork on Back Wall
        addArt(grp, ct.cx + innerDir * 3.05, 1.85, ct.cz + 0.4, innerDir < 0 ? Math.PI * 0.5 : -Math.PI * 0.5, ci, 1.05, 0.9);
        // Cottage Chest of Drawers beside bed away from doorway
        addChest(grp, ctx.sharedColliders, 'cot_chest_' + (ci + 1), ct.cx - innerDir * 1.85, 0.08, ct.cz - 2.45, 0, 'rustic', true);
        // Cottage Hanging Candle Chandelier
        const lantern = kit.buildChandelier(0.55);
        lantern.position.set(ct.cx, 2.75, ct.cz);
        grp.add(lantern);
      });
    }
  }

  window.CrownPalaceRooms = {
    furnish: furnishPalaceRooms,
  };
})();
