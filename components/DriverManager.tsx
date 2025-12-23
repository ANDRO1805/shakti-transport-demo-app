import React, { useState } from "react";
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
  DollarSign,
  AlertTriangle,
  User,
  X,
} from "lucide-react";
import { Driver, AttendanceData, FinancialData, PaymentRecord } from "../types";

/* ===================== MODAL ===================== */

const Modal: React.FC<{
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}> = ({ title, onClose, children, maxWidth = "max-w-lg" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/80"
      onClick={onClose}
    />
    <div
      className={`relative z-10 w-full ${maxWidth} rounded-2xl border border-slate-700 bg-slate-900 shadow-xl max-h-[90vh] flex flex-col`}
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-slate-400 hover:text-white" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

/* ===================== DRIVER MANAGER ===================== */

interface DriverManagerProps {
  drivers: Driver[];
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (id: number) => void;
  onAddDriver: (driver: Driver) => void;
}

export const DriverManager: React.FC<DriverManagerProps> = ({
  drivers,
  onUpdateDriver,
  onDeleteDriver,
  onAddDriver,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const [formData, setFormData] = useState<Partial<Driver>>({
    name: "",
    phone: "",
    role: "Driver",
    license: "",
    licenseExpiry: "",
    status: "Active",
    vehicle: "Unassigned",
  });

  const filteredDrivers = drivers.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.license.includes(searchTerm);
    const matchStatus =
      statusFilter === "ALL" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleSubmit = () => {
    if (selectedDriver) {
      onUpdateDriver({
        ...selectedDriver,
        ...formData,
      } as Driver);
    } else {
      onAddDriver({
        id: Date.now(),
        ...(formData as Driver),
        financials: {
          baseSalary: 15000,
          bonus: 0,
          deductions: 0,
          status: "Pending",
        },
        paymentHistory: [],
        attendance: {},
      });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-400" />
          Fleet Personnel
        </h2>

        <div className="flex gap-2">
          {["ALL", "Active", "In Transit", "On Leave"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded text-xs font-bold ${
                statusFilter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded text-white text-sm"
              placeholder="Search name or license"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setSelectedDriver(null);
              setIsFormOpen(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* DRIVER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDrivers.map((driver) => (
          <div
            key={driver.id}
            className="border border-slate-800 rounded-xl p-5 bg-slate-900"
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-white font-bold">{driver.name}</h3>
                <p className="text-xs text-indigo-400">{driver.role}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => {
                  setSelectedDriver(driver);
                  setFormData(driver);
                  setIsFormOpen(true);
                }}>
                  <Edit className="w-4 h-4 text-slate-400" />
                </button>
                <button onClick={() => onDeleteDriver(driver.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 flex gap-1 items-center">
                  <CreditCard className="w-3 h-3" /> License
                </span>
                <span className="text-white font-mono">{driver.license}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex gap-1 items-center">
                  <Truck className="w-3 h-3" /> Vehicle
                </span>
                <span className="text-white">{driver.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex gap-1 items-center">
                  <Phone className="w-3 h-3" /> Phone
                </span>
                <span className="text-white">{driver.phone}</span>
              </div>
            </div>

            <button
              className="mt-4 w-full bg-slate-800 text-slate-300 py-2 rounded text-xs font-bold"
              onClick={() => {
                setSelectedDriver(driver);
                setIsManageOpen(true);
              }}
            >
              Full Profile
            </button>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <Modal
          title={selectedDriver ? "Edit Driver" : "Add Driver"}
          onClose={() => setIsFormOpen(false)}
        >
          <div className="space-y-4">
            <input
              className="w-full bg-slate-800 p-2 rounded text-white"
              placeholder="Name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              className="w-full bg-slate-800 p-2 rounded text-white"
              placeholder="Phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded font-bold"
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
