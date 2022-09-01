try {
    /*   import './style.css'
      import * as THREE from 'three' */
} catch (err) {
    console.log(err)
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axes Helper  坐标轴助手
 */
const axesHelper = new THREE.AxesHelper(8)
scene.add(axesHelper)

/**
 * Objects
 */
const group = new THREE.Group()
// group.position.set(1, 1, 1)
group.scale.y = 2
// 1为45度,2为90度
group.rotation.x = 0
scene.add(group)

// 默认所处点位
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#f00' })
)

group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#0f0' })
)
// 物体中心点到坐标轴原点的距离
cube2.position.x = 3
cube2.position.y = 2
// 也可以同时设置位置
// cube2.position.set(x,y,z)
// 勾三股四玄五
console.log('position', cube2.position.length())
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: '#00f' })
)
cube3.position.x = 1.5
cube3.position.z = 5
// cube3.rotation.y = 3.1415 * 2

cube3.rotation.reorder('YZX')
cube3.rotation.y = Math.PI * 0.25
cube3.rotation.x = Math.PI * 0.5
console.log('cube3.rotation', cube3.rotation)
group.add(cube3)

/**
 * Sizes
 */
const sizes = {
    width: 450,
    height: 450
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)

camera.lookAt(new THREE.Vector3(0, 0, 0))
// 将摄像机指向目标,可以传入mesh对象得位置属性
console.log(group.position)
// camera.lookAt(group.position)
scene.add(camera)
// 俯视的角度
camera.position.set(1, 1, 10)
// camera.position.z = 10
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)