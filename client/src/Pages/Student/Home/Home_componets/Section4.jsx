import React from "react";

function Section4() {
  return (
    <div className="bg-orange-400 h-40 md:h-80 mt-20 mx-5 w-3/4 justify-self-end md:relative flex md:z-0">
      <div className="w-2/3 justify-self-start">
        <img
          src="Image/personin.png"
          alt=""
          className="w-2/3 md:w-1/3 mr-96 md:-ml-[322px] pt-5 -ml-28 md:-mt-12 md:absolute md:z-10"
        />
      </div>
      <div className="-ml-[175px] md:-ml-[400px]">
        
        <h1 className="md:text-6xl text-center md:-ml-20 py-2 text-white font-extrabold md:pt-10 font-serif">
          Elevate Your Career
        </h1>
        <h3 className="md:text-start md:text-lg text-xs  w-full md:w-1/2 text-white font-extralight md:-ml-56 -my-2 mt-1 md:my-3  md:justify-self-center">
          Unlock new career opportunities and unleash your full potential with
          our comprehensive online courses. Whether you're looking to upskill in
          your current field or explore a new direction
        </h3>
        <div className="md:justify-self-center w-3/5 mt-4 md:-ml-36  md:mt-6">
          <button className="bg-white text-black font-extralight rounded-full h-10 w-32">
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Section4;
