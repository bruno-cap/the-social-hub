import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form, Row, Col } from "react-bootstrap";
import db from "../firebase";
import firebase from "firebase/app";
import { useAuth } from "../Context/AuthContext";
import "./NewMessage.css";

function NewMessage(props) {
  const { currentUser } = useAuth();
  const [friendToMessage, setFriendToMessage] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const handleDestinationChange = (e) => {
    if (e) {
      setFriendToMessage(e.value);
      retrieveMessages(e.value);
    } else {
      setFriendToMessage("");
    }

    document.getElementById("messageInputField").focus();
  };

  const handleMessageChange = (e) => {
    setMessageContent(e.target.value);
  };

  const handleMessageSubmit = (e) => {
    e.preventDefault();

    // ensure that messages are NOT blank and that a destination user has been selected
    if (messageContent && friendToMessage) {
      // add document to messages collection
      db.collection("messages").add({
        content: messageContent,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        receiverId: friendToMessage,
        senderId: currentUser.uid,
        senderReceiverId: currentUser.uid + friendToMessage,
        senderReceiverArray: [currentUser.uid, friendToMessage],
        senderName: firebase.auth().currentUser.displayName,
        senderPhoto: firebase.auth().currentUser.photoURL,
      });

      // clear the messageContent state variable
      setMessageContent("");
      // focus on the input field (in case the user wants to send more messages)
      document.getElementById("messageInputField").focus();
    }
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .where("userId", "!=", currentUser.uid)
      .onSnapshot((snapshot) => {
        setUsersList(
          snapshot.docs.map((doc) => ({
            value: doc.data().userId,
            label: doc.data().firstName + " " + doc.data().lastName,
          }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  function retrieveMessages(userToLookup) {
    const unsubscribe = db
      .collection("messages")
      .where("senderReceiverId", "in", [
        // check for any combination of the logged in user and the user we're chatting with
        currentUser.uid + userToLookup,
        userToLookup + currentUser.uid,
      ])
      .orderBy("date")
      .onSnapshot((snapshot) => {
        setChatMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return () => {
      unsubscribe();
    };
  }

  return (
    <div className="newMessage">
      <Select
        className="basic-single"
        classNamePrefix="select"
        placeholder="Select or type the name of a friend"
        isClearable="true"
        isSearchable="true"
        options={usersList}
        onChange={handleDestinationChange}
      />

      <div className="chatWindow" key={props.userId}>
        {chatMessages.map((item) => (
          <div className="chatMessages" key={item.id}>
            {/* show received messages on the left and sent messages on the right */}
            {item.data.senderReceiverArray[0] === currentUser.uid ? (
              <p style={{ textAlign: "right" }}>
                <span className="messageSent">{item.data.content}</span>
              </p>
            ) : (
              <p>
                <span className="messageReceived">{item.data.content}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <Form onSubmit={handleMessageSubmit}>
        <Row className="text-center">
          <Col lg={12} md={10} xs={10}>
            <Form.Control
              id="messageInputField"
              type="text"
              placeholder="Type your message here..."
              value={messageContent}
              onChange={handleMessageChange}
            />
          </Col>
          <Col md={2} xs={1} className="d-xl-none d-lg-none px-0">
            <button
              onClick={handleMessageSubmit}
              type="submit"
              className="btn btn-primary"
            >
              Send
            </button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default NewMessage;
