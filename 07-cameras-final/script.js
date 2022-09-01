/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' */

let OrbitControls = THREE.OrbitControls
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
    width: 400,
    height: 600
}

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    // clientX为距离视口的距离, -0.5使矩形中心不脱离渲染范围
    cursor.x = event.clientX / sizes.width
    cursor.y = - (event.clientY / sizes.height)
})

// Scene
const scene = new THREE.Scene()

// Object
//BoxGeometry分段数就是由多少个三角形拼凑
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)


scene.add(mesh)
scene.add(new THREE.AxisHelper(3))
// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 10)

// const camera = new THREE.OrthographicCamera(2, -2, 2, -2, 0.1, 100)

/* const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100) */
// camera.position.z = 1
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = 2
// 开启缓动的效果,类似于有阻力
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)



const tick = () => {

    // Update controls
    controls.update()

    /*   //  controls的自定义形式
      camera.position.z = Math.sin(cursor.x * Math.PI * 2) * 3  // 初始值为0
      camera.position.x = Math.cos(cursor.x * Math.PI * 2) * 3
      camera.position.y = cursor.y * 3
      // 相机关注中心点,不进行变化
      camera.lookAt(new THREE.Vector3(0, 0, 0)) */
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()