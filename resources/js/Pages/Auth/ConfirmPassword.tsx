import { useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });

    useEffect(() => {
        return () => reset('password');
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />
            <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Secure area</p>
                <h1 className="mt-3 text-4xl font-display font-semibold text-[#14234a]">Confirm your password</h1>
                <p className="mt-4 leading-7 text-[#667085]">This protects sensitive member and chamber administration tools.</p>
            </div>
            <form onSubmit={submit}>
                <label htmlFor="password" className="text-sm font-bold text-[#14234a]">Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-2 block w-full border-[#d7c8a9] bg-[#fbf8f0] px-4 py-3 focus:border-[#14234a] focus:ring-[#14234a]"
                    onChange={(e) => setData('password', e.target.value)}
                />
                <InputError message={errors.password} className="mt-2" />
                <button type="submit" disabled={processing} className="mt-6 bg-[#14234a] px-6 py-4 text-sm font-black uppercase tracking-[0.16em] text-white disabled:opacity-60">
                    Confirm access
                </button>
            </form>
        </GuestLayout>
    );
}
