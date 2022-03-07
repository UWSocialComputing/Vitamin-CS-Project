const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

// get required stream info from env file
const api_key = process.env.STREAM_KEY;
const api_secret = process.env.STREAM_SECRET;
const app_id = process.env.STREAM_APP_ID;

/** Dispatched from signup endpoint. Creates
 *  an account with given information.
 * 
 * @param req request from express
 * @param res result for express
 */
exports.signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const userId = crypto.randomBytes(16).toString('hex');

        const serverClient = connect(api_key, api_secret);

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, username, userId, hashedPassword });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
};

/** Dispatched from login endpoint. Logins
 *  to an account with given info and 
 *  returns user information.
 * 
 * @param req request from express
 * @param res result for express
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        // look for user
        const { users } = await client.queryUsers({ name: username });
        if(!users.length) return res.status(400).json({ message: 'User not found' });

        // check if password is right
        const success = await bcrypt.compare(password, users[0].hashedPassword);

        // login; respond with token if success
        const token = serverClient.createUserToken(users[0].id);
        if(success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id});
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
};