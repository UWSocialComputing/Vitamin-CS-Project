import { React, useState } from 'react';
import './NavBar.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginPopup } from '../LoginPopup/loginPopup';
import { Link } from 'react-router-dom';

export const NavBar = () => {

  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <div className='nav-bar'>
      <div className='nav-logo'><h1>Look Club</h1></div>
      <div className="nav-options">
        <Button variant="default" className='nav-clubs'>My Clubs</Button>
        <Link to="/login">
          <Button variant="danger" className='nav-login'>Sign In</Button>
        </Link>
      </div>
      {loginOpen && <LoginPopup close={() => setLoginOpen(false)}/>}
    </div>
  );
};