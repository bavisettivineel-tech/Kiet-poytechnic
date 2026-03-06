import { useAuth } from '../../contexts/AuthContext'
import { StatCard, PageHeader } from '../../components/UI'
import { Users, UserCheck, BookOpen, Bell, Upload, ClipboardList } from 'lucide-react'

export default function CTPOSDashboard() {
    const { user } = useAuth()
    const yearLabel = user?.assignedYear === 1 ? '1st Year' : user?.assignedYear === 2 ? '2nd Year' : '3rd Year'

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={`Welcome, ${user?.name}!`}
                subtitle={`CTPOS Dashboard — Assigned to ${yearLabel || ''} CME`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
                <StatCard title="My Students" value="145" subtitle={`${yearLabel} CME`} icon={Users} color="primary" />
                <StatCard title="Today's Attendance" value="92%" icon={UserCheck} color="success" />
                <StatCard title="Marks Updated" value="Mid 2" subtitle="Latest entry" icon={BookOpen} color="accent" />
                <StatCard title="Active Notices" value="3" icon={Bell} color="warning" />
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border p-5 mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Mark Attendance', icon: ClipboardList, color: 'bg-success/10 text-success hover:bg-success/20', path: '/attendance' },
                        { label: 'Enter Marks', icon: BookOpen, color: 'bg-accent/10 text-accent hover:bg-accent/20', path: '/marks' },
                        { label: 'Add Students', icon: Users, color: 'bg-primary/10 text-primary hover:bg-primary/20', path: '/students' },
                        { label: 'Import Excel', icon: Upload, color: 'bg-info/10 text-info hover:bg-info/20', path: '/students' },
                    ].map(action => (
                        <a key={action.label} href={action.path} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} transition-all hover:scale-105`}>
                            <action.icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{action.label}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {[
                        { action: 'Attendance marked for today', time: '10 min ago', color: 'bg-success/10 text-success' },
                        { action: 'Mid-2 marks updated for 3 students', time: '2 hours ago', color: 'bg-accent/10 text-accent' },
                        { action: '5 new students added via Excel', time: 'Yesterday', color: 'bg-primary/10 text-primary' },
                        { action: 'Posted notice: Workshop on Python', time: '2 days ago', color: 'bg-warning/10 text-warning' },
                    ].map((activity, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-bg transition-colors">
                            <div className={`w-2 h-2 rounded-full ${activity.color.split(' ')[0].replace('/10', '')}`}></div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                                <p className="text-xs text-text-secondary">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
