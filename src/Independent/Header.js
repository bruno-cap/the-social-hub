import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header(props) {
  return (
    <div className="header">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1>The Social Hub</h1>
      </Link>
    </div>
  );
}

export default Header;
