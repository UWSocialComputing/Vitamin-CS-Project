import React from 'react';

import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './CustomChannelList.css';

/*
  CUSTOM CHANNEL LIST

  Side bar displaying all of a user's watch parties.
*/
export const CustomChannelList = ({ children, error = false }) => {
  const ListHeaderWrapper = ({ children }) => {
    return (
      <div className='messaging__channel-list'>
        {children}
        <div className='messaging__channel-list__gap' />
        <div className='messaging__channel-list__header'>
          <Link to='/createGroup'>
            <Button variant="danger"
              className='messaging__channel-list__header__button'>
              + New Watch Party
            </Button>
          </Link>
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

  if (!children.props.children) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
            <h6 className="messaging__channel-list__messsage_empty">No Watch Parties yet!</h6>
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