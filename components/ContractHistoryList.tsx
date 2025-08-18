import React from 'react';
import { ContractRecord } from '../types';
import { IconButton } from './IconButton';

interface ContractHistoryListProps {
  contractHistory: ContractRecord[];
  onClear: () => void;
  onView: (contract: ContractRecord) => void;
}

export const ContractHistoryList: React.FC<ContractHistoryListProps> = ({ contractHistory, onClear, onView }) => {
  if (contractHistory.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-[--surface-container] rounded-2xl shadow-[var(--elevation-1)]">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium text-[--on-surface-variant]">Contract History</h2>
            <IconButton onClick={onClear} aria-label="Clear contract history">
                <span className="material-symbols-outlined">delete_sweep</span>
            </IconButton>
        </div>
        <ul className="max-h-64 overflow-y-auto space-y-3 pr-2">
            {contractHistory.map((item, index) => (
                <li 
                    key={item.id} 
                    className="flex justify-between items-center p-4 bg-[--surface] dark:bg-[--surface-dark] rounded-lg history-item-enter cursor-pointer hover:bg-[--surface-variant] transition-colors"
                    style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
                    onClick={() => onView(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onView(item)}
                    aria-label={`View contract for ${item.customerName}`}
                >
                    <div>
                        <p className="font-medium text-[--on-surface]">{item.customerName}</p>
                        <p className="text-sm text-[--on-surface-variant]">
                            {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                    </div>
                    <p className="text-xl font-bold text-[--primary]">₹{item.totalFare.toFixed(2)}</p>
                </li>
            ))}
        </ul>
    </div>
  );
};
