const express = require("express")
const Credential = require("../mongooserver/models/Credential") // new
const router = express.Router()

// Get all logins
router.get("/logins", async (req, res) => {
    const credential = await Credential.find()
    res.send(credential)
})

// register a user
router.post("/register", async (req, res) => {
    const credential = new Credential({
        username: req.body.username,
        password: req.body.password,
    })
    await credential.save()
    res.send(credential)
})

module.exports = router