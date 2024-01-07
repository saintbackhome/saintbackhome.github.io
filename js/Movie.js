/* Get our eelements */
var uncanny = window.uncanny || {}
uncanny.Movie = function (_container) {
  this.container = _container
  this.video = this.container.querySelector('.player__video')
  this.states = {
    fullscreen: false,
    playing: false,
    over: false
  }

  this.controls = {
    play: this.container.querySelector('.player__play'),
    mute: this.container.querySelector('.player__mute'),
    fullscreen: this.container.querySelector('.player__fullscreen'),
    progress: this.container.querySelector('.player__progress')
  }

  /* Hook up the event listeners */
  this.video.addEventListener('mouseenter', this.enter.bind(this))
  this.video.addEventListener('mouseleave', this.leave.bind(this))
  this.video.addEventListener('mousemove', this.move.bind(this))
  document.body.addEventListener('scroll', this.move.bind(this))

  this.video.addEventListener('click', this.togglePlay.bind(this))
  this.video.addEventListener('timeupdate', this.timeupdate.bind(this))
  this.video.addEventListener('loadedmetadata', this.setprogressmax.bind(this))
  this.video.addEventListener('webkitendfullscreen', this.togglePlayMobile.bind(this))

  this.controls.play.addEventListener('click', this.togglePlay.bind(this))
  this.controls.fullscreen.addEventListener('click', this.toggleFullscreen.bind(this))
  this.controls.mute.addEventListener('click', this.toggleMute.bind(this))

  this.controls.progress.addEventListener('click', this.scrub.bind(this))
  this.fullscreenEvent()

  this.container.addEventListener('mousemove', this.userIsActive.bind(this))
  this.container.addEventListener('mouseleave', this.userIsInactive.bind(this))
  this.hideControls()
}

uncanny.Movie.prototype.enter = function () {
  console.log('entering')
  this.controls.play.classList.remove('hidden')
  this.states.over = true
}

uncanny.Movie.prototype.move = function (event) {
  var rect = event.target.getBoundingClientRect()
  var x = event.clientX - rect.left // x position within the element.
  var y = event.clientY - rect.top // y position within the element.
  this.controls.play.style.top = y + 'px'
  this.controls.play.style.left = x + 'px'
}

uncanny.Movie.prototype.leave = function () {
  console.log('leaving')
  this.controls.play.classList.add('hidden')
  this.states.over = false
}

uncanny.Movie.prototype.hideControls = function () {
  this.controls.mute.classList.add('player__controls-hidden')
  this.controls.fullscreen.classList.add('player__controls-hidden')
// this.controls.progress.classList.add('player__controls-hidden')
}

uncanny.Movie.prototype.showControls = function () {
  this.controls.mute.classList.remove('player__controls-hidden')
  this.controls.fullscreen.classList.remove('player__controls-hidden')
// this.controls.progress.classList.remove('player__controls-hidden')
}

uncanny.Movie.prototype.userIsInactive = function () {
  clearTimeout(this.controls.timeout)
  this.hideControls()
}

uncanny.Movie.prototype.userIsActive = function () {
  if (this.video.paused) return
  clearTimeout(this.controls.timeout)
  this.controls.timeout = window.setTimeout(this.userIsInactive.bind(this), 1000)
  this.showControls()
}

uncanny.Movie.prototype.fullscreenEvent = function () {
  document.addEventListener('fullscreenchange', function () {
    this.setfullscreen(this.isFullscreen())
  }.bind(this))
  document.addEventListener('webkitfullscreenchange', function () {
    this.setfullscreen(this.isFullscreen())
  }.bind(this))
  document.addEventListener('mozfullscreenchange', function () {
    this.setfullscreen(this.isFullscreen())
  }.bind(this))
  document.addEventListener('msfullscreenchange', function () {
    this.setfullscreen(this.isFullscreen())
  }.bind(this))
}

uncanny.Movie.prototype.setprogressmax = function () {
  this.controls.progress.setAttribute('max', this.video.duration)
}

uncanny.Movie.prototype.setfullscreen = function (_boolean) {
  this.container.setAttribute('data-fullscreen', !!_boolean)
}

uncanny.Movie.prototype.scrub = function (event) {
  var time = (event.offsetX / this.controls.progress.offsetWidth) * this.video.duration
  this.video.currentTime = time
}

uncanny.Movie.prototype.timeupdate = function () {
  this.controls.progress.setAttribute('value', this.video.currentTime)
}

uncanny.Movie.prototype.toggleMute = function () {
  this.video.muted = !this.video.muted
}

uncanny.Movie.prototype.togglePlay = function () {
  if (this.video.paused) {
    this.video.play()
    // this.video.classList.remove('desaturate')
    this.controls.play.innerText = ''
  } else {
    this.video.pause()
    // this.video.classList.add('desaturate')
    this.controls.play.style.display = 'block'
    this.controls.play.innerText = 'play'
  }
}

uncanny.Movie.prototype.togglePlayMobile = function () {
  console.log(this.video.paused)
  this.video.pause()
  this.video.classList.add('desaturate')
  this.controls.play.style.display = 'block'
  this.controls.play.innerText = 'play'
}

uncanny.Movie.prototype.toggleFullscreen = function () {
  this.isFullscreen() ? this.exitFullscreen() : this.enterFullscreen()
}

uncanny.Movie.prototype.enterFullscreen = function () {
  if (this.container.requestFullscreen) this.container.requestFullscreen()
  else if (this.container.mozRequestFullScreen) this.container.mozRequestFullScreen()
  else if (this.container.webkitRequestFullScreen) this.container.webkitRequestFullScreen()
  else if (this.container.msRequestFullscreen) this.container.msRequestFullscreen()
  this.container.classList.add('fullscreen')
}

uncanny.Movie.prototype.exitFullscreen = function () {
  if (document.exitFullscreen) document.exitFullscreen()
  else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
  else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen()
  else if (document.msExitFullscreen) document.msExitFullscreen()
  this.container.classList.remove('fullscreen')
}

uncanny.Movie.prototype.isFullscreen = function () {
  return !!(
  document.fullScreen ||
  document.webkitIsFullScreen ||
  document.mozFullScreen ||
  document.msFullscreenElement ||
  document.fullscreenElement
  )
}

var players = document.querySelectorAll('.player')
var movies = []
for (var i = 0; i < players.length; i++) {
  movies.push(new uncanny.Movie(players[i]))
}
