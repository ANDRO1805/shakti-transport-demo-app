
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  CalendarDays, 
  Wallet, 
  History, 
  Save, 
  Phone, 
  Truck, 
  CreditCard, 
  Calendar,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { Driver, AttendanceData, FinancialData, PaymentRecord } from '../types';

interface DriverManagerProps {
  drivers: Driver[];
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (id: number) => void;
  onAddDriver: (driver: Driver) => void;
}

// Sub-component: Modal Wrapper
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode; maxWidth?: string }> = ({ title, onClose, children, maxWidth = "max-w-lg" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
    <div className={`glass-panel w-full ${maxWidth} md:${maxWidth} w-[95%] overflow-hidden animate-in fade-in zoom-in duration-200 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700 relative max-h-[90vh] flex flex-col z-10`}>
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700 bg-slate-900/50 shrink-0">
        <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
           <span className="w-2 h-4 bg-indigo-500 rounded-sm"></span>
           {title}
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 text-slate-200 bg-slate-950/50 overflow-y-auto custom-scrollbar">
        {children}
      </div>
    </div>
  </div>
);

export const DriverManager: React.FC<DriverManagerProps> = ({ drivers, onUpdateDriver, onDeleteDriver, onAddDriver }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  // Form State for Add/Edit
  const [formData, setFormData] = useState<Partial<Driver>>({
    name: '',
    phone: '',
    role: 'Driver',
    license: '',
    licenseExpiry: '',
    status: 'Active',
    vehicle: 'Unassigned'
  });

  // --- DERIVED STATE ---
  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.license.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isLicenseExpiring = (dateStr: string) => {
    if (!dateStr) return false;
    const expiry = new Date(dateStr);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  const isLicenseExpired = (dateStr: string) => {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  };

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setSelectedDriver(null);
    setFormData({
      name: '',
      phone: '',
      role: 'Driver',
      license: '',
      licenseExpiry: '',
      status: 'Active',
      vehicle: 'Unassigned'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({ ...driver });
    setIsFormOpen(true); // Reuse basic form for quick edits or use Manage modal for detailed
  };

  const handleOpenManage = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsManageOpen(true);
  };

  const handleFormSubmit = () => {
    if (selectedDriver) {
      // Edit mode
      onUpdateDriver({ ...selectedDriver, ...formData } as Driver);
    } else {
      // Add mode
      const newDriver: Driver = {
        id: Date.now(),
        ...formData as Driver,
        financials: { baseSalary: 15000, bonus: 0, deductions: 0, status: 'Pending' },
        paymentHistory: [],
        attendance: {}
      };
      onAddDriver(newDriver);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
         <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
               <Users className="w-6 h-6 text-indigo-400" /> FLEET PERSONNEL
            </h2>
            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
            <div className="flex gap-2">
               {['ALL', 'Active', 'In Transit', 'On Leave'].map(status => (
                  <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      statusFilter === status 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
               ))}
            </div>
         </div>

         <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="Search Name or License..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
               />
            </div>
            <button 
              onClick={handleOpenAdd}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> Add Staff
            </button>
         </div>
      </div>

      {/* DRIVER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {filteredDrivers.map(driver => {
            const exp = isLicenseExpired(driver.licenseExpiry);
            const expiring = isLicenseExpiring(driver.licenseExpiry);

            return (
               <div key={driver.id} className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 p-16 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
                  
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-4 relative z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 shadow-inner text-lg font-bold text-slate-400">
                           {driver.name.charAt(0)}
                        </div>
                        <div>
                           <h3 className="text-lg font-bold text-white leading-tight">{driver.name}</h3>
                           <p className="text-xs text-indigo-400 font-mono">{driver.role}</p>
                        </div>
                     </div>
                     <div className="flex gap-1">
                        <button onClick={() => handleOpenManage(driver)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Manage Profile">
                           <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteDriver(driver.id)} className="p-1.5 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400 transition-colors" title="Delete Record">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 mb-6 relative z-10 flex-1">
                     <div className="flex justify-between text-xs border-b border-slate-800 pb-2">
                        <span className="text-slate-500 flex items-center gap-1"><CreditCard className="w-3 h-3" /> License</span>
                        <div className="text-right">
                           <span className="text-slate-300 font-mono block">{driver.license}</span>
                           {(exp || expiring) && (
                              <span className={`text-[9px] font-bold ${exp ? 'text-red-500' : 'text-amber-500'} flex items-center justify-end gap-1`}>
                                 <AlertTriangle className="w-3 h-3" /> {exp ? 'EXPIRED' : 'EXPIRING SOON'}
                              </span>
                           )}
                        </div>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1"><Truck className="w-3 h-3" /> Vehicle</span>
                        <span className="text-slate-300">{driver.vehicle}</span>
                     </div>
                     <div className="flex justify-between text-xs">
                        <span className="text-slate-500 flex items-center gap-1"><Phone className="w-3 h-3" /> Contact</span>
                        <span className="text-slate-300">{driver.phone}</span>
                     </div>
                  </div>

                  {/* Status & Action */}
                  <div className="mt-auto relative z-10">
                     <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                           driver.status === 'Active' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 
                           driver.status === 'In Transit' ? 'bg-amber-900/20 text-amber-400 border-amber-500/30' :
                           'bg-slate-800 text-slate-400 border-slate-600'
                        }`}>
                           {driver.status}
                        </span>
                     </div>
                     <button 
                        onClick={() => handleOpenManage(driver)}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 border border-slate-700 hover:text-white hover:border-indigo-500/50 transition-all shadow-lg"
                     >
                        <User className="w-3 h-3" /> Full Profile
                     </button>
                  </div>
               </div>
            );
         })}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isFormOpen && (
         <Modal title={selectedDriver ? "EDIT PERSONNEL RECORD" : "ONBOARD NEW DRIVER"} onClose={() => setIsFormOpen(false)}>
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">Full Name</label>
                     <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">Phone</label>
                     <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">License ID</label>
                     <input className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        value={formData.license} onChange={e => setFormData({...formData, license: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">License Expiry</label>
                     <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        value={formData.licenseExpiry} onChange={e => setFormData({...formData, licenseExpiry: e.target.value})} />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">Assigned Role</label>
                     <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option>Driver</option>
                        <option>Loader</option>
                        <option>Mechanic</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold">Current Status</label>
                     <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none" 
                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                        <option>Active</option>
                        <option>In Transit</option>
                        <option>On Leave</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold">Assigned Vehicle</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:border-indigo-500 outline-none"
                     value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})}>
                     <option>Unassigned</option>
                     <option>GJ-27-X-1234 (Big Eicher)</option>
                     <option>GJ-27-Y-5678 (Small Eicher)</option>
                     <option>GJ-27-Z-3456 (Bolero)</option>
                     <option>GJ-01-C-1122 (Small Carry)</option>
                  </select>
               </div>

               <button onClick={handleFormSubmit} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg transition-all mt-4">
                  {selectedDriver ? "Save Changes" : "Register Personnel"}
               </button>
            </div>
         </Modal>
      )}

      {/* --- MANAGEMENT MODAL --- */}
      {isManageOpen && selectedDriver && (
         <DriverManagementModal 
            driver={selectedDriver} 
            onClose={() => setIsManageOpen(false)} 
            onSave={(updated) => {
               onUpdateDriver(updated);
               setIsManageOpen(false);
            }} 
         />
      )}

    </div>
  );
};

// --- SUB-COMPONENT: DRIVER MANAGEMENT MODAL ---

interface ManageModalProps {
  driver: Driver;
  onClose: () => void;
  onSave: (driver: Driver) => void;
}

const DriverManagementModal: React.FC<ManageModalProps> = ({ driver, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ATTENDANCE' | 'PAYROLL'>('PROFILE');
  const [data, setData] = useState<Driver>(driver);
  
  // Payroll State
  const [history, setHistory] = useState<PaymentRecord[]>(driver.paymentHistory || []);
  const [attendance, setAttendance] = useState<AttendanceData>(driver.attendance || {});

  // Handlers
  const handleUpdateFinancials = (key: keyof FinancialData, val: any) => {
    setData({ ...data, financials: { ...data.financials, [key]: val } });
  };

  const handleProcessPayment = () => {
    const net = Number(data.financials.baseSalary) + Number(data.financials.bonus) - Number(data.financials.deductions);
    const newRecord: PaymentRecord = {
       id: `PAY-${Date.now()}`,
       date: new Date().toISOString().split('T')[0],
       month: 'Current Month',
       amount: net,
       type: 'Salary',
       status: 'Paid',
       note: 'Manual Settlement'
    };
    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    setData({ ...data, financials: { ...data.financials, status: 'Paid' }, paymentHistory: updatedHistory });
  };

  const toggleAttendance = (day: number) => {
     const statuses = ['PRESENT', 'HALF', 'LEAVE', 'OFF'];
     const current = attendance[day] || 'PRESENT';
     const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
     setAttendance({ ...attendance, [day]: next });
  };

  const handleSaveAll = () => {
    onSave({ ...data, attendance, paymentHistory: history });
  };

  // Calendar Prep
  const daysInMonth = 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Modal title={`MANAGEMENT CONSOLE: ${driver.name.toUpperCase()}`} onClose={onClose} maxWidth="max-w-4xl">
       <div className="flex gap-4 mb-6 border-b border-slate-700 pb-2 overflow-x-auto">
          <button onClick={() => setActiveTab('PROFILE')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${activeTab === 'PROFILE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
             <User className="w-4 h-4" /> Profile
          </button>
          <button onClick={() => setActiveTab('ATTENDANCE')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${activeTab === 'ATTENDANCE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
             <CalendarDays className="w-4 h-4" /> Attendance
          </button>
          <button onClick={() => setActiveTab('PAYROLL')} className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 ${activeTab === 'PAYROLL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
             <Wallet className="w-4 h-4" /> Payroll
          </button>
       </div>

       <div className="min-h-[400px]">
          {activeTab === 'PROFILE' && (
             <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="space-y-6">
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Core Identity</h4>
                      <div className="space-y-3">
                         <div>
                            <label className="text-[10px] text-indigo-400 uppercase font-bold">Full Name</label>
                            <input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm" />
                         </div>
                         <div>
                            <label className="text-[10px] text-indigo-400 uppercase font-bold">Contact Phone</label>
                            <input value={data.phone} onChange={e => setData({...data, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm" />
                         </div>
                         <div>
                            <label className="text-[10px] text-indigo-400 uppercase font-bold">Role</label>
                            <input value={data.role} onChange={e => setData({...data, role: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm" />
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Operations</h4>
                      <div className="space-y-3">
                         <div>
                            <label className="text-[10px] text-indigo-400 uppercase font-bold">Assigned Vehicle</label>
                            <select value={data.vehicle} onChange={e => setData({...data, vehicle: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm">
                               <option>Unassigned</option>
                               <option>GJ-27-X-1234 (Big Eicher)</option>
                               <option>GJ-27-Y-5678 (Small Eicher)</option>
                               <option>GJ-27-Z-3456 (Bolero)</option>
                            </select>
                         </div>
                         <div>
                            <label className="text-[10px] text-indigo-400 uppercase font-bold">Current Status</label>
                            <select value={data.status} onChange={e => setData({...data, status: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm">
                               <option>Active</option>
                               <option>In Transit</option>
                               <option>On Leave</option>
                            </select>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-4">Legal Documents</h4>
                      <div className="space-y-3">
                         <div>
                            <label className="text-[10px] text-indigo-400 uppercase font-bold">Driving License</label>
                            <input value={data.license} onChange={e => setData({...data, license: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-sm" />
                         </div>
                         <div>
                            <label className="text-[10px] text-indigo-400 uppercase font-bold">Expiry Date</label>
                            <input type="date" value={data.licenseExpiry} onChange={e => setData({...data, licenseExpiry: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono text-sm" />
                         </div>
                      </div>
                      <div className="mt-4 p-3 bg-slate-800 rounded border border-slate-700 flex items-start gap-3">
                         <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                         <p className="text-xs text-slate-400 leading-relaxed">
                            System automatically flags licenses expiring within 30 days. Ensure renewal process is initiated 1 week prior to expiry to avoid fleet downtime.
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'ATTENDANCE' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center">
                   <h4 className="text-lg font-bold text-white">MAY 2024</h4>
                   <div className="flex gap-2 text-[10px] uppercase font-bold">
                      <span className="px-2 py-1 bg-green-900/20 text-green-400 rounded border border-green-500/30">Present</span>
                      <span className="px-2 py-1 bg-amber-900/20 text-amber-400 rounded border border-amber-500/30">Half Day</span>
                      <span className="px-2 py-1 bg-red-900/20 text-red-400 rounded border border-red-500/30">Leave</span>
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded border border-slate-700">Off</span>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                   {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
                      <div key={d} className="text-center text-xs font-bold text-slate-600 py-2">{d}</div>
                   ))}
                   {[0,1,2].map(b => <div key={`b-${b}`} />)}
                   {days.map(d => {
                      const st = attendance[d] || 'PRESENT';
                      return (
                         <button 
                            key={d} 
                            onClick={() => toggleAttendance(d)}
                            className={`aspect-square rounded-lg border flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                               st === 'PRESENT' ? 'bg-green-900/10 border-green-500/20 text-green-400' :
                               st === 'HALF' ? 'bg-amber-900/10 border-amber-500/20 text-amber-400' :
                               st === 'LEAVE' ? 'bg-red-900/10 border-red-500/20 text-red-400' :
                               'bg-slate-800 border-slate-700 text-slate-500'
                            }`}
                         >
                            <span className="text-sm font-bold">{d}</span>
                            <span className="text-[7px] uppercase font-bold">{st}</span>
                         </button>
                      )
                   })}
                </div>
             </div>
          )}

          {activeTab === 'PAYROLL' && (
             <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                   <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">Salary Config</h4>
                   <div className="space-y-1">
                      <label className="text-xs text-slate-500 uppercase font-bold">Base Salary</label>
                      <input type="number" value={data.financials.baseSalary} onChange={e => handleUpdateFinancials('baseSalary', e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-green-500 uppercase font-bold">Bonus / Overtime</label>
                      <input type="number" value={data.financials.bonus} onChange={e => handleUpdateFinancials('bonus', e.target.value)} className="w-full bg-slate-950 border border-green-900/50 rounded p-2 text-green-400 font-mono" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-xs text-red-500 uppercase font-bold">Deductions</label>
                      <input type="number" value={data.financials.deductions} onChange={e => handleUpdateFinancials('deductions', e.target.value)} className="w-full bg-slate-950 border border-red-900/50 rounded p-2 text-red-400 font-mono" />
                   </div>
                   <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center">
                      <span className="font-bold text-white">Net Payable</span>
                      <span className="text-xl font-bold text-indigo-400 font-mono">
                         ₹{(Number(data.financials.baseSalary) + Number(data.financials.bonus) - Number(data.financials.deductions)).toLocaleString()}
                      </span>
                   </div>
                   <button 
                      onClick={handleProcessPayment}
                      disabled={data.financials.status === 'Paid'}
                      className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                         data.financials.status === 'Paid' ? 'bg-green-600/50 cursor-not-allowed text-green-200' : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'
                      }`}
                   >
                      <DollarSign className="w-4 h-4" /> {data.financials.status === 'Paid' ? 'Disbursed' : 'Process Payment'}
                   </button>
                </div>

                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 flex flex-col">
                   <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <History className="w-4 h-4" /> Transaction Ledger
                   </h4>
                   <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar space-y-2">
                      {history.length > 0 ? history.map(rec => (
                         <div key={rec.id} className="p-3 bg-slate-800/50 rounded border border-slate-700 flex justify-between items-center text-xs">
                            <div>
                               <p className="text-indigo-300 font-mono">{rec.id}</p>
                               <p className="text-slate-500">{rec.date}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-white font-bold">₹{rec.amount.toLocaleString()}</p>
                               <p className="text-green-400">{rec.status}</p>
                            </div>
                         </div>
                      )) : (
                         <div className="text-center py-10 text-slate-600 italic">No transaction history found.</div>
                      )}
                   </div>
                </div>
             </div>
          )}
       </div>

       <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button onClick={onClose} className="px-6 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 font-bold transition-all">Cancel</button>
          <button onClick={handleSaveAll} className="px-8 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 font-bold shadow-lg transition-all flex items-center gap-2">
             <Save className="w-4 h-4" /> Save Changes
          </button>
       </div>
    </Modal>
  );
};
