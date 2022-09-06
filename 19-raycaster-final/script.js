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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

// html标签
const earthDiv = document.createElement('div');
earthDiv.className = 'label';
earthDiv.textContent = 'Earth';
// 可以绑定点击事件
earthDiv.onclick = () => {
    console.log('点击事件是否生效')
}


const earthLabel = new THREE.CSS2DObject(earthDiv);
earthLabel.visible = false
object2.add(earthLabel);
earthLabel.position.clone(object2)
earthLabel.position.y += 0.8
earthLabel.layers.set(0);
console.log('earthLabel', earthLabel)

// 会自动查找所有的CSS2DObject
labelRenderer = new THREE.CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(labelRenderer.domElement);

/**
 * Raycaster
 */
// 光线投射用于进行鼠标拾取,绑定点击事件
const raycaster = new THREE.Raycaster()
let currentIntersect = null

// raycaster.set(rayOrigin, rayDirection)

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

    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Mouse
 */
const mouse = new THREE.Vector2()
scene.add(new THREE.AxesHelper(2))

window.addEventListener('mousemove', (event) => {
    // 进行归一化划分,可以理解成做成坐标轴的感觉,中间为原点,最左为-1,最右为1
    mouse.x = event.clientX / sizes.width * 2 - 1
    // 要注意坐标轴的正轴方向,所以这里是+1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
})

window.addEventListener('click', () => {
    earthLabel.visible = false
    controls.target = camera.position
    if (currentIntersect) {
        switch (currentIntersect.object) {
            case object1:
                console.log('click on object 1')
                console.log('(object1.position)', object1.position)
                camera.lookAt(object1.position)
                break

            case object2:
                console.log('click on object 2')
                earthLabel.visible = true
                controls.target = object2.position
                camera.lookAt(object2.position)
                controls.update()
                tween.play();
                break

            case object3:
                console.log('click on object 3')
                break
        }
    }
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
controls.saveState()

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

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Cast a fixed ray
    const rayOrigin = new THREE.Vector3(- 3, 1, 0)
    const rayDirection = new THREE.Vector3(1, 0, 0)
    //  矢量化为1
    rayDirection.normalize()
    // 设置了原点和矢量化的方向,是固定的值 
    raycaster.set(rayOrigin, rayDirection)
    // 可视化 射线
    const arrowHelper = new THREE.ArrowHelper(
        raycaster.ray.direction,
        raycaster.ray.origin,
        15,
        0x00ffff,
        1,
        0.5,
    )
    scene.add(arrowHelper)


    // 借助鼠标事件所获取 到的xy从相机视角开始的相交,初始设置的原点和食量方向 将会失效
    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = [object1, object2, object3]
    // intersects为观察传入的对象是否被射线穿过,穿过 则返回,返回值为数组类型
    const intersects = raycaster.intersectObjects(objectsToTest)

    /*-------------------
  11111111111111111111111111111111111111 
  */
    // 先还原成原色
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000')
    }
    // 设置与射线相交的集合为红色
    for (const intersect of intersects) {
        intersect.object.material.color.set('#0000ff')
    }


    /* 22222222222222222222222222222222222222222222222222 只是换 了一种js查找对象的方法*/
    /*    for(const intersect of intersects)
       {
           intersect.object.material.color.set('#0000ff')
       }
   
       for(const object of objectsToTest)
       {
           if(!intersects.find(intersect => intersect.object === object))
           {
               object.material.color.set('#ff0000')
           }
       }*/


    if (intersects.length) {
        if (!currentIntersect) {
            console.log('mouse enter')
        }

        currentIntersect = intersects[0]
    }
    else {
        if (currentIntersect) {
            console.log('mouse leave')
        }

        currentIntersect = null
    }

    labelRenderer.render(scene, camera);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()