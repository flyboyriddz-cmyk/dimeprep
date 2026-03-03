import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Loader2, ArrowRight, Heart, RefreshCw, Ruler } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  savedItems: CartItem[];
  onRemove: (id: string) => void;
  onSaveForLater: (id: string) => void;
  onMoveToCart: (id: string) => void;
  onRemoveFromSaved: (id: string) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ 
    isOpen, 
    onClose, 
    items, 
    savedItems, 
    onRemove, 
    onSaveForLater, 
    onMoveToCart, 
    onRemoveFromSaved, 
    onCheckout 
}) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Loading states
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Helper to generate unique ID for cart operations
  const getCartUniqueId = (item: CartItem): string => {
    return `${item.selectedVariant ? item.selectedVariant.id : item.id}-${item.size || 'NOSIZE'}`;
  };

  const handleAction = (id: string, action: (id: string) => void) => {
    if (processingId || isCheckingOut) return;
    setProcessingId(id);
    // Delay for visual feedback
    setTimeout(() => {
      action(id);
      setProcessingId(null);
    }, 600);
  };

  const handleCheckout = () => {
    if (isCheckingOut || items.length === 0) return;
    setIsCheckingOut(true);
    // Simulate checkout initialization
    setTimeout(() => {
      onCheckout();
      setIsCheckingOut(false);
    }, 1000);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-snes-light z-[51] border-l-4 border-snes-white shadow-[-10px_0_0_rgba(0,0,0,0.1)] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.725,0.25,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col font-retro text-xl`}
        aria-hidden={!isOpen}
      >
        
        {/* Header */}
        <div className="p-6 border-b-4 border-snes-white bg-snes-purple text-white flex justify-between items-center shadow-sm shrink-0">
          <h2 className="font-retro text-lg tracking-widest uppercase flex items-center gap-2">
            CART_MANIFEST <span className="bg-black/20 px-2 rounded text-sm">//{items.length.toString().padStart(2, '0')}</span>
          </h2>
          <button onClick={onClose} className="hover:text-snes-yellow transition-colors bg-black/20 p-1 rounded hover:bg-black/40">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-snes-bg custom-scrollbar relative">
          
          {/* Active Items */}
          <div className="space-y-4">
            {items.length === 0 && savedItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-snes-gray-dark opacity-60 py-12">
                    <div className="w-12 h-12 border-4 border-snes-gray-dark mb-4 rounded-sm flex items-center justify-center">
                        <X className="w-8 h-8" />
                    </div>
                    <p className="font-pixel text-xl tracking-wider">NO_DATA_DETECTED</p>
                </div>
            ) : (
                items.map(item => {
                    const displayImage = item.selectedVariant ? item.selectedVariant.image : item.image;
                    const itemId = getCartUniqueId(item);
                    const isProcessing = processingId === itemId;
                    
                    return (
                    <div 
                        key={itemId} 
                        className={`flex gap-4 fade-in group border-2 border-snes-white p-3 bg-snes-white shadow-sm rounded relative overflow-hidden transition-all duration-300 ${isProcessing ? 'opacity-50 grayscale scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-md'}`}
                    >
                        {/* Processing Overlay */}
                        {isProcessing && (
                            <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-snes-purple animate-spin" />
                            </div>
                        )}

                        <div className="w-20 h-20 bg-snes-light overflow-hidden shrink-0 border-2 border-snes-gray-dark/20 rounded-sm flex items-center justify-center p-1">
                            <img 
                                src={displayImage} 
                                alt={item.name} 
                                loading="lazy" 
                                decoding="async"
                                className="w-full h-full object-contain" 
                            />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                            <div>
                                <h3 className="font-retro text-lg font-bold leading-tight text-snes-dark mb-1 line-clamp-2">{item.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-1">
                                    <p className="font-pixel text-xs text-snes-gray-dark uppercase truncate flex items-center gap-1">
                                        <span>{item.category}</span>
                                        <span className="bg-snes-gray-dark text-white px-1 rounded">x{item.quantity}</span>
                                    </p>
                                    {item.size && (
                                        <p className="font-pixel text-xs text-white bg-snes-blue px-1.5 rounded flex items-center gap-1">
                                            <Ruler className="w-3 h-3" /> {item.size}
                                        </p>
                                    )}
                                </div>
                                {item.selectedVariant && (
                                    <p className="font-pixel text-xs text-snes-purple mt-0.5">VAR: {item.selectedVariant.name}</p>
                                )}
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="font-retro text-2xl font-black text-snes-purple tracking-tight">${item.price * item.quantity}</span>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAction(itemId, onSaveForLater)}
                                        disabled={isProcessing || isCheckingOut}
                                        className="font-pixel text-xs text-snes-blue hover:text-snes-purple hover:underline px-1 py-1 flex items-center gap-1 transition-all uppercase disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
                                        title="Save for Later"
                                    >
                                        SAVE
                                    </button>
                                    <button 
                                        onClick={() => handleAction(itemId, onRemove)}
                                        disabled={isProcessing || isCheckingOut}
                                        className="font-pixel text-xs text-snes-red hover:bg-snes-red hover:text-white border border-transparent hover:border-snes-red px-2 py-1 rounded flex items-center gap-1 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-snes-gray-dark"
                                    >
                                        {isProcessing ? '...' : 'REMOVE'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )})
            )}
          </div>

          {/* Saved Items Section */}
          {savedItems.length > 0 && (
            <div className="border-t-4 border-dashed border-gray-300/50 pt-6 mt-4">
                <h3 className="font-pixel text-snes-gray-dark mb-4 flex items-center gap-2 tracking-widest text-sm">
                   <Heart className="w-4 h-4 text-snes-purple" /> SAVED_FOR_LATER <span className="text-xs opacity-60">({savedItems.length})</span>
                </h3>
                <div className="space-y-4">
                    {savedItems.map(item => {
                        const displayImage = item.selectedVariant ? item.selectedVariant.image : item.image;
                        const itemId = getCartUniqueId(item);
                        const isProcessing = processingId === itemId;

                        return (
                            <div 
                                key={itemId} 
                                className={`flex gap-3 fade-in border-2 border-transparent bg-gray-100/50 p-3 rounded relative overflow-hidden transition-all duration-300 opacity-80 hover:opacity-100 ${isProcessing ? 'opacity-50 grayscale' : ''}`}
                            >
                                {isProcessing && (
                                    <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-snes-dark animate-spin" />
                                    </div>
                                )}
                                <div className="w-16 h-16 bg-white overflow-hidden shrink-0 border border-gray-200 rounded-sm flex items-center justify-center p-1 grayscale">
                                    <img 
                                        src={displayImage} 
                                        alt={item.name} 
                                        loading="lazy" 
                                        decoding="async"
                                        className="w-full h-full object-contain" 
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div>
                                        <h3 className="font-retro text-md font-bold leading-tight text-gray-600 truncate">{item.name}</h3>
                                        <p className="font-pixel text-xs text-gray-400 uppercase flex gap-2">
                                            <span>{item.selectedVariant ? item.selectedVariant.name : 'STANDARD'}</span>
                                            {item.size && <span className="border border-gray-300 px-1 rounded">SZ:{item.size}</span>}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-end mt-1">
                                        <span className="font-retro text-lg text-gray-500">${item.price}</span>
                                        <div className="flex gap-2">
                                             <button 
                                                onClick={() => handleAction(itemId, onMoveToCart)}
                                                disabled={isProcessing || isCheckingOut}
                                                className="font-pixel text-[10px] bg-white border border-gray-300 hover:border-snes-green hover:text-snes-green px-2 py-1 rounded flex items-center gap-1 transition-all uppercase disabled:opacity-50"
                                            >
                                                <RefreshCw className="w-3 h-3" /> MOVE_BACK
                                            </button>
                                            <button 
                                                onClick={() => handleAction(itemId, onRemoveFromSaved)}
                                                disabled={isProcessing || isCheckingOut}
                                                className="text-gray-400 hover:text-snes-red transition-colors disabled:opacity-50"
                                                title="Remove permanently"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t-4 border-snes-white bg-snes-light shadow-[0_-4px_10px_rgba(0,0,0,0.05)] relative z-10 shrink-0">
          <div className="flex justify-between items-center mb-6 text-snes-dark font-pixel">
            <span className="text-xl text-snes-gray-dark">ESTIMATED_VALUE</span>
            <span className="text-4xl font-bold text-snes-purple">${total}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={items.length === 0 || isCheckingOut}
            className={`w-full bg-snes-blue text-white py-4 font-retro text-xl tracking-widest hover:bg-snes-blue/90 border-b-4 border-[#004ba0] active:border-b-0 active:translate-y-1 active:mb-1 transition-all uppercase rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:border-b-4 disabled:active:translate-y-0 relative overflow-hidden group ${isCheckingOut ? 'cursor-wait' : ''}`}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
                {isCheckingOut ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>INITIALIZING_PROTOCOL...</span>
                </>
                ) : (
                <>
                    <span>INITIATE_CHECKOUT</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
                )}
            </div>
            {/* Progress Bar Animation for Checkout */}
            {isCheckingOut && (
                <div className="absolute bottom-0 left-0 h-1 bg-snes-yellow animate-load-progress w-full"></div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};