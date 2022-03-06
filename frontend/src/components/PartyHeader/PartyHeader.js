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
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';

export const PartyHeader = ( {setIsEditing} ) => {
  // const { channel, setIsEditing } = props;
  const { client } = useChatContext();
  const { closeThread } = useChannelActionContext();
  const { channel } = useChannelStateContext();

  const [show, setShow] = useState('none');
  const handleCancel = (field) => {
    switch (field) {
      case 'date':
      setNextDate(currentDate);
    }
    setShow('none');
  };

  const handleSave = async (field) => {
    setShow('none');
    switch (field) {
      case 'name':
        await channel.updatePartial({ set:{ name: nameInput}});
        break;
      case 'date':
        if (client.user[channel.id] !== 'none') {
          console.log(client.user);
          console.log(nextDate);
          const userId = client.user.id;
          const channelId = channel.id;
          const date = nextDate.toISOString();
          await axios.post('http://localhost:8000/spoilerUpdate',
            { userId, channelId, date }
          );
          await channel.updatePartial({ set: { date: '' + (nextDate.getMonth() + 1) + '/' + nextDate.getDate() }});
          setCurrentDate(nextDate);
        } else {
          await channel.updatePartial({ set: { date: 'Nothing Upcoming' }});
        }
        break;
      case 'episode':
        await channel.updatePartial({ set: { episode: nextEpisode }});
        break;
      case 'show':
        await channel.updatePartial({ set: { show: watchInput }});
        break;
    }
  }
  const handleShow = (type) => setShow(type);

  let dateString = ''
  if (client.user[channel.id] != 'none') {
    dateString = client.user[channel.id];
  } else {
    dateString = (new Date()).toISOString();
  }

  const [nameInput, setNameInput] = useState(channel.data.name);
  const [nextEpisode, setNextEpisode] = useState(channel.data.episode);
  const [nextDate, setNextDate] = useState(new Date(dateString));
  const [currentDate, setCurrentDate] = useState(new Date(dateString));
  const [watchInput, setWatchInput] = useState(channel.data.show);

  const teamHeader = `# ${channel.data.name || channel.data.id || 'random'}`;

  const helperDate = (day) => {
    const d = new Date();
    d.setDate(d.getDate() + ((7 - d.getDay()) + day));
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const getMessagingHeader = () => {
    const user = client.user;
    let currDate = new Date(user[channel.id]);
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID,
    );

    const handleDaySelect = async (e) => {
      switch (e) {
        case 'Sunday':
          currDate = helperDate(0);
          break;
        case 'Monday':
          currDate = helperDate(1);
          break;
        case 'Tuesday':
          currDate = helperDate(2);
          break;
        case 'Wednesday':
          currDate = helperDate(3);
          break;
        case 'Thursday':
          currDate = helperDate(4);
          break;
        case 'Friday':
          currDate = helperDate(5);
          break;
        case 'Saturday':
          currDate = helperDate(6);
          break;
      }
      setNextDate(currDate);
      //await client.updatePartial({ id: user.id, set: { [channel.id]: currDate.toISOString() }});
    }

    return (
      <div className='party-header__name-wrapper'>
        <Avatar image={null} size={50} />
        <Button onClick={() => handleShow('title')} className='party-header__title'>
          <p className='party-header__name user'>{nameInput}</p>
        </Button>
        <div className='party-header__grow' />
        <Button onClick={() => handleShow('up next')} className='party-header__details'>
          <p className='party-header__regular'> Up Next:</p>
          <p className='party-header__bold'>{nextEpisode} by {channel.data.date}</p>
        </Button>
        <Button onClick={() => handleShow('currently watching')} className='party-header__details'>
          <p className='party-header__regular'>Currently Watching:</p>
          <p className='party-header__bold'>{watchInput}</p>
        </Button>
        <Button onClick={() => handleShow('invite')}variant="danger" className='party-header__button'>Invite Friends</Button>

        <Modal show={show === 'invite'} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Invite Your Friends!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='party-header__regular'>Send your friends this link:</p>
            <p className='party-header__bold'>{`localhost:3000/invite/${channel.id}`}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={() => {handleSave('name')}}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show === 'title'} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Group Name</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type='text' value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {handleSave('name')}}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show === 'up next'} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Up Next</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <label>Watch Up To: </label><input type='text' value={nextEpisode} onChange={(e) => setNextEpisode(e.target.value)} />
            </div>
            <div>
              <label>Weekly Deadline: </label>
              <Dropdown onSelect={handleDaySelect}>
                <Dropdown.Toggle variant="danger" id="dropdown-date">
                  Day of the Week (Recurring)
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="Monday">By Next Monday</Dropdown.Item>
                  <Dropdown.Item eventKey="Tuesday">By Next Tuesday</Dropdown.Item>
                  <Dropdown.Item eventKey="Wednesday">By Next Wednesday</Dropdown.Item>
                  <Dropdown.Item eventKey="Thursday">By Next Thursday</Dropdown.Item>
                  <Dropdown.Item eventKey="Friday">By Next Friday</Dropdown.Item>
                  <Dropdown.Item eventKey="Saturday">By Next Saturday</Dropdown.Item>
                  <Dropdown.Item eventKey="Sunday">By Next Sunday</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {
              handleSave('date');
              handleSave('episode');
            }}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={show === 'currently watching'} onHide={handleCancel}>
          <Modal.Header closeButton>
            <Modal.Title>Currently Watching</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type='text' value={watchInput} onChange={(e) => setWatchInput(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleSave('show')}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  return (
    <div className='party-header__container'>
      {channel.type === 'team' ? (
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