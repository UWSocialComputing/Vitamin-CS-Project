import { useState, React } from 'react';
import './Login.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const URL = "http://localhost:8000/signup";

/**
  * CSE 481 Capstone Project - Winter 2022
  * Shaurya Jain, Elijah Greisz, Logan Wang, William Castro
  *
  * Sign Up Page
  * This page handles our sign up component. It gets the user's username and password
  * attempts to.
  */
export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
  * Updates the password state variable as the user is typing in their password.
  * @param {Event} e - Records user input of the password field.
  */
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  /**
  * Updates the username state variable as the user is typing in their username.
  * @param {Event} e - Records user input of the username field.
  */
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  /**
  * Upon form submission, it checks user input with our database's information and
  * if successful, provides the user's session cookie with their account information and
  * generates them as a new user on our platform. If it is not, it lets the user know and
  * aborts the sign up process.
  * @param {Event} e - User action of submitting the form, allowing us to require fields
  *   prior to form submission (non-blank entries).
  */
  const handlesignup = async (e) => {
    e.preventDefault();

    const { data: { token, userId, hashedPassword, message } } =
    await axios.post(`${URL}`,
      { username, password }
    );

    if (message === "created user!") {
      cookies.set('token', token);
      cookies.set('username', username);
      cookies.set('userId', userId);
      cookies.set('hashedPassword', hashedPassword);
      window.location.reload();
    } else {
      alert(message);
    }
  }

  // Checks to see if there is a token already stored, indicating a user session
  // is currently underway and they are already signed in.
  if (cookies.get('token')) return <Navigate to="/" exact/>;

  return (
    <div className='login-parent'>
      <Form onSubmit={handlesignup} className='login-container'>
        <div className='card-signup'>
          <h1 className="signup-title">Sign Up</h1>
          <Form.Group className="username" controlId="formUsername">
            <Form.Label className="username-label-signup">USERNAME</Form.Label>
            <Form.Control
              className="username-input"
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </Form.Group>
          <Form.Group className="password" controlId="formPassword">
            <Form.Label className="password-label-signup">PASSWORD</Form.Label>
            <Form.Control
              className="password-input"
              type="text"
              placeholder="Enter Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>
          <Button type="submit" variant="danger" className='login-button-one'>Create Account</Button>
        </div>
      </Form>
      <div className='create-switch'>
        <h3>Already Have An Account?</h3>
        <div className="create-text"><h6>Log into your account and start talking everything TV!</h6></div>
        <Link to="/login">
          <Button variant="default" className='create-button-one'>Sign In</Button>
        </Link>
      </div>
    </div>
  );
};