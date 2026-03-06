import { useAuth } from '../contexts/AuthContext'
import { Bell, Search } from 'lucide-react'
import { useState } from 'react'

export default function TopBar() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')

    const roleColors = {
        admin: 'bg-primary/10 text-primary',
        management: 'bg-accent/10 text-accent',
        administrative_staff: 'bg-success/10 text-success',
        ctpos: 'bg-info/10 text-info',
        student: 'bg-warning/10 text-warning'
    }

    const roleBadgeColors = {
        admin: 'bg-primary',
        management: 'bg-accent',
        administrative_staff: 'bg-success',
        ctpos: 'bg-info',
        student: 'bg-warning'
    }

    const roleLabels = {
        admin: 'Admin',
        management: 'Management',
        administrative_staff: 'Staff',
        ctpos: 'CTPOS',
        student: 'Student'
    }

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-border pl-[60px] pr-6 lg:px-10 py-4 min-h-[72px] flex items-center">
            <div className="flex items-center justify-between gap-6 w-full max-w-[1600px] mx-auto">
                {/* Space filler for mobile */}
                <div className="md:hidden flex-1"></div>

                {/* Search */}
                <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search students, marks, fees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-bg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                        />
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl hover:bg-bg transition-colors">
                        <Bell className="w-5 h-5 text-text-secondary" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                    </button>

                    {/* Role Badge */}
                    <span className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleColors[user?.role]}`}>
                        {roleLabels[user?.role]}
                    </span>

                    {/* User Avatar */}
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${roleBadgeColors[user?.role]} flex items-center justify-center`}>
                            <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-text-primary">{user?.name}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}
