/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy } from 'lucide-react';
import { TipsterProfile, BetSlip, Transaction } from './types';
import { BetSlipCard } from './components/BetSlipCard';
import { PaymentBottomSheet } from './components/PaymentBottomSheet';
import { UssdPushDialog } from './components/UssdPushDialog';
import { UnlockedSlipView } from './components/UnlockedSlipView';
import { CreatorDashboard } from './components/CreatorDashboard';
import { NoActiveTicketCard } from './components/NoActiveTicketCard';

// Helper to calculate countdown equivalent to screenshots
const getFutureValidityTime = () => {
  return "2026-06-10T10:35:00+03:00";
};

const DEFAULT_PROFILE: TipsterProfile = {
  name: "TIPOVA TIPS",
  subscribers: "34.2k",
  isVerified: true,
  imageUrl: "",
};

const DEFAULT_SLIP: BetSlip = {
  id: "slip-kurtu-15",
  odds: 10.30,
  price: 3000,
  validityTime: getFutureValidityTime(),
  betCompanies: ["COLBET", "SportyBet", "Gal Sport Betting", "betPawa", "betway"],
  matches: [
    {
      id: "m-1",
      homeTeam: "Manchester United",
      awayTeam: "Chelsea",
      league: "English Premier League",
      startTime: "19:30 PM",
      prediction: "Home Win (1)",
      odds: 1.85,
    },
    {
      id: "m-2",
      homeTeam: "AC Milan",
      awayTeam: "Juventus",
      league: "Italy Serie A",
      startTime: "21:45 PM",
      prediction: "Over 2.5 Goals",
      odds: 1.95,
    },
    {
      id: "m-3",
      homeTeam: "Real Madrid",
      awayTeam: "Atletico Madrid",
      league: "Spain La Liga",
      startTime: "22:00 PM",
      prediction: "Both Teams to Score (GG)",
      odds: 1.83,
    },
    {
      id: "m-4",
      homeTeam: "Bayern Munich",
      awayTeam: "B. Dortmund",
      league: "Germany Bundesliga",
      startTime: "18:30 PM",
      prediction: "Home Win & GG",
      odds: 2.30,
    },
  ],
  bookingCodes: {
    "SportyBet": "SB-88219",
    "betPawa": "PAW-7744",
    "betway": "BW-9110B",
    "COLBET": "COL-672",
  },
};

const INITIAL_MOCK_SALES: Transaction[] = [
  {
    id: "tx-1",
    slipId: "slip-kurtu-15",
    phone: "0766***112",
    operator: "Mpesa",
    amount: 3000,
    status: "completed",
    timestamp: new Date().toISOString(),
  },
  {
    id: "tx-2",
    slipId: "slip-kurtu-15",
    phone: "0655***019",
    operator: "Tigo Pesa",
    amount: 3000,
    status: "completed",
    timestamp: new Date().toISOString(),
  },
  {
    id: "tx-3",
    slipId: "slip-kurtu-15",
    phone: "0788***881",
    operator: "Airtel Money",
    amount: 3000,
    status: "completed",
    timestamp: new Date().toISOString(),
  },
];

