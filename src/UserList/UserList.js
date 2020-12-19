import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";
import UserListItem from "./UserListItem";
import "./UserList.css";

function UserList() {
  const { currentUser } = useAuth();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .where("userId", "!=", currentUser.uid)
      .onSnapshot((snapshot) => {
        setUserList(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <div className="userList">
      <p>People</p>
      <Container>
        {userList.map((user) => (
          <UserListItem
            key={user.id}
            userId={user.data.userId}
            photo={user.data.photo}
            name={user.data.firstName + " " + user.data.lastName}
          />
        ))}
      </Container>
    </div>
  );
}

export default UserList;
