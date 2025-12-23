import React, { useState } from 'react';
import { Truck, Box, Scale, Ruler, AlertTriangle, RotateCcw, Save, Cuboid, Weight, ArrowUpFromLine } from 'lucide-react';

// CONFIGURATION
const VEHICLES = [
  { id: 'big-eicher', name: 'BIG EICHER', maxWeight: 7000, maxVol: 60, dims: '19 FT', grid: 12 },
  { id: 'small-eicher', name: 'SMALL EICHER', maxWeight: 4500, maxVol: 35, dims: '14 FT', grid: 8 },
  { id: 'bolero', name: 'BOLERO PICKUP', maxWeight: 1700, maxVol: 15, dims: '8 FT', grid: 4 },
  { id: 'small-carry', name: 'SMALL CARRY', maxWeight: 1000, maxVol: 8, dims: '6 FT', grid: 3 },
];

const CARGO_ITEMS = [
  { id: 'pallet', name: 'STD Pallet', weight: 450, vol: 4, color: 'bg-indigo-500', border: 'border-indigo-400', gridSpan: 2 },
  { id: 'drum', name: 'Oil Drum (x4)', weight: 850, vol: 3, color: 'bg-cyan-500', border: 'border-cyan-400', gridSpan: 1 },
  { id: 'machine', name: 'CNC Machinery', weight: 1200, vol: 6, color: 'bg-amber-500', border: 'border-amber-400', gridSpan: 3 },
  { id: 'box', name: 'Parts Crate', weight: 150, vol: 1, color: 'bg-green-500', border: 'border-green-400', gridSpan: 1 },
];

