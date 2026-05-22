/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Check, Copy, CheckCircle2, Award, RotateCcw } from 'lucide-react';
import { BetSlip } from '../types';

interface UnlockedSlipViewProps {
  slip: BetSlip;
  lang?: string;
  onReset: () => void;
}

export const UnlockedSlipView: React.FC<UnlockedSlipViewProps> = ({ slip, onReset }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (company: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(company);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-2 mt-2">
      
      {/* Congratulatory success card */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-650/5 border border-green-500/30 rounded-3xl p-5 mb-6 text-center shadow-xl shadow-green-500/5 relative overflow-hidden">
        {/* Decorative corner medal badge */}
        <div className="absolute top-0 right-0 p-3">
          <Award className="w-8 h-8 text-green-400 opacity-20" />
        </div>

        <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-400 stroke-[3px]" />
        </div>
        
        <h2 className="text-xl font-bold font-display text-white tracking-wide">
          PAYMENT SUCCESSFUL
        </h2>
        <p className="text-xs text-zinc-400 mt-1 px-4 leading-normal font-sans">
          Interactive betslip unlocked! Copy the booking codes directly to your betting platforms.
        </p>

        {/* Highlight parameters summary tag */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">ODDS</span>
            <span className="text-sm font-extrabold text-white font-mono">{slip.odds.toFixed(2)}</span>
          </div>
          <div className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
            <span className="text-[10px] text-zinc-500 block uppercase tracking-wider">MATCHES</span>
            <span className="text-sm font-extrabold text-white font-mono">{slip.matches.length}</span>
          </div>
        </div>
      </div>

      {/* List of games / matches predictions */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Football Match Tips:
        </h3>

        {slip.matches.map((match) => (
          <div 
            key={match.id} 
            className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-sm hover:border-zinc-750 transition-all font-sans"
          >
            {/* League and Time */}
            <div className="flex justify-between items-center text-[10px] text-zinc-450 font-mono tracking-wide uppercase">
              <span>{match.league}</span>
              <span className="text-zinc-500">{match.startTime}</span>
            </div>

            {/* Teams row */}
            <div className="flex justify-between items-center my-2">
              <div className="flex flex-col text-sm font-bold text-white tracking-tight gap-0.5">
                <span>{match.homeTeam}</span>
                <span className="text-zinc-400 font-medium font-sans">vs</span>
                <span>{match.awayTeam}</span>
              </div>
              
              {/* Individual Odds tag */}
              <div className="px-3 py-1 bg-zinc-950 border border-zinc-850 rounded-lg text-center min-w-[50px] font-mono">
                <span className="text-xs text-zinc-500 block text-[9px] uppercase leading-none">odds</span>
                <span className="text-xs font-bold text-green-400">{match.odds.toFixed(2)}</span>
              </div>
            </div>

            {/* Prediction outcome tip banner */}
            <div className="mt-3 p-2 bg-zinc-950 rounded-xl border border-zinc-900/40 flex items-center justify-between text-xs font-sans">
              <span className="text-zinc-400">Prediction:</span>
              <span className="font-extrabold text-white tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                {match.prediction}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Booking codes grid */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Betting Platform Booking Codes:
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {Object.entries(slip.bookingCodes).map(([company, code]) => (
            <div 
              key={company} 
              className="p-3 bg-zinc-950 border border-zinc-850 rounded-2xl flex flex-col justify-between hover:border-zinc-805 transition-all font-sans"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400 font-bold uppercase truncate max-w-[70px]">
                  {company}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center justify-between mt-3 bg-zinc-900 px-3 py-2 rounded-xl border border-zinc-850">
                <span className="text-xs font-black font-mono tracking-wider text-white select-all">
                  {code}
                </span>
                <button
                  onClick={() => handleCopyCode(company, String(code))}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedCode === company ? (
                    <Check className="w-3.5 h-3.5 text-green-400 stroke-[3px]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="flex flex-col gap-2 mb-8">
        <button
          onClick={onReset}
          className="w-full py-3 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-800 rounded-xl border border-zinc-850 text-xs font-bold tracking-wide text-zinc-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-sans uppercase"
        >
          <RotateCcw className="w-3.5 h-3.5 text-green-500" />
          <span>Exit Slip & Return Home</span>
        </button>
      </div>

    </div>
  );
};
