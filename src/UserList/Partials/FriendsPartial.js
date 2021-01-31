import React, { useState, useEffect } from "react";
import FriendItem from "../../UserList/FriendItem";

function FriendsPartial(props) {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    setFriends(
      props.userList.filter((user) => user.data.friends.includes(props.userId))
    );
  }, [props.userId, props.userList]);

  return (
    <div className="friendsPartial">
      {friends.length > 0 && (
        <>
          <p className="mb-1 mb-sm-3 text-center text-sm-left">Friends</p>
          {friends.map((user) => (
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

export default FriendsPartial;
