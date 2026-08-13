import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';

type UserRow = {
    id: number;
    uuid: string;
    name: string;
    email: string;
    company: string | null;
    roles: string[];
};

type UsersIndexProps = PageProps<{ users: UserRow[] }>;

const roles = ['super-admin', 'admin', 'member'];

export default function UsersIndex({ users }: UsersIndexProps) {
    const updateRole = (userId: string, role: string) => {
        router.put(route('admin.users.role', userId), { role }, { preserveScroll: true });
    };

    return (
        <AdminLayout
            header={
                <div>
                    <p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Members</p>
                    <h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Users & roles</h1>
                </div>
            }
        >
            <Head title="Admin — Users" />

            <div className="overflow-hidden border border-[#d7c8a9] bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#fbf8f0] text-xs font-black uppercase tracking-[0.1em] text-[#667085]">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eadfc8]">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="p-4 font-bold text-[#14234a]">{user.name}</td>
                                <td className="p-4 text-[#667085]">{user.email}</td>
                                <td className="p-4 text-[#667085]">{user.company ?? '—'}</td>
                                <td className="p-4">
                                    <select
                                        value={user.roles[0] ?? ''}
                                        onChange={(event) => updateRole(user.uuid, event.target.value)}
                                        className="border-[#d7c8a9] text-sm"
                                    >
                                        <option value="" disabled>No role</option>
                                        {roles.map((role) => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
