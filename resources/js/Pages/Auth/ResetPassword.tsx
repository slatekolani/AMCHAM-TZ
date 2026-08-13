import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => reset('password', 'password_confirmation');
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
            <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">New credentials</p>
                <h1 className="mt-3 text-4xl font-display font-semibold text-[#14234a]">Set a new password</h1>
                <p className="mt-4 leading-7 text-[#667085]">Choose a secure password for your AMCHAM platform account.</p>
            </div>
            <form onSubmit={submit} className="grid gap-4">
                {[
                    ['email', 'Email address', 'email', data.email],
                    ['password', 'New password', 'password', data.password],
                    ['password_confirmation', 'Confirm password', 'password', data.password_confirmation],
                ].map(([field, label, type, value]) => (
                    <label key={field} className="grid gap-2 text-sm font-bold text-[#14234a]">
                        {label}
                        <input
                            id={field}
                            type={type}
                            name={field}
                            value={value}
                            className="border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                            autoComplete={field === 'email' ? 'username' : 'new-password'}
                            onChange={(e) => setData(field as 'email' | 'password' | 'password_confirmation', e.target.value)}
                        />
                        <InputError message={errors[field as keyof typeof errors]} />
                    </label>
                ))}
                <button type="submit" disabled={processing} className="mt-2 bg-[#14234a] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white disabled:opacity-60">
                    Reset password
                </button>
            </form>
        </GuestLayout>
    );
}
