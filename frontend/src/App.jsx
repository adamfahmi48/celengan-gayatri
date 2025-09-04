import { useState } from 'react'
import { login as apiLogin } from './api'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const u = await apiLogin(email, password)
      setUser(u)
      setError('')
    } catch {
      setError('Email atau password salah')
    }
  }

  if (user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Halo, {user.name}</h1>
        <p>Role: {user.role}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h2 className="text-xl font-bold">Login</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border w-full p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}

export default App

