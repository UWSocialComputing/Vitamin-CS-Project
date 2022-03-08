import { React, useState } from 'react';
import './SpoilerShield.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  useChannelStateContext,
  useChatContext
} from 'stream-chat-react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

/**
  * CSE 481 Capstone Project - Winter 2022
  * Shaurya Jain, Elijah Greisz, Logan Wang, William Castro
  *
  * Spoiler Shield
  * Determines if the user messaging channel can be displayed or if it needs to be
  * shielded for spoilers. Shields the user if the group decides to set a watch schedule,
  * looking to watch a certain episode(s) by a recurring day of the week, and the current day is
  * past the agreed recurring day.
  */
export const SpoilerShield = () => {

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const channelId = channel.id;
  let spoilerStatus = true;
  // governs whether spoilershield needs to be displayed or not.
  // 0 === loading, 1 === no, 2 === yes
  const [showMessages, setShowMessages] = useState(0);

  /**
  * Gets information of the spoiler status of the user's session from the site cookie.
  * Sets whether to show messages or to shield them.
  */
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
  };

  setTimeout(spoilerInfo, 1000);

  /**
  * Updates the date information stored for the user and the channel to a week
  * after the milestone date.
  */
  const handleUpdate = async () => {
    const spoilers = cookies.get('spoilerStatus');
    const userId = cookies.get('userId');
    const channelId = channel.id;
    const nextDate = new Date(client.user[channelId]);
    nextDate.setDate((nextDate.getDate() + 7));
    nextDate.setHours(0, 0, 0, 0);
    const date = nextDate.toISOString();
    const { data: { status } } =
    await axios.post('http://localhost:8000/spoilerUpdate',
      { userId, channelId, date }
    );

    let newSpoilerArr = [];
    spoilers.forEach(cId => {
      if (cId.hasOwnProperty(channelId.toString())) {
        cId[channelId.toString()] = true;
        newSpoilerArr.push({[channelId.toString()]: true});
      } else {
        newSpoilerArr.push(cId);
      }
    });
    cookies.set('spoilerStatus', newSpoilerArr);
    await channel.updatePartial({ set: { date: '' + (nextDate.getMonth() + 1) + '/' + nextDate.getDate() }});
    setShowMessages(2);
    setTimeout(() => window.location.reload(), 1000);
  }

  const getDateString = (date) => {
    const d = new Date(date);
    return (d.getMonth() + 1) + '/' + d.getDate();
  }

  // Conditional rendering scheme, where if it is past the date,
  // we render the shield (showMessages === 1). If (showMessages === 2), we do
  // shield the messages. If (showMessages === 0), we have not gotten the information
  // to shield of hide so we wait a second and display nothing tentatively.
  if (showMessages === 2) {
    return (
      <div className='none'/>
    );
  } else if (showMessages === 1) {
    return (
      <div className='spoilerShield'>
        <p>
          Today is past {getDateString(client.user[channel.id])}. The following may contain spoilers through {channel.data.episode}.
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

