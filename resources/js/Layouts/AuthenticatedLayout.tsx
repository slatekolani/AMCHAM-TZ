import { PropsWithChildren, ReactNode, useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PageProps, User } from '@/types';

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { props } = usePage<PageProps>();
    const isAdmin = props.auth.roles.includes('admin') || props.auth.roles.includes('super-admin');
    const isMember = props.auth.roles.includes('member');

    const navItems: [string, string][] = [
        ['Overview', 'dashboard'],
        ...(isAdmin ? [['Admin Command', 'admin.dashboard'] as [string, string]] : []),
        ...(isMember ? [['Member Portal', 'member.portal'] as [string, string]] : []),
    ];

    return (
        <div className="min-h-screen bg-[#f4efe5] text-[#17213d]">
            <nav className="border-b border-[#d7c8a9] bg-[#14234a]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
                        <div className="flex items-center">
                            <Link href="/">
                                <img src="/images/brand/amcham-logo.png" alt="AMCHAM Tanzania" className="h-12 w-auto" />
                            </Link>

                            <div className="hidden space-x-2 sm:ms-10 sm:flex">
                                {navItems.map(([label, routeName]) => (
                                    <Link
                                        key={routeName}
                                        href={route(routeName)}
                                        className={
                                            'px-4 py-3 text-sm font-bold transition ' +
                                            (route().current(routeName)
                                                ? 'bg-white text-[#14234a]'
                                                : 'text-white/70 hover:bg-white/10 hover:text-white')
                                        }
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex">
                                            <button
                                                type="button"
                                                className="inline-flex items-center border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#14234a]"
                                            >
                                                {user.name}
                                                <svg className="ms-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center border border-white/20 p-2 text-white transition hover:bg-white/10"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' border-t border-white/10 sm:hidden'}>
                    <div className="space-y-1 pb-3 pt-2">
                        {navItems.map(([label, routeName]) => (
                            <ResponsiveNavLink key={routeName} href={route(routeName)} active={route().current(routeName)}>
                                {label}
                            </ResponsiveNavLink>
                        ))}
                    </div>

                    <div className="border-t border-white/10 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-bold text-white">{user.name}</div>
                            <div className="text-sm font-medium text-white/60">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-[#d7c8a9] bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
