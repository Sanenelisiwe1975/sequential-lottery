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
      newNumbers = selectedNumbers.filter(n => n !== num);
    } else {
      if (selectedNumbers.length < 7) {
        newNumbers = [...selectedNumbers, num];
      } else {
        return;
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
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
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
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-gray-900 text-lg font-bold mb-4">Selected Numbers</h3>
        <div className="flex gap-3 min-h-[70px] items-center flex-wrap">
          {selectedNumbers.length === 0 ? (
            <p className="text-gray-500">Select 7 numbers from 1-49</p>
          ) : (
            selectedNumbers.map((num, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
              >
                {num}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-gray-900 rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  {idx + 1}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 text-lg font-semibold text-gray-700">
          {selectedNumbers.length}/7 numbers selected
        </div>
      </div>

      {/* Quick pick and clear buttons */}
      <div className="flex gap-3">
        <button
          onClick={quickPick}
          disabled={disabled}
          type="button"
          className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg shadow-md"
        >
          Quick Pick
        </button>
        <button
          onClick={clear}
          disabled={disabled || selectedNumbers.length === 0}
          type="button"
          className="flex-1 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg shadow-md"
        >
          Clear
        </button>
      </div>

      {/* Number grid */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-gray-900 font-bold mb-4">Choose Numbers (1-49)</h3>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => {
            const isSelected = selectedNumbers.includes(num);
            const position = selectedNumbers.indexOf(num);
            
            return (
              <button
                key={num}
                onClick={() => !disabled && toggleNumber(num)}
                type="button"
                disabled={disabled}
                style={{
                  backgroundColor: isSelected ? '#4f46e5' : '#e2e8f0',
                  color: isSelected ? 'white' : '#374151',
                  opacity: disabled ? 0.5 : 1,
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  pointerEvents: 'auto'
                }}
                className="relative aspect-square rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all"
              >
                {num}
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#fbbf24',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {position + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper text */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
        <p className="text-sm text-blue-800">
          Numbers must match sequentially from position 1 to win. The order you select matters!
        </p>
      </div>
    </div>
  );
}
