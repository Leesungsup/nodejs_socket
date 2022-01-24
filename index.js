const express = require('express');
const fs =require('fs')
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let rooms = [];
app.use('/css',express.static('./client/css'))
app.use('/js',express.static('./client/js'))
app.get('/',(req,res)=>{
    fs.readFile('./client/index.html',function(err,data){
        if(err){
            res.send(err)
        }else{
            res.writeHead(200,{'Content-Type':'text/html'})
            res.write(data)
            res.end()
        }
    })
})
/*app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front.html');
});*/
io.on('connection', (socket)=>{
    socket.on('newUser', function(name){
        console.log(name+' 님이 접속하였습니다.')
        socket.name=name
        socket.emit('update',{type:'connect',name:'SERVER',message:name+'님이 접속하였습니다.'})
    });
    socket.on('message', function(data){
        data.name=socket.name
        console.log("전달된 메시지:",data)
        socket.broadcast.emit('update',data)
    });
    socket.on('disconnect', function () {
        console.log(socket.name+'user disconnected');
        socket.broadcast.emit('update',{type:'disconnect',name:'SERVER',message:socket.name+'님이 나가셨습니다.'});
    });
});
/*io.on('connection', (socket)=>{
    socket.on('request_message', (msg) => {
        // response_message로 접속중인 모든 사용자에게 msg 를 담은 정보를 방출한다.
        io.emit('response_message', msg);
    });
    // 방참여 요청
    socket.on('req_join_room', async (msg) => {
        let roomName = 'Room_' + msg;
        console.log(roomName)
        if(!rooms.includes(roomName)) {
            rooms.push(roomName);
        }else{     
        }
        console.log(rooms)
        socket.join(roomName);
        io.to(roomName).emit('noti_join_room', "방에 입장하였습니다.");
    });
    // 채팅방에 채팅 요청
    socket.on('req_room_message', async(msg) => {
        console.log(msg)
        //let userCurrentRoom = getUserCurrentRoom(socket);
        //console.log(userCurrentRoom)
        io.to("Room_"+msg.roomName).emit('noti_room_message', msg.message);
    });
    socket.on('disconnect', async () => {
        console.log('user disconnected');
    });
});*/

/*(async function(){
})();

function getUserCurrentRoom(socket){
    let currentRoom = '';
    //console.log(socket)
    let socketRooms = Object.keys(socket.rooms);
    console.log(socketRooms)
    for( let i = 0 ; i < socketRooms.length; i ++ ){
        if(socketRooms[i].indexOf('Room_') !== -1){
            currentRoom = socketRooms[i];
            break;
        } 
    }
    return currentRoom;
}*/
const port = process.env.PORT || 5000
http.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});