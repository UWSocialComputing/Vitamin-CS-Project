const dbo = require("../db/conn");
const { connect } = require('getstream');
const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config();

const api_key = process.env.STREAM_KEY;
const api_secret = process.env.STREAM_SECRET;

exports.createGroup = async (req, res) => {
  try {
    const { id, frequency } = req.body;

    const client = new StreamChat(api_key, api_secret);

    const { users } = await client.queryUsers({ id: id });

    if(!users.length) return res.status(400).json({ message: 'User not found' });

    const token = users[0].token;

    const channel = client.channel('team', 'temporary', {created_by_id: users[0].id}, {
      name: users[0].name,
      channel_detail: { watching: 'Demon Slayer', frequency: frequency}
    });

    await channel.watch();

    res.status(200).json({ status: 100});
} catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
}
}

exports.getGroupInfo = async (req, res) => {

}

exports.updateGroupInfo = async (req, res) => {

}

