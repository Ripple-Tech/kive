import Link from "next/link"
import HeroForm from "./forms/heroform"
import { Button } from "./ui/button"
import Image from "next/image"
import { Star } from "lucide-react"

const Hero = () => {
  return (
    <div className="bg-kyve-hero min-h-screen w-full flex flex-1  py-10 gap-10 flex-col lg:flex-row">
      <div className="flex flex-col md:flex-1 text-left px-10  mt-10">
        <h1 className="text-4xl md:text-5xl font-bold text-golden-dark">The Escrow Platform You Can <br/> Trust</h1>
        
     
   {/* Store buttons */}
        <div className="flex flex-col items-center justify-center gap-4 mt-8">
          <Image
            src="/playstore.png"
            alt="Get it on Google Play"
            width={260}
            height={100}
            className="cursor-pointer"
          />
          <Image
            src="/appstore.png"
            alt="Download on the App Store"
            width={260}
            height={100}
            className="cursor-pointer"
          />
        </div>
         <p className="font-semibold mt-4 text-center text-[15px] text-gray-800">Download Kyve App Today!</p>
     
          <div className="flex flex-auto flex-col py-5 items-center justify-center gap-6 bg-brand-25 mt-0  lg:p-16 rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2rem]">
                    <div className="flex gap-0.5 mb-1 justify-center lg:justify-start">
                      <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                      <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                      <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                      <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                      <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                    </div>
       </div>
      </div>
     
      <div className="flex md:flex-1 py-10 px-3">
        <HeroForm />
      </div>
    </div>
  )
}

export default Hero