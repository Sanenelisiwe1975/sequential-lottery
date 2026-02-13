'use client';

import { useAccount } from 'wagmi';
import { useMyTickets, useWinningNumbers } from '@/hooks/useLotteryContract';

interface MyTicketsProps {
  roundId: bigint | undefined;
  isDrawn: boolean;
}

export default function MyTickets({ roundId, isDrawn }: MyTicketsProps) {
  const { address } = useAccount();
  const { tickets } = useMyTickets(roundId, address);
  const { winningNumbers } = useWinningNumbers(roundId, isDrawn);

  if (!address) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-slate-600">Connect your wallet to view your tickets</p>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <span className="text-5xl mb-4 block">🎫</span>
        <p className="text-slate-600 font-medium">You haven't purchased any tickets for this round</p>
      </div>
    );
  }

  const getTierColor = (matchCount: number) => {
    if (matchCount === 7) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (matchCount === 6) return 'bg-gradient-to-r from-purple-500 to-pink-500';
    if (matchCount === 5) return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    if (matchCount === 4) return 'bg-gradient-to-r from-green-500 to-teal-500';
    if (matchCount === 3) return 'bg-gradient-to-r from-cyan-500 to-blue-400';
    if (matchCount === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500';
    return 'bg-gradient-to-r from-slate-400 to-slate-500';
  };

  const getTierLabel = (matchCount: number) => {
    if (matchCount === 7) return '🏆 JACKPOT!';
    if (matchCount === 6) return '💎 6 Matches';
    if (matchCount === 5) return '⭐ 5 Matches';
    if (matchCount === 4) return '🌟 4 Matches';
    if (matchCount === 3) return '✨ 3 Matches';
    if (matchCount === 2) return '💫 2 Matches';
    return '🎯 Numbers Selected';
  };

  return (
    <div className="glass rounded-2xl p-8 card-shadow border border-purple-500/30">
      <h3 className="text-3xl font-bold text-slate-900 mb-6">🎫 Your Tickets ({tickets.length})</h3>
      
      <div className="space-y-4">
        {tickets.map((ticket: any, idx: number) => (
          <div
            key={idx}
            className="glass rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all hover:border-purple-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">Ticket #{idx + 1}</span>
              {isDrawn && ticket.matchedBalls > 0 && (
                <span className={`px-4 py-2 rounded-lg text-white text-sm font-bold shadow-lg ${getTierColor(ticket.matchedBalls)}`}>
                  {getTierLabel(ticket.matchedBalls)}
                </span>
              )}
            </div>

            {/* Numbers */}
            <div className="flex gap-2 mb-4">
              {ticket.numbers.map((num: number, numIdx: number) => {
                const isMatch = isDrawn && winningNumbers && num === winningNumbers[numIdx];
                const isWrongPosition = isDrawn && ticket.matchedBalls <= numIdx;
                
                return (
                  <div
                    key={numIdx}
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-all
                      ${isMatch 
                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg ring-2 ring-emerald-300' 
                        : isWrongPosition && winningNumbers
                        ? 'bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 font-bold'
                        : 'bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700'
                      }
                    `}
                  >
                    {num}
                  </div>
                );
              })}
            </div>

            {/* Winning comparison */}
            {isDrawn && winningNumbers && (
              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">🎯 Winning Numbers:</div>
                <div className="flex gap-2">
                  {winningNumbers.map((num: number, numIdx: number) => (
                    <div
                      key={numIdx}
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
