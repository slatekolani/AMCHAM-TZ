import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

export default function SweetAlertFeedback({ success, error }: { success?: string | null; error?: string | null }) {
    useEffect(() => {
        if (!success && !error) return;
        Swal.fire({
            icon: error ? 'error' : 'success',
            title: error ? 'Action unsuccessful' : 'Success',
            text: error || success || '',
            confirmButtonColor: '#14234a',
            timer: error ? undefined : 3200,
            timerProgressBar: !error,
        });
    }, [success, error]);

    useEffect(() => router.on('error', () => {
        Swal.fire({
            icon: 'error',
            title: 'Please check your submission',
            text: 'Some information is missing or invalid. Review the highlighted fields and try again.',
            confirmButtonColor: '#14234a',
        });
    }), []);

    return null;
}
