import React, { useState, useEffect, useMemo, Component, ReactNode } from 'react';
import { CartItem } from '../types';
import { CreditCard, ArrowLeft, Lock, CheckCircle, AlertTriangle, Globe, User, RefreshCw, Sparkles, Gem, Terminal, XCircle, WifiOff, ShieldCheck, Bug, Ruler } from 'lucide-react';
import { COUNTRIES } from '../constants';
import { ExpressCheckoutElement, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { logExtraction } from '../services/geminiService';
import { vibrate, HAPTICS } from '../utils/haptics';

interface CheckoutProps {
  cart: CartItem[];
  total: number;
  onBack: () => void;
  onComplete: () => void;
}

interface FormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  _honey: string; // Honeypot field for bot detection
}

interface FormErrors {
  [key: string]: string;
}

interface PaymentProviderErrorBoundaryProps {
  label: string;
  onSimulate: () => void;
  children?: ReactNode;
}

interface PaymentProviderErrorBoundaryState {
  hasError: boolean;
}

// Improved Error Boundary that provides a Simulation Fallback
class PaymentProviderErrorBoundary extends Component<PaymentProviderErrorBoundaryProps, PaymentProviderErrorBoundaryState> {
  state: PaymentProviderErrorBoundaryState = { hasError: false };
  
  // Explicitly declare props to satisfy strict TypeScript checks
  readonly props: Readonly<PaymentProviderErrorBoundaryProps>;

  constructor(props: PaymentProviderErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // Robust error message extraction
    let msg = '';
    try {
        if (typeof error === 'string') msg = error;
        else if (error instanceof Error) msg = error.message;
        else msg = JSON.stringify(error) || '';
    } catch (e) {
        msg = 'Unknown Error';
    }

    // Filter out common environment errors to prevent console spam
    const isEnvironmentError = 
        msg.includes('PaymentRequest') || 
        msg.includes('top-level browsing context') ||
        msg.includes('allow="payment"') ||
        msg.includes('window') || 
        msg.includes('Script error');

    if (isEnvironmentError) {
        console.warn(`[${this.props.label}] Environment restricted (iframe/permissions). Switching to simulation mode.`);
    } else {
        console.error(`[${this.props.label}] Error:`, error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <button 
            type="button"
            onClick={(e) => { e.preventDefault(); this.props.onSimulate(); }}
            className="w-full h-12 bg-snes-light border-2 border-dashed border-gray-400 rounded flex items-center justify-center gap-2 text-gray-500 font-pixel text-xs hover:bg-white hover:text-snes-purple hover:border-snes-purple transition-all cursor-pointer group"
        >
          <WifiOff className="w-4 h-4 group-hover:animate-pulse" />
          <span>{this.props.label} UNAVAILABLE // CLICK_TO_SIMULATE</span>
        </button>
      );
    }
    return this.props.children;
  }
}

