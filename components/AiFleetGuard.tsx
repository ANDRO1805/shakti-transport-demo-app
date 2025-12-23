import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Activity, 
  Zap, 
  Radio, 
  AlertTriangle, 
  CheckCircle, 
  Truck, 
  Cpu, 
  Users, 
  Thermometer, 
  Gauge, 
  Heart, 
  BrainCircuit
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types';

interface AiFleetGuardProps {
  drivers: any[];
  shipments: Shipment[];
}

export const AiFleetGuard: React.FC<AiFleetGuardProps> = ({ drivers, shipments }) => {
  const [logs, setLogs] = useState<string[]>([
    "INITIALIZING FLEET GUARD PROTOCOLS...",
    "CONNECTING TO GJ-27-X-1234 TELEMETRY...",
    "BIOMETRIC SCANS ACTIVE...",
    "WEATHER ANALYSIS: CLEAR SKIES IN NORTH SECTOR",
  ]);
  const [systemLoad, setSystemLoad] = useState(42);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulate System Activity
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemLoad(prev => Math.max(20, Math.min(95, prev + (Math.random() * 20 - 10))));
      
      const actions = [
        "Optimizing fuel injection for GJ-27-Y-5678",
        "Rerouting ST-2024-002 due to traffic congestion",
        "Analyzing driver fatigue levels: NORMAL",
        "Suspension integrity check passed for Unit 4",
        "Satellite uplink stable: 45ms latency",
        "Predictive maintenance: Oil change recommended for Bolero-01 in 400km",
        "Cargo stability sensor: 98% secure",
        "Updating geofence parameters for Kalol Base"
      ];
      
      const newLog = `[${new Date().toLocaleTimeString()}] ${actions[Math.floor(Math.random() * actions.length)]}`;
      setLogs(prev => [...prev.slice(-8), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-indigo-500/20 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-wide">AI FLEET GUARD <span className="text-indigo-500">CORE</span></h2>
            <p className="text-xs text-indigo-300 font-mono uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></span>
              Neural Network Online
            </p>
          </div>
        </div>
        
        <div className="flex gap-6">
           <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold">System Load</p>
              <div className="flex items-center gap-2 justify-end">
                 <Cpu className="w-4 h-4 text-cyan-400" />
                 <span className="text-xl font-mono text-white">{Math.floor(systemLoad)}%</span>
              </div>
              <div className="w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                 <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${systemLoad}%` }}></div>
              </div>
           </div>
           <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Risk Assessment</p>
              <div className="flex items-center gap-2 justify-end">
                 <Shield className="w-4 h-4 text-green-400" />
                 <span className="text-xl font-mono text-white">LOW</span>
              </div>
              <p className="text-[9px] text-slate-500 font-mono">THREAT LEVEL: 4%</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* COL 1: PERSONNEL BIOMETRICS */}
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-700/50 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> PERSONNEL BIOMETRICS
          </h3>
          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {drivers.filter(d => d.status !== 'On Leave').map(driver => (
              <div key={driver.id} className="bg-slate-900/80 p-3 rounded-lg border border-slate-700 hover:border-amber-500/30 transition-colors group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-200">{driver.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono ${
                    driver.status === 'Active' ? 'bg-green-900/20 text-green-400 border-green-500/30' : 
                    driver.status === 'In Transit' ? 'bg-amber-900/20 text-amber-400 border-amber-500/30' :
                    'bg-slate-800 text-slate-400 border-slate-600'
                  }`}>
                    {driver.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div className="bg-black/40 p-1.5 rounded flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 uppercase">Heart Rate</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                        <span className="text-xs font-mono text-white">{70 + Math.floor(Math.random() * 20)} BPM</span>
                      </div>
                   </div>
                   <div className="bg-black/40 p-1.5 rounded flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 uppercase">Focus</span>
                      <div className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-indigo-400" />
                        <span className="text-xs font-mono text-white">9{Math.floor(Math.random() * 9)}%</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
            {drivers.filter(d => d.status !== 'On Leave').length === 0 && (
               <div className="text-center p-8 text-slate-500 text-xs italic">No active personnel telemetry available.</div>
            )}
          </div>
        </div>

        {/* COL 2: FLEET TELEMETRY */}
        <div className="bg-slate-900/40 rounded-xl p-4 border border-slate-700/50 flex flex-col">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" /> VEHICLE INTEGRITY
          </h3>
          <div className="space-y-4">
            {[
              { id: 'GJ-27-X-1234', type: 'Big Eicher', engine: 98, tires: 92, oil: 85 },
              { id: 'GJ-27-Y-5678', type: 'Small Eicher', engine: 94, tires: 88, oil: 70 },
              { id: 'GJ-27-Z-3456', type: 'Bolero', engine: 100, tires: 95, oil: 98 },
            ].map((truck, i) => (
               <div key={i} className="relative group">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-300">{truck.id}</span>
                    <span className="text-[9px] text-slate-500 uppercase">{truck.type}</span>
                 </div>
                 <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full ${truck.engine > 90 ? 'bg-green-500' : 'bg-amber-500'} transition-all`} 
                      style={{ width: `${truck.engine}%` }}
                    ></div>
                 </div>
                 <div className="grid grid-cols-3 gap-2 text-[9px] font-mono text-slate-400">
                    <div className="flex items-center gap-1"><Gauge className="w-3 h-3" /> ENG: {truck.engine}%</div>
                    <div className="flex items-center gap-1"><Radio className="w-3 h-3" /> TIR: {truck.tires}%</div>
                    <div className="flex items-center gap-1"><Thermometer className="w-3 h-3" /> OIL: {truck.oil}%</div>
                 </div>
                 <div className="absolute inset-0 border border-indigo-500/0 group-hover:border-indigo-500/20 rounded-lg pointer-events-none transition-all"></div>
               </div>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-slate-800">
             <div className="flex justify-between items-center bg-green-900/10 p-2 rounded border border-green-500/20">
                <div className="flex items-center gap-2">
                   <CheckCircle className="w-4 h-4 text-green-400" />
                   <span className="text-xs font-bold text-green-300 uppercase">Fleet Status</span>
                </div>
                <span className="text-xs font-mono text-green-400">OPTIMAL</span>
             </div>
          </div>
        </div>

        {/* COL 3: LOGIC STREAM */}
        <div className="bg-black/50 rounded-xl p-4 border border-slate-700/50 flex flex-col font-mono relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
           <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" /> LIVE DECISION LOG
           </h3>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 text-[10px] h-[300px]">
              {logs.map((log, i) => (
                <div key={i} className="text-indigo-200/80 border-b border-indigo-500/10 pb-1 last:border-0 animate-in slide-in-from-left-2 duration-300">
                   <span className="text-indigo-500 mr-2">{'>'}</span>{log}
                </div>
              ))}
              <div ref={logEndRef}></div>
           </div>

           {/* Decor */}
           <div className="absolute bottom-2 right-2 text-[8px] text-slate-600">
              SHAKTI_NEURAL_V2.4.1
           </div>
        </div>

      </div>

      {/* BACKGROUND FX */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

    </div>
  );
};