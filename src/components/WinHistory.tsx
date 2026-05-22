/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, CheckCircle2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface PastTicket {
  id: string;
  odds: number;
  date: string;
  matchesCount: number;
  matches: { teams: string; tip: string; odds: number }[];
}

interface WinHistoryProps {
  lang?: string;
}

export const WinHistory: React.FC<WinHistoryProps> = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pastTickets: PastTicket[] = [
    {
      id: 'ticket-1',
      odds: 18.42,
      date: '21 May 2026',
      matchesCount: 5,
      matches: [
        { teams: 'Man City vs Chelsea', tip: 'Home Win', odds: 1.65 },
        { teams: 'Real Madrid vs Valencia', tip: 'Home Win & Over 1.5', odds: 1.82 },
        { teams: 'Juventus vs AC Milan', tip: 'Both Teams To Score', odds: 1.95 },
        { teams: 'PSG vs Lyon', tip: 'Home Win', odds: 1.45 },
        { teams: 'Dortmund vs Frankfurt', tip: 'Over 2.5 Goals', odds: 2.15 },
      ],
    },
    {
      id: 'ticket-2',
      odds: 31.50,
      date: '19 May 2026',
      matchesCount: 6,
      matches: [
        { teams: 'Everton vs Liverpool', tip: 'Away Win', odds: 1.58 },
        { teams: 'Monaco vs Lille', tip: 'Home Win', odds: 1.90 },
        { teams: 'Athletic Bilbao vs Sevilla', tip: 'Both Teams To Score', odds: 1.84 },
        { teams: 'Ajax vs PSV', tip: 'Over 3.5 Goals', odds: 2.30 },
        { teams: 'Lazio vs AS Roma', tip: 'Draw (X)', odds: 3.10 },
        { teams: 'Porto vs Benfica', tip: 'First Half Draw', odds: 2.05 },
      ],
    },
    {
      id: 'ticket-3',
      odds: 12.80,
      date: '17 May 2026',
      matchesCount: 4,
      matches: [
        { teams: 'Arsenal vs Wolves', tip: 'Home Win Handicap -1', odds: 1.80 },
        { teams: 'Barcelona vs Sociedad', tip: 'Home Win', odds: 1.50 },
        { teams: 'Inter Milan vs Napoli', tip: 'Both Teams To Score', odds: 1.75 },
        { teams: 'Leverkusen vs Union Berlin', tip: 'Home Win & Over 2.5', odds: 2.10 },
      ],
    },
  ];

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-2">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-green-500" />
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-display">
          WINNING TICKET RECORD
        </h3>
      </div>

      <div className="space-y-3 mb-10">
        {pastTickets.map((ticket) => {
          const isExpanded = expandedId === ticket.id;
          return (
            <div 
              key={ticket.id} 
              className="bg-zinc-900/40 border border-zinc-850 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-zinc-805 font-sans"
            >
              {/* Header card view */}
              <div 
                onClick={() => handleToggle(ticket.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  {/* Star medal glow */}
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500 stroke-[2.5px]" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-black font-mono text-white tracking-wide">
                      {ticket.odds.toFixed(2)} Odds
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-tight flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {ticket.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-green-500/10 text-green-400 font-extrabold px-2.5 py-1 rounded-full uppercase border border-green-500/20 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3 text-green-400 stroke-[3px]" />
                    WON
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </div>

              {/* Collapsed matches expanded list */}
              {isExpanded && (
                <div className="bg-zinc-950 p-4 border-t border-zinc-900 space-y-2 text-xs">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-2">
                    Match predictions revealed ({ticket.matchesCount})
                  </div>

                  {ticket.matches.map((match, mIdx) => (
                    <div 
                      key={mIdx}
                      className="flex justify-between items-center py-2 border-b border-zinc-900/30 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-200 tracking-tight leading-tight">
                          {match.teams}
                        </span>
                        <span className="text-zinc-500 font-medium text-[10px] mt-0.5">
                          Tip: <span className="text-green-400 font-semibold">{match.tip}</span>
                        </span>
                      </div>
                      
                      <div className="font-mono text-[11px] font-bold text-zinc-400 bg-zinc-900/50 px-2 py-0.5 rounded border border-zinc-850">
                        {match.odds.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
