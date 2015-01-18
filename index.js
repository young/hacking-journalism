// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.all("*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
});

// Routing
app.use(express.static(__dirname + '/public/views'));


app.configure('development', function(){
  app.use(express.errorHandler());
});



io.set('origins', 'http://www.youtube.com:* http://localhost:*');
// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

var userData = {};
io.on('connection', function (socket) {
  var addedUser = false;

  socket.on('click', function (data) {
    console.log(data.event);
  });
  socket.on('login', function (data) {
    socket.emit('login-ready', {'setLocation': userData[data.username] || 0});
  });
  socket.on('currentLocation', function (data) {
    userData[data.username] = data.currentLocation;
    //currentLocation = data.currentLocation;
  });

//socket.emit('connection', {'setLocation': currentLocation});

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});