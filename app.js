const express = require('express')
const http = require('http')

const app = express();
const server = http.createServer(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000
let connectedPeers = [];


io.on('connection', (socket)=>{
    console.log('user connected to socket.IO server');
    connectedPeers.push(socket.id)

    socket.on('disconnect',()=>{
        console.log("socket disconnected");
        connectedPeers = connectedPeers.filter(id => id !== socket.id)
    })
})


app.use(express.static("public"))
app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/public/index.html")
})

server.listen(PORT, ()=>{
    console.log('listening on '+PORT);
})

