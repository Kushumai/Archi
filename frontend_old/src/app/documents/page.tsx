// frontend/src/app/documents/page.tsx
'use client';

import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';

import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';

interface Document {
  id: string;
  title: string;
  // ajoute d'autres champs si nécessaire
}

export default function DocumentsPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [docs, setDocs] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    api.get<Document[]>('/documents')
      .then(res => setDocs(res.data))
      .catch(err => setError(err.response?.data?.message || 'Erreur lors du chargement'));
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Mes documents</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {docs.map(doc => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
}