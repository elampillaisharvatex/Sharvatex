import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [, navigate] = useLocation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Wait for the hash fragment with the token to be processed 
  // by supabase.auth automatically on load.
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("Password recovery mode active")
      }
    })
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // This updates the password for the user extracted from the hash URL
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      console.error(updateError)
      setError(updateError.message || 'Error resetting password')
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin/login')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F3D2E] via-[#1a5c42] to-[#0F3D2E] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <h2 className="text-[#0F3D2E] text-2xl font-bold">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-2">Enter your new admin password</p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center text-sm">
            Password updated successfully! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="Enter new password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F3D2E] transition-all"
                required
                minLength={6}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#0F3D2E] hover:bg-[#1a5c42] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mt-2"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}