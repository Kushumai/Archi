import React from "react";
import { cn } from "@/lib/utils";
import { X, Plus } from "lucide-react";

type View = "upload" | "documents" | "profile";

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  user?: { email?: string | null }
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, user,  isOpen, onOpen, onClose }) => {
  return (
    <aside
      className={" flex flex-col transition-[width] duration-200 bg-white dark:bg-zinc-900 border-r border-black overflow-hidden " + (isOpen ? "w-64" : "w-12")}
      aria-label="Menu principal"
    >
      <button
        onClick={isOpen ? onClose : onOpen}
        className={cn(
          "p-2",
          isOpen ? "self-end" : "self-center"
        )}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <Plus className={cn("w-6 h-6 transition-transform", isOpen ? "rotate-45" : "rotate-0")} />
      </button>

  {/* Nav items : cachés quand fermé */}
  <nav className={cn("flex flex-col items-start w-full mt-4 space-y-4 pl-4", !isOpen && "hidden")}>
    <button onClick={() => setView("upload")} className={cn("block w-full text-left", view === "upload" ? "font-bold" : "font-medium")}>
      Upload
    </button>
    <button onClick={() => setView("documents")} className={cn("block w-full text-left", view === "documents" ? "font-bold" : "font-medium")}>
      Documents
    </button>
  </nav>

  {/* Profil : caché aussi */}
  <div className={cn("mt-auto mb-4 ml-4", !isOpen && "hidden")}>
    <button onClick={() => setView("profile")} className={cn(view === "profile" ? "font-bold" : "font-medium")}>
      Profil
    </button>
    {user?.email && (
      <div className="mt-1 text-xs text-neutral-500 truncate">
        {user.email}
      </div>
    )}
      </div>
    </aside>
  );
};