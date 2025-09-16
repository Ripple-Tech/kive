import Image from 'next/image'
import React from 'react'
import { Check, Star } from "lucide-react"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Heading } from "@/components/heading"
import { Icons } from "@/components/icons"
import { ShinyButton } from "@/components/ui/shiny-button"

const Testimonial = () => {
  return (
    <section className="relative py-18 sm:py-27 ">
        <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-20">
          <div>
            <h2 className="text-center text-base/7 font-semibold text-brand-600">
              
            </h2>
            <Heading className="text-center">What our customers say</Heading>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {/* first customer review */}
            <div className="flex flex-auto flex-col gap-4 bg-brand-25 p-6 sm:p-8 lg:p-16 rounded-t-[2rem] lg:rounded-tr-none lg:rounded-l-[2rem]">
              <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
              </div>

              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty">
              Kyve has given me peace of mind whenever I trade online. Knowing my funds are secure until both sides are satisfied makes every transaction stress-free.
              </p>

              <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Image
                  src="/user-2.png"
                  className="rounded-full object-cover"
                  alt="Random user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-semibold flex items-center">
                    Fisayo Ademola
                    <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                  </p>
                  <p className="text-sm text-gray-600">@itsfisayo</p>
                </div>
              </div>
            </div>

            {/* second customer review */}
            <div className="flex flex-auto flex-col gap-4 bg-brand-25 p-6 sm:p-8 lg:p-16 rounded-b-[2rem] lg:rounded-bl-none lg:rounded-r-[2rem]">
              <div className="flex gap-0.5 mb-2 justify-center lg:justify-start">
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
                <Star className="size-5 text-brand-600 fill-[#fb9e08]" />
              </div>

              <p className="text-base sm:text-lg lg:text-lg/8 font-medium tracking-tight text-brand-950 text-center lg:text-left text-pretty">
                Kyve has completely changed the way I trade. As a seller, I feel protected, and as a buyer, I know my money is safe until I get exactly what I paid for.
              </p>

              <div className="flex flex-col justify-center lg:justify-start sm:flex-row items-center sm:items-start gap-4 mt-2">
                <Image
                  src="/user-1.png"
                  className="rounded-full object-cover"
                  alt="Random user"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col items-center sm:items-start">
                  <p className="font-semibold flex items-center">
                    Uche Nwachukwu
                    <Icons.verificationBadge className="size-4 inline-block ml-1.5" />
                  </p>
                  <p className="text-sm text-gray-600">@chuks</p>
                </div>
              </div>
            </div>
          </div>

          <ShinyButton
            href="/sign-up"
            className="relative z-10 h-14 w-full max-w-xs bg-amber-600 text-base shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            Start For Free Today
          </ShinyButton>
        </MaxWidthWrapper>
      </section>
  )
}

export default Testimonial
