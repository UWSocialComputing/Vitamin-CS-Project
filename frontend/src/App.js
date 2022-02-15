import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, ChannelList, LoadingIndicator, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import clientConfig from './clientConfig.json'
import { PartyHeader } from './components/PartyHeader/PartyHeader';
const apiKey = clientConfig.streamKey;

const user = {
  id: clientConfig.userID,
  name: clientConfig.userName,
  token: clientConfig.userToken
};

const filters = { type: 'messaging', members: { $in: [user.id] } };
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
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme='messaging light'>
      <ChannelList filters={filters} sort={sort} />
      <Channel>
        <Window>
          {/* <ChannelHeader /> */}
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