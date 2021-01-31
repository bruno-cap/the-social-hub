import React, { useState, useEffect } from "react";
import NotificationItem from "./NotificationItem";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";

function Notifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("notifications")
      .where("receiverUserId", "==", currentUser.uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setNotifications(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
        // set current user's isRead flag on all notifications to true
        for (let i = 0; i < snapshot.docs.length; i++) {
          if (!snapshot.docs[i].data().isRead) {
            db.collection("notifications")
              .doc(snapshot.docs[i].id)
              .update({ isRead: "true" });
          }
        }
      });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <div className="notifications">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          id={notification.id}
          senderUsername={notification.data.senderUsername}
          senderProfilePic={notification.data.senderProfilePic}
          postId={notification.data.postId}
          timestamp={notification.data.timestamp}
          action={notification.data.action}
        />
      ))}
    </div>
  );
}

export default Notifications;
