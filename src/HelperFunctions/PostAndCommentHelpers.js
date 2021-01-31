import firebase from "firebase/app";
import db from "../firebase";
import * as notificationHelpers from "./NotificationHelpers";

export const addComment = (
  commentContent,
  postId,
  currentUser,
  receiverUserId
) => {
  // add content document to 'comments' collection
  db.collection("comments")
    .add({
      content: commentContent,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      likes: [],
      postId: postId,
      // user info
      profilePic: currentUser.photoURL,
      userId: currentUser.uid,
      username: currentUser.displayName,
    })
    .then(function (docRef) {
      // add notification entry ONLY if you're NOT commenting on your own post.
      receiverUserId !== currentUser.uid &&
        notificationHelpers.addCommentNotification(
          postId,
          docRef.id,
          currentUser,
          receiverUserId
        );
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
};

export const addPost = (textMessage, imageUrl, currentUser, receiverUserId) => {
  db.collection("posts").add({
    message: textMessage,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    profilePic: currentUser.photoURL,
    userId: currentUser.uid,
    username: currentUser.displayName,
    image: imageUrl,
    likes: [],
    destinationMural: receiverUserId,
  });
};

export const addLikePost = (
  likesArray,
  postId,
  currentUser,
  receiverUserId
) => {
  let tempArray = likesArray;

  // check if tempArray contains currentUser.uid
  if (tempArray.includes(currentUser.uid)) {
    tempArray.splice(tempArray.indexOf(currentUser.uid), 1);

    // remove notification entry ONLY if you're not removing the like from your own post
    receiverUserId !== currentUser.uid &&
      notificationHelpers.removeLikePostNotification(postId, currentUser);

    // if not, push currentUser.uid and add notification
  } else {
    tempArray.push(currentUser.uid);

    // add notification entry ONLY if you're NOT liking your own post.
    receiverUserId !== currentUser.uid &&
      notificationHelpers.addLikePostNotification(
        postId,
        currentUser,
        receiverUserId
      );
  }

  // update likes array
  db.collection("posts").doc(postId).update({ likes: tempArray });
};

export const removePost = (postId) => {
  // delete post comments
  db.collection("comments")
    .where("postId", "==", postId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // delete comments one at a time
        db.collection("comments")
          .doc(doc.id)
          .delete()
          .then(function () {
            console.log("Comment successfully deleted!");
          })
          .catch(function (error) {
            console.error("Error removing comment: ", error);
          });
      });
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });

  // delete post notifications
  notificationHelpers.removeAllPostNotifications(postId);

  // delete current post from the 'posts' collection
  db.collection("posts")
    .doc(postId)
    .delete()
    .then(function () {
      console.log("Document successfully deleted!");
    })
    .catch(function (error) {
      console.error("Error removing document: ", error);
    });
};

export const addLikeComment = (
  likesArray,
  postId,
  commentId,
  currentUser,
  receiverUserId
) => {
  let tempArray = likesArray;

  if (tempArray.includes(currentUser.uid)) {
    tempArray.splice(tempArray.indexOf(currentUser.uid), 1);
    // remove notification entry ONLY if you're not removing the like from your own post
    receiverUserId !== currentUser.uid &&
      notificationHelpers.removeLikeCommentNotification(commentId, currentUser);
  } else {
    // userId is NOT found in the likes array -> add
    tempArray.push(currentUser.uid);
    // add notification entry ONLY if you're NOT liking your own comment.
    receiverUserId !== currentUser.uid &&
      notificationHelpers.addLikeCommentNotification(
        postId,
        commentId,
        currentUser,
        receiverUserId
      );
  }

  // update the corresponding comment document in the comments collection with the new 'likes' array
  db.collection("comments").doc(commentId).update({ likes: tempArray });
};

export const removeComment = (commentId) => {
  // remove notifications related to the comment to be deleted
  notificationHelpers.removeAllCommentNotifications(commentId);

  // delete current comment from the 'comments' collection
  db.collection("comments")
    .doc(commentId)
    .delete()
    .then(function () {
      console.log("Comment successfully deleted!");
    })
    .catch(function (error) {
      console.error("Error removing comment: ", error);
    });
};
