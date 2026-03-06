import { useAuth } from '../../contexts/AuthContext'
import { StatCard, PageHeader } from '../../components/UI'
import { Users, ClipboardList, DollarSign, FileText } from 'lucide-react'

export default function StaffDashboard() {
    const { user } = useAuth()

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={`Welcome, ${user?.name}!`}
                subtitle="Administrative Staff Dashboard"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
                <StatCard title="Total Students" value="2,382" icon={Users} color="primary" />
                <StatCard title="Records Updated" value="45" subtitle="This week" icon={ClipboardList} color="success" />
                <StatCard title="Fee Entries" value="12" subtitle="Today" icon={DollarSign} color="accent" />
                <StatCard title="Reports Generated" value="8" subtitle="This month" icon={FileText} color="info" />
            </div>

            <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        { label: 'View Students', icon: Users, color: 'bg-primary/10 text-primary hover:bg-primary/20' },
                        { label: 'Assist Fee Entry', icon: DollarSign, color: 'bg-success/10 text-success hover:bg-success/20' },
                        { label: 'Generate Reports', icon: FileText, color: 'bg-accent/10 text-accent hover:bg-accent/20' },
                    ].map(action => (
                        <button key={action.label} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} transition-all hover:scale-105`}>
                            <action.icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
