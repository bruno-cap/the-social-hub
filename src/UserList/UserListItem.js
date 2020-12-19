import React from "react";
import { Row, Col } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./UserListItem.css";
import { useHistory } from "react-router-dom";

function UserListItem(props) {
  let history = useHistory();

  const redirect = (e) => {
    e.preventDefault();
    history.push(`/user/${props.userId}`);
  };

  return (
    <Row className="mb-3">
      <Col
        className="d-flex justify-content-md justify-content-center"
        xl={3}
        xs={12}
      >
        <span
          className="looksLikeLink"
          onClick={redirect}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Avatar src={props.photo} alt="" />
        </span>
      </Col>
      <Col
        className="mt-2 d-flex justify-content-md justify-content-center"
        xl={9}
        xs={12}
      >
        <Link
          to={`/user/${props.userId}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {props.name}
        </Link>
      </Col>
    </Row>
  );
}

export default UserListItem;
