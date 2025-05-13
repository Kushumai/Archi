import { ReactNode } from "react";
import { Navbar } from "@/components/organisms/Navbar";
import { Footer } from "@/components/organisms/Footer";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-128px)]">
        {children}
      </main>
      <Footer />
    </>
  );
};