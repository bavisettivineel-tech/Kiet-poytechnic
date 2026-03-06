import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { PageHeader, Button, Modal, Input, Select, Badge, DataTable } from '../../components/UI'
import { UserPlus, Shield, GraduationCap, Users, Edit2, Trash2 } from 'lucide-react'

export default function StaffPage() {
    const { user } = useAuth()
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({
        name: '', login_id: '', password: '', role: 'ctpos', assigned_year: '1'
    })
    const [formError, setFormError] = useState('')

    const [staff, setStaff] = useState([
        { id: 1, name: 'Dr. Ramesh Kumar', login_id: 'ramesh.ctpos', role: 'ctpos', assigned_year: 1, status: 'active', created_at: '2026-01-10' },
        { id: 2, name: 'Prof. Lakshmi Devi', login_id: 'lakshmi.ctpos', role: 'ctpos', assigned_year: 2, status: 'active', created_at: '2026-01-10' },
        { id: 3, name: 'Dr. Suresh Babu', login_id: 'suresh.ctpos', role: 'ctpos', assigned_year: 3, status: 'active', created_at: '2026-01-10' },
        { id: 4, name: 'Mrs. Anitha Staff', login_id: 'anitha.staff', role: 'administrative_staff', assigned_year: null, status: 'active', created_at: '2026-01-15' },
        { id: 5, name: 'Mr. Kiran Kumar', login_id: 'kiran.staff', role: 'administrative_staff', assigned_year: null, status: 'active', created_at: '2026-02-01' },
    ])

    const handleAddStaff = async () => {
        setFormError('')
        if (!formData.name.trim() || !formData.login_id.trim() || !formData.password.trim()) {
            setFormError('All fields are required')
            return
        }

        // Check duplicate login_id
        if (staff.some(s => s.login_id === formData.login_id)) {
            setFormError('Login ID already exists')
            return
        }

        try {
            const { error } = await supabase.from('staff').insert({
                name: formData.name,
                login_id: formData.login_id,
                password_hash: formData.password,
                role: formData.role,
                assigned_year: formData.role === 'ctpos' ? parseInt(formData.assigned_year) : null,
                status: 'active'
            })
            if (error) throw error
        } catch {
            // Demo mode
        }

        const newStaff = {
            id: Date.now(),
            name: formData.name,
            login_id: formData.login_id,
            role: formData.role,
            assigned_year: formData.role === 'ctpos' ? parseInt(formData.assigned_year) : null,
            status: 'active',
            created_at: new Date().toISOString().split('T')[0]
        }
        setStaff(prev => [...prev, newStaff])
        setShowAddModal(false)
        setFormData({ name: '', login_id: '', password: '', role: 'ctpos', assigned_year: '1' })
    }

    const deleteStaff = (id) => {
        if (window.confirm('Are you sure you want to remove this staff member?')) {
            setStaff(prev => prev.filter(s => s.id !== id))
        }
    }

    const roleIcons = {
        ctpos: GraduationCap,
        administrative_staff: Shield
    }

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (val, row) => {
                const Icon = roleIcons[row.role] || Users
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${row.role === 'ctpos' ? 'bg-info/10' : 'bg-success/10'}`}>
                            <Icon className={`w-5 h-5 ${row.role === 'ctpos' ? 'text-info' : 'text-success'}`} />
                        </div>
                        <div>
                            <p className="font-medium text-text-primary">{val}</p>
                            <p className="text-xs text-text-secondary">{row.login_id}</p>
                        </div>
                    </div>
                )
            }
        },
        {
            key: 'role',
            label: 'Role',
            render: (val) => (
                <Badge variant={val === 'ctpos' ? 'info' : 'success'}>
                    {val === 'ctpos' ? 'CTPOS (Faculty)' : 'Admin Staff'}
                </Badge>
            )
        },
        {
            key: 'assigned_year',
            label: 'Assigned Year',
            render: (val, row) => row.role === 'ctpos' ? (
                <Badge variant="primary">{val === 1 ? '1st' : val === 2 ? '2nd' : '3rd'} Year CME</Badge>
            ) : (
                <span className="text-gray-400">—</span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (val) => <Badge variant={val === 'active' ? 'success' : 'danger'}>{val}</Badge>
        },
        { key: 'created_at', label: 'Added', render: (val) => <span className="text-sm text-text-secondary">{val}</span> },
        {
            key: 'actions',
            label: '',
            render: (_, row) => (
                <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-danger/10 text-danger transition-colors" onClick={() => deleteStaff(row.id)}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="animate-fade-in">
            <PageHeader title="Staff Management" subtitle="Manage CTPOS faculty and administrative staff accounts">
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                    <UserPlus className="w-4 h-4" /> Add Staff
                </Button>
            </PageHeader>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-card rounded-2xl p-5 border border-border">
                    <p className="text-sm text-text-secondary">Total Staff</p>
                    <p className="text-3xl font-bold mt-1">{staff.length}</p>
                </div>
                <div className="bg-info/5 rounded-2xl p-5 border border-info/20">
                    <p className="text-sm text-text-secondary">CTPOS Faculty</p>
                    <p className="text-3xl font-bold text-info mt-1">{staff.filter(s => s.role === 'ctpos').length}</p>
                </div>
                <div className="bg-success/5 rounded-2xl p-5 border border-success/20">
                    <p className="text-sm text-text-secondary">Admin Staff</p>
                    <p className="text-3xl font-bold text-success mt-1">{staff.filter(s => s.role === 'administrative_staff').length}</p>
                </div>
            </div>

            <DataTable columns={columns} data={staff} emptyMessage="No staff members added yet" />

            {/* Add Staff Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Staff Member">
                <div className="space-y-4">
                    {formError && (
                        <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 text-red-600 text-sm">{formError}</div>
                    )}
                    <Input label="Full Name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Ramesh Kumar" />
                    <Input label="Login ID" value={formData.login_id} onChange={(e) => setFormData(p => ({ ...p, login_id: e.target.value }))} placeholder="ramesh.ctpos" />
                    <Input label="Password" type="password" value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} placeholder="Set initial password" />
                    <Select
                        label="Role"
                        value={formData.role}
                        onChange={(val) => setFormData(p => ({ ...p, role: val }))}
                        options={[
                            { value: 'ctpos', label: 'CTPOS (Faculty)' },
                            { value: 'administrative_staff', label: 'Administrative Staff' },
                        ]}
                    />
                    {formData.role === 'ctpos' && (
                        <Select
                            label="Assign to Year"
                            value={formData.assigned_year}
                            onChange={(val) => setFormData(p => ({ ...p, assigned_year: val }))}
                            options={[
                                { value: '1', label: '1st Year CME' },
                                { value: '2', label: '2nd Year CME' },
                                { value: '3', label: '3rd Year CME' },
                            ]}
                        />
                    )}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handleAddStaff}>
                            <UserPlus className="w-4 h-4" /> Create Account
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
