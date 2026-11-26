import { useState, Component, ErrorInfo, ReactNode } from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles, Layers, Box, Cpu, Activity } from 'lucide-react';

interface Spline3DHeroProps {
  onStartSolving?: () => void;
  onExploreKB?: () => void;
}

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline 3D runtime notice:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function Spline3DHero({ onStartSolving, onExploreKB }: Spline3DHeroProps) {
  const [splineLoaded, setSplineLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // User's dedicated Spline 3D scene URL
  const SPLINE_SCENE_URL = "https://prod.spline.design/sCbspRJLWPB-atm7/scene.splinecode";

  return (
    <div className="relative overflow-hidden pt-6 pb-16 md:pt-12 md:pb-24 border-b border-slate-200 dark:border-slate-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Value Proposition & Hero Headline */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-xs font-medium text-indigo-700 dark:text-indigo-300">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Next-Gen IT Error Diagnostics & RCA</span>
              <span className="text-slate-400 dark:text-slate-500">|</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-mono">Spline 3D Live</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Instant IT Solutions from{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400">
                Error Screenshots
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Upload any terminal traceback, Windows BSOD, Kubernetes CrashLoop, or browser console error. FixTrail analyzes stack traces, identifies root causes, and delivers step-by-step verified terminal resolutions in seconds.
            </p>

            {/* Quick stats chips */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1 max-w-lg">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">91.5%</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">First-Fix Rate</div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 font-mono">&lt; 30s</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Avg Diagnosis</div>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">1.8k+</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Solved Incidents</div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartSolving}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Diagnose an Error Now
              </button>

              <button
                onClick={onExploreKB}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-cyan-500" />
                Browse Knowledge Base
              </button>
            </div>
          </div>

          {/* Right Column: Dedicated Spline 3D Element */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-gradient-to-b from-white/90 to-slate-100/90 dark:from-slate-900/90 dark:to-[#090d16]/90 p-2 sm:p-3 border border-slate-200/90 dark:border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden">

              {/* Header bar of 3D container */}
              <div className="flex items-center justify-between px-3 py-2 mb-1 border-b border-slate-200 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px] ml-1">
                    spline-3d // interactive scene
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-500 dark:text-cyan-400">
                    <Box className="w-3.5 h-3.5" />
                    <span>Live 3D View</span>
                  </span>
                </div>
              </div>

              {/* 3D Spline Canvas Container */}
              <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[500px] rounded-xl overflow-hidden bg-slate-950/20 dark:bg-black/40 flex items-center justify-center">

                {/* Loading state indicator before Spline shaders load */}
                {!splineLoaded && !hasError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10 space-y-3">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>Loading Spline 3D Scene...</span>
                    </div>
                  </div>
                )}

                {/* Spline 3D Component with Error Boundary */}
                <SplineErrorBoundary
                  fallback={
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-900/60">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Box className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="text-sm font-bold text-slate-200">Interactive 3D Scene</div>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Connecting to Spline 3D WebGL stream...
                      </p>
                      <button
                        onClick={() => { setHasError(false); setSplineLoaded(false); }}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Reload 3D Scene
                      </button>
                    </div>
                  }
                >
                  {!hasError ? (
                    <div className="w-full h-full">
                      <Spline
                        scene={SPLINE_SCENE_URL}
                        onLoad={() => setSplineLoaded(true)}
                        className="w-full h-full cursor-grab active:cursor-grabbing"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-900/60">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Box className="w-6 h-6 animate-pulse" />
                      </div>
                      <div className="text-sm font-bold text-slate-200">Interactive 3D Scene</div>
                      <p className="text-xs text-slate-400 max-w-xs">
                        Connecting to Spline 3D WebGL stream...
                      </p>
                      <button
                        onClick={() => { setHasError(false); setSplineLoaded(false); }}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Reload 3D Scene
                      </button>
                    </div>
                  )}
                </SplineErrorBoundary>

                {/* Live telemetry overlay pins */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-20">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-300 font-mono">
                    <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span>Interactive Spline 3D</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span>Click & drag to interact in 3D</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-800 text-[10px] text-emerald-400 font-mono pointer-events-none z-20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Spline Engine Active</span>
                </div>
              </div>

              {/* Status footer under 3D */}
              <div className="mt-2.5 px-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  WebGL 2.0 Hardware Accelerated
                </span>
                <span className="font-mono text-slate-400 dark:text-slate-500 text-[10px]">
                  Scene: sCbspRJLWPB-atm7
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