export const Checkout: React.FC<CheckoutProps> = ({ cart, total, onBack, onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnimeSequence, setShowAnimeSequence] = useState(false);
  const [auraActive, setAuraActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [secureOrderId, setSecureOrderId] = useState<string | null>(null);
  
  // New state for Google Pay environment check
  // Default to false so we don't render and crash immediately in iframes
  const [isGooglePaySupported, setIsGooglePaySupported] = useState(false);
  const [isEnvCheckComplete, setIsEnvCheckComplete] = useState(false);
  
  // Simulated error handling states
  const [attemptHistory, setAttemptHistory] = useState<number[]>([]);

  const [formData, setFormData] = useState<FormData>({
    email: localStorage.getItem('dp_gems_user_email') || '', phone: '', firstName: '', lastName: '', address: '', city: '',
    zip: '', country: 'United States', cardNumber: '', expiry: '', cvv: '', _honey: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Pre-flight check for Google Pay environment
    const checkEnvironment = () => {
        if (typeof window !== 'undefined' && (window as any).PaymentRequest) {
            try {
                // We use a dummy request to trigger the specific iframe security error if present.
                new (window as any).PaymentRequest(
                    [{ supportedMethods: 'https://google.com/pay' }],
                    { total: { label: 'Environment Check', amount: { currency: 'USD', value: '1.00' } } }
                );
                // If constructor succeeds, we assume support
                setIsGooglePaySupported(true);
            } catch (err: any) {
                console.warn('[Checkout] Google Pay environment check failed:', err.message);
                setIsGooglePaySupported(false);
            }
        } else {
            setIsGooglePaySupported(false);
        }
        setIsEnvCheckComplete(true);
    };

    checkEnvironment();
  }, []);

  const handleAutoFill = () => {
    setFormData({
        email: 'operative@dpgems.net',
        phone: '(555) 867-5309',
        firstName: 'Sarah',
        lastName: 'Connor',
        address: '1984 Cyberdyne Systems Way',
        city: 'Los Angeles',
        zip: '90025',
        country: 'United States',
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/26',
        cvv: '984',
        _honey: ''
    });
    setPaymentError(null);
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.email.includes('@')) newErrors.email = 'INVALID EMAIL PROTOCOL';
    if (!formData.firstName) newErrors.firstName = 'ID REQUIRED';
    if (!formData.address) newErrors.address = 'LOCATION REQUIRED';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
  };

  const handleSuccessfulTransaction = async (source: string, id: string) => {
      vibrate(HAPTICS.success);
      setPaymentError(null);
      setIsProcessing(true);
      
      // Log extraction via Gemini Service
      const itemNames = cart.map(c => c.name);
      await logExtraction(id, total, itemNames);

      // TikTok Dual-Track Conversion (Browser + Server-Side)
      const contents = cart.map(item => ({
          content_id: item.id,
          content_name: item.name,
          quantity: item.quantity,
          price: item.price
      }));

      // 1. Browser Pixel with Deduplication (event_id)
      if (typeof window !== 'undefined' && (window as any).ttq) {
          (window as any).ttq.track('CompletePayment', {
              contents: contents,
              value: total,
              currency: 'GBP'
          }, {
              event_id: id
          });
      }

      // 2. Server-Side Supabase Edge Function Uplink
      try {
          await fetch('https://npthcsrmewqjadezjxez.supabase.co/functions/v1/send-tiktok-lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  event: 'CompletePayment',
                  event_id: id,
                  email: formData.email,
                  value: total,
                  currency: 'GBP',
                  contents: contents
              })
          });
      } catch (err) {
          console.warn('Server-side TikTok uplink failed:', err);
      }

      setIsProcessing(false);
      
      // 1. Start Anime Character Sequence
      setShowAnimeSequence(true);
      
      // 2. Activate Aura & Text ("Dopamine Hit")
      setTimeout(() => {
          setAuraActive(true);
      }, 400);

      // 3. Transition to NFT Reveal (if applicable) or straight to Order Confirmed
      setTimeout(() => {
          setShowAnimeSequence(false);
          setIsSuccess(true);
          
          // 4. Transition to Order Confirmation
          setTimeout(() => {
              setIsSuccess(false);
              setIsOrderConfirmed(true);
          }, 4500); 
      }, 4000); 
  };

  const handleGooglePayError = (err: any) => {
    console.error('Google Pay Error:', err);
    // Silent fail handled by boundary normally, but if it bubbles:
    setPaymentError("PROTOCOL_ERROR: GOOGLE_PAY_UNREACHABLE");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // HONEYPOT / BOT DETECTION
    if (formData._honey) {
        console.warn("Bot detected via honeypot field.");
        vibrate(HAPTICS.error);
        setIsProcessing(true);
        // Simulate a long processing time then fail
        setTimeout(() => {
            setPaymentError("SYSTEM_ERROR: ANOMALY DETECTED");
            setIsProcessing(false);
        }, 2000);
        return;
    }

    if (!validate()) {
        vibrate(HAPTICS.error);
        setPaymentError("VALIDATION_ERROR: CHECK FIELDS");
        return;
    }
    
    // Simulate rate limiting / anti-bot
    const now = Date.now();
    const recentAttempts = attemptHistory.filter(t => now - t < 5000);
    if (recentAttempts.length > 2) {
       vibrate(HAPTICS.error);
       setPaymentError("TRAFFIC ANOMALY DETECTED. COOL DOWN ACTIVE.");
       return;
    }
    setAttemptHistory(prev => [...prev, now]);
    setPaymentError(null);

    setIsProcessing(true);
    
    // SECURE ORDER ROUTING: Get PaymentIntent client_secret, submit elements, and confirm payment
    try {
        const response = await fetch('https://npthcsrmewqjadezjxez.supabase.co/functions/v1/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: Math.round(total * 100) // Convert to pence
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Secure checkout failed');
        }

        // Generate local tracking order ID
        const currentOrderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        // Submit Elements form (internal state update)
        const { error: submitError } = await elements!.submit();
        if (submitError) {
            throw new Error(submitError.message);
        }

        // Confirm payment with Stripe
        const { error } = await stripe!.confirmPayment({
            elements: elements!,
            clientSecret: data.clientSecret,
            confirmParams: {
                return_url: window.location.href,
                payment_method_data: {
                    billing_details: {
                        name: `${formData.firstName} ${formData.lastName}`,
                        email: formData.email,
                        phone: formData.phone,
                        address: {
                            line1: formData.address,
                            city: formData.city,
                            postal_code: formData.zip,
                            country: 'US', // We are hardcoding or using formData.country mapped to ISO code
                        }
                    }
                }
            },
            redirect: 'if_required'
        });

        if (error) {
            throw new Error(error.message);
        } else {
            setSecureOrderId(currentOrderId);
            handleSuccessfulTransaction('STRIPE', currentOrderId);
        }
    } catch (err: any) {
        vibrate(HAPTICS.error);
        setPaymentError(err.message || 'COMMUNICATION FAILURE');
        setIsProcessing(false);
    }
  };

  // Find the first item with an NFT or default to a generic "Gem" concept
  const nftItem = cart.find(i => i.nftImage) || cart[0];
  const nftImageSrc = nftItem?.nftImage || nftItem?.image || 'https://placehold.co/600x880/000/FFF?text=ACCESS+CARD';

  // ------------------------------------------------------------------
  // ANIME CHARACTER "DOPAMINE" SEQUENCE
  // ------------------------------------------------------------------
  if (showAnimeSequence) {
      return (
        <div className="fixed inset-0 z-[100] bg-[#1a0b2e] flex flex-col items-center justify-center p-4 overflow-hidden font-pixel text-center">
             
             {/* Dynamic Background */}
             <div className="absolute inset-0 z-0 bg-[linear-gradient(45deg,#2e0b3d_25%,transparent_25%,transparent_75%,#2e0b3d_75%,#2e0b3d)] bg-[length:60px_60px] opacity-30 animate-grid-move"></div>
             <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#ff0099]/20 to-transparent mix-blend-screen"></div>

             {/* Burst Lines */}
             <div className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-[conic-gradient(from_0deg,transparent_0deg,#ff0099_10deg,transparent_20deg,#00ffff_30deg,transparent_40deg)] animate-[spin_6s_linear_infinite]"></div>

             <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                 
                 {/* Visual Aura & Character Container */}
                 <div className="relative flex items-center justify-center">
                     
                     {/* Aura / Glow - Pulses when active */}
                     <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[700px] md:h-[700px] bg-gradient-to-r from-[#ff00cc] via-[#3333ff] to-[#00ffff] rounded-full blur-[60px] md:blur-[100px] mix-blend-screen transition-all duration-700 ${auraActive ? 'opacity-90 scale-110 animate-pulse' : 'opacity-0 scale-50'}`}></div>
                     
                     {/* Character Image - Slides/Fades in */}
                     <div className={`relative z-10 transition-all duration-500 ease-out transform ${auraActive ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}>
                         <img 
                            src="/assets/agent-success.png" 
                            alt="Payment Success Agent" 
                            className="w-auto h-[55vh] md:h-[70vh] object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
                            style={{ 
                                filter: auraActive ? 'brightness(1.1) contrast(1.1)' : 'brightness(0.5)',
                                animation: auraActive ? 'gem-float 4s ease-in-out infinite' : 'none'
                            }}
                         />
                         
                         {/* Sparkle Particles */}
                         {auraActive && (
                             <div className="absolute inset-0 pointer-events-none">
                                 {[...Array(8)].map((_, i) => (
                                     <Sparkles 
                                        key={i} 
                                        className="absolute text-[#ffff00] w-8 h-8 md:w-12 md:h-12 animate-ping" 
                                        style={{
                                            top: `${20 + Math.random() * 60}%`,
                                            left: `${10 + Math.random() * 80}%`,
                                            animationDelay: `${Math.random() * 2}s`,
                                            animationDuration: '1.5s'
                                        }} 
                                     />
                                 ))}
                             </div>
                         )}
                     </div>
                 </div>

                 {/* "PAYMENT ACCEPTED" Text - Slams in with glitch effect */}
                 <div className={`absolute bottom-[10%] z-20 transition-all duration-300 transform ${auraActive ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}>
                    <div className="relative">
                        <h2 className="font-pixel text-5xl md:text-9xl text-[#00ff41] leading-none tracking-widest drop-shadow-[6px_6px_0_#000] italic transform -rotate-2" 
                            style={{ WebkitTextStroke: '2px black' }}>
                            PAYMENT<br/>ACCEPTED
                        </h2>
                        {/* Glitch Copy */}
                        <h2 className="absolute inset-0 font-pixel text-5xl md:text-9xl text-[#ff0099] leading-none tracking-widest italic transform -rotate-2 opacity-50 animate-glitch-text mix-blend-screen pointer-events-none" 
                            style={{ WebkitTextStroke: '2px black' }}>
                            PAYMENT<br/>ACCEPTED
                        </h2>
                    </div>
                 </div>
             </div>
        </div>
      );
  }

  // NFT Reveal View (Gold/Diamond Theme - High Fidelity)
  if (isSuccess) {
    return (
        <div className="fixed inset-0 z-50 bg-[#0a0a1a] flex flex-col items-center justify-center p-4 animate-fade-in font-retro overflow-hidden">
            {/* Elegant Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,215,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.1)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
            
            {/* Golden Glow Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_90%)] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
                <div className="text-yellow-400 font-pixel text-4xl md:text-6xl mb-2 animate-glitch-text text-center leading-tight drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                    ACQUISITION VERIFIED
                </div>
                <div className="text-cyan-300/80 font-retro text-xl mb-12 tracking-[0.2em] uppercase flex items-center gap-3">
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                    Digital Ownership Secured
                    <Sparkles className="w-5 h-5 animate-spin-slow" />
                </div>

                {/* Holographic NFT Card Container */}
                <div className="relative w-64 sm:w-72 md:w-80 max-w-[85vw] aspect-[2/3] group perspective-1000 my-4">
                    <div className="relative w-full h-full transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12 preserve-3d animate-float">
                        
                        {/* The Card Image - Gold Border */}
                        <div className="absolute inset-0 border-4 border-yellow-500/60 rounded-xl overflow-hidden bg-black shadow-[0_0_50px_rgba(234,179,8,0.35)] flex items-center justify-center p-2">
                            <img 
                                src={nftImageSrc} 
                                alt="Digital Asset" 
                                className="w-full h-full object-contain image-pixelated contrast-125 saturate-125 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]"
                            />

                            {/* Holo Gradient Overlay - Adjusted for Gold/Cyan */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-cyan-400/10 to-transparent opacity-50 mix-blend-overlay animate-holo pointer-events-none"></div>
                            {/* Scanline/Grid Overlay for extra retro feel */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40 pointer-events-none"></div>
                        </div>

                        {/* Floating Elements - Diamonds */}
                        <div className="absolute -top-6 -right-6">
                             <Gem className="w-12 h-12 text-cyan-300 animate-spin-slow drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" fill="currentColor" fillOpacity={0.2} />
                        </div>
                        
                        {/* Info Badge - Gold Theme */}
                        <div className="absolute bottom-4 left-0 w-full px-4">
                             <div className="bg-black/80 backdrop-blur border border-yellow-500/50 p-3 rounded shadow-lg">
                                 <div className="text-yellow-400 font-pixel text-lg leading-none mb-1 flex justify-between">
                                     <span>OWNERSHIP_TOKEN</span>
                                     <Lock className="w-3 h-3" />
                                 </div>
                                 <div className="text-cyan-200 text-xs font-mono break-all opacity-90 tracking-wider">
                                     {secureOrderId || `0x${Date.now().toString(16).toUpperCase()}${Math.random().toString(16).substr(2, 6).toUpperCase()}`}
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 w-full max-w-md bg-gray-900/50 border border-yellow-500/20 p-4 rounded text-center backdrop-blur-sm">
                    <p className="font-pixel text-yellow-500 text-sm animate-pulse mb-2">
                        <Terminal className="w-3 h-3 inline mr-2" />
                        SYNCING TO BLOCKCHAIN...
                    </p>
                    <div className="w-full bg-gray-800 h-1 rounded overflow-hidden border border-gray-700">
                        <div className="h-full bg-gradient-to-r from-yellow-500 to-cyan-400 animate-load-progress" style={{ animationDuration: '7s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // Order Confirmation View
  if (isOrderConfirmed) {
    return (
        <div className="fixed inset-0 z-50 bg-[#e0e0dc] flex flex-col items-center justify-center p-4 animate-fade-in font-retro text-snes-dark">
            <div className="max-w-2xl w-full border-4 border-snes-dark bg-white shadow-retro relative overflow-hidden flex flex-col">
                {/* Header Strip */}
                <div className="bg-snes-dark text-white p-4 flex justify-between items-center">
                    <span className="font-pixel tracking-widest">TRANSACTION_COMPLETE</span>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>

                <div className="p-8 md:p-12 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-green-100 text-snes-green border-4 border-snes-green rounded-full mb-8 shadow-sm">
                        <CheckCircle className="w-12 h-12" strokeWidth={3} />
                    </div>

                    <h2 className="font-pixel text-4xl md:text-5xl mb-6 leading-none">
                        ORDER CONFIRMED
                    </h2>

                    <div className="space-y-6 text-lg">
                        <p className="leading-relaxed">
                            YOUR ACQUISITION IS SECURE.<br/>
                            TRANSACTION ID: <span className="font-mono text-xs break-all bg-gray-100 px-1 rounded">{secureOrderId}</span><br/><br/>
                            A CONFIRMATION LINK HAS BEEN DISPATCHED TO:<br/>
                            <span className="font-bold text-snes-purple bg-snes-purple/10 px-2 py-1 rounded mt-1 inline-block">
                                {formData.email || 'OPERATIVE@UNKNOWN.NET'}
                            </span>
                        </p>

                        <div className="border-t-2 border-dashed border-gray-300 my-6"></div>

                        <div className="bg-snes-light border-2 border-snes-dark p-6 rounded relative group overflow-hidden">
                             <div className="absolute top-0 right-0 p-2 opacity-10">
                                <ShieldCheck className="w-24 h-24" />
                             </div>
                             
                             <div className="relative z-10">
                                 <h3 className="font-pixel text-xl text-snes-purple mb-2 flex items-center justify-center gap-2">
                                     <ShieldCheck className="w-5 h-5" /> AUTHENTICITY VERIFIED
                                 </h3>
                                 <p className="text-sm md:text-base text-gray-600">
                                     YOU ARE NOW THE REGISTERED OWNER OF THE ATTACHED DIGITAL ASSET. THIS TOKEN SERVES AS IMMUTABLE PROOF OF AUTHENTICITY FOR YOUR PHYSICAL ITEM.
                                 </p>
                             </div>
                        </div>
                    </div>

                    <button 
                        onClick={onComplete}
                        className="mt-10 w-full bg-snes-blue hover:bg-snes-purple text-white font-retro text-2xl py-4 border-b-8 border-[#003366] hover:border-[#3e3482] active:border-b-0 active:translate-y-2 active:mb-2 transition-all rounded uppercase tracking-widest shadow-lg"
                    >
                        RETURN TO ARCHIVE
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 px-4 fade-in">
        <button 
            onClick={onBack} 
            className="mb-6 font-retro text-xl text-snes-gray-dark hover:text-snes-purple flex items-center gap-2 group bg-snes-white px-4 py-2 border-2 border-snes-dark shadow-retro-sm active:shadow-none active:translate-y-1 rounded"
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="group-hover:underline px-1 transition-colors">RETURN TO CART</span>
        </button>

        {/* Global Error Alert */}
        {paymentError && (
            <div className="mb-6 bg-snes-red/10 border-l-4 border-snes-red p-4 flex items-center gap-3 animate-pulse shadow-sm rounded-r-sm">
                <XCircle className="w-8 h-8 text-snes-red shrink-0" />
                <div>
                    <h4 className="font-pixel text-xl text-snes-red leading-none mb-1">TRANSACTION_HALTED</h4>
                    <p className="font-retro text-snes-dark text-lg">{paymentError}</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="md:col-span-7 space-y-8">
                


                {/* Standard CC Form */}
                <div className="bg-snes-white border-4 border-snes-dark shadow-retro p-6 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 border-b-2 border-dashed border-gray-300 pb-4">
                        <h2 className="font-pixel text-2xl text-snes-dark flex items-center gap-2">
                            <Lock className="w-6 h-6 text-snes-purple" />
                            SECURE CHECKOUT
                        </h2>
                        <button 
                            onClick={handleAutoFill} 
                            className="text-xs font-retro bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-500 flex items-center gap-1"
                            title="Dev Tool: Auto-fill Form"
                        >
                            <RefreshCw className="w-3 h-3" /> AUTO_FILL
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative">
                        {/* Honeypot Field - Hidden */}
                        <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                            <label htmlFor="hp_field">Do not fill this field</label>
                            <input
                                type="text"
                                id="hp_field"
                                name="_honey"
                                tabIndex={-1}
                                autoComplete="off"
                                value={formData._honey}
                                onChange={(e) => setFormData({...formData, _honey: e.target.value})}
                            />
                        </div>

                        <div className="mb-8">
                            <ExpressCheckoutElement 
                                onConfirm={async (event) => {
                                    setIsProcessing(true);
                                    setPaymentError(null);
                                    
                                    try {
                                        // 1. Get PaymentIntent client_secret
                                        const response = await fetch('https://npthcsrmewqjadezjxez.supabase.co/functions/v1/create-payment-intent', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                amount: Math.round(total * 100)
                                            })
                                        });

                                        const data = await response.json();
                                        
                                        if (!response.ok) {
                                            throw new Error(data.error || 'Secure checkout failed');
                                        }

                                        const currentOrderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

                                        // 2. Submit Elements form (internal state update)
                                        const { error: submitError } = await elements!.submit();
                                        if (submitError) {
                                            throw new Error(submitError.message);
                                        }

                                        // 3. Confirm payment with Stripe
                                        const { error } = await stripe!.confirmPayment({
                                            elements: elements!,
                                            clientSecret: data.clientSecret,
                                            confirmParams: {
                                                return_url: window.location.href,
                                            },
                                            redirect: 'if_required' // We will handle it locally
                                        });

                                        if (error) {
                                            throw new Error(error.message);
                                        } else {
                                            setSecureOrderId(currentOrderId);
                                            handleSuccessfulTransaction('STRIPE_EXPRESS', currentOrderId);
                                        }
                                    } catch (err: any) {
                                        vibrate(HAPTICS.error);
                                        setPaymentError(err.message || 'COMMUNICATION FAILURE');
                                        setIsProcessing(false);
                                    }
                                }}
                            />
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <h3 className="font-retro text-lg text-snes-gray-dark uppercase border-b border-gray-200">Contact Protocol</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-retro text-snes-dark uppercase text-sm">Email Address</label>
                                    <input 
                                        type="email" 
                                        className={`w-full p-3 bg-snes-light border-2 ${errors.email && touched.email ? 'border-snes-red' : 'border-gray-300'} focus:border-snes-purple outline-none font-retro text-lg transition-colors`}
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        onBlur={() => handleBlur('email')}
                                        placeholder="OPERATIVE@EMAIL.COM"
                                    />
                                    {errors.email && touched.email && <span className="text-snes-red text-xs font-pixel">{errors.email}</span>}
                                </div>
                                <div className="space-y-1">
                                    <label className="font-retro text-snes-dark uppercase text-sm">Comm Frequency (Phone)</label>
                                    <input 
                                        type="tel" 
                                        className="w-full p-3 bg-snes-light border-2 border-gray-300 focus:border-snes-purple outline-none font-retro text-lg transition-colors"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        placeholder="(555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping */}
                        <div className="space-y-4">
                            <h3 className="font-retro text-lg text-snes-gray-dark uppercase border-b border-gray-200">Drop Coordinates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-retro text-snes-dark uppercase text-sm">First Name</label>
                                    <input 
                                        type="text" 
                                        className={`w-full p-3 bg-snes-light border-2 ${errors.firstName && touched.firstName ? 'border-snes-red' : 'border-gray-300'} focus:border-snes-purple outline-none font-retro text-lg transition-colors`}
                                        value={formData.firstName}
                                        onChange={e => setFormData({...formData, firstName: e.target.value})}
                                        onBlur={() => handleBlur('firstName')}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-retro text-snes-dark uppercase text-sm">Last Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-snes-light border-2 border-gray-300 focus:border-snes-purple outline-none font-retro text-lg transition-colors"
                                        value={formData.lastName}
                                        onChange={e => setFormData({...formData, lastName: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="font-retro text-snes-dark uppercase text-sm">Street Address</label>
                                <input 
                                    type="text" 
                                    className={`w-full p-3 bg-snes-light border-2 ${errors.address && touched.address ? 'border-snes-red' : 'border-gray-300'} focus:border-snes-purple outline-none font-retro text-lg transition-colors`}
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    onBlur={() => handleBlur('address')}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-retro text-snes-dark uppercase text-sm">City</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-snes-light border-2 border-gray-300 focus:border-snes-purple outline-none font-retro text-lg transition-colors"
                                        value={formData.city}
                                        onChange={e => setFormData({...formData, city: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-retro text-snes-dark uppercase text-sm">ZIP / Postal</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-snes-light border-2 border-gray-300 focus:border-snes-purple outline-none font-retro text-lg transition-colors"
                                        value={formData.zip}
                                        onChange={e => setFormData({...formData, zip: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="font-retro text-snes-dark uppercase text-sm flex items-center gap-2">
                                    <Globe className="w-3 h-3" /> Region / Country
                                </label>
                                <div className="relative">
                                    <select 
                                        className="w-full p-3 bg-snes-light border-2 border-gray-300 focus:border-snes-purple outline-none font-retro text-lg transition-colors appearance-none cursor-pointer"
                                        value={formData.country}
                                        onChange={e => setFormData({...formData, country: e.target.value})}
                                    >
                                        {COUNTRIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-snes-dark text-xs">▼</div>
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="space-y-4">
                            <h3 className="font-retro text-lg text-snes-gray-dark uppercase border-b border-gray-200">Transaction Keys</h3>
                            <div className="bg-snes-light border-2 border-gray-300 p-4 font-retro transition-colors rounded">
                                <PaymentElement options={{ 
                                    layout: 'tabs',
                                    style: {
                                        base: {
                                            fontFamily: 'monospace',
                                            fontSize: '16px',
                                            color: '#2d3748',
                                            '::placeholder': {
                                                color: '#a0aec0',
                                            },
                                        },
                                    }
                                }} />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isProcessing}
                            className="w-full bg-snes-purple hover:bg-snes-purple-light text-white font-retro text-2xl py-4 border-b-8 border-[#3e3482] active:border-b-0 active:translate-y-2 active:mb-2 transition-all rounded shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
                        >
                            {isProcessing && <Bug className="w-5 h-5 animate-spin" />}
                            {isProcessing ? 'ENCRYPTING & TRANSMITTING...' : `AUTHORIZE PAYMENT $${total}`}
                        </button>
                    </form>
                </div>
            </div>

            {/* Summary Section */}
            <div className="md:col-span-5 space-y-6">
                <div className="bg-snes-light border-4 border-snes-white shadow-retro p-6">
                    <h3 className="font-pixel text-xl text-snes-dark mb-4 border-b-2 border-gray-300 pb-2">MANIFEST SUMMARY</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-4">
                        {cart.map(item => (
                            <div key={`${item.selectedVariant ? item.selectedVariant.id : item.id}-${item.size || 'NOSIZE'}`} className="flex gap-4 items-start">
                                <div className="w-16 h-16 bg-white border border-gray-300 shrink-0 p-1">
                                    <img src={item.selectedVariant?.image || item.image} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-retro text-snes-dark leading-tight">{item.name}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      <p className="font-pixel text-xs text-gray-500 uppercase">{item.selectedVariant?.name || 'STANDARD'}</p>
                                      {item.size && (
                                          <span className="font-pixel text-[10px] text-white bg-snes-blue px-1.5 py-0.5 rounded flex items-center gap-1">
                                              <span className="opacity-75">SZ:</span>{item.size}
                                          </span>
                                      )}
                                    </div>

                                    <div className="flex justify-between mt-1">
                                        <span className="font-retro text-sm">x{item.quantity}</span>
                                        <span className="font-retro text-sm font-bold">${item.price * item.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t-2 border-gray-300 pt-4 space-y-2 font-retro text-lg">
                        <div className="flex justify-between text-gray-600">
                            <span>SUBTOTAL</span>
                            <span>${total}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>SHIPPING</span>
                            <span>FREE</span>
                        </div>
                        <div className="flex justify-between text-snes-purple font-bold text-xl pt-2 border-t border-gray-300">
                            <span>TOTAL</span>
                            <span>${total}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-black/5 p-4 border-2 border-gray-300 rounded text-center">
                    <Lock className="w-5 h-5 mx-auto mb-2 text-gray-500" />
                    <p className="font-pixel text-xs text-gray-500 leading-relaxed">
                        256-BIT ENCRYPTION ACTIVE.<br/>
                        ALL TRANSACTIONS SECURED BY GEMINI PROTOCOL.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
