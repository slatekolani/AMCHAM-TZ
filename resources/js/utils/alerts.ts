import { router } from '@inertiajs/react';
import Swal from 'sweetalert2';

export async function confirmAction(title: string, text: string, confirmButtonText: string, danger = false): Promise<boolean> {
    const result = await Swal.fire({
        icon: 'warning',
        title,
        text,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Cancel',
        confirmButtonColor: danger ? '#cf2f3b' : '#14234a',
        cancelButtonColor: '#667085',
        reverseButtons: true,
        focusCancel: danger,
    });
    return result.isConfirmed;
}

export async function confirmAndDelete(url: string, subject: string): Promise<void> {
    if (await confirmAction(`Delete ${subject}?`, 'This action cannot be undone.', 'Yes, delete it', true)) {
        router.delete(url);
    }
}

export async function confirmAndPost(url: string, subject: string): Promise<void> {
    if (await confirmAction(`Send ${subject}?`, 'The campaign will be sent to its selected audience.', 'Yes, send now')) {
        router.post(url);
    }
}

export function notifyPlatinumOnly(): void {
    Swal.fire({
        icon: 'info',
        title: 'Platinum members only',
        text: 'Publishing news and events is available to active Platinum tier members only. Contact the AMCHAM Secretariat to upgrade your membership.',
        confirmButtonColor: '#14234a',
    });
}
