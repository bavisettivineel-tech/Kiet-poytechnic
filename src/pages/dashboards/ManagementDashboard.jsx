import { useAuth } from '../../contexts/AuthContext'
import { StatCard, PageHeader } from '../../components/UI'
import { Users, DollarSign, Bus, Bell, CreditCard, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const feeMonthly = [
    { month: 'Sep', amount: 520000 },
    { month: 'Oct', amount: 680000 },
    { month: 'Nov', amount: 850000 },
    { month: 'Dec', amount: 420000 },
    { month: 'Jan', amount: 950000 },
    { month: 'Feb', amount: 780000 },
    { month: 'Mar', amount: 620000 },
]

const transportPie = [
    { name: 'Route 1', value: 120, color: '#D32F2F' },
    { name: 'Route 2', value: 95, color: '#1976D2' },
    { name: 'Route 3', value: 78, color: '#2E7D32' },
    { name: 'Route 4', value: 65, color: '#F57F17' },
    { name: 'Route 5', value: 42, color: '#7B1FA2' },
]

export default function ManagementDashboard() {
    const { user } = useAuth()

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={`Welcome, ${user?.name}!`}
                subtitle="Management Dashboard — Financial & Administrative Overview"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
                <StatCard title="Total Students" value="2,382" icon={Users} color="primary" />
                <StatCard title="Fee Collected" value="₹68.2L" subtitle="This semester" icon={DollarSign} color="success" trend="up" trendValue="+12%" />
                <StatCard title="Fee Pending" value="₹8.4L" icon={CreditCard} color="danger" />
                <StatCard title="Transport Users" value="400" icon={Bus} color="accent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Monthly Fee Collection</h3>
                    <p className="text-sm text-text-secondary mb-4">Amount collected per month (₹)</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={feeMonthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(v) => [`₹${v.toLocaleString()}`, 'Amount']} />
                            <Bar dataKey="amount" fill="#1976D2" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Transport Routes</h3>
                    <p className="text-sm text-text-secondary mb-4">Students per bus route</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={transportPie} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                                {transportPie.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {transportPie.map(item => (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-text-secondary">{item.name}: {item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'View Students', icon: Users, color: 'bg-primary/10 text-primary hover:bg-primary/20' },
                        { label: 'Record Payment', icon: CreditCard, color: 'bg-success/10 text-success hover:bg-success/20' },
                        { label: 'Generate ID Cards', icon: Users, color: 'bg-accent/10 text-accent hover:bg-accent/20' },
                        { label: 'Post Notice', icon: Bell, color: 'bg-warning/10 text-warning hover:bg-warning/20' },
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
