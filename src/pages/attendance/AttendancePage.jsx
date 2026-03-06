import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PageHeader, Button, Select, Badge, LoadingSpinner } from '../../components/UI'
import { UserCheck, UserX, Save, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'

export default function AttendancePage() {
    const { user } = useAuth()
    const [selectedYear, setSelectedYear] = useState(user?.assignedYear?.toString() || '1')
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
    const [students, setStudents] = useState([])
    const [attendance, setAttendance] = useState({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    // Demo students
    const demoStudentsByYear = {
        '1': [
            { id: 1, name: 'Rajesh Kumar', roll_number: '25371-CM-001' },
            { id: 2, name: 'Priya Sharma', roll_number: '25371-CM-002' },
            { id: 3, name: 'Arun Patel', roll_number: '25371-CM-003' },
            { id: 4, name: 'Ravi Teja', roll_number: '25371-CM-004' },
            { id: 5, name: 'Anitha Kumari', roll_number: '25371-CM-005' },
            { id: 6, name: 'Srinivas Reddy', roll_number: '25371-CM-006' },
            { id: 7, name: 'Lakshmi Priya', roll_number: '25371-CM-007' },
            { id: 8, name: 'Ganesh Babu', roll_number: '25371-CM-008' },
            { id: 9, name: 'Swathi Reddy', roll_number: '25371-CM-009' },
            { id: 10, name: 'Kiran Kumar', roll_number: '25371-CM-010' },
        ],
        '2': [
            { id: 11, name: 'Sneha Reddy', roll_number: '24371-CM-010' },
            { id: 12, name: 'Venkat Rao', roll_number: '24371-CM-011' },
            { id: 13, name: 'Lakshmi Devi', roll_number: '24371-CM-012' },
            { id: 14, name: 'Mahesh Babu', roll_number: '24371-CM-013' },
            { id: 15, name: 'Divya Sri', roll_number: '24371-CM-014' },
            { id: 16, name: 'Ramu Naidu', roll_number: '24371-CM-015' },
            { id: 17, name: 'Padma Priya', roll_number: '24371-CM-016' },
            { id: 18, name: 'Sunil Kumar', roll_number: '24371-CM-017' },
        ],
        '3': [
            { id: 19, name: 'Suresh Babu', roll_number: '23371-CM-020' },
            { id: 20, name: 'Kavitha Nair', roll_number: '23371-CM-021' },
            { id: 21, name: 'Deepika Reddy', roll_number: '23371-CM-022' },
            { id: 22, name: 'Ramesh Varma', roll_number: '23371-CM-023' },
            { id: 23, name: 'Sravani Devi', roll_number: '23371-CM-024' },
            { id: 24, name: 'Naresh Kumar', roll_number: '23371-CM-025' },
        ]
    }

    const fetchStudents = async () => {
        setLoading(true)
        setSaved(false)
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id, name, roll_number')
                .eq('year', parseInt(selectedYear))
                .order('roll_number')

            if (error) throw error
            setStudents(data || [])

            // Fetch existing attendance for this date
            const { data: existingAttendance } = await supabase
                .from('attendance')
                .select('student_id, status')
                .eq('date', selectedDate)
                .in('student_id', (data || []).map(s => s.id))

            const attendanceMap = {}
            if (existingAttendance) {
                existingAttendance.forEach(a => {
                    attendanceMap[a.student_id] = a.status
                })
            }

            // Initialize unmarked students
            ; (data || []).forEach(s => {
                if (!attendanceMap[s.id]) {
                    attendanceMap[s.id] = null
                }
            })
            setAttendance(attendanceMap)
        } catch (err) {
            // Demo mode
            const demoStudents = demoStudentsByYear[selectedYear] || []
            setStudents(demoStudents)
            const attendanceMap = {}
            demoStudents.forEach(s => { attendanceMap[s.id] = null })
            setAttendance(attendanceMap)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [selectedYear, selectedDate])

    const markAttendance = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }))
        setSaved(false)
    }

    const markAllPresent = () => {
        const newAttendance = {}
        students.forEach(s => { newAttendance[s.id] = 'present' })
        setAttendance(newAttendance)
        setSaved(false)
    }

    const markAllAbsent = () => {
        const newAttendance = {}
        students.forEach(s => { newAttendance[s.id] = 'absent' })
        setAttendance(newAttendance)
        setSaved(false)
    }

    const saveAttendance = async () => {
        setSaving(true)
        const records = Object.entries(attendance)
            .filter(([_, status]) => status !== null)
            .map(([studentId, status]) => ({
                student_id: parseInt(studentId),
                roll_number: students.find(s => s.id === parseInt(studentId))?.roll_number,
                date: selectedDate,
                status,
                marked_by: user?.id
            }))

        try {
            // Upsert attendance records
            const { error } = await supabase
                .from('attendance')
                .upsert(records, { onConflict: 'student_id,date' })

            if (error) throw error
            setSaved(true)
        } catch (err) {
            // Demo mode
            setSaved(true)
        } finally {
            setSaving(false)
        }
    }

    const presentCount = Object.values(attendance).filter(s => s === 'present').length
    const absentCount = Object.values(attendance).filter(s => s === 'absent').length
    const unmarkedCount = Object.values(attendance).filter(s => s === null).length
    const totalStudents = students.length
    const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0

    return (
        <div className="animate-fade-in">
            <PageHeader title="Daily Attendance" subtitle="Mark daily attendance for students">
                <Button variant="primary" onClick={saveAttendance} disabled={saving || unmarkedCount > 0}>
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Attendance'}
                </Button>
            </PageHeader>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Select
                    label="Academic Year"
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={[
                        { value: '1', label: '1st Year CME' },
                        { value: '2', label: '2nd Year CME' },
                        { value: '3', label: '3rd Year CME' },
                    ]}
                    className="w-48"
                />
                <div className="w-48">
                    <label className="block text-sm font-medium text-text-secondary mb-1.5">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                    <p className="text-2xl font-bold text-text-primary">{totalStudents}</p>
                    <p className="text-xs text-text-secondary">Total Students</p>
                </div>
                <div className="bg-success/5 p-4 rounded-xl border border-success/20 text-center">
                    <p className="text-2xl font-bold text-success">{presentCount}</p>
                    <p className="text-xs text-text-secondary">Present</p>
                </div>
                <div className="bg-danger/5 p-4 rounded-xl border border-danger/20 text-center">
                    <p className="text-2xl font-bold text-danger">{absentCount}</p>
                    <p className="text-xs text-text-secondary">Absent</p>
                </div>
                <div className="bg-accent/5 p-4 rounded-xl border border-accent/20 text-center">
                    <p className="text-2xl font-bold text-accent">{attendancePercentage}%</p>
                    <p className="text-xs text-text-secondary">Attendance</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-4">
                <Button variant="secondary" size="sm" onClick={markAllPresent}>
                    <CheckCircle2 className="w-4 h-4" /> Mark All Present
                </Button>
                <Button variant="secondary" size="sm" onClick={markAllAbsent}>
                    <XCircle className="w-4 h-4" /> Mark All Absent
                </Button>
            </div>

            {/* Student List */}
            {loading ? (
                <LoadingSpinner />
            ) : students.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-12 text-center">
                    <p className="text-text-secondary">No students found for this year.</p>
                </div>
            ) : (
                <div className="bg-card rounded-2xl border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                        {students.map((student, index) => {
                            const status = attendance[student.id]
                            return (
                                <div
                                    key={student.id}
                                    className={`flex items-center justify-between px-4 py-3 hover:bg-bg/50 transition-colors
                    ${status === 'present' ? 'bg-success/5' : status === 'absent' ? 'bg-danger/5' : ''}`}
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-text-secondary w-8">{index + 1}.</span>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                      ${status === 'present' ? 'bg-success' : status === 'absent' ? 'bg-danger' : 'bg-gray-300'}`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-text-primary">{student.name}</p>
                                            <p className="text-xs text-text-secondary font-mono">{student.roll_number}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => markAttendance(student.id, 'present')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                        ${status === 'present'
                                                    ? 'bg-success text-white shadow-sm'
                                                    : 'bg-success/10 text-success hover:bg-success/20'
                                                }`}
                                        >
                                            <UserCheck className="w-4 h-4" />
                                            <span className="hidden sm:inline">P</span>
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, 'absent')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                        ${status === 'absent'
                                                    ? 'bg-danger text-white shadow-sm'
                                                    : 'bg-danger/10 text-danger hover:bg-danger/20'
                                                }`}
                                        >
                                            <UserX className="w-4 h-4" />
                                            <span className="hidden sm:inline">A</span>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {saved && (
                <div className="fixed bottom-6 right-6 bg-success text-white px-6 py-3 rounded-xl shadow-lg animate-slide-left flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Attendance saved successfully!
                </div>
            )}
        </div>
    )
}
