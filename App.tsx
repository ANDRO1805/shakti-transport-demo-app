import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Menu, 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Building2,
  Thermometer,
  CheckCircle2,
  Box,
  TrendingUp,
  Shield,
  User,
  Phone,
  Container,
  Zap,
  ShieldAlert,
  ArrowUpRight,
  DollarSign,
  Activity,
  Navigation,
  Wallet,
  ArrowUpCircle,
  BarChart3
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { AiChatbot } from './components/AiChatbot';
import { VehicleManager } from './components/VehicleManager';
import { DriverManager } from './components/DriverManager';
import { ShipmentManager } from './components/ShipmentManager';
import { ClientManager } from './components/ClientManager';
import { ClientPortal } from './components/ClientPortal';
import { UserManagement } from './components/UserManagement';
import { UserRole, ShipmentStatus, ViewState, Shipment, KpiData, ClientTier, Driver, Invoice, Vehicle, VehicleStatus, Client, AppUser, UserStatus } from './types';

// --- INITIAL SEED DATA ---
const SEED_USERS: AppUser[] = [
  { id: 'u-1', name: 'Shakti Admin', email: 'shakti847@gmail.com', role: UserRole.SUPER_ADMIN, status: UserStatus.ACTIVE },
  { id: 'u-2', name: 'Reva Industries', email: 'ops@revaind.com', role: UserRole.COMPANY_OWNER, status: UserStatus.ACTIVE },
  { id: 'u-3', name: 'PST Polytech', email: 'amit@pstpoly.com', role: UserRole.COMPANY_OWNER, status: UserStatus.ACTIVE },
  { id: 'u-4', name: 'AutoComp Pvt Ltd', email: 'procurement@autocomp.com', role: UserRole.COMPANY_OWNER, status: UserStatus.ACTIVE },
  { id: 'u-5', name: 'Reva Representative', email: 'rep@revaind.com', role: UserRole.COMPANY_REPRESENTATIVE, status: UserStatus.ACTIVE },
];

const INITIAL_DRIVERS: Driver[] = [
  {
    id: 1,
    name: 'Vikram Singh',
    role: 'Lead Driver',
    license: 'GJ-01-2015-0012345',
    licenseExpiry: '2026-10-15',
    joinDate: '2018-05-10',
    phone: '+91 98250 11223',
    status: 'In Transit',
    vehicle: 'GJ-27-X-1234',
    financials: { baseSalary: 18000, bonus: 2000, deductions: 500, status: 'Pending' },
    paymentHistory: [],
    attendance: {}
  },
  {
    id: 2,
    name: 'Rajesh Patel',
    role: 'Driver',
    license: 'GJ-01-2012-0055667',
    licenseExpiry: '2025-03-20',
    joinDate: '2019-11-02',
    phone: '+91 98250 44556',
    status: 'Active',
    vehicle: 'GJ-27-Y-5678',
    financials: { baseSalary: 15000, bonus: 0, deductions: 0, status: 'Paid' },
    paymentHistory: [],
    attendance: {}
  }
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'V-001', registrationNumber: 'GJ-27-X-1234', type: 'Big Eicher', capacity: '7 Tons', status: VehicleStatus.IN_TRANSIT, lastMaintenance: '2024-04-10', features: ['GPS', 'Hydraulic Lift'] },
  { id: 'V-002', registrationNumber: 'GJ-27-Y-5678', type: 'Small Eicher', capacity: '4 Tons', status: VehicleStatus.AVAILABLE, lastMaintenance: '2024-03-01', features: ['Fastag'] },
  { id: 'V-003', registrationNumber: 'GJ-27-Z-9012', type: 'Small Eicher', capacity: '4 Tons', status: VehicleStatus.AVAILABLE, lastMaintenance: '2024-05-02', features: ['GPS'] },
  { id: 'V-004', registrationNumber: 'GJ-01-B-9988', type: 'Bolero Pickup', capacity: '1.5 Tons', status: VehicleStatus.MAINTENANCE, lastMaintenance: '2024-01-15', features: ['Reinforced Bed'] },
  { id: 'V-005', registrationNumber: 'GJ-01-B-7766', type: 'Bolero Pickup', capacity: '1.5 Tons', status: VehicleStatus.AVAILABLE, lastMaintenance: '2024-04-20', features: ['Standard'] },
  { id: 'V-006', registrationNumber: 'GJ-01-C-1122', type: 'Small Carry', capacity: '1 Ton', status: VehicleStatus.AVAILABLE, lastMaintenance: '2024-03-15', features: ['City Compact'] },
];

