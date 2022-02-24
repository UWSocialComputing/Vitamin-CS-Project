import React, { useContext } from 'react';
import { Avatar, ChatContext } from 'stream-chat-react';

import './CustomChannelPreview.css';

const shiba = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1AmDqL2HOj7N95ONvLGeG4zm1S82PRheMsA&usqp=CAU';


export const CustomChannelPreview = (props) => {
  const { channel, latestMessage, setActiveChannel, setIsCreating } = props;

  const { channel: activeChannel, client } = useContext(ChatContext);
  console.log(channel.id);

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user.id !== client.userID,
  );

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? 'channel-preview__container selected'
          : 'channel-preview__container'
      }
      onClick={() => {
        setIsCreating(false);
        setActiveChannel(channel);
      }}
    >
      <Avatar
            image={shiba}
            name={'shiba!'}
            size={18}
          />
      <div className='channel-preview__content-wrapper'>
        <div className='channel-preview__content-top'>
          <p className='channel-preview__content-name'>
            {channel.data.name}
          </p>
        </div>
        <p className='channel-preview__content-message'>{latestMessage.props.source || 'Send a message'}</p>
      </div>
    </div>
  );
};