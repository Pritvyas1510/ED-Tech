import { useState, useRef } from 'react';
import { videocardeffect } from '../../../../Constant';

const Section5 = () => {
  const videoRefs = useRef([]); // Reference to multiple video elements

  // Function to handle play and pause on hover
  const handleHover = (index, action) => {
    if (action === 'play') {
      videoRefs.current[index].play();
    } else {
      videoRefs.current[index].pause();
    }
  };

  return (
    <div className="mx-5">
      <h1 className="p-10 pt-28 text-3xl md:text-5xl font-serif text-black font-extrabold">
        Cutting-edge
      </h1>
      <p className="px-5  text-xs md:text-lg  font-light text-black -mt-5">
        Leverage the Latest Advancements in Our State-of-the-art
      </p>

      <div className="flex md:flex-row flex-col md:mx-5 gap-10">
        {videocardeffect.map((item, index) => (
          <div
            key={index}
            className="mt-5 rounded-lg border-2 bg-white h-96 md:w-2/6 text-wrap hover:transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl"
            onMouseEnter={() => handleHover(index, 'play')} // Play video on hover
            onMouseLeave={() => handleHover(index, 'pause')} // Pause video on hover out
          >
            <video
              ref={(el) => (videoRefs.current[index] = el)} // Assigning video reference dynamically
              className="justify-self-center"
              width="465"
              height="360"
              autoPlay={false} // Prevent autoplay on load
              loop
              muted
            >
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h1 className="mt-5 mx-2 text-black">{item.title}</h1>
            <p className="mt-2 mx-2 text-gray-500">{item.iteam}</p>
            <div className="flex mt-2">
              <div className="w-1/2 mx-2 text-gray-500 text-start">{item.paraleft}</div>
              <div className="w-1/2 -ml-10 text-end">{item.pararight}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section5;
