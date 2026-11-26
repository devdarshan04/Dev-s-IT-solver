import { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Spline3DHero } from './components/Spline3DHero';
import { ErrorUploader } from './components/ErrorUploader';
import { DiagnosticResult } from './components/DiagnosticResult';
import { SimilarIssues } from './components/SimilarIssues';
import { HistoryView } from './components/HistoryView';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { diagnoseProblem } from './services/aiSolver';
import { storageService } from './services/storage';
import { useAuth } from './context/useAuth';
import { DiagnosticResultData, SimilarIssue, ProblemRecord } from './types';
import { Sparkles } from 'lucide-react';

export function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'solver' | 'history' | 'kb' | 'admin'>('solver');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);

  // Active diagnostic result on Solver tab
  const [currentDiagnostic, setCurrentDiagnostic] = useState<DiagnosticResultData | null>(null);
  const [similarIssues, setSimilarIssues] = useState<SimilarIssue[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);
  const [isCurrentResolved, setIsCurrentResolved] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const solverInputRef = useRef<HTMLDivElement | null>(null);

  const handleDiagnose = (input: {
    description: string;
    extractedText: string;
    imageUrl?: string;
    categoryHint?: string;
    osHint?: string;
    apiKey?: string;
  }) => {
    setIsDiagnosing(true);

    // Simulate intelligent multi-stage analysis with smooth feedback
    setTimeout(() => {
      const response = diagnoseProblem({
        description: input.description,
        extractedText: input.extractedText,
        categoryHint: input.categoryHint,
        osHint: input.osHint,
        apiKey: input.apiKey,
      });

      setCurrentDiagnostic(response.result);
      setSimilarIssues(response.similarIssues);
      setIsDiagnosing(false);
      setIsCurrentSaved(false);
      setIsCurrentResolved(false);

      // Create new Problem Record in storage
      const record: ProblemRecord = {
        id: `rec_${Date.now()}`,
        userId: user.id,
        userName: user.name,
        title: response.result.title,
        description: input.description,
        imageUrl: input.imageUrl,
        extractedText: input.extractedText,
        diagnosticResult: response.result,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
      };

      storageService.addProblemRecord(record);
      setCurrentRecordId(record.id);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 900);
  };

  const handleSaveToHistory = (notes?: string) => {
    if (!currentRecordId || !currentDiagnostic) return;
    storageService.updateRecordStatus(
      currentRecordId,
      isCurrentResolved ? 'resolved' : 'in_progress',
      notes
    );
    setIsCurrentSaved(true);
  };

  const handleMarkResolved = () => {
    if (!currentRecordId) return;
    storageService.updateRecordStatus(currentRecordId, 'resolved');
    setIsCurrentResolved(true);
    setIsCurrentSaved(true);
  };

  const scrollToSolver = () => {
    setActiveTab('solver');
    setTimeout(() => {
      solverInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080b11] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-150">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'solver' && (
          <div>
            {/* Hero Section with Modular 3D Demo Model & Spline Slot */}
            <Spline3DHero
              onStartSolving={scrollToSolver}
              onExploreKB={() => setActiveTab('kb')}
            />

            {/* Error Diagnosis Form Section */}
            <div ref={solverInputRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
              
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 1: Input Error Signature
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Diagnose Any Stack Trace or Error Screen
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Drop a screenshot, paste with Ctrl+V, or pick an error preset below to run real-time multi-pattern heuristics.
                </p>
              </div>

              {/* Error Uploader Component */}
              <ErrorUploader
                onDiagnose={handleDiagnose}
                isLoading={isDiagnosing}
              />

              {/* Diagnostic Results Section (Rendered when diagnosis runs) */}
              {currentDiagnostic && (
                <div ref={resultsRef} className="pt-8 space-y-8 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        AI Diagnosis & Recommended Fix Trail
                      </h3>
                      <p className="text-xs text-slate-400">
                        Generated step-by-step resolution plan and root cause analysis
                      </p>
                    </div>
                  </div>

                  {/* Main Result Card */}
                  <DiagnosticResult
                    diagnostic={currentDiagnostic}
                    onSaveToHistory={handleSaveToHistory}
                    onMarkResolved={handleMarkResolved}
                    isSaved={isCurrentSaved}
                    isResolved={isCurrentResolved}
                  />

                  {/* Similar Issues Carousel / Matching */}
                  <SimilarIssues issues={similarIssues} />
                </div>
              )}

            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <HistoryView />
          </div>
        )}

        {/* Knowledge Base Tab */}
        {activeTab === 'kb' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <KnowledgeBase />
          </div>
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
}

export default App;
