'use strict'

// Load the stadium outline.
function addStadium() {
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

    scene.add(mesh);
    mesh.position.set(0, 0, -61)
  });
}

function addStadium2() {
  var geometry = new THREE.BoxGeometry(
    4077 + 4077,
    5976 + 5977,
    14 + 2027
  );
  var material = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

  var material = new THREE.MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0.3
  });

  var cube = new THREE.Mesh(geometry,
    material
  );
  cube.name = 'stadium'
  scene.add(cube);

  cube.position.set(0, 0, 1012)
}

const wheelPositions = [
  new THREE.Vector3(44.57, 14.75, 18.26),
  new THREE.Vector3(-44.9, 18, 18.26),
  new THREE.Vector3(-44.9, 18, -43.15),
  new THREE.Vector3(44.57, 14.75, -43.15),
]

const wheelRotations = [
  new THREE.Euler(r(0), r(0), r(0)),
  new THREE.Euler(r(0), r(0), r(0)),
  new THREE.Euler(r(-180), r(0), r(0)),
  new THREE.Euler(r(-180), r(0), r(0)),
]

// Cached meshes to improve load speed.
let carMesh;
let wheelMesh;

function addCar(name, actor) {
  console.log(`[${name}] Adding car`)

  const renderCar = function(geometry) {
    if ( ! carMesh) {
      carMesh = geometry;
    }

    console.log(`[${name}] Rendering car`)

    if (actor.y < 0) {
      console.log(`[${name}] Team 0`)
    } else {
      console.log(`[${name}] Team 1`)
    }

    var material = new THREE.MeshLambertMaterial({
      map: textureLoader.load('./assets/img/Body_Octane_Curvature.jpg'),
    });

    console.log(`[${name}] Creating new mesh`)

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name

    const scale = 1.15
    mesh.scale.set(scale, scale, scale);

    mesh.matrixAutoUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    console.log(`[${name}] Adding to scene`)

    // Fix the rotation point.
    var box = new THREE.Box3().setFromObject(mesh);
    box.center(mesh.position); // this re-sets the mesh position
    mesh.position.multiplyScalar(-1);

    var pivot = new THREE.Group();
    scene.add(pivot);
    pivot.add(mesh);

    // scene.add(mesh);

    // Add some wheels.
    console.log(`[${name}] Adding wheels`)

    addWheel(mesh, 0)
    addWheel(mesh, 1)
    addWheel(mesh, 2)
    addWheel(mesh, 3)

    // Reposition the car based on the latest data.
    console.log(`[${name}] Setting initial position`)

    mesh.position.set(
      actor.x,
      actor.y,
      actor.z
    )

    mesh.rotation.set(
      (actor.roll * Math.PI * - 1) + r(-90),
      actor.pitch * Math.PI * -1,
      (actor.yaw * Math.PI * - 1) + r(180)
    )

    // XYZ XZY YXZ YZX ZXY ZYX

    console.log(`[${name}] Render complete`)
    carsLoading = carsLoading.filter(function(e){ return e !== name })
  }

  if ( ! carMesh) {
    console.log(`[${name}] Loading mesh Body_Backfire_SF`)
    loader.load('./assets/json/Body_Backfire_SF.json', renderCar);
  } else {
    console.log(`[${name}] Using stored mesh Body_Backfire_SF`)
    renderCar(carMesh)
  }
}

function addWheel(car, wheelIndex) {
  const renderWheel = function(geometry) {
    if ( ! wheelMesh) {
      wheelMesh = geometry;
    }

    var material = new THREE.MeshLambertMaterial({
      map: textureLoader.load('./assets/img/AlphaRim_D.png'),
      transparent: true
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.name = `wheel-${wheelIndex}`

    mesh.scale.set(1, 1, 1);

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

    car.add(mesh);
  }

  if ( ! wheelMesh) {
    loader.load('./assets/json/WHEEL_AlphaRim_SF.json', renderWheel);
  } else {
    renderWheel(wheelMesh)
  }
}
