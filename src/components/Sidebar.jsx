import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
    LayoutDashboard, Users, UserCheck, ClipboardList, BookOpen, DollarSign,
    Bus, Bell, BarChart3, Settings, LogOut, ChevronLeft, ChevronRight,
    GraduationCap, UserPlus, FileSpreadsheet, CreditCard, IdCard, Menu, X
} from 'lucide-react'

const menuConfig = {
    admin: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/students', label: 'Students', icon: Users },
        { to: '/staff', label: 'Staff Management', icon: UserPlus },
        { to: '/attendance', label: 'Attendance', icon: UserCheck },
        { to: '/marks', label: 'Internal Marks', icon: BookOpen },
        { to: '/fees', label: 'Fee Management', icon: DollarSign },
        { to: '/transport', label: 'Transport', icon: Bus },
        { to: '/notices', label: 'Notices', icon: Bell },
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
        { to: '/settings', label: 'Settings', icon: Settings },
    ],
    management: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/students', label: 'Students', icon: Users },
        { to: '/fees', label: 'Fee Management', icon: DollarSign },
        { to: '/transport', label: 'Transport', icon: Bus },
        { to: '/id-cards', label: 'ID Cards', icon: IdCard },
        { to: '/notices', label: 'Notices', icon: Bell },
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
    administrative_staff: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/students', label: 'Students', icon: Users },
        { to: '/fees', label: 'Fee Assist', icon: DollarSign },
        { to: '/reports', label: 'Reports', icon: FileSpreadsheet },
    ],
    ctpos: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/students', label: 'Students', icon: Users },
        { to: '/attendance', label: 'Attendance', icon: UserCheck },
        { to: '/marks', label: 'Internal Marks', icon: BookOpen },
        { to: '/notices', label: 'Notices', icon: Bell },
    ],
    student: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/my-attendance', label: 'Attendance', icon: UserCheck },
        { to: '/my-marks', label: 'Marks', icon: BookOpen },
        { to: '/my-fees', label: 'Fee Status', icon: DollarSign },
        { to: '/notices', label: 'Notices', icon: Bell },
    ]
}

export default function Sidebar() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const menu = menuConfig[user?.role] || []

    const roleLabels = {
        admin: 'Administrator',
        management: 'Management',
        administrative_staff: 'Admin Staff',
        ctpos: 'Faculty (CTPOS)',
        student: 'Student'
    }

    const roleColors = {
        admin: 'bg-primary',
        management: 'bg-accent',
        administrative_staff: 'bg-success',
        ctpos: 'bg-info',
        student: 'bg-warning'
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center gap-3 p-4 pl-16 lg:pl-4 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                {!collapsed && (
                    <div className="animate-fade-in">
                        <h1 className="text-lg font-bold text-white leading-tight">KIET</h1>
                        <p className="text-[10px] text-gray-400 leading-tight">Diploma Portal</p>
                    </div>
                )}
            </div>

            {/* User Info */}
            <div className={`p-4 border-b border-white/10 ${collapsed ? 'flex justify-center' : ''}`}>
                {collapsed ? (
                    <div className={`w-8 h-8 rounded-full ${roleColors[user?.role]} flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 animate-fade-in">
                        <div className={`w-10 h-10 rounded-full ${roleColors[user?.role]} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white text-sm font-bold">{user?.name?.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 truncate">{roleLabels[user?.role]}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Nav Menu */}
            <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-1">
                {menu.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }
              ${collapsed ? 'justify-center' : ''}`
                        }
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110`} />
                        {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse Toggle & Logout */}
            <div className="p-3 border-t border-white/10 space-y-2">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all w-full"
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    {!collapsed && <span className="text-sm">Collapse</span>}
                </button>
                <button
                    onClick={logout}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut className="w-5 h-5" />
                    {!collapsed && <span className="text-sm font-medium">Sign Out</span>}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-3 left-4 z-50 w-10 h-10 rounded-xl bg-sidebar text-white flex items-center justify-center shadow-lg"
            >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen bg-sidebar
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <SidebarContent />
            </aside>
        </>
    )
}
