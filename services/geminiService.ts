import { GoogleGenAI, Type } from "@google/genai";
import { UserInputs, ProfileData, VietnameseZodiacData, LieLog, DailyBriefing, StrategicDossier } from "../types";

const parseJSON = (text: string) => {
  try {
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Invalid response format from Oracle.");
  }
};

// --- Numerology Helpers ---

const reduceToSingleDigit = (num: number, allowMaster: boolean = false): number => {
  let current = num;
  while (current > 9) {
    if (allowMaster && (current === 11 || current === 22 || current === 33)) {
      return current;
    }
    current = current.toString().split('').reduce((acc, val) => acc + parseInt(val), 0);
  }
  return current;
};

const calculateLifePath = (dob: string): number => {
  const parts = dob.split('-');
  if (parts.length !== 3) return 0;
  
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  const rYear = reduceToSingleDigit(year);
  const rMonth = reduceToSingleDigit(month);
  const rDay = reduceToSingleDigit(day);

  return reduceToSingleDigit(rYear + rMonth + rDay, true);
};

const calculateCycles = (dob: string) => {
  const parts = dob.split('-');
  if (parts.length !== 3) return { year: 0, month: 0, day: 0 };

  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const rMonth = reduceToSingleDigit(month);
  const rDay = reduceToSingleDigit(day);
  const rCurrentYear = reduceToSingleDigit(currentYear);
  const personalYear = reduceToSingleDigit(rMonth + rDay + rCurrentYear);
  const personalMonth = reduceToSingleDigit(personalYear + currentMonth);
  const personalDay = reduceToSingleDigit(personalMonth + currentDay);

  return { personalYear, personalMonth, personalDay };
};

// --- Vietnamese Zodiac Helpers (Can Chi) ---

const calculateVietnameseZodiac = (dob: string): { stem: string; branch: string; animal: string; full: string; stemElement: string } => {
  const year = parseInt(dob.split('-')[0]);

  // Heavenly Stems (Thiên Can)
  const stems = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
  
  // Map Stems to Elements
  const stemElements: Record<string, string> = {
    'Canh': 'Metal', 'Tân': 'Metal',
    'Nhâm': 'Water', 'Quý': 'Water',
    'Giáp': 'Wood', 'Ất': 'Wood',
    'Bính': 'Fire', 'Đinh': 'Fire',
    'Mậu': 'Earth', 'Kỷ': 'Earth'
  };

  const stemIndex = year % 10;
  const stem = stems[stemIndex];
  const stemElement = stemElements[stem] || "Unknown";

  // Earthly Branches (Địa Chi)
  const branches = [
    { vi: 'Thân', en: 'Monkey' }, { vi: 'Dậu', en: 'Rooster' }, { vi: 'Tuất', en: 'Dog' }, { vi: 'Hợi', en: 'Pig' },
    { vi: 'Tý', en: 'Rat' }, { vi: 'Sửu', en: 'Buffalo' }, { vi: 'Dần', en: 'Tiger' }, { vi: 'Mão', en: 'Cat' },
    { vi: 'Thìn', en: 'Dragon' }, { vi: 'Tỵ', en: 'Snake' }, { vi: 'Ngọ', en: 'Horse' }, { vi: 'Mùi', en: 'Goat' }
  ];
  
  const branchIndex = year % 12;
  const branchData = branches[branchIndex];

  return {
    stem: stem,
    branch: branchData.vi,
    animal: branchData.en,
    full: `${stem} ${branchData.vi}`,
    stemElement: stemElement
  };
};

// --- Main Service ---

