// frontend/src/app/login/page.tsx
'use client'

import { useState, useContext, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '../../contexts/AuthContext'

export default function LoginPage() {
  const { login, isAuthenticated } = useContext(AuthContext)
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Si déjà authentifié, on redirige vers le dashboard
  if (isAuthenticated) {
    router.replace('/dashboard')
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      // login() redirige normalement vers /dashboard dans le contexte
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: 4 }}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email</label><br/>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        <label>Password</label><br/>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem' }}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}