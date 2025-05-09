const Section3 = () => {
  return (
    <div className="mt-20 mx-5 bg-rose-50 flex md:flex-row flex-col">
      <div className="md:w-1/2">
        <img src="Image/Person.png" alt="" className="  p-5 " />
      </div>
      <div className="mt-5 mx-5 md:w-1/2">
        <span className="  text-orange-400 md:text-2xl ">
          Flexible Learning
        </span>
        <h1 className="text-black mt-5 text-2xl md:text-6xl font-serif ">
          Unlock the Power of Self paced Education at Your
        </h1>
        <p className="md:w-3/4 mt-5 text-gray-700 md:text-lg ">
          At Ed Teach, we understand the importance of flexible learning. Our
          online platform allows you to access course materials at your own
          pace, empowering you to balance your studies with other commitments{" "}
        </p>
        <div className="mt-7 flex  gap-6">
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
    </div>
  );
};

export default Section3;