export const generateUserProfile = async (inputs: UserInputs): Promise<ProfileData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key missing");
  }

  // Pre-calculate
  const calculatedLifePath = calculateLifePath(inputs.dob);
  const cycles = calculateCycles(inputs.dob);
  const vnZodiac = calculateVietnameseZodiac(inputs.dob);

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as a mystical oracle with a spy-tech twist. 
    Analyze the following user data to generate a detailed esoteric profile.

    USER DATA:
    Full Name: ${inputs.fullName}
    Date of Birth: ${inputs.dob}
    Birth Time: ${inputs.birthTime || "Unknown"}
    Birth Location: ${inputs.birthLocation}

    PRE-CALCULATED DATA (Source of Truth):
    - Life Path: ${calculatedLifePath}
    - Personal Year/Month/Day: ${cycles.personalYear} / ${cycles.personalMonth} / ${cycles.personalDay}
    - Vietnamese Zodiac: ${vnZodiac.full} (The ${vnZodiac.stemElement} ${vnZodiac.animal})

    IMPORTANT: For the Vietnamese Zodiac, the PRIMARY element is determined by the Stem (${vnZodiac.stem} = ${vnZodiac.stemElement}). 
    Example: Tân Dậu is a METAL Rooster because Tân is Metal. Do not confuse this with the Nạp Âm element (which might be different).
    However, please DO calculate the Nạp Âm element (e.g. Pomegranate Wood) and store it in 'nupAmElement' for depth.

    TASKS:
    1. Numerology: Calculate Expression, Soul Urge, Personality based on name.
    2. Numerology Specifics: For Expression Number, specifically describe the "Natural Capabilities and Talents" it bestows.
    3. Astrology: Calculate Sun, Moon, Rising.
    4. Vietnamese Zodiac: Identify the Nạp Âm element (Soul Element) and describe attributes.
    5. Timeline: Generate highlights.
    6. Story Hooks: "vietnamese" hook should explain the ${vnZodiac.stemElement} ${vnZodiac.animal} archetype.
    7. Narrator Bullets: Generate 4 distinct, punchy, noir-style observations about the user's core nature.

    Response MUST be JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          numerology: {
            type: Type.OBJECT,
            properties: {
              lifePathNumber: { type: Type.INTEGER },
              expressionNumber: { type: Type.INTEGER },
              soulUrgeNumber: { type: Type.INTEGER },
              personalityNumber: { type: Type.INTEGER },
              personalYear: { type: Type.INTEGER },
              personalMonth: { type: Type.INTEGER },
              personalDay: { type: Type.INTEGER },
              archetypeTitle: { type: Type.STRING },
              expressionDescription: { type: Type.STRING, description: "Detailed description of natural talents and capabilities based on Expression Number." },
              pinnacles: { type: Type.ARRAY, items: { type: Type.STRING } },
              challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['lifePathNumber', 'expressionNumber', 'archetypeTitle', 'expressionDescription', 'personalYear', 'personalMonth', 'personalDay']
          },
          astrology: {
            type: Type.OBJECT,
            properties: {
              sunSign: { type: Type.STRING },
              moonSign: { type: Type.STRING },
              risingSign: { type: Type.STRING },
              element: { type: Type.STRING },
              modality: { type: Type.STRING },
              currentTransit: { type: Type.STRING },
              upcomingTransit: { type: Type.STRING },
            },
            required: ['sunSign', 'moonSign', 'element']
          },
          vietnameseZodiac: {
            type: Type.OBJECT,
            properties: {
              stem: { type: Type.STRING },
              branch: { type: Type.STRING },
              animal: { type: Type.STRING },
              stemElement: { type: Type.STRING },
              nupAmElement: { type: Type.STRING, description: "The Nap Am element (e.g. Pomegranate Wood)" },
              attributes: { type: Type.STRING },
            },
            required: ['stem', 'branch', 'animal', 'stemElement', 'nupAmElement', 'attributes']
          },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                description: { type: Type.STRING },
                years: { type: Type.STRING },
              }
            }
          },
          strengthsAndChallenges: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['strength', 'challenge'] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              }
            }
          },
          narratorBullets: {
             type: Type.ARRAY,
             items: { type: Type.STRING },
             description: "4 punchy, noir-style observations about the user."
          },
          storyHooks: {
            type: Type.OBJECT,
            properties: {
              hero: { type: Type.STRING },
              numerology: { type: Type.STRING },
              astrology: { type: Type.STRING },
              vietnamese: { type: Type.STRING },
              timeline: { type: Type.STRING },
              tools: { type: Type.STRING },
              daily: { type: Type.STRING },
            },
            required: ['hero', 'numerology', 'daily', 'vietnamese']
          }
        },
        required: ['numerology', 'astrology', 'vietnameseZodiac', 'timeline', 'strengthsAndChallenges', 'storyHooks', 'narratorBullets']
      }
    }
  });

  if (!response.text) {
    throw new Error("No data received from the Oracle.");
  }

  const data = parseJSON(response.text);
  data.timestamp = Date.now();
  
  // Enforce calculated values (Source of Truth) to prevent AI drift
  data.numerology.personalYear = cycles.personalYear;
  data.numerology.personalMonth = cycles.personalMonth;
  data.numerology.personalDay = cycles.personalDay;
  data.numerology.lifePathNumber = calculatedLifePath;
  
  // Enforce Zodiac
  data.vietnameseZodiac.stem = vnZodiac.stem;
  data.vietnameseZodiac.branch = vnZodiac.branch;
  data.vietnameseZodiac.animal = vnZodiac.animal;
  data.vietnameseZodiac.stemElement = vnZodiac.stemElement;

  return data;
};

// --- STRATEGIC DOSSIER (CRM DEEP DIVE) ---

