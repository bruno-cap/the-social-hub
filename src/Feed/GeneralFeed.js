import React, { useState, useEffect } from "react";
import Post from "./Post";
import db from "../firebase";

function GeneralFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("posts")
      .where("destinationMural", "==", "public")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="generalFeed">
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

export default GeneralFeed;
