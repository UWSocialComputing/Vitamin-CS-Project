import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList, LoadingIndicator, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import clientConfig from './clientConfig.json'
import { PartyHeader } from './components/PartyHeader/PartyHeader';
import { NavBar } from './components/NavBar/NavBar';
import { CustomChannelList } from './components/CustomChannelList/CustomChannelList';
import { channelReducer } from 'stream-chat-react/dist/components/Channel/channelState';
const apiKey = clientConfig.streamKey;

const user = {
  id: clientConfig.userID,
  name: clientConfig.userName,
  token: clientConfig.userToken
};

const filters = { members: { $in: [user.id] } };
const sort = { last_message_at: -1 };

const App = () => {
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance(apiKey);

      await client.connectUser(
        {
          id: user.id,
          name: user.name,
          image: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png',
        },
        user.token,
      );

      setChatClient(client);

      // Add channel
      // const channel = client.channel('team', 'test2', {
      //   name: 'test2',
      //   channel_detail: { watching: 'Squidward Game', nextUp: 'Ep 10 by Thursday'}
      // });

      // await channel.watch();

      // await channel.addMembers(['elijah']);

      // Query channels
      // const channels = await client.queryChannels(filters, sort, {
      //     watch: true, // this is the default
      // });

      // channels.map((channel) => {
      //         console.log(channel.data.name, channel.cid)
      //     })

      //     await channels[1].updatePartial({ set:{ name: 'test2' }});
      //     console.log('hi');
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme='messaging light'>
      <NavBar/>
      <ChannelList filters={filters} sort={sort} />
      <Channel>
        <Window>
          <PartyHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default App;