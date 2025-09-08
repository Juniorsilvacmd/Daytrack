import React, { useEffect, useState } from 'react';
import djangoApiService from '../services/djangoApiService';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}

export const AdminPanel: React.FC = () => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ total_users: number; active_users: number; staff_users: number; superusers: number } | null>(null);

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_staff: false,
    is_superuser: false,
    is_active: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const me = await djangoApiService.getCurrentUser();
        const isAdmin = !!(me && (me as any).is_superuser);
        setAllowed(isAdmin);
        if (!isAdmin) {
          setError('Acesso negado');
          setLoading(false);
          return;
        }
        const [list, s] = await Promise.all([
          djangoApiService.adminListUsers(),
          djangoApiService.adminStats(),
        ]);
        setUsers(list);
        setStats(s);
      } catch (e: any) {
        setError(e.message || 'Erro ao carregar');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const refresh = async () => {
    const [list, s] = await Promise.all([
      djangoApiService.adminListUsers(),
      djangoApiService.adminStats(),
    ]);
    setUsers(list);
    setStats(s);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await djangoApiService.adminCreateUser(form);
      setForm({ username: '', email: '', first_name: '', last_name: '', password: '', is_staff: false, is_superuser: false, is_active: true });
      await refresh();
    } catch (e: any) {
      setError(e.message || 'Erro ao criar usuário');
    }
  };

  const toggleActive = async (u: AdminUser) => {
    await djangoApiService.adminUpdateUser(u.id, { is_active: !u.is_active });
    await refresh();
  };

  const remove = async (u: AdminUser) => {
    await djangoApiService.adminDeleteUser(u.id);
    await refresh();
  };

  // Edição de usuário
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState<{ first_name: string; last_name: string; email: string; username: string; is_staff: boolean; is_superuser: boolean; is_active: boolean; password: string }>({
    first_name: '', last_name: '', email: '', username: '', is_staff: false, is_superuser: false, is_active: true, password: ''
  });

  const openEdit = (u: AdminUser) => {
    setEditing(u);
    setEditForm({
      first_name: u.first_name || '',
      last_name: u.last_name || '',
      email: u.email || '',
      username: u.username || '',
      is_staff: u.is_staff,
      is_superuser: u.is_superuser,
      is_active: u.is_active,
      password: ''
    });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const payload: any = { ...editForm };
    if (!payload.password) delete payload.password;
    await djangoApiService.adminUpdateUser(editing.id, payload);
    setEditing(null);
    await refresh();
  };

  if (loading) {
    return <div className="text-center text-gray-400">Carregando admin...</div>;
  }

  if (allowed === false) {
    return <div className="bg-red-900/20 border border-red-800 rounded-md p-4 text-red-400">Acesso negado</div>;
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-md p-4 text-red-400">{error}</div>
      )}

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 rounded p-4">
            <div className="text-gray-300 text-sm">Usuários</div>
            <div className="text-2xl text-white font-semibold">{stats.total_users}</div>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <div className="text-gray-300 text-sm">Ativos</div>
            <div className="text-2xl text-white font-semibold">{stats.active_users}</div>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <div className="text-gray-300 text-sm">Staff</div>
            <div className="text-2xl text-white font-semibold">{stats.staff_users}</div>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <div className="text-gray-300 text-sm">Superadmins</div>
            <div className="text-2xl text-white font-semibold">{stats.superusers}</div>
          </div>
        </div>
      )}

      <form onSubmit={handleCreate} className="bg-gray-700 rounded p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="px-3 py-2 rounded bg-gray-600 text-white" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="px-3 py-2 rounded bg-gray-600 text-white" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="px-3 py-2 rounded bg-gray-600 text-white" placeholder="Senha" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <input className="px-3 py-2 rounded bg-gray-600 text-white" placeholder="Nome" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
        <input className="px-3 py-2 rounded bg-gray-600 text-white" placeholder="Sobrenome" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
        <div className="flex items-center gap-4">
          <label className="text-gray-300 text-sm flex items-center gap-2"><input type="checkbox" checked={form.is_staff} onChange={e => setForm({ ...form, is_staff: e.target.checked })} /> Staff</label>
          <label className="text-gray-300 text-sm flex items-center gap-2"><input type="checkbox" checked={form.is_superuser} onChange={e => setForm({ ...form, is_superuser: e.target.checked })} /> Superuser</label>
          <label className="text-gray-300 text-sm flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Ativo</label>
        </div>
        <div className="md:col-span-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">Criar usuário</button>
        </div>
      </form>

      <div className="bg-gray-700 rounded p-4 overflow-auto">
        <table className="min-w-full text-sm text-gray-200">
          <thead className="text-gray-300">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Username</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Nome</th>
              <th className="text-left p-2">Staff</th>
              <th className="text-left p-2">Super</th>
              <th className="text-left p-2">Ativo</th>
              <th className="text-left p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-gray-600">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.first_name} {u.last_name}</td>
                <td className="p-2">{u.is_staff ? 'Sim' : 'Não'}</td>
                <td className="p-2">{u.is_superuser ? 'Sim' : 'Não'}</td>
                <td className="p-2">{u.is_active ? 'Sim' : 'Não'}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 bg-yellow-600 rounded" title="Ativar/Inativar" onClick={() => toggleActive(u)}>{u.is_active ? 'Inativar' : 'Ativar'}</button>
                  <button className="px-2 py-1 bg-blue-600 rounded" title="Editar" onClick={() => openEdit(u)}>Editar</button>
                  <button className="px-2 py-1 bg-red-600 rounded" onClick={() => remove(u)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded p-6 w-full max-w-2xl">
            <h3 className="text-white text-lg mb-4">Editar usuário #{editing.id}</h3>
            <form onSubmit={saveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="px-3 py-2 rounded bg-gray-700 text-white" placeholder="Username" value={editForm.username} onChange={e => setEditForm({ ...editForm, username: e.target.value })} />
              <input className="px-3 py-2 rounded bg-gray-700 text-white" placeholder="Email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
              <input className="px-3 py-2 rounded bg-gray-700 text-white" placeholder="Nome" value={editForm.first_name} onChange={e => setEditForm({ ...editForm, first_name: e.target.value })} />
              <input className="px-3 py-2 rounded bg-gray-700 text-white" placeholder="Sobrenome" value={editForm.last_name} onChange={e => setEditForm({ ...editForm, last_name: e.target.value })} />
              <input className="px-3 py-2 rounded bg-gray-700 text-white md:col-span-2" placeholder="Nova senha (opcional)" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} />
              <div className="flex items-center gap-4 md:col-span-2">
                <label className="text-gray-300 text-sm flex items-center gap-2"><input type="checkbox" checked={editForm.is_staff} onChange={e => setEditForm({ ...editForm, is_staff: e.target.checked })} /> Staff</label>
                <label className="text-gray-300 text-sm flex items-center gap-2"><input type="checkbox" checked={editForm.is_superuser} onChange={e => setEditForm({ ...editForm, is_superuser: e.target.checked })} /> Superuser</label>
                <label className="text-gray-300 text-sm flex items-center gap-2"><input type="checkbox" checked={editForm.is_active} onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })} /> Ativo</label>
              </div>
              <div className="flex gap-2 md:col-span-2 justify-end">
                <button type="button" className="px-4 py-2 bg-gray-600 rounded text-white" onClick={() => setEditing(null)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 rounded text-white">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


