import Features from "@/components/marketing/Features";
import Hero from "@/components/Hero";
import HomeBenefit from "@/components/marketing/HomeBenefit";
import Testimonial from "@/components/marketing/Testimonial";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <HomeBenefit/>
      <Features/>
      <Testimonial/>
    </div>
  );
}
