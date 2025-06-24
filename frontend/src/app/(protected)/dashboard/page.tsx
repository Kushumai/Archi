"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useAuth } from "@/contexts/authContext";
import { Sidebar } from "@/components/organisms/Sidebar";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { api } from "@/lib/api";

type View = "upload" | "documents" | "profile";

interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileName: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<View>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("autre");
  const [docs, setDocs] = useState<Document[]>([]);
  const [fetching, setFetching] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    } else if (!loading && isAuthenticated) {
      fetchDocs();
    }
  }, [loading, isAuthenticated, router]);

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
    if (!title.trim() || !selectedFile || !category.trim()) {
      setFeedback({ type: "error", text: "Le titre, la catégorie et le fichier sont obligatoires." });
      return;
    }

    const form = new FormData();
    form.append("file", selectedFile);
    form.append("title", title.trim());
    form.append("category", category);

    setFetching(true);
    setFeedback(null);
    try {
      await api.post("/me/documents", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFeedback({ type: "success", text: "Document envoyé avec succès !" });
      setSelectedFile(null);
      setTitle("");
      setCategory("autre");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchDocs();
      setView("documents");
    } catch (err: unknown) {
      let msg = "Échec : l'envoi n'a pas abouti. Veuillez réessayer.";
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 500) {
          msg = "Échec : problème serveur. Veuillez réessayer.";
        } else if (status === 400) {
          msg = "Échec : certains champs sont manquants ou invalides.";
        }
      }
      setFeedback({ type: "error", text: msg });
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
      a.setAttribute("download", doc.fileName);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setFeedback({ type: "error", text: "Erreur lors du téléchargement." });
      console.error("Erreur download", err);
    }
  };

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

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-1">
      <Sidebar
        view={view}
        setView={setView}
        user={user ?? { email: null }}
        isOpen={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 overflow-auto bg-white dark:bg-zinc-900 p-6">
        {feedback && (
          <div
            className={
              `mb-6 p-3 rounded text-sm font-medium max-w-lg w-full ` +
              (feedback.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300")
            }
            role="alert"
          >
            {feedback.text}
          </div>
        )}

        {view === "upload" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Upload de document
            </h2>
            <form
              className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpload();
              }}
            >
              <div className="flex-1">
                <label htmlFor="title" className="block mb-1 font-medium text-neutral-800 dark:text-neutral-200">
                  Titre *
                </label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre du document"
                  required
                  autoComplete="off"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="category" className="block mb-1 font-medium text-neutral-800 dark:text-neutral-200">
                  Catégorie *
                </label>
                <select
                  id="category"
                  className="block w-full border rounded px-3 py-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="autre">Autre</option>
                  <option value="facture">Facture</option>
                  <option value="contrat">Contrat</option>
                  <option value="photo">Photo</option>
                  <option value="rapport">Rapport</option>
                </select>
              </div>

              <div className="flex-1">
                <label htmlFor="file" className="block mb-1 font-medium text-neutral-800 dark:text-neutral-200">
                  Fichier *
                </label>
                <Input id="file" type="file" ref={fileInputRef} onChange={handleFileChange} required />
              </div>

              <div className="flex flex-col flex-shrink-0 justify-end">
                <Button type="submit" disabled={!title.trim() || !selectedFile || fetching}>
                  {fetching ? "Envoi..." : "Envoyer"}
                </Button>
              </div>
            </form>
          </section>
        )}

        {view === "documents" && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Mes documents
            </h2>
            {fetching ? (
              <p className="text-neutral-700 dark:text-neutral-300">Chargement…</p>
            ) : docs.length === 0 ? (
              <p className="text-neutral-700 dark:text-neutral-300">Aucun document pour le moment.</p>
            ) : (
              <ul className="space-y-2">
                {docs.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex justify-between items-start p-3 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded"
                  >
                    <span className="truncate">{doc.title}</span>
                    <span className="truncate">{doc.category}</span>
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
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Mon profil
            </h2>
            <div className="space-x-1">
              <span className="text-neutral-700 dark:text-neutral-300">Email :</span>
              <strong className="text-neutral-900 dark:text-white">{user?.email ?? "Non renseigné"}</strong>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}