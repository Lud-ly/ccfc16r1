"use client";
import DernierMatch from "../src/components/Sections/widgets/DernierMatch";

const Home = () => {
  return (
    <div className="home relative min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/bg2.jpg')] bg-no-repeat bg-center bg-cover bg-fixed h-full w-full"></div>
      <div className="relative z-10 flex items-start justify-center min-h-screen"> 
          <DernierMatch />
      </div>
    </div>
  );
};

export default Home;
