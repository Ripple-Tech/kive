import Image from "next/image";
import { Heading } from "../heading";

export type FeatureItem = {
  id: string;
  img: string;   
  alt: string;
};

export const featuresData: FeatureItem[] = [
  { id: "feature-1", img: "/feature1.jpg", alt: "Multi Currency" },
  { id: "feature-2", img: "/feature2.jpg", alt: "Kyve Protection" },
  { id: "feature-3", img: "/feature3.jpg", alt: "KYC Verification" },
  { id: "feature-4", img: "/feature4.jpg", alt: "Solve Dispute" },
  { id: "feature-5", img: "/feature5.jpg", alt: "Risk Reduction" },
];

const Features: React.FC = () => {
  return (
    <section className="w-full  bg-amber-200 px-0 py-10 mb-10 mt-10">
        <Heading className="text-center mb-10">
          Key Features </Heading>
      <div className="grid grid-cols-1 gap-10 px-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-3">
        {featuresData.map((item) => (
          <div key={item.id} className="rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
            
              <Image
                src={item.img}           // width/height are auto from static import
                alt={item.alt}
                width={700}      // set an intrinsic size to avoid layout shift
                height={800}
                className="h-auto w-full rounded-lg"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={false}
              />
        
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;