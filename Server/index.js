let port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
let ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

const koa = require('koa');
const app = new koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(require('./config/db.js').url);

app.use(bodyParser());
app.use(require('koa-static')(__dirname + '/public'));
app.use(router.allowedMethods());
//router always擺最後
app.use(router.routes());

require('./app/router.js')(router);

let crypto = require('crypto');
let secret = crypto.randomBytes(32).toString("base64");

const ChatRoom = require('./models/chatroom.js');

const io = require('socket.io')(app.server);
const socketioJwt = require("socketio-jwt");
io.use(socketioJwt.authorize({
  secret: "gminissosmart", //這個之後可能要寫在別的地方
  handshake: true
}));

io.on('connection', async (socket) => {
    console.log('hello! ', socket.decoded_token.name);
    let roomList = await ChatRoom.find({}, { "key": 0, "messages":0 }); //TODO: try-catch
    socket.on('getRoomList', () => {
        socket.emit('roomList', roomList);
    });
    socket.on('joinRoom', async (roomId) => {
        let room = await ChatRoom.findOne({ '_id': roomId }); //TODO: try-catch
        if(room){
            socket.join(roomId);
            socket.emit('room', {
                _id: roomId,
                name: room.name,
                history: room.messages,
                key: room.key
            });
            console.log('JOIN成功!');
            chat(socket, room);
        }
        else{
            //room不存在
            console.log('JOIN失敗!');
        }
    });

    socket.on('createRoom', async (room) => {
        let newRoom = new ChatRoom();
        newRoom.name = room.name;
        newRoom.owner = socket.decoded_token.name;
        //socket.join(newRoom._id);
        io.emit('room', {
            _id: newRoom._id,
            name: newRoom.name,
            key: newRoom.key
        });
        await newRoom.save();
    });

    socket.on('deleteRoom', async (roomName) => {
        // 刪房間做到一半
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room._id);
    });
});

let chat = async (socket, room) => {
    console.log('hi');
    socket.on('msg', async (msg) => {
        console.log('message: ' + msg);
        io.to(room._id).emit("msg", msg);
        room.messages.push(msg);
        await room.save(); //TODO: try-catch
    });
}

// launch ======================================================================
//io.listen(app.listen(port, ip_address, () => console.log('The magic happens on port ' + port)));
//debug用
io.listen(app.listen(port, () => console.log('The magic happens on port ' + port)));