import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";
import PeopleListItem from "./PeopleListItem";
import "./FriendsSide.css";

function FriendsSide(props) {
  const { currentUser } = useAuth();
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .where("friends", "array-contains", props.userId)
      .onSnapshot((snapshot) => {
        setFriendList(
          snapshot.docs
            // shuffle the contents of the array
            .sort(() => Math.random() - 0.5)
            // map to variable for easy readability
            .map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

    return () => {
      unsubscribe();
    };
  }, [props.userId]);

  return (
    <div className="friendsSide unevenRoundedBox">
      <div className="d-flex justify-content-between">
        <p className="">Friends</p>
        <Link
          to={
            props.userId === currentUser.uid
              ? "/friends"
              : `/friends/${props.userId}`
          }
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <p className="d-inline-block" style={{ fontSize: "14px" }}>
            See All
          </p>
        </Link>
      </div>

      <div id="friendList" className="text-center">
        {friendList.slice(0, 6).map((user) => (
          <PeopleListItem
            key={user.id}
            userId={user.data.userId}
            photo={user.data.photo}
            firstName={user.data.firstName}
            lastName={user.data.lastName}
          />
        ))}
      </div>

      {/* if it refers to the current user and friendList is empty, show "Find friends!" 
      and link to the page to find people */}
      {friendList.length === 0 && currentUser.uid === props.userId && (
        <Link
          to={"/addfriends"}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <p className="mt-4" style={{ fontSize: "14px" }}>
            Find friends!
          </p>
        </Link>
      )}

      {/* if it refers to the current user and friendList is empty, show "None yet :(!" 
      and link to the page to find people */}
      {friendList.length === 0 && currentUser.uid !== props.userId && (
        <p className="mt-4" style={{ fontSize: "14px" }}>
          None yet :(
        </p>
      )}
    </div>
  );
}

export default FriendsSide;
