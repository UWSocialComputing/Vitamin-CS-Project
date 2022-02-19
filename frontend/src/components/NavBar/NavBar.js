import React from 'react';
import './NavBar.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export const NavBar = () => {
  return (
    <div className='nav-bar'>
      <div className='nav-logo'><h1>Look Club</h1></div>
      <div className="nav-options">
        <Button variant="default" className='nav-clubs'>My Clubs</Button>
        <Button variant="danger" className='nav-login'>Log In</Button>
      </div>
    </div>
  );
};