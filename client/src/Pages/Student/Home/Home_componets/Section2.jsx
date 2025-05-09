
import { cardContent } from "../../../../Constant";

const Section2 = () =>
{
    return(
        <div>
            <h1 className="font-bold font-serif text-3xl md:text-6xl justify-self-center text-black md:w-2/5 text-center mt-20 mb-12">Explore Our Course</h1>
            <div className="flex md:flex-row flex-col   items-center justify-between md:gap-5 gap-y-10 gap-10 mx-5">
                {cardContent.map((item) =>(
                     <div key={item.title} className="  border-2 bg-rose-100 h-80 w-full hover:transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl rounded-lg">
                     <img src={item.image} alt={item.title} className="w-36 pt-10 justify-self-center" />
                     <p className="text-black text-xl text-center my-2">{item.title}</p>
                     <h1 className="text-gray-900 w-2/3 justify-self-center text-center ">{item.text}</h1>
                 </div>
                ))}

              
            </div>
            
        </div>
    )
}

export default Section2;