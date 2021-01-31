import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import UserFeed from "../Feed/UserFeed";
import FriendsSide from "../Sides/FriendsSide";
import UserMuralInfo from "../Feed/UserMuralInfo";
import CreatePost from "../Feed/CreatePost";
import "./UserMural.css";

function UserMural(props) {
  return (
    <div className="userMural">
      <Container className="contentContainer" id="userMuralContainer">
        <Row className="justify-content-center mx-0 mx-sm-auto">
          <Col lg={9} md={12} className="px-0 px-sm-auto">
            <UserMuralInfo userId={props.userId} />
          </Col>
        </Row>
        <Row
          id="userMuralContentBelowActionBar"
          className="justify-content-center mx-0 mx-sm-auto"
        >
          <Col
            id="friendSideInMurals"
            lg={3}
            md={12}
            className="px-0 px-sm-auto"
          >
            <FriendsSide userId={props.userId} />
          </Col>
          <Col lg={6} md={12} className="px-0 px-sm-auto">
            <CreatePost destinationMural={props.userId} />
            <UserFeed userId={props.userId} key={props.userId} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default UserMural;
