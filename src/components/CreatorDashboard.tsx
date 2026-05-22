/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Save, Trash2, Smartphone, TrendingUp, Award, Settings, PlusCircle } from 'lucide-react';
import { BetSlip, TipsterProfile, MatchPrediction, Transaction } from '../types';

interface CreatorDashboardProps {
  profile: TipsterProfile;
  activeSlip: BetSlip;
  transactions: Transaction[];
  lang?: string;
  onSaveProfile: (p: TipsterProfile) => void;
  onSaveSlip: (s: BetSlip) => void;
  onClose: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  profile,
  activeSlip,
  transactions,
  onSaveProfile,
  onSaveSlip,
  onClose,
}) => {
  // Local state mirror for BetSlip configuration
  const [odds, setOdds] = useState(activeSlip.odds);
  const [price, setPrice] = useState(activeSlip.price);
  const [validityHours, setValidityHours] = useState(19); // Quick hours adder
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(activeSlip.betCompanies);

  // Local state mirror for Match lists
  const [matches, setMatches] = useState<MatchPrediction[]>(activeSlip.matches);

  // Local state mirror for Company booking codes
  const [sportyCode, setSportyCode] = useState(activeSlip.bookingCodes['SportyBet'] || 'SB72B8');
  const [pawaCode, setPawaCode] = useState(activeSlip.bookingCodes['betPawa'] || 'PAW-997');
  const [betwayCode, setBetwayCode] = useState(activeSlip.bookingCodes['betway'] || 'BW771F');
  const [colbetCode, setColbetCode] = useState(activeSlip.bookingCodes['COLBET'] || 'COL-888');

  // List of possible companies
  const availableCompanies = ['COLBET', 'SportyBet', 'Gal Sport Betting', 'betPawa', 'betway'];

  const handleToggleCompany = (co: string) => {
    if (selectedCompanies.includes(co)) {
      setSelectedCompanies(selectedCompanies.filter((x) => x !== co));
    } else {
      setSelectedCompanies([...selectedCompanies, co]);
    }
  };

  const handleAddEmptyMatch = () => {
    const newMatch: MatchPrediction = {
      id: `match-${Date.now()}`,
      homeTeam: 'Team A',
      awayTeam: 'Team B',
      league: 'EPL / Champions League',
      startTime: '21:45 PM',
      prediction: 'Home Win',
      odds: 1.50,
    };
    setMatches([...matches, newMatch]);
  };

  const handleUpdateMatchField = (id: string, field: keyof MatchPrediction, val: any) => {
    const updated = matches.map((m) => {
      if (m.id === id) {
        return { ...m, [field]: val };
      }
      return m;
    });
    setMatches(updated);

    // Sum-up matches odds automatically to display updated cumulative Odds value
    if (field === 'odds') {
      const parsedVal = parseFloat(val) || 1.0;
      let accum = 1.0;
      updated.forEach((me) => {
        accum *= me.id === id ? parsedVal : (me.odds || 1.0);
      });
      setOdds(parseFloat(accum.toFixed(2)));
    }
  };

  const handleRemoveMatch = (id: string) => {
    if (matches.length <= 1) {
      alert('Ticket must feature at least 1 match prediction!');
      return;
    }
    const filtered = matches.filter((m) => m.id !== id);
    setMatches(filtered);

    // Re-accumulate odds
    let accum = 1.0;
    filtered.forEach((me) => {
      accum *= me.odds || 1.0;
    });
    setOdds(parseFloat(accum.toFixed(2)));
  };

  const handleSaveAll = () => {
    // Keep profile as active
    onSaveProfile(profile);

    // Save Slip configurations (Calculate expiration time hours in future)
    const expiryObject = new Date();
    expiryObject.setHours(expiryObject.getHours() + validityHours);

    onSaveSlip({
      id: activeSlip.id,
      odds,
      price: Number(price) || 3000,
      validityTime: expiryObject.toISOString(),
      betCompanies: selectedCompanies,
      matches,
      bookingCodes: {
        'SportyBet': sportyCode,
        'betPawa': pawaCode,
        'betway': betwayCode,
        'COLBET': colbetCode,
      },
    });

    alert('All configurations saved successfully!');
    onClose();
  };

  // Auto-generate realistic premium matches suggestion
  const handleGenerateAISuggestions = () => {
    const suggestions: MatchPrediction[] = [
      {
        id: `match-ai-1`,
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        league: 'Spain La Liga',
        startTime: '21:00 PM',
        prediction: 'Real Madrid (GG & Over 2.5)',
        odds: 2.10,
      },
      {
        id: `match-ai-2`,
        homeTeam: 'Arsenal Soccer',
        awayTeam: 'Chelsea FC',
        league: 'English Premier League',
        startTime: '18:30 PM',
        prediction: 'Arsenal to Win',
        odds: 1.68,
      },
      {
        id: `match-ai-3`,
        homeTeam: 'Bayern Munich',
        awayTeam: 'Napoli',
        league: 'UEFA Champions League',
        startTime: '22:45 PM',
        prediction: 'Over 2.5 Goals',
        odds: 1.55,
      },
    ];
    setMatches(suggestions);
    setOdds(5.47); // 2.10 * 1.68 * 1.55
  };

  // Simulated cumulative revenue display
  const totalRevenue = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, current) => sum + current.amount, 0);

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-950 border border-zinc-850 rounded-[32px] overflow-hidden shadow-2xl flex flex-col my-3 font-sans">
      
      {/* Title header bar */}
      <div className="p-5 border-b border-zinc-900 bg-zinc-900 w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-green-500 animate-spin-slow" />
          <h2 className="text-sm font-bold text-white tracking-widest font-display uppercase">
            TIPSTER PANEL EDITOR
          </h2>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1 bg-zinc-90 w-fit hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-400 font-bold rounded-full cursor-pointer uppercase"
        >
          Close
        </button>
      </div>

      <div className="p-5 space-y-6 overflow-y-auto max-h-[78vh] custom-scrollbar">
        
        {/* Statistics analytics segment */}
        <div className="p-4 bg-gradient-to-br from-zinc-900/60 to-zinc-950/60 rounded-2xl border border-zinc-850 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
              SIMULATED REVENUE
            </span>
            <span className="text-xl font-black font-mono text-green-400 animate-pulse">
              TZS {totalRevenue.toLocaleString()}/=
            </span>
            <span className="text-[9px] text-zinc-500 font-mono">
              {transactions.filter(t => t.status === 'completed').length} successful unlocks tracked
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* 1. Slip configuration parameters */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Award className="w-4 h-4 text-green-500" />
            <span>1. Ticket Price & Validity</span>
          </h3>

          <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-850 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Cumulative Odds:</span>
                <input
                  type="number"
                  step="0.01"
                  value={odds}
                  onChange={(e) => setOdds(parseFloat(e.target.value) || 1.0)}
                  className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-xl text-xs text-white focus:outline-none focus:border-green-500 font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Slip Price (TZS):</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                  className="px-3 py-2 bg-zinc-950 border border-zinc-805 rounded-xl text-xs text-white focus:outline-none focus:border-green-500 font-mono"
                />
              </div>
            </div>

            {/* Quick validity offset hour picker */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-405 font-bold uppercase">
                Duration Remaining (Hours in Future):
              </span>
              <div className="flex items-center gap-2">
                {[5, 12, 19, 24, 48].map((hr) => (
                  <button
                    key={hr}
                    type="button"
                    onClick={() => setValidityHours(hr)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono border transition-all ${
                      validityHours === hr
                        ? 'bg-green-500 border-green-500 text-black'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white cursor-pointer'
                    }`}
                  >
                    {hr}h
                  </button>
                ))}
              </div>
            </div>

            {/* Bookmakers list selector indicators */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-zinc-405 font-bold uppercase">
                Select Supported Platforms:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableCompanies.map((co) => {
                  const check = selectedCompanies.includes(co);
                  return (
                    <button
                      key={co}
                      type="button"
                      onClick={() => handleToggleCompany(co)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                        check
                          ? 'bg-green-500/10 border-green-500 text-green-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-505 hover:text-zinc-350'
                      }`}
                    >
                      {co}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Match prediction editor list */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <PlusCircle className="w-4 h-4 text-green-500" />
              <span>2. Match Predictions</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateAISuggestions}
                className="px-2 py-1 text-[10px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 rounded-md border border-sky-500/20 font-bold transition-all cursor-pointer"
              >
                + AI Preset
              </button>
              <button
                type="button"
                onClick={handleAddEmptyMatch}
                className="px-2 py-1 text-[10px] bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-md border border-green-500/20 font-bold transition-all cursor-pointer"
              >
                + New Match
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {matches.map((match, index) => (
              <div key={match.id} className="p-3 bg-zinc-900 border border-zinc-800/80 rounded-2xl relative space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleRemoveMatch(match.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-red-400/70 hover:text-red-400 hover:bg-amber-500/15 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <span className="text-[10px] text-green-400 font-bold tracking-wider font-mono uppercase block">
                  Match Record #{index + 1}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">League:</span>
                    <input
                      type="text"
                      value={match.league}
                      onChange={(e) => handleUpdateMatchField(match.id, 'league', e.target.value)}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-805 rounded-xl text-xs text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">Start Time:</span>
                    <input
                      type="text"
                      value={match.startTime}
                      onChange={(e) => handleUpdateMatchField(match.id, 'startTime', e.target.value)}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-805 rounded-xl text-xs text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">Home Team:</span>
                    <input
                      type="text"
                      value={match.homeTeam}
                      onChange={(e) => handleUpdateMatchField(match.id, 'homeTeam', e.target.value)}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">Away Team:</span>
                    <input
                      type="text"
                      value={match.awayTeam}
                      onChange={(e) => handleUpdateMatchField(match.id, 'awayTeam', e.target.value)}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-0.5 col-span-2">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">Our Tip:</span>
                    <input
                      type="text"
                      value={match.prediction}
                      onChange={(e) => handleUpdateMatchField(match.id, 'prediction', e.target.value)}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 col-span-1">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">Odds value:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={match.odds}
                      onChange={(e) => handleUpdateMatchField(match.id, 'odds', parseFloat(e.target.value) || 1.0)}
                      className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-850 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-green-505"
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 3. Betting booking codes editors */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
            <Smartphone className="w-4 h-4 text-green-500" />
            <span>3. Booking Codes</span>
          </h3>

          <div className="p-4 bg-zinc-900/40 rounded-2xl border border-zinc-850 grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">SportyBet:</span>
              <input
                type="text"
                value={sportyCode}
                onChange={(e) => setSportyCode(e.target.value)}
                className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-green-500"
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">betPawa:</span>
              <input
                type="text"
                value={pawaCode}
                onChange={(e) => setPawaCode(e.target.value)}
                className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">betway:</span>
              <input
                type="text"
                value={betwayCode}
                onChange={(e) => setBetwayCode(e.target.value)}
                className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-green-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-zinc-500 uppercase font-bold">COLBET:</span>
              <input
                type="text"
                value={colbetCode}
                onChange={(e) => setColbetCode(e.target.value)}
                className="px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Clicks/Traffic transactions live ledger */}
        <div className="space-y-3.5">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block font-display">
            4. Live simulated sales ledger:
          </span>

          <div className="p-3 bg-zinc-900/35 w-full overflow-hidden border border-zinc-900 rounded-2xl">
            <div className="max-h-[140px] overflow-y-auto custom-scrollbar text-[10px] space-y-1.5 font-mono">
              {transactions.length === 0 ? (
                <div className="text-zinc-600 text-center py-6">No active client simulation sales yet.</div>
              ) : (
                transactions.map((tr) => (
                  <div key={tr.id} className="flex justify-between p-1.5 rounded bg-zinc-950 border-l border-green-500">
                    <div>
                      <span className="text-zinc-400">{tr.phone}</span>
                      <span className="text-zinc-600 block text-[8px]">{tr.operator} • Paid</span>
                    </div>
                    <span className="text-green-400 font-bold border-0 px-1 py-0.5 rounded bg-green-500/10">Tzs {tr.amount}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Primary Sticky bottom Save command */}
      <div className="p-5 bg-zinc-950 border-t border-zinc-900 flex gap-2">
        <button
          onClick={handleSaveAll}
          className="flex-1 py-3 bg-green-500 hover:bg-green-400 text-black text-xs font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Slip Changes</span>
        </button>
      </div>
    </div>
  );
};
