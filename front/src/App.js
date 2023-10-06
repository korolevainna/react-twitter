// import React from "react";
//import { useState, useEffect } from "react";
import Page from "./component/page";
import PostList from "./container/post-list";

function App() {
  // const [location, setLocation] = useState(null);

  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setLocation({ latitude, longitude });
  //       },
  //       (error) => {
  //         console.error("Помилка отримання геолокації", error.message);
  //       }
  //     );
  //   } else {
  //     console.log("Геолокація не підтримується в цьому браузері");
  //   }
  // }, []);

  return (
    <Page>
      {/* {location ? (
        <div>
          <h2>Ваша геолокація:</h2>
          <p>Широта: {location.latitude}</p>
          <p>Довгота: {location.longitude}</p>
        </div>
      ) : (
        <p>Отримання геолокації...</p>
      )} */}
      <PostList />
    </Page>
  );
}

export default App;
