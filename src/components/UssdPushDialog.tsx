/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Loader2, ArrowRight, AlertCircle, Smartphone } from 'lucide-react';

interface UssdPushDialogProps {
  isOpen: boolean;
  operator: string;
  phone: string;
  amount: number;
  lang?: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export const UssdPushDialog: React.FC<UssdPushDialogProps> = ({
  isOpen,
  operator,
  phone,
  amount,
  onPaymentSuccess,
  onCancel,
}) => {
  const [pin, setPin] = useState<string>('');
  const [step, setStep] = useState<'prompt' | 'processing' | 'success'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setStep('prompt');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setErrorMessage('PIN must be at least 4 digits');
      return;
    }

    setErrorMessage('');
    setStep('processing');

    // Simulate network confirmation time (e.g., 2.2 seconds)
    setTimeout(() => {
      setStep('success');
      // Show success screen for a moment before unlocking
      setTimeout(() => {
        onPaymentSuccess();
      }, 1500);
    }, 2200);
  };

  const getOperatorHeaderColor = () => {
    const term = operator.toLowerCase();
    if (term.includes('mpesa')) return 'from-red-650 to-red-500';
    if (term.includes('airtel')) return 'from-red-700 to-red-600';
    if (term.includes('halo')) return 'from-orange-650 to-orange-500';
    if (term.includes('tigo')) return 'from-blue-750 to-blue-600';
    return 'from-yellow-450 to-yellow-600';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          />

          {/* Prompt main container resembling SIM Tool Kit UI or a premium overlay card */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="fixed inset-0 m-auto max-w-[340px] h-fit md:max-w-md bg-[#161a22] border border-zinc-800 rounded-[28px] overflow-hidden z-50 shadow-2xl flex flex-col"
          >
            {/* Operator header strip */}
            <div className={`p-4 bg-gradient-to-r ${getOperatorHeaderColor()} flex items-center gap-2.5`}>
              <Smartphone className="w-5 h-5 text-white animate-bounce-slow" />
              <div className="flex flex-col">
                <span className="text-[10px] text-white/80 font-mono tracking-widest uppercase">
                  SIM TOOLKIT PUSH
                </span>
                <span className="text-xs font-black text-white tracking-wide">
                  {operator} Secure Payment Gateway
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              {step === 'prompt' && (
                <form onSubmit={handlePinSubmit} className="space-y-5">
                  <div className="p-4 bg-zinc-900/65 rounded-2xl border border-zinc-850 text-center">
                    <p className="text-xs text-zinc-400 font-medium font-sans">
                      Paying client:
                    </p>
                    <span className="text-sm font-bold text-white font-mono tracking-wider block mt-0.5">
                      {phone}
                    </span>
                    
                    <div className="h-px bg-zinc-800 my-2.5" />

                    <p className="text-xs text-zinc-400 font-medium font-sans">
                      Total Amount:
                    </p>
                    <span className="text-[20px] font-black font-mono text-green-400 inline-block mt-0.5">
                      TZS {amount.toLocaleString()}/=
                    </span>
                    
                    <p className="text-[10px] text-zinc-500 font-medium mt-1 uppercase">
                      To: TIPOVA TIPS Services
                    </p>
                  </div>

                  {/* Input PIN box */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-zinc-400 text-center block tracking-wide">
                      Enter your simulated mobile money PIN:
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      pattern="\d{4}"
                      value={pin}
                      placeholder="••••"
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPin(val);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="w-28 mx-auto text-center py-2.5 bg-zinc-950 border border-zinc-805 rounded-xl text-lg font-bold tracking-[1em] focus:outline-none focus:border-green-500 font-mono text-green-400"
                      autoFocus
                    />
                    {errorMessage && (
                      <span className="text-[11px] text-center text-red-400 font-medium flex items-center justify-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errorMessage}
                      </span>
                    )}
                  </div>

                  {/* Submit decisions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onCancel}
                      className="py-3 px-4 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-450 text-xs font-bold uppercase transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-3 px-4 rounded-xl bg-green-500 hover:bg-green-400 text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Send</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                    </button>
                  </div>
                </form>
              )}

              {step === 'processing' && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin stroke-[2px]" />
                    <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-zinc-900" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider animate-pulse">
                      Authenticating PIN...
                    </h4>
                    <p className="text-[11px] text-zinc-400 px-4 leading-normal">
                      Authenticating your transaction credentials safely with operator.
                    </p>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-14 h-14 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center"
                  >
                    <ShieldCheck className="w-8 h-8 text-green-500 stroke-[2.5px]" />
                  </motion.div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider">
                      ALMOST UNLOCKED
                    </h4>
                    <p className="text-[11.5px] text-zinc-300 px-3">
                      Simulated payment completed. Unlocking your tips details!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
