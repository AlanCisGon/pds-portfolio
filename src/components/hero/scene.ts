import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/*
 * Procedural exploded view: a phone-sized product taken apart in layers, from a cherry-wood
 * back to the cover glass, with the interface split into its own planes (surface, content,
 * controls). Industrial-design materials from the brand palette: titanio, grafito, acero,
 * aluminio and cerezo.
 */

const PALETTE = {
  titanio: 0x0e1114,
  grafito: 0x171b20,
  acero: 0x20262d,
  aluminio: 0x8c96a3,
  niebla: 0xe8ecf1,
  cerezo: 0xd2734e,
  cerezoProfundo: 0x8e3b22,
};

const W = 2.2; // device width
const D = 4.4; // device depth (portrait, lies flat)
const GAP = 0.5; // gap between layers when exploded

function roundedRect(w: number, d: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Extruded rounded slab lying flat (XZ plane), with its bottom face at y = 0. */
function slab(w: number, d: number, h: number, r: number, holeInset = 0) {
  const shape = roundedRect(w, d, r);
  if (holeInset > 0) {
    const hole = roundedRect(w - holeInset * 2, d - holeInset * 2, Math.max(r - holeInset, 0.02));
    shape.holes.push(new THREE.Path(hole.getPoints(24).reverse()));
  }
  const bevel = Math.min(0.02, h / 4);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: h - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 20,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, bevel, 0);
  return geo;
}

function woodTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 1024;
  const g = c.getContext("2d");
  if (!g) return null;
  g.fillStyle = "#a9583a";
  g.fillRect(0, 0, c.width, c.height);
  // Long grain along the device, slightly wavy, with a few darker latewood bands.
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 180; i++) {
    const x0 = rand() * c.width;
    const dark = rand() < 0.25;
    g.strokeStyle = dark
      ? `rgba(90, 36, 18, ${0.25 + rand() * 0.3})`
      : `rgba(${rand() < 0.5 ? "70,28,14" : "222,150,110"}, ${0.06 + rand() * 0.12})`;
    g.lineWidth = dark ? 1 + rand() * 3 : 0.5 + rand() * 1.5;
    g.beginPath();
    const amp = 4 + rand() * 14;
    const freq = 0.002 + rand() * 0.006;
    const phase = rand() * Math.PI * 2;
    for (let y = 0; y <= c.height; y += 8) {
      const x = x0 + Math.sin(y * freq + phase) * amp;
      if (y === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

type Layer = { object: THREE.Object3D; base: number; index: number };

export function mountScene(host: HTMLElement) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;

  const key = new THREE.DirectionalLight(0xfff1e6, 1.4);
  key.position.set(4, 8, 3);
  scene.add(key);
  const rim = new THREE.DirectionalLight(PALETTE.cerezo, 0.8);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
  camera.position.set(9, 10.5, 9);
  camera.lookAt(0, 1.6, 0);

  // ── Materials ──
  const wood = woodTexture();
  const mat = {
    wood: new THREE.MeshStandardMaterial({ map: wood, roughness: 0.55, metalness: 0 }),
    aluminium: new THREE.MeshStandardMaterial({ color: 0xc4cad2, metalness: 1, roughness: 0.3 }),
    titanium: new THREE.MeshStandardMaterial({ color: 0x2b3139, metalness: 0.85, roughness: 0.42 }),
    graphite: new THREE.MeshStandardMaterial({
      color: PALETTE.grafito,
      metalness: 0.2,
      roughness: 0.7,
    }),
    steel: new THREE.MeshStandardMaterial({ color: PALETTE.acero, metalness: 0.4, roughness: 0.5 }),
    fog: new THREE.MeshStandardMaterial({ color: PALETTE.niebla, metalness: 0, roughness: 0.6 }),
    cherry: new THREE.MeshStandardMaterial({
      color: PALETTE.cerezo,
      metalness: 0.1,
      roughness: 0.4,
    }),
    cherryGlow: new THREE.MeshStandardMaterial({
      color: PALETTE.cerezo,
      emissive: PALETTE.cerezo,
      emissiveIntensity: 0.35,
      roughness: 0.5,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: PALETTE.titanio,
      metalness: 0.3,
      roughness: 0.25,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.04,
      transmission: 1,
      thickness: 0.08,
      ior: 1.5,
      clearcoat: 1,
      transparent: true,
      opacity: 0.9,
    }),
  };

  const geometries: THREE.BufferGeometry[] = [];
  const mesh = (geo: THREE.BufferGeometry, m: THREE.Material) => {
    geometries.push(geo);
    return new THREE.Mesh(geo, m);
  };

  // ── Layers, bottom to top ──
  const stack: Array<{ object: THREE.Object3D; height: number }> = [];

  // 0 · Cherry back
  stack.push({ object: mesh(slab(W, D, 0.1, 0.42), mat.wood), height: 0.1 });

  // 1 · Aluminium frame
  stack.push({ object: mesh(slab(W, D, 0.16, 0.42, 0.08), mat.aluminium), height: 0.16 });

  // 2 · Logic board: the engineering under the interface
  {
    const g = new THREE.Group();
    g.add(mesh(slab(W - 0.3, D - 0.5, 0.04, 0.24), mat.titanium));
    const parts: Array<[number, number, number, number, THREE.Material]> = [
      [-0.35, -1.1, 0.7, 0.5, mat.steel], // SoC
      [0.45, -1.15, 0.35, 0.35, mat.graphite],
      [0.0, 0.2, 1.3, 1.4, mat.graphite], // battery
      [-0.45, 1.45, 0.4, 0.4, mat.aluminium], // camera
      [0.35, 1.45, 0.5, 0.18, mat.cherry],
    ];
    for (const [x, z, w, d, m] of parts) {
      const p = mesh(slab(w, d, 0.08, Math.min(w, d) * 0.18), m);
      p.position.set(x, 0.04, z);
      g.add(p);
    }
    stack.push({ object: g, height: 0.12 });
  }

  // 3 · Interface surface
  stack.push({ object: mesh(slab(W - 0.16, D - 0.16, 0.03, 0.34), mat.screen), height: 0.03 });

  // 4 · Content: cards
  {
    const g = new THREE.Group();
    const hero = mesh(slab(1.7, 1.3, 0.05, 0.14), mat.cherryGlow);
    hero.position.set(0, 0, -1.2);
    g.add(hero);
    const cards: Array<[number, number, number, number]> = [
      [-0.43, 0.2, 0.84, 0.95],
      [0.43, 0.2, 0.84, 0.95],
      [0, 1.15, 1.7, 0.6],
    ];
    for (const [x, z, w, d] of cards) {
      const c = mesh(slab(w, d, 0.05, 0.12), mat.steel);
      c.position.set(x, 0, z);
      g.add(c);
    }
    stack.push({ object: g, height: 0.05 });
  }

  // 5 · Controls: type lines, chips, action button, tab bar
  {
    const g = new THREE.Group();
    const lines: Array<[number, number, number]> = [
      [-0.35, -1.62, 1.0],
      [-0.55, -1.47, 0.6],
      [-0.6, 0.0, 0.5],
      [0.26, 0.0, 0.5],
    ];
    for (const [x, z, w] of lines) {
      const l = mesh(slab(w, 0.07, 0.03, 0.035), mat.fog);
      l.position.set(x, 0, z);
      g.add(l);
    }
    const chips: Array<[number, number]> = [
      [-0.55, 0.95],
      [-0.05, 0.95],
    ];
    for (const [x, z] of chips) {
      const c = mesh(slab(0.42, 0.16, 0.04, 0.08), mat.aluminium);
      c.position.set(x, 0, z);
      g.add(c);
    }
    const fab = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 40), mat.cherry);
    fab.position.set(0.62, 0.04, 1.2);
    g.add(fab);
    const tab = mesh(slab(1.3, 0.26, 0.05, 0.13), mat.graphite);
    tab.position.set(0, 0, 1.88);
    g.add(tab);
    stack.push({ object: g, height: 0.08 });
  }

  // 6 · Cover glass
  stack.push({ object: mesh(slab(W - 0.06, D - 0.06, 0.04, 0.4), mat.glass), height: 0.04 });

  const device = new THREE.Group();
  const layers: Layer[] = [];
  let base = 0;
  stack.forEach(({ object, height }, index) => {
    device.add(object);
    layers.push({ object, base, index });
    base += height;
  });
  const topIndex = layers.length - 1;

  // Construction lines at the corners, like an exploded drawing.
  const guideMat = new THREE.LineDashedMaterial({
    color: PALETTE.aluminio,
    dashSize: 0.06,
    gapSize: 0.06,
    transparent: true,
    opacity: 0.35,
  });
  const guides: THREE.Line[] = [];
  const inset = 0.32;
  for (const [x, z] of [
    [-W / 2 + inset, -D / 2 + inset],
    [W / 2 - inset, -D / 2 + inset],
    [-W / 2 + inset, D / 2 - inset],
    [W / 2 - inset, D / 2 - inset],
  ]) {
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x, 0, z),
      new THREE.Vector3(x, 1, z),
    ]);
    geometries.push(geo);
    const line = new THREE.Line(geo, guideMat);
    guides.push(line);
    device.add(line);
  }

  const rig = new THREE.Group();
  rig.rotation.y = -0.5;
  rig.add(device);
  scene.add(rig);

  // ── Layout: the model takes the free space (right on desktop, top on mobile) ──
  let width = 1;
  let height = 1;
  const resize = () => {
    width = host.clientWidth || 1;
    height = host.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const wide = width >= 768;
    camera.fov = wide ? 28 : 46;
    // Shift the frame so the device sits away from the bottom-left copy.
    if (wide) camera.setViewOffset(width, height, -width * 0.2, height * 0.02, width, height);
    else camera.setViewOffset(width, height, 0, height * 0.32, width, height);
    camera.updateProjectionMatrix();
  };
  resize();

  // ── Animation ──
  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
  const clock = new THREE.Clock();
  const INTRO = 2.4; // seconds

  const pose = (elapsed: number) => {
    const intro = reduceMotion ? 1 : easeOutExpo(Math.max(0, elapsed - 0.3) / INTRO);
    const breathe = reduceMotion ? 0 : Math.sin(elapsed * 0.8) * 0.06 * intro;
    for (const layer of layers) {
      const lift = layer.index * (GAP + breathe) * intro;
      layer.object.position.y = layer.base + lift;
    }
    const top = layers[topIndex].object.position.y;
    for (const g of guides) g.scale.y = Math.max(top, 0.001);
    for (const g of guides) g.computeLineDistances();
    guideMat.opacity = 0.35 * intro;

    // Gentle turn on entry, then follow the pointer a little.
    const targetY = -0.5 + (1 - intro) * 0.6 + (reduceMotion ? 0 : pointer.x * 0.12);
    const targetX = reduceMotion ? 0 : pointer.y * 0.05;
    rig.rotation.y += (targetY - rig.rotation.y) * 0.06;
    rig.rotation.x += (targetX - rig.rotation.x) * 0.06;
    if (!reduceMotion) rig.position.y = Math.sin(elapsed * 0.5) * 0.05;
  };

  let frame = 0;
  let visible = true;
  const loop = () => {
    frame = requestAnimationFrame(loop);
    if (!visible) return;
    pose(clock.getElapsedTime());
    renderer.render(scene, camera);
  };

  const renderStill = () => {
    rig.rotation.set(0, -0.5, 0);
    pose(INTRO + 1);
    rig.rotation.set(0, -0.5, 0);
    renderer.render(scene, camera);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
  });
  observer.observe(host);
  const onResize = () => {
    resize();
    if (reduceMotion) renderStill();
  };
  window.addEventListener("resize", onResize);

  if (reduceMotion) renderStill();
  else {
    window.addEventListener("pointermove", onPointer, { passive: true });
    loop();
  }

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
    for (const g of geometries) g.dispose();
    for (const m of Object.values(mat)) m.dispose();
    guideMat.dispose();
    wood?.dispose();
    env.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
