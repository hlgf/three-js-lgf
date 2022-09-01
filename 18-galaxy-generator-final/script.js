/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
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
scene.add(new THREE.AxesHelper(5))

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 100000
parameters.size = 0.01
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    // Destroy old galaxy
    // 销毁模型,材质,从场景中一处mesh
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    /* 基本思路
    先弄出一条线,然后弄出三条不同位置的线,然后考虑其随机性
    */
    for (let i = 0; i < parameters.count; i++) {
        // Position
        const i3 = i * 3

        const radius = Math.random() * parameters.radius
    // 旋转值
        const spinAngle = radius * parameters.spin
        // i % parameters.branches为在等分中的所出下标,因为位置角度是递增的,取余可以让不同的值在一定条件下得出同样的值
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        // 随机偏转值,
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color
        // 复制一份内阴影颜色值,且不会影响其初始的颜色(底色)
        const mixedColor = colorInside.clone()
        // 混合颜色
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}


let geometry2 = null
let material2 = null
let points2 = null
const generateGalaxy2 = () => {
    // Destroy old galaxy
    // 销毁模型,材质,从场景中一处mesh
    if (points2 !== null) {
        geometry2.dispose()
        material2.dispose()
        scene.remove(points2)
    }

    /**
     * Geometry
     */
    geometry2 = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)


    /* 基本思路
    先弄出一条线,然后弄出三条不同位置的线,然后考虑其随机性
    */
    for (let i = 0; i < parameters.count; i++) {
       
        // Position
        const i3 = i * 3

        const radius = Math.random() * parameters.radius

        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
// 极坐标转换成笛卡尔坐标
        positions[i3] = Math.cos(branchAngle ) * radius
        positions[i3 + 1] = 0
        positions[i3 + 2] = Math.sin(branchAngle ) * radius

    }

    geometry2.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    /**
     * Material
     */
    material2 = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color:'#ff5588'
        // vertexColors: true,
    })

    /**
     * Points
     */
    points2 = new THREE.Points(geometry2, material2)
    scene.add(points2)
}


gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(1).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(- 5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)
gui.close()
generateGalaxy()
generateGalaxy2()

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
camera.position.x = 3
camera.position.y = 3
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
// points.rotation.y  = Math.PI
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // console.log('rotation', points.rotation)
    // points.rotation.y += 0.001
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()