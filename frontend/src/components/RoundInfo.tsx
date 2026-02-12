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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const prizePool = roundInfo.prizePool;
  const isActive = !roundInfo.isDrawn && Number(roundInfo.endTime) > Math.floor(Date.now() / 1000);

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Round #{roundInfo.roundId?.toString()}</h2>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
          isActive ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isActive ? '🟢 Active' : '🔴 Ended'}
        </span>
      </div>

      {/* Prize Pool */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-4">
        <div className="text-sm font-medium mb-2 opacity-90">Total Prize Pool</div>
        <div className="text-5xl font-bold mb-2">
          {formatEther(prizePool || 0n)} ETH
        </div>
        {carryOverBalance && carryOverBalance > 0n && (
          <div className="text-sm opacity-75">
            💰 Includes {formatEther(carryOverBalance)} ETH carry over
          </div>
        )}
      </div>

      {/* Round Details Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-sm opacity-75 mb-1">Ticket Price</div>
          <div className="text-2xl font-bold">
            {ticketPrice ? formatEther(ticketPrice) : '0'} ETH
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-sm opacity-75 mb-1">Time Remaining</div>
          <div className="text-2xl font-bold">
            {timeRemaining || '---'}
          </div>
        </div>
      </div>

      {/* Status Message */}
      {roundInfo.isDrawn && (
        <div className="mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
          <p className="text-sm font-medium">
            🎉 This round has been drawn! Check results below.
          </p>
        </div>
      )}
    </div>
  );
}
