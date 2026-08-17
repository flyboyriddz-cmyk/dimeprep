import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '../constants';
import { generateOrderPDF } from '../utils/orderPdfGenerator';
import { vibrate, HAPTICS } from '../utils/haptics';
import { 
  Package, 
  Search, 
  Clock, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Hash, 
  Mail, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight,
  ExternalLink,
  Zap,
  Box,
  FileText,
  Download
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type OrderStatus = 'verified' | 'processing' | 'in_transit' | 'delivered' | 'cancelled' | string;

export interface DBOrder {
  order_id: string;
  transaction_id?: string;
  amount: number;
  currency: string;
  customer_email: string;
  status: OrderStatus;
  items?: Array<{ id: string; quantity?: number; q?: number; size?: string }>;
  created_at: string;
  shipping_address?: string;
  tracking_number?: string;
  carrier?: string;
  estimated_delivery?: string;
}

// Sample fallback orders for sandbox demonstration when Supabase is not connected
const SAMPLE_ORDERS: DBOrder[] = [
  {
    order_id: 'ord_987f2e1a-5b6c-4821-99cd-3f1122334455',
    transaction_id: 'pi_3Nx829dpGemsVerified001',
    amount: 19600,
    currency: 'gbp',
    customer_email: 'operative.zero@dpgems.io',
    status: 'in_transit',
    tracking_number: 'DP-GEMS-TRK-77492',
    carrier: 'SECTOR-1 AIR TRANSPORT',
    estimated_delivery: '2026-08-20',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: 'DP-014', quantity: 1 }, // Sector core hoodie (Archived/Vaulted)
      { id: 'DPGEMS-0080', quantity: 1 } // GSM Signal Chassis
    ]
  },
  {
    order_id: 'ord_e34a12bc-89ef-4321-bca1-7890abcdef12',
    transaction_id: 'pi_3Nx830dpGemsVerified002',
    amount: 9800,
    currency: 'gbp',
    customer_email: 'vault.runner@dpgems.io',
    status: 'processing',
    tracking_number: 'DP-GEMS-TRK-88102',
    carrier: 'METRO COURIER DISPATCH',
    estimated_delivery: '2026-08-22',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: 'DP-015', quantity: 1 } // Sector core sweatpants (Archived/Vaulted)
    ]
  },
  {
    order_id: 'ord_c77d98ee-1234-5678-9abc-def012345678',
    transaction_id: 'pi_3Nx831dpGemsVerified003',
    amount: 28000,
    currency: 'gbp',
    customer_email: 'cyber.collector@dpgems.io',
    status: 'delivered',
    tracking_number: 'DP-GEMS-TRK-99041',
    carrier: 'GLOBAL EXTRACTION LOGISTICS',
    estimated_delivery: '2026-08-14',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { id: 'DPGEMS-0081', quantity: 1 },
      { id: 'DP-011', quantity: 1 } // Geo mesh bucket (Archived)
    ]
  }
];

