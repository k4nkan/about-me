import * as THREE from "three";

export function getCameraBase() {
  return window.innerWidth < 720
    ? { x: 3.1, y: 1.95, z: 8.25, fov: 57 }
    : { x: 3.25, y: 1.95, z: 6.25, fov: 44 };
}

export function createDragState(cameraBase) {
  const orbitBase = getOrbitBase(cameraBase);
  return {
    isDragging: false,
    lastX: 0,
    lastY: 0,
    currentAzimuth: orbitBase.azimuth,
    targetAzimuth: orbitBase.azimuth,
    currentHeight: cameraBase.y,
    targetHeight: cameraBase.y
  };
}

export function setupDragControls(canvas, dragState) {
  canvas.addEventListener("pointerdown", (event) => {
    dragState.isDragging = true;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragState.isDragging) return;
    const deltaX = event.clientX - dragState.lastX;
    const deltaY = event.clientY - dragState.lastY;
    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
    dragState.targetAzimuth = THREE.MathUtils.clamp(dragState.targetAzimuth - deltaX * 0.006, -0.65, 1.2);
    dragState.targetHeight = THREE.MathUtils.clamp(dragState.targetHeight + deltaY * 0.003, 1.55, 2.65);
  });

  canvas.addEventListener("pointerup", (event) => {
    dragState.isDragging = false;
    canvas.releasePointerCapture(event.pointerId);
    canvas.classList.remove("is-dragging");
  });

  canvas.addEventListener("pointercancel", () => {
    dragState.isDragging = false;
    canvas.classList.remove("is-dragging");
  });
}

export function updateCameraFromDrag(camera, dragState) {
  const cameraBase = getCameraBase();
  const orbit = getOrbitBase(cameraBase);
  dragState.currentAzimuth = THREE.MathUtils.lerp(dragState.currentAzimuth, dragState.targetAzimuth, 0.12);
  dragState.currentHeight = THREE.MathUtils.lerp(dragState.currentHeight, dragState.targetHeight, 0.12);

  camera.position.x = Math.sin(dragState.currentAzimuth) * orbit.distance;
  camera.position.y = dragState.currentHeight;
  camera.position.z = Math.cos(dragState.currentAzimuth) * orbit.distance;
  if (camera.fov !== cameraBase.fov) {
    camera.fov = cameraBase.fov;
    camera.updateProjectionMatrix();
  }
  camera.lookAt(0, 1.28, 0.02);
}

function getOrbitBase(cameraBase) {
  return {
    azimuth: Math.atan2(cameraBase.x, cameraBase.z),
    distance: Math.hypot(cameraBase.x, cameraBase.z)
  };
}
