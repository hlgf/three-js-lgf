/* import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/dracoloader";
import { SpriteMaterial } from "three"; 
import * as dat from "dat.gui";*/




//创建gui对象
const gui = new dat.GUI();
// 目标：了解threejs基础内容

// console.log(THREE);
// 初始化场景
const scene = new THREE.Scene();

// 添加辅助坐标轴
// const axesHelper = new THREE.AxesHelper(20);
// scene.add(axesHelper);

// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置
camera.position.set(0, 5, 10);
scene.add(camera);

// const rgbeLoader = new RGBELoader().setPath("assets/");
let mixer, dd, els, wkl, path;
// rgbeLoader.loadAsync("kloppenheim_02_2k.hdr").then((texture) => {
//   texture.mapping = THREE.EquirectangularReflectionMapping;
//   // console.log(texture);

//   scene.background = texture;
//   scene.environment = texture;
// });
// 使用dracoloader载入draco格式的模型
const dracoLoader = new DRACOLoader();
// 载入ew.glb模型
const loader = new GLTFLoader();
let curvePath;
loader.load("assets/ew8.glb", (gltf) => {
  console.log(gltf);
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  els = gltf.scene.children[0];
  path = gltf.scene.children[2];
  // console.log(path);
  wkl = gltf.scene.children[1];
  dd = gltf.scene.children[3];
  scene.add(els, wkl, dd);

  // 根据点创建曲线
  const points = [];
  for (let i = path.geometry.attributes.position.count - 1; i >= 0; i--) {
    points.push(
      new THREE.Vector3(
        path.geometry.attributes.position.array[i * 3],
        path.geometry.attributes.position.array[i * 3 + 1],
        path.geometry.attributes.position.array[i * 3 + 2]
      )
    );
  }
  curvePath = new THREE.CatmullRomCurve3(points);
  // 设置载入的所有物体接收和投射阴影

  // 调用mixer控制动画
  // mixer = new THREE.AnimationMixer(dd);
  // const action = mixer.clipAction(gltf.animations[0]);
  // action.play();
});

// dracoLoader.preload();
// dracoLoader.load("assets/ew.glb", (gltf) => {
//   console.log(gltf);
//   // scene.add(gltf.scene);
// });

// 环境光;
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);
// 添加平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 10, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 添加另外一个平行光源
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
directionalLight2.castShadow = true;
scene.add(directionalLight2);

// 创建平面添加到场景中
const planeGeometry = new THREE.PlaneGeometry(2, 2);
// 设置shader材质
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      // value: new THREE.Vector2(800, 800),
    },
    iTime: {
      value: 0,
    },
    iChannel0: {
      value: new THREE.TextureLoader().load("assets/ichannel0.png"),
    },
    iChannel1: {
      value: new THREE.TextureLoader().load("assets/ichannel1.png"),
    },
    iChannel2: {
      value: new THREE.TextureLoader().load("assets/ichannel2.png"),
    },
    iMouse: {
      value: new THREE.Vector2(0, 0),
    },
  },
  vertexShader: vertexShader(),
  fragmentShader: fragmentShader(),
  transparent: true,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
});
// 添加平面到场景
// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
// scene.add(plane);

// 添加sprite
// 创建精灵材质
const params = {
  iTime: {
    value: 0,
  },
};
const spriteMaterial = new SpriteMaterial({
  color: 0xffffff,
  blending: THREE.AdditiveBlending,
});
spriteMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.iResolution = {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
  };
  shader.uniforms.iTime = params.iTime;
  shader.uniforms.iChannel0 = {
    value: new THREE.TextureLoader().load("assets/ichannel0.png"),
  };
  shader.uniforms.iChannel1 = {
    value: new THREE.TextureLoader().load("assets/ichannel1.png"),
  };
  shader.uniforms.iChannel2 = {
    value: new THREE.TextureLoader().load("assets/ichannel2.png"),
  };
  shader.uniforms.iMouse = { value: new THREE.Vector2(0, 0) };
  console.log(shader.vertexShader);
  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    varying vec2 vUv;
    `
  );
  shader.vertexShader = shader.vertexShader.replace(
    "#include <uv_vertex>",
    `
    #include <uv_vertex>
    vUv = uv;
    `
  );
  shader.fragmentShader = fragmentShader;
};
// const sprite = new THREE.Sprite(planeMaterial);
const sprite = new THREE.Sprite(spriteMaterial);
sprite.position.set(-5.5, 0.8, 0);
// scene.add(sprite);

// 添加一个球到场景
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sphere = new THREE.Mesh(sphereGeometry, planeMaterial);
// scene.add(sphere);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
// 设置渲染器阴影
renderer.shadowMap.enabled = true;
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器添加到body

document.body.appendChild(renderer.domElement);

// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();

//   更新渲染器
renderer.setSize(window.innerWidth, window.innerHeight);
//   设置渲染器的像素比例
renderer.setPixelRatio(window.devicePixelRatio);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// 添加声音
const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("assets/bomb.mp3", (buffer) => {
  sound.setBuffer(buffer);
  // sound.setLoop(true);
  sound.setVolume(0.5);
  // sound.play();
});

// 创建clock
const clock = new THREE.Clock();
let oldPoint;
// 设置渲染函数
function animate() {
  requestAnimationFrame(animate);
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera);
  // controls.update();
  // 获取delay时间
  const delay = clock.getDelta();
  // 获取总共耗时
  const time = clock.getElapsedTime();
  let t = time % 5;
  t /= 5;
  // console.log(t);
  // 通过curvePath获取曲线上的点
  if (curvePath) {
    const point = curvePath.getPointAt(t);

    // console.log(point);
    // 通过point设置模型dd位置
    // 获取点的切线
    const tangent = curvePath.getTangentAt(t);
    dd.position.set(point.x, point.y, point.z);
    // 设置模型的朝向
    if (t + 0.01 < 1) {
      const point1 = curvePath.getPointAt(t + 0.01);
      // console.log(point1);
      dd.lookAt(point1);
    }
    // oldPoint = point;

    // dd.lookAt(tangent);

    if (t > 0.95) {
      scene.add(sprite);
      // 判断声音是否播放，如果没有播放则播放
      if (!sound.isPlaying) {
        sound.play();
      }
    }
  }
  params.iTime.value = t * 10;

  // if (mixer) {
  //   mixer.update(delay);
  // }
}

animate();

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
  //   console.log("resize");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比例
  renderer.setPixelRatio(window.devicePixelRatio);
});
