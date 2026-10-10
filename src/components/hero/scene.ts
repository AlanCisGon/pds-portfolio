import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/*
 * Exploded view of a digital product, modelled in Blender (scripts/blender/exploded-device.py)
 * and loaded as a GLB. The "explode" clip is authored in Blender; here it plays once, then the
 * stack floats and follows the pointer a little.
 */

const MODEL = "/models/exploded-device.glb";

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
  const rim = new THREE.DirectionalLight(0xd2734e, 0.8);
  rim.position.set(-6, 2, -4);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(9, 10.5, 9);
  camera.lookAt(0, 1.6, 0);

  const rig = new THREE.Group();
  rig.rotation.y = -0.5;
  scene.add(rig);

  // ── Layout: the model takes the free space (right on desktop, top on mobile) ──
  const resize = () => {
    const width = host.clientWidth || 1;
    const height = host.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const wide = width >= 768;
    camera.fov = wide ? 28 : 46;
    if (wide) camera.setViewOffset(width, height, -width * 0.2, height * 0.02, width, height);
    else camera.setViewOffset(width, height, 0, height * 0.32, width, height);
    camera.updateProjectionMatrix();
  };
  resize();

  let mixer: THREE.AnimationMixer | undefined;
  let model: THREE.Object3D | undefined;
  let disposed = false;
  new GLTFLoader().load(MODEL, (gltf) => {
    if (disposed) return;
    model = gltf.scene;
    // glTF has no thin-glass hint: match the procedural cover glass.
    model.traverse((o) => {
      if (
        o instanceof THREE.Mesh &&
        o.material instanceof THREE.MeshPhysicalMaterial &&
        o.material.transmission > 0
      ) {
        Object.assign(o.material, {
          roughness: 0.04,
          thickness: 0.08,
          transparent: true,
          opacity: 0.9,
        });
      }
    });
    rig.add(model);
    const clip = gltf.animations[0];
    if (!clip) return;
    mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    if (reduceMotion) {
      mixer.setTime(clip.duration);
      renderer.render(scene, camera);
    }
  });

  // ── Animation ──
  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  const clock = new THREE.Clock();
  let frame = 0;
  let visible = true;
  let started = 0;
  const loop = () => {
    frame = requestAnimationFrame(loop);
    const delta = clock.getDelta();
    if (!visible || !model) return;
    if (!started) started = clock.elapsedTime;
    const t = clock.elapsedTime - started;
    mixer?.update(delta);
    const settle = Math.min(t / 2.4, 1);
    const targetY = -0.5 + (1 - settle) * 0.6 + pointer.x * 0.12;
    rig.rotation.y += (targetY - rig.rotation.y) * 0.06;
    rig.rotation.x += (pointer.y * 0.05 - rig.rotation.x) * 0.06;
    rig.position.y = Math.sin(t * 0.5) * 0.05;
    renderer.render(scene, camera);
  };

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
  });
  observer.observe(host);
  const onResize = () => {
    resize();
    if (reduceMotion) renderer.render(scene, camera);
  };
  window.addEventListener("resize", onResize);

  if (!reduceMotion) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    loop();
  }

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
    mixer?.stopAllAction();
    model?.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        for (const m of [o.material].flat()) {
          for (const v of Object.values(m)) if (v instanceof THREE.Texture) v.dispose();
          m.dispose();
        }
      }
    });
    env.dispose();
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
