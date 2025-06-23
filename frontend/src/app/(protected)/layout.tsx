"use client";

import * as React from "react";
import ProtectedRoute from "@/components/templates/ProtectedRoute";

export default function PrivateGroupLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}