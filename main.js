import './style.css'

import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// scene == container
const scene = new THREE.Scene();

// Perspective camera : mimics what human eyeballs would see
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// RENDERER : makes the magic happens
// renderer needs to know which dom element to use ( in our case a canvas with a id of bg)
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // made it full screen by setting renderer size to window size

camera.position.setZ(30);// moved the camera along the z-axis to get better perspective

// render == draw
renderer.render(scene, camera);


// Creating an object :

// Step 1 : geometry ( ThreeJS has a bunch of built in geometries like box,sphere,cone,cylinder etc...)
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// Step 2: material => give colour or some texture
// Think of material as wrapping paper for a geometry (Different materials already in ThreeJS for different uses)
// Can make custom shaders using WebGL that you can use as material TODO : Study about WebGL

// Most materials require light source to bounce off of them
// In this case using basic material which requires no light source
const basicMaterial = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true});

// this reacts to light bouncing off of it
const standardMaterial = new THREE.MeshStandardMaterial({color: 0xFF6347});

// Step 3: mesh => geometry + material
const torus = new THREE.Mesh(geometry, standardMaterial);

scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

// Flood light in the room : will light up everything in the scene equally
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Light helpers to make working with lights easier
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);
// GridHelper draws a 2D grid along the scene
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// We can add OrbitControls to make the scene more interactive which will allow us to move around the scene with our mouse
// this will listen to dom events on the mouse and update the camera accordingly
const controls = new OrbitControls(camera, renderer.domElement);

// Random Generation
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0xffffff});
    const star = new THREE.Mesh(geometry, material);

    // Randomly generate position value for each star
    const [x, y, z] = Array(3).fill(null).map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

for (let i = 0; i < 200; i++) {
    addStar();
}

// Add a background image
const spaceTexture = new THREE.TextureLoader().load('pandas.jpg');
scene.background = spaceTexture;

// Texture map : convert 2D images to 3D objects
const karlosTexture = new THREE.TextureLoader().load('northern-lights.jpg');
const karlos = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({map: karlosTexture})
);
scene.add(karlos);
// Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({map: moonTexture})
);
scene.add(moon);

// Animation based on scroll movement
function moveCamera() {
    // getBoundingClientRect function gives the dimension of the viewport
    // top property shows exactly how far we are from the top of the web page
    // top value will always be negative
    const t = document.body.getBoundingClientRect().top;

    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}
document.body.onscroll = moveCamera;

function animate() {
    // request animation frame is a mechanism that tells the browser that you want to perform an animation
    // the below line calls animate function recursively and creates an infinite loop that calls render automatically
    requestAnimationFrame(animate);

    // For rotation effect
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.005;
    torus.rotation.z += 0.01;

    // To update camera with dom mouse events
    controls.update();

    renderer.render(scene, camera);
}

animate();
