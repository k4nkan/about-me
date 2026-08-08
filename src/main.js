import * as THREE from "three";
import { createBusStop, createGround, addLights } from "./scene/busStop.js";
import { createDragState, getCameraBase, setupDragControls, updateCameraFromDrag } from "./scene/controls.js";

const canvas = document.querySelector("#scene");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef4f4);
scene.fog = new THREE.Fog(0xeef4f4, 8, 15);

const initialCameraBase = getCameraBase();
const camera = new THREE.PerspectiveCamera(initialCameraBase.fov, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(initialCameraBase.x, initialCameraBase.y, initialCameraBase.z);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.04;

const dragState = createDragState(initialCameraBase);

addLights(scene);
createGround(scene);
createBusStop(scene);
setupDragControls(canvas, dragState);

function animate() {
  requestAnimationFrame(animate);
  updateCameraFromDrag(camera, dragState);
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  const cameraBase = getCameraBase();
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = cameraBase.fov;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
