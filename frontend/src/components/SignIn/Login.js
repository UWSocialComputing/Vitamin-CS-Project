import { React, useState } from 'react';
import './Login.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const URL = "http://localhost:8000/login";

/**
  * CSE 481 Capstone Project - Winter 2022
  * Shaurya Jain, Elijah Greisz, Logan Wang, William Castro
  *
  * Login Page
  * This page handles our login component. It gets the user's username and password
  * attempts to authenticate their information and retrieve their account details.
  */
export const Login = () => {
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
  * Authenticates user input upon form submission. if user information is correct, it logs the
  * user into their account. if it is incorrect
  * @param {Event} e - User action of submitting the form, allowing us to require fields
  *   prior to form submission (non-blank entries).
  */
  const handleLogin = async (e) => {
    e.preventDefault();

    const { data: { token, userId, message} } =
    await axios.post(`${URL}`,
      { username, password }
    );


    const loginHelper = () => {
      if (message === "logged in!") {
        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('userId', userId);
        window.location.reload();
      } else {
        alert(message);
      }
    }
    setTimeout(loginHelper, 1000);
  }

  if (cookies.get('token')) return <Navigate to="/" exact/>;

  return (
    <div className='login-parent'>
      <Form onSubmit={handleLogin} className='login-container'>
        <div className='card-login'>
          <h1 className="login-title">Log In</h1>
          <Form.Group className="username" controlId="formUsername">
            <Form.Label className="username-label-login">USERNAME</Form.Label>
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
            <Form.Label className="password-label-login">PASSWORD</Form.Label>
            <Form.Control
              className="password-input"
              type="text"
              placeholder="Enter Password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </Form.Group>
          <Button
            type="submit"
            variant="danger"
            className='login-button-one'>
              Log In
          </Button>
        </div>
      </Form>
      <div className='create-switch'>
        <h3>New To Look Club?</h3>
        <div className="create-text"><h6>Create an account to start watching shows with friends today</h6></div>
        <Link to="/signup">
          <Button variant="default" className='create-button-one'>Create Account</Button>
        </Link>
      </div>
    </div>
  );
};