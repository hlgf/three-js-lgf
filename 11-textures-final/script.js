/* import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const OrbitControls = THREE.OrbitControls

scene.add(new THREE.AxisHelper(3))

/**
 * Textures
 */

// 使用纹理的额方式1
const img = new Image()
// 因为需要在外部使用,所以在load事件里面调用
const textures1 = new THREE.Texture(img)
img.onload = () => {
    // 纹理进行更新
    textures1.needsUpdate = true
}
img.src = staticUrl+"/textures/door/color.jpg"


// 加载管理器
const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log('loadingManager: loading started')
}
loadingManager.onLoaded = (info) => {
    console.log('loadingManager: loading finished', info)
}
loadingManager.onProgress = (info) => {
    // info为加载的资源路径
    console.log('loadingManager: loading progressing', info)
}
loadingManager.onError = () => {
    console.log('loadingManager: loading error')
}

// 使用纹理的方式2
// 因为Texture可以加载多个图片作为纹理,所以loadingManager为总的加载回调
const textureLoader = new THREE.TextureLoader(loadingManager)

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-2x2.png')
const colorTexture = textureLoader.load(
    staticUrl+'/textures/door/color.jpg',
    () => {
        // 加载成功回调
        console.log('textureLoader: loading finished')
    },
    () => {
        // 加载进度回调                                             
        console.log('textureLoader: loading progressing')
    },
    () => {
        // 失败回调
        console.log('textureLoader: loading error')
    }
)
// 具体信息差选Texture对象的属性
// 定义uv的包裹模式
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
// 重复的次数,搭配wrap使用
colorTexture.repeat.x = 1
colorTexture.repeat.y = 1
// 纹理的偏移量
colorTexture.offset.x = 0
colorTexture.offset.y = 0
// 旋转,为逆时针方式
colorTexture.rotation = Math.PI * 0.25
// 设置 纹理的正中心。默认值为(0,0)，即左下角,中心点以几何物体为基准,旋转以中心点为基准
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5
// colorTexture.generateMipmaps = false
// 几何图形在视角中最小状态时所使用的过滤算法,来加强物体的显示效果
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

const alphaTexture = textureLoader.load(staticUrl+'/textures/door/alpha.jpg')

/**
 * Object
 */
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
// 纹理的放置是通过UV解包获取到顶点来进行非常具体的位置贴图,three非自定义的创造的图形,都已定义好了UV顶点
console.log(geometry.attributes.uv)
const material = new THREE.MeshBasicMaterial({ map: colorTexture })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()