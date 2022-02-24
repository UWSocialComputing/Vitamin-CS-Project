const express = require("express")
const mongoose = require("mongoose")
const routes = require("./routes")

mongoose
    .connect("mongodb+srv://vitaminCS:rGhSTbktyM2Xd7P7@lookclubcluster.oepok.mongodb.net/LookClubDatabase?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => {
        const app = express()
        app.use("/api", routes)

        app.listen(5000, () => {
            console.log("Server has started!")
        })
    })