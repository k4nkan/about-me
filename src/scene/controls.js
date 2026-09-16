import * as THREE from "three";

const POINTER_AZIMUTH_RANGE = 0.16;
const POINTER_HEIGHT_RANGE = 0.24;
const CAMERA_EASING = 0.08;
const CAMERA_TARGET = new THREE.Vector3(0, 1.0, 0);

export function getCameraBase() {
  const compact =
    window.innerWidth <= 760 || (window.innerWidth <= 950 && window.innerHeight <= 500);
  return compact ? { x: 2.8, y: 2.0, z: 7.0, fov: 52 } : { x: 3.05, y: 2.0, z: 5.9, fov: 42 };
}

export function createPointerState(cameraBase) {
  const orbitBase = getOrbitBase(cameraBase);
  return {
    currentAzimuth: orbitBase.azimuth,
    currentHeight: cameraBase.y,
    pointerX: 0,
    pointerY: 0
  };
}

export function setupPointerControls(canvas, pointerState) {
  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    pointerState.pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerState.pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  canvas.addEventListener("pointerleave", () => {
    pointerState.pointerX = 0;
    pointerState.pointerY = 0;
  });
}

export function updateCameraFromPointer(camera, pointerState) {
  const cameraBase = getCameraBase();
  const orbit = getOrbitBase(cameraBase);
  const targetAzimuth = orbit.azimuth - pointerState.pointerX * POINTER_AZIMUTH_RANGE;
  const targetHeight = cameraBase.y - pointerState.pointerY * POINTER_HEIGHT_RANGE;
  pointerState.currentAzimuth = THREE.MathUtils.lerp(
    pointerState.currentAzimuth,
    targetAzimuth,
    CAMERA_EASING
  );
  pointerState.currentHeight = THREE.MathUtils.lerp(
    pointerState.currentHeight,
    targetHeight,
    CAMERA_EASING
  );

  camera.position.x = Math.sin(pointerState.currentAzimuth) * orbit.distance;
  camera.position.y = pointerState.currentHeight;
  camera.position.z = Math.cos(pointerState.currentAzimuth) * orbit.distance;
  if (camera.fov !== cameraBase.fov) {
    camera.fov = cameraBase.fov;
    camera.updateProjectionMatrix();
  }
  camera.lookAt(CAMERA_TARGET);
}

function getOrbitBase(cameraBase) {
  return {
    azimuth: Math.atan2(cameraBase.x, cameraBase.z),
    distance: Math.hypot(cameraBase.x, cameraBase.z)
  };
}
