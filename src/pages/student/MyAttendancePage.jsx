import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { PageHeader, Badge, Select } from '../../components/UI'
import { UserCheck, Calendar, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MyAttendancePage() {
    const { user } = useAuth()
    const [monthFilter, setMonthFilter] = useState('all')

    const monthlyData = [
        { month: 'Sep', present: 23, absent: 2, total: 25, percentage: 92 },
        { month: 'Oct', present: 22, absent: 4, total: 26, percentage: 85 },
        { month: 'Nov', present: 24, absent: 1, total: 25, percentage: 96 },
        { month: 'Dec', present: 18, absent: 4, total: 22, percentage: 82 },
        { month: 'Jan', present: 23, absent: 2, total: 25, percentage: 92 },
        { month: 'Feb', present: 21, absent: 3, total: 24, percentage: 88 },
        { month: 'Mar', present: 4, absent: 1, total: 5, percentage: 80 },
    ]

    const totalPresent = monthlyData.reduce((sum, m) => sum + m.present, 0)
    const totalDays = monthlyData.reduce((sum, m) => sum + m.total, 0)
    const overallPercentage = Math.round((totalPresent / totalDays) * 100)

    const attendanceHistory = [
        { date: '2026-03-06', day: 'Thursday', status: 'present' },
        { date: '2026-03-05', day: 'Wednesday', status: 'present' },
        { date: '2026-03-04', day: 'Tuesday', status: 'absent' },
        { date: '2026-03-03', day: 'Monday', status: 'present' },
        { date: '2026-03-01', day: 'Saturday', status: 'present' },
        { date: '2026-02-28', day: 'Friday', status: 'present' },
        { date: '2026-02-27', day: 'Thursday', status: 'present' },
        { date: '2026-02-26', day: 'Wednesday', status: 'absent' },
        { date: '2026-02-25', day: 'Tuesday', status: 'present' },
        { date: '2026-02-24', day: 'Monday', status: 'present' },
        { date: '2026-02-22', day: 'Saturday', status: 'present' },
        { date: '2026-02-21', day: 'Friday', status: 'present' },
        { date: '2026-02-20', day: 'Thursday', status: 'present' },
        { date: '2026-02-19', day: 'Wednesday', status: 'absent' },
        { date: '2026-02-18', day: 'Tuesday', status: 'present' },
    ]

    return (
        <div className="animate-fade-in">
            <PageHeader title="My Attendance" subtitle="View your attendance history and statistics" />

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center
            ${overallPercentage >= 75 ? 'bg-success/10' : 'bg-danger/10'}`}>
                        <span className={`text-2xl font-bold ${overallPercentage >= 75 ? 'text-success' : 'text-danger'}`}>
                            {overallPercentage}%
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary">Overall</p>
                </div>
                <div className="bg-success/5 rounded-2xl border border-success/20 p-5 text-center">
                    <p className="text-3xl font-bold text-success">{totalPresent}</p>
                    <p className="text-sm text-text-secondary">Days Present</p>
                </div>
                <div className="bg-danger/5 rounded-2xl border border-danger/20 p-5 text-center">
                    <p className="text-3xl font-bold text-danger">{totalDays - totalPresent}</p>
                    <p className="text-sm text-text-secondary">Days Absent</p>
                </div>
                <div className="bg-accent/5 rounded-2xl border border-accent/20 p-5 text-center">
                    <p className="text-3xl font-bold text-accent">{totalDays}</p>
                    <p className="text-sm text-text-secondary">Working Days</p>
                </div>
            </div>

            {/* Monthly Chart */}
            <div className="bg-card rounded-2xl border border-border p-5 mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Attendance</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                        <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        <Bar dataKey="percentage" fill="#2E7D32" radius={[6, 6, 0, 0]} name="Attendance %" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent History */}
            <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Attendance History</h3>
                <div className="space-y-2">
                    {attendanceHistory.map(day => (
                        <div key={day.date} className={`flex items-center justify-between p-3 rounded-xl ${day.status === 'present' ? 'bg-success/5' : 'bg-danger/5'}`}>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-text-secondary" />
                                <div>
                                    <p className="text-sm font-medium">{new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    <p className="text-xs text-text-secondary">{day.day}</p>
                                </div>
                            </div>
                            <Badge variant={day.status === 'present' ? 'success' : 'danger'}>
                                {day.status === 'present' ? '✓ Present' : '✕ Absent'}
                            </Badge>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