export const generateStrategicDossier = async (profile: ProfileData, inputs: UserInputs): Promise<StrategicDossier> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Role: Intelligence Analyst / Esoteric Strategist.
    Task: Compile a "Strategic Dossier" (CRM Report) for the following subject.
    Tone: Professional, psychological, strategic, slightly mystical but grounded in business/relationship dynamics.

    SUBJECT:
    Name: ${inputs.fullName}
    Archetype: ${profile.numerology.archetypeTitle}
    Life Path: ${profile.numerology.lifePathNumber}
    Expression: ${profile.numerology.expressionNumber}
    Sun/Moon: ${profile.astrology.sunSign} / ${profile.astrology.moonSign}
    Current Cycle: Personal Year ${profile.numerology.personalYear}, Personal Month ${profile.numerology.personalMonth}

    Generate the report following this EXACT structure:

    1. AVATAR
    - Name: ${inputs.fullName}
    - Archetype Title: (Refined version of ${profile.numerology.archetypeTitle})
    - Aura Color: (e.g. "Royal Purple")
    - Aura Description: (Why this color? Link spiritual wisdom to earthly authority)

    2. NARRATOR BULLETS
    - 3 ruthless, high-level strategic summary points about this target.

    3. WHY THEY ARE LIKE THIS (Psychology)
    - Life Path Story: How they master personal power/destiny.
    - Moon Story: Emotional strategy (based on ${profile.astrology.moonSign}).
    - Expression Behavior: How they work/manifest (based on Expression ${profile.numerology.expressionNumber}).
    - Attachment & Trust Style: (Infer based on astro/numerology combo).

    4. ENERGETIC WEATHER
    - Personal Cycle: What the current Personal Year ${profile.numerology.personalYear} demands of them.
    - Major Transits: Identify current pressure/opportunity zones based on their Sun/Rising (approximate).
    - Messaging Tone: How to speak to them right now.
    - Shadow vs Activated: 
       * Shadow: Their negative reactive state.
       * Activated: Their empowered state.

    5. WHAT TO DO WITH THEM (CRM Strategy)
    - Opportunity Level: (e.g., High, Neutral, Caution)
    - Influence/Motivate: Best way to pitch or connect.
    - Relationship Growth Path: How to build long-term trust.
    - Do's and Don'ts: 3 specific Do's, 3 specific Don'ts.
    - Timing Recommendations: When to act based on cycles.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          avatar: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              archetype: { type: Type.STRING },
              auraColor: { type: Type.STRING },
              auraDescription: { type: Type.STRING },
            },
            required: ['name', 'archetype', 'auraColor', 'auraDescription']
          },
          narratorBullets: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 ruthless strategic summary points."
          },
          psychology: {
            type: Type.OBJECT,
            properties: {
              lifePathStory: { type: Type.STRING },
              moonStory: { type: Type.STRING },
              expressionBehavior: { type: Type.STRING },
              attachmentStyle: { type: Type.STRING },
            },
            required: ['lifePathStory', 'moonStory', 'expressionBehavior', 'attachmentStyle']
          },
          energeticWeather: {
            type: Type.OBJECT,
            properties: {
              personalCycle: { type: Type.STRING },
              majorTransits: { type: Type.STRING },
              messagingTone: { type: Type.STRING },
              shadowActivated: {
                type: Type.OBJECT,
                properties: {
                  shadow: { type: Type.STRING },
                  activated: { type: Type.STRING },
                },
                required: ['shadow', 'activated']
              }
            },
            required: ['personalCycle', 'majorTransits', 'messagingTone', 'shadowActivated']
          },
          crmStrategy: {
            type: Type.OBJECT,
            properties: {
              opportunityLevel: { type: Type.STRING },
              influenceTactics: { type: Type.STRING },
              relationshipGrowthPath: { type: Type.STRING },
              doAndDoNot: {
                type: Type.OBJECT,
                properties: {
                  do: { type: Type.ARRAY, items: { type: Type.STRING } },
                  doNot: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['do', 'doNot']
              },
              timingRecommendations: { type: Type.STRING },
            },
            required: ['opportunityLevel', 'influenceTactics', 'relationshipGrowthPath', 'doAndDoNot', 'timingRecommendations']
          }
        },
        required: ['avatar', 'narratorBullets', 'psychology', 'energeticWeather', 'crmStrategy']
      }
    }
  });

  if (!response.text) throw new Error("Dossier generation failed.");
  
  return parseJSON(response.text);
};

// --- AGENT BRAIN (DAILY BRIEFING) ---

