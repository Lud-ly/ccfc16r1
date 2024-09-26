"use client";

import Navigation from "~/src/components/Sections/components/Navigation";
import Classement from "~/src/components/Sections/widgets/Classement";

const Home = () => {
  return (
    <div className="home">
      <Navigation />
      <Classement />
    </div>
  );
};

export default Home;
