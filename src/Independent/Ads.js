import React, { useEffect, useState } from "react";
import db from "../firebase";
import "./Ads.css";

function Ads() {
  const [adToDisplay, setAdToDisplay] = useState("");

  useEffect(() => {
    const unsubscribe = db.collection("ads").onSnapshot((snapshot) => {
      const randomAd = snapshot.docs[
        Math.floor(Math.random() * snapshot.docs.length)
      ].data().adUrl;
      setAdToDisplay(randomAd);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="ads">
      <p>Advertise with us!</p>
      <img src={adToDisplay} alt="" />
    </div>
  );
}

export default Ads;
