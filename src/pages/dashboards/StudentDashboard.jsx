import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { StatCard, PageHeader, Badge } from '../../components/UI'
import { UserCheck, BookOpen, DollarSign, Bell, Calendar, TrendingUp, Bus, Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function StudentDashboard() {
    const { user } = useAuth()
    const studentName = user?.name || user?.studentData?.name || 'Student'
    const rollNumber = user?.loginId || user?.studentData?.roll_number || '25371-CM-001'

    const attendanceData = [
        { month: 'Sep', percentage: 92 },
        { month: 'Oct', percentage: 88 },
        { month: 'Nov', percentage: 95 },
        { month: 'Dec', percentage: 82 },
        { month: 'Jan', percentage: 90 },
        { month: 'Feb', percentage: 87 },
        { month: 'Mar', percentage: 91 },
    ]

    const marksData = {
        mid1: 38,
        mid2: 42,
        mid3: 40,
        assignments: 18,
        total: 138,
        percentage: 81
    }

    const feeData = {
        total: 35000,
        paid: 20000,
        pending: 15000,
        status: 'partial'
    }

    const recentAttendance = [
        { date: '2026-03-06', status: 'present' },
        { date: '2026-03-05', status: 'present' },
        { date: '2026-03-04', status: 'absent' },
        { date: '2026-03-03', status: 'present' },
        { date: '2026-03-02', status: 'present' },
        { date: '2026-03-01', status: 'present' },
        { date: '2026-02-28', status: 'present' },
    ]

    const notices = [
        { title: 'Mid-Term Exam Schedule Released', time: '1 day ago', priority: 'high' },
        { title: 'Fee Payment Deadline Extended', time: '2 days ago', priority: 'urgent' },
    ]

    return (
        <div className="animate-fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute right-20 bottom-0 w-24 h-24 bg-white/5 rounded-full translate-y-6"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-1">Welcome, {studentName}! 👋</h1>
                    <p className="text-white/70 text-sm">Roll Number: <span className="font-mono font-semibold text-white">{rollNumber}</span></p>
                    <p className="text-white/60 text-xs mt-1">CME Department · KIET Polytechnic</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
                <StatCard title="Attendance" value="89%" subtitle="Overall" icon={UserCheck} color="success" />
                <StatCard title="Internal Marks" value={`${marksData.percentage}%`} subtitle={`${marksData.total}/170`} icon={BookOpen} color="accent" />
                <StatCard title="Fee Status" value={feeData.status === 'paid' ? 'Paid' : `₹${feeData.pending.toLocaleString()}`} subtitle={feeData.status === 'paid' ? 'All fees cleared' : 'Pending'} icon={DollarSign} color={feeData.status === 'paid' ? 'success' : 'warning'} />
                <StatCard title="Notices" value="2" subtitle="Unread" icon={Bell} color="info" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Attendance Chart */}
                <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Attendance Overview</h3>
                    <p className="text-sm text-text-secondary mb-4">Monthly attendance percentage</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={attendanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[70, 100]} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Bar dataKey="percentage" fill="#2E7D32" radius={[6, 6, 0, 0]} name="Attendance %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Attendance */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Attendance</h3>
                    <div className="space-y-2">
                        {recentAttendance.map((day) => (
                            <div key={day.date} className={`flex items-center justify-between p-2.5 rounded-xl ${day.status === 'present' ? 'bg-success/5' : 'bg-danger/5'}`}>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-text-secondary" />
                                    <span className="text-sm">{new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' })}</span>
                                </div>
                                <Badge variant={day.status === 'present' ? 'success' : 'danger'}>
                                    {day.status === 'present' ? '✓ Present' : '✕ Absent'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Internal Marks Card */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Internal Marks</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Mid 1', value: marksData.mid1, max: 50 },
                            { label: 'Mid 2', value: marksData.mid2, max: 50 },
                            { label: 'Mid 3', value: marksData.mid3, max: 50 },
                            { label: 'Assignments', value: marksData.assignments, max: 20 },
                        ].map(item => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-text-secondary">{item.label}</span>
                                    <span className="font-semibold">{item.value}/{item.max}</span>
                                </div>
                                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${(item.value / item.max) >= 0.7 ? 'bg-success' : (item.value / item.max) >= 0.5 ? 'bg-warning' : 'bg-danger'}`}
                                        style={{ width: `${(item.value / item.max) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="pt-3 border-t border-border flex items-center justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="text-xl font-bold text-primary">{marksData.total}/170 ({marksData.percentage}%)</span>
                        </div>
                    </div>
                </div>

                {/* Fee Status Card */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Fee Status</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-bg text-center">
                                <p className="text-xs text-text-secondary">Total Fee</p>
                                <p className="text-lg font-bold">₹{feeData.total.toLocaleString()}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-success/5 text-center">
                                <p className="text-xs text-text-secondary">Paid</p>
                                <p className="text-lg font-bold text-success">₹{feeData.paid.toLocaleString()}</p>
                            </div>
                        </div>
                        {feeData.pending > 0 && (
                            <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 text-center">
                                <p className="text-xs text-text-secondary">Pending Amount</p>
                                <p className="text-2xl font-bold text-danger">₹{feeData.pending.toLocaleString()}</p>
                            </div>
                        )}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-text-secondary">Payment Progress</span>
                                <span className="font-semibold">{Math.round((feeData.paid / feeData.total) * 100)}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                                    style={{ width: `${(feeData.paid / feeData.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notices Preview */}
                    <div className="mt-6 pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <Bell className="w-4 h-4" /> Recent Notices
                        </h4>
                        {notices.map((notice, idx) => (
                            <div key={idx} className="flex items-start gap-2 mb-3 last:mb-0">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notice.priority === 'urgent' ? 'bg-danger' : 'bg-warning'}`}></div>
                                <div>
                                    <p className="text-sm font-medium">{notice.title}</p>
                                    <p className="text-xs text-text-secondary">{notice.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
