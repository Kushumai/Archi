"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { Sidebar, View } from "@/components/organisms/Sidebar";
import { useAuth } from "@/contexts/authContext";

interface DashboardTemplateProps {
  children: ReactNode;
  view: View;
  setView: (v: View) => void;
}

export default function DashboardTemplate({ children, view, setView }: DashboardTemplateProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex flex-1">
      <Sidebar
        view={view}
        setView={setView}
        user={user}
        isOpen={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 overflow-auto bg-white dark:bg-zinc-900 p-6">
        {children}
      </main>
    </div>
  );
}
