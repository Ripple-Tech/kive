import { Poppins } from "next/font/google"
import { cn } from "@/lib/utils";
import { Heading } from "@/components/heading";
import Image from "next/image";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    label: string;
}

export const Header = ({
    label,
}: HeaderProps) =>{
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
         <Image
                  src="/logo.png"
                  alt="Logo"
                  width={34}
                  height={34}
                  className="size-14"
                />
         <p className="text-muted-foreground text-sm">
            {label}
         </p>
        </div>
    )
}