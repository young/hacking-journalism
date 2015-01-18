var socket = io();
var currentLocation = 0.1;
var videoEl_ = $('.video-player');
var audioEl_ = $('.audio-player');

videoEl_.hide();
audioEl_.hide();

var username;

$(document).ready(function() {
  videoEl_.on(
    "timeupdate",
    function(event){
      onTrackedVideoFrame(this.currentTime, this.duration);
    });

  audioEl_.on(
    "timeupdate",
    function(event){
      onTrackedVideoFrame(this.currentTime, this.duration);
    });


  $(".video-player").on('loadedmetadata', function() {
    this.currentTime = 50;
  }, false);

  function onTrackedVideoFrame(currentTime, duration) {
    //socket.emit('click', {'event': 'video at ' + currentTime});
    socket.emit('currentLocation', {'currentLocation': currentTime, 'username': username });
  }
  socket.on('connection', function(data) {
    currentLocation = data.setLocation;
  });
  socket.on('login-ready', function(data) {
    var el_;
    if (true) {
      el_ = document.querySelector('.audio-player');
      el_.currentTime = Number(data.setLocation).toFixed(1);
      audioEl_.show();
      el_.play();
    } else {
      el_ = document.querySelector('.video-player');

      el_.currentTime = Number(data.setLocation).toFixed(1);

      $(".video-player").show();
      el_.play();
    }

  });


});

/**
 * The login function. Emits the username
 */
function login() {
  username = document.querySelector('.username').value;
  socket.emit('login', {'username': username});
}

/**
 * Checks
 * @return {Boolean} [description]
 */
var isIos = function() {
  return (/(iPad|iPhone|iPod)/g).test( navigator.userAgent );
};