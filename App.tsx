import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Assistant } from './components/Assistant';
import { Gate } from './components/Gate';
import { Transition } from './components/Transition';
import { Privacy } from './components/Privacy';
import { OrderTracker } from './components/OrderTracker';
import { PRODUCTS } from './constants';
import { Product, CartItem, ViewState, ProductVariant } from './types';
import { ShieldAlert, Zap, Globe, Package, Filter, Instagram, Twitter, Mail } from 'lucide-react';
import { vibrate, HAPTICS } from './utils/haptics';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const App = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toast, setToast] = useState<{msg: string, id: number} | null>(null);
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [securityMessage, setSecurityMessage] = useState("ANTI-CAPTURE PROTOCOL ACTIVE");
  
  // Transition & Navigation State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionProduct, setTransitionProduct] = useState<Product | null>(null);
  const scrollPosition = useRef(0);

  // Category State for Home Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Content Protection & Init
  useEffect(() => {
    // 1. Console Warning for "Hackers"
    console.log("%cSTOP!", "color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px 0px black;");
    console.log("%cUNAUTHORIZED ACCESS TO D.P GEMS SOURCE CODE IS A VIOLATION OF INTERNATIONAL CYBER LAW.", "color: white; background: red; font-size: 16px; padding: 10px; font-family: monospace;");
    console.log("%cIf you are seeing this, your IP address has been logged for security analysis.", "font-size: 14px; color: #aaa;");

    try {
      // Persistence Check: Auto-unlock if user has previously entered
      const hasAccess = localStorage.getItem('dp_gems_access');
      if (hasAccess === 'true') {
        setIsLocked(false);
      }
      
      // Theme Init
      const savedTheme = localStorage.getItem('dp_gems_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    } catch (e) {
      console.warn('Storage access restricted', e);
    }

    // Global Content Protection Listeners
    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleDragStart = (e: Event) => e.preventDefault();
    
    // Privacy Protection: Screenshot & Blur Detection
    const handleBlur = () => {
       // When window loses focus (e.g. Snipping Tool, clicking another window), hide content
       if (!isLocked) {
         setSecurityMessage("ANTI-CAPTURE PROTOCOL ACTIVE");
         setIsSecureMode(true);
       }
    };

    const handleFocus = () => {
       setIsSecureMode(false);
    };

    // Mobile specific: visibilitychange detects pulling down notifications or switching apps
    const handleVisibilityChange = () => {
      if (document.hidden && !isLocked) {
        setIsSecureMode(true);
      } else if (!document.hidden) {
        setIsSecureMode(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common screenshot keys AND DevTools
      if (
        e.key === 'PrintScreen' || 
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac Screenshot
        (e.ctrlKey && e.key === 'p') || // Print
        (e.key === 'S' && e.shiftKey && e.metaKey) || // Win+Shift+S attempt
        (e.key === 'F12') || // DevTools
        (e.ctrlKey && e.shiftKey && e.key === 'I') // DevTools
      ) {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
             setSecurityMessage("INSPECTOR TOOL DETECTED // ACCESS DENIED");
        } else {
             setSecurityMessage("ANTI-CAPTURE PROTOCOL ACTIVE");
        }
        setIsSecureMode(true);
        // Force secure mode to stay briefly even if keys are released
        setTimeout(() => {
             if (document.hasFocus()) setIsSecureMode(false);
        }, 2000);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked]);

  // Handle Scroll Reset on View Change
  useEffect(() => {
    if (view === ViewState.PRODUCT_DETAIL || view === ViewState.CHECKOUT || view === ViewState.PRIVACY || view === ViewState.ORDER_TRACKER) {
      // Force scroll to top immediately
      window.scrollTo(0, 0);
      // Fallback for browsers with paint lag
      requestAnimationFrame(() => window.scrollTo(0, 0));
    }
  }, [view]);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('dp_gems_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('dp_gems_theme', 'light');
      }
      return newVal;
    });
  };

  const handleUnlock = () => {
    vibrate(HAPTICS.gateUnlock);
    setShowGlitch(true);
    setTimeout(() => {
      setIsLocked(false);
      setShowGlitch(false);
      setIsSecureMode(false); // Ensure secure mode is off after unlock
    }, 400); // Optimized for seamless entry (reduced from 1000)
  };

  const handleLock = () => {
    localStorage.removeItem('dp_gems_access');
    setIsLocked(true);
    setView(ViewState.HOME);
    setShowGlitch(false);
  };

  const showToast = (msg: string) => {
    const id = Date.now();
    setToast({ msg, id });
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 2000);
  };

  // Cart Logic
  // Updated to handle Sizes as part of unique identity
  const handleAddToCart = (product: Product, variant?: ProductVariant, size?: string, openCart: boolean = true) => {
    vibrate(HAPTICS.light);
    setCart(prev => {
      const existing = prev.find(p => {
        const variantMatch = variant ? p.selectedVariant?.id === variant.id : p.id === product.id && !p.selectedVariant;
        const sizeMatch = p.size === size;
        return variantMatch && sizeMatch;
      });

      if (existing) {
        return prev.map(p => {
           const variantMatch = variant ? p.selectedVariant?.id === variant.id : p.id === product.id && !p.selectedVariant;
           const sizeMatch = p.size === size;
             
           return (variantMatch && sizeMatch) ? { ...p, quantity: p.quantity + 1 } : p;
        });
      }
      return [...prev, { ...product, quantity: 1, selectedVariant: variant, size: size }];
    });

    if (openCart) {
      setIsCartOpen(true);
    } else {
      showToast(`ADDED: ${variant ? variant.name : product.name}`);
    }
  };

  // Helper to generate unique ID for cart operations
  const getCartUniqueId = (item: CartItem): string => {
    return `${item.selectedVariant ? item.selectedVariant.id : item.id}-${item.size || 'NOSIZE'}`;
  };

  const removeFromCart = (uniqueId: string) => {
    setCart(prev => prev.filter(item => getCartUniqueId(item) !== uniqueId));
  };

  // Save for Later Logic
  const handleSaveForLater = (uniqueId: string) => {
    const itemToSave = cart.find(item => getCartUniqueId(item) === uniqueId);
    if (!itemToSave) return;

    // Remove from cart
    setCart(prev => prev.filter(item => getCartUniqueId(item) !== uniqueId));
    
    // Add to saved (merge if exists)
    setSavedItems(prev => {
      const existing = prev.find(p => getCartUniqueId(p) === uniqueId);
      if (existing) {
        return prev.map(p => getCartUniqueId(p) === uniqueId ? { ...p, quantity: p.quantity + itemToSave.quantity } : p);
      }
      return [...prev, itemToSave];
    });
    showToast("ARCHIVED FOR LATER");
  };

  const handleMoveToCart = (uniqueId: string) => {
    const itemToMove = savedItems.find(item => getCartUniqueId(item) === uniqueId);
    if (!itemToMove) return;

    // Remove from saved
    setSavedItems(prev => prev.filter(item => getCartUniqueId(item) !== uniqueId));

    // Add back to cart (using existing logic)
    handleAddToCart(itemToMove, itemToMove.selectedVariant, itemToMove.size, true);
  };

  const handleRemoveFromSaved = (uniqueId: string) => {
    setSavedItems(prev => prev.filter(item => getCartUniqueId(item) !== uniqueId));
  };

  const handleCheckoutStart = () => {
    vibrate(HAPTICS.medium);
    setIsCartOpen(false);
    setView(ViewState.CHECKOUT);
  };

  const handleOrderComplete = () => {
    setCart([]);
    setView(ViewState.HOME);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Navigation Logic
  const handleProductClick = (product: Product) => {
    // Save scroll position before transitioning
    scrollPosition.current = window.scrollY;

    // 1. Start Transition
    setTransitionProduct(product);
    setIsTransitioning(true);

    // 2. Wait for animation 
    setTimeout(() => {
      setSelectedProduct(product);
      setView(ViewState.PRODUCT_DETAIL);
      
      // 3. Cleanup Transition
      setIsTransitioning(false);
      setTransitionProduct(null);
    }, 800); 
  };

  const goHome = () => {
    setView(ViewState.HOME);
    setSelectedProduct(null);
    // Restore scroll position
    setTimeout(() => {
      window.scrollTo({
        top: scrollPosition.current,
        behavior: 'auto'
      });
    }, 0);
  };

  // FRONTEND SANITIZATION: Filter out archived/vaulted items so they don't show on the main grid
  const visibleProducts = PRODUCTS.filter(p => !p.isArchived);

  const filteredProducts = selectedCategory === 'ALL' 
    ? visibleProducts 
    : visibleProducts.filter(p => p.category === selectedCategory);

  if (isLocked) {
    return (
      <>
        <Gate onUnlock={handleUnlock} isDarkMode={isDarkMode} />
        {showGlitch && (
          <div className="fixed inset-0 z-[60] bg-snes-purple flex items-center justify-center pointer-events-none px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-pixel text-white animate-blink text-center leading-relaxed">
              SYSTEM<br/>UNLOCKED
            </h1>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen relative text-snes-dark bg-snes-bg selection:bg-snes-purple selection:text-white transition-colors duration-300 font-retro">
      
      {/* Privacy Shield Overlay */}
      <div className={`fixed inset-0 z-[100] bg-snes-dark/95 flex flex-col items-center justify-center transition-opacity duration-200 ${isSecureMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         <div className="text-snes-purple-light animate-pulse flex flex-col items-center gap-4 p-8 border-4 border-snes-purple bg-[#2c2c36] shadow-retro">
            <ShieldAlert className="w-16 h-16" />
             <h2 className="text-2xl font-pixel text-snes-purple text-center tracking-widest">
                {securityMessage}
             </h2>
             <p className="text-white/60 font-retro text-sm text-center max-w-md">
                FOR SECURITY REASONS, THE CONTENT IS HIDDEN WHEN THE WINDOW LOSES FOCUS OR SCREEN CAPTURE IS DETECTED.
             </p>
         </div>
      </div>

      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => {
            vibrate(HAPTICS.light);
            setIsCartOpen(true);
        }}
        onHome={() => {
            vibrate(HAPTICS.light);
            goHome();
        }}
        onAssistantToggle={() => {
            vibrate(HAPTICS.light);
            setIsAssistantOpen(!isAssistantOpen);
        }}
        isDarkMode={isDarkMode}
        toggleTheme={() => {
            vibrate(HAPTICS.light);
            toggleTheme();
        }}
        onLock={() => {
            vibrate(HAPTICS.medium);
            handleLock();
        }}
        onOrderTracker={() => {
            vibrate(HAPTICS.light);
            setView(ViewState.ORDER_TRACKER);
        }}
      />

      <main className="pt-16 md:pt-24 min-h-screen pb-0 flex flex-col">
        {view === ViewState.HOME && (
          <>
            {/* Hero Section */}
            <div className="relative mb-8 md:mb-12 border-b-4 border-snes-dark">
                {/* Main Banner */}
                <div className="bg-snes-dark text-white p-6 md:p-12 lg:p-16 overflow-hidden relative">
                    {/* Retro Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: `linear-gradient(45deg, #ffffff 2px, transparent 2px), linear-gradient(135deg, #ffffff 2px, transparent 2px)`, backgroundSize: '30px 30px' }}>
                    </div>
                    
                    <div className="relative z-10 max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
                        <div className="text-center md:text-left flex-1">
                            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                                <div className="w-2 h-2 md:w-3 md:h-3 bg-snes-green animate-pulse rounded-full"></div>
                                <span className="font-pixel text-snes-green tracking-widest text-xs md:text-sm border border-snes-green px-2 py-0.5 bg-black/50">SYSTEM_ONLINE // V2.4</span>
                            </div>
                            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-pixel mb-4 leading-[0.85] text-white drop-shadow-[4px_4px_0_#5c4fb3] mix-blend-screen">
                                D.P GEMS<br/><span className="text-snes-purple-light">ARCHIVE</span>
                            </h1>
                            <p className="font-retro text-lg md:text-2xl text-gray-400 max-w-lg leading-tight mx-auto md:mx-0 mb-6">
                                HIGH-FIDELITY TECHNICAL GARMENTS FOR THE DIGITAL AGE.
                            </p>
                            
                            {/* GSM DROPS - Visual Aura 16:9 Video Banner */}
                            <div className="mb-8 relative group inline-block hover:scale-[1.01] transition-transform duration-300 w-full max-w-[600px]">
                                {/* Retro Offset Border Shadow */}
                                <div className="absolute inset-0 bg-snes-purple translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
                                
                                <video
                                    src="/assets/hero-loop.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    defaultMuted
                                    playsInline
                                    preload="auto"
                                    className="relative z-10 w-full aspect-video object-cover border-4 border-white shadow-retro pointer-events-none"
                                />
                            </div>
                            
                            <div className="mt-2 flex flex-wrap gap-4 justify-center md:justify-start">
                                <button onClick={() => {
                                   const el = document.getElementById('shop-grid');
                                   el?.scrollIntoView({ behavior: 'smooth' });
                                }} className="bg-white text-snes-dark font-pixel text-xl px-6 py-3 border-4 border-transparent hover:border-snes-purple hover:text-snes-purple transition-all shadow-lg active:translate-y-1">
                                    INITIATE_SCAN
                                </button>
                                <div className="flex items-center gap-3 text-xs md:text-sm font-pixel text-gray-500 uppercase tracking-widest border border-gray-700 px-3 py-1 bg-black/30">
                                    <span>SECURE_DROP</span>
                                    <div className="w-px h-4 bg-gray-700"></div>
                                    <span>LTD_EDITION</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Hero Graphic / Hologram */}
                        <div className="w-64 h-64 md:w-80 md:h-80 border-4 border-white rotate-3 shadow-[12px_12px_0_#5c4fb3] bg-snes-blue overflow-hidden relative group shrink-0 hidden sm:block hover:rotate-0 transition-transform duration-500">
                             <img src="/assets/hero-banner.jpg" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" alt="Hero Asset" />
                             <div className="absolute inset-0 bg-gradient-to-t from-snes-purple/80 to-transparent mix-blend-overlay"></div>
                             
                             {/* Floating badge */}
                             <div className="absolute top-2 right-2 bg-snes-yellow text-snes-dark font-pixel text-xs px-2 py-1 border border-black animate-pulse">
                                 NEW_ARRIVAL
                             </div>
                        </div>
                    </div>
                </div>

                {/* Marquee Ticker */}
                <div className="bg-snes-yellow border-t-4 border-snes-white overflow-hidden py-1.5 md:py-2 whitespace-nowrap relative z-20">
                    <div className="animate-marquee inline-block font-pixel text-snes-dark text-lg md:text-xl tracking-widest px-4">
                       /// LIMITED DROPS DETECTED /// WORLDWIDE SHIPPING /// SECURE CHECKOUT /// AUTHENTICITY GUARANTEED /// LIMITED DROPS DETECTED /// WORLDWIDE SHIPPING /// SECURE CHECKOUT /// AUTHENTICITY GUARANTEED /// LIMITED DROPS DETECTED /// WORLDWIDE SHIPPING /// SECURE CHECKOUT /// AUTHENTICITY GUARANTEED ///
                    </div>
                </div>
            </div>

            <div id="shop-grid" className="max-w-[1920px] mx-auto p-4 md:p-8 flex-1 w-full">
              
              {/* Category Filter */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b-2 border-dashed border-gray-300 pb-6">
                  <div className="flex items-center gap-2 font-pixel text-2xl text-snes-gray-dark">
                      <Filter className="w-6 h-6" />
                      FILTER_PROTOCOL
                  </div>
                  
                  <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
                      {['ALL', 'OUTERWEAR', 'HOODIES', 'SWEATS', 'TOPS', 'HATS'].map(cat => (
                          <button 
                             key={cat}
                             onClick={() => setSelectedCategory(cat)}
                             className={`font-pixel text-lg md:text-xl px-4 md:px-6 py-2 border-2 transition-all uppercase relative overflow-hidden group ${
                                 selectedCategory === cat 
                                 ? 'bg-snes-purple text-white border-snes-dark shadow-[4px_4px_0_#000] -translate-y-1' 
                                 : 'bg-white text-snes-gray-dark border-gray-300 hover:border-snes-purple hover:text-snes-purple hover:-translate-y-1'
                             }`}
                          >
                              <span className="relative z-10">{cat === 'ALL' ? 'ALL_SYSTEMS' : cat}</span>
                              {selectedCategory === cat && (
                                  <div className="absolute inset-0 bg-white/10 animate-pulse z-0"></div>
                              )}
                          </button>
                      ))}
                  </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8 min-h-[50vh]">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={handleProductClick}
                    onAddToCart={(p) => handleProductClick(p)} // On grid add, just open details for size selection
                  />
                ))}
                {filteredProducts.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                        <Package className="w-16 h-16 mb-4 text-snes-gray-dark" />
                        <p className="font-pixel text-2xl text-snes-gray-dark">NO ASSETS FOUND IN THIS SECTOR</p>
                    </div>
                )}
              </div>
            </div>

            {/* Enhanced Footer */}
            <footer className="mt-20 bg-snes-dark text-white pt-16 pb-8 border-t-8 border-snes-purple relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
                
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 relative z-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-snes-green font-pixel text-xl tracking-widest">
                           <Zap className="w-5 h-5 fill-current" /> D.P GEMS // ARCHIVE
                        </div>
                        <p className="font-retro text-gray-400 text-sm leading-relaxed max-w-xs">
                           Curating high-fidelity streetwear artifacts for the discerning operator. Secure drops, limited runs, global access.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black transition-colors rounded-full">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black transition-colors rounded-full">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 border border-gray-600 flex items-center justify-center hover:bg-white hover:text-black transition-colors rounded-full">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-pixel text-lg text-white uppercase border-b border-gray-700 pb-2">SECTOR NAVIGATION</h3>
                        <ul className="space-y-2 font-retro text-gray-400 text-sm">
                            <li><button onClick={() => setSelectedCategory('ALL')} className="hover:text-snes-purple-light transition-colors hover:translate-x-1 inline-block">/// ALL SYSTEMS</button></li>
                            <li><button onClick={() => setSelectedCategory('OUTERWEAR')} className="hover:text-snes-purple-light transition-colors hover:translate-x-1 inline-block">/// OUTERWEAR</button></li>
                            <li><button onClick={() => setSelectedCategory('TOPS')} className="hover:text-snes-purple-light transition-colors hover:translate-x-1 inline-block">/// TOPS</button></li>
                            <li><button onClick={() => setSelectedCategory('SWEATS')} className="hover:text-snes-purple-light transition-colors hover:translate-x-1 inline-block">/// SWEATS</button></li>
                            <li><button onClick={() => setSelectedCategory('HATS')} className="hover:text-snes-purple-light transition-colors hover:translate-x-1 inline-block">/// HATS</button></li>
                            <li><button onClick={() => setView(ViewState.PRIVACY)} className="hover:text-snes-purple-light transition-colors hover:translate-x-1 inline-block">/// PRIVACY PROTOCOL</button></li>
                            <li><button onClick={() => setView(ViewState.ORDER_TRACKER)} className="hover:text-snes-purple-light transition-colors hover:translate-x-1 inline-block">/// ORDER TRACKER</button></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                         <h3 className="font-pixel text-lg text-white uppercase border-b border-gray-700 pb-2">NEWSLETTER_UPLINK</h3>
                         <p className="font-retro text-gray-400 text-xs">Subscribe for encrypted drop notifications.</p>
                         <div className="flex">
                             <input type="email" placeholder="ENTER_EMAIL" className="bg-black/30 border border-gray-600 px-3 py-2 text-white font-retro text-sm flex-1 outline-none focus:border-snes-purple" />
                             <button className="bg-snes-purple text-white px-4 font-pixel text-sm hover:bg-snes-purple-light transition-colors">JOIN</button>
                         </div>
                    </div>
                </div>

                <div className="text-center border-t border-gray-800 pt-8 relative z-10">
                    <p className="font-pixel text-xs text-gray-600 uppercase tracking-widest">
                        © 2025 D.P GEMS // SYSTEM SECURE // EST. 2024
                    </p>
                    <div className="mt-2 text-[10px] text-gray-700 font-mono">
                        LAT: 34.0522 N // LONG: 118.2437 W
                    </div>
                </div>
            </footer>
          </>
        )}

        {view === ViewState.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onBack={goHome}
            onAddToCart={handleAddToCart}
          />
        )}

        {view === ViewState.CHECKOUT && (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              mode: 'payment', 
              amount: Math.max(100, Math.round(cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 100)), 
              currency: 'gbp',
              appearance: { theme: 'night' } 
            }}
          >
            <Checkout 
              cart={cart}
              total={cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
              onBack={() => setView(ViewState.HOME)}
              onComplete={handleOrderComplete}
            />
          </Elements>
        )}
        
        {view === ViewState.PRIVACY && (
           <Privacy onBack={goHome} />
        )}

        {view === ViewState.ORDER_TRACKER && (
           <div className="py-12">
             <OrderTracker />
             <div className="text-center mt-8">
               <button onClick={goHome} className="font-pixel text-snes-blue hover:text-snes-purple hover:underline">
                 RETURN TO HOME
               </button>
             </div>
           </div>
        )}
      </main>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        savedItems={savedItems}
        onRemove={removeFromCart}
        onSaveForLater={handleSaveForLater}
        onMoveToCart={handleMoveToCart}
        onRemoveFromSaved={handleRemoveFromSaved}
        onCheckout={handleCheckoutStart}
      />

      <Assistant 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-snes-dark text-white px-6 py-3 rounded shadow-lg font-pixel text-xl tracking-wide animate-bounce flex items-center gap-2 border-2 border-snes-green">
           <div className="w-3 h-3 bg-snes-green rounded-full animate-pulse"></div>
           {toast.msg}
        </div>
      )}

      {/* Transition Overlay */}
      {isTransitioning && transitionProduct && (
        <Transition productName={transitionProduct.name} />
      )}
    </div>
  );
};

export default App;
