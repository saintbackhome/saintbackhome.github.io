var THREE = window.THREE

function Manager () {
  this.scene = new THREE.Scene()

  this.camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.01, 1000)
  this.camera.position.z = 0.25
  this.camera.rotation.y = Math.PI

  this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true })
  this.renderer.context.getShaderInfoLog = function () { return '' }
  // this.renderer.sortObjects = false
  // this.renderer.setClearColor(0xffffff, 0)

  this.container = document.querySelector('.content').appendChild(this.renderer.domElement)
  this.container.width = window.innerWidth
  this.container.height = window.innerHeight

  this.context = this.container.getContext('webgl', {antialias: false, depth: false}) || this.container.getContext('experimental-webgl')
  this.pixels = new Uint8Array(4)
  this.pixelRef = [0, 0, 0, 0]

  this.resize()
}

Manager.prototype.update = function () {
  this.renderer.render(this.scene, this.camera)
}

Manager.prototype.resize = function () {
  this.renderer.setSize(window.innerWidth, window.innerHeight)
  this.camera.aspect = window.innerWidth / window.innerHeight
  this.camera.updateProjectionMatrix()
}
