const colors: Record<string, string> = {
    draft: 'bg-[#eadfc8] text-[#5c6579]',
    pending_review: 'bg-[#f0d99a] text-[#14234a]',
    pending: 'bg-[#f0d99a] text-[#14234a]',
    approved: 'bg-[#dff3ee] text-[#1e7c89]',
    published: 'bg-[#dff3ee] text-[#1e7c89]',
    subscribed: 'bg-[#dff3ee] text-[#1e7c89]',
    rejected: 'bg-[#fdeeee] text-[#cf2f3b]',
    suspended: 'bg-[#fdeeee] text-[#cf2f3b]',
    unsubscribed: 'bg-[#fdeeee] text-[#cf2f3b]',
    sent: 'bg-[#dff3ee] text-[#1e7c89]',
    scheduled: 'bg-[#f0d99a] text-[#14234a]',
    sending: 'bg-[#f0d99a] text-[#14234a]',
    failed: 'bg-[#fdeeee] text-[#cf2f3b]',
};

export default function StatusBadge({ status }: { status: string }) {
    return (
        <span className={`px-2.5 py-1 text-xs font-black uppercase tracking-[0.1em] ${colors[status] ?? 'bg-[#eadfc8] text-[#5c6579]'}`}>
            {status.replace('_', ' ')}
        </span>
    );
}
