import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { StatCard, PageHeader } from '../../components/UI'
import { Users, UserCheck, DollarSign, BookOpen, Bus, Bell, TrendingUp, Calendar, GraduationCap, ClipboardList } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts'

// Mock data for demo
const attendanceData = [
    { day: 'Mon', present: 85, absent: 15 },
    { day: 'Tue', present: 92, absent: 8 },
    { day: 'Wed', present: 88, absent: 12 },
    { day: 'Thu', present: 90, absent: 10 },
    { day: 'Fri', present: 78, absent: 22 },
    { day: 'Sat', present: 65, absent: 35 },
]

const yearWiseData = [
    { name: '1st Year', students: 856, color: '#D32F2F' },
    { name: '2nd Year', students: 792, color: '#1976D2' },
    { name: '3rd Year', students: 734, color: '#2E7D32' },
]

const feeCollectionData = [
    { month: 'Sep', collected: 45, pending: 55 },
    { month: 'Oct', collected: 62, pending: 38 },
    { month: 'Nov', collected: 78, pending: 22 },
    { month: 'Dec', collected: 85, pending: 15 },
    { month: 'Jan', collected: 89, pending: 11 },
    { month: 'Feb', collected: 92, pending: 8 },
    { month: 'Mar', collected: 94, pending: 6 },
]

const recentActivities = [
    { id: 1, action: 'New student added', detail: '25371-CM-067 - Rajesh Kumar', time: '5 min ago', type: 'student' },
    { id: 2, action: 'Attendance marked', detail: '2nd Year CME - 90% present', time: '15 min ago', type: 'attendance' },
    { id: 3, action: 'Fee payment received', detail: '₹15,000 from 25371-CM-045', time: '30 min ago', type: 'fee' },
    { id: 4, action: 'Notice posted', detail: 'Mid-term exam schedule released', time: '2 hours ago', type: 'notice' },
    { id: 5, action: 'Internal marks updated', detail: 'Mid1 marks for 1st Year CME', time: '3 hours ago', type: 'marks' },
]

const COLORS = ['#D32F2F', '#1976D2', '#2E7D32', '#F57F17']

export default function AdminDashboard() {
    const { user } = useAuth()
    const [greeting, setGreeting] = useState('')

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good Morning')
        else if (hour < 17) setGreeting('Good Afternoon')
        else setGreeting('Good Evening')
    }, [])

    return (
        <div className="animate-fade-in">
            <PageHeader
                title={`${greeting}, ${user?.name}!`}
                subtitle="Here's what's happening at KIET today"
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
                <StatCard
                    title="Total Students"
                    value="2,382"
                    subtitle="CME Department"
                    icon={Users}
                    trend="up"
                    trendValue="+12% this semester"
                    color="primary"
                />
                <StatCard
                    title="Today's Attendance"
                    value="89%"
                    subtitle="Average across all years"
                    icon={UserCheck}
                    trend="up"
                    trendValue="+3% from yesterday"
                    color="success"
                />
                <StatCard
                    title="Fee Collection"
                    value="₹42.5L"
                    subtitle="This month"
                    icon={DollarSign}
                    trend="up"
                    trendValue="+8% from last month"
                    color="accent"
                />
                <StatCard
                    title="Active Staff"
                    value="18"
                    subtitle="CTPOS + Admin Staff"
                    icon={GraduationCap}
                    color="warning"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Attendance Chart */}
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-text-primary truncate">Weekly Attendance</h3>
                            <p className="text-sm text-text-secondary truncate">This week's attendance overview</p>
                        </div>
                        <span className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                            89% Average
                        </span>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="present" fill="#2E7D32" radius={[6, 6, 0, 0]} name="Present %" />
                            <Bar dataKey="absent" fill="#EF5350" radius={[6, 6, 0, 0]} name="Absent %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Year Distribution */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Students by Year</h3>
                    <p className="text-sm text-text-secondary mb-4">CME Department</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={yearWiseData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="students"
                            >
                                {yearWiseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                        {yearWiseData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-text-secondary">{item.name}</span>
                                </div>
                                <span className="font-semibold text-text-primary">{item.students}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Fee Collection & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Fee Collection Trend */}
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary">Fee Collection Trend</h3>
                            <p className="text-sm text-text-secondary">Monthly collection percentage</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={feeCollectionData}>
                            <defs>
                                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1976D2" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#1976D2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Area type="monotone" dataKey="collected" stroke="#1976D2" fillOpacity={1} fill="url(#colorCollected)" name="Collected %" />
                            <Line type="monotone" dataKey="pending" stroke="#EF5350" strokeDasharray="5 5" name="Pending %" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => {
                            const iconMap = {
                                student: { icon: Users, color: 'bg-primary/10 text-primary' },
                                attendance: { icon: UserCheck, color: 'bg-success/10 text-success' },
                                fee: { icon: DollarSign, color: 'bg-accent/10 text-accent' },
                                notice: { icon: Bell, color: 'bg-warning/10 text-warning' },
                                marks: { icon: BookOpen, color: 'bg-info/10 text-info' },
                            }
                            const { icon: Icon, color } = iconMap[activity.type]

                            return (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary">{activity.action}</p>
                                        <p className="text-xs text-text-secondary truncate">{activity.detail}</p>
                                        <p className="text-xs text-text-secondary mt-0.5">{activity.time}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-card rounded-2xl border border-border p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Add Student', icon: Users, color: 'bg-primary/10 text-primary hover:bg-primary/20' },
                        { label: 'Mark Attendance', icon: ClipboardList, color: 'bg-success/10 text-success hover:bg-success/20' },
                        { label: 'Enter Marks', icon: BookOpen, color: 'bg-accent/10 text-accent hover:bg-accent/20' },
                        { label: 'Record Payment', icon: DollarSign, color: 'bg-warning/10 text-warning hover:bg-warning/20' },
                        { label: 'Post Notice', icon: Bell, color: 'bg-info/10 text-info hover:bg-info/20' },
                        { label: 'View Reports', icon: TrendingUp, color: 'bg-purple-100 text-purple-600 hover:bg-purple-200' },
                    ].map((action) => (
                        <button key={action.label} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${action.color} transition-all duration-200 hover:scale-105`}>
                            <action.icon className="w-6 h-6" />
                            <span className="text-xs font-medium">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
