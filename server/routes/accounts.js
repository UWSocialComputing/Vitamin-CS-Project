exports.createAccount = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.send("missing information--need username and password");
    } else {
        // add processing and account creation
        res.send("creating account");
    }
}

exports.login = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.send("missing information--need username and password");
    } else {
        // add processing, respond with token?
        res.send("successful login with username: " + username + " and password: " + password);
    }
}