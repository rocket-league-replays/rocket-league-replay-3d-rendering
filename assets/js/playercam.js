'use strict'

const CAMERA_HEIGHT = 90;
const CAMERA_DISTANCE = 200;
const FOCUS_DISTANCE_UP = 30;
const FOCUS_DISTANCE_FORWARD = 30;

// Wrap camera with logic to follow a player.
function PlayerCam(threeCamera) {
  this.camera = threeCamera;
  this.playerIndex = 0;
};

// Return the name of the currently focussed player.
PlayerCam.prototype.getPlayerName = function() {
  if (carsLoaded.length == 0) return undefined;
  return carsLoaded[this.playerIndex];
};

// Set the player to focus on.
PlayerCam.prototype.setPlayer = function(playerIndex) {
  if (carsLoaded.length == 0) return;

  this.playerIndex = playerIndex;
};

// Change the player relative to the current player.
PlayerCam.prototype.rotatePlayer = function(delta) {
  if (carsLoaded.length == 0) return;

  var nextIndex = (this.playerIndex + delta) % carsLoaded.length;
  this.setPlayer(nextIndex >= 0 ? nextIndex : nextIndex + carsLoaded.length);
};

// Handles input from the user, returning true if anything was changed.
PlayerCam.prototype.maybeHandleKey = function(which) {
  switch (which) {
    case 106: // J = previous car
      this.rotatePlayer(-1); return true;
    case 107: // K = next car
      this.rotatePlayer( 1); return true;
  }
  return false;
};

// Updates the world camera based on the current player.
PlayerCam.prototype.update = function() {
  var targetName = carsLoaded[this.playerIndex];
  var targetCar = targetName && scene.getObjectByName(targetName);
  if (!targetCar) return;

  var carRight = relativeDirection(targetCar, D_RIGHT);
  var carUp = relativeDirection(targetCar, D_UP);
  var carForward = relativeDirection(targetCar, D_FORWARD);

  var cameraSpot = targetCar.position.clone()
      .addScaledVector(carUp, CAMERA_HEIGHT)
      .addScaledVector(carForward, -CAMERA_DISTANCE)

  var cameraLook = targetCar.position.clone()
      .addScaledVector(carUp, FOCUS_DISTANCE_UP)
      .addScaledVector(carForward, FOCUS_DISTANCE_FORWARD)

  camera.position.copy(cameraSpot);
  camera.lookAt(cameraLook);
};
