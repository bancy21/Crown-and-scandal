(function () {
  'use strict';

  function damp(cur, target, speed, dt) {
    return cur + (target - cur) * (1 - Math.exp(-speed * dt));
  }

  function setHeldProp(actor, activeKey) {
    if (!actor || !actor.heldProps) return;
    const keys = Object.keys(actor.heldProps);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (actor.heldProps[k]) {
        if (activeKey === 'paint' && (k === 'brush' || k === 'palette')) {
          actor.heldProps[k].visible = true;
        } else {
          actor.heldProps[k].visible = (k === activeKey);
        }
      }
    }
  }

  function applyLocomotion(actor, dt, elapsedSec, walkPhase, moveWeight, baseLeg) {
    if (!actor) return;
    const t = elapsedSec || 0;
    const s = 12;

    setHeldProp(actor, null);

    if (actor.contactShadow) {
      actor.contactShadow.visible = true;
    }

    actor.rig.position.x = damp(actor.rig.position.x, 0, s, dt);
    actor.rig.position.y = damp(actor.rig.position.y, 0, s, dt);
    actor.rig.position.z = damp(actor.rig.position.z, 0, s, dt);
    actor.rig.rotation.x = damp(actor.rig.rotation.x, 0, s, dt);
    actor.rig.rotation.y = damp(actor.rig.rotation.y, 0, s, dt);
    actor.rig.rotation.z = damp(actor.rig.rotation.z, 0, s, dt);

    const swing = Math.sin(walkPhase) * 0.5 * moveWeight;
    const kneeBendL = Math.max(0, Math.sin(walkPhase + 0.45)) * 0.48 * moveWeight;
    const kneeBendR = Math.max(0, Math.sin(-walkPhase + 0.45)) * 0.48 * moveWeight;

    actor.leftLeg.rotation.x = damp(actor.leftLeg.rotation.x, swing, 16, dt);
    actor.leftLeg.rotation.z = damp(actor.leftLeg.rotation.z, 0, s, dt);
    actor.rightLeg.rotation.x = damp(actor.rightLeg.rotation.x, -swing, 16, dt);
    actor.rightLeg.rotation.z = damp(actor.rightLeg.rotation.z, 0, s, dt);

    if (actor.leftKnee) actor.leftKnee.rotation.x = damp(actor.leftKnee.rotation.x, kneeBendL, 16, dt);
    if (actor.rightKnee) actor.rightKnee.rotation.x = damp(actor.rightKnee.rotation.x, kneeBendR, 16, dt);

    actor.leftArm.rotation.x = damp(actor.leftArm.rotation.x, -swing * 0.6, 16, dt);
    actor.leftArm.rotation.z = damp(actor.leftArm.rotation.z, -0.05 * (1 - moveWeight), s, dt);
    actor.rightArm.rotation.x = damp(actor.rightArm.rotation.x, swing * 0.6, 16, dt);
    actor.rightArm.rotation.z = damp(actor.rightArm.rotation.z, 0.05 * (1 - moveWeight), s, dt);

    const targetBodyY =
      baseLeg +
      Math.abs(Math.sin(walkPhase * 2)) * 0.02 * moveWeight +
      Math.sin(t * 2.1) * 0.008 * (1 - moveWeight);
    actor.bodyGroup.position.y = damp(actor.bodyGroup.position.y, targetBodyY, 16, dt);
    actor.bodyGroup.rotation.x = damp(actor.bodyGroup.rotation.x, Math.sin(t * 1.9) * 0.015 * (1 - moveWeight), s, dt);
    actor.bodyGroup.rotation.z = damp(actor.bodyGroup.rotation.z, Math.sin(walkPhase) * 0.028 * moveWeight, 14, dt);

    actor.headGroup.rotation.x = damp(actor.headGroup.rotation.x, Math.sin(t * 1.1) * 0.025 * (1 - moveWeight), s, dt);
    actor.headGroup.rotation.y = damp(actor.headGroup.rotation.y, Math.sin(t * 0.85) * 0.08 * (1 - moveWeight), 10, dt);

    if (actor.skirtMesh) {
      actor.skirtMesh.rotation.x = damp(actor.skirtMesh.rotation.x, 0, 12, dt);
      actor.skirtMesh.rotation.z = damp(actor.skirtMesh.rotation.z, Math.sin(walkPhase) * 0.032 * moveWeight, 14, dt);
      actor.skirtMesh.scale.x = damp(actor.skirtMesh.scale.x, 1, 12, dt);
      actor.skirtMesh.scale.z = damp(actor.skirtMesh.scale.z, 1, 12, dt);
    }
  }

  function applySwimLocomotion(actor, dt, elapsedSec, swimPhase, moveWeight, baseLeg) {
    if (!actor) return;
    const t = elapsedSec || 0;
    const s = 10;
    setHeldProp(actor, null);
    if (actor.contactShadow) {
      actor.contactShadow.visible = false;
    }

    const mv = Math.min(1, Math.max(0, moveWeight || 0));
    const rigRotX = -Math.PI * 0.43 * mv;
    const rigY = (-baseLeg * 0.44 + Math.sin(t * 2.4) * 0.035) * (1 - mv) + (0.14 + Math.sin(swimPhase) * 0.04) * mv;
    const tread = t * 3.4;

    actor.rig.position.x = damp(actor.rig.position.x, 0, s, dt);
    actor.rig.position.y = damp(actor.rig.position.y, rigY, s, dt);
    actor.rig.position.z = damp(actor.rig.position.z, 0, s, dt);
    actor.rig.rotation.x = damp(actor.rig.rotation.x, rigRotX, s, dt);
    actor.rig.rotation.y = damp(actor.rig.rotation.y, 0, s, dt);
    actor.rig.rotation.z = damp(actor.rig.rotation.z, 0, s, dt);

    const kick = mv > 0.1 ? Math.sin(swimPhase * 2.0) * 0.34 : Math.sin(tread) * 0.28;
    actor.leftLeg.rotation.x = damp(actor.leftLeg.rotation.x, kick, 14, dt);
    actor.leftLeg.rotation.z = damp(actor.leftLeg.rotation.z, -0.05, s, dt);
    actor.rightLeg.rotation.x = damp(actor.rightLeg.rotation.x, -kick, 14, dt);
    actor.rightLeg.rotation.z = damp(actor.rightLeg.rotation.z, 0.05, s, dt);

    if (actor.leftKnee) actor.leftKnee.rotation.x = damp(actor.leftKnee.rotation.x, 0.25, 12, dt);
    if (actor.rightKnee) actor.rightKnee.rotation.x = damp(actor.rightKnee.rotation.x, 0.25, 12, dt);

    const armLX = mv > 0.1 ? -2.3 + Math.cos(swimPhase) * 0.55 : -1.05 + Math.sin(tread) * 0.18;
    const armRX = mv > 0.1 ? -2.3 + Math.cos(swimPhase + Math.PI) * 0.55 : -1.05 - Math.sin(tread) * 0.18;
    const armSpread = mv > 0.1 ? 0.22 + Math.abs(Math.sin(swimPhase)) * 0.42 : 0.45 + Math.cos(tread) * 0.16;

    actor.leftArm.rotation.x = damp(actor.leftArm.rotation.x, armLX, 12, dt);
    actor.leftArm.rotation.z = damp(actor.leftArm.rotation.z, -armSpread, 12, dt);
    actor.rightArm.rotation.x = damp(actor.rightArm.rotation.x, armRX, 12, dt);
    actor.rightArm.rotation.z = damp(actor.rightArm.rotation.z, armSpread, 12, dt);

    actor.bodyGroup.position.y = damp(actor.bodyGroup.position.y, baseLeg, 12, dt);
    actor.bodyGroup.rotation.x = damp(actor.bodyGroup.rotation.x, 0, s, dt);
    actor.bodyGroup.rotation.z = damp(actor.bodyGroup.rotation.z, Math.sin(swimPhase) * 0.08 * mv, s, dt);

    actor.headGroup.rotation.x = damp(actor.headGroup.rotation.x, 0.62 * mv - 0.05 * (1 - mv), s, dt);
    actor.headGroup.rotation.y = damp(actor.headGroup.rotation.y, Math.sin(t * 0.9) * 0.12 * (1 - mv), s, dt);

    if (actor.skirtMesh) {
      actor.skirtMesh.rotation.x = damp(actor.skirtMesh.rotation.x, 0.08, s, dt);
      actor.skirtMesh.rotation.z = damp(actor.skirtMesh.rotation.z, 0, s, dt);
      actor.skirtMesh.scale.x = damp(actor.skirtMesh.scale.x, 0.86, s, dt);
      actor.skirtMesh.scale.z = damp(actor.skirtMesh.scale.z, 0.52, s, dt);
    }
  }

  function applyPose(actor, poseName, dt, elapsedSec, spec) {
    if (!actor) return;
    const t = elapsedSec || 0;
    const baseLeg = actor.baseLeg || 0.94;
    const cfg = spec || {};

    let activeProp = null;
    if (poseName === 'read' || poseName === 'sit_read') activeProp = 'book';
    else if (poseName === 'eat') activeProp = 'teacup';
    else if (poseName === 'paint') activeProp = 'paint';
    else if (poseName === 'cook') activeProp = 'ladle';
    setHeldProp(actor, activeProp);

    let rigX = 0;
    let rigY = 0;
    let rigZ = 0;
    let rigRotX = 0;
    let rigRotY = 0;
    let rigRotZ = 0;

    let hipLX = 0;
    let hipRX = 0;
    let hipLZ = 0;
    let hipRZ = 0;
    let kneeLX = 0;
    let kneeRX = 0;

    let armLX = 0;
    let armRX = 0;
    let armLZ = -0.06;
    let armRZ = 0.06;

    let bodyY = baseLeg;
    let bodyRotX = 0;
    let bodyRotZ = 0;
    let headRotX = 0;
    let headRotY = 0;
    let skirtRotX = 0;
    let skirtRotZ = 0;
    let skirtScaleX = 1.0;
    let skirtScaleZ = 1.0;

    if (poseName === 'sleep' || poseName === 'nap' || poseName === 'daydream') {
      if (actor.contactShadow) actor.contactShadow.visible = false;
      rigRotX = -Math.PI * 0.5;
      rigY = typeof cfg.rigOffsetY === 'number' ? cfg.rigOffsetY : 0.09;
      const breath = Math.sin(t * (poseName === 'daydream' ? 2.2 : 1.35));
      hipLX = -0.04 + breath * 0.01;
      hipRX = -0.08 - breath * 0.01;
      kneeLX = 0.06;
      kneeRX = 0.1;
      if (poseName === 'daydream') {
        rigRotX = -Math.PI * 0.36;
        rigY = typeof cfg.rigOffsetY === 'number' ? cfg.rigOffsetY : 0.34;
        headRotX = 0.22;
        armLX = -2.2;
        armRX = -2.1;
        armLZ = -0.35;
        armRZ = 0.35;
        skirtScaleX = 0.88;
        skirtScaleZ = 0.52;
        skirtRotX = 0.04;
      } else {
        // Arms relaxed gently along waist/collar cuff inside hollow blanket dome; head propped on pillow
        armLX = -0.26 + breath * 0.018;
        armRX = -0.28 - breath * 0.018;
        armLZ = 0.14;
        armRZ = -0.14;
        headRotX = 0.14;
        headRotY = poseName === 'sleep' ? 0.14 : 0.06;
        skirtScaleX = 0.68;
        skirtScaleZ = 0.22;
        skirtRotX = 0.02;
      }
      bodyRotZ = breath * 0.015;
    } else if (poseName === 'bath') {
      if (actor.contactShadow) actor.contactShadow.visible = false;
      rigY = typeof cfg.rigOffsetY === 'number' ? cfg.rigOffsetY : -baseLeg * 0.56;
      hipLX = -1.32;
      hipRX = -1.28;
      hipLZ = -0.06;
      hipRZ = 0.06;
      kneeLX = 1.05;
      kneeRX = 1.02;
      bodyRotX = -0.24;
      const sway = Math.sin(t * 1.6);
      armLX = -0.7 + sway * 0.08;
      armRX = -0.75 - sway * 0.08;
      armLZ = -0.36;
      armRZ = 0.36;
      headRotX = -0.08;
      headRotY = Math.sin(t * 0.7) * 0.18;
      skirtRotX = -0.9;
      skirtScaleX = 0.85;
      skirtScaleZ = 0.65;
    } else if (poseName === 'shower') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const scrub = Math.sin(t * 5.2);
      hipLX = -0.05;
      hipRX = 0.05;
      kneeLX = 0.08;
      kneeRX = 0.08;
      armLX = -1.85 + scrub * 0.22;
      armRX = -1.85 - scrub * 0.22;
      armLZ = -0.32;
      armRZ = 0.32;
      headRotX = -0.18 + Math.sin(t * 2.5) * 0.06;
      bodyRotZ = Math.sin(t * 2.4) * 0.03;
    } else if (
      poseName === 'sit' ||
      poseName === 'eat' ||
      poseName === 'toilet' ||
      poseName === 'sofa' ||
      poseName === 'piano' ||
      poseName === 'chess' ||
      poseName === 'powder' ||
      poseName === 'sit_read'
    ) {
      if (actor.contactShadow) actor.contactShadow.visible = false;
      rigY = typeof cfg.rigOffsetY === 'number' ? cfg.rigOffsetY : -baseLeg * 0.52;
      hipLX = -1.48;
      hipRX = -1.48;
      hipLZ = poseName === 'sofa' ? -0.08 : -0.03;
      hipRZ = poseName === 'sofa' ? 0.08 : 0.03;
      kneeLX = poseName === 'sofa' ? 1.25 : 1.42;
      kneeRX = poseName === 'sofa' ? 1.25 : 1.42;
      skirtRotX = -1.16;
      skirtScaleX = 0.92;
      skirtScaleZ = 0.72;
      if (poseName === 'sit_read') {
        const glance = Math.sin(t * 1.4) * 0.04;
        armLX = -0.84 + glance;
        armRX = -0.84 - glance;
        armLZ = 0.16;
        armRZ = -0.16;
        bodyRotX = 0.04;
        headRotX = 0.24;
        headRotY = Math.sin(t * 0.75) * 0.08;
      } else if (poseName === 'eat') {
        const sip = Math.max(0, Math.sin(t * 2.4));
        armLX = -0.68;
        armLZ = -0.1;
        armRX = -0.88 - sip * 0.72;
        armRZ = -0.08;
        bodyRotX = 0.06;
        headRotX = 0.1 - sip * 0.08;
      } else if (poseName === 'piano') {
        const lPlay = Math.sin(t * 6.5) * 0.18;
        const rPlay = Math.cos(t * 7.2) * 0.18;
        armLX = -1.08 + lPlay;
        armRX = -1.08 + rPlay;
        armLZ = -0.14;
        armRZ = 0.14;
        bodyRotX = 0.08;
        bodyRotZ = Math.sin(t * 1.8) * 0.04;
        headRotX = 0.14;
        headRotY = Math.sin(t * 1.4) * 0.12;
      } else if (poseName === 'chess') {
        const reach = Math.max(0, Math.sin(t * 1.9));
        armLX = -0.45;
        armLZ = -0.16;
        armRX = -0.65 - reach * 0.65;
        armRZ = 0.08;
        bodyRotX = 0.12 + reach * 0.08;
        headRotX = 0.24;
        headRotY = Math.sin(t * 0.85) * 0.14;
      } else if (poseName === 'powder') {
        const dab = Math.sin(t * 4.2) * 0.14;
        armLX = -1.25;
        armLZ = -0.18;
        armRX = -1.78 + dab;
        armRZ = 0.22;
        headRotX = -0.05;
        headRotY = Math.sin(t * 1.3) * 0.18;
      } else if (poseName === 'toilet') {
        armLX = -0.45;
        armRX = -0.45;
        armLZ = -0.1;
        armRZ = 0.1;
        bodyRotX = 0.05;
        headRotY = Math.sin(t * 0.6) * 0.1;
      } else if (poseName === 'sofa') {
        armLX = -0.52;
        armRX = -0.52;
        armLZ = -0.32;
        armRZ = 0.32;
        bodyRotX = -0.12;
        headRotY = Math.sin(t * 0.7) * 0.16;
      } else {
        armLX = -0.58;
        armRX = -0.58;
        armLZ = -0.18;
        armRZ = 0.18;
        bodyRotX = -0.04;
        headRotY = Math.sin(t * 0.65) * 0.14;
      }
    } else if (poseName === 'paint') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const stroke = Math.sin(t * 3.8);
      armLX = -0.82;
      armLZ = -0.18;
      armRX = -1.42 + stroke * 0.24;
      armRZ = 0.12 + Math.cos(t * 3.2) * 0.1;
      bodyRotX = 0.04;
      headRotX = -0.04;
      headRotY = stroke * 0.08;
    } else if (poseName === 'wash') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const rub = Math.sin(t * 6.0);
      bodyRotX = 0.14;
      armLX = -1.05 + rub * 0.12;
      armRX = -1.05 - rub * 0.12;
      armLZ = -0.04;
      armRZ = 0.04;
      headRotX = 0.22;
    } else if (poseName === 'cook') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const stir = Math.sin(t * 4.4);
      bodyRotX = 0.08;
      armLX = -0.62;
      armLZ = -0.16;
      armRX = -1.08 + stir * 0.18;
      armRZ = 0.08 + Math.cos(t * 4.4) * 0.08;
      headRotX = 0.18;
      headRotY = Math.sin(t * 1.2) * 0.08;
    } else if (poseName === 'read') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const sway = Math.sin(t * 1.5) * 0.035;
      armLX = -0.85 + sway;
      armRX = -0.85 - sway;
      armLZ = 0.16;
      armRZ = -0.16;
      headRotX = 0.22;
      headRotY = Math.sin(t * 0.8) * 0.08;
    } else if (poseName === 'warm') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const sway = Math.sin(t * 2.0) * 0.05;
      armLX = -0.92 + sway;
      armRX = -0.92 - sway;
      armLZ = -0.16;
      armRZ = 0.16;
      headRotX = -0.04;
      headRotY = Math.sin(t * 0.8) * 0.1;
    } else if (poseName === 'dance') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const waltz = t * 2.8;
      rigRotY = t * 1.15;
      rigY = Math.abs(Math.sin(waltz)) * 0.06;
      hipLX = Math.sin(waltz) * 0.34;
      hipRX = -Math.sin(waltz) * 0.34;
      kneeLX = Math.max(0, Math.cos(waltz)) * 0.35;
      kneeRX = Math.max(0, -Math.cos(waltz)) * 0.35;
      armLX = -1.1 + Math.sin(waltz) * 0.12;
      armRX = -1.1 - Math.sin(waltz) * 0.12;
      armLZ = -0.55;
      armRZ = 0.55;
      bodyRotZ = Math.sin(waltz * 0.5) * 0.06;
      headRotY = Math.sin(waltz * 0.5) * 0.12;
      skirtRotZ = Math.sin(waltz) * 0.12;
    } else if (poseName === 'curtsy') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const dip = 0.5 + 0.5 * Math.sin(t * 2.1);
      rigY = -0.16 * dip;
      hipLX = -0.42 * dip;
      kneeLX = 0.72 * dip;
      hipRX = 0.24 * dip;
      kneeRX = 0.45 * dip;
      armLX = -0.28;
      armRX = -0.28;
      armLZ = -0.52 * dip - 0.12;
      armRZ = 0.52 * dip + 0.12;
      bodyRotX = 0.18 * dip;
      headRotX = 0.16 * dip;
      skirtRotX = -0.18 * dip;
    } else if (poseName === 'wish') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const toss = Math.sin(t * 3.0);
      armRX = -1.35 + toss * 0.55;
      armRZ = 0.25;
      armLX = -0.35;
      headRotX = -0.1;
      headRotY = Math.sin(t * 1.1) * 0.1;
    } else if (poseName === 'swim') {
      if (actor.contactShadow) actor.contactShadow.visible = false;
      const stroke = t * 3.4;
      rigRotX = -Math.PI * 0.44;
      rigY = (typeof cfg.rigOffsetY === 'number' ? cfg.rigOffsetY : 0.18) + Math.sin(stroke) * 0.05;
      hipLX = Math.sin(stroke * 2) * 0.28;
      hipRX = -Math.sin(stroke * 2) * 0.28;
      kneeLX = 0.22;
      kneeRX = 0.22;
      armLX = -2.35 + Math.cos(stroke) * 0.45;
      armRX = -2.35 + Math.cos(stroke + Math.PI) * 0.45;
      armLZ = -0.25 - Math.abs(Math.sin(stroke)) * 0.4;
      armRZ = 0.25 + Math.abs(Math.sin(stroke)) * 0.4;
      headRotX = 0.58;
      skirtScaleX = 0.85;
      skirtScaleZ = 0.45;
    } else if (poseName === 'club_dance') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const beat = t * 5.6;
      rigY = Math.abs(Math.sin(beat)) * 0.08;
      rigRotY = Math.sin(t * 1.1) * 0.35;
      hipLX = Math.sin(beat) * 0.26;
      hipRX = -Math.sin(beat) * 0.26;
      kneeLX = Math.max(0, Math.cos(beat)) * 0.34;
      kneeRX = Math.max(0, -Math.cos(beat)) * 0.34;
      armLX = -2.1 + Math.sin(beat * 0.5) * 0.35;
      armRX = -1.9 - Math.sin(beat * 0.5) * 0.35;
      armLZ = -0.38;
      armRZ = 0.38;
      bodyRotZ = Math.sin(beat * 0.5) * 0.09;
      headRotY = Math.sin(beat * 0.5) * 0.16;
      skirtRotZ = Math.sin(beat * 0.5) * 0.14;
    } else if (poseName === 'pet_horse') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const pet = Math.sin(t * 3.2);
      bodyRotX = 0.12;
      armRX = -1.35 + pet * 0.22;
      armRZ = 0.14;
      armLX = -0.45;
      headRotX = -0.14;
      headRotY = Math.sin(t * 1.1) * 0.08;
    } else if (poseName === 'drive') {
      if (actor.contactShadow) actor.contactShadow.visible = false;
      const steer = cfg.steer || 0;
      rigY = typeof cfg.rigOffsetY === 'number' ? cfg.rigOffsetY : -baseLeg * 0.62;
      hipLX = -1.42;
      hipRX = -1.42;
      hipLZ = -0.04;
      hipRZ = 0.04;
      kneeLX = 1.25;
      kneeRX = 1.25;
      armLX = -1.06 - steer * 0.24;
      armRX = -1.06 + steer * 0.24;
      armLZ = -0.14;
      armRZ = 0.14;
      bodyRotX = 0.03;
      headRotY = -steer * 0.28;
      skirtRotX = -1.16;
      skirtScaleX = 0.84;
      skirtScaleZ = 0.58;
    } else if (poseName === 'ride_horse') {
      if (actor.contactShadow) actor.contactShadow.visible = false;
      const gp = cfg.gallopPhase || 0;
      const hSpd = cfg.horseSpeed || 0;
      const bob = hSpd > 0.25 ? Math.abs(Math.sin(gp)) * 0.045 : Math.sin(t * 2.1) * 0.01;
      rigY = (typeof cfg.rigOffsetY === 'number' ? cfg.rigOffsetY : -baseLeg * 0.34) + bob;
      hipLX = -0.58;
      hipRX = -0.58;
      hipLZ = -0.34;
      hipRZ = 0.34;
      kneeLX = 1.05;
      kneeRX = 1.05;
      armLX = -0.86 - Math.sin(gp) * 0.04 * (hSpd > 0.2 ? 1 : 0);
      armRX = -0.86 + Math.sin(gp) * 0.04 * (hSpd > 0.2 ? 1 : 0);
      armLZ = -0.18;
      armRZ = 0.18;
      bodyRotX = hSpd > 1.5 ? 0.14 : 0.04;
      headRotX = hSpd > 1.5 ? -0.05 : 0;
      skirtRotX = -0.95;
      skirtScaleX = 1.08;
      skirtScaleZ = 0.72;
    } else if (poseName === 'stargaze') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      bodyRotX = 0.14;
      armLX = -1.05;
      armRX = -1.15;
      armLZ = -0.14;
      armRZ = 0.14;
      headRotX = -0.22 + Math.sin(t * 0.9) * 0.05;
      headRotY = Math.sin(t * 0.55) * 0.12;
    } else if (poseName === 'converse') {
      if (actor.contactShadow) actor.contactShadow.visible = true;
      const gWave = Math.sin(t * 3.1);
      const nod = Math.sin(t * 2.2) * 0.07;
      bodyRotX = 0.03;
      bodyRotZ = Math.sin(t * 1.1) * 0.025;
      armLX = -0.52 + Math.max(0, -gWave) * 0.42;
      armRX = -0.68 + Math.max(0, gWave) * 0.48;
      armLZ = -0.18 - Math.abs(Math.sin(t * 1.9)) * 0.1;
      armRZ = 0.18 + Math.abs(Math.cos(t * 2.1)) * 0.12;
      headRotX = nod;
      headRotY = Math.sin(t * 1.35) * 0.11;
    }

    const s = 10;
    actor.rig.position.x = damp(actor.rig.position.x, rigX, s, dt);
    actor.rig.position.y = damp(actor.rig.position.y, rigY, s, dt);
    actor.rig.position.z = damp(actor.rig.position.z, rigZ, s, dt);
    actor.rig.rotation.x = damp(actor.rig.rotation.x, rigRotX, s, dt);
    actor.rig.rotation.y = damp(actor.rig.rotation.y, rigRotY, s, dt);
    actor.rig.rotation.z = damp(actor.rig.rotation.z, rigRotZ, s, dt);

    actor.leftLeg.rotation.x = damp(actor.leftLeg.rotation.x, hipLX, s, dt);
    actor.leftLeg.rotation.z = damp(actor.leftLeg.rotation.z, hipLZ, s, dt);
    actor.rightLeg.rotation.x = damp(actor.rightLeg.rotation.x, hipRX, s, dt);
    actor.rightLeg.rotation.z = damp(actor.rightLeg.rotation.z, hipRZ, s, dt);

    if (actor.leftKnee) actor.leftKnee.rotation.x = damp(actor.leftKnee.rotation.x, kneeLX, s, dt);
    if (actor.rightKnee) actor.rightKnee.rotation.x = damp(actor.rightKnee.rotation.x, kneeRX, s, dt);

    actor.leftArm.rotation.x = damp(actor.leftArm.rotation.x, armLX, s, dt);
    actor.leftArm.rotation.z = damp(actor.leftArm.rotation.z, armLZ, s, dt);
    actor.rightArm.rotation.x = damp(actor.rightArm.rotation.x, armRX, s, dt);
    actor.rightArm.rotation.z = damp(actor.rightArm.rotation.z, armRZ, s, dt);

    actor.bodyGroup.position.y = damp(actor.bodyGroup.position.y, bodyY, s, dt);
    actor.bodyGroup.rotation.x = damp(actor.bodyGroup.rotation.x, bodyRotX, s, dt);
    actor.bodyGroup.rotation.z = damp(actor.bodyGroup.rotation.z, bodyRotZ, s, dt);

    actor.headGroup.rotation.x = damp(actor.headGroup.rotation.x, headRotX, s, dt);
    actor.headGroup.rotation.y = damp(actor.headGroup.rotation.y, headRotY, s, dt);

    if (actor.skirtMesh) {
      actor.skirtMesh.rotation.x = damp(actor.skirtMesh.rotation.x, skirtRotX, s, dt);
      actor.skirtMesh.rotation.z = damp(actor.skirtMesh.rotation.z, skirtRotZ, s, dt);
      actor.skirtMesh.scale.x = damp(actor.skirtMesh.scale.x, skirtScaleX, s, dt);
      actor.skirtMesh.scale.z = damp(actor.skirtMesh.scale.z, skirtScaleZ, s, dt);
    }
  }

  window.CrownAnim = {
    applyLocomotion: applyLocomotion,
    applySwimLocomotion: applySwimLocomotion,
    applyPose: applyPose,
  };
})();
