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

import './PartyHeader.css';

export const PartyHeader = ({ setIsEditing, setPinsOpen }) => {
  const { client } = useChatContext();
  const { closeThread } = useChannelActionContext();
  const { channel } = useChannelStateContext();

  const [show, setShow] = useState('none');
  const handleClose = () => setShow('none');
  const handleShow = (type) => setShow(type);

  const [nameInput, setNameInput] = useState("Group Name");
  const [scheduleInput, setScheduleInput] = useState("Ep1 by Wednesday");
  const [watchInput, setWatchInput] = useState("Sqiud Game");

  const teamHeader = `# ${channel.data.name || channel.data.id || 'random'}`;

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID,
    );

    return (
      <div className='party-header__name-wrapper'>
        <Avatar image={null} size={50} />
        <Button onClick={() => handleShow('title')} className='party-header__title'>
          <p className='party-header__name user'>{nameInput}</p>
        </Button>
        <div className='party-header__grow' />
        <Button onClick={() => handleShow('up next')} className='party-header__details'>
          <p className='party-header__regular'> Up Next:</p>
          <p className='party-header__bold'>{scheduleInput}</p>
        </Button>
        <Button onClick={() => handleShow('currently watching')} className='party-header__details'>
          <p className='party-header__regular'>Currently Watching:</p>
          <p className='party-header__bold'>{watchInput}</p>
        </Button>
        <Button variant="danger" className='party-header__button'>Invite Friends</Button>

        <Modal show={show === 'title'} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Group Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type='text' value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show === 'up next'} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Up Next</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type='text' value={scheduleInput} onChange={(e) => setScheduleInput(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show === 'currently watching'} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Currently Watching</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type='text' value={watchInput} onChange={(e) => setWatchInput(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
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