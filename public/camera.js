(function () {
  'use strict';

  window.CrownGame = window.CrownGame || {};

  function createCameraController(camera, domElement, initialState, onDoubleTapFocus) {
    const THREE = window.THREE;
    if (!THREE) return null;

    const initYaw =
      typeof (initialState && initialState.cameraYaw) === 'number' ? initialState.cameraYaw : 0.22;
    const initPitch =
      typeof (initialState && initialState.cameraPitch) === 'number'
        ? THREE.MathUtils.clamp(initialState.cameraPitch, 0.14, 1.32)
        : 0.34;
    const initDist =
      typeof (initialState && initialState.cameraDist) === 'number'
        ? THREE.MathUtils.clamp(initialState.cameraDist, 2.6, 38)
        : 7.8;

    const state = {
      mode: (initialState && initialState.cameraMode) || 'follow',
      yaw: initYaw,
      pitch: initPitch,
      distance: initDist,
      targetYaw: initYaw,
      targetPitch: initPitch,
      targetDistance: initDist,
      dragging: false,
      activePointerId: null,
      lastX: 0,
      lastY: 0,
      downX: 0,
      downY: 0,
      pinchDist: 0,
      lastTapTime: 0,
      lastTapX: 0,
      lastTapY: 0,
    };

    // Pre-allocated vectors for zero-GC per-frame update
    const _focus = new THREE.Vector3();
    const _desiredCam = new THREE.Vector3();
    const _curCam = new THREE.Vector3();
    const _lookTarget = new THREE.Vector3();

    const activeTouches = new Map();

    function getTouchDistance() {
      if (activeTouches.size < 2) return 0;
      const pts = Array.from(activeTouches.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      return Math.hypot(dx, dy);
    }

    function onPointerDown(ev) {
      if (ev.target !== domElement) return;
      activeTouches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
      if (activeTouches.size === 1) {
        state.dragging = true;
        state.activePointerId = ev.pointerId;
        state.lastX = ev.clientX;
        state.lastY = ev.clientY;
        state.downX = ev.clientX;
        state.downY = ev.clientY;
      } else if (activeTouches.size === 2) {
        state.dragging = false;
        state.pinchDist = getTouchDistance();
      }
    }

    function onPointerMove(ev) {
      if (!activeTouches.has(ev.pointerId)) return;
      activeTouches.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });

      if (activeTouches.size === 2) {
        const d = getTouchDistance();
        if (state.pinchDist > 0 && d > 0) {
          const delta = (state.pinchDist - d) * 0.048;
          state.targetDistance = THREE.MathUtils.clamp(state.targetDistance + delta, 2.6, 38);
        }
        state.pinchDist = d;
        return;
      }

      if (state.dragging && ev.pointerId === state.activePointerId) {
        const dx = ev.clientX - state.lastX;
        const dy = ev.clientY - state.lastY;
        state.lastX = ev.clientX;
        state.lastY = ev.clientY;
        state.targetYaw -= dx * 0.0068;
        state.targetPitch = THREE.MathUtils.clamp(state.targetPitch + dy * 0.0052, 0.12, 1.32);
      }
    }

    function onPointerUp(ev) {
      if (ev.pointerId === state.activePointerId) {
        const moveDist = Math.hypot(ev.clientX - state.downX, ev.clientY - state.downY);
        const now = performance.now();
        if (moveDist < 12 && activeTouches.size === 1) {
          const dtTap = now - state.lastTapTime;
          const tapGap = Math.hypot(ev.clientX - state.lastTapX, ev.clientY - state.lastTapY);
          if (dtTap > 40 && dtTap < 330 && tapGap < 44) {
            if (typeof onDoubleTapFocus === 'function') {
              onDoubleTapFocus();
            } else {
              setMode('follow');
            }
            state.lastTapTime = 0;
          } else {
            state.lastTapTime = now;
            state.lastTapX = ev.clientX;
            state.lastTapY = ev.clientY;
          }
        }
        state.dragging = false;
        state.activePointerId = null;
      }
      activeTouches.delete(ev.pointerId);
      if (activeTouches.size < 2) {
        state.pinchDist = 0;
      }
    }

    function onWheel(ev) {
      ev.preventDefault();
      state.targetDistance = THREE.MathUtils.clamp(state.targetDistance + ev.deltaY * 0.012, 2.6, 38);
    }

    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    function setMode(nextMode) {
      if (nextMode === 'scenic') {
        state.mode = 'scenic';
        state.targetPitch = 0.52;
        state.targetDistance = 24;
      } else if (nextMode === 'topdown') {
        state.mode = 'topdown';
        state.targetPitch = 1.24;
        state.targetDistance = 17;
      } else {
        state.mode = 'follow';
        state.targetPitch = 0.34;
        state.targetDistance = 7.8;
      }
    }

    function resetCamera(playerYaw) {
      if (typeof playerYaw === 'number') {
        state.targetYaw = playerYaw + Math.PI;
      } else {
        state.targetYaw = 0.22;
      }
      state.targetPitch = state.mode === 'topdown' ? 1.24 : state.mode === 'scenic' ? 0.52 : 0.34;
      state.targetDistance = state.mode === 'topdown' ? 17 : state.mode === 'scenic' ? 24 : 7.8;
    }

    function update(delta, targetPos, groundHeightAt, snap) {
      const dt = Math.min(Math.max(delta || 0.016, 0.001), 0.1);
      const smooth = snap ? 1 : 1 - Math.exp(-9 * dt);

      if (state.mode === 'scenic' && !state.dragging && activeTouches.size === 0) {
        state.targetYaw += dt * 0.12;
      }

      state.yaw += (state.targetYaw - state.yaw) * smooth;
      state.pitch += (state.targetPitch - state.pitch) * smooth;
      state.distance += (state.targetDistance - state.distance) * smooth;

      _focus.set(targetPos.x, targetPos.y + 1.42, targetPos.z);

      const horizDist = Math.cos(state.pitch) * state.distance;
      const vertDist = Math.sin(state.pitch) * state.distance;

      _desiredCam.set(
        _focus.x + Math.sin(state.yaw) * horizDist,
        _focus.y + vertDist,
        _focus.z + Math.cos(state.yaw) * horizDist
      );

      if (typeof groundHeightAt === 'function') {
        const minCamY = groundHeightAt(_desiredCam.x, _desiredCam.z, targetPos.y) + 0.75;
        if (_desiredCam.y < minCamY) _desiredCam.y = minCamY;
      }

      if (snap) {
        camera.position.copy(_desiredCam);
      } else {
        _curCam.copy(camera.position).lerp(_desiredCam, 1 - Math.exp(-10 * dt));
        camera.position.copy(_curCam);
      }

      _lookTarget.set(_focus.x, _focus.y - 0.1, _focus.z);
      camera.lookAt(_lookTarget);

      if (window.CrownGame && window.CrownGame.world) {
        window.CrownGame.world.cameraYaw = state.yaw;
        window.CrownGame.world.cameraPitch = state.pitch;
        window.CrownGame.world.cameraDist = state.distance;
        window.CrownGame.world.cameraMode = state.mode;
      }
    }

    function dispose() {
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);
      activeTouches.clear();
    }

    return {
      state: state,
      setMode: setMode,
      resetCamera: resetCamera,
      update: update,
      dispose: dispose,
    };
  }

  window.CrownCamera = {
    createController: createCameraController,
  };
})();
