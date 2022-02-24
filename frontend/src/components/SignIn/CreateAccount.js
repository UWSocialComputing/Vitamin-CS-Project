import { useState, React } from 'react';
import './CreateAccount.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';

export const CreateAccount = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const createAccount = () => {
    if (!username || !password) {
      // error text maybe?
      return;
    }
    axios.post("http://localhost:5000/createAccount", {
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
    <div className='create-parent'>
      {loggedIn && <Navigate to="/" />}
      <div className='create-container'>
        <h1>Create Account</h1>
        <div className="create-form">
          <Form>
            <Form.Group className="username" controlId="formUsername">
              <Form.Label className="username-label">Username</Form.Label>
              <Form.Control className="username-input" type="text" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="password" controlId="formPassword">
              <Form.Label className="password-label">Password</Form.Label>
              <Form.Control className="password-input" type="text" placeholder="Enter Password" value={password} onChange={e => setPassword(e.target.value)}/>
            </Form.Group>
            <Button variant="danger" className='create-button' onClick={createAccount}>Create Account</Button>
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