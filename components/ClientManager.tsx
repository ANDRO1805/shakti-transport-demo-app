import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  Plus, 
  UserCheck, 
  UserX, 
  History, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle,
  Clock,
  Briefcase,
  Edit,
  User
} from 'lucide-react';
import { Client, ClientTier, Shipment, ShipmentStatus } from '../types';

interface ClientManagerProps {
  clients: Client[];
  requests: Client[]; // Pending registrations
  shipments: Shipment[];
  onApproveRequest: (client: Client) => void;
  onRejectRequest: (id: string) => void;
  onAddClient: (client: Client) => void;
  onUpdateClient: (client: Client) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({ 
  clients, 
  requests, 
  shipments, 
  onApproveRequest, 
  onRejectRequest, 
  onAddClient,
  onUpdateClient 
}) => {
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'REQUESTS'>('DIRECTORY');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Client>>({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    tier: ClientTier.SILVER,
    status: 'Active'
  });

  // Filter Logic
  const filteredClients = clients.filter(c => 
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clientShipmentHistory = selectedClient 
    ? shipments.filter(s => s.client.toLowerCase() === selectedClient.companyName.toLowerCase()) 
    : [];

  const handleOpenForm = (client?: Client) => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        tier: ClientTier.SILVER,
        status: 'Active'
      });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
        onUpdateClient(formData as Client);
        if (selectedClient && selectedClient.id === formData.id) {
            setSelectedClient(formData as Client);
        }
    } else {
        onAddClient({
            ...formData,
            id: `CL-${Date.now()}`,
            joinedDate: new Date().toISOString().split('T')[0],
            status: 'Active'
        } as Client);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 h-full flex flex-col">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4">
           <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Building2 className="w-6 h-6 text-indigo-400" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-white tracking-tight">CLIENT RELATIONS</h2>
              <p className="text-xs text-slate-500 font-mono">ACTIVE ACCOUNTS: {clients.length} | PENDING: {requests.length}</p>
           </div>
        </div>

        <div className="flex gap-3">
           <button 
             onClick={() => setActiveTab('DIRECTORY')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${activeTab === 'DIRECTORY' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
           >
             Directory
           </button>
           <button 
             onClick={() => setActiveTab('REQUESTS')}
             className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${activeTab === 'REQUESTS' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
           >
             New Requests
             {requests.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{requests.length}</span>}
           </button>
        </div>
      </div>

      {activeTab === 'DIRECTORY' && !selectedClient && (
        <>
            {/* CONTROLS */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search Companies..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                </div>
                <button 
                    onClick={() => handleOpenForm()}
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-lg transition-all"
                >
                    <Plus className="w-4 h-4" /> Add Client
                </button>
            </div>

            {/* CLIENT LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClients.map(client => (
                    <div key={client.id} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group cursor-pointer relative" onClick={() => setSelectedClient(client)}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 text-lg font-bold text-slate-400">
                                {client.companyName.charAt(0)}
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold border ${
                                client.tier === ClientTier.DIAMOND ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/30' :
                                client.tier === ClientTier.GOLD ? 'bg-amber-900/20 text-amber-400 border-amber-500/30' :
                                'bg-slate-800 text-slate-400 border-slate-600'
                            }`}>
                                {client.tier}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{client.companyName}</h3>
                        <p className="text-xs text-slate-500 font-mono mb-4">ID: {client.id}</p>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 bg-indigo-500/5 p-3 rounded-xl border border-indigo-500/10">
                              <Phone className="w-4 h-4 text-indigo-400" /> 
                              <span className="text-xl font-black text-white font-mono">{client.phone}</span>
                            </div>
                            <div className="space-y-1 text-sm text-slate-400 pl-1">
                              <div className="flex items-center gap-2 font-bold uppercase text-[10px]"><Briefcase className="w-3 h-3" /> {client.contactPerson}</div>
                              <div className="flex items-center gap-2 text-[10px] font-mono"><MapPin className="w-3 h-3" /> {client.address}</div>
                            </div>
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={(e) => { e.stopPropagation(); handleOpenForm(client); }} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors" title="Edit Client">
                                <Edit className="w-4 h-4" />
                             </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
      )}

      {activeTab === 'REQUESTS' && !selectedClient && (
         <div className="space-y-4">
            {requests.length === 0 ? (
                <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800 border-dashed">
                    <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No pending registration requests.</p>
                </div>
            ) : (
                requests.map(req => (
                    <div key={req.id} className="glass-panel p-8 rounded-[2rem] border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
                         <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{req.companyName}</h3>
                                <span className="bg-amber-900/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">New Lead</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                   <div className="flex items-center gap-3 text-indigo-400"><Phone className="w-4 h-4" /><span className="text-xl font-black font-mono">{req.phone}</span></div>
                                   <div className="flex items-center gap-3"><User className="w-4 h-4 text-slate-500" /><span className="text-sm font-bold text-slate-200 uppercase">{req.contactPerson}</span></div>
                                </div>
                                <div className="space-y-3">
                                   <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-slate-500" /><span className="text-sm font-medium text-slate-400">{req.email}</span></div>
                                   <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-slate-500" /><span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{req.address}</span></div>
                                </div>
                            </div>
                         </div>
                         
                         <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
                             <button onClick={() => onApproveRequest(req)} className="w-full px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl shadow-xl shadow-green-600/20 font-black text-[10px] uppercase flex items-center justify-center gap-2 transition-all active:scale-95">
                                <UserCheck className="w-4 h-4" /> Approve Client
                             </button>
                             <button onClick={() => onRejectRequest(req.id)} className="w-full px-8 py-3 border border-slate-700 rounded-xl text-slate-500 hover:text-white hover:bg-red-900/20 hover:border-red-500/30 transition-all font-black text-[10px] uppercase flex items-center justify-center gap-2">
                                <UserX className="w-4 h-4" /> Reject
                             </button>
                         </div>
                    </div>
                ))
            )}
         </div>
      )}

      {/* CLIENT DETAIL VIEW */}
      {selectedClient && (
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex-1 flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg">
                         {selectedClient.companyName.charAt(0)}
                     </div>
                     <div>
                         <h2 className="text-2xl font-bold text-white">{selectedClient.companyName}</h2>
                         <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                             <div className="flex items-center gap-2 font-mono text-indigo-400 font-black"><Phone className="w-4 h-4" /> {selectedClient.phone}</div>
                             <span className="text-slate-600">|</span>
                             <div className="flex items-center gap-2"><Briefcase className="w-4 h-4" /> {selectedClient.contactPerson}</div>
                         </div>
                     </div>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => handleOpenForm(selectedClient)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase flex items-center gap-2 transition-all shadow-lg">
                        <Edit className="w-4 h-4" /> Edit Profile
                    </button>
                    <button onClick={() => setSelectedClient(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase border border-slate-700">
                        Back
                    </button>
                 </div>
             </div>

             <div className="p-6 flex-1 overflow-y-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                     <div className="glass-panel p-4 rounded-xl border border-slate-700 bg-slate-900/30">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Account Details</h4>
                         <div className="space-y-3 text-sm">
                             <div className="flex justify-between"><span className="text-slate-400">Status</span> <span className="text-green-400 font-bold">{selectedClient.status}</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">Tier</span> <span className="text-indigo-400 font-bold">{selectedClient.tier}</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">GSTIN</span> <span className="text-white font-mono">{selectedClient.gstin || 'N/A'}</span></div>
                             <div className="flex justify-between"><span className="text-slate-400">Joined</span> <span className="text-white">{selectedClient.joinedDate}</span></div>
                             <div className="flex justify-between items-start"><span className="text-slate-400">Email</span> <span className="text-white text-right break-all">{selectedClient.email}</span></div>
                             <div className="flex justify-between items-start pt-2 border-t border-slate-800"><span className="text-slate-400">Address</span> <span className="text-white text-right w-1/2">{selectedClient.address}</span></div>
                         </div>
                     </div>
                     <div className="lg:col-span-2 glass-panel p-4 rounded-xl border border-slate-700 bg-slate-900/30">
                         <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                             <History className="w-4 h-4" /> Order History
                         </h4>
                         {clientShipmentHistory.length > 0 ? (
                             <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="text-slate-500 uppercase border-b border-slate-700">
                                        <tr>
                                            <th className="pb-2">ID</th>
                                            <th className="pb-2">Date</th>
                                            <th className="pb-2">Route</th>
                                            <th className="pb-2">Cargo</th>
                                            <th className="pb-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {clientShipmentHistory.map(shipment => (
                                            <tr key={shipment.id} className="text-slate-300">
                                                <td className="py-2 font-mono text-indigo-300">{shipment.id}</td>
                                                <td className="py-2">{shipment.date}</td>
                                                <td className="py-2">{shipment.origin} → {shipment.destination}</td>
                                                <td className="py-2">{shipment.goodsType}</td>
                                                <td className="py-2">{shipment.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                         ) : (
                             <div className="text-center py-8 text-slate-500 italic">No shipment history available.</div>
                         )}
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
           <div className="glass-panel w-full max-w-lg rounded-2xl border border-indigo-500/30 relative z-10 animate-in zoom-in duration-200 shadow-2xl">
               <div className="p-6 border-b border-slate-800 bg-slate-900/50 rounded-t-2xl flex justify-between items-center">
                   <h3 className="text-lg font-bold text-white tracking-wide">
                       {formData.id ? 'UPDATE CLIENT PROFILE' : 'REGISTER NEW CLIENT'}
                   </h3>
                   <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-white"><XCircle className="w-5 h-5" /></button>
               </div>
               <form onSubmit={handleSubmit} className="p-6 space-y-4">
                   <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                       <input 
                           required
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                           value={formData.companyName}
                           onChange={e => setFormData({...formData, companyName: e.target.value})}
                       />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                           <label className="text-xs font-bold text-slate-500 uppercase">Contact Person</label>
                           <input 
                               required
                               className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                               value={formData.contactPerson}
                               onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                           />
                       </div>
                       <div className="space-y-1">
                           <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                           <input 
                               required
                               className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                               value={formData.phone}
                               onChange={e => setFormData({...formData, phone: e.target.value})}
                           />
                       </div>
                   </div>
                   <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                       <input 
                           type="email"
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                   </div>
                   <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Billing Address</label>
                       <input 
                           required
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                           value={formData.address}
                           onChange={e => setFormData({...formData, address: e.target.value})}
                       />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                           <label className="text-xs font-bold text-slate-500 uppercase">Service Tier</label>
                           <select 
                               className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none"
                               value={formData.tier}
                               onChange={e => setFormData({...formData, tier: e.target.value as ClientTier})}
                           >
                               {Object.values(ClientTier).map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                       </div>
                       <div className="space-y-1">
                           <label className="text-xs font-bold text-slate-500 uppercase">GSTIN (Optional)</label>
                           <input 
                               className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                               value={formData.gstin || ''}
                               onChange={e => setFormData({...formData, gstin: e.target.value})}
                           />
                       </div>
                   </div>
                   <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2">
                       <CheckCircle2 className="w-5 h-5" /> Save Record
                   </button>
               </form>
           </div>
        </div>
      )}

    </div>
  );
};