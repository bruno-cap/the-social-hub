import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ChatList from "./ChatList";
import NewMessage from "./NewMessage";
import "./Messenger.css";

function Messenger(props) {
  return (
    <div className="messenger">
      <Container id="messenger" style={{ backgroundColor: "white" }}>
        <Row>
          <Col xl={3} lg={4} md={2} sm={2} xs={3}>
            <ChatList activeChat={props.userId} />
          </Col>
          <Col
            xl={9}
            lg={8}
            md={10}
            sm={10}
            xs={9}
            style={{
              paddingLeft: "0",
            }}
          >
            <NewMessage friendToMessage={props.userId} key={props.userId} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Messenger;
