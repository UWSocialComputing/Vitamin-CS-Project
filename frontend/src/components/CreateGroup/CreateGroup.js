import { React, useState } from 'react';
import './CreateGroup.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import Cookies from 'universal-cookie';
import { DefaultSuggestionListHeader } from 'stream-chat-react';

const cookies = new Cookies();

const URL = "http://localhost:8000/createGroup";

export const CreateGroup = () => {

  const [ value, setValue ] = useState(0);

  const handleFindGroup = async (e) => {
    let frequency = 0;
    if (document.querySelector('.range-slider__wrap input') !== null) {
      frequency = document.querySelector('.range-slider__wrap input').value;
    }
    const userId = cookies.get('userId');
    const { data: { status} } = await axios.post(`${URL}`,
      { userId, frequency }
    );
  }

  return (
    <div className="creategroup-container">
      <h1 className="creategroup-title">Start a New Watch Party</h1>
      <div className="create-text-wrapper">
        <div className="time-image"></div>
        <h6>How many episodes do you want to watch each week?</h6>
      </div>
      <RangeSlider
        value={value}
        onChange={changeEvent => setValue(changeEvent.target.value)}
        tooltip={'on'}
        min={0}
        max={7}
        step={1}
        variant={'danger'}
      />
      <div className="create-tv-wrapper">
        <div className="tv-image"></div>
        <h6>Which shows do you want to watch?</h6>
      </div>

      <Link to='/' className="find-link-wrapper">
        <Button variant='dark' className='find-group-button' onClick={handleFindGroup}>Find Group!</Button>
      </Link>
    </div>
  );
};