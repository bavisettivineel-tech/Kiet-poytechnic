import { useState } from 'react'
import { PageHeader, Select, StatCard } from '../../components/UI'
import { BarChart3, Users, UserCheck, DollarSign, TrendingUp, Award } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart,
    PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'

const attMonthly = [
    { month: 'Sep', '1st': 92, '2nd': 88, '3rd': 85 },
    { month: 'Oct', '1st': 89, '2nd': 86, '3rd': 82 },
    { month: 'Nov', '1st': 91, '2nd': 87, '3rd': 84 },
    { month: 'Dec', '1st': 85, '2nd': 80, '3rd': 78 },
    { month: 'Jan', '1st': 93, '2nd': 90, '3rd': 87 },
    { month: 'Feb', '1st': 90, '2nd': 88, '3rd': 85 },
    { month: 'Mar', '1st': 88, '2nd': 85, '3rd': 83 },
]

const feeData = [
    { name: 'Paid', value: 68, fill: '#2E7D32' },
    { name: 'Partial', value: 22, fill: '#F57F17' },
    { name: 'Unpaid', value: 10, fill: '#C62828' },
]

const marksDistribution = [
    { range: '90-100%', count: 45 },
    { range: '80-89%', count: 120 },
    { range: '70-79%', count: 280 },
    { range: '60-69%', count: 350 },
    { range: '50-59%', count: 180 },
    { range: '<50%', count: 95 },
]

const performanceRadar = [
    { metric: 'Attendance', value: 88 },
    { metric: 'Mid 1', value: 72 },
    { metric: 'Mid 2', value: 76 },
    { metric: 'Mid 3', value: 78 },
    { metric: 'Assignments', value: 85 },
    { metric: 'Fee Payment', value: 90 },
]

const COLORS = ['#D32F2F', '#1976D2', '#2E7D32', '#F57F17']

export default function AnalyticsPage() {
    const [period, setPeriod] = useState('semester')

    return (
        <div className="animate-fade-in">
            <PageHeader title="Analytics & Reports" subtitle="Comprehensive college performance analytics">
                <Select
                    value={period}
                    onChange={setPeriod}
                    options={[
                        { value: 'month', label: 'This Month' },
                        { value: 'semester', label: 'This Semester' },
                        { value: 'year', label: 'This Year' },
                    ]}
                />
            </PageHeader>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
                <StatCard title="Overall Attendance" value="87%" icon={UserCheck} color="success" trend="up" trendValue="+2.3% vs last month" />
                <StatCard title="Active Students" value="2,382" icon={Users} color="primary" />
                <StatCard title="Fee Collection" value="92%" icon={DollarSign} color="accent" trend="up" trendValue="+5% this month" />
                <StatCard title="Avg. Performance" value="72%" icon={Award} color="warning" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Attendance Trends */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Attendance Trends</h3>
                    <p className="text-sm text-text-secondary mb-4">Monthly attendance by year</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={attMonthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                            <YAxis stroke="#94a3b8" fontSize={12} domain={[70, 100]} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Line type="monotone" dataKey="1st" stroke="#D32F2F" strokeWidth={2} dot={{ fill: '#D32F2F', r: 4 }} name="1st Year" />
                            <Line type="monotone" dataKey="2nd" stroke="#1976D2" strokeWidth={2} dot={{ fill: '#1976D2', r: 4 }} name="2nd Year" />
                            <Line type="monotone" dataKey="3rd" stroke="#2E7D32" strokeWidth={2} dot={{ fill: '#2E7D32', r: 4 }} name="3rd Year" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Fee Distribution */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Fee Collection Status</h3>
                    <p className="text-sm text-text-secondary mb-4">Overall collection breakdown</p>
                    <div className="flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={feeData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                    {feeData.map((entry, idx) => (
                                        <Cell key={idx} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-2">
                        {feeData.map(item => (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                                <span className="text-text-secondary">{item.name}: {item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marks Distribution */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Marks Distribution</h3>
                    <p className="text-sm text-text-secondary mb-4">Students by performance range</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={marksDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                            <Bar dataKey="count" fill="#1976D2" radius={[6, 6, 0, 0]} name="Students" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance Radar */}
                <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Overall Performance</h3>
                    <p className="text-sm text-text-secondary mb-4">Multi-metric performance overview</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <RadarChart data={performanceRadar}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                            <Radar name="Performance" dataKey="value" stroke="#D32F2F" fill="#D32F2F" fillOpacity={0.2} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Year-wise Summary Table */}
            <div className="bg-card rounded-2xl border border-border p-5">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Year-wise Summary</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Year</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Students</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Avg. Attendance</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Avg. Marks</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Fee Collected</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Transport</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[
                                { year: '1st Year CME', students: 856, attendance: '90%', marks: '74%', fee: '94%', transport: 120 },
                                { year: '2nd Year CME', students: 792, attendance: '87%', marks: '71%', fee: '91%', transport: 95 },
                                { year: '3rd Year CME', students: 734, attendance: '84%', marks: '68%', fee: '88%', transport: 78 },
                            ].map(row => (
                                <tr key={row.year} className="hover:bg-bg/30 transition-colors">
                                    <td className="px-4 py-3 font-semibold text-text-primary">{row.year}</td>
                                    <td className="px-4 py-3 text-center">{row.students}</td>
                                    <td className="px-4 py-3 text-center font-semibold text-success">{row.attendance}</td>
                                    <td className="px-4 py-3 text-center font-semibold text-accent">{row.marks}</td>
                                    <td className="px-4 py-3 text-center font-semibold text-primary">{row.fee}</td>
                                    <td className="px-4 py-3 text-center">{row.transport}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
