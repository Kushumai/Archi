import { Header } from "@/components/organisms/Header";
import ProtectedRoute from "@/components/templates/ProtectedRoute";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </>
  );
}