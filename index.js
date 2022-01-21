const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(app);
app.get('/', (req, res) => {
    res.sendFile(__dirname+"/front.html");
});
io.on('connection', (socket)=>{
    socket.on('request_message', (msg) => {
        io.emit('response_message', msg);
    });

    socket.on('disconnect', async () => {
        console.log('user disconnected');
    });
});
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});