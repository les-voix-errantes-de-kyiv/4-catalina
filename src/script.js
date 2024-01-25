import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import GUI from "lil-gui";
import Plyr from 'plyr';

/**
 * Plyr video
 */
const player = new Plyr('#player');

/**
 * Base
 */
// Debug
const gui = new GUI({
  closeFolders: true,
  
});
gui.hide() 

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
    case "cord1":
      // console.log("cord 1 sound");
      //   soundCord1.volume = Math.random();
      soundCord1.currentTime = 0;
      soundCord1.play();
      break;

    case "cord2":
      // console.log("cord 2 sound");
      //   soundCord1.volume = Math.random();
      soundCord2.currentTime = 0;
      soundCord2.play();
      break;

    case "cord3":
      //   console.log("cord 3 sound");
      soundCord3.volume = Math.random();
      soundCord3.currentTime = 0;
      soundCord3.play();
      break;

    case "cord4":
      //   console.log("cord 4 sound");
      soundCord4.volume = Math.random();
      soundCord4.currentTime = 0;
      soundCord4.play();
      break;
  }
  // soundCord1.volume = Math.random()
};

/**
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  "/models/domra_v1.glb",
  (gltf) => {
    // const children = [...gltf.scene.children]

    // for(const child of children)
    // {
    //     scene.add(child)
    // }

    // gltf.scene.scale.set(0.025, 0.025, 0.025)
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
 * TEMPORARY MESHES
 */
const cordGeometry = new THREE.CylinderGeometry(
  0.0125, // radiusTop
  0.0125, // radiusBottom
  2.85, // height
  3 //radialSegments
);

const cordMaterial = new THREE.MeshPhysicalMaterial({ color: "#ffffff" });

const cord1 = new THREE.Mesh(cordGeometry, cordMaterial);
cord1.name = "cord1";
const cord2 = new THREE.Mesh(cordGeometry, cordMaterial);
cord2.name = "cord2";
const cord3 = new THREE.Mesh(cordGeometry, cordMaterial);
cord3.name = "cord3";
const cord4 = new THREE.Mesh(cordGeometry, cordMaterial);
cord4.name = "cord4";

cord1.position.set(0, 1.6, 0.25);
cord2.position.set(0.06, 1.6, 0.25);
cord3.position.set(0.12, 1.6, 0.25);
cord4.position.set(0.18, 1.6, 0.25);

scene.add(cord1, cord2, cord3, cord4);

const cord1Tweaks = gui.addFolder("Cord 1");
cord1Tweaks.add(cord1.position, "x").min(-1).max(1).step(0.001);
cord1Tweaks.add(cord1.position, "y").min(-5).max(5).step(0.001);
cord1Tweaks.add(cord1.position, "z").min(-1).max(1).step(0.001);

const cord2Tweaks = gui.addFolder("Cord 2");
cord2Tweaks.add(cord2.position, "x").min(-1).max(1).step(0.001);
cord2Tweaks.add(cord2.position, "y").min(-5).max(5).step(0.001);
cord2Tweaks.add(cord2.position, "z").min(-1).max(1).step(0.001);

const cord3Tweaks = gui.addFolder("Cord 3");
cord3Tweaks.add(cord3.position, "x").min(-1).max(1).step(0.001);
cord3Tweaks.add(cord3.position, "y").min(-5).max(5).step(0.001);
cord3Tweaks.add(cord3.position, "z").min(-1).max(1).step(0.001);

const cord4Tweaks = gui.addFolder("Cord 4");
cord4Tweaks.add(cord4.position, "x").min(-1).max(1).step(0.001);
cord4Tweaks.add(cord4.position, "y").min(-5).max(5).step(0.001);
cord4Tweaks.add(cord4.position, "z").min(-1).max(1).step(0.001);

/**
 * Markers
 */
const markers = [
  {
    position: new THREE.Vector3(0, 0, 0),
    element: document.querySelector(".marker-1"),
  },
  {
    position: new THREE.Vector3(1, 1, 0),
    element: document.querySelector(".marker-2"),
  },
];

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();

// g

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;
controls.enableZoom = false

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
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

  const objectsToTest = [cord1, cord2, cord3, cord4];
  const cordIntersects = raycaster.intersectObjects(scene.children, true);

  if (cordIntersects.length && cordIntersects[0].object.name) {
    const objectName = cordIntersects[0].object.name;
    playCordSound(objectName);
  }

  // Render
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
  renderer.render(scene, camera);
  renderer.setClearAlpha(0)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
