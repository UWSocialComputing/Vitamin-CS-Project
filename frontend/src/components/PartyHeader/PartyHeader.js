import React from 'react';
import {
  Avatar,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import './PartyHeader.css';

export const PartyHeader = ({ setIsEditing, setPinsOpen }) => {
  const { client } = useChatContext();
  const { closeThread } = useChannelActionContext();
  const { channel } = useChannelStateContext();

  const teamHeader = `# ${channel.data.name || channel.data.id || 'random'}`;

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID,
    );
    const additionalMembers = members.length - 3;

    if (!members.length) {
      return (
        <div className='party-header__name-wrapper'>
          <Avatar image={null} size={50} />
          <div className='party-header__title'>
            <p className='party-header__name user'>[Vitamin CS]</p>
            <p className='party-header__members'>[Elijah, Logan, Shaurya, Will]</p>
          </div>
          <div className='party-header__grow' />
          {/* <div className='party-header__spacer' /> */}
          <div className='party-header__details'>
            <p className='party-header__regular'> Up Next:</p>
            <p className='party-header__bold'>[Episode 1 by 1/21]</p>
          </div>
          {/* <div className='party-header__spacer' /> */}
          <div className='party-header__details'>
            <p className='party-header__regular'>Currently Watching:</p>
            <p className='party-header__bold'>[Orange is the New Black]</p>
          </div>
          <Button variant="danger" className='party-header__button'>Invite Friends</Button>
        </div>
      );
    }

    return (
      <div className='party-header__name-wrapper'>
        {members.map(({ user }, i) => {
          if (i > 2) return null;
          return (
            <div key={i} className='party-header__name-multi'>
              <Avatar image={user.image} name={user.name || user.id} size={32} />
              <p className='party-header__name user'>
                {user.name || user.id || 'Johnny Blaze'}
              </p>
            </div>
          );
        })}
        {additionalMembers > 0 && (
          <p className='party-header__name user'>{`and ${additionalMembers} more`}</p>
        )}
      </div>
    );
  };

  return (
    <div className='party-header__container'>
      {channel.type === 'messaging' ? (
        getMessagingHeader()
      ) : (
        <div className='party-header__channel-wrapper'>
          <p className='party-header__name'>{teamHeader}</p>
          <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
          </span>
        </div>
      )}
      <div className='party-header__right'>
        <div
          className='party-header__right-pin-wrapper'
          onClick={(e) => {
            closeThread(e);
          }}
        >
        </div>
      </div>
    </div>
  );
};