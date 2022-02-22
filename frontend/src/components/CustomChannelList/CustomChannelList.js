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

export const CustomChannelList = () => {
  return (
    <div>
      <CreateGroupButton />
    </div>
  );
};