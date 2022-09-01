/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'
 */
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const RectAreaLightHelper = THREE.RectAreaLightHelper
const OrbitControls = THREE.OrbitControls

/**
 * Lights
 */
// Ambient light
// 环境光,光源来自四周
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
// 光照强度
ambientLight.intensity = 0.5
scene.add(ambientLight)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name('ambientLight-intensity')

// Directional light
// 定向光源,因为光会反射,所以可以看见背面,淡蓝色
const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
directionalLight.position.set(-1.5, 1, 0)
scene.add(directionalLight)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name('directionalLight-intensity')

// Hemisphere light
// 氛围环境灯, 可以设置上下两个光源颜色,物体上就是混合的颜色,上红下蓝
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3)
scene.add(hemisphereLight)
gui.add(hemisphereLight, 'intensity').min(0).max(1).step(0.01).name('hemisphereLight-intensity')

// Point light
// 点光源,类似于灯泡,光照强度逐渐向四周减弱,黄色
const pointLight = new THREE.PointLight(0xfff000, 0.5, 10, 2)
pointLight.position.set(-2, -0.5, 1)
scene.add(pointLight)
gui.add(pointLight, 'intensity').min(0).max(1).step(0.01).name('pointLight-intensity')

// Rect area light
// 类似于照相时的补光灯面板,光照强度逐渐向一个面减弱,深蓝色
// 作用于网格,标准材质,网格物理材质
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
rectAreaLight.position.set(1, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)
gui.add(rectAreaLight, 'intensity').min(0).max(10).step(0.01).name('rectAreaLight-intensity')

// Spot light
// 聚光灯,深绿色
const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight)
// 要改变聚光灯的位置,需要设置spotLight.target
spotLight.target.position.x = - 0.75
scene.add(spotLight.target)
gui.add(spotLight, 'intensity').min(0).max(1).step(0.01).name('spotLight-intensity')
gui.add(spotLight.target.position, 'x').min(-5).max(5).step(0.01).name('spotLight-x')

// Helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)
// 解决聚光灯辅助器的灯光照射位置在移动时不一致的问题
window.requestAnimationFrame(() => {
    spotLightHelper.update()
})

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

window.requestAnimationFrame(() => {
    // 需要更新位置和旋转位置,不更新也没事,不知道是不是修复了这个bug
    // rectAreaLightHelper.position.copy(rectAreaLight.position)
    // rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
    // rectAreaLightHelper.update()
})

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
// material.wireframe = true

// Objects
// 圆
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5
// 立方体
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
    material
)

// 蛋黄卷
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5
// 平板 
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 5
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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()