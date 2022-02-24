require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const { createAccount, login } = require('./routes/accounts')
const { createGroup, getGroupInfo, updateGroupInfo } = require('./routes/groups')

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
//app.use(require("./routes/record"));
// get driver connection
const dbo = require("./db/conn");

app.post('/createAccount', createAccount);

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