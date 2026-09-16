import * as THREE from "three";
import { addCylinder, addRoundedBox, makeLabelPlane } from "./geometry.js";
import { makeMat, mat, palette } from "./materials.js";
import {
  makeAdTexture,
  makeStopSignTexture,
  makeTextTexture,
  makeTimetableTexture
} from "./textures.js";

const STOP_ROTATION_Y = -0.12;

const frame = {
  postX: 2.45,
  frontZ: 0.72,
  backZ: -0.72,
  roofY: 2.8,
  hangRailY: 2.3
};

const groundConfig = {
  size: [7.15, 0.12, 5.2],
  position: [0, -0.08, 0.02],
  radius: 0.06
};

const signConfig = {
  x: -1.38,
  position: [-1.38, 3.24, 0.82],
  size: [2.35, 0.46, 0.09],
  labelSize: [2.08, 0.34],
  labelPosition: [-1.38, 3.24, 0.872]
};

const adWallConfig = {
  y: 1.38,
  size: [0.075, 2.18, 1.46],
  adCaseSize: [0.028, 2.04, 1.3],
  adScreenSize: [1.16, 1.92]
};

const routePanelConfig = {
  href: "./about.html",
  position: [-1.24, 1.6, -0.7],
  size: [1.66, 1.0, 0.07],
  radius: 0.04,
  material: makeMat(0xf7f4e8, 0.8, 0.04),
  labelSize: [1.46, 0.72],
  labelPosition: [0, 0.05, 0.048],
  texture: () =>
    makeTextTexture({
      title: "KANTA",
      subtitle: "about me",
      width: 700,
      height: 440,
      bg: "#f7f4e8",
      color: "#27313a",
      titleSize: 70,
      subtitleSize: 44
    })
};

const timetablePanelConfig = {
  href: "./contact.html",
  position: [1.58, 1.4, -0.7],
  size: [0.88, 1.48, 0.07],
  radius: 0.04,
  material: makeMat(0xf7f4e8, 0.82, 0.04),
  labelSize: [0.72, 1.2],
  labelPosition: [0, 0, 0.048],
  texture: makeTimetableTexture
};

const benchConfig = {
  position: [-0.68, 0.39, 0.04],
  seatColors: [palette.ivory, palette.yellow, palette.sky, palette.navy],
  seatSpacing: 0.72,
  firstSeatX: -1.08
};

