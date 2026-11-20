(function () {
  'use strict';

  function createInteractionManager(opts) {
    const game = opts.game || window.CrownGame;
    const playerCtrl = opts.playerCtrl;
    const castle = opts.castle;
    const actors = opts.actors || [];
    const onStateChange = opts.onStateChange || function () {};
    const toast = opts.toast || function (m) { if (game && game.toast) game.toast(m); };

    // Build dynamic interactive catalog directly from built 3D castle & cottage props
    const catalog = {};
    if (castle && castle.spots) {
      Object.keys(castle.spots).forEach(function (k) {
        catalog[k] = castle.spots[k];
      });
    }

    // Add walk-to action for all 10 enterable cottages if castle exposes them
    if (castle && Array.isArray(castle.cottages)) {
      castle.cottages.forEach(function (ct) {
        const entryKey = ct.id + '_dir';
        if (!catalog[entryKey]) {
          catalog[entryKey] = {
            id: entryKey,
            title: ct.title,
            floor: 0,
            category: 'cottages_list',
            x: ct.cx,
            y: 0.08,
            z: ct.cz,
            radius: 2.2,
            isDirectoryOnly: true,
            actions: [
              {
                id: 'enter_' + ct.id,
                label: 'Walk Inside ' + ct.title,
                hint: 'Enter furnished cottage (Bed, Stove, Table, Toilet)',
                instant: true,
                onInstant: function (ctx) {
                  const yawIn = ct.doorX > ct.cx ? -Math.PI * 0.5 : Math.PI * 0.5;
                  ctx.playerCtrl.teleport(ct.cx, ct.cz + 0.1, yawIn, 0.08);
                  ctx.toast('Inside ' + ct.title + ' — tap Bed, Stove, Table or Toilet to use!');
                },
              },
            ],
          };
        }
      });
    }

    let activeActivity = null;

    function stopActivity(silent) {
      if (!activeActivity) return;
      if (castle && typeof castle.setShowerActive === 'function') {
        castle.setShowerActive(false);
      }
      activeActivity = null;
      if (playerCtrl) {
        playerCtrl.clearActivityPose(true);
      }
      if (!silent) {
        onStateChange(null);
      }
    }

    function startPose(spec) {
      if (!spec || !playerCtrl) return;
      stopActivity(true);
      const anc = spec.anchor || {};
      if (castle && typeof castle.setShowerActive === 'function') {
        castle.setShowerActive(Boolean(spec.usesShowerSpray));
      }
      activeActivity = {
        id: spec.id || spec.pose,
        label: spec.label || 'Activity',
        pose: spec.pose,
        statusText: spec.statusText || '',
        rates: spec.rates || {},
        usesShowerSpray: Boolean(spec.usesShowerSpray),
      };
      playerCtrl.setActivityPose({
        pose: spec.pose,
        x: anc.x,
        y: anc.y,
        z: anc.z,
        yaw: anc.yaw,
        rigOffsetY: anc.rigOffsetY,
        floorY: anc.floorY,
        exitX: anc.exitX,
        exitZ: anc.exitZ,
        exitYaw: anc.exitYaw,
        onCancel: function () {
          if (castle && typeof castle.setShowerActive === 'function') {
            castle.setShowerActive(false);
          }
          activeActivity = null;
          onStateChange(null);
        },
      });
      onStateChange(activeActivity);
    }

    function runAction(action) {
      if (!action) return;
      if (window.CrownAudio) window.CrownAudio.playSelect();
      if (action.instant && typeof action.onInstant === 'function') {
        action.onInstant({
          game: game,
          playerCtrl: playerCtrl,
          castle: castle,
          toast: toast,
          startPose: startPose,
        });
        return;
      }
      startPose(action);
    }

    function getNearest(pos) {
      if (!pos) return null;
      let best = null;
      let bestDist = Infinity;

      for (let i = 0; i < actors.length; i++) {
        const act = actors[i];
        const dA = Math.hypot(pos.x - act.mesh.root.position.x, pos.z - act.mesh.root.position.z);
        if (Math.abs(pos.y - act.mesh.root.position.y) < 2.2 && dA < 3.4 && dA < bestDist) {
          bestDist = dA;
          best = {
            kind: 'actor',
            id: act.id,
            title: act.prompt,
            actions: [
              {
                id: 'talk_' + act.id,
                label: act.prompt,
                hint: 'Interact with court member',
                instant: true,
                onInstant: act.onInteract,
              },
            ],
          };
        }
      }

      const uniqueIds = Object.keys(catalog);
      for (let j = 0; j < uniqueIds.length; j++) {
        const item = catalog[uniqueIds[j]];
        if (item.isDirectoryOnly || /_entry$/.test(item.id)) continue;
        const dy = Math.abs(pos.y - (item.y || 0));
        const d = Math.hypot(pos.x - item.x, pos.z - item.z);
        if (dy < 2.4 && d < (item.radius || 3.4) && d < bestDist) {
          bestDist = d;
          best = {
            kind: 'object',
            id: item.id,
            title: item.title,
            actions: item.actions,
            object: item,
          };
        }
      }
      return best;
    }

    function getById(interactId) {
      const item = catalog[interactId];
      if (!item) return null;
      return {
        kind: 'object',
        id: item.id,
        title: item.title,
        actions: item.actions,
        object: item,
      };
    }

    function listQuickShortcuts() {
      if (castle && Array.isArray(castle.shortcuts) && castle.shortcuts.length) {
        return castle.shortcuts;
      }
      return Object.values(catalog).slice(0, 12);
    }

    function extractBedNumber(item) {
      if (item.id === 'canopy_bed') return 4;
      const m = item.id.match(/^bed_(\d+)$/);
      return m ? parseInt(m[1], 10) : 99;
    }

    function extractNumSuffix(id) {
      const m = String(id).match(/(\d+)$/);
      return m ? parseInt(m[1], 10) : 99;
    }

    function listByCategory(category) {
      const all = Object.values(catalog);
      if (category === 'bedrooms') {
        return all
          .filter(function (it) {
            return it.category === 'bedrooms' && (it.id === 'canopy_bed' || /^bed_\d+$/.test(it.id));
          })
          .sort(function (a, b) {
            return extractBedNumber(a) - extractBedNumber(b);
          });
      }
      if (category === 'toilets') {
        return all
          .filter(function (it) {
            return it.category === 'toilets' && !/^cot_/.test(it.id);
          })
          .sort(function (a, b) {
            if (a.floor !== b.floor) return a.floor - b.floor;
            return extractNumSuffix(a.id) - extractNumSuffix(b.id);
          });
      }
      if (category === 'living') {
        return all
          .filter(function (it) {
            return it.category === 'living';
          })
          .sort(function (a, b) {
            return (a.floor || 0) - (b.floor || 0);
          });
      }
      if (category === 'cottages') {
        return all
          .filter(function (it) {
            return it.category === 'cottages_list';
          })
          .sort(function (a, b) {
            return extractNumSuffix(a.id.replace('_dir', '')) - extractNumSuffix(b.id.replace('_dir', ''));
          });
      }
      if (category === 'gardens') {
        return all.filter(function (it) {
          return it.category === 'gardens';
        });
      }
      return listQuickShortcuts();
    }

    return {
      getNearest: getNearest,
      getById: getById,
      runAction: runAction,
      stopActivity: stopActivity,
      getActiveActivity: function () {
        return activeActivity;
      },
      listQuickShortcuts: listQuickShortcuts,
      listByCategory: listByCategory,
      getCatalogCount: function () {
        return Object.keys(catalog).length;
      },
    };
  }

  window.CrownInteract = {
    createManager: createInteractionManager,
  };
})();
