import { containercard } from "../../../../Constant"

const Section7 = () =>
{
    return(
        <div className="mx-5">
            <h1 className="mt-20 text-center text-2xl text-orange-500 font-serif">About Us</h1>
            <h1 className="mt-10 text-center justify-self-center text-black w-1/3 font-serif font-extrabold text-5xl">Revolutionizing Online </h1>

                <div className="flex md:flex-row flex-col gap-5">
                {containercard.map((item) =>(
                     <div key={item.title} className="  mt-20 border-2 bg-rose-100 h-96 w-full hover:transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl rounded-lg">
                     <img className="w-32 justify-self-center mt-10" src={item.image} alt="Our Mission" />
                     <h1 className="text-xl text-black font-bold text-center my-5">{item.title}</h1>
                     <p className="w-4/5 justify-self-center text-center text-base-100 ">{item.para}</p>
                     </div>
                ))}
                    
                </div>
        </div>
    )
}

export default Section7