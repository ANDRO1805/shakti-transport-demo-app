import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Driver } from "../types";

/* ================= TYPES ================= */

type DriverForm = Omit<Driver, "id">;

interface DriverManagerProps {
  drivers: Driver[];
  onAddDriver: (driver: Driver) => void;
  onUpdateDriver: (driver: Driver) => void;
  onDeleteDriver: (id: number) => void;
}

/* ================= COMPONENT ================= */

export const DriverManager: React.FC<DriverManagerProps> = ({
  drivers,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
}) => {
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const emptyForm: DriverForm = {
    name: "",
    phone: "",
    role: "Driver",
    license: "",
    licenseExpiry: "",
    status: "Active",
    vehicle: "Unassigned",
    financials: {
      baseSalary: 15000,
      bonus: 0,
      deductions: 0,
      status: "Pending",
    },
    paymentHistory: [],
    attendance: {},
  };

  const [form, setForm] = useState<DriverForm>(emptyForm);

  /* ================= HANDLERS ================= */

  const openAdd = () => {
    setEditingDriver(null);
    setForm(emptyForm);
  };

  const openEdit = (driver: Driver) => {
    const { id, ...rest } = driver; // 🔥 strip id here
    setEditingDriver(driver);
    setForm(rest);
  };

  const saveDriver = () => {
    if (editingDriver) {
      onUpdateDriver({
        id: editingDriver.id, // ✅ id added ONCE
        ...form,
      });
    } else {
      onAddDriver({
        id: Date.now(), // ✅ id added ONCE
        ...form,
      });
    }
    openAdd();
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Drivers</h2>
        <button
          onClick={openAdd}
          className="bg-green-600 px-4 py-2 rounded text-white flex items-center gap-2 text-sm font-bold"
        >
          <Plus size={16} />
          Add Driver
        </button>
      </div>

      {/* DRIVER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div
            key={driver.id}
            className="p-4 rounded border border-slate-800 bg-slate-900"
          >
            <h3 className="text-white font-bold">{driver.name}</h3>
            <p className="text-xs text-slate-400">{driver.phone}</p>

            <div className="flex gap-2 mt-3">
              <button onClick={() => openEdit(driver)}>
                <Edit size={14} className="text-indigo-400" />
              </button>
              <button onClick={() => onDeleteDriver(driver.id)}>
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FORM */}
      <div className="p-4 bg-slate-900 rounded border border-slate-800 space-y-3">
        <h3 className="text-white font-bold text-sm">
          {editingDriver ? "Edit Driver" : "Add Driver"}
        </h3>

        <input
          className="w-full bg-slate-800 p-2 rounded text-white"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full bg-slate-800 p-2 rounded text-white"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          className="w-full bg-slate-800 p-2 rounded text-white"
          placeholder="License"
          value={form.license}
          onChange={(e) => setForm({ ...form, license: e.target.value })}
        />

        <button
          onClick={saveDriver}
          className="w-full bg-indigo-600 py-2 rounded text-white font-bold"
        >
          Save
        </button>
      </div>
    </div>
  );
};
