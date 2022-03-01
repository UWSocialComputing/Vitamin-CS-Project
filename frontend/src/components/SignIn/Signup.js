import { useState, React } from 'react';
import './Signup.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const URL = "http://localhost:8000/signup";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const handlesignup = async (e) => {
    e.preventDefault();

    const { data: { token, userId, hashedPassword } } =
    await axios.post(`${URL}`,
      { username, password }
    );

    cookies.set('token', token);
    cookies.set('username', username);
    cookies.set('userId', userId);
    cookies.set('hashedPassword', hashedPassword);

    window.location.reload();
  }

  if (cookies.get('token')) return <Navigate to="/" exact/>;

  return (
    <div className='signup-parent'>
      <div className='signup-container'>
        <h1>Create Account</h1>
        <div className="signup-form">
          <Form onSubmit={handlesignup}>
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
            <Button type="submit" variant="danger" className='signup-button'>Create Account</Button>
          </Form>
        </div>
      </div>
      <div className='signin-switch'>
        <h3>Already Have An Account?</h3>
        <div className="signin-text"><h6>Log into your account and start talking everything TV!</h6></div>
        <Link to="/login">
          <Button variant="default" className='signin-button'>Sign In</Button>
        </Link>
      </div>
    </div>
  );
};