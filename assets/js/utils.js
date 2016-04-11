'use strict'

const loader = new THREE.JSONLoader();
const textureLoader = new THREE.TextureLoader()

const D_RIGHT = new THREE.Vector3( 0, 0, 1 );
const D_UP = new THREE.Vector3( 0, 1, 0 );
const D_FORWARD = new THREE.Vector3( 1, 0, 0 );


// Convert degrees to radians
function r(d) {
  return d * (Math.PI / 180)
}

// Convert radians to degrees
function d(r) {
  return r * (180 / Math.PI)
}

// Given a direction (e.g. D_UP, D_RIGHT), convert it to be relative to a given object.
function relativeDirection(referenceObject, direction) {
  return direction.clone().applyQuaternion(referenceObject.quaternion);
}
