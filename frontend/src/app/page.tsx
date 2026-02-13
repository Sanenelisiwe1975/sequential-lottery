'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NumberPicker from '@/components/NumberPicker';
import RoundInfo from '@/components/RoundInfo';
import MyTickets from '@/components/MyTickets';
import PrizeTiers from '@/components/PrizeTiers';
import { useLotteryContract, usePlayerWinnings } from '@/hooks/useLotteryContract';
import { formatEther } from 'viem';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const {
    roundInfo,
    ticketPrice,
    carryOverBalance,
    prizeTiers,
    buyTicket,
    claimWinnings,
    isPending,
    isSuccess,
    isError,
    error,
  } = useLotteryContract();

  const { winnings, refetch: refetchWinnings } = usePlayerWinnings(address);

  const handleBuyTicket = () => {
    if (selectedNumbers.length !== 7) {
      alert('Please select exactly 7 numbers');
      return;
    }
    buyTicket(selectedNumbers);
  };

  const handleClaimWinnings = () => {
    claimWinnings();
  };

  const isRoundActive = mounted && roundInfo && !roundInfo.isDrawn && 
    Number(roundInfo.endTime) > Math.floor(Date.now() / 1000);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <header className="bg-white border-b border-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🎰</div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Sequential Lottery</h1>
                  <p className="text-sm text-gray-600 mt-1">Premium Blockchain Gaming</p>
                </div>
              </div>
              <div className="w-48 h-10 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass rounded-2xl p-12 text-center">
            <div className="h-8 bg-gray-300 rounded-lg w-1/3 mx-auto mb-6 animate-pulse"></div>
            <p className="text-gray-500">Loading lottery data…</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎰</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sequential Lottery</h1>
                <p className="text-sm text-gray-600 mt-1">Premium Blockchain Gaming</p>
              </div>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Winnings Banner */}
        {isConnected && winnings && winnings > 0n && (
          <div className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-2xl p-8 text-white card-shadow animate-slide-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
                <p className="text-4xl font-bold">{formatEther(winnings)} ETH</p>
                <p className="text-sm text-emerald-100 mt-1">Available to claim</p>
              </div>
              <button
                onClick={handleClaimWinnings}
                disabled={isPending}
                className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-lg"
              >
                {isPending ? '⏳ Claiming...' : '✨ Claim Winnings'}
              </button>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {isPending && (
          <div className="mb-6 bg-blue-50 border border-blue-300 rounded-xl p-4 border-l-4 border-blue-500 animate-slide-in">
            <p className="text-blue-700">⏳ Transaction pending...</p>
          </div>
        )}
        {isSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-xl p-4 border-l-4 border-emerald-500 animate-slide-in">
            <p className="text-emerald-700">✅ Transaction successful!</p>
          </div>
        )}
        {isError && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-xl p-4 border-l-4 border-red-500 animate-slide-in">
            <p className="text-red-700">❌ Error: {error?.message}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Round Info & Buy Ticket */}
          <div className="lg:col-span-2 space-y-8">
            {/* Round Info */}
            <RoundInfo 
              roundInfo={roundInfo}
              carryOverBalance={carryOverBalance}
              ticketPrice={ticketPrice}
            />

            {/* Buy Ticket Section */}
            {isConnected ? (
              <div className="glass rounded-2xl p-8 card-shadow">
                <h2 className="text-3xl font-bold mb-6 text-slate-900">
                  {isRoundActive ? '🎫 Select Your Numbers' : '⏳ Round Inactive'}
                </h2>
                {!isRoundActive && roundInfo && (
                  <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-900">
                    <p><strong>Status:</strong> {roundInfo.isDrawn ? 'Round drawn' : 'Round ended'}</p>
                    {roundInfo.endTime && <p><strong>Ends:</strong> {new Date(Number(roundInfo.endTime) * 1000).toLocaleString()}</p>}
                  </div>
                )}
                <NumberPicker 
                  onNumbersChange={setSelectedNumbers}
                  disabled={isPending || !isRoundActive}
                />
                <button
                  onClick={handleBuyTicket}
                  disabled={isPending || selectedNumbers.length !== 7 || !isRoundActive}
                  className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-500 disabled:to-slate-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
                >
                  {isPending 
                    ? '⏳ Processing...' 
                    : `🎫 Buy Ticket (${ticketPrice ? formatEther(ticketPrice) : '0'} ETH)`
                  }
                </button>
                {selectedNumbers.length !== 7 && (
                  <p className="text-center text-sm text-slate-500 mt-3">
                    Select 7 numbers to continue
                  </p>
                )}
              </div>
            ) : (
              <div className="glass rounded-2xl p-16 text-center card-shadow">
                <span className="text-8xl mb-6 block">🔒</span>
                <h3 className="text-3xl font-bold text-slate-900 mb-3">Connect Your Wallet</h3>
                <p className="text-slate-600 mb-8 text-lg">
                  Connect your wallet to participate in the lottery
                </p>
                <ConnectButton />
              </div>
            )}

            {/* My Tickets */}
            {isConnected && (
              <MyTickets 
                roundId={roundInfo?.roundId}
                isDrawn={roundInfo?.isDrawn || false}
              />
            )}
          </div>

          {/* Right Column - Prize Tiers & Info */}
          <div className="space-y-8">
            <PrizeTiers 
              prizeTiers={prizeTiers}
              prizePool={roundInfo?.prizePool}
            />

            {/* How to Play */}
            <div className="glass rounded-2xl p-8 card-shadow">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">📖 How to Play</h3>
              <ol className="space-y-4 text-sm text-slate-700">
                <li className="flex gap-3">
                  <span className="font-bold text-indigo-600 text-lg">①</span>
                  <span className="leading-relaxed">Select 7 numbers from 1-49 (or use Quick Pick)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-purple-600 text-lg">②</span>
                  <span className="leading-relaxed">Buy your ticket and wait for the draw</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-pink-600 text-lg">③</span>
                  <span className="leading-relaxed">Numbers must match <strong>sequentially from position 1</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-rose-600 text-lg">④</span>
                  <span className="leading-relaxed">Win prizes based on consecutive matches!</span>
                </li>
              </ol>
            </div>

            {/* Revenue Split */}
            <div className="glass rounded-2xl p-8 card-shadow border border-purple-500/20">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">💰 Revenue Split</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                  <span className="font-semibold text-slate-700">Prize Pool</span>
                  <span className="font-bold text-emerald-600 text-lg">90%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="font-semibold text-slate-700">Owner Fee</span>
                  <span className="font-bold text-blue-600 text-lg">10%</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-300">
                <p className="text-xs text-slate-600">
                  ✨ Unclaimed prizes automatically carry over to the next round!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gradient-to-r from-white to-purple-50 border-t border-purple-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-gray-900 font-bold mb-3">About</h4>
              <p className="text-gray-600 text-sm">Professional sequential lottery on blockchain with transparent odds and fair prize distribution.</p>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">Contract</a></li>
                <li><a href="#" className="hover:text-purple-600 transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-3">Play Responsibly</h4>
              <p className="text-gray-600 text-sm">Always gamble within your means. This is entertainment, not a way to make money.</p>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 Sequential Lottery. Built on blockchain. Play responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
