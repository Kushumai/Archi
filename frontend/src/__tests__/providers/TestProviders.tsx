import React from "react";
import { AuthProvider } from "@/contexts/authContext";


type Props = {
  children: React.ReactNode;
  init?: {
    view?: "upload" | "documents" | "profile";
  };
};

export function TestProviders({ children }: Props) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
