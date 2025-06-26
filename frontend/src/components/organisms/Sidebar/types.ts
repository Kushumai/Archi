import type { PublicUser } from "@/types/user";
export type View = "upload" | "documents" | "profile";

export interface SidebarProps {
  view: View;
  setView: (v: View) => void;
  user?: PublicUser | null;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}
