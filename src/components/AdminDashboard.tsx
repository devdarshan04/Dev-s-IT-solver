import { useState } from 'react';
import { AnalyticsMetrics, ProblemRecord, IssueStatus } from '../types';
import { INITIAL_ANALYTICS } from '../data/initialData';
import { storageService } from '../services/storage';
import { 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  Activity, 
  Flame, 
  ArrowUpRight, 
  ArrowDownRight
} from 'lucide-react';

export function AdminDashboard() {
  const [analytics] = useState<AnalyticsMetrics>(INITIAL_ANALYTICS);
  const [incidents, setIncidents] = useState<ProblemRecord[]>(() => storageService.getHistory());

  const updateIncidentStatus = (id: string, newStatus: IssueStatus) => {
    const updated = storageService.updateRecordStatus(id, newStatus);
    setIncidents(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Admin & Operations Console
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Stream
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Global Incident Analytics & IT Health
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time insights across developer environments, automated diagnostics, and system RCA bottlenecks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sarah Chen</div>
            <div className="text-[10px] text-slate-400">Lead DevOps Administrator</div>
          </div>
          <img
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
            alt="Admin"
            className="w-10 h-10 rounded-xl object-cover border border-purple-400 shadow-sm"
          />
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Issues Diagnosed
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
              {analytics.totalIssuesDiagnosed.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +14.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">From 428 registered workstations</p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Automated Fix Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {analytics.resolutionRate}%
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +3.5%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1,685 verified root resolutions</p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Avg Time to Resolution
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
              {analytics.avgResolutionTimeMinutes}m
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -2.4m
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Reduced by automated OCR extraction</p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Critical Incidents Open
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400 font-mono">
              {analytics.unresolvedCount}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-amber-500">
              94 In-Progress
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Assigned to SRE on-call engineers</p>
        </div>

      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Weekly Incident Trends (SVG Chart) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Weekly Incident Diagnosis vs Resolution Trend
              </h3>
              <p className="text-[11px] text-slate-400">Reported errors (Indigo) vs Resolved Playbooks (Cyan)</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-indigo-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                Reported
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
                Resolved
              </span>
            </div>
          </div>

          {/* Responsive SVG Chart */}
          <div className="h-60 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="barIndigo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="barCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="40" y1="20" x2="490" y2="20" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
              <line x1="40" y1="70" x2="490" y2="70" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
              <line x1="40" y1="120" x2="490" y2="120" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
              <line x1="40" y1="170" x2="490" y2="170" stroke="#334155" opacity="0.5" />

              {/* Axis labels */}
              <text x="15" y="25" fill="#64748b" fontSize="10" fontFamily="monospace">120</text>
              <text x="15" y="75" fill="#64748b" fontSize="10" fontFamily="monospace">80</text>
              <text x="15" y="125" fill="#64748b" fontSize="10" fontFamily="monospace">40</text>
              <text x="25" y="174" fill="#64748b" fontSize="10" fontFamily="monospace">0</text>

              {/* Weekly Bars */}
              {analytics.weeklyTrends.map((t, idx) => {
                const groupWidth = 60;
                const startX = 60 + idx * groupWidth;
                const barWidth = 16;
                const chartHeight = 150;

                const hReported = (t.reported / 120) * chartHeight;
                const yReported = 170 - hReported;

                const hResolved = (t.resolved / 120) * chartHeight;
                const yResolved = 170 - hResolved;

                return (
                  <g key={t.day} className="cursor-pointer group">
                    {/* Reported bar */}
                    <rect
                      x={startX}
                      y={yReported}
                      width={barWidth}
                      height={hReported}
                      rx="4"
                      fill="url(#barIndigo)"
                      className="group-hover:opacity-80 transition-opacity"
                    />
                    {/* Resolved bar */}
                    <rect
                      x={startX + barWidth + 4}
                      y={yResolved}
                      width={barWidth}
                      height={hResolved}
                      rx="4"
                      fill="url(#barCyan)"
                      className="group-hover:opacity-80 transition-opacity"
                    />
                    {/* Day text */}
                    <text
                      x={startX + barWidth}
                      y="190"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="11"
                      fontFamily="sans-serif"
                      fontWeight="500"
                    >
                      {t.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Peak error activity: Thursday (110 incidents logged)</span>
            <span className="text-emerald-500 font-medium">94.5% Peak Day Resolution</span>
          </div>
        </div>

        {/* Right Column: Category Distribution & Severity Meter */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Incident Breakdown by Domain
            </h3>
            <p className="text-[11px] text-slate-400">Proportion of technical errors by infrastructure layer</p>
          </div>

          {/* Category distribution bars */}
          <div className="space-y-3">
            {analytics.categoryDistribution.map(cat => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {cat.category}
                  </span>
                  <span className="font-mono text-slate-400">
                    {cat.count} ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Severity distribution summary */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Severity Distribution
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {analytics.severityDistribution.map(sev => (
                <div key={sev.severity} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {sev.severity}
                  </div>
                  <div className="text-sm font-bold font-mono mt-0.5" style={{ color: sev.color }}>
                    {sev.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Top Recurring Error Codes Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Top 7 Recurring Errors in Organization</span>
            </h3>
            <p className="text-[11px] text-slate-400">Ranked by frequency and team hours spent</p>
          </div>
          <span className="text-xs font-mono text-indigo-500">Live Telemetry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                <th className="py-2.5 px-3">Error Signature</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Incidents</th>
                <th className="py-2.5 px-3">Avg Fix Time</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {analytics.topErrorCodes.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white">
                    {item.code}
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                    {item.category}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      item.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                      item.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                      item.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {item.count}
                  </td>
                  <td className="py-3 px-3 font-mono text-cyan-600 dark:text-cyan-400">
                    {item.avgTime}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Playbook Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Queue / Ticket Dispatcher */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Incident Management & Triage Queue
            </h3>
            <p className="text-[11px] text-slate-400">Review user-submitted errors, update ticket states, and approve playbook entries</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{incidents.length} Records in Registry</span>
        </div>

        <div className="space-y-3">
          {incidents.slice(0, 5).map(inc => (
            <div key={inc.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-slate-400">ID: {inc.id}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">User: {inc.userName}</span>
                  <span className="text-slate-400">• {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {inc.title}
                </div>
                <div className="font-mono text-slate-400 text-[11px]">
                  {inc.diagnosticResult.errorCode} ({inc.diagnosticResult.category})
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <select
                  value={inc.status}
                  onChange={(e) => updateIncidentStatus(inc.id, e.target.value as IssueStatus)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none ${
                    inc.status === 'resolved'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                      : inc.status === 'in_progress'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                      : 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800'
                  }`}
                >
                  <option value="resolved">Resolved</option>
                  <option value="in_progress">In Progress</option>
                  <option value="unresolved">Unresolved</option>
                </select>

                <button
                  onClick={() => alert(`Assigned technician Sarah Chen to ticket ${inc.id}`)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm"
                >
                  Assign Tech
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
