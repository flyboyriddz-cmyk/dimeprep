import React, { useState } from 'react';
import { Lock, Cpu, Globe, Terminal, ShieldAlert, Scan, AlertTriangle, Eye, User } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface GateProps {
  onUnlock: () => void;
  isDarkMode: boolean;
}

type GateStatus = 'IDLE' | 'SCANNING' | 'BREACH' | 'SUCCESS' | 'LOCKED_OUT';

export const Gate: React.FC<GateProps> = ({ onUnlock, isDarkMode }) => {
  const [gateStatus, setGateStatus] = useState<GateStatus>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [sector, setSector] = useState('SECTOR_01 // GARMENT DROPS');
  const [country, setCountry] = useState('United Kingdom');
  const [hardwareWeight, setHardwareWeight] = useState('450 GSM Heavyweight (Restricted)');
  const [retrievalEnv, setRetrievalEnv] = useState('Dystopian London (Film)');
  const [uplinkFreq, setUplinkFreq] = useState('Bass-Heavy / Drill');
  const [honeyPot, setHoneyPot] = useState(''); // Anti-bot trap
  const [errorMsg, setErrorMsg] = useState('');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]);
  };

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyPot) return; // Silent block for bots

    if (!firstName || !email) {
      setErrorMsg('ERROR: AGENT_NAME AND AGENT_EMAIL REQUIRED');
      return;
    }

    setErrorMsg('');
    setGateStatus('SCANNING');
    addLog(`TRACKING CLIENT IP: 243.106.5.224...`);

    try {
      setTimeout(() => addLog('ESTABLISHING SECURE CONNECTION...'), 400);
      setTimeout(() => addLog('VERIFYING ENCRYPTION KEYS...'), 800);

      // Insert lead telemetry data into Supabase profiles table
      const { error } = await supabase.from('profiles').insert([
        {
          first_name: firstName,
          email: email,
          hardware_weight: hardwareWeight,
          preferred_size: retrievalEnv,
          location_country: country,
        }
      ]);

      if (error) {
        console.warn('Supabase warning (non-fatal):', error.message);
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
      console.error('Submission error:', err);
      setGateStatus('IDLE');
      setErrorMsg('SYSTEM ERROR: RE-AUTHORIZE UPLINK');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-snes-dark text-white flex flex-col items-center justify-center p-4 font-retro overflow-y-auto">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `linear-gradient(45deg, #ffffff 2px, transparent 2px), linear-gradient(135deg, #ffffff 2px, transparent 2px)`, backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 max-w-lg w-full bg-black/80 border-4 border-snes-purple p-6 md:p-8 shadow-[8px_8px_0_#5c4fb3]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-snes-purple pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-snes-green animate-pulse rounded-full"></div>
            <span className="font-pixel text-snes-green tracking-widest text-sm">SECURITY_GATE // V2.4</span>
          </div>
          <span className="font-pixel text-xs text-gray-400">RESTRICTED_ACCESS</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-pixel text-white mb-2 tracking-wide text-center">
          D.P GEMS <span className="text-snes-purple-light">// ARCHIVE</span>
        </h1>
        <p className="text-gray-400 text-xs md:text-sm text-center mb-6 font-mono">
          AUTHORIZE CREDENTIALS TO ENTER SECTOR 01.
        </p>

        {errorMsg && (
          <div className="bg-red-950 border border-red-500 text-red-400 text-xs p-2 mb-4 font-mono text-center animate-pulse">
            {errorMsg}
          </div>
        )}

        {gateStatus === 'SCANNING' || gateStatus === 'SUCCESS' ? (
          <div className="space-y-3 py-12 text-center">
            <div className="w-12 h-12 border-4 border-snes-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="font-pixel text-snes-green text-xl tracking-widest animate-pulse">
              {gateStatus === 'SUCCESS' ? 'ACCESS GRANTED' : 'ESTABLISHING UPLINK...'}
            </p>
            <div className="bg-black/50 border border-snes-green/30 p-3 text-left font-mono text-xs text-snes-green space-y-1 max-w-sm mx-auto">
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
              <label className="text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <User className="w-3 h-3" /> Agent Name:
              </label>
              <input 
                type="text" 
                required
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 p-2 text-cyan-200 text-sm outline-none focus:border-cyan-400"
                placeholder="Enter agent name..."
              />
            </div>

            {/* Agent Email */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Agent Email:
              </label>
              <input 
                type="email" 
                required
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 p-2 text-cyan-200 text-sm outline-none focus:border-cyan-400"
                placeholder="Enter secure email..."
              />
            </div>

            {/* Sector Spec */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-cyan-400">Sector Spec:</label>
              <select 
                value={sector} 
                onChange={(e) => setSector(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 p-2 text-cyan-200 text-sm outline-none focus:border-cyan-400"
              >
                <option value="SECTOR_01 // GARMENT DROPS">SECTOR_01 // GARMENT DROPS</option>
                <option value="SECTOR_02 // VISUAL AURA">SECTOR_02 // VISUAL AURA</option>
                <option value="SECTOR_03 // SONIC DROPS">SECTOR_03 // SONIC DROPS</option>
              </select>
            </div>

            {/* Region / Country */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                <Globe className="w-3 h-3" /> Region / Country:
              </label>
              <input 
                type="text" 
                value={country} 
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-black/50 border border-cyan-500/30 p-2 text-cyan-200 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            {/* Q1: Hardware Weight */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-snes-yellow">Select your Hardware Weight for Field Operations:</label>
              <select 
                value={hardwareWeight} 
                onChange={(e) => setHardwareWeight(e.target.value)}
                className="w-full bg-black/50 border border-snes-yellow/30 p-2 text-snes-yellow text-sm outline-none focus:border-snes-yellow"
              >
                <option value="450 GSM Heavyweight (Restricted)">450 GSM Heavyweight (Restricted)</option>
                <option value="280 GSM Standard (Archive)">280 GSM Standard (Archive)</option>
              </select>
            </div>

            {/* Q2: Retrieval Environment */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-snes-yellow">Identify your preferred Retrieval Environment:</label>
              <select 
                value={retrievalEnv} 
                onChange={(e) => setRetrievalEnv(e.target.value)}
                className="w-full bg-black/50 border border-snes-yellow/30 p-2 text-snes-yellow text-sm outline-none focus:border-snes-yellow"
              >
                <option value="Dystopian London (Film)">Dystopian London (Film)</option>
                <option value="Neo-Glitch (AMV)">Neo-Glitch (AMV)</option>
                <option value="Archive 1994 (Retro)">Archive 1994 (Retro)</option>
              </select>
            </div>

            {/* Q3: Uplink Frequency */}
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-snes-yellow">Authorize your Uplink Frequency (Sound Spec):</label>
              <select 
                value={uplinkFreq} 
                onChange={(e) => setUplinkFreq(e.target.value)}
                className="w-full bg-black/50 border border-snes-yellow/30 p-2 text-snes-yellow text-sm outline-none focus:border-snes-yellow"
              >
                <option value="Bass-Heavy / Drill">Bass-Heavy / Drill</option>
                <option value="ASMR / Mechanical">ASMR / Mechanical</option>
                <option value="Lo-Fi / Static Hum">Lo-Fi / Static Hum</option>
              </select>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full bg-snes-purple hover:bg-snes-purple-light text-white font-pixel text-xl tracking-widest p-3 mt-6 border-2 border-white transition-all shadow-[4px_4px_0_#000] active:translate-y-1"
            >
              INITIALIZE SYSTEM
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-800 text-center text-[10px] text-gray-500 font-mono">
          SECURE PROTOCOL ACTIVE // ENCRYPTED DATA PIPELINE
        </div>
      </div>
    </div>
  );
};
