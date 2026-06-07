// src/pages/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../lib/api'
import { useAuth } from '../lib/auth'

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)
  const { signIn }            = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const data = await login(form.email, form.password)
      signIn(data.token, data.author)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inp = "w-full bg-bg2 border border-border rounded-lg px-3.5 py-2.5 text-sm font-light text-text placeholder-text3 outline-none focus:border-border2 transition-colors"

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs font-medium tracking-widest uppercase text-text3 mb-6">Admin</p>
        <h1 className="text-base font-medium text-text mb-1">Sign in</h1>
        <p className="text-sm font-light text-text2 mb-8">
          Enter your credentials to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            required
            className={inp}
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            required
            className={inp}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-text text-bg border border-text text-sm hover:bg-[#d0d0d0] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-text3 mt-6 text-center">
          Dev credentials: alice@example.com / password123
        </p>
      </div>
    </div>
  )
}