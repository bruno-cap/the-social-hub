import React, { useEffect, useState } from "react";
import ChatListItem from "./ChatListItem";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";
import "./ChatList.css";

function ChatList(props) {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // get the chatSessionIds current user is a part of
    const unsubscribe = db
      .collection("chatSessions")
      .where("participantsArray", "array-contains", currentUser.uid)
      .orderBy("lastMessageTimestamp", "desc")
      .onSnapshot((snapshot) => {
        setSessions(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <div className="chatList">
      {sessions.map((session) => (
        <ChatListItem
          key={session.id}
          sessionId={session.id}
          activeChat={props.activeChat}
          userId={
            currentUser.uid === session.data.participantsArray[0]
              ? session.data.participantsArray[1]
              : session.data.participantsArray[0]
          }
        />
      ))}
    </div>
  );
}

export default ChatList;
