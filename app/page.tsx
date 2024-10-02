"use client";
import DernierMatch from "../src/components/Sections/widgets/DernierMatch";

const Home = () => {
  return (
    <div className="home relative min-h-screen">
      <div className="absolute inset-0 bg-[url('/images/bg2.jpg')] bg-no-repeat bg-center bg-cover sm:bg-fixed"></div>
      <div className="relative z-10 flex items-start justify-center min-h-screen pt-[calc(100vh/6)]">
        <div className="w-full max-w-4xl">
          <DernierMatch />
        </div>
      </div>
    </div>
  );
};

export default Home;