import { React, useState } from 'react';
import './SpoilerShield.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserItem, MessageList, MessageInput } from 'stream-chat-react';
import { channelReducer } from 'stream-chat-react/dist/components/Channel/channelState';
import {
  useChannelStateContext,
  useChatContext
} from 'stream-chat-react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { PartyHeader } from '../PartyHeader/PartyHeader';

const cookies = new Cookies();

export const SpoilerShield = () => {

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const channelId = channel.id;
  let spoilerStatus = true;
  const [showMessages, setShowMessages] = useState(0);


  const spoilerInfo = () => {
    const spoilers = cookies.get('spoilerStatus');
    spoilers.forEach(cId => {
      if (cId.hasOwnProperty(channelId.toString())) {
        spoilerStatus = cId[channelId.toString()];
      }
    });
    if (spoilerStatus) {
      setShowMessages(2);
    } else {
      setShowMessages(1);
    }
    console.log(cookies);
  };

  setTimeout(spoilerInfo, 1000);



  const handleUpdate = async (e) => {
    console.log(client.user);
    const spoilers = cookies.get('spoilerStatus');
    const userId = cookies.get('userId');
    const channelId = channel.id;
    const nextDate = new Date(client.user[channelId]);
    nextDate.setDate((nextDate.getDate() + 7));
    nextDate.setHours(0, 0, 0, 0);
    const date = nextDate.toISOString();
    console.log("here");
    const { data: { status } } =
    await axios.post('http://localhost:8000/spoilerUpdate',
      { userId, channelId, date }
    );

    let i = 0;
    let newSpoilerArr = [];
    spoilers.forEach(cId => {
      if (cId.hasOwnProperty(channelId.toString())) {
        cId[channelId.toString()] = true;
        newSpoilerArr.push({[channelId.toString()]: true});
      } else {
        newSpoilerArr.push(cId);
      }
      i++;
    });
    console.log("this is how the cookies used to look")
    console.log(cookies);
    cookies.set('spoilerStatus', newSpoilerArr);
    console.log("This is how they look now");
    console.log(cookies);
    await channel.updatePartial({ set: { date: '' + (nextDate.getMonth() + 1) + '/' + nextDate.getDate() }});
    setTimeout(() => console.log(client.user), 1000);
    setShowMessages(2);
  }
  if (showMessages === 2) {
    return (
      <div className='none'/>
    );
  } else if (showMessages === 1) {
    return (
      <div className='spoilerShield'>
        <p>
          Today is past {channel.data.date}. The following may contain spoilers through {channel.data.episode}.
        </p>
        <Button variant='dark' className='spoilerShield__button' onClick={handleUpdate}>I'm caught up!</Button>
      </div>
    );
  } else {
    return (
      <div className='spoilerShield'>

      </div>
    );
  }
};

