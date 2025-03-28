import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Document {
  _id: string;
  title?: string;
  filename?: string;
  [key: string]: any;
}

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/document', {
        withCredentials: true,
      });
      setDocuments(res.data); 
    } catch (err: any) {
      setError('Failed to fetch documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/document/${id}`, {
        withCredentials: true,
      });
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error('Failed to delete document', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  if (loading) return <p>Loading documents...</p>;
  if (error) return <p>{error}</p>;
  if (documents.length === 0) return <p>No documents found.</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Document List</h2>
      <ul>
        {documents.map((doc) => (
          <li key={doc._id}>
            <strong>{doc.title || doc.filename}</strong> (ID: {doc._id}){' '}
            <button onClick={() => handleDelete(doc._id)}>🗑 Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentList;