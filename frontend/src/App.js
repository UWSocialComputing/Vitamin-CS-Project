import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList, LoadingIndicator, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import './App.css';
import clientConfig from './clientConfig.json'
import { PartyHeader } from './components/PartyHeader/PartyHeader';
import { NavBar } from './components/NavBar/NavBar';
import { CustomChannelList } from './components/CustomChannelList/CustomChannelList';
import { CustomChannelPreview } from './components/CustomChannelPreview/CustomChannelPreview';
import { SignIn } from './components/SignIn/SignIn';
import { CreateAccount } from './components/SignIn/CreateAccount';
import { CustomMessage } from './components/CustomMessage/CustomMessage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const apiKey = clientConfig.streamKey;

const user = {
  id: clientConfig.userID,
  username: clientConfig.userName,
  token: clientConfig.userToken
};

const sort = { last_message_at: -1 };
const options = { state: true, watch: true, presence: true };

const App = () => {
  const [chatClient, setChatClient] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [userInfo, setUserInfo] = useState({username: user.id, token: user.token});

  useEffect(() => {

    const initChat = async () => {
      const client = StreamChat.getInstance(apiKey);
      await client.connectUser(
        {
          id: user.username,
          name: user.username,
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
  const ChatScreen = () => {
    const filters = { members: { $in: [user.username] } };
    return (
      <Chat client={chatClient} theme='messaging light'>
        <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            List={(props) => (
              <CustomChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />
            )}
            Preview={(props) => <CustomChannelPreview {...props} {...{ setIsCreating }} />}
          />
        <Channel>
          <Window>
            <PartyHeader />
            <MessageList messages={CustomMessage}/>
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );
  };

  

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/login' element={<SignIn setUserInfo={setUserInfo} />} />
        <Route path='/createAccount' element={<CreateAccount setUserInfo={setUserInfo}/>} />
        <Route path='/' element={<ChatScreen />} />
      </Routes>
    </Router>
  );
};

export default App;