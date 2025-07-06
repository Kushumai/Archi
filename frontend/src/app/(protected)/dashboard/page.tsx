"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import Input from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { Alert} from "@/components/atoms/Alert"
import DashboardTemplate from "@/components/templates/DashboardTemplate";
import { useDocuments } from "@/hooks/useDocuments";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";

type View = "upload" | "documents" | "profile";

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<View>("upload");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("autre");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    docs,
    feedback,
    setFeedback,
    fetching,
    fetchDocs,
    fileInputRef,
    handleUpload,
    handleDownload,
    handleFileChange,
    handleDelete,
    handleDeleteAll,
  } = useDocuments();
  const { handleDeleteAccount } = useDeleteAccount();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    } else if (!loading && isAuthenticated) {
      fetchDocs();
    }
  }, [loading, isAuthenticated, router, fetchDocs]);

  if (loading || !isAuthenticated) return null;

  return (
    <DashboardTemplate view={view} setView={setView}>
      {feedback && (
        <Alert
          variant={feedback.type}
          title={feedback.type === "success" ? "Succès" : "Erreur"}
          description={feedback.text}
          dismissible
          onClose={() => setFeedback(null)}
        />
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
              handleUpload(
                title,
                selectedFile,
                category,
                setTitle,
                setCategory,
                setSelectedFile,
                () => setView("documents")
              );
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
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, setSelectedFile)}
                required
              />
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
                  className="flex justify-between items-center p-3 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded"
                >
                  <div className="flex-1 flex flex-col min-w-0">
                    <span className="truncate font-medium">{doc.title}</span>
                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">{doc.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => handleDownload(doc)}>
                      Télécharger
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {docs.length >= 2 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="destructive"
                className="mb-2"
                onClick={handleDeleteAll}
                disabled={fetching}
              >
                Supprimer tous mes documents
              </Button>
            </div>
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

          <div className="flex justify-center mt-8">
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              Supprimer mon compte et toutes mes données
            </Button>
          </div>
        </section>
      )}
    </DashboardTemplate>
  );
}