import React from 'react';
import { Bot, Home, Sun, Moon, ShoppingBag, Lock } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onHome: () => void;
  onAssistantToggle: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onLock: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onOpenCart, 
  onHome, 
  onAssistantToggle, 
  isDarkMode, 
  toggleTheme,
  onLock
}) => {
  // #ff6b00 filter
  const logoFilter = isDarkMode ? "brightness(0) saturate(100%) invert(60%) sepia(86%) saturate(4323%) hue-rotate(1deg) brightness(103%) contrast(106%)" : "";

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-snes-light border-b-4 border-snes-white shadow-sm transition-colors duration-300 h-16 md:h-24">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-full flex justify-between items-center">
        {/* Left Links */}
        <div className="flex items-center gap-2 md:gap-4 font-pixel text-xl tracking-widest text-snes-gray-dark">
          
          {/* System Controls Group */}
          <div className="flex items-center gap-1">
            <button 
              onClick={onHome} 
              className="hover:text-snes-purple transition-colors flex items-center gap-2 group active:scale-95 px-2 py-1"
              aria-label="Return to Home"
            >
              <Home className="w-5 h-5 md:w-4 md:h-4 group-hover:text-snes-purple" />
              <span className="hidden md:inline">INDEX</span>
            </button>

            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 md:w-7 md:h-7 rounded-sm hover:bg-snes-white hover:text-snes-purple transition-all border border-transparent hover:border-snes-gray-dark/20 active:translate-y-[1px]"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                  <Sun className="w-5 h-5 md:w-4 md:h-4 text-snes-yellow animate-spin-slow" />
              ) : (
                  <Moon className="w-5 h-5 md:w-4 md:h-4" />
              )}
            </button>
          </div>

          {/* Separator */}
          <div className="w-[2px] h-4 bg-snes-gray-dark/20 hidden md:block"></div>

          <button 
            onClick={onLock}
            className="hidden md:flex hover:text-snes-red transition-colors items-center gap-2 px-2 group"
            title="SYSTEM LOCK"
          >
            <Lock className="w-4 h-4 group-hover:animate-pulse" />
            <span>LOCK</span>
          </button>
        </div>

        {/* Logo - Animated & Seamless */}
        <div 
          onClick={onHome} 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer select-none z-10 group"
          role="button"
          tabIndex={0}
          aria-label="D.P RETRO GEMS Home"
        >
          <div className="relative transition-transform duration-500 ease-out group-hover:scale-110 active:scale-95">
             <div className="animate-float" style={{ animationDuration: '4s' }}>
                <img 
                  src="https://lh3.googleusercontent.com/d/1AvEBxFjiDeHeafONBMZy9l3q-gky_f_r" 
                  alt="D.P RETRO GEMS" 
                  className="h-12 md:h-28 w-auto object-contain drop-shadow-sm transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(92,79,179,0.5)]"
                  style={{ filter: logoFilter }}
                />
                {/* Soft Back Glow on Hover */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-snes-purple/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
             </div>
          </div>
        </div>

        {/* Right Links */}
        <div className="flex gap-2 md:gap-4 font-pixel text-xl items-center text-snes-dark">
          <button 
            onClick={onOpenCart}
            className="relative hover:bg-snes-white border-2 border-transparent hover:border-snes-gray-dark/20 p-2 rounded-sm transition-all group active:translate-y-[1px] mr-0 md:mr-2"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-6 h-6 md:w-5 md:h-5 text-snes-dark group-hover:text-snes-purple transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-snes-red text-white text-[10px] font-pixel h-4 min-w-[16px] px-1 flex items-center justify-center rounded-sm shadow-sm animate-pulse border border-white">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={onAssistantToggle} className="flex items-center gap-2 hover:bg-snes-white border-2 border-snes-gray-dark/20 px-2 md:px-3 py-1 hover:border-snes-purple transition-all bg-snes-bg rounded-sm shadow-retro-sm active:shadow-none active:translate-y-[2px]">
            <Bot className="w-5 h-5 md:w-3 md:h-3 text-snes-purple" />
            <span className="hidden sm:inline">PROTOCOL_AI</span>
          </button>
        </div>
      </div>
    </nav>
  );
};