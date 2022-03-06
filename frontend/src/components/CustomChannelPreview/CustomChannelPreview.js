import React, { useContext } from 'react';
import { Avatar, ChatContext } from 'stream-chat-react';

import './CustomChannelPreview.css';

// Placeholder group picture
const shiba = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1AmDqL2HOj7N95ONvLGeG4zm1S82PRheMsA&usqp=CAU';

/*
  CUSTOM CHANNEL PREVIEW

  Card for a single Watch Party. Displays the group's picture, name, current show,
  and next Watch By date.
*/
export const CustomChannelPreview = (props) => {
  const { channel, setActiveChannel, setIsCreating } = props;

  const { channel: activeChannel, client } = useContext(ChatContext);

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
      <Avatar image={shiba} name={'shiba!'} size={60} />
      <div className='channel-preview__content-wrapper'>
        <div className='channel-preview__content-top'>
          <p className='channel-preview__content-name'>
            {channel.data.name}
          </p>
        </div>
        <p className='channel-preview__content-message'>{channel.data.show}</p>
        <p className='channel-preview__content-message'>{channel.data.episode} by {channel.data.date}</p>
      </div>
    </div>
  );
};