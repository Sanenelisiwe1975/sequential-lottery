'use client';

interface PrizeTiersProps {
  prizeTiers: any;
  prizePool: bigint | undefined;
}

export default function PrizeTiers({ prizeTiers, prizePool }: PrizeTiersProps) {
  if (!prizeTiers) return null;

  const getTierColor = (matchCount: number) => {
    if (matchCount === 7) return 'bg-yellow-500';
    if (matchCount === 6) return 'bg-purple-500';
    if (matchCount === 5) return 'bg-blue-500';
    if (matchCount === 4) return 'bg-green-500';
    if (matchCount === 3) return 'bg-cyan-500';
    if (matchCount === 2) return 'bg-gray-500';
    return 'bg-gray-400';
  };

  const calculateTierPrize = (percentage: number) => {
    if (!prizePool) return '0';
    const prize = (prizePool * BigInt(percentage)) / 10000n;
    return (Number(prize) / 1e18).toFixed(4);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <h3 className="text-3xl font-bold text-gray-900 mb-2">Prize Tiers</h3>
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
            
            if (matchCount === 1) return null;

            return (
              <div
                key={idx}
                className={`${getTierColor(matchCount)} rounded-xl p-4 text-white shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">
                      {matchCount} Sequential Match{matchCount !== 1 ? 'es' : ''}
                    </div>
                    <div className="text-sm opacity-90 font-medium">
                      {percentage}% of prize pool
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {calculateTierPrize(tier.percentage)} ETH
                    </div>
                    <div className="text-xs opacity-80 font-medium">
                      (split among winners)
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Prizes are split equally among all winners in each tier. 
          Unclaimed prizes automatically carry over to the next round!
        </p>
      </div>
    </div>
  );
}
