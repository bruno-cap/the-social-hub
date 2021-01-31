import React, { useEffect } from "react";
import FriendsSide from "../Sides/FriendsSide";
import Ads from "./Ads";
import FriendSuggestionsSide from "../Sides/FriendSuggestionsSide";
import { useAuth } from "../Context/AuthContext";

function RightSidebar() {
  useEffect(() => {
    // add event listeners for when users either scroll or resize window -> call stickySides() then
    window.addEventListener("scroll", stickyRightSide);
    window.addEventListener("resize", stickyRightSide);
    // remove event listeners when closing the component
    return () => {
      window.removeEventListener("scroll", stickyRightSide);
      window.removeEventListener("resize", stickyRightSide);
    };
  }, []);

  const stickyRightSide = () => {
    const rightSidebar = document.getElementById("myRightSidebar");
    const header = document.getElementById("myHeader");

    const marginTop = 25;
    const marginBottom = 25;
    const fineTuning = -1; // pixel

    let tippingPoint =
      header.offsetHeight +
      marginTop +
      rightSidebar.offsetHeight +
      marginBottom +
      fineTuning;

    if (
      document.documentElement.clientHeight -
        header.offsetHeight -
        marginTop -
        rightSidebar.offsetHeight -
        marginBottom >
      0
    ) {
      rightSidebar.classList.remove("bottomFixed");
      rightSidebar.classList.add("topFixed");
    } else {
      rightSidebar.classList.remove("topFixed");
      if (
        window.pageYOffset >
        tippingPoint - document.documentElement.clientHeight
      ) {
        rightSidebar.classList.add("bottomFixed");
      } else {
        rightSidebar.classList.remove("bottomFixed");
      }
    }
  };

  const { currentUser } = useAuth();
  return (
    <div className="rightSidebar">
      <FriendsSide userId={currentUser.uid} />
      <Ads />
      <FriendSuggestionsSide />
    </div>
  );
}

export default RightSidebar;
