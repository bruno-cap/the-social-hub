import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import { useAuth } from "../Context/AuthContext";
import { formatShortDateDifference } from "../HelperFunctions/DateHelpers";
import "./Comments.css";
import { Row, Col } from "react-bootstrap";
import * as postAndCommentHelpers from "../HelperFunctions/PostAndCommentHelpers";

function Comments(props) {
  const { currentUser } = useAuth();
  const [dateInfo, setDateInfo] = useState(
    formatShortDateDifference(props.date)
  );

  const addLike = () => {
    postAndCommentHelpers.addLikeComment(
      props.likes,
      props.postId,
      props.commentId,
      currentUser,
      props.userId
    );
  };

  const removeComment = () => {
    postAndCommentHelpers.removeComment(props.commentId);
  };

  // update the dateInfo hook every minute to get updated timestamps for the messages
  useEffect(() => {
    const interval = setInterval(() => {
      setDateInfo(formatShortDateDifference(props.date));
    }, 60 * 1000); // run every minute
    return () => clearInterval(interval);
  }, [props.date]);

  return (
    <div className="comment">
      <Row>
        <Col className="avatarCol mr-1 mr-md-0" sm={1} xs={1}>
          <Link to={`/user/${props.userId}`}>
            <Avatar
              src={props.profilePic}
              className="d-inline-block mr-0"
              alt="Profile Pic"
            />
          </Link>
        </Col>
        <Col sm={10} xs={10} className=" pl-4 pl-sm-3 pl-md-1 pl-lg-4 pl-xl-3">
          <div id="commentAuthorAndContent">
            <Link to={`/user/${props.userId}`} style={{ color: "inherit" }}>
              <p>{props.userName}</p>
            </Link>
            <p>{props.content}</p>
          </div>
          {currentUser.uid === props.userId && (
            <>
              <span
                className="looksLikeLink"
                id="deleteComment"
                onClick={removeComment}
              >
                x
              </span>
            </>
          )}
          <p className="d-inline-block" id="likeIconAndCount">
            {props.likes.length > 0 ? (
              <>
                <ThumbUpAltRoundedIcon
                  style={{ maxWidth: "16px", color: "rgb(0,123,255)" }}
                />{" "}
                {props.likes.length}
              </>
            ) : (
              ""
            )}
          </p>

          <p>
            <span
              className="looksLikeLink"
              onClick={addLike}
              style={{
                textDecoration: "none",
                color: props.likes.includes(currentUser.uid)
                  ? "rgb(0,123,255)"
                  : "inherit",
              }}
            >
              Like
            </span>
            {" ‧ "}

            {/* As Firebase flickers when setting new dates,
            we arbitrarily set to "1m" to avoid temporary blanks on new comments
            this does not impact previous comments as there's no flicker to retrieve those dates */}
            {dateInfo ? dateInfo : "now"}
          </p>
        </Col>
      </Row>
    </div>
  );
}

export default Comments;
