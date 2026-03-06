import { TrendingUp, TrendingDown } from 'lucide-react'

export function StatCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'primary', className = '' }) {
    const colorMap = {
        primary: { bg: 'bg-primary/10', icon: 'text-primary', ring: 'ring-primary/20' },
        accent: { bg: 'bg-accent/10', icon: 'text-accent', ring: 'ring-accent/20' },
        success: { bg: 'bg-success/10', icon: 'text-success', ring: 'ring-success/20' },
        warning: { bg: 'bg-warning/10', icon: 'text-warning', ring: 'ring-warning/20' },
        danger: { bg: 'bg-danger/10', icon: 'text-danger', ring: 'ring-danger/20' },
        info: { bg: 'bg-info/10', icon: 'text-info', ring: 'ring-info/20' },
    }

    const colors = colorMap[color] || colorMap.primary

    return (
        <div className={`bg-card rounded-2xl p-5 border border-border card-hover ${className}`}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-text-secondary font-medium">{title}</p>
                    <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-text-secondary mt-1">{subtitle}</p>}
                    {trend && trendValue && (
                        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {trendValue}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ring-1 ${colors.ring}`}>
                        <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                )}
            </div>
        </div>
    )
}

export function PageHeader({ title, subtitle, children }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
                {subtitle && <p className="text-sm text-text-secondary mt-1">{subtitle}</p>}
            </div>
            {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
        </div>
    )
}

export function DataTable({ columns, data, loading, emptyMessage = 'No data found', onRowClick }) {
    if (loading) {
        return (
            <div className="table-container bg-card overflow-x-auto rounded-2xl border border-border">
                <div className="animate-pulse p-6 space-y-4 min-w-[600px]">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-6">
                            {columns.map((_, j) => (
                                <div key={j} className="h-4 bg-gray-200 rounded flex-1"></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (!data?.length) {
        return (
            <div className="table-container bg-card p-12 text-center rounded-2xl border border-border">
                <p className="text-text-secondary">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="table-container bg-card overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="border-b border-border">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap"
                                style={{ width: col.width }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.map((row, idx) => (
                        <tr
                            key={row.id || idx}
                            className={`hover:bg-bg/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            onClick={() => onRowClick?.(row)}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 text-sm text-text-primary whitespace-nowrap">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-1 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Previous
            </button>
            {start > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className="w-8 h-8 rounded-lg text-sm hover:bg-bg transition-colors">1</button>
                    {start > 2 && <span className="px-1 text-gray-400">...</span>}
                </>
            )}
            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-8 h-8 rounded-lg text-sm transition-colors font-medium ${p === currentPage ? 'bg-primary text-white' : 'hover:bg-bg'}`}
                >
                    {p}
                </button>
            ))}
            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
                    <button onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-lg text-sm hover:bg-bg transition-colors">{totalPages}</button>
                </>
            )}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border border-border hover:bg-bg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
                Next
            </button>
        </div>
    )
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
    if (!isOpen) return null

    const sizeMap = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-card rounded-2xl shadow-2xl w-full ${sizeMap[size]} max-h-[90vh] overflow-y-auto animate-scale-in`}>
                <div className="sticky top-0 bg-card px-6 py-4 border-b border-border rounded-t-2xl flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-bg flex items-center justify-center transition-colors text-text-secondary">✕</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    )
}

export function Badge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        danger: 'bg-red-100 text-red-700',
        warning: 'bg-yellow-100 text-yellow-700',
        info: 'bg-blue-100 text-blue-700',
        primary: 'bg-primary/10 text-primary'
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    )
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
    const variants = {
        primary: 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20',
        secondary: 'bg-white border border-border hover:bg-bg text-text-primary',
        accent: 'bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/20',
        danger: 'bg-danger hover:bg-red-700 text-white shadow-lg shadow-danger/20',
        ghost: 'hover:bg-bg text-text-secondary hover:text-text-primary'
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    }

    return (
        <button
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0 ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}

export function Select({ label, value, onChange, options, className = '' }) {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}

export function Input({ label, className = '', ...props }) {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>}
            <input
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                {...props}
            />
        </div>
    )
}

export function Textarea({ label, className = '', ...props }) {
    return (
        <div className={className}>
            {label && <label className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>}
            <textarea
                className="w-full px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                rows={4}
                {...props}
            />
        </div>
    )
}

export function LoadingSpinner({ size = 'md' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    return (
        <div className="flex items-center justify-center p-8">
            <svg className={`animate-spin ${sizes[size]} text-primary`} viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
        </div>
    )
}
