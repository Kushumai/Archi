'use client'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import api from '../../services/api'

interface User {
  id: string
  email: string
}

export default function ProfilePage() {
  const { accessToken } = useContext(AuthContext)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return

    api
      .get<User>('/users/me')
      .then(res => {
        setUser(res.data)
      })
      .catch(err => {
        console.error('Erreur de récupération du profil', err)
        setError('Impossible de charger votre profil.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [accessToken])

  if (loading) {
    return <div>Chargement du profil…</div>
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>
  }

  if (!user) {
    return <div>Aucun utilisateur trouvé.</div>
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Mon profil</h1>
      <p><strong>Identifiant :</strong> {user.id}</p>
      <p><strong>Email :</strong> {user.email}</p>
    </main>
  )
}