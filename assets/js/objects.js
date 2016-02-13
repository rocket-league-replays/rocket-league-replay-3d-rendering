'use strict'

const loader = new THREE.JSONLoader();
const textureLoader = new THREE.TextureLoader()

// init loading
loader.load('./assets/json/stadium.json', function(geometry) {
  // create a new material
  var material = new THREE.MeshPhongMaterial({
    color: 0xaaffaa,
    shading: THREE.FlatShading
  });

  // create a mesh with models geometry and material
  var mesh = new THREE.Mesh(
    geometry,
    material
  );

  mesh.name = 'stadium'
  mesh.castShadow = false;
  mesh.receiveShadow = true;

  // scene.add(mesh);
});

var carIndex = 1;
var wheelIndex = 0;

function addCar() {
  loader.load('./assets/json/Body_Backfire_SF.json', function(geometry) {
    var material = new THREE.MeshLambertMaterial({
      map: textureLoader.load('./assets/img/Body_Octane_Curvature.jpg'),

    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.name = `car-${carIndex}`
    carIndex += 1

    mesh.scale.set(25, 25, 25);
    mesh.rotation.x = 90 * (Math.PI / 180)

    scene.add(mesh);
  });
}

// d -> r
function r(d) {
  return d * (Math.PI / 180)
}

// r ->
function d(r) {
  return r * (180 / Math.PI)
}

const wheelPositions = [
  new THREE.Vector3(1127, -400, 400),
  new THREE.Vector3(-1137, -400, 442),
  new THREE.Vector3(1127, 1074, 390),
  new THREE.Vector3(-1137, 1021, 390)
]


const wheelRotations = [
  new THREE.Euler(r(87.75), r(1.3), r(0)),
  new THREE.Euler(r(90.95), r(0), r(0)),
  new THREE.Euler(r(270.25), r(0), r(0)),
  new THREE.Euler(r(270.25), r(0), r(100))
]


function addWheel() {
  loader.load('./assets/json/WHEEL_AlphaRim_SF.json', function(geometry) {
    // Add a wheel
    var material = new THREE.MeshLambertMaterial({
      map: textureLoader.load('./assets/img/AlphaRim_D.png'),
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.name = `wheel-${wheelIndex}`

    mesh.scale.set(25, 25, 25);

    if (wheelPositions.length > wheelIndex) {
      mesh.position.set(
        wheelPositions[wheelIndex].x,
        wheelPositions[wheelIndex].y,
        wheelPositions[wheelIndex].z
      )
    }

    if (wheelRotations.length > wheelIndex) {
      mesh.rotation.set(
        wheelRotations[wheelIndex].x,
        wheelRotations[wheelIndex].y,
        wheelRotations[wheelIndex].z
      )
    }

    scene.add(mesh);
    wheelIndex += 1
  });
}

addCar()
addWheel()
addWheel()
addWheel()
addWheel()
