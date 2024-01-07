(function () {
  var header = document.querySelector('.header')
  if (window.location.hash) {
    header.classList.add('slide--up')
  }

  new Headroom(header, {
    tolerance: {
      down: 10,
      up: 20
    },
    offset: 205,
    classes: {
      initial: 'slide',
      pinned: 'slide--reset',
      unpinned: 'slide--up'
    }
  }).init()
}())

document.body.addEventListener('mousemove', showHeader, true)

function showHeader (event) {
  if (event.clientY < 100) {
    var header = document.querySelector('.header')
    header.classList.add('slide')
    header.classList.remove('slide--up')
  }
}
