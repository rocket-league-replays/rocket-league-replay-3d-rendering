'use strict'

let currentFrame = -1
let maxFrame = -1
let frameData = {}
let carsLoading = []
let carsLoaded = []

const replays = [
  'BB773F5D4FA75E15111BC6BAFD92A982',
  '91B4E8674060C819D331C895BFEB2936',
  // '99CA134D49DC2663F1F333BB5999525A',
  'FC9C7CBA49AB5FBF72CC43BF978C2FA9',
  '05409F30417BD8F1A589D1B32318E40A'
]

function loadGameData() {
  window.dreplay.style.display = 'none';
  window.dframe.style.display = '';

  init()

  var request = new XMLHttpRequest();

  request.open('GET', `./replays/${window.replay.value}.replay.json`, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      frameData = JSON.parse(request.responseText);

      maxFrame = Object.keys(frameData).length
      currentFrame = 0
      document.getElementById('frame').setAttribute('max', maxFrame)
    }
  };

  request.send();
}

function positionReplayObjects() {
  if (carsLoading.length > 0) {
    console.warn(`Still rendering ${carsLoading}`)
  }

  frameData[currentFrame].actors.forEach(function(actor, index) {
    // Does this car already exist in the scene.
    if (actor.type == 'car') {
      const objectName = `car-${actor.id}`
      const carObject = scene.getObjectByName(objectName)

      if (carObject === undefined) {
        // Add the car.
        if (carsLoading.indexOf(objectName) === -1) {
          carsLoading.push(objectName)

          console.log(`[${objectName}] Calling addCar`)
          addCar(objectName, actor)
        }
      } else {
        // Reposition the car based on the latest data.
        if (actor.z < 0) {
          console.error('Z value below 0 at frame', currentFrame)
        }

        carObject.position.set(
          actor.x * -1,
          actor.y,
          actor.z
        )

        // PITCH SHOULD ALWAYS BE SECOND
        carObject.rotation.set(
          r(-90) + (actor.roll  * Math.PI * -1),
          r(0)   + (actor.pitch * Math.PI * -1),
          r(180) + (actor.yaw   * Math.PI * 1)
        )
      }
    } else if (actor.type == 'ball') {
      const ballObject = scene.getObjectByName('ball');
      if (ballObject === undefined) {
        console.log("Adding the ball");
        addBall(actor);
      } else {
        ballObject.position.set(
          actor.x * -1,
          actor.y,
          actor.z
        );
        // TODO: Rotate ball if it is textured.
      }

    } else {
      console.log("Unknown type: " + actor.type);
    }
  });
}

replays.forEach(function(replay) {
  var element = document.createElement('option')
  element.value = replay
  element.text = replay

  document.getElementById('replay').appendChild(element)
});
