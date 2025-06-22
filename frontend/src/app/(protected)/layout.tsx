"use client";
import ProtectedLayout from "@/components/templates/ProtectedRoute";

export default function PrivateGroupLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
