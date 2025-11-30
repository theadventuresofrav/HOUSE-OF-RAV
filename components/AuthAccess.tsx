import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { SpyButton } from './SpyUI';
import { Lock, Fingerprint, Shield, AlertTriangle } from 'lucide-react';

export const AuthAccess: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        else alert("Uplink requested. Check email for verification code.");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      
      <div className="max-w-sm w-full bg-[#0C0C0F] border border-gray-800 p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,1)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gray-900 rounded-full flex items-center justify-center border border-gray-700 mb-4 animate-pulse">
            <Shield size={32} className="text-gray-500" />
          </div>
          <h1 className="text-xl font-serif text-gray-200 tracking-[0.3em]">SECURE UPLINK</h1>
          <p className="text-[10px] font-mono text-gray-600 mt-2 uppercase">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/20 border border-red-900/50 p-3 flex items-center gap-2 text-xs text-red-500">
            <AlertTriangle size={12} /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Agent ID (Email)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-gray-800 text-white p-3 focus:border-[#D4AF37] outline-none transition-colors font-mono text-sm"
              placeholder="agent@oracle.net"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Access Key (Password)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-800 text-white p-3 focus:border-[#D4AF37] outline-none transition-colors font-mono text-sm"
              placeholder="••••••••"
            />
          </div>

          <SpyButton onClick={handleAuth} disabled={loading} className="w-full mt-4">
            {loading ? "AUTHENTICATING..." : (isLogin ? "ESTABLISH CONNECTION" : "REQUEST CLEARANCE")}
          </SpyButton>

          <div className="text-center mt-4">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] text-gray-500 hover:text-[#D4AF37] uppercase tracking-widest underline"
            >
              {isLogin ? "Request New Clearance (Sign Up)" : "Have Existing Clearance? (Log In)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};