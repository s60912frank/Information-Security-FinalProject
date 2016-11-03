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

const io = require('socket.io')(app.server);
const socketioJwt = require("socketio-jwt");
io.use(socketioJwt.authorize({
  secret: "gminissosmart", //這個之後可能要寫在別的地方
  handshake: true
}));

io.on('connection', async (socket) => {
    console.log('hello! ', socket.decoded_token.name);
    let roomList = await ChatRoom.find({}, { "key": 0, "messages":0 }); //TODO: try-catch
    socket.emit('roomList', roomList);
    //socket.emit("secret", secret);
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
        }
        else{
            //room不存在
        }
        //console.log('message: ' + msg);
        //io.emit("msg", msg);
    });

    socket.on('createRoom', async (room) => {
        let newRoom = new ChatRoom();
        newRoom.name = room.name;
        socket.join(newRoom._id);
        socket.emit('room', {
            _id: roomId,
            name: room.name,
            history: room.messages,
            key: room.key
        });
        await newRoom.save();
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room._id);
    });
});

let chat = async (socket, room) => {
    socket.on('msg', async (msg) => {
        console.log('message: ' + msg);
        io.to(room._id).emit("msg", msg);
        room.messages.append(msg);
        await room.save(); //TODO: try-catch
    });
}

io.listen(app.listen(3000));