import { Event } from '@/types';

export function eventDateLabel(event: Pick<Event, 'starts_at'>): string {
    return new Date(event.starts_at).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Africa/Dar_es_Salaam',
    });
}

/** Resolve event-specific variables stored in rich-text descriptions. */
export function renderEventDescription(event: Pick<Event, 'starts_at' | 'description'>): string {
    return (event.description ?? '').replace(/\{\{\s*event_date\s*\}\}/gi, eventDateLabel(event));
}
