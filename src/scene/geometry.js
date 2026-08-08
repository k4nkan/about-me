import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export function roundedBox(w, h, d, radius, material, segments = 5) {
  return new THREE.Mesh(new RoundedBoxGeometry(w, h, d, segments, radius), material);
}

export function cyl(radius, height, material, radialSegments = 24) {
  return new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, radialSegments), material);
}

export function makeLabelPlane(texture, w, h) {
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.renderOrder = 5;
  return mesh;
}
