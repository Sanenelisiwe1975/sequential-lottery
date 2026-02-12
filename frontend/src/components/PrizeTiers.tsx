'use client';

interface PrizeTiersProps {
  prizeTiers: any;
  prizePool: bigint | undefined;
}

export default function PrizeTiers({ prizeTiers, prizePool }: PrizeTiersProps) {
  if (!prizeTiers) return null;

  const getTierColor = (matchCount: number) => {
    if (matchCount === 7) return 'from-yellow-400 to-orange-500';
    if (matchCount === 6) return 'from-purple-500 to-pink-500';
    if (matchCount === 5) return 'from-blue-500 to-indigo-500';
    if (matchCount === 4) return 'from-green-500 to-teal-500';
    if (matchCount === 3) return 'from-cyan-500 to-blue-400';
    if (matchCount === 2) return 'from-gray-400 to-gray-500';
    return 'from-gray-300 to-gray-400';
  };

  const getTierEmoji = (matchCount: number) => {
    if (matchCount === 7) return '🏆';
    if (matchCount === 6) return '💎';
    if (matchCount === 5) return '⭐';
    if (matchCount === 4) return '🌟';
    if (matchCount === 3) return '✨';
    if (matchCount === 2) return '💫';
    return '🎯';
  };

  const calculateTierPrize = (percentage: number) => {
    if (!prizePool) return '0';
    const prize = (prizePool * BigInt(percentage)) / 10000n;
    return (Number(prize) / 1e18).toFixed(4);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-2xl font-bold mb-4">Prize Tiers</h3>
      <p className="text-sm text-gray-600 mb-6">
        Match numbers sequentially from position 1 to win
      </p>

      <div className="space-y-3">
        {prizeTiers
          .slice()
          .reverse()
          .map((tier: any, idx: number) => {
            const matchCount = tier.matchCount;
            const percentage = tier.percentage / 100;
            
            if (matchCount === 1) return null; // Skip 1 ball (0%)

            return (
              <div
                key={idx}
                className={`bg-gradient-to-r ${getTierColor(matchCount)} rounded-lg p-4 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getTierEmoji(matchCount)}</span>
                    <div>
                      <div className="font-bold text-lg">
                        {matchCount} Sequential Matches
                      </div>
                      <div className="text-sm opacity-90">
                        {percentage}% of prize pool
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {calculateTierPrize(tier.percentage)} ETH
                    </div>
                    <div className="text-xs opacity-75">
                      (split among winners)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Prizes are split equally among all winners in each tier. 
          Unclaimed prizes automatically carry over to the next round!
        </p>
      </div>
    </div>
  );
}
