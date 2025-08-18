import React from 'react';
import { FareRecord } from '../types';
import { IconButton } from './IconButton';

interface HistoryListProps {
  history: FareRecord[];
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-[--surface-container] rounded-2xl shadow-[var(--elevation-1)]">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium text-[--on-surface-variant]">History</h2>
            <IconButton onClick={onClear} aria-label="Clear history">
                <span className="material-symbols-outlined">delete_sweep</span>
            </IconButton>
        </div>
        <ul className="max-h-64 overflow-y-auto space-y-3 pr-2">
            {history.map((item, index) => (
                <li 
                    key={item.id} 
                    className="flex justify-between items-center p-4 bg-[--surface] dark:bg-[--surface-dark] rounded-lg history-item-enter"
                    style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                >
                    <div>
                        <p className="font-medium text-[--on-surface]">{new Date(item.timestamp).toLocaleString()}</p>
                        <p className="text-sm text-[--on-surface-variant]">
                            {item.distance}km, {item.duration}min
                        </p>
                    </div>
                    <p className="text-xl font-bold text-[--primary]">₹{item.total.toFixed(2)}</p>
                </li>
            ))}
        </ul>
    </div>
  );
};