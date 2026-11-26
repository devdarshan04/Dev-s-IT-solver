import { useState, useEffect, useRef, DragEvent, FormEvent } from 'react';
import { 
  UploadCloud, 
  Terminal, 
  Sparkles, 
  CheckCircle, 
  X, 
  Scan, 
  Key
} from 'lucide-react';
import { SAMPLE_ERROR_CASES, SampleErrorCase } from '../data/initialData';
import { simulateOcrFromImage, OcrResult } from '../services/ocrService';
import { storageService } from '../services/storage';

interface ErrorUploaderProps {
  onDiagnose: (data: {
    description: string;
    extractedText: string;
    imageUrl?: string;
    categoryHint?: string;
    osHint?: string;
    apiKey?: string;
  }) => void;
  isLoading: boolean;
}

export function ErrorUploader({ onDiagnose, isLoading }: ErrorUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [ocrData, setOcrData] = useState<OcrResult | null>(null);
  const [description, setDescription] = useState<string>('');
  const [extractedText, setExtractedText] = useState<string>('');
  const [selectedOS, setSelectedOS] = useState<string>('Auto-Detect');
  const [selectedCategory, setSelectedCategory] = useState<string>('Auto-Detect');
  const [apiKey, setApiKey] = useState<string>(() => storageService.getApiKey());
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Global clipboard paste listener for screenshots (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            handleImageFile(blob);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleImageFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      setImagePreview(result);
      setIsScanning(true);

      // Trigger OCR scanner
      try {
        const ocr = await simulateOcrFromImage(file);
        setOcrData(ocr);
        setExtractedText(ocr.text);
        if (!description) {
          setDescription(`Diagnosing error: ${ocr.detectedErrorCode || 'Unhandled exception in application'}`);
        }
      } catch (err) {
        console.error('OCR Error:', err);
      } finally {
        setIsScanning(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadSampleCase = async (sample: SampleErrorCase) => {
    setIsScanning(true);
    setDescription(sample.description);
    setExtractedText(sample.logText);
    setSelectedCategory(sample.category);
    setSelectedOS(sample.system);

    // Create a dynamic SVG canvas preview for the sample
    const svgData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
      <rect width="600" height="300" rx="12" fill="%230f172a"/>
      <rect x="20" y="20" width="560" height="32" rx="6" fill="%231e293b"/>
      <circle cx="40" cy="36" r="6" fill="%23ef4444"/>
      <circle cx="60" cy="36" r="6" fill="%23f59e0b"/>
      <circle cx="80" cy="36" r="6" fill="%2310b981"/>
      <text x="110" y="41" fill="%2394a3b8" font-family="monospace" font-size="12">${sample.errorCode}</text>
      <rect x="30" y="70" width="540" height="200" rx="8" fill="%23020617" stroke="%23334155" stroke-width="1"/>
      <text x="50" y="110" fill="%23f43f5e" font-family="monospace" font-size="13" font-weight="bold">${sample.errorCode}</text>
      <text x="50" y="140" fill="%2338bdf8" font-family="monospace" font-size="11">${sample.system}</text>
      <text x="50" y="175" fill="%23e2e8f0" font-family="monospace" font-size="11">Log: ${sample.logText.slice(0, 55)}...</text>
      <text x="50" y="205" fill="%2364748b" font-family="monospace" font-size="11">FixTrail Neural OCR Target Area</text>
    </svg>`;
    setImagePreview(svgData);

    const ocr = await simulateOcrFromImage(sample.name);
    setOcrData(ocr);
    setIsScanning(false);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setOcrData(null);
    setExtractedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description && !extractedText) return;

    onDiagnose({
      description: description || 'Error encountered in system log',
      extractedText,
      imageUrl: imagePreview || undefined,
      categoryHint: selectedCategory !== 'Auto-Detect' ? selectedCategory : undefined,
      osHint: selectedOS !== 'Auto-Detect' ? selectedOS : undefined,
      apiKey: apiKey || undefined,
    });
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0c101b] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      
      {/* Top Header of Problem Solver */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Scan className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              AI Error Diagnosis & Vision Scanner
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload screenshot, paste from clipboard (Ctrl+V), or select an error preset
            </p>
          </div>
        </div>

        {/* Optional Gemini API Key button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowApiKeyModal(!showApiKeyModal)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>{apiKey ? 'API Key Active' : 'Custom LLM Key (Optional)'}</span>
          </button>
        </div>
      </div>

      {/* Optional Gemini API Key configuration box */}
      {showApiKeyModal && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/50 text-xs space-y-2">
          <div className="flex items-center justify-between font-medium text-amber-900 dark:text-amber-200">
            <span>Optional Custom Google Gemini API Key</span>
            <button onClick={() => setShowApiKeyModal(false)} className="text-amber-700 dark:text-amber-400 font-bold">✕</button>
          </div>
          <p className="text-amber-800 dark:text-amber-300/80 text-[11px]">
            FixTrail operates with built-in instant heuristic diagnostic engines. You can optionally paste your personal Gemini API key here to route diagnostics to live cloud models.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                storageService.setApiKey(e.target.value);
              }}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs"
            />
            <button
              onClick={() => setShowApiKeyModal(false)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-500"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Quick Sample Error Presets Carousel */}
      <div className="p-6 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Quick Test Error Templates:
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            1-Click to Test AI Diagnosis
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SAMPLE_ERROR_CASES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => loadSampleCase(sample)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900/60 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {sample.category.split(' ')[0]}
                </span>
              </div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {sample.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate font-mono">
                {sample.errorCode}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Input Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Drag & Drop Image Uploader / Preview */}
          <div className="lg:col-span-5 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Error Screenshot (OCR Vision)
            </label>

            {!imagePreview ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-60 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-900/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-inner">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  Drop screenshot here or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports PNG, JPG, WebP. Or press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">Ctrl+V</kbd> to paste.
                </p>

                <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
                  <Scan className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Automatic Text & Stack Trace Extraction</span>
                </div>
              </div>
            ) : (
              /* Image preview with OCR laser scan effect */
              <div className="relative h-60 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-950">
                <img
                  src={imagePreview}
                  alt="Error preview"
                  className="w-full h-full object-contain p-2"
                />

                {/* Laser scan animation when processing OCR */}
                {isScanning && (
                  <div className="absolute inset-0 bg-indigo-500/10 flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute top-0 animate-bounce" />
                    <div className="bg-slate-900/90 text-cyan-400 text-xs px-3 py-1.5 rounded-full font-mono flex items-center gap-2 border border-cyan-500/30">
                      <Scan className="w-4 h-4 animate-spin" />
                      <span>Scanning Stack Trace & Error Codes...</span>
                    </div>
                  </div>
                )}

                {/* Simulated Bounding Box Highlights from OCR */}
                {!isScanning && ocrData?.highlightBoxes.map((box, i) => (
                  <div
                    key={i}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                    className="absolute border-2 border-cyan-400/80 bg-cyan-400/10 rounded pointer-events-none"
                  >
                    <span className="absolute -top-4 left-0 bg-cyan-500 text-black text-[9px] font-bold px-1 rounded uppercase tracking-wider">
                      {box.label}
                    </span>
                  </div>
                ))}

                {/* Clear image button */}
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* OCR Success chip */}
                {!isScanning && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/90 text-[10px] text-emerald-400 font-mono border border-slate-700">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    <span>OCR Extracted: {ocrData?.detectedErrorCode || 'Log Trace Detected'}</span>
                  </div>
                )}
              </div>
            )}

            {/* Extracted Text Box */}
            {extractedText && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Terminal className="w-3 h-3 text-indigo-500" />
                    Extracted Error Trace:
                  </span>
                  <span className="text-[10px] font-mono text-cyan-500">
                    {ocrData?.confidence ? `${ocrData.confidence}% Confidence` : 'Text Extracted'}
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Extracted error text..."
                />
              </div>
            )}
          </div>

          {/* Right Column: Problem Description & Environment Metadata */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Description textarea */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Describe the technical problem</span>
                <span className="text-slate-400 text-[11px] font-normal">What were you trying to do?</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., After installing Docker on Ubuntu 22.04, running `docker ps` returns permission denied on /var/run/docker.sock without sudo..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
              />
            </div>

            {/* Metadata Filters: OS & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Operating System / Environment
                </label>
                <select
                  value={selectedOS}
                  onChange={(e) => setSelectedOS(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Auto-Detect">Auto-Detect from Trace</option>
                  <option value="Linux / Ubuntu">Linux / Ubuntu / Debian</option>
                  <option value="Microsoft Windows">Microsoft Windows 10/11</option>
                  <option value="macOS Apple Silicon">macOS (Apple Silicon / Intel)</option>
                  <option value="Docker / Container">Docker / Kubernetes Engine</option>
                  <option value="AWS / Cloud">AWS / Cloud Serverless</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  Target Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Auto-Detect">Auto-Detect Domain</option>
                  <option value="DevOps & Containers">DevOps & Containers</option>
                  <option value="Frontend & Web">Frontend & Web</option>
                  <option value="Backend & APIs">Backend & APIs</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Databases">Databases</option>
                  <option value="Security & Auth">Security & Auth</option>
                </select>
              </div>
            </div>

            {/* Submit Diagnostic Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || (!description && !extractedText)}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isLoading || (!description && !extractedText)
                    ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-[0.99]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Analyzing Stack Trace & Synthesizing Fix...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Run FixTrail AI Diagnostics & Generate Steps</span>
                  </>
                )}
              </button>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Instant Multi-Pattern Diagnostics</span>
                <span>Includes Root Cause & Terminal Copy Snippets</span>
              </div>
            </div>

          </div>

        </div>

      </form>
    </div>
  );
};
