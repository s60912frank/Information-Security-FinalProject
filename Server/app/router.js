const User = require('../models/user.js');
const ChatRoom = require('../models/chatroom.js');
const jwtSecret = "gminissosmart";
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    app.post('/login', async(ctx, next) => {
        console.log(JSON.stringify(ctx.request.body));
        try {
            let user = await User.findOne({
                'name': ctx.request.body.username
            });
            if (user && ctx.request.body.password == user.password) {
                let data = {
                    "name": user.name
                };
                let token = await jwt.sign(data, jwtSecret);
                ctx.body = { "token": token };
            } else {
                ctx.body = { "error": "帳號不存在或密碼錯誤" };
            }
        } catch (e) {
            ctx.body = { "error": "伺服器錯誤" };
        }
    });

    app.post('/register', async(ctx, next) => {
        console.log(JSON.stringify(ctx.request.body));
        try {
            let user = await User.findOne({
                'name': ctx.request.body.username
            });
            if (!user) {
                let newUser = new User();
                newUser.name = ctx.request.body.username;
                newUser.password = ctx.request.body.password;
                let data = {
                    "name": newUser.name
                };
                let token = await jwt.sign(data, jwtSecret);
                ctx.body = {
                    "token": token
                };
                await newUser.save();
            } else {
                ctx.body = { "error": "帳號不存在或密碼錯誤" };
            }
        } catch (e) {
            ctx.body = { "error": "伺服器錯誤" };
        }
    });

    app.post('/verifyJwt', async(ctx, next) => {
        try {
            let decoded = await jwt.verify(ctx.request.body.token, jwtSecret);
            ctx.body = { valid: true };
        } catch (e) {
            ctx.body = { valid: false };
        }
    });

    /*app.get('/chatrooms', (ctx, next) => {
        ctx.body = "HEYYYYYYYYYYY";
    });

    app.get('/chatroom/:id', (ctx, next) => {
        ctx.body = "HEYYYYYYYYYYY";
    });*/
}