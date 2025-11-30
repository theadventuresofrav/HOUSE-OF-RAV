export interface UserInputs {
  fullName: string;
  dob: string;
  birthTime: string;
  birthLocation: string;
}

export interface NumerologyData {
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  archetypeTitle: string;
  expressionDescription: string;
  pinnacles: string[];
  challenges: string[];
}

export interface AstrologyData {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  element: string;
  modality: string;
  currentTransit: string;
  upcomingTransit: string;
}

export interface VietnameseZodiacData {
  stem: string;
  branch: string;
  animal: string;
  stemElement: string;
  nupAmElement: string;
  attributes: string;
}

export interface TimelineEvent {
  phase: string;
  description: string;
  years: string;
}

export interface StrengthChallenge {
  type: 'strength' | 'challenge';
  title: string;
  description: string;
}

export interface ProfileData {
  timestamp: number;
  numerology: NumerologyData;
  astrology: AstrologyData;
  vietnameseZodiac: VietnameseZodiacData;
  timeline: TimelineEvent[];
  strengthsAndChallenges: StrengthChallenge[];
  narratorBullets: string[]; // New field
  storyHooks: {
    hero: string;
    numerology: string;
    astrology: string;
    vietnamese: string;
    timeline: string;
    tools: string;
    daily: string;
  };
}

export interface SigilProps {
  initials: string;
  lifePath: number;
  zodiacSign: string;
  size?: number;
}

export interface LieLog {
  id: string;
  text: string;
  category: string;
  driver: string;
  method: string;
  timestamp: number;
}

export interface FearLog {
  id: string;
  fear: string;
  worstCase: string;
  prevention: string;
  repair: string;
  timestamp: number;
}

export interface ClarityLog {
  id: string;
  distortedThought: string;
  cognitiveBias: string;
  rationalTruth: string;
  timestamp: number;
}

export interface ImpactLog {
  id: string;
  action: string;
  type: 'SYNTROPY' | 'ENTROPY'; // Syntropy = Order/Good, Entropy = Chaos/Bad
  magnitude: number; // 1-5
  timestamp: number;
}

export interface DailyBriefing {
  dayIdentity: {
    date: string;
    personalDayNumber: number;
    moonPhase: string;
    astroTransits: string;
    energyQuality: string;
  };
  narratorBullets: string[]; // New field
  oneLineCompass: string;
  threeArrows: {
    head: string;
    hands: string;
    heart: string;
  };
  opportunityWindow: string;
  moneySignal: string;
  powerMove: string;
  shadowWarning: string;
  relationshipLens: string;
  mindBodyReset: string;
  signatureRitual: string;
  lesson: string;
  nightReflection: string[];
}

export interface StrategicDossier {
  avatar: {
    name: string;
    archetype: string;
    auraColor: string;
    auraDescription: string;
  };
  narratorBullets: string[]; // New field
  psychology: {
    lifePathStory: string;
    moonStory: string;
    expressionBehavior: string;
    attachmentStyle: string;
  };
  energeticWeather: {
    personalCycle: string;
    majorTransits: string;
    messagingTone: string;
    shadowActivated: {
      shadow: string;
      activated: string;
    };
  };
  crmStrategy: {
    opportunityLevel: string;
    influenceTactics: string;
    relationshipGrowthPath: string;
    doAndDoNot: {
      do: string[];
      doNot: string[];
    };
    timingRecommendations: string;
  };
}