import { useState } from 'react'
import { PageHeader, Button, Select } from '../../components/UI'
import { FileSpreadsheet, Download, Users, UserCheck, DollarSign, FileText } from 'lucide-react'
import * as XLSX from 'xlsx'

export default function ReportsPage() {
    const [generating, setGenerating] = useState(null)

    const reports = [
        { id: 'students', title: 'Student List Report', description: 'Complete list of all students with details', icon: Users, color: 'primary' },
        { id: 'attendance', title: 'Attendance Report', description: 'Monthly attendance summary by year', icon: UserCheck, color: 'success' },
        { id: 'fees', title: 'Fee Collection Report', description: 'Fee payment status of all students', icon: DollarSign, color: 'accent' },
        { id: 'performance', title: 'Performance Report', description: 'Internal marks and academic performance', icon: FileText, color: 'warning' },
    ]

    const generateReport = (reportId) => {
        setGenerating(reportId)
        setTimeout(() => {
            const data = {
                students: [{ 'Roll Number': '25371-CM-001', 'Name': 'Rajesh Kumar', 'Year': 1, 'Branch': 'CME', 'Phone': '9876543210' }],
                attendance: [{ 'Roll Number': '25371-CM-001', 'Name': 'Rajesh Kumar', 'Present Days': 125, 'Absent Days': 15, 'Percentage': '89%' }],
                fees: [{ 'Roll Number': '25371-CM-001', 'Name': 'Rajesh Kumar', 'Total Fee': 35000, 'Paid': 35000, 'Pending': 0, 'Status': 'Paid' }],
                performance: [{ 'Roll Number': '25371-CM-001', 'Name': 'Rajesh Kumar', 'Mid1': 38, 'Mid2': 42, 'Mid3': 40, 'Assignments': 18, 'Total': 138, 'Grade': 'A' }],
            }

            const ws = XLSX.utils.json_to_sheet(data[reportId] || [])
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'Report')
            XLSX.writeFile(wb, `KIET_${reportId}_report.xlsx`)
            setGenerating(null)
        }, 1000)
    }

    return (
        <div className="animate-fade-in">
            <PageHeader title="Reports" subtitle="Generate and download reports" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reports.map(report => {
                    const colorMap = { primary: 'bg-primary/10 text-primary', success: 'bg-success/10 text-success', accent: 'bg-accent/10 text-accent', warning: 'bg-warning/10 text-warning' }
                    return (
                        <div key={report.id} className="bg-card rounded-2xl border border-border p-6 card-hover">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[report.color]}`}>
                                    <report.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-text-primary">{report.title}</h3>
                                    <p className="text-sm text-text-secondary mt-1">{report.description}</p>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="mt-3"
                                        onClick={() => generateReport(report.id)}
                                        disabled={generating === report.id}
                                    >
                                        <Download className="w-4 h-4" />
                                        {generating === report.id ? 'Generating...' : 'Download'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
