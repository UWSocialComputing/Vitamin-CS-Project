import { React, useState } from 'react';
import './SignIn.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

export const SignIn = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const signIn = () => {
    if (!username || !password) {
      // error text maybe?
      return;
    }
    axios.post("http://localhost:5000/login", {
      username,
      password
    })
    .then((res, err) => {
      // TODO: in the case of invalid credentials, show get useful response from server and display
      if (err) {
        // do something
        console.log(err);
      } else {
        if (res.data.error) {
          // error, likely user already exists
        } else {
          const token = res.data.token;
          props.setUserInfo({token, username});
          setLoggedIn(true);
        }
      }
    })
  }

  return (
    <div className='signin-parent'>
      {loggedIn && <Navigate to="/" />}
      <div className='signin-container'>
        <h1>Sign In</h1>
        <div className="signin-form">
          <Form>
            <Form.Group className="username" controlId="formUsername">
              <Form.Label className="username-label">Username</Form.Label>
              <Form.Control className="username-input" type="text" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="password" controlId="formPassword">
              <Form.Label className="password-label">Password</Form.Label>
              <Form.Control className="password-input" type="text" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)}/>
            </Form.Group>
            <Button variant="danger" className='signin-button-one' onClick={signIn}>Sign In</Button>
          </Form>
        </div>
      </div>
      <div className='create-switch'>
        <h3>New To Look Club?</h3>
        <div className="create-text"><h6>Sign up and start watching shows with friends today</h6></div>
        <Link to="/createAccount">
          <Button variant="default" className='create-button-one'>Create Account</Button>
        </Link>
      </div>
    </div>
  );
};