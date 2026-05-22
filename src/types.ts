/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MatchPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  prediction: string;  // e.g., "Home Win", "GG (Both Teams to Score)", "Over 2.5"
  odds: number;
}

export interface BetSlip {
  id: string;
  odds: number;
  price: number; // e.g., 3000 for TSZ
  validityTime: string; // ISO string representing expiry time
  betCompanies: string[]; // e.g. ["Colbet", "SportyBet", "Betika", "BetPawa", "Betway"]
  matches: MatchPrediction[];
  bookingCodes: Record<string, string>; // e.g. {"SportyBet": "SB7741", "betPawa": "PAW-990"}
}

export interface TipsterProfile {
  name: string;
  subscribers: string;
  isVerified: boolean;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  slipId: string;
  phone: string;
  operator: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
}
