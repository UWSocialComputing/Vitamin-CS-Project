import { React, useState } from 'react';
import './NavBar.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginPopup } from '../LoginPopup/loginPopup';

export const NavBar = () => {

  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className='nav-bar'>
      <div className='nav-logo'><h1>Look Club</h1></div>
      <div className="nav-options">
        <Button variant="default" className='nav-clubs'>My Clubs</Button>
        <Button variant="danger" className='nav-login' onClick={() => setLoginOpen(true)}>Log In</Button>
      </div>
      {loginOpen && <LoginPopup close={() => setLoginOpen(false)}/>}
    </div>
  );
};