import { useState } from 'react';
import { ProblemRecord, IssueStatus } from '../types';
import { storageService } from '../services/storage';
import { 
  History, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Trash2, 
  Edit3, 
  ChevronDown, 
  ChevronUp, 
  Calendar
} from 'lucide-react';

export function HistoryView() {
  const [records, setRecords] = useState<ProblemRecord[]>(() => storageService.getHistory());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | IssueStatus>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');

  const handleStatusChange = (id: string, newStatus: IssueStatus) => {
    const updated = storageService.updateRecordStatus(id, newStatus);
    setRecords(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this problem resolution record?')) {
      const updated = storageService.deleteRecord(id);
      setRecords(updated);
    }
  };

  const handleSaveNote = (id: string) => {
    const updated = storageService.updateRecordStatus(id, records.find(r => r.id === id)?.status || 'resolved', noteText);
    setRecords(updated);
    setEditingNoteId(null);
  };

  const filteredRecords = records.filter(rec => {
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      rec.title.toLowerCase().includes(q) ||
      rec.diagnosticResult.errorCode.toLowerCase().includes(q) ||
      (rec.userNotes && rec.userNotes.toLowerCase().includes(q)) ||
      rec.diagnosticResult.category.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const exportHistoryJSON = () => {
    const json = JSON.stringify(records, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixtrail-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resolvedCount = records.filter(r => r.status === 'resolved').length;
  const inProgressCount = records.filter(r => r.status === 'in_progress').length;
  const unresolvedCount = records.filter(r => r.status === 'unresolved').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Personal Problem-Solving History</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track, review, and reference all technical incidents diagnosed on your workstations
          </p>
        </div>

        <button
          onClick={exportHistoryJSON}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export History (.JSON)</span>
        </button>
      </div>

      {/* KPI mini counter bar */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div 
          onClick={() => setStatusFilter('resolved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'resolved' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500' 
              : 'bg-white dark:bg-[#0c101b] border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {resolvedCount}
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('in_progress')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'in_progress' 
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500' 
              : 'bg-white dark:bg-[#0c101b] border-slate-200 dark:border-slate-800 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">
            {inProgressCount}
          </div>
        </div>

        <div 
          onClick={() => setStatusFilter('unresolved')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            statusFilter === 'unresolved' 
              ? 'bg-red-50 dark:bg-red-950/40 border-red-500' 
              : 'bg-white dark:bg-[#0c101b] border-slate-200 dark:border-slate-800 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Unresolved</span>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 font-mono mt-1">
            {unresolvedCount}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident by title, error code, notes, or category..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101b] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs w-full sm:w-auto">
          {(['all', 'resolved', 'in_progress', 'unresolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg font-medium capitalize transition-all ${
                statusFilter === st
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Incidents' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Records list */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
          <History className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No matching incident records found</p>
          <p className="mt-1">Try clearing your search query or diagnosing a new error above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const isExpanded = expandedId === record.id;
            const dateStr = new Date(record.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={record.id}
                className="rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header row */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {record.diagnosticResult.errorCode}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                        {record.diagnosticResult.category}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {record.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {record.description}
                    </p>
                  </div>

                  {/* Status Dropdown & Action buttons */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <select
                      value={record.status}
                      onChange={(e) => handleStatusChange(record.id, e.target.value as IssueStatus)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none ${
                        record.status === 'resolved'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
                          : record.status === 'in_progress'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                          : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800'
                      }`}
                    >
                      <option value="resolved">Resolved</option>
                      <option value="in_progress">In Progress</option>
                      <option value="unresolved">Unresolved</option>
                    </select>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand full diagnosis'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDelete(record.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 space-y-4 text-xs animate-in fade-in duration-150">
                    
                    {/* Quick Fix reminder */}
                    <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-950 dark:text-indigo-200">
                      <span className="font-bold">Recommended Quick Fix: </span>
                      <span>{record.diagnosticResult.quickFix}</span>
                    </div>

                    {/* Step details */}
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 mb-2">
                        Resolution Steps Recorded:
                      </div>
                      <div className="space-y-2">
                        {record.diagnosticResult.steps.map((st, i) => (
                          <div key={st.id || i} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              Step {i + 1}: {st.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {st.instruction}
                            </div>
                            {st.command && (
                              <pre className="mt-1.5 p-2 rounded bg-slate-950 text-cyan-300 font-mono text-[10px] overflow-x-auto">
                                {st.command}
                              </pre>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Technician Notes section */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          Technician / User Findings:
                        </span>
                        {editingNoteId === record.id ? (
                          <div className="space-y-2">
                            <textarea
                              rows={2}
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleSaveNote(record.id)}
                                className="px-3 py-1 bg-indigo-600 text-white rounded text-[11px] font-medium"
                              >
                                Save Note
                              </button>
                              <button
                                onClick={() => setEditingNoteId(null)}
                                className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-600 dark:text-slate-400 italic">
                            {record.userNotes || 'No notes added yet.'}
                          </p>
                        )}
                      </div>

                      {editingNoteId !== record.id && (
                        <button
                          onClick={() => {
                            setEditingNoteId(record.id);
                            setNoteText(record.userNotes || '');
                          }}
                          className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{record.userNotes ? 'Edit Notes' : '+ Add Note'}</span>
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
