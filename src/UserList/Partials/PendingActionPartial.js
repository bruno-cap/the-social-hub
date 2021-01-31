import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import FriendItem from "../../UserList/FriendItem";

function PendingActionPartial(props) {
  const { currentUser } = useAuth();
  const [pendingUserAction, setPendingUserAction] = useState([]);
  const [pendingOthersActions, setPendingOthersActions] = useState([]);

  useEffect(() => {
    // pending current user action (from other user's perspective -> requestsSent array)
    setPendingUserAction(
      props.userList.filter((user) =>
        user.data.requestsSent.includes(currentUser.uid)
      )
    );

    // pending others actions (from their perspectives -> requestsReceived array)
    setPendingOthersActions(
      props.userList.filter((user) =>
        user.data.requestsReceived.includes(currentUser.uid)
      )
    );
  }, [currentUser.uid, props.userList]);

  return (
    <div className="pendingActionPartial">
      {pendingUserAction.length > 0 && (
        <>
          <p className="mb-1 mb-sm-3 text-center text-sm-left">
            Pending my action
          </p>
          {pendingUserAction.map((user) => (
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

      {pendingOthersActions.length > 0 && (
        <>
          <p className="mb-1 mb-sm-3 text-center text-sm-left">
            Waiting for others
          </p>
          {pendingOthersActions.map((user) => (
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

export default PendingActionPartial;