export const OrderTracker: React.FC = () => {
  const [searchMode, setSearchMode] = useState<'uuid' | 'email'>('uuid');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PROCESSING' | 'IN_TRANSIT' | 'DELIVERED'>('ALL');

  // Helper to copy Order UUID
  const handleCopyUUID = (uuid: string) => {
    vibrate(HAPTICS.light);
    navigator.clipboard.writeText(uuid);
    setCopiedId(uuid);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to trigger brutalist PDF manifest export
  const handleDownloadPDF = async (order: DBOrder) => {
    try {
      vibrate(HAPTICS.medium);
      setDownloadingId(order.order_id);
      // Small tick for tactile UI feel
      await new Promise(resolve => setTimeout(resolve, 200));
      generateOrderPDF(order, getProductDetails);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  // Resolve true product metadata regardless of isArchived state (Preserving historical purchase integrity)
  const getProductDetails = (itemId: string) => {
    const product = PRODUCTS.find(p => p.id === itemId || p.variants?.some(v => v.id === itemId));
    return product || { 
      id: itemId, 
      name: 'CLASSIFIED ITEM (VAULT RECORD)', 
      image: 'https://placehold.co/400x400/111/FFF?text=HISTORICAL+RECORD', 
      price: 0, 
      category: 'ARCHIVE',
      isArchived: true 
    };
  };

  // Perform secure lookup by UUID or Email
  const executeSearch = async (queryToSearch?: string) => {
    const query = (queryToSearch !== undefined ? queryToSearch : searchQuery).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      if (supabase) {
        let req = supabase.from('orders').select('*');

        if (searchMode === 'uuid' || (!query.includes('@') && query.length > 5)) {
          // Look up by exact secure order_id or transaction_id
          req = req.or(`order_id.eq.${query},transaction_id.eq.${query}`);
        } else {
          // Look up by email address
          req = req.eq('customer_email', query).order('created_at', { ascending: false });
        }

        const { data, error: dbError } = await req;

        if (dbError) {
          throw dbError;
        }

        if (data && data.length > 0) {
          setOrders(data as DBOrder[]);
          setLoading(false);
          return;
        }
      }

      // Check local / sample fallback records for matching test query
      const sampleMatches = SAMPLE_ORDERS.filter(o => {
        if (searchMode === 'uuid' || (!query.includes('@') && query.length > 5)) {
          return o.order_id.toLowerCase().includes(query.toLowerCase()) || 
                 (o.transaction_id && o.transaction_id.toLowerCase().includes(query.toLowerCase())) ||
                 query.toLowerCase().includes(o.order_id.toLowerCase());
        } else {
          return o.customer_email.toLowerCase() === query.toLowerCase();
        }
      });

      if (sampleMatches.length > 0) {
        setOrders(sampleMatches);
      } else {
        setOrders([]);
      }

    } catch (err: any) {
      console.error('Order query error:', err);
      // Fallback search in sample records if database query failed
      const sampleMatches = SAMPLE_ORDERS.filter(o => 
        o.order_id.toLowerCase().includes(query.toLowerCase()) || 
        o.customer_email.toLowerCase() === query.toLowerCase()
      );
      if (sampleMatches.length > 0) {
        setOrders(sampleMatches);
      } else {
        setError(err.message || 'DATABASE_UPLINK_FAILED: Could not retrieve order status.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  // Helper to normalize status into standard lifecycle stages
  const getStatusStepIndex = (status: OrderStatus): number => {
    const s = String(status || '').toLowerCase().trim();
    if (s.includes('deliver') || s === 'completed') return 3;
    if (s.includes('transit') || s.includes('shipped') || s.includes('en_route')) return 2;
    if (s.includes('process') || s.includes('packing') || s.includes('vault')) return 1;
    return 0; // Verified / Placed
  };

  const getStatusBadge = (status: OrderStatus) => {
    const s = String(status || '').toLowerCase().trim();
    if (s.includes('deliver') || s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1.5 bg-snes-green/10 border-2 border-snes-green text-snes-green px-3 py-1 font-pixel text-xs uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          DELIVERED
        </span>
      );
    }
    if (s.includes('transit') || s.includes('shipped')) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-snes-blue/15 border-2 border-snes-blue text-snes-blue px-3 py-1 font-pixel text-xs uppercase tracking-wider animate-pulse">
          <Truck className="w-3.5 h-3.5" />
          IN TRANSIT
        </span>
      );
    }
    if (s.includes('process') || s.includes('packing')) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-snes-yellow/20 border-2 border-snes-yellow text-snes-dark px-3 py-1 font-pixel text-xs uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-snes-dark" />
          PROCESSING
        </span>
      );
    }
    if (s.includes('cancel') || s.includes('fail')) {
      return (
        <span className="inline-flex items-center gap-1.5 bg-snes-red/10 border-2 border-snes-red text-snes-red px-3 py-1 font-pixel text-xs uppercase tracking-wider">
          <AlertCircle className="w-3.5 h-3.5" />
          CANCELLED
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 bg-snes-purple/10 border-2 border-snes-purple text-snes-purple px-3 py-1 font-pixel text-xs uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5" />
        VERIFIED
      </span>
    );
  };

  // Filter orders by status tab if multiple orders returned
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'ALL') return true;
    const step = getStatusStepIndex(order.status);
    if (statusFilter === 'PROCESSING') return step === 0 || step === 1;
    if (statusFilter === 'IN_TRANSIT') return step === 2;
    if (statusFilter === 'DELIVERED') return step === 3;
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-8">
      {/* Main Terminal Header & Tracker Box */}
      <div className="bg-snes-light border-4 border-snes-dark shadow-retro p-6 md:p-8 relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b-4 border-snes-dark pb-4">
          <div>
            <div className="flex items-center gap-2 text-snes-purple font-pixel text-xs tracking-widest uppercase mb-1">
              <Zap className="w-4 h-4 text-snes-yellow fill-current" />
              <span>D.P GEMS // SECURE TELEMETRY & ORDER DISPATCH</span>
            </div>
            <h1 className="font-retro text-3xl md:text-4xl text-snes-dark tracking-tight uppercase flex items-center gap-3">
              <Package className="w-8 h-8 text-snes-purple" />
              OPERATIVE ORDER TRACKER
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white border-2 border-snes-dark px-3 py-1.5 font-pixel text-xs text-snes-gray-dark uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-snes-green animate-pulse"></span>
            <span>UPLINK: ACTIVE</span>
          </div>
        </div>

        {/* Search Mode Toggles */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              setSearchMode('uuid');
              setSearchQuery('');
            }}
            className={`font-pixel text-sm px-4 py-2 border-2 transition-all flex items-center gap-2 uppercase ${
              searchMode === 'uuid'
                ? 'bg-snes-purple text-white border-snes-dark shadow-[3px_3px_0_#000] -translate-y-0.5'
                : 'bg-white text-snes-dark border-gray-300 hover:border-snes-purple'
            }`}
          >
            <Hash className="w-4 h-4" />
            TRACK BY SECURE ORDER UUID
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchMode('email');
              setSearchQuery('');
            }}
            className={`font-pixel text-sm px-4 py-2 border-2 transition-all flex items-center gap-2 uppercase ${
              searchMode === 'email'
                ? 'bg-snes-purple text-white border-snes-dark shadow-[3px_3px_0_#000] -translate-y-0.5'
                : 'bg-white text-snes-dark border-gray-300 hover:border-snes-purple'
            }`}
          >
            <Mail className="w-4 h-4" />
            TRACK BY OPERATIVE EMAIL
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-snes-gray-dark font-pixel">
              {searchMode === 'uuid' ? <Hash className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </div>
            <input
              type={searchMode === 'email' ? 'email' : 'text'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchMode === 'uuid' 
                  ? 'ENTER ORDER UUID (e.g. ord_987f2e1a-5b6c-4821...)' 
                  : 'ENTER OPERATIVE EMAIL (e.g. operative.zero@dpgems.io)'
              }
              className="w-full bg-white border-3 border-snes-dark pl-11 pr-4 py-3.5 font-pixel text-sm md:text-base focus:outline-none focus:border-snes-purple shadow-inner text-snes-dark uppercase placeholder:normal-case"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="bg-snes-blue text-white px-8 py-3.5 font-retro text-lg tracking-widest hover:bg-snes-blue/90 border-b-4 border-[#004ba0] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase shrink-0"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>QUERYING...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>FETCH TELEMETRY</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Query Helper Pills for Instant Testing */}
        <div className="border-t-2 border-dashed border-gray-300 pt-3 pb-1">
          <p className="font-pixel text-xs text-snes-gray-dark uppercase mb-2 flex items-center gap-1.5">
            <span>[QUICK_TELEMETRY_KEYS]:</span>
            <span className="opacity-70 font-normal">Click any sample UUID to simulate live database status retrieval</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_ORDERS.map((sample) => (
              <button
                key={sample.order_id}
                type="button"
                onClick={() => {
                  setSearchMode('uuid');
                  setSearchQuery(sample.order_id);
                  executeSearch(sample.order_id);
                }}
                className="font-pixel text-[11px] bg-white border border-gray-300 hover:border-snes-purple hover:text-snes-purple px-2.5 py-1 rounded flex items-center gap-1.5 transition-all text-left group"
              >
                <span className="font-bold text-snes-dark group-hover:text-snes-purple">
                  {sample.status.toUpperCase()} :
                </span>
                <span className="font-mono text-gray-500">
                  {sample.order_id.substring(0, 16)}...
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-snes-red/10 border-2 border-snes-red text-snes-red p-4 font-pixel text-sm my-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase">TELEMETRY DECRYPTION ERROR</p>
              <p className="opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State when searched */}
        {searched && !loading && orders.length === 0 && !error && (
          <div className="text-center p-12 border-3 border-dashed border-gray-400 bg-white/60 font-pixel text-gray-600 space-y-3 my-6">
            <Box className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-lg uppercase font-bold text-snes-dark">NO ORDER FOUND IN TELEMETRY LOGS</p>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              No matching records for query: <span className="text-snes-purple font-mono font-bold">{searchQuery}</span>. 
              Verify your order UUID or email address and try again.
            </p>
          </div>
        )}

        {/* Status Filter for Multi-order search */}
        {orders.length > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-snes-dark/20 mt-6">
            <span className="font-pixel text-xs text-snes-gray-dark uppercase">
              FILTER STATUS ({orders.length} RECORDS FOUND):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['ALL', 'PROCESSING', 'IN_TRANSIT', 'DELIVERED'] as const).map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setStatusFilter(filterKey)}
                  className={`font-pixel text-xs px-3 py-1 border transition-all uppercase ${
                    statusFilter === filterKey
                      ? 'bg-snes-dark text-white border-snes-dark'
                      : 'bg-white text-snes-dark border-gray-300 hover:border-snes-purple'
                  }`}
                >
                  {filterKey.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order Results List */}
        <div className="space-y-8 mt-6">
          {filteredOrders.map((order) => {
            const stepIndex = getStatusStepIndex(order.status);
            const isDelivered = stepIndex === 3;
            const isInTransit = stepIndex === 2;
            const isProcessing = stepIndex === 1;
            const isVerified = stepIndex === 0;

            return (
              <div 
                key={order.order_id} 
                className="border-4 border-snes-dark bg-white shadow-md overflow-hidden relative"
              >
                {/* Order Top Bar */}
                <div className="bg-snes-dark text-white p-4 font-pixel text-xs md:text-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-4 border-snes-dark">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-snes-yellow font-bold uppercase">[ORDER_UUID]:</span>
                    <span className="font-mono text-gray-200 select-all bg-black/40 px-2 py-0.5 rounded border border-gray-700">
                      {order.order_id}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyUUID(order.order_id)}
                      className="text-gray-300 hover:text-snes-yellow transition-colors p-1"
                      title="Copy Secure Order UUID"
                    >
                      {copiedId === order.order_id ? (
                        <Check className="w-4 h-4 text-snes-green" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300 text-xs flex-wrap">
                    <span>PLACED: {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    
                    {/* Top Bar Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(order)}
                      disabled={downloadingId === order.order_id}
                      className="bg-white hover:bg-snes-yellow text-snes-dark font-pixel text-xs px-2.5 py-1 border border-black transition-colors flex items-center gap-1.5 uppercase disabled:opacity-50"
                      title="Download clean brutalist PDF summary"
                    >
                      {downloadingId === order.order_id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-snes-purple" />
                          <span>EXPORTING...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3 text-snes-purple" />
                          <span>PDF MANIFEST</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Status Header & Badges */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b-2 border-gray-200">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-pixel text-xs text-snes-gray-dark uppercase">CURRENT STATUS:</span>
                        {getStatusBadge(order.status)}
                      </div>
                      {order.carrier && (
                        <p className="font-pixel text-xs text-gray-500 uppercase flex items-center gap-1.5 pt-1">
                          <Truck className="w-3.5 h-3.5 text-snes-purple" />
                          <span>CARRIER: {order.carrier}</span>
                          {order.tracking_number && (
                            <span className="font-mono text-snes-dark font-bold ml-1">
                              // WAYBILL: {order.tracking_number}
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="text-left md:text-right">
                      <span className="font-pixel text-xs text-snes-gray-dark uppercase block">TRANSACTION TOTAL</span>
                      <span className="font-retro text-2xl md:text-3xl font-black text-snes-purple">
                        {order.currency === 'gbp' || order.currency === 'GBP' ? '£' : '$'}
                        {(order.amount / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* VISUAL STATUS TIMELINE: Processing -> In Transit -> Delivered */}
                  <div className="bg-snes-light border-2 border-snes-dark/40 p-4 md:p-6 rounded-none">
                    <div className="font-pixel text-xs text-snes-gray-dark uppercase tracking-wider mb-4 flex items-center justify-between">
                      <span>[DISPATCH_LIFECYCLE_TIMELINE]</span>
                      {order.estimated_delivery && (
                        <span className="text-snes-purple font-bold">
                          EST. EXTRACTION: {new Date(order.estimated_delivery).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Progress Bar with Steps */}
                    <div className="relative my-6">
                      {/* Connecting Background Line */}
                      <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1.5 bg-gray-300 z-0"></div>
                      
                      {/* Active Fill Line */}
                      <div 
                        className="absolute top-1/2 left-4 -translate-y-1/2 h-1.5 bg-snes-purple transition-all duration-700 z-0"
                        style={{
                          width: stepIndex === 3 ? 'calc(100% - 2rem)' : stepIndex === 2 ? '66%' : stepIndex === 1 ? '33%' : '5%'
                        }}
                      ></div>

                      <div className="grid grid-cols-4 relative z-10 text-center">
                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 md:w-10 md:h-10 border-2 border-snes-dark flex items-center justify-center font-pixel text-xs md:text-sm font-bold shadow-sm transition-all ${
                            stepIndex >= 0 ? 'bg-snes-purple text-white ring-2 ring-snes-purple/30' : 'bg-white text-gray-400'
                          }`}>
                            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <span className="font-pixel text-[11px] md:text-xs mt-2 uppercase font-bold text-snes-dark">
                            VERIFIED
                          </span>
                          <span className="font-pixel text-[9px] text-gray-500 uppercase hidden sm:block">
                            PAYMENT CLEARED
                          </span>
                        </div>

                        {/* Step 2: Processing */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 md:w-10 md:h-10 border-2 border-snes-dark flex items-center justify-center font-pixel text-xs md:text-sm font-bold shadow-sm transition-all ${
                            stepIndex >= 1 ? 'bg-snes-purple text-white ring-2 ring-snes-purple/30' : 'bg-white text-gray-400'
                          }`}>
                            <Clock className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <span className={`font-pixel text-[11px] md:text-xs mt-2 uppercase font-bold ${
                            isProcessing ? 'text-snes-purple animate-pulse' : 'text-snes-dark'
                          }`}>
                            PROCESSING
                          </span>
                          <span className="font-pixel text-[9px] text-gray-500 uppercase hidden sm:block">
                            VAULT PACKING
                          </span>
                        </div>

                        {/* Step 3: In Transit */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 md:w-10 md:h-10 border-2 border-snes-dark flex items-center justify-center font-pixel text-xs md:text-sm font-bold shadow-sm transition-all ${
                            stepIndex >= 2 ? 'bg-snes-blue text-white ring-2 ring-snes-blue/30 animate-pulse' : 'bg-white text-gray-400'
                          }`}>
                            <Truck className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <span className={`font-pixel text-[11px] md:text-xs mt-2 uppercase font-bold ${
                            isInTransit ? 'text-snes-blue' : 'text-snes-dark'
                          }`}>
                            IN TRANSIT
                          </span>
                          <span className="font-pixel text-[9px] text-gray-500 uppercase hidden sm:block">
                            AIR COURIER
                          </span>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 md:w-10 md:h-10 border-2 border-snes-dark flex items-center justify-center font-pixel text-xs md:text-sm font-bold shadow-sm transition-all ${
                            stepIndex >= 3 ? 'bg-snes-green text-white ring-2 ring-snes-green/30' : 'bg-white text-gray-400'
                          }`}>
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <span className={`font-pixel text-[11px] md:text-xs mt-2 uppercase font-bold ${
                            isDelivered ? 'text-snes-green' : 'text-snes-dark'
                          }`}>
                            DELIVERED
                          </span>
                          <span className="font-pixel text-[9px] text-gray-500 uppercase hidden sm:block">
                            SECURE DROP OK
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Purchased Items List (Preserving Vaulted / Archived Items) */}
                  <div className="space-y-3">
                    <h3 className="font-pixel text-xs text-snes-gray-dark uppercase tracking-wider flex items-center justify-between border-b border-gray-200 pb-2">
                      <span>ORDERED ARTIFACTS ({order.items?.length || 0})</span>
                      <span className="text-[10px] text-gray-400">HISTORICAL VAULT RESOLUTION: ACTIVE</span>
                    </h3>

                    {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {order.items.map((item, idx) => {
                          const details = getProductDetails(item.id);
                          const quantity = item.quantity || item.q || 1;

                          return (
                            <div 
                              key={`${item.id}-${idx}`} 
                              className="flex gap-3 items-center bg-gray-50 p-3 border-2 border-gray-200 relative overflow-hidden"
                            >
                              <div className="w-16 h-16 bg-white border border-gray-300 p-1 shrink-0 flex items-center justify-center">
                                <img 
                                  src={details.image} 
                                  alt={details.name} 
                                  className="w-full h-full object-contain"
                                  loading="lazy"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-retro text-sm uppercase text-snes-dark font-bold truncate">
                                  {details.name}
                                </h4>
                                
                                <div className="flex flex-wrap items-center gap-2 mt-1 font-pixel text-xs text-gray-500">
                                  <span className="bg-snes-gray-dark text-white px-1.5 py-0.5 rounded text-[10px]">
                                    QTY: {quantity}
                                  </span>
                                  {item.size && (
                                    <span className="border border-gray-400 px-1 rounded text-[10px]">
                                      SZ: {item.size}
                                    </span>
                                  )}
                                  <span className="font-bold text-snes-dark">
                                    {order.currency === 'gbp' || order.currency === 'GBP' ? '£' : '$'}
                                    {details.price}
                                  </span>
                                </div>

                                {details.isArchived && (
                                  <div className="mt-1.5 inline-block">
                                    <span className="font-pixel text-[10px] bg-snes-dark text-snes-yellow px-1.5 py-0.5 uppercase border border-snes-yellow/40">
                                      [VAULTED // ARCHIVED ITEM]
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="font-pixel text-xs text-gray-500 uppercase">
                        Item metadata stored securely in encrypted Stripe metadata payload.
                      </p>
                    )}
                  </div>

                  {/* Order Telemetry Metadata & Audit Trail */}
                  <div className="bg-gray-100 p-4 border-2 border-snes-dark/30 font-pixel text-xs text-snes-gray-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div>
                        <span>CUSTOMER PROTOCOL: <strong className="text-snes-dark">{order.customer_email}</strong></span>
                      </div>
                      {order.transaction_id && (
                        <div>
                          <span>STRIPE GATEWAY ID: <strong className="font-mono text-snes-dark">{order.transaction_id}</strong></span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadPDF(order)}
                      disabled={downloadingId === order.order_id}
                      className="bg-snes-dark hover:bg-snes-purple text-white border-2 border-black font-pixel text-xs md:text-sm px-4 py-2.5 flex items-center gap-2 shadow-[3px_3px_0_#000] active:translate-y-0.5 active:shadow-none transition-all uppercase disabled:opacity-50 shrink-0"
                    >
                      {downloadingId === order.order_id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-snes-yellow" />
                          <span>GENERATING PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-snes-yellow" />
                          <span>DOWNLOAD BRUTALIST PDF MANIFEST</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
