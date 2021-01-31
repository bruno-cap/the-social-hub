import firebase from "firebase/app";
import db from "../firebase";

export const checkFriendShipStatusHelper = (userDocument, otherUserId) => {
  let friendShipStatus;
  let found = false;

  // check if the result is the user him/herself
  if (userDocument.data().userId === otherUserId) {
    friendShipStatus = "user";
    found = true;
  }

  // if otherUserId is on userDocument's friend list -> friends
  if (!found && userDocument.data().friends.includes(otherUserId)) {
    friendShipStatus = "friends";
    found = true;
  }

  // if otherUserId is on userDocument's requestsSent list -> pendingFriendsApproval
  if (!found && userDocument.data().requestsSent.includes(otherUserId)) {
    friendShipStatus = "pendingFriendsApproval";
    found = true;
  }

  // if they are on your requestsReceived list -> pendingUserApproval
  if (!found && userDocument.data().requestsReceived.includes(otherUserId)) {
    friendShipStatus = "pendingUserApproval";
    found = true;
  }

  // none of the above -> show button to add friend
  if (!found) {
    friendShipStatus = "notFriends";
  }

  return friendShipStatus;
};

export const sendFriendRequestHelper = (senderUserId, receiverUserId) => {
  // add senderUserId to the receiver's requestsReceived array
  db.collection("users")
    .doc(receiverUserId)
    .update({
      requestsReceived: firebase.firestore.FieldValue.arrayUnion(senderUserId),
    });
  // add the receiverUserId id to the sender's requestsSent array
  db.collection("users")
    .doc(senderUserId)
    .update({
      requestsSent: firebase.firestore.FieldValue.arrayUnion(receiverUserId),
    });
};

export const approveFriendRequestHelper = (senderUserId, receiverUserId) => {
  // add senderUserId to the receiver's friends array
  db.collection("users")
    .doc(receiverUserId)
    .update({
      friends: firebase.firestore.FieldValue.arrayUnion(senderUserId),
    });

  // add receiverUserId to the sender's friends array
  db.collection("users")
    .doc(senderUserId)
    .update({
      friends: firebase.firestore.FieldValue.arrayUnion(receiverUserId),
    });

  // delete friend request
  deleteFriendRequestHelper(senderUserId, receiverUserId);
};

export const deleteFriendRequestHelper = (senderUserId, receiverUserId) => {
  // remove receiverUserId from the sender's requestSent array
  db.collection("users")
    .doc(senderUserId)
    .update({
      requestsSent: firebase.firestore.FieldValue.arrayRemove(receiverUserId),
    });

  // remove senderUserId from the receiver's requestsReceived array
  db.collection("users")
    .doc(receiverUserId)
    .update({
      requestsReceived: firebase.firestore.FieldValue.arrayRemove(senderUserId),
    });
};

export const unfriendHelper = (senderUserId, receiverUserId) => {
  // remove senderUserId from the receiver's friend array
  db.collection("users")
    .doc(receiverUserId)
    .update({
      friends: firebase.firestore.FieldValue.arrayRemove(senderUserId),
    });

  // remove receiverUserId from the sender's friend array
  db.collection("users")
    .doc(senderUserId)
    .update({
      friends: firebase.firestore.FieldValue.arrayRemove(receiverUserId),
    });
};
