'use strict'

const CAMERA_HEIGHT = 90;
const CAMERA_DISTANCE = 200;
const FOCUS_DISTANCE_UP = 70;
const FOCUS_DISTANCE_FORWARD = 50;

// Wrap camera with logic to follow a player.
function PlayerCam(threeCamera) {
  this.camera = threeCamera;
  this.playerIndex = 0;
  this.ballCam = true;
};

// Change whether using ball or forwards cam.
PlayerCam.prototype.toggleBallCam = function() {
  this.ballCam = !this.ballCam;
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
    case 106: // j = previous car
      this.rotatePlayer(-1); return true;
    case 107: // k = next car
      this.rotatePlayer( 1); return true;
    case 98:  // b = toggle ball cam.
      this.toggleBallCam(); return true;
  }
  return false;
};

// Updates the world camera based on the current player.
PlayerCam.prototype.update = function() {
  var targetName = carsLoaded[this.playerIndex];
  var targetCar = targetName && scene.getObjectByName(targetName);
  if (!targetCar) return;

  var cameraSpot, cameraLook;

  if (this.ballCam) {
    // BALL CAM
    var ballObject = scene.getObjectByName('ball');
    if (!ballObject) return;

    var ballPos = ballObject.position.clone();
    var carPos = targetCar.position.clone();

    // carPos + dist * norm(carPos - ballPos) + height * UP
    var ballToCar = carPos.clone().sub(ballPos).normalize();
    cameraSpot = carPos
        .addScaledVector(ballToCar, CAMERA_DISTANCE)
        .addScaledVector(D_UP, CAMERA_HEIGHT);

    cameraLook = ballPos;
  } else {
    // PLAYER CAM
    var carRight = relativeDirection(targetCar, D_RIGHT);
    var carUp = relativeDirection(targetCar, D_UP);
    var carForward = relativeDirection(targetCar, D_FORWARD);
    cameraSpot = targetCar.position.clone()
        .addScaledVector(carRight, 1.2 * CAMERA_HEIGHT) // HACK - right, instead of up?
        .addScaledVector(carForward, -CAMERA_DISTANCE)
    cameraLook = targetCar.position.clone()
        .addScaledVector(carRight, FOCUS_DISTANCE_UP)
        .addScaledVector(carForward, -FOCUS_DISTANCE_FORWARD)
  }
  

  camera.position.copy(cameraSpot);
  camera.lookAt(cameraLook);
};
