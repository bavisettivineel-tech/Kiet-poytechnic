import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { PageHeader, Button, Modal, Input, Textarea, Badge } from '../../components/UI'
import { Bell, Plus, Pin, Clock, Megaphone, Calendar, AlertTriangle, Info } from 'lucide-react'

export default function NoticesPage() {
    const { user } = useAuth()
    const [showAddModal, setShowAddModal] = useState(false)
    const [formData, setFormData] = useState({ title: '', content: '', priority: 'normal', target: 'all' })

    const [notices, setNotices] = useState([
        {
            id: 1, title: 'Mid-Term Examination Schedule Released',
            content: 'The mid-term examination for all years will commence from March 15th, 2026. Students are advised to collect their hall tickets from the exam section. Timetable has been uploaded on the notice board.',
            priority: 'high', posted_by: 'Admin', role: 'admin',
            target: 'all', created_at: '2026-03-05T10:00:00', pinned: true
        },
        {
            id: 2, title: 'Fee Payment Deadline Extended',
            content: 'The last date for fee payment has been extended to March 20th, 2026. Students with pending fees are requested to clear their dues immediately to avoid late fees.',
            priority: 'urgent', posted_by: 'Management', role: 'management',
            target: 'all', created_at: '2026-03-04T14:30:00', pinned: true
        },
        {
            id: 3, title: 'Workshop on Python Programming',
            content: 'A 2-day workshop on Python Programming will be held on March 10-11, 2026 in Seminar Hall. All 2nd year CME students are encouraged to attend. Certificate will be provided.',
            priority: 'normal', posted_by: 'CTPOS', role: 'ctpos',
            target: '2nd Year', created_at: '2026-03-03T09:00:00', pinned: false
        },
        {
            id: 4, title: 'Sports Day Celebrations',
            content: 'Annual Sports Day will be celebrated on March 25th, 2026. Students interested in participating can register at the Physical Education department before March 18th.',
            priority: 'normal', posted_by: 'Admin', role: 'admin',
            target: 'all', created_at: '2026-03-02T11:00:00', pinned: false
        },
        {
            id: 5, title: 'Library Book Return Notice',
            content: 'All students are requested to return library books borrowed this semester before March 30th, 2026. Failure to return will result in a fine.',
            priority: 'low', posted_by: 'Admin Staff', role: 'administrative_staff',
            target: 'all', created_at: '2026-03-01T08:00:00', pinned: false
        },
    ])

    const handlePost = () => {
        if (!formData.title.trim() || !formData.content.trim()) return
        const newNotice = {
            id: Date.now(),
            ...formData,
            posted_by: user?.name,
            role: user?.role,
            created_at: new Date().toISOString(),
            pinned: false
        }
        setNotices(prev => [newNotice, ...prev])
        setShowAddModal(false)
        setFormData({ title: '', content: '', priority: 'normal', target: 'all' })
    }

    const togglePin = (id) => {
        setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
    }

    const priorityConfig = {
        urgent: { color: 'bg-danger/10 border-danger/30', badge: 'danger', icon: AlertTriangle, label: 'Urgent' },
        high: { color: 'bg-warning/10 border-warning/30', badge: 'warning', icon: Megaphone, label: 'Important' },
        normal: { color: 'bg-card border-border', badge: 'info', icon: Info, label: 'Normal' },
        low: { color: 'bg-bg border-border', badge: 'default', icon: Bell, label: 'Low' },
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now - date
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffHours < 1) return 'Just now'
        if (diffHours < 24) return `${diffHours} hours ago`
        if (diffDays < 7) return `${diffDays} days ago`
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }

    const canPost = ['admin', 'management', 'ctpos'].includes(user?.role)
    const sortedNotices = [...notices].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.created_at) - new Date(a.created_at)
    })

    return (
        <div className="animate-fade-in">
            <PageHeader title="Notices & Announcements" subtitle="Stay updated with latest college information">
                {canPost && (
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4" /> Post Notice
                    </Button>
                )}
            </PageHeader>

            {/* Notice List */}
            <div className="space-y-4 max-w-3xl">
                {sortedNotices.map((notice) => {
                    const config = priorityConfig[notice.priority]
                    const Icon = config.icon

                    return (
                        <div
                            key={notice.id}
                            className={`rounded-2xl border p-5 transition-all hover:shadow-md ${config.color} ${notice.pinned ? 'ring-2 ring-primary/20' : ''}`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notice.priority === 'urgent' ? 'bg-danger/20' : notice.priority === 'high' ? 'bg-warning/20' : 'bg-accent/10'}`}>
                                        <Icon className={`w-5 h-5 ${notice.priority === 'urgent' ? 'text-danger' : notice.priority === 'high' ? 'text-warning' : 'text-accent'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            {notice.pinned && (
                                                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                                                    <Pin className="w-3 h-3" /> Pinned
                                                </span>
                                            )}
                                            <Badge variant={config.badge}>{config.label}</Badge>
                                            {notice.target !== 'all' && <Badge variant="info">{notice.target}</Badge>}
                                        </div>
                                        <h3 className="text-lg font-semibold text-text-primary mb-2">{notice.title}</h3>
                                        <p className="text-sm text-text-secondary leading-relaxed">{notice.content}</p>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {formatDate(notice.created_at)}
                                            </span>
                                            <span>by {notice.posted_by}</span>
                                        </div>
                                    </div>
                                </div>
                                {canPost && (
                                    <button
                                        onClick={() => togglePin(notice.id)}
                                        className={`p-2 rounded-lg transition-colors ${notice.pinned ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-primary/5'}`}
                                    >
                                        <Pin className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Post Notice Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Post New Notice">
                <div className="space-y-4">
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                        placeholder="Notice title"
                    />
                    <Textarea
                        label="Content"
                        value={formData.content}
                        onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                        placeholder="Write your notice content here..."
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData(p => ({ ...p, priority: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">Important</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Target Audience</label>
                            <select
                                value={formData.target}
                                onChange={(e) => setFormData(p => ({ ...p, target: e.target.value }))}
                                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            >
                                <option value="all">All Students</option>
                                <option value="1st Year">1st Year Only</option>
                                <option value="2nd Year">2nd Year Only</option>
                                <option value="3rd Year">3rd Year Only</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
                        <Button variant="primary" onClick={handlePost}>
                            <Megaphone className="w-4 h-4" /> Post Notice
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
