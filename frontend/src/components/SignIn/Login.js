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

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data: { token, userId} } =
    await axios.post(`${URL}`,
      { username, password }
    );

    cookies.set('token', token);
    cookies.set('username', username);
    cookies.set('userId', userId);

    window.location.reload();
  }

  if (cookies.get('token')) return <Navigate to="/" exact/>;

  return (
    <div className='login-parent'>
      <div className='login-container'>
        <h1>Sign In</h1>
        <div className="login-form">
          <Form onSubmit={handleLogin}>
            <Form.Group className="username" controlId="formUsername">
              <Form.Label className="username-label">Username</Form.Label>
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
              <Form.Label className="password-label">Password</Form.Label>
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
                Sign In
            </Button>
          </Form>
        </div>
      </div>
      <div className='create-switch'>
        <h3>New To Look Club?</h3>
        <div className="create-text"><h6>Sign up and start watching shows with friends today</h6></div>
        <Link to="/signup">
          <Button variant="default" className='create-button-one'>Create Account</Button>
        </Link>
      </div>
    </div>
  );
};