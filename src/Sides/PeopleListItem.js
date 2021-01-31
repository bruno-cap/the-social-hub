import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./PeopleListItem.css";
import { useHistory } from "react-router-dom";

function PeopleListItem(props) {
  let history = useHistory();

  const redirect = (e) => {
    e.preventDefault();
    history.push(`/user/${props.userId}`);
  };

  return (
    <div className="peopleListItem text-left d-inline-block">
      <Container style={{ padding: "0" }}>
        <Row className=" mx-0">
          <Col
            className="d-flex justify-content-md justify-content-center"
            xs={12}
          >
            <span
              className="looksLikeLink"
              onClick={redirect}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Avatar
                className="friendSideAvatar d-inline-block d-flex align-middle"
                src={props.photo}
                alt="Friend Profile Pic"
              />
            </span>
          </Col>
          <Col className="text-center pt-1 px-0" xs={12}>
            <Link
              to={`/user/${props.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <p className="d-inline-block my-0 mx-0">
                {props.firstName} {props.lastName}
              </p>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default PeopleListItem;
