import React from "react";
import db from "../../firebase";
import { useAuth } from "../../Context/AuthContext";
// friend functions
import { checkFriendShipStatusHelper } from "../../HelperFunctions/FriendHelpers";
import { sendFriendRequestHelper } from "../../HelperFunctions/FriendHelpers";
import { approveFriendRequestHelper } from "../../HelperFunctions/FriendHelpers";
import { deleteFriendRequestHelper } from "../../HelperFunctions/FriendHelpers";
import { unfriendHelper } from "../../HelperFunctions/FriendHelpers";
// icons
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonIcon from "@material-ui/icons/Person";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
// css
import "../FriendItem.css";
import "./FriendshipPartial.css";

function FriendshipStatus(props) {
  const { currentUser } = useAuth();
  const [friendShipStatus, setFriendShipStatus] = React.useState("");

  React.useEffect(() => {
    // check friendship status and update the friendShipStatus hook
    const unsubscribe = db
      .collection("users")
      .doc(currentUser.uid)
      .onSnapshot((querySnapshot) => {
        setFriendShipStatus(
          checkFriendShipStatusHelper(querySnapshot, props.userId)
        );
      });

    return () => {
      unsubscribe();
    };
  }, [currentUser, props.userId]);

  const sendFriendRequest = () => {
    sendFriendRequestHelper(currentUser.uid, props.userId); // (sender, receiver)
  };

  const approveFriendRequest = () => {
    approveFriendRequestHelper(props.userId, currentUser.uid); // (sender, receiver)
  };

  const deleteFriendRequest = () => {
    deleteFriendRequestHelper(props.userId, currentUser.uid); // (sender, receiver)
  };

  const cancelFriendRequest = () => {
    deleteFriendRequestHelper(currentUser.uid, props.userId); // (sender, receiver)
  };

  const unfriend = () => {
    unfriendHelper(currentUser.uid, props.userId); // (sender, receiver)
  };

  return (
    <div className="friendshipPartial">
      {friendShipStatus === "user" ? (
        <>
          <p>Myself</p>
        </>
      ) : (
        <></>
      )}

      {friendShipStatus === "friends" ? (
        <>
          <p>
            <PersonIcon /> Friends
          </p>

          {/* skip a line only if it's being displayed on user lists */}
          {props.location === "userList" && <br />}

          <p
            className="looksLikeLink negativeResponse"
            onClick={unfriend}
            style={{
              // add marginLeft only if being displayed on user murals
              marginLeft: props.location === "mural" && "8px",
              // reduce fontsize only if being displayed on user lists
              fontSize: props.location === "userList" && "12px",
            }}
          >
            <ClearIcon fontSize="small" /> Unfriend
          </p>
        </>
      ) : (
        <></>
      )}

      {friendShipStatus === "pendingUserApproval" ? (
        <>
          <p
            className="looksLikeLink positiveResponse"
            onClick={approveFriendRequest}
          >
            <CheckIcon />
            <span className="d-none d-md-inline-block">
              Confirm friend request
            </span>

            <span className="d-inline-block d-md-none">Confirm</span>
          </p>

          {/* skip a line only if it's being displayed on user lists */}
          {props.location === "userList" && <br />}

          <p
            className="looksLikeLink negativeResponse"
            onClick={deleteFriendRequest}
            style={{
              // add marginLeft only if being displayed on user murals
              marginLeft: props.location === "mural" && "20px",
              // reduce fontsize only if being displayed on user lists
              fontSize: props.location === "userList" && "12px",
            }}
          >
            <ClearIcon fontSize="small" />
            Delete
          </p>
        </>
      ) : (
        <></>
      )}

      {friendShipStatus === "pendingFriendsApproval" ? (
        <>
          <p>
            <HourglassEmptyIcon />
            <span className="d-none d-md-inline-block">
              Pending friend's approval
            </span>
            <span className="d-inline-block d-md-none">Waiting</span>
          </p>

          {/* skip a line only if it's being displayed on user lists */}
          {props.location === "userList" && <br />}

          <p
            className="looksLikeLink negativeResponse"
            onClick={cancelFriendRequest}
            style={{
              // add marginLeft only if being displayed on user murals
              marginLeft: props.location === "mural" && "20px",
              // reduce fontsize only if being displayed on user lists
              fontSize: props.location === "userList" && "12px",
            }}
          >
            <ClearIcon fontSize="small" />

            <span className="d-none d-md-inline-block">Cancel request</span>

            <span className="d-inline-block d-md-none">Cancel</span>
          </p>
        </>
      ) : (
        <></>
      )}

      {friendShipStatus === "notFriends" ? (
        <>
          <p className="looksLikeLink" onClick={sendFriendRequest}>
            <PersonAddIcon />
            <span className="d-none d-md-inline-block">
              &nbsp;Send friend request
            </span>

            <span className="d-inline-block d-md-none"> &nbsp;Request</span>
          </p>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default FriendshipStatus;