export const generateDailyBriefing = async (profile: ProfileData, lieLogs: LieLog[]): Promise<DailyBriefing> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // BEHAVIORAL PATTERN SCAN
  const recentLies = lieLogs.slice(-5);
  const patternsText = recentLies.length > 0 
    ? `DETECTED BEHAVIORAL PATTERNS (Recent Logs): \n${recentLies.map(l => `- Category: ${l.category} | Driver: ${l.driver}`).join('\n')}`
    : "No recent behavioral anomalies logged. Proceed with standard optimization.";

  const prompt = `
    🧠 AGENT PERSONALITY CORE
    Identity: You are the user's Personal Intelligence Officer.
    Tone: Direct truth. High clarity. Zero fluff. Loyal, motivational, slightly smug spy-master.
    Mission: Optimize decisions, timing, patterns, and outcomes.

    TARGET DATA (THE USER):
    - Archetype: ${profile.numerology.archetypeTitle}
    - Life Path: ${profile.numerology.lifePathNumber}
    - Current Cycle: Personal Year ${profile.numerology.personalYear}, Personal Month ${profile.numerology.personalMonth}, Personal Day ${profile.numerology.personalDay}
    - Zodiac: ${profile.astrology.sunSign} Sun, ${profile.vietnameseZodiac.stemElement} ${profile.vietnameseZodiac.animal}
    - Today's Date: ${today}
    
    ${patternsText}

    TASK:
    Generate a "Daily Insight" following this exact "MASTER VERSION" template structure:

    1. Day Identity
    - Date: ${today}
    - Personal Day Number: ${profile.numerology.personalDay} (Mandatory Source of Truth)
    - Moon Phase: [Current Phase]
    - Astro Transits: [1-2 simple ones]
    - Energy Quality: [Morning / Afternoon / Night] (e.g. "Focused / Social / Restorative")

    2. Narrator Bullets
    - 3 tactical commands/observations for the day in bullet point format.

    3. One-Line Compass
    [A single sentence that sets the tone for the whole day]

    4. Three Arrows (Micro-moves)
    - Head (Mental focus)
    - Hands (Action task)
    - Heart (Energy/Emotional vibe)

    5. Opportunity Window
    [The golden window of the day or luck factor]

    6. Money Signal
    [Where money wants to come from today or behavior to adopt]

    7. Power Move
    [One tangible productive thing]

    8. Shadow Warning
    [What energy to avoid so you don’t sabotage yourself]

    9. Relationship Lens
    [How to communicate today]

    10. Mind & Body Reset
    [One quick practice]

    11. Signature Ritual
    [A theme-based ritual aligned with the numerology + energy]

    12. Lesson
    [A single sentence summing up the day’s wisdom]

    13. Night Reflection
    [3 questions for end of day]
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dayIdentity: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              personalDayNumber: { type: Type.INTEGER },
              moonPhase: { type: Type.STRING },
              astroTransits: { type: Type.STRING },
              energyQuality: { type: Type.STRING },
            },
            required: ['date', 'personalDayNumber', 'moonPhase', 'astroTransits', 'energyQuality']
          },
          narratorBullets: {
             type: Type.ARRAY,
             items: { type: Type.STRING },
             description: "3 tactical commands for the day."
          },
          oneLineCompass: { type: Type.STRING },
          threeArrows: {
             type: Type.OBJECT,
             properties: {
                head: { type: Type.STRING },
                hands: { type: Type.STRING },
                heart: { type: Type.STRING },
             },
             required: ['head', 'hands', 'heart']
          },
          opportunityWindow: { type: Type.STRING },
          moneySignal: { type: Type.STRING },
          powerMove: { type: Type.STRING },
          shadowWarning: { type: Type.STRING },
          relationshipLens: { type: Type.STRING },
          mindBodyReset: { type: Type.STRING },
          signatureRitual: { type: Type.STRING },
          lesson: { type: Type.STRING },
          nightReflection: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['dayIdentity', 'narratorBullets', 'oneLineCompass', 'threeArrows', 'opportunityWindow', 'moneySignal', 'powerMove', 'shadowWarning', 'relationshipLens', 'mindBodyReset', 'signatureRitual', 'lesson', 'nightReflection']
      }
    }
  });

  if (!response.text) throw new Error("Agent Silence.");
  
  return parseJSON(response.text);
};

// --- SIGNAL CLARIFIER (COGNITIVE REFRAMING) ---

export const clarifyThought = async (thought: string, bias: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Role: Tactical Cognitive Defense System.
    Task: Reframe a distorted thought into a clear, objective truth (CBT Reframing).
    
    INPUT DATA:
    - Distorted Thought: "${thought}"
    - Identified Bias: "${bias}"
    
    OUTPUT DIRECTIVE:
    Return a single, concise, rational statement that neutralizes the distortion. 
    Tone: Objective, stoic, empowering.
    Output ONLY the plain text string.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text?.trim() || "Signal decryption failed. Manual override required.";
};