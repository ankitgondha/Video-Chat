const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server)
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/peerjs', peerServer); 

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on('connection', socket =>{
  socket.on('join-room', (roomId, userId)=>{
    console.log("joined room");
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId)

    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

  //   socket.on('disconnect', () => {
  //     socket.to(roomId).broadcast.emit('user-disconnected', userId)
  // })
  })  
})
server.listen(3030);
