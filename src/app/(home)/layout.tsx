import { Navbar } from "@/components/shared/Navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#fcfce3]">{children}</div>
    </div>
  );
}