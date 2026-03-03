import React, { useState } from 'react';
import { Product } from '../types';
import { Zap, Shield, Activity, AlertTriangle, Plus, Eye, Sparkles, Gem, Layers, ShoppingBag, Scan } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart }) => {
  const isLowStock = product.stock < 5;
  const isLegendary = product.rarity === 'LEGENDARY';
  const isRare = product.rarity === 'RARE';
  const hasVariants = product.variants && product.variants.length > 0;
  
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
    <style>{`
      @keyframes holo-sheen {
        0% { background-position: 150% 0; transform: skewX(-20deg); }
        100% { background-position: -50% 0; transform: skewX(-20deg); }
      }
      .holo-effect {
        background: linear-gradient(
          105deg,
          transparent 20%,
          rgba(0, 255, 255, 0.2) 35%,       /* Cyan Shine */
          rgba(255, 0, 255, 0.2) 40%,       /* Magenta Shine */
          rgba(255, 255, 255, 0.5) 45%,     /* White Hotspot */
          rgba(255, 220, 0, 0.2) 50%,       /* Yellow Shine */
          rgba(0, 255, 255, 0.1) 55%,       /* Trailing Cyan */
          transparent 70%
        );
        background-size: 200% 100%;
        mix-blend-mode: color-dodge;
      }
    `}</style>
    <div 
      className="group relative bg-snes-white border-4 border-snes-dark hover:border-snes-purple focus-within:border-snes-purple transition-all duration-200 w-full h-full overflow-hidden shadow-retro hover:shadow-retro-active hover:-translate-y-1 focus-within:shadow-retro-active focus-within:-translate-y-1 focus-within:scale-[1.01] rounded-sm flex flex-col" 
    >
      {/* Main Link Overlay */}
      <button 
        className="absolute inset-0 w-full h-full z-10 cursor-pointer focus:outline-none"
        onClick={() => onClick(product)}
        aria-label={`View details for ${product.name}, Price: $${product.price}`}
      />

      {/* Card Header - Enhanced Visibility & Size */}
      <div className="flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 border-b-4 border-snes-dark bg-snes-light relative z-20 shrink-0">
        <span className="font-pixel text-lg sm:text-2xl text-snes-gray-dark uppercase tracking-wide bg-snes-white px-2 sm:px-3 py-1 border-2 border-gray-400 rounded-sm leading-none">{product.category}</span>
        <div className="flex items-center gap-2">
          {isLowStock && (
            <div className="flex items-center gap-1 font-pixel text-xs sm:text-sm text-white bg-snes-red px-1 sm:px-2 py-1 rounded shadow-[0_0_5px_rgba(211,47,47,0.8)] animate-pulse border border-white/20">
               <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 fill-current" aria-hidden="true" />
               <span className="font-bold tracking-wide hidden xs:inline">LOW</span>
            </div>
          )}
          <span className={`font-retro text-xl sm:text-2xl font-bold ${isLowStock ? 'text-snes-red' : 'text-snes-purple'}`}>
            QT:{product.stock}
          </span>
        </div>
      </div>

      {/* Image Container - Reduced Height Aspect Ratio (4/3) - Centered */}
      <div className="aspect-[4/3] relative bg-gray-100 border-b-4 border-snes-dark z-0 shrink-0 p-0 transition-colors duration-300 group-hover:bg-[#e8e8e8]">
           
           {/* 1. 8-Bit Grid Pattern */}
           <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
                style={{ 
                    backgroundImage: `
                      linear-gradient(to right, #000 1px, transparent 1px),
                      linear-gradient(to bottom, #000 1px, transparent 1px)
                    `,
                    backgroundSize: '8px 8px' 
                }}>
           </div>
           
           {/* 2. Inner "Chip" Container - Full bleed */}
           <div className="relative w-full h-full bg-white overflow-hidden z-10 transition-colors">
               <img 
                src={product.image} 
                alt={product.name} 
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover object-center filter contrast-[1.05] group-hover:scale-105 transition-all duration-300 ease-in-out ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
              />

              {/* Holographic Glare Overlay - Activates on Hover */}
              <div 
                 className="absolute inset-0 holo-effect opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                 style={{ 
                   animation: 'holo-sheen 2.5s infinite linear',
                   animationPlayState: 'paused'
                 }}
              ></div>
              
              {/* Force play state on hover via inline style helper or utility class if needed, 
                  but CSS hover is cleaner. Adding a style override for the group hover effect on the animation. */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                 <style>{`.group:hover .holo-effect { animation-play-state: running !important; opacity: 1; }`}</style>
              </div>

              {/* Base Specular Highlight */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay z-20"></div>
              
              {/* 3. Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 z-30"></div>
           </div>

        
        {/* Quick Add Button - Larger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 z-30 bg-snes-white hover:bg-snes-purple hover:text-white text-snes-dark border-4 border-snes-dark p-2 sm:p-3 shadow-sm rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-snes-purple/50 active:scale-95 touch-manipulation"
          aria-label={`Quick add ${product.name} to cart`}
        >
          <Plus className="w-6 h-6 sm:w-8 sm:h-8" aria-hidden="true" />
        </button>

        {/* Variants - Compact */}
        {hasVariants && (
           <div className="absolute bottom-2 right-2 z-30 flex gap-1">
             {product.variants?.slice(0, 3).map((v, i) => (
                <div key={i} className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black shadow-sm" style={{ backgroundColor: v.colorHex }}></div>
             ))}
             <div className="bg-snes-dark text-white px-1 font-pixel text-[8px] sm:text-[10px] border border-white flex items-center">
               <Layers className="w-3 h-3" />
             </div>
           </div>
        )}

        {/* View Label */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-30">
          <div className="font-pixel text-xs sm:text-sm text-white bg-snes-purple px-2 sm:px-3 py-1 border-2 border-white shadow-retro-sm flex items-center gap-2 whitespace-nowrap">
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            VIEW_ASSET
          </div>
        </div>
      </div>

      {/* Card Body / Stats - Increased Text Sizes */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 bg-snes-white relative z-0 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2">
          {/* Bigger Title with Responsive Scaling */}
          <h3 className="flex items-center gap-2 font-pixel text-3xl sm:text-4xl text-snes-dark leading-none pr-1 group-hover:text-snes-purple group-focus-within:text-snes-purple transition-colors mt-1">
            <span className="truncate">{product.name}</span>
            {(product.rarity || product.nftImage) && (
              <span className={`shrink-0 inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 border-2 text-[10px] sm:text-xs align-middle tracking-wider shadow-sm rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                isLegendary ? 'bg-purple-600 text-white border-purple-300 group-hover:animate-pulse' : 
                isRare ? 'bg-yellow-500 text-black border-yellow-200' : 
                'bg-gray-700 text-white border-gray-500'
              }`}>
                <Gem className="w-2 h-2 sm:w-3 sm:h-3" strokeWidth={2.5} />
                {product.rarity || 'NFT'}
              </span>
            )}
          </h3>
          
          <div className="flex flex-col items-end gap-1">
             {/* Price Tag - Bigger */}
             <div className="flex-shrink-0 font-pixel text-2xl sm:text-3xl font-bold text-snes-dark bg-snes-yellow px-2 sm:px-3 py-1 border-2 border-snes-dark shadow-[2px_2px_0px_rgba(0,0,0,0.2)] sm:shadow-[3px_3px_0px_rgba(0,0,0,0.2)]">
               ${product.price}
             </div>
          </div>
        </div>

        {/* Technical Specs - Bigger */}
        <div className="grid grid-cols-3 gap-1 py-2 border-t-2 border-dashed border-gray-300 shrink-0 bg-snes-light/30">
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-pixel text-snes-gray-dark uppercase">MAT</span>
            <span className="text-base sm:text-lg font-retro text-snes-dark font-bold">A+</span>
          </div>
          <div className="flex flex-col items-center border-l-2 border-gray-200">
            <span className="text-[10px] sm:text-xs font-pixel text-snes-gray-dark uppercase">WGT</span>
            <span className="text-base sm:text-lg font-retro text-snes-dark font-bold">HVY</span>
          </div>
          <div className="flex flex-col items-center border-l-2 border-gray-200">
            <span className="text-[10px] sm:text-xs font-pixel text-snes-gray-dark uppercase">GRD</span>
            <span className="text-base sm:text-lg font-retro text-snes-dark font-bold">MIL</span>
          </div>
        </div>

        <div className="font-retro text-lg sm:text-xl leading-tight text-snes-gray-dark line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {product.description}
        </div>

        <div className="pt-2 mt-auto">
          <button 
            className="w-full bg-snes-light hover:bg-snes-dark hover:text-white border-4 border-snes-dark text-snes-dark font-pixel text-xl sm:text-2xl py-2 flex items-center justify-center gap-2 sm:gap-3 transition-all group-hover:shadow-retro-sm touch-manipulation"
            onClick={(e) => {
               e.stopPropagation();
               onClick(product);
            }}
          >
             <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
             INSPECT_GEAR
          </button>
        </div>
      </div>
    </div>
    </>
  );
};
