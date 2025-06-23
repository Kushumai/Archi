"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { api } from "@/lib/api";

type View = "upload" | "documents" | "profile";

interface Document {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<View>("documents");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [fetching, setFetching] = useState(false);

  // Protection & fetch des documents
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    } else if (!loading && isAuthenticated) {
      fetchDocs();
    }
  }, [loading, isAuthenticated, router]);

  // Auto-switch vers "documents" si on en a
  useEffect(() => {
    if (docs.length > 0 && view !== "documents") {
      setView("documents");
    }
  }, [docs, view]);

  const fetchDocs = async () => {
    setFetching(true);
    try {
      const res = await api.get<Document[]>("me/documents");
      setDocs(res.data);
    } catch (err) {
      console.error("Erreur fetch docs", err);
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const form = new FormData();
    form.append("file", selectedFile);
    setFetching(true);
    try {
      await api.post("/me/documents", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSelectedFile(null);
      await fetchDocs();
      setView("documents");
    } catch (err) {
      console.error("Erreur upload", err);
    } finally {
      setFetching(false);
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      const res = await api.get(`/me/documents/${doc.id}/file`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      a.setAttribute("download", doc.name);

      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur download", err);
    }
  };

  if (loading || !isAuthenticated) {
    return null;
  }

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
              <Button onClick={handleUpload} disabled={!selectedFile || fetching}>
                {fetching ? "Envoi..." : "Envoyer"}
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Mes documents
              </h2>
            </div>
            {fetching ? (
              <p className="text-neutral-700 dark:text-neutral-300">Chargement…</p>
            ) : docs.length === 0 ? (
              <p className="text-neutral-700 dark:text-neutral-300">
                Aucun document pour le moment.
              </p>
            ) : (
              <ul className="space-y-2">
                {docs.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex justify-between p-2 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded"
                  >
                    <span>{doc.name}</span>
                    <Button size="sm" onClick={() => handleDownload(doc)}>
                      Télécharger
                    </Button>
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