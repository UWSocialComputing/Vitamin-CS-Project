import { useState, React } from 'react';
import './CreateAccount.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

export const CreateAccount = () => {
  return (
    <div className='create-parent'>
    <div className='create-container'>
      <h1>Create Account</h1>
      <div className="create-form">
        <Form>
          <Form.Group className="username" controlId="formUsername">
            <Form.Label className="username-label">Username</Form.Label>
            <Form.Control className="username-input" type="text" placeholder="Enter Username" />
          </Form.Group>
          <Form.Group className="password" controlId="formPassword">
            <Form.Label className="password-label">Password</Form.Label>
            <Form.Control className="password-input" type="text" placeholder="Enter Password" />
          </Form.Group>
          <Button variant="danger" className='create-button'>Create Account</Button>
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