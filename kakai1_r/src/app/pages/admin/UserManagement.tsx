import React, { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, UserCheck } from "lucide-react";
import { employees as initialEmployees, Employee } from "../../data/mockData";

const roleColors: Record<string, string> = {
  Administrator: "bg-purple-50 text-purple-600 border-purple-200",
  Staff: "bg-blue-50 text-blue-600 border-blue-200",
  Stockman: "bg-green-50 text-green-600 border-green-200",
  Cashier: "bg-orange-50 text-orange-600 border-orange-200",
};

export default function UserManagement() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [form, setForm] = useState<Partial<Employee & { password: string }>>({});

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditEmp(null); setForm({ role: "Staff", status: "Active" }); setShowForm(true); };
  const openEdit = (e: Employee) => { setEditEmp(e); setForm(e); setShowForm(true); };

  const save = () => {
    if (editEmp) {
      setEmployees((prev) => prev.map((e) => e.id === editEmp.id ? { ...e, ...form } as Employee : e));
    } else {
      const newId = Math.max(...employees.map((e) => e.id)) + 1;
      setEmployees((prev) => [...prev, { ...form, id: newId, lastLogin: "Never", dateHired: new Date().toISOString().split("T")[0], avatar: (form.name || "U").substring(0, 2).toUpperCase() } as Employee]);
    }
    setShowForm(false);
  };

  const del = (id: number) => { if (confirm("Delete this user?")) setEmployees((prev) => prev.filter((e) => e.id !== id)); };
  const toggleStatus = (id: number) => setEmployees((prev) => prev.map((e) => e.id === id ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" } : e));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">User Management</h1>
          <p className="text-slate-400 text-sm">Manage employee accounts and role assignments</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["All", "Administrator", "Stockman", "Cashier"].map((r) => (
          <div key={r} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs">{r === "All" ? "Total Users" : r + "s"}</p>
            <p className="text-slate-800 font-bold text-2xl mt-1">{r === "All" ? employees.length : employees.filter((e) => e.role === r).length}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or role…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Employee</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Phone</th>
                <th className="px-4 py-3 text-left font-medium">Date Hired</th>
                <th className="px-4 py-3 text-left font-medium">Last Login</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">
                        {e.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-slate-700 font-medium">{e.name}</p>
                        <p className="text-slate-400 text-xs">{e.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${roleColors[e.role] || "bg-slate-50 text-slate-500 border-slate-200"}`}>{e.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{e.phone}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{e.dateHired}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{e.lastLogin}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(e.id)} className={`text-xs px-2 py-1 rounded-full border font-medium transition-colors ${e.status === "Active" ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-100" : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100"}`}>
                      {e.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => del(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500" disabled={e.id === 1}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-slate-800 font-semibold flex items-center gap-2"><UserCheck size={16} className="text-orange-500" />{editEmp ? "Edit User" : "Add User"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3">
              <div><label className="text-slate-500 text-xs mb-1 block">Full Name</label><input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div><label className="text-slate-500 text-xs mb-1 block">Email</label><input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              <div><label className="text-slate-500 text-xs mb-1 block">Phone</label><input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>
              {!editEmp && <div><label className="text-slate-500 text-xs mb-1 block">Password</label><input type="password" value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" /></div>}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-slate-500 text-xs mb-1 block">Role</label>
                  <select value={form.role || "Staff"} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Administrator</option><option>Staff</option><option>Stockman</option><option>Cashier</option>
                  </select>
                </div>
                <div><label className="text-slate-500 text-xs mb-1 block">Status</label>
                  <select value={form.status || "Active"} onChange={(e) => setForm({ ...form, status: e.target.value as any })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-600 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50">Cancel</button>
                <button onClick={save} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">Save User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
