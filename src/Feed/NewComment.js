import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { addComment } from "../HelperFunctions/PostAndCommentHelpers";
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
      addComment(commentContent, props.postId, currentUser, props.userId);
      // reset state value
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
              style={{ borderRadius: "10px" }}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default NewComment;
