import { useState } from 'react';
import { 
  DiagnosticResultData, 
  IssueSeverity, 
  TroubleshootingStep 
} from '../types';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle, 
  Info, 
  Terminal, 
  Bookmark, 
  Download, 
  Sparkles, 
  Cpu
} from 'lucide-react';

interface DiagnosticResultProps {
  diagnostic: DiagnosticResultData;
  onSaveToHistory: (notes?: string) => void;
  onMarkResolved: () => void;
  isSaved?: boolean;
  isResolved?: boolean;
}

export function DiagnosticResult({
  diagnostic,
  onSaveToHistory,
  onMarkResolved,
  isSaved = false,
  isResolved = false,
}: DiagnosticResultProps) {
  const [steps, setSteps] = useState<TroubleshootingStep[]>(diagnostic.steps);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [userNote, setUserNote] = useState<string>('');
  const [resolvedStatus, setResolvedStatus] = useState<boolean>(isResolved);

  const toggleStep = (stepId: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s));
  };

  const copyCommand = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const exportMarkdown = () => {
    let md = `# FixTrail Diagnostics: ${diagnostic.title}\n\n`;
    md += `**Error Code:** \`${diagnostic.errorCode}\`\n`;
    md += `**Category:** ${diagnostic.category}\n`;
    md += `**Severity:** ${diagnostic.severity.toUpperCase()}\n`;
    md += `**Environment:** ${diagnostic.detectedEnvironment}\n\n`;
    md += `## Quick Fix\n${diagnostic.quickFix}\n\n`;
    md += `## Root Cause\n${diagnostic.rootCause}\n\n`;
    md += `## Step-by-Step Instructions\n`;
    steps.forEach((s, idx) => {
      md += `### Step ${idx + 1}: ${s.title} [${s.completed ? 'COMPLETED' : 'PENDING'}]\n${s.instruction}\n`;
      if (s.command) md += `\`\`\`bash\n${s.command}\n\`\`\`\n`;
      if (s.codeSnippet) md += `\`\`\`\n${s.codeSnippet}\n\`\`\`\n`;
      md += `\n`;
    });
    md += `## Prevention Tips\n`;
    diagnostic.preventionTips.forEach(tip => md += `- ${tip}\n`);

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixtrail-${diagnostic.errorCode.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          bg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
          dot: 'bg-red-500',
          label: 'Critical Severity'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
          dot: 'bg-orange-500',
          label: 'High Severity'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
          label: 'Medium Severity'
        };
      default:
        return {
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          label: 'Low Severity'
        };
    }
  };

  const badge = getSeverityBadge(diagnostic.severity);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden space-y-6 p-6 sm:p-8 animate-in fade-in duration-300">
      
      {/* Top Banner: Incident Title, Error Code & Metadata */}
      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {diagnostic.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              {diagnostic.confidence}% AI Match
            </span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setResolvedStatus(true);
                onMarkResolved();
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                resolvedStatus
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{resolvedStatus ? 'Marked as Resolved' : 'Mark as Resolved'}</span>
            </button>

            <button
              onClick={() => onSaveToHistory(userNote || undefined)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Save to My History"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'text-indigo-600 fill-indigo-600' : ''}`} />
              <span>{isSaved ? 'Saved to History' : 'Save'}</span>
            </button>

            <button
              onClick={exportMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Export as Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {diagnostic.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
              Error: {diagnostic.errorCode}
            </span>
            <span>•</span>
            <span>Target Env: {diagnostic.detectedEnvironment}</span>
          </div>
        </div>
      </div>

      {/* Quick Fix Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-indigo-50/80 to-cyan-50/80 dark:from-indigo-950/40 dark:to-cyan-950/40 border border-indigo-200/80 dark:border-indigo-900/60 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
            Immediate Quick Fix:
          </h4>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {diagnostic.quickFix}
          </p>
        </div>
      </div>

      {/* Root Cause Analysis (RCA) */}
      <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <AlertCircle className="w-4 h-4 text-cyan-500" />
          <span>Root Cause Analysis (RCA)</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {diagnostic.rootCause}
        </p>
      </div>

      {/* Step-by-Step Resolution Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Step-by-Step Resolution Instructions
            </h3>
            <span className="text-xs font-mono text-slate-400">
              ({completedCount}/{steps.length} completed)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-32 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-xl border transition-all ${
                step.completed
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start gap-3.5">
                
                {/* Interactive Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                    step.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-white dark:bg-slate-800'
                  }`}
                  title={step.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {step.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* Step content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${
                      step.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      Step {index + 1}: {step.title}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.instruction}
                  </p>

                  {/* Terminal Command box with Copy Button */}
                  {step.command && (
                    <div className="relative mt-2 rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-200 group">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 mb-1 border-b border-slate-800/80">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-cyan-400" />
                          Terminal / Shell Command
                        </span>
                        <button
                          type="button"
                          onClick={() => copyCommand(step.command!, step.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 transition-colors"
                        >
                          {copiedId === step.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap select-all text-cyan-300 font-mono text-[11px]">
                        {step.command}
                      </pre>
                    </div>
                  )}

                  {/* Code Snippet Box */}
                  {step.codeSnippet && (
                    <div className="relative mt-2 rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-slate-200">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 mb-1 border-b border-slate-800/80">
                        <span>Code Implementation Snippet</span>
                        <button
                          type="button"
                          onClick={() => copyCommand(step.codeSnippet!, step.id)}
                          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900"
                        >
                          {copiedId === step.id ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <pre className="overflow-x-auto whitespace-pre-wrap select-all text-amber-300 font-mono text-[11px]">
                        {step.codeSnippet}
                      </pre>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prevention & Best Practices */}
      <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-500" />
          <span>Prevention & Architecture Best Practices</span>
        </h4>
        <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600 dark:text-slate-300">
          {diagnostic.preventionTips.map((tip, idx) => (
            <li key={idx} className="leading-relaxed">{tip}</li>
          ))}
        </ul>
      </div>

      {/* User Notes Box */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        {!showNoteInput ? (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            + Add personal notes or technician findings to this diagnosis
          </button>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Technician Notes / Incident Context:
            </label>
            <textarea
              rows={2}
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              placeholder="E.g., verified on production cluster node-03 after container restart..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onSaveToHistory(userNote);
                  setShowNoteInput(false);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
              >
                Save Notes & History
              </button>
              <button
                type="button"
                onClick={() => setShowNoteInput(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
