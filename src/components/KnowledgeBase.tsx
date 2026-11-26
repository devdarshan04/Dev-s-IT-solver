import { useState, MouseEvent, FormEvent } from 'react';
import { KnowledgeArticle, IssueCategory } from '../types';
import { storageService } from '../services/storage';
import { 
  BookOpen, 
  Search, 
  ThumbsUp, 
  Eye, 
  CheckCircle2, 
  Plus, 
  X
} from 'lucide-react';

export function KnowledgeBase() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(() => storageService.getKnowledgeBase());
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOS, setSelectedOS] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New article form state
  const [newTitle, setNewTitle] = useState('');
  const [newErrorCode, setNewErrorCode] = useState('');
  const [newCategory, setNewCategory] = useState<IssueCategory>('DevOps & Containers');
  const [newOS, setNewOS] = useState<'Linux' | 'Windows' | 'macOS' | 'Cross-Platform'>('Linux');
  const [newSummary, setNewSummary] = useState('');
  const [newCommand, setNewCommand] = useState('');

  const handleUpvote = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const updated = storageService.upvoteArticle(id);
    setArticles(updated);
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateArticle = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary) return;

    const newArt: KnowledgeArticle = {
      id: `kb_${Date.now()}`,
      title: newTitle,
      errorCode: newErrorCode || 'ERR_CUSTOM',
      category: newCategory,
      os: newOS,
      difficulty: 'Intermediate',
      views: 1,
      upvotes: 1,
      author: 'Community Technician',
      verified: true,
      summary: newSummary,
      rootCause: 'Documented resolution from recent workstation troubleshooting.',
      steps: [
        {
          stepNumber: 1,
          title: 'Execute fix command',
          detail: 'Run the verified terminal or configuration change.',
          command: newCommand || undefined
        }
      ],
      tags: [newOS.toLowerCase(), newCategory.split(' ')[0].toLowerCase()],
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    const updated = storageService.addArticle(newArt);
    setArticles(updated);
    setShowAddModal(false);
    setNewTitle('');
    setNewErrorCode('');
    setNewSummary('');
    setNewCommand('');
  };

  const categories = ['All', 'DevOps & Containers', 'Frontend & Web', 'Backend & APIs', 'Operating Systems', 'Databases', 'Security & Auth'];
  const osList = ['All', 'Linux', 'Windows', 'Cross-Platform'];

  const filteredArticles = articles.filter(a => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesOS = selectedOS === 'All' || a.os === selectedOS;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      a.title.toLowerCase().includes(q) ||
      a.errorCode.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesOS && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* KB Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>IT Knowledge Base & Solved Playbooks</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Peer-reviewed, verified resolutions and copyable terminal recipes for recurring IT errors
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Contribute Solution</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search playbooks by error code, symptom, tag, or stack (e.g. docker, bsod, hydration)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c101b] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Category pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* OS filter pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {osList.map(os => (
              <button
                key={os}
                onClick={() => setSelectedOS(os)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  selectedOS === os
                    ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {os}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map(article => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-lg hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Category, OS & Verification */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  {article.category}
                </span>
                {article.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>

              {/* Title & Error Code */}
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <div className="mt-1 text-[11px] font-mono text-slate-400 truncate">
                  {article.errorCode}
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {article.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {article.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Views, Upvotes, OS */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleUpvote(article.id, e)}
                  className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  title="Upvote solution"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span className="font-mono text-[11px]">{article.upvotes}</span>
                </button>

                <span className="flex items-center gap-1 text-[11px]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{article.views}</span>
                </span>
              </div>

              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {article.os}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Modal View */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {selectedArticle.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedArticle.os} • {selectedArticle.difficulty}
                </span>
              </div>

              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {selectedArticle.title}
              </h2>
              <div className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                Error Code: {selectedArticle.errorCode}
              </div>
            </div>

            {/* Root Cause */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Root Cause Explanation:
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedArticle.rootCause}
              </p>
            </div>

            {/* Step by Step list */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Resolution Instructions:
              </h3>
              {selectedArticle.steps.map((st, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2">
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    Step {st.stepNumber}: {st.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {st.detail}
                  </p>
                  {st.command && (
                    <div className="relative rounded-lg bg-slate-950 p-2.5 font-mono text-xs text-cyan-300 flex items-center justify-between border border-slate-800">
                      <pre className="overflow-x-auto text-[11px] select-all">{st.command}</pre>
                      <button
                        onClick={() => copyCode(st.command!, `modal_${i}`)}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] ml-2 shrink-0"
                      >
                        {copiedId === `modal_${i}` ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Upvote & Meta footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={(e) => handleUpvote(selectedArticle.id, e)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-800"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful / Upvoted ({selectedArticle.upvotes})</span>
              </button>

              <div className="text-slate-400 text-right">
                <div>Author: {selectedArticle.author}</div>
                <div className="text-[10px]">Updated: {selectedArticle.lastUpdated}</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Contribute Verified Playbook Solution
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateArticle} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Issue Title
                </label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., Fixing Nginx 502 Bad Gateway with PHP-FPM socket"
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Error Code
                  </label>
                  <input
                    type="text"
                    value={newErrorCode}
                    onChange={(e) => setNewErrorCode(e.target.value)}
                    placeholder="HTTP 502 / connect() failed"
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Operating System
                  </label>
                  <select
                    value={newOS}
                    onChange={(e) => setNewOS(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Linux">Linux</option>
                    <option value="Windows">Windows</option>
                    <option value="macOS">macOS</option>
                    <option value="Cross-Platform">Cross-Platform</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="DevOps & Containers">DevOps & Containers</option>
                  <option value="Frontend & Web">Frontend & Web</option>
                  <option value="Backend & APIs">Backend & APIs</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Databases">Databases</option>
                  <option value="Security & Auth">Security & Auth</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Summary & Solution Steps
                </label>
                <textarea
                  required
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Describe why this occurs and what resolves it..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Terminal Fix Command (Optional)
                </label>
                <input
                  type="text"
                  value={newCommand}
                  onChange={(e) => setNewCommand(e.target.value)}
                  placeholder="sudo systemctl restart php-fpm && nginx -t"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-cyan-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                >
                  Publish Playbook
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