export function addLights(scene) {
  scene.add(new THREE.AmbientLight(0xfff8ec, 1.35));
  scene.add(new THREE.HemisphereLight(0xe8f7ff, 0xb4a482, 2.2));

  const sun = new THREE.DirectionalLight(0xffedcf, 2.0);
  sun.position.set(-3.4, 3.4, 4.8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.00008;
  sun.shadow.normalBias = 0.02;
  sun.shadow.camera.left = -5;
  sun.shadow.camera.right = 5;
  sun.shadow.camera.top = 5;
  sun.shadow.camera.bottom = -3;
  scene.add(sun);
}

export function createGround(scene) {
  addRoundedBox(scene, {
    size: groundConfig.size,
    position: groundConfig.position,
    rotation: [0, STOP_ROTATION_Y, 0],
    radius: groundConfig.radius,
    material: mat.concrete,
    receiveShadow: true
  });
}

export function createBusStop(scene) {
  const stop = new THREE.Group();
  stop.rotation.y = STOP_ROTATION_Y;
  scene.add(stop);

  createShelterFrame(stop);
  const adTexture = makeAdTexture();
  createAdWall(stop, -frame.postX, adTexture);
  createAdWall(stop, frame.postX, adTexture);
  createHangingPanel(stop, routePanelConfig);
  createHangingPanel(stop, timetablePanelConfig);
  createBench(stop);
}

function createShelterFrame(parent) {
  const roof = new THREE.Group();
  roof.position.set(0, frame.roofY, 0.02);
  roof.rotation.x = -0.13;
  parent.add(roof);

  addRoundedBox(roof, {
    size: [5.42, 0.055, 1.55],
    radius: 0.035,
    material: mat.whiteMetal,
    castShadow: true
  });

  addRoundedBox(roof, {
    size: [5.67, 0.065, 0.1],
    position: [0, -0.012, 0.79],
    radius: 0.025,
    material: makeMat(0xd9d7ce, 0.8, 0.07),
    castShadow: true
  });

  addRoundedBox(roof, {
    size: [5.67, 0.065, 0.1],
    position: [0, -0.012, -0.79],
    radius: 0.025,
    material: makeMat(0xd9d7ce, 0.8, 0.07),
    castShadow: true
  });

  for (let i = 0; i < 7; i += 1) {
    addCylinder(roof, {
      radius: 0.024,
      height: 5.25,
      material: makeMat(0xd7dedc, 0.82, 0.04),
      radialSegments: 12,
      position: [0, 0.058, -0.5 + i * 0.14],
      rotation: [0, 0, Math.PI / 2]
    });
  }

  for (const x of [-frame.postX, frame.postX]) {
    addCylinder(parent, {
      radius: 0.055,
      height: 2.88,
      material: mat.whiteMetal,
      radialSegments: 18,
      position: [x, 1.42, frame.frontZ],
      castShadow: true
    });

    addCylinder(parent, {
      radius: 0.05,
      height: 2.7,
      material: mat.whiteMetal,
      radialSegments: 18,
      position: [x, 1.34, frame.backZ],
      castShadow: true
    });
  }

  addRoundedBox(parent, {
    size: [4.85, 0.1, 0.08],
    position: [0, frame.hangRailY, frame.backZ - 0.02],
    radius: 0.03,
    material: mat.whiteMetal,
    castShadow: true
  });

  addRoundedBox(parent, {
    size: [5.1, 0.08, 0.1],
    position: [0, 0.18, frame.backZ],
    radius: 0.03,
    material: mat.whiteMetal,
    castShadow: true
  });

  for (const x of [-frame.postX, frame.postX]) {
    for (const z of [frame.frontZ, frame.backZ]) {
      createFoot(parent, [x, 0.02, z]);
    }
  }

  createBusStopSign(parent);
}

function createBusStopSign(parent) {
  addRoundedBox(parent, {
    size: signConfig.size,
    position: signConfig.position,
    radius: 0.05,
    material: makeMat(0x178db1, 0.68, 0.05),
    castShadow: true
  });

  for (const xOffset of [-0.78, 0.78]) {
    addCylinder(parent, {
      radius: 0.025,
      height: 0.24,
      material: mat.whiteMetal,
      radialSegments: 12,
      position: [signConfig.x + xOffset, 3.02, 0.82],
      castShadow: true
    });
  }

  const signLabel = makeLabelPlane(makeStopSignTexture(), ...signConfig.labelSize);
  signLabel.position.set(...signConfig.labelPosition);
  parent.add(signLabel);
}

function createAdWall(parent, x, texture) {
  const wallGroup = new THREE.Group();
  wallGroup.position.set(x, adWallConfig.y, 0);
  parent.add(wallGroup);

  addRoundedBox(wallGroup, {
    size: adWallConfig.size,
    radius: 0.03,
    material: mat.adWall,
    castShadow: true
  });

  createEmbeddedAd(wallGroup, texture);
}

function createEmbeddedAd(parent, texture) {
  const adGroup = new THREE.Group();
  parent.add(adGroup);

  addRoundedBox(adGroup, {
    size: adWallConfig.adCaseSize,
    radius: 0.03,
    material: mat.adCase,
    castShadow: true
  });

  for (const side of [-1, 1]) {
    const screen = makeLabelPlane(texture, ...adWallConfig.adScreenSize);
    screen.rotation.y = side > 0 ? Math.PI / 2 : -Math.PI / 2;
    screen.position.set(0.049 * side, 0, 0);
    screen.userData.href = "./projects.html";
    adGroup.add(screen);
  }

  const glow = new THREE.PointLight(0x79d6ff, 0.55, 2.1);
  adGroup.add(glow);
}

function createHangingPanel(parent, config) {
  const panel = new THREE.Group();
  panel.position.set(...config.position);
  parent.add(panel);

  addHangers(panel, config.size[0], config.size[1], panel.position.y);

  addRoundedBox(panel, {
    size: config.size,
    radius: config.radius,
    material: config.material,
    castShadow: true
  });

  const label = makeLabelPlane(config.texture(), ...config.labelSize);
  label.position.set(...config.labelPosition);
  label.userData.href = config.href;
  panel.add(label);
}

function addHangers(parent, width, height, groupY) {
  const railLocalY = frame.hangRailY - groupY;
  const boardTopY = height / 2 - 0.02;
  const hangerHeight = Math.max(0.12, railLocalY - boardTopY);

  for (const x of [-width * 0.34, width * 0.34]) {
    addCylinder(parent, {
      radius: 0.014,
      height: hangerHeight,
      material: mat.whiteMetal,
      radialSegments: 10,
      position: [x, boardTopY + hangerHeight / 2, -0.01],
      castShadow: true
    });
  }
}

function createBench(parent) {
  const bench = new THREE.Group();
  bench.position.set(...benchConfig.position);
  parent.add(bench);

  benchConfig.seatColors.forEach((seatColor, index) => {
    const seatGroup = new THREE.Group();
    seatGroup.position.set(benchConfig.firstSeatX + index * benchConfig.seatSpacing, 0, 0);
    bench.add(seatGroup);
    createSeat(seatGroup, makeMat(seatColor, 0.9, 0.03));
  });
}

function createSeat(parent, plastic) {
  addRoundedBox(parent, {
    size: [0.64, 0.13, 0.56],
    position: [0, 0.1, 0.05],
    radius: 0.1,
    material: plastic,
    segments: 7,
    castShadow: true
  });

  addRoundedBox(parent, {
    size: [0.64, 0.55, 0.11],
    position: [0, 0.43, -0.25],
    rotation: [-0.14, 0, 0],
    radius: 0.1,
    material: plastic,
    segments: 7,
    castShadow: true
  });

  addCylinder(parent, {
    radius: 0.028,
    height: 0.45,
    material: mat.darkMetal,
    radialSegments: 14,
    position: [0, -0.175, -0.02],
    castShadow: true
  });

  createFoot(parent, [0, -0.415, -0.02]);
}

function createFoot(parent, position) {
  addRoundedBox(parent, {
    size: [0.26, 0.045, 0.26],
    position,
    radius: 0.02,
    material: mat.darkMetal,
    castShadow: true
  });
}
