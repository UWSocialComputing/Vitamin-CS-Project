const dbo = require("../db/conn");
const { connect } = require('getstream');
const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config();
const { ObjectId } = require('mongodb');

const api_key = process.env.STREAM_KEY;
const api_secret = process.env.STREAM_SECRET;

exports.createGroup = async (req, res) => {
  try {
    const { userId, frequency } = req.body;

    const client = new StreamChat(api_key, api_secret);

    const { users } = await client.queryUsers({ id: userId });

    if (!users.length) return res.status(400).json({ message: 'User not found' });

    const groups = dbo.getDb().collection("Groups");
    const newGroup = { members: [users[0].id] }
    await groups.insertOne(newGroup);

    const groupId = newGroup._id.toString();

    const channel = client.channel('team', groupId, {
      created_by_id: userId,
      name: "Give me a name!",
      show: 'Demon Slayer',
      frequency: frequency 
    });

    await channel.watch();

    await channel.addMembers([users[0].id]);

    res.status(200).json({ status: 100 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

exports.joinGroup = async (req, res) => {
  const { userId, channelId } = req.body;

  const client = new StreamChat(api_key, api_secret);
  const channel = client.channel('team', channelId);
  const groups = dbo.getDb().collection("Groups");

  const group = await groups.findOne({ "_id": new ObjectId(channelId) });
  const members = group.members;

  if (members.indexOf(userId) == -1) {
    members.push(userId)
    groups.updateOne({ "_id": new ObjectId(channelId) }, { $set: { members } })
  }

  channel.addMembers([userId])
}

// Note: The request matching code doesn't work for scale, there is no upper limit to  
//  group matching which could be an issue with a lot of simultaneous requests
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
    console.log('count: ' + count);

    if (count >= 2) { // minimum group size of 3 from the same frequency
      console.log('making a group');

      const newGroup = { members: [userId] }

      const matchedRequests = pendingRequests.find({
        $and: [{ tvShow: tvShow },
        { frequency: { $in: [intFreq, intFreq - 1, intFreq + 1] } }]
      }, { "userId": 1, _id: 0 });

      matchedRequests.forEach(function (request) {
        newGroup.members.push(request.userId);
      });

      pendingRequests.deleteMany({
        $and: [{ tvShow: tvShow }, {
          frequency:
            { $in: [intFreq, intFreq - 1, intFreq + 1] }
        }]
      });

      const groups = dbo.getDb().collection("Groups");
      await groups.insertOne(newGroup);
      const groupId = newGroup._id;

      const client = new StreamChat(api_key, api_secret);
      const channel = client.channel('team', groupId.toString(), { created_by_id: userId }, {
        name: tvShow + " Club",
        channel_detail: { name: "Give me a name!", watching: tvShow, frequency: intFreq }
      });
      console.log(newGroup.members);
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
