import { Wrench, Shield, Sparkles, CheckCircle2, Box } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#07090e]/70 backdrop-blur-md py-12 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Fix<span className="text-indigo-500">Trail</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Smart IT Problem Solver powered by multi-modal OCR error detection and heuristic root cause analytics.
            </p>
            <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Diagnostic Nodes Active</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Diagnostic Domains
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-indigo-500 cursor-pointer">DevOps & Kubernetes Containers</li>
              <li className="hover:text-indigo-500 cursor-pointer">React / Next.js SSR Hydration</li>
              <li className="hover:text-indigo-500 cursor-pointer">PyTorch & CUDA GPU Out-of-Memory</li>
              <li className="hover:text-indigo-500 cursor-pointer">Windows Kernel BSOD & Drivers</li>
              <li className="hover:text-indigo-500 cursor-pointer">PostgreSQL Connection Pools</li>
            </ul>
          </div>

          {/* Architecture & 3D */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Architecture & 3D
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-indigo-400" />
                <span>Spline 3D Hero Runtime Ready</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero-Latency 3D Demo Canvas</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client-Side OCR Privacy Protection</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Role-Based Access (User & Admin)</span>
              </li>
            </ul>
          </div>

          {/* Knowledge Base */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
              Knowledge Verification
            </h4>
            <p className="text-[11px] leading-relaxed mb-3">
              Solutions in FixTrail are cross-referenced across 100+ verified incident playbooks and IT community benchmarks.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono">
              SHA256: 8a4f9... verified playbooks
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; 2026 FixTrail Technologies. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:underline cursor-pointer">Security Policy</span>
            <span className="hover:underline cursor-pointer">Knowledge Base API</span>
            <span className="hover:underline cursor-pointer">Spline 3D Integration Specs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
