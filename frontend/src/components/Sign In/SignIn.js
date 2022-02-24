import React from 'react';
import './SignIn.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export const SignIn = () => {
  return (
    <div className='sign-in-parent'>
      <div className='account-container'>
        <h1>Sign In</h1>
        <label for='newuser'>Username</label>
        <input type='text' id='newuser' name='username' required></input>
        <label for='newpassword'>Password</label>
        <input type='text' id='newpassword' name='password' required></input>
      </div>
      <div className='signin-container'>
        <h1>Already Have An Account?</h1>
        <div><h3>Log into your account and start talking everything TV!</h3></div>
        <div><Button variant="default" className='sign-button'>Sign In</Button></div>
      </div>
      <div className='create-acc-container'>
        <h1>New To Look Club?</h1>
        <div><h3>Sign up and start watching shows with friends today</h3></div>
        <div><Button variant="default" className='create-acc-button'>Create Account</Button></div>
      </div>
    </div>
  );
};