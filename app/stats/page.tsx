import React from "react";
import ChickenSoccerStory  from "~/src/components/Sections/components/ChickenSoccerStory";
import GraphComponent from "~/src/components/Sections/widgets/Graph";


export default function StatsPage() {
  return (
    <div className="container mx-auto">
      <GraphComponent />
      <ChickenSoccerStory/>
    </div>
  );
}