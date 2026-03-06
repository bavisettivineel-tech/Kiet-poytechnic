import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, GraduationCap, Shield, Lock, User } from 'lucide-react'

export default function LoginPage() {
    const { login } = useAuth()
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState(null)

    const roles = [
        { key: 'admin', label: 'Admin', icon: Shield, color: 'bg-primary', hint: 'System Administrator' },
        { key: 'management', label: 'Management', icon: User, color: 'bg-accent', hint: 'College Management' },
        { key: 'staff', label: 'Staff / Faculty', icon: GraduationCap, color: 'bg-success', hint: 'CTPOS / Admin Staff' },
        { key: 'student', label: 'Student', icon: GraduationCap, color: 'bg-warning', hint: 'Use Roll Number' },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!loginId.trim() || !password.trim()) {
            setError('Please enter both Login ID and Password')
            return
        }
        setLoading(true)
        setError('')

        try {
            const result = await login(loginId.trim(), password.trim())
            if (!result.success) {
                setError(result.error)
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-scale-in">
                {/* Logo Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-dark shadow-2xl mb-4 animate-pulse-glow">
                        <GraduationCap className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-1">KIET</h1>
                    <p className="text-sm text-gray-400">Kakinada Institute of Engineering & Technology</p>
                    <p className="text-xs text-gray-500 mt-1">Diploma Portal — College Management System</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl shadow-2xl p-8 border border-white/10">
                    {/* Role Selector */}
                    {!selectedRole ? (
                        <div className="stagger-children">
                            <h2 className="text-xl font-semibold text-white text-center mb-6">Select Your Role</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role.key}
                                        onClick={() => setSelectedRole(role.key)}
                                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-primary/50 group"
                                    >
                                        <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                            <role.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-white">{role.label}</span>
                                        <span className="text-xs text-gray-500">{role.hint}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="animate-fade-in">
                            <button
                                type="button"
                                onClick={() => { setSelectedRole(null); setError(''); setLoginId(''); setPassword('') }}
                                className="text-sm text-gray-400 hover:text-white transition-colors mb-4 flex items-center gap-1"
                            >
                                ← Back to roles
                            </button>

                            <h2 className="text-xl font-semibold text-white mb-1">
                                {roles.find(r => r.key === selectedRole)?.label} Login
                            </h2>
                            <p className="text-sm text-gray-400 mb-6">
                                {selectedRole === 'student'
                                    ? 'Use your Roll Number as both Login ID and Password'
                                    : 'Enter your credentials to access the portal'}
                            </p>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-red-300 text-sm animate-fade-in">
                                    {error}
                                </div>
                            )}

                            {/* Login ID */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    {selectedRole === 'student' ? 'Roll Number' : 'Login ID'}
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={loginId}
                                        onChange={(e) => setLoginId(e.target.value)}
                                        placeholder={selectedRole === 'student' ? '25371-CM-067' : 'Enter your Login ID'}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder={selectedRole === 'student' ? '25371-CM-067' : 'Enter your password'}
                                        className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold hover:from-primary-dark hover:to-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing In...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-gray-600 text-xs mt-6">
                    © 2026 KIET, Korangi, Kakinada · All Rights Reserved
                </p>
            </div>
        </div>
    )
}
