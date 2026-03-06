import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Hardcoded credentials for Admin and Management
const HARDCODED_USERS = {
    'Kiet group': {
        password: 'Kiet8297@',
        role: 'admin',
        name: 'Admin',
        id: 'admin-001'
    },
    'Kiet Diploma': {
        password: 'Diploma8297@',
        role: 'management',
        name: 'Management',
        id: 'management-001'
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('kiet_user')
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
            } catch (e) {
                localStorage.removeItem('kiet_user')
            }
        }
        setLoading(false)
    }, [])

    const login = useCallback(async (loginId, password) => {
        // Check hardcoded credentials first
        const hardcodedUser = HARDCODED_USERS[loginId]
        if (hardcodedUser) {
            if (hardcodedUser.password === password) {
                const userData = {
                    id: hardcodedUser.id,
                    loginId,
                    name: hardcodedUser.name,
                    role: hardcodedUser.role
                }
                setUser(userData)
                localStorage.setItem('kiet_user', JSON.stringify(userData))
                return { success: true, user: userData }
            }
            return { success: false, error: 'Invalid password' }
        }

        // Check for student login (roll number = password)
        const rollNumberPattern = /^\d{5}-[A-Z]{2}-\d{3}$/
        if (rollNumberPattern.test(loginId)) {
            if (loginId === password) {
                // Try to find student in database
                try {
                    const { data: student, error } = await supabase
                        .from('students')
                        .select('*')
                        .eq('roll_number', loginId)
                        .single()

                    if (error || !student) {
                        throw error || new Error('Not found')
                    }

                    const userData = {
                        id: student.id,
                        loginId,
                        name: student.name,
                        role: 'student',
                        studentData: student
                    }
                    setUser(userData)
                    localStorage.setItem('kiet_user', JSON.stringify(userData))
                    return { success: true, user: userData }
                } catch (err) {
                    // Demo mode fallback
                    const demoStudentData = {
                        id: 'demo-student',
                        loginId,
                        name: 'Demo Student',
                        role: 'student',
                        studentData: { name: 'Demo Student', roll_number: loginId, year: 1, branch: 'CME' }
                    }
                    setUser(demoStudentData)
                    localStorage.setItem('kiet_user', JSON.stringify(demoStudentData))
                    return { success: true, user: demoStudentData }
                }
            }
            return { success: false, error: 'Invalid credentials. Use Roll Number as both ID and Password.' }
        }

        // Check for CTPOS / Admin Staff login
        try {
            const { data: staff, error } = await supabase
                .from('staff')
                .select('*')
                .eq('login_id', loginId)
                .eq('password_hash', password)
                .single()

            if (error || !staff) {
                throw error || new Error('Not found')
            }

            const userData = {
                id: staff.id,
                loginId,
                name: staff.name,
                role: staff.role,
                assignedYear: staff.assigned_year
            }
            setUser(userData)
            localStorage.setItem('kiet_user', JSON.stringify(userData))
            return { success: true, user: userData }
        } catch (err) {
            // Demo Mode Fallbacks for staff
            if (loginId === 'ctpos' && password === 'ctpos123') {
                const userData = { id: 'demo-ctpos', loginId, name: 'Demo CTPOS Faculty', role: 'ctpos', assignedYear: 1 }
                setUser(userData)
                localStorage.setItem('kiet_user', JSON.stringify(userData))
                return { success: true, user: userData }
            }
            if (loginId === 'staff' && password === 'staff123') {
                const userData = { id: 'demo-staff', loginId, name: 'Demo Admin Staff', role: 'administrative_staff' }
                setUser(userData)
                localStorage.setItem('kiet_user', JSON.stringify(userData))
                return { success: true, user: userData }
            }
            return { success: false, error: 'Database connection error or Invalid credentials.' }
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        localStorage.removeItem('kiet_user')
    }, [])

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
