import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import FriendItem from "../../UserList/FriendItem";

function OtherPeoplePartial(props) {
  const { currentUser } = useAuth();
  const [otherPeople, setOtherPeople] = useState([]);

  useEffect(() => {
    setOtherPeople(
      props.userList.filter(
        (user) =>
          user.id !== currentUser.uid &&
          !user.data.requestsSent.includes(currentUser.uid) &&
          !user.data.requestsReceived.includes(currentUser.uid) &&
          !user.data.friends.includes(currentUser.uid)
      )
    );
  }, [currentUser.uid, props.userList]);

  return (
    <div className="otherPeoplePartial">
      {otherPeople.length > 0 && (
        <>
          <p className="mb-1 mb-sm-3 text-center text-sm-left">Other People</p>
          {otherPeople.map((user) => (
            <FriendItem
              key={user.id}
              userId={user.data.userId}
              firstName={user.data.firstName}
              lastName={user.data.lastName}
              email={user.data.email}
              photo={user.data.photo}
              friends={user.data.friends}
              requestsSent={user.data.requestsSent}
              requestsReceived={user.data.requestsReceived}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default OtherPeoplePartial;
