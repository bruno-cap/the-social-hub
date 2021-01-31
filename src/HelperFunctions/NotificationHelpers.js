import firebase from "firebase/app";
import db from "../firebase";

export const addLikePostNotification = (
  postId,
  currentUser,
  receiverUserId
) => {
  db.collection("notifications").add({
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    senderProfilePic: currentUser.photoURL,
    senderUserId: currentUser.uid,
    senderUsername: currentUser.displayName,
    receiverUserId: receiverUserId,
    action: "likePost",
    isRead: false,
    postId: postId,
  });
};

export const removeLikePostNotification = (postId, currentUser) => {
  // fetch likePost notification
  db.collection("notifications")
    .where("postId", "==", postId)
    .where("action", "==", "likePost")
    .where("senderUserId", "==", currentUser.uid)
    .get()
    .then(function (querySnapshot) {
      // delete likePost notification
      db.collection("notifications")
        .doc(querySnapshot.docs[0].id)
        .delete()
        .then(function () {
          console.log("Notification successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing notification: ", error);
        });
    })
    .catch(function (error) {
      console.error("Error removing notification: ", error);
    });
};

export const removeAllPostNotifications = (postId) => {
  db.collection("notifications")
    .where("postId", "==", postId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // delete notifications one at a time
        db.collection("notifications")
          .doc(doc.id)
          .delete()
          .then(function () {
            console.log("Notification successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing notification: ", error);
          });
      });
    })
    .catch(function (error) {
      console.error("Error removing notification: ", error);
    });
};

export const addCommentNotification = (
  postId,
  commentId,
  currentUser,
  receiverUserId
) => {
  db.collection("notifications").add({
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    senderProfilePic: currentUser.photoURL,
    senderUserId: currentUser.uid,
    senderUsername: currentUser.displayName,
    receiverUserId: receiverUserId,
    action: "commentPost",
    isRead: false,
    postId: postId,
    commentId: commentId,
  });
};

export const removeAllCommentNotifications = (commentId) => {
  db.collection("notifications")
    .where("commentId", "==", commentId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // delete notifications one at a time
        db.collection("notifications")
          .doc(doc.id)
          .delete()
          .then(function () {
            console.log("Notification successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing notification: ", error);
          });
      });
    })
    .catch(function (error) {
      console.error("Error removing notification: ", error);
    });
};

export const addLikeCommentNotification = (
  postId,
  commentId,
  currentUser,
  receiverUserId
) => {
  if (receiverUserId !== currentUser.uid) {
    db.collection("notifications").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      senderProfilePic: currentUser.photoURL,
      senderUserId: currentUser.uid,
      senderUsername: currentUser.displayName,
      receiverUserId: receiverUserId,
      action: "likeComment",
      isRead: false,
      postId: postId,
      commentId: commentId,
    });
  }
};

export const removeLikeCommentNotification = (commentId, currentUser) => {
  // fetch like notification
  db.collection("notifications")
    .where("commentId", "==", commentId)
    .where("action", "==", "likeComment")
    .where("senderUserId", "==", currentUser.uid)
    .get()
    .then(function (querySnapshot) {
      // delete like notification
      db.collection("notifications")
        .doc(querySnapshot.docs[0].id)
        .delete()
        .then(function () {
          console.log("Notification successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing notification: ", error);
        });
    })
    .catch(function (error) {
      console.error("Error removing notification: ", error);
    });
};
