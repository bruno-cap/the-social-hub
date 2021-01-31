import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Post from "../Feed/Post";
import db from "../firebase";

function NotificationPost(props) {
  const history = useHistory();
  const [post, setPost] = useState("");

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .doc(props.postId)
      .onSnapshot((snapshot) => {
        snapshot.exists
          ? setPost({ id: snapshot.id, data: snapshot.data() })
          : // if post was deleted, push user to "/"
            history.push("/");
      });
    return () => {
      unsubscribe();
    };
  }, [props.postId, history]);

  return (
    <div className="notificationPost">
      {post && (
        <Post
          key={post.id}
          postId={post.id}
          userId={post.data.userId}
          profilePic={post.data.profilePic}
          message={post.data.message}
          timestamp={post.data.timestamp}
          username={post.data.username}
          image={post.data.image}
          likes={post.data.likes}
          comments={post.data.comments}
        />
      )}
    </div>
  );
}

export default NotificationPost;
