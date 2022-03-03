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
import { Login } from './components/SignIn/Login';
import { Signup } from './components/SignIn/Signup';
import { CreateGroup } from './components/CreateGroup/CreateGroup';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { SpoilerShield } from './components/SpoilerShield/SpoilerShield';

const apiKey = clientConfig.streamKey;

const cookies = new Cookies();
const authToken = cookies.get("token");
const client = StreamChat.getInstance(apiKey);

if(authToken) {
  client.connectUser({
      id: cookies.get('userId'),
      name: cookies.get('username'),
      token: cookies.get('token'),
      hashedPassword: cookies.get('hashedPassword'),
  }, authToken);

  const channels = client.activeChannels;
  const channelIds = [];
  console.log(channels);

  const test = async () => {
    for (const property in channels) {
      channelIds.push(`${channels[property].id}`);
    }
    console.log(channelIds);
    const userId = cookies.get('userId');
    axios.post('http://localhost:8000/spoilerCheck',
      { userId, channelIds }
    ).then(response => {
      cookies.set('spoilerStatus', response.data.status);
    }).catch(err => {
      console.log(err);
    })
  }

  setTimeout(test, 1000);
}

const filters = { members: { $in: [cookies.get('userId')] } };
const sort = { last_message_at: -1 };
const options = { state: true, watch: true, presence: true };

const App = () => {
  const [chatClient, setChatClient] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const initChat = async () => {
      setChatClient(client);
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  const ChatScreen = () => {
    if (!authToken) return <Navigate to="/login"/>;

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
            <SpoilerShield />
            <PartyHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    );
  };

  const InviteWrapper = () => {
    const { id } = useParams();
    useEffect(() => {
      const addToGroup = async () => {
        await axios.post(`http://localhost:8000/joinGroup`,{ userId: cookies.get('userId'), channelId: id});
      }
      if (authToken) {
        addToGroup();
      }
    }, [id])

    if (!authToken) return <Navigate to="/login"/>;
    return <Navigate to="/"/>
  }

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path={'/invite/:id'} exact element={<InviteWrapper />} />
        <Route path='/createGroup' element={<CreateGroup />} />
        <Route path='/' element={<ChatScreen />} exact/>
      </Routes>
    </Router>
  );
};

export default App;