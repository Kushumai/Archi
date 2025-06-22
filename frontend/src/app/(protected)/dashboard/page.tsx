"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

type View = "upload" | "documents" | "profile";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const [view, setView] = useState<View>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setDocs((prev) => [...prev, selectedFile.name]);
    setSelectedFile(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-900 p-4">
        <nav className="space-y-4">
          {(["upload", "documents", "profile"] as View[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`block w-full text-left ${
                view === tab ? "font-bold" : "font-medium"
              }`}
            >
              {tab === "upload"
                ? "Upload"
                : tab === "documents"
                ? "Documents"
                : "Profil"}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-zinc-50 dark:bg-zinc-900">
        {view === "upload" && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Upload de document
            </h2>
            <div className="flex items-center gap-4">
              <Input type="file" onChange={handleFileChange} />
              <Button onClick={handleUpload} disabled={!selectedFile}>
                Envoyer
              </Button>
            </div>
            {selectedFile && (
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                Fichier sélectionné : <strong>{selectedFile.name}</strong>
              </p>
            )}
          </section>
        )}

        {view === "documents" && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Mes documents
            </h2>
            {docs.length === 0 ? (
              <p className="text-neutral-700 dark:text-neutral-300">
                Aucun document pour le moment.
              </p>
            ) : (
              <ul className="space-y-2">
                {docs.map((name, idx) => (
                  <li
                    key={idx}
                    className="p-2 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {view === "profile" && (
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Mon profil
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              Email : <strong>{user?.email}</strong>
            </p>
          </section>
        )}
      </main>
    </div>
  );
}