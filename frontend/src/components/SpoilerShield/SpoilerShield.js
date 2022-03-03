import { React, useState } from 'react';
import './SpoilerShield.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserItem, MessageList, MessageInput } from 'stream-chat-react';
import { channelReducer } from 'stream-chat-react/dist/components/Channel/channelState';
import {
  useChannelStateContext,
} from 'stream-chat-react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { PartyHeader } from '../PartyHeader/PartyHeader';

const cookies = new Cookies();

export const SpoilerShield = () => {
  const updateSpoiler = async (e) => {
    e.preventDefault();

    const userId = cookies.get('userId');
    // const { channel } = useChannelStateContext();
    // const channelId = channel.id;
    const date = channel.data.date;

    const { data: { status } } =
    await axios.post('localhost:8000/spoilerUpdate',
      { userId, channelId, date }
    );
  }

  const { channel } = useChannelStateContext();
  const channelId = channel.id;

  const spoilerStatus = cookies.get('spoilerStatus');
  let showMessages = false;
  spoilerStatus.forEach(cId => {
    if (cId.hasOwnProperty(channelId.toString())) {
      showMessages = cId[channelId.toString()];
    }
  });

  if (showMessages) {
    return (
      <div className='none'/>
    );
  } else {
    return (
      <div className='spoilerShield'>
        <p>
          Today is past {channel.data.date}. The following may contain spoilers through {channel.data.episode}.
        </p>
        <Button variant='dark' className='spoilerShield__button' onClick={() => {

        }}>I'm caught up!</Button>
      </div>
    );
  }
};