const INITIAL_CLIENTS: Client[] = [
  { id: 'CL-001', companyName: 'PST Polytech', contactPerson: 'Amit Shah', phone: '+91 98980 11111', email: 'amit@pstpoly.com', address: 'GIDC, Kalol', tier: ClientTier.GOLD, status: 'Active', joinedDate: '2023-01-10' },
  { id: 'CL-002', companyName: 'Reva Industries', contactPerson: 'Rajiv Menon', phone: '+91 98980 22222', email: 'ops@revaind.com', address: 'Makarpura, Vadodara', tier: ClientTier.DIAMOND, status: 'Active', joinedDate: '2022-11-05' },
];

const INITIAL_SHIPMENTS: Shipment[] = [
  { 
    id: 'ST-2024-001', 
    origin: 'Kalol (Base)', 
    destination: 'Surat', 
    client: 'PST Polytech', 
    status: ShipmentStatus.IN_TRANSIT, 
    date: '2024-05-10', 
    vehicle: 'GJ-27-X-1234 (Big Eicher)', 
    goodsType: 'PVC Granules', 
    weight: '7', 
    driverId: 1,
    pickupDate: '2024-05-10',
    totalWeight: 7,
    stops: [],
    isMultiStop: false,
    isNonFragile: true,
    isNonPerishable: true,
    timeline: [
      { status: ShipmentStatus.IN_TRANSIT, timestamp: '2024-05-10T14:30:00', location: 'Vadodara Bypass', note: 'Traffic delay' }, 
      { status: ShipmentStatus.DISPATCHED, timestamp: '2024-05-10T09:00:00', location: 'Kalol Base' }
    ]
  }
];

const INITIAL_INVOICES: Invoice[] = [
  { id: 'INV-1001', client: 'PST Polytech', amount: '45000', status: 'Paid', date: '2024-04-20' },
  { id: 'INV-1002', client: 'Reva Industries', amount: '12500', status: 'Pending', date: '2024-05-02' },
  { id: 'INV-1003', client: 'PST Polytech', amount: '8000', status: 'Processing', date: '2024-05-08' },
];

const REVENUE_DATA = [
  { name: 'Mon', amt: 24000 }, { name: 'Tue', amt: 13980 }, { name: 'Wed', amt: 98000 },
  { name: 'Thu', amt: 39080 }, { name: 'Fri', amt: 48000 }, { name: 'Sat', amt: 38000 }, { name: 'Sun', amt: 43000 },
];

