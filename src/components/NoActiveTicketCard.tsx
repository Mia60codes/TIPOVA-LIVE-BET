/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, MessageSquare, ShieldAlert } from 'lucide-react';

export const NoActiveTicketCard: React.FC = () => {
  const handleContactAdmin = () => {
    const phoneNumber = "255794802155";
    const message = "Hello Admin! I am interested in the next Tipova Live Bet premium ticket. Please notify me once it is active.";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-8 text-white font-sans selection:bg-orange-500/20 text-center animate-fadeIn">
      {/* Visual Icon Container */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          {/* Soft outer glow */}
          <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-2xl w-24 h-24 -translate-x-1/4 -translate-y-1/4" />
          <div className="w-20 h-20 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-lg relative z-10">
            <ShieldAlert className="w-9 h-9 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Main Title */}
      <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans mb-3">
        No Active Ticket
      </h2>

      {/* Description */}
      <p className="text-[13px] text-zinc-400 leading-relaxed max-w-sm mx-auto mb-6">
        The validity period for the previous premium live bet ticket has expired. The next high-accuracy VIP betslip will be published shortly by TIPOVA TIPS.
      </p>

      {/* Thick/Sleek Ticket Information Box */}
      <div className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl mb-8 text-left space-y-3.5">
        <div className="flex gap-3 items-center">
          <Calendar className="w-5 h-5 text-zinc-500 shrink-0" />
          <div>
            <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-wider">Next Release</h4>
            <p className="text-[12.5px] font-bold text-white mt-0.5">Stay tuned or check in with Admin</p>
          </div>
        </div>
        
        <div className="w-full h-[1px] bg-zinc-900/40" />
        
        <div className="flex gap-3 items-center">
          <MessageSquare className="w-5 h-5 text-green-500 shrink-0 select-none animate-pulse" />
          <div>
            <h4 className="text-[11px] font-black uppercase text-zinc-500 tracking-wider">Direct Access</h4>
            <p className="text-[12.5px] font-medium text-zinc-300 mt-0.5">
              Contact us to reserve your VIP slot in advance.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Admin / Check next release Button */}
      <button
        onClick={handleContactAdmin}
        className="w-full py-4 rounded-[16px] bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-sm font-extrabold tracking-wide transition-all duration-200 shadow-[0_4px_20px_rgba(16,185,129,0.12)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
      >
        Contact Admin on WhatsApp
      </button>

      <p className="mt-4 text-[11px] text-zinc-650 italic">
        *Available 24/7 for premium members & inquiries.
      </p>
    </div>
  );
};
