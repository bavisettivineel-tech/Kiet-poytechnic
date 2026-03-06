import { PageHeader, Badge } from '../../components/UI'
import { BookOpen } from 'lucide-react'

export default function MyMarksPage() {
    const marks = {
        mid1: 38,
        mid2: 42,
        mid3: 40,
        assignments: 18,
    }
    const total = marks.mid1 + marks.mid2 + marks.mid3 + marks.assignments
    const maxTotal = 170
    const percentage = Math.round((total / maxTotal) * 100)

    const getGrade = (pct) => {
        if (pct >= 90) return { grade: 'A+', color: 'text-success', bg: 'bg-success/10' }
        if (pct >= 80) return { grade: 'A', color: 'text-success', bg: 'bg-success/10' }
        if (pct >= 70) return { grade: 'B+', color: 'text-accent', bg: 'bg-accent/10' }
        if (pct >= 60) return { grade: 'B', color: 'text-accent', bg: 'bg-accent/10' }
        if (pct >= 50) return { grade: 'C', color: 'text-warning', bg: 'bg-warning/10' }
        return { grade: 'F', color: 'text-danger', bg: 'bg-danger/10' }
    }

    const { grade, color, bg } = getGrade(percentage)

    const markItems = [
        { label: 'Mid-Term 1', value: marks.mid1, max: 50, icon: '📝' },
        { label: 'Mid-Term 2', value: marks.mid2, max: 50, icon: '📝' },
        { label: 'Mid-Term 3', value: marks.mid3, max: 50, icon: '📝' },
        { label: 'Assignments', value: marks.assignments, max: 20, icon: '📋' },
    ]

    return (
        <div className="animate-fade-in max-w-2xl mx-auto">
            <PageHeader title="My Internal Marks" subtitle="View your mid-term and assignment marks" />

            {/* Grade Card */}
            <div className={`${bg} rounded-2xl p-6 mb-6 text-center border border-border`}>
                <p className="text-sm text-text-secondary mb-1">Overall Grade</p>
                <p className={`text-6xl font-black ${color}`}>{grade}</p>
                <p className="text-lg font-semibold mt-2">{total}/{maxTotal} ({percentage}%)</p>
            </div>

            {/* Marks Breakdown */}
            <div className="space-y-4">
                {markItems.map(item => {
                    const pct = Math.round((item.value / item.max) * 100)
                    return (
                        <div key={item.label} className="bg-card rounded-2xl border border-border p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-semibold text-text-primary">{item.label}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold">{item.value}</span>
                                    <span className="text-text-secondary">/{item.max}</span>
                                </div>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${pct >= 70 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-danger'}`}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <p className="text-xs text-text-secondary mt-1 text-right">{pct}%</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
