import { useState } from 'react'
import { PageHeader, Button, Input, Select } from '../../components/UI'
import { Settings, Save, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
    const [saved, setSaved] = useState(false)
    const [config, setConfig] = useState({
        collegeName: 'Kakinada Institute of Engineering and Technology',
        shortName: 'KIET',
        location: 'Korangi, Kakinada, Andhra Pradesh',
        collegeCode: '371',
        branchCode: 'CM',
        academicYear: '2025-2026',
        feeAmount: '35000',
        transportFee: '12000',
        maxStudentsPerYear: '1000',
    })

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <div className="animate-fade-in max-w-3xl">
            <PageHeader title="System Settings" subtitle="Configure college and system parameters">
                <Button variant="primary" onClick={handleSave}>
                    <Save className="w-4 h-4" /> Save Settings
                </Button>
            </PageHeader>

            <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" /> College Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="College Name" value={config.collegeName} onChange={(e) => setConfig(p => ({ ...p, collegeName: e.target.value }))} className="md:col-span-2" />
                        <Input label="Short Name" value={config.shortName} onChange={(e) => setConfig(p => ({ ...p, shortName: e.target.value }))} />
                        <Input label="Location" value={config.location} onChange={(e) => setConfig(p => ({ ...p, location: e.target.value }))} />
                        <Input label="College Code" value={config.collegeCode} onChange={(e) => setConfig(p => ({ ...p, collegeCode: e.target.value }))} />
                        <Input label="Branch Code" value={config.branchCode} onChange={(e) => setConfig(p => ({ ...p, branchCode: e.target.value }))} />
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-accent" /> Academic Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Academic Year" value={config.academicYear} onChange={(e) => setConfig(p => ({ ...p, academicYear: e.target.value }))} />
                        <Input label="Max Students per Year" type="number" value={config.maxStudentsPerYear} onChange={(e) => setConfig(p => ({ ...p, maxStudentsPerYear: e.target.value }))} />
                    </div>
                </div>

                <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-success" /> Fee Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="College Fee (₹)" type="number" value={config.feeAmount} onChange={(e) => setConfig(p => ({ ...p, feeAmount: e.target.value }))} />
                        <Input label="Transport Fee (₹)" type="number" value={config.transportFee} onChange={(e) => setConfig(p => ({ ...p, transportFee: e.target.value }))} />
                    </div>
                </div>
            </div>

            {saved && (
                <div className="fixed bottom-6 right-6 bg-success text-white px-6 py-3 rounded-xl shadow-lg animate-slide-left flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Settings saved!
                </div>
            )}
        </div>
    )
}
