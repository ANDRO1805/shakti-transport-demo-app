
import React, { useState } from 'react';
import { 
  Truck, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Gauge,
  Layers
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../types';

interface VehicleManagerProps {
  vehicles: Vehicle[];
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onAddVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
}

export const VehicleManager: React.FC<VehicleManagerProps> = ({ vehicles, onUpdateVehicle, onAddVehicle, onDeleteVehicle }) => {
  const [filter, setFilter] = useState<VehicleStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    registrationNumber: '',
    type: 'Big Eicher',
    capacity: '',
    status: VehicleStatus.AVAILABLE,
    lastMaintenance: new Date().toISOString().split('T')[0],
    features: [],
    notes: ''
  });

  // Derived State
  const filteredVehicles = vehicles.filter(v => {
    const matchesFilter = filter === 'ALL' || v.status === filter;
    const matchesSearch = v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Grouping Logic
  const groupedVehicles = filteredVehicles.reduce((groups, vehicle) => {
    const category = vehicle.type;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(vehicle);
    return groups;
  }, {} as Record<string, Vehicle[]>);

  // Preferred order for categories
  const categoryOrder = ['Big Eicher', 'Small Eicher', 'Bolero Pickup', 'Small Carry', 'Heavy Trailer'];
  const sortedCategories = Object.keys(groupedVehicles).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    // If both are in the list, sort by index
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // If only one is in the list, prioritize it
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // Otherwise alphabetical
    return a.localeCompare(b);
  });

  const maintenanceDueCount = vehicles.filter(v => {
    const last = new Date(v.lastMaintenance);
    const now = new Date();
    const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 90;
  }).length;

  // Handlers
  const handleOpenModal = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData(vehicle);
    } else {
      setEditingId(null);
      setFormData({
        registrationNumber: '',
        type: 'Big Eicher',
        capacity: '',
        status: VehicleStatus.AVAILABLE,
        lastMaintenance: new Date().toISOString().split('T')[0],
        features: [],
        notes: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateVehicle({ ...formData, id: editingId } as Vehicle);
    } else {
      const newVehicle: Vehicle = {
        ...formData as Vehicle,
        id: `V-${Date.now()}`,
        features: formData.features || []
      };
      onAddVehicle(newVehicle);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to decommission this unit? This action cannot be undone.')) {
      onDeleteVehicle(id);
    }
  };

  const isMaintenanceDue = (dateString: string) => {
    const last = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 90; // 3 months
  };

  const StatusBadge = ({ status }: { status: VehicleStatus }) => {
    const styles = {
      [VehicleStatus.AVAILABLE]: 'bg-green-500/10 text-green-400 border-green-500/20',
      [VehicleStatus.IN_TRANSIT]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      [VehicleStatus.MAINTENANCE]: 'bg-red-500/10 text-red-400 border-red-500/20',
      [VehicleStatus.OFF_DUTY]: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  // Render Helper for Card
  const renderVehicleCard = (vehicle: Vehicle) => {
    const dueForService = isMaintenanceDue(vehicle.lastMaintenance);
    return (
      <div key={vehicle.id} className={`glass-panel p-6 rounded-2xl border transition-all group relative overflow-hidden ${
        vehicle.status === VehicleStatus.MAINTENANCE || dueForService 
          ? 'border-red-500/30 hover:border-red-500/50' 
          : 'border-slate-800 hover:border-indigo-500/50'
      }`}>
        {/* Background Glow */}
        <div className={`absolute top-0 right-0 p-20 rounded-full blur-3xl transition-all opacity-10 ${
          vehicle.status === VehicleStatus.AVAILABLE ? 'bg-green-500' :
          vehicle.status === VehicleStatus.IN_TRANSIT ? 'bg-amber-500' :
          'bg-red-500'
        }`}></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 shadow-inner">
              <Truck className={`w-6 h-6 ${
                vehicle.status === VehicleStatus.AVAILABLE ? 'text-green-400' : 
                vehicle.status === VehicleStatus.IN_TRANSIT ? 'text-amber-400' : 'text-slate-400'
              }`} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={vehicle.status} />
              <div className="flex gap-1">
                <button onClick={() => handleOpenModal(vehicle)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(vehicle.id)} className="p-1.5 hover:bg-red-900/30 rounded text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-white font-mono tracking-wide">{vehicle.registrationNumber}</h3>
          <p className="text-sm text-indigo-400 font-bold mb-4 uppercase">{vehicle.type}</p>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase flex items-center gap-1">
                  <Gauge className="w-3 h-3" /> Capacity
                </span>
                <span className="text-slate-200 font-mono">{vehicle.capacity}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase flex items-center gap-1">
                  <Wrench className="w-3 h-3" /> Last Service
                </span>
                <span className={`font-mono ${dueForService ? 'text-red-400 font-bold' : 'text-slate-200'}`}>
                  {vehicle.lastMaintenance}
                  {dueForService && <AlertTriangle className="w-3 h-3 inline ml-1 animate-pulse" />}
                </span>
            </div>
            {vehicle.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                  {vehicle.features.map((f, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] text-slate-400 border border-slate-700 font-mono uppercase">
                      {f}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      {/* HEADER & STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">FLEET COMMAND</h2>
          <p className="text-slate-400 font-mono text-sm">MANAGE VEHICLE ASSETS & MAINTENANCE SCHEDULES</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-indigo-500/30 flex items-center justify-between">
           <div>
             <p className="text-xs text-slate-500 uppercase font-bold">Total Fleet</p>
             <p className="text-2xl font-mono text-white font-bold">{vehicles.length}</p>
           </div>
           <div className="text-right">
             <p className="text-xs text-slate-500 uppercase font-bold">Maint. Alerts</p>
             <p className={`text-2xl font-mono font-bold ${maintenanceDueCount > 0 ? 'text-red-400 animate-pulse' : 'text-green-400'}`}>
               {maintenanceDueCount}
             </p>
           </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {['ALL', ...Object.values(VehicleStatus)].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                filter === s 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search Reg / Type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider flex items-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> Add Unit
          </button>
        </div>
      </div>

      {/* CATEGORIZED LIST */}
      <div className="space-y-12">
        {sortedCategories.length > 0 ? (
          sortedCategories.map(type => (
            <div key={type} className="animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide uppercase flex items-center gap-3">
                  {type}
                  <span className="px-2 py-0.5 bg-indigo-500/10 rounded text-xs text-indigo-300 font-mono border border-indigo-500/20">
                    {groupedVehicles[type].length} UNIT{groupedVehicles[type].length !== 1 ? 'S' : ''}
                  </span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groupedVehicles[type].map(vehicle => renderVehicleCard(vehicle))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800 border-dashed">
            <Truck className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No vehicles found matching current filters.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-indigo-500/30 relative z-10 animate-in zoom-in duration-200 shadow-2xl">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50 rounded-t-2xl flex justify-between items-center">
               <h3 className="text-lg font-bold text-white tracking-wide">
                 {editingId ? 'EDIT UNIT CONFIGURATION' : 'COMMISSION NEW UNIT'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><Filter className="w-4 h-4 rotate-45" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">Registration ID</label>
                 <input 
                   required
                   value={formData.registrationNumber}
                   onChange={e => setFormData({...formData, registrationNumber: e.target.value})}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none font-mono"
                   placeholder="GJ-XX-XX-XXXX"
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Vehicle Type</label>
                   <select 
                     value={formData.type}
                     onChange={e => setFormData({...formData, type: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                   >
                     <option>Big Eicher</option>
                     <option>Small Eicher</option>
                     <option>Bolero Pickup</option>
                     <option>Small Carry</option>
                     <option>Heavy Trailer</option>
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Load Capacity</label>
                   <input 
                     required
                     value={formData.capacity}
                     onChange={e => setFormData({...formData, capacity: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                     placeholder="e.g. 7 Tons"
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Current Status</label>
                   <select 
                     value={formData.status}
                     onChange={e => setFormData({...formData, status: e.target.value as VehicleStatus})}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                   >
                     {Object.values(VehicleStatus).map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Last Maintenance</label>
                   <input 
                     type="date"
                     required
                     value={formData.lastMaintenance}
                     onChange={e => setFormData({...formData, lastMaintenance: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                   />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-bold text-slate-500 uppercase">Features (Comma separated)</label>
                 <input 
                   value={formData.features?.join(', ')}
                   onChange={e => setFormData({...formData, features: e.target.value.split(',').map(s => s.trim())})}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none"
                   placeholder="GPS, Fastag, Lift..."
                 />
               </div>

               <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-lg transition-all mt-4 flex items-center justify-center gap-2">
                 <CheckCircle2 className="w-5 h-5" />
                 {editingId ? 'Update Configuration' : 'Commission Unit'}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
