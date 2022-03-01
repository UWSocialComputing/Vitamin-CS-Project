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

const cookies = new Cookies();

const URL = "http://localhost:8000";

export const CreateGroup = () => {

  const [ frequency, setFrequency ] = useState(0);
  const [ createEmpty, setCreateEmpty ] = useState(false);
  const [ show, setShow ] = useState("Select Show");

  const handleCreateGroup = async (e) => {
    const userId = cookies.get('userId');
    console.log({ userId, frequency })
    await axios.post(`${URL}/createGroup`,
      { userId, frequency }
    );
  }

  const handleFindGroup = async (e) => {
    const userId = cookies.get('userId');
    console.log({ userId, frequency, show })
    await axios.post(`${URL}/pendingRequest`,
    { userId, frequency, show }
  );
  }
        
  return (
    <div className="creategroup-container">
      <h1 className="creategroup-title">Start a New Watch Party</h1>
      <div>
        <ButtonGroup>
          <ToggleButton
            key={1}
            id={`radio-${1}`}
            type="radio"
            variant="outline-success"
            name="radio"
            checked={!createEmpty}
            onChange={() => setCreateEmpty(false)}
          >
            Find Group
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
            Create Empty Group
          </ToggleButton>
        </ButtonGroup>
      </div>
      {!createEmpty && <div>
        <div className="create-text-wrapper">
        <div className="time-image"></div>
        <h6>How many episodes do you want to watch each week?</h6>
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
          <div className="tv-image"></div>
          <h6>Which show do you want to watch?</h6>
          <DropdownButton id="dropdown-basic-button" title={show} variant="danger">
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
        <Link to='/' className="find-link-wrapper">
          <Button variant='dark' className='find-group-button' onClick={handleFindGroup}>Find Group!</Button>
        </Link>
      </div>}
      {createEmpty && 
        <Link to='/' className="find-link-wrapper">
          <Button variant='dark' className='find-group-button' onClick={handleCreateGroup}>Create Group!</Button>
        </Link>}
    </div>
  );
};