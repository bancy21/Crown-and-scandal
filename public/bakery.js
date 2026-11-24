(function () {
  'use strict';

  function buildWallflourBakery(ctx) {
    const THREE = ctx.THREE;
    const kit = ctx.kit;
    const townGroup = ctx.townGroup;
    if (!THREE || !kit || !townGroup) return null;

    const sharedColliders = ctx.sharedColliders;
    const ivoryMat = ctx.ivoryMat;
    const parquetMat = ctx.parquetMat;
    const sidewalkMat = ctx.sidewalkMat;
    const goldMat = ctx.goldMat;
    const glassMat = ctx.glassMat;
    const terracottaMat = ctx.terracottaMat;

    const addBox = ctx.addBox;
    const addCircle = ctx.addCircle;
    const addWallX = ctx.addWallX;
    const addWallZ = ctx.addWallZ;
    const placeToilet = ctx.placeToilet;
    const placeVanitySink = ctx.placeVanitySink;
    const tagInteractable = ctx.tagInteractable;
    const registerSpot = ctx.registerSpot;
    const recordDispatchGossip = ctx.recordDispatchGossip;
    const cutaways = ctx.cutaways;
    const walkableFloors = ctx.walkableFloors;
    const townDirectory = ctx.townDirectory;
    const townZones = ctx.townZones;
    const townDoors = ctx.townDoors;
    const dynamicNodes = ctx.dynamicNodes;

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

    function makeTex(w, h, drawFn, rep) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const g2 = c.getContext('2d');
      drawFn(g2, w, h);
      const tex = keepTex(new THREE.CanvasTexture(c));
      if (rep) {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(rep[0], rep[1]);
      }
      return tex;
    }

    // -----------------------------------------------------------
    // PROCEDURAL INSPIRED MATERIALS (Photos 1, 2, 3 & 4)
    // -----------------------------------------------------------
    // Photo 1: Dusty-rose wood storefront panels & warm red brick 2nd story
    const roseFacadeMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xd9949b, roughness: 0.56 }));
    const roseTrimMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xeab6bc, roughness: 0.48 }));
    const creamPanelMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xf7efe4, roughness: 0.50 }));
    const creamBoiserieMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xf4eadc, roughness: 0.46 }));

    const brickTex = makeTex(256, 256, function (c, w, h) {
      c.fillStyle = '#97564a';
      c.fillRect(0, 0, w, h);
      const rows = 8;
      const cols = 4;
      const bh = h / rows;
      const bw = w / cols;
      for (let r = 0; r < rows; r++) {
        const off = (r % 2) * (bw * 0.5);
        for (let col = -1; col <= cols; col++) {
          const shade = ((r * 7 + col * 11) % 3);
          c.fillStyle = shade === 0 ? '#a25f52' : shade === 1 ? '#8b4b40' : '#965448';
          c.fillRect(col * bw + off + 2, r * bh + 2, bw - 4, bh - 4);
        }
      }
      c.fillStyle = 'rgba(235, 224, 210, 0.25)';
      for (let r = 0; r < rows; r++) c.fillRect(0, r * bh, w, 2);
    }, [3, 2]);
    const brickWallMat = keepMat(new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.78 }));

    // Pink & white striped storefront awnings (Photo 1)
    const pinkStripeTex = makeTex(256, 128, function (c, w, h) {
      for (let x = 0; x < w; x += 32) {
        c.fillStyle = (Math.floor(x / 32) % 2 === 0) ? '#e59aa5' : '#fbf6f0';
        c.fillRect(x, 0, 32, h);
      }
      c.fillStyle = 'rgba(130, 60, 74, 0.12)';
      c.fillRect(0, h - 10, w, 10);
    }, [2, 1]);
    const awningMat = keepMat(new THREE.MeshStandardMaterial({ map: pinkStripeTex, roughness: 0.65 }));

    // Cream & diamond checkered floor + powder-blue & white gingham tea tablecloths (Photo 2 & 3)
    const diamondTileTex = makeTex(256, 256, function (c, w, h) {
      c.fillStyle = '#f5ede2';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(176, 152, 126, 0.35)';
      c.lineWidth = 2;
      for (let y = 0; y < h; y += 64) {
        for (let x = 0; x < w; x += 64) {
          c.strokeRect(x, y, 64, 64);
          c.fillStyle = '#8b6859';
          c.beginPath();
          c.moveTo(x, y - 6); c.lineTo(x + 6, y); c.lineTo(x, y + 6); c.lineTo(x - 6, y);
          c.closePath();
          c.fill();
        }
      }
    }, [4, 3]);
    const patisserieFloorMat = keepMat(new THREE.MeshStandardMaterial({ map: diamondTileTex, roughness: 0.28, metalness: 0.04 }));

    const ginghamTex = makeTex(128, 128, function (c, w, h) {
      c.fillStyle = '#f8fbfe';
      c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(148, 186, 222, 0.45)';
      for (let x = 0; x < w; x += 16) c.fillRect(x, 0, 8, h);
      for (let y = 0; y < h; y += 16) c.fillRect(0, y, w, 8);
    }, [2, 2]);
    const ginghamMat = keepMat(new THREE.MeshStandardMaterial({ map: ginghamTex, roughness: 0.72 }));

    const powderBlueMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xa4c3dc, roughness: 0.48 }));
    const timberMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x865934, roughness: 0.62 }));
    const honeyGoldMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xe6a832, roughness: 0.28, metalness: 0.08 }));
    const darkChalkMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x202325, roughness: 0.78 }));
    const ivyMat = keepMat(new THREE.MeshStandardMaterial({ color: 0x4b7d42, roughness: 0.78 }));
    const roseBlossomMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xe695aa, roughness: 0.65 }));
    const peachBlossomMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xf4c694, roughness: 0.65 }));
    const lavenderBlossomMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xb19cd9, roughness: 0.65 }));
    const warmLightMat = keepMat(new THREE.MeshBasicMaterial({ color: 0xffe8b0 }));
    const laceBuntingMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xfefaf3, roughness: 0.85, side: THREE.DoubleSide }));
    const conservatoryGlassMat = keepMat(new THREE.MeshPhysicalMaterial({
      color: 0xdff2fa, roughness: 0.08, metalness: 0.08, clearcoat: 0.9, transparent: true, opacity: 0.32, depthWrite: false,
    }));

    // Signboards & chalkboards canvas textures
    const mainSignTex = makeTex(1024, 256, function (c, w, h) {
      c.fillStyle = '#f8f0e2';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#c89b44';
      c.lineWidth = 10;
      c.strokeRect(12, 12, w - 24, h - 24);
      // Floral corners
      [110, w - 110].forEach(function (fx) {
        c.fillStyle = '#6f9c5d';
        c.beginPath(); c.ellipse(fx - 38, h * 0.52, 28, 12, -0.4, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(fx + 38, h * 0.52, 28, 12, 0.4, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#e48ca2';
        c.beginPath(); c.arc(fx, h * 0.48, 22, 0, Math.PI * 2); c.fill();
        c.fillStyle = '#f3b7c6';
        c.beginPath(); c.arc(fx - 20, h * 0.56, 15, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.arc(fx + 20, h * 0.56, 15, 0, Math.PI * 2); c.fill();
      });
      c.fillStyle = '#3b2421';
      c.font = 'italic bold 74px Georgia, serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('Wallflour & Maison Brioche', w * 0.5, h * 0.52);
    });
    const mainSignMat = keepMat(new THREE.MeshStandardMaterial({ map: mainSignTex, roughness: 0.42 }));

    const crestTex = makeTex(256, 128, function (c, w, h) {
      c.fillStyle = '#f5ead8';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#c29a53';
      c.lineWidth = 6;
      c.strokeRect(8, 8, w - 16, h - 16);
      c.fillStyle = '#4e332c';
      c.textAlign = 'center';
      c.font = 'bold 34px Georgia, serif';
      c.fillText('Est.', w * 0.5, 48);
      c.font = 'bold 42px Georgia, serif';
      c.fillText('1892', w * 0.5, 96);
    });
    const crestMat = keepMat(new THREE.MeshStandardMaterial({ map: crestTex, roughness: 0.5 }));

    const frenchMenuTex = makeTex(512, 384, function (c, w, h) {
      c.fillStyle = '#f6ecd7';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#c4963e';
      c.lineWidth = 18;
      c.strokeRect(10, 10, w - 20, h - 20);
      c.fillStyle = '#4a3228';
      c.textAlign = 'center';
      c.font = 'italic bold 36px Georgia, serif';
      c.fillText('La Pâtisserie Royale', w * 0.5, 58);
      c.strokeStyle = '#c4963e';
      c.lineWidth = 2;
      c.beginPath(); c.moveTo(90, 76); c.lineTo(w - 90, 76); c.stroke();
      c.textAlign = 'left';
      c.font = '22px Georgia, serif';
      const items = [
        ['Croissant au Beurre', '₡8'],
        ['Pain au Chocolat', '₡10'],
        ['Macarons Assortis', '₡18'],
        ['Mille-Feuille Vanille', '₡16'],
        ['Fraisier aux Fraises', '₡20'],
        ['Café Crème & Rose Tea', '₡12'],
      ];
      items.forEach(function (it, idx) {
        const yy = 122 + idx * 40;
        c.fillText(it[0], 56, yy);
        c.textAlign = 'right';
        c.fillText(it[1], w - 56, yy);
        c.textAlign = 'left';
      });
    });
    const frenchMenuMat = keepMat(new THREE.MeshStandardMaterial({ map: frenchMenuTex, roughness: 0.45 }));

    const bumbleMenuTex = makeTex(512, 512, function (c, w, h) {
      c.fillStyle = '#222826';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#8b6239';
      c.lineWidth = 18;
      c.strokeRect(9, 9, w - 18, h - 18);
      c.fillStyle = '#f8f2e2';
      c.textAlign = 'center';
      c.font = 'bold 46px Georgia, serif';
      c.fillText('BUMBLEBEE', w * 0.5, 86);
      c.font = '32px Georgia, serif';
      c.fillText('BAKERY', w * 0.5, 130);
      c.fillStyle = '#f2c84b';
      c.beginPath(); c.arc(w * 0.5, 162, 7, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#eff4eb';
      c.textAlign = 'left';
      c.font = '26px Georgia, serif';
      [
        '• Honey Cake',
        '• Lemon Tarts',
        '• Lavender Shortbread',
        '• Bee Pollen Scones',
        '• Wildflower Cupcakes',
        '• Earl Grey Tea',
        '• Honey Lemonade',
      ].forEach(function (line, li) {
        c.fillText(line, 64, 212 + li * 38);
      });
      c.textAlign = 'center';
      c.font = 'italic 24px Georgia, serif';
      c.fillStyle = '#f3d478';
      c.fillText('made with love ♥', w * 0.5, 470);
    });
    const bumbleMenuMat = keepMat(new THREE.MeshStandardMaterial({ map: bumbleMenuTex, roughness: 0.6 }));

    const breadChalkTex = makeTex(256, 320, function (c, w, h) {
      c.fillStyle = '#232527';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#9a6e42';
      c.lineWidth = 12;
      c.strokeRect(8, 8, w - 16, h - 16);
      c.fillStyle = '#f8f1e4';
      c.textAlign = 'center';
      c.font = 'italic bold 40px Georgia, serif';
      c.fillText('Fresh', w * 0.5, 108);
      c.fillText('Bread', w * 0.5, 168);
      c.fillText('Daily', w * 0.5, 228);
    });
    const breadChalkMat = keepMat(new THREE.MeshStandardMaterial({ map: breadChalkTex, roughness: 0.72 }));

    const pastryChalkTex = makeTex(256, 320, function (c, w, h) {
      c.fillStyle = '#232527';
      c.fillRect(0, 0, w, h);
      c.strokeStyle = '#9a6e42';
      c.lineWidth = 12;
      c.strokeRect(8, 8, w - 16, h - 16);
      c.fillStyle = '#f8f1e4';
      c.textAlign = 'center';
      c.font = 'italic bold 36px Georgia, serif';
      ['Pastries', 'Cakes', 'Tarts', 'Treats'].forEach(function (wrd, wi) {
        c.fillText(wrd, w * 0.5, 86 + wi * 56);
      });
    });
    const pastryChalkMat = keepMat(new THREE.MeshStandardMaterial({ map: pastryChalkTex, roughness: 0.72 }));

    // -----------------------------------------------------------
    // LAYOUT BOUNDS (Cleanly seated in West Riviera Block: x [-90.6..-70.6], z [35.6..44.0])
    // -----------------------------------------------------------
    const bx = -84.0;
    const bz = 39.8;
    const bw = 13.2;
    const bd = 8.4;
    const y1 = 0.12;
    const y2 = 3.72;
    const wallH1 = 3.6;
    const wallH2 = 3.35;

    // East Glasshouse Conservatory ("Bumblebee Bakery")
    const gx = -74.0;
    const gz = 39.8;
    const gw = 6.8;
    const gd = 8.4;

    const bakeryGroup = new THREE.Group();
    const upper2FGrp = new THREE.Group();
    const roof2FGrp = new THREE.Group();
    const conservRoofGrp = new THREE.Group();
    townGroup.add(bakeryGroup);
    bakeryGroup.add(upper2FGrp, roof2FGrp, conservRoofGrp);

    // Sidewalk apron & marble/tile 1F slabs
    const pad = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw + gw + 1.4, 0.08, bd + 1.4)), sidewalkMat);
    pad.position.set(-80.6, 0.04, bz);
    pad.receiveShadow = true;
    bakeryGroup.add(pad);

    const floor1Mesh = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw, 0.16, bd)), patisserieFloorMat);
    floor1Mesh.position.set(bx, 0.06, bz);
    floor1Mesh.receiveShadow = true;
    bakeryGroup.add(floor1Mesh);

    const conservFloorMat = keepMat(new THREE.MeshStandardMaterial({ color: 0xe6ddd0, roughness: 0.45 }));
    const floorConservMesh = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(gw, 0.16, gd)), conservFloorMat);
    floorConservMesh.position.set(gx, 0.06, gz);
    floorConservMesh.receiveShadow = true;
    bakeryGroup.add(floorConservMesh);

    // -----------------------------------------------------------
    // 1. PHOTO 1 MAIN BUILDING SHELL & STOREFRONT WINDOWS (1F)
    // -----------------------------------------------------------
    const xL = bx - bw * 0.5; // -90.6
    const xR = bx + bw * 0.5; // -77.4
    const zN = bz - bd * 0.5; // 35.6
    const zS = bz + bd * 0.5; // 44.0

    // North solid back wall (1F)
    addWallX(bakeryGroup, sharedColliders, 0, wallH1, zN, xL, xR, null, 0, 0.28, creamBoiserieMat);
    // West solid brick/cream wall (1F)
    addWallZ(bakeryGroup, sharedColliders, 0, wallH1, xL, zN, zS, null, 0, 0.28, creamBoiserieMat);
    // East wall between Patisserie & Bumblebee Glasshouse (wide connecting archway at z = 39.8!)
    addWallZ(bakeryGroup, sharedColliders, 0, wallH1, xR, zN, zS, bz, 2.7, 0.26, creamBoiserieMat);

    // South Storefront (Photo 1): Central French Double Doors (doorW = 2.6 at bx = -84.0) + Wide Transparent Display Windows!
    const doorCenterX = bx;
    const doorW = 2.6;
    // Lower dusty-rose wainscot beneath display windows
    [-1, 1].forEach(function (side) {
      const winCx = bx + side * 4.05;
      const winW = 4.6;
      // Solid lower dusty-rose panel wall (y = 0..0.72)
      const wainscot = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(winW, 0.74, 0.28)), roseFacadeMat);
      wainscot.position.set(winCx, 0.37, zS);
      wainscot.castShadow = true;
      wainscot.receiveShadow = true;
      bakeryGroup.add(wainscot);
      addBox(sharedColliders, winCx, zS, winW, 0.42);
      // Trim moldings around wainscot
      const trim = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(winW - 0.35, 0.44, 0.32)), roseTrimMat);
      trim.position.set(winCx, 0.37, zS);
      bakeryGroup.add(trim);
      // Upper glass display window (clear view into interior!)
      const winPane = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(winW - 0.2, 2.1, 0.05)), conservatoryGlassMat);
      winPane.position.set(winCx, 1.78, zS);
      bakeryGroup.add(winPane);
      // Dusty-rose fluted pilasters on left/right window edges
      [-winW * 0.5, winW * 0.5].forEach(function (px) {
        const pil = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.28, wallH1, 0.36)), roseFacadeMat);
        pil.position.set(winCx + px, wallH1 * 0.5, zS + 0.03);
        pil.castShadow = true;
        bakeryGroup.add(pil);
      });
      // Pink-and-white striped sloped awning + scalloped valance above each display window
      const awning = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(winW + 0.2, 0.10, 1.25)), awningMat);
      awning.position.set(winCx, 2.94, zS + 0.56);
      awning.rotation.x = 0.36;
      awning.castShadow = true;
      bakeryGroup.add(awning);
      const valance = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(winW + 0.2, 0.22, 0.06)), awningMat);
      valance.position.set(winCx, 2.66, zS + 1.14);
      bakeryGroup.add(valance);
    });

    // Overhead Lintel & Ornate Floral Frieze Signboard ("Wallflour & Maison Brioche") across full 1F Storefront!
    const lintel1 = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(doorW + 0.3, 0.85, 0.32)), roseFacadeMat);
    lintel1.position.set(bx, 3.18, zS);
    bakeryGroup.add(lintel1);
    const signBack = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw + 0.2, 0.92, 0.38)), roseFacadeMat);
    signBack.position.set(bx, 3.65, zS + 0.06);
    signBack.castShadow = true;
    bakeryGroup.add(signBack);
    const signBoard = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw - 1.2, 0.72, 0.08)), mainSignMat);
    signBoard.position.set(bx, 3.66, zS + 0.25);
    bakeryGroup.add(signBoard);

    // Front Window Displays (Photo 1):
    // Left display window: wicker baskets of golden baguettes + chalkboard "Fresh Bread Daily" + floral planter box outside!
    const leftWinX = bx - 4.05;
    const breadBoard = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.95, 1.18, 0.06)), breadChalkMat);
    breadBoard.position.set(leftWinX - 1.25, 1.68, zS - 0.55);
    bakeryGroup.add(breadBoard);
    [-0.25, 0.75, 1.55].forEach(function (bxOff, bi) {
      const bsk = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.36, 0.26, 0.42, 10)), timberMat);
      bsk.position.set(leftWinX + bxOff, 0.94, zS - 0.58);
      bakeryGroup.add(bsk);
      for (let g = 0; g < 3; g++) {
        const loaf = new THREE.Mesh(keepGeo(new THREE.CapsuleGeometry(0.08, 0.36, 4, 6)), honeyGoldMat);
        loaf.position.set(leftWinX + bxOff + (g - 1) * 0.12, 1.24 + (bi % 2) * 0.05, zS - 0.58);
        loaf.rotation.z = (g - 1) * 0.26;
        bakeryGroup.add(loaf);
      }
    });
    // Outdoor front window flower planter box under left display window
    const fBoxL = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.6, 0.34, 0.48)), roseTrimMat);
    fBoxL.position.set(leftWinX, 0.62, zS + 0.32);
    bakeryGroup.add(fBoxL);
    for (let fl = 0; fl < 9; fl++) {
      const fMat = [roseBlossomMat, peachBlossomMat, lavenderBlossomMat, ivyMat][fl % 4];
      const puff = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.20, 7, 6)), fMat);
      puff.position.set(leftWinX - 1.55 + fl * 0.39, 0.84 + (fl % 2) * 0.08, zS + 0.34);
      bakeryGroup.add(puff);
    }

    // Right display window: Tiered Cake Stands + "Pastries Cakes Tarts Treats" chalkboard!
    const rightWinX = bx + 4.05;
    const pastryBoard = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.95, 1.18, 0.06)), pastryChalkMat);
    pastryBoard.position.set(rightWinX + 1.35, 1.68, zS - 0.55);
    bakeryGroup.add(pastryBoard);
    const cakeDisplayShelf = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.6, 0.82, 0.85)), creamPanelMat);
    cakeDisplayShelf.position.set(rightWinX - 0.35, 0.53, zS - 0.62);
    bakeryGroup.add(cakeDisplayShelf);
    [-1.1, -0.35, 0.45].forEach(function (cxOff, ci) {
      const ped = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.28, 0.16, 0.22, 10)), ivoryMat);
      ped.position.set(rightWinX + cxOff, 1.05, zS - 0.62);
      bakeryGroup.add(ped);
      const ck = new THREE.Mesh(
        keepGeo(new THREE.CylinderGeometry(0.24, 0.26, 0.22, 12)),
        ci === 1 ? roseBlossomMat : peachBlossomMat
      );
      ck.position.set(rightWinX + cxOff, 1.24, zS - 0.62);
      bakeryGroup.add(ck);
    });

    // Articulated South French Double Doors (Photo 1: Cream Glazed + Brass Handles + Overhead Lantern)
    const frontDoors = kit.buildHingedDoors({
      width: doorW,
      height: 2.55,
      count: 2,
      leafColor: 0xfbf4ea,
      frameMat: creamPanelMat,
      glassMat: conservatoryGlassMat,
      filigree: true,
      transom: true,
    });
    frontDoors.group.position.set(doorCenterX, y1, zS);
    bakeryGroup.add(frontDoors.group);
    if (Array.isArray(townDoors)) {
      townDoors.push({
        id: 'bakery_front_door',
        title: 'Maison Brioche French Doors',
        x: doorCenterX,
        y: y1,
        z: zS,
        radius: 3.8,
        doors: frontDoors,
        openRatio: 0,
        manualOpen: false,
      });
    }
    // Glowing hanging brass lantern above French doors
    const lanternRod = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6)), goldMat);
    lanternRod.position.set(doorCenterX, 2.86, zS + 0.32);
    bakeryGroup.add(lanternRod);
    const lanternGlow = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.16, 8, 6)), warmLightMat);
    lanternGlow.position.set(doorCenterX, 2.66, zS + 0.32);
    bakeryGroup.add(lanternGlow);

    // Sidewalk Flower-Wrapped Black Streetlamp (Photo 1 West corner) & Wrought-Iron Bistro Table + 2 Chairs!
    const lampX = xL + 0.35;
    const lampZ = zS + 0.55;
    const lampBase = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.14, 0.24, 0.85, 8)), kit.palette.iron);
    lampBase.position.set(lampX, 0.42, lampZ);
    const lampPole = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.07, 0.11, 2.9, 8)), kit.palette.iron);
    lampPole.position.set(lampX, 2.25, lampZ);
    const lampHead = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.24, 8, 6)), warmLightMat);
    lampHead.position.set(lampX, 3.82, lampZ);
    const lampCap = new THREE.Mesh(keepGeo(new THREE.ConeGeometry(0.32, 0.28, 6)), kit.palette.iron);
    lampCap.position.set(lampX, 4.10, lampZ);
    bakeryGroup.add(lampBase, lampPole, lampHead, lampCap);
    for (let lf = 0; lf < 5; lf++) {
      const ang = (lf / 5) * Math.PI * 2;
      const flRing = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.16, 6, 5)), lf % 2 === 0 ? roseBlossomMat : peachBlossomMat);
      flRing.position.set(lampX + Math.cos(ang) * 0.18, 2.65, lampZ + Math.sin(ang) * 0.18);
      bakeryGroup.add(flRing);
    }
    addCircle(sharedColliders, lampX, lampZ, 0.38);

    // Sidewalk Bistro Table & 2 Chairs (`bakery_patio_bistro`) right beside the right window (Photo 1)
    const bistroX = rightWinX - 0.1;
    const bistroZ = zS + 0.82;
    const bistroGrp = new THREE.Group();
    bistroGrp.position.set(bistroX, 0.08, bistroZ);
    const bTop = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.46, 0.46, 0.05, 14)), ivoryMat);
    bTop.position.y = 0.74;
    const bPed = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.05, 0.24, 0.72, 8)), ivoryMat);
    bPed.position.y = 0.36;
    const vaseB = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.09, 0.07, 0.16, 8)), ivoryMat);
    vaseB.position.y = 0.84;
    const roseB = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.16, 7, 6)), roseBlossomMat);
    roseB.position.y = 0.98;
    bistroGrp.add(bTop, bPed, vaseB, roseB);
    [-0.68, 0.68].forEach(function (cxOff) {
      const chSeat = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 10)), ivoryMat);
      chSeat.position.set(cxOff, 0.45, 0);
      const chLeg = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.04, 0.16, 0.44, 6)), ivoryMat);
      chLeg.position.set(cxOff, 0.22, 0);
      const chBack = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.06, 0.42, 0.36)), ivoryMat);
      chBack.position.set(cxOff + (cxOff < 0 ? -0.19 : 0.19), 0.66, 0);
      bistroGrp.add(chSeat, chLeg, chBack);
    });
    bakeryGroup.add(bistroGrp);
    tagInteractable(bistroGrp, 'bakery_patio_bistro');
    addBox(sharedColliders, bistroX, bistroZ, 1.65, 0.92);
    registerSpot({
      id: 'bakery_patio_bistro',
      title: 'Sidewalk Rose Bistro Table',
      floor: 0,
      category: 'town',
      x: bistroX,
      y: 0.08,
      z: bistroZ,
      radius: 2.8,
      actions: [
        {
          id: 'bakery_bistro_tea',
          label: 'Sit Outside at Sidewalk Bistro & Sip Latte',
          hint: '+16 Food/s, +10 Fun/s & Parisian Street View',
          pose: 'eat',
          anchor: {
            x: bistroX - 0.68, y: 0.08, z: bistroZ, yaw: Math.PI * 0.5, rigOffsetY: -0.45,
            floorY: 0.08, exitX: bistroX, exitZ: bistroZ + 0.9, exitYaw: Math.PI,
          },
          rates: { hunger: 16, fun: 10, composure: 4 },
          statusText: 'Enjoying café crème outside Wallflour & Maison Brioche...',
        },
      ],
    });

    // -----------------------------------------------------------
    // 2. PHOTO 2 & PHOTO 3: PATISSERIE 1F TEA SALON + BAROQUE VITRINE + WASHROOM
    // -----------------------------------------------------------
    // Cream & Gold Louis XVI Boiserie Back Wall with Gold-Framed Menu & Flanking Wall Sconces (Photo 3)
    const menuFrame = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.65, 1.85, 0.09)), goldMat);
    menuFrame.position.set(bx + 1.4, y1 + 2.25, zN + 0.20);
    const menuParchment = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.42, 1.62, 0.11)), frenchMenuMat);
    menuParchment.position.set(bx + 1.4, y1 + 2.25, zN + 0.22);
    bakeryGroup.add(menuFrame, menuParchment);
    [-0.3, 3.1].forEach(function (sxOff) {
      const scBase = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.14, 0.26, 0.12)), goldMat);
      scBase.position.set(bx + sxOff, y1 + 2.25, zN + 0.22);
      const scGlow = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.08, 6, 5)), warmLightMat);
      scGlow.position.set(bx + sxOff, y1 + 2.45, zN + 0.28);
      bakeryGroup.add(scBase, scGlow);
    });

    // Powder-Blue Paneled Patisserie Cooler & Fridge along North-West wall (Photo 2)
    const coolerGrp = new THREE.Group();
    coolerGrp.position.set(bx - 2.3, y1, zN + 0.55);
    const coolerBase = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.2, 0.72, 0.72)), powderBlueMat);
    coolerBase.position.y = 0.36;
    const coolerTop = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.22, 1.65, 0.74)), powderBlueMat);
    coolerTop.position.y = 1.54;
    const coolerGlass = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.04, 1.44, 0.10)), conservatoryGlassMat);
    coolerGlass.position.set(0, 1.54, 0.34);
    coolerGrp.add(coolerBase, coolerTop, coolerGlass);
    [1.15, 1.65].forEach(function (sy) {
      const shelf = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.0, 0.04, 0.58)), ivoryMat);
      shelf.position.y = sy;
      coolerGrp.add(shelf);
      [-0.6, 0, 0.6].forEach(function (tx, ti) {
        const cake = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.16, 0.17, 0.16, 10)), ti === 1 ? roseBlossomMat : peachBlossomMat);
        cake.position.set(tx, sy + 0.10, 0.04);
        coolerGrp.add(cake);
      });
    });
    bakeryGroup.add(coolerGrp);
    addBox(sharedColliders, bx - 2.3, zN + 0.55, 2.25, 0.85);

    // Ornate Brass-Trimmed Curved Pastry Vitrine Showcase + Baguette Basket + Cloche Domes (Photo 3!)
    const vitrineGrp = new THREE.Group();
    vitrineGrp.position.set(bx + 1.4, y1, zN + 1.55);
    const vCounterBase = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.4, 0.88, 0.96)), creamBoiserieMat);
    vCounterBase.position.y = 0.44;
    const vMarbleTop = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.52, 0.08, 1.06)), ivoryMat);
    vMarbleTop.position.y = 0.90;
    const vGlass = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.25, 0.62, 0.84)), conservatoryGlassMat);
    vGlass.position.y = 1.24;
    const vGoldCap = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.32, 0.06, 0.90)), goldMat);
    vGoldCap.position.y = 1.56;
    vitrineGrp.add(vCounterBase, vMarbleTop, vGlass, vGoldCap);
    // Pastries arranged across shelves inside brass showcase (croissants, rose macarons, éclairs)
    [0.98, 1.28].forEach(function (py, rowIdx) {
      for (let pi = -3; pi <= 3; pi++) {
        const pCol = (pi + rowIdx) % 3 === 0 ? honeyGoldMat : (pi + rowIdx) % 3 === 1 ? roseBlossomMat : peachBlossomMat;
        const treat = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.11, 0.12, 0.09, 8)), pCol);
        treat.position.set(pi * 0.42, py, (rowIdx === 0 ? 0.16 : -0.10));
        vitrineGrp.add(treat);
      }
    });
    // Glass Cloche Cake Domes on Marble Countertop & Wicker Baguette Basket + Rose Vase!
    [-1.1, 0.9].forEach(function (dx) {
      const dome = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.20, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.5)), glassMat);
      dome.position.set(dx, 1.60, 0);
      const knob = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.035, 6, 5)), goldMat);
      knob.position.set(dx, 1.81, 0);
      vitrineGrp.add(dome, knob);
    });
    const bagBasket = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.28, 0.20, 0.36, 10)), timberMat);
    bagBasket.position.set(-1.95, 0.94 + 0.18, 0);
    vitrineGrp.add(bagBasket);
    for (let bg = 0; bg < 4; bg++) {
      const bag = new THREE.Mesh(keepGeo(new THREE.CapsuleGeometry(0.06, 0.32, 4, 6)), honeyGoldMat);
      bag.position.set(-1.95 + (bg - 1.5) * 0.09, 1.32, 0);
      bag.rotation.z = (bg - 1.5) * 0.22;
      vitrineGrp.add(bag);
    }
    const rVase = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.12, 0.09, 0.24, 8)), ivoryMat);
    rVase.position.set(1.95, 1.04, 0.1);
    const rBouquet = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.22, 8, 6)), roseBlossomMat);
    rBouquet.position.set(1.95, 1.24, 0.1);
    vitrineGrp.add(rVase, rBouquet);

    bakeryGroup.add(vitrineGrp);
    tagInteractable(vitrineGrp, 'bakery_showcase');
    addBox(sharedColliders, bx + 1.4, zN + 1.55, 3.6, 1.1);
    registerSpot({
      id: 'bakery_showcase',
      title: 'Louis XVI Glass Pastry Vitrine',
      floor: 0,
      category: 'town',
      x: bx + 1.4,
      y: y1,
      z: zN + 1.55,
      radius: 3.4,
      actions: [
        {
          id: 'buy_macaron_box',
          label: 'Buy Royal Ribbon Macaron Gift Box (₡32)',
          hint: '+42 Food, +18 Fun & +2 Clout',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 32) return actCtx.toast('Need ₡32 Crowns.');
            actCtx.game.money -= 32;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 42, fun: 18 });
            if (recordDispatchGossip) recordDispatchGossip(actCtx, 'Royal Princess spotted leaving Wallflour & Maison Brioche with ribboned macarons!', 2, 0);
            actCtx.toast('Delicious rose & pistachio macarons! (+42 Food, +2 Clout)');
          },
        },
        {
          id: 'buy_fresh_baguette',
          label: 'Buy Warm Artisan Baguette Basket (₡14)',
          hint: '+30 Food & +10 Fun',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 14) return actCtx.toast('Need ₡14 Crowns.');
            actCtx.game.money -= 14;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 30, fun: 10 });
            actCtx.toast('Crusty warm French baguettes straight from the oven! (+30 Food)');
          },
        },
      ],
    });

    // Patisserie Cashier POS Counter (`bakery_counter`) on East-North corner
    const bCounter = kit.buildCashierCounter('bakery_counter', '#7b3e4c', 'PATISSERIE POS');
    bCounter.position.set(bx + 4.8, y1, zN + 1.55);
    bakeryGroup.add(bCounter);
    tagInteractable(bCounter, 'bakery_counter');
    addBox(sharedColliders, bx + 4.8, zN + 1.55, 2.4, 0.95);
    registerSpot({
      id: 'bakery_counter',
      title: 'Maison Brioche Patisserie Cashier',
      floor: 0,
      category: 'town',
      shortcut: true,
      x: bx + 4.8,
      y: y1,
      z: zN + 1.55,
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
            actCtx.toast('Enjoying warm butter croissants & rose latte! (+35 Food)');
          },
        },
        {
          id: 'bakery_table_eat',
          label: 'Sit at Powder-Blue Gingham Tea Table',
          hint: '+18 Food/s & +10 Fun/s',
          pose: 'eat',
          anchor: {
            x: bx + 4.05, y: y1, z: bz + 1.45, yaw: Math.PI * 0.5, rigOffsetY: -0.45,
            floorY: y1, exitX: bx + 2.8, exitZ: bz + 1.45, exitYaw: 0,
          },
          rates: { hunger: 18, fun: 10 },
          statusText: 'Sipping rose tea & eating fraisier cake at Maison Brioche...',
        },
      ],
    });

    // Powder-Blue Gingham Draped Round Café Tables & Scrolled White Chairs (Photo 2!)
    function buildGinghamTeaTable(tx, tz, spotId) {
      const tg = new THREE.Group();
      tg.position.set(tx, y1, tz);
      const ped = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.06, 0.28, 0.72, 10)), ivoryMat);
      ped.position.y = 0.36;
      const clothDrape = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.56, 0.62, 0.28, 16)), ginghamMat);
      clothDrape.position.y = 0.64;
      const tableCap = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.56, 0.56, 0.04, 16)), ginghamMat);
      tableCap.position.y = 0.78;
      const cakePlate = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.16, 0.12, 0.03, 10)), ivoryMat);
      cakePlate.position.set(-0.18, 0.81, 0.08);
      const shortcake = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.10, 0.11, 0.11, 8)), peachBlossomMat);
      shortcake.position.set(-0.18, 0.88, 0.08);
      const berry = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.04, 6, 5)), roseBlossomMat);
      berry.position.set(-0.18, 0.96, 0.08);
      const flowerJar = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.07, 0.06, 0.14, 8)), glassMat);
      flowerJar.position.set(0.16, 0.86, -0.10);
      const blueFlower = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.12, 7, 6)), powderBlueMat);
      blueFlower.position.set(0.16, 0.96, -0.10);
      tg.add(ped, clothDrape, tableCap, cakePlate, shortcake, berry, flowerJar, blueFlower);

      [-0.78, 0.78].forEach(function (cxOff) {
        const cSeat = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.06, 12)), ivoryMat);
        cSeat.position.set(cxOff, 0.44, 0);
        const cBase = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.05, 0.18, 0.42, 8)), ivoryMat);
        cBase.position.set(cxOff, 0.22, 0);
        const cBack = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.07, 0.48, 0.42)), ivoryMat);
        cBack.position.set(cxOff + (cxOff < 0 ? -0.22 : 0.22), 0.70, 0);
        const cushion = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.10, 0.28, 0.28)), ginghamMat);
        cushion.position.set(cxOff + (cxOff < 0 ? -0.13 : 0.13), 0.62, 0);
        tg.add(cSeat, cBase, cBack, cushion);
      });

      bakeryGroup.add(tg);
      tagInteractable(tg, spotId);
      addBox(sharedColliders, tx, tz, 1.85, 1.15);
    }

    buildGinghamTeaTable(bx + 4.05, bz + 1.45, 'bakery_table');
    buildGinghamTeaTable(bx - 1.5, bz + 1.25, 'bakery_table');
    registerSpot({
      id: 'bakery_table',
      title: 'Powder-Blue Gingham Tea Salon',
      floor: 0,
      category: 'town',
      x: bx + 4.05,
      y: y1,
      z: bz + 1.45,
      radius: 3.4,
      actions: [
        {
          id: 'bakery_booth_eat',
          label: 'Sit at Powder-Blue Tea Table & Eat Cake',
          hint: '+18 Food/s & +10 Fun/s',
          pose: 'eat',
          anchor: {
            x: bx + 3.27, y: y1, z: bz + 1.45, yaw: Math.PI * 0.5, rigOffsetY: -0.45,
            floorY: y1, exitX: bx + 2.1, exitZ: bz + 1.45, exitYaw: 0,
          },
          rates: { hunger: 18, fun: 10 },
          statusText: 'Enjoying strawberry shortcake under the lace bunting...',
        },
      ],
    });

    // Ceiling Chandelier + Triangular White Lace Bunting on 1F Tea Salon (attached to upper2FGrp so cutaways hide cleanly!)
    const salonChand = kit.buildChandelier(0.95);
    salonChand.position.set(bx + 0.5, y1 + 3.18, bz + 0.2);
    upper2FGrp.add(salonChand);
    [-1, 1].forEach(function (side) {
      for (let bi = 0; bi < 8; bi++) {
        const fx = bx - 4.2 + bi * 1.15;
        const fz = bz + side * 0.8 + Math.sin((bi / 7) * Math.PI) * 0.45;
        const flag = new THREE.Mesh(keepGeo(new THREE.ConeGeometry(0.16, 0.24, 3)), laceBuntingMat);
        flag.position.set(fx, y1 + 3.22, fz);
        flag.rotation.x = Math.PI;
        upper2FGrp.add(flag);
      }
    });

    // Partitioned 1F Bakery Washroom (South-West Corner: x [-90.4..-87.4], z [41.5..43.8])
    addWallZ(bakeryGroup, sharedColliders, 0, 3.2, xL + 3.2, bz + 1.7, zS, bz + 2.75, 1.15, 0.18, creamBoiserieMat);
    addWallX(bakeryGroup, sharedColliders, 0, 3.2, bz + 1.7, xL, xL + 3.2, null, 0, 0.18, creamBoiserieMat);
    placeToilet(bakeryGroup, sharedColliders, {
      id: 'bakery_toilet', title: 'Bakery Washroom Toilet', floor: 0, rustic: true,
      x: xL + 0.85, y: y1, z: zS - 0.75, yaw: Math.PI * 0.5,
    });
    placeVanitySink(bakeryGroup, sharedColliders, {
      id: 'bakery_sink', title: 'Bakery Washroom Sink', floor: 0, rustic: true,
      x: xL + 1.9, y: y1, z: bz + 2.25, yaw: 0,
    });

    // -----------------------------------------------------------
    // 3. WALKABLE INTERIOR STAIRCASE + 2F RED-BRICK PATISSERIE LOFT (Photo 1 Upper Story!)
    // -----------------------------------------------------------
    // Staircase along West Wall rising South (z = 41.0, y = 0.12) -> North (z = 36.2, y = 3.72)
    const stairX = xL + 1.05; // -89.55
    const stairZ0 = 41.0;
    const stairZ1 = 36.2;
    const stepCount = 12;
    for (let st = 0; st < stepCount; st++) {
      const frac = (st + 0.5) / stepCount;
      const sz = stairZ0 + (stairZ1 - stairZ0) * frac;
      const sy = y1 + (y2 - y1) * frac;
      const stepMesh = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.75, 0.24, 0.44)), timberMat);
      stepMesh.position.set(stairX, sy - 0.12, sz);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      bakeryGroup.add(stepMesh);
    }
    // Inner Stair Rail Banister
    const railBar = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.08, 0.08, 4.9)), goldMat);
    railBar.position.set(stairX + 0.92, (y1 + y2) * 0.5 + 0.75, (stairZ0 + stairZ1) * 0.5);
    railBar.rotation.x = Math.atan2(y2 - y1, stairZ0 - stairZ1);
    bakeryGroup.add(railBar);
    addBox(sharedColliders, stairX + 0.96, (stairZ0 + stairZ1) * 0.5, 0.18, 4.9);

    // 2F Floor Slab (split leaving open stairwell hatch at West: x [-90.4..-88.5], z [36.0..41.2]!)
    const mainSlab = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw - 2.1, 0.22, bd)), parquetMat);
    mainSlab.position.set(bx + 1.05, y2 - 0.11, bz);
    upper2FGrp.add(mainSlab);
    const stairLandingS = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(2.1, 0.22, 2.8)), parquetMat);
    stairLandingS.position.set(xL + 1.05, y2 - 0.11, zS - 1.4);
    upper2FGrp.add(stairLandingS);

    // 2F Brick Exterior Walls (Photo 1: warm red-brown brick + stone cornice pilasters)
    const wall2N = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw, wallH2, 0.28)), brickWallMat);
    wall2N.position.set(bx, y2 + wallH2 * 0.5, zN);
    wall2N.castShadow = true;
    const wall2W = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.28, wallH2, bd)), brickWallMat);
    wall2W.position.set(xL, y2 + wallH2 * 0.5, bz);
    wall2W.castShadow = true;
    const wall2E = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.28, wallH2, bd)), brickWallMat);
    wall2E.position.set(xR, y2 + wallH2 * 0.5, bz);
    wall2E.castShadow = true;
    upper2FGrp.add(wall2N, wall2W, wall2E);

    // South 2F Brick Wall with 3 Arched Glazed Windows, Sheer Lace Curtains & Blooming Flower Boxes (Photo 1!)
    const brick2S = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw, wallH2, 0.28)), brickWallMat);
    brick2S.position.set(bx, y2 + wallH2 * 0.5, zS);
    brick2S.castShadow = true;
    upper2FGrp.add(brick2S);
    [-4.1, 0, 4.1].forEach(function (wx) {
      const winX = bx + wx;
      const wFrame = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.75, 2.25, 0.34)), ivoryMat);
      wFrame.position.set(winX, y2 + 1.55, zS + 0.02);
      const wArch = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.87, 0.87, 0.34, 12)), ivoryMat);
      wArch.rotation.x = Math.PI * 0.5;
      wArch.position.set(winX, y2 + 2.55, zS + 0.02);
      const wGlass = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.38, 1.95, 0.38)), conservatoryGlassMat);
      wGlass.position.set(winX, y2 + 1.55, zS + 0.03);
      // Window Box filled with vibrant pink, lavender & peach blossoms!
      const wBox = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.85, 0.30, 0.40)), ivoryMat);
      wBox.position.set(winX, y2 + 0.32, zS + 0.32);
      upper2FGrp.add(wFrame, wArch, wGlass, wBox);
      for (let wf = 0; wf < 5; wf++) {
        const bf = new THREE.Mesh(
          keepGeo(new THREE.SphereGeometry(0.18, 6, 5)),
          [roseBlossomMat, lavenderBlossomMat, peachBlossomMat, ivyMat][wf % 4]
        );
        bf.position.set(winX - 0.68 + wf * 0.34, y2 + 0.52 + (wf % 2) * 0.07, zS + 0.36);
        upper2FGrp.add(bf);
      }
    });
    // Climbing Rose Vine on West Brick Facade Corner (Photo 1!)
    for (let rv = 0; rv < 7; rv++) {
      const vineBall = new THREE.Mesh(
        keepGeo(new THREE.SphereGeometry(0.28, 7, 6)),
        rv % 2 === 0 ? roseBlossomMat : ivyMat
      );
      vineBall.position.set(xL + 0.35 + Math.sin(rv) * 0.2, y1 + 3.8 + rv * 0.52, zS + 0.25);
      upper2FGrp.add(vineBall);
    }

    // 2F Roof Parapet Balustrade + Carved Stone "Est. 1892" Crest & Gable Roof (Roof hides cleanly when player is on 2F!)
    const parapet = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(bw + 0.4, 0.55, 0.36)), ivoryMat);
    parapet.position.set(bx, y2 + wallH2 + 0.28, zS + 0.04);
    const crestPediment = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(1.35, 1.35, 0.38, 14)), ivoryMat);
    crestPediment.rotation.x = Math.PI * 0.5;
    crestPediment.position.set(bx, y2 + wallH2 + 0.72, zS + 0.06);
    const crestFace = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(1.75, 0.85, 0.10)), crestMat);
    crestFace.position.set(bx, y2 + wallH2 + 0.76, zS + 0.24);
    roof2FGrp.add(parapet, crestPediment, crestFace);

    const roof2Gable = kit.buildGableRoof(bw, bd, 1.9, terracottaMat, ivoryMat, { dormer: false, chimney: true });
    roof2Gable.position.set(bx, y2 + wallH2 - 0.02, bz);
    roof2FGrp.add(roof2Gable);

    // 2F Interior Salon Lounge Furnishing (`bakery_upstairs_salon`)
    const upperRug = kit.buildRug(4.6, 3.2, 'rose');
    upperRug.position.set(bx + 1.8, y2, bz);
    upper2FGrp.add(upperRug);
    const upperTable = kit.buildBoothTableSet('bakery_upstairs_salon');
    upperTable.position.set(bx + 1.8, y2, bz);
    upper2FGrp.add(upperTable);
    tagInteractable(upperTable, 'bakery_upstairs_salon');
    const upperPiano = kit.buildGrandPiano('bakery_upstairs_salon');
    upperPiano.position.set(bx + 4.6, y2, zN + 1.9);
    upperPiano.rotation.y = -Math.PI * 0.35;
    upper2FGrp.add(upperPiano);
    tagInteractable(upperPiano, 'bakery_upstairs_salon');
    const upperChand = kit.buildChandelier(0.9);
    upperChand.position.set(bx + 1.8, y2 + 3.05, bz);
    roof2FGrp.add(upperChand);

    registerSpot({
      id: 'bakery_upstairs_salon',
      title: '2F Patisserie Loft & Tasting Lounge',
      floor: 0,
      category: 'town',
      x: bx + 1.8,
      y: y2,
      z: bz,
      radius: 4.5,
      actions: [
        {
          id: 'bakery_2f_tea',
          label: 'Dine Upstairs Overlooking Boulevard',
          hint: '+20 Food/s, +14 Fun/s & +10 Poise/s',
          pose: 'eat',
          anchor: {
            x: bx + 0.85, y: y2, z: bz, yaw: Math.PI * 0.5, rigOffsetY: -0.45,
            floorY: y2, exitX: bx + 0.1, exitZ: bz + 1.2, exitYaw: 0,
          },
          rates: { hunger: 20, fun: 14, composure: 10 },
          statusText: 'Enjoying private upstairs patisserie tasting above Wallflour...',
        },
        {
          id: 'bakery_2f_down',
          label: 'Walk Downstairs to Main Patisserie',
          hint: 'Return to 1F Tea Salon & Glasshouse',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.playerCtrl.teleport(bx, bz + 0.5, 0, y1);
          },
        },
      ],
    });
    registerSpot({
      id: 'bakery_stairs_up',
      title: 'Bakery Oak Staircase to 2F Loft',
      floor: 0,
      category: 'town',
      x: stairX + 1.2,
      y: y1,
      z: stairZ0 - 0.5,
      radius: 2.4,
      actions: [
        {
          id: 'go_bakery_2f',
          label: 'Walk Up to 2F Patisserie Tasting Loft',
          hint: 'Enjoy floral window views & private tea lounge',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.playerCtrl.teleport(bx + 0.4, bz + 0.4, Math.PI * 0.5, y2);
            actCtx.toast('Welcome upstairs to the 2F Wallflour Loft!');
          },
        },
      ],
    });

    // -----------------------------------------------------------
    // 4. PHOTO 4: "BUMBLEBEE BAKERY" GLASSHOUSE CONSERVATORY WING (East Flank!)
    // -----------------------------------------------------------
    const gxL = gx - gw * 0.5; // -77.4
    const gxR = gx + gw * 0.5; // -70.6
    // Conservatory North & East Timber+Glass Walls
    addWallX(bakeryGroup, sharedColliders, 0, wallH1, zN, gxL, gxR, null, 0, 0.24, timberMat);
    addWallZ(bakeryGroup, sharedColliders, 0, wallH1, gxR, zN, zS, null, 0, 0.24, timberMat);
    // East large glass conservatory window strip
    const eastGlass = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.08, 2.2, gd - 1.6)), conservatoryGlassMat);
    eastGlass.position.set(gxR - 0.16, 1.9, gz);
    bakeryGroup.add(eastGlass);
    // Conservatory South Wall with Hinged Garden French Door
    addWallX(bakeryGroup, sharedColliders, 0, wallH1, zS, gxL, gxR, gx, 2.2, 0.24, timberMat);
    const gardenDoors = kit.buildHingedDoors({
      width: 2.2,
      height: 2.5,
      count: 2,
      leafColor: 0x6f4a29,
      frameMat: timberMat,
      glassMat: conservatoryGlassMat,
    });
    gardenDoors.group.position.set(gx, y1, zS);
    bakeryGroup.add(gardenDoors.group);
    if (Array.isArray(townDoors)) {
      townDoors.push({
        id: 'bakery_conservatory_door',
        title: 'Bumblebee Glasshouse Doors',
        x: gx,
        y: y1,
        z: zS,
        radius: 3.6,
        doors: gardenDoors,
        openRatio: 0,
        manualOpen: false,
      });
    }

    // Photo 4 Arched Timber Ribs + Skylight Glass Roof + Ivy Vines & Fairy Lights (in conservRoofGrp!)
    for (let r = 0; r < 4; r++) {
      const rz = zN + 0.8 + r * 2.25;
      const beamL = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(gw * 0.55, 0.18, 0.20)), timberMat);
      beamL.position.set(gx - gw * 0.23, wallH1 + 0.55, rz);
      beamL.rotation.z = 0.34;
      const beamR = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(gw * 0.55, 0.18, 0.20)), timberMat);
      beamR.position.set(gx + gw * 0.23, wallH1 + 0.55, rz);
      beamR.rotation.z = -0.34;
      conservRoofGrp.add(beamL, beamR);
      // Trailing ivy clumps & warm fairy bulbs along timber arches!
      [-1.5, 0, 1.5].forEach(function (ix, ii) {
        const ivy = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.32, 6, 5)), ivyMat);
        ivy.position.set(gx + ix, wallH1 + 0.72 - Math.abs(ix) * 0.18, rz);
        const bulb = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.06, 5, 4)), warmLightMat);
        bulb.position.set(gx + ix + 0.25, wallH1 + 0.45, rz + 0.15);
        conservRoofGrp.add(ivy, bulb);
      });
    }
    const skylight = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(gw, 0.08, gd)), conservatoryGlassMat);
    skylight.position.set(gx, wallH1 + 0.92, gz);
    conservRoofGrp.add(skylight);

    // "BUMBLEBEE BAKERY" Floral Chalkboard Menu on East-Facing West Conservatory Wall (Photo 4!)
    const bumbleMenu = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(0.08, 1.85, 1.55)), bumbleMenuMat);
    bumbleMenu.position.set(gxL + 0.18, y1 + 2.15, zN + 1.55);
    bakeryGroup.add(bumbleMenu);

    // Photo 4 Warm Timber Honey Cake Counter (`bakery_honey_counter`)!
    const honeyBar = new THREE.Group();
    honeyBar.position.set(gx + 0.3, y1, zN + 1.85);
    const barBody = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.4, 0.88, 1.08)), timberMat);
    barBody.position.y = 0.44;
    const barTop = new THREE.Mesh(keepGeo(new THREE.BoxGeometry(3.56, 0.08, 1.18)), timberMat);
    barTop.position.y = 0.90;
    honeyBar.add(barBody, barTop);
    // Signature Multi-Layer Honey Cake on wooden pedestal stand!
    const hStand = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.28, 0.14, 0.18, 10)), timberMat);
    hStand.position.set(-0.95, 1.03, 0.12);
    const hCake = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.26, 0.26, 0.26, 12)), honeyGoldMat);
    hCake.position.set(-0.95, 1.25, 0.12);
    const hIcing = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.27, 0.27, 0.05, 12)), creamPanelMat);
    hIcing.position.set(-0.95, 1.38, 0.12);
    // Wildflower Lemon Cupcakes Pedestal
    const cupStand = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.26, 0.12, 0.16, 10)), ivoryMat);
    cupStand.position.set(0, 1.02, -0.10);
    honeyBar.add(hStand, hCake, hIcing, cupStand);
    [-0.12, 0.12].forEach(function (ux) {
      [-0.10, 0.10].forEach(function (uz) {
        const cup = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.06, 0.05, 0.08, 8)), honeyGoldMat);
        cup.position.set(ux, 1.14, -0.10 + uz);
        const swirl = new THREE.Mesh(keepGeo(new THREE.ConeGeometry(0.06, 0.07, 7)), warmLightMat);
        swirl.position.set(ux, 1.21, -0.10 + uz);
        honeyBar.add(cup, swirl);
      });
    });
    // Bee Pollen Scones Plate + Honey Jar + Glass Bakery Case
    const sconePlate = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.24, 0.18, 0.04, 12)), powderBlueMat);
    sconePlate.position.set(0.85, 0.96, 0.16);
    honeyBar.add(sconePlate);
    [-0.08, 0.08].forEach(function (sx) {
      const scone = new THREE.Mesh(keepGeo(new THREE.SphereGeometry(0.09, 7, 6)), peachBlossomMat);
      scone.scale.set(1, 0.7, 1);
      scone.position.set(0.85 + sx, 1.03, 0.16);
      honeyBar.add(scone);
    });
    const honeyJar = new THREE.Mesh(keepGeo(new THREE.CylinderGeometry(0.08, 0.08, 0.18, 8)), honeyGoldMat);
    honeyJar.position.set(1.38, 1.03, -0.18);
    honeyBar.add(honeyJar);

    bakeryGroup.add(honeyBar);
    tagInteractable(honeyBar, 'bakery_honey_counter');
    addBox(sharedColliders, gx + 0.3, zN + 1.85, 3.6, 1.2);
    registerSpot({
      id: 'bakery_honey_counter',
      title: 'Bumblebee Glasshouse Honey Bar',
      floor: 0,
      category: 'town',
      x: gx + 0.3,
      y: y1,
      z: zN + 1.85,
      radius: 3.4,
      actions: [
        {
          id: 'buy_honey_cake',
          label: 'Order Layered Honey Cake & Earl Grey (₡22)',
          hint: '+40 Food, +16 Fun & +10 Poise',
          instant: true,
          onInstant: function (actCtx) {
            if ((actCtx.game.money || 0) < 22) return actCtx.toast('Need ₡22 Crowns.');
            actCtx.game.money -= 22;
            if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 40, fun: 16, composure: 10 });
            actCtx.toast('Wildflower Honey Cake & Earl Grey Tea served under the ivy skylights!');
          },
        },
        {
          id: 'eat_conservatory_scones',
          label: 'Dine at Glasshouse Scone Table',
          hint: '+18 Food/s & +14 Fun/s under Sunlight',
          pose: 'eat',
          anchor: {
            x: gx + 0.25, y: y1, z: bz + 1.35, yaw: Math.PI * 0.5, rigOffsetY: -0.45,
            floorY: y1, exitX: gx - 1.1, exitZ: bz + 1.35, exitYaw: 0,
          },
          rates: { hunger: 18, fun: 14, composure: 8 },
          statusText: 'Enjoying bee pollen scones & lemon tarts in Bumblebee Glasshouse...',
        },
      ],
    });

    // Garden Table inside Bumblebee Conservatory
    const conservTbl = kit.buildBoothTableSet('bakery_honey_counter');
    conservTbl.position.set(gx + 1.0, y1, bz + 1.35);
    bakeryGroup.add(conservTbl);
    tagInteractable(conservTbl, 'bakery_honey_counter');
    addBox(sharedColliders, gx + 1.0, bz + 1.35, 1.5, 1.0);

    // -----------------------------------------------------------
    // 5. WALKABLE HEIGHT, CUTAWAY & ZONE REGISTRATION
    // -----------------------------------------------------------
    walkableFloors.push({
      minX: xL, maxX: gxR, minZ: zN, maxZ: zS, y: y1,
    });
    cutaways.push({
      minX: xL - 0.6, maxX: xR + 0.6, minZ: zN - 0.6, maxZ: zS + 0.6,
      roofGrp: roof2FGrp,
      upperGrp: upper2FGrp,
    });
    cutaways.push({
      minX: gxL - 0.4, maxX: gxR + 0.6, minZ: zN - 0.6, maxZ: zS + 0.6,
      roofGrp: conservRoofGrp,
    });
    townZones.push({
      minX: xL - 0.4, maxX: xR, minZ: zN - 0.4, maxZ: zS + 1.2,
      label: 'Wallflour & Maison Brioche Patisserie',
    });
    townZones.push({
      minX: gxL, maxX: gxR + 0.4, minZ: zN - 0.4, maxZ: zS + 0.8,
      label: 'Bumblebee Glasshouse Bakery',
    });

    const bakeryDir = {
      id: 'plot_bakery_plot_visit',
      title: 'Wallflour & Maison Brioche + Bumblebee Bakery',
      floor: 0,
      category: 'town',
      x: bx,
      y: y1,
      z: bz,
      radius: 3.0,
      isDirectoryOnly: true,
      actions: [
        {
          id: 'visit_plot_bakery',
          label: 'Visit & Walk Inside Maison Brioche (1F / 2F / Glasshouse)',
          hint: 'Gingham Tea Salon, Louis XVI Vitrine, 2F Loft & Bumblebee Conservatory',
          instant: true,
          onInstant: function (actCtx) {
            actCtx.playerCtrl.teleport(bx, zS - 1.2, Math.PI, y1);
            actCtx.toast('Welcome inside Wallflour & Maison Brioche Bakery!');
          },
        },
      ],
    };
    registerSpot(bakeryDir);
    townDirectory.push(bakeryDir);

    function groundHeightAtBakery(x, z, yNow) {
      if (x >= xL && x <= xR && z >= zN && z <= zS) {
        // Walkable Staircase ramp on West strip
        if (x >= xL + 0.15 && x <= xL + 1.95 && z >= stairZ1 - 0.4 && z <= stairZ0 + 0.4) {
          const t = THREE.MathUtils.clamp((stairZ0 - z) / (stairZ0 - stairZ1), 0, 1);
          return y1 + t * (y2 - y1);
        }
        if (yNow >= 2.2) return y2;
      }
      return null;
    }

    function isOnUpperFloor(x, z, yNow) {
      return yNow >= 2.2 && x >= xL - 1.2 && x <= xR + 1.2 && z >= zN - 1.2 && z <= zS + 1.2;
    }

    function detectZone(pos) {
      if (pos.x >= xL && pos.x <= xR && pos.z >= zN && pos.z <= zS) {
        return pos.y >= 2.2
          ? 'Wallflour & Maison Brioche (2F Tasting Loft)'
          : 'Wallflour & Maison Brioche Patisserie (1F)';
      }
      if (pos.x >= gxL && pos.x <= gxR && pos.z >= zN && pos.z <= zS) {
        return 'Bumblebee Glasshouse Bakery';
      }
      return null;
    }

    return {
      groundHeightAtBakery: groundHeightAtBakery,
      isOnUpperFloor: isOnUpperFloor,
      detectZone: detectZone,
      dispose: function () {
        localMats.forEach(function (m) { m.dispose(); });
        localGeos.forEach(function (g) { g.dispose(); });
        localTex.forEach(function (t) { t.dispose(); });
      },
    };
  }

  window.CrownBakery = {
    build: buildWallflourBakery,
  };
})();
