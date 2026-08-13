import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />
            <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Verify email</p>
                <h1 className="mt-3 text-4xl font-display font-semibold text-[#14234a]">Check your inbox</h1>
                <p className="mt-4 leading-7 text-[#667085]">
                    Before accessing the AMCHAM platform, verify your email address using the link we sent to you.
                </p>
            </div>
            {status === 'verification-link-sent' && (
                <div className="mb-5 border border-[#1e7c89] bg-[#f7f3ea] p-4 text-sm font-bold text-[#1e7c89]">
                    A new verification link has been sent to your email address.
                </div>
            )}
            <form onSubmit={submit}>
                <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={route('logout')} method="post" as="button" className="text-sm font-bold text-[#667085] hover:text-[#14234a]">
                        Log out
                    </Link>
                    <button type="submit" disabled={processing} className="bg-[#14234a] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white disabled:opacity-60">
                        Resend verification email
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
