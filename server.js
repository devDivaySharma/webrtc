let express = require('express');
let app = express();
let server = require("http").Server(app);
let PORT = process.env.PORT || 3000;
let io = require("socket.io")(server);
let {v4 : uuid4 } = require('uuid'); 

app.set('view engine','ejs');
app.use(express.static(require("path").join(__dirname,'public')));

app.get('/',(req,res) => {
    res.redirect(`/${uuid4()}`);
})

app.get('/:room',(req,res) => {
    res.render('room',{ roomId : req.params.room });
})

io.on('connection',socket => {
    socket.on('join-room',(roomId,userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected',userId);
        socket.on('disconnect',() => {
            socket.to(roomId).broadcast.emit('user-disconnected',userId);
        })
    })
})

server.listen(PORT);