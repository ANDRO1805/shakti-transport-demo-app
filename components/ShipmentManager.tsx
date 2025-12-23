import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  User, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Scale,
  FileCheck,
  X,
  ChevronDown,
  ChevronUp,
  Trash2,
  Phone,
  Info,
  Layers,
  ArrowDownToLine,
  Navigation,
  UserCheck,
  Ban,
  ClipboardCheck,
  UserPlus,
  Terminal,
  Activity,
  History
} from 'lucide-react';
import { Shipment, ShipmentStatus, DeliveryStop, StopStatus, Driver, Vehicle, VehicleStatus, Client } from '../types';

interface ShipmentManagerProps {
  shipments: Shipment[];
  drivers: Driver[];
  vehicles: Vehicle[];
  clients?: Client[];
  onUpdateShipment: (shipment: Shipment) => void;
  onAddShipment: (shipment: Shipment) => void;
}

const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
  const styles = {
    [ShipmentStatus.BOOKED]: 'bg-slate-800 text-slate-300 border-slate-600',
    [ShipmentStatus.ASSIGNED]: 'bg-blue-900/30 text-blue-300 border-blue-700/50',
    [ShipmentStatus.DISPATCHED]: 'bg-amber-900/30 text-amber-300 border-amber-700/50',
    [ShipmentStatus.IN_TRANSIT]: 'bg-orange-900/30 text-orange-300 border-orange-700/50',
    [ShipmentStatus.PARTIALLY_DELIVERED]: 'bg-indigo-900/30 text-indigo-300 border-indigo-700/50',
    [ShipmentStatus.DELIVERED]: 'bg-green-900/30 text-green-400 border-green-700/50',
    [ShipmentStatus.INVOICED]: 'bg-purple-900/30 text-purple-300 border-purple-700/50',
    [ShipmentStatus.DECLINED]: 'bg-red-900/30 text-red-400 border-red-700/50',
  };
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 w-fit ${styles[status]}`}>
      {status === ShipmentStatus.DELIVERED && <CheckCircle2 className="w-3 h-3" />}
      {status === ShipmentStatus.DECLINED && <Ban className="w-3 h-3" />}
      {status}
    </span>
  );
};

export const ShipmentManager: React.FC<ShipmentManagerProps> = ({ shipments, drivers, vehicles, clients, onUpdateShipment, onAddShipment }) => {
  const [filter, setFilter] = useState<ShipmentStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [expandedShipmentId, setExpandedShipmentId] = useState<string | null>(null);

  // --- ASSIGNMENT STATE ---
  const [assignmentShipment, setAssignmentShipment] = useState<Shipment | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  // --- WIZARD STATE ---
  const [isMultiStop, setIsMultiStop] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState('Big Eicher');
  const [bookingData, setBookingData] = useState<Partial<Shipment>>({
    client: '',
    origin: '',
    pickupLandmark: '',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTimeWindow: 'Morning (9-12)',
    goodsType: 'Industrial Hardware',
    isNonFragile: false,
    isNonPerishable: false,
  });

  const [wizardStops, setWizardStops] = useState<Partial<DeliveryStop>[]>([
    { id: '1', sequence: 1, address: '', contactName: '', contactPhone: '', payloadDescription: '', weight: 0, callBeforeDelivery: true, status: StopStatus.PENDING }
  ]);

  const totalWeight = wizardStops.reduce((acc, stop) => acc + (Number(stop.weight) || 0), 0);
  const vehicleCapacity = Number(selectedVehicleType.includes('Big') ? 7 : selectedVehicleType.includes('Small') ? 4 : 1.5);
  const isOverweight = totalWeight > vehicleCapacity;

  // --- HANDLERS ---
  const addStop = () => {
    const nextSeq = wizardStops.length + 1;
    setWizardStops([...wizardStops, { 
      id: String(Date.now()), 
      sequence: nextSeq, 
      address: '', 
      contactName: '', 
      contactPhone: '', 
      payloadDescription: '', 
      weight: 0, 
      callBeforeDelivery: true, 
      status: StopStatus.PENDING 
    }]);
  };

  const removeStop = (id: string) => {
    if (wizardStops.length > 1) {
      setWizardStops(wizardStops.filter(s => s.id !== id).map((s, idx) => ({ ...s, sequence: idx + 1 })));
    }
  };

  const updateStop = (id: string, field: keyof DeliveryStop, value: any) => {
    setWizardStops(wizardStops.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleFinalizeBooking = () => {
    if (isOverweight || !bookingData.isNonFragile || !bookingData.isNonPerishable) return;

    const newId = `SHAKTI-${Date.now().toString().slice(-6)}`;
    const finalShipment: Shipment = {
      ...bookingData as Shipment,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      status: ShipmentStatus.BOOKED,
      vehicle: `Pending (${selectedVehicleType})`,
      isMultiStop,
      totalWeight,
      stops: wizardStops as DeliveryStop[],
      timeline: [{ status: ShipmentStatus.BOOKED, timestamp: new Date().toISOString(), location: 'System', note: 'Advanced Booking Created by Admin' }]
    };

    onAddShipment(finalShipment);
    setIsWizardOpen(false);
    resetWizard();
  };

  const resetWizard = () => {
    setBookingData({ client: '', origin: '', pickupDate: new Date().toISOString().split('T')[0], goodsType: 'Industrial Hardware' });
    setWizardStops([{ id: '1', sequence: 1, address: '', contactName: '', contactPhone: '', payloadDescription: '', weight: 0, callBeforeDelivery: true, status: StopStatus.PENDING }]);
    setIsMultiStop(false);
  };

  const handleAcceptRequest = (shipment: Shipment) => {
    setAssignmentShipment(shipment);
    setSelectedDriverId(shipment.driverId?.toString() || '');
    setSelectedVehicleId(shipment.vehicleId || '');
  };

  const handleDeclineRequest = (id: string) => {
    const s = shipments.find(item => item.id === id);
    if (s) {
      const updatedShipment = { 
        ...s, 
        status: ShipmentStatus.DECLINED,
        timeline: [
          ...s.timeline, 
          { 
            status: ShipmentStatus.DECLINED, 
            timestamp: new Date().toISOString(), 
            location: 'Admin Terminal', 
            note: 'Manifest Request Declined by Operations.' 
          }
        ] 
      };
      onUpdateShipment(updatedShipment);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ShipmentStatus) => {
    const s = shipments.find(item => item.id === id);
    if (s) {
      const updatedShipment = {
        ...s,
        status: newStatus,
        timeline: [
          ...s.timeline,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            location: 'Admin Console',
            note: `Status manually updated by root admin to: ${newStatus.toUpperCase()}`
          }
        ]
      };
      onUpdateShipment(updatedShipment);
    }
  };

  const handleConfirmAssignment = () => {
    if (!assignmentShipment || !selectedDriverId || !selectedVehicleId) return;

    const driver = drivers.find(d => d.id.toString() === selectedDriverId);
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);

    if (assignmentShipment && driver && vehicle) {
      const updated: Shipment = {
        ...assignmentShipment,
        status: ShipmentStatus.ASSIGNED,
        driverId: driver.id,
        vehicleId: vehicle.id,
        vehicle: `${vehicle.registrationNumber} (${vehicle.type})`,
        timeline: [
          ...assignmentShipment.timeline,
          { 
            status: ShipmentStatus.ASSIGNED, 
            timestamp: new Date().toISOString(), 
            location: 'Operations Hub', 
            note: `Approved & Assigned Personnel: ${driver.name} | Unit: ${vehicle.registrationNumber}` 
          }
        ]
      };
      onUpdateShipment(updated);
      setAssignmentShipment(null);
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesFilter = filter === 'ALL' || s.status === filter;
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.client.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getClientContact = (clientName: string) => {
    return clients?.find(c => c.companyName.toLowerCase() === clientName.toLowerCase());
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in duration-500">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Package className="w-6 h-6 text-indigo-400" />
           </div>
           <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">Manifest Engine</h2>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Operations Control Center</p>
           </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="Search Client or ID..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-all"
              />
           </div>
           <button 
             onClick={() => setIsWizardOpen(true)}
             className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-black uppercase text-xs tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
           >
             <Plus className="w-4 h-4" /> Create Manual
           </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
         {['ALL', ...Object.values(ShipmentStatus)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                filter === s 
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg' 
                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
              }`}
            >
              {s}
            </button>
         ))}
      </div>

      {/* SHIPMENT LIST */}
      <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
         {filteredShipments.map((s) => {
            const clientInfo = getClientContact(s.client);
            return (
              <div key={s.id} className={`bg-slate-900/40 rounded-2xl border ${s.status === ShipmentStatus.DECLINED ? 'border-red-500/40 bg-red-950/5 opacity-80' : 'border-slate-800'} overflow-hidden transition-all hover:border-slate-700 shadow-lg`}>
                <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex gap-6 items-center flex-1">
                      <div className="hidden sm:block">
                          <div className="text-[10px] text-slate-500 font-mono uppercase mb-1">{s.date}</div>
                          <div className="text-lg font-black text-white font-mono tracking-tighter uppercase">{s.id}</div>
                      </div>
                      <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>
                      <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{s.client}</div>
                            {clientInfo && (
                              <div className="flex items-center gap-2 text-[8px] text-slate-500 font-mono bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700">
                                <Phone className="w-2.5 h-2.5 text-indigo-400" /> {clientInfo.phone}
                                <span className="text-slate-600">|</span>
                                <User className="w-2.5 h-2.5 text-indigo-400" /> {clientInfo.contactPerson}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-300 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                            {s.origin}
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                            {s.stops.length > 0 ? (s.stops.length > 1 ? `${s.stops.length} STOPS` : s.stops[0]?.address) : s.destination}
                          </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      {s.status === ShipmentStatus.BOOKED && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleAcceptRequest(s)}
                            className="bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <UserCheck className="w-3 h-3" /> Approve
                          </button>
                          <button 
                            onClick={() => handleDeclineRequest(s.id)}
                            className="bg-red-900/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5"
                          >
                            <Ban className="w-3 h-3" /> Decline
                          </button>
                        </div>
                      )}
                      
                      <StatusBadge status={s.status} />
                      <button 
                          onClick={() => setExpandedShipmentId(expandedShipmentId === s.id ? null : s.id)}
                          className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
                      >
                          {expandedShipmentId === s.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                </div>

                {/* EXPANDED TRACKING VIEW */}
                {expandedShipmentId === s.id && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/50 bg-black/20 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          <div className="lg:col-span-2 space-y-6">
                            
                            {/* ADMIN STATUS OVERRIDE CONSOLE */}
                            <div className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 mb-4">
                               <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                  <Terminal className="w-3 h-3" /> Status Command Console
                               </h4>
                               <div className="flex flex-wrap gap-2">
                                  {[
                                    ShipmentStatus.DISPATCHED,
                                    ShipmentStatus.IN_TRANSIT,
                                    ShipmentStatus.PARTIALLY_DELIVERED,
                                    ShipmentStatus.DELIVERED,
                                    ShipmentStatus.INVOICED
                                  ].map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleUpdateStatus(s.id, status)}
                                      disabled={s.status === status}
                                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-1.5 ${
                                        s.status === status 
                                          ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed' 
                                          : 'bg-indigo-600/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-600 hover:text-white'
                                      }`}
                                    >
                                      {status === ShipmentStatus.DELIVERED && <CheckCircle2 className="w-3 h-3" />}
                                      {status}
                                    </button>
                                  ))}
                               </div>
                            </div>

                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Route Progress / Manifest Node Tracking</h4>
                            <div className="space-y-4">
                                {s.stops.length > 0 ? s.stops.map((stop, idx) => (
                                  <div key={stop.id} className="relative flex gap-6 group">
                                      {/* Line Logic */}
                                      {idx !== s.stops.length - 1 && (
                                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-800"></div>
                                      )}
                                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                                        stop.status === StopStatus.DELIVERED ? 'bg-green-500/20 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 
                                        stop.status === StopStatus.OUT_FOR_DELIVERY ? 'bg-amber-500/20 border-amber-500 animate-pulse' : 
                                        'bg-slate-900 border-slate-700'
                                      }`}>
                                        <span className="text-[10px] font-black text-white">{idx + 1}</span>
                                      </div>
                                      <div className="flex-1 bg-slate-800/30 p-4 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                              <div className="text-sm font-black text-white uppercase">{stop.address}</div>
                                              <div className="text-[10px] text-slate-500 font-mono">SEQ-{stop.id.slice(-4)}</div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                              stop.status === StopStatus.DELIVERED ? 'bg-green-900/20 text-green-400 border-green-500/30' :
                                              stop.status === StopStatus.OUT_FOR_DELIVERY ? 'bg-amber-900/20 text-amber-400 border-amber-500/30' :
                                              'bg-slate-950 text-slate-500 border-slate-800'
                                            }`}>
                                              {stop.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-[10px] uppercase font-black tracking-widest text-slate-400">
                                            <div><span className="text-slate-600 block mb-0.5">Payload</span><span className="text-indigo-400">{stop.payloadDescription}</span></div>
                                            <div><span className="text-slate-600 block mb-0.5">Weight</span><span className="text-white">{stop.weight} Tons</span></div>
                                            <div className="hidden sm:block"><span className="text-slate-600 block mb-0.5">Recipient</span><span className="text-white">{stop.contactName}</span></div>
                                        </div>
                                      </div>
                                  </div>
                                )) : (
                                  <div className="py-12 text-center text-slate-600 italic text-xs">No individual delivery stops defined in this manifest.</div>
                                )}
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="bg-slate-800/20 p-5 rounded-2xl border border-slate-800">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Logistics Summary</h5>
                                <div className="space-y-3">
                                  <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase">Assigned Unit</span><span className="text-white font-mono">{s.vehicle}</span></div>
                                  <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase">Trip Type</span><span className="text-indigo-400 uppercase">{s.isMultiStop ? 'Multi-Stop' : 'Direct'}</span></div>
                                  <div className="flex justify-between text-xs font-bold"><span className="text-slate-500 uppercase">Load Total</span><span className="text-white font-mono">{s.totalWeight} Tons</span></div>
                                  
                                  {/* Assignment Details */}
                                  <div className="pt-3 border-t border-slate-700 space-y-2">
                                     <div className="flex justify-between text-[10px] uppercase"><span className="text-slate-600 font-black">Driver Link</span><span className="text-indigo-300 font-bold">{drivers.find(d => d.id === s.driverId)?.name || 'Unassigned'}</span></div>
                                     <div className="flex justify-between text-[10px] uppercase"><span className="text-slate-600 font-black">Vehicle Node</span><span className="text-indigo-300 font-bold">{s.vehicleId || 'N/A'}</span></div>
                                  </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
                               <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><History className="w-3 h-3" /> Audit Log</h5>
                               <div className="space-y-3 max-h-32 overflow-y-auto custom-scrollbar">
                                  {s.timeline.map((event, i) => (
                                    <div key={i} className="text-[9px] border-l-2 border-indigo-500 pl-3 py-0.5">
                                       <p className="text-indigo-300 font-black uppercase">{event.status}</p>
                                       <p className="text-slate-500 font-mono italic">{new Date(event.timestamp).toLocaleDateString()} - {event.location}</p>
                                    </div>
                                  ))}
                               </div>
                            </div>

                            {s.status !== ShipmentStatus.DELIVERED && s.status !== ShipmentStatus.DECLINED && (
                              <button 
                                onClick={() => handleAcceptRequest(s)}
                                className="w-full py-3 bg-indigo-600 border border-indigo-400/50 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-indigo-500 transition-all flex items-center justify-center gap-2"
                              >
                                  <ClipboardCheck className="w-4 h-4" /> Re-Assign Assets
                              </button>
                            )}
                          </div>
                      </div>
                    </div>
                )}
              </div>
            );
         })}
         {filteredShipments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-800">
               <Layers className="w-12 h-12 mb-4 text-slate-800" />
               <p className="text-slate-600 uppercase font-black text-xs tracking-widest">No matching manifests in active memory</p>
            </div>
         )}
      </div>

      {/* --- ASSIGNMENT MODAL --- */}
      {assignmentShipment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setAssignmentShipment(null)}></div>
           <div className="glass-panel w-full max-w-lg rounded-3xl border border-indigo-500/30 relative z-10 animate-in zoom-in duration-300 shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-lg"><Truck className="w-5 h-5 text-white" /></div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tighter">Asset Assignment</h3>
                 </div>
                 <button onClick={() => setAssignmentShipment(null)} className="text-slate-500 hover:text-white bg-slate-800 p-1.5 rounded-full"><X className="w-4 h-4" /></button>
              </div>

              <div className="p-8 space-y-8">
                 <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Manifest Context</p>
                    <div className="flex justify-between items-center">
                       <span className="text-lg font-black text-white font-mono">{assignmentShipment.id}</span>
                       <span className="text-xs font-bold text-indigo-400 uppercase">{assignmentShipment.client}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> {assignmentShipment.origin} → {assignmentShipment.stops[0]?.address || assignmentShipment.destination}
                    </p>
                 </div>

                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Select Field Personnel</label>
                       <div className="relative">
                          <UserPlus className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                          <select 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:border-indigo-500 outline-none"
                            value={selectedDriverId}
                            onChange={e => setSelectedDriverId(e.target.value)}
                          >
                             <option value="">AWAITING SELECTION...</option>
                             {drivers.map(d => (
                               <option key={d.id} value={d.id}>{d.name} ({d.status})</option>
                             ))}
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Select Logistics Unit</label>
                       <div className="relative">
                          <Truck className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                          <select 
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white focus:border-indigo-500 outline-none"
                            value={selectedVehicleId}
                            onChange={e => setSelectedVehicleId(e.target.value)}
                          >
                             <option value="">AWAITING SELECTION...</option>
                             {vehicles.filter(v => v.status === VehicleStatus.AVAILABLE || v.id === assignmentShipment.vehicleId).map(v => (
                               <option key={v.id} value={v.id}>{v.registrationNumber} - {v.type} ({v.capacity})</option>
                             ))}
                          </select>
                       </div>
                    </div>
                 </div>
                 
                 <button 
                   onClick={handleConfirmAssignment}
                   disabled={!selectedDriverId || !selectedVehicleId}
                   className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-green-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                 >
                    <CheckCircle2 className="w-5 h-5" /> Finalize Assignment
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* --- BOOKING WIZARD MODAL --- */}
      {isWizardOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsWizardOpen(false)}></div>
            <div className="glass-panel w-full max-w-4xl rounded-3xl border border-indigo-500/30 relative z-10 animate-in zoom-in duration-300 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden">
               <div className="p-6 border-b border-slate-800 bg-indigo-900/10 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/30"><Truck className="w-6 h-6 text-white" /></div>
                     <div>
                        <h3 className="text-xl font-black text-white tracking-tighter uppercase">Advance Booking Interface</h3>
                        <p className="text-[10px] text-indigo-400 font-mono uppercase tracking-[0.3em]">Operational Readiness Check</p>
                     </div>
                  </div>
                  <button onClick={() => setIsWizardOpen(false)} className="text-slate-500 hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                     {/* LEFT: Master Details */}
                     <div className="lg:col-span-1 space-y-8">
                        <div>
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><ArrowDownToLine className="w-3 h-3" /> Pickup Metadata</h4>
                           <div className="space-y-4">
                              <div>
                                 <label className="text-[9px] font-black text-indigo-400 uppercase ml-1">Client Entity</label>
                                 <input className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Company Name" value={bookingData.client} onChange={e => setBookingData({...bookingData, client: e.target.value})} />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                 <div>
                                    <label className="text-[9px] font-black text-indigo-400 uppercase ml-1">Pickup Date</label>
                                    <input type="date" className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none" value={bookingData.pickupDate} onChange={e => setBookingData({...bookingData, pickupDate: e.target.value})} />
                                 </div>
                                 <div>
                                    <label className="text-[9px] font-black text-indigo-400 uppercase ml-1">Time Slot</label>
                                    <select className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none" value={bookingData.pickupTimeWindow} onChange={e => setBookingData({...bookingData, pickupTimeWindow: e.target.value})}>
                                       <option>Morning (9-12)</option>
                                       <option>Afternoon (1-5)</option>
                                       <option>Night (8-11)</option>
                                    </select>
                                 </div>
                              </div>
                              <div>
                                 <label className="text-[9px] font-black text-indigo-400 uppercase ml-1">Pickup Base Address</label>
                                 <input className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Warehouse / GIDC Sector" value={bookingData.origin} onChange={e => setBookingData({...bookingData, origin: e.target.value})} />
                              </div>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Truck className="w-3 h-3" /> Fleet Selection</h4>
                           <select 
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none mb-4"
                              value={selectedVehicleType}
                              onChange={e => setSelectedVehicleType(e.target.value)}
                           >
                              <option>Big Eicher (7 Ton)</option>
                              <option>Small Eicher (4 Ton)</option>
                              <option>Bolero Pickup (1.5 Ton)</option>
                           </select>
                           <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                              <div className="flex justify-between items-center mb-2">
                                 <span className="text-[9px] font-black text-slate-500 uppercase">Live Load Distribution</span>
                                 <span className={`text-xs font-mono font-black ${isOverweight ? 'text-red-500' : 'text-indigo-400'}`}>{totalWeight.toFixed(1)} / {vehicleCapacity}T</span>
                              </div>
                              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                 <div className={`h-full transition-all duration-500 ${isOverweight ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, (totalWeight / vehicleCapacity) * 100)}%` }}></div>
                              </div>
                              {isOverweight && (
                                 <div className="mt-2 text-[8px] text-red-400 font-black flex items-center gap-1"><AlertCircle className="w-3 h-3" /> EXCEEDS RATED CAPACITY</div>
                              )}
                           </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 space-y-3">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Compliance Check</h4>
                           <label className="flex items-center gap-3 group cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500" checked={bookingData.isNonFragile} onChange={e => setBookingData({...bookingData, isNonFragile: e.target.checked})} />
                              <span className="text-[10px] text-slate-400 uppercase font-black group-hover:text-white transition-colors">Confirm Non-Fragile Goods</span>
                           </label>
                           <label className="flex items-center gap-3 group cursor-pointer">
                              <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500" checked={bookingData.isNonPerishable} onChange={e => setBookingData({...bookingData, isNonPerishable: e.target.checked})} />
                              <span className="text-[10px] text-slate-400 uppercase font-black group-hover:text-white transition-colors">Confirm Non-Perishable Goods</span>
                           </label>
                        </div>
                     </div>

                     {/* RIGHT: Dynamic Stops */}
                     <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Navigation className="w-3.5 h-3.5" /> Manifest Stops</h4>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-500 font-black uppercase">Multi-Stop</span>
                              <button 
                                 onClick={() => setIsMultiStop(!isMultiStop)}
                                 className={`w-10 h-5 rounded-full relative transition-all ${isMultiStop ? 'bg-indigo-600' : 'bg-slate-800'}`}
                              >
                                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isMultiStop ? 'left-6' : 'left-1'}`}></div>
                              </button>
                           </div>
                        </div>

                        <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                           {wizardStops.map((stop, idx) => (
                              <div key={stop.id} className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 relative group animate-in slide-in-from-right-4 duration-300">
                                 <div className="absolute -left-3 top-6 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 text-[10px] font-black text-indigo-400 shadow-xl">{idx + 1}</div>
                                 
                                 {wizardStops.length > 1 && (
                                    <button onClick={() => removeStop(stop.id!)} className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                 )}

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                       <div>
                                          <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Drop Address</label>
                                          <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" placeholder="Destination City / Factory" value={stop.address} onChange={e => updateStop(stop.id!, 'address', e.target.value)} />
                                       </div>
                                       <div className="grid grid-cols-2 gap-3">
                                          <div>
                                             <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Contact Person</label>
                                             <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" placeholder="Name" value={stop.contactName} onChange={e => updateStop(stop.id!, 'contactName', e.target.value)} />
                                          </div>
                                          <div>
                                             <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Phone</label>
                                             <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" placeholder="+91" value={stop.contactPhone} onChange={e => updateStop(stop.id!, 'contactPhone', e.target.value)} />
                                          </div>
                                       </div>
                                    </div>
                                    <div className="space-y-4">
                                       <div>
                                          <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Stop Payload Description</label>
                                          <input className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" placeholder="e.g. 50 PVC Pipes" value={stop.payloadDescription} onChange={e => updateStop(stop.id!, 'payloadDescription', e.target.value)} />
                                       </div>
                                       <div className="grid grid-cols-2 gap-3">
                                          <div>
                                             <label className="text-[8px] font-black text-slate-500 uppercase ml-1">Weight (Tons)</label>
                                             <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white outline-none focus:border-indigo-500" placeholder="0.0" value={stop.weight} onChange={e => updateStop(stop.id!, 'weight', e.target.value)} />
                                          </div>
                                          <div className="flex items-center gap-2 pt-4">
                                             <input type="checkbox" className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-800" checked={stop.callBeforeDelivery} onChange={e => updateStop(stop.id!, 'callBeforeDelivery', e.target.checked)} />
                                             <span className="text-[8px] font-black text-slate-500 uppercase">Call Before Drop</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                           
                           {isMultiStop && (
                              <button 
                                 onClick={addStop}
                                 className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                              >
                                 <Plus className="w-4 h-4" /> Add Next Manifest Node
                              </button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-slate-800 bg-slate-900/80 rounded-b-3xl flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
                        <Scale className="w-4 h-4 text-slate-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Weight: <span className={isOverweight ? 'text-red-500' : 'text-white'}>{totalWeight.toFixed(1)} TONS</span></span>
                     </div>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                     <button onClick={() => setIsWizardOpen(false)} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">Cancel</button>
                     <button 
                        onClick={handleFinalizeBooking}
                        disabled={isOverweight || !bookingData.isNonFragile || !bookingData.isNonPerishable}
                        className="flex-1 sm:flex-none px-10 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                     >
                        <FileCheck className="w-4 h-4" /> Initialize Manifest
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};