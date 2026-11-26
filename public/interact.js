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
        const spot = castle.spots[k];
        catalog[k] = spot;
        if (spot && Array.isArray(spot.actions)) {
          const sleepAct = spot.actions.find(function (a) { return a && a.pose === 'sleep'; });
          const hasServeBed = spot.actions.some(function (a) { return a && a.id && a.id.indexOf('serve_bed') !== -1; });
          if (sleepAct && !hasServeBed) {
            spot.actions.push({
              id: spot.id + '_serve_bed',
              label: 'Order Butler/Maid: Serve Meal in Bed',
              hint: '+55 Food, +35 Energy, +20 Poise · Staff brings silver cloche tray to bedside!',
              instant: true,
              onInstant: function (actCtx) {
                if (window.CrownCommands && typeof window.CrownCommands.serveMealInBed === 'function') {
                  window.CrownCommands.serveMealInBed(spot, sleepAct);
                } else {
                  if (window.CrownNeeds) window.CrownNeeds.applyBoost({ hunger: 55, energy: 35, composure: 20, fun: 16 });
                  if (actCtx && actCtx.startPose) {
                    actCtx.startPose({
                      id: spot.id + '_eat_in_bed',
                      label: 'Breakfast Served in Bed',
                      pose: 'eat_in_bed',
                      statusText: 'Enjoying royal breakfast served in bed (' + spot.title + ')...',
                      anchor: sleepAct.anchor,
                      rates: { hunger: 16, energy: 10, composure: 6, fun: 6 },
                    });
                  }
                }
              },
            });
          }
        }
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
        partnerAnchor: anc.partnerAnchor || spec.partnerAnchor || null,
        seats: anc.seats || spec.seats || null,
        spotId: spec.spotId || null,
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
      if (action.type === 'drive_vehicle' && playerCtrl && castle && Array.isArray(castle.vehicles)) {
        const vh = castle.vehicles.find(function (v) { return v.id === action.vehicleId; });
        if (vh) {
          playerCtrl.enterCar(vh);
          toast('Driving ' + vh.title + ' — use stick or WASD to drive around town!');
        }
        return;
      }
      if (action.type === 'chauffeur_drive' && window.CrownCommands && typeof window.CrownCommands.openChauffeurRideSheet === 'function') {
        window.CrownCommands.openChauffeurRideSheet(action.vehicleId);
        return;
      }
      if (action.type === 'invite_car_passengers' && window.CrownCommands && typeof window.CrownCommands.openCarPassengersSheet === 'function') {
        window.CrownCommands.openCarPassengersSheet(action.vehicleId);
        return;
      }
      if (action.type === 'toggle_car_doors' && playerCtrl && castle && Array.isArray(castle.vehicles)) {
        const vh = castle.vehicles.find(function (v) { return v.id === action.vehicleId; });
        if (vh && typeof playerCtrl.toggleCarDoors === 'function') {
          const isOpen = playerCtrl.toggleCarDoors(vh);
          toast(isOpen ? (vh.title + ' doors swung open!') : (vh.title + ' doors closed.'));
        }
        return;
      }
      if (action.type === 'mount_horse' && playerCtrl && castle && Array.isArray(castle.horses)) {
        const hr = castle.horses.find(function (h) { return h.id === action.horseId; });
        if (hr) {
          playerCtrl.mountHorse(hr);
          toast('Mounted ' + hr.title + ' — ride through the stables, avenues & gardens!');
        }
        return;
      }
      if (action.type === 'board_boat' && playerCtrl && castle && Array.isArray(castle.boats)) {
        const bt = castle.boats.find(function (b) { return b.id === action.boatId; });
        if (bt && typeof playerCtrl.enterBoat === 'function') {
          playerCtrl.enterBoat(bt);
          toast((bt.isYacht ? 'Piloting ' : 'Rowing ') + bt.title + ' across Riviera Bay!');
        }
        return;
      }
      if (action.type === 'boat_captain_cruise' && window.CrownCommands && typeof window.CrownCommands.openBoatCaptainSheet === 'function') {
        window.CrownCommands.openBoatCaptainSheet(action.boatId);
        return;
      }
      if (action.type === 'boat_passengers' && window.CrownCommands && typeof window.CrownCommands.openBoatPassengersSheet === 'function') {
        window.CrownCommands.openBoatPassengersSheet(action.boatId);
        return;
      }
      if (action.type === 'call_to_meal' && window.CrownCommands && typeof window.CrownCommands.callGroupToMeal === 'function') {
        const spot = action.spotId ? catalog[action.spotId] : null;
        window.CrownCommands.callGroupToMeal(spot, action);
        return;
      }
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
            actor: act,
            title: act.prompt,
            actions: [
              {
                id: 'talk_' + act.id,
                label: act.prompt,
                hint: 'Stop and hold genuine conversation',
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
        if (item.isDirectoryOnly || /_entry$|_plot_visit$|_dir$/.test(item.id)) continue;
        const dy = Math.abs(pos.y - (item.y || 0));
        let d;
        if (item.bounds) {
          const b = item.bounds;
          const cx = Math.max(b.minX, Math.min(b.maxX, pos.x));
          const cz = Math.max(b.minZ, Math.min(b.maxZ, pos.z));
          d = Math.hypot(pos.x - cx, pos.z - cz);
        } else {
          d = Math.hypot(pos.x - item.x, pos.z - item.z);
        }
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
      if (typeof interactId === 'string' && interactId.indexOf('npc_') === 0) {
        const npcId = interactId.slice(4);
        for (let i = 0; i < actors.length; i++) {
          const act = actors[i];
          if (act.id === npcId) {
            return {
              kind: 'actor',
              id: act.id,
              actor: act,
              title: act.prompt,
              actions: [
                {
                  id: 'talk_' + act.id,
                  label: act.prompt,
                  hint: 'Stop and hold genuine conversation',
                  instant: true,
                  onInstant: act.onInteract,
                },
              ],
            };
          }
        }
      }
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
            return it.category === 'bedrooms' && (it.id === 'canopy_bed' || /^bed_\d+$/.test(it.id) || it.id === 'bed_hotel_vip');
          })
          .sort(function (a, b) {
            return extractBedNumber(a) - extractBedNumber(b);
          });
      }
      if (category === 'toilets') {
        return all
          .filter(function (it) {
            return it.category === 'toilets' && !/^cot_|^mid_house_|^mansionette_|^farm_/.test(it.id);
          })
          .sort(function (a, b) {
            if ((a.floor || 0) !== (b.floor || 0)) return (a.floor || 0) - (b.floor || 0);
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
      if (category === 'floors') {
        return all
          .filter(function (it) {
            return it.category === 'floors';
          })
          .sort(function (a, b) {
            return (a.floor || 0) - (b.floor || 0);
          });
      }
      if (category === 'schools') {
        return all.filter(function (it) {
          return it.category === 'schools';
        });
      }
      if (category === 'town') {
        const dir = castle && Array.isArray(castle.townDirectory) ? castle.townDirectory : [];
        const civic = dir.filter(function (it) {
          return it && (it.category === 'town' || it.id === 'azure_pool_swim');
        });
        const oceanIds = {
          riviera_royal_yacht: true,
          riviera_marina_dock: true,
          riviera_beach_club: true,
          riviera_coral_cove: true,
          ile_dor_island: true,
          lighthouse_island: true,
          riviera_ocean_swim: true,
          riviera_rowboat_west: true,
        };
        const marine = all.filter(function (it) {
          return Boolean(oceanIds[it.id]);
        });
        const cars = all.filter(function (it) {
          return /_car$/.test(it.id);
        });
        const seen = new Set();
        return civic.concat(marine, cars).filter(function (it) {
          if (!it || seen.has(it.id)) return false;
          seen.add(it.id);
          return true;
        });
      }
      if (category === 'cottages') {
        const midHouses = all
          .filter(function (it) {
            return /^mid_house_\d+_plot_visit$/.test(it.id);
          })
          .sort(function (a, b) {
            return extractNumSuffix(a.id.replace('_plot_visit', '')) - extractNumSuffix(b.id.replace('_plot_visit', ''));
          });
        const mans = all
          .filter(function (it) {
            return /^mansionette_\d+_plot_visit$/.test(it.id);
          })
          .sort(function (a, b) {
            return extractNumSuffix(a.id.replace('_plot_visit', '')) - extractNumSuffix(b.id.replace('_plot_visit', ''));
          });
        const cots = all
          .filter(function (it) {
            return it.category === 'cottages_list';
          })
          .sort(function (a, b) {
            return extractNumSuffix(a.id.replace('_dir', '')) - extractNumSuffix(b.id.replace('_dir', ''));
          });
        return midHouses.concat(mans, cots);
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
