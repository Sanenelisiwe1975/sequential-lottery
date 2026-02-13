'use client';

import { formatEther } from 'viem';
import { useEffect, useState } from 'react';

interface RoundInfoProps {
  roundInfo: any;
  carryOverBalance: bigint | undefined;
  ticketPrice: bigint | undefined;
}

export default function RoundInfo({ roundInfo, carryOverBalance, ticketPrice }: RoundInfoProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (!roundInfo) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = Number(roundInfo.endTime);
      const remaining = endTime - now;

      if (remaining <= 0) {
        setTimeRemaining('Round ended');
        return;
      }

      const days = Math.floor(remaining / 86400);
      const hours = Math.floor((remaining % 86400) / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [roundInfo]);

  if (!roundInfo) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
        </div>
      </div>
    );
  }

  const prizePool = roundInfo.prizePool;
  const isActive = !roundInfo.isDrawn && Number(roundInfo.endTime) > Math.floor(Date.now() / 1000);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Round #{roundInfo.roundId?.toString()}</h2>
        <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
          isActive 
            ? 'bg-emerald-100 text-emerald-700' 
            : 'bg-gray-200 text-gray-700'
        }`}>
          {isActive ? 'ACTIVE' : 'ENDED'}
        </span>
      </div>

      {/* Prize Pool */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="text-sm font-semibold text-gray-600 mb-2">Total Prize Pool</div>
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {formatEther(prizePool || 0n)} ETH
        </div>
        {carryOverBalance && carryOverBalance > 0n && (
          <div className="text-sm text-gray-700">
            Includes {formatEther(carryOverBalance)} ETH carry over
          </div>
        )}
      </div>

      {/* Round Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Ticket Price</div>
          <div className="text-3xl font-bold text-gray-900">
            {ticketPrice ? formatEther(ticketPrice) : '0'} ETH
          </div>
        </div>

        <div className="bg-rose-50 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Time Remaining</div>
          <div className="text-3xl font-bold text-gray-900">
            {timeRemaining || '---'}
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Total Sales</div>
          <div className="text-2xl font-bold text-gray-900">
            {roundInfo.numbersSold?.toString() || '0'} tickets
          </div>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-600 mb-2">Round Status</div>
          <div className="text-lg font-bold text-gray-900">
            {roundInfo.isDrawn ? 'Drawn' : 'Pending'}
          </div>
        </div>
      </div>
    </div>
  );
}
