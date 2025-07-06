import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}