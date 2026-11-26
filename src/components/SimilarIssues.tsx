import { useState } from 'react';
import { SimilarIssue } from '../types';
import { CheckCircle2, ChevronRight, Sparkles, X } from 'lucide-react';

interface SimilarIssuesProps {
  issues: SimilarIssue[];
}

export function SimilarIssues({ issues }: SimilarIssuesProps) {
  const [selectedIssue, setSelectedIssue] = useState<SimilarIssue | null>(null);

  if (!issues || issues.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Similar Solved Incidents in FixTrail Knowledge Base
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {issues.length} matching cases
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {issues.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedIssue(item)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  {item.similarityScore}% Match
                </span>
                {item.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-2">
                {item.title}
              </h4>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {item.solutionSummary}
              </p>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>{item.os}</span>
              <span className="flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform">
                <span>View Fix</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Modal for Solved Case Preview */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                  {selectedIssue.similarityScore}% Match
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedIssue.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {selectedIssue.title}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Error Code: {selectedIssue.errorCode} • OS: {selectedIssue.os}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Verified Playbook Solution:
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedIssue.solutionSummary}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
