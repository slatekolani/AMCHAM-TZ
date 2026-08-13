import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useCms } from '@/utils/cms';

export default function Register({ status }: { status?: string }) {
    const t = useCms();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">{t('register_eyebrow', 'Member access')}</p>
                <h1 className="mt-3 text-4xl font-display font-semibold text-[#14234a]">{t('register_heading', 'Create your AMCHAM account')}</h1>
                <p className="mt-4 leading-7 text-[#667085]">
                    {t('register_description', 'Start your member workspace for company profile management, event participation, publication submissions and AMCHAM communications.')}
                </p>
            </div>

            {status && <div className="mb-5 border border-[#1e7c89] bg-[#f7f3ea] p-4 text-sm font-bold text-[#1e7c89]">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="name" className="text-sm font-bold text-[#14234a]">Full name</label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className="text-sm font-bold text-[#14234a]">Work email</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <label htmlFor="password_confirmation" className="text-sm font-bold text-[#14234a]">Confirm password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={route('login')}
                        className="text-sm font-bold text-[#667085] hover:text-[#14234a]"
                    >
                        Already have access?
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#cf2f3b] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white disabled:opacity-60"
                    >
                        Create account
                    </button>
                </div>

                <div className="mt-8 border-t border-[#eadfc8] pt-6 text-sm leading-6 text-[#667085]">
                    {t('register_review_notice', 'AMCHAM staff will review your application, contact you, and approve your access to the member portal.')}
                </div>
            </form>
        </GuestLayout>
    );
}
