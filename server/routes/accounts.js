const dbo = require("../db/conn");
const { StreamChat } = require('stream-chat');

const api_key = process.env.STREAM_KEY;
const api_secret=process.env.STREAM_SECRET;

const streamServer = StreamChat.getInstance(api_key, api_secret);

exports.createAccount = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.send({error: 'missing information--need username and password'});
    } else {
        // add processing and account creation
        const users = dbo.getDb().collection("Users");
        const query = {username, password};
        const existingUser = await users.findOne(query);
        if (existingUser) {
            res.send({error: 'Username already exists. Try logging in.'});
            return;
        }
        const token = streamServer.createToken(username); // using username as user_id
        const newUser = {
            "username": username,
            "password": password,
            "token": token
        }
        await users.insertOne(newUser);
        res.send({username, token});
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.send("missing information--need username and password");
    } else {
        const users = dbo.getDb().collection("Users");
        const query = {username, password};
        const existingUser = await users.findOne(query);
        if (!existingUser) {
            res.send({error: 'User doesn\'t exist. Try creating an account.'});
            return;
        }
        res.send({username: existingUser.username, token: existingUser.token});
    }
}