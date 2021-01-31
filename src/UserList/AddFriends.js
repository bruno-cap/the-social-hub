import React, { useState, useEffect } from "react";
import db from "../firebase";
import PendingActionPartial from "./Partials/PendingActionPartial";
import OtherPeoplePartial from "./Partials/OtherPeoplePartial";

function AddFriends(props) {
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
  }, [props.keyword]);

  return (
    <div className="addFriends">
      <PendingActionPartial userList={userList} />
      <OtherPeoplePartial userList={userList} />
    </div>
  );
}

export default AddFriends;
