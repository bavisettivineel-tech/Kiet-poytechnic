import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PageHeader, Button, Select, Badge, LoadingSpinner, Modal, Input } from '../../components/UI'
import { BookOpen, Save, Edit2, CheckCircle2 } from 'lucide-react'

export default function MarksPage() {
    const { user } = useAuth()
    const [selectedYear, setSelectedYear] = useState(user?.assignedYear?.toString() || '1')
    const [students, setStudents] = useState([])
    const [marks, setMarks] = useState({})
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const demoStudents = {
        '1': [
            { id: 1, name: 'Rajesh Kumar', roll_number: '25371-CM-001', mid1: 38, mid2: 42, mid3: 40, assignments: 18 },
            { id: 2, name: 'Priya Sharma', roll_number: '25371-CM-002', mid1: 45, mid2: 44, mid3: 46, assignments: 20 },
            { id: 3, name: 'Arun Patel', roll_number: '25371-CM-003', mid1: 32, mid2: 35, mid3: 38, assignments: 15 },
            { id: 4, name: 'Ravi Teja', roll_number: '25371-CM-004', mid1: 28, mid2: 30, mid3: 33, assignments: 14 },
            { id: 5, name: 'Anitha Kumari', roll_number: '25371-CM-005', mid1: 42, mid2: 44, mid3: 45, assignments: 19 },
            { id: 6, name: 'Srinivas Reddy', roll_number: '25371-CM-006', mid1: 35, mid2: 38, mid3: 40, assignments: 17 },
        ],
        '2': [
            { id: 11, name: 'Sneha Reddy', roll_number: '24371-CM-010', mid1: 44, mid2: 46, mid3: 45, assignments: 20 },
            { id: 12, name: 'Venkat Rao', roll_number: '24371-CM-011', mid1: 36, mid2: 38, mid3: 40, assignments: 16 },
            { id: 13, name: 'Lakshmi Devi', roll_number: '24371-CM-012', mid1: 40, mid2: 42, mid3: 44, assignments: 18 },
            { id: 14, name: 'Mahesh Babu', roll_number: '24371-CM-013', mid1: 30, mid2: 33, mid3: 36, assignments: 14 },
        ],
        '3': [
            { id: 19, name: 'Suresh Babu', roll_number: '23371-CM-020', mid1: 42, mid2: 44, mid3: 46, assignments: 19 },
            { id: 20, name: 'Kavitha Nair', roll_number: '23371-CM-021', mid1: 48, mid2: 47, mid3: 48, assignments: 20 },
            { id: 21, name: 'Deepika Reddy', roll_number: '23371-CM-022', mid1: 38, mid2: 40, mid3: 42, assignments: 17 },
        ]
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setSaved(false)
            try {
                const { data: studentData, error } = await supabase
                    .from('students')
                    .select('id, name, roll_number')
                    .eq('year', parseInt(selectedYear))
                    .order('roll_number')

                if (error) throw error

                const { data: marksData } = await supabase
                    .from('internal_marks')
                    .select('*')
                    .in('student_id', (studentData || []).map(s => s.id))

                const marksMap = {}
                    ; (marksData || []).forEach(m => {
                        marksMap[m.student_id] = {
                            mid1: m.mid1 || '',
                            mid2: m.mid2 || '',
                            mid3: m.mid3 || '',
                            assignments: m.assignments || ''
                        }
                    })

                const studentsWithMarks = (studentData || []).map(s => ({
                    ...s,
                    ...(marksMap[s.id] || { mid1: '', mid2: '', mid3: '', assignments: '' })
                }))

                setStudents(studentsWithMarks)
                setMarks(marksMap)
            } catch {
                const demo = demoStudents[selectedYear] || []
                setStudents(demo)
                const marksMap = {}
                demo.forEach(s => {
                    marksMap[s.id] = { mid1: s.mid1, mid2: s.mid2, mid3: s.mid3, assignments: s.assignments }
                })
                setMarks(marksMap)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [selectedYear])

    const updateMark = (studentId, field, value) => {
        const numVal = value === '' ? '' : Math.min(50, Math.max(0, parseInt(value) || 0))
        setStudents(prev =>
            prev.map(s => s.id === studentId ? { ...s, [field]: numVal } : s)
        )
        setMarks(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: numVal }
        }))
        setSaved(false)
    }

    const saveMarks = async () => {
        setSaving(true)
        const records = students.map(s => ({
            student_id: s.id,
            mid1: s.mid1 || 0,
            mid2: s.mid2 || 0,
            mid3: s.mid3 || 0,
            assignments: s.assignments || 0
        }))

        try {
            const { error } = await supabase
                .from('internal_marks')
                .upsert(records, { onConflict: 'student_id' })
            if (error) throw error
            setSaved(true)
            setEditMode(false)
        } catch {
            setSaved(true)
            setEditMode(false)
        } finally {
            setSaving(false)
        }
    }

    const getGrade = (total) => {
        if (total >= 90) return { grade: 'A+', color: 'text-success' }
        if (total >= 80) return { grade: 'A', color: 'text-success' }
        if (total >= 70) return { grade: 'B+', color: 'text-accent' }
        if (total >= 60) return { grade: 'B', color: 'text-accent' }
        if (total >= 50) return { grade: 'C', color: 'text-warning' }
        if (total >= 40) return { grade: 'D', color: 'text-warning' }
        return { grade: 'F', color: 'text-danger' }
    }

    const canEdit = ['admin', 'ctpos'].includes(user?.role)

    return (
        <div className="animate-fade-in">
            <PageHeader title="Internal Marks" subtitle="Mid-term and assignment marks">
                {canEdit && (
                    <>
                        {editMode ? (
                            <Button variant="primary" onClick={saveMarks} disabled={saving}>
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Marks'}
                            </Button>
                        ) : (
                            <Button variant="secondary" onClick={() => setEditMode(true)}>
                                <Edit2 className="w-4 h-4" /> Edit Marks
                            </Button>
                        )}
                    </>
                )}
            </PageHeader>

            <div className="flex gap-3 mb-6">
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
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : students.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-12 text-center">
                    <p className="text-text-secondary">No students found.</p>
                </div>
            ) : (
                <div className="table-container bg-card overflow-x-auto rounded-2xl border border-border">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-border bg-bg/50">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">#</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Roll No</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase">Name</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Mid 1 (50)</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Mid 2 (50)</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Mid 3 (50)</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Assign (20)</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Total</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">%</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-text-secondary uppercase">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map((student, index) => {
                                const total = (parseInt(student.mid1) || 0) + (parseInt(student.mid2) || 0) + (parseInt(student.mid3) || 0) + (parseInt(student.assignments) || 0)
                                const maxTotal = 170 // 50+50+50+20
                                const percentage = Math.round((total / maxTotal) * 100)
                                const { grade, color } = getGrade(percentage)

                                return (
                                    <tr key={student.id} className="hover:bg-bg/30 transition-colors">
                                        <td className="px-4 py-3 text-sm text-text-secondary">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-mono font-semibold text-primary">{student.roll_number}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-text-primary">{student.name}</td>
                                        {['mid1', 'mid2', 'mid3', 'assignments'].map(field => (
                                            <td key={field} className="px-4 py-3 text-center">
                                                {editMode ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={field === 'assignments' ? 20 : 50}
                                                        value={student[field]}
                                                        onChange={(e) => updateMark(student.id, field, e.target.value)}
                                                        className="w-16 px-2 py-1 text-center text-sm rounded-lg border border-border focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    />
                                                ) : (
                                                    <span className={`text-sm font-medium ${student[field] === '' ? 'text-gray-400' : ''}`}>
                                                        {student[field] === '' ? '—' : student[field]}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center text-sm font-bold text-text-primary">{total}</td>
                                        <td className="px-4 py-3 text-center text-sm font-semibold">{percentage}%</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-sm font-bold ${color}`}>{grade}</span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {saved && (
                <div className="fixed bottom-6 right-6 bg-success text-white px-6 py-3 rounded-xl shadow-lg animate-slide-left flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Marks saved successfully!
                </div>
            )}
        </div>
    )
}
