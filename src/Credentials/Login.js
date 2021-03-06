import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { Link, Redirect } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import "./Login.css";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      await login(emailRef.current.value, passwordRef.current.value);
    } catch {
      setError("Error while logging in, please try again.");
    }
    return <Redirect to="/" />;
  }

  return (
    <div className="login mx-auto">
      <div className="evenRoundedBox">
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

        {/* <h2>The Social Hub</h2> */}
        <h2 className="text-center mb-4">Log In</h2>

        {/* show error messages in case of errors */}
        {error && (
          <Alert variant="danger" style={{ textAlign: "center" }}>
            {error}
          </Alert>
        )}

        <Form className="center" onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>

          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>

          <Button className="w-100" type="submit">
            Log In
          </Button>

          <div className="w-100 text-center mt-2">
            Not yet a user? <Link to="/signup">Sign Up</Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
