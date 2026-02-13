'use client';

import { useState } from 'react';

interface NumberPickerProps {
  onNumbersChange: (numbers: number[]) => void;
  disabled?: boolean;
}

export default function NumberPicker({ onNumbersChange, disabled }: NumberPickerProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const toggleNumber = (num: number) => {
    if (disabled) return;

    let newNumbers: number[];
    
    if (selectedNumbers.includes(num)) {
      // Remove number
      newNumbers = selectedNumbers.filter(n => n !== num);
    } else {
      // Add number (max 7)
      if (selectedNumbers.length < 7) {
        newNumbers = [...selectedNumbers, num];
      } else {
        return; // Already have 7 numbers
      }
    }
    
    setSelectedNumbers(newNumbers);
    onNumbersChange(newNumbers);
  };

  const quickPick = () => {
    if (disabled) return;

    const numbers: number[] = [];
    while (numbers.length < 7) {
      const num = Math.floor(Math.random() * 49) + 1;
      numbers.push(num);
    }
    setSelectedNumbers(numbers);
    onNumbersChange(numbers);
  };

  const clear = () => {
    if (disabled) return;
    setSelectedNumbers([]);
    onNumbersChange([]);
  };

  return (
    <div className="space-y-4">
      {/* Selected numbers display */}
      <div className="glass rounded-xl p-6 border border-indigo-200/50">
        <h3 className="text-slate-900 text-lg font-bold mb-4">📍 Selected Numbers</h3>
        <div className="flex gap-3 min-h-[70px] items-center flex-wrap">
          {selectedNumbers.length === 0 ? (
            <p className="text-slate-500">Select 7 numbers from 1-49</p>
          ) : (
            selectedNumbers.map((num, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg ring-2 ring-indigo-300"
              >
                {num}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {idx + 1}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 text-lg font-semibold text-slate-700">
          {selectedNumbers.length}/7 numbers selected
        </div>
      </div>

      {/* Quick pick and clear buttons */}
      <div className="flex gap-3">
        <button
          onClick={quickPick}
          disabled={disabled}
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
        >
          🎲 Quick Pick
        </button>
        <button
          onClick={clear}
          disabled={disabled || selectedNumbers.length === 0}
          className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Number grid */}
      <div className="glass rounded-xl p-6 border border-indigo-200/50">
        <h3 className="text-slate-900 font-bold mb-4">Choose Numbers (1-49)</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedNumbers.includes(num);
            const position = selectedNumbers.indexOf(num);
            
            const buttonClass = isSelected 
              ? 'bg-indigo-600 text-white shadow-lg scale-110 ring-2 ring-indigo-400' 
              : 'bg-slate-200 text-slate-700 shadow-sm hover:bg-slate-300 hover:shadow-md';
            
            const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
            
            return (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={disabled}
                type="button"
                className={`relative aspect-square rounded-lg font-bold text-sm transition-all duration-200 ${buttonClass} ${disabledClass}`}
              >
                {num}
                {isSelected && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-xs text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {position + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <div className="glass rounded-xl p-4 border-l-4 border-indigo-500">
        <p className="text-sm text-slate-700">
          💡 <strong>How it works:</strong> Numbers must match sequentially from position 1 to win. The order you select matters!
        </p>
      </div>
    </div>
  );
}
