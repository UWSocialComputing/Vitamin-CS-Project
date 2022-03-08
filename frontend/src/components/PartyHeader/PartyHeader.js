import React, { useState } from 'react';
import { Avatar, useChannelStateContext, useChatContext } from 'stream-chat-react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import './PartyHeader.css';
import Cookies from 'universal-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';

const cookies = new Cookies();

/**
  * CSE 481 Capstone Project - Winter 2022
  * Shaurya Jain, Elijah Greisz, Logan Wang, William Castro
  *
  * PARTY HEADER
  * Custom header for each watch party. Shows the party name, watch schedule, what
  * show is currently being watched, Invite button, and Settings button.
  * Users can click on each part of the party header to edit them.
  */
export const PartyHeader = () => {
  // Information about the Stream client and channel currently signed in
  const { client } = useChatContext();
  const { channel } = useChannelStateContext();
  const user = client.user;
  let currDate = new Date(user[channel.id]);
  const [dateString, setDateString] = useState(channel.data.date);

  // |show| determines which Popup to show:
  //  ['none', 'invite', 'title', 'up next', 'currently watching', 'settings']
  const [show, setShow] = useState('none');
  // Input state variables recording user typed input to customize what they are watching and
  // their group name
  const [nameInput, setNameInput] = useState(channel.data.name);
  const [watchInput, setWatchInput] = useState(channel.data.show);
  // State variables for the next episodes to be watched, and date variables to track
  // date selection and handling spoiler prevention.
  const [nextEpisode, setNextEpisode] = useState(channel.data.episode);
  const [nextDate, setNextDate] = useState((dateString === 'No Schedule Set') ? 'No Schedule Set' : new Date(dateString));
  const [currentDate, setCurrentDate] = useState((dateString === 'No Schedule Set') ? 'No Schedule Set' : new Date(dateString));

  // Opens popup specified by |type|
  const handleShow = (type) => setShow(type);

  // Called whenever a pop up edit is canceled.
  const handleCancel = () => {
    setDateString(channel.data.date);
    handleHide();
  };

  // Called whenever a popup is closed.
  const handleHide = () => {
    setShow('none');
  }

  // Removes user from current channel.
  const handleLeave = () => {
    channel.removeMembers([client.user.id]);
    setTimeout(() => window.location.reload(), 1000);
  };

  const updateAllUsers = async (response) => {
    let userId = "";
    let channelId = "";
    const date = dateString;
    response.members.forEach(async member => {
      userId = member.user_id;
      channelId = channel.id;
      await axios.post('http://localhost:8000/spoilerUpdate',
          {  userId, channelId, date }
        );
    });
  }

  /**
  * Updates channel data upon the user saving their edits.
  * @param {Event} field - classifies the save type to know what values to update.
  */
  const handleSave = async (field) => {
    switch (field) {
      case 'name':
        await channel.updatePartial({ set:{ name: nameInput}});
        break;
      case 'episode':
        await channel.updatePartial({ set: { episode: nextEpisode }});
        break;
      case 'show':
        await channel.updatePartial({ set: { show: watchInput }});
        break;
      case 'date':
        const userId = client.user.id;
        const channelId = channel.id;
        const date = nextDate.toISOString();
        await axios.post('http://localhost:8000/spoilerUpdate',
          { userId, channelId, date }
        );
        await channel.updatePartial({ set: { date: dateString}});
        await channel.updatePartial({ set: { preciseDate: date}});
        setCurrentDate(nextDate);
        let sort = {created_at: -1};
        const response = await channel.queryMembers({}, sort, {});
        setTimeout(() => updateAllUsers(response), 1000)
        break;
    }
    setShow('none');
  };

  /**
  * Calculates the next day of the week closest to the current calendar day.
  * @param {Number} day - The day of the week requested -
  *   {Sun - 0, Mon - 1, Tues - 2, Wed - 3, Thu - 4, Fri - 5, Sat - 6}
  * @returns {Date} - next date of that day. E.g. today is
  *   Saturday, March 3. If |day| == 1 (Monday), helperDate() returns Monday, March 7.
  *   If |day| == 6 (Saturday), helperDate() returns Saturday, March 12.
  */
  const helperDate = (day) => {
    const d = new Date();
    const l = new Date();
    l.setDate(d.getDate() - 2);
;   d.setDate(d.getDate() + ((7 - d.getDay()) + day));
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
  * Updates watch schedule to the next day of the week selected.
  * @param {Event} e - Option clicked with a specific associated Event Value
  */
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
    setDateString('' + (currDate.getMonth() + 1) + '/' + currDate.getDate());
    setNextDate(currDate);
  }

  const buildDateString = () => {
    if (currentDate === 'No Schedule Set') {
      return "No Schedule Set";
    } else {
      return 'by ' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate();
    }
  }

  return (
    <div className='party-header__container'>
      <div className='party-header__name-wrapper'>
        <Avatar image={null} size={50} />
        <Button onClick={() => handleShow('title')} className='party-header__title'>
          <p className='party-header__name user'>{nameInput}</p>
        </Button>
        <div className='party-header__grow' />
        <Button onClick={() => handleShow('up next')} className='party-header__details'>
          <p className='party-header__regular'> Up Next:</p>
          <p className='party-header__bold'>{nextEpisode} {buildDateString()}</p>
        </Button>
        <Button onClick={() => handleShow('currently watching')} className='party-header__details'>
          <p className='party-header__regular'>Currently Watching:</p>
          <p className='party-header__bold'>{watchInput}</p>
        </Button>
        <Button onClick={() => handleShow('invite')}variant="danger" className='party-header__button'>Invite Friends</Button>
        <Button onClick={() => handleShow('settings')}variant="danger" className='party-header__button'>Settings</Button>
      </div>

      {/* All the popups for editing Watch Party details and Inviting friends */}
      <Modal show={show === 'invite'} onHide={handleHide}>
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

      <Modal show={show === 'title'} onHide={handleHide}>
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

      <Modal show={show === 'up next'} onHide={handleHide}>
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

      <Modal show={show === 'currently watching'} onHide={handleHide}>
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

      <Modal show={show === 'settings'} onHide={handleHide}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="danger" onClick={handleLeave}>Leave Group</Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleHide}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};