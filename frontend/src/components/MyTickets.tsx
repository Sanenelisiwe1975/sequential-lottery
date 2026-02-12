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
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">Connect your wallet to view your tickets</p>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">You haven't purchased any tickets for this round</p>
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
    return 'bg-gray-300';
  };

  const getTierLabel = (matchCount: number) => {
    if (matchCount === 7) return '🏆 JACKPOT!';
    if (matchCount === 6) return '🥈 6 Matches';
    if (matchCount === 5) return '🥉 5 Matches';
    if (matchCount === 4) return '⭐ 4 Matches';
    if (matchCount === 3) return '✨ 3 Matches';
    if (matchCount === 2) return '💫 2 Matches';
    return '❌ No Win';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4">Your Tickets ({tickets.length})</h3>
      
      <div className="space-y-4">
        {tickets.map((ticket: any, idx: number) => (
          <div
            key={idx}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Ticket #{idx + 1}</span>
              {isDrawn && ticket.matchedBalls > 0 && (
                <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getTierColor(ticket.matchedBalls)}`}>
                  {getTierLabel(ticket.matchedBalls)}
                </span>
              )}
            </div>

            {/* Numbers */}
            <div className="flex gap-2 mb-3">
              {ticket.numbers.map((num: number, numIdx: number) => {
                const isMatch = isDrawn && winningNumbers && num === winningNumbers[numIdx];
                const isWrongPosition = isDrawn && ticket.matchedBalls <= numIdx;
                
                return (
                  <div
                    key={numIdx}
                    className={`
                      w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
                      ${isMatch 
                        ? 'bg-green-500 text-white ring-2 ring-green-300' 
                        : isWrongPosition && winningNumbers
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-700'
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
              <div className="pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Winning Numbers:</div>
                <div className="flex gap-2">
                  {winningNumbers.map((num: number, numIdx: number) => (
                    <div
                      key={numIdx}
                      className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg bg-indigo-600 text-white"
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
