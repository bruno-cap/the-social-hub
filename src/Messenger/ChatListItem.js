import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";
import { Avatar } from "@material-ui/core";
import { formatShortDateDifference } from "../HelperFunctions/DateHelpers";
import "./ChatListItem.css";

function ChatListItem(props) {
  const { currentUser } = useAuth();
  const [friendInfo, setFriendInfo] = useState({});
  const [messageInfo, setMessageInfo] = useState({});

  useEffect(() => {
    // get friend's name and photo URL
    const unsubscribe = db
      .collection("users")
      .doc(props.userId)
      .onSnapshot((snapshot) => {
        setFriendInfo({
          id: snapshot.data().userId,
          name: snapshot.data().firstName + " " + snapshot.data().lastName,
          photo: snapshot.data().photo,
        });
      });
    return () => {
      unsubscribe();
    };
  }, [props.userId]);

  useEffect(() => {
    // get last message content and timestamp
    const unsubscribe = db
      .collection("messages")
      .where("senderReceiverId", "in", [
        // check for any combination of the logged in user and the user we're chatting with
        currentUser.uid + props.userId,
        props.userId + currentUser.uid,
      ])
      .orderBy("date", "desc")
      .limit(1)
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length > 0) {
          setMessageInfo({
            id: snapshot.docs[0].id,
            receiverId: snapshot.docs[0].data().receiverId,
            content: snapshot.docs[0].data().content,
            // As Firebase flickers the date when we send messages,
            // we arbitrarily set to "1m" as that would have been the date
            // retrieved for messages that were just sent
            rawDate: snapshot.docs[0].data().date,
            date: snapshot.docs[0].data().date
              ? formatShortDateDifference(snapshot.docs[0].data().date)
              : "now",
            isRead: snapshot.docs[0].data().isRead,
          });
        }
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser, props.userId]);

  // update the messaInfo hook every minute to get updated timestamps for the messages
  useEffect(() => {
    if (messageInfo) {
      const interval = setInterval(() => {
        setMessageInfo({
          id: messageInfo.id,
          receiverId: messageInfo.receiverId,
          content: messageInfo.content,
          date: formatShortDateDifference(messageInfo.rawDate),
          rawDate: messageInfo.rawDate,
          isRead: messageInfo.isRead,
        });
      }, 60 * 1000); // run every minute
      return () => clearInterval(interval);
    }
  }, [messageInfo]);

  return (
    <>
      <Link
        to={`/messenger/${props.userId}`}
        style={{ color: "inherit", textDecoration: "none" }}
      >
        <div
          className="chatListItem"
          // change background color to a light shade of blue if this is the active session
          style={{
            backgroundColor:
              props.userId === props.activeChat && "rgb(207, 224, 252)",
          }}
        >
          <Container>
            <Row>
              <Col
                lg={3}
                md={12}
                className="d-flex
                flex-column
                justify-content-center
                p-0"
              >
                {friendInfo && (
                  <Avatar
                    className="d-inline-block"
                    src={friendInfo.photo}
                    alt="Friend Pic"
                    style={{
                      height: "55px",
                      width: "55px",
                      margin: "auto",
                    }}
                  />
                )}
              </Col>
              <Col
                lg={9}
                // invisible on smaller screens
                className="chatListItemText"
              >
                {friendInfo && messageInfo.content && (
                  <p
                    style={{
                      fontWeight:
                        !messageInfo.isRead &&
                        currentUser.uid === messageInfo.receiverId &&
                        "bold",
                    }}
                  >
                    <span className="sender">{friendInfo.name}</span>
                  </p>
                )}
                {messageInfo.content && (
                  <p
                    style={{
                      fontWeight:
                        !messageInfo.isRead &&
                        currentUser.uid === messageInfo.receiverId &&
                        "bold",
                    }}
                  >
                    {/* Check if the message length is greater than 20 characters.
                    If positive, crop at 18 characters and add "...".  Otherwise, show message as is. */}
                    <span className="contentAndDate">
                      {messageInfo.content.length > 20
                        ? messageInfo.content.substring(0, 17) + "..."
                        : messageInfo.content}
                      {" ‧ "}
                      {messageInfo.date && <>{messageInfo.date}</>}
                    </span>
                  </p>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </Link>
    </>
  );
}

export default ChatListItem;
