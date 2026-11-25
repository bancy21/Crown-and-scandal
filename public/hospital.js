(function () {
  'use strict';

  function buildRoyalHospital(ctx) {
    const THREE = ctx.THREE;
    const kit = ctx.kit;
    const townGroup = ctx.townGroup;
    if (!THREE || !kit || !townGroup) return null;

    const sharedColliders = ctx.sharedColliders;
    const ivoryMat = ctx.ivoryMat;
    const slateRoofMat = ctx.slateRoofMat;
    const boxwoodMat = ctx.boxwoodMat;
    const poolDeckMat = ctx.poolDeckMat;
    const sidewalkMat = ctx.sidewalkMat;
    const driveMat = ctx.driveMat;
    const clinicalFloorMat = ctx.clinicalFloorMat;
    const hospitalWallMat = ctx.hospitalWallMat;

    const addBox = ctx.addBox;
    const addCircle = ctx.addCircle;
    const addWallX = ctx.addWallX;
    const addWallZ = ctx.addWallZ;
    const placeToilet = ctx.placeToilet;
    const placeVanitySink = ctx.placeVanitySink;
    const placeShower = ctx.placeShower;
    const tagInteractable = ctx.tagInteractable;
    const registerSpot = ctx.registerSpot;
    const addEnterableLot = ctx.addEnterableLot;
    const registerDrivableCar = ctx.registerDrivableCar;
    const recordDispatchGossip = ctx.recordDispatchGossip;
    const townDirectory = ctx.townDirectory;
    const townZones = ctx.townZones;
    const spotLookup = ctx.spots;

    const localMats = [];
    const localGeos = [];
    const localTex = [];
    const keepMat = function (m) { localMats.push(m); return m; };
    const keepGeo = function (g) { localGeos.push(g); return g; };
    const keepTex = function (t) {
      t.colorSpace = THREE.SRGBColorSpace;
      localTex.push(t);
      return t;
    };

    function makeCanvasTex(w, h, drawFn, repeat) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g2d = c.getContext('2d');
      drawFn(g2d, w, h);
      const tex = keepTex(new THREE.CanvasTexture(c));
      if (repeat) {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeat[0], repeat[1]);
      }
      return tex;
    }

    // -----------------------------------------------------------
    // PROCEDURAL MATERIALS (Inspired by Reference Photos 1, 2 & 3)
    // -----------------------------------------------------------
    // Image 2: Clinical Sage-Green Modular Wall Panels + Linear Grooves
    const sageWallTex = makeCanvasTex(256, 256, function (c, w, h) {
      c.fillStyle = '#476142';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(26, 40, 24, 0.42)';
      c.lineWidth = 3;
      for (let x = 0; x <= w; x += 64) {
        c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke();
      }
      for (let y = 0; y <= h; y += 85) {
        c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
      }
      c.fillStyle = 'rgba(255, 255, 255, 0.04)';
      c.fillRect(4, 4, w - 8, 22);
    }, [2, 1]);
    const sageWallMat = keepMat(new THREE.MeshStandardMaterial({ map: sageWallTex, roughness: 0.56 }));

    // Image 1: Rich Vertical Fluted Walnut Paneling for VIP Recovery Suite
    const walnutFluteTex = makeCanvasTex(256, 256, function (c, w, h) {
      c.fillStyle = '#5a3621';
      c.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 12) {
        c.fillStyle = (x % 24 === 0) ? '#6e452b' : '#402415';
        c.fillRect(x, 0, 7, h);
      }
      c.fillStyle = 'rgba(255, 214, 156, 0.08)';
      c.fillRect(0, 0, w, 18);
    }, [2, 1]);
    const walnutFluteMat = keepMat(new THREE.MeshStandardMaterial({ map: walnutFluteTex, roughness: 0.44 }));

    // Image 1 & 2: Quilted Waffle Blanket Texture (Cream-Beige for Ward, Silk-Ivory for VIP)
    const waffleTex = makeCanvasTex(256, 256, function (c, w, h) {
      c.fillStyle = '#e6dcc6';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(165, 146, 114, 0.45)';
      c.lineWidth = 2;
      for (let i = -h; i < w + h; i += 24) {
        c.beginPath(); c.moveTo(i, 0); c.lineTo(i + h, h); c.stroke();
        c.beginPath(); c.moveTo(i, h); c.lineTo(i + h, 0); c.stroke();
      }
    }, [2, 2]);
    const wardBlanketMat = keepMat(new THREE.MeshStandardMaterial({ map: waffleTex, roughness: 0.72 }));
    const vipBlanketMat = keepMat(new THREE.MeshStandardMaterial({ map: waffleTex, color: 0xfbf7ee, roughness: 0.52 }));

    // Image 3: High-Contrast Multi-Parameter ECG & SpO2 Telemetry Monitor Screen (62 BPM / 99 / 89/54)
    const ecgScreenTex = makeCanvasTex(256, 192, function (c, w, h) {
      c.fillStyle = '#091117';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#182b38';
      c.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 24) { c.beginPath(); c.moveTo(gx, 0); c.lineTo(gx, h); c.stroke(); }
      for (let gy = 0; gy < h; gy += 24) { c.beginPath(); c.moveTo(0, gy); c.lineTo(w, gy); c.stroke(); }
      // Green ECG QRS trace
      c.strokeStyle = '#47f268';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(8, 42);
      for (let x = 16; x < 178; x += 38) {
        c.lineTo(x, 42); c.lineTo(x + 5, 36); c.lineTo(x + 9, 44);
        c.lineTo(x + 13, 12); c.lineTo(x + 18, 56); c.lineTo(x + 22, 42);
      }
      c.stroke();
      // Cyan pleth curve
      c.strokeStyle = '#38d8ff';
      c.lineWidth = 2.5;
      c.beginPath();
      for (let x = 8; x < 178; x += 6) {
        const y = 96 + Math.sin(x * 0.14) * 10 - (x % 36 < 12 ? 8 : 0);
        if (x === 8) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
      // Magenta arterial trace
      c.strokeStyle = '#ff4da6';
      c.lineWidth = 2.2;
      c.beginPath();
      for (let x = 8; x < 178; x += 6) {
        const y = 148 + Math.cos(x * 0.18) * 11;
        if (x === 8) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
      // Numeric Vital Readouts
      c.font = 'bold 26px sans-serif';
      c.fillStyle = '#47f268'; c.fillText('62', 194, 48);
      c.fillStyle = '#38d8ff'; c.fillText('99', 194, 102);
      c.font = 'bold 18px sans-serif';
      c.fillStyle = '#ff4da6'; c.fillText('89/54', 184, 152);
    });
    const ecgScreenMat = keepMat(new THREE.MeshBasicMaterial({ map: ecgScreenTex }));

    // Image 1: Soft Azure-Blue Multi-Monitor ICU Display
    const icuScreenTex = makeCanvasTex(256, 192, function (c, w, h) {
      c.fillStyle = '#0d263e';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#62d4ff';
      c.lineWidth = 3;
      c.beginPath();
      for (let x = 10; x < 246; x += 8) {
        const y = 62 + Math.sin(x * 0.12) * 16;
        if (x === 10) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.stroke();
      c.fillStyle = '#a4e8ff';
      c.font = 'bold 18px sans-serif';
      c.fillText('HR 68  SpO2 99%', 18, 28);
      c.fillStyle = '#25557a';
      c.fillRect(18, 106, 220, 68);
      c.fillStyle = '#5ee6b5';
      c.fillRect(28, 122, 130, 12);
      c.fillRect(28, 144, 180, 12);
    });
    const icuScreenMat = keepMat(new THREE.MeshBasicMaterial({ map: icuScreenTex }));

    const warmGlowMat = keepMat(new THREE.MeshBasicMaterial({ color: 0xffe6b3 }));
    const warmFloorGlowMat = keepMat(new THREE.MeshBasicMaterial({ color: 0xffd894, transparent: true, opacity: 0.42 }));
    const cognacMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xb55d35, roughness: 0.48 }));
    const surgicalDrapeMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x266ab5, roughness: 0.52 }));
    const sheerCurtainMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xf4eee0, roughness: 0.7, transparent: true, opacity: 0.62 }));
    const beigeCurtainMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xdccdb3, roughness: 0.78 }));
    const chromeMat = kit.palette.silver;
    const oakMat = kit.palette.oak;
    const ironMat = kit.palette.iron;
    const whiteMat = kit.palette.ivory;
    const porcelainMat = kit.palette.porcelain;

    function buildBayPlaque(numText, bgHex, planeW, planeH, fontSize) {
      const plaqueTex = makeCanvasTex(256, 64, function (c, w, h) {
        c.fillStyle = bgHex || '#3f593b';
        c.fillRect(0, 0, w, h);
        c.strokeStyle = 'rgba(255,255,255,0.42)';
        c.lineWidth = 3;
        c.strokeRect(3, 3, w - 6, h - 6);
        c.fillStyle = '#f8faf6';
        c.font = 'bold ' + (fontSize || 34) + 'px sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(numText, w * 0.5, h * 0.5 + 2);
      });
      return new THREE.Mesh(
        keepGeo(new THREE.PlaneGeometry(planeW || 0.52, planeH || 0.24)),
        keepMat(new THREE.MeshBasicMaterial({ map: plaqueTex }))
      );
    }

    function addInteriorSwingDoor(id, title, x, y, z, rotY, width, leafColor) {
      if (typeof kit.buildHingedDoors !== 'function') return;
      const dObj = kit.buildHingedDoors({
        width: width,
        height: 2.65,
        count: width >= 1.8 ? 2 : 1,
        frameMat: ivoryMat,
        leafColor: leafColor || 0xf4f9fb,
        handleMat: chromeMat,
        filigree: false,
      });
      dObj.group.position.set(x, y, z);
      dObj.group.rotation.y = rotY;
      dObj.group.userData.noMerge = true;
      dObj.group.userData.noFreeze = true;
      townGroup.add(dObj.group);
      tagInteractable(dObj.leftPivot, id);
      if (dObj.rightPivot) tagInteractable(dObj.rightPivot, id);
      if (Array.isArray(ctx.dynamicNodes)) ctx.dynamicNodes.push(dObj.group);
      if (Array.isArray(ctx.townDoors)) {
        ctx.townDoors.push({
          id: id,
          title: title,
          x: x,
          y: y,
          z: z,
          radius: 3.4,
          doors: dObj,
          openRatio: 0,
          manualOpen: false,
        });
      }
    }

    // -----------------------------------------------------------
    // ARCHITECTURAL SHELL — HÔPITAL ROYAL DE VERSAILLES
    // -----------------------------------------------------------
    const hosp = addEnterableLot({
      id: 'plot_hospital',
      title: 'Hôpital Royal de Versailles',
      signTitle: 'Royal Hospital',
      signColor: '#3f593b',
      subtitle: 'Separated Operating Room (OR), Emergency Room (ER), Ward Bays 01-03, VIP Suites 06-07 & Healing Garden',
      dirCategory: 'town',
      x: 79.6, z: -23.0, w: 18.0, d: 13.0,
      wallH: 4.2,
      flatRoof: true,
      doorFace: 'NS',
      doorW: 2.8,
      floorMat: clinicalFloorMat,
      wallMat: hospitalWallMat,
      roofMat: slateRoofMat,
      shutterMat: sageWallMat,
    });
    const hospPorch = kit.buildFrontPorch(6.6, 2.2, ivoryMat);
    hospPorch.position.set(hosp.cx, 0, hosp.cz + hosp.d * 0.5 + 1.1);
    townGroup.add(hospPorch);

    // Exterior ER Canopy Badge on South-West Facade beside Ambulance Driveway
    const erExtSign = buildBayPlaque('EMERGENCY · ER', '#a61f2e', 2.4, 0.48, 24);
    erExtSign.position.set(hosp.cx - 5.2, 3.15, hosp.cz + hosp.d * 0.5 + 0.16);
    townGroup.add(erExtSign);

    // Red Cross Rooflines
    [-1, 1].forEach(function (sideZ) {
      const zCross = hosp.cz + sideZ * (hosp.d * 0.5 + 0.55);
      const crossH = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.2, 0.55, 0.25)), kit.palette.fabricColors.crimson);
      crossH.position.set(hosp.cx, 5.2, zCross);
      const crossV = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.55, 2.2, 0.25)), kit.palette.fabricColors.crimson);
      crossV.position.set(hosp.cx, 5.2, zCross);
      townGroup.add(crossH, crossV);
    });

    // Drivable Hospital Ambulance outside Front Driveway
    const ambDrive = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(4.2, 4.4)), driveMat);
    ambDrive.rotation.x = -Math.PI / 2;
    ambDrive.position.set(86.2, 0.028, -14.8);
    townGroup.add(ambDrive);
    registerDrivableCar({
      id: 'hospital_ambulance_car',
      title: 'Hôpital Royal Emergency Ambulance',
      x: 86.2, z: -14.8, yaw: 0,
      paintHex: 'ambulance', isSuv: true, isConvertible: false, shortcut: true, inDirectory: true,
      gossipText: 'Sirens blaring! Royal Heiress spotted driving the Hospital Ambulance!',
    });

    // -----------------------------------------------------------
    // SEPARATED NORTH-WEST OPERATING ROOM (OR: x 70.6..78.0, z -29.5..-24.7)
    // -----------------------------------------------------------
    addWallX(townGroup, sharedColliders, 0, 3.6, -24.7, 70.7, 78.0, null, 0, 0.2, hospitalWallMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, 78.0, -29.4, -24.7, -27.0, 1.7, 0.2, hospitalWallMat);
    addInteriorSwingDoor('door_hospital_or', 'Operating Room (OR) Doors', 78.0, hosp.y, -27.0, Math.PI * 0.5, 1.62, 0xd8eef4);

    const orPlaque = buildBayPlaque('OPERATING ROOM · OR', '#165b73', 1.65, 0.34, 18);
    orPlaque.rotation.y = Math.PI * 0.5;
    orPlaque.position.set(78.12, hosp.y + 2.45, -25.65);
    townGroup.add(orPlaque);

    // Sterile Stainless Instrument Table inside OR West Wing
    const orPrep = new THREE.Group();
    kit.addMesh(orPrep, kit.g.box1, chromeMat, 0.72, 0.86, 1.15, 0, 0.43, 0);
    kit.addMesh(orPrep, kit.g.box1, surgicalDrapeMat, 0.66, 0.04, 1.06, 0, 0.88, 0);
    kit.addMesh(orPrep, kit.g.box1, chromeMat, 0.38, 0.05, 0.26, 0, 0.92, -0.22);
    kit.addMesh(orPrep, kit.g.box1, whiteMat, 0.26, 0.08, 0.22, 0, 0.93, 0.24);
    orPrep.position.set(71.8, hosp.y, -27.2);
    townGroup.add(orPrep);
    addBox(sharedColliders, 71.8, -27.2, 0.82, 1.25);

    // -----------------------------------------------------------
    // SEPARATED SOUTH-WEST EMERGENCY ROOM (ER: x 70.6..78.0, z -20.5..-16.5)
    // -----------------------------------------------------------
    const erCrimsonMat = kit.palette.fabricColors.crimson;
    addWallX(townGroup, sharedColliders, 0, 3.6, -20.5, 70.7, 78.0, null, 0, 0.2, hospitalWallMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, 78.0, -20.5, -16.6, -18.5, 1.95, 0.2, hospitalWallMat);
    addInteriorSwingDoor('door_hospital_er', 'Emergency Room (ER) Doors', 78.0, hosp.y, -18.5, Math.PI * 0.5, 1.88, 0xfbf4f4);

    const erPlaque = buildBayPlaque('EMERGENCY · ER', '#a61f2e', 1.55, 0.34, 21);
    erPlaque.rotation.y = Math.PI * 0.5;
    erPlaque.position.set(78.12, hosp.y + 2.45, -17.15);
    townGroup.add(erPlaque);

    // ER Headwall Accent Strip along North ER Partition (-20.38)
    kit.addMesh(townGroup, kit.g.box1, erCrimsonMat, 4.9, 0.16, 0.08, 73.2, hosp.y + 1.35, -20.36);
    ['ER 01', 'ER 02'].forEach(function (elbl, ei) {
      const ep = buildBayPlaque(elbl, '#a61f2e', 0.62, 0.24, 24);
      ep.position.set(ei === 0 ? 72.0 : 74.35, hosp.y + 2.25, -20.38);
      townGroup.add(ep);
    });

    // ER Triage & Trauma Stabilization Counter (North-East inside ER)
    const erTriageGrp = new THREE.Group();
    kit.addMesh(erTriageGrp, kit.g.box1, whiteMat, 1.35, 0.96, 0.62, 0, 0.48, 0);
    kit.addMesh(erTriageGrp, kit.g.box1, erCrimsonMat, 1.42, 0.08, 0.68, 0, 0.99, 0);
    kit.addMesh(erTriageGrp, kit.g.box1, erCrimsonMat, 0.34, 0.10, 0.04, 0, 0.56, 0.32);
    kit.addMesh(erTriageGrp, kit.g.box1, erCrimsonMat, 0.10, 0.34, 0.04, 0, 0.56, 0.32);
    kit.addMesh(erTriageGrp, kit.g.cyl1, chromeMat, 0.05, 0.26, 0.05, -0.35, 1.14, 0);
    kit.addMesh(erTriageGrp, kit.g.box1, ironMat, 0.44, 0.30, 0.06, -0.35, 1.32, 0);
    const erScr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.38, 0.24)), ecgScreenMat);
    erScr.position.set(-0.35, 1.32, 0.035);
    erTriageGrp.add(erScr);
    erTriageGrp.position.set(76.6, hosp.y, -19.85);
    townGroup.add(erTriageGrp);
    tagInteractable(erTriageGrp, 'hospital_er_triage');
    addBox(sharedColliders, 76.6, -19.85, 1.45, 0.72);
    registerSpot({
      id: 'hospital_er_triage',
      title: 'Emergency Room (ER) Triage & Trauma Bay',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: 76.6, y: hosp.y, z: -19.85,
      radius: 3.6,
      actions: [
        {
          id: 'er_rapid_triage',
          label: 'Get ER Doctor & Nurse Emergency Check-Up (₡30)',
          hint: 'ER Doctor & Nurse examine vitals on you (+85 Energy, +50 Bath)',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 30) return actCtx.toast('Need ₡30 Crowns.');
            if (window.CrownHospitalCheckup && typeof window.CrownHospitalCheckup.startCheckup === 'function') {
              window.CrownHospitalCheckup.startCheckup('er', actCtx);
              return;
            }
            actCtx.game.money -= 30;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 85, hygiene: 50, composure: 20 });
            actCtx.toast('ER trauma check complete · Vitals stabilized! (+85 Energy, +50 Bath)');
          },
        },
        {
          id: 'er_trigger_live',
          label: 'Call Incoming Ambulance Emergency to ER',
          hint: 'Watch local residents rush in & ER doctors/nurses treat them live',
          instant: true,
          onInstant: function (actCtx) {
            if (window.CrownCommands && typeof window.CrownCommands.triggerEmergency === 'function') {
              window.CrownCommands.triggerEmergency(true);
            } else {
              actCtx.toast('ER emergency team is standing by!');
            }
          },
        },
        {
          id: 'er_assist_shift',
          label: 'Lead Emergency Room (ER) Trauma Shift (+₡150)',
          hint: '+₡150 Crowns, +14 Poise & +3 Clout',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.game.money = (actCtx.game.money || 0) + 150;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 14, energy: -5 });
            recordDispatchGossip(actCtx, 'Royal Heroine: Princess spotted assisting Dr. Vance inside the separated Hôpital Royal ER!', 3, 0);
            actCtx.toast('ER shift complete! Earned +₡150 Crowns & +3 Clout.');
          },
        },
      ],
    });

    // ER Waiting Bench (South-East corner inside ER)
    const erWaitChair = new THREE.Group();
    kit.addMesh(erWaitChair, kit.g.box1, ironMat, 0.08, 0.40, 1.45, 0.18, 0.20, 0);
    [-0.42, 0.42].forEach(function (cz) {
      kit.addMesh(erWaitChair, kit.g.cushion, sageWallMat, 0.56, 0.12, 0.62, 0, 0.44, cz);
      kit.addMesh(erWaitChair, kit.g.cushion, sageWallMat, 0.12, 0.48, 0.60, 0.22, 0.70, cz);
    });
    erWaitChair.position.set(76.95, hosp.y, -17.3);
    townGroup.add(erWaitChair);
    addBox(sharedColliders, 76.95, -17.3, 0.68, 1.5);

    // -----------------------------------------------------------
    // 2 ENCLOSED HOSPITAL WASHROOMS & DECONTAM SHOWERS (North-East Alcove)
    // Alcove x: 83.4..88.5, z: -29.4..-25.2 (Doors face South at z = -25.2)
    // -----------------------------------------------------------
    addWallZ(townGroup, sharedColliders, 0, 3.6, 83.4, -29.4, -25.2, null, 0, 0.2, hospitalWallMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, 86.0, -29.4, -25.2, null, 0, 0.2, hospitalWallMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, -25.2, 83.4, 86.0, 84.7, 1.35, 0.2, hospitalWallMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, -25.2, 86.0, 88.5, 87.25, 1.35, 0.2, hospitalWallMat);

    placeToilet(townGroup, sharedColliders, {
      id: 'hosp_toilet_1', title: 'Hospital West Toilet', floor: 0, rustic: true,
      x: 84.0, y: hosp.y, z: -28.65, yaw: 0,
    });
    placeVanitySink(townGroup, sharedColliders, {
      id: 'hosp_sink_1', title: 'Hospital West Scrub Sink', floor: 0, rustic: true,
      x: 85.3, y: hosp.y, z: -28.75, yaw: 0,
    });
    if (placeShower) {
      placeShower(townGroup, sharedColliders, {
        id: 'hosp_shower_1', title: 'Hospital Decontam Shower #1', floor: 0, rustic: true,
        x: 85.2, y: hosp.y, z: -26.85, yaw: -Math.PI * 0.5, exitZOffset: 1.0,
      });
    }

    placeToilet(townGroup, sharedColliders, {
      id: 'hosp_toilet_2', title: 'Hospital East Toilet', floor: 0, rustic: true,
      x: 87.95, y: hosp.y, z: -28.65, yaw: 0,
    });
    placeVanitySink(townGroup, sharedColliders, {
      id: 'hosp_sink_2', title: 'Hospital East Scrub Sink', floor: 0, rustic: true,
      x: 86.7, y: hosp.y, z: -28.75, yaw: 0,
    });
    if (placeShower) {
      placeShower(townGroup, sharedColliders, {
        id: 'hosp_shower_2', title: 'Hospital East Shower #2', floor: 0, rustic: true,
        x: 86.8, y: hosp.y, z: -26.85, yaw: Math.PI * 0.5, exitZOffset: 1.0,
      });
    }

    // -----------------------------------------------------------
    // IMAGE 3: SURGICAL OPERATING THEATER & ARTICULATED BOOM LIGHTS (hospital_exam)
    // Centered inside the separated North-West Operating Room (74.3, -27.1)
    // -----------------------------------------------------------
    function buildSurgicalSuite() {
      const grp = new THREE.Group();
      // Motorized Surgical Table with Blue Sterile Drape (Image 3)
      kit.addMesh(grp, kit.g.box1, chromeMat, 0.55, 0.14, 0.85, 0, 0.07, 0);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.28, 0.62, 0.28, 0, 0.42, 0);
      kit.addMesh(grp, kit.g.box1, whiteMat, 0.88, 0.12, 1.95, 0, 0.76, 0);
      kit.addMesh(grp, kit.g.cushion, surgicalDrapeMat, 0.96, 0.14, 1.48, 0, 0.86, 0.12);
      kit.addMesh(grp, kit.g.box1, surgicalDrapeMat, 0.96, 0.28, 0.04, 0, 0.98, -0.42, 0.18, 0, 0);

      // Twin Articulated Overhead Skytron-Style Surgical Boom Lights
      kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.22, 0.45, 0.22, 0, 3.72, -0.15);
      [-1, 1].forEach(function (side) {
        kit.addMesh(grp, kit.g.box1, whiteMat, 0.82, 0.11, 0.12, side * 0.42, 3.44, -0.15, 0, 0, side * -0.12);
        kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.22, 0.56, 0.22, side * 0.78, 3.16, 0.08, 0.22, 0, 0);
        const domeX = side * 0.72;
        const domeY = 2.74;
        const domeZ = 0.22;
        kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.92, 0.14, 0.92, domeX, domeY, domeZ, 0.28, 0, side * -0.25);
        kit.addMesh(grp, kit.g.cyl1, warmGlowMat, 0.76, 0.04, 0.76, domeX, domeY - 0.06, domeZ + 0.02, 0.28, 0, side * -0.25);
      });

      // Anesthesia & High-Contrast Telemetry Vitals Tower
      kit.addMesh(grp, kit.g.cushion, whiteMat, 0.68, 1.15, 0.56, 0.92, 0.58, -0.45);
      kit.addMesh(grp, kit.g.box1, chromeMat, 0.06, 0.55, 0.06, 0.92, 1.38, -0.45);
      kit.addMesh(grp, kit.g.box1, whiteMat, 0.62, 0.46, 0.09, 0.92, 1.56, -0.42, 0, -0.35, 0);
      const scr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.54, 0.38)), ecgScreenMat);
      scr.position.set(0.905, 1.56, -0.37);
      scr.rotation.y = -0.35;
      grp.add(scr);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.04, 1.95, 0.04, -0.78, 0.98, -0.58);
      kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.055, 0.75, 0.055, 0.55, 1.04, -0.32, 0.35, 0, 0.48);
      return grp;
    }

    const surgSuite = buildSurgicalSuite();
    surgSuite.position.set(74.3, hosp.y, -27.1);
    townGroup.add(surgSuite);
    tagInteractable(surgSuite, 'hospital_exam');
    addBox(sharedColliders, 74.3, -27.1, 2.25, 1.85);
    registerSpot({
      id: 'hospital_exam',
      title: 'Separated Operating Room (OR) & Skytron Surgery',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: 74.3, y: hosp.y, z: -27.1,
      radius: 4.0,
      actions: [
        {
          id: 'full_checkup',
          label: 'Get Full Medical Checkup by Doctor & Nurse (₡40)',
          hint: 'Doctor & Nurse examine & scan vitals on you (+100 Energy & Bath)',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 40) return actCtx.toast('Need ₡40 Crowns.');
            if (window.CrownHospitalCheckup && typeof window.CrownHospitalCheckup.startCheckup === 'function') {
              window.CrownHospitalCheckup.startCheckup('or', actCtx);
              return;
            }
            actCtx.game.money -= 40;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 100, hygiene: 100, composure: 25, hunger: 25 });
            actCtx.toast('Telemetry Vitals 62 BPM · SpO2 99% · Full health restored!');
          },
        },
        {
          id: 'hospital_shift',
          label: 'Assist Chief Surgeon Under Skytron Lights (+₡180)',
          hint: '+₡180 Crowns, +15 Poise & +4 Clout',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.game.money = (actCtx.game.money || 0) + 180;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 15, energy: -6 });
            recordDispatchGossip(actCtx, 'Patron of Healing: Princess spotted leading rounds inside the separated Skytron OR at Hôpital Royal!', 4, 0);
            actCtx.toast('Surgical rounds completed! Earned +₡180 Crowns & +4 Clout');
          },
        },
      ],
    });
    townDirectory.push(spotLookup ? spotLookup.hospital_exam : { id: 'hospital_exam', title: 'Hôpital Royal de Versailles', category: 'town', actions: [] });

    // -----------------------------------------------------------
    // IMAGE 2: CURVED SAGE-GREEN & OAK ILLUMINATED NURSES' STATION
    // Facing the Ward Bays along East side of Central Corridor (82.0, -21.8)
    // -----------------------------------------------------------
    function buildCurvedNursesStation() {
      const grp = new THREE.Group();
      const segs = 7;
      for (let i = 0; i < segs; i++) {
        const ang = -0.78 + (i / (segs - 1)) * 1.56;
        const rad = 1.45;
        const px = 1.15 - Math.cos(ang) * rad;
        const pz = Math.sin(ang) * rad;
        const seg = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.42, 0.88, 0.62)), sageWallMat);
        seg.position.set(px, 0.44, pz);
        seg.rotation.y = ang;
        grp.add(seg);

        const glowStrip = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.45, 0.055, 0.65)), warmGlowMat);
        glowStrip.position.set(px, 0.90, pz);
        glowStrip.rotation.y = ang;
        grp.add(glowStrip);

        const top = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.56, 0.08, 0.72)), whiteMat);
        top.position.set(px, 0.97, pz);
        top.rotation.y = ang;
        grp.add(top);
      }
      [-0.42, 0.42].forEach(function (mz) {
        kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.05, 0.25, 0.05, -0.18, 1.12, mz);
        const mon = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.05, 0.34, 0.52)), ironMat);
        mon.position.set(-0.18, 1.32, mz);
        grp.add(mon);
        const scr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.46, 0.28)), icuScreenMat);
        scr.rotation.y = Math.PI * 0.5;
        scr.position.set(-0.145, 1.32, mz);
        grp.add(scr);
      });
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.36, 0.06, 0.36, 0.72, 0.06, 0);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.07, 0.42, 0.07, 0.72, 0.27, 0);
      kit.addMesh(grp, kit.g.cushion, sageWallMat, 0.50, 0.10, 0.48, 0.72, 0.50, 0);
      kit.addMesh(grp, kit.g.cushion, sageWallMat, 0.10, 0.48, 0.46, 0.94, 0.78, 0);
      return grp;
    }

    const nursesStation = buildCurvedNursesStation();
    nursesStation.position.set(82.0, hosp.y, -21.8);
    townGroup.add(nursesStation);
    tagInteractable(nursesStation, 'hospital_nurses_station');
    addBox(sharedColliders, 82.0, -21.8, 1.35, 2.45);
    registerSpot({
      id: 'hospital_nurses_station',
      title: 'Illuminated Sage-Green Nurses\' Station',
      floor: 0,
      category: 'town',
      x: 82.0, y: hosp.y, z: -21.8,
      radius: 3.6,
      actions: [
        {
          id: 'nurse_chart_rounds',
          label: 'Review Patient Telemetry & Ward Charts (+₡110)',
          hint: '+₡110 Crowns, +14 Poise & Check All 7 Hospital Beds',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.game.money = (actCtx.game.money || 0) + 110;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ composure: 14, fun: 8 });
            actCtx.toast('Ward, ER & VIP Suite telemetry verified! Earned +₡110 Crowns.');
          },
        },
        {
          id: 'nurse_tea_break',
          label: 'Enjoy Warm Herbal Tea at Nurses\' Station',
          hint: '+28 Energy & +20 Poise',
          instant: true,
          onInstant: function (actCtx) {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 28, composure: 20, hunger: 12 });
            actCtx.toast('Chamomile tea break at the Nurses\' Station! (+28 Energy, +20 Poise)');
          },
        },
      ],
    });

    // -----------------------------------------------------------
    // HOSPITAL PHARMACY & DISPENSARY (North-East Lobby Corridor, Facing -X)
    // -----------------------------------------------------------
    const pharm = kit.buildPharmacyShelves('hospital_pharmacy');
    pharm.rotation.y = -Math.PI * 0.5;
    pharm.position.set(82.5, hosp.y, -27.8);
    townGroup.add(pharm);
    tagInteractable(pharm, 'hospital_pharmacy');
    addBox(sharedColliders, 82.5, -27.8, 0.6, 2.4);
    registerSpot({
      id: 'hospital_pharmacy',
      title: 'Hospital Apothecary & Vitamin Dispensary',
      floor: 0,
      category: 'town',
      x: 82.5, y: hosp.y, z: -27.8,
      radius: 3.4,
      actions: [{
        id: 'buy_vitamins', label: 'Collect Royal Rosewater Tonics (₡20)', hint: '+45 Energy & +35 Hygiene', instant: true,
        onInstant: function (actCtx) {
          if ((actCtx.game.money || 0) < 20) return actCtx.toast('Need ₡20 Crowns.');
          actCtx.game.money -= 20;
          if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 45, hygiene: 35 });
          actCtx.toast('Vitamin elixirs taken! (+45 Energy, +35 Bath)');
        },
      }],
    });

    // -----------------------------------------------------------
    // IMAGE 1 & 2 BUILDERS: SAGE HEADWALL SPINES, CURTAIN TRACKS & LUXURY BEDS
    // -----------------------------------------------------------
    function buildWardHeadwall(width, labels, bedXs) {
      const grp = new THREE.Group();
      kit.addMesh(grp, kit.g.box1, sageWallMat, width, 3.25, 0.20, 0, 1.625, 0);
      kit.addMesh(grp, kit.g.box1, whiteMat, width - 0.25, 0.22, 0.08, 0, 1.25, 0.13);
      bedXs.forEach(function (bx, i) {
        kit.addMesh(grp, kit.g.box1, warmGlowMat, 1.05, 0.07, 0.11, bx, 2.05, 0.14);
        const plaque = buildBayPlaque(labels[i], '#3f593b', 0.48, 0.24, 34);
        plaque.position.set(bx, 2.38, 0.12);
        grp.add(plaque);
        [-0.22, 0, 0.22].forEach(function (ox, oi) {
          const pCol = [kit.palette.fabricColors.emerald, kit.palette.fabricColors.sapphire, kit.palette.fabricColors.crimson][oi];
          kit.addMesh(grp, kit.g.box1, pCol, 0.08, 0.08, 0.04, bx + ox, 1.25, 0.175);
        });
      });
      return grp;
    }

    function buildCurvedCurtainTrack(lenZ) {
      const grp = new THREE.Group();
      const l = lenZ || 2.35;
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.045, l, 0.045, 0, 2.85, 0, Math.PI * 0.5, 0, 0);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.025, 0.72, 0.025, 0, 3.2, -l * 0.35);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.025, 0.72, 0.025, 0, 3.2, l * 0.35);
      kit.addMesh(grp, kit.g.box1, sheerCurtainMat, 0.04, 0.58, l * 0.88, 0, 2.52, 0.05);
      kit.addMesh(grp, kit.g.cushion, beigeCurtainMat, 0.06, 1.68, l * 0.88, 0, 1.38, 0.05);
      return grp;
    }

    function buildStyledHospitalBed(interactId, opts) {
      const grp = new THREE.Group();
      const isVip = Boolean(opts && opts.isVip);

      if (isVip) {
        const plinth = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.65, 0.03, 2.65)), warmFloorGlowMat);
        plinth.position.set(0, 0.025, 0.05);
        grp.add(plinth);
      }

      [[-0.50, -0.92], [0.50, -0.92], [-0.50, 0.92], [0.50, 0.92]].forEach(function (wc) {
        kit.addMesh(grp, kit.g.cyl1, ironMat, 0.11, 0.05, 0.11, wc[0], 0.06, wc[1], 0, 0, Math.PI * 0.5);
      });
      kit.addMesh(grp, kit.g.box1, chromeMat, 1.06, 0.16, 2.02, 0, 0.24, 0);
      kit.addMesh(grp, kit.g.box1, whiteMat, 1.18, 0.14, 2.22, 0, 0.42, 0);
      kit.addMesh(grp, kit.g.cushion, porcelainMat, 1.08, 0.20, 2.12, 0, 0.48, 0);

      // HOLLOW QUILTED BLANKET DOME
      const duvetGeo = typeof kit.getHollowDuvet === 'function' ? kit.getHollowDuvet(1.14, 0.43, 1.38) : null;
      if (duvetGeo) {
        const duvetMesh = new THREE.Mesh(duvetGeo, isVip ? vipBlanketMat : wardBlanketMat);
        duvetMesh.position.set(0, 0.56, 0.34);
        grp.add(duvetMesh);
        const cuffMesh = new THREE.Mesh(kit.getHollowDuvet(1.15, 0.435, 0.16), porcelainMat);
        cuffMesh.position.set(0, 0.56, -0.35);
        grp.add(cuffMesh);
      }

      kit.addMesh(grp, kit.g.pillow, porcelainMat, 0.78, 0.14, 0.44, 0, 0.64, -0.78, 0.12, 0, 0);
      if (isVip) {
        kit.addMesh(grp, kit.g.pillow, porcelainMat, 0.62, 0.12, 0.32, 0, 0.73, -0.84, 0.28, 0, 0);
      }
      kit.addMesh(grp, kit.g.cushion, whiteMat, 1.20, 0.88, 0.11, 0, 0.72, -1.06);
      kit.addMesh(grp, kit.g.cushion, whiteMat, 1.20, 0.60, 0.11, 0, 0.54, 1.06);
      [-0.58, 0.58].forEach(function (rx) {
        kit.addMesh(grp, kit.g.cushion, whiteMat, 0.06, 0.20, 1.02, rx, 0.68, -0.18);
      });

      kit.addMesh(grp, kit.g.box1, whiteMat, 0.46, 0.64, 0.48, -0.88, 0.34, -0.82);
      kit.addMesh(grp, kit.g.box1, oakMat, 0.42, 0.44, 0.04, -0.88, 0.30, -0.57);

      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.04, 1.92, 0.04, -0.82, 0.96, -1.04);
      kit.addMesh(grp, kit.g.box1, chromeMat, 0.30, 0.04, 0.04, -0.72, 1.90, -1.04);
      kit.addMesh(grp, kit.g.cushion, kit.palette.crystal, 0.12, 0.24, 0.08, -0.62, 1.72, -1.04);

      if (isVip) {
        kit.addMesh(grp, kit.g.box1, walnutFluteMat, 3.6, 3.85, 0.20, 0.2, 1.92, -1.32);
        kit.addMesh(grp, kit.g.box1, warmGlowMat, 2.8, 0.06, 0.08, 0.2, 3.65, -1.19);
        kit.addMesh(grp, kit.g.box1, warmGlowMat, 2.3, 0.08, 2.8, 0, 3.92, 0);
        [-0.96, 0.96].forEach(function (mx) {
          kit.addMesh(grp, kit.g.cushion, whiteMat, 0.48, 1.15, 0.44, mx, 0.58, -0.86);
          kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.05, 0.95, 0.05, mx, 1.55, -0.86);
          [1.35, 1.88].forEach(function (my) {
            kit.addMesh(grp, kit.g.box1, whiteMat, 0.48, 0.36, 0.07, mx, my, -0.82);
            const mScr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.42, 0.30)), icuScreenMat);
            mScr.position.set(mx, my, -0.78);
            grp.add(mScr);
          });
        });
      } else {
        kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.05, 1.48, 0.05, 0.82, 0.74, -0.86);
        kit.addMesh(grp, kit.g.box1, ironMat, 0.44, 0.34, 0.08, 0.82, 1.46, -0.86);
        const mScr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.38, 0.28)), ecgScreenMat);
        mScr.position.set(0.82, 1.46, -0.815);
        grp.add(mScr);
      }

      if (interactId) tagInteractable(grp, interactId);
      return grp;
    }

    // Sage-Green Headwall Partition Spine for Ward Bays 01-03 (south side of OR wall)
    const wardHeadwall = buildWardHeadwall(7.1, ['01', '02', '03'], [-2.35, 0, 2.35]);
    wardHeadwall.position.set(74.3, hosp.y, -24.42);
    townGroup.add(wardHeadwall);
    addBox(sharedColliders, 74.3, -24.42, 7.1, 0.28);

    // Enclosed East Wing Partition Walls for Private VIP Recovery Suites (VIP 06 & VIP 07)
    addWallZ(townGroup, sharedColliders, 0, 3.6, 83.7, -25.2, -20.8, -23.0, 1.55, 0.2, walnutFluteMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, 83.7, -20.8, -16.6, -18.5, 1.55, 0.2, walnutFluteMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, -20.8, 83.7, 88.5, null, 0, 0.2, walnutFluteMat);
    [
      { label: 'VIP 06', z: -24.1 },
      { label: 'VIP 07', z: -19.6 },
    ].forEach(function (vp) {
      const vPlaque = buildBayPlaque(vp.label, '#3f593b', 0.62, 0.25, 28);
      vPlaque.rotation.y = -Math.PI * 0.5;
      vPlaque.position.set(83.58, hosp.y + 2.15, vp.z);
      townGroup.add(vPlaque);
    });

    // Build all 7 Hospital Recovery Beds (3 Ward Bays + 2 ER Trauma Bays + 2 VIP Suites)
    const bedSpecs = [
      { id: 'hospital_bed_1', x: 71.95, z: -23.15, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 01' },
      { id: 'hospital_bed_2', x: 74.30, z: -23.15, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 02' },
      { id: 'hospital_bed_3', x: 76.65, z: -23.15, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 03' },
      { id: 'hospital_bed_4', x: 72.00, z: -19.05, exOff: 1.15, isVip: false, label: 'ER Trauma Bay 01' },
      { id: 'hospital_bed_5', x: 74.35, z: -19.05, exOff: 1.15, isVip: false, label: 'ER Trauma Bay 02' },
      { id: 'hospital_bed_6', x: 86.30, z: -23.10, exOff: -1.45, isVip: true, label: 'Walnut VIP Recovery Suite 06' },
      { id: 'hospital_bed_7', x: 86.30, z: -18.60, exOff: -1.45, isVip: true, label: 'Imperial Walnut VIP Suite 07' },
    ];
    bedSpecs.forEach(function (bp, bi) {
      const hBed = buildStyledHospitalBed(bp.id, { isVip: bp.isVip });
      hBed.position.set(bp.x, hosp.y, bp.z);
      townGroup.add(hBed);
      addBox(sharedColliders, bp.x, bp.z, bp.isVip ? 2.1 : 1.32, 2.22);

      if (bi === 0 || bi === 1 || bi === 3) {
        const curt = buildCurvedCurtainTrack(2.25);
        curt.position.set(bp.x + 1.18, hosp.y, bp.z);
        townGroup.add(curt);
      }

      registerSpot({
        id: bp.id,
        title: 'Hospital Bed #' + (bi + 1) + ' — ' + bp.label,
        floor: 0,
        category: 'town',
        x: bp.x, y: hosp.y, z: bp.z,
        radius: 3.2,
        actions: [{
          id: bp.id + '_rest',
          label: 'Get Inside & Rest in ' + bp.label,
          hint: '+18 Energy/s & +10 Poise/s',
          pose: 'sleep',
          anchor: {
            x: bp.x, y: hosp.y + 0.58, z: bp.z + 0.93, yaw: 0, rigOffsetY: 0.09,
            floorY: hosp.y, exitX: bp.x + bp.exOff, exitZ: bp.z + 0.2, exitYaw: 0,
          },
          rates: { energy: 18, composure: 10 },
          statusText: 'Resting under quilted blankets in ' + bp.label + '...',
        }],
      });
    });

    // Rolling ER Crash/Supply Cart inside Separated ER beside Trauma Bays
    const crashCart = new THREE.Group();
    kit.addMesh(crashCart, kit.g.box1, whiteMat, 0.72, 0.92, 0.54, 0, 0.50, 0);
    [0.24, 0.44, 0.64, 0.82].forEach(function (dy) {
      kit.addMesh(crashCart, kit.g.box1, erCrimsonMat, 0.64, 0.14, 0.05, 0, dy, 0.27);
    });
    kit.addMesh(crashCart, kit.g.box1, ironMat, 0.42, 0.30, 0.08, 0, 1.15, 0);
    const cScr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.36, 0.24)), ecgScreenMat);
    cScr.position.set(0, 1.15, 0.045);
    crashCart.add(cScr);
    crashCart.position.set(75.55, hosp.y, -19.85);
    townGroup.add(crashCart);
    addBox(sharedColliders, 75.55, -19.85, 0.78, 0.62);

    // Image 1: Cognac Leather VIP Visitor Lounge Armchairs inside VIP Suite 06 & VIP Suite 07
    [
      { id: 'hosp_waiting_sofa', title: 'VIP Suite 06 Cognac Lounge Chair', x: 85.0, z: -21.5, yaw: Math.PI * 0.32, exitX: 85.0, exitZ: -22.5 },
      { id: 'hosp_vip_chair_2', title: 'VIP Suite 07 Cognac Lounge Chair', x: 85.0, z: -17.3, yaw: Math.PI * 0.32, exitX: 85.0, exitZ: -18.2 },
    ].forEach(function (vc) {
      const vipChair = new THREE.Group();
      kit.addMesh(vipChair, kit.g.cyl1, ironMat, 0.52, 0.08, 0.52, 0, 0.04, 0);
      kit.addMesh(vipChair, kit.g.cushion, cognacMat, 0.92, 0.36, 0.88, 0, 0.30, 0);
      kit.addMesh(vipChair, kit.g.cushion, cognacMat, 0.90, 0.58, 0.24, 0, 0.72, -0.32, -0.14, 0, 0);
      [-0.42, 0.42].forEach(function (ax) {
        kit.addMesh(vipChair, kit.g.cushion, cognacMat, 0.16, 0.34, 0.82, ax, 0.52, -0.02);
      });
      kit.addMesh(vipChair, kit.g.pillow, porcelainMat, 0.42, 0.28, 0.14, 0, 0.58, -0.16, -0.25, 0, 0);
      vipChair.position.set(vc.x, hosp.y, vc.z);
      vipChair.rotation.y = vc.yaw;
      townGroup.add(vipChair);
      tagInteractable(vipChair, vc.id);
      addCircle(sharedColliders, vc.x, vc.z, 0.55);
      registerSpot({
        id: vc.id,
        title: vc.title,
        floor: 0,
        category: 'town',
        x: vc.x, y: hosp.y, z: vc.z,
        radius: 2.8,
        actions: [{
          id: vc.id + '_sit',
          label: 'Relax in VIP Leather Recovery Chair',
          hint: '+12 Energy/s & +10 Poise/s',
          pose: 'sofa',
          anchor: {
            x: vc.x, y: hosp.y + 0.48, z: vc.z, yaw: vc.yaw, rigOffsetY: -0.45,
            floorY: hosp.y, exitX: vc.exitX, exitZ: vc.exitZ, exitYaw: 0,
          },
          rates: { energy: 12, composure: 10 },
          statusText: 'Resting comfortably inside the Walnut VIP Recovery Suite...',
        }],
      });
    });

    // -----------------------------------------------------------
    // GREEN HOSPITAL HEALING COURTYARD & OUTDOOR TRIAGE GARDEN (x = 79.6, z = -37.2)
    // -----------------------------------------------------------
    const hgX = hosp.cx;
    const hgZ = -37.2;
    const hgWalk = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.2, 0.06, 8.6)), sidewalkMat);
    hgWalk.position.set(hgX, 0.03, -33.2);
    hgWalk.receiveShadow = true;
    townGroup.add(hgWalk);

    const hgHedges = [
      { x: hgX - 5.2, z: hgZ - 4.8, w: 6.2, d: 0.65 },
      { x: hgX + 5.2, z: hgZ - 4.8, w: 6.2, d: 0.65 },
      { x: hgX - 8.2, z: hgZ, w: 0.65, d: 10.2 },
      { x: hgX + 8.2, z: hgZ, w: 0.65, d: 10.2 },
    ];
    hgHedges.forEach(function (hg) {
      kit.addMesh(townGroup, kit.g.box1, boxwoodMat, hg.w, 0.72, hg.d, hg.x, 0.36, hg.z);
    });
    const hgPad = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(6.8, 0.08, 6.4)), poolDeckMat);
    hgPad.position.set(hgX, 0.04, hgZ);
    hgPad.receiveShadow = true;
    townGroup.add(hgPad);
    const hgGazebo = kit.buildGazebo('hospital_garden');
    hgGazebo.position.set(hgX, 0.08, hgZ);
    townGroup.add(hgGazebo);
    tagInteractable(hgGazebo, 'hospital_garden');
    [[-5.2, -2.0], [5.2, -2.0], [-5.2, 2.2], [5.2, 2.2]].forEach(function (hp) {
      const hFlower = kit.buildPedestalPlant(true);
      hFlower.position.set(hgX + hp[0], 0.06, hgZ + hp[1]);
      townGroup.add(hFlower);
      addCircle(sharedColliders, hgX + hp[0], hgZ + hp[1], 0.38);
    });
    const hgDesk = kit.buildWritingDesk('hospital_garden', 'sapphire');
    hgDesk.position.set(hgX + 1.4, 0.08, hgZ);
    hgDesk.rotation.y = -Math.PI * 0.5;
    townGroup.add(hgDesk);
    registerSpot({
      id: 'hospital_garden',
      title: 'Green Hospital Healing Garden & Triage Pavilion',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: hgX, y: 0.08, z: hgZ,
      radius: 4.8,
      actions: [
        {
          id: 'hg_therapy', label: 'Outdoor Healing Therapy in Green Hospital Garden', hint: '+18 Energy/s, +14 Poise/s & +8 Fun/s', pose: 'sit',
          anchor: { x: hgX - 1.4, y: 0.54, z: hgZ, yaw: Math.PI * 0.5, rigOffsetY: -0.44, floorY: 0.08, exitX: hgX, exitZ: hgZ + 3.0, exitYaw: 0 },
          rates: { energy: 18, composure: 14, fun: 8 }, statusText: 'Recovering in the fragrant Green Hospital Healing Garden...',
        },
        {
          id: 'hg_herbal_triage', label: 'Receive Botanical Wellness Elixir (Free)', hint: 'Restores +45 Energy & +30 Hygiene', instant: true,
          onInstant: function (actCtx) {
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ energy: 45, hygiene: 30, composure: 15 });
            actCtx.toast('Chamomile & rosewater outdoor triage complete! (+45 Energy, +30 Bath)');
          },
        },
      ],
    });
    townZones.push({ minX: hgX - 8.5, maxX: hgX + 8.5, minZ: hgZ - 5.2, maxZ: hgZ + 5.2, label: 'Green Hospital Healing Garden' });

    return {
      dispose: function () {
        localGeos.forEach(function (g) { g.dispose(); });
        localMats.forEach(function (m) { m.dispose(); });
        localTex.forEach(function (t) { t.dispose(); });
      },
    };
  }

  window.CrownHospital = {
    build: buildRoyalHospital,
  };
})();
