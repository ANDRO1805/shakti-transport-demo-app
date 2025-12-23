import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  UserX, 
  UserCheck, 
  AlertCircle,
  Shield,
  X,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Lock,
  Mail,
  User,
  MoreVertical
} from 'lucide-react';
import { AppUser, UserRole, UserStatus } from '../types';

interface UserManagementProps {
  users: AppUser[];
  onUpdateUserStatus: (userId: string, status: UserStatus, reason?: string) => void;
  onAddUser: (user: AppUser) => void;
  onEditUser: (user: AppUser) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onUpdateUserStatus,
  onAddUser,
  onEditUser,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  
  const [formData, setFormData] = useState<Partial<AppUser>>({
    name: '',
    email: '',
    role: UserRole.VIEWER,
    status: UserStatus.ACTIVE
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (user?: AppUser) => {
    if (user) {
      setSelectedUser(user);
      setFormData(user);
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        role: UserRole.VIEWER,
        status: UserStatus.ACTIVE
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      onEditUser({ ...selectedUser, ...formData } as AppUser);
    } else {
      onAddUser({
        ...formData,
        id: `u-${Date.now()}`,
        status: UserStatus.ACTIVE
      } as AppUser);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedUser) {
      onDeleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };

  const StatusBadge = ({ status }: { status: UserStatus }) => (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border inline-flex items-center gap-1.5 ${
      status === UserStatus.ACTIVE 
        ? 'bg-green-500/10 text-green-400 border-green-500/30' 
        : 'bg-red-500/10 text-red-400 border-red-500/30'
    }`}>
      <span className={`w-1 h-1 rounded-full ${status === UserStatus.ACTIVE ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></span>
      {status}
    </span>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* Admin Control Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Identity Vault</h2>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Access Control Center</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Filter identities..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={() => handleOpenForm()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-500/10"
          >
            <Plus className="w-4 h-4" /> Add Identity
          </button>
        </div>
      </div>

      {/* Desktop View: Interactive Table */}
      <div className="hidden md:block glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-slate-500 uppercase font-black tracking-widest bg-slate-950/80 border-b border-slate-800">
              <tr>
                <th className="px-6 py-5">System Entity</th>
                <th className="px-6 py-5">Designation</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-900/40 group transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700 group-hover:border-indigo-500/50">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{user.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700 uppercase tracking-tighter">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {user.role !== UserRole.SUPER_ADMIN ? (
                        <>
                          <button onClick={() => handleOpenForm(user)} className="p-2 text-slate-400 hover:text-indigo-400 active:scale-90 transition-all"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => onUpdateUserStatus(user.id, user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE)} className={`p-2 transition-all active:scale-90 ${user.status === UserStatus.ACTIVE ? 'text-slate-400 hover:text-red-400' : 'text-green-400'}`}>
                            {user.status === UserStatus.ACTIVE ? <Lock className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 active:scale-90 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </>
                      ) : <span className="text-[10px] text-slate-600 font-mono italic px-4">ROOT PROTECTION ACTIVE</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && <div className="p-10 text-center text-slate-500 italic">No identities found.</div>}
        </div>
      </div>

      {/* Mobile View: Stacked Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredUsers.map(user => (
          <div key={user.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col gap-4 active:border-indigo-500/30 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{user.name}</h3>
                  <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                </div>
              </div>
              <StatusBadge status={user.status} />
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {user.role}
              </span>
              <div className="flex gap-1">
                {user.role !== UserRole.SUPER_ADMIN && (
                  <>
                    <button onClick={() => handleOpenForm(user)} className="p-2 text-slate-400 active:text-indigo-400"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => onUpdateUserStatus(user.id, user.status === UserStatus.ACTIVE ? UserStatus.BLOCKED : UserStatus.ACTIVE)} className="p-2 text-slate-400 active:text-red-400">
                      {user.status === UserStatus.ACTIVE ? <Lock className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 active:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-panel w-full max-w-md rounded-2xl border border-indigo-500/30 relative z-10 animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white tracking-wide uppercase">
                {selectedUser ? 'Modify Profile' : 'Authorize Identity'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Full Legal Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none text-sm" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">Email Node</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none text-sm" placeholder="user@shakti.logistics" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest">System Designation</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none text-sm appearance-none cursor-pointer">
                  {Object.values(UserRole).filter(r => r !== UserRole.SUPER_ADMIN).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl uppercase text-xs tracking-[0.2em] transition-all shadow-lg shadow-indigo-500/20 mt-4 active:scale-95 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {selectedUser ? 'Update Records' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}></div>
          <div className="glass-panel w-full max-w-sm rounded-2xl border border-red-500/30 relative z-10 p-8 text-center animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Purge Identity?</h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">This operation will permanently revoke all access for <b>{selectedUser?.name}</b> and purge their records from the Shakti.OS database.</p>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-red-500/20">Purge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};