var body = document.querySelector('body')

if (!!window.performance && window.performance.navigation.type === 2) {
} else {
  body.classList.add('loading')
  window.onload = function (event) {
    body.classList.add('loaded')
    var iframes = document.querySelectorAll('iframe')
    for (var i in iframes) {
      var iframe = iframes[i]
      iframe.src = iframe.name
    }
  }
}

//
//
//
//
var width = 100 // width of a progress bar in percentage
var perfData = window.performance.timing // The PerformanceTiming interface
var EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart) // Calculated Estimated Time of Page Load which returns negative value.
var time = parseInt((EstimatedTime / 1000) % 60) * 100 // Converting EstimatedTime from miliseconds to seconds.
