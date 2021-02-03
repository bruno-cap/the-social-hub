import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";
import PeopleListItem from "./PeopleListItem";

function FriendSuggestionsSide() {
  const { currentUser } = useAuth();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      // do not include the current user
      .where("userId", "!=", currentUser.uid)
      .orderBy("userId")
      .onSnapshot((snapshot) => {
        setUserList(
          snapshot.docs
            // filter out friends and people you have sent or have sent YOU friend requests
            .filter(
              (user) =>
                !user.data().friends.includes(currentUser.uid) &&
                !user.data().requestsSent.includes(currentUser.uid) &&
                !user.data().requestsReceived.includes(currentUser.uid)
            )
            // shuffle the contents of the array
            .sort(() => Math.random() - 0.5)
            // map to variable for easy readability
            .map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <div className="friendSuggestionsSide unevenRoundedBox">
      <div className="d-flex justify-content-between">
        <p className="">Other People</p>
        <Link
          to={"/addfriends"}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          {userList.length > 6 && (
            <p className="d-inline-block" style={{ fontSize: "14px" }}>
              See All
            </p>
          )}
        </Link>
      </div>

      <div id="userList" className="text-center">
        {userList.slice(0, 6).map((user) => (
          <PeopleListItem
            key={user.id}
            userId={user.data.userId}
            photo={user.data.photo}
            firstName={user.data.firstName}
            lastName={user.data.lastName}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendSuggestionsSide;
