import { effectConst } from "../../../../Constant";


const Div = () => {
  return (
    <div className="py-20 ">
      <div className="flex md:flex-row flex-col  items-center justify-between md:gap-2 gap-y-10 gap-5 mx-5">
        {effectConst.map(item =>(
            <div key={item.title} className="rounded-lg border-2 bg-rose-100 h-52 w-full text-wrap hover:transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl ">
            <img
              src={item.image}
              alt=" image"
              className="max-w-48 justify-self-center"
           
            />
            <h1 className="-m-6 text-black text-center text-xl">
              {item.title}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Div;
