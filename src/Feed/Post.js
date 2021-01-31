import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import { Avatar } from "@material-ui/core";
import "./Post.css";
import { Container, Row, Col } from "react-bootstrap";
import db from "../firebase";
import Comments from "./Comments";
import NewComment from "./NewComment";
import { useAuth } from "../Context/AuthContext";
import { formatLongDateDifference } from "../HelperFunctions/DateHelpers";
import * as postAndCommentHelpers from "../HelperFunctions/PostAndCommentHelpers";

function Post(props) {
  const { currentUser } = useAuth();
  const [commentList, setCommentList] = useState([]);
  const [dateInfo, setDateInfo] = useState(
    formatLongDateDifference(props.timestamp)
  );

  const addLike = () => {
    postAndCommentHelpers.addLikePost(
      props.likes,
      props.postId,
      currentUser,
      props.userId
    );
  };

  const addComment = () => {
    document.getElementById(`addComment_${props.postId}`).focus();
  };

  const removePost = () => {
    postAndCommentHelpers.removePost(props.postId);
  };

  useEffect(() => {
    // load comment list
    const unsubscribe = db
      .collection("comments")
      .where("postId", "==", props.postId)
      .orderBy("date")
      .onSnapshot((snapshot) => {
        setCommentList(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [props.postId]);

  // update the dateInfo hook every minute to get updated timestamps for the messages
  useEffect(() => {
    const interval = setInterval(() => {
      setDateInfo(formatLongDateDifference(props.timestamp));
    }, 60 * 1000); // run every minute
    return () => clearInterval(interval);
  }, [props.timestamp]);

  return (
    <div className="post evenRoundedBox">
      <Container className="postInfo">
        <Row>
          <Col md={1} xs={1} className="mt-1 px-0">
            <Link to={`/user/${props.userId}`}>
              <Avatar src={props.profilePic} alt="Profile Pic" />
            </Link>
          </Col>
          <Col xs={10} className="pl-4 pl-sm-3 pl-md-2 pl-lg-4 pl-xl-3 pr-0">
            <Link to={`/user/${props.userId}`} style={{ color: "inherit" }}>
              <p>{props.username}</p>
            </Link>
            <p className="d-inline-block">{dateInfo ? dateInfo : "now"}</p>
          </Col>
          {/* Show option to delete post if the user logged in is the one who created it */}
          <Col xs={1} className="px-0 text-right">
            {currentUser.uid === props.userId && (
              <p className="d-inline-block">
                <span
                  className="looksLikeLink"
                  style={{ color: "black" }}
                  onClick={removePost}
                >
                  x
                </span>
              </p>
            )}
          </Col>
        </Row>
      </Container>

      {/* post message and image */}
      <p>{props.message}</p>
      <div className="text-center">
        {props.image && <img src={props.image} alt="Post Pic" />}
      </div>

      <Container className="postContent" style={{ padding: "0" }}>
        <Row className="noOfLikesAndComments py-1" style={{ margin: "0" }}>
          <Col
            className="d-flex align-items-center"
            style={{
              padding: "0",
              minHeight: "30px",
            }}
          >
            <p className="d-inline-block my-0">
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

          <Col
            className="d-flex align-items-center justify-content-end"
            style={{
              margin: "0",
              padding: "0",
            }}
          >
            <p className="d-none d-sm-inline-block my-0 ">
              {commentList.length === 0 ? (
                "Be the first to comment!"
              ) : commentList.length === 1 ? (
                <>{commentList.length} comment</>
              ) : (
                <>{commentList.length} comments</>
              )}
            </p>

            <p className="d-inline-block d-sm-none my-0 ">
              {commentList.length === 0 ? (
                "No comments yet!"
              ) : commentList.length === 1 ? (
                <>{commentList.length} comment</>
              ) : (
                <>{commentList.length} comments</>
              )}
            </p>
          </Col>
        </Row>
      </Container>

      <Container
        className="postLikeComment my-0"
        style={{
          borderBottom: commentList.length > 0 && "1px solid lightgray",
        }}
      >
        <Row>
          <Col className="looksLikeLink" onClick={addLike}>
            <p
              style={{
                textDecoration: "none",
                color: props.likes.includes(currentUser.uid)
                  ? "rgb(0,123,255)"
                  : "inherit",
              }}
            >
              <ThumbUpAltOutlinedIcon /> Like
            </p>
          </Col>

          <Col className="looksLikeLink" onClick={addComment}>
            <p style={{ textDecoration: "none", color: "inherit" }}>
              <ChatBubbleOutlineOutlinedIcon /> Comment
            </p>
          </Col>
        </Row>
      </Container>

      {commentList.map((comment) => (
        <Comments
          key={comment.id}
          commentId={comment.id}
          postId={comment.data.postId}
          userId={comment.data.userId}
          userName={comment.data.username}
          profilePic={comment.data.profilePic}
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
