import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Form } from "react-bootstrap";
import db from "../firebase";
import firebase from "firebase/app";
import { useAuth } from "../Context/AuthContext";
import { formatLongDate } from "../HelperFunctions/DateHelpers";
import { useHistory } from "react-router-dom";
import "./NewMessage.css";

function NewMessage(props) {
  const { currentUser } = useAuth();
  const [friendToMessage, setFriendToMessage] = useState(props.friendToMessage);
  const [messageContent, setMessageContent] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [defaultValue, setDefaultValue] = useState([]);
  let history = useHistory();

  const handleDestinationChange = (e) => {
    if (e) {
      setFriendToMessage(e.value);
      history.push(`/messenger/${e.value}`);
    } else {
      setFriendToMessage("");
    }
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
        isRead: false,
      });

      // clear the messageContent state variable
      setMessageContent("");

      // check if session exists. if not, create one.
      db.collection("chatSessions")
        .where("participantsIds", "in", [
          // check for any combination of the logged in user and the user we're chatting with
          currentUser.uid + friendToMessage,
          friendToMessage + currentUser.uid,
        ])
        .get()
        .then(function (querySnapshot) {
          // if chatSession does not exist, create one
          if (querySnapshot.empty) {
            db.collection("chatSessions")
              .doc(currentUser.uid + friendToMessage)
              .set({
                participantsIds: currentUser.uid + friendToMessage,
                participantsArray: [currentUser.uid, friendToMessage],
                lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
              });
          } else {
            // if session exists, update lastMessageTimestamp
            db.collection("chatSessions")
              .doc(querySnapshot.docs[0].id)
              .update({
                lastMessageTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
                // add friendToMessage to the unreadByArray
                // this method does not add duplicates so we'll only have one instance
                unreadByArray: firebase.firestore.FieldValue.arrayUnion(
                  friendToMessage
                ),
              });
          }
        })

        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }
  };

  useEffect(() => {
    // get list of users to be used as options within the destination dropdown menu
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

  useEffect(() => {
    // get the default option to be used in the destination dropdown menu
    let indexFound = "";
    if (usersList) {
      for (let i = 0; i < usersList.length && indexFound === ""; i++) {
        if (usersList[i].value === props.friendToMessage) {
          indexFound = i;
        }
      }

      indexFound !== ""
        ? setDefaultValue(usersList[indexFound])
        : setDefaultValue("notFound");
    }
  }, [usersList, props.friendToMessage]);

  // retrieve chat history between the user logged in and the one passed as parameter
  useEffect(() => {
    // focus on the input field (in case the user wants to send more messages)
    document.getElementById("messageInputField").focus();

    if (friendToMessage) {
      // element.scrollIntoView();
      const unsubscribe = db
        .collection("messages")
        .where("senderReceiverId", "in", [
          // check for any combination of the logged in user and the user we're chatting with
          currentUser.uid + friendToMessage,
          friendToMessage + currentUser.uid,
        ])
        .orderBy("date")
        .onSnapshot((snapshot) => {
          setChatMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
          );

          // set scroll to start all the way on the bottom
          var objDiv = document.getElementById("chatWindow");
          objDiv.scrollTop = objDiv.scrollHeight;

          for (let i = 0; i < snapshot.size; i++) {
            // is the receiverId matches the user reading the message, update isRead to true
            if (snapshot.docs[i].data().receiverId === currentUser.uid) {
              db.collection("messages").doc(snapshot.docs[i].id).update({
                isRead: true,
              });
            }
          }
        });
      return () => {
        unsubscribe();
      };
    }
  }, [currentUser, friendToMessage]);

  return (
    <div className="newMessage">
      {/* no default value when rendering the default /messenger route OR if user manually entered an invalid parameter*/}
      <div id="messageTo">
        {(!props.friendToMessage || defaultValue === "notFound") && (
          <Select
            className="basic-single"
            classNamePrefix="select"
            placeholder="Select a friend"
            isClearable="true"
            isSearchable="true"
            options={usersList}
            onChange={handleDestinationChange}
          />
        )}

        {/* when rendering the /messenger/user route, use the parameter (userId) to set the default value */}
        {props.friendToMessage && defaultValue !== "notFound" && (
          <Select
            className="basic-single"
            classNamePrefix="select"
            placeholder="Select a friend"
            isClearable="true"
            isSearchable="true"
            defaultValue={defaultValue}
            options={usersList}
            onChange={handleDestinationChange}
          />
        )}
      </div>
      <div id="chatWindow" key={props.userId}>
        <div style={{ flexGrow: "1" }}>
          {/* div to work as buffer to push messageHistory to the bottom */}
        </div>
        {chatMessages.map((item, i, array) => (
          <div className="chatMessages" id="messageHistory" key={item.id}>
            {/* show received messages on the left and sent messages on the right */}
            {i === 0 && (
              <p style={{ textAlign: "center" }}>
                {formatLongDate(item.data.date)}
              </p>
            )}

            {i > 0 &&
            item.data.date &&
            array[i - 1].data.date &&
            (
              item.data.date.toDate() - array[i - 1].data.date.toDate()
            ).toString() >
              30 * 60 * 1000 ? (
              <p style={{ textAlign: "center" }}>
                {formatLongDate(item.data.date)}
              </p>
            ) : (
              ""
            )}

            {item.data.senderReceiverArray[0] === currentUser.uid ? (
              <div style={{ textAlign: "right" }}>
                <p className="commentAuthorAndContent" id="messageSent">
                  {item.data.content}
                </p>
              </div>
            ) : (
              <div>
                <p className="commentAuthorAndContent" id="messageReceived">
                  {item.data.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div id="messageToSend">
        <Form
          className="text-center"
          id="sendMessage"
          onSubmit={handleMessageSubmit}
        >
          <Form.Control
            id="messageInputField"
            type="text"
            placeholder="Type your message here..."
            value={messageContent}
            onChange={handleMessageChange}
          />
        </Form>
      </div>
    </div>
  );
}

export default NewMessage;
