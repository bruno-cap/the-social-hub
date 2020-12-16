import React, { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import db from "../firebase";
import firebase from "firebase";
import { useAuth } from "../Context/AuthContext";
import "./CreatePost.css";

function CreatePost(props) {
  const { currentUser } = useAuth();
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    db.collection("posts").add({
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      profilePic: currentUser.photoURL,
      userId: currentUser.uid,
      username: currentUser.displayName,
      image: imageUrl,
      likes: [],
      destinationMural: props.destinationMural,
    });

    setInput("");
    setImageUrl("");
  };

  return (
    <div className="createPost">
      <Container>
        <Row>
          <Col md={1} sm={12} className="mb-2 d-none d-md-block">
            <Avatar src={currentUser.photoURL} />
          </Col>

          <Col md={11} className="pl-5">
            <Form>
              <Row>
                <Col lg={8} md={7} className="mb-2">
                  <Form.Control
                    id="inputPostText"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Tell us something nice!`}
                  />
                </Col>

                <Col lg={4} md={3} className="mb-2">
                  <Form.Control
                    id="inputPostImage"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Img URL"
                  />
                </Col>
                <Col md={1} className="mb-2 d-lg-none">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    class="btn btn-primary"
                  >
                    Post
                  </button>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col md={3}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreatePost;
