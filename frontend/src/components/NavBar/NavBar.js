import { React } from 'react';
import './NavBar.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { ReactComponent as Logo } from './../../logo.svg';

const cookies = new Cookies();

/** CSE 481 Capstone Project - Winter 2022
 * Shaurya Jain, Elijah Greisz, Logan Wang, William Castro
 *
 * Nav Bar
 * Represents Navigation Bar on the top of the website screen, dynamically
 * displaying options to sign in or log in, as well as navigation to the
 * watch party screen once signed in.
 */
export const NavBar = () => {

  /**
   * Ends the user's session, clearing necessary account information from
   * cookie information.
   */
  const logout = () => {
    cookies.remove("token");
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('hashedPassword');
    cookies.remove('spoilerStatus');
    setTimeout(() => window.location.reload(), 500);
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