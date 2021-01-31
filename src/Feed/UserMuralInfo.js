import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";
import { Avatar } from "@material-ui/core";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import FriendshipPartial from "../UserList/Partials/FriendshipPartial";
import "./UserMuralInfo.css";

function UserMuralInfo(props) {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props.userId)
      .onSnapshot((snapshot) => {
        setUserInfo(snapshot.data());
      });

    return () => {
      unsubscribe();
    };
  }, [currentUser.uid, props.userId]);

  useEffect(() => {
    // add event listeners for when users either scroll or resize window -> call stickySides() then
    if (props.userId !== currentUser.uid) {
      window.addEventListener("scroll", stickyUserInfo);
      window.addEventListener("resize", stickyUserInfo);
      // remove event listeners when closing the component
      return () => {
        window.removeEventListener("scroll", stickyUserInfo);
        window.removeEventListener("resize", stickyUserInfo);
      };
    }
  }, [props.userId, currentUser.uid]);

  const stickyUserInfo = () => {
    const userInfoOnMurals = document.getElementById("muralActionBox");
    const userMuralContainer = document.getElementById("myUserMuralInfo");
    const userMuralContainerWidth = userMuralContainer.offsetWidth;
    const profilePicAndName = document.getElementById("profilePicAndName");
    const userPicAndInitials = document.getElementById("userPicAndInitials");
    const userMuralContentBelowActionBar = document.getElementById(
      "userMuralContentBelowActionBar"
    );

    const marginTop = 8;
    const marginBottom = 8;
    // fine adjustments: -11 pixels on smaller screens and 8 on bigger ones
    const fineTuning = window.innerWidth < 576 ? -11 : 8;

    let tippingPoint =
      marginTop + profilePicAndName.offsetHeight + marginBottom + fineTuning;

    const messageIconText = document.getElementById("messageIconText");

    if (window.pageYOffset > tippingPoint) {
      // fix user info
      userInfoOnMurals.classList.add("userInfoFixed");

      // add padding to content: 60px on smaller screens and 90 on bigger ones
      userMuralContentBelowActionBar.style.paddingTop =
        window.innerWidth < 576 ? 60 + "px" : 90 + "px";

      userPicAndInitials.classList.add("showUserPicAndInitials");
      window.innerWidth < 576
        ? messageIconText.classList.add("hideMessageIconText")
        : messageIconText.classList.remove("hideMessageIconText");
      // as the action box gets fixed, we set its width to that of the user mural container
      userInfoOnMurals.style.width = userMuralContainerWidth + "px";

      window.innerWidth < 576 &&
        (document.getElementById("innerActionBox").style.marginBottom = "8px");
    } else {
      // release user info
      userPicAndInitials.classList.remove("showUserPicAndInitials");
      userInfoOnMurals.classList.remove("userInfoFixed");

      userMuralContentBelowActionBar.style.paddingTop = "0px";
      messageIconText.classList.remove("hideMessageIconText");
      // reset width to auto in case the action box got fixed and reset
      userInfoOnMurals.style.width = "auto";

      window.innerWidth < 576
        ? (document.getElementById("innerActionBox").style.marginBottom = "0px")
        : (document.getElementById("innerActionBox").style.marginBottom =
            "8px");
    }
  };

  return (
    <div className="userMuralInfo" id="myUserMuralInfo">
      <div id="profilePicAndName">
        <Avatar
          id="muralProfilePic"
          className="d-inline-block mt-3 mt-sm-auto"
          src={userInfo.photo}
          alt="Profile Pic"
        />
        <h2 className="mt-1 mt-sm-auto mb-1">
          {userInfo.firstName} {userInfo.lastName}
        </h2>
      </div>
      {props.userId !== currentUser.uid && (
        <div id="muralActionBox" style={{ paddingTop: "8px" }}>
          <div id="innerActionBox" className="evenRoundedBox actionBox">
            <>
              <div id="userPicAndInitials">
                <Avatar
                  className="d-inline-block align-middle"
                  src={userInfo.photo}
                  alt="Profile Pic"
                  style={{ margin: "-20px auto" }}
                />
                <p className="d-none d-sm-inline-block my-0 ml-2 mr-3">
                  {userInfo.firstName && userInfo.firstName}
                  &nbsp;
                  {userInfo.lastName && userInfo.lastName}
                </p>
                <p className="d-inline-block d-sm-none my-0 ml-2 mr-3">
                  {userInfo.firstName && userInfo.firstName.charAt(0)}
                  {userInfo.lastName && userInfo.lastName.charAt(0)}
                </p>
              </div>
              <Link to={`/messenger/${props.userId}`} className="mr-2">
                <MessageOutlinedIcon />
                <p id="messageIconText" className="my-0">
                  &nbsp;Message
                </p>
              </Link>
              <FriendshipPartial userId={props.userId} location="mural" />
            </>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMuralInfo;
