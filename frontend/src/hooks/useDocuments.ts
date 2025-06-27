import { useState, useCallback, useRef } from "react";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: string;
  fileName: string;
}

interface Feedback {
  type: "success" | "error";
  text: string;
}

export const useDocuments = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [fetching, setFetching] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocs = useCallback(async () => {
    setFetching(true);
    try {
      const res = await api.get<Document[]>("/me/documents");
      setDocs(res.data);
    } catch (err) {
      if (isAxiosError(err)) {
        console.error("Erreur API :", err.response?.data);
      } else {
        console.error("Erreur inconnue :", err);
      }
    } finally {
      setFetching(false);
    }
  }, []);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSelectedFile: (file: File | null) => void
  ) => {
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = async (
    title: string,
    selectedFile: File | null,
    category: string,
    setTitle: (v: string) => void,
    setCategory: (v: string) => void,
    setSelectedFile: (f: File | null) => void,
    onSuccess?: () => void
  ) => {
    if (!title.trim() || !selectedFile || !category.trim()) {
      setFeedback({
        type: "error",
        text: "Le titre, la catégorie et le fichier sont obligatoires.",
      });
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
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      await fetchDocs();
      onSuccess?.();
    } catch (err) {
      let msg = "Échec : l'envoi n'a pas abouti. Veuillez réessayer.";
      if (isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 500) msg = "Échec : problème serveur.";
        else if (status === 400) msg = "Champs manquants ou invalides.";
      }
      setFeedback({ type: "error", text: msg });
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

  return {
    docs,
    fetching,
    feedback,
    setFeedback,
    fetchDocs,
    handleFileChange,
    handleUpload,
    handleDownload,
    fileInputRef,
  };
};
