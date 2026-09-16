import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export function makeLabelPlane(texture, w, h) {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.renderOrder = 5;
  return mesh;
}

export function addRoundedBox(
  parent,
  {
    size,
    radius,
    material,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    segments = 5,
    castShadow = false,
    receiveShadow = false
  }
) {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(...size, segments, radius), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  parent.add(mesh);
  return mesh;
}

export function addCylinder(
  parent,
  {
    radius,
    height,
    material,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    radialSegments = 24,
    castShadow = false
  }
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, radialSegments),
    material
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = castShadow;
  parent.add(mesh);
  return mesh;
}
