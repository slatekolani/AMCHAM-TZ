import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Password recovery</p>
                <h1 className="mt-3 text-4xl font-display font-semibold text-[#14234a]">Reset your access</h1>
                <p className="mt-4 leading-7 text-[#667085]">
                    Enter your account email and we will send a secure reset link for your AMCHAM platform access.
                </p>
            </div>
            {status && <div className="mb-5 border border-[#1e7c89] bg-[#f7f3ea] p-4 text-sm font-bold text-[#1e7c89]">{status}</div>}
            <form onSubmit={submit}>
                <label htmlFor="email" className="text-sm font-bold text-[#14234a]">Email address</label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-2 block w-full border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                    onChange={(e) => setData('email', e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
                <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={route('login')} className="text-sm font-bold text-[#667085] hover:text-[#14234a]">Back to login</Link>
                    <button type="submit" disabled={processing} className="bg-[#14234a] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white disabled:opacity-60">
                        Send reset link
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
