import { useAuth } from '../../contexts/AuthContext'
import { PageHeader, Badge } from '../../components/UI'
import { DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export default function MyFeesPage() {
    const { user } = useAuth()

    const fees = {
        tuition: { label: 'Tuition Fee', amount: 25000, paid: 25000 },
        lab: { label: 'Lab Fee', amount: 5000, paid: 5000 },
        library: { label: 'Library Fee', amount: 2000, paid: 0 },
        exam: { label: 'Exam Fee', amount: 3000, paid: 3000 },
    }

    const totalFee = Object.values(fees).reduce((sum, f) => sum + f.amount, 0)
    const totalPaid = Object.values(fees).reduce((sum, f) => sum + f.paid, 0)
    const totalPending = totalFee - totalPaid

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <PageHeader title="Fee Status" subtitle="View your fee payment details" />

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-card rounded-2xl border border-border p-5 text-center">
                    <p className="text-sm text-text-secondary">Total Fee</p>
                    <p className="text-xl font-bold">₹{totalFee.toLocaleString()}</p>
                </div>
                <div className="bg-success/5 rounded-2xl border border-success/20 p-5 text-center">
                    <p className="text-sm text-text-secondary">Paid</p>
                    <p className="text-xl font-bold text-success">₹{totalPaid.toLocaleString()}</p>
                </div>
                <div className={`${totalPending > 0 ? 'bg-danger/5 border-danger/20' : 'bg-success/5 border-success/20'} rounded-2xl border p-5 text-center`}>
                    <p className="text-sm text-text-secondary">Pending</p>
                    <p className={`text-xl font-bold ${totalPending > 0 ? 'text-danger' : 'text-success'}`}>
                        ₹{totalPending.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="bg-card rounded-2xl border border-border p-5 mb-6">
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-text-secondary">Payment Progress</span>
                    <span className="text-sm font-bold">{Math.round((totalPaid / totalFee) * 100)}%</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000"
                        style={{ width: `${(totalPaid / totalFee) * 100}%` }}
                    />
                </div>
            </div>

            {/* Fee Breakdown */}
            <div className="space-y-3">
                {Object.entries(fees).map(([key, fee]) => {
                    const isPaid = fee.paid >= fee.amount
                    const isPartial = fee.paid > 0 && fee.paid < fee.amount
                    return (
                        <div key={key} className={`bg-card rounded-2xl border p-5 ${isPaid ? 'border-success/20' : 'border-border'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isPaid ? <CheckCircle2 className="w-5 h-5 text-success" /> : <Clock className="w-5 h-5 text-warning" />}
                                    <div>
                                        <p className="font-medium">{fee.label}</p>
                                        <p className="text-xs text-text-secondary">Amount: ₹{fee.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant={isPaid ? 'success' : isPartial ? 'warning' : 'danger'}>
                                        {isPaid ? '✓ Paid' : isPartial ? `₹${(fee.amount - fee.paid).toLocaleString()} due` : 'Unpaid'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
