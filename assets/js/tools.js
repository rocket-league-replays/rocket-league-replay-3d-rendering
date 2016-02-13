document.getElementById('child').addEventListener('change', function(e) {
  document.getElementById('controls').style.display = ''

  if (this.value == "") {
    document.getElementById('controls').style.display = 'none'
  }

  obj = scene.getObjectByName(this.value)

  document.getElementById('px').value = obj.position.x
  document.getElementById('py').value = obj.position.y
  document.getElementById('pz').value = obj.position.z

  document.getElementById('rx').value = d(obj.rotation.x)
  document.getElementById('ry').value = d(obj.rotation.y)
  document.getElementById('rz').value = d(obj.rotation.z)
}, false);

[].forEach.call(document.querySelectorAll('input[type="range"]'), function(el) {
  var handleChange = function() {
    if (document.getElementById('child').value.length === 0) {
      return;
    }

    obj = scene.getObjectByName(document.getElementById('child').value)

    if (this.id[0] == 'p') {
      obj.position[this.id[1]] = this.value
    } else if (this.id[0] == 'r') {
      obj.rotation[this.id[1]] = this.value * (Math.PI / 180)
    }
  }

  el.addEventListener('input', handleChange, false)
})
