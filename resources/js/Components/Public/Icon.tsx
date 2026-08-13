export type IconName =
    | 'arrow'
    | 'arrow-up-right'
    | 'briefcase'
    | 'calendar'
    | 'chart'
    | 'check'
    | 'chevron-down'
    | 'clock'
    | 'close'
    | 'document'
    | 'download'
    | 'globe'
    | 'landmark'
    | 'mail'
    | 'megaphone'
    | 'menu'
    | 'phone'
    | 'pin'
    | 'search'
    | 'shield'
    | 'users';

const paths: Record<IconName, JSX.Element> = {
    arrow: (
        <>
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </>
    ),
    'arrow-up-right': (
        <>
            <path d="M7 17 17 7" />
            <path d="M8 7h9v9" />
        </>
    ),
    briefcase: (
        <>
            <rect x="3.5" y="7.5" width="17" height="12" rx="1.5" />
            <path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17" />
        </>
    ),
    calendar: (
        <>
            <rect x="4" y="5.5" width="16" height="15" rx="1.5" />
            <path d="M8 3.5v4M16 3.5v4M4 10h16" />
        </>
    ),
    chart: (
        <>
            <path d="M4 20h16" />
            <path d="M7 20v-6M12 20V9M17 20V4" />
        </>
    ),
    check: <path d="m5 12.5 4.5 4.5L19 7" />,
    'chevron-down': <path d="m6 9.5 6 6 6-6" />,
    clock: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2.5" />
        </>
    ),
    close: <path d="M6 6l12 12M18 6 6 18" />,
    document: (
        <>
            <path d="M6 3.5h8l4 4V20.5H6z" />
            <path d="M14 3.5v4h4M9 12h6M9 16h6" />
        </>
    ),
    download: (
        <>
            <path d="M12 4v11" />
            <path d="m7 11 5 5 5-5" />
            <path d="M4.5 19.5h15" />
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5Z" />
        </>
    ),
    landmark: (
        <>
            <path d="m12 3.5 8.5 4.5H3.5L12 3.5Z" />
            <path d="M5.5 10.5v6M10 10.5v6M14 10.5v6M18.5 10.5v6M3.5 20h17" />
        </>
    ),
    mail: (
        <>
            <rect x="4" y="6" width="16" height="12.5" rx="1.5" />
            <path d="m4.5 7.5 7.5 6 7.5-6" />
        </>
    ),
    megaphone: (
        <>
            <path d="M4 10.5v3a1 1 0 0 0 1 1h2l6.5 4V5.5L7 9.5H5a1 1 0 0 0-1 1Z" />
            <path d="M17 9a4 4 0 0 1 0 6M8 15l1 5" />
        </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    phone: (
        <path d="M6.5 4h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5L16 13l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z" />
    ),
    pin: (
        <>
            <path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0c0 5.4 6.5 11 6.5 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
        </>
    ),
    shield: (
        <>
            <path d="M12 3.5 19 6v5.2c0 4.2-2.8 7.9-7 9.3-4.2-1.4-7-5.1-7-9.3V6l7-2.5Z" />
            <path d="m9 12 2 2 4-5" />
        </>
    ),
    users: (
        <>
            <path d="M16 20c0-2.2-1.8-4-4-4s-4 1.8-4 4" />
            <circle cx="12" cy="9.5" r="3.5" />
            <path d="M19 19c0-1.7-1-3.1-2.4-3.7M17 6.8a2.7 2.7 0 0 1 0 5.2" />
        </>
    ),
};

export default function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.7}
        >
            {paths[name]}
        </svg>
    );
}
