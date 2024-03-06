import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./components/Home";
import Schedule from "./components/Schedule/Schedule";
import { getSections } from "./firebase/utils";

function App() {
  const [sections, setSections] = useState();
  const [sectionClickedID, setSectionsClickedID] = useState();

  const getData = async () => {
    const data = await getSections();
    setSections(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Router>
      {" "}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              sections={sections}
              sectionClicked={(id) => setSectionsClickedID(id)}
            />
          }
        />
        <Route
          path="/schedule"
          element={<Schedule section={sectionClickedID} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
