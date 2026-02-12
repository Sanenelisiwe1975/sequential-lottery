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
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg">
        <h3 className="text-white text-lg font-semibold mb-3">Selected Numbers</h3>
        <div className="flex gap-2 min-h-[60px] items-center flex-wrap">
          {selectedNumbers.length === 0 ? (
            <p className="text-white/70">Select 7 numbers from 1-49</p>
          ) : (
            selectedNumbers.map((num, idx) => (
              <div
                key={idx}
                className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-xl font-bold text-indigo-600 shadow-md"
              >
                {num}
              </div>
            ))
          )}
        </div>
        <div className="mt-3 text-white/80 text-sm">
          {selectedNumbers.length}/7 numbers selected
        </div>
      </div>

      {/* Quick pick and clear buttons */}
      <div className="flex gap-2">
        <button
          onClick={quickPick}
          disabled={disabled}
          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          🎲 Quick Pick
        </button>
        <button
          onClick={clear}
          disabled={disabled || selectedNumbers.length === 0}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Number grid */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedNumbers.includes(num);
            const position = selectedNumbers.indexOf(num);
            
            return (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                disabled={disabled}
                className={`
                  relative aspect-square rounded-lg font-semibold text-sm transition-all
                  ${isSelected 
                    ? 'bg-indigo-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                  ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
              >
                {num}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-xs text-indigo-900 rounded-full flex items-center justify-center font-bold">
                    {position + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Numbers must match sequentially from position 1 to win. 
          The order you select matters!
        </p>
      </div>
    </div>
  );
}
