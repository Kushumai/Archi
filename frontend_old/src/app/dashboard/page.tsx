'use client'

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../../contexts/AuthContext'

export default function DashboardPage() {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const router = useRouter()

  // Redirection si pas authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, router])

  // En attendant la vérification, on ne rend rien
  if (!isAuthenticated) {
    return null
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', textAlign: 'center' }}>
      <h1>Dashboard</h1>
      <p>Bienvenue ! Vous êtes connecté.</p>
      <button
        onClick={logout}
        style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}
      >
        Logout
      </button>
    </div>
  )
}