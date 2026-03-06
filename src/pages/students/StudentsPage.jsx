import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PageHeader, DataTable, Pagination, Modal, Button, Select, Input, Badge, LoadingSpinner } from '../../components/UI'
import { Plus, Upload, Download, Search, Filter, Eye, Edit2, Trash2, Camera, UserPlus } from 'lucide-react'
import * as XLSX from 'xlsx'

const ITEMS_PER_PAGE = 20

export default function StudentsPage() {
    const { user } = useAuth()
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [yearFilter, setYearFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [formData, setFormData] = useState({
        name: '', roll_number: '', year: '1', branch: 'CME', phone: '', photo: null
    })
    const [formError, setFormError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    // Demo data for when Supabase is not connected
    const demoStudents = [
        { id: 1, name: 'Rajesh Kumar', roll_number: '25371-CM-001', year: 1, branch: 'CME', phone: '9876543210', photo_url: null, created_at: '2026-01-15' },
        { id: 2, name: 'Priya Sharma', roll_number: '25371-CM-002', year: 1, branch: 'CME', phone: '9876543211', photo_url: null, created_at: '2026-01-15' },
        { id: 3, name: 'Arun Patel', roll_number: '25371-CM-003', year: 1, branch: 'CME', phone: '9876543212', photo_url: null, created_at: '2026-01-15' },
        { id: 4, name: 'Sneha Reddy', roll_number: '24371-CM-010', year: 2, branch: 'CME', phone: '9876543213', photo_url: null, created_at: '2025-01-15' },
        { id: 5, name: 'Venkat Rao', roll_number: '24371-CM-011', year: 2, branch: 'CME', phone: '9876543214', photo_url: null, created_at: '2025-01-15' },
        { id: 6, name: 'Lakshmi Devi', roll_number: '24371-CM-012', year: 2, branch: 'CME', phone: '9876543215', photo_url: null, created_at: '2025-01-15' },
        { id: 7, name: 'Suresh Babu', roll_number: '23371-CM-020', year: 3, branch: 'CME', phone: '9876543216', photo_url: null, created_at: '2024-01-15' },
        { id: 8, name: 'Kavitha Nair', roll_number: '23371-CM-021', year: 3, branch: 'CME', phone: '9876543217', photo_url: null, created_at: '2024-01-15' },
        { id: 9, name: 'Ravi Teja', roll_number: '25371-CM-004', year: 1, branch: 'CME', phone: '9876543218', photo_url: null, created_at: '2026-01-15' },
        { id: 10, name: 'Anitha Kumari', roll_number: '25371-CM-005', year: 1, branch: 'CME', phone: '9876543219', photo_url: null, created_at: '2026-01-15' },
        { id: 11, name: 'Mahesh Babu', roll_number: '24371-CM-013', year: 2, branch: 'CME', phone: '9876543220', photo_url: null, created_at: '2025-01-15' },
        { id: 12, name: 'Deepika Reddy', roll_number: '23371-CM-022', year: 3, branch: 'CME', phone: '9876543221', photo_url: null, created_at: '2024-01-15' },
    ]

    const fetchStudents = useCallback(async () => {
        setLoading(true)
        try {
            let query = supabase
                .from('students')
                .select('*', { count: 'exact' })
                .order('roll_number', { ascending: true })

            if (yearFilter !== 'all') {
                query = query.eq('year', parseInt(yearFilter))
            }
            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,roll_number.ilike.%${searchQuery}%`)
            }
            if (user?.role === 'ctpos' && user?.assignedYear) {
                query = query.eq('year', user.assignedYear)
            }

            const from = (currentPage - 1) * ITEMS_PER_PAGE
            query = query.range(from, from + ITEMS_PER_PAGE - 1)

            const { data, count, error } = await query

            if (error) throw error
            setStudents(data || [])
            setTotalCount(count || 0)
        } catch (err) {
            // Use demo data if Supabase is not connected
            let filtered = [...demoStudents]
            if (yearFilter !== 'all') {
                filtered = filtered.filter(s => s.year === parseInt(yearFilter))
            }
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                filtered = filtered.filter(s => s.name.toLowerCase().includes(q) || s.roll_number.toLowerCase().includes(q))
            }
            setStudents(filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE))
            setTotalCount(filtered.length)
        } finally {
            setLoading(false)
        }
    }, [yearFilter, searchQuery, currentPage, user])

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    const handleAddStudent = async (e) => {
        e.preventDefault()
        setFormError('')

        if (!formData.name.trim() || !formData.roll_number.trim()) {
            setFormError('Name and Roll Number are required')
            return
        }

        // Validate roll number format
        const rollPattern = /^\d{5}-[A-Z]{2}-\d{3}$/
        if (!rollPattern.test(formData.roll_number)) {
            setFormError('Roll number must be in format: 25371-CM-067')
            return
        }

        setSubmitting(true)
        try {
            const { error } = await supabase.from('students').insert({
                name: formData.name,
                roll_number: formData.roll_number,
                year: parseInt(formData.year),
                branch: formData.branch,
                phone: formData.phone || null
            })

            if (error) throw error
            setShowAddModal(false)
            setFormData({ name: '', roll_number: '', year: '1', branch: 'CME', phone: '', photo: null })
            fetchStudents()
        } catch (err) {
            // Demo mode - add to local list
            const newStudent = {
                id: Date.now(),
                ...formData,
                year: parseInt(formData.year),
                photo_url: null,
                created_at: new Date().toISOString().split('T')[0]
            }
            setStudents(prev => [newStudent, ...prev])
            setTotalCount(prev => prev + 1)
            setShowAddModal(false)
            setFormData({ name: '', roll_number: '', year: '1', branch: 'CME', phone: '', photo: null })
        } finally {
            setSubmitting(false)
        }
    }

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async (evt) => {
            const wb = XLSX.read(evt.target.result, { type: 'binary' })
            const ws = wb.Sheets[wb.SheetNames[0]]
            const data = XLSX.utils.sheet_to_json(ws)

            const studentsToAdd = data.map(row => ({
                name: row['Name'] || row['name'] || row['Student Name'] || '',
                roll_number: row['Roll Number'] || row['roll_number'] || row['Roll No'] || '',
                year: parseInt(row['Year'] || row['year'] || '1'),
                branch: 'CME',
                phone: row['Phone'] || row['phone'] || row['Mobile'] || null
            })).filter(s => s.name && s.roll_number)

            try {
                const { error } = await supabase.from('students').insert(studentsToAdd)
                if (error) throw error
                fetchStudents()
                alert(`Successfully imported ${studentsToAdd.length} students`)
            } catch (err) {
                // Demo mode
                const newStudents = studentsToAdd.map((s, i) => ({
                    id: Date.now() + i,
                    ...s,
                    photo_url: null,
                    created_at: new Date().toISOString().split('T')[0]
                }))
                setStudents(prev => [...newStudents, ...prev])
                setTotalCount(prev => prev + newStudents.length)
                alert(`Successfully imported ${studentsToAdd.length} students (Demo)`)
            }
        }
        reader.readAsBinaryString(file)
        e.target.value = ''
    }

    const handleExport = () => {
        const exportData = students.map(s => ({
            'Roll Number': s.roll_number,
            'Name': s.name,
            'Year': s.year,
            'Branch': s.branch,
            'Phone': s.phone || 'N/A'
        }))
        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Students')
        XLSX.writeFile(wb, 'KIET_Students.xlsx')
    }

    const columns = [
        {
            key: 'roll_number',
            label: 'Roll Number',
            render: (val) => <span className="font-mono font-semibold text-primary">{val}</span>
        },
        {
            key: 'name',
            label: 'Student Name',
            render: (val, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary">{val?.charAt(0)}</span>
                    </div>
                    <span className="font-medium">{val}</span>
                </div>
            )
        },
        {
            key: 'year',
            label: 'Year',
            render: (val) => (
                <Badge variant={val === 1 ? 'primary' : val === 2 ? 'info' : 'success'}>
                    {val === 1 ? '1st' : val === 2 ? '2nd' : '3rd'} Year
                </Badge>
            )
        },
        { key: 'branch', label: 'Branch' },
        { key: 'phone', label: 'Phone', render: (val) => val || <span className="text-gray-400">—</span> },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedStudent(row); setShowViewModal(true) }}
                        className="p-1.5 rounded-lg hover:bg-accent/10 text-accent transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    {(user?.role === 'admin' || user?.role === 'ctpos') && (
                        <button className="p-1.5 rounded-lg hover:bg-warning/10 text-warning transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )
        }
    ]

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
    const canAddStudents = ['admin', 'ctpos'].includes(user?.role)

    return (
        <div className="animate-fade-in">
            <PageHeader title="Student Management" subtitle={`${totalCount} students in CME Department`}>
                {canAddStudents && (
                    <>
                        <label className="cursor-pointer">
                            <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelUpload} />
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white border border-border hover:bg-bg transition-all cursor-pointer whitespace-nowrap flex-shrink-0">
                                <Upload className="w-4 h-4" /> Import Excel
                            </span>
                        </label>
                        <Button variant="secondary" onClick={handleExport}>
                            <Download className="w-4 h-4" /> Export
                        </Button>
                        <Button variant="primary" onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4" /> Add Student
                        </Button>
                    </>
                )}
            </PageHeader>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative w-full sm:flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name or roll number..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <Select
                    value={yearFilter}
                    onChange={(val) => { setYearFilter(val); setCurrentPage(1) }}
                    options={[
                        { value: 'all', label: 'All Years' },
                        { value: '1', label: '1st Year' },
                        { value: '2', label: '2nd Year' },
                        { value: '3', label: '3rd Year' },
                    ]}
                />
            </div>

            {/* Table */}
            <DataTable
                columns={columns}
                data={students}
                loading={loading}
                emptyMessage="No students found. Add students to get started."
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Add Student Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Student">
                <form onSubmit={handleAddStudent} className="space-y-4">
                    {formError && (
                        <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-red-600 text-sm">
                            {formError}
                        </div>
                    )}
                    <Input
                        label="Student Name *"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter student full name"
                    />
                    <Input
                        label="Roll Number *"
                        value={formData.roll_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, roll_number: e.target.value.toUpperCase() }))}
                        placeholder="25371-CM-067"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            label="Year"
                            value={formData.year}
                            onChange={(val) => setFormData(prev => ({ ...prev, year: val }))}
                            options={[
                                { value: '1', label: '1st Year' },
                                { value: '2', label: '2nd Year' },
                                { value: '3', label: '3rd Year' },
                            ]}
                        />
                        <Input label="Branch" value="CME" disabled />
                    </div>
                    <Input
                        label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Optional"
                        type="tel"
                    />
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add Student'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* View Student Modal */}
            <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Student Profile" size="md">
                {selectedStudent && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">{selectedStudent.name?.charAt(0)}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-text-primary">{selectedStudent.name}</h3>
                                <p className="text-sm text-text-secondary font-mono">{selectedStudent.roll_number}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-bg">
                                <p className="text-xs text-text-secondary">Year</p>
                                <p className="font-semibold">{selectedStudent.year === 1 ? '1st' : selectedStudent.year === 2 ? '2nd' : '3rd'} Year</p>
                            </div>
                            <div className="p-3 rounded-xl bg-bg">
                                <p className="text-xs text-text-secondary">Branch</p>
                                <p className="font-semibold">{selectedStudent.branch}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-bg">
                                <p className="text-xs text-text-secondary">Phone</p>
                                <p className="font-semibold">{selectedStudent.phone || 'Not provided'}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-bg">
                                <p className="text-xs text-text-secondary">Enrolled</p>
                                <p className="font-semibold">{selectedStudent.created_at}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
