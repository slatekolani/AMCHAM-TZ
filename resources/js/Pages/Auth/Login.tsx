import { useEffect, FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useCms } from '@/utils/cms';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const t = useCms();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">{t('login_eyebrow', 'Secure login')}</p>
                <h1 className="mt-3 text-4xl font-display font-semibold text-[#14234a]">{t('login_heading', 'Access AMCHAM Tanzania')}</h1>
                <p className="mt-4 leading-7 text-[#667085]">
                    {t('login_description', 'Sign in to manage the chamber platform, member workspace, content approvals and campaigns.')}
                </p>
            </div>

            {status && <div className="mb-5 border border-[#1e7c89] bg-[#f7f3ea] p-4 text-sm font-bold text-[#1e7c89]">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="email" className="text-sm font-bold text-[#14234a]">Email address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="text-sm font-bold text-[#14234a]">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-2 block w-full border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm font-semibold text-[#667085]">Remember this device</span>
                    </label>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm font-bold text-[#667085] hover:text-[#14234a]"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#14234a] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white disabled:opacity-60"
                    >
                        Log in
                    </button>
                </div>

                <div className="mt-8 border-t border-[#eadfc8] pt-6 text-sm text-[#667085]">
                    {t('login_access_prompt', 'Need access for your company?')}{' '}
                    <Link href={route('register')} className="font-bold text-[#cf2f3b]">
                        {t('login_register_link', 'Register a member account')}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
