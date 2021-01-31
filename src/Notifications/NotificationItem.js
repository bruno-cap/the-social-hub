import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { formatShortDateDifference } from "../HelperFunctions/DateHelpers";
import db from "../firebase";
import "./NotificationItem.css";

function NotificationItem(props) {
  const [dateInfo, setDateInfo] = useState(
    formatShortDateDifference(props.timestamp)
  );

  // update the dateInfo hook every minute to get updated timestamps for the messages
  useEffect(() => {
    const interval = setInterval(() => {
      setDateInfo(formatShortDateDifference(props.timestamp));
    }, 60 * 1000); // run every minute
    return () => clearInterval(interval);
  }, [props.timestamp]);

  const removeNotification = () => {
    // delete notification
    db.collection("notifications")
      .doc(props.id)
      .delete()
      .then(function () {
        console.log("Notification successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing notification: ", error);
      });
  };

  return (
    <div className="notificationItem evenRoundedBox">
      <Container>
        <Row className="text-left">
          <Col
            className="d-flex justify-content-md justify-content-center"
            md={2}
            sm={3}
            xs={3}
          >
            <Link
              to={`/post/${props.postId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Avatar
                className="mb-2 mb-sm-auto"
                src={props.senderProfilePic}
                alt="Sender Profile Pic"
                style={{
                  height: "60px",
                  width: "60px",
                }}
              />
            </Link>
          </Col>
          <Col
            className="d-flex flex-column justify-content-center px-0 px-lg-3 px-xl-2 pl-1 pl-sm-0"
            md={9}
            sm={8}
            xs={7}
          >
            <Link
              to={`/post/${props.postId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <p className="inline-block mb-0">
                {props.action === "likeComment" && (
                  <>{props.senderUsername} liked your comment</>
                )}

                {props.action === "likePost" && (
                  <>{props.senderUsername} liked your post</>
                )}

                {props.action === "commentPost" && (
                  <>{props.senderUsername} commented on your post</>
                )}
                {" ‧ "}
                {dateInfo ? dateInfo : "now"}
              </p>
            </Link>
          </Col>
          <Col sm={1} xs={2}>
            <p
              className="looksLikeLink mt-2 text-right text-md-left"
              onClick={removeNotification}
              style={{ color: "inherit" }}
            >
              x
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default NotificationItem;
