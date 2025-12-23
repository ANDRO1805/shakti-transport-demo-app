import React, { useState } from "react";
import { Users, Search, Plus, Edit, Trash2 } from "lucide-react";
import { Driver } from "../types";

interface Props {
  drivers: Driver[];
  onAddDriver: (d: Driver) => void;
  onUpdateDriver: (d: Driver) => void;
  onDeleteDriver: (id: number) => void;
}

export const DriverManager: React.FC<Props> = ({
  drivers,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver,
}) => {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Driver | null>(null);
  const [form, setForm] = useState<Omit<Driver, "id">>({
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
  });

  const openEdit = (d: Driver) => {
    const { id, ...rest } = d;
    setEditing(d);
    setForm(rest);
  };

  const save = () => {
    if (editing) {
      onUpdateDriver({ id: editing.id, ...form });
    } else {
      onAddDriver({ id: Date.now(), ...form });
    }
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-xl text-white font-bold">Drivers</h2>
        <button
          onClick={() => {
            setEditing(null);
            setForm({ ...form, name: "", phone: "" });
          }}
          className="bg-green-600 px-3 py-1 rounded text-white flex gap-1"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      <input
        className="bg-slate-800 p-2 rounded w-full text-white"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-4">
        {drivers
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((d) => (
            <div key={d.id} className="p-4 bg-slate-900 rounded border">
              <h3 className="text-white font-bold">{d.name}</h3>
              <p className="text-xs text-slate-400">{d.phone}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(d)}>
                  <Edit size={14} />
                </button>
                <button onClick={() => onDeleteDriver(d.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="bg-slate-900 p-4 rounded space-y-2">
        <input
          className="bg-slate-800 p-2 rounded w-full text-white"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="bg-slate-800 p-2 rounded w-full text-white"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button
          onClick={save}
          className="bg-indigo-600 w-full py-2 rounded text-white font-bold"
        >
          Save
        </button>
      </div>
    </div>
  );
};
