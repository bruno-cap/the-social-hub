import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import SearchIcon from "@material-ui/icons/Search";
import db from "../firebase";
import { useAuth } from "../Context/AuthContext";
import "./Header.css";

function Header(props) {
  const { currentUser, logout } = useAuth();
  const [chatSessionNumber, setChatSessionNumber] = useState("");
  const [notificationNumber, setNotificationNumber] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [user, setUser] = useState({});
  let history = useHistory();

  const handleChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/search/${searchKeyword}`);
  };

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch {
      console.log("Failed to log out");
    }
  }

  // get the current user
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = db
        .collection("users")
        .doc(currentUser.uid)
        .onSnapshot((snapshot) => {
          setUser({ id: snapshot.id, data: snapshot.data() });
        });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  // get number of unread conversations
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = db
        .collection("messages")
        .where("receiverId", "==", currentUser.uid)
        .where("isRead", "==", false)
        .onSnapshot((snapshot) => {
          let tempSendersArray = [];
          for (let i = 0; i < snapshot.docs.length; i++) {
            tempSendersArray.push(snapshot.docs[i].data().senderId);
          }
          // get distinct senderIds
          let distinctSendersArray = [...new Set(tempSendersArray)];
          // assignt the state variable chatSessionNumber the number of distinct unread conversations
          setChatSessionNumber(distinctSendersArray.length);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  // get number of unread notifications
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = db
        .collection("notifications")
        .where("receiverUserId", "==", currentUser.uid)
        .where("isRead", "==", false)
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setNotificationNumber(snapshot.docs.length);
        });

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  const showOrHideSearchBar = () => {
    const imageField = document.getElementById("inputFieldForSmallerScreens");
    const headerTitle = document.getElementById("headerTitleSmallerScreens");
    const widthToChange = 400;

    if (imageField.classList.contains("showSearchBar")) {
      imageField.classList.remove("showSearchBar");
      window.innerWidth < widthToChange &&
        headerTitle.classList.remove("hideTitle");
    } else {
      window.innerWidth < widthToChange &&
        headerTitle.classList.add("hideTitle");
      imageField.classList.add("showSearchBar");
      imageField.focus();
    }
  };

  return (
    <div className="header" id="myHeader">
      {currentUser && (
        <>
          <Container id="headerContainer">
            <Row className="d-flex">
              {/* Title */}
              <Col
                className="text-left text-lg-center align-items-center my-auto px-0"
                lg={{ span: 4, order: 2 }}
                md={{ span: 4, order: 1 }}
                sm={{ span: 5, order: 1 }}
                xs={{ span: 3, order: 1 }}
              >
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <h1 id="headerTitle">The Social Hub</h1>

                  <h1 id="headerTitleSmallerScreens">TSH</h1>
                </Link>
              </Col>

              {/* Search bar */}
              <Col
                className="px-0"
                id="searchBar"
                lg={{ span: 4, order: 1 }}
                md={{ span: 3, order: 2 }}
                xs={{ span: 7, order: 3 }}
              >
                <Form onSubmit={handleSubmit}>
                  <Form.Control
                    id="inputField"
                    type="text"
                    placeholder="Search for people"
                    value={searchKeyword}
                    onChange={handleChange}
                  />
                  <button id="searchBarButton" type="submit">
                    <SearchIcon />
                  </button>
                </Form>
              </Col>

              {/* Buttons */}
              <Col
                id="headerButtons"
                className="d-flex align-items-center justify-content-end px-0"
                lg={4}
                md={8}
                sm={{ span: 7, order: 3 }}
                xs={{ span: 9, order: 3 }}
                style={{
                  color: "rgb(233,235,238)",
                }}
              >
                {user.data && (
                  <>
                    {/* hidden search bar to be displayed on screens < medium 
                  after clicking the magnifying glass icon*/}
                    <Form
                      className="d-inline-block d-lg-none"
                      onSubmit={handleSubmit}
                    >
                      <Form.Control
                        id="inputFieldForSmallerScreens"
                        type="text"
                        placeholder="Search..."
                        value={searchKeyword}
                        onChange={handleChange}
                      />
                      <button className="d-none" id="" type="submit">
                        <SearchIcon />
                      </button>
                    </Form>

                    <SearchIcon
                      className="d-inline-block d-lg-none headerIcon looksLikeLink my-auto"
                      onClick={showOrHideSearchBar}
                      fontSize="large"
                    />
                    <Link
                      to={`/user/${currentUser.uid}`}
                      className="iconSpacing"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        margin: "0",
                        padding: "0",
                      }}
                    >
                      <p className="d-none d-lg-inline-block mr-1 my-auto">
                        {user.data.firstName}
                      </p>
                      <Avatar
                        id="headerAvatar"
                        className="d-inline-block align-middle iconSpacing"
                        src={user.data.photo}
                        alt="Profile Pic"
                      />
                    </Link>

                    <ExitToAppIcon
                      className="headerIcon looksLikeLink my-auto"
                      fontSize="large"
                      onClick={handleLogout}
                    />
                  </>
                )}

                <Link
                  to="/addfriends"
                  className="my-auto"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <PersonAddIcon
                    className="d-inline-block headerIcon iconSpacing ml-3"
                    fontSize="large"
                  />

                  {user.data && user.data.requestsReceived.length > 0 && (
                    <span className="notificationNumber">
                      {user.data.requestsReceived.length}
                    </span>
                  )}
                </Link>

                <Link
                  to="/messenger"
                  className="my-auto"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <MessageOutlinedIcon
                    className="headerIcon iconSpacing"
                    fontSize="large"
                  />

                  {chatSessionNumber > 0 && (
                    <span className="notificationNumber">
                      {chatSessionNumber}
                    </span>
                  )}
                </Link>

                <Link
                  to="/notifications"
                  className="my-auto"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <NotificationsActiveIcon
                    className="headerIcon iconSpacing"
                    fontSize="large"
                  />
                  {notificationNumber > 0 && (
                    <span className="notificationNumber">
                      {notificationNumber}
                    </span>
                  )}
                </Link>
              </Col>
            </Row>
          </Container>
        </>
      )}
    </div>
  );
}

export default Header;
