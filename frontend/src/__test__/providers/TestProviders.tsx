import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/authContext";

interface Props {
  children: ReactNode;
}

export const TestProviders = ({ children }: Props) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};