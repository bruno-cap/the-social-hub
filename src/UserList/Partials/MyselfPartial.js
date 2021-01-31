import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import FriendItem from "../../UserList/FriendItem";

function MyselfPartial(props) {
  const { currentUser } = useAuth();
  const [myself, setMyself] = useState("");

  useEffect(() => {
    setMyself(props.userList.filter((user) => user.id === currentUser.uid));
  }, [currentUser.uid, props.userList]);

  return (
    <div className="myselfPartial">
      {myself.length > 0 && (
        <>
          <p className="mb-1 mb-sm-3 text-center text-sm-left">Myself</p>
          <FriendItem
            key={myself[0].id}
            userId={myself[0].data.userId}
            firstName={myself[0].data.firstName}
            lastName={myself[0].data.lastName}
            email={myself[0].data.email}
            photo={myself[0].data.photo}
            friends={myself[0].data.friends}
            requestsSent={myself[0].data.requestsSent}
            requestsReceived={myself[0].data.requestsReceived}
          />
        </>
      )}
    </div>
  );
}

export default MyselfPartial;
