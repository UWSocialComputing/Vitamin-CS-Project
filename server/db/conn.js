const { MongoClient } = require("mongodb");
require('dotenv').config();

const Db = process.env.ATLAS_URI; // get the ATLAS link from the environment file

const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

var _db;

module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            // Verify we got a good "db" object
            if (db) {
                // connect to the database
                _db = db.db("LookClubDatabase");
                console.log("Successfully connected to MongoDB.");
            } else {
                return callback(err);
            }
        });
    },

    getDb: function () {
        return _db;
    },
};