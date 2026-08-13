import AdminLayout from '@/Layouts/AdminLayout';
import { BoardMember, PageProps } from '@/types';
import { confirmAndDelete } from '@/utils/alerts';
import { Head, Link } from '@inertiajs/react';

export default function BoardMembersIndex({ boardMembers }: PageProps<{ boardMembers: BoardMember[] }>) {
    return <AdminLayout header={<div><p className="text-sm font-black uppercase tracking-[0.24em] text-[#cf2f3b]">Content</p><h1 className="mt-2 text-3xl font-display font-semibold text-[#14234a]">Board members</h1></div>}>
        <Head title="Admin — Board members" />
        <div className="mb-5 flex justify-end"><Link href={route('admin.board-members.create')} className="bg-[#14234a] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">Add board member</Link></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{boardMembers.map((member) => <article key={member.id} className="overflow-hidden border border-[#d7c8a9] bg-white"><div className="h-64 bg-[#f4efe5]">{member.photo_path ? <img src={member.photo_path} alt={member.name} className="h-full w-full object-cover object-top" /> : <div className="grid h-full place-items-center text-5xl font-display text-[#14234a]">{member.name.charAt(0)}</div>}</div><div className="p-5"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#cf2f3b]">{member.is_active ? 'Active' : 'Hidden'} · {member.sort_order}</p></div><h2 className="mt-2 text-xl font-bold text-[#14234a]">{member.name}</h2><p className="mt-2 text-sm leading-6 text-[#667085]">{member.role_title}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#667085]">{member.company ? `Linked · ${member.company.name}` : 'Not linked to a member company'}</p><div className="mt-5 flex gap-4"><Link href={route('admin.board-members.edit', member.uuid)} className="text-sm font-bold text-[#14234a]">Edit</Link><button onClick={() => confirmAndDelete(route('admin.board-members.destroy', member.uuid), member.name)} className="text-sm font-bold text-[#cf2f3b]">Delete</button></div></div></article>)}{boardMembers.length === 0 && <p className="text-[#667085]">No board members added yet.</p>}</div>
    </AdminLayout>;
}
