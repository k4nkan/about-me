import * as THREE from "three";

export function setupSceneLinks(canvas, scene, camera) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const defaultColor = new THREE.Color(0xffffff);
  const hoverColor = new THREE.Color(0x82cddd);
  const linkMeshes = [];
  let hoverEvent = null;

  scene.traverse((object) => {
    if (object.userData.href) linkMeshes.push(object);
  });

  function getLinkObject(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
    camera.updateMatrixWorld();
    raycaster.setFromCamera(pointer, camera);
    const object = raycaster.intersectObjects(scene.children, true)[0]?.object;
    return object?.userData.href ? object : null;
  }

  function clearHover() {
    hoverEvent = null;
  }

  canvas.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "touch") hoverEvent = event;
  });
  canvas.addEventListener("pointerleave", clearHover);
  canvas.addEventListener("pointercancel", clearHover);
  canvas.addEventListener("click", (event) => {
    const href = getLinkObject(event)?.userData.href;
    if (href) window.location.assign(href);
  });

  return function updateLinks(delta) {
    const hovered = hoverEvent ? getLinkObject(hoverEvent) : null;
    const easing = reducedMotion.matches ? 1 : 1 - Math.exp(-5 * delta);
    canvas.style.cursor = hovered ? "pointer" : "default";
    for (const mesh of linkMeshes) {
      mesh.material.color.lerp(mesh === hovered ? hoverColor : defaultColor, easing);
    }
  };
}
