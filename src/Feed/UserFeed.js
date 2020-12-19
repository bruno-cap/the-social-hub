import React, { useState, useEffect } from "react";
import Post from "./Post";
import db from "../firebase";

function UserFeed(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .where("destinationMural", "==", props.userId)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

    return () => {
      unsubscribe();
    };
  }, [props.userId]);

  return (
    <div className="userMural">
      {posts.map((post) => (
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
      ))}
    </div>
  );
}

export default UserFeed;
