import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import firebase from "firebase/app";
import db from "../firebase";
import "./Signup.css";

function Signup() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const photoUrlRef = useRef();
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setErrorMessage("Both passwords have to match!");
    }

    try {
      setErrorMessage("");
      await firebase
        .auth()
        .createUserWithEmailAndPassword(
          emailRef.current.value,
          passwordRef.current.value
        )
        .then((createdUser) => {
          db.collection("users")
            .doc(createdUser.user.uid)
            .set({
              userId: createdUser.user.uid,
              firstName: firstNameRef.current.value,
              lastName: lastNameRef.current.value,
              photo: photoUrlRef.current.value
                ? photoUrlRef.current.value
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
              email: emailRef.current.value,
              friends: [],
              requestsReceived: [],
              requestsSent: [],
            });

          firebase.auth().currentUser.updateProfile({
            displayName:
              firstNameRef.current.value + " " + lastNameRef.current.value,
            photoURL: photoUrlRef.current.value
              ? photoUrlRef.current.value
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
          });
        })
        .catch((error) => {
          setErrorMessage("Error updating user document, please try again.");
        });
    } catch {
      setErrorMessage("Error creating account, please try again.");
    }

    history.push("/");
  }

  return (
    <div className="signup evenRoundedBox mx-auto">
      <div className="text-center">
        <Avatar
          src="/Images/mainLogo.png"
          alt="The Social Hub Logo"
          style={{
            width: "200px",
            height: "200px",
            display: "inline-block",
            marginBottom: "30px",
          }}
        />
      </div>
      <h2 className="text-center mb-4">Sign Up</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group id="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control type="text" ref={firstNameRef} required />
        </Form.Group>

        <Form.Group id="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control type="text" ref={lastNameRef} required />
        </Form.Group>

        <Form.Group id="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" ref={emailRef} required />
        </Form.Group>

        <Form.Group id="photoUrl">
          <Form.Label>Photo Url (optional)</Form.Label>
          <Form.Control type="text" ref={photoUrlRef} />
        </Form.Group>

        <Form.Group id="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" ref={passwordRef} required />
        </Form.Group>

        <Form.Group id="password-confirm">
          <Form.Label>Password Confirmation</Form.Label>
          <Form.Control type="password" ref={passwordConfirmRef} required />
        </Form.Group>

        <Button className="w-100" type="submit">
          Sign Up
        </Button>
      </Form>

      <div className="w-100 text-center mt-2">
        Already a user? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}

export default Signup;
