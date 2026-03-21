import React, { useState } from "react";
import { Search, Activity, Filter, Download } from "lucide-react";
import { activityLogs } from "../../data/mockData";

const actionColors: Record<string, string> = {
  LOGIN: "bg-green-50 text-green-600 border-green-200",
  LOGOUT: "bg-slate-50 text-slate-500 border-slate-200",
  CREATE: "bg-blue-50 text-blue-600 border-blue-200",
  UPDATE: "bg-amber-50 text-amber-600 border-amber-200",
  DELETE: "bg-red-50 text-red-600 border-red-200",
  VIEW: "bg-purple-50 text-purple-600 border-purple-200",
};

export default function ActivityLog() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const actions = ["All", "LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "VIEW"];
  const roles = ["All", "Admin", "Stockman", "Cashier", "Staff"];

  const filtered = activityLogs.filter((log) => {
    const matchSearch = log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === "All" || log.action === actionFilter;
    const matchRole = roleFilter === "All" || log.role === roleFilter;
    return matchSearch && matchAction && matchRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-slate-800 text-xl font-bold">Activity Log</h1>
          <p className="text-slate-400 text-sm">Full audit trail of all system activities</p>
        </div>
        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: activityLogs.length, color: "text-slate-800" },
          { label: "Logins Today", value: activityLogs.filter((l) => l.action === "LOGIN").length, color: "text-green-600" },
          { label: "Data Changes", value: activityLogs.filter((l) => ["CREATE", "UPDATE", "DELETE"].includes(l.action)).length, color: "text-blue-600" },
          { label: "Active Users", value: 4, color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs">{s.label}</p>
            <p className={`font-bold text-2xl mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by user, module, or details…" className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white" />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-700">
          {actions.map((a) => <option key={a}>{a}</option>)}
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-slate-700">
          {roles.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs">
                <th className="px-4 py-3 text-left font-medium">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Action</th>
                <th className="px-4 py-3 text-left font-medium">Module</th>
                <th className="px-4 py-3 text-left font-medium">Details</th>
                <th className="px-4 py-3 text-left font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 text-slate-500 text-xs font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold flex-shrink-0">
                        {log.user.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                      </div>
                      <span className="text-slate-700 text-xs font-medium">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{log.role}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${actionColors[log.action] || "bg-slate-50 text-slate-500 border-slate-200"}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{log.module}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{log.details}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Activity size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No activity found</p>
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-slate-400 text-xs">Showing {filtered.length} of {activityLogs.length} log entries</p>
        </div>
      </div>
    </div>
  );
}
