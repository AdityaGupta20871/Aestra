import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()



// Objects
const secgeometry = new THREE.TorusGeometry( .6, .1, 64, 1000 );
const particlesGeometry = new THREE.BufferGeometry();
const borderParticlesGeometry = new THREE.BufferGeometry();
const geometry = new THREE.TorusGeometry(1,0.2, 14, 100); // Adjust these parameters as needed


const particlesCnt = 10000;
const posArray = new Float32Array(particlesCnt * 3)
const particleZVelocity = new Float32Array(particlesCnt);
for (let i = 0; i < particlesCnt * 3; i += 3) {
    particleZVelocity[i / 3] = (Math.random() - 0.5) * 0.1;
    const i3 = i / 3;
    const radius = 0.5;

    const phi = Math.acos(-1 + (2 * i3) / particlesCnt);
    const theta = Math.sqrt(particlesCnt * Math.PI) * phi;

    posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
    posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    posArray[i + 2] = radius * Math.cos(phi);
}
particlesGeometry.setAttribute('position',new THREE.BufferAttribute(posArray,3))
// Materials


const material = new THREE.PointsMaterial({
    size:0.005,
    color:'#7fff00'
})
const secmaterial = new THREE.PointsMaterial({
    size:0.005,
    color:'#00ecfa'
})
const particlesMaterial = new THREE.PointsMaterial({
    size:0.005,
    blending:THREE.AdditiveBlending,
    color:'#FFFFFF'
})
const secsphere = new THREE.Points(secgeometry, secmaterial);
// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(sphere,secsphere,particlesMesh)


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor(new THREE.Color('#21282a'),1)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)
/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
        // Update particles
        for (let i = 0; i < particlesCnt; i++) {
            let z = particlesMesh.geometry.attributes.position.getZ(i);
            z += particleZVelocity[i];
            particlesMesh.geometry.attributes.position.setZ(i, z);
        }
        particlesMesh.geometry.attributes.position.needsUpdate = true;
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

setTimeout(() => {
    tick();
}, 5000);