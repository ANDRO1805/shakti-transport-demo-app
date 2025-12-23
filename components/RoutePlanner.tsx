import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Navigation, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Loader2,
  Crosshair,
  Package
} from 'lucide-react';
import { Shipment, ShipmentStatus } from '../types';

interface RoutePlannerProps {
  onDispatch: (shipment: Partial<Shipment>) => void;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({ onDispatch }) => {
  const [inputs, setInputs] = useState({
    origin: '',
    destination: '',
    weight: '',
    cargoType: ''
  });

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleCalculate = () => {
    if (!inputs.origin || !inputs.destination) return;
    
    setCalculating(true);
    setResult(null);

    // Simulate complex calculation
    setTimeout(() => {
      const dist = Math.floor(Math.random() * 300) + 50; // 50-350km
      const weightNum = Number(inputs.weight) || 5;
      const fuelRate = 95; // Rs/Liter
      const mileage = weightNum > 5 ? 4 : 7; // km/l
      const fuelCost = Math.floor((dist / mileage) * fuelRate);
      const baseRate = 2500;
      const weightCharge = weightNum * 800;
      const revenue = baseRate + weightCharge + (dist * 40);
      
      setResult({
        distance: dist,
        time: `${Math.floor(dist / 40)}h ${Math.floor((dist % 40) * 1.5)}m`,
        fuelCost,
        revenue,
        profit: revenue - fuelCost,
        vehicle: weightNum > 6 ? 'Big Eicher' : 'Small Eicher',
        risk: dist > 200 ? 'Moderate (Weather)' : 'Low'
      });
      setCalculating(false);
    }, 1500);
  };

  const handleDispatch = () => {
    if (!result) return;
    onDispatch({
      origin: inputs.origin,
      destination: inputs.destination,
      vehicle: result.vehicle,
      goodsType: inputs.cargoType || 'General Cargo',
      client: 'Internal Logistics'
    });
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500 min-h-[600px] flex flex-col md:flex-row gap-6">
      
      {/* LEFT: INPUT CONSOLE */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 relative z-10">
         <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
            <h2 className="text-xl font-black text-white flex items-center gap-2 mb-6">
               <Crosshair className="w-6 h-6 text-indigo-400 animate-spin-slow" />
               TACTICAL <span className="text-indigo-500">OPS</span>
            </h2>

            <div className="space-y-4">
               <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold ml-1">Origin Coordinates</label>
                  <div className="relative">
                     <MapIcon className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                     <input 
                       value={inputs.origin}
                       onChange={e => setInputs({...inputs, origin: e.target.value})}
                       className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-indigo-500 outline-none font-mono placeholder:text-slate-700"
                       placeholder="CITY / HUB A"
                     />
                  </div>
               </div>

               <div className="space-y-1">
                  <label className="text-xs text-slate-500 uppercase font-bold ml-1">Target Vector</label>
                  <div className="relative">
                     <Navigation className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                     <input 
                       value={inputs.destination}
                       onChange={e => setInputs({...inputs, destination: e.target.value})}
                       className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-indigo-500 outline-none font-mono placeholder:text-slate-700"
                       placeholder="CITY / HUB B"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold ml-1">Payload (Tons)</label>
                     <div className="relative">
                        <TrendingUp className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input 
                          type="number"
                          value={inputs.weight}
                          onChange={e => setInputs({...inputs, weight: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-indigo-500 outline-none font-mono placeholder:text-slate-700"
                          placeholder="0.0"
                        />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs text-slate-500 uppercase font-bold ml-1">Cargo Class</label>
                     <div className="relative">
                        <Package className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input 
                          value={inputs.cargoType}
                          onChange={e => setInputs({...inputs, cargoType: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-indigo-500 outline-none font-mono placeholder:text-slate-700"
                          placeholder="TYPE"
                        />
                     </div>
                  </div>
               </div>

               <button 
                 onClick={handleCalculate}
                 disabled={calculating || !inputs.origin || !inputs.destination}
                 className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg uppercase tracking-wider shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 {calculating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5" />}
                 {calculating ? 'Processing...' : 'Run Simulation'}
               </button>
            </div>
         </div>
         
         <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-500">
            <p>SYSTEM READY.</p>
            <p>WAITING FOR PARAMETERS...</p>
         </div>
      </div>

      {/* RIGHT: OUTPUT DISPLAY */}
      <div className="w-full md:w-2/3 relative">
         <div className="absolute inset-0 bg-slate-900/50 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-center">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
            
            {!result && !calculating && (
               <div className="text-center opacity-30">
                  <MapIcon className="w-24 h-24 mx-auto mb-4 text-indigo-400" />
                  <p className="text-xl font-black text-white tracking-widest uppercase">Awaiting Route Data</p>
               </div>
            )}

            {result && !calculating && (
               <div className="relative z-10 w-full h-full p-8 flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                     <div>
                        <h3 className="text-3xl font-black text-white tracking-tighter">ROUTE CONFIRMED</h3>
                        <p className="text-indigo-400 font-mono text-sm">{inputs.origin.toUpperCase()} <span className="text-slate-600 px-2">TO</span> {inputs.destination.toUpperCase()}</p>
                     </div>
                     <div className="text-right">
                        <div className="px-4 py-1 bg-green-500/10 border border-green-500/30 rounded text-green-400 font-bold uppercase text-xs tracking-wider inline-block mb-1">
                           Viable Path
                        </div>
                        <p className="text-slate-400 text-xs font-mono">{new Date().toLocaleDateString()}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                     <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Est. Distance</p>
                        <p className="text-2xl font-mono text-white">{result.distance} <span className="text-sm text-slate-600">km</span></p>
                     </div>
                     <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Est. Time</p>
                        <p className="text-2xl font-mono text-white">{result.time}</p>
                     </div>
                     <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Recommended Unit</p>
                        <p className="text-lg font-mono text-white truncate">{result.vehicle}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                           <span className="text-slate-400">Projected Revenue</span>
                           <span className="text-green-400 font-mono font-bold">₹{result.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                           <span className="text-slate-400">Fuel Cost (Est.)</span>
                           <span className="text-red-400 font-mono font-bold">- ₹{result.fuelCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg pt-2">
                           <span className="text-white font-bold">Net Profit Margin</span>
                           <span className="text-indigo-400 font-mono font-bold">₹{result.profit.toLocaleString()}</span>
                        </div>
                     </div>

                     <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700 flex flex-col justify-center">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-2 flex items-center gap-2">
                           <AlertTriangle className="w-3 h-3 text-amber-500" /> Route Risk Scan
                        </p>
                        <p className="text-sm text-white">{result.risk}</p>
                        <div className="w-full bg-slate-700 h-1 mt-3 rounded-full overflow-hidden">
                           <div className="bg-amber-500 h-full w-[30%]"></div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-auto">
                     <button 
                       onClick={handleDispatch}
                       className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-3 group"
                     >
                        <Truck className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        Initialize Manifest
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};