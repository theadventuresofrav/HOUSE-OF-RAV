import React from 'react';
import { Book, Map, Star, Compass, AlertTriangle, Cpu } from 'lucide-react';

export const NarratorGuide: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-300 font-light leading-relaxed">
      
      <div className="bg-[#D4AF37]/5 border-l-2 border-[#D4AF37] p-4 mb-6">
        <p className="text-sm italic">
          "To control the outcome, one must distinguish between the inevitable and the possible."
        </p>
      </div>

      <section>
        <h3 className="text-[#D4AF37] font-mono font-bold uppercase mb-3 flex items-center gap-2">
          <Cpu size={18} /> Protocol: Epistemology
        </h3>
        <p>
          HOUSE OF RAV operates on a specific intelligence model: <strong className="text-white">The Blueprint is Deterministic, the Player is Volitional.</strong>
          <br/>
          This guide outlines the hard data boundaries—what the system knows for a fact, and where the user's agency begins.
        </p>
      </section>

      <div className="w-full h-[1px] bg-gray-800"></div>

      <section className="space-y-4">
        <h3 className="text-white font-serif text-lg mb-2">I. THE KNOWABLE (The Hardware)</h3>
        <p className="text-sm text-gray-400 mb-4">
          These elements are calculated from immutable data points (Birth Date, Birth Name). They form the "Geometric Structure" of the user's reality.
        </p>

        <div className="ml-4 space-y-6">
          
          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm uppercase flex items-center gap-2 mb-1">
              <Map size={14} /> Numerology: The Geometric Blueprint
            </h4>
            <ul className="list-disc ml-5 space-y-2 text-sm">
              <li>
                <strong className="text-gray-200">Life Path (The Mission):</strong> Calculated from the Date of Birth. This is the <em>curriculum</em> the user signed up for. It defines the challenges and lessons that will inevitably appear.
              </li>
              <li>
                <strong className="text-gray-200">Expression (The Toolkit):</strong> Calculated from the Full Birth Name. <span className="text-white bg-[#D4AF37]/10 px-1">This reveals natural capabilities and talents.</span> It is the set of innate skills, gifts, and potential abilities the user possesses to solve their Life Path problems.
              </li>
              <li>
                <strong className="text-gray-200">Cycles (The Weather):</strong> Personal Years, Months, and Days. These are temporal zones. We know <em>when</em> it is time to plant and <em>when</em> it is time to harvest.
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm uppercase flex items-center gap-2 mb-1">
              <Star size={14} /> Astrology: The Operating System
            </h4>
            <p className="text-sm">
              If Numerology is the map, Astrology is the lens through which the user views it. It defines emotional defaults (Moon), core identity (Sun), and the interface with the world (Rising). These are the "Factory Settings" of the psyche.
            </p>
          </div>

          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm uppercase flex items-center gap-2 mb-1">
              <Compass size={14} /> Eastern Zodiac: The Archetype
            </h4>
            <p className="text-sm">
              Describes the social mask and the deep elemental soul nature (Nạp Âm). It governs how the entity interacts with the collective and their ancestral energetic inheritance.
            </p>
          </div>

        </div>
      </section>

      <div className="w-full h-[1px] bg-gray-800"></div>

      <section>
        <h3 className="text-white font-serif text-lg mb-2">II. THE UNKNOWABLE (The Software)</h3>
        <div className="bg-red-900/10 border border-red-900/30 p-4 rounded">
          <h4 className="text-red-400 font-bold text-sm uppercase flex items-center gap-2 mb-2">
            <AlertTriangle size={14} /> Variable: Free Will
          </h4>
          <p className="text-sm text-gray-400">
            The System cannot predict <strong>Choice</strong>. 
            <br/><br/>
            While we know the user has a "Life Path 1" (The Leader) and "Expression 8" (Talent for Executive Power), we do not know if they will become a benevolent CEO or a tyrannical dictator. 
            <br/><br/>
            The "Natural Capabilities" are neutral tools. The Narrator (You) decides the moral alignment and application of these tools.
          </p>
        </div>
      </section>

    </div>
  );
};