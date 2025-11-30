import React, { useState, useEffect } from 'react';
import { 
  Award, Activity, Zap, Lock, Radio, Scale, Fingerprint, Book, Map, 
  User, Save, RefreshCw, LogOut, Eye, FileText, Compass, Star, Printer, WifiOff,
  Terminal, ChevronRight, Download
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { AuthAccess } from './components/AuthAccess';
import { 
  fetchUserProfile, saveUserProfile, fetchLogs, saveLog, 
  fetchLatestReport, saveReport 
} from './services/dbService';
import { 
  UserInputs, ProfileData, LieLog, FearLog, ClarityLog, ImpactLog, 
  DailyBriefing, StrategicDossier 
} from './types';
import { generateUserProfile, generateDailyBriefing, generateStrategicDossier } from './services/geminiService';
import { SpyCard, SpyModal, SpyButton, AnimationStyles } from './components/SpyUI';
import { Sigil } from './components/Sigil';
import { StoryMode } from './components/StoryMode';
import { LieLiberator } from './components/LieLiberator';
import { NarratorGuide } from './components/NarratorGuide';
import { FearNeutralizer, SignalClarifier, SyntropyLedger } from './components/TacticalTools';

// --- UTILS ---

const downloadIntel = (filename: string, content: string) => {
  const element = document.createElement('a');
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const formatBriefingReport = (b: DailyBriefing): string => {
  return `
/// CLASSIFIED: DAILY INTELLIGENCE BRIEFING ///
DATE: ${b.dayIdentity.date}
CYCLES: Day ${b.dayIdentity.personalDayNumber} | ${b.dayIdentity.moonPhase} | ${b.dayIdentity.energyQuality}
--------------------------------------------------

>> NARRATOR LOG
${b.narratorBullets?.map(x => `* ${x}`).join('\n') || 'N/A'}

>> COMPASS
"${b.oneLineCompass}"

>> THREE ARROWS
[HEAD]  ${b.threeArrows.head}
[HANDS] ${b.threeArrows.hands}
[HEART] ${b.threeArrows.heart}

>> TACTICAL DATA
OPPORTUNITY: ${b.opportunityWindow}
MONEY SIG:   ${b.moneySignal}
SHADOW WARN: ${b.shadowWarning}

>> NIGHT REFLECTION
${b.nightReflection.map(q => `? ${q}`).join('\n')}

--------------------------------------------------
END TRANSMISSION
`;
};

const formatDossierReport = (d: StrategicDossier, inputs: UserInputs): string => {
  return `
/// TOP SECRET: STRATEGIC DOSSIER ///
SUBJECT: ${inputs.fullName.toUpperCase()}
ARCHETYPE: ${d.avatar.archetype.toUpperCase()}
AURA: ${d.avatar.auraColor} (${d.avatar.auraDescription})
--------------------------------------------------

>> EXECUTIVE SUMMARY (NARRATOR)
${d.narratorBullets?.map(x => `* ${x}`).join('\n') || 'N/A'}

>> PSYCHOLOGICAL PROFILE
LIFE PATH: ${d.psychology.lifePathStory}
EMOTIONAL: ${d.psychology.moonStory}
MODUS:     ${d.psychology.expressionBehavior}

>> ENGAGEMENT STRATEGY
OPPORTUNITY LEVEL: ${d.crmStrategy.opportunityLevel}

[DO]
${d.crmStrategy.doAndDoNot.do.map(x => `+ ${x}`).join('\n')}

[DO NOT]
${d.crmStrategy.doAndDoNot.doNot.map(x => `- ${x}`).join('\n')}

INFLUENCE TACTIC:
"${d.crmStrategy.influenceTactics}"

--------------------------------------------------
EYES ONLY // DESTROY AFTER READING
`;
};

// --- NARRATOR COMPONENT ---
const NarratorLog: React.FC<{ bullets: string[] | undefined }> = ({ bullets }) => {
  if (!bullets || bullets.length === 0) return null;
  return (
    <div className="bg-[#0C0C0F]/80 border-l-2 border-[#D4AF37] p-4 my-4 animate-in fade-in slide-in-from-left-2 duration-500">
      <h4 className="text-[#D4AF37] text-xs font-mono uppercase mb-3 flex items-center gap-2">
        <Terminal size={12} /> Narrator's Log
      </h4>
      <ul className="space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className="text-sm text-gray-300 font-mono flex items-start gap-3 leading-relaxed">
            <span className="text-[#D4AF37] mt-1 shrink-0"><ChevronRight size={12} /></span> 
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- PRINT DOSSIER COMPONENT ---
const PrintDossier: React.FC<{ 
  data: ProfileData; 
  inputs: UserInputs; 
  briefing: DailyBriefing | null;
  dossier: StrategicDossier | null;
  fearLogs: FearLog[];
  lieLogs: LieLog[];
}> = ({ data, inputs, briefing, dossier, fearLogs, lieLogs }) => {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="print-only font-typewriter text-black">
      {/* PAGE 1: CORE PROFILE */}
      <div className="dossier-page">
        <div className="watermark">CLASSIFIED</div>
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-8">
          <div>
             <h1 className="tracking-tighter">HOUSE OF RAV</h1>
             <div className="text-sm tracking-[0.2em] mt-1">IDENTITY VERIFICATION DOSSIER</div>
          </div>
          <div className="text-right flex flex-col items-end">
             <div className="stamp mb-2">TOP SECRET</div>
             <div className="text-xs">GEN: {dateStr}</div>
             <div className="text-xs">REF: {data.numerology.lifePathNumber}-{data.astrology.sunSign.substring(0,3).toUpperCase()}</div>
          </div>
        </div>

        {/* Subject Data */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="grid-box bg-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase">Subject Name</div>
              <div className="text-xl font-bold">{inputs.fullName}</div>
           </div>
           <div className="grid-box bg-gray-100">
              <div className="text-xs font-bold text-gray-500 uppercase">Archetype Code</div>
              <div className="text-xl font-bold">{data.numerology.archetypeTitle}</div>
           </div>
           <div className="grid-box">
              <div className="text-xs font-bold text-gray-500 uppercase">Vital Statistics</div>
              <div className="text-sm">
                 DOB: {inputs.dob} | TIME: {inputs.birthTime || "UNK"} | LOC: {inputs.birthLocation}
              </div>
           </div>
           <div className="grid-box">
              <div className="text-xs font-bold text-gray-500 uppercase">Core Cipher</div>
              <div className="text-sm">
                 LP: {data.numerology.lifePathNumber} | EXP: {data.numerology.expressionNumber} | SUN: {data.astrology.sunSign}
              </div>
           </div>
        </div>

        {/* Temporal Status */}
        <div className="section-header">
           <span className="section-title">TEMPORAL COORDINATES</span>
           <span className="text-xs">CURRENT OPERATING CYCLE</span>
        </div>
        <div className="flex justify-between mb-8 text-center border border-black p-4">
           <div>
              <div className="text-3xl font-bold">{data.numerology.personalYear}</div>
              <div className="text-xs uppercase">Personal Year</div>
           </div>
           <div className="border-l border-black"></div>
           <div>
              <div className="text-3xl font-bold">{data.numerology.personalMonth}</div>
              <div className="text-xs uppercase">Personal Month</div>
           </div>
           <div className="border-l border-black"></div>
           <div>
              <div className="text-3xl font-bold">{data.numerology.personalDay}</div>
              <div className="text-xs uppercase">Personal Day</div>
           </div>
        </div>

        {/* Mission Parameters */}
        <div className="section-header">
           <span className="section-title">MISSION PARAMETERS</span>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-8">
           {data.strengthsAndChallenges.map((item, idx) => (
             <div key={idx} className={`grid-box ${item.type === 'strength' ? 'border-l-4 border-l-black' : 'border-l-4 border-l-gray-400'}`}>
                <h3 className="mb-1">{item.title}</h3>
                <p className="text-sm text-justify">{item.description}</p>
             </div>
           ))}
        </div>

        {/* Narrator Summary */}
        {data.narratorBullets && data.narratorBullets.length > 0 && (
          <div className="mb-8">
            <div className="section-header">
              <span className="section-title">NARRATOR ASSESSMENT</span>
            </div>
            <ul className="list-disc ml-4 text-sm space-y-2">
              {data.narratorBullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* PAGE 2: STRATEGIC DOSSIER (If available) */}
      {dossier && (
        <div className="dossier-page">
          <div className="watermark">CONFIDENTIAL</div>
          <div className="section-header">
             <span className="section-title">STRATEGIC PSYCHE ANALYSIS</span>
             <span className="text-xs">EYES ONLY</span>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
             <div className="grid-box">
                <div className="text-xs font-bold text-gray-500 uppercase">Aura Signature</div>
                <div className="font-bold">{dossier.avatar.auraColor}</div>
                <div className="text-xs mt-1 italic">{dossier.avatar.auraDescription}</div>
             </div>
             <div className="grid-box">
                <div className="text-xs font-bold text-gray-500 uppercase">Opportunity Level</div>
                <div className="font-bold">{dossier.crmStrategy.opportunityLevel}</div>
             </div>
          </div>

          {dossier.narratorBullets && (
             <div className="mb-6 border-b border-black pb-4">
               <h4 className="text-xs font-bold uppercase mb-2">Executive Summary</h4>
               <ul className="list-disc ml-4 text-sm space-y-1">
                 {dossier.narratorBullets.map((b, i) => <li key={i}>{b}</li>)}
               </ul>
             </div>
          )}

          <h3 className="mt-4">PSYCHOLOGICAL DRIVERS</h3>
          <div className="grid-box mb-4 bg-gray-50">
             <div className="text-xs font-bold uppercase mb-1">Life Path (Destiny)</div>
             <p className="text-sm">{dossier.psychology.lifePathStory}</p>
          </div>
          <div className="grid-box mb-4 bg-gray-50">
             <div className="text-xs font-bold uppercase mb-1">Moon (Emotional Core)</div>
             <p className="text-sm">{dossier.psychology.moonStory}</p>
          </div>

          <div className="section-header mt-8">
             <span className="section-title">ENGAGEMENT STRATEGY</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid-box">
                <div className="text-xs font-bold text-black border-b border-black mb-2">DO</div>
                <ul className="list-disc ml-4 text-xs space-y-1">
                   {dossier.crmStrategy.doAndDoNot.do.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
             </div>
             <div className="grid-box">
                <div className="text-xs font-bold text-gray-600 border-b border-gray-400 mb-2">DO NOT</div>
                <ul className="list-disc ml-4 text-xs space-y-1 text-gray-600">
                   {dossier.crmStrategy.doAndDoNot.doNot.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
             </div>
          </div>
        </div>
      )}

      {/* PAGE 3: DAILY INTEL & LOGS */}
      <div className="dossier-page">
         <div className="watermark">INTERNAL</div>
         
         {/* Daily Briefing */}
         {briefing && (
           <div className="mb-8">
              <div className="section-header">
                <span className="section-title">DAILY FIELD BRIEFING</span>
                <span className="text-xs">{briefing.dayIdentity.date}</span>
              </div>
              
              <div className="grid-box bg-black text-white p-4 mb-4">
                 <div className="text-xs uppercase tracking-widest text-gray-300">Daily Compass</div>
                 <div className="text-lg font-bold italic">"{briefing.oneLineCompass}"</div>
              </div>

              {briefing.narratorBullets && (
                 <div className="mb-4">
                   <h4 className="text-xs font-bold uppercase mb-2">Tactical Summary</h4>
                   <ul className="list-disc ml-4 text-sm space-y-1">
                     {briefing.narratorBullets.map((b, i) => <li key={i}>{b}</li>)}
                   </ul>
                 </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                 <div className="grid-box">
                    <div className="text-xs font-bold uppercase">HEAD</div>
                    <div className="text-sm">{briefing.threeArrows.head}</div>
                 </div>
                 <div className="grid-box">
                    <div className="text-xs font-bold uppercase">HANDS</div>
                    <div className="text-sm">{briefing.threeArrows.hands}</div>
                 </div>
                 <div className="grid-box">
                    <div className="text-xs font-bold uppercase">HEART</div>
                    <div className="text-sm">{briefing.threeArrows.heart}</div>
                 </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // State
  const [inputs, setInputs] = useState<UserInputs>({
    fullName: '',
    dob: '',
    birthTime: '',
    birthLocation: ''
  });
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Logs
  const [lieLogs, setLieLogs] = useState<LieLog[]>([]);
  const [fearLogs, setFearLogs] = useState<FearLog[]>([]);
  const [clarityLogs, setClarityLogs] = useState<ClarityLog[]>([]);
  const [impactLogs, setImpactLogs] = useState<ImpactLog[]>([]);

  // Advanced Data
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [dossier, setDossier] = useState<StrategicDossier | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [dossierLoading, setDossierLoading] = useState(false);

  // --- INITIALIZATION ---
  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoadingSession(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoadingSession(false); // Offline mode
    }
  }, []);

  // Fetch Data on Session Load (Only if Online)
  useEffect(() => {
    if (session?.user && isSupabaseConfigured) {
      const loadData = async () => {
        const userId = session.user.id;
        
        // 1. Fetch Profile
        const profile = await fetchUserProfile(userId);
        if (profile) {
          setInputs({
            fullName: profile.full_name,
            dob: profile.dob,
            birthTime: profile.birth_time || '',
            birthLocation: profile.birth_location || ''
          });
          if (profile.profile_data) {
            setData(profile.profile_data);
          }
        }

        // 2. Fetch Logs
        const logs = await fetchLogs(userId);
        setLieLogs(logs.lieLogs);
        setFearLogs(logs.fearLogs);
        setClarityLogs(logs.clarityLogs);
        setImpactLogs(logs.impactLogs);
      };
      loadData();
    }
  }, [session]);


  // Handlers
  const handleGenerate = async () => {
    if (!inputs.fullName || !inputs.dob) return;
    setLoading(true);
    try {
      const profile = await generateUserProfile(inputs);
      setData(profile);
      setShowStory(true);

      // Save to Cloud if Online
      if (session?.user && isSupabaseConfigured) {
        await saveUserProfile(session.user.id, inputs, profile);
      }
    } catch (e) {
      console.error(e);
      alert("Initialization failed. Check comms.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetBriefing = async () => {
    if (!data) return;
    setActiveModal('BRIEFING');
    
    // Check if we have one recently saved (if online)
    if (session?.user && isSupabaseConfigured) {
       const saved = await fetchLatestReport(session.user.id, 'BRIEFING');
       // In a real app wed use 'saved' if fresh
    }

    setBriefingLoading(true);
    try {
      const result = await generateDailyBriefing(data, lieLogs);
      setBriefing(result);
      if (session?.user && isSupabaseConfigured) {
        await saveReport(session.user.id, 'BRIEFING', result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleGetDossier = async () => {
    if (!data) return;
    setActiveModal('DOSSIER');
    
    // Check cloud first if online
    if (session?.user && isSupabaseConfigured && !dossier) {
       const saved = await fetchLatestReport(session.user.id, 'DOSSIER');
       if (saved) {
         setDossier(saved);
         return;
       }
    }

    setDossierLoading(true);
    try {
      const result = await generateStrategicDossier(data, inputs);
      setDossier(result);
      if (session?.user && isSupabaseConfigured) {
        await saveReport(session.user.id, 'DOSSIER', result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDossierLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadBriefing = () => {
    if (!briefing) return;
    const text = formatBriefingReport(briefing);
    downloadIntel(`HOUSE_OF_RAV_BRIEFING_${new Date().toISOString().split('T')[0]}.txt`, text);
  };

  const handleDownloadDossier = () => {
    if (!dossier) return;
    const text = formatDossierReport(dossier, inputs);
    downloadIntel(`HOUSE_OF_RAV_DOSSIER_${inputs.fullName.replace(/\s+/g, '_')}_TOP_SECRET.txt`, text);
  };

  // Log Saving Handlers
  const handleAddLieLog = async (log: LieLog) => {
    setLieLogs([...lieLogs, log]);
    if (session?.user && isSupabaseConfigured) {
       const { id, timestamp, ...content } = log; 
       await saveLog(session.user.id, 'LIE', content);
    }
  };

  const handleAddFearLog = async (log: FearLog) => {
    setFearLogs([...fearLogs, log]);
    if (session?.user && isSupabaseConfigured) {
      const { id, timestamp, ...content } = log;
      await saveLog(session.user.id, 'FEAR', content);
    }
  };

  const handleAddClarityLog = async (log: ClarityLog) => {
    setClarityLogs([...clarityLogs, log]);
    if (session?.user && isSupabaseConfigured) {
      const { id, timestamp, ...content } = log;
      await saveLog(session.user.id, 'CLARITY', content);
    }
  };

  const handleAddImpactLog = async (log: ImpactLog) => {
    setImpactLogs([...impactLogs, log]);
    if (session?.user && isSupabaseConfigured) {
      const { id, timestamp, ...content } = log;
      await saveLog(session.user.id, 'IMPACT', content);
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setData(null);
    setInputs({ fullName: '', dob: '', birthTime: '', birthLocation: '' });
    // Reload page to clear local session state effectively if needed
    window.location.reload(); 
  };

  if (loadingSession) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-[#D4AF37] font-mono animate-pulse">ESTABLISHING SECURE CONNECTION...</div>;
  }

  // If online and not logged in, show Auth
  if (isSupabaseConfigured && !session) {
    return <AuthAccess />;
  }

  // Render Login/Input Screen if no profile data yet (Offline mode falls through here immediately)
  if (!data) {
    return (
      <div className="min-h-screen bg-[#050505] text-gray-300 font-sans flex items-center justify-center p-4 relative overflow-hidden">
        <AnimationStyles />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        {/* Offline Warning */}
        {!isSupabaseConfigured && (
           <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-red-500 font-mono border border-red-900 bg-black/50 p-2 rounded">
              <WifiOff size={14} /> OFFLINE MODE (LOCAL ONLY)
           </div>
        )}

        <div className="max-w-md w-full bg-[#0C0C0F] border border-[#D4AF37]/30 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative z-10 animate-in fade-in zoom-in-95 duration-700">
           <div className="text-center mb-8">
             <div className="w-16 h-16 mx-auto bg-[#D4AF37]/10 rounded-full flex items-center justify-center border border-[#D4AF37] mb-4 animate-pulse">
               <Fingerprint size={32} className="text-[#D4AF37]" />
             </div>
             <h1 className="text-2xl font-serif text-[#D4AF37] tracking-[0.2em]">HOUSE OF RAV</h1>
             <p className="text-xs font-mono text-gray-500 mt-2 uppercase">Identity Verification Required</p>
           </div>

           <div className="space-y-4">
             <div>
               <label className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Full Legal Name</label>
               <input 
                 type="text" 
                 value={inputs.fullName}
                 onChange={(e) => setInputs({...inputs, fullName: e.target.value})}
                 className="w-full bg-black/50 border-b border-gray-700 text-white p-2 focus:border-[#D4AF37] outline-none transition-colors font-mono"
                 placeholder="JOHN DOE"
               />
             </div>
             <div>
               <label className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest">Date of Birth</label>
               <input 
                 type="date" 
                 value={inputs.dob}
                 onChange={(e) => setInputs({...inputs, dob: e.target.value})}
                 className="w-full bg-black/50 border-b border-gray-700 text-white p-2 focus:border-[#D4AF37] outline-none transition-colors font-mono"
               />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Time (Optional)</label>
                  <input 
                    type="time" 
                    value={inputs.birthTime}
                    onChange={(e) => setInputs({...inputs, birthTime: e.target.value})}
                    className="w-full bg-black/50 border-b border-gray-700 text-white p-2 focus:border-[#D4AF37] outline-none transition-colors font-mono"
                  />
               </div>
               <div>
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Location</label>
                  <input 
                    type="text" 
                    value={inputs.birthLocation}
                    onChange={(e) => setInputs({...inputs, birthLocation: e.target.value})}
                    className="w-full bg-black/50 border-b border-gray-700 text-white p-2 focus:border-[#D4AF37] outline-none transition-colors font-mono"
                    placeholder="City, Country"
                  />
               </div>
             </div>

             <div className="pt-6">
               <SpyButton onClick={handleGenerate} disabled={loading} className="w-full">
                 {loading ? "DECRYPTING..." : "INITIATE SEQUENCE"}
               </SpyButton>
             </div>
             {isSupabaseConfigured && (
                <div className="text-center pt-2">
                  <button onClick={handleLogout} className="text-xs text-gray-600 hover:text-red-500 uppercase tracking-widest">
                      Abort & Logout
                  </button>
                </div>
             )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-4 md:p-8 relative selection:bg-[#D4AF37] selection:text-black no-print">
        <AnimationStyles />
        {/* Background Texture */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        {showStory && (
          <StoryMode 
            data={data} 
            userName={inputs.fullName} 
            onClose={() => setShowStory(false)} 
          />
        )}

        {/* Main Grid Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
          
          {/* --- HEADER SECTION --- */}
          <div className="col-span-1 md:col-span-12 flex flex-col md:flex-row justify-between items-center mb-8 border-b border-[#D4AF37]/20 pb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 relative">
                  <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-20 animate-pulse"></div>
                  <Sigil initials={inputs.fullName.slice(0,2)} lifePath={data.numerology.lifePathNumber} zodiacSign={data.astrology.sunSign} size={64} />
              </div>
              <div>
                  <h1 className="text-3xl font-serif text-[#D4AF37] tracking-wider uppercase">{inputs.fullName}</h1>
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-1">
                    <span><User size={12} className="inline mr-1"/> AGENT: {data.numerology.archetypeTitle}</span>
                    <span className="text-[#D4AF37]">|</span>
                    <span>LP: {data.numerology.lifePathNumber}</span>
                    <span className="text-[#D4AF37]">|</span>
                    <span>{data.astrology.sunSign} Sun</span>
                  </div>
              </div>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <button onClick={handlePrint} className="p-2 hover:text-[#D4AF37] transition-colors" title="Export Dossier"><Printer size={20} /></button>
              <button onClick={() => setShowStory(true)} className="p-2 hover:text-[#D4AF37] transition-colors"><RefreshCw size={20} /></button>
              <button onClick={() => setActiveModal('GUIDE')} className="p-2 hover:text-[#D4AF37] transition-colors"><Book size={20} /></button>
              {isSupabaseConfigured && (
                  <button onClick={handleLogout} className="p-2 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
              )}
            </div>
          </div>

          {/* --- CORE INTEL (LEFT COLUMN) --- */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Lie Liberator - Always Visible */}
            <SpyCard title="HONESTY PROTOCOL" subtitle="DETECT & LIBERATE" onClick={() => setActiveModal('LIE')} delay={0.1}>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-mono text-white">{lieLogs.length}</div>
                  <Eye className="text-red-500 opacity-80" size={32} />
                </div>
                <div className="text-[10px] text-gray-500 uppercase mt-2">Active Anomalies Logged</div>
                <div className="w-full bg-gray-800 h-1 mt-4 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-red-500 animate-pulse" style={{ width: '20%' }}></div>
                </div>
            </SpyCard>

            {/* Strategic Dossier Request */}
            <SpyCard title="STRATEGIC DOSSIER" subtitle="DEEP PSYCHE ANALYSIS" onClick={handleGetDossier} delay={0.2}>
                <div className="flex flex-col items-center py-4 text-center">
                  <FileText size={40} className="text-[#D4AF37] mb-3 opacity-80" />
                  <p className="text-xs text-gray-400">Generate full psychological & tactical profile.</p>
                </div>
            </SpyCard>

            {/* Numerology Quick View */}
            <SpyCard title="CIPHER KEYS" subtitle="NUMEROLOGICAL BASE" delay={0.3}>
                <div className="flex flex-col gap-4 h-full justify-center">
                    {/* Static Identity */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/40 border border-gray-800 p-3 flex flex-col items-center justify-center relative group">
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 group-hover:text-[#D4AF37] transition-colors">Life Path</div>
                            <div className="text-3xl font-mono text-[#D4AF37] font-bold">{data.numerology.lifePathNumber}</div>
                        </div>
                        <div className="bg-black/40 border border-gray-800 p-3 flex flex-col items-center justify-center relative group">
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gray-300 transition-colors">Expression</div>
                            <div className="text-3xl font-mono text-gray-400">{data.numerology.expressionNumber}</div>
                        </div>
                    </div>

                    {/* Temporal Cycles */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-[1px] bg-gray-800 flex-1"></div>
                            <div className="text-[8px] text-gray-600 uppercase tracking-widest">TEMPORAL CYCLES</div>
                            <div className="h-[1px] bg-gray-800 flex-1"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-2 text-center hover:bg-[#D4AF37]/10 transition-colors">
                                <div className="text-xl font-mono text-[#D4AF37]">{data.numerology.personalYear}</div>
                                <div className="text-[7px] text-gray-500 uppercase mt-1">Year</div>
                            </div>
                            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-2 text-center hover:bg-[#D4AF37]/10 transition-colors">
                                <div className="text-xl font-mono text-[#D4AF37]">{data.numerology.personalMonth}</div>
                                <div className="text-[7px] text-gray-500 uppercase mt-1">Month</div>
                            </div>
                            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 p-2 text-center hover:bg-[#D4AF37]/10 transition-colors">
                                <div className="text-xl font-mono text-[#D4AF37]">{data.numerology.personalDay}</div>
                                <div className="text-[7px] text-gray-500 uppercase mt-1">Day</div>
                            </div>
                        </div>
                    </div>
                </div>
            </SpyCard>

          </div>

          {/* --- MAIN OPS (RIGHT GRID) --- */}
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Strengths/Challenges */}
              <div className="md:col-span-2">
                <SpyCard title="OPERATIONAL PARAMETERS" subtitle="STRENGTHS & CHALLENGES" delay={0.45} onClick={() => setActiveModal('STRENGTHS')}>
                  <div className="space-y-4">
                      <div className="bg-green-900/10 border-l-2 border-green-500 p-3 hover:bg-green-900/20 transition-colors">
                        <div className="text-[10px] text-green-500 font-bold uppercase mb-1 flex items-center gap-2"><Award size={10} /> Primary Asset</div>
                        <div className="text-sm text-gray-300 line-clamp-2">{data.strengthsAndChallenges.find(s => s.type === 'strength')?.title}</div>
                      </div>
                      <div className="bg-red-900/10 border-l-2 border-red-500 p-3 hover:bg-red-900/20 transition-colors">
                        <div className="text-[10px] text-red-500 font-bold uppercase mb-1 flex items-center gap-2"><Activity size={10} /> Critical Risk</div>
                        <div className="text-sm text-gray-300 line-clamp-2">{data.strengthsAndChallenges.find(s => s.type === 'challenge')?.title}</div>
                      </div>
                  </div>
                </SpyCard>
              </div>

              {/* --- TACTICAL SECTION HEADER --- */}
              <div className="col-span-1 md:col-span-2 mt-4 mb-2 animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="flex items-center gap-4">
                    <div className="h-[1px] bg-[#D4AF37]/30 flex-1"></div>
                    <div className="flex items-center gap-2 text-[#D4AF37] font-mono tracking-widest text-sm">
                      <Zap size={14} />
                      <span>TACTICAL OPERATIONS</span>
                      <Zap size={14} />
                    </div>
                    <div className="h-[1px] bg-[#D4AF37]/30 flex-1"></div>
                </div>
              </div>

              {/* FEAR NEUTRALIZER */}
              <SpyCard title="FEAR NEUTRALIZER" subtitle="THREAT SIMULATION" delay={0.5} onClick={() => setActiveModal('FEAR')}>
                  <div className="flex items-center justify-between h-full p-2">
                      <div className="text-4xl text-white font-mono">{fearLogs.length}</div>
                      <Lock size={32} className="text-red-500/80" />
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase mt-2">PARALYSIS OVERRIDE</div>
                  <div className="w-full bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${Math.min(fearLogs.length * 10, 100)}%` }}></div>
                  </div>
              </SpyCard>

              {/* SIGNAL CLARIFIER */}
              <SpyCard title="SIGNAL CLARIFIER" subtitle="COGNITIVE RECALIBRATION" delay={0.52} onClick={() => setActiveModal('CLARITY')}>
                  <div className="flex items-center justify-between h-full p-2">
                      <div className="text-4xl text-white font-mono">{clarityLogs.length}</div>
                      <Radio size={32} className="text-blue-500/80" />
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase mt-2">DISTORTION REMOVAL</div>
                  <div className="w-full bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(clarityLogs.length * 10, 100)}%` }}></div>
                  </div>
              </SpyCard>

              {/* SYNTROPY LEDGER */}
              <SpyCard title="SYNTROPY LEDGER" subtitle="IMPACT TRACKING" delay={0.54} onClick={() => setActiveModal('IMPACT')}>
                  <div className="flex items-center justify-between h-full p-2">
                      <div className="text-4xl text-white font-mono">{impactLogs.length}</div>
                      <Scale size={32} className="text-green-500/80" />
                  </div>
                  <div className="text-[10px] text-gray-500 uppercase mt-2">NET POSITIVE SCORE</div>
                  <div className="w-full bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${Math.min(impactLogs.length * 5, 100)}%` }}></div>
                  </div>
              </SpyCard>

              {/* Agent / Daily Briefing */}
              <SpyCard title="AGENT BRAIN" subtitle="DAILY COMMAND BRIEFING" delay={0.5} onClick={handleGetBriefing}>
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Compass size={32} className="text-[#D4AF37] mx-auto mb-2 animate-spin-slow" style={{ animationDuration: '10s' }} />
                      <div className="text-[10px] text-[#D4AF37] border border-[#D4AF37] px-2 py-1 uppercase hover:bg-[#D4AF37] hover:text-black transition-colors">
                          Access Intel
                      </div>
                    </div>
                  </div>
              </SpyCard>

          </div>
        </div>

        {/* --- MODALS --- */}

        <SpyModal isOpen={activeModal === 'LIE'} onClose={() => setActiveModal(null)} title="HONESTY PROTOCOL">
          <LieLiberator logs={lieLogs} onAddLog={handleAddLieLog} />
        </SpyModal>

        <SpyModal isOpen={activeModal === 'FEAR'} onClose={() => setActiveModal(null)} title="FEAR NEUTRALIZATION">
          <FearNeutralizer logs={fearLogs} onSave={handleAddFearLog} />
        </SpyModal>

        <SpyModal isOpen={activeModal === 'CLARITY'} onClose={() => setActiveModal(null)} title="SIGNAL CLARIFIER">
          <SignalClarifier logs={clarityLogs} onSave={handleAddClarityLog} />
        </SpyModal>

        <SpyModal isOpen={activeModal === 'IMPACT'} onClose={() => setActiveModal(null)} title="SYNTROPY LEDGER">
          <SyntropyLedger logs={impactLogs} onSave={handleAddImpactLog} />
        </SpyModal>

        <SpyModal isOpen={activeModal === 'STRENGTHS'} onClose={() => setActiveModal(null)} title="MISSION ASSETS & RISKS">
          <NarratorLog bullets={data.narratorBullets} />
          <div className="space-y-6">
              {data.strengthsAndChallenges.map((item, idx) => (
                <div key={idx} className={`p-4 border-l-4 ${item.type === 'strength' ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                    <h4 className={`text-sm font-bold uppercase mb-2 ${item.type === 'strength' ? 'text-green-500' : 'text-red-500'}`}>{item.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
          </div>
        </SpyModal>

        <SpyModal isOpen={activeModal === 'GUIDE'} onClose={() => setActiveModal(null)} title="NARRATOR PROTOCOLS">
          <NarratorGuide />
        </SpyModal>

        {/* Daily Briefing Modal */}
        <SpyModal isOpen={activeModal === 'BRIEFING'} onClose={() => setActiveModal(null)} title="DAILY INTELLIGENCE BRIEFING">
          {briefingLoading ? (
              <div className="text-center py-20 text-[#D4AF37] font-mono animate-pulse">
                ESTABLISHING UPLINK WITH ORACLE...
              </div>
          ) : briefing ? (
              <div className="space-y-6 font-mono text-sm relative">
                {/* Download Button */}
                <button 
                  onClick={handleDownloadBriefing}
                  className="absolute -top-12 right-12 flex items-center gap-2 text-xs text-[#D4AF37] hover:text-white border border-[#D4AF37] px-3 py-1 bg-[#D4AF37]/10"
                >
                  <Download size={14} /> EXPORT INTEL
                </button>

                <div className="border-b border-gray-700 pb-4">
                    <div className="text-[#D4AF37] text-lg mb-1">{briefing.dayIdentity.date}</div>
                    <div className="text-gray-500 text-xs">
                      Personal Day {briefing.dayIdentity.personalDayNumber} | {briefing.dayIdentity.moonPhase} | {briefing.dayIdentity.energyQuality}
                    </div>
                </div>
                
                <NarratorLog bullets={briefing.narratorBullets} />

                <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/30 p-4">
                    <h4 className="text-[#D4AF37] font-bold text-xs uppercase mb-2">COMPASS</h4>
                    <p className="italic text-white">"{briefing.oneLineCompass}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-900 p-3 border-l-2 border-blue-500">
                      <div className="text-[10px] text-gray-500 uppercase">HEAD (Think)</div>
                      <div className="text-gray-300">{briefing.threeArrows.head}</div>
                    </div>
                    <div className="bg-gray-900 p-3 border-l-2 border-green-500">
                      <div className="text-[10px] text-gray-500 uppercase">HANDS (Do)</div>
                      <div className="text-gray-300">{briefing.threeArrows.hands}</div>
                    </div>
                    <div className="bg-gray-900 p-3 border-l-2 border-purple-500">
                      <div className="text-[10px] text-gray-500 uppercase">HEART (Feel)</div>
                      <div className="text-gray-300">{briefing.threeArrows.heart}</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                      <span className="text-[#D4AF37] uppercase font-bold text-xs">Opportunity Window:</span>
                      <span className="text-gray-400 ml-2">{briefing.opportunityWindow}</span>
                    </div>
                    <div>
                      <span className="text-green-500 uppercase font-bold text-xs">Money Signal:</span>
                      <span className="text-gray-400 ml-2">{briefing.moneySignal}</span>
                    </div>
                    <div>
                      <span className="text-red-500 uppercase font-bold text-xs">Shadow Warning:</span>
                      <span className="text-gray-400 ml-2">{briefing.shadowWarning}</span>
                    </div>
                </div>

                <div className="bg-black border border-gray-800 p-4 mt-4">
                    <h4 className="text-gray-500 font-bold text-xs uppercase mb-2">NIGHT REFLECTION</h4>
                    <ul className="list-disc ml-4 space-y-1 text-gray-400">
                      {briefing.nightReflection.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                </div>
              </div>
          ) : (
              <div className="text-center text-red-500">Briefing Unavailable.</div>
          )}
        </SpyModal>

        {/* Strategic Dossier Modal */}
        <SpyModal isOpen={activeModal === 'DOSSIER'} onClose={() => setActiveModal(null)} title="STRATEGIC DOSSIER (TOP SECRET)">
          {dossierLoading ? (
              <div className="text-center py-20 text-[#D4AF37] font-mono animate-pulse">
                COMPILING PSYCHOLOGICAL PROFILE...
              </div>
          ) : dossier ? (
              <div className="space-y-8 font-sans relative">
                {/* Download Button */}
                <button 
                  onClick={handleDownloadDossier}
                  className="absolute -top-12 right-12 flex items-center gap-2 text-xs text-[#D4AF37] hover:text-white border border-[#D4AF37] px-3 py-1 bg-[#D4AF37]/10"
                >
                  <Download size={14} /> EXPORT INTEL
                </button>

                {/* Avatar Section */}
                <div className="flex items-start gap-4 border-b border-[#D4AF37]/30 pb-6">
                    <div className="w-20 h-20 bg-gray-900 rounded-full border-2 border-[#D4AF37] flex items-center justify-center shrink-0">
                      <User size={40} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-2xl text-white font-serif">{dossier.avatar.name}</h3>
                      <div className="text-[#D4AF37] font-mono text-sm uppercase">{dossier.avatar.archetype}</div>
                      <div className="mt-2 text-xs text-gray-400">
                          <span className="text-gray-500 uppercase mr-2">Aura:</span> 
                          <span className="text-white" style={{ textShadow: `0 0 10px ${dossier.avatar.auraColor}` }}>{dossier.avatar.auraColor}</span>
                          <p className="mt-1 italic opacity-80">{dossier.avatar.auraDescription}</p>
                      </div>
                    </div>
                </div>

                <NarratorLog bullets={dossier.narratorBullets} />

                {/* Psychology */}
                <div>
                    <h4 className="text-[#D4AF37] font-mono text-xs uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">Psychological Profile</h4>
                    <div className="grid gap-4 text-sm text-gray-300">
                      <div className="bg-gray-900/50 p-4">
                          <strong className="block text-gray-500 text-xs uppercase mb-1">Life Path Driver</strong>
                          {dossier.psychology.lifePathStory}
                      </div>
                      <div className="bg-gray-900/50 p-4">
                          <strong className="block text-gray-500 text-xs uppercase mb-1">Emotional Core (Moon)</strong>
                          {dossier.psychology.moonStory}
                      </div>
                      <div className="bg-gray-900/50 p-4">
                          <strong className="block text-gray-500 text-xs uppercase mb-1">Modus Operandi</strong>
                          {dossier.psychology.expressionBehavior}
                      </div>
                    </div>
                </div>

                {/* Strategy */}
                <div>
                    <h4 className="text-[#D4AF37] font-mono text-xs uppercase mb-4 border-l-2 border-[#D4AF37] pl-3">Engagement Strategy</h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center bg-[#D4AF37]/10 p-3 border border-[#D4AF37]/20">
                          <span className="text-[#D4AF37] font-bold uppercase">Opportunity Level</span>
                          <span className="text-white font-mono">{dossier.crmStrategy.opportunityLevel}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h5 className="text-green-500 text-xs font-bold uppercase">DO</h5>
                            <ul className="list-disc ml-4 space-y-1 text-gray-400 text-xs">
                                {dossier.crmStrategy.doAndDoNot.do.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h5 className="text-red-500 text-xs font-bold uppercase">DO NOT</h5>
                            <ul className="list-disc ml-4 space-y-1 text-gray-400 text-xs">
                                {dossier.crmStrategy.doAndDoNot.doNot.map((d, i) => <li key={i}>{d}</li>)}
                            </ul>
                          </div>
                      </div>
                      
                      <div className="bg-gray-900 p-4 text-gray-300 italic">
                          "{dossier.crmStrategy.influenceTactics}"
                      </div>
                    </div>
                </div>
              </div>
          ) : (
              <div className="text-center text-red-500">Profile Unavailable.</div>
          )}
        </SpyModal>
      </div>
      
      {/* --- PRINT ONLY DOSSIER VIEW --- */}
      <PrintDossier 
        data={data} 
        inputs={inputs} 
        briefing={briefing} 
        dossier={dossier} 
        fearLogs={fearLogs} 
        lieLogs={lieLogs} 
      />
    </>
  );
};

export default App;