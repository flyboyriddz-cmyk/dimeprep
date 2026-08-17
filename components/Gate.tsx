import React, { useState } from 'react';
import { Lock, Globe, Terminal, User } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface GateProps {
  onUnlock: () => void;
  isDarkMode: boolean;
}

type GateStatus = 'IDLE' | 'SCANNING' | 'SUCCESS';

export const Gate: React.FC<GateProps> = ({ onUnlock, isDarkMode }) => {
  const [gateStatus, setGateStatus] = useState<GateStatus>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Clean Form State matching your visual design
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [sectorSpec, setSectorSpec] = useState('SECTOR_01 // GARMENT DROPS');
  const [country, setCountry] = useState('United States');
  const [honeyPot, setHoneyPot] = useState(''); // Anti-bot trap
  const [errorMsg, setErrorMsg] = useState('');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]);
  };

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyPot) return;

    if (!firstName || !email) {
      setErrorMsg('ERROR: AGENT_NAME AND AGENT_EMAIL REQUIRED');
      return;
    }

    setErrorMsg('');
    setGateStatus('SCANNING');
    addLog(`TRACKING CLIENT IP: 219.76.7.121...`);

    try {
      setTimeout(() => addLog('ESTABLISHING SECURE CONNECTION...'), 400);
      setTimeout(() => addLog('VERIFYING ENCRYPTION KEYS...'), 800);

      // Direct Database Insert (Bypasses Auth/Captcha restriction completely)
      const { error } = await supabase.from('profiles').insert([
        {
          first_name: firstName,
          email: email,
          sector_spec: sectorSpec,
          location_country: country,
        }
      ]);

      if (error) {
        throw new Error(error.message);
      }

      setTimeout(() => {
        setGateStatus('SUCCESS');
        addLog('ACCESS GRANTED. INITIALIZING SECTOR...');
        
        try {
          localStorage.setItem('dp_gems_access', 'true');
        } catch (err) {
          console.warn('Local storage restricted');
        }

        setTimeout(() => {
          onUnlock();
        }, 800);
      }, 1200);

    } catch (err: any) {
      console.error('Submission error:', err.message || err);
      setGateStatus('IDLE');
      setErrorMsg(`SYSTEM ERROR: ${err.message || 'RE-AUTHORIZE UPLINK'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#002b80] text-white flex flex-col items-center justify-center p-4 font-retro overflow-y-auto">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-15 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(45deg, #ffffff 1px, transparent 1px), linear-gradient(135deg, #ffffff 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
      </div>

      <div className="relative z-10 max-w-md w-full bg-[#003399]/90 border-4 border-white p-6 md:p-8 shadow-2xl rounded-lg">
        
        {/* Status Header */}
        <div className="flex justify-end mb-4">
          <div className="border border-white px-3 py-1 bg-black/40 text-xs font-pixel tracking-widest">
            STATUS: {gateStatus === 'SCANNING' ? 'SCANNING' : gateStatus === 'SUCCESS' ? 'CONNECTED' : 'WAITING'}
          </div>
        </div>

        {/* Logo Graphic */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center rotate-45 bg-black/30">
            <span className="font-pixel text-xl -rotate-45 font-bold tracking-tighter">DP</span>
          </div>
        </div>

        {/* Access Control Badge */}
        <div className="border border-white/40 rounded-full py-2 px-4 flex items-center justify-center gap-2 mb-6 bg-black/20 max-w-[240px] mx-auto">
          <Lock className="w-4 h-4 text-white" />
          <span className="font-pixel text-xs tracking-wider">ACCESS CONTROL</span>
        </div>
        <p className="text-[10px] text-center font-mono text-gray-300 tracking-widest uppercase -mt-4 mb-6">
          AUTHORIZATION REQUIRED
        </p>

        {errorMsg && (
          <div className="bg-red-950 border border-red-500 text-red-400 text-xs p-2 mb-4 font-mono text-center animate-pulse">
            {errorMsg}
          </div>
        )}

        {gateStatus === 'SCANNING' || gateStatus === 'SUCCESS' ? (
          <div className="space-y-3 py-8 text-center">
            <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-pixel text-green-400 text-lg tracking-widest animate-pulse">
              {gateStatus === 'SUCCESS' ? 'ACCESS GRANTED' : 'ESTABLISHING UPLINK...'}
            </p>
            <div className="bg-black/60 border border-green-500/30 p-3 text-left font-mono text-xs text-green-400 space-y-1">
              {logs.map((log, i) => (
                <div key={i}>{`> ${log}`}</div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleTerminalSubmit} className="space-y-4">
            
            {/* Honeypot anti-bot trap */}
            <input type="text" name="website" value={honeyPot} onChange={(e) => setHoneyPot(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

            {/* Agent Name */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-300 flex items-center gap-1 font-mono">
                <User className="w-3 h-3" /> AGENT_NAME
              </label>
              <input 
                type="text" 
                required
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-[#001f5c] border border-white/30 p-2.5 text-white text-sm outline-none focus:border-white font-mono placeholder:text-gray-500"
                placeholder="IDENTIFIER"
              />
            </div>

            {/* Agent Email */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-300 flex items-center gap-1 font-mono">
                <Terminal className="w-3 h-3" /> AGENT_EMAIL
              </label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#001f5c] border border-white/30 p-2.5 text-white text-sm outline-none focus:border-white font-mono placeholder:text-gray-500"
                placeholder="SECURE COMMS"
              />
            </div>

            {/* Sector Spec */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-300 font-mono">SECTOR_SPEC</label>
              <select 
                value={sectorSpec} 
                onChange={(e) => setSectorSpec(e.target.value)}
                className="w-full bg-[#001f5c] border border-white/30 p-2.5 text-white text-sm outline-none focus:border-white font-mono cursor-pointer"
              >
                <option value="SECTOR_01 // GARMENT DROPS">SECTOR_01 // GARMENT DROPS</option>
                <option value="SECTOR_02 // VISUAL AURA">SECTOR_02 // VISUAL AURA</option>
                <option value="SECTOR_03 // SONIC DROPS">SECTOR_03 // SONIC DROPS</option>
              </select>
            </div>

            {/* Region / Country */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-300 flex items-center gap-1 font-mono">
                <Globe className="w-3 h-3" /> REGION / COUNTRY
              </label>
              <select 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#001f5c] border border-white/30 p-2.5 text-white text-sm outline-none focus:border-white font-mono cursor-pointer"
              >
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Japan">Japan</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Italy">Italy</option>
                <option value="Spain">Spain</option>
                <option value="South Korea">South Korea</option>
                <option value="Rest of World / Other">Rest of World / Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-white hover:bg-gray-100 text-[#002b80] font-pixel text-xl tracking-widest p-3 mt-6 transition-all shadow-lg active:translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>INITIALIZE SYSTEM</span>
              <div className="w-2 h-2 bg-[#002b80]"></div>
            </button>
          </form>
        )}

        {/* Footer Logs Status */}
        <div className="mt-8 flex justify-between items-center text-[10px] font-mono text-gray-300 border-t border-white/20 pt-3">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>CLIENT_IP: 219.76.7.121</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>LOGGING_ACTIVE</span>
          </div>
        </div>

      </div>
    </div>
  );
};