export default function App() {
  const lang = 'en';

  // Load persistence states from standard Local Storage
  const [profile, setProfile] = useState<TipsterProfile>(() => {
    const s = localStorage.getItem('kurtu_profile');
    return s ? JSON.parse(s) : DEFAULT_PROFILE;
  });

  const [activeSlip, setActiveSlip] = useState<BetSlip>(() => {
    const s = localStorage.getItem('kurtu_active_slip');
    if (s) {
      return JSON.parse(s);
    }
    return DEFAULT_SLIP;
  });

  const [isExpired, setIsExpired] = useState(() => {
    const slip = (() => {
      const s = localStorage.getItem('kurtu_active_slip');
      return s ? JSON.parse(s) : DEFAULT_SLIP;
    })();
    return new Date(slip.validityTime) <= new Date();
  });

  useEffect(() => {
    const checkExpiration = () => {
      const expired = new Date(activeSlip.validityTime) <= new Date();
      setIsExpired(expired);
    };
    checkExpiration();
    const timer = setInterval(checkExpiration, 1000);
    return () => clearInterval(timer);
  }, [activeSlip.validityTime]);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const s = localStorage.getItem('kurtu_transactions');
    return s ? JSON.parse(s) : INITIAL_MOCK_SALES;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  // Modal dialog view states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isUssdOpen, setIsUssdOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Active billing variables
  const [selectedOperator, setSelectedOperator] = useState('Mpesa');
  const [billingPhone, setBillingPhone] = useState('');

  // Save changes callback utilities
  const handleSaveProfile = (p: TipsterProfile) => {
    setProfile(p);
    localStorage.setItem('kurtu_profile', JSON.stringify(p));
  };

  const handleSaveSlip = (s: BetSlip) => {
    setActiveSlip(s);
    localStorage.setItem('kurtu_active_slip', JSON.stringify(s));
    
    // Reset unlock status for new unique tickets
    setIsUnlocked(false);
    localStorage.removeItem(`kurtu_unlocked_${s.id}`);
  };

  const handleStartTransaction = (operator: string, phone: string) => {
    setSelectedOperator(operator);
    setBillingPhone(phone);
    setIsPaymentOpen(false);
    setIsUssdOpen(true);
  };

  const handleConfirmUssdSuccess = () => {
    setIsUssdOpen(false);
    setIsUnlocked(true);
    localStorage.setItem(`kurtu_unlocked_${activeSlip.id}`, 'true');

    // Store in transaction records
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      slipId: activeSlip.id,
      phone: billingPhone.substring(0, 4) + '***' + billingPhone.substring(7),
      operator: selectedOperator,
      amount: activeSlip.price,
      status: 'completed',
      timestamp: new Date().toISOString(),
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem('kurtu_transactions', JSON.stringify(updatedTxs));
  };

  const handleManualReset = () => {
    setIsUnlocked(false);
    localStorage.removeItem(`kurtu_unlocked_${activeSlip.id}`);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col justify-between selection:bg-green-500/30">
      
      {/* Main Container */}
      <div className="flex-1 w-full max-w-md mx-auto pt-2 pb-14 px-2">
        <AnimatePresence mode="wait">
          {isAdminOpen ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key="admin"
            >
              <CreatorDashboard
                profile={profile}
                activeSlip={activeSlip}
                transactions={transactions}
                lang={lang}
                onSaveProfile={handleSaveProfile}
                onSaveSlip={handleSaveSlip}
                onClose={() => setIsAdminOpen(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="client"
              className="space-y-4"
            >
              {/* Core interactive betslip area */}
              {isExpired ? (
                <NoActiveTicketCard />
              ) : isUnlocked ? (
                <UnlockedSlipView 
                  slip={activeSlip} 
                  lang={lang} 
                  onReset={handleManualReset} 
                />
              ) : (
                <BetSlipCard 
                  slip={activeSlip} 
                  onInitiatePayment={() => setIsPaymentOpen(true)} 
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer support details */}
      <footer className="py-6 border-t border-zinc-900/60 text-center bg-[#07090d] text-[10px] text-zinc-650 tracking-wider">
        <div className="max-w-md mx-auto px-4 space-y-1">
          <p>© 2026 TIPOVA TIPS Platform. All rights reserved.</p>
          <p className="opacity-60 flex items-center justify-center gap-2">
            <span>18+ Gamble responsibly. Terms & Conditions apply.</span>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-zinc-800 hover:text-green-500/50 transition-colors"
              title="Admin Panel"
            >
              ⚙️
            </button>
          </p>
        </div>
      </footer>

      {/* Slide up Payment Method selector SHEET */}
      <PaymentBottomSheet
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        price={activeSlip.price}
        odds={activeSlip.odds}
        lang={lang}
        onStartTransaction={handleStartTransaction}
      />

      {/* Simulated USSD transaction PIN confirmation prompt */}
      <UssdPushDialog
        isOpen={isUssdOpen}
        operator={selectedOperator}
        phone={billingPhone}
        amount={activeSlip.price}
        lang={lang}
        onPaymentSuccess={handleConfirmUssdSuccess}
        onCancel={() => setIsUssdOpen(false)}
      />

    </div>
  );
}
