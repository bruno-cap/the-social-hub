import React, { useState, useEffect } from "react";
import db from "../firebase";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";
import { useAuth } from "../Context/AuthContext";
import { addPost } from "../HelperFunctions/PostAndCommentHelpers";
import CropOriginalIcon from "@material-ui/icons/CropOriginal";
import "./CreatePost.css";

function CreatePost(props) {
  const { currentUser } = useAuth();
  const [textInput, setTextInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [user, setUser] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // add post
    addPost(textInput, imageInput, currentUser, props.destinationMural);
    // clear text and image inputs
    setTextInput("");
    setImageInput("");
    // remove focus frm input fields
    document.getElementById("inputPostText").blur();
    document.getElementById("inputPostImage").blur();
  };

  const showOrHideImageField = () => {
    const imageField = document.getElementById("imageUrlField");

    imageField.classList.contains("showImageField")
      ? imageField.classList.remove("showImageField")
      : imageField.classList.add("showImageField");
  };

  return (
    <div className="createPost evenRoundedBox">
      <div className="d-flex justify-content-between">
        {user.data && (
          <Link to={`/user/${currentUser.uid}`}>
            <Avatar
              src={user.data.photo}
              className="d-inline-block align-middle"
              alt="Profile Pic"
            />
          </Link>
        )}
        <Form
          className="flex-grow-1 px-2"
          onSubmit={handleSubmit}
          style={{ marginRight: "-5px" }}
        >
          <Form.Control
            className="d-none d-md-block d-lg-none d-xl-block" // only hidden on lg screens
            id="inputPostText"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              user.data && `Tell us something nice, ${user.data.firstName}!`
            }
          />
          <Form.Control
            className="d-md-none d-lg-block d-xl-none" // only shown on lg screens
            id="inputPostText"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={user.data && `What's up, ${user.data.firstName}?`}
          />

          <div id="imageUrlField" className="hideImageField">
            <Form.Control
              className="mt-2"
              id="inputPostImage"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="Img URL"
            />
          </div>

          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-primary"
          >
            Post
          </button>
        </Form>

        <CropOriginalIcon
          onClick={showOrHideImageField}
          className="d-inline-block looksLikeLink"
          style={{
            color: "rgb(66,103,178",
            fontSize: "40px",
            marginRight: "-10px",
          }}
        />
      </div>
    </div>
  );
}

export default CreatePost;
