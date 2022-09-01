/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json' */

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const OrbitControls = THREE.OrbitControls
const staticURL = '../static'
scene.add(new THREE.AxisHelper(5))
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load(staticURL + '/textures/matcaps/8.png')

/**
 * Fonts
 */
// 一个用于加载JSON格式的字体的类
const fontLoader = new THREE.FontLoader()

fontLoader.load(
    staticURL + '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
        // const material = new THREE.MeshBasicMaterial({ wireframe: true })
        // MeshMatcapMaterial的实例化属性里没有wireframe,但是可以实例化以后进行设置,文档里查不到
        material.wireframe = true
        const bevelThickness = 0.03
        const bevelSize = 0.02
        // Text
        const textGeometry = new THREE.TextBufferGeometry(
            'Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: bevelThickness,
                bevelSize: bevelSize,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        // 居中方式1,借助边界进行计算
        // 开启字体的边界,获取到边界值xyz的最大最小值,进行位置的相关操作
        textGeometry.computeBoundingBox()
        textGeometry.translate(
            -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
            -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
            -(textGeometry.boundingBox.max.z - bevelThickness) * 0.5
        )
        console.log(textGeometry.boundingBox)

        // 居中方式2
        /*    textGeometry.center()
           textGeometry.computeBoundingBox()
           console.log(textGeometry.boundingBox) */

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64)

        for (let i = 0; i < 100; i++) {
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)


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
camera.position.z = 2
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()