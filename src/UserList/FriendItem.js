import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import "./FriendItem.css";
import FriendshipPartial from "./Partials/FriendshipPartial";

function FriendItem(props) {
  return (
    <div className="friendItem evenRoundedBox">
      <Container>
        <Row>
          <Col
            xl={2}
            lg={2}
            md={2}
            sm={2}
            xs={3}
            className="d-flex flex-column justify-content-center p-0"
          >
            <Link to={`/user/${props.userId}`}>
              <Avatar
                src={props.photo}
                alt="Profile Pic"
                style={{
                  width: "60px",
                  height: "60px",
                  margin: "auto",
                }}
              />
            </Link>
          </Col>
          <Col
            xl={4}
            lg={3}
            md={6}
            sm={7}
            xs={4}
            className="mt-2 my-auto text-left pl-2 pl-sm-auto"
            style={{ margin: "auto" }}
          >
            <Link
              to={`/user/${props.userId}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <p className="d-inline-block m-0">
                {props.firstName} {props.lastName}
              </p>
            </Link>
          </Col>
          <Col
            xl={6}
            lg={7}
            md={4}
            sm={3}
            xs={5}
            id="friendShipStatus"
            className="my-auto"
          >
            <FriendshipPartial userId={props.userId} location="userList" />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default FriendItem;
