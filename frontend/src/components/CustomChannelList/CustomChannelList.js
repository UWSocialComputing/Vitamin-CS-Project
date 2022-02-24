import React, { useState } from 'react';
import {
  Avatar,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { CreateGroupButton } from '../CreateGroupButton/CreateGroupButton';

import './CustomChannelList.css';

const shiba = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1AmDqL2HOj7N95ONvLGeG4zm1S82PRheMsA&usqp=CAU';

export const CustomChannelList = ({ children, error = false, loading, onCreateChannel }) => {
  const { client, setActiveChannel } = useChatContext();
  const { id, name = 'Example User' } = client.user || {};

  const ListHeaderWrapper = ({ children }) => {
    return (
      <div className='messaging__channel-list'>
        {children}
        <div className='messaging__channel-list__gap' />
        <div className='messaging__channel-list__header'>
          <button className='messaging__channel-list__header__button' onClick={onCreateChannel}>
            + New Watch Party
          </button>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
          Error loading conversations, please try again momentarily.
        </div>
      </ListHeaderWrapper>
    );
  }

  return (
    <ListHeaderWrapper>
      {children}
    </ListHeaderWrapper>
    );
};