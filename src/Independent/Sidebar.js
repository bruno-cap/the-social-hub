import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import MenuBookOutlinedIcon from "@material-ui/icons/MenuBookOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import "./Sidebar.css";
import { Image, Alert } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import db from "../firebase";

function Sidebar() {
  const { currentUser, logout } = useAuth();
  const [userDetails, setUserDetails] = useState([]);
  const [error, setError] = useState("");
  const history = useHistory();

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .where("userId", "==", currentUser.uid)
      .onSnapshot((snapshot) => {
        setUserDetails(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

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
    <div className="sidebar">
      {userDetails.map((user) => (
        <div
          className="userInfo"
          key="user.id"
          style={{ backgroundColor: "center" }}
        >
          <div className="userImage mb-3" style={{ textAlign: "center" }}>
            <Link to={`/user/${currentUser.uid}`}>
              <Image
                src={user.data.photo}
                roundedCircle
                style={{ textAlign: "center" }}
              />
            </Link>
          </div>
          <div className="menuOptions d-flex justify-content-center">
            <div className="menuItems">
              <Link
                to={`/user/${currentUser.uid}`}
                style={{ textDecoration: "none" }}
              >
                <AccountCircleIcon fontSize="large" />{" "}
                {user.data.firstName + " " + user.data.lastName}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="menuOptions d-flex justify-content-center">
        <div className="menuItems" id="bottomOptions">
          <Link to="/" style={{ textDecoration: "none" }}>
            <MenuBookOutlinedIcon fontSize="large" /> News Feed
          </Link>
          <br />
          <Link to="/messenger" style={{ textDecoration: "none" }}>
            <MessageOutlinedIcon fontSize="large" /> Messenger
          </Link>
          <br />
          <span
            className="looksLikeLink"
            onClick={handleLogout}
            style={{ textDecoration: "none" }}
          >
            <ExitToAppIcon fontSize="large" /> Log Out
          </span>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </div>
    </div>

    // </div>
  );
}

export default Sidebar;
