import React, { useState } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Search, 
  FileText, 
  LogOut, 
  User, 
  MapPin, 
  Truck, 
  Phone, 
  Mail, 
  Building2,
  Download,
  AlertCircle,
  Plus,
  X,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Navigation,
  Scale,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Bell,
  MoreVertical,
  ExternalLink,
  ThumbsUp,
  CalendarCheck
} from 'lucide-react';
import { Client, Shipment, Invoice, ShipmentStatus, ClientTier, DeliveryStop, StopStatus } from '../types';

interface ClientPortalProps {
  client: Client;
  shipments: Shipment[];
  invoices: Invoice[];
  onLogout: () => void;
  onAddBooking: (shipment: Shipment) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, shipments, invoices, onLogout, onAddBooking }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'HISTORY' | 'BILLING' | 'PROFILE'>('DASHBOARD');
  const [searchTerm, setSearchTerm] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);

  // Filter only for this client
  const myShipments = shipments.filter(s => s.client.toLowerCase() === client.companyName.toLowerCase());
  const myInvoices = invoices.filter(inv => inv.client.toLowerCase() === client.companyName.toLowerCase());

  const activeShipments = myShipments.filter(s => s.status !== ShipmentStatus.DELIVERED);
  const completedCount = myShipments.filter(s => s.status === ShipmentStatus.DELIVERED).length;
  const pendingPaymentCount = myInvoices.filter(i => i.status !== 'Paid').length;

  // --- BOOKING WIZARD STATE ---
  const [isMultiStop, setIsMultiStop] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    origin: '',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTimeWindow: 'Morning (9 AM - 12 PM)',
    customTime: '',
    goodsType: '',
    instructions: ''
  });
  const [wizardStops, setWizardStops] = useState<Partial<DeliveryStop>[]>([
    { id: '1', sequence: 1, address: '', contactName: '', contactPhone: '', payloadDescription: '', weight: 0, callBeforeDelivery: true, status: StopStatus.PENDING }
  ]);

  const totalBookingWeight = wizardStops.reduce((acc, stop) => acc + (Number(stop.weight) || 0), 0);

  const handleAddStop = () => {
    setWizardStops([...wizardStops, { 
      id: String(Date.now()), 
      sequence: wizardStops.length + 1, 
      address: '', 
      contactName: '', 
      contactPhone: '', 
      payloadDescription: '', 
      weight: 0, 
      callBeforeDelivery: true, 
      status: StopStatus.PENDING 
    }]);
  };

  const handleRemoveStop = (id: string) => {
    if (wizardStops.length > 1) {
      setWizardStops(wizardStops.filter(s => s.id !== id).map((s, i) => ({ ...s, sequence: i + 1 })));
    }
  };

  const handleUpdateStop = (id: string, field: keyof DeliveryStop, value: any) => {
    setWizardStops(wizardStops.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTime = bookingForm.pickupTimeWindow === 'CUSTOM' ? bookingForm.customTime : bookingForm.pickupTimeWindow;
    
    const newShipment: Shipment = {
      id: `ST-REQ-${Date.now().toString().slice(-6)}`,
      client: client.companyName,
      origin: bookingForm.origin,
      status: ShipmentStatus.BOOKED,
      date: new Date().toISOString().split('T')[0],
      pickupDate: bookingForm.pickupDate,
      pickupTimeWindow: finalTime,
      vehicle: 'Awaiting Assignment',
      goodsType: bookingForm.goodsType,
      totalWeight: totalBookingWeight,
      stops: wizardStops as DeliveryStop[],
      isMultiStop,
      isNonFragile: true,
      isNonPerishable: true,
      instructions: bookingForm.instructions,
      timeline: [{ status: ShipmentStatus.BOOKED, timestamp: new Date().toISOString(), location: 'Client Portal', note: 'Manifest requested by client.' }]
    };
    
    onAddBooking(newShipment);
    setIsSuccess(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setTimeout(() => {
      setIsSuccess(false);
      resetForm();
    }, 300);
  };

  const resetForm = () => {
    setBookingForm({ 
      origin: '', 
      pickupDate: new Date().toISOString().split('T')[0], 
      pickupTimeWindow: 'Morning (9 AM - 12 PM)',
      customTime: '',
      goodsType: '', 
      instructions: '' 
    });
    setWizardStops([{ id: '1', sequence: 1, address: '', contactName: '', contactPhone: '', payloadDescription: '', weight: 0, callBeforeDelivery: true, status: StopStatus.PENDING }]);
    setIsMultiStop(false);
  };

  const StatusTag = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      [ShipmentStatus.BOOKED]: 'bg-slate-800 text-slate-400 border-slate-700',
      [ShipmentStatus.IN_TRANSIT]: 'bg-indigo-900/30 text-indigo-400 border-indigo-500/20',
      [ShipmentStatus.DELIVERED]: 'bg-green-900/30 text-green-400 border-green-500/20',
      [ShipmentStatus.DISPATCHED]: 'bg-blue-900/30 text-blue-400 border-blue-500/20',
      [ShipmentStatus.PARTIALLY_DELIVERED]: 'bg-amber-900/30 text-amber-400 border-amber-500/20',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${styles[status] || 'bg-slate-800 text-slate-400'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col md:flex-row">
      
      {/* --- SIDE NAVIGATION --- */}
      <aside className="w-full md:w-72 glass-panel border-r border-slate-800/50 flex flex-col z-30 shrink-0">
        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between md:block">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight uppercase">Shakti<span className="text-indigo-400">.OS</span></h1>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Client Terminal</p>
            </div>
          </div>
          <button onClick={onLogout} className="md:hidden p-2 text-slate-500 hover:text-white transition-colors"><LogOut className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'DASHBOARD', icon: Package, label: 'Active Manifests' },
            { id: 'HISTORY', icon: Clock, label: 'Audit Archive' },
            { id: 'BILLING', icon: FileText, label: 'Financial Ledger' },
            { id: 'PROFILE', icon: User, label: 'Corporate Entity' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group active:scale-95 ${
                activeTab === tab.id 
                  ? 'bg-indigo-600/10 text-white border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.05)]' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
              <span className="text-sm font-bold tracking-wide uppercase text-[11px]">{tab.label}</span>
              {activeTab === tab.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50 hidden md:block">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 mb-6">
             <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Support Desk</p>
             <p className="text-xs text-indigo-400 font-bold">+91 97222 29491</p>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-red-400 transition-colors py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-500/20 active:scale-95">
            <LogOut className="w-4 h-4" /> Terminate Session
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950/50 backdrop-blur-3xl overflow-y-auto custom-scrollbar">
        
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-20 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
          <div>
            <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-2">{client.tier} TIER PARTNER</p>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{client.companyName}</h2>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none md:w-64 hidden sm:block">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                <input 
                  placeholder="SEARCH MANIFESTS..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none transition-all uppercase tracking-widest"
                />
             </div>
             <button 
              onClick={() => setIsBookingModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2 text-[10px]"
            >
              <Plus className="w-4 h-4" /> New Booking
            </button>
          </div>
        </header>

        <div className="p-6 md:p-12">
          
          {/* --- DASHBOARD VIEW --- */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
              
              {/* STATS STRIP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Active Manifests', value: activeShipments.length, icon: Package, color: 'indigo' },
                  { label: 'Completed (MTD)', value: completedCount, icon: CheckCircle2, color: 'green' },
                  { label: 'Unpaid Invoices', value: pendingPaymentCount, icon: AlertCircle, color: 'amber' },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-3xl group-hover:bg-${stat.color}-500/10 transition-all`}></div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 bg-${stat.color}-500/10 rounded-2xl border border-${stat.color}-500/20`}><stat.icon className={`w-5 h-5 text-${stat.color}-400`} /></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    </div>
                    <h3 className="text-4xl font-black text-white font-mono">{stat.value}</h3>
                  </div>
                ))}
              </div>

              {/* ACTIVE SHIPMENTS GRID */}
              <div>
                <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Navigation className="w-4 h-4 text-indigo-400" /> Operational Grid
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                    Live Updates
                  </div>
                </div>

                {activeShipments.length === 0 ? (
                  <div className="py-32 text-center bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800">
                    <Package className="w-16 h-16 text-slate-800 mx-auto mb-4 opacity-50" />
                    <h4 className="text-slate-500 uppercase tracking-[0.2em] text-[11px] font-black">No Active Loads Detected</h4>
                    <p className="text-slate-600 text-[10px] uppercase font-mono mt-2">All manifest nodes currently clear.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {activeShipments.map(s => (
                      <div key={s.id} className="bg-slate-900/40 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all group overflow-hidden flex flex-col">
                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-800/30">
                          <div className="flex gap-6 items-center">
                             <div>
                                <p className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-widest">{s.date}</p>
                                <h4 className="text-xl font-black text-white font-mono tracking-tighter uppercase">{s.id}</h4>
                             </div>
                             <div className="h-8 w-px bg-slate-800"></div>
                             <div>
                                <p className="text-[9px] text-indigo-400 font-black uppercase tracking-tighter">Assigned Fleet Unit</p>
                                <p className="text-xs font-bold text-slate-300 uppercase">{s.vehicle}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
                             <StatusTag status={s.status} />
                             <button 
                                onClick={() => setExpandedShipmentId(expandedShipmentId === s.id ? null : s.id)}
                                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-all"
                             >
                                {expandedShipmentId === s.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                             </button>
                          </div>
                        </div>

                        {/* TRIP OVERVIEW STRIP */}
                        <div className="p-6 md:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 bg-black/20">
                           <div><p className="text-[8px] text-slate-600 font-black uppercase mb-1">Origin Node</p><p className="text-[10px] font-bold text-white uppercase">{s.origin}</p></div>
                           <div><p className="text-[8px] text-slate-600 font-black uppercase mb-1">Nodes</p><p className="text-[10px] font-bold text-white uppercase">{s.stops.length || 1} Stop(s)</p></div>
                           <div><p className="text-[8px] text-slate-600 font-black uppercase mb-1">Cargo Class</p><p className="text-[10px] font-bold text-white uppercase truncate">{s.goodsType}</p></div>
                           <div><p className="text-[8px] text-slate-600 font-black uppercase mb-1">Payload Weight</p><p className="text-[10px] font-black text-indigo-400 font-mono">{s.totalWeight} Tons</p></div>
                        </div>

                        {/* EXPANDED NODE TRACKER */}
                        {expandedShipmentId === s.id && (
                           <div className="p-8 border-t border-slate-800/50 animate-in slide-in-from-top-4 duration-300 space-y-8 bg-slate-900/30">
                              <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                <Navigation className="w-3 h-3" /> Sequential Manifest Node Tracking
                              </h5>
                              <div className="space-y-6 pl-4 relative">
                                 {/* Vertical Line */}
                                 <div className="absolute left-[23px] top-6 bottom-6 w-px bg-slate-800 border-l border-dashed border-slate-700"></div>

                                 {s.stops.length > 0 ? s.stops.map((stop, idx) => (
                                    <div key={stop.id} className="relative flex gap-6 group/node">
                                       <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                                          stop.status === StopStatus.DELIVERED ? 'bg-green-500/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 
                                          stop.status === StopStatus.OUT_FOR_DELIVERY ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] animate-pulse' : 
                                          'bg-slate-900 border-slate-700'
                                       }`}>
                                          {stop.status === StopStatus.DELIVERED ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <span className="text-[10px] font-black text-white">{idx + 1}</span>}
                                       </div>
                                       <div className="flex-1 bg-slate-950/40 p-5 rounded-2xl border border-slate-800 group-hover/node:border-indigo-500/20 transition-all">
                                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                             <div>
                                                <div className="text-[11px] font-black text-white uppercase tracking-wide">{stop.address}</div>
                                                <div className="text-[8px] text-slate-600 font-mono mt-0.5">TARGET NODE IDENTITY: {stop.id.slice(-6)}</div>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                                   stop.status === StopStatus.DELIVERED ? 'bg-green-900/20 text-green-400 border-green-500/30' :
                                                   stop.status === StopStatus.OUT_FOR_DELIVERY ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500/30' :
                                                   'bg-slate-900 text-slate-500 border-slate-800'
                                                }`}>
                                                   {stop.status}
                                                </span>
                                                {stop.status === StopStatus.DELIVERED && (
                                                   <button className="p-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-400 rounded-lg border border-slate-800 transition-colors" title="Download POD">
                                                      <FileCheck className="w-3.5 h-3.5" />
                                                   </button>
                                                )}
                                             </div>
                                          </div>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[9px] uppercase font-black text-slate-500">
                                             <div><span className="block mb-1 opacity-50">Recipient</span><span className="text-slate-300 font-bold">{stop.contactName}</span></div>
                                             <div><span className="block mb-1 opacity-50">Stop Payload</span><span className="text-slate-300 font-bold">{stop.payloadDescription}</span></div>
                                             <div><span className="block mb-1 opacity-50">Node Weight</span><span className="text-indigo-400 font-mono font-bold">{stop.weight} TONS</span></div>
                                             <div><span className="block mb-1 opacity-50">Protocol</span><span className="text-slate-300 font-bold">{stop.callBeforeDelivery ? 'CALL REQ' : 'DIRECT'}</span></div>
                                          </div>
                                       </div>
                                    </div>
                                 )) : (
                                    <div className="p-10 text-center text-slate-600 italic text-[10px]">Manifest parameters await processing...</div>
                                 )}
                              </div>
                              <div className="flex justify-end pt-4 border-t border-slate-800/50">
                                 <button className="flex items-center gap-2 text-[9px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">
                                    <Download className="w-3.5 h-3.5" /> Export Manifest PDF
                                 </button>
                              </div>
                           </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- HISTORY VIEW --- */}
          {activeTab === 'HISTORY' && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500 space-y-8">
              <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                <div className="relative flex-1 w-full">
                   <Search className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                   <input 
                     type="text" 
                     placeholder="FILTER BY MANIFEST ID OR DESTINATION..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase tracking-widest"
                   />
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                   <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 border border-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-xl hover:text-white hover:border-slate-700 transition-all">All Time</button>
                   <button className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 border border-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-xl hover:text-white hover:border-slate-700 transition-all">Export Archive</button>
                </div>
              </div>

              <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-[10px] text-slate-600 uppercase font-black tracking-widest bg-slate-950 border-b border-slate-800">
                      <tr>
                        <th className="px-8 py-6">Manifest ID</th>
                        <th className="px-8 py-6">Finalized On</th>
                        <th className="px-8 py-6">Route Node Summary</th>
                        <th className="px-8 py-6">Cargo Group</th>
                        <th className="px-8 py-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {myShipments.filter(s => s.id.includes(searchTerm) || s.goodsType.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                        <tr key={s.id} className="hover:bg-slate-900/40 transition-all group">
                          <td className="px-8 py-6 font-mono text-indigo-400 font-black tracking-tighter uppercase group-hover:text-indigo-200">{s.id}</td>
                          <td className="px-8 py-6 text-slate-500 font-mono text-[11px]">{s.date}</td>
                          <td className="px-8 py-6">
                             <div className="text-slate-300 font-bold text-[11px] uppercase tracking-wide flex items-center gap-2">
                                {s.origin} <ArrowRight className="w-3 h-3 text-slate-600" /> {s.stops.length > 1 ? `${s.stops.length} Nodes` : s.stops[0]?.address}
                             </div>
                          </td>
                          <td className="px-8 py-6 text-slate-500 font-bold text-[11px] uppercase">{s.goodsType}</td>
                          <td className="px-8 py-6 text-right">
                             <StatusTag status={s.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {myShipments.length === 0 && <div className="p-32 text-center text-slate-600 italic uppercase text-[10px] font-black tracking-widest">No historical data logs found in archive.</div>}
                </div>
              </div>
            </div>
          )}

          {/* --- BILLING VIEW --- */}
          {activeTab === 'BILLING' && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500 grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-indigo-400" /> Manifest Billing Ledger
                   </h3>
                </div>
                
                <div className="space-y-4">
                  {myInvoices.map(inv => (
                    <div key={inv.id} className="bg-slate-900/40 p-6 md:p-8 rounded-[2rem] border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group transition-all hover:border-slate-700 hover:shadow-xl">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-black text-white font-mono tracking-tighter uppercase">{inv.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-widest border ${
                            inv.status === 'Paid' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-amber-900/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Emission Cycle: {inv.date}</p>
                      </div>
                      <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-end items-center sm:items-end">
                        <p className="text-2xl font-black text-white font-mono mb-2">₹{Number(inv.amount).toLocaleString()}</p>
                        <button className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-white flex items-center gap-2 group/btn">
                          <Download className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 transition-transform" /> Download PDF
                        </button>
                      </div>
                    </div>
                  ))}
                  {myInvoices.length === 0 && <div className="p-32 text-center text-slate-600 italic uppercase text-[10px] font-black tracking-widest">No billing nodes detected for current cycle.</div>}
                </div>
              </div>

              <div className="space-y-8">
                 <div className="bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-20 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Financial Overview</h4>
                    <div className="space-y-6">
                       <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Settled Capital</span>
                          <span className="text-xl font-black text-green-400 font-mono">₹{myInvoices.filter(i => i.status === 'Paid').reduce((a,c) => a+Number(c.amount), 0).toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Current Dues</span>
                          <span className="text-xl font-black text-amber-400 font-mono">₹{myInvoices.filter(i => i.status !== 'Paid').reduce((a,c) => a+Number(c.amount), 0).toLocaleString()}</span>
                       </div>
                       <div className="pt-6">
                          <button className="w-full bg-slate-950 border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" /> Request Statement
                          </button>
                       </div>
                    </div>
                 </div>
                 
                 <div className="bg-indigo-600/10 p-8 rounded-3xl border border-indigo-500/20">
                    <div className="flex items-center gap-3 mb-4">
                       <AlertCircle className="w-5 h-5 text-indigo-400" />
                       <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Payment Protocol</h5>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-wide">
                       Invoices are issued per manifest completion. Monthly contract accounts are settled on the 5th of every cycle. For discrepancies, contact the Shakti.OS accounting node.
                    </p>
                 </div>
              </div>
            </div>
          )}

          {/* --- PROFILE VIEW --- */}
          {activeTab === 'PROFILE' && (
            <div className="animate-in fade-in slide-in-from-right-6 duration-500 max-w-2xl mx-auto space-y-12">
               <div className="bg-slate-900/40 p-16 rounded-[3rem] border border-slate-800 text-center relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                  <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white mx-auto mb-8 shadow-[0_0_50px_rgba(79,70,229,0.4)] border border-indigo-400/30">
                     {client.companyName.charAt(0)}
                  </div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{client.companyName}</h2>
                  <p className="text-indigo-400 font-black text-[11px] uppercase tracking-[0.4em]">{client.tier} CLASS CORPORATE ENTITY</p>
               </div>

               <div className="bg-slate-900/40 p-12 rounded-[3rem] border border-slate-800 space-y-10 shadow-2xl">
                  <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] border-b border-slate-800 pb-6">Authorized Data Nodes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                     <div className="space-y-1">
                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-2">Primary Executive</p>
                        <p className="text-white font-black text-sm uppercase tracking-wide">{client.contactPerson}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-2">Secure Email Identity</p>
                        <p className="text-white font-bold text-sm tracking-tight">{client.email}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-2">Comms Channel</p>
                        <p className="text-white font-bold text-sm tracking-widest">{client.phone}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-2">Registration Cycle</p>
                        <p className="text-white font-bold text-sm uppercase tracking-widest">{client.joinedDate}</p>
                     </div>
                  </div>
                  <div className="pt-10 border-t border-slate-800">
                     <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mb-4">Master Billing Terminal</p>
                     <div className="flex gap-4 items-start">
                        <MapPin className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                        <p className="text-slate-300 text-xs font-bold leading-relaxed uppercase tracking-wider">{client.address}</p>
                     </div>
                  </div>
                  <div className="pt-8 flex justify-center">
                     <button className="px-8 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-indigo-400 hover:border-indigo-500/20 transition-all">
                        Request Profile Modification
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* --- NOTIFICATION CENTER (SIMULATED) --- */}
      <div className="fixed bottom-24 right-8 z-40 hidden lg:block">
         <button className="p-4 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-600/30 text-white hover:bg-indigo-500 transition-all relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-slate-950 rounded-full animate-ping"></span>
         </button>
      </div>

      {/* --- MANIFEST REQUEST MODAL --- */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={closeBookingModal}></div>
          <div className="glass-panel w-full max-w-4xl rounded-[2.5rem] border border-indigo-500/30 relative z-10 animate-in zoom-in duration-300 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col max-h-[95vh] overflow-hidden">
            
            {isSuccess ? (
              /* SUCCESS STATE UI */
              <div className="p-12 md:p-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-500/10 rounded-full border border-green-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                  <ThumbsUp className="w-12 h-12 text-green-500" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-4">Manifest Initialized</h3>
                  <p className="text-slate-400 text-lg max-w-lg mx-auto font-medium leading-relaxed uppercase tracking-widest">
                    Thank you for booking with <span className="text-indigo-400">Shakti Transport</span>. Our operations team will contact you shortly to confirm fleet assignment.
                  </p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 max-w-sm mx-auto">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2">Protocol Response Time</p>
                   <p className="text-indigo-400 font-mono text-xl font-bold">{'<'} 15 MINUTES</p>
                </div>
                <button 
                  onClick={closeBookingModal}
                  className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 text-xs"
                >
                  Back to Dashboard
                </button>
              </div>
            ) : (
              /* WIZARD FORM UI */
              <>
                <div className="p-8 border-b border-slate-800 bg-indigo-900/10 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-600/30"><Package className="w-7 h-7 text-white" /></div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Manifest Request Wizard</h3>
                      <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-[0.3em]">Operational Protocol Initialization</p>
                    </div>
                  </div>
                  <button onClick={closeBookingModal} className="text-slate-500 hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleBookingSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    
                    {/* Master Details Left */}
                    <div className="lg:col-span-2 space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3"><ArrowRight className="w-4 h-4 text-indigo-500" /> Core Logisitcs</h4>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-indigo-400 uppercase ml-1 tracking-widest">Base Origin Node</label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                              <input required value={bookingForm.origin} onChange={e => setBookingForm({...bookingForm, origin: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase tracking-widest" placeholder="WH-1 / KALOL BASE" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-indigo-400 uppercase ml-1 tracking-widest">Pickup Schedule</label>
                            <div className="grid grid-cols-1 gap-3">
                              <div className="relative">
                                <CalendarCheck className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                                <input required type="date" value={bookingForm.pickupDate} onChange={e => setBookingForm({...bookingForm, pickupDate: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none tracking-widest" />
                              </div>
                              <div className="relative">
                                <Clock className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                                <select 
                                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase tracking-widest appearance-none"
                                  value={bookingForm.pickupTimeWindow}
                                  onChange={e => setBookingForm({...bookingForm, pickupTimeWindow: e.target.value})}
                                >
                                  <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                                  <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                                  <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                                  <option value="Night (8 PM - 11 PM)">Night (8 PM - 11 PM)</option>
                                  <option value="CUSTOM">Custom Timing...</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-slate-500 pointer-events-none" />
                              </div>

                              {bookingForm.pickupTimeWindow === 'CUSTOM' && (
                                <div className="animate-in slide-in-from-top-2 duration-300">
                                  <input 
                                    required 
                                    value={bookingForm.customTime} 
                                    onChange={e => setBookingForm({...bookingForm, customTime: e.target.value})} 
                                    className="w-full bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase tracking-widest placeholder:text-slate-700" 
                                    placeholder="Enter preferred time (e.g. 3:30 PM)" 
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[9px] font-black text-indigo-400 uppercase ml-1 tracking-widest">Primary Cargo Classification</label>
                            <input required value={bookingForm.goodsType} onChange={e => setBookingForm({...bookingForm, goodsType: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase tracking-widest" placeholder="INDUSTRIAL PVC / METALS" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 pt-10 border-t border-slate-800">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3"><Scale className="w-4 h-4 text-indigo-500" /> Compliance Protocols</h4>
                        <div className="space-y-4">
                          <div className="p-5 bg-slate-900/50 rounded-3xl border border-slate-800">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[9px] font-black text-slate-500 uppercase">Aggregated Payload</span>
                              <span className={`text-xs font-mono font-black ${totalBookingWeight > 7 ? 'text-red-400' : 'text-indigo-400'}`}>{totalBookingWeight.toFixed(1)} TONS</span>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-500 ${totalBookingWeight > 7 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, (totalBookingWeight / 7) * 100)}%` }}></div>
                            </div>
                            <p className="mt-3 text-[8px] text-slate-600 font-mono uppercase">Reference: Standard Eicher Max Payload 7.0T</p>
                          </div>
                          <label className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-5 h-5 rounded border border-slate-700 bg-slate-900 flex items-center justify-center group-hover:border-indigo-500 transition-all">
                              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Verify Non-Fragile Goods</span>
                          </label>
                          <label className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-5 h-5 rounded border border-slate-700 bg-slate-900 flex items-center justify-center group-hover:border-indigo-500 transition-all">
                              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Verify Non-Perishable Goods</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Nodes Right */}
                    <div className="lg:col-span-3 space-y-8">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3"><Navigation className="w-4 h-4 text-indigo-400" /> Manifest Node Definition</h4>
                        <div className="flex items-center gap-4 bg-slate-900/80 p-2 px-4 rounded-full border border-slate-800">
                          <span className="text-[9px] text-slate-500 font-black uppercase">Multi-Stop Drop</span>
                          <button 
                            type="button"
                            onClick={() => setIsMultiStop(!isMultiStop)}
                            className={`w-10 h-5 rounded-full relative transition-all ${isMultiStop ? 'bg-indigo-600' : 'bg-slate-700'}`}
                          >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isMultiStop ? 'left-6' : 'left-1'}`}></div>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar pr-4">
                        {wizardStops.map((stop, idx) => (
                          <div key={stop.id} className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-slate-800 relative group/wizard animate-in slide-in-from-right-8 duration-500">
                            <div className="absolute -left-3 top-8 w-8 h-8 bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-700 text-[11px] font-black text-indigo-400 shadow-2xl">{idx + 1}</div>
                            
                            {wizardStops.length > 1 && (
                              <button type="button" onClick={() => handleRemoveStop(stop.id!)} className="absolute top-6 right-6 p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><X className="w-4 h-4" /></button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <label className="text-[8px] font-black text-slate-500 uppercase ml-1 tracking-widest">Delivery Terminal Address</label>
                                  <input required className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase tracking-widest" placeholder="DESTINATION CITY / FACTORY" value={stop.address} onChange={e => handleUpdateStop(stop.id!, 'address', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-black text-slate-500 uppercase ml-1 tracking-widest">Recipient</label>
                                    <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase" placeholder="NAME" value={stop.contactName} onChange={e => handleUpdateStop(stop.id!, 'contactName', e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-black text-slate-500 uppercase ml-1 tracking-widest">Node Comms</label>
                                    <input required className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-black text-white focus:border-indigo-500 outline-none" placeholder="+91" value={stop.contactPhone} onChange={e => handleUpdateStop(stop.id!, 'contactPhone', e.target.value)} />
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-6">
                                <div className="space-y-2">
                                  <label className="text-[8px] font-black text-slate-500 uppercase ml-1 tracking-widest">Stop-Specific Payload</label>
                                  <input required className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-[10px] font-black text-white focus:border-indigo-500 outline-none uppercase tracking-widest" placeholder="E.G. 20 PALLETS OF PVC" value={stop.payloadDescription} onChange={e => handleUpdateStop(stop.id!, 'payloadDescription', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-[8px] font-black text-slate-500 uppercase ml-1 tracking-widest">Weight (Tons)</label>
                                    <input required type="number" step="0.1" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-black text-indigo-400 focus:border-indigo-500 outline-none font-mono" placeholder="0.0" value={stop.weight} onChange={e => handleUpdateStop(stop.id!, 'weight', e.target.value)} />
                                  </div>
                                  <div className="flex items-center gap-3 pt-6">
                                    <input type="checkbox" className="w-4 h-4 rounded-lg bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500" checked={stop.callBeforeDelivery} onChange={e => handleUpdateStop(stop.id!, 'callBeforeDelivery', e.target.checked)} />
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Call Node Representative</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isMultiStop && (
                          <button 
                            type="button"
                            onClick={handleAddStop}
                            className="w-full py-6 border-2 border-dashed border-slate-800 rounded-[2.5rem] text-slate-600 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-[0.98]"
                          >
                            <Plus className="w-5 h-5" /> Append Sequential Node
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>

                <div className="p-8 border-t border-slate-800 bg-slate-900/80 rounded-b-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
                  <div className="flex items-center gap-6">
                    <div className="bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 flex items-center gap-4">
                      <Scale className="w-5 h-5 text-indigo-400" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross Manifest Weight: <span className="text-white ml-2">{totalBookingWeight.toFixed(1)} TONS</span></span>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button type="button" onClick={closeBookingModal} className="flex-1 md:flex-none px-8 py-4 rounded-2xl border border-slate-700 text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">Cancel</button>
                    <button 
                      type="submit"
                      onClick={handleBookingSubmit}
                      className="flex-1 md:flex-none px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <FileCheck className="w-4 h-4" /> Initialize Manifest
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* --- BG DECORATIONS --- */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[160px]"></div>
      </div>

    </div>
  );
};
