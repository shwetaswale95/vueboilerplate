const io = require('socket.io')(server);

// Store connected users
let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register_user', (username) => {
    users[username] = socket.id;
    socket.username = username;
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.username];
  });
});
