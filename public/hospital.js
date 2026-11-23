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
    const sheerCurtainMat = keepMat(new THREE.MeshPhysicalMaterial({ color: 0xf4eee0, roughness: 0.7, transparent: true, opacity: 0.62 }));
    const beigeCurtainMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xdccdb3, roughness: 0.78 }));
    const chromeMat = kit.palette.silver;
    const oakMat = kit.palette.oak;
    const ironMat = kit.palette.iron;
    const whiteMat = kit.palette.ivory;
    const porcelainMat = kit.palette.porcelain;

    function buildBayPlaque(numText) {
      const plaqueTex = makeCanvasTex(128, 64, function (c, w, h) {
        c.fillStyle = '#3f593b';
        c.fillRect(0, 0, w, h);
        c.fillStyle = '#f8faf6';
        c.font = 'bold 42px sans-serif';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(numText, w * 0.5, h * 0.5 + 2);
      });
      return new THREE.Mesh(
        keepGeo(new THREE.PlaneGeometry(0.46, 0.24)),
        keepMat(new THREE.MeshBasicMaterial({ map: plaqueTex }))
      );
    }

    // -----------------------------------------------------------
    // ARCHITECTURAL SHELL — HÔPITAL ROYAL DE VERSAILLES
    // -----------------------------------------------------------
    const hosp = addEnterableLot({
      id: 'plot_hospital',
      title: 'Hôpital Royal de Versailles',
      signTitle: 'Royal Hospital',
      signColor: '#3f593b',
      subtitle: 'Green Ward Bays 01-05, Walnut VIP Suite 06, Skytron Surgery, Curved Nurses Station & Healing Garden',
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
    // 2 ENCLOSED PARTITIONED HOSPITAL WASHROOMS & DECONTAM SHOWERS
    // -----------------------------------------------------------
    addWallZ(townGroup, sharedColliders, 0, 3.6, hosp.cx - 4.2, hosp.cz - 6.4, hosp.cz - 3.2, hosp.cz - 4.8, 1.5, 0.22, hospitalWallMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, hosp.cz - 3.2, hosp.cx - 8.9, hosp.cx - 4.2, null, 0, 0.22, hospitalWallMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, hosp.cx + 4.2, hosp.cz - 6.4, hosp.cz - 3.2, hosp.cz - 4.8, 1.5, 0.22, hospitalWallMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, hosp.cz - 3.2, hosp.cx + 4.2, hosp.cx + 8.9, null, 0, 0.22, hospitalWallMat);

    placeToilet(townGroup, sharedColliders, {
      id: 'hosp_toilet_1', title: 'Hospital West Toilet', floor: 0, rustic: true,
      x: hosp.cx - 8.0, y: hosp.y, z: hosp.cz - 5.6, yaw: 0,
    });
    placeVanitySink(townGroup, sharedColliders, {
      id: 'hosp_sink_1', title: 'Hospital West Scrub Sink', floor: 0, rustic: true,
      x: hosp.cx - 6.2, y: hosp.y, z: hosp.cz - 5.7, yaw: 0,
    });
    if (placeShower) {
      placeShower(townGroup, sharedColliders, {
        id: 'hosp_shower_1', title: 'Hospital Decontam Shower #1', floor: 0, rustic: true,
        x: hosp.cx - 5.2, y: hosp.y, z: hosp.cz - 4.4, yaw: -Math.PI * 0.5, exitZOffset: 1.0,
      });
    }

    placeToilet(townGroup, sharedColliders, {
      id: 'hosp_toilet_2', title: 'Hospital East Toilet', floor: 0, rustic: true,
      x: hosp.cx + 8.0, y: hosp.y, z: hosp.cz - 5.6, yaw: 0,
    });
    placeVanitySink(townGroup, sharedColliders, {
      id: 'hosp_sink_2', title: 'Hospital East Scrub Sink', floor: 0, rustic: true,
      x: hosp.cx + 6.2, y: hosp.y, z: hosp.cz - 5.7, yaw: 0,
    });
    if (placeShower) {
      placeShower(townGroup, sharedColliders, {
        id: 'hosp_shower_2', title: 'Hospital East Shower #2', floor: 0, rustic: true,
        x: hosp.cx + 5.2, y: hosp.y, z: hosp.cz - 4.4, yaw: Math.PI * 0.5, exitZOffset: 1.0,
      });
    }

    // -----------------------------------------------------------
    // IMAGE 3: SURGICAL OPERATING THEATER & ARTICULATED BOOM LIGHTS (hospital_exam)
    // Positioned cleanly East of North Garden Corridor (x = 82.0, z = -27.9)
    // -----------------------------------------------------------
    function buildSurgicalSuite() {
      const grp = new THREE.Group();
      // Motorized Surgical Table with Blue Sterile Drape (Image 3)
      kit.addMesh(grp, kit.g.box1, chromeMat, 0.55, 0.14, 0.85, 0, 0.07, 0);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.28, 0.62, 0.28, 0, 0.42, 0);
      kit.addMesh(grp, kit.g.box1, whiteMat, 0.88, 0.12, 1.95, 0, 0.76, 0);
      kit.addMesh(grp, kit.g.cushion, surgicalDrapeMat, 0.96, 0.14, 1.48, 0, 0.86, 0.12);
      kit.addMesh(grp, kit.g.box1, surgicalDrapeMat, 0.96, 0.28, 0.04, 0, 0.98, -0.42, 0.18, 0, 0); // elevated sterile screen drape

      // Twin Articulated Overhead Skytron-Style Surgical Boom Lights (arm labeled 3)
      kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.22, 0.45, 0.22, 0, 3.72, -0.15);
      [-1, 1].forEach(function (side) {
        kit.addMesh(grp, kit.g.box1, whiteMat, 0.82, 0.11, 0.12, side * 0.42, 3.44, -0.15, 0, 0, side * -0.12);
        kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.22, 0.56, 0.22, side * 0.78, 3.16, 0.08, 0.22, 0, 0);
        // Saucer Boom Light Dome + Glowing Multi-LED Lens
        const domeX = side * 0.72;
        const domeY = 2.74;
        const domeZ = 0.22;
        kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.92, 0.14, 0.92, domeX, domeY, domeZ, 0.28, 0, side * -0.25);
        kit.addMesh(grp, kit.g.cyl1, warmGlowMat, 0.76, 0.04, 0.76, domeX, domeY - 0.06, domeZ + 0.02, 0.28, 0, side * -0.25);
      });

      // Anesthesia & High-Contrast Telemetry Vitals Tower (right side, Image 3: 62 / 99 / 89/54)
      kit.addMesh(grp, kit.g.cushion, whiteMat, 0.68, 1.15, 0.56, 0.92, 0.58, -0.45);
      kit.addMesh(grp, kit.g.box1, chromeMat, 0.06, 0.55, 0.06, 0.92, 1.38, -0.45);
      // Monitor Housing + Glowing Screen
      kit.addMesh(grp, kit.g.box1, whiteMat, 0.62, 0.46, 0.09, 0.92, 1.56, -0.42, 0, -0.35, 0);
      const scr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.54, 0.38)), ecgScreenMat);
      scr.position.set(0.905, 1.56, -0.37);
      scr.rotation.y = -0.35;
      grp.add(scr);
      // Corrugated white anesthesia breathing tubes + IV pole
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.04, 1.95, 0.04, -0.78, 0.98, -0.58);
      kit.addMesh(grp, kit.g.cyl1, whiteMat, 0.055, 0.75, 0.055, 0.55, 1.04, -0.32, 0.35, 0, 0.48);
      return grp;
    }

    const surgSuite = buildSurgicalSuite();
    surgSuite.position.set(hosp.cx + 2.1, hosp.y, hosp.cz - 4.9);
    townGroup.add(surgSuite);
    tagInteractable(surgSuite, 'hospital_exam');
    addBox(sharedColliders, hosp.cx + 2.1, hosp.cz - 4.9, 2.3, 1.85);
    registerSpot({
      id: 'hospital_exam',
      title: 'Skytron Surgical Theater & Diagnostic Exam',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: hosp.cx + 2.1, y: hosp.y, z: hosp.cz - 4.9,
      radius: 4.0,
      actions: [
        {
          id: 'full_checkup',
          label: 'Get Full Royal Medical Checkup & Telemetry Scan (₡40)',
          hint: 'Restores +100 Energy, +100 Hygiene & +25 Poise',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 40) return actCtx.toast('Need ₡40 Crowns.');
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
            recordDispatchGossip(actCtx, 'Patron of Healing: Princess spotted leading rounds under the Skytron OR booms at Hôpital Royal!', 4, 0);
            actCtx.toast('Surgical rounds completed! Earned +₡180 Crowns & +4 Clout');
          },
        },
      ],
    });
    townDirectory.push(spotLookup ? spotLookup.hospital_exam : { id: 'hospital_exam', title: 'Hôpital Royal de Versailles', category: 'town', actions: [] });

    // -----------------------------------------------------------
    // IMAGE 2: CURVED SAGE-GREEN & OAK ILLUMINATED NURSES' STATION
    // Facing the Ward Bays along the East side of Central Corridor (x = 82.0, z = -20.6)
    // -----------------------------------------------------------
    function buildCurvedNursesStation() {
      const grp = new THREE.Group();
      const segs = 7;
      for (let i = 0; i < segs; i++) {
        const ang = -0.78 + (i / (segs - 1)) * 1.56; // curve facing -X
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
      // Dual Clinical Monitors + Clinician Chair inside curved desk
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
      // Rolling clinician chair behind desk
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.36, 0.06, 0.36, 0.72, 0.06, 0);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.07, 0.42, 0.07, 0.72, 0.27, 0);
      kit.addMesh(grp, kit.g.cushion, sageWallMat, 0.50, 0.10, 0.48, 0.72, 0.50, 0);
      kit.addMesh(grp, kit.g.cushion, sageWallMat, 0.10, 0.48, 0.46, 0.94, 0.78, 0);
      return grp;
    }

    const nursesStation = buildCurvedNursesStation();
    nursesStation.position.set(hosp.cx + 1.8, hosp.y, hosp.cz + 2.4);
    townGroup.add(nursesStation);
    tagInteractable(nursesStation, 'hospital_nurses_station');
    addBox(sharedColliders, hosp.cx + 1.8, hosp.cz + 2.4, 1.35, 2.5);
    registerSpot({
      id: 'hospital_nurses_station',
      title: 'Illuminated Sage-Green Nurses\' Station',
      floor: 0,
      category: 'town',
      x: hosp.cx + 1.8, y: hosp.y, z: hosp.cz + 2.4,
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
            actCtx.toast('Ward & VIP Suite telemetry verified! Earned +₡110 Crowns.');
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
    // HOSPITAL PHARMACY & DISPENSARY (North Lobby Alcove, Facing South)
    // -----------------------------------------------------------
    const pharm = kit.buildPharmacyShelves('hospital_pharmacy');
    pharm.position.set(hosp.cx - 2.6, hosp.y, hosp.cz - 6.0);
    townGroup.add(pharm);
    tagInteractable(pharm, 'hospital_pharmacy');
    addBox(sharedColliders, hosp.cx - 2.6, hosp.cz - 6.0, 2.4, 0.55);
    registerSpot({
      id: 'hospital_pharmacy',
      title: 'Hospital Apothecary & Vitamin Dispensary',
      floor: 0,
      category: 'town',
      x: hosp.cx - 2.6, y: hosp.y, z: hosp.cz - 6.0,
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
      kit.addMesh(grp, kit.g.box1, sageWallMat, width, 3.25, 0.22, 0, 1.625, 0);
      // Continuous Horizontal Medical Gas & Oxygen Outlet Rail (Image 2)
      kit.addMesh(grp, kit.g.box1, whiteMat, width - 0.25, 0.22, 0.08, 0, 1.25, 0.14);
      bedXs.forEach(function (bx, i) {
        // Linear Warm Sconce Light Fixture above bed
        kit.addMesh(grp, kit.g.box1, warmGlowMat, 1.05, 0.07, 0.11, bx, 2.05, 0.15);
        // Numbered Bay Plaque ('01', '02', ...)
        const plaque = buildBayPlaque(labels[i]);
        plaque.position.set(bx, 2.38, 0.13);
        grp.add(plaque);
        // Color-coded O2 / Air / Suction outlet ports on medical rail
        [-0.22, 0, 0.22].forEach(function (ox, oi) {
          const pCol = [kit.palette.fabricColors.emerald, kit.palette.fabricColors.sapphire, kit.palette.fabricColors.crimson][oi];
          kit.addMesh(grp, kit.g.box1, pCol, 0.08, 0.08, 0.04, bx + ox, 1.25, 0.185);
        });
      });
      return grp;
    }

    function buildCurvedCurtainTrack(lenZ) {
      const grp = new THREE.Group();
      const l = lenZ || 2.35;
      // Overhead metallic track rod
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.045, l, 0.045, 0, 2.85, 0, Math.PI * 0.5, 0, 0);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.025, 0.72, 0.025, 0, 3.2, -l * 0.35);
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.025, 0.72, 0.025, 0, 3.2, l * 0.35);
      // Top sheer mesh band + Lower beige pleated drape (Image 2 aesthetic)
      kit.addMesh(grp, kit.g.box1, sheerCurtainMat, 0.04, 0.58, l * 0.88, 0, 2.52, 0.05);
      kit.addMesh(grp, kit.g.cushion, beigeCurtainMat, 0.06, 1.68, l * 0.88, 0, 1.38, 0.05);
      return grp;
    }

    function buildStyledHospitalBed(interactId, opts) {
      const grp = new THREE.Group();
      const isVip = Boolean(opts && opts.isVip);

      // Image 1: VIP Floor Glowing Under-Bed Plinth
      if (isVip) {
        const plinth = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.65, 0.03, 2.65)), warmFloorGlowMat);
        plinth.position.set(0, 0.025, 0.05);
        grp.add(plinth);
      }

      // 4 Lockable Chrome Casters & Sculpted Motorized Base Frame
      [[-0.50, -0.92], [0.50, -0.92], [-0.50, 0.92], [0.50, 0.92]].forEach(function (wc) {
        kit.addMesh(grp, kit.g.cyl1, ironMat, 0.11, 0.05, 0.11, wc[0], 0.06, wc[1], 0, 0, Math.PI * 0.5);
      });
      kit.addMesh(grp, kit.g.box1, chromeMat, 1.06, 0.16, 2.02, 0, 0.24, 0);
      kit.addMesh(grp, kit.g.box1, whiteMat, 1.18, 0.14, 2.22, 0, 0.42, 0);
      kit.addMesh(grp, kit.g.cushion, porcelainMat, 1.08, 0.20, 2.12, 0, 0.48, 0);

      // HOLLOW QUILTED BLANKET DOME (Sleeper lies inside cleanly with zero clipping!)
      const duvetGeo = typeof kit.getHollowDuvet === 'function' ? kit.getHollowDuvet(1.14, 0.43, 1.38) : null;
      if (duvetGeo) {
        const duvetMesh = new THREE.Mesh(duvetGeo, isVip ? vipBlanketMat : wardBlanketMat);
        duvetMesh.position.set(0, 0.56, 0.34);
        grp.add(duvetMesh);
        const cuffMesh = new THREE.Mesh(kit.getHollowDuvet(1.15, 0.435, 0.16), porcelainMat);
        cuffMesh.position.set(0, 0.56, -0.35);
        grp.add(cuffMesh);
      }

      // Contoured Pillows + Headboard + Footboard + Split Safety Side Rails
      kit.addMesh(grp, kit.g.pillow, porcelainMat, 0.78, 0.14, 0.44, 0, 0.64, -0.78, 0.12, 0, 0);
      if (isVip) {
        kit.addMesh(grp, kit.g.pillow, porcelainMat, 0.62, 0.12, 0.32, 0, 0.73, -0.84, 0.28, 0, 0);
      }
      kit.addMesh(grp, kit.g.cushion, whiteMat, 1.20, 0.88, 0.11, 0, 0.72, -1.06);
      kit.addMesh(grp, kit.g.cushion, whiteMat, 1.20, 0.60, 0.11, 0, 0.54, 1.06);
      [-0.58, 0.58].forEach(function (rx) {
        kit.addMesh(grp, kit.g.cushion, whiteMat, 0.06, 0.20, 1.02, rx, 0.68, -0.18);
      });

      // Oak & Crisp-White Bedside Drawer Cabinet (-X side, Image 2)
      kit.addMesh(grp, kit.g.box1, whiteMat, 0.46, 0.64, 0.48, -0.88, 0.34, -0.82);
      kit.addMesh(grp, kit.g.box1, oakMat, 0.42, 0.44, 0.04, -0.88, 0.30, -0.57);

      // Clinical IV Pole & Monitor Stand
      kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.04, 1.92, 0.04, -0.82, 0.96, -1.04);
      kit.addMesh(grp, kit.g.box1, chromeMat, 0.30, 0.04, 0.04, -0.72, 1.90, -1.04);
      kit.addMesh(grp, kit.g.cushion, kit.palette.crystal, 0.12, 0.24, 0.08, -0.62, 1.72, -1.04);

      if (isVip) {
        // Image 1: Fluted Walnut Feature Wall Behind VIP Suite + Suspended Ceiling Cove + Twin ICU Monitor Towers
        kit.addMesh(grp, kit.g.box1, walnutFluteMat, 3.6, 3.85, 0.20, 0.2, 1.92, -1.32);
        kit.addMesh(grp, kit.g.box1, warmGlowMat, 2.8, 0.06, 0.08, 0.2, 3.65, -1.19);
        kit.addMesh(grp, kit.g.box1, warmGlowMat, 2.3, 0.08, 2.8, 0, 3.92, 0); // overhead cove halo
        [-0.96, 0.96].forEach(function (mx) {
          kit.addMesh(grp, kit.g.cushion, whiteMat, 0.48, 1.15, 0.44, mx, 0.58, -0.86);
          kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.05, 0.95, 0.05, mx, 1.55, -0.86);
          // Lower & upper dual ICU monitor screens per tower!
          [1.35, 1.88].forEach(function (my) {
            kit.addMesh(grp, kit.g.box1, whiteMat, 0.48, 0.36, 0.07, mx, my, -0.82);
            const mScr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.42, 0.30)), icuScreenMat);
            mScr.position.set(mx, my, -0.78);
            grp.add(mScr);
          });
        });
      } else {
        // Standard Ward Monitor (+X side)
        kit.addMesh(grp, kit.g.cyl1, chromeMat, 0.05, 1.48, 0.05, 0.82, 0.74, -0.86);
        kit.addMesh(grp, kit.g.box1, ironMat, 0.44, 0.34, 0.08, 0.82, 1.46, -0.86);
        const mScr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.38, 0.28)), ecgScreenMat);
        mScr.position.set(0.82, 1.46, -0.815);
        grp.add(mScr);
      }

      if (interactId) tagInteractable(grp, interactId);
      return grp;
    }

    // Sage-Green Headwall Partition Spines for Ward Rows 1 (01-03) and 2 (04-05)
    const row1Headwall = buildWardHeadwall(7.5, ['01', '02', '03'], [-2.5, 0, 2.5]);
    row1Headwall.position.set(hosp.cx - 4.7, hosp.y, hosp.cz - 1.9);
    townGroup.add(row1Headwall);
    addBox(sharedColliders, hosp.cx - 4.7, hosp.cz - 1.9, 7.5, 0.3);

    const row2Headwall = buildWardHeadwall(5.0, ['04', '05'], [-1.25, 1.25]);
    row2Headwall.position.set(hosp.cx - 5.95, hosp.y, hosp.cz + 2.5);
    townGroup.add(row2Headwall);
    addBox(sharedColliders, hosp.cx - 5.95, hosp.cz + 2.5, 5.0, 0.3);

    // Enclosed East Wing Partition Walls for Private VIP Recovery Suites (VIP 06 & VIP 07)
    addWallZ(townGroup, sharedColliders, 0, 3.6, hosp.cx + 4.1, hosp.cz - 3.2, hosp.cz + 1.6, hosp.cz - 0.8, 1.55, 0.2, walnutFluteMat);
    addWallZ(townGroup, sharedColliders, 0, 3.6, hosp.cx + 4.1, hosp.cz + 1.6, hosp.cz + 6.4, hosp.cz + 4.0, 1.55, 0.2, walnutFluteMat);
    addWallX(townGroup, sharedColliders, 0, 3.6, hosp.cz + 1.6, hosp.cx + 4.1, hosp.cx + 8.9, null, 0, 0.2, walnutFluteMat);
    [
      { label: 'VIP 06', z: hosp.cz - 2.0 },
      { label: 'VIP 07', z: hosp.cz + 2.8 },
    ].forEach(function (vp) {
      const vPlaque = buildBayPlaque(vp.label);
      vPlaque.rotation.y = -Math.PI * 0.5;
      vPlaque.scale.set(1.25, 1.0, 1);
      vPlaque.position.set(hosp.cx + 3.98, hosp.y + 2.15, vp.z);
      townGroup.add(vPlaque);
    });

    // Build all 7 Hospital Recovery Beds (5 Sage-Green Clinical Bays + 2 Enclosed Walnut VIP Suites!)
    const bedSpecs = [
      { id: 'hospital_bed_1', x: hosp.cx - 7.2, z: hosp.cz - 0.6, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 01' },
      { id: 'hospital_bed_2', x: hosp.cx - 4.7, z: hosp.cz - 0.6, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 02' },
      { id: 'hospital_bed_3', x: hosp.cx - 2.2, z: hosp.cz - 0.6, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 03' },
      { id: 'hospital_bed_4', x: hosp.cx - 7.2, z: hosp.cz + 3.8, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 04' },
      { id: 'hospital_bed_5', x: hosp.cx - 4.7, z: hosp.cz + 3.8, exOff: 1.15, isVip: false, label: 'Sage Clinical Bay 05' },
      { id: 'hospital_bed_6', x: hosp.cx + 6.7, z: hosp.cz - 1.1, exOff: -1.45, isVip: true, label: 'Walnut VIP Recovery Suite 06' },
      { id: 'hospital_bed_7', x: hosp.cx + 6.7, z: hosp.cz + 3.6, exOff: -1.45, isVip: true, label: 'Imperial Walnut VIP Suite 07' },
    ];
    bedSpecs.forEach(function (bp, bi) {
      const hBed = buildStyledHospitalBed(bp.id, { isVip: bp.isVip });
      hBed.position.set(bp.x, hosp.y, bp.z);
      townGroup.add(hBed);
      addBox(sharedColliders, bp.x, bp.z, bp.isVip ? 2.1 : 1.32, 2.25);

      if (bi === 0 || bi === 1 || bi === 3) {
        const curt = buildCurvedCurtainTrack(2.35);
        curt.position.set(bp.x + 1.25, hosp.y, bp.z);
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

    // Image 2: Rolling Sage-Green & White Medical Crash/Supply Cart in Ward Corridor
    const crashCart = new THREE.Group();
    kit.addMesh(crashCart, kit.g.box1, whiteMat, 0.72, 0.92, 0.54, 0, 0.50, 0);
    [0.24, 0.44, 0.64, 0.82].forEach(function (dy) {
      kit.addMesh(crashCart, kit.g.box1, sageWallMat, 0.64, 0.14, 0.05, 0, dy, 0.27);
    });
    kit.addMesh(crashCart, kit.g.box1, ironMat, 0.42, 0.30, 0.08, 0, 1.15, 0);
    const cScr = new THREE.Mesh(keepGeo(new THREE.PlaneGeometry(0.36, 0.24)), ecgScreenMat);
    cScr.position.set(0, 1.15, 0.045);
    crashCart.add(cScr);
    crashCart.position.set(hosp.cx - 2.3, hosp.y, hosp.cz + 3.9);
    townGroup.add(crashCart);
    addBox(sharedColliders, hosp.cx - 2.3, hosp.cz + 3.9, 0.8, 0.65);

    // Image 1: Cognac Leather VIP Visitor Lounge Armchairs inside VIP Suite 06 & VIP Suite 07
    [
      { id: 'hosp_waiting_sofa', title: 'VIP Suite 06 Cognac Lounge Chair', x: hosp.cx + 5.0, z: hosp.cz + 0.5, yaw: Math.PI * 0.32, exitX: hosp.cx + 5.0, exitZ: hosp.cz - 0.6 },
      { id: 'hosp_vip_chair_2', title: 'VIP Suite 07 Cognac Lounge Chair', x: hosp.cx + 5.0, z: hosp.cz + 5.2, yaw: Math.PI * 0.32, exitX: hosp.cx + 5.0, exitZ: hosp.cz + 4.1 },
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
