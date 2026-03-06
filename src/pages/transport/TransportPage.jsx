import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { PageHeader, Button, Select, Badge, Modal, Input, DataTable, Pagination } from '../../components/UI'
import { Bus, Plus, Search, MapPin, Download } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function TransportPage() {
    const { user } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [routeFilter, setRouteFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({ roll_number: '', route: '', bus_number: '', pickup_point: '' })

    const routes = [
        { value: 'all', label: 'All Routes' },
        { value: 'Route 1', label: 'Route 1 - Kakinada Town' },
        { value: 'Route 2', label: 'Route 2 - Samalkot' },
        { value: 'Route 3', label: 'Route 3 - Peddapuram' },
        { value: 'Route 4', label: 'Route 4 - Rajahmundry' },
        { value: 'Route 5', label: 'Route 5 - Tuni' },
    ]

    const [transportData, setTransportData] = useState([
        { id: 1, student_name: 'Rajesh Kumar', roll_number: '25371-CM-001', year: 1, route: 'Route 1', bus_number: 'AP-05-AB-1234', pickup_point: 'Main Bus Stand', fee: 12000, paid: true },
        { id: 2, student_name: 'Priya Sharma', roll_number: '25371-CM-002', year: 1, route: 'Route 2', bus_number: 'AP-05-CD-5678', pickup_point: 'Samalkot Junction', fee: 15000, paid: true },
        { id: 3, student_name: 'Sneha Reddy', roll_number: '24371-CM-010', year: 2, route: 'Route 3', bus_number: 'AP-05-EF-9012', pickup_point: 'Peddapuram Center', fee: 18000, paid: false },
        { id: 4, student_name: 'Venkat Rao', roll_number: '24371-CM-011', year: 2, route: 'Route 1', bus_number: 'AP-05-AB-1234', pickup_point: 'RTC Complex', fee: 12000, paid: true },
        { id: 5, student_name: 'Suresh Babu', roll_number: '23371-CM-020', year: 3, route: 'Route 4', bus_number: 'AP-05-GH-3456', pickup_point: 'Rajahmundry Bus Stand', fee: 22000, paid: false },
        { id: 6, student_name: 'Kavitha Nair', roll_number: '23371-CM-021', year: 3, route: 'Route 2', bus_number: 'AP-05-CD-5678', pickup_point: 'Town Hall', fee: 15000, paid: true },
    ])

    const filtered = transportData.filter(t => {
        if (routeFilter !== 'all' && t.route !== routeFilter) return false
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            if (!t.student_name.toLowerCase().includes(q) && !t.roll_number.toLowerCase().includes(q)) return false
        }
        return true
    })

    const totalRegistered = transportData.length
    const paidCount = transportData.filter(t => t.paid).length
    const totalRevenue = transportData.reduce((sum, t) => sum + t.fee, 0)
    const collectedRevenue = transportData.filter(t => t.paid).reduce((sum, t) => sum + t.fee, 0)

    const handleAddTransport = () => {
        const newEntry = {
            id: Date.now(),
            student_name: 'New Student',
            ...formData,
            year: 1,
            fee: 12000,
            paid: false
        }
        setTransportData(prev => [...prev, newEntry])
        setShowAddModal(false)
        setFormData({ roll_number: '', route: '', bus_number: '', pickup_point: '' })
    }

    const exportData = () => {
        const data = filtered.map(t => ({
            'Roll Number': t.roll_number,
            'Name': t.student_name,
            'Route': t.route,
            'Bus Number': t.bus_number,
            'Pickup Point': t.pickup_point,
            'Fee': t.fee,
            'Paid': t.paid ? 'Yes' : 'No'
        }))
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Transport')
        XLSX.writeFile(wb, 'KIET_Transport.xlsx')
    }

    const columns = [
        { key: 'roll_number', label: 'Roll No', render: (val) => <span className="font-mono font-semibold text-primary">{val}</span> },
        { key: 'student_name', label: 'Student', render: (val) => <span className="font-medium">{val}</span> },
        { key: 'route', label: 'Route', render: (val) => <Badge variant="info">{val}</Badge> },
        { key: 'bus_number', label: 'Bus No', render: (val) => <span className="font-mono text-xs">{val}</span> },
        {
            key: 'pickup_point', label: 'Pickup Point', render: (val) => (
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-text-secondary" /><span className="text-sm">{val}</span></div>
            )
        },
        { key: 'fee', label: 'Fee', render: (val) => <span className="font-semibold">₹{val?.toLocaleString()}</span> },
        { key: 'paid', label: 'Status', render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Paid' : 'Unpaid'}</Badge> },
    ]

    const canManage = ['admin', 'management'].includes(user?.role)

    return (
        <div className="animate-fade-in">
            <PageHeader title="Transport Management" subtitle="Bus transport registration and tracking">
                {canManage && (
                    <>
                        <Button variant="secondary" onClick={exportData}><Download className="w-4 h-4" /> Export</Button>
                        <Button variant="primary" onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Register Student</Button>
                    </>
                )}
            </PageHeader>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-card rounded-2xl p-5 border border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                            <Bus className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalRegistered}</p>
                            <p className="text-xs text-text-secondary">Registered</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border">
                    <p className="text-2xl font-bold text-success">{paidCount}</p>
                    <p className="text-xs text-text-secondary">Fees Paid</p>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border">
                    <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-text-secondary">Total Revenue</p>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border">
                    <p className="text-2xl font-bold text-success">₹{collectedRevenue.toLocaleString()}</p>
                    <p className="text-xs text-text-secondary">Collected</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative w-full sm:flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <Select value={routeFilter} onChange={setRouteFilter} options={routes} />
            </div>

            <DataTable columns={columns} data={filtered} emptyMessage="No transport registrations found" />

            {/* Add Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register for Transport">
                <div className="space-y-4">
                    <Input label="Roll Number" value={formData.roll_number} onChange={(e) => setFormData(p => ({ ...p, roll_number: e.target.value }))} placeholder="25371-CM-067" />
                    <Select label="Route" value={formData.route} onChange={(val) => setFormData(p => ({ ...p, route: val }))} options={routes.filter(r => r.value !== 'all')} />
                    <Input label="Bus Number" value={formData.bus_number} onChange={(e) => setFormData(p => ({ ...p, bus_number: e.target.value }))} placeholder="AP-05-AB-1234" />
                    <Input label="Pickup Point" value={formData.pickup_point} onChange={(e) => setFormData(p => ({ ...p, pickup_point: e.target.value }))} placeholder="Enter pickup location" />
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAddTransport}>Register</Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
