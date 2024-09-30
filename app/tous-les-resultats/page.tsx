import React from "react";
import ArrowBack from "../../src/components/Sections/components/ArrowBack";


export default function TousLesResultatsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center">
        <ArrowBack iSize={40} />
        <h1 className="text-2xl p-3">Tous les Résultats</h1>
      </div>

    </div>
  );
}