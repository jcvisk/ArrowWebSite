import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let container;
let camera, scene, renderer;

function init() {
    container = document.querySelector('#bg-video');

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1_000);
    camera.position.z = 500;

    scene = new THREE.Scene();

    loadLights();
    loadVideo();
    loadModel();
}

function loadLights() {
    const light = new THREE.DirectionalLight(0xfff1bf, 20);
    light.rotation.set(Math.PI / 3, Math.PI, 0);
    light.position.set(0.9, 1, 100);
    scene.add(light);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.rotation.set(0, Math.PI / 3, 0);
    topLight.position.set(0, 1, 0);
    scene.add(topLight);

    const leftLight = new THREE.DirectionalLight(0xffffff, 1);
    leftLight.rotation.set(0, Math.PI / 4, 0);
    leftLight.position.set(-1, 0, 0);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xffffff, 1);
    rightLight.rotation.set(Math.PI / 2, 0, 0);
    rightLight.position.set(1, 0, 0);
    scene.add(rightLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.useLegacyLights = false;
    container.appendChild(renderer.domElement);
}

function loadVideo() {
    const video = document.getElementById('video');

    video.addEventListener('loadeddata', function () {
        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;

        const aspectRatio = video.videoWidth / video.videoHeight;
        const planeHeight = window.innerHeight / 2;
        const planeWidth = planeHeight * aspectRatio;

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
    });

    video.load();
    video.play();
}

function loadModel() {
    const loader = new GLTFLoader();
    loader.load('./assets/arrow.glb', gltf => {
        const arrow = gltf.scene;

        //arrow.scale.set(60, 60, 60);
        //arrow.position.set(-50, -150, 100);
        
        updateArrowPosition(arrow);
        scene.add(arrow);


        const animations = gltf.animations;
        if (animations && animations.length) {
            const mixer = new THREE.AnimationMixer(arrow);

            for (let i = 0; i < animations.length; i++) {
                const clipAction = mixer.clipAction(animations[i]);
                clipAction.setLoop(THREE.LoopRepeat);
                clipAction.play();
            }

            function updateAnimation() {
                const delta = 0.01;
                mixer.update(delta);
                requestAnimationFrame(updateAnimation);
            }
            updateAnimation();
        }
    }
    );
}

function updateArrowPosition(arrow) {
    const width = window.innerWidth;

    switch (true) {
        case width < 577:
            console.log('entra amenores de 576');
            arrow.scale.set(40, 40, 40);
            arrow.position.set(-100, -20, 100);
            break;
        case width < 769:
            console.log('entra amenores de 768')
            arrow.scale.set(40, 40, 40);
            arrow.position.set(-50, -100, 100);
            break;
        case width < 1200:
            console.log('entra amenores de 1200')
            arrow.scale.set(40, 40, 40);
            arrow.position.set(-50, -100, 100)
            break;
        default:
            arrow.scale.set(60, 60, 60);
            arrow.position.set(-50, -150, 100);
            break;
    }
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

window.onload = function () {
    init();
    animate();

    window.addEventListener('resize', onWindowResize);
};
