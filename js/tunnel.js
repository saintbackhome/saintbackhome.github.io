var THREE = window.THREE
// Constructor function
function Tunnel (_textures, _anisotropy) {
  this.mouse = {}
  this.mouse.position = new THREE.Vector2(0, 0)
  this.mouse.target = new THREE.Vector2(0, 0)
  this.anisotropy = _anisotropy
  this.textures = _textures
  this.currentMaterialIndex = 0
  this.createMesh()
  this.offset()
  window.addEventListener('scroll', this.offset.bind(this), false)
}

Tunnel.prototype.offset = function () {
  var yoffset = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
  var scollable = document.body.scrollHeight - window.innerHeight
  var scroll = yoffset / scollable
  var index = Math.floor(scroll * this.textures.length)

  if (scroll < 0) index = 0
  else if (scroll >= 1) index = this.textures.length - 1
  if (this.currentMaterialIndex !== index) this.setTextureIndex(index)

  var o = (window.scrollY - ((scollable / this.textures.length) * index)) / (scollable / this.textures.length)
  var oo = 1.7 - (o * 2.6)
  this.tubeMesh.material[this.currentMaterialIndex].map.offset.x = -oo
}

Tunnel.prototype.createMesh = function () {
  // Empty array to store the points along the path
  var points = []

  // Define points along Z axis to create a curve
  for (var i = 0; i < 5; i += 1) {
    points.push(new THREE.Vector3(0, 0, 2.5 * (i / 4)))
  }

  // Set custom Y position for the last point
  points[4].y = -0.06
  // points[4].x = 0.2
  // points[1].x = 1

  this.curve = new THREE.CatmullRomCurve3(points)
  var splineGeometry = new THREE.Geometry()

  splineGeometry.vertices = this.curve.getPoints(70)

  this.splineMesh = new THREE.Line(splineGeometry, new THREE.LineBasicMaterial())
  this.tubeMaterials = []

  for (var materialIndex = 0; materialIndex < this.textures.length; materialIndex++) {
    this.textures[materialIndex].minFilter = THREE.LinearMipMapLinearFilter
    this.textures[materialIndex].maxFilter = THREE.LinearMipMapLinearFilter

    this.textures[materialIndex].anisotropy = this.anisotropy
    this.textures[materialIndex].wrapS = THREE.ClampToEdgeWrapping
    this.textures[materialIndex].wrapT = THREE.ClampToEdgeWrapping
    this.textures[materialIndex].repeat.set(2, 1)
    this.textures[materialIndex].flipY = false

    this.tubeMaterials[materialIndex] = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: this.textures[materialIndex],
      transparent: true,
      premultipliedAlpha: false,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.SrcColorFactor,
      needsUpdate: true

    })
  }
  this.tubeGeometry = new THREE.TubeGeometry(this.curve, 70, 0.02, 50, false)
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterials)
  this.tubeGeometry_o = this.tubeGeometry.clone()
}

Tunnel.prototype.setTextureIndex = function (_index) {
  this.currentMaterialIndex = _index

  for (var faceIndex = 0; faceIndex < this.tubeMesh.geometry.faces.length; faceIndex++) {
    this.tubeMesh.geometry.faces[faceIndex].materialIndex = _index
  }
  this.tubeMesh.geometry.elementsNeedUpdate = true
}

Tunnel.prototype.updateCurve = function (_x, _y) {
  var index = 0
  var vertices = {
    original: null,
    clone: null
  }
  // For each vertice of the tube, move it a bit based on the spline
  for (var i = 0, j = this.tubeGeometry.vertices.length; i < j; i += 1) {
    // Get the original tube vertice
    vertices.original = this.tubeGeometry_o.vertices[i]
    // Get the visible tube vertice
    vertices.clone = this.tubeGeometry.vertices[i]
    // Calculate index of the vertice based on the Z axis
    // The tube is made of 50 rings of vertices
    index = Math.floor(i / 50)
    // Update tube vertice
    vertices.clone.x += (vertices.original.x + this.splineMesh.geometry.vertices[index].x - vertices.clone.x) / 10
    vertices.clone.y += (vertices.original.y + this.splineMesh.geometry.vertices[index].y - vertices.clone.y) / 5
  }
  // Warn ThreeJs that the points have changed
  this.tubeGeometry.verticesNeedUpdate = true

  // Update the points along the curve base on mouse position
  this.curve.points[4].x = -_x * 0.1
  this.curve.points[2].y = _y * 0.02
  this.curve.points[2].x = -_x * 0.04

  // Warn ThreeJs that the spline has changed
  this.splineMesh.geometry.verticesNeedUpdate = true
  this.splineMesh.geometry.vertices = this.curve.getPoints(70)
}
