import React, { useState } from 'react';
import { SpyButton } from './SpyUI';
import { LieLog } from '../types';
import { Eye, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface LieLiberatorProps {
  logs: LieLog[];
  onAddLog: (log: LieLog) => void;
}

const CATEGORIES = [
  "Denial (Avoiding Reality)",
  "Omission (Leaving Out Details)",
  "Exaggeration (Inflating the Truth)",
  "Fabrication (Made Up)",
  "Protection (Saving Face/Others)",
  "Ego (Looking Better)"
];

const DRIVERS = [
  "Fear of Conflict",
  "Fear of Rejection",
  "Shame / Guilt",
  "Pride / Ego",
  "Apathy / Laziness",
  "Greed / Gain"
];

const TRUTH_METHODS = [
  "Radical Ownership: Admit it without explanation.",
  "Fact Separation: Strip away the feelings, state the data.",
  "Compassionate Disclosure: Share the truth with kindness.",
  "Impact Analysis: Acknowledge who was hurt and how.",
  "Silent Correction: Fix the behavior immediately without words.",
  "The Pause: Stop speaking until the urge to lie passes."
];

export const LieLiberator: React.FC<LieLiberatorProps> = ({ logs, onAddLog }) => {
  const [lieText, setLieText] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [driver, setDriver] = useState(DRIVERS[0]);
  const [step, setStep] = useState<'INPUT' | 'RESULT'>('INPUT');
  const [resultMethod, setResultMethod] = useState('');

  const handleAnalyze = () => {
    if (!lieText.trim()) return;

    // Simulate AI selection of best method (random for now, could be enhanced)
    const randomMethod = TRUTH_METHODS[Math.floor(Math.random() * TRUTH_METHODS.length)];
    setResultMethod(randomMethod);
    
    const newLog: LieLog = {
      id: Date.now().toString(),
      text: lieText,
      category,
      driver,
      method: randomMethod,
      timestamp: Date.now()
    };

    onAddLog(newLog);
    setStep('RESULT');
  };

  const reset = () => {
    setLieText('');
    setStep('INPUT');
    setResultMethod('');
  };

  return (
    <div className="text-gray-200">
      {step === 'INPUT' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-red-900/10 border border-red-900/30 p-4 rounded text-center">
            <Eye className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-xs font-mono text-red-400 uppercase tracking-widest">
              ACTIVE SURVEILLANCE: HONESTY PROTOCOL
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Log anomalies in your truth field. Identification is the first step to liberation.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[#D4AF37]">DETECTED UNTRUTH</label>
            <textarea
              value={lieText}
              onChange={(e) => setLieText(e.target.value)}
              placeholder="I told them I was busy, but I was actually just avoiding the work..."
              className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-[#D4AF37] outline-none font-mono min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#D4AF37]">CATEGORY</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#D4AF37]">EMOTIONAL DRIVER</label>
              <select 
                value={driver} 
                onChange={(e) => setDriver(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
              >
                {DRIVERS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <SpyButton 
            onClick={handleAnalyze} 
            className="w-full bg-red-900/20 border-red-800 hover:bg-red-900/40 text-red-400"
          >
            ANALYZE & LIBERATE
          </SpyButton>
        </div>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95 duration-500 text-center">
          <div className="w-16 h-16 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37]">
            <CheckCircle className="w-8 h-8 text-[#D4AF37]" />
          </div>
          
          <div>
            <h3 className="text-xl font-serif text-[#D4AF37] mb-2">LIBERATION PROTOCOL ASSIGNED</h3>
            <p className="font-mono text-xs text-gray-500 uppercase">PATTERN INTERRUPT DETECTED</p>
          </div>

          <div className="bg-black/40 border border-[#D4AF37]/30 p-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
             <p className="text-white text-lg font-mono">"{resultMethod}"</p>
          </div>

          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Apply this method immediately to neutralize the distortion field caused by the untruth.
          </p>

          <SpyButton onClick={reset} variant="secondary" className="w-full">
            ACKNOWLEDGE & RETURN
          </SpyButton>
        </div>
      )}

      {/* History Log */}
      {logs.length > 0 && step === 'INPUT' && (
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h4 className="text-[#D4AF37] font-mono text-xs mb-4 flex items-center gap-2">
            <Clock size={14} /> RECENT LOGS
          </h4>
          <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
            {logs.slice().reverse().map(log => (
              <div key={log.id} className="bg-gray-900/50 p-3 border-l-2 border-gray-700 text-left">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs text-red-400 font-bold uppercase">{log.category}</span>
                  <span className="text-[10px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-300 mb-2 italic">"{log.text}"</p>
                <div className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 inline-block px-2 py-1 rounded">
                  RX: {log.method}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
