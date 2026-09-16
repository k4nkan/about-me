import * as THREE from "three";

export const palette = {
  metal: 0x20252a,
  concrete: 0xd6dddc,
  ivory: 0xf4edda,
  yellow: 0xf2bf25,
  sky: 0x45bed8,
  navy: 0x24314c
};

export function makeMat(color, roughness = 0.75, metalness = 0.05) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

export const mat = {
  concrete: makeMat(palette.concrete, 0.88, 0.03),
  darkMetal: makeMat(palette.metal, 0.62, 0.32),
  whiteMetal: makeMat(0xf2f0e6, 0.74, 0.08),
  adWall: makeMat(0x1f2529, 0.58, 0.18),
  adCase: makeMat(0x11191d, 0.62, 0.22)
};
