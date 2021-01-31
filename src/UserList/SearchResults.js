import React, { useState, useEffect } from "react";
import db from "../firebase";
import PendingActionPartial from "./Partials/PendingActionPartial";
import MyselfPartial from "./Partials/MyselfPartial";
import FriendsPartial from "./Partials/FriendsPartial";
import OtherPeoplePartial from "./Partials/OtherPeoplePartial";
import { useAuth } from "../Context/AuthContext";

function SearchResults(props) {
  const { currentUser } = useAuth();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .orderBy("firstName")
      .orderBy("lastName")
      .onSnapshot((snapshot) => {
        // in case the 'keyword' prop was passed, check if firstName or lastName contains the keyword
        let alteredSnapshot = snapshot.docs
          .filter(
            (user) =>
              user
                .data()
                .firstName.toLowerCase()
                .includes(props.keyword.toLowerCase()) ||
              user
                .data()
                .lastName.toLowerCase()
                .includes(props.keyword.toLowerCase()) ||
              (
                user.data().firstName.toLowerCase() +
                " " +
                user.data().lastName.toLowerCase()
              ).includes(props.keyword.toLowerCase())
          )
          .map((doc) => ({ id: doc.id, data: doc.data() }));

        setSearchResults(alteredSnapshot);
      });

    return () => {
      // check if any of the input fields are displayed and, if positive, clear them.
      if (document.getElementById("inputField") || document.getElementById("inputFieldForSmallerScreens")) {
      // remove the search keyword from the search bar when leaving the component
      document.getElementById("inputField").value = "";
      document.getElementById("inputFieldForSmallerScreens").value = "";

      // on smaller screens, return search bar to hidden position and show title
      document
        .getElementById("inputFieldForSmallerScreens")
        .classList.remove("showSearchBar");
      document
        .getElementById("headerTitleSmallerScreens")
        .classList.remove("hideTitle");
      }

      unsubscribe();
    };
  }, [props.keyword]);

  return (
    <div className="searchResults">
      <PendingActionPartial userList={searchResults} />
      <MyselfPartial userList={searchResults} />
      <FriendsPartial userId={currentUser.uid} userList={searchResults} />
      <OtherPeoplePartial userList={searchResults} />
    </div>
  );
}

export default SearchResults;
