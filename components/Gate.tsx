import React, { useState, useEffect, useRef } from 'react';
import { Lock, Cpu, Globe, Terminal, ShieldAlert, Scan, AlertTriangle, MapPin, Eye, User, Key } from 'lucide-react';
import { COUNTRIES } from '../constants';
import { supabase } from '../services/supabaseClient';

interface GateProps {
  onUnlock: () => void;
  isDarkMode: boolean;
}

type GateStatus = 'IDLE' | 'SCANNING' | 'AWAITING_CODE' | 'VERIFYING' | 'BREACH' | 'SUCCESS' | 'LOCKED_OUT';

export const Gate: React.FC<GateProps> = ({ onUnlock, isDarkMode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    sector: 'SECTOR_01',
    country: 'United States',
    coordinates: '',
    honey_pot: '',
    otp: ''
  });
  
  const [status, setStatus] = useState<GateStatus>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [clientIP, setClientIP] = useState('LOADING...');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Simulate IP Tracking for "Deterrent" Effect
  useEffect(() => {
    const randIP = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 255)}`;
    setTimeout(() => {
        setClientIP(randIP);
    }, 1500);

    // PRELOAD CRITICAL ASSETS
    const img1 = new Image();
    img1.src = "https://lh3.googleusercontent.com/d/1sgVfKvpDIqIP4KyEGM5jX_37TNtmHpaQ";
    const img2 = new Image();
    img2.src = "https://lh3.googleusercontent.com/d/1MferAsUvaCBEgSrHgcOOmE52T0HmtT56";
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `> ${msg}`]);
  };

  const handleEmailSubmit = async () => {
    setStatus('SCANNING');
    setLogs([]);

    // Simulation Sequence
    const steps = [
      { msg: `TRACKING CLIENT IP: ${clientIP}...`, delay: 100 },
      { msg: "ESTABLISHING SECURE CONNECTION...", delay: 200 },
      { msg: "VERIFYING ENCRYPTION KEYS...", delay: 300 },
    ];

    for (const step of steps) {
      setTimeout(() => addLog(step.msg), step.delay);
    }

    setTimeout(async () => {
        // Bot Protection
        if (formData.honey_pot) {
            addLog("CRITICAL ALERT: BOT SIGNATURE DETECTED");
            setStatus('BREACH');
            return;
        }

        try {
            addLog("INITIATING UPLINK PROTOCOL...");
            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email,
            });

            if (error) {
                console.error('Auth Error:', error);
                addLog(`ERROR: ${error.message.toUpperCase()}`);
                setStatus('IDLE');
            } else {
                addLog("UPLINK ESTABLISHED.");
                addLog("OTP CODE DISPATCHED TO COMMS.");
                setStatus('AWAITING_CODE');
            }
        } catch (err) {
            addLog("CONNECTION FAILURE.");
            setStatus('IDLE');
        }
    }, 1000);
  };

  const handleOtpSubmit = async () => {
      setStatus('VERIFYING');
      addLog("VERIFYING UPLINK CODE...");

      try {
          const { data, error } = await supabase.auth.verifyOtp({
              email: formData.email,
              token: formData.otp,
              type: 'email'
          });

          if (error) {
              addLog(`ACCESS DENIED: ${error.message.toUpperCase()}`);
              setStatus('AWAITING_CODE');
              return;
          }

          if (data.user) {
              addLog("IDENTITY CONFIRMED.");
              addLog("SYNCHRONIZING PROFILE DATA...");

              // 1. Update User Metadata
              await supabase.auth.updateUser({
                  data: { first_name: formData.firstName }
              });

              // 2. Check/Create Profile
              const { data: profile } = await supabase
                  .from('profiles')
                  .select('id')
                  .eq('id', data.user.id)
                  .single();

              if (!profile) {
                  const { error: profileError } = await supabase
                      .from('profiles')
                      .insert([{
                          id: data.user.id,
                          email: formData.email,
                          location_country: formData.country,
                          retrieval_env: formData.sector,
                          created_at: new Date().toISOString()
                      }]);
                  
                  if (profileError) {
                      console.error('Profile Creation Error:', profileError);
                      addLog("WARNING: PROFILE SYNC INCOMPLETE");
                  } else {
                      addLog("PROFILE CREATED SUCCESSFULLY.");
                  }
              }

              setStatus('SUCCESS');
              
              setTimeout(() => {
                  onUnlock();
              }, 1000);
          }
      } catch (err) {
          addLog("SYSTEM ERROR DURING VERIFICATION.");
          setStatus('AWAITING_CODE');
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'LOCKED_OUT') return;

    if (status === 'IDLE') {
        handleEmailSubmit();
    } else if (status === 'AWAITING_CODE') {
        handleOtpSubmit();
    }
  };

  // #ff6b00 filter
  const logoFilter = isDarkMode ? "brightness(0) saturate(100%) invert(60%) sepia(86%) saturate(4323%) hue-rotate(1deg) brightness(103%) contrast(106%)" : "";

  // --------------------------------------------------------------------------
  // SUCCESS VIEW
  // --------------------------------------------------------------------------
  if (status === 'SUCCESS') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 font-pixel overflow-hidden">
        <div className="absolute inset-0 bg-[#004ba0] opacity-50" style={{
            backgroundImage: `linear-gradient(45deg, #003366 25%, transparent 25%, transparent 75%, #003366 75%, #003366), 
                              linear-gradient(45deg, #003366 25%, transparent 25%, transparent 75%, #003366 75%, #003366)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
        }}></div>

        <div className="relative z-10 w-full max-w-md text-center">
            <div className="mb-8 animate-bounce">
                <Lock className="w-16 h-16 text-snes-green mx-auto mb-2" />
                <h1 className="text-5xl text-snes-green text-shadow-md leading-none tracking-tight">
                    ACCESS<br/>GRANTED
                </h1>
            </div>

            <div className="bg-black/80 border-2 border-snes-green p-6 rounded shadow-lg backdrop-blur-sm">
                <p className="font-retro text-xl text-white mb-4">IDENTITY VERIFIED.</p>
                <div className="flex items-center justify-center gap-2 text-snes-green animate-pulse">
                    <Terminal className="w-5 h-5" />
                    <span>ENTERING SYSTEM...</span>
                </div>
                <div className="w-full bg-gray-800 h-2 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-snes-green animate-load-progress" style={{ animationDuration: '0.6s' }}></div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LANDING / FORM VIEW
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 bg-snes-dark bg-[#2c2c36] flex items-center justify-center p-4 font-retro overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none bg-[#002b59]">
         <div className="absolute inset-0 opacity-5" 
              style={{ backgroundImage: 'linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}>
         </div>
         <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0.2))] bg-[length:100%_4px] pointer-events-none z-0"></div>
      </div>

      <div className={`relative z-10 w-full max-w-md md:max-w-lg border-4 shadow-retro p-6 md:p-8 transition-all duration-300 rounded-lg overflow-hidden flex flex-col
        ${status === 'BREACH' || status === 'LOCKED_OUT' ? 'bg-snes-dark border-snes-red' : 'bg-snes-blue border-white'}`}
      >
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-2 py-1 font-retro text-base md:text-lg rounded border flex items-center gap-2 z-20
          ${status === 'IDLE' ? 'bg-black/20 text-white/80 border-white/20' : ''}
          ${(status === 'SCANNING' || status === 'VERIFYING') ? 'bg-snes-yellow text-snes-dark border-snes-dark animate-pulse' : ''}
          ${status === 'AWAITING_CODE' ? 'bg-snes-green text-snes-dark border-snes-dark' : ''}
          ${(status === 'BREACH' || status === 'LOCKED_OUT') ? 'bg-snes-red text-white border-white animate-bounce' : ''}
        `}>
          {status === 'IDLE' && 'STATUS: WAITING'}
          {(status === 'SCANNING' || status === 'VERIFYING') && 'STATUS: PROCESSING'}
          {status === 'AWAITING_CODE' && 'STATUS: AWAITING CODE'}
          {status === 'BREACH' && 'STATUS: BREACH'}
          {status === 'LOCKED_OUT' && 'STATUS: LOCKED'}
        </div>
        
        {/* Header Visuals */}
        <div className="flex flex-col items-center mb-4 md:mb-6 text-center space-y-4 relative z-10 mt-2">
          <img 
            src="https://lh3.googleusercontent.com/d/1AvEBxFjiDeHeafONBMZy9l3q-gky_f_r" 
            alt="D.P RETRO GEMS" 
            className="h-20 md:h-28 w-auto object-contain drop-shadow-xl transition-transform duration-500 mb-0 md:mb-2 hover:scale-105" 
            style={{ filter: logoFilter }}
          />

          <div className="flex items-center gap-4 bg-black/10 px-4 py-2 rounded-full border border-white/10">
            <div className={`p-1.5 border-2 rounded-full shadow-lg transition-colors duration-300
              ${(status === 'BREACH' || status === 'LOCKED_OUT') ? 'border-snes-red animate-pulse bg-snes-red/20' : 
                'border-white/30 bg-black/20'}
            `}>
              {status === 'IDLE' && <Lock className="w-4 h-4 text-white/80" />}
              {(status === 'SCANNING' || status === 'VERIFYING') && <Scan className="w-4 h-4 text-snes-yellow animate-spin-fast" />}
              {status === 'AWAITING_CODE' && <Key className="w-4 h-4 text-snes-green animate-pulse" />}
              {(status === 'BREACH' || status === 'LOCKED_OUT') && <ShieldAlert className="w-4 h-4 text-snes-red" />}
            </div>
            <div className="text-left leading-none">
              <h1 className="font-retro text-lg md:text-xl text-white text-shadow-sm tracking-wide mb-1">ACCESS CONTROL</h1>
              <p className="font-retro text-xs md:text-sm text-white/60 uppercase tracking-widest">
                {(status === 'BREACH' || status === 'LOCKED_OUT') ? '!!! UNAUTHORIZED !!!' : 'AUTHORIZATION REQUIRED'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-black/10 rounded-lg border border-white/10 overflow-hidden min-h-[350px]">
          
          {/* Form Layer */}
          <div className={`transition-all duration-300 h-full p-6 ${(status === 'SCANNING' || status === 'VERIFYING') ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'}`}>
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 font-retro text-base md:text-xl h-full flex flex-col justify-center">
              {/* HONEYPOT FIELD */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="honey_pot">Security Field</label>
                <input
                  type="text"
                  id="honey_pot"
                  name="honey_pot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.honey_pot}
                  onChange={e => setFormData({...formData, honey_pot: e.target.value})}
                />
              </div>

              {status === 'IDLE' && (
                  <>
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                        <div className="space-y-1 group">
                        <label className="text-white/70 uppercase flex items-center gap-2 font-retro text-xs md:text-sm">
                            <User className="w-3 h-3" /> Agent_Name
                        </label>
                        <input 
                            required
                            type="text" 
                            className="w-full h-10 bg-black/20 border-b-2 border-white/30 px-3 text-white placeholder-white/20 focus:border-white focus:bg-black/30 focus:outline-none transition-all rounded-t-sm font-retro text-base md:text-xl"
                            placeholder="IDENTIFIER"
                            value={formData.firstName}
                            onChange={e => setFormData({...formData, firstName: e.target.value})}
                        />
                        </div>

                        <div className="space-y-1 group">
                        <label className="text-white/70 uppercase flex items-center gap-2 font-retro text-xs md:text-sm">
                            <Terminal className="w-3 h-3" /> Agent_Email
                        </label>
                        <input 
                            required
                            type="email" 
                            className="w-full h-10 bg-black/20 border-b-2 border-white/30 px-3 text-white placeholder-white/20 focus:border-white focus:bg-black/30 focus:outline-none transition-all rounded-t-sm font-retro text-base md:text-xl"
                            placeholder="SECURE COMMS"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        </div>

                        <div className="space-y-1 group">
                        <label className="text-white/70 uppercase flex items-center gap-2 font-retro text-xs md:text-sm">
                            <Cpu className="w-3 h-3" /> Sector_Spec
                        </label>
                        <div className="relative">
                            <select 
                            className="w-full h-10 bg-black/20 border-b-2 border-white/30 px-3 text-white focus:border-white focus:bg-black/30 focus:outline-none appearance-none cursor-pointer rounded-t-sm font-retro text-base md:text-xl"
                            value={formData.sector}
                            onChange={e => setFormData({...formData, sector: e.target.value})}
                            >
                            <option value="SECTOR_01" className="bg-snes-dark">SECTOR_01 // GARMENT DROPS</option>
                            <option value="SECTOR_02" className="bg-snes-dark">SECTOR_02 // VISUAL AURA</option>
                            <option value="SECTOR_03" className="bg-snes-dark">SECTOR_03 // SONIC DROPS</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-[10px]">
                            ▼
                            </div>
                        </div>
                        </div>

                        <div className="space-y-1 group">
                        <label className="text-white/70 uppercase flex items-center gap-2 font-retro text-xs md:text-sm">
                            <Globe className="w-3 h-3" /> Region / Country
                        </label>
                        <div className="relative">
                            <select 
                            className="w-full h-10 bg-black/20 border-b-2 border-white/30 px-3 text-white focus:border-white focus:bg-black/30 focus:outline-none appearance-none cursor-pointer rounded-t-sm font-retro text-base md:text-xl"
                            value={formData.country}
                            onChange={e => setFormData({...formData, country: e.target.value})}
                            >
                            {COUNTRIES.map(c => (
                                <option key={c} value={c} className="bg-snes-dark text-white">{c}</option>
                            ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-[10px]">
                            ▼
                            </div>
                        </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-white text-snes-blue font-retro text-base md:text-lg h-10 md:h-12 mt-4 flex items-center justify-center gap-3 hover:bg-snes-light hover:shadow-lg transition-all border-b-4 border-[#002b59] active:border-b-0 active:translate-y-1 rounded shadow-md"
                    >
                        INITIALIZE SYSTEM
                        <div className="w-2 h-2 bg-snes-blue animate-pulse"></div>
                    </button>
                  </>
              )}

              {status === 'AWAITING_CODE' && (
                  <div className="flex flex-col h-full justify-center space-y-6 animate-fade-in">
                      <div className="text-center space-y-2">
                          <h3 className="text-snes-green font-pixel text-xl">UPLINK ESTABLISHED</h3>
                          <p className="text-white/70 text-sm">ENTER THE 6-DIGIT CODE SENT TO:<br/><span className="text-white font-bold">{formData.email}</span></p>
                      </div>

                      <div className="space-y-2">
                          <label className="text-white/70 uppercase flex items-center gap-2 font-retro text-xs md:text-sm justify-center">
                              <Key className="w-3 h-3" /> UPLINK CODE
                          </label>
                          <input 
                              required
                              type="text" 
                              className="w-full h-14 bg-black/40 border-2 border-snes-green px-3 text-snes-green text-center placeholder-white/10 focus:border-white focus:outline-none transition-all rounded font-pixel text-3xl tracking-[0.5em]"
                              placeholder="000000"
                              maxLength={6}
                              value={formData.otp}
                              onChange={e => setFormData({...formData, otp: e.target.value.replace(/\D/g, '')})}
                              autoFocus
                          />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-snes-green text-snes-dark font-retro text-base md:text-lg h-10 md:h-12 mt-4 flex items-center justify-center gap-3 hover:bg-white hover:shadow-lg transition-all border-b-4 border-[#003300] active:border-b-0 active:translate-y-1 rounded shadow-md"
                      >
                        AUTHENTICATE
                        <Lock className="w-4 h-4" />
                      </button>

                      <button 
                        type="button"
                        onClick={() => setStatus('IDLE')}
                        className="text-white/40 hover:text-white text-xs text-center mt-4 underline"
                      >
                        CANCEL / RETRY
                      </button>
                  </div>
              )}
            </form>
          </div>

          {/* Terminal / Scan Layer */}
          <div className={`absolute inset-0 flex flex-col transition-all duration-300 ${(status === 'SCANNING' || status === 'VERIFYING') ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'}`}>
            <div className="flex-1 bg-black/40 p-4 font-retro text-lg text-snes-green overflow-hidden relative">
              <div className="absolute top-2 right-2 opacity-50 font-retro text-xs text-white">SYS_LOG_V2.0</div>
              <div className="h-full overflow-y-auto custom-scrollbar flex flex-col justify-end">
                {logs.map((log, idx) => (
                  <div key={idx} className="mb-1 leading-tight break-all">
                    {log}
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

            {(status === 'BREACH' || status === 'LOCKED_OUT') && (
              <div className="bg-snes-red text-white p-4 font-retro text-center text-sm animate-pulse border-t-2 border-white">
                <div className="flex justify-center mb-2"><AlertTriangle className="w-8 h-8" /></div>
                SECURITY PROTOCOL VIOLATION DETECTED.<br/>
                SYSTEM LOCKDOWN INITIATED.
              </div>
            )}
            
            {(status === 'SCANNING' || status === 'VERIFYING') && (
               <div className="w-full bg-black/20 h-2 overflow-hidden">
                 <div className="h-full bg-snes-green animate-load-progress" style={{ animationDuration: '0.6s' }}></div>
               </div>
            )}
          </div>
        </div>

        {/* Footer with IP Tracking Visual */}
        <div className="mt-4 md:mt-6 flex justify-between items-center text-white/40 font-retro text-xs relative z-10 px-2">
           <div className="flex items-center gap-2">
             <Eye className={`w-3 h-3 ${clientIP !== 'LOADING...' ? 'text-snes-green' : 'animate-pulse'}`} />
             <span>CLIENT_IP: <span className="text-white/60">{clientIP}</span></span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-snes-green rounded-full animate-pulse"></div>
             <span>LOGGING_ACTIVE</span>
           </div>
        </div>
      </div>
    </div>
  );
};