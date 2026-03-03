import React from 'react';
import { HardDrive, Cpu, Radio } from 'lucide-react';

interface TransitionProps {
  productName: string;
}

export const Transition: React.FC<TransitionProps> = ({ productName }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-snes-bg flex flex-col items-center justify-center overflow-hidden font-retro text-snes-dark">
      {/* SNES Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(transparent 95%, #5c4fb3 95%), linear-gradient(90deg, transparent 95%, #5c4fb3 95%)',
             backgroundSize: '40px 40px',
           }}>
          <div className="absolute inset-0 animate-grid-move" 
               style={{ 
                 backgroundImage: 'inherit', 
                 backgroundSize: 'inherit' 
               }}>
          </div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 text-snes-purple font-pixel text-[8px] animate-pulse">
        MEM_OK: 64MB<br/>
        VRAM: 4MB
      </div>
      <div className="absolute top-8 right-8 text-snes-dark font-pixel text-[8px] text-right">
        SECURE_CONNECTION<br/>
        <span className="text-snes-green animate-blink">ACTIVE</span>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-8 left-8 hidden md:block opacity-50">
          <Radio className="w-8 h-8 text-snes-gray-dark animate-bounce-slow" />
      </div>

      <div className="relative z-10 text-center space-y-12 w-full max-w-4xl px-4">
        {/* Loading Header */}
        <div className="flex items-center justify-center gap-2 text-snes-gray-dark font-pixel text-[10px] tracking-widest uppercase mb-4">
           <HardDrive className="w-4 h-4" />
           READING_DISK...
        </div>

        {/* Product Name */}
        <div className="relative inline-block mx-4">
            <h1 className="text-2xl md:text-5xl lg:text-6xl font-pixel text-snes-purple uppercase leading-tight animate-glitch-text border-y-4 border-snes-dark py-8 px-6 md:px-12 bg-white shadow-retro transform rotate-1">
            {productName}
            </h1>
            {/* Decorative 'tape' or badge */}
            <div className="absolute -top-3 -right-3 bg-snes-red text-white font-pixel text-[8px] px-2 py-1 rotate-3 shadow-sm z-20">
                LOADING
            </div>
        </div>

        {/* Loading Mechanics */}
        <div className="w-full max-w-md mx-auto">
           <div className="flex justify-between text-snes-dark font-pixel text-[10px] mb-2 uppercase tracking-wider">
              <span className="animate-pulse">DECODING_ASSETS</span>
              <Cpu className="w-4 h-4 animate-spin text-snes-purple" />
           </div>
           
           {/* Retro Progress Bar */}
           <div className="w-full h-8 border-4 border-snes-dark p-1 bg-white shadow-retro-sm">
             <div className="h-full bg-snes-blue animate-load-progress relative overflow-hidden">
                {/* Striped pattern inside bar */}
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
             </div>
           </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="absolute bottom-12 text-center text-snes-gray-dark font-retro text-lg">
         // SYSTEM_WARNING: HIGH_FIDELITY_RENDERING
      </div>

      {/* Scanline Overlay (Lighter for light theme) */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_4px,3px_100%] opacity-50"></div>
    </div>
  );
};