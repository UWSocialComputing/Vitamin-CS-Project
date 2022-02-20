import { React, useState } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
// props: {close: fn that closes this popup}
export const LoginPopup = (props) => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const loginClicked = () => {
    if (!username || !password) {
      setErrorText("Please enter a username and a password");
      return;
    }
    axios.post("http://localhost:5000/login", {
      username,
      password
    })
    .then((res, err) => {
      // TODO: in the case of invalid credentials, show get useful response from server and display
      if (err) {
        setErrorText(err);
      } else {
        console.log(res)
        props.close();
      }
    })
  }


  return (
      <Modal show={true}>
        <Modal.Header>
          <Modal.Title>Edit Group Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div> 
            <label>Username:</label>
            <input type='text' value={username} onChange={e => setUsername(e.target.value)}/>
          </div>
          <div> 
            <label>Password:</label>
            <input type='text' value={password} onChange={e => setPassword(e.target.value)}/>
          </div>
          {errorText && <p>{errorText}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close}>
            Cancel
          </Button>
          <Button variant="danger" onClick={loginClicked}>
            Log In
          </Button>
        </Modal.Footer>
      </Modal>
  );
};