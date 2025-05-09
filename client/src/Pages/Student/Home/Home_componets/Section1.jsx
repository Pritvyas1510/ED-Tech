const Section1 = () => {
  return (
    <div className="bg-[url('/Image/SectionBackground.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full flex flex-col items-center justify-center text-white px-5 md:px-20 overflow-x-hidden">
      
      {/* Title */}
      <h1 className="py-3 text-3xl sm:text-4xl md:text-6xl text-center font-serif font-extrabold max-w-[600px]">
        Elevate Your Learning with Ed
      </h1>

      {/* Description */}
      <p className="text-center text-sm sm:text-base md:text-lg md:w-2/4 pt-4">
        Ed Teach is your gateway to a world of knowledge. Our online learning 
        platform offers a diverse selection of technical and theoretical subject 
        videos, along with detailed notes, empowering you to expand your expertise 
        and reach new heights in your academic or professional pursuits. Explore our 
        comprehensive course offerings, learn from industry-leading experts, and unlock 
        a future of endless possibilities.
      </p>

      {/* Button */}
      <div className="mt-6 md:mt-10">
        <button className="bg-orange-600 text-white rounded-full h-10 w-32 hover:bg-orange-700 transition">
          Enroll Now
        </button>
      </div>
    </div>
  );
};

export default Section1;
