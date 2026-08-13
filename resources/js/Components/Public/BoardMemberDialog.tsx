import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BoardMember } from '@/types';
import Icon from '@/Components/Public/Icon';

/** Shared board profile modal so the homepage strip and the board page stay identical. */
export default function BoardMemberDialog({
    member,
    onClose,
}: {
    member: BoardMember | null;
    onClose: () => void;
}) {
    return (
        <Transition appear show={member !== null} as={Fragment}>
            <Dialog as="div" className="relative z-[70]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-navy-950/75 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-5">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 translate-y-4 scale-95"
                            enterTo="opacity-100 translate-y-0 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0 scale-100"
                            leaveTo="opacity-0 translate-y-4 scale-95"
                        >
                            <Dialog.Panel className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-card-lg md:grid-cols-[18rem_1fr]">
                                {member && (
                                    <>
                                        <div className="min-h-72 bg-mist md:min-h-full">
                                            {member.photo_path ? (
                                                <img
                                                    src={member.photo_path}
                                                    alt={member.name}
                                                    className="h-full w-full object-cover object-top"
                                                />
                                            ) : (
                                                <div className="grid h-full place-items-center font-display text-7xl text-navy-800">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-7 sm:p-9">
                                            <p className="text-xs font-semibold uppercase tracking-caps text-crimson">Board member</p>
                                            <Dialog.Title className="mt-3 font-display text-3xl font-semibold text-navy-800">
                                                {member.name}
                                            </Dialog.Title>
                                            <p className="mt-3 font-semibold leading-7 text-navy-700">{member.role_title}</p>
                                            <p className="mt-6 leading-7 text-ink-muted">
                                                {member.bio ||
                                                    `${member.name} serves on the AMCHAM Tanzania Board, contributing leadership and industry perspective to the chamber's mission.`}
                                            </p>
                                            {member.linkedin_url && (
                                                <a
                                                    href={member.linkedin_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-7 inline-flex items-center gap-2 font-semibold text-[#0A66C2]"
                                                >
                                                    View LinkedIn profile
                                                    <Icon name="arrow-up-right" className="h-4 w-4" />
                                                </a>
                                            )}
                                        </div>
                                    </>
                                )}

                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-navy-800 shadow-lg transition hover:bg-mist"
                                    aria-label="Close board member profile"
                                >
                                    <Icon name="close" className="h-4 w-4" />
                                </button>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
