import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import db from "../firebase";
import "./Signup.css";

function Signup() {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const photoUrlRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Both passwords have to match!");
    }

    try {
      setError("");
      setLoading(true);
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

          // update display name and picture (to prevent excessive querying)
          firebase
            .auth()
            .currentUser.updateProfile({
              displayName:
                firstNameRef.current.value + " " + lastNameRef.current.value,
              photoURL: photoUrlRef.current.value
                ? photoUrlRef.current.value
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
            })
            .then(function () {
              console.log("Updated successfully");
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log("Error when updating");
        });
    } catch {
      setError("Failed to create an account");
    }

    setLoading(false);
    history.push("/");
  }

  return (
    <div className="signup mx-auto">
      <h2 className="text-center mb-4">Sign Up</h2>
      {error && <Alert variant="danger">{error}</Alert>}

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

        <Button disabled={loading} className="w-100" type="submit">
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
