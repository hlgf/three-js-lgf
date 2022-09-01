var scene, camera, renderer;
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
camera.position.set(3, 4, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);



var regionR = 3;
// 地盘
var cylinderMesh = new THREE.CylinderGeometry(regionR, regionR, 0.05, 1024);
var material = new THREE.MeshNormalMaterial();
var cylinder = new THREE.Mesh(cylinderMesh, material);
cylinder.position.set(0, 0, 0);
scene.add(cylinder);

var cubesArrInfo = addRadomCubes(100);
renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

// 需要搭配 window.requestAnimationFrame进行渲染器的更新
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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


function pointsGenerator(amount) {
    var polarPointsArr = [];
    for (var i = 0; i < amount; i++) {
        var r = Math.random() * regionR;
        var θ = (2 * Math.PI / 360) * (Math.random() * 360);
        polarPointsArr.push({ r: r, θ: θ });
    }

    var cartesianPointsArr = [];
    for (var j = 0; j < polarPointsArr.length; j++) {
        var r = polarPointsArr[j].r;
        var θ = polarPointsArr[j].θ;
        var x = r * Math.cos(θ);
        var y = r * Math.sin(θ);
        cartesianPointsArr.push({ x: x, y: y });
    }

    return { polarPointsArr: polarPointsArr, cartesianPointsArr: cartesianPointsArr };
}

function addRadomCubes(amount) {
    var cubesArr = [];

    var randomPosition = pointsGenerator(amount);
    var polarPointsArr = randomPosition.polarPointsArr;
    var cartesianPointsArr = randomPosition.cartesianPointsArr;

    for (var i = 0; i < cartesianPointsArr.length; i++) {
        var position = cartesianPointsArr[i];
        var r = polarPointsArr[i].r;

        var cubeMesh = new THREE.BoxGeometry(0.2, regionR - r, 0.2);
        var cube = new THREE.Mesh(cubeMesh, material);
        cube.position.set(position.x, (regionR - r) / 2 + 0.025, position.y);
        scene.add(cube);
        cubesArr.push(cube);
    }

    return { cubesArr: cubesArr, randomPosition: randomPosition };
}