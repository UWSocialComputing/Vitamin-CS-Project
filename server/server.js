require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const { signup, login } = require('./routes/authenticate.js')
const { createGroup, joinGroup, requestGroup, spoilerCheck, spoilerUpdate } = require('./routes/groups.js')

const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
//app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

/*
* Signup endpoint to signup a new user.
* Requires a username and password.
* On success, returns user information, including token.
*/
app.post('/signup', signup);

/*
* Login endpoint to login.
* Requires a username and password.
* On success, returns user information, including token.
*/
app.post('/login', login);

/*
* Endpoint to create a new group.
* Requires a userId. Creates a single group with that user.
*/
app.post('/createGroup', createGroup);

/*
* Endpoint to join an existing group.
* Requires a userId and the channelId
* of the channel to join.
*/
app.post('/joinGroup', joinGroup);

/*
* Endpoint to make a pending request for a group.
* Requires a userId, a tvShow, and a frequency. 
* Will create a group with that user once enough others
* make a similar request.
*/
app.post('/requestGroup', requestGroup);

/*
* Updates a single user to have "checked in".
* Requires the userId, the channelId being checked into,
* and the date of the check in.
*/
app.post('/spoilerCheck', spoilerCheck);

/*
* Gets spoiler information for a list of channels.
* Requires userId and channelIds.
* Returns a list of channels with update status. 
*/
app.post('/spoilerUpdate', spoilerUpdate);

// sets up express server
app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});