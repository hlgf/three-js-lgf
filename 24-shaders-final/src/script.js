/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui' 
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'
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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load(staticURL + '/textures/flag-french.jpg')

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for (let i = 0; i < count; i++) {
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))

console.log('geometry', geometry)
console.dir(document.getElementById('fragmentShader'))

// Material
// map,alphaMap,opacity,color,etc都无法通过属性来定义,需要通过着色器来定义 
// ShaderMaterial有些属性是不需要在shadwe中再进行定义,已经内置了,定义反而会报错'projectionMatrix' : redefinition
const material = new THREE.ShaderMaterial({
    // vertexShader: document.getElementById('vertexShader').textContent,
    // 如果色值为rgba,则需要设置transparent
    fragmentShader: document.getElementById('fragmentShader').textContent,
    transparent: true,
    vertexShader: testVertexShader(),
    wireframe: true,
    side: THREE.DoubleSide, // 双面

    // fragmentShader: testFragmentShader(),
    // uniforms传递过去的变量可以在vertex顶点着色器中使用同样的定义同样的类型同样的变量进行接受
    // 从规范上一般都会添加u前缀
    uniforms:
    {
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture }
    }
})

gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.scale.y = 2 / 3


const basicsMesh = new THREE.Mesh(geometry, new THREE.RawShaderMaterial({
    fragmentShader: basicsFragement(),
    vertexShader: basicsVertex(),
    transparent: true,
    wireframe: true,
    uniforms:
    {
        uColor: { value: new THREE.Color('orange') },
        uTexture: { value: flagTexture }
    }
}))
scene.add(mesh, basicsMesh)

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
camera.position.set(0.25, - 0.25, 1)
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

    // Update material
    material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()