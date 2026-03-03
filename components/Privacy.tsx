import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyProps {
  onBack: () => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 pt-24 animate-fade-in">
      <button 
        onClick={onBack} 
        className="mb-8 hover:text-white flex items-center gap-2 font-pixel text-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        RETURN TO GATE
      </button>
      
      <div className="max-w-2xl mx-auto border border-green-900 p-8 bg-black/50 backdrop-blur">
        <h1 className="text-3xl font-pixel mb-6 border-b border-green-500 pb-2 text-white">PRIVACY PROTOCOL // SECTOR_01</h1>
        
        <div className="space-y-6 text-sm md:text-base opacity-90 font-retro leading-relaxed">
          <p className="text-xs opacity-50">SYSTEM_TIMESTAMP: {new Date().toLocaleDateString()}</p>
          
          <div className="space-y-2">
             <h2 className="text-white text-xl font-pixel">1. DATA_COLLECTION_NODE</h2>
             <p>We collect identity data (Agent ID, Email) and technical data (IP Address, Device Heuristics) solely for the purpose of Sector 01 authorization and garment order fulfillment.</p>
          </div>
          
          <div className="space-y-2">
             <h2 className="text-white text-xl font-pixel">2. USAGE_PARAMETERS</h2>
             <p>Your data is used to secure the Gate and deliver mission briefings (marketing). We do not sell data to third-party factions. Your privacy is paramount to the resistance.</p>
          </div>
          
          <div className="space-y-2">
             <h2 className="text-white text-xl font-pixel">3. ENCRYPTION_STANDARD</h2>
             <p>We utilize Supabase and Klaviyo enterprise-grade encryption standards to protect your credentials. All transmission is secured via SSL/TLS.</p>
          </div>
          
          <p className="mt-8 pt-4 border-t border-green-900 text-xs flex justify-between items-center">
            <span>CONTACT: SUPPORT@DPGEMS.COM</span>
            <span className="animate-pulse text-green-400">STATUS: SECURE</span>
          </p>
        </div>
      </div>
    </div>
  );
};
