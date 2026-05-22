/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  color: string;
  logoColor: string;
  badgeContent: React.ReactNode;
}

interface PaymentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  odds: number;
  lang?: string;
  onStartTransaction: (operator: string, phone: string) => void;
}

export const PaymentBottomSheet: React.FC<PaymentBottomSheetProps> = ({
  isOpen,
  onClose,
  price,
  odds,
  onStartTransaction,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('Mpesa');
  const [phone, setPhone] = useState<string>('');
  const [phoneError, setPhoneError] = useState<string>('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'Mixx',
      name: 'Mixx',
      color: 'bg-[#facc15]',
      logoColor: 'text-black',
      badgeContent: (
        <span className="font-sans font-black text-black tracking-tight text-xs italic px-1 bg-yellow-400">
          Mixx <span className="text-[9px] align-super">Pay</span>
        </span>
      ),
    },
    {
      id: 'Mpesa',
      name: 'Mpesa',
      color: 'bg-[#e11d48]',
      logoColor: 'text-white',
      badgeContent: (
        <div className="flex items-center gap-1 bg-[#cf0a2c] px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="font-extrabold font-sans text-xs text-white">m-pesa</span>
        </div>
      ),
    },
    {
      id: 'Airtel Money',
      name: 'Airtel Money',
      color: 'bg-[#dc2626]',
      logoColor: 'text-white',
      badgeContent: (
        <div className="bg-[#b91c1c] px-2 py-0.5 rounded font-bold font-sans text-[10px] text-white tracking-tighter flex items-center gap-0.5">
          airtel
          <span className="text-[8px] bg-red-400/20 text-white rounded px-0.5 font-normal">money</span>
        </div>
      ),
    },
    {
      id: 'Halopesa',
      name: 'Halopesa',
      color: 'bg-[#ea580c]',
      logoColor: 'text-white',
      badgeContent: (
        <div className="bg-[#c2410c] px-2 py-0.5 rounded font-black font-mono text-[9px] text-white tracking-widest text-center uppercase">
          halo<span className="text-yellow-400">pesa</span>
        </div>
      ),
    },
    {
      id: 'Tigo Pesa',
      name: 'Tigo Pesa',
      color: 'bg-[#1d4ed8]',
      logoColor: 'text-white',
      badgeContent: (
        <div className="bg-[#1e40af] px-2 py-0.5 rounded font-black font-sans text-xs text-white tracking-tighter">
          tigo<span className="text-yellow-400">pesa</span>
        </div>
      ),
    },
  ];

  const handleValidationAndPay = () => {
    // Validate phone number formats representing Tanzanian/East African codes: start with 06, 07, 01 or 255
    const tzRegex = /^(?:0[167]\d{8}|255[167]\d{8})$/;
    const trimmed = phone.replace(/\s+/g, '');
    if (!trimmed) {
      setPhoneError('Phone number is required');
      return;
    }
    if (!tzRegex.test(trimmed)) {
      setPhoneError('Invalid phone format (Example: 0766123456 or 0655123456)');
      return;
    }

    setPhoneError('');
    onStartTransaction(selectedMethod, trimmed);
  };

  const getActiveMethodDetails = () => {
    return paymentMethods.find((m) => m.id === selectedMethod) || paymentMethods[1];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Click Dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />

          {/* Checkout Bottom Sheet panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-zinc-950 border-t border-zinc-800 rounded-t-[32px] overflow-hidden z-50 flex flex-col max-h-[92vh]"
          >
            {/* Soft indicator drag handle bar */}
            <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto my-3" />

            {/* Header section with dismiss button */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-zinc-900">
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-white tracking-tight font-display">
                  Choose Payment Method
                </h3>
                <span className="text-xs text-zinc-400 font-mono">
                  {odds.toFixed(2)} Odds • TZS {price.toLocaleString()}/=
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Central payment scrolling frame */}
            <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar space-y-5">
              
              {/* Phone number billing context */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Enter your mobile wallet number:
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="06******** / 07********"
                    className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white placeholder-zinc-650 focus:outline-none focus:border-green-500/80 focus:ring-1 focus:ring-green-500/20 font-mono tracking-wider transition-all"
                  />
                </div>
                {phoneError ? (
                  <span className="text-xs text-red-500 font-medium pl-1">{phoneError}</span>
                ) : (
                  <span className="text-[10px] text-zinc-500 pl-1 leading-normal">
                    *Ensure this phone is actively open near you to approve the secure PIN query
                  </span>
                )}
              </div>

              {/* Operators list */}
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Supported Operators:
                </span>

                <div className="space-y-2">
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-zinc-900/40 border-green-500/80 shadow-md shadow-green-500/5'
                            : 'bg-zinc-900/20 border-zinc-850 hover:bg-zinc-900/50'
                        }`}
                      >
                        {/* Selector indicator & label */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-green-500 border-green-500 text-black'
                                : 'border-zinc-700 bg-transparent'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3.5px]" />}
                          </div>
                          <span
                            className={`text-sm font-bold tracking-tight transition-colors ${
                              isSelected ? 'text-white' : 'text-zinc-300'
                            }`}
                          >
                            {method.name}
                          </span>
                        </div>

                        {/* Custom Badge Logo matching original visual perfectly */}
                        <div className="flex items-center font-bold">
                          {method.badgeContent}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom sticky checkout confirm block */}
            <div className="p-6 bg-zinc-950 border-t border-zinc-900">
              <button
                onClick={handleValidationAndPay}
                className="w-full py-4 rounded-2xl bg-green-500 hover:bg-green-400 text-black text-sm font-bold uppercase tracking-wider transition-all duration-200 shadow-xl shadow-green-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <span>Pay with {getActiveMethodDetails().name}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5px]" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                <span>Security verified by Vodacom & GSM Partners</span>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
