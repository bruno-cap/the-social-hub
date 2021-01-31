import React, { useState, useEffect } from "react";
import db from "../firebase";
import PendingActionPartial from "../UserList/Partials/PendingActionPartial";
import FriendsPartial from "../UserList/Partials/FriendsPartial";
import { useAuth } from "../Context/AuthContext";

function FriendList(props) {
  const { currentUser } = useAuth();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .orderBy("firstName")
      .orderBy("lastName")
      .onSnapshot((snapshot) => {
        let alteredSnapshot = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setUserList(alteredSnapshot);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="friendList">
      {/* only show pending action for the logged in user */}
      {props.userId === currentUser.uid && (
        <PendingActionPartial userList={userList} />
      )}

      <FriendsPartial userId={props.userId} userList={userList} />
    </div>
  );
}

export default FriendList;
