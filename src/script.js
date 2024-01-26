import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import Plyr from "plyr";

/**
 * Plyr video
 */

const players = document.querySelectorAll(".player");

for (const player of players) {
  const plyr = new Plyr(player);
}

/**
 * Base
 */
// Debug
const gui = new GUI({
  closeFolders: true,
});
// gui.hide();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sounds
 */
const soundCord1 = new Audio("/sounds/cord1.mp3");
const soundCord2 = new Audio("/sounds/cord2.mp3");
const soundCord3 = new Audio("/sounds/cord3.mp3");
const soundCord4 = new Audio("/sounds/cord4.mp3");

const playCordSound = (name) => {
  const objectName = name;

  switch (name) {
    case "CordA":
      soundCord1.currentTime = 0;
      soundCord1.play();
      break;

    case "CordB":
      soundCord2.currentTime = 0;
      soundCord2.play();
      break;

    case "CordC":
      soundCord3.volume = Math.random();
      soundCord3.currentTime = 0;
      soundCord3.play();
      break;

    case "CordD":
      soundCord4.volume = Math.random();
      soundCord4.currentTime = 0;
      soundCord4.play();
      break;
  }
};

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Textures
 */
const bakedTexture = textureLoader.load("/models/domra/domra_texture.jpg");
bakedTexture.flipY = false;
bakedTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

/**
 * Models
 */

gltfLoader.load(
  "/models/domra/domra_model.glb",
  (gltf) => {
    gltf.scene.traverse((child) => {
      child.material = bakedMaterial;
    });
    gltf.scene.rotateZ(-Math.PI * 0.15);
    scene.add(gltf.scene);
  },
  () => {
    console.log("progress");
  },
  () => {
    console.log("error");
  }
);

/**
 * Markers
 */
const markers = [
  {
    position: new THREE.Vector3(-1.5, 1.8, 0),
    element: document.querySelector(".marker-1"),
  },
  {
    position: new THREE.Vector3(0.7, 1, 0.22),
    element: document.querySelector(".marker-2"),
  },
];

gui.add(markers[0].position, 'x').min(-5).max(5).step(0.01).name('marker 1 x')
gui.add(markers[0].position, 'y').min(-5).max(5).step(0.01).name('marker 1 y')
gui.add(markers[0].position, 'z').min(-5).max(5).step(0.01).name('marker 1 z')

gui.add(markers[1].position, 'x').min(-5).max(5).step(0.01).name('marker 2 x')
gui.add(markers[1].position, 'y').min(-5).max(5).step(0.01).name('marker 2 y')
gui.add(markers[1].position, 'z').min(-5).max(5).step(0.01).name('marker 2 z')

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, Math.PI * 0.5);
scene.add(ambientLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1.4, 0.9, 2.25);
scene.add(camera);
gui.add(camera.position, "x").min(-5).max(5).step(0.01).name("camera position");
gui.add(camera.position, "y").min(-5).max(5).step(0.01).name("camera position");
gui.add(camera.position, "z").min(-5).max(5).step(0.01).name("camera position");
console.log(camera);
// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0.7, 1.5, 0);
controls.enableDamping = true;
controls.enableZoom = false
gui.add(controls.target, "x").min(-5).max(5).step(0.01).name("controls target");
gui.add(controls.target, "y").min(-5).max(5).step(0.01).name("controls target");
gui.add(controls.target, "z").min(-5).max(5).step(0.01).name("controls target");
/**
 * Mouse
 */
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;
});

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearAlpha(0);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Markers
  for (const marker of markers) {
    const screenPosition = marker.position.clone();
    screenPosition.project(camera);

    raycaster.setFromCamera(screenPosition, camera);
    const markerIntersects = raycaster.intersectObjects(scene.children, true);

    if (markerIntersects.length === 0) {
      marker.element.classList.add("visible");
    } else {
      const intersectionDistance = markerIntersects[0].distance;
      const markerDistance = marker.position.distanceTo(camera.position);

      if (intersectionDistance < markerDistance) {
        marker.element.classList.remove("visible");
      } else {
        marker.element.classList.add("visible");
      }
    }

    const translateX = screenPosition.x * sizes.width * 0.5;
    const translateY = -screenPosition.y * sizes.height * 0.5;
    marker.element.style.transform = `translate(${translateX}px, ${translateY}px)`;
  }

  // Cast a ray
  raycaster.setFromCamera(mouse, camera);

  const cordIntersects = raycaster.intersectObjects(scene.children, true);

  if (cordIntersects.length && cordIntersects[0].object.name) {
    const objectName = cordIntersects[0].object.name;
    playCordSound(objectName);
  }

  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
