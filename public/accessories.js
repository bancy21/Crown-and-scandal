(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  const CROWNS = [
    { id: 'none', label: 'No Crown' },
    { id: 'sapphire-sovereign', label: 'Sapphire Sovereign', desc: 'Gilded points & royal sapphire cabochon' },
    { id: 'pearl-diadem', label: 'Riviera Diadem', desc: 'Sky-blue & pearl crest tiara' },
    { id: 'imperial-filigree', label: 'Imperial Filigree', desc: 'Ornate antique gold arch tiara' },
    { id: 'diamond-halo', label: 'Diamond Halo', desc: 'Delicate platinum & crystal coronet' },
  ];

  const EARRINGS = [
    { id: 'none', label: 'None' },
    { id: 'sapphire-drops', label: 'Sapphire Teardrops' },
    { id: 'pearl-studs', label: 'Versailles Pearls' },
    { id: 'gold-chandelier', label: 'Gold Chandeliers' },
    { id: 'diamond-hoops', label: 'Diamond Drops' },
  ];

  const NECKLACES = [
    { id: 'none', label: 'None' },
    { id: 'sapphire-pendant', label: 'Sapphire Pendant' },
    { id: 'diamond-choker', label: 'Imperial Choker' },
    { id: 'layered-pearls', label: 'Pearl Strand' },
    { id: 'gold-medallion', label: 'Sunburst Locket' },
  ];

  const GLOVES = [
    { id: 'none', label: 'Bare Hands' },
    { id: 'ivory-opera', label: 'Ivory Opera Gloves' },
    { id: 'noir-satin', label: 'Noir Gala Gloves' },
    { id: 'lace-mittens', label: 'Gold-Trimmed Wrist' },
  ];

  const EYEWEAR = [
    { id: 'none', label: 'None' },
    { id: 'cat-eye-sun', label: 'Riviera Cat-Eye' },
    { id: 'gold-aviator', label: 'Yacht Club Gold' },
  ];

  const SHOES = [
    { id: 'royal-pumps', label: 'Satin Royal Pumps' },
    { id: 'ivory-slippers', label: 'Silk Ballet Slippers' },
    { id: 'strappy-heels', label: 'Gold Gala Stilettos' },
    { id: 'riviera-sandals', label: 'Riviera Wedge Sandals' },
    { id: 'satin-mules', label: 'Bedroom Silk Mules' },
    { id: 'riding-boots', label: 'Equestrian Boots' },
    { id: 'barefoot', label: 'Barefoot' },
  ];

  function findById(list, id, fallbackIdx) {
    return (
      list.find(function (item) {
        return item.id === id;
      }) || list[fallbackIdx || 0]
    );
  }

  function clampAccessories(raw) {
    const src = raw || {};
    return {
      crown: findById(CROWNS, src.crown, 1).id,
      earrings: findById(EARRINGS, src.earrings, 1).id,
      necklace: findById(NECKLACES, src.necklace, 1).id,
      gloves: findById(GLOVES, src.gloves, 0).id,
      eyewear: findById(EYEWEAR, src.eyewear, 0).id,
      shoes: findById(SHOES, src.shoes, 0).id,
    };
  }

  function createDefaultAccessories() {
    return clampAccessories({
      crown: 'sapphire-sovereign',
      earrings: 'sapphire-drops',
      necklace: 'sapphire-pendant',
      gloves: 'none',
      eyewear: 'none',
      shoes: 'royal-pumps',
    });
  }

  function drawAccessories(ctx, rig, accConfig) {
    const acc = clampAccessories(accConfig);
    const j = rig.joints;
    const f = rig.fit;
    const hr = rig.headR;
    const hc = rig.joints.headCenter;
    const cx = rig.cx;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Shoes (anchored neatly to ankleL / ankleR)
    if (acc.shoes !== 'none' && acc.shoes !== 'barefoot') {
      [-1, 1].forEach(function (side) {
        const ank = side < 0 ? j.ankleL : j.ankleR;
        const w = f.armThickness * 0.72;
        if (acc.shoes === 'riding-boots') {
          const knee = side < 0 ? j.kneeL : j.kneeR;
          const bootTopY = knee.y + (ank.y - knee.y) * 0.25;
          ctx.fillStyle = '#2b1c17';
          ctx.beginPath();
          ctx.moveTo(knee.x - f.armThickness * 1.04, bootTopY);
          ctx.lineTo(ank.x - w, ank.y + f.armThickness * 0.9);
          ctx.quadraticCurveTo(ank.x, ank.y + f.armThickness * 1.4, ank.x + w, ank.y + f.armThickness * 0.9);
          ctx.lineTo(knee.x + f.armThickness * 1.04, bootTopY);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#d4af55';
          ctx.lineWidth = Math.max(1.2, hr * 0.04);
          ctx.beginPath();
          ctx.moveTo(knee.x - f.armThickness * 1.0, bootTopY);
          ctx.lineTo(knee.x + f.armThickness * 1.0, bootTopY);
          ctx.stroke();
        } else if (acc.shoes === 'strappy-heels' || acc.shoes === 'riviera-sandals') {
          const strapCol = acc.shoes === 'strappy-heels' ? '#d4af55' : '#e6c99b';
          const soleCol = acc.shoes === 'strappy-heels' ? '#9e7424' : '#b88f5c';
          ctx.fillStyle = soleCol;
          ctx.beginPath();
          ctx.ellipse(ank.x, ank.y + f.armThickness * 0.95, w * 0.92, f.armThickness * 0.48, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = strapCol;
          ctx.lineWidth = Math.max(1.4, hr * 0.044);
          ctx.beginPath();
          ctx.moveTo(ank.x - w * 0.85, ank.y + f.armThickness * 0.15);
          ctx.lineTo(ank.x + w * 0.85, ank.y + f.armThickness * 0.15);
          ctx.moveTo(ank.x - w * 0.8, ank.y + f.armThickness * 0.68);
          ctx.quadraticCurveTo(ank.x, ank.y + f.armThickness * 0.52, ank.x + w * 0.8, ank.y + f.armThickness * 0.68);
          ctx.stroke();
        } else if (acc.shoes === 'satin-mules') {
          ctx.fillStyle = '#e8b6c2';
          ctx.beginPath();
          ctx.ellipse(ank.x, ank.y + f.armThickness * 0.85, w * 1.04, f.armThickness * 0.62, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff5f7';
          ctx.beginPath();
          ctx.ellipse(ank.x, ank.y + f.armThickness * 0.58, w * 0.82, f.armThickness * 0.34, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = acc.shoes === 'ivory-slippers' ? '#f4ece2' : '#253966';
          ctx.beginPath();
          ctx.moveTo(ank.x - w * 0.84, ank.y + f.armThickness * 0.35);
          ctx.quadraticCurveTo(ank.x, ank.y + f.armThickness * 0.65, ank.x + w * 0.84, ank.y + f.armThickness * 0.35);
          ctx.lineTo(ank.x + w * 0.98, ank.y + f.armThickness * 0.95);
          ctx.quadraticCurveTo(ank.x, ank.y + f.armThickness * 1.48, ank.x - w * 0.98, ank.y + f.armThickness * 0.95);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#c89e47';
          ctx.lineWidth = Math.max(0.9, hr * 0.028);
          ctx.stroke();
        }
      });
    }

    // 2. Gloves (opera or wrist length hugging elbow->wrist->hand)
    if (acc.gloves !== 'none') {
      const gloveColor = acc.gloves === 'noir-satin' ? '#201922' : '#f8f2ea';
      const gloveBorder = acc.gloves === 'noir-satin' ? '#3d3042' : '#d8c5b2';
      const startFromElbow = acc.gloves === 'ivory-opera' || acc.gloves === 'noir-satin';

      [-1, 1].forEach(function (side) {
        const elb = side < 0 ? j.elbowL : j.elbowR;
        const wr = side < 0 ? j.wristL : j.wristR;
        const topX = startFromElbow ? elb.x : elb.x + (wr.x - elb.x) * 0.72;
        const topY = startFromElbow ? elb.y + hr * 0.06 : elb.y + (wr.y - elb.y) * 0.72;
        const topHalf = startFromElbow ? f.armThickness * 0.82 : f.armThickness * 0.64;
        const wrHalf = f.armThickness * 0.56;

        ctx.fillStyle = gloveColor;
        ctx.beginPath();
        ctx.moveTo(topX + side * topHalf, topY);
        ctx.lineTo(wr.x + side * wrHalf, wr.y);
        ctx.quadraticCurveTo(wr.x + side * wrHalf * 0.7, wr.y + f.armThickness * 1.95, wr.x - side * wrHalf * 0.14, wr.y + f.armThickness * 2.12);
        ctx.quadraticCurveTo(wr.x - side * wrHalf * 0.9, wr.y + f.armThickness * 1.32, wr.x - side * wrHalf, wr.y);
        ctx.lineTo(topX - side * topHalf, topY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = gloveBorder;
        ctx.lineWidth = Math.max(0.9, hr * 0.028);
        ctx.stroke();

        if (acc.gloves === 'lace-mittens') {
          ctx.strokeStyle = '#d4af55';
          ctx.lineWidth = Math.max(1.2, hr * 0.04);
          ctx.beginPath();
          ctx.moveTo(topX - side * topHalf, topY);
          ctx.lineTo(topX + side * topHalf, topY);
          ctx.stroke();
        }
      });
    }

    // 3. Necklaces (anchored cleanly around neckBase & clavicleY)
    if (acc.necklace !== 'none') {
      const neckW = f.neckHalf * 1.06;
      const topNeckY = j.neck.y + hr * 0.12;
      const dropY = j.clavicleY + hr * 0.28;

      if (acc.necklace === 'diamond-choker') {
        // Wide crystal filigree collar choker (like Screenshot 4)
        const chokerH = hr * 0.24;
        ctx.fillStyle = '#f2eef7';
        ctx.beginPath();
        ctx.moveTo(cx - neckW, topNeckY);
        ctx.quadraticCurveTo(cx, topNeckY + hr * 0.12, cx + neckW, topNeckY);
        ctx.lineTo(cx + neckW * 1.08, topNeckY + chokerH);
        ctx.quadraticCurveTo(cx, topNeckY + chokerH + hr * 0.14, cx - neckW * 1.08, topNeckY + chokerH);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#c9b896';
        ctx.lineWidth = Math.max(0.9, hr * 0.028);
        ctx.stroke();
        for (let d = -2; d <= 2; d++) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + d * neckW * 0.36, topNeckY + chokerH * 0.56, Math.max(1.2, hr * 0.036), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (acc.necklace === 'layered-pearls') {
        [0, hr * 0.16].forEach(function (off, idx) {
          const count = idx === 0 ? 7 : 9;
          for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const ang = (t - 0.5) * Math.PI * 0.85;
            const px = cx + Math.sin(ang) * f.neckHalf * (1.28 + idx * 0.22);
            const py = j.neckBase.y + Math.cos(ang) * hr * (0.28 + idx * 0.12) + off;
            ctx.fillStyle = '#fff9f0';
            ctx.beginPath();
            ctx.arc(px, py, Math.max(1.5, hr * 0.052), 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(184, 155, 118, 0.55)';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        });
      } else {
        // Delicate gold chain + Sapphire Pendant or Sunburst Medallion (like Screenshot 1)
        ctx.strokeStyle = '#d4af55';
        ctx.lineWidth = Math.max(1.1, hr * 0.032);
        ctx.beginPath();
        ctx.moveTo(cx - neckW * 1.02, j.neckBase.y - hr * 0.02);
        ctx.quadraticCurveTo(cx, dropY + hr * 0.12, cx + neckW * 1.02, j.neckBase.y - hr * 0.02);
        ctx.stroke();

        const py = dropY + hr * 0.16;
        ctx.fillStyle = '#d4af55';
        ctx.beginPath();
        ctx.ellipse(cx, py, hr * 0.11, hr * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = acc.necklace === 'sapphire-pendant' ? '#2c61b0' : '#f7dc88';
        ctx.beginPath();
        ctx.ellipse(cx, py, hr * 0.068, hr * 0.095, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(cx - hr * 0.02, py - hr * 0.03, Math.max(0.8, hr * 0.022), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. Earrings (hanging neatly from earlobes)
    if (acc.earrings !== 'none') {
      [-1, 1].forEach(function (side) {
        const ex = hc.x + side * hr * 0.99;
        const ey = hc.y + hr * 0.28;

        ctx.fillStyle = '#d4af55';
        ctx.beginPath();
        ctx.arc(ex, ey, Math.max(1.3, hr * 0.044), 0, Math.PI * 2);
        ctx.fill();

        if (acc.earrings === 'sapphire-drops' || acc.earrings === 'diamond-drops' || acc.earrings === 'diamond-hoops') {
          const dropY = ey + hr * 0.17;
          ctx.fillStyle = '#d4af55';
          ctx.beginPath();
          ctx.ellipse(ex, dropY, hr * 0.065, hr * 0.11, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = acc.earrings === 'sapphire-drops' ? '#2e63b4' : '#f2f7ff';
          ctx.beginPath();
          ctx.ellipse(ex, dropY, hr * 0.042, hr * 0.075, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (acc.earrings === 'pearl-studs') {
          ctx.fillStyle = '#fffaf2';
          ctx.beginPath();
          ctx.arc(ex, ey, Math.max(1.8, hr * 0.062), 0, Math.PI * 2);
          ctx.fill();
        } else if (acc.earrings === 'gold-chandelier') {
          ctx.strokeStyle = '#d4af55';
          ctx.lineWidth = Math.max(1.1, hr * 0.032);
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - hr * 0.06, ey + hr * 0.22);
          ctx.lineTo(ex + hr * 0.06, ey + hr * 0.22);
          ctx.closePath();
          ctx.stroke();
        }
      });
    }

    // 5. Eyewear (if selected)
    if (acc.eyewear !== 'none') {
      const eyeY = hc.y - hr * 0.06;
      const eyeDx = hr * 0.39;
      ctx.strokeStyle = acc.eyewear === 'gold-aviator' ? '#cfa44c' : '#241a1e';
      ctx.lineWidth = Math.max(1.4, hr * 0.042);

      // Bridge
      ctx.beginPath();
      ctx.moveTo(hc.x - eyeDx * 0.42, eyeY - hr * 0.04);
      ctx.quadraticCurveTo(hc.x, eyeY - hr * 0.12, hc.x + eyeDx * 0.42, eyeY - hr * 0.04);
      ctx.stroke();

      [-1, 1].forEach(function (side) {
        const lx = hc.x + side * eyeDx;
        ctx.fillStyle = acc.eyewear === 'gold-aviator' ? 'rgba(62, 42, 26, 0.56)' : 'rgba(26, 18, 24, 0.72)';
        ctx.beginPath();
        ctx.ellipse(lx, eyeY, hr * 0.31, hr * 0.2, side * -0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });
    }

    // 6. Royal Crowns & Tiaras (hugging upper head curvature cleanly)
    if (acc.crown !== 'none') {
      const baseY = hc.y - hr * 0.92;
      const halfW = f.crownWidth * 0.44;
      const goldGrad = ctx.createLinearGradient(hc.x - halfW, baseY - hr * 0.55, hc.x + halfW, baseY);
      goldGrad.addColorStop(0, '#a67725');
      goldGrad.addColorStop(0.5, '#f2d37c');
      goldGrad.addColorStop(1, '#a67725');

      if (acc.crown === 'sapphire-sovereign') {
        // Ornate gold spiked royal crown with large center sapphire & side gems (Screenshot 1)
        ctx.fillStyle = goldGrad;
        ctx.beginPath();
        ctx.moveTo(hc.x - halfW, baseY + hr * 0.08);
        ctx.lineTo(hc.x - halfW * 0.85, baseY - hr * 0.34);
        ctx.lineTo(hc.x - halfW * 0.52, baseY - hr * 0.12);
        ctx.lineTo(hc.x - halfW * 0.3, baseY - hr * 0.48);
        ctx.lineTo(hc.x - halfW * 0.14, baseY - hr * 0.22);
        ctx.lineTo(hc.x, baseY - hr * 0.64);
        ctx.lineTo(hc.x + halfW * 0.14, baseY - hr * 0.22);
        ctx.lineTo(hc.x + halfW * 0.3, baseY - hr * 0.48);
        ctx.lineTo(hc.x + halfW * 0.52, baseY - hr * 0.12);
        ctx.lineTo(hc.x + halfW * 0.85, baseY - hr * 0.34);
        ctx.lineTo(hc.x + halfW, baseY + hr * 0.08);
        ctx.quadraticCurveTo(hc.x, baseY - hr * 0.06, hc.x - halfW, baseY + hr * 0.08);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#7c5514';
        ctx.lineWidth = Math.max(1.0, hr * 0.032);
        ctx.stroke();

        // Center sapphire cabochon + side pearls
        ctx.fillStyle = '#255bb5';
        ctx.beginPath();
        ctx.ellipse(hc.x, baseY - hr * 0.26, hr * 0.095, hr * 0.13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.82)';
        ctx.beginPath();
        ctx.arc(hc.x - hr * 0.025, baseY - hr * 0.3, hr * 0.025, 0, Math.PI * 2);
        ctx.fill();
      } else if (acc.crown === 'pearl-diadem') {
        // Sky-blue silk & crystal diadem crest (Screenshot 3)
        ctx.fillStyle = '#73b3d6';
        ctx.beginPath();
        ctx.ellipse(hc.x, baseY + hr * 0.05, halfW * 0.85, hr * 0.18, 0, Math.PI, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d7effc';
        ctx.beginPath();
        ctx.moveTo(hc.x - halfW * 0.55, baseY - hr * 0.06);
        ctx.lineTo(hc.x - halfW * 0.25, baseY - hr * 0.36);
        ctx.lineTo(hc.x, baseY - hr * 0.52);
        ctx.lineTo(hc.x + halfW * 0.25, baseY - hr * 0.36);
        ctx.lineTo(hc.x + halfW * 0.55, baseY - hr * 0.06);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#5f87a8';
        ctx.lineWidth = Math.max(1.0, hr * 0.03);
        ctx.stroke();
      } else if (acc.crown === 'imperial-filigree') {
        // Sculpted antique gold kokoshnik-arch filigree tiara (Screenshot 4)
        ctx.fillStyle = goldGrad;
        ctx.beginPath();
        ctx.moveTo(hc.x - halfW * 0.9, baseY + hr * 0.06);
        ctx.quadraticCurveTo(hc.x - halfW * 0.45, baseY - hr * 0.48, hc.x, baseY - hr * 0.56);
        ctx.quadraticCurveTo(hc.x + halfW * 0.45, baseY - hr * 0.48, hc.x + halfW * 0.9, baseY + hr * 0.06);
        ctx.quadraticCurveTo(hc.x, baseY - hr * 0.1, hc.x - halfW * 0.9, baseY + hr * 0.06);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#785012';
        ctx.lineWidth = Math.max(1.1, hr * 0.032);
        ctx.stroke();
      } else if (acc.crown === 'diamond-halo') {
        ctx.strokeStyle = '#e7edf7';
        ctx.lineWidth = Math.max(2.0, hr * 0.065);
        ctx.beginPath();
        ctx.arc(hc.x, baseY + hr * 0.25, halfW * 0.84, -Math.PI * 0.85, -Math.PI * 0.15);
        ctx.stroke();
        for (let i = -3; i <= 3; i++) {
          const ang = -Math.PI * 0.5 + i * 0.22;
          const gx = hc.x + Math.cos(ang) * halfW * 0.88;
          const gy = baseY + hr * 0.22 + Math.sin(ang) * hr * 0.52;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(gx, gy, Math.max(1.6, hr * (i === 0 ? 0.068 : 0.044)), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  }

  function renderSelector(container, draft, onChange) {
    draft.accessories = clampAccessories(draft.accessories);

    function addGroup(label, list, key, cols) {
      const lbl = document.createElement('span');
      lbl.className = 'crown-label';
      lbl.textContent = label;
      container.appendChild(lbl);

      const grid = document.createElement('div');
      grid.className = cols || 'cas-grid';
      list.forEach(function (item) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cas-choice' + (item.id === draft.accessories[key] ? ' active' : '');
        btn.innerHTML =
          '<span>' +
          item.label +
          '</span>' +
          (item.desc ? '<span class="cas-choice-sub">' + item.desc + '</span>' : '');
        btn.addEventListener('click', function () {
          draft.accessories[key] = item.id;
          onChange();
        });
        grid.appendChild(btn);
      });
      container.appendChild(grid);
    }

    addGroup('Crowns & Tiaras', CROWNS, 'crown', 'cas-grid');
    addGroup('Earrings', EARRINGS, 'earrings', 'cas-grid');
    addGroup('Necklaces', NECKLACES, 'necklace', 'cas-grid');
    addGroup('Opera Gloves', GLOVES, 'gloves', 'cas-grid');
    addGroup('Eyewear', EYEWEAR, 'eyewear', 'cas-grid-3');
    addGroup('Footwear', SHOES, 'shoes', 'cas-grid');
  }

  window.CrownAccessories = {
    CROWNS: CROWNS,
    EARRINGS: EARRINGS,
    NECKLACES: NECKLACES,
    GLOVES: GLOVES,
    EYEWEAR: EYEWEAR,
    SHOES: SHOES,
    createDefaultAccessories: createDefaultAccessories,
    clampAccessories: clampAccessories,
    drawAccessories: drawAccessories,
    renderSelector: renderSelector,
  };
})();
