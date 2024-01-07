var THREE = window.THREE
var Manager = window.Manager
var Tunnel = window.Tunnel
var projects = window.projects
var lang = window.lang

;(function () {
  var loadingManager = new THREE.LoadingManager()
  var textureLoader = new THREE.TextureLoader(loadingManager)

  var textures = []

  var tunnel
  var manager = new Manager()

  var label = document.querySelector('.label')
  var link = null

  var mouse = {x: 0, y: 0}
  var mouseFromCenter = {x: 0, y: 0}
  var target = {x: 0, y: 0}

  var halfHeight = window.innerHeight / 2
  var halfWidth = window.innerWidth / 2
  var height = window.innerHeight

  var tunnelProjects = 0
  var base_url = window.location.origin
  label.onclick = function () {
    if (link !== null) {
      window.location.href =   'work/' + link
    }
  }

  document.onmousemove = function (e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
    label.style.top = e.clientY + 'px'
    label.style.left = e.clientX + 'px'
    mouseFromCenter.x = (e.clientX - halfWidth) / halfWidth
    mouseFromCenter.y = (halfHeight - e.clientY) / halfHeight
  }

  loadingManager.onLoad = function () {
    var anisotropy = manager.renderer.capabilities.getMaxAnisotropy()
    tunnel = new Tunnel(textures, anisotropy)
    manager.scene.add(tunnel.tubeMesh)
    loop()
    document.body.classList.add('ready')
  }

  window.onresize = function () {
    halfHeight = window.innerHeight / 2
    halfWidth = window.innerWidth / 2
    height = window.innerHeight
    manager.resize()
  }

  var loop = function () {
    window.requestAnimationFrame(loop)

    target.x += (mouseFromCenter.x - target.x) / 30
    target.y += (mouseFromCenter.y - target.y) / 30

    manager.camera.rotation.z = target.x * 0.2
    manager.camera.rotation.y = Math.PI - target.x * 0.06
    manager.camera.position.x = target.x * 0.015
    manager.camera.position.y = -target.y * 0.005

    tunnel.updateCurve(target.x, target.y)
    manager.update()
    read(mouse.x, height - mouse.y)
  }

  var read = function (_x, _y) {
    manager.context.readPixels(_x, _y, 1, 1, manager.context.RGBA, manager.context.UNSIGNED_BYTE, manager.pixels)
    var hit = !(manager.pixels[0] === 0 && manager.pixels[1] === 0 && manager.pixels[2] === 0 && manager.pixels[3] === 0)
    if (hit) {
      document.body.style.cursor = 'pointer'
      var index = tunnel.currentMaterialIndex
      link = textures[index].name
      label.style.display = 'block'
    } else {
      document.body.style.cursor = 'auto'
      link = null
      label.style.display = 'none'
    }
  }

  Object.keys(projects).forEach(function (_key, _index) {
    if (typeof projects[_key].home !== 'undefined') {
      tunnelProjects = tunnelProjects + 1
      textureLoader.load(projects[_key].home[lang].url, function tex (_texture) {
        textures[_index] = _texture
        textures[_index].name = _key
      })
    }
  })

  document.body.style.height = (tunnelProjects * 3333.3333) + 'px'

  Object.keys(projects).forEach(function (_key, _index) {
    if (typeof projects[_key].home !== 'undefined' && _index !== 0) {
      var div = document.createElement('div')
      div.innerHTML = '<p class="date">' + projects[_key].month + '.' + projects[_key].date.slice(-2) + '</p>'

      div.classList.add('marker')
      div.style.top = _index * 3333.3333 + 'px'
      if (_index === 0) div.classList.add('first')
      document.getElementsByTagName('body')[0].appendChild(div)
    }
  })
})()
