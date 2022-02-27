require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const { signup, login } = require('./routes/authenticate.js')
const { createGroup, getGroupInfo, updateGroupInfo } = require('./routes/groups')

const authRoutes = require('./routes/authenticate.js');

const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
//app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

app.post('/signup', signup);

app.post('/login', login);

app.post('/createGroup', createGroup);

app.post('/getGroupInfo', getGroupInfo);

app.post('/updateGroupInfo', updateGroupInfo);

app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});