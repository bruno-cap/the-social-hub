import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Alert } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import db from "../firebase";
import { Avatar } from "@material-ui/core";
import "./LeftSidebar.css";

function LeftSidebar() {
  const { currentUser, logout } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        setUserDetails({ id: snapshot.id, data: snapshot.data() });
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    // add event listeners for when users either scroll or resize window -> call stickyLeftSide() then
    window.addEventListener("scroll", stickyLeftSide);
    window.addEventListener("resize", stickyLeftSide);
    // remove event listeners when closing the component
    return () => {
      window.removeEventListener("scroll", stickyLeftSide);
      window.removeEventListener("resize", stickyLeftSide);
    };
  }, []);

  const stickyLeftSide = () => {
    const leftSidebar = document.getElementById("mySidebar");
    const header = document.getElementById("myHeader");

    const marginTop = 25;
    const marginBottom = 25;
    const fineTuning = -1; // -1 pixel

    let tippingPoint =
      header.offsetHeight +
      marginTop +
      leftSidebar.offsetHeight +
      marginBottom +
      fineTuning;

    if (
      document.documentElement.clientHeight -
        header.offsetHeight -
        marginTop -
        leftSidebar.offsetHeight -
        marginBottom >
      0
    ) {
      leftSidebar.classList.remove("bottomFixed");
      leftSidebar.classList.add("topFixed");
    } else {
      leftSidebar.classList.remove("topFixed");
      if (
        window.pageYOffset >
        tippingPoint - document.documentElement.clientHeight
      ) {
        leftSidebar.classList.add("bottomFixed");
      } else {
        leftSidebar.classList.remove("bottomFixed");
      }
    }
  };

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="leftSidebar" id="mySidebar">
      <div className="userInfo" key="user.id">
        <div className="userImage mb-3" style={{ textAlign: "center" }}>
          {userDetails.data && (
            <Link to={`/user/${currentUser.uid}`}>
              <Avatar
                id="leftSidebarProfilePic"
                src={userDetails.data.photo}
                alt="Profile Pic"
              />
            </Link>
          )}
        </div>
      </div>
      <div className="menuOptions d-flex justify-content-center">
        <div className="menuItems" id="bottomOptions">
          <Link
            to={`/user/${currentUser.uid}`}
            style={{ textDecoration: "none" }}
          >
            {userDetails.data && (
              <>
                <AccountCircleIcon fontSize="large" />{" "}
                <p className="d-inline-block my-0">
                  {userDetails.data.firstName} {userDetails.data.lastName}
                </p>
              </>
            )}
          </Link>
          <br />
          <Link to="/" style={{ textDecoration: "none" }}>
            <MenuBookOutlinedIcon fontSize="large" />{" "}
            <p className="d-inline-block my-0">News Feed</p>
          </Link>
          <br />
          <Link to="/messenger" style={{ textDecoration: "none" }}>
            <MessageOutlinedIcon fontSize="large" />{" "}
            <p className="d-inline-block my-0">Messenger</p>
          </Link>
          <br />
          <span
            className="looksLikeLink"
            onClick={handleLogout}
            style={{ textDecoration: "none" }}
          >
            <ExitToAppIcon fontSize="large" />{" "}
            <p className="d-inline-block my-0">Log Out</p>
          </span>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </div>
    </div>
  );
}

export default LeftSidebar;
