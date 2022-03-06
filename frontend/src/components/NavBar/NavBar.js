import { React, useState } from 'react';
import './NavBar.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ReactComponent as Logo } from './../../logo.svg';

const cookies = new Cookies();

export const NavBar = () => {

  const logout = () => {
    cookies.remove("token");
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('hashedPassword');
    cookies.remove('spoilerStatus')
    window.location.reload();
  }

  return (
    <div className='nav-bar'>
      <div className='nav-logo'>
        <Logo className='logo'/>
        <h1>Look Club</h1>
      </div>
      <div className="nav-options">
        <Link to="/">
          <Button variant="default" className='nav-clubs'>My Clubs</Button>
        </Link>
        {!cookies.get('token') && <Link to="/login">
          <Button variant="danger" className='nav-login'>Log In</Button>
        </Link>}
        {cookies.get('token') &&
          <Button variant="danger" className='nav-login' onClick={logout}>Log Out</Button>}
      </div>
    </div>
  );
};