import React, { useState } from 'react';
import { SpyButton } from './SpyUI';
import { FearLog, ClarityLog, ImpactLog } from '../types';
import { clarifyThought } from '../services/geminiService';
import { AlertTriangle, Lock, Unlock, Radio, ArrowRight, Activity, Plus, Minus, Zap, CheckCircle, Clock, Scale } from 'lucide-react';

// --- FEAR NEUTRALIZER ---

interface FearNeutralizerProps {
  onSave: (log: FearLog) => void;
  logs: FearLog[];
}

export const FearNeutralizer: React.FC<FearNeutralizerProps> = ({ onSave, logs }) => {
  const [step, setStep] = useState(0);
  const [fear, setFear] = useState('');
  const [worstCase, setWorstCase] = useState('');
  const [prevention, setPrevention] = useState('');
  const [repair, setRepair] = useState('');

  const handleSave = () => {
    onSave({
      id: Date.now().toString(),
      fear,
      worstCase,
      prevention,
      repair,
      timestamp: Date.now()
    });
    setStep(4); // Success state
  };

  const reset = () => {
    setStep(0);
    setFear('');
    setWorstCase('');
    setPrevention('');
    setRepair('');
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-6 px-2">
      {[0, 1, 2, 3].map((s) => (
        <div key={s} className="flex flex-col items-center gap-1">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${step >= s ? 'bg-[#D4AF37] scale-125' : 'bg-gray-700'}`} />
        </div>
      ))}
    </div>
  );

  if (step === 4) {
    return (
      <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 mx-auto bg-green-900/20 border-2 border-green-500 rounded-full flex items-center justify-center">
          <Unlock size={40} className="text-green-500" />
        </div>
        <div>
          <h3 className="text-2xl font-serif text-green-500">THREAT NEUTRALIZED</h3>
          <p className="text-gray-400 font-mono text-sm mt-2">Simulation complete. Protocols active.</p>
        </div>
        <SpyButton onClick={reset} className="w-full">PROCESS NEW THREAT</SpyButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="bg-red-900/10 border-l-4 border-red-500 p-4 mb-2">
        <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase mb-1">
          <AlertTriangle size={14} /> Threat Simulation
        </div>
        <p className="text-xs text-gray-400">
          Fear thrives in ambiguity. Define the parameters to dismantle the paralysis.
        </p>
      </div>

      {step < 4 && renderStepIndicator()}

      <div className="flex-1">
        {step === 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <label className="text-xs font-mono text-[#D4AF37]">1. DEFINE THE THREAT</label>
            <p className="text-sm text-gray-400">What exactly are you afraid of doing?</p>
            <input 
              value={fear} onChange={e => setFear(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-[#D4AF37] outline-none font-mono"
              placeholder="e.g. Asking for a raise..."
              autoFocus
            />
            <SpyButton onClick={() => setStep(1)} disabled={!fear} className="w-full mt-4">NEXT PHASE</SpyButton>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <label className="text-xs font-mono text-red-400">2. WORST CASE SCENARIO</label>
            <p className="text-sm text-gray-400">If it goes wrong, what is the absolute worst outcome?</p>
            <textarea 
              value={worstCase} onChange={e => setWorstCase(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-red-500 outline-none font-mono min-h-[100px]"
              placeholder="e.g. They laugh, say no, and I lose my job..."
              autoFocus
            />
             <div className="flex gap-2 mt-4">
              <SpyButton variant="secondary" onClick={() => setStep(0)}>BACK</SpyButton>
              <SpyButton onClick={() => setStep(2)} disabled={!worstCase} className="flex-1">NEXT PHASE</SpyButton>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <label className="text-xs font-mono text-blue-400">3. PREVENTION PROTOCOL</label>
            <p className="text-sm text-gray-400">What actionable steps reduce the likelihood of the worst case?</p>
            <textarea 
              value={prevention} onChange={e => setPrevention(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-blue-500 outline-none font-mono min-h-[100px]"
              placeholder="e.g. Prepare a portfolio of wins, practice the pitch..."
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <SpyButton variant="secondary" onClick={() => setStep(1)}>BACK</SpyButton>
              <SpyButton onClick={() => setStep(3)} disabled={!prevention} className="flex-1">NEXT PHASE</SpyButton>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <label className="text-xs font-mono text-green-400">4. REPAIR PROTOCOL</label>
            <p className="text-sm text-gray-400">If the worst happens, how do you fix it or survive it?</p>
            <textarea 
              value={repair} onChange={e => setRepair(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-green-500 outline-none font-mono min-h-[100px]"
              placeholder="e.g. Apply to other jobs, survive on savings..."
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <SpyButton variant="secondary" onClick={() => setStep(2)}>BACK</SpyButton>
              <SpyButton onClick={handleSave} disabled={!repair} className="flex-1">NEUTRALIZE FEAR</SpyButton>
            </div>
          </div>
        )}
      </div>

      {/* Log History Display */}
      {step === 0 && logs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-800">
           <h4 className="text-[#D4AF37] font-mono text-xs mb-4 flex items-center gap-2">
             <Clock size={14} /> NEUTRALIZED THREATS
           </h4>
           <div className="space-y-3 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
             {logs.slice().reverse().map(log => (
               <div key={log.id} className="bg-gray-900/50 p-3 border-l-2 border-green-700 text-left hover:bg-gray-800 transition-colors cursor-default">
                 <div className="flex justify-between items-start mb-1">
                   <span className="text-xs text-white font-bold">{log.fear}</span>
                   <span className="text-[10px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                 </div>
                 <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-[10px] text-gray-500">
                       <span className="text-blue-400 uppercase">Prev:</span> {log.prevention.slice(0, 30)}...
                    </div>
                    <div className="text-[10px] text-gray-500">
                       <span className="text-green-400 uppercase">Repair:</span> {log.repair.slice(0, 30)}...
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

// --- SIGNAL CLARIFIER ---

interface SignalClarifierProps {
  onSave: (log: ClarityLog) => void;
  logs: ClarityLog[];
}

const BIASES = [
  "All-or-Nothing Thinking",
  "Catastrophizing",
  "Mind Reading",
  "Emotional Reasoning",
  "Fortune Telling",
  "Personalization"
];

export const SignalClarifier: React.FC<SignalClarifierProps> = ({ onSave, logs }) => {
  const [input, setInput] = useState('');
  const [bias, setBias] = useState(BIASES[0]);
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleProcess = () => {
    if (!input) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 1500);
  };

  const handleAiDecryption = async () => {
    if (!input) return;
    setIsAiLoading(true);
    try {
        const result = await clarifyThought(input, bias);
        setOutput(result);
    } catch (e) {
        console.error(e);
        alert("Decryption failed. Network interference.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleSave = () => {
    onSave({
      id: Date.now().toString(),
      distortedThought: input,
      cognitiveBias: bias,
      rationalTruth: output,
      timestamp: Date.now()
    });
    // Reset
    setInput('');
    setOutput('');
    setIsComplete(false);
  };

  return (
    <div className="space-y-6">
      {!isComplete ? (
        <>
          <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/30 p-4 flex items-center gap-4">
             <Radio className="text-[#D4AF37] animate-pulse" />
             <div>
               <h4 className="text-[#D4AF37] text-xs font-bold uppercase">Signal Intercepted</h4>
               <p className="text-gray-400 text-xs">Isolate distorted frequencies to decrypt objective reality.</p>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-500">DISTORTED INPUT (NEGATIVE THOUGHT)</label>
            <textarea 
               value={input} onChange={e => setInput(e.target.value)}
               className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:border-red-500 outline-none font-mono min-h-[80px]"
               placeholder="I ruined the presentation, everyone thinks I'm incompetent..."
            />
          </div>

          <div className="space-y-2">
             <label className="text-xs font-mono text-gray-500">IDENTIFIED INTERFERENCE (BIAS)</label>
             <select 
                value={bias} onChange={e => setBias(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 p-3 text-[#D4AF37] outline-none font-mono"
             >
                {BIASES.map(b => <option key={b} value={b}>{b}</option>)}
             </select>
          </div>

          <SpyButton onClick={handleProcess} disabled={!input || isProcessing} className="w-full">
            {isProcessing ? "RECALIBRATING SIGNAL..." : "CLARIFY SIGNAL"}
          </SpyButton>
        </>
      ) : (
        <div className="space-y-6 animate-in fade-in">
           <div className="grid gap-4">
              <div className="opacity-50 line-through decoration-red-500 text-gray-500 text-sm border-l-2 border-red-500 pl-3">
                 "{input}"
              </div>
              <div className="flex justify-center">
                 <ArrowRight className="text-[#D4AF37] rotate-90" />
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-end mb-2">
                    <label className="text-xs font-mono text-[#D4AF37]">OBJECTIVE REALITY (REWRITE)</label>
                    <button 
                      onClick={handleAiDecryption}
                      disabled={isAiLoading}
                      className="text-[10px] font-mono text-[#D4AF37] border border-[#D4AF37] px-2 py-1 hover:bg-[#D4AF37] hover:text-black transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      <Zap size={10} /> {isAiLoading ? "DECRYPTING..." : "AI AUTO-DECRYPT"}
                    </button>
                 </div>
                 <textarea 
                    value={output} onChange={e => setOutput(e.target.value)}
                    className="w-full bg-[#D4AF37]/5 border border-[#D4AF37] p-4 text-white outline-none font-mono min-h-[100px] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    placeholder="Write the true, rational version here, or use AI Auto-Decrypt..."
                 />
              </div>
           </div>
           <div className="flex gap-2">
              <SpyButton variant="secondary" onClick={() => setIsComplete(false)}>DISCARD</SpyButton>
              <SpyButton onClick={handleSave} disabled={!output} className="flex-1">ESTABLISH TRUTH</SpyButton>
           </div>
        </div>
      )}
    </div>
  );
};

// --- SYNTROPY LEDGER ---

interface SyntropyLedgerProps {
  onSave: (log: ImpactLog) => void;
  logs: ImpactLog[];
}

export const SyntropyLedger: React.FC<SyntropyLedgerProps> = ({ onSave, logs }) => {
  const [action, setAction] = useState('');
  const [type, setType] = useState<'SYNTROPY' | 'ENTROPY'>('SYNTROPY');
  const [magnitude, setMagnitude] = useState(1);

  const calculateBalance = () => {
    return logs.reduce((acc, log) => {
      return acc + (log.type === 'SYNTROPY' ? log.magnitude : -log.magnitude);
    }, 0);
  };

  const balance = calculateBalance();

  const getStatus = (bal: number) => {
     if (bal > 20) return { text: "SYNTROPIC RESONANCE", color: "text-[#D4AF37]" };
     if (bal > 5) return { text: "POSITIVE MOMENTUM", color: "text-green-500" };
     if (bal < -20) return { text: "CRITICAL ENTROPY", color: "text-red-600" };
     if (bal < -5) return { text: "ENTROPIC DECAY", color: "text-red-400" };
     return { text: "STABLE EQUILIBRIUM", color: "text-gray-400" };
  };

  const status = getStatus(balance);
  const barPercentage = Math.max(0, Math.min(100, 50 + (balance * 1.5))); // Scale: -33 to +33 roughly fits 0-100

  const handleSave = () => {
    if (!action) return;
    onSave({
      id: Date.now().toString(),
      action,
      type,
      magnitude,
      timestamp: Date.now()
    });
    setAction('');
    setMagnitude(1);
  };

  return (
    <div className="space-y-6">
       {/* Dashboard / Meter */}
       <div className="bg-gray-900/80 p-6 border border-gray-700 relative overflow-hidden">
          <div className="flex justify-between items-end mb-2 relative z-10">
            <div>
               <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Current State</div>
               <div className={`text-sm font-bold font-mono tracking-wider ${status.color} animate-pulse`}>
                  {status.text}
               </div>
            </div>
            <div className={`text-5xl font-mono font-bold ${balance >= 0 ? 'text-[#D4AF37]' : 'text-red-500'}`}>
               {balance > 0 ? '+' : ''}{balance}
            </div>
          </div>
          
          {/* Visual Balance Bar */}
          <div className="relative h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
             {/* Center Marker */}
             <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 z-10"></div>
             {/* Fill */}
             <div 
               className={`absolute top-0 bottom-0 transition-all duration-700 ${balance >= 0 ? 'bg-gradient-to-r from-green-900 to-[#D4AF37]' : 'bg-gradient-to-l from-red-900 to-red-500'}`}
               style={{ 
                  left: balance >= 0 ? '50%' : `${barPercentage}%`,
                  width: balance >= 0 ? `${barPercentage - 50}%` : `${50 - barPercentage}%`
               }}
             ></div>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-gray-600 mt-1 uppercase">
             <span>Chaos (Entropy)</span>
             <span>Order (Syntropy)</span>
          </div>
       </div>

       {/* Input Section */}
       <div className="space-y-4 border-t border-gray-800 pt-4">
          <div className="flex gap-2">
             <button 
                onClick={() => setType('SYNTROPY')}
                className={`flex-1 p-3 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 ${type === 'SYNTROPY' ? 'bg-green-900/30 text-green-400 border border-green-500 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'bg-gray-900 border border-gray-700 text-gray-600 hover:text-gray-400'}`}
             >
               <Plus size={14} /> SYNTROPY (Give)
             </button>
             <button 
                onClick={() => setType('ENTROPY')}
                className={`flex-1 p-3 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-2 ${type === 'ENTROPY' ? 'bg-red-900/30 text-red-400 border border-red-500 shadow-[0_0_10px_rgba(248,113,113,0.2)]' : 'bg-gray-900 border border-gray-700 text-gray-600 hover:text-gray-400'}`}
             >
               <Minus size={14} /> ENTROPY (Take)
             </button>
          </div>

          <div className="relative">
             <input 
                value={action} onChange={e => setAction(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 p-4 pl-4 text-white focus:border-[#D4AF37] outline-none font-mono text-sm"
                placeholder={type === 'SYNTROPY' ? "Describe the constructive action..." : "Describe the destructive action..."}
             />
             <div className="absolute right-3 top-4 text-gray-600">
               <Scale size={16} />
             </div>
          </div>

          <div className="bg-gray-900/50 p-4 border border-gray-800">
             <div className="flex justify-between items-center mb-2">
               <label className="text-xs font-mono text-gray-500 uppercase">Magnitude / Impact</label>
               <span className={`text-lg font-mono font-bold ${type === 'SYNTROPY' ? 'text-green-500' : 'text-red-500'}`}>
                  {magnitude}
               </span>
             </div>
             <input 
               type="range" min="1" max="5" step="1"
               value={magnitude} onChange={e => setMagnitude(parseInt(e.target.value))}
               className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-${type === 'SYNTROPY' ? 'green-500' : 'red-500'}`}
             />
             <div className="flex justify-between text-[10px] text-gray-600 mt-2 font-mono uppercase">
               <span>Minor</span>
               <span>Moderate</span>
               <span>Significant</span>
               <span>Major</span>
               <span>Critical</span>
             </div>
          </div>

          <SpyButton onClick={handleSave} disabled={!action} className="w-full">
             LOG IMPACT EVENT
          </SpyButton>
       </div>

       {/* Mini Log */}
       {logs.length > 0 && (
         <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-2 mt-4 pr-2">
            <h4 className="text-[10px] text-gray-500 font-mono uppercase mb-2">Recent Events</h4>
            {logs.slice().reverse().map(log => (
              <div key={log.id} className={`flex justify-between items-center p-3 border-l-2 ${log.type === 'SYNTROPY' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                 <div className="flex flex-col">
                    <span className="text-xs text-white">{log.action}</span>
                    <span className="text-[9px] text-gray-500 font-mono">{new Date(log.timestamp).toLocaleDateString()}</span>
                 </div>
                 <div className={`font-mono font-bold text-sm ${log.type === 'SYNTROPY' ? 'text-green-500' : 'text-red-500'}`}>
                    {log.type === 'SYNTROPY' ? '+' : '-'}{log.magnitude}
                 </div>
              </div>
            ))}
         </div>
       )}
    </div>
  );
};