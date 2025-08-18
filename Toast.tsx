
import React from 'react';
import { ToastState } from '../types';

export const Toast: React.FC<ToastState> = ({ message, type, visible }) => {
  const bgColor = type === 'success' ? 'bg-[--success]' : 'bg-[--error]';
  const textColor = type === 'success' ? 'text-[--on-success]' : 'text-[--on-error]';
  const icon = type === 'success' ? 'check_circle' : 'error';

  return (
    <div
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full shadow-lg transition-transform duration-300 ease-[var(--md-sys-transition-easing)] ${bgColor} ${textColor} ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <p className="font-medium">{message}</p>
    </div>
  );
};
