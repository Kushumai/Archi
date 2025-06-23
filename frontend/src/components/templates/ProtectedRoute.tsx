"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Utilisateur non authentifié. Redirection vers /login");
      }
      router.push(`/login?redirect=${pathname}`);
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) return null;

  if (!isAuthenticated) return null;

  return <>{children}</>;
}