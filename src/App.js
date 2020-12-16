import React from "react";
import { Route, Switch } from "react-router-dom";
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
import firebase from "firebase";
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
            <Route exact path="/signup" component={Signup} />
            <Login />
          </Switch>
        </>
      ) : (
        <div className="app" style={{ textDecoration: "none" }}>
          <Switch>
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/login" component={Login} />
            <Container className="content">
              <Row>
                <Col className="justify-content" lg={3} md={12} sm={12}>
                  <Sidebar key={firebase.auth().currentUser} />
                </Col>
                <Col lg={6} md={12}>
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
                </Col>
                <Col lg={3} md={12}>
                  <UserList />
                  <Ads />
                </Col>
              </Row>
            </Container>
          </Switch>
        </div>
      )}
    </>
  );
}

export default App;
