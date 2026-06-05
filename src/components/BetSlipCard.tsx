/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { BetSlip } from '../types';

interface BetSlipCardProps {
  slip: BetSlip;
  onInitiatePayment?: () => void;
}

const countryPrices = [
  { country: 'Tanzania', flag: '🇹🇿', price: 'Tzs 3,000/=', code: 'TZS' },
  { country: 'Kenya', flag: '🇰🇪', price: '250 KES', code: 'KES' },
  { country: 'Uganda', flag: '🇺🇬', price: '8,000 UGX', code: 'UGX' },
  { country: 'Ghana', flag: '🇬🇭', price: '40 Cedi', code: 'GHS' },
  { country: 'Nigeria', flag: '🇳🇬', price: '4,000 NGN', code: 'NGN' },
  { country: 'Other Countries', flag: '🌐', price: '5$', code: 'USD' },
];

export const BetSlipCard: React.FC<BetSlipCardProps> = ({ slip }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 19, minutes: 12, seconds: 34 });
  const [showInstructions, setShowInstructions] = useState(false);
  const [showPrices, setShowPrices] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(countryPrices[0]);

  const handleRedirectToWhatsapp = () => {
    const phoneNumber = "255794802155";
    const message = `Hello, I would like to get this live bet ticket with ${slip.odds.toFixed(2)} odds. My country is ${selectedPrice.country} (Price: ${selectedPrice.price}).`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(slip.validityTime) - +new Date();
      if (difference <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 65) % 60;
      const seconds = Math.floor((difference / 1000) % 60);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [slip.validityTime]);

  const padZero = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-6 text-white font-sans selection:bg-green-500/20">
      
      {/* 1. Large Odds & Subtitle Section */}
      <div className="flex flex-col mb-4">
        <span className="text-[52px] font-extrabold tracking-tight text-white leading-none font-sans">
          {slip.odds.toFixed(2)}
        </span>
        <span className="text-[13px] text-zinc-500 font-medium tracking-wide mt-1.5 pl-0.5">
          Odds
        </span>
      </div>

      {/* Thin Horizontal Divider */}
      <div className="w-full h-[1px] bg-zinc-800/40" />

      {/* 2. Validity Time & Price Row */}
      <div className="flex items-center justify-between py-5 relative">
        <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium">
          <span className="text-[13px] text-zinc-455">Validity Time</span>
          <span className="text-zinc-550">•</span>
          <span className="font-bold text-white tracking-wide">
            {padZero(timeLeft.hours)}h {padZero(timeLeft.minutes)}m {padZero(timeLeft.seconds)}s
          </span>
        </div>

        <div className="text-right flex flex-col items-end">
          <button
            onClick={() => setShowPrices(!showPrices)}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-750 transition-all border border-zinc-800 rounded-xl cursor-pointer active:scale-95 group focus:outline-none"
          >
            <span className="text-xs text-zinc-400 font-bold font-sans uppercase">Country Price:</span>
            <span className="text-sm font-black text-green-400 tracking-tight font-mono">
              {selectedPrice.price}
            </span>
            {showPrices ? (
              <ChevronUp className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            ) : (
              <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Inline Dropdown Country Prices Panel selector with glossy finish */}
      {showPrices && (
        <div className="mb-4 p-4 bg-[#0a0c10] border border-orange-500/20 rounded-2xl shadow-2xl animate-fadeIn font-sans">
          <div className="text-[10px] text-zinc-500 font-extrabold tracking-wider uppercase pb-2.5 flex justify-between items-center border-b border-zinc-900">
            <span>SELECT COUNTRY</span>
            <span className="text-orange-400">COUNTRY PRICES</span>
          </div>
          <div className="divide-y divide-zinc-900/50 max-h-[220px] overflow-y-auto pr-1">
            {countryPrices.map((cp) => (
              <button
                key={cp.country}
                onClick={() => {
                  setSelectedPrice(cp);
                  setShowPrices(false);
                }}
                className={`w-full text-left py-3 px-2 flex justify-between items-center transition-colors rounded-xl mt-1 first:mt-2 cursor-pointer ${
                  selectedPrice.country === cp.country
                    ? 'bg-zinc-900 text-green-400 font-black'
                    : 'text-zinc-300 hover:bg-zinc-900/30'
                }`}
              >
                <span className="flex items-center gap-2.5 text-xs font-semibold">
                  <span className="text-base select-none">{cp.flag}</span>
                  <span>{cp.country}</span>
                </span>
                <span className="font-mono text-xs font-black text-white bg-zinc-950/40 px-3 py-1 rounded-lg border border-zinc-900">
                  {cp.price}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thin Horizontal Divider */}
      <div className="w-full h-[1px] bg-zinc-800/40" />

      {/* 3. Bet Companies Section */}
      <div className="mt-5 mb-5">
        <h3 className="text-[16px] font-bold text-white tracking-wide mb-3">
          Bet Companies
        </h3>
        
        {/* Sleek Row of Authentic Betting Platforms Logos matching the screenshot */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
          
          {/* COLDBET Brand */}
          <div className="px-2 py-1.5 rounded bg-zinc-950 border border-cyan-400/40 flex items-center justify-center min-w-[76px] shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.1)]">
            <span className="text-[10px] font-black tracking-tighter text-cyan-400 font-sans">
              COLD<span className="text-white">BET</span>
            </span>
          </div>

          {/* SportyBet Brand */}
          <div className="px-2 py-1.5 rounded-sm bg-red-600 flex items-center justify-center min-w-[76px] shrink-0">
            <span className="text-[10px] font-extrabold text-white tracking-tight uppercase flex items-center justify-center gap-0.5">
              Sporty<span className="bg-white text-red-600 px-0.5 rounded-sm font-black py-0">Bet</span>
            </span>
          </div>

          {/* Sokabet Brand */}
          <div className="px-2.5 py-1.5 rounded bg-white flex items-center justify-center min-w-[76px] shrink-0 border border-zinc-200">
            <div className="flex items-center gap-1">
              {/* Soccer Ball icon */}
              <div className="w-3 h-3 rounded-full bg-zinc-900 flex items-center justify-center relative">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              </div>
              <span className="text-[9px] font-black text-blue-900 tracking-tighter uppercase">
                Soka<span className="text-red-600 font-black">bet</span>
              </span>
            </div>
          </div>

          {/* betPawa Brand */}
          <div className="px-2.5 py-1.5 rounded-sm bg-white flex items-center justify-center min-w-[76px] shrink-0 border border-zinc-200 shadow-sm">
            <span className="text-[10px] font-black text-zinc-900 tracking-tighter flex items-center leading-none">
              bet<span className="text-[#00e676] font-black pl-0.5">Pawa</span>
            </span>
          </div>

          {/* betway Brand */}
          <div className="px-1 py-1.5 flex items-center justify-center min-w-[62px] shrink-0">
            <span className="text-xs font-extrabold tracking-tighter text-white">
              bet<span className="text-white font-medium">way</span>
            </span>
          </div>

        </div>
      </div>      {/* Interactive English Ticket Guide Instructions Collapsible */}
      <div className="mb-6 font-sans">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className={`w-full py-3.5 px-4 rounded-xl border text-xs font-bold tracking-wide transition-all duration-250 flex items-center justify-between cursor-pointer active:scale-[0.98] ${
            showInstructions 
              ? 'bg-orange-500/15 border-orange-500/40 text-orange-400' 
              : 'bg-zinc-900/80 hover:bg-zinc-900 border-zinc-850 text-zinc-300 hover:text-white hover:border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${showInstructions ? 'bg-orange-400 animate-pulse' : 'bg-[#e67e22]'}`} />
            <span className="font-semibold uppercase tracking-wider text-[11px]">HOW TO ACCESS TICKET (TIPOVA LIVE BET)</span>
          </div>
          <span className="text-[9px] font-mono font-bold bg-black/40 px-2 py-0.5 rounded text-zinc-400">
            {showInstructions ? 'HIDE GUIDE ▲' : 'VIEW GUIDE ▼'}
          </span>
        </button>

        {showInstructions && (
          <div className="mt-3.5 p-5 bg-gradient-to-br from-zinc-900/80 to-zinc-950 border border-orange-500/20 rounded-[22px] shadow-xl animate-fadeIn">
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500/80" />
              <h4 className="text-[11px] font-black uppercase tracking-wider text-orange-400 font-sans">
                Purchasing Instructions & Guide
              </h4>
            </div>

            <div className="space-y-4 text-xs text-zinc-300 font-sans">
              <div className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 font-bold text-[10px] shrink-0 border border-orange-500/20 font-mono">
                  1
                </span>
                <p className="leading-relaxed text-zinc-300 text-[11.5px]">
                  Ensure you verify the ticket price according to your country, as detailed pricing is structured individually for each location.
                </p>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 font-bold text-[10px] shrink-0 border border-orange-500/20 font-mono">
                  2
                </span>
                <p className="leading-relaxed text-zinc-300 text-[11.5px]">
                  Take a close look at the cumulative <span className="text-white font-bold font-mono">Odds</span> of the betslip to make sure it is profitable for your goals.
                </p>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 font-bold text-[10px] shrink-0 border border-orange-500/20 font-mono">
                  3
                </span>
                <p className="leading-relaxed text-zinc-300 text-[11.5px]">
                  If you are interested, make sure to contact the Admin by clicking the <span className="text-green-400 font-bold">"Buy betslip"</span> button below.
                </p>
              </div>

              <div className="flex gap-2.5 items-start">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 font-bold text-[10px] shrink-0 border border-orange-500/20 font-mono">
                  4
                </span>
                <p className="leading-relaxed text-zinc-300 text-[11.5px]">
                  Ensure that you only contact the Admin <span className="text-white font-bold">when you are fully ready</span> to complete the payment.
                </p>
              </div>
            </div>

            <div className="mt-4.5 pt-3.5 border-t border-zinc-900/60 flex gap-2.5 items-start">
              <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded tracking-wide uppercase leading-none mt-0.5 shrink-0 border border-orange-500/15 font-mono">
                NB
              </span>
              <p className="text-[10.5px] text-zinc-400 italic leading-relaxed font-sans">
                Please make sure to read and fully understand these guidelines before purchasing a ticket.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Beautiful Pastel Glassmorphism Blurred Container */}
      <div 
        onClick={handleRedirectToWhatsapp}
        className="relative w-full aspect-[1.12/1] rounded-[24px] overflow-hidden cursor-pointer group shadow-2xl transition-all duration-300 hover:border-zinc-700/60 bg-zinc-950/20"
      >
        {/* Gorgeous multi-color background soft gradients simulating the screenshot's color profile */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-80 mix-blend-screen">
            {/* Soft Peach Top Accent */}
            <div className="absolute top-0 left-1/4 w-[160px] h-[160px] rounded-full bg-orange-200/40 filter blur-[40px]" />
            {/* Mint Green / Aqua Accent */}
            <div className="absolute bottom-10 right-10 w-[220px] h-[220px] rounded-full bg-teal-400/30 filter blur-[50px]" />
            {/* Soft Purple/Blue Anchor Accent */}
            <div className="absolute bottom-4 left-5 w-[180px] h-[180px] rounded-full bg-purple-300/20 filter blur-[45px]" />
            {/* Yellow sunset shine */}
            <div className="absolute top-12 right-6 w-[150px] h-[150px] rounded-full bg-yellow-100/35 filter blur-[42px]" />
          </div>
          
          {/* Solid glass base */}
          <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-[24px]" />
        </div>

        {/* Central Overlay Box */}
        <div className="absolute inset-0 flex items-center justify-center z-10 p-4">
          
          {/* Gray View betslip capsule Button mimicking screenshot exactly */}
          <div 
            className="px-6 py-3.5 bg-[#424d4e]/70 border border-[#eff3f3]/10 backdrop-blur-xl rounded-[18px] flex items-center justify-center gap-2.5 transition-all duration-300 group-hover:bg-[#4d595a]/80 shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-95"
          >
            <span className="text-white text-[14px] font-bold tracking-tight">
              View betslip
            </span>
            <Eye className="w-5 h-5 text-white/90 stroke-[2px]" />
          </div>

        </div>

        {/* Shimmer glaze highlights */}
        <div className="absolute inset-0 z-5 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent pointer-events-none" />
      </div>

      {/* 5. Main Action bottom green glowing button */}
      <div className="mt-6 mb-10">
        <button
          onClick={handleRedirectToWhatsapp}
          className="w-full py-4.5 rounded-[16px] bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-350 hover:to-green-400 text-white text-base font-extrabold tracking-wide transition-all duration-200 shadow-[0_4px_24px_rgba(16,185,129,0.15)] active:scale-[0.99] flex items-center justify-center cursor-pointer"
        >
          Buy betslip
        </button>
      </div>

    </div>
  );
};
