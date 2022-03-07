const dbo = require("../db/conn");
const { connect } = require('getstream');
const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config();
const { ObjectId } = require('mongodb');

const api_key = process.env.STREAM_KEY;
const api_secret = process.env.STREAM_SECRET;

/** Gets spoiler information for 
 *  a list of channels for a specific 
 *  user.
 * 
 * @param req request from express
 * @param res result for express
 */
exports.spoilerCheck = async (req, res) => {
  try {
    const { userId, channelIds } = req.body;
    const client = new StreamChat(api_key, api_secret);
    // get user
    const { users } = await client.queryUsers({ id: userId });

    const channelList = [];

    // update each channel
    channelIds.forEach(channelId => {
      let update = new Date(users[0][channelId]) > new Date();
      channelList.push({ [channelId]: update });
    });

    res.status(200).json({ status: channelList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

/** Updates spoiler information for a specific user and channel
 *  to a specific date.
 * 
 * @param req request from express
 * @param res result for express
 */
exports.spoilerUpdate = async (req, res) => {
  try {
    const { userId, channelId, date } = req.body;
    const client = new StreamChat(api_key, api_secret);
    updateCheckIn(client, userId, channelId, date);
    res.status(200).json({ status: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

/** Creates a group with a single user.
 * 
 * @param req request from express
 * @param res result for express
 */
exports.createGroup = async (req, res) => {
  try {
    const { userId } = req.body;

    const client = new StreamChat(api_key, api_secret);

    // get user
    const { users } = await client.queryUsers({ id: userId });
    if (!users.length) return res.status(400).json({ message: 'User not found' });

    // get groups, insert new one
    const groups = dbo.getDb().collection("Groups");
    const newGroup = { members: [users[0].id] }
    await groups.insertOne(newGroup);

    const groupId = newGroup._id.toString()

    // create new stream channel
    const channel = client.channel('team', groupId, {
      created_by_id: userId,
      name: "Give me a name!",
      show: 'Choose a show'
    });

    await channel.watch();

    // add user to channel and "check in"
    await channel.addMembers([users[0].id]);
    updateCheckIn(client, userId, channel.id);

    res.status(200).json({ status: 100 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

/** 
 * Checks in a single user to a channel.
 * 
 */
const updateCheckIn = async (client, userId, channelId, date) => {
  const update = {
    id: userId,
    set: {
      [channelId]: date
    }
  }
  await client.partialUpdateUser(update);
}

/** Joins a user into a channel.
 * 
 * @param req request from express
 * @param res result for express
 */
exports.joinGroup = async (req, res) => {
  const { userId, channelId } = req.body;

  const client = new StreamChat(api_key, api_secret);
  const channel = client.channel('team', channelId);
  const groups = dbo.getDb().collection("Groups");

  // find matching channel
  const group = await groups.findOne({ "_id": new ObjectId(channelId) });
  const members = group.members;

  // if this user is not already there, add them
  if (members.indexOf(userId) == -1) {
    members.push(userId)
    groups.updateOne({ "_id": new ObjectId(channelId) }, { $set: { members } })
  }

  channel.addMembers([userId])

  // check in user
  updateCheckIn(client, await client.queryUsers({ id: userId }), channel.id);
}

/** Makes a pending request for a user with
 * a TV show and frequency. If there are enough
 * matches, will create a group.
 * 
 * @param req request from express
 * @param res result for express
 */
exports.requestGroup = async (req, res) => {
  try {
    const { userId, frequency, tvShow } = req.body;
    const intFreq = parseInt(frequency);
    const pendingRequests = dbo.getDb().collection("PendingRequests");
    const newRequest = { userId: userId, frequency: intFreq, tvShow: tvShow }

    // check if it's a duplicate request
    const result = await pendingRequests.findOne(newRequest);
    if (result) return res.status(400).json({ message: "Duplicate request!" });

    const count = await pendingRequests.countDocuments({ frequency: intFreq, tvShow: tvShow });

    if (count >= 2) { // minimum group size of 3 from the same frequency

      const newGroup = { members: [userId] }

      // get the requests that match
      const matchedRequests = pendingRequests.find({
        $and: [{ tvShow: tvShow },
        { frequency: { $in: [intFreq, intFreq - 1, intFreq + 1] } }]
      }, { "userId": 1, _id: 0 });

      // create a list of all the members
      matchedRequests.forEach(function (request) {
        newGroup.members.push(request.userId);
      });

      // remove the pending requests
      pendingRequests.deleteMany({
        $and: [{ tvShow: tvShow }, {
          frequency:
            { $in: [intFreq, intFreq - 1, intFreq + 1] }
        }]
      });

      // add this group into DB
      const groups = dbo.getDb().collection("Groups");
      await groups.insertOne(newGroup);
      const groupId = newGroup._id;

      // create channel in stream
      const client = new StreamChat(api_key, api_secret);
      const channel = client.channel('team', groupId.toString(), {
        created_by_id: userId,
        name: `${tvShow} Club`,
        show: tvShow,
        frequency: frequency
      });
      
      await channel.watch();
      await channel.addMembers(newGroup.members);

      res.status(200).json({ status: 100, message: "Group generated" });
    } else {
      pendingRequests.insertOne(newRequest);
      res.status(200).json({ message: "Pending request! Check back soon" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}
