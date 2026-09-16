import assert from "node:assert/strict";
import { test } from "node:test";
import * as THREE from "three";
import { setupSceneLinks } from "../src/scene/links.js";
import {
  createPointerState,
  getCameraBase,
  setupPointerControls,
  updateCameraFromPointer
} from "../src/scene/controls.js";

function createCanvas() {
  const listeners = new Map();
  return {
    style: {},
    getBoundingClientRect: () => ({ left: 20, top: 10, width: 200, height: 100 }),
    addEventListener(type, callback) {
      const callbacks = listeners.get(type) ?? [];
      callbacks.push(callback);
      listeners.set(type, callbacks);
    },
    emit(type, event = {}) {
      for (const callback of listeners.get(type) ?? []) callback(event);
    }
  };
}

function createLinkScene(t, reducedMotion = false) {
  const navigations = [];
  const originalWindow = globalThis.window;
  globalThis.window = {
    matchMedia: () => ({ matches: reducedMotion }),
    location: { assign: (href) => navigations.push(href) }
  };
  t.after(() => {
    globalThis.window = originalWindow;
  });
  const canvas = createCanvas();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100);
  camera.position.z = 5;
  const link = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial());
  link.userData.href = "./about.html";
  scene.add(link);
  scene.updateMatrixWorld(true);
  const update = setupSceneLinks(canvas, scene, camera);
  return { canvas, scene, link, update, navigations };
}

const center = { clientX: 120, clientY: 60, pointerType: "mouse" };

test("看板のクリックで移動し、空白や手前の物体をクリックしても移動しない", (t) => {
  const { canvas, scene, navigations } = createLinkScene(t);
  canvas.emit("click", center);
  assert.deepEqual(navigations, ["./about.html"]);
  canvas.emit("click", { clientX: 21, clientY: 11 });
  assert.equal(navigations.length, 1);

  const blocker = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial());
  blocker.position.z = 1;
  scene.add(blocker);
  scene.updateMatrixWorld(true);
  canvas.emit("click", center);
  assert.equal(navigations.length, 1);
});

test("ホバーは色だけを変え、キャンセルと退出で戻る", (t) => {
  const { canvas, link, update } = createLinkScene(t);
  canvas.emit("pointermove", center);
  update(0.2);
  assert.equal(canvas.style.cursor, "pointer");
  assert.notEqual(link.material.color.getHex(), 0xffffff);
  assert.notEqual(link.material.color.getHex(), 0x82cddd);
  assert.deepEqual(link.scale.toArray(), [1, 1, 1]);

  for (const event of ["pointercancel", "pointerleave"]) {
    canvas.emit("pointermove", center);
    update(10);
    assert.equal(link.material.color.getHex(), 0x82cddd);
    canvas.emit(event);
    update(10);
    assert.equal(canvas.style.cursor, "default");
    assert.equal(link.material.color.getHex(), 0xffffff);
  }
});

test("タッチでホバーを残さず、タップで移動できる", (t) => {
  const { canvas, link, update, navigations } = createLinkScene(t);
  const touch = { ...center, pointerType: "touch" };
  canvas.emit("pointermove", touch);
  update(1);
  assert.equal(link.material.color.getHex(), 0xffffff);
  canvas.emit("click", touch);
  assert.deepEqual(navigations, ["./about.html"]);
});

test("動きを減らす設定ではホバーの色を即座に切り替える", (t) => {
  const { canvas, link, update } = createLinkScene(t, true);
  canvas.emit("pointermove", center);
  update(0);
  assert.equal(link.material.color.getHex(), 0x82cddd);
  canvas.emit("pointerleave");
  update(0);
  assert.equal(link.material.color.getHex(), 0xffffff);
});

test("PC・スマホ縦横の構図と画面切り替えを維持する", (t) => {
  const originalWindow = globalThis.window;
  t.after(() => {
    globalThis.window = originalWindow;
  });
  const camera = new THREE.PerspectiveCamera();
  for (const [width, height, compact] of [
    [390, 844, true],
    [760, 1024, true],
    [844, 390, true],
    [761, 1024, false],
    [1440, 900, false]
  ]) {
    globalThis.window = { innerWidth: width, innerHeight: height };
    const expected = compact ? { x: 2.8, y: 2, z: 7, fov: 52 } : { x: 3.05, y: 2, z: 5.9, fov: 42 };
    const base = getCameraBase();
    assert.deepEqual(base, expected);
    updateCameraFromPointer(camera, createPointerState(base));
    assert(camera.position.distanceTo(new THREE.Vector3(base.x, base.y, base.z)) < 1e-10);
    assert.equal(camera.zoom, 1);
    assert.equal(camera.fov, base.fov);
    const expectedDirection = new THREE.Vector3(0, 1.0, 0).sub(camera.position).normalize();
    assert(camera.getWorldDirection(new THREE.Vector3()).distanceTo(expectedDirection) < 1e-10);
  }
});

test("タッチ操作でカメラを動かさず、マウス退出で追従をリセットする", (t) => {
  const originalWindow = globalThis.window;
  globalThis.window = { innerWidth: 1440, innerHeight: 900 };
  t.after(() => {
    globalThis.window = originalWindow;
  });
  const canvas = createCanvas();
  const state = createPointerState(getCameraBase());
  setupPointerControls(canvas, state);
  canvas.emit("pointermove", { ...center, pointerType: "touch" });
  assert.equal(state.pointerX, 0);
  assert.equal(state.pointerY, 0);
  canvas.emit("pointermove", center);
  assert.notEqual(state.pointerX, 0);
  canvas.emit("pointerleave");
  assert.equal(state.pointerX, 0);
  assert.equal(state.pointerY, 0);
});
