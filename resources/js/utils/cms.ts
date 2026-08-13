import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function useCms() {
    const cms = usePage<PageProps>().props.cms ?? {};
    return (key: string, fallback: string): string => cms[key]?.trim() || fallback;
}
