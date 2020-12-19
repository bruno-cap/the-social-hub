import React from "react";
import db from "../firebase";
import firebase from "firebase/app";
import ThumbUpAltRoundedIcon from "@material-ui/icons/ThumbUpAltRounded";
import { useAuth } from "../Context/AuthContext";
import "./Comments.css";

function Comments(props) {
  const { currentUser } = useAuth();

  const addLike = () => {
    let found = false;
    let tempArray = props.likes;

    for (let i = 0; i < tempArray.length && !found; i++) {
      if (tempArray[i] === currentUser.uid) {
        // userId is found in the likes array -> remove
        found = true;
        tempArray.splice(i, 1);
      }
    }

    if (!found) {
      // userId is NOT found in the likes array -> add
      tempArray.push(currentUser.uid);

      // add notification entry ONLY if you're NOT liking your own comment.
      if (props.userId !== currentUser.uid) {
        db.collection("notifications").add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          senderProfilePic: currentUser.photoURL,
          senderUserId: currentUser.uid,
          senderUsername: currentUser.displayName,
          receiverUserId: props.userId,
          action: "likeComment",
          isRead: false,
          objectId: props.postId,
        });
      }
    }
    // update the corresponding comment document in the comments collection with the new 'likes' array
    db.collection("comments").doc(props.id).update({ likes: tempArray });
  };

  return (
    <div className="comment">
      <p>
        <span className="commentContent">{props.content}</span>{" "}
        {props.likes.length > 0 ? (
          <>
            <ThumbUpAltRoundedIcon
              style={{ maxWidth: "20px", color: "rgb(0,123,255)" }}
            />{" "}
            {props.likes.length}
          </>
        ) : (
          ""
        )}
      </p>
      <p>
        <span
          className="looksLikeLink"
          onClick={addLike}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Like{" "}
        </span>{" "}
        {props.date &&
          props.date.toDate().getMonth() +
            1 +
            "/" +
            props.date.toDate().getDate()}
      </p>
    </div>
  );
}

export default Comments;
