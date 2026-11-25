/* Crown & Scandal 3D — 3-Storey Grand Hôtel Montieri Paris + Courtyard Valet Parking Lot */
(function () {
  'use strict';

  function buildMontieriHotel(ctx) {
    const THREE = ctx.THREE;
    const kit = ctx.kit;
    const townGroup = ctx.townGroup;
    const sharedColliders = ctx.sharedColliders;
    const walkableFloors = ctx.walkableFloors;
    const cutaways = ctx.cutaways;
    const townZones = ctx.townZones;
    const townDirectory = ctx.townDirectory;
    const townDoors = ctx.townDoors;
    const dynamicNodes = ctx.dynamicNodes;
    const animatedFlames = ctx.animatedFlames || [];

    const ivoryMat = ctx.ivoryMat;
    const marbleMat = ctx.marbleMat;
    const whiteMarbleMat = ctx.whiteMarbleMat || marbleMat;
    const parquetMat = ctx.parquetMat;
    const goldMat = ctx.goldMat;
    const glassMat = ctx.glassMat;
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
    const tagInteractable = ctx.tagInteractable;
    const registerSpot = ctx.registerSpot;
    const registerDrivableCar = ctx.registerDrivableCar;
    const recordDispatchGossip = ctx.recordDispatchGossip;

    const localMats = [];
    const localGeos = [];
    const localTex = [];
    function keepMat(m) { localMats.push(m); return m; }
    function keepGeo(g) { localGeos.push(g); return g; }
    function keepTex(t) { localTex.push(t); return t; }

    function makeTexture(w, h, drawFn, repX, repY) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g = c.getContext('2d');
      drawFn(g, w, h);
      const tex = keepTex(new THREE.CanvasTexture(c));
      tex.colorSpace = THREE.SRGBColorSpace;
      if (repX || repY) {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repX || 1, repY || 1);
      }
      return tex;
    }

    // ---- PROCEDURAL TEXTURES INSPIRED BY MONTIERI PARIS ----
    const cobbleTex = makeTexture(256, 256, function (g, w, h) {
      g.fillStyle = '#756f68';
      g.fillRect(0, 0, w, h);
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 8; c++) {
          const ox = (r % 2) * 16;
          g.fillStyle = (r + c) % 3 === 0 ? '#8c857c' : (r + c) % 2 === 0 ? '#7b746c' : '#6a635c';
          g.fillRect((c * 32 + ox) % w, r * 26 + 2, 28, 22);
        }
      }
    }, 3, 4);

    const lobbyMarbleTex = makeTexture(512, 512, function (g, w, h) {
      g.fillStyle = '#f3eadb';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#c5a572';
      g.lineWidth = 8;
      g.strokeRect(18, 18, w - 36, h - 36);
      g.strokeStyle = '#241e1c';
      g.lineWidth = 6;
      g.strokeRect(32, 32, w - 64, h - 64);
      // Central Baroque Gold & Onyx Medallion
      g.save();
      g.translate(w * 0.5, h * 0.5);
      g.beginPath();
      g.arc(0, 0, 152, 0, Math.PI * 2);
      g.fillStyle = '#faf4ea';
      g.fill();
      g.lineWidth = 10;
      g.strokeStyle = '#221c1a';
      g.stroke();
      g.beginPath();
      g.arc(0, 0, 120, 0, Math.PI * 2);
      g.lineWidth = 5;
      g.strokeStyle = '#c99b44';
      g.stroke();
      for (let k = 0; k < 8; k++) {
        g.save();
        g.rotate((k * Math.PI) / 4);
        g.fillStyle = k % 2 === 0 ? '#241e1c' : '#c99b44';
        g.beginPath();
        g.moveTo(0, -18);
        g.quadraticCurveTo(32, -62, 0, -104);
        g.quadraticCurveTo(-32, -62, 0, -18);
        g.fill();
        g.restore();
      }
      g.restore();
    });

    const persianRugTex = makeTexture(256, 256, function (g, w, h) {
      g.fillStyle = '#6f1422';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#d4af55';
      g.lineWidth = 10;
      g.strokeRect(12, 12, w - 24, h - 24);
      g.strokeStyle = '#f3e5cf';
      g.lineWidth = 4;
      g.strokeRect(24, 24, w - 48, h - 48);
      g.fillStyle = '#f3e5cf';
      g.beginPath();
      g.ellipse(w * 0.5, h * 0.5, 58, 40, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#6f1422';
      g.lineWidth = 4;
      g.stroke();
      g.fillStyle = '#c99b44';
      g.beginPath();
      g.arc(w * 0.5, h * 0.5, 16, 0, Math.PI * 2);
      g.fill();
    });

    const plaqueTex = makeTexture(512, 256, function (g, w, h) {
      g.fillStyle = '#181416';
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#d4af55';
      g.lineWidth = 8;
      g.strokeRect(10, 10, w - 20, h - 20);
      g.fillStyle = '#e7c676';
      g.font = 'bold 54px Georgia, serif';
      g.textAlign = 'center';
      g.fillText('M', w * 0.5, 76);
      g.font = 'bold 40px Georgia, serif';
      g.fillText('MONTIERI', w * 0.5, 134);
      g.font = '20px Georgia, serif';
      g.fillStyle = '#f5dfb2';
      g.fillText('LUXURY HOTELS · PARIS', w * 0.5, 174);
    });

    const paintingTex = makeTexture(256, 256, function (g, w, h) {
      const sky = g.createLinearGradient(0, 0, 0, h * 0.65);
      sky.addColorStop(0, '#96b3c6');
      sky.addColorStop(1, '#ecd7b4');
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);
      g.fillStyle = '#4c654d';
      g.beginPath();
      g.moveTo(0, h * 0.62);
      g.quadraticCurveTo(w * 0.35, h * 0.38, w * 0.7, h * 0.58);
      g.lineTo(w, h * 0.52);
      g.lineTo(w, h);
      g.lineTo(0, h);
      g.fill();
      g.fillStyle = '#4c758a';
      g.fillRect(0, h * 0.68, w, h * 0.32);
      g.fillStyle = '#2d462e';
      g.fillRect(28, 70, 16, 130);
      g.fillRect(212, 85, 14, 115);
    });

    const clockTex = makeTexture(128, 128, function (g, w, h) {
      g.fillStyle = '#f9f2e4';
      g.beginPath();
      g.arc(64, 64, 58, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#c5973b';
      g.lineWidth = 8;
      g.stroke();
      g.strokeStyle = '#221d1a';
      g.lineWidth = 4;
      g.beginPath();
      g.moveTo(64, 64);
      g.lineTo(64, 28);
      g.moveTo(64, 64);
      g.lineTo(92, 64);
      g.stroke();
    });

    const domeFrescoTex = makeTexture(256, 256, function (g, w, h) {
      const sky = g.createRadialGradient(128, 128, 18, 128, 128, 128);
      sky.addColorStop(0, '#fff7e0');
      sky.addColorStop(0.55, '#c7daea');
      sky.addColorStop(1, '#a98756');
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);
      g.strokeStyle = '#d4af55';
      g.lineWidth = 10;
      g.beginPath();
      g.arc(128, 128, 112, 0, Math.PI * 2);
      g.stroke();
      g.fillStyle = 'rgba(255,248,238,0.65)';
      [[-45, -20], [42, -32], [-28, 46], [36, 38]].forEach(function (pt) {
        g.beginPath();
        g.arc(128 + pt[0], 128 + pt[1], 24, 0, Math.PI * 2);
        g.fill();
      });
    });

    const mCreamPlateTex = makeTexture(128, 128, function (g) {
      g.fillStyle = '#fcfaf5';
      g.beginPath();
      g.arc(64, 64, 60, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#c99b44';
      g.lineWidth = 8;
      g.stroke();
      g.fillStyle = '#7e5a1d';
      g.font = 'bold 42px Georgia, serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('M', 64, 66);
    });

    // ---- MATERIALS ----
    const cobbleMat = keepMat(new THREE.MeshStandardMaterial({ map: cobbleTex, roughness: 0.88 }));
    const lobbyFloorMat = keepMat(new THREE.MeshStandardMaterial({ map: lobbyMarbleTex, roughness: 0.24, metalness: 0.08 }));
    const onyxMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x1a1719, roughness: 0.22, metalness: 0.14 }));
    const crimsonMarbleMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x5c1824, roughness: 0.26, metalness: 0.08 }));
    const crimsonVelvetMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x731424, roughness: 0.82 }));
    const creamVelvetMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xf4ead8, roughness: 0.78 }));
    const limestoneMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xebe0ce, roughness: 0.62 }));
    const darkIronMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x1e2024, roughness: 0.45, metalness: 0.72 }));
    const brassMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xd4ad52, roughness: 0.24, metalness: 0.82 }));
    const persianMat = keepMat(new THREE.MeshStandardMaterial({ map: persianRugTex, roughness: 0.86 }));
    const plaqueMat = keepMat(new THREE.MeshStandardMaterial({ map: plaqueTex, roughness: 0.32 }));
    const paintingMat = keepMat(new THREE.MeshStandardMaterial({ map: paintingTex, roughness: 0.55 }));
    const clockMat = keepMat(new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.4 }));
    const frescoMat = keepMat(new THREE.MeshStandardMaterial({ map: domeFrescoTex, roughness: 0.55 }));
    const mAccentMat = keepMat(new THREE.MeshStandardMaterial({ map: mCreamPlateTex, roughness: 0.32 }));
    const rosePetalMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xb61c34, roughness: 0.68 }));
    const warmGlowMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xfff0c8, emissive: 0xffd27d, emissiveIntensity: 0.85, roughness: 0.2 }));
    const spaGlowWaterMat = keepMat(new THREE.MeshStandardMaterial({
      color: 0x6fd8e6,
      emissive: 0x2a8899,
      emissiveIntensity: 0.45,
      roughness: 0.12,
      transparent: true,
      opacity: 0.86,
    }));
    const sheerCurtainMat = keepMat(new THREE.MeshStandardMaterial({
      color: 0xfffaf2,
      roughness: 0.85,
      transparent: true,
      opacity: 0.72,
    }));
    const stainlessMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xc9d0d8, roughness: 0.26, metalness: 0.8 }));
    const copperMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xb86b3a, roughness: 0.28, metalness: 0.78 }));
    const kitchenTileMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x2e3138, roughness: 0.48 }));

    // ---- GEOMETRIES & COORDINATES ----
    // Unobstructed East Riviera block east of x=120.5 avenue and west of shifted x=156.5 avenue
    const lotMinX = 124.2;
    const lotMaxX = 133.2;
    const hotelX = 142.8;
    const hotelZ = 9.8;
    const hotelW = 19.2;
    const hotelD = 12.6;
    const xL = hotelX - hotelW * 0.5; // 133.2
    const xR = hotelX + hotelW * 0.5; // 152.4
    const zN = hotelZ - hotelD * 0.5; // 3.5
    const zS = hotelZ + hotelD * 0.5; // 16.1
    const y1 = 0.14;
    const y2 = 4.54;
    const y3 = 8.94;
    const wallH1 = 4.4;
    const wallH2 = 4.4;
    const wallH3 = 4.2;

    const hotelGroup = new THREE.Group();
    townGroup.add(hotelGroup);
    const hotel2Grp = new THREE.Group();
    const hotel3Grp = new THREE.Group();
    const hotelRoofGrp = new THREE.Group();
    townGroup.add(hotel2Grp);
    townGroup.add(hotel3Grp);
    townGroup.add(hotelRoofGrp);

    // Upper floor local collider lists (used when player is on 2F or 3F)
    const hotel2Colliders = [];
    const hotel3Colliders = [];

    function addArchWindow(parent, wx, wy, wz, rotY, hasCurtains) {
      const wg = new THREE.Group();
      wg.position.set(wx, wy, wz);
      wg.rotation.y = rotY || 0;
      const frame = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.72, 2.55, 0.22)), darkIronMat);
      frame.position.y = 1.45;
      const arch = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.86, 0.86, 0.22, 12)), darkIronMat);
      arch.rotation.x = Math.PI * 0.5;
      arch.position.y = 2.72;
      const pane = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.48, 2.4, 0.24)), glassMat);
      pane.position.y = 1.45;
      wg.add(frame, arch, pane);
      if (hasCurtains) {
        [-0.78, 0.78].forEach(function (cx) {
          const drape = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.30, 2.95, 0.16)), crimsonVelvetMat);
          drape.position.set(cx, 1.55, 0.15);
          wg.add(drape);
        });
      }
      parent.add(wg);
    }

    function buildChandelierLocal(scale) {
      const ch = kit && typeof kit.buildChandelier === 'function' ? kit.buildChandelier(scale || 1.0) : new THREE.Group();
      return ch;
    }

    // -----------------------------------------------------------
    // 1. COURTYARD & VALET PARKING LOT (x = 124.2..133.2, z = 3.6..16.0)
    // -----------------------------------------------------------
    const yardPad = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(9.2, 0.08, 12.6)), cobbleMat);
    yardPad.position.set((lotMinX + lotMaxX) * 0.5, 0.02, hotelZ);
    yardPad.receiveShadow = true;
    hotelGroup.add(yardPad);

    // Red Carpet Runner from Iron Archway Gate straight into Montieri Hotel Entrance
    const carpetMat = crimsonVelvetMat;
    const frontCarpet = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(8.8, 0.03, 2.2)), carpetMat);
    frontCarpet.position.set(128.7, 0.075, hotelZ);
    frontCarpet.receiveShadow = true;
    hotelGroup.add(frontCarpet);

    // Paris Iron & Gold Archway Gate + Flanking Stone Walls with Climbing Roses (x = 124.3)
    const gatePillarGeo = keepGeo(new THREE.BoxGeometry(0.68, 3.2, 0.68));
    [hotelZ - 2.0, hotelZ + 2.0].forEach(function (pz) {
      const pil = new THREE.Mesh(gatePillarGeo, limestoneMat);
      pil.position.set(124.35, 1.6, pz);
      pil.castShadow = true;
      const cap = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.24, 8, 6)), brassMat);
      cap.position.set(124.35, 3.38, pz);
      hotelGroup.add(pil, cap);
      addCircle(sharedColliders, 124.35, pz, 0.45);
    });
    const gateArchBar = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.24, 0.42, 4.4)), darkIronMat);
    gateArchBar.position.set(124.35, 3.38, hotelZ);
    const gateSign = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.28, 0.82, 2.6)), plaqueMat);
    gateSign.position.set(124.35, 3.92, hotelZ);
    hotelGroup.add(gateArchBar, gateSign);

    // Courtyard North & South Perimeter Iron-topped Walls + Climbing Roses
    [
      { z0: 3.6, z1: 7.7 },
      { z0: 11.9, z1: 16.0 },
    ].forEach(function (seg) {
      const len = seg.z1 - seg.z0;
      const zc = (seg.z0 + seg.z1) * 0.5;
      const baseW = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.36, 0.85, len)), limestoneMat);
      baseW.position.set(124.35, 0.425, zc);
      const railW = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.12, 0.85, len)), darkIronMat);
      railW.position.set(124.35, 1.25, zc);
      hotelGroup.add(baseW, railW);
      addBox(sharedColliders, 124.35, zc, 0.45, len);
      for (let ri = 0; ri < 3; ri++) {
        const rz = seg.z0 + 0.65 + ri * (len - 1.3) * 0.5;
        const bush = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.32, 7, 5)), boxwoodMat);
        bush.position.set(124.65, 0.45, rz);
        const rose = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.14, 6, 5)), rosePetalMat);
        rose.position.set(124.65, 0.72, rz);
        hotelGroup.add(bush, rose);
      }
    });

    // Valet Concierge Kiosk (`hotel_valet`) + Brass Luggage Cart
    const valetBooth = new THREE.Group();
    valetBooth.position.set(126.2, 0.06, 12.2);
    const vbBase = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.4, 1.05, 0.9)), onyxMat);
    vbBase.position.y = 0.525;
    const vbTop = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.52, 0.08, 1.02)), brassMat);
    vbTop.position.y = 1.08;
    const vbCanopy = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.65, 0.14, 1.15)), crimsonVelvetMat);
    vbCanopy.position.y = 2.25;
    [-0.64, 0.64].forEach(function (px) {
      const post = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8)), brassMat);
      post.position.set(px, 1.66, 0.42);
      valetBooth.add(post);
    });
    valetBooth.add(vbBase, vbTop, vbCanopy);
    hotelGroup.add(valetBooth);
    tagInteractable(valetBooth, 'hotel_valet');
    addBox(sharedColliders, 126.2, 12.2, 1.55, 1.05);

    registerSpot({
      id: 'hotel_valet',
      title: 'Montieri Valet & Forecourt Drop-Off',
      floor: 0,
      category: 'town',
      x: 126.2,
      y: 0.06,
      z: 12.2,
      radius: 3.4,
      actions: [
        {
          id: 'valet_park_tip',
          label: 'Use Montieri Valet Service (₡15)',
          hint: '+16 Poise, +10 Fun & Valet Gossip',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 15) return actCtx.toast('Need ₡15 Crowns.');
            actCtx.game.money -= 15;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 16, fun: 10 });
            recordDispatchGossip(actCtx, 'Royal arrival spotted gliding through the Montieri Valet Courtyard!', 2, 1);
            actCtx.toast('Valet Damien tips his cap and takes your keys with Parisian poise!');
          },
        },
        {
          id: 'valet_step_inside',
          label: 'Walk Into Montieri Grand Atrium',
          hint: 'Step past the revolving red carpet entrance',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.playerCtrl.teleport(134.8, hotelZ, Math.PI * 0.5, y1);
          },
        },
      ],
    });

    // Brass Luggage Cart near Entrance (`131.6, 11.9`)
    const lugCart = new THREE.Group();
    lugCart.position.set(131.6, 0.06, 11.9);
    const lcDeck = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.1, 0.10, 0.72)), crimsonVelvetMat);
    lcDeck.position.y = 0.16;
    const lcArch = new THREE.Mesh(keepGeo(new THREE.TorusGeometry(0.42, 0.03, 6, 12, Math.PI)), brassMat);
    lcArch.position.y = 1.25;
    const trunk1 = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.68, 0.42, 0.46)), onyxMat);
    trunk1.position.set(-0.08, 0.42, 0);
    const trunk2 = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.46, 0.30, 0.34)), creamVelvetMat);
    trunk2.position.set(0.08, 0.78, 0);
    lugCart.add(lcDeck, lcArch, trunk1, trunk2);
    hotelGroup.add(lugCart);
    addBox(sharedColliders, 131.6, 11.9, 1.2, 0.85);

    // 4 Luxury Sedans in North (z = 5.3) & South (z = 14.3) Parking Bays (2 drivable + 2 parked)
    if (typeof registerDrivableCar === 'function') {
      registerDrivableCar({
        id: 'hotel_limo_car',
        title: 'Montieri Midnight Executive Sedan',
        x: 127.6,
        z: 5.3,
        yaw: 0,
        paintHex: '#181b26',
        isSuv: false,
        isConvertible: false,
        shortcut: false,
        inDirectory: false,
        gossipText: 'Spotted cruising out of the Grand Hôtel Montieri valet courtyard!',
      });
      registerDrivableCar({
        id: 'hotel_coupe_car',
        title: 'Montieri Champagne Grand Tourer',
        x: 127.6,
        z: 14.3,
        yaw: Math.PI,
        paintHex: '#e7dac2',
        isSuv: false,
        isConvertible: true,
        shortcut: false,
        inDirectory: false,
        gossipText: 'Top-down Riviera glamor turning heads outside Hôtel Montieri!',
      });
    }
    [
      { x: 131.0, z: 5.3, yaw: 0, hex: '#282c36' },
      { x: 131.0, z: 14.3, yaw: Math.PI, hex: '#5f1e29' },
    ].forEach(function (stCar) {
      if (kit && typeof kit.buildParkedCar === 'function') {
        const sc = kit.buildParkedCar(stCar.hex, false, null, false);
        sc.position.set(stCar.x, 0.04, stCar.z);
        sc.rotation.y = stCar.yaw;
        hotelGroup.add(sc);
        addBox(sharedColliders, stCar.x, stCar.z, 2.2, 4.1);
      }
    });

    // -----------------------------------------------------------
    // 2. HOTEL 1F SHELL, ATRIUM, FOUNTAIN, RECEPTION, DINING, KITCHEN, WASHROOM
    // -----------------------------------------------------------
    const hotelPad = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(hotelW + 0.8, 0.14, hotelD + 0.8)), limestoneMat);
    hotelPad.position.set(hotelX, 0.04, hotelZ);
    hotelPad.receiveShadow = true;
    hotelGroup.add(hotelPad);

    const floor1Mesh = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(hotelW, 0.16, hotelD)), lobbyFloorMat);
    floor1Mesh.position.set(hotelX, 0.08, hotelZ);
    floor1Mesh.receiveShadow = true;
    hotelGroup.add(floor1Mesh);

    // 1F Exterior Walls (Entrance Doorway on West Wall at z = hotelZ = 9.8)
    addWallX(hotelGroup, sharedColliders, 0, wallH1, zN, xL, xR, null, 0, 0.34, limestoneMat);
    addWallX(hotelGroup, sharedColliders, 0, wallH1, zS, xL, xR, null, 0, 0.34, limestoneMat);
    addWallZ(hotelGroup, sharedColliders, 0, wallH1, xR, zN, zS, null, 0, 0.34, limestoneMat);
    addWallZ(hotelGroup, sharedColliders, 0, wallH1, xL, zN, zS, hotelZ, 3.2, 0.34, limestoneMat);

    // Entrance Hinged Brass & Glass Double Doors + Front Montieri Canopy + Crest
    if (kit && typeof kit.buildHingedDoors === 'function') {
      const entDoors = kit.buildHingedDoors({
        width: 3.1,
        height: 2.9,
        count: 2,
        frameMat: darkIronMat,
        leafColor: 0x241d1c,
        handleMat: brassMat,
        glassMat: glassMat,
        filigree: true,
      });
      entDoors.group.position.set(xL, y1, hotelZ);
      entDoors.group.rotation.y = -Math.PI * 0.5;
      hotelGroup.add(entDoors.group);
      tagInteractable(entDoors.leftPivot, 'hotel_entrance_doors');
      if (entDoors.rightPivot) tagInteractable(entDoors.rightPivot, 'hotel_entrance_doors');
      entDoors.group.userData.noMerge = true;
      entDoors.group.userData.noFreeze = true;
      dynamicNodes.push(entDoors.group);
      if (Array.isArray(townDoors)) {
        townDoors.push({
          id: 'hotel_entrance_doors',
          title: 'Grand Hôtel Montieri Doors',
          x: xL,
          y: y1,
          z: hotelZ,
          radius: 4.4,
          doors: entDoors,
          openRatio: 0,
          manualOpen: false,
        });
      }
    }

    // West Entrance Portico Marquee & "MONTIERI" Plaque
    const marquee = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.9, 0.24, 4.4)), darkIronMat);
    marquee.position.set(xL - 0.95, 3.7, hotelZ);
    marquee.castShadow = true;
    const marqueeTrim = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.95, 0.10, 4.5)), brassMat);
    marqueeTrim.position.set(xL - 0.95, 3.84, hotelZ);
    const marqueePlaque = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.12, 0.85, 2.5)), plaqueMat);
    marqueePlaque.position.set(xL - 1.9, 4.18, hotelZ);
    hotelGroup.add(marquee, marqueeTrim, marqueePlaque);

    // Tall Arched Windows along South Restaurant Wall
    [136.2, 139.6, 143.0].forEach(function (wx) {
      addArchWindow(hotelGroup, wx, y1, zS + 0.08, 0, true);
    });

    // Corinthian Atrium Columns
    [
      [136.2, 6.8], [136.2, 12.2],
      [140.4, 6.8], [140.4, 12.2],
    ].forEach(function (cp) {
      const col = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.24, 0.28, wallH1 + wallH2 - 0.3, 12)), ivoryMat);
      col.position.set(cp[0], y1 + (wallH1 + wallH2) * 0.5 - 0.1, cp[1]);
      const cap = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.68, 0.26, 0.68)), brassMat);
      cap.position.set(cp[0], y1 + wallH1 + wallH2 - 0.35, cp[1]);
      const base = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.68, 0.24, 0.68)), onyxMat);
      base.position.set(cp[0], y1 + 0.12, cp[1]);
      hotelGroup.add(col, cap, base);
      addCircle(sharedColliders, cp[0], cp[1], 0.4);
    });

    // Central 3-Tier Marble Atrium Fountain (`x = 137.4, z = 9.8`)
    const ftnGrp = new THREE.Group();
    ftnGrp.position.set(137.4, y1, hotelZ);
    const basinOuter = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(1.12, 1.24, 0.48, 20)), whiteMarbleMat);
    basinOuter.position.y = 0.24;
    const basinWater = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.98, 0.98, 0.08, 20)), spaGlowWaterMat);
    basinWater.position.y = 0.44;
    const fCol = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.20, 0.30, 1.35, 14)), whiteMarbleMat);
    fCol.position.y = 0.85;
    const tier1 = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.58, 0.36, 0.18, 16)), brassMat);
    tier1.position.y = 1.18;
    const tier2 = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.32, 0.18, 0.14, 14)), whiteMarbleMat);
    tier2.position.y = 1.62;
    const topJet = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.14, 10, 8)), spaGlowWaterMat);
    topJet.position.y = 1.82;
    ftnGrp.add(basinOuter, basinWater, fCol, tier1, tier2, topJet);
    hotelGroup.add(ftnGrp);
    addCircle(sharedColliders, 137.4, hotelZ, 1.22);

    // 1F Velvet Lounge Seating (`x = 135.4, z = 13.0`)
    const lobbyRug = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.2, 0.02, 2.4)), persianMat);
    lobbyRug.position.set(135.4, y1 + 0.01, 13.0);
    hotelGroup.add(lobbyRug);
    const lobbyTeaTbl = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.56, 0.48, 0.46, 16)), onyxMat);
    lobbyTeaTbl.position.set(135.4, y1 + 0.23, 13.0);
    hotelGroup.add(lobbyTeaTbl);
    addCircle(sharedColliders, 135.4, 13.0, 0.62);

    // Glass & Brass 3-Floor Elevator Shaft (`x = 135.0, z = 4.9`)
    function buildElevatorCar(parent, fy, spotId, labelTitle, floorLabel) {
      const eg = new THREE.Group();
      eg.position.set(135.0, fy, 4.9);
      const back = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.75, 2.75, 0.12)), onyxMat);
      back.position.set(0, 1.38, -0.78);
      const sideL = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.10, 2.75, 1.6)), brassMat);
      sideL.position.set(-0.85, 1.38, 0);
      const sideR = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.10, 2.75, 1.6)), brassMat);
      sideR.position.set(0.85, 1.38, 0);
      const glassPanel = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.5, 2.45, 0.06)), glassMat);
      glassPanel.position.set(0, 1.35, 0.72);
      const cap = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.85, 0.16, 1.75)), brassMat);
      cap.position.set(0, 2.82, 0);
      const indicator = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.46, 0.18, 0.08)), warmGlowMat);
      indicator.position.set(0, 2.66, 0.78);
      eg.add(back, sideL, sideR, glassPanel, cap, indicator);
      parent.add(eg);
      tagInteractable(eg, spotId);

      const liftActions = [];
      if (fy !== y1) {
        liftActions.push({
          id: spotId + '_to_1f',
          label: 'Take Brass Lift to 1F Grand Atrium & Dining',
          hint: 'Reception, Le Montieri Restaurant & Valet',
          instant: true,
          onInstant: function (actCtx) { actCtx.playerCtrl.teleport(135.0, 6.4, 0, y1); },
        });
      }
      if (fy !== y2) {
        liftActions.push({
          id: spotId + '_to_2f',
          label: 'Take Brass Lift to 2F Suites & Rose Jacuzzi Spa',
          hint: 'Imperial Suite 201, Suite 202 & Thermal Spa',
          instant: true,
          onInstant: function (actCtx) { actCtx.playerCtrl.teleport(135.0, 6.4, 0, y2); },
        });
      }
      if (fy !== y3) {
        liftActions.push({
          id: spotId + '_to_3f',
          label: 'Take Brass Lift to 3F Royal Penthouse & Sky Bar',
          hint: 'Canopy Penthouse 301 & Rooftop Sky Bar',
          instant: true,
          onInstant: function (actCtx) { actCtx.playerCtrl.teleport(135.0, 6.4, 0, y3); },
        });
      }
      registerSpot({
        id: spotId,
        title: labelTitle,
        floor: 0,
        category: 'town',
        x: 135.0,
        y: fy,
        z: 5.5,
        radius: 3.0,
        actions: liftActions,
      });
    }
    buildElevatorCar(hotelGroup, y1, 'hotel_lift_1f', 'Montieri Glass Lift (' + '1F Atrium' + ')', '1F');
    buildElevatorCar(hotel2Grp, y2, 'hotel_lift_2f', 'Montieri Glass Lift (' + '2F Suites & Spa' + ')', '2F');
    buildElevatorCar(hotel3Grp, y3, 'hotel_lift_3f', 'Montieri Glass Lift (' + '3F Penthouse & Sky Bar' + ')', '3F');
    addBox(sharedColliders, 135.0, 4.9, 1.85, 1.7);
    addBox(hotel2Colliders, 135.0, 4.9, 1.85, 1.7);
    addBox(hotel3Colliders, 135.0, 4.9, 1.85, 1.7);

    // Curved Crimson-Marble & Brass Reception Concierge Desk (`x = 140.4, z = 5.5`) + Backdrop Painting & Gilded Clock
    const recBackdrop = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(5.2, 3.8, 0.14)), crimsonVelvetMat);
    recBackdrop.position.set(140.4, y1 + 1.95, zN + 0.24);
    const recPaintFrame = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.5, 2.0, 0.10)), brassMat);
    recPaintFrame.position.set(140.4, y1 + 2.25, zN + 0.34);
    const recPaint = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.26, 1.76, 0.12)), paintingMat);
    recPaint.position.set(140.4, y1 + 2.25, zN + 0.36);
    const recClock = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16)), clockMat);
    recClock.rotation.x = Math.PI * 0.5;
    recClock.position.set(140.4, y1 + 3.65, zN + 0.36);
    hotelGroup.add(recBackdrop, recPaintFrame, recPaint, recClock);

    const recDesk = new THREE.Group();
    recDesk.position.set(140.4, y1, 5.5);
    const deskBody = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(4.2, 1.04, 0.88)), crimsonMarbleMat);
    deskBody.position.y = 0.52;
    const deskTop = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(4.4, 0.08, 1.02)), onyxMat);
    deskTop.position.y = 1.08;
    const deskTrim = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(4.26, 0.12, 0.92)), brassMat);
    deskTrim.position.y = 0.14;
    const deskPlaque = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.5, 0.62, 0.06)), plaqueMat);
    deskPlaque.position.set(0, 0.58, 0.46);
    recDesk.add(deskBody, deskTop, deskTrim, deskPlaque);
    // Flanking Brass Lamps & Crimson Rose Urns on Desk Ends
    [-1.75, 1.75].forEach(function (lx) {
      const lamp = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.18, 0.22, 0.34, 10)), warmGlowMat);
      lamp.position.set(lx, 1.38, 0.12);
      const urn = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.18, 0.12, 0.28, 10)), onyxMat);
      urn.position.set(lx * 0.72, 1.24, 0.14);
      const roses = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.24, 8, 6)), rosePetalMat);
      roses.position.set(lx * 0.72, 1.48, 0.14);
      recDesk.add(lamp, urn, roses);
    });
    hotelGroup.add(recDesk);
    tagInteractable(recDesk, 'hotel_concierge');
    addBox(sharedColliders, 140.4, 5.5, 4.4, 1.05);

    registerSpot({
      id: 'hotel_concierge',
      title: 'Montieri Luxury Hotels — Front Desk & Concierge',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: 140.4,
      y: y1,
      z: 6.4,
      radius: 3.8,
      actions: [
        {
          id: 'hotel_checkin_201',
          label: 'Check Into Crimson Imperial Suite 201 (₡95)',
          hint: '2F Tufted Crimson Bed, Writing Desk & Marble Bath',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 95) return actCtx.toast('Need ₡95 Crowns.');
            actCtx.game.money -= 95;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 20, composure: 18 });
            recordDispatchGossip(actCtx, 'Royal guest checked into Crimson Imperial Suite 201 at Hôtel Montieri!', 2, 2);
            actCtx.playerCtrl.teleport(140.2, 13.6, Math.PI * 0.5, y2);
            actCtx.toast('Keycard issued for 2F Imperial Suite 201! (+18 Poise)');
          },
        },
        {
          id: 'hotel_checkin_202',
          label: 'Book Riviera Ivory Deluxe Suite 202 (₡70)',
          hint: '2F Ivory King Suite & Private Bath',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 70) return actCtx.toast('Need ₡70 Crowns.');
            actCtx.game.money -= 70;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 15, composure: 14 });
            actCtx.playerCtrl.teleport(148.6, 7.6, Math.PI * 0.5, y2);
            actCtx.toast('Welcome to 2F Riviera Ivory Suite 202!');
          },
        },
        {
          id: 'hotel_checkin_301',
          label: 'Reserve 3F Royal Dome Penthouse 301 (₡160)',
          hint: '3F Canopy Bed, Fresco Salon, Private Soak & Sky Bar',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 160) return actCtx.toast('Need ₡160 Crowns.');
            actCtx.game.money -= 160;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 25, composure: 22 });
            recordDispatchGossip(actCtx, 'VIP alert! Top-floor Royal Dome Penthouse booked at Hôtel Montieri!', 4, 4);
            actCtx.playerCtrl.teleport(137.8, 10.6, Math.PI * 0.5, y3);
            actCtx.toast('Private lift key activated for 3F Royal Dome Penthouse!');
          },
        },
        {
          id: 'hotel_visit_spa',
          label: 'Visit 2F Thermal Rose Jacuzzi Spa',
          hint: 'Whirlpool thermal bath, candles & velvet daybed',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.playerCtrl.teleport(148.2, 11.2, Math.PI * 0.5, y2);
            actCtx.toast('Welcome to the 2F Thermal Rose Jacuzzi Spa!');
          },
        },
      ],
    });

    // Le Montieri Fine Dining Salon (`x = 137.2..145.4, z = 11.8..15.8`)
    const dineCarpet = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(7.2, 0.02, 3.6)), persianMat);
    dineCarpet.position.set(141.0, y1 + 0.01, 13.8);
    hotelGroup.add(dineCarpet);
    const dineTables = [
      { x: 138.6, z: 13.8, id: 'hotel_restaurant_dine' },
      { x: 141.4, z: 13.8, id: 'hotel_restaurant_dine' },
      { x: 144.2, z: 13.8, id: 'hotel_restaurant_dine' },
    ];
    dineTables.forEach(function (dt) {
      const tg = new THREE.Group();
      tg.position.set(dt.x, y1, dt.z);
      const cloth = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.68, 0.74, 0.74, 16)), creamVelvetMat);
      cloth.position.y = 0.37;
      const top = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.70, 0.70, 0.04, 16)), ivoryMat);
      top.position.y = 0.75;
      const lamp = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.11, 0.08, 0.26, 8)), warmGlowMat);
      lamp.position.set(0, 0.90, -0.18);
      const vase = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.14, 7, 5)), rosePetalMat);
      vase.position.set(0.16, 0.87, 0.10);
      [-0.36, 0.36].forEach(function (px) {
        const plate = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.16, 0.14, 0.03, 12)), mAccentMat);
        plate.position.set(px, 0.785, 0.06);
        const goblet = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.05, 0.03, 0.16, 8)), glassMat);
        goblet.position.set(px + 0.12, 0.85, -0.10);
        tg.add(plate, goblet);
      });
      // Crimson Velvet Dining Armchairs
      [-0.96, 0.96].forEach(function (cx) {
        const seat = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.46, 0.44, 0.48)), crimsonVelvetMat);
        seat.position.set(cx, 0.22, 0);
        const back = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.12, 0.56, 0.48)), crimsonVelvetMat);
        back.position.set(cx + (cx < 0 ? -0.18 : 0.18), 0.62, 0);
        tg.add(seat, back);
      });
      tg.add(cloth, top, lamp, vase);
      hotelGroup.add(tg);
      tagInteractable(tg, dt.id);
      addBox(sharedColliders, dt.x, dt.z, 2.0, 1.35);
    });
    const montieriSeats = [
      { x: 140.44, y: y1, z: 13.8, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: y1, exitX: 140.0, exitZ: 12.1, exitYaw: Math.PI, approachX: 140.1, approachZ: 12.4 },
      { x: 142.36, y: y1, z: 13.8, yaw: -Math.PI * 0.5, rigOffsetY: -0.45, floorY: y1, exitX: 142.6, exitZ: 12.1, exitYaw: Math.PI, approachX: 142.5, approachZ: 12.4 },
      { x: 137.64, y: y1, z: 13.8, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: y1, exitX: 137.4, exitZ: 12.1, exitYaw: Math.PI, approachX: 137.4, approachZ: 12.4 },
      { x: 139.56, y: y1, z: 13.8, yaw: -Math.PI * 0.5, rigOffsetY: -0.45, floorY: y1, exitX: 139.5, exitZ: 12.1, exitYaw: Math.PI, approachX: 139.5, approachZ: 12.4 },
      { x: 143.24, y: y1, z: 13.8, yaw: Math.PI * 0.5, rigOffsetY: -0.45, floorY: y1, exitX: 143.1, exitZ: 12.1, exitYaw: Math.PI, approachX: 143.1, approachZ: 12.4 },
      { x: 145.16, y: y1, z: 13.8, yaw: -Math.PI * 0.5, rigOffsetY: -0.45, floorY: y1, exitX: 145.2, exitZ: 12.1, exitYaw: Math.PI, approachX: 145.2, approachZ: 12.4 },
    ];
    registerSpot({
      id: 'hotel_restaurant_dine',
      title: 'Le Montieri Gourmet Dining Room',
      floor: 0,
      category: 'town',
      x: 141.4,
      y: y1,
      z: 13.8,
      radius: 4.5,
      seats: montieriSeats,
      actions: [
        {
          id: 'montieri_dine_course',
          label: 'Dine at Le Montieri (White-Glove Course)',
          hint: '+22 Food/s, +15 Fun/s & +10 Poise/s',
          pose: 'eat',
          anchor: {
            x: 140.44,
            y: y1,
            z: 13.8,
            yaw: Math.PI * 0.5,
            rigOffsetY: -0.45,
            floorY: y1,
            exitX: 140.0,
            exitZ: 12.1,
            exitYaw: Math.PI,
            partnerAnchor: montieriSeats[1],
            seats: montieriSeats,
          },
          rates: { hunger: 22, fun: 15, composure: 10 },
          statusText: 'Savoring Parisian tasting courses at Le Montieri...',
        },
        {
          id: 'montieri_call_meal',
          label: 'Call Friends & Guests to Dine',
          hint: 'Every guest sits in their own Montieri velvet chair!',
          type: 'call_to_meal',
          spotId: 'hotel_restaurant_dine',
        },
        {
          id: 'montieri_order_tasting',
          label: 'Order Chef Henri’s Lobster & Champagne Menu (₡48)',
          hint: '+65 Food, +22 Fun & +14 Poise',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 48) return actCtx.toast('Need ₡48 Crowns.');
            actCtx.game.money -= 48;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 65, fun: 22, composure: 14 });
            actCtx.toast('Chef Henri serves lobster thermidor & vintage champagne! (+65 Food, +22 Fun)');
          },
        },
      ],
    });

    // Grand Walkable Marble Staircase 1F -> 2F (`x = 141.4..145.4, z = 7.5..9.3`)
    const s1X0 = 141.4;
    const s1X1 = 145.4;
    const s1Z = 8.4;
    const s1Steps = 16;
    for (let st = 0; st < s1Steps; st++) {
      const frac = (st + 0.5) / s1Steps;
      const sx = s1X0 + (s1X1 - s1X0) * frac;
      const sy = y1 + (y2 - y1) * frac;
      const step = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.32, 0.28, 1.78)), whiteMarbleMat);
      step.position.set(sx, sy - 0.14, s1Z);
      const runner = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.33, 0.04, 1.05)), crimsonVelvetMat);
      runner.position.set(sx, sy + 0.01, s1Z);
      hotelGroup.add(step, runner);
    }
    const s1Slope = Math.hypot(s1X1 - s1X0, y2 - y1);
    [-0.90, 0.90].forEach(function (zOff) {
      const rail = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(s1Slope, 0.08, 0.08)), brassMat);
      rail.position.set((s1X0 + s1X1) * 0.5, (y1 + y2) * 0.5 + 0.80, s1Z + zOff);
      rail.rotation.z = Math.atan2(y2 - y1, s1X1 - s1X0);
      hotelGroup.add(rail);
      addBox(sharedColliders, (s1X0 + s1X1) * 0.5 + 0.1, s1Z + zOff, 3.8, 0.16);
    });
    // Marble enclosure under high eastern belly of 1F stairs (clear at west entry x=141.4)
    addBox(sharedColliders, 144.4, s1Z, 2.2, 1.75);

    // Commercial Hotel Kitchen (North-East 1F: `x = 146.6..152.2, z = 3.7..9.6`)
    addWallZ(hotelGroup, sharedColliders, 0, wallH1, 146.6, zN, 9.6, 5.4, 1.6, 0.22, limestoneMat);
    addWallX(hotelGroup, sharedColliders, 0, wallH1, 9.6, 146.6, xR, null, 0, 0.22, limestoneMat);
    const kitchTile = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(5.5, 0.03, 5.7)), kitchenTileMat);
    kitchTile.position.set(149.4, y1 + 0.02, 6.6);
    hotelGroup.add(kitchTile);

    const kRange = new THREE.Group();
    kRange.position.set(150.6, y1, 4.4);
    const krBase = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.6, 0.92, 0.9)), stainlessMat);
    krBase.position.y = 0.46;
    const krHood = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.7, 0.55, 1.0)), stainlessMat);
    krHood.position.set(0, 2.55, 0);
    const potRack = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.2, 0.08, 0.45)), copperMat);
    potRack.position.set(0, 2.15, 0);
    const pot1 = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.18, 0.16, 0.18, 10)), copperMat);
    pot1.position.set(-0.55, 1.02, 0);
    const pan2 = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.16, 0.14, 0.08, 10)), copperMat);
    pan2.position.set(0.45, 0.96, 0.05);
    kRange.add(krBase, krHood, potRack, pot1, pan2);
    hotelGroup.add(kRange);
    tagInteractable(kRange, 'hotel_kitchen_cook');
    addBox(sharedColliders, 150.6, 4.4, 2.7, 1.0);

    const kIsland = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.4, 0.90, 0.95)), stainlessMat);
    kIsland.position.set(149.6, y1 + 0.45, 6.8);
    hotelGroup.add(kIsland);
    tagInteractable(kIsland, 'hotel_kitchen_cook');
    addBox(sharedColliders, 149.6, 6.8, 2.5, 1.05);

    const kCooler = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.1, 2.2, 1.1)), stainlessMat);
    kCooler.position.set(151.6, y1 + 1.1, 8.6);
    hotelGroup.add(kCooler);
    addBox(sharedColliders, 151.6, 8.6, 1.2, 1.2);

    registerSpot({
      id: 'hotel_kitchen_cook',
      title: 'Montieri Commercial Hotel Kitchen',
      floor: 0,
      category: 'town',
      x: 149.6,
      y: y1,
      z: 5.7,
      radius: 3.4,
      actions: [
        {
          id: 'hotel_cook_gourmet',
          label: 'Cook with Hotel Chef Brigade',
          hint: '+20 Food/s & +10 Fun/s',
          pose: 'cook',
          anchor: { x: 149.6, y: y1, z: 5.5, yaw: Math.PI, floorY: y1, exitX: 148.2, exitZ: 5.8, exitYaw: 0 },
          rates: { hunger: 20, fun: 10 },
          statusText: 'Flambéing sauces inside Montieri Commercial Kitchen...',
        },
      ],
    });

    // 1F Lobby Marble Washroom (South-East 1F: `x = 146.6..152.2, z = 11.6..15.9`)
    addWallZ(hotelGroup, sharedColliders, 0, wallH1, 146.6, 11.6, zS, 13.6, 1.4, 0.22, limestoneMat);
    addWallX(hotelGroup, sharedColliders, 0, wallH1, 11.6, 146.6, xR, null, 0, 0.22, limestoneMat);
    placeToilet(hotelGroup, sharedColliders, {
      id: 'hotel_lobby_toilet',
      title: 'Grand Hôtel Lobby Marble Toilet',
      floor: 0,
      rustic: false,
      x: 151.2,
      y: y1,
      z: 14.9,
      yaw: -Math.PI * 0.5,
    });
    placeVanitySink(hotelGroup, sharedColliders, {
      id: 'hotel_lobby_sink',
      title: 'Grand Hôtel Lobby Vanity',
      floor: 0,
      rustic: false,
      x: 149.2,
      y: y1,
      z: 12.3,
      yaw: 0,
    });

    // -----------------------------------------------------------
    // 3. HOTEL 2F SUITES, MEZZANINE OVERLOOK & THERMAL ROSE JACUZZI SPA (y2 = 4.54)
    // -----------------------------------------------------------
    // Exterior Walls for 2F (in hotel2Grp so 2F appears cleanly!)
    const w2N = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(hotelW, wallH2, 0.30)), limestoneMat);
    w2N.position.set(hotelX, y2 + wallH2 * 0.5, zN);
    const w2S = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(hotelW, wallH2, 0.30)), limestoneMat);
    w2S.position.set(hotelX, y2 + wallH2 * 0.5, zS);
    const w2W = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.30, wallH2, hotelD)), limestoneMat);
    w2W.position.set(xL, y2 + wallH2 * 0.5, hotelZ);
    const w2E = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.30, wallH2, hotelD)), limestoneMat);
    w2E.position.set(xR, y2 + wallH2 * 0.5, hotelZ);
    hotel2Grp.add(w2N, w2S, w2W, w2E);
    [136.2, 141.6, 149.4].forEach(function (wx) {
      addArchWindow(hotel2Grp, wx, y2, zS + 0.08, 0, true);
    });

    // 2F Floor Slabs leaving Open Atrium Well (x: 135.6..140.4, z: 7.4..11.6) & 1F->2F Stair Opening (x: 141.4..145.4, z: 7.5..9.3)
    function add2FSlab(cx, cz, w, d, mat) {
      const s = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(w, 0.22, d)), mat || parquetMat);
      s.position.set(cx, y2 - 0.11, cz);
      s.receiveShadow = true;
      hotel2Grp.add(s);
    }
    add2FSlab(139.6, 5.45, 12.8, 3.9, lobbyFloorMat);   // North mezzanine & elevator gallery (x 133.2..146.0, z 3.5..7.4)
    add2FSlab(134.4, 9.5, 2.4, 4.2, lobbyFloorMat);    // West mezzanine bridge (x 133.2..135.6, z 7.4..11.6)
    add2FSlab(140.4, 13.85, 14.4, 4.5, parquetMat);    // South wing Suite 201 (x 133.2..147.6, z 11.6..16.1)
    add2FSlab(144.0, 10.45, 7.2, 2.3, lobbyFloorMat);  // Center bridge South of stairs (x 140.4..147.6, z 9.3..11.6)
    add2FSlab(146.5, 8.4, 2.2, 1.8, lobbyFloorMat);    // 2F Top Landing East of 1F->2F stairs (x 145.4..147.6, z 7.5..9.3)
    add2FSlab(150.0, 9.8, 4.8, hotelD, whiteMarbleMat); // East Wing Spa + Suite 202 (x 147.6..152.4, z 3.5..16.1)

    // Wrought-Iron & Gold Mezzanine Balustrades around Atrium Well
    const balSpecs = [
      { x: 138.0, z: 7.42, w: 4.8, d: 0.08 },
      { x: 138.0, z: 11.58, w: 4.8, d: 0.08 },
      { x: 135.62, z: 9.5, w: 0.08, d: 4.16 },
      { x: 140.42, z: 9.5, w: 0.08, d: 4.16 },
      // Guardrail along 1F->2F stairwell hatch South & North edges
      { x: 143.4, z: 7.48, w: 4.0, d: 0.08 },
      { x: 143.4, z: 9.32, w: 4.0, d: 0.08 },
    ];
    balSpecs.forEach(function (b) {
      const railMesh = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(b.w, 0.86, b.d)), darkIronMat);
      railMesh.position.set(b.x, y2 + 0.43, b.z);
      const topGold = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(b.w + 0.04, 0.07, b.d + 0.04)), brassMat);
      topGold.position.set(b.x, y2 + 0.88, b.z);
      hotel2Grp.add(railMesh, topGold);
      addBox(hotel2Colliders, b.x, b.z, b.w + 0.1, b.d + 0.14);
    });

    // 2F -> 3F Marble Staircase (ascending East x=141.6 -> 146.6 along z = 5.8)
    const s2X0 = 141.6;
    const s2X1 = 146.6;
    const s2Z = 5.8;
    for (let st = 0; st < 16; st++) {
      const frac = (st + 0.5) / 16;
      const sx = s2X0 + (s2X1 - s2X0) * frac;
      const sy = y2 + (y3 - y2) * frac;
      const step = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.38, 0.28, 1.56)), whiteMarbleMat);
      step.position.set(sx, sy - 0.14, s2Z);
      const runner = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.39, 0.04, 0.96)), crimsonVelvetMat);
      runner.position.set(sx, sy + 0.01, s2Z);
      hotel2Grp.add(step, runner);
    }
    const s2Slope = Math.hypot(s2X1 - s2X0, y3 - y2);
    [-0.80, 0.80].forEach(function (zOff) {
      const rail = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(s2Slope, 0.08, 0.08)), brassMat);
      rail.position.set((s2X0 + s2X1) * 0.5, (y2 + y3) * 0.5 + 0.80, s2Z + zOff);
      rail.rotation.z = Math.atan2(y3 - y2, s2X1 - s2X0);
      hotel2Grp.add(rail);
      addBox(hotel2Colliders, (s2X0 + s2X1) * 0.5 + 0.15, s2Z + zOff, 4.3, 0.16);
    });

    // Partition Walls on 2F: Suite 201 (South), Suite 202 (North-East), Thermal Rose Spa (South-East)
    addWallX(hotel2Grp, hotel2Colliders, y2, wallH2 - 0.1, 11.8, 133.4, 147.6, 138.2, 1.8, 0.22, limestoneMat);
    addWallZ(hotel2Grp, hotel2Colliders, y2, wallH2 - 0.1, 147.6, 9.4, zS, 11.0, 1.6, 0.22, limestoneMat);
    addWallX(hotel2Grp, hotel2Colliders, y2, wallH2 - 0.1, 9.4, 147.6, xR, null, 0, 0.22, limestoneMat);
    addWallZ(hotel2Grp, hotel2Colliders, y2, wallH2 - 0.1, 147.6, zN, 9.4, 7.8, 1.5, 0.22, limestoneMat);

    // 2F Crimson Imperial Suite 201 (`x = 133.4..147.6, z = 11.8..16.0`)
    const rug201 = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(4.2, 0.02, 3.0)), persianMat);
    rug201.position.set(142.8, y2 + 0.01, 14.0);
    hotel2Grp.add(rug201);
    placeBed(hotel2Grp, hotel2Colliders, {
      id: 'hotel_bed_201',
      title: 'Imperial Suite 201 Tufted Crimson Bed',
      floor: 0,
      canopy: false,
      x: 143.4,
      y: y2,
      z: 14.3,
      yaw: 0,
      tone: 'crimson',
      w: 2.2,
      d: 2.7,
    });
    const mCrest201 = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16)), mAccentMat);
    mCrest201.rotation.x = Math.PI * 0.5;
    mCrest201.position.set(143.4, y2 + 1.48, 15.62);
    hotel2Grp.add(mCrest201);
    if (kit && typeof kit.buildWritingDesk === 'function') {
      const desk201 = kit.buildWritingDesk('hotel_bed_201', 'crimson');
      desk201.position.set(139.2, y2, 15.1);
      hotel2Grp.add(desk201);
      addBox(hotel2Colliders, 139.2, 15.1, 1.5, 0.75);
    }
    placeToilet(hotel2Grp, hotel2Colliders, {
      id: 'hotel_201_toilet',
      title: 'Suite 201 Marble Toilet',
      floor: 0,
      x: 134.5,
      y: y2,
      z: 14.9,
      yaw: Math.PI * 0.5,
    });
    placeVanitySink(hotel2Grp, hotel2Colliders, {
      id: 'hotel_201_sink',
      title: 'Suite 201 Marble Vanity',
      floor: 0,
      x: 136.4,
      y: y2,
      z: 15.0,
      yaw: Math.PI,
    });

    // 2F Riviera Ivory Deluxe Suite 202 (`x = 147.6..152.2, z = 3.7..9.4`)
    placeBed(hotel2Grp, hotel2Colliders, {
      id: 'hotel_bed_202',
      title: 'Riviera Ivory Suite 202 King Bed',
      floor: 0,
      canopy: false,
      x: 150.6,
      y: y2,
      z: 5.5,
      yaw: 0,
      tone: 'champagne',
      w: 2.0,
      d: 2.6,
    });
    placeToilet(hotel2Grp, hotel2Colliders, {
      id: 'hotel_202_toilet',
      title: 'Suite 202 Marble Toilet',
      floor: 0,
      x: 148.6,
      y: y2,
      z: 4.5,
      yaw: 0,
    });

    // 2F Thermal Rose Jacuzzi Spa (Photo 10: `x = 147.6..152.2, z = 9.4..16.0`)
    const spaStep = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.9, 0.26, 2.7)), whiteMarbleMat);
    spaStep.position.set(150.1, y2 + 0.13, 12.6);
    const spaRim = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.5, 0.30, 2.3)), whiteMarbleMat);
    spaRim.position.set(150.1, y2 + 0.36, 12.6);
    const spaWater = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.0, 0.12, 1.8)), spaGlowWaterMat);
    spaWater.position.set(150.1, y2 + 0.48, 12.6);
    hotel2Grp.add(spaStep, spaRim, spaWater);
    tagInteractable(spaRim, 'hotel_spa_jacuzzi');
    tagInteractable(spaWater, 'hotel_spa_jacuzzi');
    addBox(hotel2Colliders, 150.1, 12.6, 2.7, 2.5);

    // Classical White Marble Statue in Arched Niche on East Spa Wall + Candles + Monogrammed "M" Towel Tray
    const statuePedestal = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.65, 1.0, 0.55)), whiteMarbleMat);
    statuePedestal.position.set(151.9, y2 + 0.5, 12.6);
    const statueBody = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.18, 0.24, 1.35, 10)), whiteMarbleMat);
    statueBody.position.set(151.9, y2 + 1.65, 12.6);
    const statueHead = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.16, 10, 8)), whiteMarbleMat);
    statueHead.position.set(151.9, y2 + 2.45, 12.6);
    hotel2Grp.add(statuePedestal, statueBody, statueHead);

    // Rolled Cream "M" Towels on Brass Tray + Hurricane Candles
    const towelTray = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.32, 0.30, 0.04, 12)), brassMat);
    towelTray.position.set(148.3, y2 + 0.04, 13.9);
    hotel2Grp.add(towelTray);
    [-0.10, 0.10].forEach(function (tx) {
      const towel = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.34, 10)), mAccentMat);
      towel.rotation.x = Math.PI * 0.5;
      towel.position.set(148.3 + tx, y2 + 0.14, 13.9);
      hotel2Grp.add(towel);
    });
    const spaCandles = [];
    [[148.4, 11.1], [151.6, 11.1], [148.4, 14.2], [151.6, 14.2]].forEach(function (cp) {
      const glassC = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 8)), glassMat);
      glassC.position.set(cp[0], y2 + 0.12, cp[1]);
      const flame = new THREE.Mesh(keepGeo(new THREE.ConeGeometry(0.045, 0.11, 6)), warmGlowMat);
      flame.position.set(cp[0], y2 + 0.26, cp[1]);
      hotel2Grp.add(glassC, flame);
      spaCandles.push(flame);
    });
    if (spaCandles.length) animatedFlames.push(spaCandles);

    // Crimson Spa Daybed (`150.0, 15.1`)
    const spaDaybed = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.1, 0.42, 0.95)), crimsonVelvetMat);
    spaDaybed.position.set(150.0, y2 + 0.21, 15.1);
    hotel2Grp.add(spaDaybed);
    tagInteractable(spaDaybed, 'hotel_spa_jacuzzi');
    addBox(hotel2Colliders, 150.0, 15.1, 2.2, 1.0);

    registerSpot({
      id: 'hotel_spa_jacuzzi',
      title: 'Thermal Rosewater Jacuzzi & Spa Salon',
      floor: 0,
      category: 'town',
      x: 148.5,
      y: y2,
      z: 12.6,
      radius: 4.0,
      actions: [
        {
          id: 'spa_rose_soak',
          label: 'Soak in Glowing Rosewater Thermal Jacuzzi',
          hint: '+28 Hygiene/s, +24 Energy/s, +18 Poise/s & +14 Fun/s',
          pose: 'bathe',
          anchor: {
            x: 150.1,
            y: y2 + 0.18,
            z: 12.6,
            yaw: -Math.PI * 0.5,
            rigOffsetY: -0.35,
            floorY: y2,
            exitX: 148.1,
            exitZ: 12.6,
            exitYaw: -Math.PI * 0.5,
          },
          rates: { hygiene: 28, energy: 24, composure: 18, fun: 14 },
          statusText: 'Unwinding inside Montieri Thermal Rosewater Whirlpool...',
        },
        {
          id: 'spa_massage_daybed',
          label: 'Lounge on Crimson Spa Daybed (₡35)',
          hint: '+40 Energy, +25 Poise & Monogrammed Warm Towels',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 35) return actCtx.toast('Need ₡35 Crowns.');
            actCtx.game.money -= 35;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 40, composure: 25, hygiene: 18, fun: 14 });
            actCtx.toast('Spa Therapist Inès wraps you in warm "M" monogrammed robes! (+40 Energy, +25 Poise)');
          },
        },
      ],
    });

    // -----------------------------------------------------------
    // 4. HOTEL 3F ROYAL DOME PENTHOUSE SUITE 301 & ROOFTOP SKY BAR (y3 = 8.94)
    // -----------------------------------------------------------
    const w3N = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(hotelW, wallH3, 0.30)), limestoneMat);
    w3N.position.set(hotelX, y3 + wallH3 * 0.5, zN);
    const w3S = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(12.6, wallH3, 0.30)), limestoneMat);
    w3S.position.set(139.5, y3 + wallH3 * 0.5, zS);
    const w3W = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.30, wallH3, hotelD)), limestoneMat);
    w3W.position.set(xL, y3 + wallH3 * 0.5, hotelZ);
    hotel3Grp.add(w3N, w3S, w3W);
    [136.2, 141.6].forEach(function (wx) {
      addArchWindow(hotel3Grp, wx, y3, zS + 0.08, 0, true);
    });

    // 3F Floor Slabs leaving 2F->3F Stairwell Hatch (x: 141.6..146.6, z: 5.0..6.6) open
    function add3FSlab(cx, cz, w, d, mat) {
      const s = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(w, 0.22, d)), mat || parquetMat);
      s.position.set(cx, y3 - 0.11, cz);
      s.receiveShadow = true;
      hotel3Grp.add(s);
    }
    add3FSlab(137.4, 5.15, 8.4, 3.3, lobbyFloorMat);   // NW Lift Lobby (x 133.2..141.6, z 3.5..6.8)
    add3FSlab(146.8, 4.25, 11.2, 1.5, lobbyFloorMat);  // North Stair Rim (x 141.6..152.4, z 3.5..5.0)
    add3FSlab(139.4, 11.45, 12.4, 9.3, parquetMat);    // Royal Dome Penthouse 301 (x 133.2..145.6, z 6.8..16.1)
    add3FSlab(149.0, 10.55, 6.8, 11.1, lobbyFloorMat); // East Rooftop Sky Bar Terrace (x 145.6..152.4, z 5.0..16.1)

    // 3F Stairwell Hatch Guardrails (z = 5.05, z = 6.62, x = 141.6)
    [
      { x: 144.1, z: 5.02, w: 5.0, d: 0.08 },
      { x: 144.1, z: 6.62, w: 5.0, d: 0.08 },
      { x: 141.62, z: 5.82, w: 0.08, d: 1.6 },
    ].forEach(function (g) {
      const rail = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(g.w, 0.86, g.d)), darkIronMat);
      rail.position.set(g.x, y3 + 0.43, g.z);
      const topG = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(g.w + 0.04, 0.06, g.d + 0.04)), brassMat);
      topG.position.set(g.x, y3 + 0.88, g.z);
      hotel3Grp.add(rail, topG);
      addBox(hotel3Colliders, g.x, g.z, g.w + 0.1, g.d + 0.14);
    });

    // Penthouse Partition Walls (z = 6.8 doorway at 137.8; x = 145.6 doorway to Sky Bar at z = 8.4)
    addWallX(hotel3Grp, hotel3Colliders, y3, wallH3 - 0.1, 6.8, 133.4, 145.6, 137.8, 1.8, 0.22, limestoneMat);
    addWallZ(hotel3Grp, hotel3Colliders, y3, wallH3 - 0.1, 145.6, 6.8, zS, 8.6, 1.8, 0.22, limestoneMat);

    // Penthouse Royal Dome Canopy Bed on Raised Cream Dais (`x = 141.4, z = 12.2`)
    const dais = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(2.35, 2.55, 0.22, 24)), creamVelvetMat);
    dais.position.set(141.4, y3 + 0.11, 12.2);
    const daisRim = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(2.38, 2.38, 0.05, 24)), brassMat);
    daisRim.position.set(141.4, y3 + 0.21, 12.2);
    hotel3Grp.add(dais, daisRim);
    placeBed(hotel3Grp, hotel3Colliders, {
      id: 'hotel_bed_301',
      title: 'Royal Dome Penthouse Canopy Bed',
      floor: 0,
      canopy: true,
      x: 141.4,
      y: y3 + 0.22,
      z: 12.4,
      yaw: 0,
      tone: 'champagne',
      w: 2.3,
      d: 2.8,
    });
    // Sheer Royal Canopy Drapes at Bed Corners
    [[-1.1, -1.3], [1.1, -1.3], [-1.1, 1.3], [1.1, 1.3]].forEach(function (off) {
      const drape = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.12, 0.18, 2.75, 8)), sheerCurtainMat);
      drape.position.set(141.4 + off[0], y3 + 1.6, 12.4 + off[1]);
      hotel3Grp.add(drape);
    });

    // Penthouse Salon Rug, Ivory/Gold Louis XVI Sofa & Private Penthouse Bath
    const pentRug = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.8, 0.02, 3.2)), persianMat);
    pentRug.position.set(136.4, y3 + 0.01, 10.6);
    const pentTbl = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.62, 0.52, 0.44, 16)), onyxMat);
    pentTbl.position.set(136.4, y3 + 0.22, 10.6);
    const pentSofa = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.1, 0.78, 0.86)), creamVelvetMat);
    pentSofa.position.set(136.4, y3 + 0.39, 9.2);
    hotel3Grp.add(pentRug, pentTbl, pentSofa);
    addCircle(hotel3Colliders, 136.4, 10.6, 0.65);
    addBox(hotel3Colliders, 136.4, 9.2, 2.2, 0.95);

    if (placeTub) {
      placeTub(hotel3Grp, hotel3Colliders, {
        id: 'hotel_bath_301',
        title: 'Penthouse Panoramic Soaking Tub',
        floor: 0,
        x: 134.8,
        y: y3,
        z: 14.3,
        yaw: Math.PI * 0.5,
        exitZOffset: 1.0,
      });
    }
    placeToilet(hotel3Grp, hotel3Colliders, {
      id: 'hotel_301_toilet',
      title: 'Penthouse Marble Toilet',
      floor: 0,
      x: 137.2,
      y: y3,
      z: 14.9,
      yaw: Math.PI,
    });

    // 3F Rooftop Sky Bar & Terrace (`x = 145.6..152.2, z = 6.8..16.0`)
    // Glass & Gold Safety Terrace Parapet along East & South edges
    const skyGlassE = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.08, 1.05, 9.2)), glassMat);
    skyGlassE.position.set(xR - 0.12, y3 + 0.52, 11.4);
    const skyGlassS = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(6.6, 1.05, 0.08)), glassMat);
    skyGlassS.position.set(149.0, y3 + 0.52, zS - 0.12);
    hotel3Grp.add(skyGlassE, skyGlassS);

    const skyBarGrp = new THREE.Group();
    skyBarGrp.position.set(149.4, y3, 11.4);
    const barBody = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.1, 1.06, 3.6)), onyxMat);
    barBody.position.y = 0.53;
    const barCounter = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.28, 0.09, 3.8)), brassMat);
    barCounter.position.y = 1.08;
    const barBackShelf = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.45, 2.1, 2.8)), onyxMat);
    barBackShelf.position.set(1.45, 1.05, 0);
    skyBarGrp.add(barBody, barCounter, barBackShelf);
    [-1.1, 0, 1.1].forEach(function (bz) {
      const stool = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.24, 0.18, 0.72, 12)), crimsonVelvetMat);
      stool.position.set(-0.92, 0.36, bz);
      const flute = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.05, 0.03, 0.18, 8)), warmGlowMat);
      flute.position.set(-0.22, 1.22, bz);
      skyBarGrp.add(stool, flute);
    });
    hotel3Grp.add(skyBarGrp);
    tagInteractable(skyBarGrp, 'hotel_skybar');
    addBox(hotel3Colliders, 149.4, 11.4, 1.35, 3.8);
    addBox(hotel3Colliders, 150.85, 11.4, 0.55, 2.9);

    const skyLoungeTbl = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.65, 0.55, 0.68, 14)), onyxMat);
    skyLoungeTbl.position.set(149.0, y3 + 0.34, 14.6);
    hotel3Grp.add(skyLoungeTbl);
    tagInteractable(skyLoungeTbl, 'hotel_skybar');
    addCircle(hotel3Colliders, 149.0, 14.6, 0.72);

    registerSpot({
      id: 'hotel_skybar',
      title: '3F Montieri Rooftop Sky Bar & Lounge',
      floor: 0,
      category: 'town',
      x: 148.0,
      y: y3,
      z: 11.4,
      radius: 4.2,
      actions: [
        {
          id: 'skybar_sip',
          label: 'Order Sunset Champagne & Macarons (₡28)',
          hint: '+28 Fun, +16 Poise & +14 Food',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 28) return actCtx.toast('Need ₡28 Crowns.');
            actCtx.game.money -= 28;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ fun: 28, composure: 16, hunger: 14 });
            actCtx.toast('Barman Hugo pours chilled Grand Cru overlooking Riviera Boulevard!');
          },
        },
        {
          id: 'skybar_lounge_sit',
          label: 'Dine & Toast with Companion at Sky Bar',
          hint: '+18 Fun/s, +14 Poise/s & +12 Food/s (Invite Friend!)',
          pose: 'eat',
          anchor: {
            x: 148.1,
            y: y3,
            z: 14.6,
            yaw: Math.PI * 0.5,
            rigOffsetY: -0.45,
            floorY: y3,
            exitX: 147.2,
            exitZ: 14.6,
            exitYaw: -Math.PI * 0.5,
            partnerAnchor: { x: 149.9, y: y3, z: 14.6, yaw: -Math.PI * 0.5, rigOffsetY: -0.45 },
          },
          rates: { fun: 18, composure: 14, hunger: 12 },
          statusText: 'Toasting under the stars at the 3F Montieri Sky Bar...',
        },
      ],
    });

    // -----------------------------------------------------------
    // 5. CEILING MEDALLION, CRYSTAL CHANDELIERS & PARISIAN MANSARD DOME ROOF
    // -----------------------------------------------------------
    const frescoDisc = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(2.6, 2.6, 0.08, 24)), frescoMat);
    frescoDisc.position.set(140.5, y3 + wallH3 - 0.06, 11.6);
    hotelRoofGrp.add(frescoDisc);

    [
      [137.4, y1 + wallH1 + wallH2 - 1.2, hotelZ, 1.35],
      [141.4, y1 + wallH1 - 0.9, 13.8, 0.95],
      [149.4, y2 + wallH2 - 0.9, 12.6, 0.95],
      [140.5, y3 + wallH3 - 0.9, 11.6, 1.15],
    ].forEach(function (ch) {
      const chMesh = buildChandelierLocal(ch[3]);
      chMesh.position.set(ch[0], ch[1], ch[2]);
      hotelRoofGrp.add(chMesh);
    });

    // Parisian Slate Mansard Roof + Octagonal Gold Dome Cupola
    const roofY = y3 + wallH3;
    const mansardBase = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(hotelW + 0.7, 0.45, hotelD + 0.7)), limestoneMat);
    mansardBase.position.set(hotelX, roofY + 0.22, hotelZ);
    const mansardSlope = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(8.2, 11.2, 2.2, 4)), slateRoofMat);
    mansardSlope.rotation.y = Math.PI * 0.25;
    mansardSlope.scale.set(1.22, 1, 0.85);
    mansardSlope.position.set(hotelX, roofY + 1.55, hotelZ);
    const domeCupola = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(2.3, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.5)), slateRoofMat);
    domeCupola.position.set(hotelX - 1.2, roofY + 2.45, hotelZ);
    const spire = new THREE.Mesh(keepGeo(new THREE.ConeGeometry(0.24, 1.3, 10)), brassMat);
    spire.position.set(hotelX - 1.2, roofY + 5.1, hotelZ);
    hotelRoofGrp.add(mansardBase, mansardSlope, domeCupola, spire);

    const plotSign = kit && typeof kit.buildPlotSign === 'function' ? kit.buildPlotSign('Grand Hôtel Montieri', '#5c1824') : null;
    if (plotSign) {
      plotSign.position.set(123.6, 0, 7.1);
      plotSign.rotation.y = -Math.PI * 0.5;
      hotelGroup.add(plotSign);
    }

    // -----------------------------------------------------------
    // 6. ZONES, CUTAWAYS, DIRECTORY & NAVIGATION HELPERS
    // -----------------------------------------------------------
    walkableFloors.push({ minX: lotMinX, maxX: xR, minZ: zN, maxZ: zS, y: 0.02 });
    walkableFloors.push({ minX: xL, maxX: xR, minZ: zN, maxZ: zS, y: y1 });

    cutaways.push({
      minX: xL - 0.6,
      maxX: xR + 0.6,
      minZ: zN - 0.6,
      maxZ: zS + 0.6,
      upperGrp: hotel2Grp,
      floor3Grp: hotel3Grp,
      roofGrp: hotelRoofGrp,
    });

    townZones.push({
      minX: lotMinX,
      maxX: xL,
      minZ: zN,
      maxZ: zS,
      label: 'Hôtel Montieri Valet Courtyard',
    });
    townZones.push({
      minX: xL,
      maxX: xR,
      minZ: zN,
      maxZ: zS,
      label: 'Grand Hôtel Montieri Paris',
    });

    const hotelDir = {
      id: 'hotel_dir',
      title: 'Grand Hôtel Montieri Paris (3 Storeys + Valet Lot)',
      floor: 0,
      category: 'town',
      x: 130.0,
      y: 0.06,
      z: hotelZ,
      radius: 3.0,
      isDirectoryOnly: true,
      actions: [
        {
          id: 'go_hotel_atrium',
          label: 'Visit Montieri 1F Atrium, Reception & Le Montieri',
          hint: 'Walk through the valet courtyard into the Grand Atrium',
          instant: true,
          onInstant: function (actCtx) { actCtx.playerCtrl.teleport(134.8, hotelZ, Math.PI * 0.5, y1); },
        },
        {
          id: 'go_hotel_spa',
          label: 'Visit 2F Thermal Rose Jacuzzi Spa & Suites',
          hint: 'Sunken rosewater whirlpool, Imperial Suite 201 & Suite 202',
          instant: true,
          onInstant: function (actCtx) { actCtx.playerCtrl.teleport(147.8, 11.4, 0, y2); },
        },
        {
          id: 'go_hotel_skybar',
          label: 'Visit 3F Royal Penthouse & Rooftop Sky Bar',
          hint: 'Canopy dome suite & panoramic champagne terrace',
          instant: true,
          onInstant: function (actCtx) { actCtx.playerCtrl.teleport(147.6, 11.4, Math.PI * 0.5, y3); },
        },
      ],
    };
    registerSpot(hotelDir);
    townDirectory.push(hotelDir);

    function groundHeightAtHotel(x, z, yNow) {
      if (x < xL || x > xR || z < zN || z > zS) {
        if (x >= lotMinX && x <= xL && z >= zN && z <= zS) return 0.05;
        return null;
      }
      // 1F <-> 2F Staircase Ramp (x 141.2..146.2, z 7.45..9.35)
      if (yNow < 6.8 && x >= s1X0 - 0.35 && x <= s1X1 + 0.35 && z >= s1Z - 0.92 && z <= s1Z + 0.92) {
        const t1 = THREE.MathUtils.clamp((x - s1X0) / (s1X1 - s1X0), 0, 1);
        const h1 = y1 + t1 * (y2 - y1);
        if (Math.abs(yNow - h1) < 2.4) return h1;
      }
      // 2F <-> 3F Staircase Ramp (x 141.6..146.6, z 5.0..6.6)
      if (yNow >= 2.2 && x >= s2X0 - 0.35 && x <= s2X1 + 0.35 && z >= s2Z - 0.85 && z <= s2Z + 0.85) {
        const t2 = THREE.MathUtils.clamp((x - s2X0) / (s2X1 - s2X0), 0, 1);
        const h2 = y2 + t2 * (y3 - y2);
        if (Math.abs(yNow - h2) < 2.4) return h2;
      }
      if (yNow >= 7.2) return y3;
      if (yNow >= 2.6) return y2;
      return y1;
    }

    function isOnUpperFloor(x, z, yNow) {
      return yNow >= 2.6 && x >= xL - 0.8 && x <= xR + 0.8 && z >= zN - 0.8 && z <= zS + 0.8;
    }

    function resolveBoxList(list, rx, rz, radius) {
      let x = rx;
      let z = rz;
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < list.length; i++) {
          const c = list[i];
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
      return { x: x, z: z };
    }

    function resolveUpperCollision(nx, nz, radius, yNow) {
      if (!isOnUpperFloor(nx, nz, yNow)) return null;
      let rx = THREE.MathUtils.clamp(nx, xL + 0.42, xR - 0.42);
      let rz = THREE.MathUtils.clamp(nz, zN + 0.42, zS - 0.42);
      if (yNow >= 7.2) {
        return resolveBoxList(hotel3Colliders, rx, rz, radius);
      }
      return resolveBoxList(hotel2Colliders, rx, rz, radius);
    }

    function detectZone(pos) {
      if (pos.x >= lotMinX && pos.x < xL && pos.z >= zN && pos.z <= zS) {
        return 'Hôtel Montieri Valet Courtyard';
      }
      if (pos.x >= xL && pos.x <= xR && pos.z >= zN && pos.z <= zS) {
        if (pos.y >= 7.2) {
          return pos.x >= 145.6 ? 'Hôtel Montieri Sky Bar & Terrace (3F)' : 'Hôtel Montieri Royal Penthouse (3F)';
        }
        if (pos.y >= 2.6) {
          return pos.x >= 146.4 && pos.z >= 9.4 ? 'Hôtel Montieri Thermal Rose Spa (2F)' : 'Hôtel Montieri VIP Suites (2F)';
        }
        return pos.z >= 11.6 && pos.x < 146.5 ? 'Le Montieri Gourmet Dining (1F)' : 'Grand Hôtel Montieri Atrium (1F)';
      }
      return null;
    }

    return {
      groundHeightAtHotel: groundHeightAtHotel,
      isOnUpperFloor: isOnUpperFloor,
      resolveUpperCollision: resolveUpperCollision,
      detectZone: detectZone,
      dispose: function () {
        localMats.forEach(function (m) { m.dispose(); });
        localGeos.forEach(function (g) { g.dispose(); });
        localTex.forEach(function (t) { t.dispose(); });
      },
    };
  }

  window.CrownHotel = {
    build: buildMontieriHotel,
  };
})();
