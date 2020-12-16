import React, { useEffect, useState } from "react";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./Post.css";
import { Container, Row, Col } from "react-bootstrap";
import db from "../firebase";
import firebase from "firebase";
import Comments from "./Comments";
import NewComment from "./NewComment";
import { useAuth } from "../Context/AuthContext";

function Post(props) {
  const { currentUser } = useAuth();
  const [commentList, setCommentList] = useState([]);

  const addLike = () => {
    let found = false;
    let tempArray = props.likes;

    for (let i = 0; i < tempArray.length && !found; i++) {
      if (tempArray[i] === currentUser.uid) {
        found = true;
        tempArray.splice(i, 1);
      }
    }

    if (!found) {
      tempArray.push(currentUser.uid);
      // add notification entry ONLY if you're NOT liking your own post.
      if (props.userId !== currentUser.uid) {
        db.collection("notifications").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          senderProfilePic: currentUser.photoURL,
          senderUserId: currentUser.uid,
          senderUsername: currentUser.displayName,
          receiverUserId: props.userId,
          action: "likePost",
          isRead: false,
          objectId: props.postId,
        });
      }
    }

    db.collection("posts").doc(props.postId).update({ likes: tempArray });
  };

  const addComment = () => {
    document.getElementById(`addComment_${props.postId}`).focus();
  };

  useEffect(() => {
    // load comment list
    db.collection("comments")
      .where("postId", "==", props.postId) // use postId passed as props by parent
      .orderBy("date")
      .onSnapshot((snapshot) => {
        setCommentList(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
  }, []);

  return (
    <div className="post">
      <Container className="postInfo">
        <Row>
          <Col md={1} xs={1} className="mt-1">
            <Avatar src={props.profilePic} />
          </Col>
          <Col md={10} xs={11} className="pl-5">
            <p>{props.username}</p>
            <p>{new Date(props.timestamp?.toDate()).toUTCString()}</p>
          </Col>
        </Row>
      </Container>

      <Container className="postContent">
        <p>{props.message}</p>
        {props.image ? <img src={props.image} alt="Post" /> : ""}
        <div className="noOfLikesAndComments">
          <Row>
            <Col>
              <p>
                {props.likes.length > 0 ? (
                  <>
                    <ThumbUpAltRoundedIcon
                      style={{ maxWidth: "20px", color: "rgb(0,123,255)" }}
                    />{" "}
                    {props.likes.length}
                  </>
                ) : (
                  "Be the first to like!"
                )}
              </p>
            </Col>

            <Col className="text-right">
              {commentList.length > 0 ? (
                <>{commentList.length} comments</>
              ) : (
                "Be the first to comment!"
              )}
            </Col>
          </Row>
        </div>
      </Container>

      <Container className="postLikeComment">
        <Row>
          <Col>
            <Link
              // to=""
              onClick={addLike}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ThumbUpAltOutlinedIcon /> Like
            </Link>
          </Col>

          <Col>
            <Link
              // to=""
              onClick={addComment}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ChatBubbleOutlineOutlinedIcon /> Comment
            </Link>
          </Col>
        </Row>
      </Container>

      {commentList.map((comment) => (
        <Comments
          key={comment.id}
          id={comment.id}
          postId={props.postId}
          userId={props.userId}
          userName={props.userName}
          profilePic={props.profilePic}
          likes={comment.data.likes}
          content={comment.data.content}
          date={comment.data.date}
        />
      ))}

      <NewComment postId={props.postId} userId={props.userId} />
    </div>
  );
}

export default Post;
