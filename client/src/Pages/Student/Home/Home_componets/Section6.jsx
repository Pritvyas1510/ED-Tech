

const Section6 = () => {
  return (
    <div className="bg-red-100 md:mt-28  mt-24 mx-5 md:mx-5">
      <div className="flex md:flex-row flex-col md:p-2">
        <div className="md:w-1/2 md:mt-10 md:mx-5  mx-2 mt-5">
          <h1 className="md:text-6xl text-2xl md:mt-5  mx-5 md:w-[530px] font-serif font-extrabold text-black ">
            Unlock Your Potential with{" "}
          </h1>
          <p className="md:w-[400px] m-5 text-gray-600 text-lg">
            At Ed Teach, we believe in empowering individuals to reach their
            full potential. Our online learning platform provides a
          </p>
          <div className="flex gap-4 m-5">
            <div>
              <button className="bg-orange-600 text-white rounded-full h-10 w-32">
                Enroll Now
              </button>
            </div>
            <button className="bg-white text-black rounded-full h-10 w-32">
              Start Learning
            </button>
          </div>
        </div>

        <div className="md:w-1/2">
          <img
            src="/Image/Dots.png"
            alt=""
            className="z-0 justify-self-end md:mr-24  w-32"
          />
          <video
            controls
            className="rounded-2xl -mt-20 z-20 absolute mx-12 md:mx-0 w-72 md:w-[560px]"
          >
            <source src="/Video/Ed_tech_introduction.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <img
            src="/Image/Dots.png"
            alt=""
            className="z-0 justify-self-start md:mx-20 md:mt-40 md:-ml-14 w-32 "
          />
        </div>
      </div>
    </div>
  );
};
export default Section6;
