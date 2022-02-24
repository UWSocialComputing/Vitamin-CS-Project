import React from 'react';
import './SignIn.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

export const SignIn = () => {
  return (
    <div className='signin-parent'>
      <div className='signin-container'>
        <h1>Sign In</h1>
        <div className="signin-form">
          <Form>
            <Form.Group className="username" controlId="formUsername">
              <Form.Label className="username-label">Username</Form.Label>
              <Form.Control className="username-input" type="text" placeholder="Enter Username" />
            </Form.Group>
            <Form.Group className="password" controlId="formPassword">
              <Form.Label className="password-label">Password</Form.Label>
              <Form.Control className="password-input" type="text" placeholder="Enter Password" />
            </Form.Group>
            <Button variant="danger" className='signin-button'>Sign In</Button>
          </Form>
        </div>
      </div>
      <div className='create-switch'>
        <h3>New To Look Club?</h3>
        <div className="create-text"><h6>Sign up and start watching shows with friends today</h6></div>
        <Button variant="default" className='create-button'>Create Account</Button>
      </div>
    </div>
  );
};