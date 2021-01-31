import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "./Context/AuthContext";
import Header from "./Sides/Header";
import LeftSidebar from "./Sides/LeftSidebar";
import CreatePost from "./Feed/CreatePost";
import GeneralFeed from "./Feed/GeneralFeed";
import Login from "./Credentials/Login";
import Signup from "./Credentials/Signup";
import Messenger from "./Messenger/Messenger";
import Notifications from "./Notifications/Notifications";
import NotificationPost from "./Notifications/NotificationPost";
import AddFriends from "./UserList/AddFriends";
import SearchResults from "./UserList/SearchResults";
import FriendList from "./UserList/FriendList";
import UserMural from "./Feed/UserMural";
import RightSidebar from "./Sides/RightSidebar";
import "./App.css";

function App() {
  const { currentUser } = useAuth();

  return (
    <>
      {!currentUser ? (
        <>
          <div style={{ backgroundColor: "rgb(233, 235, 238)" }}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              {/* If !currentUser and the user doesn't type either /login or /signup, render Login */}
              <Login />
            </Switch>
          </div>
        </>
      ) : (
        <>
          <div className="app" id="myApp">
            <Header key={currentUser} />
            <div className="appBody">
              <Switch>
                <Route exact path="/messenger" component={Messenger} />

                <Route
                  path="/messenger/:userId"
                  render={(props) => (
                    <Messenger userId={props.match.params.userId} />
                  )}
                />

                <Route
                  path="/user/:userId"
                  render={(props) => (
                    <UserMural userId={props.match.params.userId} />
                  )}
                />
                <>
                  {/* Content of the main page */}
                  <Container className="contentContainer">
                    <Row id="bodyContentRow">
                      <Col className="justify-content d-none d-lg-block" lg={3}>
                        <LeftSidebar />
                      </Col>
                      <Col id="centerColumn" lg={6} md={12}>
                        {/* If user is logged in and type /signup or /login, render "/" */}
                        <Route exact path="/login">
                          <Redirect to="/" />
                        </Route>

                        <Route exact path="/signup">
                          <Redirect to="/" />
                        </Route>

                        <Route exact path="/">
                          <CreatePost destinationMural="public" />
                          <GeneralFeed />
                        </Route>

                        <Route exact path="/friends">
                          <FriendList userId={currentUser.uid} />
                        </Route>

                        {/* Individual posts - accessible by clicking each notification */}
                        <Route
                          path="/friends/:userId"
                          render={(props) => (
                            <FriendList userId={props.match.params.userId} />
                          )}
                        />

                        {/* Individual posts - accessible by clicking each notification */}
                        <Route
                          path="/post/:postId"
                          render={(props) => (
                            <NotificationPost
                              postId={props.match.params.postId}
                              key={props.match.params.postId}
                            />
                          )}
                        />

                        {/* Search Results */}
                        <Route
                          path="/search/:keyWord"
                          render={(props) => (
                            <SearchResults
                              keyword={props.match.params.keyWord}
                            />
                          )}
                        />

                        {/* Add Friends */}
                        <Route exact path="/addfriends">
                          <AddFriends />
                        </Route>

                        {/* Notifications */}
                        <Route exact path="/notifications">
                          <Notifications />
                        </Route>
                      </Col>
                      <Col lg={3} className="d-none d-lg-block">
                        <div className="rightSidebar" id="myRightSidebar">
                          <RightSidebar />
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </>
              </Switch>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
