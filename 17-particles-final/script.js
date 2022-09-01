/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui' */

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load(staticURL + '/textures/particles/2.png')
const particleTexture3 = textureLoader.load(staticURL + '/textures/particles/10.png')

/**
 * Particles
 */
// Geometry
//  这里的几何体类似于group
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
// 三个下标组成一个xyz顶点位置,xyz的顺序可以通过设置属性进行更改
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial()

particlesMaterial.size = 0.1
// 尺寸衰减,距离相机越近越大,越远越小
particlesMaterial.sizeAttenuation = true

particlesMaterial.color = new THREE.Color('#ff88cc')

particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.map = particleTexture
//alpaMap会渲染纹理黑色的部分为0,为黑色,但是会遮挡后面的几何体,手动设置alphaTest为0.01
// particlesMaterial.alphaTest = 0.01
// particlesMaterial.depthTest = false

scene.add(new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshBasicMaterial()))

// particlesMaterial.depthWrite = false
// 混合
particlesMaterial.blending = THREE.AdditiveBlending
// 开启顶点色,也就是几何体的颜色,且会和材质的颜色进行混合
particlesMaterial.vertexColors = true

// 点的大小不要太大,不然看不到效果,也不够细腻

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// 球体几何,材质为点
const particles2 = new THREE.Points(new THREE.SphereBufferGeometry(1, 32, 32), new THREE.PointsMaterial({ sizeAttenuation: true, size: 0.02, color: 'blue' }))
scene.add(particles, particles2)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // 控制没一个例子
    for (let i = 0; i < count; i++) {
        let i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        // y, i3为x,i3+1为y,i3+2为z
        // 使用x来进行水平面的不一致
        particlesGeometry.attributes.position.array[i3 + 1] = Math.cos(elapsedTime + x)
    }
    // 通知渲染器需要进行位置属性的更新
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()