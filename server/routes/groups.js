const dbo = require("../db/conn");
const { connect } = require('getstream');
const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config();
const { ObjectId } = require('mongodb');

const api_key = process.env.STREAM_KEY;
const api_secret = process.env.STREAM_SECRET;

exports.spoilerCheck = async (req, res) => {
  try {
    const { userId, channelIds } = req.body;
    const client = new StreamChat(api_key, api_secret);
    const { users } = await client.queryUsers({ id: userId });

    const channelList = [];

    channelIds.forEach(channelId => {
      let update = new Date(users[0][channelId]) < new Date();
      channelList.push({ [channelId]: update });
    });

    res.status(200).json({ status: channelList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

exports.updateSpoiler = async (req, res) => {
  try {
    const { userId, channelId, date } = req.body;
    const client = new StreamChat(api_key, api_secret);

    updateCheckIn(client, userId, channelId, date);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

exports.createGroup = async (req, res) => {
  try {
    const { userId, frequency } = req.body;

    const client = new StreamChat(api_key, api_secret);

    const { users } = await client.queryUsers({ id: userId });

    if (!users.length) return res.status(400).json({ message: 'User not found' });

    const groups = dbo.getDb().collection("Groups");
    const newGroup = { members: [users[0].id] }
    await groups.insertOne(newGroup);

    const groupId = newGroup._id.toString()

    const token = users[0].token;

    const channel = client.channel('team', groupId, {
      created_by_id: users[0].id,
      name: users[0].name,
      channel_detail: { name: "Give me a name!", watching: 'Demon Slayer', frequency: frequency }
    });

    await channel.watch();

    await channel.addMembers([users[0].id]);

    updateCheckIn(client, userId, channel.id);

    res.status(200).json({ status: 100 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}

const updateCheckIn = async (client, userId, channelId, date) => {
  const update = {
    id: userId,
    set: {
      [channelId]: date
    }
  }
  await client.partialUpdateUser(update);
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

  updateCheckIn(client, await client.queryUsers({ id: userId }), channel.id);
}

// Note: The request matching code doesn't work for scale, there is no upper limit to
//  group matching which could be an issue with a lot of simultaneous requests
exports.requestGroup = async (req, res) => {
  try {
    const { userId, frequency, tvShow } = req.body;

    const pendingRequests = dbo.getDb().collection("PendingRequests");

    const result = await pendingRequests.findOne({ userId: userId, frequency: frequency, tvShow: tvShow }, {});
    if (result) return res.status(400).json({ message: "Duplicate request!" });

    const newRequest = { userId: userId, frequency: frequency, tvShow: tvShow }

    const exactFreqRequests = pendingRequests.find({ frequency: frequency, tvShow: tvShow });
    var count = exactFreqRequests.count();
    if (count >= 2) { // minimum group size of 3
      // make a group - exactFreqRequests
      const client = new StreamChat(api_key, api_secret);
      const { users } = await client.queryUsers({ id: userId });
      if (!users.length) return res.status(400).json({ message: 'User not found' });
      const groups = dbo.getDb().collection("Groups");
      const newGroup = { members: [users[0].id] }
      await groups.insertOne(newGroup);
      const groupId = newGroup._id;

      const channel = client.channel('team', groupId.toString(), { created_by_id: users[0].id }, {
        name: tvShow + " Club",
        channel_detail: { name: "Give me a name!", watching: tvShow, frequency: frequency }
      });

      await channel.watch();
      await channel.addMembers([users[0].id]);

      for await (const req of exactFreqRequests) {
        try {
          // add user to group members array
          newGroup.members.push(req.userId);
          // add user to stream channel
          const { users } = await client.queryUsers({ id: req.userId });
          if (!users.length) return res.status(400).json({ message: 'User not found' });
          await channel.addMembers([users[0].id]);
        } catch (error) {
          return res.status(500).json({ message: "error creating group: " + error });
        }
      }
      // update group in Mongo
      groups.updateOne({ _id: groupId }, { $set: { members: newGroup } })
      // delete reuests in Mongo
      pendingRequests.deleteMany({ frequency: frequency, tvShow: tvShow });
      res.status(200).json({ status: 100, message: "Group generated" });
    } else {
      const lessFreqRequests = pendingRequests.find({ frequency: frequency - 1, tvShow: tvShow })
      const moreFreqRequests = pendingRequests.find({ frequency: frequency + 1, tvShow: tvShow })
      count += lessFreqRequests.count() + moreFreqRequests.count();
      if (count >= 2) {
        // make a group - exactFreqRequests + lessFreqRequests + moreFreqRequests
        const client = new StreamChat(api_key, api_secret);
        const { users } = await client.queryUsers({ id: userId });
        if (!users.length) return res.status(400).json({ message: 'User not found' });
        const groups = dbo.getDb().collection("Groups");
        const newGroup = { members: [users[0].id] }
        await groups.insertOne(newGroup);
        const groupId = newGroup._id;

        const channel = client.channel('team', groupId.toString(), { created_by_id: users[0].id }, {
          name: tvShow + " Club",
          channel_detail: { name: "Give me a name!", watching: tvShow, frequency: frequency }
        });

        await channel.watch();
        await channel.addMembers([users[0].id]);

        for await (const req of exactFreqRequests) {
          try {
            // add user to group members array
            newGroup.members.push(req.userId);
            // add user to stream channel
            const { users } = await client.queryUsers({ id: req.userId });
            if (!users.length) return res.status(400).json({ message: 'User not found' });
            await channel.addMembers([users[0].id]);
          } catch (error) {
            return res.status(500).json({ message: "error creating group: " + error });
          }
        }

        for await (const req of lessFreqRequests) {
          try {
            // add user to group members array
            newGroup.members.push(req.userId);
            // add user to stream channel
            const { users } = await client.queryUsers({ id: req.userId });
            if (!users.length) return res.status(400).json({ message: 'User not found' });
            await channel.addMembers([users[0].id]);
          } catch (error) {
            return res.status(500).json({ message: "error creating group: " + error });
          }
        }

        for await (const req of moreFreqRequests) {
          try {
            // add user to group members array
            newGroup.members.push(req.userId);
            // add user to stream channel
            const { users } = await client.queryUsers({ id: req.userId });
            if (!users.length) return res.status(400).json({ message: 'User not found' });
            await channel.addMembers([users[0].id]);
          } catch (error) {
            return res.status(500).json({ message: "error creating group: " + error });
          }
        }

        // update group in Mongo
        groups.updateOne({ _id: groupId }, { $set: { members: newGroup } })
        // delete requests in Mongo
        pendingRequests.deleteMany({
          $and: [{ tvShow: tvShow }, {
            frequency:
              { $in: [frequency, frequency - 1, frequency + 1] }
          }]
        });
        res.status(200).json({ message: "Group generated" });
      } else {
        pendingRequests.insertOne(newRequest);
        res.status(200).json({ message: "Pending request! Check back soon" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
}
