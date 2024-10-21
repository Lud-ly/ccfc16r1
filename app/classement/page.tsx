import React from "react";
import Classement from "../../src/components/Sections/widgets/Classement";
import ChickenSoccerStory from "~/src/components/Sections/components/ChickenSoccerStory";


export default function ClassementPage() {
  return (
    <div className="container mx-auto">
      <Classement />
      <ChickenSoccerStory/>
    </div>
  );
}