// --- APP COMPONENT ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.VIEWER);
  const [userName, setUserName] = useState<string>('');
  const [clientTier, setClientTier] = useState<ClientTier | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  
  // --- PERSISTENT STATE ---
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('shakti_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('shakti_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('shakti_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('shakti_shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('shakti_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('shakti_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [registrationRequests, setRegistrationRequests] = useState<Client[]>(() => {
    const saved = localStorage.getItem('shakti_reg_requests');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to storage
  useEffect(() => { localStorage.setItem('shakti_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('shakti_drivers', JSON.stringify(drivers)); }, [drivers]);
  useEffect(() => { localStorage.setItem('shakti_vehicles', JSON.stringify(vehicles)); }, [vehicles]);
  useEffect(() => { localStorage.setItem('shakti_shipments', JSON.stringify(shipments)); }, [shipments]);
  useEffect(() => { localStorage.setItem('shakti_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('shakti_invoices', JSON.stringify(invoices)); }, [invoices]);
  useEffect(() => { localStorage.setItem('shakti_reg_requests', JSON.stringify(registrationRequests)); }, [registrationRequests]);

  // --- AUTO-LOGOUT PROTECTION ---
  useEffect(() => {
    if (currentUserEmail) {
      const loggedUser = users.find(u => u.email === currentUserEmail);
      if (loggedUser && loggedUser.status === UserStatus.BLOCKED) {
        handleLogout();
        alert('SECURITY ALERT: Access restricted by administrator.');
      }
    }
  }, [users, currentUserEmail]);

  // --- HANDLERS ---
  const handleLogin = (role: UserRole, name: string, tier?: ClientTier, cId?: string, email?: string) => {
    setUserRole(role);
    setUserName(name);
    setClientTier(tier || null);
    setClientId(cId || null);
    setCurrentUserEmail(email || null);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setUserRole(UserRole.VIEWER);
    setUserName('');
    setClientTier(null);
    setClientId(null);
    setCurrentUserEmail(null);
    setView('HOME');
  };

  const handleAddShipment = (s: Shipment) => setShipments(prev => [s, ...prev]);
  const handleUpdateShipment = (s: Shipment) => setShipments(prev => prev.map(item => item.id === s.id ? s : item));

  const handleAddVehicle = (v: Vehicle) => setVehicles(prev => [v, ...prev]);
  const handleUpdateVehicle = (v: Vehicle) => setVehicles(prev => prev.map(item => item.id === v.id ? v : item));
  const handleDeleteVehicle = (id: string) => setVehicles(prev => prev.filter(v => v.id !== id));

  const handleAddDriver = (d: Driver) => setDrivers(prev => [...prev, d]);
  const handleUpdateDriver = (d: Driver) => setDrivers(prev => prev.map(item => item.id === d.id ? d : item));
  const handleDeleteDriver = (id: number) => setDrivers(prev => prev.filter(d => d.id !== id));

  const handleAddUser = (u: AppUser) => setUsers(prev => [...prev, u]);
  const handleEditUser = (u: AppUser) => setUsers(prev => prev.map(item => item.id === u.id ? u : item));
  const handleDeleteUser = (id: string) => setUsers(prev => prev.filter(u => u.id !== id));
  const handleUpdateUserStatus = (id: string, status: UserStatus) => setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));

  const handleRegisterRequest = (req: Partial<Client>) => {
    const newRequest = { 
      ...req, 
      id: `REQ-${Date.now()}`, 
      tier: ClientTier.SILVER, 
      status: 'Pending' as const, 
      joinedDate: new Date().toISOString().split('T')[0] 
    } as Client;
    setRegistrationRequests(prev => [...prev, newRequest]);
  };

  const handleApproveRequest = (request: Client) => {
    const newClient: Client = { ...request, status: 'Active', id: `CL-${Date.now()}`, joinedDate: new Date().toISOString().split('T')[0] };
    setClients(prev => [...prev, newClient]);
    setRegistrationRequests(prev => prev.filter(r => r.id !== request.id));
    setUsers(prev => [...prev, { id: `u-${Date.now()}`, name: request.companyName, email: request.email, role: UserRole.COMPANY_OWNER, status: UserStatus.ACTIVE }]);
  };
  const handleRejectRequest = (id: string) => {
    setRegistrationRequests(prev => prev.filter(r => r.id !== id));
  };
  const handleAddClient = (c: Client) => setClients(prev => [...prev, c]);
  const handleUpdateClient = (c: Client) => setClients(prev => prev.map(item => item.id === c.id ? c : item));

  const currentClient = clientId ? clients.find(c => c.id === clientId) : null;

  // View Router
  switch (view) {
    case 'LOGIN':
      return <LoginPage setView={setView} onLogin={handleLogin} clients={clients} users={users} />;
    case 'DASHBOARD':
      if ((userRole === UserRole.COMPANY_OWNER || userRole === UserRole.COMPANY_REPRESENTATIVE) && currentClient) {
        return <ClientPortal client={currentClient} shipments={shipments} invoices={invoices} onLogout={handleLogout} onAddBooking={handleAddShipment} />;
      }
      return (
        <AdminDashboard 
          onLogout={handleLogout} userRole={userRole} userName={userName}
          vehicles={vehicles} onUpdateVehicle={handleUpdateVehicle} onAddVehicle={handleAddVehicle} onDeleteVehicle={handleDeleteVehicle}
          drivers={drivers} onAddDriver={handleAddDriver} onUpdateDriver={handleUpdateDriver} onDeleteDriver={handleDeleteDriver}
          clients={clients} requests={registrationRequests} onApproveRequest={handleApproveRequest} onRejectRequest={handleRejectRequest} onAddClient={handleAddClient} onUpdateClient={handleUpdateClient}
          shipments={shipments} onAddShipment={handleAddShipment} onUpdateShipment={handleUpdateShipment}
          users={users} onUpdateUserStatus={handleUpdateUserStatus} onAddUser={handleAddUser} onEditUser={handleEditUser} onDeleteUser={handleDeleteUser}
          invoices={invoices}
        />
      );
    case 'REGISTER': return <RegisterPage setView={setView} onRegister={handleRegisterRequest} />;
    case 'TRACK': return <TrackPage setView={setView} />;
    case 'SERVICES': return <ServicesPage setView={setView} />;
    case 'FLEET': return <FleetPage setView={setView} vehicles={vehicles} />;
    default: return <LandingPage setView={setView} />;
  }
};

// --- SUB-COMPONENTS ---

const AdminDashboard: React.FC<{
  onLogout: () => void; userRole: UserRole; userName: string;
  vehicles: Vehicle[]; onUpdateVehicle: (v: Vehicle) => void; onAddVehicle: (v: Vehicle) => void; onDeleteVehicle: (id: string) => void;
  drivers: Driver[]; onAddDriver: (d: Driver) => void; onUpdateDriver: (d: Driver) => void; onDeleteDriver: (id: number) => void;
  clients: Client[]; requests: Client[]; onApproveRequest: (c: Client) => void; onRejectRequest: (id: string) => void; onAddClient: (c: Client) => void; onUpdateClient: (c: Client) => void;
  shipments: Shipment[]; onAddShipment: (s: Shipment) => void; onUpdateShipment: (s: Shipment) => void;
  users: AppUser[]; onUpdateUserStatus: (id: string, s: UserStatus) => void; onAddUser: (u: AppUser) => void; onEditUser: (u: AppUser) => void; onDeleteUser: (id: string) => void;
  invoices: Invoice[];
}> = (props) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SHIPMENTS' | 'DRIVERS' | 'FLEET' | 'CLIENTS' | 'INVOICES' | 'USERS'>('OVERVIEW');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- REVENUE AGGREGATION LOGIC ---
  const totalGrossRevenue = props.invoices.reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalPaidRevenue = props.invoices.filter(i => i.status === 'Paid').reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalPendingRevenue = props.invoices.filter(i => i.status !== 'Paid').reduce((acc, inv) => acc + Number(inv.amount), 0);
  const totalGlobalShipments = props.shipments.length;

  const KPI_DATA: KpiData[] = [
    { label: 'Total Revenue (MTD)', value: `₹${totalGrossRevenue.toLocaleString()}`, change: 'GROSS', positive: true },
    { label: 'Settled Capital', value: `₹${totalPaidRevenue.toLocaleString()}`, change: 'PAID', positive: true },
    { label: 'Outstanding Dues', value: `₹${totalPendingRevenue.toLocaleString()}`, change: 'PENDING', positive: false },
    { label: 'System Manifests', value: String(totalGlobalShipments), change: 'TOTAL', positive: true },
  ];

  const NavButton: React.FC<{ tab: typeof activeTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
    <button 
      onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative overflow-hidden group active:scale-95 ${
        activeTab === tab ? 'bg-indigo-600 text-white shadow-lg border border-indigo-400/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      {icon} 
      <span className="font-medium tracking-wide">{label}</span>
      {tab === 'CLIENTS' && props.requests.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">{props.requests.length}</span>}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 relative overflow-hidden font-sans">
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}></div>}

      <aside className={`fixed top-0 bottom-0 left-0 w-72 glass-panel z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col border-r border-slate-800 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600 rounded-lg"><Truck className="w-5 h-5 text-white" /></div>
             <h2 className="text-xl font-bold tracking-tight text-white uppercase">Shakti<span className="text-indigo-400"> Admin</span></h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6 overflow-y-auto">
          <NavButton tab="OVERVIEW" icon={<LayoutDashboard className="w-5 h-5" />} label="Mission Control" />
          <NavButton tab="SHIPMENTS" icon={<Package className="w-5 h-5" />} label="Shipments" />
          <NavButton tab="DRIVERS" icon={<Users className="w-5 h-5" />} label="Personnel" />
          <NavButton tab="FLEET" icon={<Truck className="w-5 h-5" />} label="Fleet Assets" />
          <NavButton tab="CLIENTS" icon={<Building2 className="w-5 h-5" />} label="Client Directory" />
          <NavButton tab="INVOICES" icon={<FileText className="w-5 h-5" />} label="Billing Desk" />
          {props.userRole === UserRole.SUPER_ADMIN && <NavButton tab="USERS" icon={<ShieldCheck className="w-5 h-5" />} label="Identity Vault" />}
        </nav>

        <div className="p-6 border-t border-slate-800/50">
           <button onClick={props.onLogout} className="flex items-center justify-center gap-2 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2 hover:bg-red-950/20 rounded-lg text-sm font-medium active:scale-95">
            <LogOut className="w-4 h-4" /> DISCONNECT
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <header className="glass-panel h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-slate-800/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white"><Menu className="w-6 h-6" /></button>
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /><span className="text-sm font-mono text-slate-300">{time.toLocaleTimeString()}</span></div>
              <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-green-400" /><span className="text-sm font-mono text-slate-300 uppercase tracking-widest">Uplink Stable</span></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">{props.userName}</p>
                <p className="text-[10px] text-indigo-400 uppercase font-mono tracking-tighter">{props.userRole}</p>
             </div>
             <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs md:text-sm border-2 border-indigo-400/30">{props.userName.charAt(0)}</div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              {/* REVAMPED KPI GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {KPI_DATA.map((kpi, i) => (
                  <div key={i} className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-xl">
                    <div className={`absolute top-0 right-0 p-12 rounded-full blur-3xl group-hover:opacity-20 transition-all ${kpi.positive ? 'bg-indigo-500/5' : 'bg-amber-500/5'}`}></div>
                    
                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                       {i === 0 && <BarChart3 className="w-4 h-4 text-indigo-400" />}
                       {i === 1 && <Wallet className="w-4 h-4 text-green-400" />}
                       {i === 2 && <TrendingUp className="w-4 h-4 text-amber-400" />}
                       {i === 3 && <Navigation className="w-4 h-4 text-cyan-400" />}
                       {kpi.label}
                    </p>
                    
                    <div className="flex items-end justify-between relative z-10">
                      <h3 className={`text-3xl font-black text-white font-mono tracking-tight transition-transform group-hover:scale-105 duration-500 origin-left`}>
                        {kpi.value}
                      </h3>
                      <div className="flex flex-col items-end">
                         <span className={`text-[10px] font-black px-2 py-1 rounded border mb-2 ${kpi.positive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{kpi.change}</span>
                         <div className="h-12 w-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`w-full bg-indigo-500 h-1/2 rounded-full transition-all group-hover:h-full`}></div>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ANALYTICS SECTION */}
              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                 <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-slate-800 h-[350px] md:h-[450px] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Financial Trajectory</h3>
                        <p className="text-[10px] text-slate-400 font-mono">GROSS REVENUE CYCLES (MAY 2024)</p>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-4">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-500"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Paid</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-700"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Projected</span></div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height="75%">
                      <AreaChart data={REVENUE_DATA}>
                        <defs><linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} />
                        <YAxis tickFormatter={(value) => `₹${value/1000}k`} tick={{fill: '#475569', fontSize: 10, fontWeight: 800}} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px', color: '#fff' }} />
                        <Area type="monotone" dataKey="amt" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>

                 <div className="space-y-6 md:space-y-8">
                    <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden group">
                       <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-green-500/5 rounded-full blur-2xl"></div>
                       <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-400" /> Operational Integrity</h3>
                       <div className="space-y-5">
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 flex justify-between items-center group-hover:border-indigo-500/30 transition-all">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Fleet Visibility</span>
                            <span className="text-[11px] text-green-400 font-mono font-black animate-pulse">100.0%</span>
                          </div>
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 flex justify-between items-center group-hover:border-indigo-500/30 transition-all">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Avg Node Latency</span>
                            <span className="text-[11px] text-indigo-400 font-mono font-black">42ms</span>
                          </div>
                          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700 flex justify-between items-center group-hover:border-indigo-500/30 transition-all">
                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Server Core</span>
                            <span className="text-[11px] text-white font-mono font-black">GUJ_V2</span>
                          </div>
                       </div>
                    </div>

                    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between h-[180px]">
                       <div>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Satellite Core Status</p>
                          <p className="text-2xl font-black text-white font-mono uppercase tracking-tighter">Synchronized</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full w-3/4 bg-indigo-500 rounded-full animate-pulse"></div>
                          </div>
                          <span className="text-[10px] font-mono text-indigo-400">75% CPU</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'DRIVERS' && <DriverManager drivers={props.drivers} onUpdateDriver={props.onUpdateDriver} onDeleteDriver={props.onDeleteDriver} onAddDriver={props.onAddDriver} />}
          {activeTab === 'FLEET' && <VehicleManager vehicles={props.vehicles} onUpdateVehicle={props.onUpdateVehicle} onAddVehicle={props.onAddVehicle} onDeleteVehicle={props.onDeleteVehicle} />}
          {activeTab === 'CLIENTS' && <ClientManager clients={props.clients} requests={props.requests} shipments={props.shipments} onApproveRequest={props.onApproveRequest} onRejectRequest={props.onRejectRequest} onAddClient={props.onAddClient} onUpdateClient={props.onUpdateClient} />}
          {activeTab === 'SHIPMENTS' && <ShipmentManager shipments={props.shipments} drivers={props.drivers} vehicles={props.vehicles} clients={props.clients} onUpdateShipment={props.onUpdateShipment} onAddShipment={props.onAddShipment} />}
          {activeTab === 'USERS' && props.userRole === UserRole.SUPER_ADMIN && <UserManagement users={props.users} onUpdateUserStatus={props.onUpdateUserStatus} onAddUser={props.onAddUser} onEditUser={props.onEditUser} onDeleteUser={props.onDeleteUser} />}
          
          {activeTab === 'INVOICES' && (
            <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-slate-800">
                       <tr><th className="px-8 py-5">Node Identity</th><th className="px-8 py-5">Client Entity</th><th className="px-8 py-5">Value</th><th className="px-8 py-5">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                       {props.invoices.map(inv => (
                          <tr key={inv.id} className="hover:bg-slate-900/50 transition-colors group">
                             <td className="px-8 py-5 font-mono text-indigo-400 font-bold group-hover:text-indigo-200">{inv.id}</td>
                             <td className="px-8 py-5 text-white font-bold uppercase text-xs">{inv.client}</td>
                             <td className="px-8 py-5 font-mono text-slate-300">₹{Number(inv.amount).toLocaleString()}</td>
                             <td className="px-8 py-5">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black border uppercase tracking-widest ${inv.status === 'Paid' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                   {inv.status}
                                </span>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
                 {props.invoices.length === 0 && <div className="p-32 text-center text-slate-600 italic uppercase text-[10px] tracking-widest font-black">No historical billing nodes found.</div>}
               </div>
            </div>
          )}
        </div>
      </main>
      <AiChatbot />
    </div>
  );
};

const LoginPage: React.FC<{ setView: (v: ViewState) => void; onLogin: (role: UserRole, name: string, tier?: ClientTier, cId?: string, email?: string) => void; clients: Client[]; users: AppUser[] }> = ({ setView, onLogin, clients, users }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('shakti847@gmail.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        if (matchedUser.status === UserStatus.BLOCKED) {
          setError('ACCESS DENIED: Account currently suspended.');
          setLoading(false);
          return;
        }
        
        // Find if this user is linked to a client company
        const clientProfile = clients.find(c => c.email.toLowerCase() === email.toLowerCase()) || 
                              clients.find(c => email.toLowerCase().includes(c.email.split('@')[1]));
        
        onLogin(matchedUser.role, matchedUser.name, clientProfile?.tier, clientProfile?.id, matchedUser.email);
      } else {
        setError('Authorization failure: Unknown identity.');
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="glass-panel max-w-md w-full rounded-3xl p-8 md:p-12 relative z-10 border border-slate-800 shadow-2xl">
        <div className="text-center mb-10">
          <Truck className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Shakti<span className="text-indigo-500"> Transport</span></h1>
          <p className="text-slate-400 text-[10px] font-mono uppercase tracking-[0.3em]">Secure Sector Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Identity Hub</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" placeholder="user@identity" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Security Key</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" placeholder="••••••••" required />
          </div>
          {error && <div className="text-red-400 text-[10px] text-center font-black flex items-center justify-center gap-2 bg-red-950/20 p-3 rounded-xl border border-red-500/20"><AlertCircle className="w-4 h-4" />{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate Access'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
           <p className="text-[9px] text-slate-600 mb-4 font-mono uppercase tracking-widest">Simulator Overrides</p>
           <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => setEmail('shakti847@gmail.com')} className="text-[9px] bg-slate-900 text-slate-400 px-3 py-2 rounded-lg font-mono border border-slate-800 hover:text-white transition-colors uppercase">Admin</button>
              <button onClick={() => setEmail('ops@revaind.com')} className="text-[9px] bg-slate-900 text-slate-400 px-3 py-2 rounded-lg font-mono border border-slate-800 hover:text-white transition-colors uppercase">Owner</button>
              <button onClick={() => setEmail('rep@revaind.com')} className="text-[9px] bg-slate-900 text-slate-400 px-3 py-2 rounded-lg font-mono border border-slate-800 hover:text-white transition-colors uppercase">Rep</button>
           </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => (
  <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent)] pointer-events-none"></div>
    <div className="relative z-10 flex flex-col items-center max-w-4xl">
      <Truck className="w-16 h-16 md:w-20 md:h-20 text-indigo-500 mb-6 animate-bounce" />
      <h1 className="text-4xl md:text-8xl font-black mb-4 tracking-tighter uppercase leading-none">Shakti<br/><span className="text-indigo-500">Transport</span></h1>
      <p className="text-slate-400 max-w-xl mb-12 text-sm md:text-lg uppercase tracking-widest font-light">Precision Logistics & Heavy-Duty Freight Solutions for Gujarat's Industrial Corridors.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <button onClick={() => setView('LOGIN')} className="px-8 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 text-xs">Access Portals</button>
        <button onClick={() => setView('SERVICES')} className="px-8 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 text-xs">Capabilities</button>
        <button onClick={() => setView('FLEET')} className="px-8 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 text-xs">Fleet Assets</button>
        <button onClick={() => setView('REGISTER')} className="px-8 py-5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 text-xs">Join Network</button>
      </div>
    </div>
  </div>
);

const TrackPage: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => (
  <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center relative overflow-hidden">
    <div className="relative z-10 w-full max-w-2xl mt-20">
      <button onClick={() => setView('HOME')} className="mb-12 text-indigo-400 flex items-center gap-2 font-black uppercase tracking-widest hover:text-indigo-300 text-xs"><ArrowRight className="w-4 h-4 rotate-180" /> Return Home</button>
      <div className="text-center bg-slate-900/40 p-10 rounded-3xl border border-slate-800 shadow-2xl">
        <h1 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Real-Time<br/><span className="text-indigo-500">Tracking</span></h1>
        <p className="text-slate-500 mb-10 text-sm uppercase tracking-widest">Enter Manifest Identifier to track cargo across sector Gujarat.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <input type="text" placeholder="SHAKTI-ST-XXXX" className="flex-1 bg-slate-950 border border-slate-700 rounded-2xl p-5 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono placeholder:text-slate-800" />
          <button className="bg-indigo-600 px-10 py-5 rounded-2xl font-black uppercase tracking-widest active:scale-95 shadow-xl shadow-indigo-500/10">Analyze</button>
        </div>
      </div>
    </div>
  </div>
);

const RegisterPage: React.FC<{ setView: (v: ViewState) => void; onRegister: (req: Partial<Client>) => void }> = ({ setView, onRegister }) => {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(form);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-xl mt-20">
        <button onClick={() => setView('HOME')} className="mb-12 text-indigo-400 flex items-center gap-2 font-black uppercase tracking-widest hover:text-indigo-300 text-xs"><ArrowRight className="w-4 h-4 rotate-180" /> Return Home</button>
        <div className="bg-slate-900/40 p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <h1 className="text-2xl md:text-4xl font-black mb-6 uppercase tracking-tighter text-center">Business<br/><span className="text-indigo-500">Registration</span></h1>
          {done ? (
            <div className="text-center py-10 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black uppercase">Data Transmitted</h2>
              <p className="text-slate-500 mt-4 text-sm tracking-widest">Our operations team will review your credentials and issue a digital portal key within 12 hours.</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Entity Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                  <input placeholder="Legal Company Name" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800" required value={form.companyName} onChange={e => setForm({...form, companyName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Contact Person Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                  <input placeholder="John Doe" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800" required value={form.contactPerson} onChange={e => setForm({...form, contactPerson: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Primary Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                    <input placeholder="ops@company.com" type="email" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-600" />
                    <input placeholder="+91 XXXXX XXXXX" type="tel" className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-4 text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Business Address</label>
                <input placeholder="GIDC / Industrial Area" className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-all placeholder:text-slate-800" required value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-indigo-600 py-5 rounded-2xl font-black uppercase tracking-widest mt-4 active:scale-95 shadow-xl shadow-indigo-500/10 text-sm">Initialize Onboarding</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ServicesPage: React.FC<{ setView: (v: ViewState) => void }> = ({ setView }) => {
  const services = [
    { title: 'Industrial Transport', desc: 'Heavy machinery, PVC, hardware, and metal components.', icon: <Package className="w-8 h-8 text-indigo-400" /> },
    { title: 'GPS Tracking', desc: 'Real-time monitoring of all shipments across Gujarat.', icon: <MapPin className="w-8 h-8 text-cyan-400" /> },
    { title: 'Logistics Optimization', desc: 'Advanced route planning to ensure on-time delivery.', icon: <Truck className="w-8 h-8 text-indigo-500" /> },
    { title: 'Secure Handling', desc: 'Specialized protocols for industrial cargo safety.', icon: <ShieldCheck className="w-8 h-8 text-green-400" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-4xl mt-12 md:mt-20">
        <button onClick={() => setView('HOME')} className="mb-12 text-indigo-400 flex items-center gap-2 font-black uppercase tracking-widest hover:text-indigo-300 text-xs">
          <ArrowRight className="w-4 h-4 rotate-180" /> Return Home
        </button>
        <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter text-center">Our <span className="text-indigo-500">Capabilities</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all group">
              <div className="mb-4">{s.icon}</div>
              <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FleetPage: React.FC<{ setView: (v: ViewState) => void, vehicles: Vehicle[] }> = ({ setView, vehicles }) => {
  const getVehicleStyle = (type: string) => {
    switch (type) {
      case 'Big Eicher': return { color: 'indigo', text: 'text-indigo-400', icon: <Truck className="w-10 h-10" />, accent: 'bg-indigo-500' };
      case 'Small Eicher': return { color: 'blue', text: 'text-blue-400', icon: <Truck className="w-10 h-10" />, accent: 'bg-blue-500' };
      case 'Bolero Pickup': return { color: 'cyan', text: 'text-cyan-400', icon: <Truck className="w-10 h-10" />, accent: 'bg-cyan-500' };
      case 'Small Carry': return { color: 'slate', text: 'text-slate-400', icon: <Truck className="w-10 h-10" />, accent: 'bg-slate-500' };
      default: return { color: 'indigo', text: 'text-indigo-400', icon: <Truck className="w-10 h-10" />, accent: 'bg-indigo-500' };
    }
  };

  const getStatusStyle = (status: VehicleStatus) => {
    switch (status) {
      case VehicleStatus.AVAILABLE: 
        return { 
          badge: 'bg-green-900/40 text-green-400 border-green-500/40', 
          gradient: 'from-green-600/30 via-slate-900/40 to-slate-950', 
          border: 'border-green-500/40',
          icon: <Zap className="w-3 h-3 text-green-400" />
        };
      case VehicleStatus.IN_TRANSIT: 
        return { 
          badge: 'bg-amber-900/40 text-amber-400 border-amber-500/40', 
          gradient: 'from-amber-600/30 via-slate-900/40 to-slate-950', 
          border: 'border-amber-500/40',
          icon: <TrendingUp className="w-3 h-3 text-amber-400" />
        };
      case VehicleStatus.MAINTENANCE: 
        return { 
          badge: 'bg-red-900/40 text-red-400 border-red-500/40', 
          gradient: 'from-red-600/30 via-slate-900/40 to-slate-950', 
          border: 'border-red-500/40',
          icon: <ShieldAlert className="w-3 h-3 text-red-400" />
        };
      default: 
        return { 
          badge: 'bg-slate-800 text-slate-400 border-slate-700', 
          gradient: 'from-slate-600/30 via-slate-900/40 to-slate-950', 
          border: 'border-slate-800',
          icon: <Clock className="w-3 h-3 text-slate-400" />
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-5xl mt-12 md:mt-20">
        <button onClick={() => setView('HOME')} className="mb-12 text-indigo-400 flex items-center gap-2 font-black uppercase tracking-widest hover:text-indigo-300 text-xs">
          <ArrowRight className="w-4 h-4 rotate-180" /> Return Home
        </button>
        <h1 className="text-4xl md:text-6xl font-black mb-12 uppercase tracking-tighter text-center">Operational <span className="text-indigo-500">Fleet</span></h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => {
            const vehicleStyle = getVehicleStyle(v.type);
            const statusStyle = getStatusStyle(v.status);
            return (
              <div key={v.id} className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:translate-y-[-6px] group relative overflow-hidden bg-gradient-to-br ${statusStyle.gradient} ${statusStyle.border} shadow-2xl`}>
                 
                 {/* ID Overlay */}
                 <div className="absolute -bottom-4 -right-4 text-7xl font-black text-white/5 font-mono select-none pointer-events-none group-hover:text-white/10 transition-colors">
                    {v.id.split('-')[1]}
                 </div>

                 <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className={`p-5 rounded-3xl bg-slate-900/50 border ${statusStyle.border} shadow-2xl group-hover:scale-110 transition-transform ${vehicleStyle.text}`}>
                      {vehicleStyle.icon}
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest border flex items-center gap-2 ${statusStyle.badge}`}>
                      {statusStyle.icon}
                      {v.status}
                    </span>
                 </div>
                 
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black font-mono text-white mb-1 tracking-tighter flex items-center gap-2">
                       {v.registrationNumber}
                    </h3>
                    <p className={`${vehicleStyle.text} text-[11px] font-black uppercase tracking-[0.3em] mb-8`}>{v.type}</p>
                    
                    <div className="space-y-5 pt-6 border-t border-white/5 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
                             <TrendingUp className="w-3 h-3" /> Payload Max
                          </span> 
                          <span className="text-slate-200 font-bold bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{v.capacity}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-5">
                           {v.features.map((f, i) => (
                              <span key={i} className="px-3 py-1.5 bg-slate-950/80 rounded-xl text-[9px] text-slate-400 border border-white/5 uppercase font-black tracking-tighter group-hover:text-indigo-300 transition-colors">
                                # {f}
                              </span>
                           ))}
                        </div>
                    </div>
                 </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-20 p-12 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05),transparent)] pointer-events-none"></div>
           <div className="relative z-10">
              <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Architect your logistics network.</h4>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">Gujarat's most responsive heavy-duty fleet is at your disposal.</p>
           </div>
           <button onClick={() => setView('REGISTER')} className="relative z-10 bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(79,70,229,0.3)] active:scale-95 text-xs whitespace-nowrap border border-indigo-400/50">
              Initialize Onboarding
           </button>
        </div>
      </div>
    </div>
  );
};

export default App;