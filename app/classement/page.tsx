import React from "react";
import Classement from "../../src/components/Sections/widgets/Classement";
import ArrowBack from "../../src/components/Sections/components/ArrowBack";


export default function ClassementPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center">
        <ArrowBack iSize={40} />
      </div>
      <Classement />
    </div>
  );
}