export const LoadOptimizer: React.FC = () => {
  const [activeVehicle, setActiveVehicle] = useState(VEHICLES[0]);
  const [manifest, setManifest] = useState<any[]>([]);

  const totalWeight = manifest.reduce((acc, item) => acc + item.weight, 0);
  const totalVol = manifest.reduce((acc, item) => acc + item.vol, 0);
  const totalGridUsed = manifest.reduce((acc, item) => acc + item.gridSpan, 0);

  // Percentages
  const weightPct = Math.min(100, (totalWeight / activeVehicle.maxWeight) * 100);
  const volPct = Math.min(100, (totalVol / activeVehicle.maxVol) * 100);
  const gridPct = Math.min(100, (totalGridUsed / activeVehicle.grid) * 100);

  const isOverweight = totalWeight > activeVehicle.maxWeight;
  const isOverfilled = totalVol > activeVehicle.maxVol || totalGridUsed > activeVehicle.grid;

  const addItem = (item: any) => {
    if (isOverfilled) return; // Prevent adding if physically full
    setManifest([...manifest, { ...item, uid: Date.now() + Math.random() }]);
  };

  const removeItem = (uid: number) => {
    setManifest(manifest.filter(i => i.uid !== uid));
  };

  const reset = () => setManifest([]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500 min-h-[600px] flex flex-col gap-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center border-b border-indigo-500/20 pb-4 relative z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Cuboid className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">CARGO <span className="text-indigo-500">OPTIMIZER</span></h2>
            <p className="text-xs text-indigo-300 font-mono uppercase tracking-widest">
              Volumetric Load Simulator
            </p>
          </div>
        </div>
        
        {/* VEHICLE SWITCHER */}
        <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700 justify-center">
          {VEHICLES.map(v => (
            <button
              key={v.id}
              onClick={() => { setActiveVehicle(v); reset(); }}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                activeVehicle.id === v.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 flex-1">
        
        {/* COL 1: ITEM PALLETTE */}
        <div className="flex flex-col gap-4">
           <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                 <Box className="w-4 h-4" /> Available Cargo Units
              </h3>
              <div className="grid grid-cols-1 gap-3">
                 {CARGO_ITEMS.map(item => (
                   <button 
                     key={item.id}
                     onClick={() => addItem(item)}
                     disabled={isOverfilled}
                     className="flex items-center justify-between bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 p-3 rounded-lg transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      <div className="flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                         <div className="text-left">
                            <div className="text-sm font-bold text-slate-200 group-hover:text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{item.weight}kg  |  {item.vol}m³</div>
                         </div>
                      </div>
                      <div className="bg-slate-900 rounded px-2 py-1 text-[10px] text-indigo-400 font-mono border border-slate-700">
                         ADD +
                      </div>
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Load Manifest</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                 {manifest.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 text-xs italic">Bay Empty</div>
                 ) : (
                    manifest.map((m, idx) => (
                       <div key={m.uid} className="flex justify-between items-center text-xs p-2 bg-slate-800/30 rounded border border-slate-700/50">
                          <span className="text-slate-300">{idx + 1}. {m.name}</span>
                          <button onClick={() => removeItem(m.uid)} className="text-red-400 hover:text-red-300">X</button>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* COL 2: VISUAL BAY */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           {/* TRUCK BED VISUALIZER */}
           <div className="flex-1 bg-slate-900/80 rounded-xl border border-slate-700 relative overflow-hidden p-8 flex flex-col items-center justify-center min-h-[300px] overflow-x-auto">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
              
              {/* Truck Frame */}
              <div className={`relative bg-slate-950 border-2 ${isOverweight ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.1)]'} rounded-lg transition-all duration-500 flex flex-wrap content-start p-2 gap-1 overflow-hidden shrink-0`}
                   style={{ 
                     width: '100%', 
                     minWidth: '300px',
                     maxWidth: '500px', 
                     height: activeVehicle.id === 'big-eicher' ? '300px' : activeVehicle.id === 'small-eicher' ? '220px' : activeVehicle.id === 'bolero' ? '150px' : '100px'
                   }}>
                 
                 {/* Cab Indicator */}
                 <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-2/3 bg-slate-800 border-r-4 border-slate-700 rounded-l-xl flex items-center justify-center">
                    <div className="w-1 h-12 bg-amber-500/20 rounded-full"></div>
                 </div>

                 {/* Loaded Items */}
                 {manifest.map((item) => (
                    <div 
                      key={item.uid}
                      className={`${item.color} ${item.border} border bg-opacity-20 animate-in zoom-in duration-300 rounded-sm flex items-center justify-center relative group cursor-pointer hover:bg-opacity-40 transition-all`}
                      style={{ 
                        width: item.gridSpan === 1 ? '23%' : item.gridSpan === 2 ? '48%' : '98%',
                        height: '60px'
                      }}
                      onClick={() => removeItem(item.uid)}
                    >
                       <span className="text-[10px] font-bold text-white/70 truncate px-1">{item.name}</span>
                    </div>
                 ))}

                 {/* Remaining Space Indicator */}
                 {!isOverfilled && manifest.length > 0 && (
                    <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-500 uppercase">
                       Free Space: {100 - gridPct}%
                    </div>
                 )}
              </div>
              
              {/* Axle Line */}
              <div className="w-full max-w-[500px] h-4 mt-2 flex justify-between px-12 relative z-10 opacity-50 shrink-0">
                 <div className="w-8 h-8 bg-black rounded-full border border-slate-700"></div>
                 <div className="w-8 h-8 bg-black rounded-full border border-slate-700"></div>
              </div>
           </div>

           {/* METRICS PANEL */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Weight className="w-3 h-3" /> Weight</span>
                    <span className={`text-lg font-mono font-bold ${isOverweight ? 'text-red-400' : 'text-white'}`}>
                       {totalWeight} <span className="text-xs text-slate-500">/ {activeVehicle.maxWeight} kg</span>
                    </span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isOverweight ? 'bg-red-500' : weightPct > 90 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${weightPct}%` }}
                    ></div>
                 </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><ArrowUpFromLine className="w-3 h-3" /> Volume</span>
                    <span className={`text-lg font-mono font-bold ${volPct > 100 ? 'text-amber-400' : 'text-white'}`}>
                       {totalVol} <span className="text-xs text-slate-500">/ {activeVehicle.maxVol} m³</span>
                    </span>
                 </div>
                 <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${volPct > 100 ? 'bg-amber-500' : 'bg-cyan-500'}`} 
                      style={{ width: `${volPct}%` }}
                    ></div>
                 </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex flex-col justify-center gap-2">
                 <button 
                   onClick={reset}
                   className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2"
                 >
                    <RotateCcw className="w-3 h-3" /> Reset Bay
                 </button>
                 <button className={`w-full py-2 rounded-lg text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 ${
                    isOverweight || isOverfilled 
                       ? 'bg-red-900/20 text-red-500 border border-red-500/30 cursor-not-allowed' 
                       : 'bg-green-600 hover:bg-green-500 text-white shadow-lg'
                 }`}>
                    {isOverweight ? <AlertTriangle className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    {isOverweight ? 'OVERLOAD' : 'Save Plan'}
                 </button>
              </div>
           </div>
        </div>

      </div>

      {/* FOOTER WARNINGS */}
      {(isOverweight || isOverfilled) && (
         <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 flex items-center justify-center gap-2 text-red-400 text-xs font-bold uppercase animate-pulse">
            <AlertTriangle className="w-4 h-4" /> 
            CRITICAL: {isOverweight ? 'WEIGHT LIMIT EXCEEDED' : 'VOLUME CAPACITY EXCEEDED'} - RECONFIGURE LOAD
         </div>
      )}
    </div>
  );
};