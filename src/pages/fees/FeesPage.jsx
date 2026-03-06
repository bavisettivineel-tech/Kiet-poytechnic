import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PageHeader, Button, Select, Badge, Modal, Input, DataTable, Pagination, LoadingSpinner } from '../../components/UI'
import { DollarSign, Plus, Search, CheckCircle2, Clock, AlertCircle, Download, CreditCard } from 'lucide-react'
import * as XLSX from 'xlsx'

const ITEMS_PER_PAGE = 15

export default function FeesPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState('overview')
    const [yearFilter, setYearFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [paymentAmount, setPaymentAmount] = useState('')
    const [paymentNote, setPaymentNote] = useState('')

    const demoFees = [
        { id: 1, student_name: 'Rajesh Kumar', roll_number: '25371-CM-001', year: 1, total_fee: 35000, paid: 35000, status: 'paid' },
        { id: 2, student_name: 'Priya Sharma', roll_number: '25371-CM-002', year: 1, total_fee: 35000, paid: 20000, status: 'partial' },
        { id: 3, student_name: 'Arun Patel', roll_number: '25371-CM-003', year: 1, total_fee: 35000, paid: 0, status: 'unpaid' },
        { id: 4, student_name: 'Ravi Teja', roll_number: '25371-CM-004', year: 1, total_fee: 35000, paid: 35000, status: 'paid' },
        { id: 5, student_name: 'Anitha Kumari', roll_number: '25371-CM-005', year: 1, total_fee: 35000, paid: 15000, status: 'partial' },
        { id: 6, student_name: 'Sneha Reddy', roll_number: '24371-CM-010', year: 2, total_fee: 35000, paid: 35000, status: 'paid' },
        { id: 7, student_name: 'Venkat Rao', roll_number: '24371-CM-011', year: 2, total_fee: 35000, paid: 25000, status: 'partial' },
        { id: 8, student_name: 'Lakshmi Devi', roll_number: '24371-CM-012', year: 2, total_fee: 35000, paid: 35000, status: 'paid' },
        { id: 9, student_name: 'Suresh Babu', roll_number: '23371-CM-020', year: 3, total_fee: 35000, paid: 0, status: 'unpaid' },
        { id: 10, student_name: 'Kavitha Nair', roll_number: '23371-CM-021', year: 3, total_fee: 35000, paid: 35000, status: 'paid' },
        { id: 11, student_name: 'Deepika Reddy', roll_number: '23371-CM-022', year: 3, total_fee: 35000, paid: 10000, status: 'partial' },
        { id: 12, student_name: 'Mahesh Babu', roll_number: '24371-CM-013', year: 2, total_fee: 35000, paid: 35000, status: 'paid' },
    ]

    const [fees, setFees] = useState(demoFees)

    const filteredFees = fees.filter(f => {
        if (yearFilter !== 'all' && f.year !== parseInt(yearFilter)) return false
        if (statusFilter !== 'all' && f.status !== statusFilter) return false
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            if (!f.student_name.toLowerCase().includes(q) && !f.roll_number.toLowerCase().includes(q)) return false
        }
        return true
    })

    const paginatedFees = filteredFees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    const totalPages = Math.ceil(filteredFees.length / ITEMS_PER_PAGE)

    const totalCollection = fees.reduce((sum, f) => sum + f.paid, 0)
    const totalPending = fees.reduce((sum, f) => sum + (f.total_fee - f.paid), 0)
    const totalStudents = fees.length
    const paidCount = fees.filter(f => f.status === 'paid').length

    const handleRecordPayment = () => {
        if (!paymentAmount || !selectedStudent) return
        const amount = parseInt(paymentAmount)
        setFees(prev => prev.map(f => {
            if (f.id !== selectedStudent.id) return f
            const newPaid = Math.min(f.total_fee, f.paid + amount)
            return {
                ...f,
                paid: newPaid,
                status: newPaid >= f.total_fee ? 'paid' : 'partial'
            }
        }))
        setShowPaymentModal(false)
        setPaymentAmount('')
        setPaymentNote('')
        setSelectedStudent(null)
    }

    const exportFees = () => {
        const data = filteredFees.map(f => ({
            'Roll Number': f.roll_number,
            'Name': f.student_name,
            'Year': f.year,
            'Total Fee': f.total_fee,
            'Paid': f.paid,
            'Pending': f.total_fee - f.paid,
            'Status': f.status.toUpperCase()
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Fees')
        XLSX.writeFile(wb, 'KIET_Fee_Report.xlsx')
    }

    const columns = [
        {
            key: 'roll_number',
            label: 'Roll Number',
            render: (val) => <span className="font-mono font-semibold text-primary">{val}</span>
        },
        { key: 'student_name', label: 'Student', render: (val) => <span className="font-medium">{val}</span> },
        {
            key: 'year',
            label: 'Year',
            render: (val) => <Badge variant="info">{val === 1 ? '1st' : val === 2 ? '2nd' : '3rd'}</Badge>
        },
        {
            key: 'total_fee',
            label: 'Total Fee',
            render: (val) => <span className="font-semibold">₹{val?.toLocaleString()}</span>
        },
        {
            key: 'paid',
            label: 'Paid',
            render: (val) => <span className="font-semibold text-success">₹{val?.toLocaleString()}</span>
        },
        {
            key: 'pending',
            label: 'Pending',
            render: (_, row) => {
                const pending = row.total_fee - row.paid
                return <span className={`font-semibold ${pending > 0 ? 'text-danger' : 'text-success'}`}>₹{pending.toLocaleString()}</span>
            }
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => (
                <Badge variant={val === 'paid' ? 'success' : val === 'partial' ? 'warning' : 'danger'}>
                    {val === 'paid' ? '✓ Paid' : val === 'partial' ? '◐ Partial' : '✕ Unpaid'}
                </Badge>
            )
        },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                row.status !== 'paid' && ['admin', 'management', 'administrative_staff'].includes(user?.role) ? (
                    <Button
                        variant="accent"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); setSelectedStudent(row); setShowPaymentModal(true) }}
                    >
                        <CreditCard className="w-3 h-3" /> Pay
                    </Button>
                ) : null
            )
        }
    ]

    return (
        <div className="animate-fade-in">
            <PageHeader title="Fee Management" subtitle="College fee collection and tracking">
                <Button variant="secondary" onClick={exportFees}>
                    <Download className="w-4 h-4" /> Export Report
                </Button>
            </PageHeader>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-card rounded-2xl p-5 border border-border card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Total Expected</p>
                            <p className="text-xl font-bold">₹{(totalCollection + totalPending).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Collected</p>
                            <p className="text-xl font-bold text-success">₹{totalCollection.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-danger" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Pending</p>
                            <p className="text-xl font-bold text-danger">₹{totalPending.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border card-hover">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Fully Paid</p>
                            <p className="text-xl font-bold">{paidCount}/{totalStudents}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-card rounded-2xl p-5 border border-border mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-secondary">Overall Collection Progress</span>
                    <span className="text-sm font-bold text-success">
                        {Math.round((totalCollection / (totalCollection + totalPending)) * 100)}%
                    </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                        style={{ width: `${(totalCollection / (totalCollection + totalPending)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative w-full sm:flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by name or roll number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                <Select
                    value={statusFilter}
                    onChange={(val) => { setStatusFilter(val); setCurrentPage(1) }}
                    options={[
                        { value: 'all', label: 'All Status' },
                        { value: 'paid', label: 'Paid' },
                        { value: 'partial', label: 'Partial' },
                        { value: 'unpaid', label: 'Unpaid' },
                    ]}
                />
            </div>

            <DataTable columns={columns} data={paginatedFees} loading={loading} emptyMessage="No fee records found" />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Payment Modal */}
            <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Record Payment">
                {selectedStudent && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-bg">
                            <p className="text-sm text-text-secondary">Student</p>
                            <p className="font-semibold">{selectedStudent.student_name}</p>
                            <p className="text-xs text-text-secondary font-mono">{selectedStudent.roll_number}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-xl bg-bg">
                                <p className="text-xs text-text-secondary">Total Fee</p>
                                <p className="font-bold">₹{selectedStudent.total_fee?.toLocaleString()}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-bg">
                                <p className="text-xs text-text-secondary">Pending</p>
                                <p className="font-bold text-danger">₹{(selectedStudent.total_fee - selectedStudent.paid)?.toLocaleString()}</p>
                            </div>
                        </div>
                        <Input
                            label="Payment Amount (₹)"
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Enter amount"
                            max={selectedStudent.total_fee - selectedStudent.paid}
                        />
                        <Input
                            label="Note (optional)"
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                            placeholder="Payment reference or note"
                        />
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
                            <Button variant="primary" onClick={handleRecordPayment} disabled={!paymentAmount}>
                                <CreditCard className="w-4 h-4" /> Record Payment
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}
