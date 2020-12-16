import React, { useState } from "react";
import db from "../firebase";
import firebase from "firebase";
import { Form, Row, Col } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";

function NewComment(props) {
  const { currentUser } = useAuth();

  const [commentContent, setCommentContent] = useState("");

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // only submit if there's content
    if (commentContent !== "") {
      // add content document to 'comments' collection
      db.collection("comments").add({
        content: commentContent,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        likes: [],
        postId: props.postId,
        // user info
        profilePic: currentUser.photoURL,
        userId: currentUser.uid,
        username: currentUser.displayName,
      });

      // add notification entry ONLY if you're NOT commenting on your own post.
      if (props.userId !== currentUser.uid) {
        db.collection("notifications").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          senderProfilePic: currentUser.photoURL,
          senderUserId: currentUser.uid,
          senderUsername: currentUser.displayName,
          receiverUserId: props.userId,
          action: "commentPost",
          isRead: false,
          objectId: props.postId,
        });
      }

      // resets comment field after submitting message
      setCommentContent("");
    }
  };

  return (
    <div className="newComment">
      <Form onSubmit={handleCommentSubmit}>
        <Row>
          <Col md={12}>
            <Form.Control
              id={`addComment_${props.postId}`}
              type="text"
              placeholder="Write a comment..."
              value={commentContent}
              onChange={handleCommentChange}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default NewComment;
