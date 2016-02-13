if (!Detector.webgl) Detector.addGetWebGLMessage();
var clock = new THREE.Clock();

var camera, controls, scene, renderer;

var animData;
var mesh;
var stats;
var bottomSpacing = 130;

init();
animate();

function init() {

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xcccccc);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight - bottomSpacing);
  renderer.shadowMap.enabled = true;

  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight - bottomSpacing), 2000, 10000);

  camera.position.set(5000, -5000, 1000);

  camera.up = new THREE.Vector3(0, 0, 1);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  // world

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
  light.shadowCameraLeft = -5000;
  light.shadowCameraRight = 5000;
  light.shadowCameraTop = 5000;
  light.shadowCameraBottom = -5000;
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
}

function animate() {
  requestAnimationFrame(animate);
  controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
  stats.update();

  // console.log('finding car')
  obj = scene.getObjectByName('car', true);

  // obj.rotation.x = document.getElementById('x').value * (Math.PI / 180)
  // obj.rotation.y = document.getElementById('y').value * (Math.PI / 180)
  // obj.rotation.z = document.getElementById('z').value * (Math.PI / 180)
  // console.log(document.getElementById('x').value, document.getElementById('y').value, document.getElementById('z').value, obj.rotation)

  for (var i=0; i<scene.children.length; i++) {
    child = scene.children[i]

    if (child.name.length > 0 && document.querySelectorAll('#child option[value="' + child.name + '"]').length === 0) {
      var option = document.createElement('option')
      option.value = child.name
      option.text = child.name

      document.getElementById('child').add(option)
    }

    if (child.name.startsWith('wheel-')) {
      speed = r(document.getElementById('speed').value)
      steering = r(document.getElementById('steering').value)

      if (d(child.rotation.x) < 180) {
        child.rotation.z -= speed
      } else {
        child.rotation.z += speed
      }

      if (child.position.x > 0) {
        if (d(child.rotation.x) < 180) {
          child.rotation.y = steering
        } else {
          child.rotation.y = -steering
        }
      }
    }
  }

  render();
}

function render() {
  renderer.render(scene, camera);
}
