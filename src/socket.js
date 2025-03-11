const io = require('socket.io')(server);

// Store connected users
let users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register_user', (username) => {
    users[username] = socket.id;
    socket.username = username;
  });

  socket.on('call-offer', (data) => {
    // Emit call offer to the recipient user
    const recipientSocket = users[data.to];
    if (recipientSocket) {
      io.to(recipientSocket).emit("call-offer", { from: data.from, offer: data.offer });
    }
  });

  socket.on('call-answer', (data) => {
    // Emit the call answer to the caller
    const callerSocket = users[data.to];
    if (callerSocket) {
      io.to(callerSocket).emit("call-answer", { answer: data.answer });
    }
  });

  socket.on('call-reject', (data) => {
    // Emit call reject to the caller
    const callerSocket = users[data.to];
    if (callerSocket) {
      io.to(callerSocket).emit("call-reject");
    }
  });

  socket.on('ice-candidate', (data) => {
    // Emit ICE candidate to the peer
    const peerSocket = users[data.to];
    if (peerSocket) {
      io.to(peerSocket).emit("ice-candidate", { candidate: data.candidate });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.username];
  });
});
