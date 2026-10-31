import React, { useState } from 'react';
import {
  Settings,
  RotateCcw,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useProfile } from '../context/ProfileContext';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    resetToDemo,
    clearToBlank,
    exportProfileJSON,
    importProfileJSON,
    setActiveView
  } = useProfile();

  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importProfileJSON(content);
        if (success) {
          setImportStatus('Passport data successfully imported!');
          setTimeout(() => setImportStatus(null), 3500);
        } else {
          setImportStatus('Invalid JSON passport format. Please upload a valid exported file.');
          setTimeout(() => setImportStatus(null), 3500);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleRegenerateHash = () => {
    const newHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase();
    updateProfile({ verificationHash: newHash });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-cyan-400" />
          <span>Platform Settings & Data Governance</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your LocalStorage persistence, backup passport JSON files, and toggle demo test modes.
        </p>
      </div>

      {importStatus && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
          importStatus.includes('successfully')
            ? 'border-emerald-800 bg-emerald-950/40 text-emerald-300'
            : 'border-red-800 bg-red-950/40 text-red-300'
        }`}>
          {importStatus.includes('successfully') ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{importStatus}</span>
        </div>
      )}

      {/* Persistence & Data Backup */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Download className="h-4 w-4 text-cyan-400" />
          <span>Passport Data Backup & Portability</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          ProofSkill operates 100% client-side with LocalStorage. You can export your passport into an interoperable JSON format to backup or migrate between browsers.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={exportProfileJSON}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span>Export Passport JSON</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer">
            <Upload className="h-4 w-4 text-cyan-400" />
            <span>Import Passport JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Demo State & Reset Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-blue-400" />
          <span>Demo Profile & Testing Controls</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Load Sample Demo Data */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-white">Load Full Demo Profile (Alex Rivera)</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Populates 8 verified skills, 3 projects with PR artifacts, 4 passed assessments, and a high evidence score for testing and demonstration.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              {showResetConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetToDemo();
                      setShowResetConfirm(false);
                      setActiveView('dashboard');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 rounded hover:bg-cyan-300"
                  >
                    Confirm Load Demo
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  Load Sample Student Data
                </button>
              )}
            </div>
          </div>

          {/* Clear to Blank State */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col justify-between">
            <div>
              <div className="text-sm font-bold text-white">Reset to Blank Slate (Empty State)</div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Clears all skills, projects, and assessments to test how a fresh student onboarder experiences the empty dashboard and creates their first proof.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              {showClearConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      clearToBlank();
                      setShowClearConfirm(false);
                      setActiveView('dashboard');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-500"
                  >
                    Confirm Clear All Data
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-950/60 border border-red-900/60 rounded-lg transition-colors"
                >
                  Clear Data & Test Empty State
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security & Verification Integrity */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Passport Verification Signature</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Every passport contains a simulated SHA-256 cryptographic root hash representing the immutable proof state.
        </p>

        <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-300 truncate">
            {profile.verificationHash}
          </div>

          <button
            onClick={handleRegenerateHash}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 shrink-0 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Re-sign Hash</span>
          </button>
        </div>

        {/* Privacy toggle */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">Public Passport Accessibility</div>
            <div className="text-[11px] text-slate-400">Allow recruiters to view your passport with your unique link</div>
          </div>

          <button
            onClick={() => updateProfile({ isPublic: !profile.isPublic })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              profile.isPublic
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {profile.isPublic ? 'Enabled (Public)' : 'Disabled (Private)'}
          </button>
        </div>
      </div>
    </div>
  );
};
