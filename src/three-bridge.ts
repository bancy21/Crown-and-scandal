import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

declare global {
  interface Window {
    THREE: typeof THREE;
    CrownRoomEnvironment: typeof RoomEnvironment;
  }
}

window.THREE = THREE;
window.CrownRoomEnvironment = RoomEnvironment;
window.dispatchEvent(new CustomEvent('crown:three-ready'));
