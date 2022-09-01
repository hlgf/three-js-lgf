/* import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'
 */
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Base
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
scene.add(new THREE.AxesHelper(3))

/**
 * Sizes
 */
const sizes = {
    width: 400,
    height: 450
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
camera.lookAt(mesh.position)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })


/* Clock */

let clockTime = new THREE.Clock()

console.log(scene.position)
let mode = 'lose'
const tick = () => {
    /*    if (mesh.position.x > 3) {
           mode = 'lose'
       } else if (mesh.position.x < 0) {
           mode = 'add'
       }
       if (mode === 'lose') {
           mesh.position.x -= 0.01
           mesh.position.y -= 0.01
       } else {
           mesh.position.x += 0.01
           mesh.position.y += 0.01
       } */
    mesh.rotation.y = 0.1 * clockTime.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()