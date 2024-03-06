import React from "react";
import "./cssFiles/home.css";
import { Link } from "react-router-dom";
const Home = ({ sections, sectionClicked }) => {
  console.log(sections);
  if (!sections) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="title-container">
        <h1 className="title">Title of this program</h1>
        <p className="home-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
        </p>
      </div>
      <div className="outer-wrapper">
        <div className="inner-flexbox">
          {sections.map((e) => {
            return (
              <Link
                className="section-container"
                to="/schedule"
                state={{ section: e }}
              >
                <p>{e.data.name}</p>
                <p className="section-description ">{e.data.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
