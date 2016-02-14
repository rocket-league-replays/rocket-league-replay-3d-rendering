if (!Detector.webgl) Detector.addGetWebGLMessage();
var clock = new THREE.Clock();

var camera, controls, scene, renderer;

var animData;
var mesh;
var stats;
var bottomSpacing = 100;


function init() {

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xcccccc);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight - bottomSpacing);
  renderer.shadowMap.enabled = true;

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight - bottomSpacing), 1, 30000);
  camera.position.set(-4077, 0, 2027);
  camera.up = new THREE.Vector3(0, 0, 1);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;

  // Add stats module.
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.top = '0px';
  stats.domElement.style.zIndex = 100;
  container.appendChild(stats.domElement);

  // Add balls around the corners for positioning.
  [-4077, 4077].forEach(function(x) {
    [-5976, 5977].forEach(function(y) {
      [14, 2027].forEach(function(z) {

        var geometry = new THREE.SphereGeometry(100, 32, 32);
        var material = new THREE.MeshPhongMaterial({
          color: 0xff0000,
          shading: THREE.FlatShading
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.matrixAutoUpdate = true;
        mesh.position.set(x, y, z);

        scene.add(mesh);
      });
    });
  });

  // Add lighting.
  light = new THREE.DirectionalLight(0xffffff);
  light.castShadow = true;
  light.shadow.camera.left = -5000;
  light.shadow.camera.right = 5000;
  light.shadow.camera.top = 5000;
  light.shadow.camera.bottom = -5000;
  light.position.set(0, 0, 5000);
  scene.add(light);

  light = new THREE.DirectionalLight(0x002288);
  light.position.set(1, 1, -1);
  scene.add(light);

  light = new THREE.DirectionalLight(0x882222);
  light.position.set(-1, -1, -1);
  scene.add(light);

  light = new THREE.AmbientLight(0x222222);
  scene.add(light);

  addStadium()
  animate()
}

function animate() {
  if (typeof scene === 'undefined') {
    return
  }

  if (controls.enableDamping || controls.autoRotate) {
    controls.update();
  }

  stats.update();

  if (typeof currentFrame !== 'undefined' && currentFrame >= 0) {
    document.getElementById('frame').value = currentFrame
    document.getElementById('framev').innerHTML = `${currentFrame} - ${parseFloat(frameData[currentFrame].time).toFixed(2)}s`

    positionReplayObjects()

    if (currentFrame === maxFrame - 1) {
      currentFrame = 0
    } else {
      currentFrame += 1
    }

    var target_car = scene.getObjectByName('car-4')

    if (target_car) {
      camera.position.x = 0;
      camera.position.y = -2000;
      camera.position.z = 1000;
      camera.lookAt(target_car.position);
    }
  }

  render();

  setTimeout(function() {
    requestAnimationFrame(animate);
  }, 1000 / 30) // Cap at 30 FPS.
}

function render() {
  renderer.render(scene, camera);
}
