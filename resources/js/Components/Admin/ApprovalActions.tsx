import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function ApprovalActions({ approveUrl, rejectUrl }: { approveUrl: string; rejectUrl: string }) {
    const [showReject, setShowReject] = useState(false);
    const [reason, setReason] = useState('');

    const approve = () => {
        router.post(approveUrl, {}, { preserveScroll: true });
    };

    const reject = () => {
        router.post(rejectUrl, { rejection_reason: reason }, { preserveScroll: true, onSuccess: () => setShowReject(false) });
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={approve}
                    className="bg-[#1e7c89] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-white"
                >
                    Approve
                </button>
                <button
                    type="button"
                    onClick={() => setShowReject((value) => !value)}
                    className="border border-[#cf2f3b] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-[#cf2f3b]"
                >
                    Reject
                </button>
            </div>
            {showReject && (
                <div className="grid gap-2 border border-[#d7c8a9] bg-[#fbf8f0] p-3">
                    <textarea
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Reason for rejection"
                        className="w-64 border-[#d7c8a9] bg-white text-sm"
                    />
                    <button
                        type="button"
                        onClick={reject}
                        disabled={!reason}
                        className="bg-[#cf2f3b] px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] text-white disabled:opacity-50"
                    >
                        Confirm rejection
                    </button>
                </div>
            )}
        </div>
    );
}
