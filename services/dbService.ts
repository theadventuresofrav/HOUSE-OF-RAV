import { supabase, isSupabaseConfigured } from './supabaseClient';
import { UserInputs, ProfileData, LieLog, FearLog, ClarityLog, ImpactLog, DailyBriefing, StrategicDossier } from '../types';

// --- PROFILE & USER INPUTS ---

export const fetchUserProfile = async (userId: string) => {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is fine for new users
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
};

export const saveUserProfile = async (userId: string, inputs: UserInputs, profileData: ProfileData) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      full_name: inputs.fullName,
      dob: inputs.dob,
      birth_time: inputs.birthTime,
      birth_location: inputs.birthLocation,
      profile_data: profileData,
      updated_at: new Date().toISOString()
    });
  
  if (error) throw error;
};

// --- LOGS ---

export const fetchLogs = async (userId: string) => {
  if (!isSupabaseConfigured) {
    return { lieLogs: [], fearLogs: [], clarityLogs: [], impactLogs: [] };
  }

  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching logs:', error);
    return { lieLogs: [], fearLogs: [], clarityLogs: [], impactLogs: [] };
  }

  // Map DB logs back to specific types
  const lieLogs: LieLog[] = [];
  const fearLogs: FearLog[] = [];
  const clarityLogs: ClarityLog[] = [];
  const impactLogs: ImpactLog[] = [];

  data.forEach((log: any) => {
    const item = { ...log.content, id: log.id, timestamp: new Date(log.created_at).getTime() };
    if (log.log_type === 'LIE') lieLogs.push(item);
    if (log.log_type === 'FEAR') fearLogs.push(item);
    if (log.log_type === 'CLARITY') clarityLogs.push(item);
    if (log.log_type === 'IMPACT') impactLogs.push(item);
  });

  return { lieLogs, fearLogs, clarityLogs, impactLogs };
};

export const saveLog = async (userId: string, type: 'LIE' | 'FEAR' | 'CLARITY' | 'IMPACT', content: any) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('logs')
    .insert({
      user_id: userId,
      log_type: type,
      content: content
    });
  
  if (error) console.error('Error saving log', error);
};

// --- REPORTS (Briefing/Dossier) ---

export const fetchLatestReport = async (userId: string, type: 'BRIEFING' | 'DOSSIER') => {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('reports')
    .select('content')
    .eq('user_id', userId)
    .eq('report_type', type)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data.content;
};

export const saveReport = async (userId: string, type: 'BRIEFING' | 'DOSSIER', content: any) => {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('reports')
    .insert({
      user_id: userId,
      report_type: type,
      content: content
    });
    
  if (error) console.error('Error saving report', error);
};