export const STATUS_COLORS = {
    WISHLIST: 'bg-gray-100 text-gray-700 border-gray-200',
    APPLIED: 'bg-blue-50 text-blue-700 border-blue-200',
    SCREENING: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    INTERVIEW: 'bg-purple-50 text-purple-700 border-purple-200 ring-4 ring-purple-500/10',
    OFFER: 'bg-green-50 text-green-700 border-green-200 shadow-green-100',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    GHOSTED: 'bg-slate-100 text-slate-500 border-slate-200 grayscale',
};

export function StatusBadge(status) {
    const colorClasses = STATUS_COLORS[status] || STATUS_COLORS.WISHLIST;
    return `
        <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} inline-flex items-center gap-1.5 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
            ${status}
        </span>
    `;
}
