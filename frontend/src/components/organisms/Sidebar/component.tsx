"use client";

import React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProps } from "./types";

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, user, isOpen, onOpen, onClose }) => {
  return (
    <aside
      className={cn(
        "md:w-64 flex flex-col transition-[width] duration-200 bg-white dark:bg-zinc-900 border-r border-black overflow-hidden",
        isOpen ? "w-64" : "w-12"
      )}
      aria-label="Menu principal"
    >
      <button
        onClick={isOpen ? onClose : onOpen}
        className={cn("md:hidden p-2", isOpen ? "self-end" : "self-center")}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <Plus className={cn("w-6 h-6 transition-transform", isOpen ? "rotate-45" : "rotate-0")} />
      </button>

      <nav
        className={cn(
          "md:flex md:flex-col md:items-start md:w-full md:mt-8 md:space-y-4 md:pl-4 flex flex-col items-start w-full mt-8 space-y-4 pl-4",
          !isOpen && "hidden"
        )}
      >
        <button
          onClick={() => setView("upload")}
          className={cn("block w-full text-left", view === "upload" ? "font-bold" : "font-medium")}
        >
          Upload
        </button>
        <button
          onClick={() => setView("documents")}
          className={cn("block w-full text-left", view === "documents" ? "font-bold" : "font-medium")}
        >
          Documents
        </button>
      </nav>

      <div className={cn(" md:mt-auto md:mb-4 md:ml-4 mt-auto mb-4 ml-4", isOpen ? "block" : "hidden md:block")}>
        <button
          onClick={() => setView("profile")}
          className={cn(view === "profile" ? "font-bold" : "font-medium")}
        >
          Profil
        </button>
        {user?.email && (
          <div className="mt-1 text-xs text-neutral-500 truncate">{user.email}</div>
        )}
      </div>
    </aside>
  );
};
