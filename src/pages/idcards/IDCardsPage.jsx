import { useState, useRef } from 'react'
import { PageHeader, Button, Select, Input, Badge } from '../../components/UI'
import { IdCard, Download, Printer, Search, Bus } from 'lucide-react'

export default function IDCardsPage() {
    const [cardType, setCardType] = useState('student')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStudent, setSelectedStudent] = useState(null)
    const printRef = useRef()

    const students = [
        { id: 1, name: 'Rajesh Kumar', roll_number: '25371-CM-001', year: 1, branch: 'CME', phone: '9876543210', bus_route: 'Route 1', bus_number: 'AP-05-AB-1234', pickup: 'Main Bus Stand' },
        { id: 2, name: 'Priya Sharma', roll_number: '25371-CM-002', year: 1, branch: 'CME', phone: '9876543211', bus_route: 'Route 2', bus_number: 'AP-05-CD-5678', pickup: 'Samalkot Junction' },
        { id: 3, name: 'Sneha Reddy', roll_number: '24371-CM-010', year: 2, branch: 'CME', phone: '9876543213', bus_route: 'Route 3', bus_number: 'AP-05-EF-9012', pickup: 'Peddapuram Center' },
    ]

    const filtered = students.filter(s => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return s.name.toLowerCase().includes(q) || s.roll_number.toLowerCase().includes(q)
    })

    const handlePrint = () => {
        const content = printRef.current
        if (!content) return
        const printWindow = window.open('', '', 'height=600,width=400')
        printWindow.document.write('<html><head><title>ID Card</title><style>body{font-family:Inter,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5}@media print{body{background:white}}</style></head><body>')
        printWindow.document.write(content.innerHTML)
        printWindow.document.write('</body></html>')
        printWindow.document.close()
        printWindow.print()
    }

    return (
        <div className="animate-fade-in">
            <PageHeader title="ID Card Generator" subtitle="Generate student ID cards and bus transport cards">
                {selectedStudent && (
                    <Button variant="primary" onClick={handlePrint}>
                        <Printer className="w-4 h-4" /> Print Card
                    </Button>
                )}
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Student Selection */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-2xl border border-border p-5">
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setCardType('student')}
                                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${cardType === 'student' ? 'bg-primary text-white' : 'bg-bg text-text-secondary'}`}
                            >
                                <IdCard className="w-4 h-4 inline mr-1" /> Student ID
                            </button>
                            <button
                                onClick={() => setCardType('bus')}
                                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${cardType === 'bus' ? 'bg-primary text-white' : 'bg-bg text-text-secondary'}`}
                            >
                                <Bus className="w-4 h-4 inline mr-1" /> Bus Card
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search student..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filtered.map(student => (
                                <button
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`w-full text-left p-3 rounded-xl transition-all ${selectedStudent?.id === student.id ? 'bg-primary/10 border-primary/30 border' : 'hover:bg-bg border border-transparent'}`}
                                >
                                    <p className="text-sm font-medium">{student.name}</p>
                                    <p className="text-xs text-text-secondary font-mono">{student.roll_number}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Card Preview */}
                <div className="lg:col-span-2">
                    {selectedStudent ? (
                        <div ref={printRef}>
                            {cardType === 'student' ? (
                                /* Student ID Card */
                                <div className="max-w-sm mx-auto">
                                    <div className="bg-gradient-to-br from-[#1A1A2E] to-[#0F3460] rounded-2xl overflow-hidden shadow-2xl">
                                        {/* Header */}
                                        <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 text-center">
                                            <h3 className="text-white font-bold text-sm tracking-wide">KAKINADA INSTITUTE OF ENGINEERING & TECHNOLOGY</h3>
                                            <p className="text-white/80 text-xs mt-0.5">Korangi, Kakinada, Andhra Pradesh</p>
                                            <p className="text-white/60 text-xs">DIPLOMA STUDENT IDENTITY CARD</p>
                                        </div>
                                        {/* Body */}
                                        <div className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-20 h-24 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-3xl font-bold text-white/30">{selectedStudent.name.charAt(0)}</span>
                                                </div>
                                                <div className="text-white space-y-2">
                                                    <div>
                                                        <p className="text-xs text-white/50">NAME</p>
                                                        <p className="font-bold text-lg">{selectedStudent.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-white/50">ROLL NUMBER</p>
                                                        <p className="font-mono font-bold text-primary-light">{selectedStudent.roll_number}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                <div>
                                                    <p className="text-xs text-white/50">BRANCH</p>
                                                    <p className="text-white text-sm font-medium">{selectedStudent.branch}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/50">YEAR</p>
                                                    <p className="text-white text-sm font-medium">{selectedStudent.year === 1 ? '1st' : selectedStudent.year === 2 ? '2nd' : '3rd'} Year</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/50">PHONE</p>
                                                    <p className="text-white text-sm font-medium">{selectedStudent.phone}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/50">VALID TILL</p>
                                                    <p className="text-white text-sm font-medium">March 2027</p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Footer */}
                                        <div className="bg-white/5 px-6 py-3 text-center border-t border-white/10">
                                            <p className="text-white/40 text-xs">This card is property of KIET. If found, please return to college office.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Bus Transport Card */
                                <div className="max-w-sm mx-auto">
                                    <div className="bg-gradient-to-br from-accent-dark to-accent rounded-2xl overflow-hidden shadow-2xl">
                                        <div className="bg-white/10 px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Bus className="w-5 h-5 text-white" />
                                                <h3 className="text-white font-bold text-sm">KIET BUS TRANSPORT CARD</h3>
                                            </div>
                                            <p className="text-white/60 text-xs mt-1">Academic Year 2025-2026</p>
                                        </div>
                                        <div className="p-6 text-white space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-20 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-2xl font-bold text-white/30">{selectedStudent.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-lg">{selectedStudent.name}</p>
                                                    <p className="font-mono text-white/70">{selectedStudent.roll_number}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 bg-white/10 rounded-xl">
                                                    <p className="text-xs text-white/50">ROUTE</p>
                                                    <p className="font-semibold">{selectedStudent.bus_route}</p>
                                                </div>
                                                <div className="p-3 bg-white/10 rounded-xl">
                                                    <p className="text-xs text-white/50">BUS NO</p>
                                                    <p className="font-semibold text-sm">{selectedStudent.bus_number}</p>
                                                </div>
                                                <div className="p-3 bg-white/10 rounded-xl col-span-2">
                                                    <p className="text-xs text-white/50">PICKUP POINT</p>
                                                    <p className="font-semibold">{selectedStudent.pickup}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 px-6 py-3 text-center border-t border-white/10">
                                            <p className="text-white/40 text-xs">Valid for the current academic year only</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl border border-border p-12 text-center">
                            <IdCard className="w-12 h-12 text-text-secondary mx-auto mb-3 opacity-30" />
                            <p className="text-text-secondary">Select a student to preview their {cardType === 'student' ? 'ID' : 'bus transport'} card</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
