(function () {
  var works = document.querySelectorAll('.work')
  var menu = document.querySelector('.menu')
  var overlay = document.querySelector('.menu-overlay')

  for (var i = 0; i < works.length; i++) {
    works[i].addEventListener('click', showMenu, true)
  }

  function showMenu () {
    document.body.classList.add('static')
    overlay.classList.add('visible')
    document.body.addEventListener('click', hideMenu, true)
  }

  function hideMenu (e) {
    if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(' menu ') > -1) {
      // overlay.style.display = 'none'
      // menu.style.display = 'none'
    } else {
      document.body.removeEventListener('click', hideMenu)
      document.body.classList.remove('static')
      overlay.classList.remove('visible')

      // overlay.style.display = 'none'
    }
  }
}())
