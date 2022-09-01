/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
 */


const OrbitControls = THREE.OrbitControls
/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Textures
const textureLoader = new THREE.TextureLoader()

const url = '../static'

/** 贴图可以在存在同一个材质的不同的属性中,达到类似于重叠的效果,使材质更加逼真 */
const doorColorTexture = textureLoader.load(url + '/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load(url + '/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load(url + '/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load(url + '/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load(url + '/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load(url + '/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load(url + '/textures/door/roughness.jpg')
const matcapTexture8 = textureLoader.load(url + '/textures/matcaps/8.png')
const matcapTexture7 = textureLoader.load(url + '/textures/matcaps/7.png')
const gradientTexture = textureLoader.load(url + '/textures/gradients/5.jpg')

/* 立方体纹理加载器,图片的加载是顺序应为前后x,上下y,左右z,可以想象自己站在一个空间,以自己为原点,面朝的方向为x轴 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([
    url + '/textures/environmentMaps/0/px.jpg',
    url + '/textures/environmentMaps/0/nx.jpg',
    url + '/textures/environmentMaps/0/py.jpg',
    url + '/textures/environmentMaps/0/ny.jpg',
    url + '/textures/environmentMaps/0/pz.jpg',
    url + '/textures/environmentMaps/0/nz.jpg'
])

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.add(new THREE.AxisHelper(5))
/**
 * Lights
 */
// 环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// 光源
const light = new THREE.PointLight(0xffff00, 0.5)
light.position.x = 0
light.position.y = 3
light.position.z = 5
scene.add(light)

/**
 * Objects
 */
/* const material = new THREE.MeshBasicMaterial()
material.map = doorColorTexture
material.color = new THREE.Color('#ff0000')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// alpha贴图是一张灰度纹理，用于控制整个表面的不透明度。（黑色：完全透明；白色：完全不透明）
// material.alphaMap = doorAlphaTexture
// 定义将要渲染哪一面 - 正面
// material.side = THREE.DoubleSide */

/* const material = new THREE.MeshNormalMaterial()
// 定义材质是否使用平面着色进行渲染,就是圆的渲染会像高尔夫球
material.flatShading = true */

/* const material = new THREE.MeshMatcapMaterial()
material.matcap = matcapTexture7
 */
// const material = new THREE.MeshDepthMaterial()

// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 100
// 光斑照射到物体上的颜色
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// gradientTexture.generateMipmaps = false
// gradientTexture.minFilter = THREE.NearestFilter
// gradientTexture.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTexture

/* MeshStandardMaterial
------------------------------------ */

/* // const material = new THREE.MeshStandardMaterial()
const material = new THREE.MeshPhysicalMaterial()
// 颜色贴图
material.map = doorColorTexture
// 该纹理的红色通道用作环境遮挡贴图,需要提供第二组UVs
material.aoMap = doorAmbientOcclusionTexture
// aoMap纹理的显现强度
material.aoMapIntensity = 3
// 位移贴图,以明亮部分的纹理纹理向z轴突出,(亮动,暗不动)需要很多的顶点才能造出各种奇形怪状
material.displacementMap = doorHeightTexture
material.displacementScale = 0.05
// 金属质感,一般使用的是同一图片在只展示金属的部分
material.metalnessMap = doorMetalnessTexture
material.metalness = 0.45
// 粗糙度
material.roughnessMap = doorRoughnessTexture
material.roughness = 0.65
// 法线贴图,让在光线经过时材质看起来更有层次感,沟壑感,有点类似于 aoMap,但是效果更明显,
material.normalMap = doorNormalTexture
// 控制法线贴图的影响程度
material.normalScale.set(0.5, 0.5)
// 如果需要使用alph贴图,需要开启透明
material.transparent = true
// 灰度纹理，用于控制整个表面的不透明度（黑色：完全透明,不显示;白色：完全不透明）
material.alphaMap = doorAlphaTexture
// MeshPhysicalMaterial特有属性
material.clearcoat = 1
// 光线照射到物体上时光斑后的物体模糊度clearcoat为0时无效
material.clearcoatRoughness = 0
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
gui.add(material, 'transparent')
gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001) */


const material = new THREE.MeshStandardMaterial()
material.metalness = 0.7
// 粗糙度为0时可以看见里面的内容
material.roughness = 0.1
gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
material.envMap = environmentMapTexture

// 圆
const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 64, 64),
    material
)
//用来定义aoMap贴图的uv位置 两个uv数组下标形成一个顶点,以此类推,
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))
sphere.position.x = - 1.5
// 水平块
const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1, 1, 100, 100),
    material
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
//甜甜圈
const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
    material
)
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
torus.position.x = 1.5
scene.add(sphere, plane, torus)

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
camera.position.y = 2
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

    // Update objects
    /*    sphere.rotation.y = 0.1 * elapsedTime
       plane.rotation.y = 0.1 * elapsedTime
       torus.rotation.y = 0.1 * elapsedTime
   
       sphere.rotation.x = 0.15 * elapsedTime
       plane.rotation.x = 0.15 * elapsedTime
       torus.rotation.x = 0.15 * elapsedTime */

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()