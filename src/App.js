import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Header from "./Independent/Header";
import Sidebar from "./Independent/Sidebar";
import CreatePost from "./Feed/CreatePost";
import Ads from "./Independent/Ads";
import GeneralFeed from "./Feed/GeneralFeed";
import UserFeed from "./Feed/UserFeed";
import Login from "./Credentials/Login";
import Signup from "./Credentials/Signup";
import UserList from "./UserList/UserList";
import NewMessage from "./Messenger/NewMessage";
import { useAuth } from "./Context/AuthContext";
import TopScrolling from "./topScrolling";
import "./App.css";

function App() {
  const { currentUser } = useAuth();
  return (
    <>
      <Header />
      {!currentUser ? (
        <>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            {/* If !currentUser and the user doesn't type either /login or /signup, render Login */}
            <Login />
          </Switch>
        </>
      ) : (
        <div className="app" style={{ textDecoration: "none" }}>
          <Container className="content">
            <Row>
              <Col className="justify-content" lg={3} md={12} sm={12}>
                <Sidebar />
              </Col>
              <Col lg={6} md={12}>
                <Switch>
                  {/* If user is logged in and type /signup or /login, render "/" */}
                  <Route exact path="/login">
                    <Redirect to="/" />
                  </Route>
                  <Route exact path="/signup">
                    <Redirect to="/" />
                  </Route>
                  <Route exact path="/">
                    <TopScrolling />
                    <CreatePost destinationMural="public" />
                    <GeneralFeed />
                  </Route>
                  <Route
                    path="/user/:userId"
                    render={(props) => (
                      <>
                        <TopScrolling />
                        <CreatePost
                          destinationMural={props.match.params.userId}
                        />
                        <UserFeed
                          userId={props.match.params.userId}
                          key={props.match.params.userId}
                        />
                      </>
                    )}
                  />
                  <Route exact path="/messenger">
                    <TopScrolling />
                    <NewMessage />
                  </Route>
                </Switch>
              </Col>
              <Col lg={3} md={12}>
                <UserList />
                <Ads />
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </>
  );
}

export default App;
