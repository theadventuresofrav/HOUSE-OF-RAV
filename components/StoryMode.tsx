import React, { useState, useEffect } from 'react';
import { ProfileData } from '../types';
import { Sigil } from './Sigil';
import { SpyButton } from './SpyUI';
import { ChevronRight, ChevronLeft, X, Fingerprint, Crosshair, Map, Globe2 } from 'lucide-react';

interface StoryModeProps {
  data: ProfileData;
  onClose: () => void;
  userName: string;
}

export const StoryMode: React.FC<StoryModeProps> = ({ data, onClose, userName }) => {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  
  // Prepare content slides
  const slides = [
    {
      title: "IDENTITY CONFIRMED",
      subtitle: "ACCESS GRANTED",
      content: `Agent ${userName}.\n\nYour biometric and astral signatures have been verified.\nArchetype Code: ${data.numerology.archetypeTitle}.\n\nInitiating briefing sequence...`,
      icon: <Fingerprint size={48} className="text-[#D4AF37]" />,
      renderVisual: () => (
        <div className="transform scale-150 my-10">
          <Sigil initials={userName.slice(0,3)} lifePath={data.numerology.lifePathNumber} zodiacSign={data.astrology.sunSign} />
        </div>
      )
    },
    {
      title: "NUMEROLOGICAL CORE",
      subtitle: "OPERATING FREQUENCY",
      content: `Your Life Path is ${data.numerology.lifePathNumber}.\n\n${data.storyHooks.numerology}\n\nYou are currently navigating Personal Year ${data.numerology.personalYear}, a cycle dedicated to ${data.numerology.personalYear === 1 ? 'new beginnings' : data.numerology.personalYear === 9 ? 'completion' : 'development'}.`,
      icon: <Map size={48} className="text-[#D4AF37]" />,
      renderVisual: () => (
        <div className="flex gap-4 my-12">
          <div className="text-center">
            <div className="text-6xl font-mono text-[#D4AF37] font-bold">{data.numerology.lifePathNumber}</div>
            <div className="text-xs tracking-widest text-gray-500 mt-2">LIFE PATH</div>
          </div>
          <div className="w-[1px] bg-gray-700"></div>
          <div className="text-center">
            <div className="text-6xl font-mono text-gray-500 font-bold">{data.numerology.expressionNumber}</div>
            <div className="text-xs tracking-widest text-gray-500 mt-2">EXPRESSION</div>
          </div>
        </div>
      )
    },
    {
      title: "CELESTIAL ALIGNMENT",
      subtitle: "PLANETARY INFLUENCE",
      content: `Sun in ${data.astrology.sunSign}.\nMoon in ${data.astrology.moonSign}.\nRising in ${data.astrology.risingSign}.\n\nElemental Base: ${data.astrology.element}.\n\n"${data.storyHooks.astrology}"`,
      icon: <Crosshair size={48} className="text-[#D4AF37]" />,
      renderVisual: () => (
        <div className="grid grid-cols-2 gap-8 my-10 font-mono text-sm">
           <div className="border border-[#D4AF37] p-4 text-center">
             <div className="text-[#D4AF37]">SUN</div>
             <div>{data.astrology.sunSign.toUpperCase()}</div>
           </div>
           <div className="border border-gray-700 p-4 text-center text-gray-400">
             <div>MOON</div>
             <div>{data.astrology.moonSign.toUpperCase()}</div>
           </div>
           <div className="border border-gray-700 p-4 text-center text-gray-400">
             <div>RISING</div>
             <div>{data.astrology.risingSign.toUpperCase()}</div>
           </div>
           <div className="border border-gray-700 p-4 text-center text-gray-400">
             <div>MODE</div>
             <div>{data.astrology.modality.toUpperCase()}</div>
           </div>
        </div>
      )
    },
    {
      title: "EASTERN CIPHER",
      subtitle: "VIETNAMESE ZODIAC",
      content: `You are the ${data.vietnameseZodiac.animal} (${data.vietnameseZodiac.stem} ${data.vietnameseZodiac.branch}).\n\nNạp Âm Element: ${data.vietnameseZodiac.element}.\n\n${data.storyHooks.vietnamese}`,
      icon: <Globe2 size={48} className="text-[#D4AF37]" />,
      renderVisual: () => (
        <div className="my-10 text-center">
           <h3 className="text-4xl font-serif text-[#D4AF37] mb-2">{data.vietnameseZodiac.animal.toUpperCase()}</h3>
           <div className="text-sm font-mono text-gray-500">{data.vietnameseZodiac.stem} {data.vietnameseZodiac.branch}</div>
           <div className="w-16 h-1 bg-[#D4AF37] mx-auto my-4"></div>
           <div className="text-xl text-white">{data.vietnameseZodiac.element}</div>
        </div>
      )
    },
    {
      title: "MISSION PARAMETERS",
      subtitle: "STRENGTHS & CHALLENGES",
      content: `PRIMARY ASSET: ${data.strengthsAndChallenges[0].title}.\n${data.strengthsAndChallenges[0].description}\n\nCRITICAL OBSTACLE: ${data.strengthsAndChallenges.find(x => x.type === 'challenge')?.title || 'Unknown'}.\n\nProceed with caution.`,
      icon: <Fingerprint size={48} className="text-[#D4AF37]" />,
      renderVisual: () => (
        <div className="w-full max-w-md my-8 space-y-4">
           <div className="bg-[#D4AF37]/10 border-l-4 border-[#D4AF37] p-4">
              <div className="text-xs text-[#D4AF37] font-bold">OPTIMIZED ASSET</div>
              <div className="text-white">{data.strengthsAndChallenges[0].title}</div>
           </div>
           <div className="bg-red-900/10 border-l-4 border-red-500 p-4">
              <div className="text-xs text-red-500 font-bold">DETECTED RISK</div>
              <div className="text-white">{data.strengthsAndChallenges.find(x => x.type === 'challenge')?.title}</div>
           </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[step];
  const isLastSlide = step === slides.length - 1;

  // Typewriter effect
  useEffect(() => {
    setTypedText('');
    let i = 0;
    const text = currentSlide.content;
    const speed = 20; 
    
    // Simple logic to type out text
    const timer = setInterval(() => {
      if (i < text.length) {
        setTypedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white z-20">
        <X size={24} />
      </button>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-[#D4AF37] transition-all duration-500" style={{ width: `${((step + 1) / slides.length) * 100}%` }} />

      {/* Content Container */}
      <div className="max-w-3xl w-full flex flex-col items-center relative z-10 text-center">
        
        {/* Header */}
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 animate-pulse">{currentSlide.icon}</div>
          <h2 className="text-3xl font-serif text-[#D4AF37] tracking-widest mb-1">{currentSlide.title}</h2>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em]">{currentSlide.subtitle}</p>
        </div>

        {/* Visual Component */}
        <div className="min-h-[200px] flex items-center justify-center">
           {currentSlide.renderVisual()}
        </div>

        {/* Text Area */}
        <div className="min-h-[120px] max-w-lg mb-8 bg-black/50 p-4 border border-gray-800 rounded">
          <p className="font-mono text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
            {typedText}<span className="cursor-blink text-[#D4AF37]">_</span>
          </p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <SpyButton 
            variant="secondary" 
            onClick={() => setStep(prev => Math.max(0, prev - 1))}
            disabled={step === 0}
            className={step === 0 ? "opacity-0" : ""}
          >
            <ChevronLeft size={16} className="mr-2 inline" /> PREV
          </SpyButton>

          {isLastSlide ? (
             <SpyButton variant="primary" onClick={onClose}>
               INITIALIZE DASHBOARD
             </SpyButton>
          ) : (
             <SpyButton variant="primary" onClick={() => setStep(prev => Math.min(slides.length - 1, prev + 1))}>
               NEXT <ChevronRight size={16} className="ml-2 inline" />
             </SpyButton>
          )}
        </div>

      </div>
    </div>
  );
};