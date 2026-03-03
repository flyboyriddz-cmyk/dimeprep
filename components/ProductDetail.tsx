import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Product, ProductVariant } from '../types';
import { ArrowLeft, ShieldCheck, Zap, X, ChevronLeft, ChevronRight, Maximize2, Sparkles, Gem, Terminal, HardDrive, Check, Lock, Fingerprint, ScanLine, Ruler } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, size?: string) => void;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  // Default to first variant if available
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants ? product.variants[0] : undefined
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  
  // Decryption (Hold-to-View) State
  const [isDecrypted, setIsDecrypted] = useState(false);

  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Dynamic properties based on variant or base product
  const activeImage = selectedVariant ? selectedVariant.image : product.image;
  const activeImages = selectedVariant ? selectedVariant.images : product.images;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Normalize images array and Append NFT as Finale
  const productImages = activeImages && activeImages.length > 0 
    ? [...activeImages]
    : [activeImage];

  if (product.nftImage) {
    productImages.push(product.nftImage);
  }

  // Ensure page starts at top when entering detail view
  // Using useLayoutEffect to ensure it runs before paint
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset index if out of bounds when switching variants
  useEffect(() => {
    if (currentImageIndex >= productImages.length) {
        setCurrentImageIndex(0);
    }
  }, [selectedVariant, productImages.length]);

  // Check if current image is the NFT image
  const isNftView = product.nftImage && productImages[currentImageIndex] === product.nftImage;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection('right');
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSlideDirection('left');
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNextImage();
    if (isRightSwipe) handlePrevImage();

    setTouchStart(null);
    setTouchEnd(null);
  };

  const toggleLightbox = () => {
    setIsLightboxOpen(!isLightboxOpen);
  };

  return (
    <div className="animate-fade-in pb-20">
      {/* Navigation Header */}
      <div className="sticky top-16 md:top-24 z-30 bg-snes-bg/95 backdrop-blur-sm border-b-4 border-snes-dark px-4 py-4 flex items-center justify-between shadow-sm">
         <button 
           onClick={onBack}
           className="bg-snes-white border-2 border-snes-dark hover:bg-snes-purple hover:text-white px-4 py-2 font-pixel text-lg md:text-xl flex items-center gap-2 shadow-retro-sm transition-transform active:scale-95"
         >
           <ArrowLeft className="w-5 h-5" /> BACK
         </button>
         <div className="hidden md:flex items-center gap-2 font-pixel text-snes-gray-dark uppercase tracking-widest">
            <Terminal className="w-4 h-4" />
            <span>SECURE_CONNECTION: {product.id}</span>
         </div>
      </div>

      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 md:p-8">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div 
            className="relative aspect-square bg-white border-4 border-snes-dark shadow-retro group overflow-hidden cursor-zoom-in select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={toggleLightbox}
          >
            {/* Technical Corner UI (Sector 01 Style) */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-snes-green z-20 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-snes-green z-20 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-snes-green z-20 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-snes-green z-20 transition-all duration-300 group-hover:w-8 group-hover:h-8"></div>

            {/* "TAP TO EXPAND" Badge - Centered & Animated */}
            {!isDecrypted && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-90 group-hover:scale-100">
                <div className="bg-snes-dark/90 text-snes-green border border-snes-green px-4 py-2 font-pixel text-xl tracking-widest flex items-center gap-3 shadow-[0_0_15px_rgba(0,143,64,0.4)] backdrop-blur-sm">
                  <Maximize2 className="w-5 h-5 animate-pulse" />
                  <span>TAP_TO_EXPAND</span>
                </div>
              </div>
            )}

            {/* Main Image Render */}
            <div className="w-full h-full relative">
               {isNftView && !isDecrypted ? (
                 <div 
                    className="absolute inset-0 bg-black flex flex-col items-center justify-center text-center p-8 z-20 cursor-default"
                    onClick={(e) => e.stopPropagation()} // Prevent expand on locked view
                 >
                    <Lock className="w-16 h-16 text-snes-red mb-4 animate-bounce" />
                    <h3 className="font-pixel text-3xl text-snes-red mb-2">ENCRYPTED ASSET</h3>
                    <p className="font-retro text-xl text-white mb-6">HOLD TO DECRYPT VISUALS</p>
                    <button 
                      onMouseDown={() => setIsDecrypted(true)}
                      onMouseUp={() => setIsDecrypted(false)}
                      onMouseLeave={() => setIsDecrypted(false)}
                      onTouchStart={() => setIsDecrypted(true)}
                      onTouchEnd={() => setIsDecrypted(false)}
                      className="bg-snes-dark border-2 border-snes-green text-snes-green px-6 py-3 font-pixel text-xl hover:bg-snes-green hover:text-black transition-colors flex items-center gap-2 select-none active:scale-95 transform"
                    >
                      <Fingerprint className="w-6 h-6" /> REVEAL
                    </button>
                 </div>
               ) : null}

               {/* Conditional Render: 8-Bit NFT vs Standard Product */}
               {isNftView ? (
                 <div className="w-full h-full relative overflow-hidden bg-black">
                    <div className="w-[25%] h-[25%] scale-[400%] origin-top-left transition-transform duration-500">
                        <img 
                            src={productImages[currentImageIndex]} 
                            alt={product.name} 
                            decoding="async"
                            className="w-full h-full object-cover image-pixelated contrast-125 saturate-150"
                        />
                    </div>
                 </div>
               ) : (
                 <img 
                   src={productImages[currentImageIndex]} 
                   alt={product.name} 
                   decoding="async"
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                 />
               )}
               
               {/* CRT Scanline Overlay */}
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] opacity-20"></div>

               {/* Nav Arrows - Stop Propagation to prevent expand */}
               <button 
                 onClick={handlePrevImage}
                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-snes-white/80 border-2 border-snes-dark p-2 hover:bg-snes-purple hover:text-white transition-colors z-20 shadow-md active:scale-95"
               >
                 <ChevronLeft className="w-6 h-6" />
               </button>
               <button 
                 onClick={handleNextImage}
                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-snes-white/80 border-2 border-snes-dark p-2 hover:bg-snes-purple hover:text-white transition-colors z-20 shadow-md active:scale-95"
               >
                 <ChevronRight className="w-6 h-6" />
               </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-16 h-16 md:w-24 md:h-24 shrink-0 border-2 transition-all relative overflow-hidden group ${currentImageIndex === idx ? 'border-snes-purple scale-105 shadow-md' : 'border-snes-dark/20 opacity-60 hover:opacity-100'}`}
              >
                <img 
                    src={img} 
                    alt={`View ${idx}`} 
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover ${product.nftImage && img === product.nftImage ? 'image-pixelated contrast-125' : ''}`} 
                />
                {product.nftImage && img === product.nftImage && (
                    <div className="absolute inset-0 bg-yellow-400/20 mix-blend-overlay"></div>
                )}
                {/* Active Indicator */}
                {currentImageIndex === idx && (
                    <div className="absolute inset-0 border-[3px] border-snes-purple pointer-events-none"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="flex flex-col gap-6 md:gap-8">
           
           {/* Header Info */}
           <div className="border-b-4 border-dashed border-snes-dark/30 pb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                 <h1 className="font-pixel text-3xl sm:text-4xl md:text-6xl text-snes-dark leading-none tracking-tight break-words">
                   {product.name}
                 </h1>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                 <span className="font-pixel text-2xl md:text-5xl bg-snes-yellow text-snes-dark px-4 py-1 border-4 border-snes-dark shadow-retro-sm transform -rotate-1 inline-block">
                   ${product.price}
                 </span>
                 {activeStock < 5 && (
                   <span className="font-retro text-lg md:text-2xl text-snes-red animate-pulse flex items-center gap-2 font-bold">
                     <Zap className="w-5 h-5 md:w-6 md:h-6 fill-current" /> LOW_STOCK ({activeStock})
                   </span>
                 )}
              </div>
           </div>

           {/* DESCRIPTION - Updated for Readability */}
           <div className="space-y-2 md:space-y-4">
              <h2 className="font-pixel text-xl md:text-2xl text-snes-purple uppercase tracking-widest border-l-4 border-snes-purple pl-3">
                Asset Description
              </h2>
              <p className="font-retro text-xl md:text-3xl leading-relaxed md:leading-loose text-black tracking-wide bg-white/50 p-4 border border-snes-dark/10 rounded-sm">
                {product.description}
              </p>
           </div>

           {/* DETAILS - Updated for Readability */}
           <div className="space-y-2 md:space-y-4">
              <h2 className="font-pixel text-xl md:text-2xl text-snes-purple uppercase tracking-widest border-l-4 border-snes-purple pl-3">
                 Specifications
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.details.map((detail, i) => (
                  <li key={i} className="bg-white border-2 border-snes-dark p-3 flex items-center gap-3 shadow-sm group hover:shadow-md transition-all">
                    <div className="bg-snes-light p-1 rounded-sm border border-snes-dark group-hover:bg-snes-purple group-hover:text-white transition-colors">
                      <Check className="w-5 h-5 text-snes-dark group-hover:text-white" />
                    </div>
                    <span className="font-retro text-lg md:text-2xl font-bold text-[#2c2c36] uppercase tracking-wide">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
           </div>

           {/* Variants Selection */}
           {product.variants && (
             <div className="space-y-2 md:space-y-4 bg-snes-light border-2 border-snes-dark p-4 md:p-6 shadow-sm">
                <h3 className="font-pixel text-lg md:text-xl uppercase text-snes-gray-dark tracking-widest mb-2">Select Variant</h3>
                <div className="flex flex-wrap gap-4">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`relative px-3 py-2 md:px-4 md:py-3 border-4 transition-all flex items-center gap-3 min-w-[120px] md:min-w-[140px] ${
                        selectedVariant?.id === variant.id 
                          ? 'border-snes-purple bg-white shadow-retro-sm scale-105' 
                          : 'border-snes-dark/30 bg-snes-bg hover:border-snes-dark'
                      }`}
                    >
                      <div 
                        className="w-6 h-6 md:w-8 md:h-8 border-2 border-black shadow-sm"
                        style={{ backgroundColor: variant.colorHex }}
                      />
                      <div className="text-left">
                         <span className="block font-pixel text-lg md:text-xl leading-none text-snes-dark">{variant.name}</span>
                         <span className="block font-retro text-xs md:text-sm text-snes-gray-dark">QTY: {variant.stock}</span>
                      </div>
                    </button>
                  ))}
                </div>
             </div>
           )}

            {/* Size Selection - NEW */}
            <div className="space-y-2 md:space-y-4 bg-snes-light border-2 border-snes-dark p-4 md:p-6 shadow-sm">
               <h3 className="font-pixel text-lg md:text-xl uppercase text-snes-gray-dark tracking-widest mb-2 flex items-center gap-2">
                   <Ruler className="w-5 h-5" /> Select Size_Spec
               </h3>
               <div className="flex flex-wrap gap-2">
                 {SIZES.map((size) => (
                   <button
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center font-pixel text-lg md:text-xl border-4 transition-all duration-200 touch-manipulation ${
                        selectedSize === size
                         ? 'bg-snes-purple text-white border-snes-dark shadow-[2px_2px_0px_#000] -translate-y-1'
                         : 'bg-white text-snes-dark border-snes-dark/30 hover:border-snes-dark hover:bg-gray-100'
                     }`}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>

           {/* Add to Cart Action */}
           <div className="pt-4">
             <button
               onClick={() => {
                   if (selectedSize) {
                       onAddToCart(product, selectedVariant, selectedSize);
                   }
               }}
               disabled={activeStock === 0 || !selectedSize}
               className={`w-full py-4 md:py-6 font-pixel text-2xl md:text-4xl uppercase tracking-widest border-b-8 active:border-b-0 active:translate-y-2 active:mt-2 transition-all shadow-xl flex items-center justify-center gap-4 touch-manipulation ${
                 activeStock === 0 
                  ? 'bg-gray-400 border-gray-600 cursor-not-allowed opacity-50' 
                  : !selectedSize
                  ? 'bg-snes-gray-dark text-white border-black cursor-not-allowed'
                  : 'bg-snes-blue text-white border-[#003366] hover:bg-snes-purple hover:border-[#3e3482]'
               }`}
             >
                {activeStock === 0 ? (
                  'OUT_OF_STOCK'
                ) : !selectedSize ? (
                  <>
                    <span>SELECT_SIZE_SPEC</span>
                    <Ruler className="w-6 h-6 md:w-8 md:h-8 opacity-50" />
                  </>
                ) : (
                  <>
                    <span>ADD TO CART</span>
                    <HardDrive className="w-6 h-6 md:w-8 md:h-8 md:w-10 md:h-10 animate-pulse" />
                  </>
                )}
             </button>
             <div className="mt-4 text-center">
                <p className="font-retro text-xs md:text-sm text-snes-gray-dark flex items-center justify-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-snes-green" />
                   AUTHENTICITY GUARANTEED BY GEMINI PROTOCOL
                </p>
             </div>
           </div>

        </div>
      </div>

      {/* Lightbox Modal (Asset Viewer) */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-fade-in"
          onClick={toggleLightbox}
        >
          {/* Lightbox Tech Borders */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-white/20 pointer-events-none"></div>
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-white/20 pointer-events-none"></div>

          <button className="absolute top-4 right-4 text-white hover:text-snes-red p-2 z-50 transition-colors">
            <X className="w-10 h-10" />
          </button>
          
          <img 
            src={productImages[currentImageIndex]} 
            alt="Fullscreen View" 
            className={`max-w-full max-h-full object-contain drop-shadow-2xl ${isNftView ? 'image-pixelated contrast-125 saturate-150' : ''}`}
          />

          <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none flex flex-col items-center gap-2">
             <span className="bg-black/50 text-white px-6 py-2 font-pixel text-xl rounded-full border border-white/20 backdrop-blur-md">
               VIEWING_ASSET: {currentImageIndex + 1} / {productImages.length}
             </span>
             {isNftView && (
                <span className="text-snes-yellow font-pixel text-sm animate-pulse tracking-widest">
                  [8-BIT_VISUALIZER_ACTIVE]
                </span>
             )}
          </div>
        </div>
      )}
    </div>
  );
};