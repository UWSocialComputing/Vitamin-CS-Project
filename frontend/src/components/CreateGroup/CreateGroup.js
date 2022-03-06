import { React, useState } from 'react';
import './CreateGroup.css';
import Button from 'react-bootstrap/Button';
import { ButtonGroup, ToggleButton, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import Cookies from 'universal-cookie';
import { DefaultSuggestionListHeader } from 'stream-chat-react';
import Modal from 'react-bootstrap/Modal';
import { ReactComponent as Clock } from '../../Clock.svg';
import { ReactComponent as TV } from '../../TV.svg';
import { ReactComponent as Info } from '../../Info.svg';

const cookies = new Cookies();

const URL = "http://localhost:8000";

export const CreateGroup = () => {

  const [ frequency, setFrequency ] = useState(0);
  const [ createEmpty, setCreateEmpty ] = useState(false);
  const [ show, setShow ] = useState("Select Show");
  const [ popup, setPopup ] = useState('');

  const handleCreateGroup = async (e) => {
    const userId = cookies.get('userId');
    console.log({ userId, frequency })
    await axios.post(`${URL}/createGroup`,
      { userId, frequency }
    );
    setPopup("You successfully created a group.");
  }

  const handleFindGroup = async (e) => {
    const userId = cookies.get('userId');
    console.log({ userId, frequency, show })
    await axios.post(`${URL}/requestGroup`,
      { userId, frequency, tvShow: show }
    );
    setPopup("You have a pending group. We'll find some other people to join you!");
  }

  return (
    <div className='creategroup__theater'>
      <div className="creategroup-container">
        <h1 className="creategroup-title">Start a New Watch Party</h1>
        <div>
          <ButtonGroup className="creategroup__toggle">
            <ToggleButton
              key={1}
              id={`radio-${1}`}
              type="radio"
              variant="outline-danger"
              name="radio"
              checked={!createEmpty}
              onChange={() => setCreateEmpty(false)}
            >
              Random Group
            </ToggleButton>
            <ToggleButton
              key={2}
              id={`radio-${2}`}
              type="radio"
              variant="outline-danger"
              name="radio"
              checked={createEmpty}
              onChange={() => setCreateEmpty(true)}
            >
              Instant Group
            </ToggleButton>
          </ButtonGroup>
        </div>
        {!createEmpty && <div>
          <div className='info'>
            <Info className='info__icon'/>
            <h6>We'll match you with new friends who want to watch the same show as you, at the same pace. It might take a bit of time to find the right people!</h6>
          </div>
          <div className="create-text-wrapper">
          <Clock />
          <h6 className='h6'>How many episodes do you want to watch each week?</h6>
          </div>
          <RangeSlider
            value={frequency}
            onChange={changeEvent => setFrequency(changeEvent.target.value)}
            tooltip={'on'}
            min={0}
            max={7}
            step={1}
            variant={'danger'}
          />
          <div className="create-tv-wrapper">
            <TV />
            <h6 className='h6'>Which show do you want to watch?</h6>
            <DropdownButton id="dropdown-basic-button" title={show} variant="danger" className="creategroup__dropdown">
              <Dropdown.Item onClick={() => setShow("Attack on Titan")}>Attack on Titan</Dropdown.Item>
              <Dropdown.Item onClick={() => setShow("Euphoria")}>Euphoria</Dropdown.Item>
              <Dropdown.Item onClick={() => setShow("Game of Thrones")}>Game of Thrones</Dropdown.Item>
              <Dropdown.Item onClick={() => setShow("Grey's Anatomy")}>Grey's Anatomy</Dropdown.Item>
              <Dropdown.Item onClick={() => setShow("Ozark")}>Ozark</Dropdown.Item>
              <Dropdown.Item onClick={() => setShow("Space Force")}>Space Force</Dropdown.Item>
              <Dropdown.Item onClick={() => setShow("Stranger Things")}>Stranger Things</Dropdown.Item>
              <Dropdown.Item onClick={() => setShow("Vikings Valhalla")}>Vikings Valhalla</Dropdown.Item>
            </DropdownButton>
          </div>
          <Button variant='light' className='find-group-button' onClick={handleFindGroup}>Find Group!</Button>
        </div>}
        {createEmpty && <div>
          <div className='info'>
            <Info className='info__icon'/>
            <h6>Make an Instant Group and send invite links to your friends to start watching right away!</h6>
          </div>
          <Button variant='dark' className='find-group-button' onClick={handleCreateGroup}>Create Group!</Button>
        </div>}
        <Modal show={popup !== ''} onHide={() => setPopup('')}>
          <Modal.Header closeButton>
            <Modal.Title>Success!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {popup}
          </Modal.Body>
          <Modal.Footer>
            <Link to='/' className="find-link-wrapper">
              <Button variant="danger" onClick={() => {setPopup('')}}>
                Ok!
              </Button>
            </Link>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};