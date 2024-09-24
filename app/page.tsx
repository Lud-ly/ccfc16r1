"use client";

import { useState } from "react";
import Navigation from "~/src/components/Sections/components/Navigation";
import Classement from "~/src/components/Sections/widgets/Classement";
import Tendances from "~/src/components/Sections/widgets/Tendances";

const Home = () => {
  return (
    <div className="home">
      <Navigation />
      <Classement />
      <Tendances />
    </div>
  );
};

export default Home;
