var http = require('http');
const express = require('express');
const app = express();
const port = 3080;
var server = http.createServer(app);
const io = require('socket.io')(server, { cors: { origins: '*:*'}});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


io.on('connect', socket => {

  socket.on('sendMessage', (data) => {
    io.to(data.roomName).emit('message', {
      ...data,
      name: data.target,
      timestamp: Date.now()
    });
  });

  socket.on('joinRoom', (data) => {
    const room = [data['currentUser'].toLowerCase(), data['target'].toLowerCase()];
    const roomName = room.sort().join('_');
    socket.join(roomName);
    socket.emit("joinRoom", {room: roomName});
  });
});