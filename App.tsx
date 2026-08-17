import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    turnstile: any;
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type AppState = 'idle' | 'sending' | 'otp' | 'verifying' | 'success';

export default function DPGemsLeadCapture() {
  const [step, setStep] = useState<AppState>('idle');
  const [email, setEmail] = useState('');
  
  const [hardwareWeight, setHardwareWeight] = useState('450 GSM Heavyweight (Restricted)');
  const [retrievalEnvironment, setRetrievalEnvironment] = useState('Dystopian London (Film)');
  const [uplinkFrequency, setUplinkFrequency] = useState('Bass-Heavy / Drill');
  
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string>('');

  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => renderTurnstile();
    } else {
      renderTurnstile();
    }

    function renderTurnstile() {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA', // Dummy key fallback for preview
          callback: (token: string) => setCaptchaToken(token),
          theme: 'dark',
          size: 'invisible'
        });
      }
    }
  }, []);

  const handleAuthorize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('ERROR: OPERATIVE EMAIL REQUIRED');
      return;
    }
    if (!captchaToken) {
      setError('ERROR: SECURITY CLEARANCE PENDING. PLEASE WAIT.');
      return;
    }

    setError(null);
    setStep('sending');

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        captchaToken,
        data: {
          hardware_weight: hardwareWeight,
          retrieval_environment: retrievalEnvironment,
          uplink_frequency: uplinkFrequency,
        }
      }
    });

    if (authError) {
      setError(`AUTH_ERR: ${authError.message.toUpperCase()}`);
      setStep('idle');
      if (window.turnstile) window.turnstile.reset();
    } else {
      setStep('otp');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('ERROR: INVALID ACCESS CODE LENGTH');
      return;
    }

    setError(null);
    setStep('verifying');

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (verifyError) {
      setError(`DECRYPT_ERR: ${verifyError.message.toUpperCase()}`);
      setStep('otp');
      return;
    }

    setStep('success');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#5c4fb3] font-mono p-4 md:p-8 flex items-center justify-center selection:bg-[#5c4fb3] selection:text-[#000000]">
      <div className="w-full max-w-2xl border-4 border-[#5c4fb3] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(92,79,179,1)] bg-[#000000]">
        
        <header className="border-b-4 border-[#5c4fb3] pb-4 mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase text-[#5c4fb3]">
              D.P. GEMS <span className="opacity-50">//</span> SECTOR 01
            </h1>
            <p className="text-xs md:text-sm tracking-widest mt-2 uppercase font-bold">
              System Initialization Form
            </p>
          </div>
          <div className="text-[10px] sm:text-xs animate-pulse bg-[#5c4fb3] text-[#000000] px-2 py-1 font-bold tracking-widest self-start sm:self-auto uppercase">
            STATUS: {step === 'idle' ? 'AWAITING_INPUT' : step}
          </div>
        </header>

        {error && (
          <div className="border-l-4 border-red-600 bg-red-950/30 text-red-500 p-4 mb-8 uppercase text-xs md:text-sm font-bold tracking-widest">
            &gt; [SYSTEM_FAULT]: {error}
          </div>
        )}

        {(step === 'idle' || step === 'sending') && (
          <form onSubmit={handleAuthorize} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-xs md:text-sm font-bold tracking-widest uppercase">
                &gt; OPERATIVE EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step === 'sending'}
                className="w-full bg-[#000000] border-2 border-[#5c4fb3] p-4 text-[#5c4fb3] placeholder-[#5c4fb3]/40 outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition-colors disabled:opacity-50 text-sm tracking-widest"
                placeholder="ENTER_OPERATIVE_EMAIL"
              />
            </div>

            <div className="space-y-6 border-t border-[#5c4fb3]/30 pt-6">
              <div className="space-y-3">
                <label className="block text-xs md:text-sm font-bold tracking-widest uppercase">
                  &gt; Select your Hardware Weight for Field Operations:
                </label>
                <select
                  value={hardwareWeight}
                  onChange={(e) => setHardwareWeight(e.target.value)}
                  disabled={step === 'sending'}
                  className="w-full bg-[#000000] border-2 border-[#5c4fb3] p-4 text-[#5c4fb3] outline-none focus:border-[#4ade80] appearance-none disabled:opacity-50 text-sm tracking-widest cursor-pointer"
                >
                  <option value="450 GSM Heavyweight (Restricted)">450 GSM Heavyweight (Restricted)</option>
                  <option value="280 GSM Standard (Archive)">280 GSM Standard (Archive)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-xs md:text-sm font-bold tracking-widest uppercase">
                  &gt; Identify your preferred Retrieval Environment:
                </label>
                <select
                  value={retrievalEnvironment}
                  onChange={(e) => setRetrievalEnvironment(e.target.value)}
                  disabled={step === 'sending'}
                  className="w-full bg-[#000000] border-2 border-[#5c4fb3] p-4 text-[#5c4fb3] outline-none focus:border-[#4ade80] appearance-none disabled:opacity-50 text-sm tracking-widest cursor-pointer"
                >
                  <option value="Dystopian London (Film)">Dystopian London (Film)</option>
                  <option value="Neo-Glitch (AMV)">Neo-Glitch (AMV)</option>
                  <option value="Archive 1994 (Retro)">Archive 1994 (Retro)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-xs md:text-sm font-bold tracking-widest uppercase">
                  &gt; Authorize your Uplink Frequency (Sound Spec):
                </label>
                <select
                  value={uplinkFrequency}
                  onChange={(e) => setUplinkFrequency(e.target.value)}
                  disabled={step === 'sending'}
                  className="w-full bg-[#000000] border-2 border-[#5c4fb3] p-4 text-[#5c4fb3] outline-none focus:border-[#4ade80] appearance-none disabled:opacity-50 text-sm tracking-widest cursor-pointer"
                >
                  <option value="Bass-Heavy / Drill">Bass-Heavy / Drill</option>
                  <option value="ASMR / Mechanical">ASMR / Mechanical</option>
                  <option value="Lo-Fi / Static Hum">Lo-Fi / Static Hum</option>
                </select>
              </div>
            </div>

            <div ref={turnstileRef} className="hidden"></div>

            <button
              type="submit"
              disabled={step === 'sending'}
              className="w-full border-4 border-[#5c4fb3] bg-[#000000] hover:bg-[#5c4fb3] text-[#5c4fb3] hover:text-[#000000] p-5 font-black tracking-[0.2em] uppercase transition-all disabled:opacity-50 disabled:hover:bg-[#000000] disabled:hover:text-[#5c4fb3] flex justify-center items-center gap-3 active:translate-y-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(92,79,179,1)] hover:shadow-[4px_4px_0px_0px_rgba(74,222,128,1)] hover:border-[#4ade80]"
            >
              {step === 'sending' ? (
                <>
                  <span className="animate-spin inline-block font-normal">X</span> NEGOTIATING HANDSHAKE
                </>
              ) : (
                'AUTHORIZE UPLINK'
              )}
            </button>
          </form>
        )}

        {(step === 'otp' || step === 'verifying') && (
          <form onSubmit={handleVerify} className="space-y-8 py-4">
            <div className="p-4 border-l-4 border-[#4ade80] bg-[#4ade80]/10 mb-8">
              <p className="animate-pulse tracking-widest text-[#4ade80] font-bold text-sm md:text-base uppercase">
                &gt; TRANSMISSION SENT. ENTER 6-DIGIT ACCESS CODE.
              </p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                disabled={step === 'verifying'}
                className="w-full bg-[#000000] border-2 border-[#5c4fb3] p-6 text-[#4ade80] text-center text-4xl tracking-[1em] outline-none focus:border-[#4ade80] transition-colors disabled:opacity-50 font-black placeholder-[#5c4fb3]/20"
                placeholder="------"
              />
            </div>

            <button
              type="submit"
              disabled={step === 'verifying' || otp.length !== 6}
              className="w-full border-4 border-[#5c4fb3] bg-[#000000] hover:bg-[#4ade80] text-[#5c4fb3] hover:text-[#000000] hover:border-[#4ade80] p-5 font-black tracking-[0.2em] uppercase transition-all disabled:opacity-50 disabled:hover:bg-[#000000] disabled:hover:text-[#5c4fb3] disabled:hover:border-[#5c4fb3] flex justify-center items-center gap-3 shadow-[4px_4px_0px_0px_rgba(92,79,179,1)]"
            >
              {step === 'verifying' ? (
                <>
                  <span className="animate-spin inline-block font-normal">\\</span> DECRYPTING PAYLOAD
                </>
              ) : (
                'VERIFY TRANSMISSION'
              )}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-8 py-16">
            <div className="inline-block px-8 py-4 border-4 border-[#4ade80] bg-[#4ade80] text-[#000000] font-black text-2xl md:text-4xl tracking-widest animate-pulse shadow-[8px_8px_0px_0px_rgba(92,79,179,1)]">
              ACCESS GRANTED
            </div>
            <div className="space-y-3 text-sm md:text-base opacity-90 font-bold tracking-widest text-[#4ade80] text-left inline-block">
              <p>&gt; IDENTITY: VERIFIED</p>
              <p>&gt; SECURE_TOKEN: ACQUIRED</p>
              <p className="pt-4 text-[#5c4fb3]">&gt; WELCOME TO THE ARCHIVE, OPERATOR.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
